/**
 * @fileOverview  Provide the functions to Copy UserOption from svcCartItem to userOption Table
 * @author Mi Quan
 * @date Dec. 2014/4/25
 */


/**
 * @public
 * @description  copy useroption from svcCartItem to userOption table
 * @param {String} record - svcCartItem
 * @param {String} approverOld - Approver
 */
function syncSvcCartItemToUserOption(record) {

    var options = [];
    var isBundle = record.bundle;

    var ticketId = record.action_id;
    var svcCartId = record.cartId;
    var svcCartItemId = record.cartItemId;
    var catalogId = record.svcCatalogId;
    var catalogName = getCatalogNamebyId(catalogId);
    var interactionId = record.sdID;

    if (isBundle != null && isBundle == true) {
        updateToUserOption(ticketId, svcCartId, svcCartItemId, catalogName, catalogId,
            interactionId, "item options", "", [record.bundle_options], false);
    } else {
        options = getOptionsFromXml(record.options);
        var i;
        for (i = 0; i < options.length; i++) {
            updateToUserOption(ticketId, svcCartId, svcCartItemId, catalogName, catalogId,
                interactionId, options[i][0], options[i][1], options[i][2], options[i][3], options[i][4], options[i][5]);
        }
    }
}


/**
 * @private
 * @description  copy useroption from svcCartItem to userOption table
 * @param {String} catalogId - service catalog Id
 * @return {String} svcCatalog Name - svcCatalog Name
 */
function getCatalogNamebyId(catalogId) {

    var sql = "id=" + catalogId;
    var svcCatalog = new SCFile("svcCatalog", SCFILE_READONLY);
    svcCatalog.setFields("name");
    var rc = svcCatalog.doSelect(sql);

    if (rc == RC_SUCCESS) {
        return svcCatalog.name;
    } else {
        return null;
    }
}


/**
 * @private
 * @description  generate  useroption record
 * @param {String} ticketId - TicketId
 * @param {String} svcCartId - svcCart Id
 * @param {String} svcCartItemId - svcCartItem Id
 * @param {String} catalogName - service catalog Name
 * @param {String} catalogId - service catalog Id
 * @param {String} InteractionId - Interaction Id
 * @param {String} optionName - User Option name
 * @param {String} optionLabel - User Option label
 * @param {Array} optionValue - User Option value
 * @param {Booelean} isMulti - Whether the value isMulti
 */
function updateToUserOption(ticketId, svcCartId, svcCartItemId, catalogName, catalogId,
    InteractionId, optionName, optionLabel, optionValue, isMulti, optionType, optionIndex) {

    var userOption = new SCFile("userOption");

    userOption.Ticket_ID = ticketId;
    userOption.svcCart_ID = svcCartId.toString();
    userOption.svcCart_Item_ID = svcCartItemId.toString();
    userOption.CatalogItem_Name = catalogName;
    userOption.CatalogItem_ID = catalogId.toString();
    userOption.Interaction_ID = InteractionId.toString();
    userOption.Option_Name = optionName;
    userOption.Option_Label = optionLabel;
    userOption.Option_Value = optionValue;
    userOption.IsMulti = isMulti;
    userOption.Option_Type = optionType;
    userOption.Option_Index = optionIndex;

    userOption.doSave();
}


/**
 * @private
 * @description  Parse User Option xml. Return Structure:optionName,OptionLable, OptionValue.
 * @param {String} xml - UserOpiton XMl
 * @return {Array} result - Structure:optionName,OptionLable, OptionValue.
 */
function getOptionsFromXml(xml) {

    var xmlObject = new XML();
    xmlObject.setContent(xml);
    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    var node = form.getFirstChildElement();

    var result = [];
    var label;
    var id;
    var vtemp;
    var type;
    var index = 0;

    while (node != null) {

        var line = [];
        var value = [];
        var isMulti = false;

        vtemp = node.getValue();
        id = node.getAttributeValue("id");
        label = node.getAttributeValue("label");

        if (node.getAttributeValue("multiSelections") != null && node.getAttributeValue("multiSelections") != "") {
            value = vtemp.split("\n");
            isMulti = true;
        } else {
            value.push(vtemp);
        }

        type = node.getAttributeValue("type");
        line[0] = id;
        line[1] = label;
        line[2] = value;
        line[3] = isMulti;
        line[4] = type;
        line[5] = index;
        result.push(line);
        node = node.getNextSiblingElement();
        index++;
    }
    //print("result"+result); 
    return result;
}


function initFileFields(tableName) {
    vars.$fieldValueList = [];
    vars.$fieldDisplayList = [];

    if (tableName !== "" && tableName !== null && tableName !== undefined) {
        var valueList = [];
        var displayList = [];
        var fieldName = "";
        var caption = "";
        var captionStr = "";
        var smDatadict = lib.dbdictHelper.initDatadictFile(tableName);
        var smFile = lib.dbdictHelper.initDbdictFile(tableName);
        var fieldList = smDatadict.fields;
        var sysFieldType = smDatadict.sysFieldType;
        var avail = smDatadict.avail;
        var invisible = smDatadict.invisible;
        var captions = smDatadict.captions;
        var len = funcs.lng(fieldList);
        var displayLable = lib.DisplayName.getDisplayLable(tableName);

        var i;
        for (i = 0; i < len; i++) {
            fieldName = fieldList[i];
            if (sysFieldType[i] !== 4 && avail[i] === true && invisible !== true) {
                if (!lib.DisplayName._isAlias(smFile, fieldName) || displayLable == fieldName) {
                    valueList.push(fieldName);
                    caption = captions[i];
                    //support localization
                    captionStr = funcs.scmsg(caption, "sccaption");
                    if (captionStr.indexOf("Could not be found") === -1) {
                        caption = captionStr;
                    }
                    displayList.push(caption);
                }
            }
        }

        //sort array a~z
        var temp = new SCDatum(8);
        temp.push(valueList);
        temp.push(displayList);
        var retcode = new SCDatum();
        funcs.rtecall("sort", retcode, temp, 0, 0);
        valueList = temp[0];
        displayList = temp[1];
        vars.$fieldValueList = valueList;
        vars.$fieldDisplayList = displayList;
    }
}


/**
 * Get option display value
 *
 * @param	 {String}	options
 * @returns {Object}	key: option id, value: display value
 */
function getOptionDisplayValues(options) {

    if (options == null || options.length == 0) {
        return {};
    }

    var xmlObject = new XML();
    xmlObject.setContent(options);
    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    if (form == null) {
        return {};
    }

    var displayValues = {};

    var node;
    for (node = form.getFirstChildElement(); node != null; node = node.getNextSiblingElement()) {
        var id = node.getAttributeValue("id");
        var hasDisplay = node.getAttributeValue("hasdisplay");
        var display = node.getAttributeValue("display"); // display for single selection
        var display1 = node.getAttributeValue("display1"); // display1 for multiple selection
        if (hasDisplay == "true") {
            if (display != null && display.length > 0) {
                displayValues[id] = display;
            } else if (display1 != null && display1.length > 0) {
                displayValues[id] = display1;
            }
        }
    }

    return displayValues;
}