/*  This script is called when a kmdocument record needs the $L.docwithview 
 *   to contain the document preview html. 
 *
 *   This script is called from the Javascript in these processes:
 *     kmdocument.preview.init
 *     cm.update
 */

//var log=getLog("KMDocPreview");

/**
	This function  locates field tokens and replaces them with the actual data values for those fields.
	@param theView - a String containing the view with tokens
	@param record - kmdocument object that we want to generate a preview for
	
	@return String - A new string copy of the View with data inserted in place of the tokens
**/
function replaceTokensWithData(theView, record) {
    const KMTAG = "*SCKM*";

    var spec_loc = theView.indexOf(KMTAG);
    var tmpFld = "";
    var tmpVal = "";

    var scdisp = theView.indexOf("DISPLAY: inline");

    while (spec_loc >= 0) {
        tmpFld = theView.substring(spec_loc + KMTAG.length, theView.length);
        tmpFld = tmpFld.substring(0, tmpFld.indexOf(KMTAG));

        if (tmpFld == "related") {
            tmpVal = getRelatedDocuments(record.id);
        } else {
            tmpVal = record[tmpFld];

            if (tmpFld == "logical.name") {
                if (lib.KMUtils.isSCArray(tmpVal)) {
                    //tmpVal = lib.KMUtils.scArrayToHTMLString(tmpVal);
                    var tmpValDisp = "";
                    if (tmpVal != null && tmpVal != "") {
                        var tmpIdx;
                        var length = tmpVal.length();
                        for (tmpIdx = 0; tmpIdx < length; tmpIdx++) {
                            if (tmpVal[tmpIdx] != null) {
                                tmpVal[tmpIdx] = tmpVal[tmpIdx].replace(/"/g, "&quot;");
                                tmpVal[tmpIdx] = tmpVal[tmpIdx].replace(/</g, "&lt;");
                                tmpVal[tmpIdx] = tmpVal[tmpIdx].replace(/>/g, "&gt;");
                                tmpVal[tmpIdx] = tmpVal[tmpIdx].replace(/\\/g, "\\\\");
                                tmpValDisp = lib.DisplayName.getDisplayNameById("device", tmpVal[tmpIdx]);
                                tmpVal[tmpIdx] = "<a href=\"sclink://device:logical.name=&quot;" + tmpVal[tmpIdx] + "&quot;\">" + tmpValDisp + "</a><br>";
                            }
                        }
                        tmpVal = funcs.strraw(tmpVal);
                    }
                }
            }

            //below block is added for QCCR1E152209
            if (tmpFld == "doctype") {
                var index = lib.ArrayUtil.indexOf(vars.$G_kmdoctype_name, tmpVal);
                if (index > -1) {
                    tmpVal = vars.$G_kmdoctype_display[index];
                }
            } else if (tmpFld == "subtype") {
                var subindex = lib.ArrayUtil.indexOf(vars.$G_sla_kmdocument_subtype, tmpVal);
                if (subindex > -1) {
                    tmpVal = vars.$G_sla_kmdocument_subtype_display[subindex];
                }
            }

            //check for and handle array fields
            if (lib.KMUtils.isSCArray(tmpVal)) {
                tmpVal = lib.KMUtils.scArrayToHTMLString(tmpVal);
            }

            if (tmpVal == null) {
                tmpVal = "";
            } else if (funcs.type(tmpVal) == lib.DataTypeConst.typeDateTime()) {
                tmpVal = funcs.str(tmpVal);
            }
        }

        var step = 1;

        // Substitute the actual field's value for the name of the field,
        // replace *SCKM*field*SCKM* to the actual value
        theView = theView.substring(0, spec_loc) + tmpVal +
            theView.substring((theView.indexOf(tmpFld + KMTAG, spec_loc) + tmpFld.length + KMTAG.length), theView.length);

        // bypass content which contains the field tag itself
        if (tmpVal.indexOf(KMTAG + tmpFld + KMTAG) >= 0) {
            step = tmpVal.length + 1;
        }

        spec_loc = theView.indexOf(KMTAG, spec_loc + step);
    }

    if (scdisp > 0) {
        if (record.status == "draft" || record.status == "triage" || !lib.security.getToken("Knowledge Document", "feedback")) {
            theView = theView.replace("DISPLAY: inline", "DISPLAY: none");
        }
    }

    return theView;
}

function replaceLikeTokensWithData(theView, record) {
    var spec_loc = theView.indexOf("*LIKENUM");
    if (spec_loc >= 0) {
        var x = new SCFile("kmfeedback", SCFILE_READONLY);
        x.setFields(["id"]);

        var ncount = x.doCount("kmdocumentid=\"" + record.id + "\" and useful=true");
        theView = theView.substring(0, spec_loc) + ncount + theView.substring(spec_loc + 9, theView.length);
    }
    return theView;
}

/**
	This function checks to see if they have used sc.msg tokens to request
	localized doc view field labels...if we find them then we use the
	sc message mechanism to translate the label within the view data
	@param theView - a String containing the view with SCMSG tokens
	
	@return String - A new string copy of the View with scmessage data inserted in place of the tokens
**/
function replaceSCMSGTokens(theView) {
    var spec_loc2 = theView.indexOf("*SCMSG");
    var tmpFld3 = "";
    var tmpVal2 = "";

    while (spec_loc2 >= 0) {
        tmpFld3 = theView.substring(spec_loc2 + 7, theView.length);
        tmpFld3 = tmpFld3.substring(0, tmpFld3.indexOf("*SCMSG"));

        //To Support L18N of End User Chat, we added below code to get a localized label value by given language.
        //$chat.get.km.content is defined in lib.EndUserChat.getKMPage();
        //when this thread variable is empty or non-defined,use the orginal code, or if this thread variable has value, then use this as input language parameter
        var fromChatService = vars["$chat.get.km.content"];
        if (fromChatService === null || fromChatService === undefined) {
            eval('tmpVal2 = funcs.scmsg(' + tmpFld3 + ', "km");');
            if (tmpVal2 == null) {
                tmpVal2 = "";
            }
        } else {
            tmpVal2 = getTargetLanguageLabel(tmpFld3, fromChatService);
        }

        // Substitute the localized label's value for the number
        theView = theView.substring(0, spec_loc2) + tmpVal2 + theView.substring((theView.indexOf(tmpFld3 + "*SCMSG") + tmpFld3.length + 7), theView.length);
        spec_loc2 = theView.indexOf("*SCMSG");
    }

    return theView;
}


function getTargetLanguageLabel(msgId, lan) {
    var lg = lan;
    if (!lib.ArrayUtil.contains(vars['$G.language.ids'], lg)) {
        lg = "en";
    }

    var cls = "km";
    var message = new SCFile("scmessage", SCFILE_READONLY);

    var msg = msgId;
    var sql = "syslanguage=\"" + lg + "\" and class=\"" + cls + "\" and message.id=\"" + msgId + "\"";

    if (message.doSelect(sql) == RC_SUCCESS) {
        msg = message.message;
    }

    return msg;
}

/**
	To work with old invoke code, we added this shell function, it will invoke getDocWithViewName function and specify the view name as NULL.

	then the SM will return the document html result by the default view sequence.(display kmdocument via the highest view name)
**/
function getDocWithView(record) {
    return getDocWithViewName(record, null);
}

/**
	This function returns populates $L.docwithview to contain a document's preview html.
	@param record - kmdocument object that we want to generate a preview for
	@param specificViewName - the specific name of docview we want to display doc with it. 

	@return Boolean - true if preview file was generated successfully
                      false if we put in an error check to see if DB calls did not succeed.
	
    Examples of how to call this script:
    if (lib.KMDocPreview.getDocWithView(vars.$L_document) == true) ...
    or
    lib.KMDocPreview.getDocWithView(vars.$L_file);
**/
function getDocWithViewName(record, specificViewName) {
    var record2 = new SCFile();
    funcs.fduplicate(record2, record);

    if (null != record.title) {
        record2.title = lib.StringUtil.escapeStringforXML(record.title);
    }

    if (null != record.summary) {
        record2.summary = lib.StringUtil.escapeStringforXML(record.summary);
    }

    record = record2;

    var showDoc = false;
    //first we need to create some arrays of the values in every view
    //so that we don't have to loop multiple times through the views later
    var kmViewNameArray = new SCDatum();
    var kmViewSecLevelArray = new SCDatum();
    var kmViewGroupArray = new SCDatum();
    kmViewNameArray.setType(8);
    kmViewSecLevelArray.setType(8);
    kmViewGroupArray.setType(8);

    //QCCR1E54983 check the user authority for the document first unless they are in preview
    if (!vars.$L_preview) {
        var auth = lib.KMSecurity.doesUserHaveDocViewRights(record);
        if (auth == false) {
            var arrayArgs = new SCDatum();
            arrayArgs.setType(2);
            arrayArgs.push(record.id);
            print(funcs.scmsg(185, "km", arrayArgs)); //You do not have permission to view the knowledge document with id %S.
            return false;
        }
    }

    //get the doctype record
    var q = new Query("kmdoctype", new QueryCond("name", EQ, record.doctype));
    var q0 = q[0];
    // Error check if the document was read correctly. I3150
    if (!q0) {
        print(funcs.scmsg(159, "km")); // Cannot display this document, possibly due to the deletion of a linked document.
        return false;
    }

    var views = q0.format_view;
    var vlength = views.length();

    var vwIdx;
    for (vwIdx = 0; vwIdx < vlength; vwIdx++) {
        var view = views[vwIdx];
        var vwGrpIdx = 0;
        var vwrlength = view.view_roles.length();
        for (vwGrpIdx = 0; vwGrpIdx < vwrlength; vwGrpIdx++) {
            kmViewNameArray = funcs.insert(kmViewNameArray, 0, 1, view.view_name, true);
            kmViewSecLevelArray = funcs.insert(kmViewSecLevelArray, 0, 1, view.view_seclevel, true);
            kmViewGroupArray = funcs.insert(kmViewGroupArray, 0, 1, view.view_roles[vwGrpIdx], true);
        }
    }

    if (vwIdx == 0) {
        //vwIdx should only be 0 if there were no views at all, in that case just
        //give a message to the user
        vars.$L_docwithview = "There is no view for this document type";
    } else {
        //debugging statements
        /*
		print(kmViewNameArray);
		print(kmViewSecLevelArray);
		print(kmViewGroupArray);
	  */
        //now that we have all the views values sorted in arrays we can use 
        //them to determine which view to use
        var highestLevelVal = 0;
        var highestLevelViewName = "";

        var nlength;
        var vwLstIdx;

        //first check if the user is an admin
        if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
            funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ||
            vars.$G_km_environment.doctypes) {
            //in this case just get the highest sec level view
            nlength = kmViewNameArray.length();
            for (vwLstIdx = 0; vwLstIdx < nlength; vwLstIdx++) {
                if (kmViewSecLevelArray[vwLstIdx] > highestLevelVal) {
                    highestLevelVal = kmViewSecLevelArray[vwLstIdx];
                    highestLevelViewName = kmViewNameArray[vwLstIdx];
                }
            }
            showDoc = highestLevelViewName != "";
        } else {
            //call api to determine which groups the user has rights in with 
            //relation to the document based on the doc id passed in
            var grps = lib.KMSecurity.getKMGroupsForDocView(record); //call to api
            //grps should now either be an 
            //1 empty array (can't view doc)
            if (grps.length() == 0) {
                showDoc = false;
            }
            //2 single value array(use that group to pick the view)
            else if (grps.length() == 1) {
                nlength = kmViewNameArray.length();
                for (vwLstIdx = 0; vwLstIdx < nlength; vwLstIdx++) {
                    if (kmViewGroupArray[vwLstIdx] == grps[0]) {
                        highestLevelVal = kmViewSecLevelArray[vwLstIdx];
                        highestLevelViewName = kmViewNameArray[vwLstIdx];
                    }
                }
                showDoc = highestLevelViewName != "";
            }
            //3 multi value array(multiple groups so sec level has to be considered)
            else {
                nlength = kmViewNameArray.length();
                for (vwLstIdx = 0; vwLstIdx < nlength; vwLstIdx++) {
                    var grpsIdx;
                    var glength = grps.length();
                    for (grpsIdx = 0; grpsIdx < glength; grpsIdx++) {
                        if (kmViewGroupArray[vwLstIdx] == grps[grpsIdx]) {
                            if (kmViewSecLevelArray[vwLstIdx] > highestLevelVal) {
                                highestLevelVal = kmViewSecLevelArray[vwLstIdx];
                                highestLevelViewName = kmViewNameArray[vwLstIdx];
                            }
                        }
                    }
                }
                showDoc = highestLevelViewName != "";
            }
        }

        var vwIdx2;
        var theView;
        var idxName;

        if (showDoc) {
            //Updated by kang.pan@hp.com for KM Mobile Detail View 8/8/2013
            //If the client type is "mobile", the View Name should be "Default Mobile View"
            if (vars.$G_client_type == "mobile") {
                highestLevelViewName = "Default Mobile View";
            } else if (specificViewName != undefined && specificViewName != null) {
                highestLevelViewName = specificViewName;
            }
            //now we SHOULD have a value in our name variable-if we don't there is an error
            if (highestLevelViewName == "") {
                //do nothing for now
                vars.$L_docwithview = "There was an error trying to locate the view for this document";
            } else {
                //since we have a name here we want to find the view that corresponds
                if (vlength > 0) {
                    idxName = 0;
                    for (vwIdx2 = 0; vwIdx2 < vlength; vwIdx2++) {
                        if (views[vwIdx2].view_name == highestLevelViewName) {
                            idxName = vwIdx2;
                        }
                    }

                    //then get the view data from the query result
                    theView = views[idxName].view_data;
                    if (theView == null) {
                        vars.$L_docwithview = "There is no data in the Document View for this Document Type.";
                    } else {
                        theView = replaceTokensWithData(theView, record);
                        if (vars.$G_client_type == "mobile") {
                            theView = replaceLikeTokensWithData(theView, record);
                        }

                        theView = replaceSCMSGTokens(theView);

                        vars.$L_docwithview = theView;
                        vars.$L_externaldoc = getAttPreview(record.id);
                    }
                } else {
                    vars.$L_docwithview = "There is no Document View for this Document Type.";
                }
            }
        } else {
            //so we have decided that if a user has no rights then they will get the default
            //view...this may fail if the default view does not exist 

            //since we have a name here we want to find the view that corresponds
            idxName = 0;
            var havedefault = false;
            var defaultViewName = "Default View";

            //Updated by kang.pan@hp.com for KM Mobile Detail View 8/8/2013
            //If the client type is "mobile", the Default View Name should be "Default Mobile View"
            if (vars.$G_client_type == "mobile") {
                defaultViewName = "Default Mobile View";
            }

            for (vwIdx2 = 0; vwIdx2 < vlength; vwIdx2++) {
                if (views[vwIdx2].view_name == defaultViewName) {
                    idxName = vwIdx2;
                    havedefault = true;
                }
            }

            if (idxName == 0 && havedefault == false) {
                //this means they not only have no rights but there is no default view 
                //so they are unlucky...
                vars.$L_docwithview = "There is no default view for this document.";
            } else {
                //then get the view data from the query result
                theView = views[idxName].view_data;
                if (theView == null) {
                    vars.$L_docwithview = "There is no data in the Document View for this Document Type.";
                } else {
                    theView = replaceTokensWithData(theView, record);
                    theView = replaceSCMSGTokens(theView);
                    vars.$L_externaldoc = getAttPreview(record.id);
                    vars.$L_docwithview = theView;
                }
            }
        }
    }

    return showDoc;
}

