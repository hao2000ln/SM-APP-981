/**  @fileoverview KMDocument_Index_IDOL
 *   @author Yang,Chun-Fu
 */
var _ = lib.Underscore.require();
var IDOLKMIndexService = lib.IDOLKMIndexService.require();
var KMIDOLLanguageMap = lib.KMIDOLLanguageMap.require();
var KMIDOLUtils = lib.KMIDOLUtils.require();
var IDOLCommon = lib.IDOLCommon.require();
var IDOLDataCleansing = lib.IDOLDataCleansing.require();
var KMQuery_IDOL = lib.KMQuery_IDOL.require();

var SRC_FIELDS = {
    "category": 1,
    "doctype": 1,
    "sysmodtime_date": 1,
    "id": 1,
    "kmstatus": 1,
    "kmsearchcategory": 1,
    "guids": 1
};

var KMDocument_Index_IDOL = (function() {
    var REF_PREFIX = '_DN_';

    function setDocumentFieldValue(strField, fieldValue, indexDoc, indexWeight, dataType, match) {
        var srcPrintFieldName = null;

        if (match) {
            indexDoc = setDocumentRawField(strField + '_MATCH', fieldValue, indexDoc);
        }

        if (SRC_FIELDS[strField]) {
            srcPrintFieldName = strField;
        }

        if (dataType == 'Date' && indexWeight >= 0 && KMIDOLUtils.getFieldPostfix(indexWeight)) {
            indexDoc = setDocumentRawField(strField, fieldValue, indexDoc);
        }

        strField += KMIDOLUtils.getFieldPostfix(indexWeight);

        indexDoc = setDocumentRawField(strField, fieldValue, indexDoc);

        if (srcPrintFieldName && srcPrintFieldName !== strField) {
            indexDoc = setDocumentRawField(srcPrintFieldName, fieldValue, indexDoc);
        }

        return indexDoc;
    }

    function setDocumentRawField(strField, varFieldValue, indexDoc) {
        if (strField == "kmstatus") {
            //sort field. add match field for sort performance
            indexDoc = setDocumentRawField(strField + '_MATCH', varFieldValue, indexDoc);
        }

        varFieldValue += "";
        strField = strField.toUpperCase();
        indexDoc += "#DREFIELD " + strField + "=\"" + varFieldValue.replace(/\]\]>/g, "") + "\"\n";

        return indexDoc;
    }

    function dumpAttachment(strCollectionFile, sclibFile, isReindex) {
        if (strCollectionFile.indexattachments || sclibFile.doctype == "external") {
            var doc_id = sclibFile[strCollectionFile.docid];
            var fAttachments = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
            var rc = fAttachments.doSelect("application=\"" + strCollectionFile.sclibtablename + "\" and topic=\"" + doc_id + "\" and segment=0");

            if (RC_SUCCESS == rc || !isReindex) {
                var kbname = strCollectionFile.kbname;
                lib.KMAttachmentUpdatesDAO.create(doc_id, kbname, kbname);
            }
        }
    }

    function getExpiry() {
        vars['$G.km.globalenv']['km.expiration.period'] = 365;
        var environment = new SCFile("environment", SCFILE_READONLY);
        var rc = environment.doSelect("name=\"knowledge management\"");
        if (rc == RC_SUCCESS) {
            vars['$G.km.globalenv']['km.expiration.period'] = environment["km.expiration.period"];
        }
        return vars['$G.km.globalenv']['km.expiration.period'];
    }

    function addFieldExpireDate(drefield) {
        var dt = new Date();
        var expire = getExpiry();
        if(expire)
        {
          dt.setDate(dt.getDate() + expire);
          var expiration_date = lib.KMUtils.kmIDOLDateFormat(dt);
          drefield += "#DREFIELD VALID_TIME=\"" + expiration_date + "\"\n";
        }
        return drefield;
    }

    function addFieldDREDate(drefield, sysmodtime) {
        drefield += "#DREFIELD DREDATE=\"" + sysmodtime + "\"\n";
        return drefield;
    }


    function indexDocument(kmknowledgebase, sclibFile, isReindex) {
        var indexDBName = kmknowledgebase.kbname;
        var indexFieldSet = KMIDOLUtils.getIndexFieldSet(kmknowledgebase);

        if (vars.$L_currRec % 50 == 0) {
            print(vars.$L_currRec + " documents indexed. ");
        }
        //already dump in trigger
        //dumpAttachment(kmknowledgebase, sclibFile,isReindex);
        var idolDoc = createIndexDoc(kmknowledgebase, sclibFile, indexFieldSet, false);
        idolDoc += "#DREENDDATAREFERENCE\n\n";

        if (isReindex) {
            indexDBName += IDOLKMIndexService.tempDBPostFix();
        }
        return IDOLKMIndexService.addDocument(indexDBName, idolDoc);
    }

    function getGroupString(catarray) {
        var groupstr = "";
        var groups = [];
        var numcats = catarray.length;

        var grp;
        for (grp = 0; grp < numcats; grp++) {
            groups = lib.Knowledge_Library_kmcategoryidxscript.getGroupsforCategory(groups, catarray[grp]);
        }

        var len;
        for (len = 0; len < groups.length; len++) {
            if (groups[len] != null && groups[len] != "") {
                groupstr += groups[len] + ",";
            }
        }
        if (groupstr != "") {
            groupstr = groupstr.substr(0, groupstr.length - 1);
        }

        return groupstr;
    }

    // TODO: use ScriptLibrary -> IDOLIDXDocument instead.
    function createIndexDoc(fKmKnowledgebase, sclibFile, indexFieldSet, replicatedindex) {
        var indexDoc = "";
        var dreref = "#DREREFERENCE ";
        var dretitle = "#DRETITLE ";
        var dreend = "#DREENDDOC" + "\n";
        var foundTitle = false;
        var kbname = fKmKnowledgebase.kbname;
        var doc_id = sclibFile[fKmKnowledgebase.docid];
        var doc_id_fs = lib.KMUtils.cleanDocID(doc_id);
        var sedocid = lib.KMUtils.scToJSName(kbname) + "_" + doc_id_fs + "_0";
        var indexFields = indexFieldSet.indexFields;
        var indexfType = indexFieldSet.indexfType;
        var indexfAlias = indexFieldSet.indexfAlias;
        var indexWeights = indexFieldSet.indexWeights;
        var isMatch = indexFieldSet.isMatch;
        var dataCleansing = indexFieldSet.dataCleansing;
        var securityFields = indexFieldSet.securityFields;
        var kmnonworkflowstatus = 'draft; external; internal; retired';

        var isLanguage = false;

        var categoryStr = lib[fKmKnowledgebase.categoryindexscript].getCategoryStr(sclibFile);
        if (funcs._null(categoryStr)) {
            categoryStr = "";
        }

        var catarray = categoryStr.split(";");
        var numcats = catarray.length;
        var numfields = fKmKnowledgebase.kbfields.length();

        var groupstr = '';
        if (kbname == "Knowledge_Library") {
            //set for SRC
            groupstr = getGroupString(catarray);
            indexDoc = setDocumentRawField("groups", groupstr, indexDoc);
        }

        var sefilename = fKmKnowledgebase.sclibtablename;
        var sequery = sefilename + ":" + fKmKnowledgebase.docid + "=&quot;" + doc_id + "&quot;";
        var doc_link = "scactivelink://" + sequery + "&nbsp;and&nbsp;kbname=&quot;" + kbname + "&quot;";

        indexDoc = setDocumentRawField("sedocid", sedocid, indexDoc);
        indexDoc = setDocumentRawField("sefilename", sefilename, indexDoc);
        indexDoc = setDocumentRawField("sequery", fKmKnowledgebase.docid + "=\"" + doc_id + "\"", indexDoc);

        doc_link = encodeURIComponent(doc_link);
        dreref += doc_link + "\n";

        if (categoryStr.length > 0) {
            var cats;
            for (cats = 0; cats < numcats; cats++) {
                indexDoc = setDocumentRawField('KMSEARCHCATEGORY_MATCH', catarray[cats], indexDoc);
                //for src usage
                indexDoc = setDocumentRawField('KMSEARCHCATEGORY', catarray[cats], indexDoc);
            }
        }

        indexDoc = setDocumentRawField('knowledgebase_name_match', kbname, indexDoc);
        indexDoc = setDocumentRawField('DREDBName', kbname, indexDoc);
        indexDoc = addFieldExpireDate(indexDoc);
        //for hta required
        indexDoc += lib.IDOLModuleConfiguration.buildHTAFields(sclibFile);

        var cleanser = IDOLDataCleansing.getCleanser(sefilename);

        var sysmodtime = null;
        var i;
        for (i = 0; i < numfields; i++) {
            var fieldValue = null;
            if (replicatedindex) {
                fieldValue = sclibFile[i];
            } else {
                fieldValue = sclibFile[indexFields[i]];
            }
            var fieldName = indexFields[i];
            if (fieldName.toUpperCase() === 'HOTNEWS' && fKmKnowledgebase.kbname === 'Knowledge_Library') {
                if (!fieldValue) {
                    fieldValue = 'false';
                }
            }

            //if (!fieldValue) continue;

            var weight = indexWeights[i];
            var match = isMatch[i];

            if (fieldName === 'guids' && fKmKnowledgebase.kbname === 'Knowledge_Library') {
                fieldValue = lib.KMDocumentAttachment.getGUIDs(doc_id);
            }

            if (fieldName === 'category') {
                if (fKmKnowledgebase.kbname === 'Knowledge_Library') {
                    fieldValue = lib.KMCollection_Update_Utils.categoryStrtoName(categoryStr);
                }
            }

            if (indexfType[i] === 'Date') {
                if (fieldName.toUpperCase() == 'SYSMODTIME') {
                    //set as autn:data meta data in idol server configuration file
                    if (fieldValue) {
                        sysmodtime = KMQuery_IDOL.getEpochSeconds(fieldValue);
                    } else {
                        sysmodtime = KMQuery_IDOL.getEpochSeconds(new Date());
                    }
                    //autn:date must be the last datetype field in the index document, will set later
                    continue;
                }

                fieldValue = lib.KMUtils.kmIDOLDateFormat(fieldValue);
                if (fieldName.match(/_date$/g) == null) {
                    fieldName += '_DATE';
                }
            }

            if (lib.KMUtils.isSCArray(fieldValue) && !match && indexfType[i] !== 'Reference') {
                fieldValue = lib.KMUtils.scArrayToString(fieldValue);
            }

            if (dataCleansing[i] && cleanser) {
                fieldValue = cleanser(fieldValue);
            }
            if (fieldName.toUpperCase() == 'TITLE') {
                if (!fieldValue) {
                    fieldValue = doc_id;
                }
                foundTitle = true;
            }
            var fieldResult = createIndexField(fieldName, fieldValue, weight, match, indexFields, indexfAlias, indexfType, i, indexDoc, isLanguage, '');
            indexDoc = fieldResult.indexDoc;
            isLanguage = fieldResult.isLanguage;

            //fix the impact to logical name change
            if (indexfType[i] == 'Reference') {
                fieldValue = funcs.get_display_value(sclibFile, fieldName.replace(/_/g, '.'), -1, true);

                // even empty value need index, used to create parametric field or something like
                if (fieldValue === null || fieldValue === undefined) { // need to handle 'boolean false' or 'number 0'
                    fieldValue = "";
                }

                if (lib.KMUtils.isSCArray(fieldValue)) {

                    var idx;
                    var length = fieldValue.length();
                    for (idx = 0; idx < length; idx++) {
                        var fvalue = funcs.strraw(fieldValue[idx]);

                        fieldResult = createIndexField(fieldName, fvalue, weight, match, indexFields, indexfAlias, indexfType, i, indexDoc, isLanguage, REF_PREFIX);
                        indexDoc = fieldResult.indexDoc;
                        isLanguage = fieldResult.isLanguage;
                    }
                } else {
                    indexDoc = setDocumentFieldValue(REF_PREFIX + fieldName, fieldValue, indexDoc, weight, indexfType[i], match);
                    var temp = setAliasFieldValues(indexFields, indexfType, indexfAlias, i, fieldValue, indexDoc, isLanguage, REF_PREFIX);
                    if (temp) {
                        indexDoc = temp.indexDoc;
                    }
                }

            }
        } //end for loop

        // by Xiongjie MA 20190505, add IMAGE field only for catalog
        if (sefilename === 'joinsvcDisplay') { // hardcode only for catalog
            var imageId = getImageId(sclibFile['name']);
            if (imageId === null || imageId === undefined) {
                imageId = "";
            }
            indexDoc = setDocumentFieldValue('IMAGE', imageId, indexDoc, -1, 'String', false);
            // end by Xiongjie MA 20190505

            if (fKmKnowledgebase['portal.default.language'] && fKmKnowledgebase['portal.available.languages'] &&
                fKmKnowledgebase['portal.default.language'] == sclibFile['syslanguage'] && fKmKnowledgebase['portal.available.languages'].length() > 0) {
                indexDoc = checkPortalLanguages(fKmKnowledgebase['portal.available.languages'].toArray(), sclibFile['syslanguage'], sclibFile['name'], indexDoc);
            }

        }

        if (!isLanguage) {
            var vlang = null;
            if (sclibFile.locale) {
                vlang = KMIDOLLanguageMap[sclibFile.locale];
                if (vlang) {
                    indexDoc = setDocumentRawField('LANGUAGE', vlang, indexDoc);
                }
            }
        }
        if (!foundTitle) {
            dretitle += doc_id + "\n";
            indexDoc += dretitle;
            foundTitle = true;
        }
        indexDoc = setSecurityFields(securityFields, sclibFile, indexDoc, kbname);

        indexDoc += createHiddenRestrictFields(indexFieldSet.restritFields, sclibFile);

        var ALText = "";
        if (vars.$G_km_globalenv.use_kmadaptivelearning) {
            ALText = lib.KMCollection_Update_Utils.getALtext(kbname, doc_id);
            if (cleanser) {
               ALText = cleanser(ALText);
            }
            var kmCleanser = IDOLDataCleansing.getCleanser('kmadaptivelearning');
            if (kmCleanser) {
                ALText = kmCleanser(ALText);
            }
        }

        if (ALText && ALText.length > 0) {
            indexDoc = setDocumentRawField('adlearn_INDEX', ALText, indexDoc);
        }
        
        if(fKmKnowledgebase["index.chat.history"])
        {
           //find msTeamsReplyInfo by sefilename/doc_id 
           var chatText = getChatHistory(sefilename,doc_id);
           if (chatText && chatText.length > 0) 
           {
              indexDoc = setDocumentRawField('CHAT_HISTORY_INDEX', chatText, indexDoc);
           }
        }
        //autn:date must be the last datetype field in the index document
        if (sysmodtime) {
            indexDoc = addFieldDREDate(indexDoc, sysmodtime);
            indexDoc = setDocumentRawField('sysmodtime_date', sysmodtime, indexDoc);
        }
        indexDoc = indexDoc.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'');
        return dreref + indexDoc + dreend;
    }
    
    function getChatHistory(filename, docid)
    {
       var f = new SCFile("msTeamsReplyInfo",SCFILE_READONLY);
       f.setFields(["content","contentType"]);
       var rc = f.doSelect('fileName="'+filename+'" and fileId="'+docid+'"');
       var chatText = "";
       while(rc == RC_SUCCESS)
       {
         var ct = f["contentType"];
         if(ct && ct.toString().toLowerCase()=="html")
         {
           chatText += lib.KMUtils.HTMLtoText(f["content"])+" ";           
         }
         else
         {
           chatText += f["content"]+" ";      
         }
         
         rc = f.getNext();
       }
       return chatText;
    }
    //through default language and available languages append available languages for SD portal search
    function checkPortalLanguages(available_languages, defaultlanguage, catalogname, indexDoc) {
        if (!available_languages || !defaultlanguage || available_languages.length == 0) {
            return indexDoc;
        }

        var toadd_languages = [];
        var languages = getExistLanguages(catalogname, defaultlanguage);
        var i;
        for (i = 0; i < available_languages.length; i++) {
            if (available_languages[i] && available_languages[i] != "" && available_languages[i] != defaultlanguage) {
                var alreadyexist = false;
                var j;
                for (j = 0; j < languages.length; j++) {
                    if (languages[j] == available_languages[i]) {
                        alreadyexist = true;
                        break;
                    }
                }
                if (!alreadyexist) {
                    toadd_languages.push(available_languages[i]);
                }

            }
        }
        for (i = 0; i < toadd_languages.length; i++) {
            indexDoc = setDocumentRawField('syslanguage', toadd_languages[i], indexDoc);
        }

        return indexDoc;
    }

    function getExistLanguages(catalogname, defaultlanguage) {
        var langs = [];
        var f = new SCFile("svcDisplay", SCFILE_READONLY);
        f.setFields(["syslanguage"]);
        var rc = f.doSelect('name="' + catalogname + '" and syslanguage like "*" ');
        while (rc == RC_SUCCESS) {
            if (f["syslanguage"] && f["syslanguage"] != defaultlanguage) {
                langs.push(f["syslanguage"]);
            }
            rc = f.getNext();
        }
        return langs;
    }

    /**
     * Copy this method from GatewayAPI_Cache in case the unload for single desployment is not loaded.
     */
    function getImageId(topic) {
        var query = "application isin {\"svcCatalog\", \"joinsvcDisplay\"} and type=3 and topic=\"" + topic + "\"";
        var image = lib.c.$("SYSATTACHMENTS", SCFILE_READONLY).setFields(["uid"]).select(query).uniqueResult();
        if (image) {
            return image.uid;
        } else {
            return null;
        }
    }


    function createIndexField(fieldName, fieldValue, weight, match, indexFields, indexfAlias, indexfType, i, indexDoc, isLanguage, prefix) {
        var retValue = {
            "indexDoc": indexDoc,
            "isLanguage": isLanguage
        };
        //if( !fieldValue){return retValue;}
        // even empty value need index, used to create parametric field or something like
        if (fieldValue === null || fieldValue === undefined) { // need to handle 'boolean false' or 'number 0'
            fieldValue = "";
        }

        if (indexfType[i] == 'Rich_Text') {
            fieldValue += ''; //convert numbers to strings
            fieldValue = lib.KMCollection_Update_Utils.processRichText(fieldValue);
        }

        fieldName = prefix + fieldName;

        // handle match field, or reference field
        if (lib.KMUtils.isSCArray(fieldValue)) {
            var j;
            var length = fieldValue.length();
            for (j = 0; j < length; j++) {
                var fvalue = funcs.strraw(fieldValue[j]);
                var temp1 = createIndexField(fieldName, fvalue, weight, match, indexFields, indexfAlias, indexfType, i, indexDoc, isLanguage, '');
                if (temp1) {
                    indexDoc = temp1.indexDoc;
                    isLanguage = temp1.isLanguage;
                }
            }
        } else {
        
            if (indexfAlias[i] && indexfAlias[i].toUpperCase() == 'TITLE' && weight > -1)
            {
              indexDoc = setDocumentFieldValue(fieldName, fieldValue, indexDoc, -1, indexfType[i], match);
              indexDoc = setDocumentRawField("TITLE", fieldValue, indexDoc);
            }
            else
            {
              indexDoc = setDocumentFieldValue(fieldName, fieldValue, indexDoc, weight, indexfType[i], match);
              var temp = setAliasFieldValues(indexFields, indexfType, indexfAlias, i, fieldValue, indexDoc, isLanguage, prefix);
              if (temp) {
                  indexDoc = temp.indexDoc;
                  isLanguage = temp.isLanguage;
              }
            }
        }

        retValue.indexDoc = indexDoc;
        retValue.isLanguage = isLanguage;

        return retValue;
    }

    function setAliasFieldValues(indexFields, indexfType, indexfAlias, idx, fieldValue, indexDoc, isLanguage, prefix) {
        var aliasFields = lib.KMCollection_Update_Utils.getFieldAlias(indexFields, indexfAlias, idx);
        if (aliasFields) {
            var i;
            for (i = 0; i < aliasFields.length; ++i) {
                var fieldName = aliasFields[i];

                if (fieldName === "language" && !isLanguage) {
                    var lang = KMIDOLLanguageMap[fieldValue];
                    indexDoc = setDocumentRawField("LANGUAGE", lang, indexDoc);
                    isLanguage = true;
                }
                if (indexfType[idx] == "Date") {
                    if (fieldName.match(/date$/g) == null) {
                        fieldName += '_DATE';
                    }
                }
                fieldName = prefix + fieldName;
                indexDoc = setDocumentRawField(fieldName, fieldValue, indexDoc);
            }
        }

        return {
            "indexDoc": indexDoc,
            "isLanguage": isLanguage
        };
    }

    function setSecurityFields(securityFields, sclibFile, indexDoc, kbname) {
        if (null != securityFields) {

            var i;
            for (i = 0; i < securityFields.length; ++i) {
                var fieldName = lib.KMUtils.scToJSName(securityFields[i]);

                var fieldValue = sclibFile[fieldName];
                if (fieldValue === null || fieldValue === undefined) {
                    fieldValue = ''; //convert numbers to strings
                }
                fieldName +='_MATCH';
                if(fieldValue && lib.KMUtils.isSCArray(fieldValue))
                {
                  fieldValue = fieldValue.toArray();
                  var j;
                  for(j=0; j<fieldValue.length; ++j)
                  {
                    indexDoc = setDocumentRawField( fieldName, fieldValue[j], indexDoc);
                  }
                }
                else
                {
                  indexDoc = setDocumentRawField( fieldName, fieldValue, indexDoc);
                }
            }
        }

        return indexDoc;
    }

    function toValueString(value) {
        // need to handle 'boolean false' or 'number 0'
        if (value === null || value === undefined) {
            value = '';
        }
        return value;
    }

    function createIDXField(name, value) {
        value = _.isSCArray(value) ? value.toArray() : value;
        if (_.isArray(value)) {
            return _.chain(value)
                .map(function(v) {
                    return createIDXField(name, v);
                })
                .value()
                .join('');
        }
        name = IDOLCommon.toHiddenMatchField(name);
        value = toValueString(value);
        return '#DREFIELD ' + name + '="' + value + '"\n';
    }

    // use for catalog access.list, access.filter
    // has to index catalog access.list first, then use operator capability words to match those Catalog
    // those fields are used for security control, shouldn't mix with other normal fields
    function createHiddenRestrictFields(fields, scfile) {
        fields = fields || [];
        return _.chain(fields)
            .map(function(name) {
                var value = scfile[name];
                return createIDXField(name, value);
            })
            .value()
            .join('');
    }

    return {
        "indexDocument": indexDocument,
        "createIndexDoc": createIndexDoc
    };
})();


function require() {
    return KMDocument_Index_IDOL;
}