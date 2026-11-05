/**
 *	This script library is for KM Attachment index functionality
 **/

var attachment_index_fields = {};
var knowledgebase_list = {};
var CONSTANT = lib.KMAttachment_Constant;
var _ = lib.Underscore.require();
var kmIDOLUtils = lib.KMIDOLUtils.require();
var kmFieldMapping = lib.IDOLKMFieldMapping.require();
var idolCommon = lib.IDOLCommon.require();
var KMQuery_IDOL = lib.KMQuery_IDOL.require();
var indexedCount = 0;
var availCount = 0;
var tokenCount = 0;
var logger = getLog('KMAttachment_Index');

/*
 *	index attachment main function.
 *	This function should be called by KMAttachment scheduler and will query kmattachmentupdates table
 */
function doIndex() {
    indexedCount = 0;
    availCount = getAvailIndexCount();
    logger.info("start to handle kmattachmentupdates, available token count:" + availCount);
    var attachment_indexed = {};
    var kmattachUpdate = lib.KMAttachmentUpdatesDAO.getAll();
    var kmattachBeforeUpdate = new SCFile("kmattachmentbeforeupdate");
    var recordcount = 0;

    if (kmattachUpdate) {

        clearCache();
        var finishStatus = lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED();

        do {
            var documentId = kmattachUpdate.docid;
            var kbname = kmattachUpdate.collectionname;
            var dbname = kmattachUpdate.dbname;
            var knowledgeBase = getKnowledgeBase(kbname);
            // var isReIndex = attachment_indexed[kbname];
            //if (isReIndex == null) {
            //    isReIndex = isFullReIndex(kbname);
            //    attachment_indexed[kbname] = isReIndex;
            // }
            var isReIndex = !kmattachUpdate.isupdate;
            if ((isReIndex && recordcount % 200 == 0) || (!isReIndex && recordcount % 10 == 0)) {
                logger.info("start to index attachment for " + kbname + " tokencount:" + tokenCount + " isreindex:" + isReIndex + " already handle record:" + recordcount);
            }
            if (knowledgeBase && knowledgeBase.indexstatus == finishStatus) {
                var tablename = knowledgeBase['sclibtablename'];
                var document = new SCFile(tablename, SCFILE_READONLY);

                var query = knowledgeBase.docid + '="' + documentId + '"';
                if (knowledgeBase.scquery && _.trim(knowledgeBase.scquery) !== '') {
                    query += ' and (' + knowledgeBase.scquery + ')';
                }
                var result = 0;
                var rc1 = document.doSelect(query);
                if (rc1 === RC_SUCCESS) {
                    result = sendDocumentAttachment(document, knowledgeBase, isReIndex, kbname, dbname, kmattachBeforeUpdate);
                } else if (!isReIndex) {
                    //removeDocumentAttachment(documentId, knowledgeBase,kmattachmentupdate);
                    deleteDocumentAttachment(documentId, knowledgeBase, kmattachBeforeUpdate);
                }

                if (result !== -2) {
                    logger.info("delete all update attachment ");
                    deleteBeforeUpdate(kbname, documentId, kmattachBeforeUpdate);
                    kmattachUpdate.doDelete();
                }
                if (result !== 0) {
                    logger.info("kbname:" + kbname + " docid:" + documentId + " doIndex exit due to sendDocumentAttachment result is not expect:" + result + " with isReIndex:" + isReIndex);
                    return;
                }
            }
            recordcount++;
        } while (kmattachUpdate.getNext() === RC_SUCCESS);
    }

    logger.info("finish KMAttachment_Index for total handle record:" + recordcount + " index attachment:" + indexedCount);
}

function deleteBeforeUpdate(kbname, docid, kmattachBeforeUpdate) {
    kmattachBeforeUpdate.doPurge('docid="' + docid + '" and collectionname="' + kbname + '"');
}

function isFullReIndex(kbname) {
    var scfile = new SCFile('kmreindex', SCFILE_READONLY);
    scfile.setFields(["collectionname"]);
    var rc = scfile.doSelect('collectionname="' + kbname + '"');
    return rc == RC_SUCCESS;
}