/**
 *	QCCR1E74162 OVSM KM: Preview of External Document Type fails. Nothing is displayed to user
 *	add attachment finding function, return html text for the attachment.
 */
function getAttPreview(id) {
    var sysatt = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
    sysatt.setFields(["uid", "filename"]);
    var sc = sysatt.doSelect("application=\"kmdocument\" and topic=\"" + id + "\"");
    var extDoc;
    if (sc == RC_SUCCESS) {
        if (vars.$G_client_type == "mobile") {
            extDoc = "<div class='mobile-ext-doc'><a href=\"scattach://" + sysatt.uid + ":" + sysatt.filename + ":kmdocument:" + vars.$L_file.id + "\">" + sysatt.filename + "</a></div>";
        } else {
            extDoc = "<html><iframe height=\"100%\" width=\"100%\" src=\"scattach://" + sysatt.uid + ":" + sysatt.filename + ":kmdocument:" + id + "\"></iframe></html>";
        }
    } else {
        extDoc = "<html><iframe height=\"100%\" width=\"100%\"></iframe></html>";
    }

    return extDoc;
}

/**
 *	Pink for KM: show related records in KM Doc preview page
 */
function getRelatedDocuments(id) {
    var relation = new SCFile("screlation", SCFILE_READONLY);
    relation.setFields(["depend", "desc"]);
    var relatedId = "";

    var sql = "source=\"" + id + "\" and source.filename=\"kmdocument\" and depend.filename=\"kmdocument\" and depend.active=true";
    var rc = relation.doSelect(sql);
    while (rc == RC_SUCCESS) {
        // <a href=\"scattach://"+fAttach.uid+":"+fAttach.filename+":incidents:"+scRelation.depend+"\">"+fAttach.filename+"</a>"

        if (relation.desc[1] == "external" || relation.desc[1] == "internal") {
            var localValDisStr = "";
            if (relation.desc[6] != null && relation.desc[6] != "") {
                var localValueArr = vars.$G_language_km_ids.toArray(); //$G.language.km.ids
                var localDispArr = vars.$G_language_km_names.toArray(); //$G.language.km.names
                var localVal = lib.ArrayUtil.indexOf(localValueArr, relation.desc[6]);
                var localDis = (localVal != -1) ? localDispArr[localVal] : "";
                localValDisStr = (localDis != null && localDis != "") ? "(" + localDis + ")" : "";
            }
            var link = "<a href=\"scactivelink://kmdocument:id=&quot;" + relation.depend + "&quot;\">" + relation.depend + "</a>" + localValDisStr + "<br>";

            // populate fields in screlation table
            relatedId += link;
        }
        rc = relation.getNext();
    }

    return relatedId;
}