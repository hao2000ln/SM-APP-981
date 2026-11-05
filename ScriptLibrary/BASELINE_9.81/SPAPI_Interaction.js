var setExitType = lib.ScAPI_Util.setExitType;
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var File = lib.DBUtils.File;

var getOperatorNameFromContactName = lib.ScAPI_Util.getOperatorNameFromContactName;
var toJSON = lib.JSON2.toJSON;

function getInteraction() {
    setExitType(NORMAL_EXIT);
    interaction = vars["$L.file"];
    interaction['callback.contact'] = getOperatorNameFromContactName(interaction['callback.contact']);
    interaction['contact.name'] = getOperatorNameFromContactName(interaction['contact.name']);


    var file = vars['$L.file'];
    var tableAccess = new SCDatum(system.vars.$G_sm_environment.tableAccess);
    var obj = new SCFile('Object');

    obj.doSelect('file.name="incidents"');

    lib.tableAccess.setAccessVars(file, tableAccess, obj, true);

    interaction['vendor'] = system.functions.str(vars.$L_tableAccess_update);
    if (interaction['open'] == "Closed")
        interaction['room'] = "false"
    else
        interaction['room'] = system.functions.str(vars.$L_tableAccess_close);


    var spxml = {};
    spxml['cartItems'] = _getCartItems(interaction["incident.id"]);
    spxml['CatInteractionComments'] = _getInteractionComments(interaction["incident.id"]);
    spxml['Attachments'] = _getAttachment(interaction["incident.id"]);
    spxml['ApprovalInfo'] = _getInteractionApprovalInfo(interaction["incident.id"]);
    interaction['variable3'] = toJSON(spxml);


}


function _getCartItems(interactionID) {
    var cartItems = [];
    var cartItem = new SCFile("svcCartItem", SCFILE_READONLY);
    var fields = ["action.filename", "action.id", "cartItemId", "status", "quantity", "cost", "item.description", "cartId", "options", "requested.for", "bundle", "svcCatalogId", "sdID", "parentCartItemId", "bundle.options", "recurring.cost", "recurring.cost.interval"];
    cartItem.setFields(fields);


    var query = "sdID = \"" + interactionID + "\"";
    var result = cartItem.doSelect(query);


    while (result == RC_SUCCESS) {
        cartItemTmp = {};
        for (var i = 0; i < fields.length; i++) {
            if (cartItem[fields[i]] && cartItem[fields[i]] != null) {
                cartItemTmp[fields[i]] = cartItem[fields[i]];
            }
        }
        if(cartItemTmp['options']!=null){
            cartItemTmp['options'] = cartItemTmp['options'].replace(/\n/g,'');
            cartItemTmp['options'] = cartItemTmp['options'].replace(/\u000a/g,'');
        }
        cartItemTmp['requested.for'] = getOperatorNameFromContactName(cartItemTmp['requested.for']);

        var catalogItem = new SCFile("joinsvcDisplay", SCFILE_READONLY);
        var ciQuery = "id = \"" + cartItem["svcCatalogId"] + "\"";
        var ret = catalogItem.doSelect(ciQuery);
        if (ret == RC_SUCCESS) {
            cartItemTmp["catalogItem.name"] = catalogItem["name"];

            cartItemTmp["catalogItem.bundle"] = [];
            var len = catalogItem["bundle"].length();
            for (var i = 0; i < len; i++) {

                var bundle = catalogItem["bundle"][i];
                if (bundle[0] != null) {
                    var bundleTmp = {};
                    bundleTmp["item.id"] = bundle[0];
                    bundleTmp["item.name"] = bundle[1];
                    bundleTmp["item.option"] = bundle[2];
                    bundleTmp["item.quantity"] = bundle[3];
                    bundleTmp["item.cost.adj"] = bundle[4];
                }
                cartItemTmp["catalogItem.bundle"].push(rteJSONStringify(bundleTmp));
            }




            cartItemTmp["catalogItem.option.validations"] = catalogItem["option.validations"];


        }

        cartItems.push(rteJSONStringify(cartItemTmp));
        result = cartItem.getNext();
    }
    return cartItems;

}