function clearCache() {

    attachment_index_fields = {};
    knowledgebase_list = {};
}

/*
 *	Get knowledgebase from the var knowledgebase_list.
 *	If this var doesn't has the knowledgebase, query from database and set it to the var
 *	@param {tablename} - table name of the document(ticket)
 *	@returns {kmknowledgebase} - null(not found)
 */
function getKnowledgeBase(kbname) {
    //get from cache
    var knowledgeBase = knowledgebase_list[kbname];
    if (knowledgeBase) {
        return knowledgeBase;
    }
    //if not found, get from db
    knowledgeBase = new SCFile('kmknowledgebase', SCFILE_READONLY);
    var rc = knowledgeBase.doSelect('kbname="' + kbname + '"');
    if (rc === RC_SUCCESS) {
        //set it to cache
        knowledgebase_list[kbname] = knowledgeBase;
        return knowledgeBase;
    }
    return null;
}


/*
 *	Get filter fields and security fields. Get it from var attachment_index_fields
 *	If this var doesn't has the related fields, retrieve from kmknowledgebase
 *	@param {document} - scfile of the document
 *	@param {knowledgeBase} - scfile of the kmknowledgebase
 *	@returns {array} - field list
 */
function getFilterFieldsValue(knowledgeBase) {
    var result = attachment_index_fields[knowledgeBase['kbname']];
    if (result) {
        return result;
    }

    result = {};

    //set postfix to all kbfields defined.
    var kbfields = knowledgeBase['kbfields'];

    var indexField;

    var i;
    var length = kbfields.length();
    for (i = 0; i < length; i++) {
        var fieldName = kbfields[i]['kbfieldname'];
        var alias = kbfields[i]['kbfieldvalue'];
        if (kbfields[i]['kbfieldtype'] === 'Date') {
            indexField = kmFieldMapping.mappingIDOLDateField(fieldName);
            result[indexField] = {
                field: fieldName,
                type: kbfields[i]['kbfieldtype']
            };
        } else {
            var postfix = kmIDOLUtils.getIndexFieldPostfix(knowledgeBase['kbname'], fieldName);
            var j;
            for (j = 0; j < postfix.length; j++) {
                var arrAlias = alias.split(';');
                var k;
                var len = arrAlias.length;
                for (k = 0; k < len; k++) {
                    if (arrAlias[k]) {
                        indexField = idolCommon.toIDOLFieldName(arrAlias[k]) + postfix[j];
                        result[indexField] = {
                            field: fieldName,
                            type: kbfields[i]['kbfieldtype']
                        };
                    }
                }
            }
        }
    }

    //get all security fields
    var securityFields = lib.IDOLSecurity.require().collectSecurityFields(knowledgeBase['sclibtablename']);
    for (i = 0; i < securityFields.length; i++) {
        var field = securityFields[i];
        indexField = lib.IDOLCommon.require().toIDOLFieldName(field) + '_MATCH';
        result[indexField] = {
            "field": field,
            type: 'String'
        };
    }

    attachment_index_fields[knowledgeBase['kbname']] = result;
    return result;
}

function attachmentAlreadyIndex(uid, fbeforeupdate) {
    var uids = fbeforeupdate.uids.toArray();
    var i;
    for (i = 0; uids && i < uids.length; i++) {
        if (uid == uids[i]) {
            return true;
        }
    }
    return false;
}

/*
 *	send document's file to IDOL SFS
 *	@param {document} - scfile of the document
 *	@param {knowledgeBase} - scfile of the kmknowledgebase
 */