function _getInteractionComments(interactionID) {
    if (interactionID == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(138));
        return;
    }


    var filename = "incidents";

    var fields = ['action', 'component', 'current.phase', 'date', 'file.name', 'group', 'name', 'operator.fullname', 'unique.key'];

    var comments = {};

    comments['ApprovalLogs'] = [];

    var dirLogs = new File('ApprovalLog').getRecords('file.name="' + filename + '" and unique.key="' + interactionID + '"');
    if (dirLogs != null) {
        dirLogs.each(function(dirLog) {

            var approvalLog = {};

            for (var i = 0; i < fields.length; i++) {
            if(dirLog[fields[i]])
                approvalLog[fields[i]] = dirLog[fields[i]];
            }
            approvalLog['date'] = dirLog['date'].toUTCString();
            approvalLog['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(dirLog['comments']);
            comments['ApprovalLogs'].push(rteJSONStringify(approvalLog));

        });

    }


    var cartItems = new File('svcCartItem').getRecords('sdID="' + interactionID + '"')
    if (cartItems != null) {
        cartItems.each(function(cartItem) {
            var relLogs = new File('ApprovalLog').getRecords('file.name="svcCartItem" and unique.key="' + cartItem['cartItemId'] + '"');
            if (relLogs != null) {
                relLogs.each(function(relLog) {
                    var itemApprovalLog = {};
                    for (var i = 0; i < fields.length; i++) {
                        itemApprovalLog[fields[i]] = relLog[fields[i]];
                    }

                    itemApprovalLog['item.name'] = cartItem['item.description'];
                    itemApprovalLog['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(relLog['comments']);
                    comments['ApprovalLogs'].push(rteJSONStringify(itemApprovalLog));
                });
            }
        });
    }


    comments['ActivityLogs'] = [];


    var activityFields = ['thenumber', 'number', 'type', 'datestamp', 'operator'];
    var activities = new File('activityservicemgt').getRecords('number="' + interactionID + '" and cust.visible=true');


    if (activities != null) {

        activities.each(function(activity) {
            var interactionActivity = {};

            for (var i = 0; i < activityFields.length; i++) {
                interactionActivity[activityFields[i]] = activity[activityFields[i]];

            }
            interactionActivity['datestamp'] = activity['datestamp'].toUTCString();
            var xml = new XML();

            var descSize = system.functions.lng(activity['description']);
            xml.setContent("<description/>");
            for (var i = 0; i < descSize; i++) {
                var nodeDesc = xml.createNode(1, "description");
                if (activity['description'][i] != null) {
                    nodeDesc.setValue(activity['description'][i]);
                } else {
                    nodeDesc.setValue("");
                }
                xml.appendNode(nodeDesc);
            }

            interactionActivity['descriptions'] = xml.toXMLString();

            comments['ActivityLogs'].push(rteJSONStringify(interactionActivity));



        });

    }




    comments['ApprovalComments'] = [];
    var approvalLogs = new File("Approval").getRecords("file.name=\"" + filename + "\" and unique.key=\"" + interactionID + "\"");

    if (approvalLogs != null) {
        approvalLogs.each(function(approvalLog) {

            if (approvalLog['comments']) {
                var interactionApprovalLog = {};
                interactionApprovalLog['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(approvalLog['comments']);
                comments['ApprovalComments'].push(rteJSONStringify(interactionApprovalLog));
            }

        });

    }



    var cartItem = new SCFile("svcCartItem");
    var ret = cartItem.doSelect("sdID=\"" + interactionID + "\"");
    while (ret == RC_SUCCESS) {
        var itemApprovalLogs = new File("Approval").getRecords("file.name=\"" + system.functions.filename(cartItem) +
            "\" and unique.key=\"" + cartItem.cartItemId + "\"");
        if (itemApprovalLogs != null) {
            itemApprovalLogs.each(function(itemApprovalLog) {
                var lineItemApprovalLog = {};
                lineItemApprovalLog['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(itemApprovalLog['comments']);
                comments['ApprovalComments'].push(rteJSONStringify(lineItemApprovalLog));


            });

        }
        ret = cartItem.getNext();

    }


    return comments;


}

function _getAttachment(interactionID) {
    var interactionAttachments = [];

    var attachments = new File("SYSATTACHMENTS").getRecords("topic=\"" + interactionID + "\"" + " and segment=\"0\"");
    var fields = ["mimetype", "filename", "size", "upload.by", "upload.date", "uid", "application"];
    if (attachments != null) {

        attachments.each(function(attachment) {
            var attachmentTmp = {};
            for (var i = 0; i < fields.length; i++) {
                attachmentTmp[fields[i]] = attachment[fields[i]];
            }
            attachmentTmp["upload.date"] = attachment["upload.date"].toUTCString();
            interactionAttachments.push(rteJSONStringify(attachmentTmp));
        });

    }

    return interactionAttachments;


}


function _getInteractionApprovalInfo(interactionID) {
    var approvalInfo = {};
    approvalInfo["approvalInfo"] = [];
    approvalInfo["approvalGroupInfo"] = {};
    approvalInfo["approvalDelegation"] = {};
    var cartItemIds = [];
    var approvers = [];


    var cartItems = new File('svcCartItem').getRecords('sdID="' + interactionID + '"');
    if (cartItems != null) {
        cartItems.each(function(cartItem) {
            cartItemIds.push(cartItem['cartItemId']);

        });
    }

    var query = "";
    if (cartItemIds != []) {

        query = "( file.name = \"svcCartItem\" and unique.key isin " + system.functions.str(cartItemIds) + ")";

    }

    if (query.length > 1) {
        query = query + " or ";

    }

    query = query + "( file.name = \"incidents\" and unique.key = \"" + interactionID + "\")";

    //      print(query);

    var approvals = new File("Approval").getRecords(query);
    var fields = ["file.name", "unique.key", "name", "approval.status", "current.pending.seq", "approvals.record"];
    var array_fields = ["current.pending.groups", "future.groups", "future.seq", "approved.groups", "approved.by", "approved.seq", "approved.action", "comments"];

    if (approvals != null) {

        approvals.each(function(approval) {
            var approvalInfoTmp = {};
            for (var i = 0; i < fields.length; i++) {
                if (approval[fields[i]]) {
                    approvalInfoTmp[fields[i]] = approval[fields[i]];
                }
            }

            for (var i = 0; i < array_fields.length; i++) {
                if (approval[array_fields[i]] && approval[array_fields[i]].length() > 0 && approval[array_fields[i]][0] != null) {
                    approvalInfoTmp[array_fields[i]] = lib.ArrayUtil.toJsArray(approval[array_fields[i]]);
                }


            }
            lib.ArrayUtil.addAllWithoutDuplicate(approvers, approvalInfoTmp["current.pending.groups"]);
            lib.ArrayUtil.addAllWithoutDuplicate(approvers, approvalInfoTmp["future.groups"]);


            if (approval["approved.date"] && approval["approved.date"].length() > 0 && approval["approved.date"][0] != null) {
                approvalInfoTmp["approved.date"] = [];
                for (var i = 0; i < approval["approved.date"].length(); i++) {
                    //            print(approval["approved.date"][i]);
                    approvalInfoTmp["approved.date"].push(approval["approved.date"][i].toUTCString());
                }
            }



            approvalInfo["approvalInfo"].push(rteJSONStringify(approvalInfoTmp));


        });


    }

    if (approvers.length > 0) {
        var approvalGroups = [];
        var groupQuery = "name isin " + system.functions.str(approvers);

        
        var groups = new File("assignment").getRecords(groupQuery);
        if (groups != null) {

            groups.each(function(group) {
                //          		print(group["name"]);
                //          		print(lib.ArrayUtil.toJsArray(group["approvers"]));
                approvalGroups.push(group["name"]);
                approvalInfo["approvalGroupInfo"][group["name"]] = lib.ArrayUtil.toJsArray(group["approvers"]);

            });
        }
        var approverDelegationQuery = "DateTo > tod() and DateFrom < tod() and Enable = true and AppModule = \"SVC\" and Approver = AppGroup and Approver isin " + system.functions.str(approvers);
        
        var approverDeletgations = new File("ApprovalDelegation").getRecords(approverDelegationQuery);
        if (approverDeletgations != null) {

            approverDeletgations.each(function(approverDelegation) {
                
                if (null == approvalInfo["approvalDelegation"][approverDelegation["Approver"]]){
                    approvalInfo["approvalDelegation"][approverDelegation["Approver"]] = [];
                }
                approvalInfo["approvalDelegation"][approverDelegation["Approver"]].push(approverDelegation["Delegate"]);

            });
        }
        if(approvalGroups.length > 0 ){
        
            var groupDelegationQuery = "DateTo > tod() and DateFrom < tod() and Enable = true and AppModule = \"SVC\" and Approver <> AppGroup and AppGroup isin " + system.functions.str(approvalGroups);
	        var groupDeletgations = new File("ApprovalDelegation").getRecords(groupDelegationQuery);
	        if (groupDeletgations != null) {
	
	            groupDeletgations.each(function(groupDeletgation) {
	                
	                if (null == approvalInfo["approvalDelegation"][groupDeletgation["AppGroup"]]){
	                    approvalInfo["approvalDelegation"][groupDeletgation["AppGroup"]] = [];
	                }
	                approvalInfo["approvalDelegation"][groupDeletgation["AppGroup"]].push(groupDeletgation["Delegate"]);
	
	            });
	        }
        
        }
        


    }

    return approvalInfo;

}


//  _getInteractionApprovalInfo("SD10312");