function sendDocumentAttachment(document, knowledgeBase, isFullIndex, kbname, dbname, kmattachmentbeforeupdate) {
    var attachments = document.getAttachments();
    var hasbeforeupdate = false;
    if (!isFullIndex) {
        var rc2 = kmattachmentbeforeupdate.doSelect('collectionname="' + kbname + '" and docid="' + document[knowledgeBase['docid']] + '"');
        if (rc2 == RC_SUCCESS) {
            hasbeforeupdate = true;
        }
    }
    if (!isFullIndex && hasbeforeupdate) {
        //var idolUids = getDocAttachmentID(knowledgeBase['sclibtablename'], document[knowledgeBase['docid']],kbname);
        //removeDeletedAttachment(attachments, idolUids,dbname);
        //logger.info("call findAndDeleteAttachment");
        findAndDeleteAttachment(attachments, kmattachmentbeforeupdate, dbname, knowledgeBase, document);

    }

    var allSkip = true;
    var i;
    for (i = 0; i < attachments.length; i++) {
        if (checkFileExt(knowledgeBase, attachments[i])) {
            allSkip = false;
        }
    }

    if (allSkip) {
        return 0;
    }

    if (attachments.length === 0) {
        return 0;
    }
    if (indexedCount >= availCount) {
        return -1;
    }
    var metadata = getFilterFieldsValue(knowledgeBase);
    var metadataValue = getMetaValue(document, metadata, knowledgeBase);

    for (i = 0; i < attachments.length; i++) {
        var isContinue = true;
        if (checkFileExt(knowledgeBase, attachments[i])) {
            try {
                //if incremental index, no need to index again if it is already indexed
                if (!isFullIndex && hasbeforeupdate) {
                    //isContinue = idolUids[attachments[i].href] == null;
                    isContinue = !attachmentAlreadyIndex(attachments[i].href, kmattachmentbeforeupdate);
                    logger.info("isContinue :" + isContinue + " for " + attachments[i].name);
                }

                if (isContinue) {
                    var xmlstring = toCFSXML(metadataValue, document, knowledgeBase, attachments[i], dbname);
                    logger.debug('sending attachment ' + attachments[i].name + ' of ' + document[knowledgeBase['docid']]);
                    //xmlstring = encodeURIComponent(xmlstring);
                    var result = lib.IDOLServiceCFS.require().indexFile(xmlstring);
                    var xml = new XML();
                    xml.setContent(result);
                    var xQuery = lib.XQuery.require();
                    var token = xQuery.queryText('responsedata/token', xml);
                    lib.KMAttachmentTokenDAO.create(document[knowledgeBase['docid']], knowledgeBase['kbname'], attachments[i].href, attachments[i].name, token);
                    indexedCount++;
                    if (indexedCount >= availCount && attachments.length === i + 1) {
                        return -1; //all attachments of current file are indexed
                    } else if (indexedCount >= availCount && attachments.length > i + 1) {
                        return -2; //partial are indexed
                    }
                }
            } catch (ex) {
                logError(document, knowledgeBase, attachments[i], ex);
            }
        }
    }
    return 0;
}

function deleteDocumentAttachment(documentId, knowledgeBase, fbeforeupdate) {
    var rc = fbeforeupdate.doSelect('docid="' + documentId + '" and collectionname="' + knowledgeBase.kbname + '"');
    if (rc == RC_SUCCESS && fbeforeupdate.uids != null && fbeforeupdate.names != null) {
        var docIds = [];
        var idolUids = fbeforeupdate.uids.toArray();
        var names = fbeforeupdate.names.toArray();

        var j;
        for (j = 0; j < idolUids.length; j++) {
            if (!names[j]) {
                continue;
            }
            //sm bug workaround
            var attachLink;
            var attachUID = idolUids[j].replace(/^.*:/, '');
            var pos = names[j].indexOf(".UNSAFE");
            if (pos == (names[j].length - 7)) //unsafe remove
            {
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
                docIds.push(encodeURIComponent(attachLink));

                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j].substring(0, pos) + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
                docIds.push(encodeURIComponent(attachLink));
            } else //append unsafe
            {
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
                docIds.push(encodeURIComponent(attachLink));
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + '.UNSAFE:' + knowledgeBase['sclibtablename'] + ':' + documentId);
                docIds.push(encodeURIComponent(attachLink));
            }
        }
        removeAttachment(docIds, knowledgeBase.kbname);
    }
}
//
// var attachUID  = attachment.href.replace(/^.*:/,'');
// var attachLink = encodeURIComponent('scattach://' + attachUID + ':' + attachment.name + ':' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);
//to do , change the id to reference id
function removeDocumentAttachment(documentId, knowledgeBase) {
    //var idolUids = getDocAttachmentID(knowledgeBase['sclibtablename'], documentId, knowledgeBase.kbname);
    var f = new SCFile("kmattachmentbeforeupdate", SCFILE_READONLY);
    var rc = f.doSelect('collectionname="' + knowledgeBase.kbname + '" and docid="' + documentId + '"');
    if (rc != RC_SUCCESS || f.uids == null || f.names == null) {
        return;
    }
    var docIds = [];
    var idolUids = f.uids.toArray();
    var names = f.names.toArray();

    var j;
    for (j = 0; j < idolUids.length; j++) {
        var attachUID = idolUids[j].replace(/^.*:/, '');
        var attachLink;
        if (names[j] && names[j].indexOf(".UNSAFE") == names[j].length - 7) {
            attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
            docIds.push(encodeURIComponent(attachLink));
            attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j].substring(0, names[j].length - 7) + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
            docIds.push(encodeURIComponent(attachLink));
        } else {
            attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + ':' + knowledgeBase['sclibtablename'] + ':' + documentId);
            docIds.push(encodeURIComponent(attachLink));
            attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[j] + '.UNSAFE:' + knowledgeBase['sclibtablename'] + ':' + documentId);
            docIds.push(encodeURIComponent(attachLink));
        }
    }
    removeAttachment(docIds, knowledgeBase.kbname);
}

function findAndDeleteAttachment(attachments, fbeforeupdate, dbname, knowledgeBase, document) {
    //all in beforeudpate, but can't find in attachment will be delete
    var delIds = [];
    var uids = fbeforeupdate.uids.toArray();
    var names = fbeforeupdate.names.toArray();
    var i;
    for (i = 0; i < uids.length; i++) {
        //logger.info("beforeupdate uid:"+ uids[i]);
        var found = false;
        var j;
        for (j = 0; j < attachments.length; j++) {
            //logger.info("attachments[j].href:"+attachments[j].href);
            if (attachments[j].href === uids[i]) {
                found = true;
                break;
            }
        }
        if (!found) {
            var attachLink;
            var attachUID = uids[i].replace(/^.*:/, '');
            if (names[i] && names[i].indexOf(".UNSAFE") == names[i].length - 7) //unsafe remove
            {
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[i] + ':' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);
                delIds.push(encodeURIComponent(attachLink));
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[i].substring(0, names[i].length - 7) + ':' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);
                delIds.push(encodeURIComponent(attachLink));
            } else //appended
            {
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[i] + ':' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);
                delIds.push(encodeURIComponent(attachLink));
                attachLink = encodeURIComponent('scattach://' + attachUID + ':' + names[i] + '.UNSAFE:' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);
                delIds.push(encodeURIComponent(attachLink));
            }
        }
    }
    logger.info("found need delete uid:" + delIds);
    return removeAttachment(delIds, dbname);
}


function removeAttachment(docIds, dbname) {
    if (docIds && docIds.length > 0) {
        var strIds = docIds.join('+');
        var params = {
            Docs: strIds,
            DREDbName: dbname
        };
        var IDOLKMIndexService = lib.IDOLKMIndexService.require();
        return IDOLKMIndexService.deleteAttachment(params);
    }
    return 0;
}

function getMetaValue(document, metadata, knowledgeBase) {
    var result = {};
    var filename = knowledgeBase['sclibtablename'];

    var value;
    var obj;
    for (obj in metadata) {
        var indexField = obj;
        var smField = metadata[obj].field;
        var type = metadata[obj].type;
        value = document[smField];
        if (value != null) {
            if (filename === 'kmdocument' && (smField === 'guids' || smField === 'groups')) {
                continue;
            }

            if (type === 'Date') {
                if (smField == 'sysmodtime') {
                    if (value) {
                        value = KMQuery_IDOL.getEpochSeconds(value);
                    } else {
                        value = KMQuery_IDOL.getEpochSeconds(new Date());
                    }
                    result['ZYZMODTIME_DATE'] = value;
                } else {
                    value = lib.KMUtils.kmIDOLDateFormat(value);
                }
            } else if (type == "Rich Text") {
                value = system.library.KMCollection_Update_Utils.processRichText(value);
            }
            if (system.library.KMUtils.isSCArray(value)) {
                value = system.library.KMUtils.scArrayToString(value);
            }
            result[indexField] = value;
        }
    }


    if (filename === 'kmdocument') {
        var categoryValue = lib.KMQuery_IDOL.require().getCategoryString(knowledgeBase, document);
        result['CATEGORY'] = categoryValue;

        value = lib.KMQuery_IDOL.require().getKMSearchCategoryArray(knowledgeBase, document);
        result['KMSEARCHCATEGORY'] = value;
        //for SRC
        result = setFieldsForSRC(value, document['id'], document, result);
        result['DOCTYPE'] = document['doctype'];
        result['ID'] = document['id'];
        result['KMSTATUS'] = document['status'];
    }

    return result;
}


function setFieldsForSRC(catArray, docId, document, resultObj) {
    //for SRC usage
    var guidstr = lib.KMDocumentAttachment.getGUIDs(docId);
    resultObj['GUIDS'] = guidstr;

    var groupstr = "";
    var groups = [];
    var numcats = catArray.length;

    var grp;
    for (grp = 0; grp < numcats; grp++) {
        groups = lib.Knowledge_Library_kmcategoryidxscript.getGroupsforCategory(groups, catArray[grp]);
    }

    var i;
    for (i = 0; i < groups.length; i++) {
        if (groups[i] != null && groups[i] != "") {
            groupstr += groups[i] + ",";
        }
    }

    if (groupstr != "") {
        groupstr = groupstr.substr(0, groupstr.length - 1);
    }

    resultObj['GROUPS'] = groupstr;

    return resultObj;
}


function logError(document, knowledgeBase, attachment, message) {
    var tmpSedocid = knowledgeBase['sclibtablename'] + "_" + document[knowledgeBase['docid']];
    var errStr = funcs.scmsg('1108', 'km', [attachment.name, message]);
    lib.KMCollection_Update_Utils.createKnowledgebaseerror(knowledgeBase['kbname'], tmpSedocid, errStr);
}

/*
 *	Convert to CFS xml
 <adds>
 <add>
 <document>
 <reference>IM10008-1</reference>
 <xmlmetadata>
 <table>probsummary</table>
 <DocumentId>IM10008</DocumentId>
 <SMuid>54bf14d2000880958074a770</SMuid>
 <filename>delay_id.txt</filename>
 <SECURITYCOMPANY>advantage</SECURITYCOMPANY>
 <status>open</status>
 <DREDBNAME>incidents</DREDBNAME>
 </xmlmetadata>
 </document>
 <source content="***" />
 </add>
 </adds>
 *	@param {securityMeta} - meta data info define by filter & security properties
 *	@param {document} - scfile of the document
 *	@param {knowledgeBase} - scfile of the kmknowledgebase
 *	@param {attachment} - attachment object
 */
function toCFSXML(securityMeta, document, knowledgeBase, attachment, dbname) {
    var documentNode = new XML();
    documentNode.setContent('<document/>');

    var attachUID = attachment.href.replace(/^.*:/, '');
    var attachLink = encodeURIComponent('scattach://' + attachUID + ':' + attachment.name + ':' + knowledgeBase['sclibtablename'] + ':' + document[knowledgeBase['docid']]);

    appendNode(documentNode, CONSTANT.METADATA_LINK(), attachLink);

    var metaNode = documentNode.createNode(1, 'xmlmetadata');
    createMetadataNode(metaNode, securityMeta, document, knowledgeBase, attachment, dbname);
    documentNode.appendNode(metaNode);

    //because RTE generates CDATA node incorrectly, replace ']]&gt;' to ']]>'
    //Communicate > Lync-PC Based communication; was incorrectly transferred to 
    //Communicate&gt;Lync-PC Based communication;
    var xmlString = documentNode.toXMLString().replace(/&gt;/g, '>');

    var xmlArray = ['<adds>', '<add>', xmlString, '<source content="', null, '" />', '</add>', '</adds>'];
    xmlArray[4] = base64Encode(attachment.value);

    var xmlstring = xmlArray.join('');
    return xmlstring;
}


/*
 *	Create metadata node in CFS xml
 */
function createMetadataNode(parentXML, securityMeta, document, knowledgeBase, attachment, dbname) {
    var xml = parentXML;
    //basic meta data
    appendNode(xml, CONSTANT.METADATA_TABLE(), knowledgeBase['sclibtablename']); //table name
    appendNode(xml, CONSTANT.METADATA_DOCUMENTID(), document[knowledgeBase['docid']]); //id
    appendNode(xml, CONSTANT.METADATA_UUID(), attachment.href); //attachment UUID
    appendNode(xml, CONSTANT.METADATA_FILENAME(), attachment.name); //attachment file name
    appendNode(xml, CONSTANT.METADATA_DREDBNAME(), dbname); //database name in idol
    appendNode(xml, CONSTANT.METADATA_KMBASENAME(), knowledgeBase['kbname']); //kmknowledgebase name
    appendNode(xml, CONSTANT.METADATA_KMBASENAMEMATCH(), knowledgeBase['kbname']); //kmknowledgebase name

    // append expire time
    var dt = new Date();
    var expire = vars['$G.km.globalenv']['km.expiration.period'] || 365;
    dt.setDate(dt.getDate() + expire);
    var expiration_date = lib.KMUtils.kmIDOLDateFormat(dt);
    appendNode(xml, CONSTANT.METADATA_VALIDTIME(), expiration_date); //expiration time

    var doc_link = 'scactivelink://' + knowledgeBase['sclibtablename'] + ':' + knowledgeBase['docid'] + '=&quot;' + document[knowledgeBase['docid']] + '&quot;&nbsp;and&nbsp;kbname=&quot;' + knowledgeBase['kbname'] + '&quot;';
    doc_link = encodeURIComponent(doc_link);
    appendNode(xml, CONSTANT.METADATA_DOCLINK(), doc_link); //document link

    var doc_query = knowledgeBase['docid'] + '="' + document[knowledgeBase['docid']] + '"';
    appendNode(xml, CONSTANT.METADATA_QUERY(), doc_query); //document link

    //security mata data
    var obj;
    for (obj in securityMeta) {
        var field = obj;
        var value = securityMeta[field];
        if (obj !== 'KMSEARCHCATEGORY') {
            appendNode(xml, field, value);
        } else {
            var i;
            for (i = 0; i < value.length; i++) {
                appendNode(xml, field, value[i]);
                /** 
                  To Fix Defect: QCCR1E148552
                  The XML sent to CFS server already include security control content in it. For example like below:  <KMSEARCHCATEGORY>KM01CAT</KMSEARCHCATEGORY>
                  but when perform query , the query fieldText parameter try to match result by 'KMSEARCHCATEGORY_MATCH', 
                  so add duplicate xml element here with same value.
 
                    <adds><add><document><REFERENCE>scattach%3A%2F%2F5b4ecf9d0019903880007998%3Aemail.txt%3Akmdocument%3AKM0626</REFERENCE>
                    <xmlmetadata><SEFILENAME>kmdocument</SEFILENAME><DOCUMENTID>KM0626</DOCUMENTID><SMUUID>cid:5b4ecf9d0019903880007998</SMUUID>
                    <DRETITLE>email.txt</DRETITLE><DREDBNAME>Knowledge_Library</DREDBNAME><KNOWLEDGEBASE_NAME>Knowledge_Library</KNOWLEDGEBASE_NAME>
                    <KNOWLEDGEBASE_NAME_MATCH>Knowledge_Library</KNOWLEDGEBASE_NAME_MATCH><VALID_TIME>2019/07/18 13:30:48</VALID_TIME>
                    <DOCUMENTLINK>scactivelink%3A%2F%2Fkmdocument%3Aid%3D%26quot%3BKM0626%26quot%3B%26nbsp%3Band%26nbsp%3Bkbname%3D%26quot%3BKnowledge_Library%26quot%3B
                    </DOCUMENTLINK><SEQUERY>id=\"KM0626\"</SEQUERY><TITLE_WEIGHT16>Availability Plan for Email Service</TITLE_WEIGHT16><REFERENCE_WEIGHT8> 
                     Please see attached document for the details of the agreed Availability Plan.   Availability Plan     
                    </REFERENCE_WEIGHT8><CREATION_DATE>2016/07/12 03:00:08</CREATION_DATE><AUTHOR_INDEX>falcon</AUTHOR_INDEX><STATUS_MATCH>external</STATUS_MATCH>
                    <KMSTATUS_MATCH>external</KMSTATUS_MATCH><DOCTYPE_MATCH>reference</DOCTYPE_MATCH><DOCTYPE_WEIGHT2>reference</DOCTYPE_WEIGHT2>
                    <SUMMARY_WEIGHT4>This document describes the availability plan for all email services</SUMMARY_WEIGHT4><HOTNEWS_MATCH>false</HOTNEWS_MATCH><ID_WEIGHT16>KM0626
                    </ID_WEIGHT16><LOCALE_MATCH>en</LOCALE_MATCH><LOGICALNAME_MATCH>CI1001032 CI1001033 CI1001034 CI1001035 CI1001036 CI1001037 </LOGICALNAME_MATCH><LOGICALNAME_INDEX>
                    CI1001032 CI1001033 CI1001034 CI1001035 CI1001036 CI1001037 </LOGICALNAME_INDEX><CATEGORY_MATCH>reference</CATEGORY_MATCH><CATEGORYSTR_MATCH>reference
                    </CATEGORYSTR_MATCH><TAGS_INDEX> </TAGS_INDEX><SYSMODTIME_DATE>1531891612e</SYSMODTIME_DATE><CATEGORY>Service Manager;</CATEGORY><KMSEARCHCATEGORY>KM01CAT
                    </KMSEARCHCATEGORY><GUIDS>5783ef3b0012a10c80a97948,application/octet-stream;5b4ecf9d0019903880007998,text/plain</GUIDS><GROUPS>KMG02,KMG03,KMG04,KMG011,KMG012,KMG01
                    </GROUPS><DOCTYPE>reference</DOCTYPE><ID>KM0626</ID><KMSTATUS>external</KMSTATUS></xmlmetadata></document><source content=\"aG93IHRvIHNvbHZlIGVtYWlsIHByb2JsZW0NCg==\" />
                    </add></adds> 
                 **/
                appendNode(xml, field + "_MATCH", value[i]);
            }
        }
    }
}


/*
 *	Append node to xml
 */
function appendNode(xml, name, value, isCDATA) {
    var node = xml.createNode(1, name);
    if (isCDATA) {
        var cdataNode = xml.createNode(4, '', value);
        node.appendNode(cdataNode);
    } else {
        node.setValue(value);
    }

    xml.appendNode(node);
}


/*
 *	check file extension defined in kmknowledgebase
 */
function checkFileExt(knowledgeBase, attachment) {
    var filename = attachment.name;
    var ext = filename.substr(filename.lastIndexOf(".") + 1);
    if (ext) {
        ext = ext.toLowerCase();
    }
    var blackList = knowledgeBase.skipexts;

    if (blackList) {
        var blackArray = blackList.split(';');
        var i;
        for (i = 0; i < blackArray.length; i++) {
            if (ext.toLowerCase() === blackArray[i].toLowerCase()) {
                return false;
            }
        }
    }

    return true;
}


function getAvailIndexCount() {
    tokenCount = lib.KMAttachmentTokenDAO.getCount();
    return CONSTANT.MAX_FINISHED_TOKEN_COUNT() - tokenCount;
}