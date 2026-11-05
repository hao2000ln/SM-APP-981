/** @fileoverview svcCatalog - contains functions used by the Service Catalog module
 *   @author Pete Budic
 */

var Underscore = lib.Underscore.require();


function hasParents(list) {
    return list != null && list.length > 0;
}


/**  This function is called to check for any possible recursion in the category structure
 * 	of a specific Service Catalog item.  It is called by passing the name of the Catalog Item
 *   and a list of its immediate parent categories, and returns true if the category structure
 *   is valid and false if the structure causes recursion.
 *
 *	@param {String} name	-  The name of the Service Catalog Entry
 *	@param {Array}	parents	-	The immediate parent categories of this Entry
 *	@return True for a valid category structure and false for a recursive structure.
 *	@type Boolean
 */
function checkRecursion(name, parents) {
    var nextParent;
    var current = name;
    var parent_tree = [];
    var parent_list = [];
    var sql;
    if (parents == null) {
        return true;
    }
    parent_tree[0] = current;

    var lng = parents.length;

    var i;
    for (i = 0; i < lng; i++) {
        if (parents[i] != null) {
            parent_tree[i + 1] = parents[i];
            parent_list[i] = parents[i];
        }
    }

    do {
        if (hasParents(parent_list)) {
            parent_list = getParents(parent_list);
            if (hasParents(parent_list)) {
                //if ( intersect( parent_tree, parent_list ) )
                if (isInOriginal(name, parent_list) || isInOriginal(name, parents)) {
                    return false;
                } else {
                    var j;
                    for (j = 0; j < parent_list.length; j++) {
                        lng = parent_tree.length;
                        parent_tree[lng] = parent_list[j];
                    }
                }
            }
        }
    }
    while (hasParents(parent_list));

    return true;
}

/**  This function gets all the parent Categories for a list of given categories.
 *
 *	@param	{Array}	parents 	- An array of Strings containing a list of category names.
 *	@return A list of parents created from the parents of each category in the passed in list.
 *	@type 	Array
 */
function getParents(parents) {
    if (parents == null) {
        return null;
    }
    var parent_list = [];
    var scParents = "{";
    var max = parents.length;

    var x;
    for (x = 0; x < max; x++) {
        if (parents[x] != null) {
            if (x > 0) {
                scParents += ",";
            }
            scParents += "\"" + parents[x] + "\"";
        }
    }
    scParents += "}";

    var cat = new SCFile("svcCatalog", SCFILE_READONLY);
    cat.setFields(["parent"]);
    var sql = "name isin " + scParents;

    if (cat.doSelect(sql) == RC_SUCCESS) {
        do {
            if (cat.parent != null) {
                var i;
                var length = cat.parent.length();
                for (i = 0; i < length; i++) {
                    var l = parent_list.length;
                    parent_list[l] = cat.parent[i];
                }
            }

        }
        while (cat.getNext() == RC_SUCCESS);
    }

    return parent_list;
}

/**  This function is used to determine if there is at least one common
 *	value in two separate arrays.
 *
 *	@param	{Array}	array1 - The first array for comparison.
 *	@param	{Array} array2 - The second array for comparison.
 *	@return	True if the two arrays have at least one common value, false if they do not.
 *	@type	Boolean
 */
function intersect(array1, array2) {
    var i;
    var j;
    for (i = 0; i < array1.length; i++) {
        for (j = 0; j < array2.length; j++) {
            if (array1[i] == array2[j] && array1[i] != null && array2[j] != null) {
                return true;
            }
        }
    }

    return false;
}

/**  This function is used to determine if a specific category name is contained in a list
 *	of category names.
 *
 *	@param	{String}	name 	- The specific category name to be compared against.
 *	@param	{Array}		array	- The array of category names to compare against.
 *	@return	True if the category is contained in the list, false if it is not.
 *	@type	Boolean
 */
function isInOriginal(name, array) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (name == array[i]) {
            return true;
        }
    }

    return false;
}

/**	This function is used to check for any possible recursion in the structure of 
 *	Service Catalog entries in a bundle.  If the bundle contains other bundles there
 *	is a chance that the contained bundle will eventually call the original bundle.
 *
 *	@param	{String}	name	- The name of the bundle to check.
 *	@param	{Array}		items 	- The list of items in the Bundle.
 *	@return		False if there is any recursion in the bundle structure, true if there is not.
 *	@type	Boolean
 */
function checkCollectionRecursion(name, items) {
    var parents = [];
    if (items != null) {
        parents = items.toArray();
    }

    var current = name;
    var parent_tree = [];
    var parent_list = [];
    var sql;

    parent_tree[0] = current;

    if (parents != null) {
        var lng = parents.length;
    }

    var i;
    for (i = 0; i < lng; i++) {
        if (parents[i] != null) {
            parent_tree[i + 1] = parents[i];
            parent_list[i] = parents[i];
        }
    }
    if (isInOriginal(name, parent_list) || isInOriginal(name, parents)) {
        return false;
    }

    do {
        if (hasParents(parent_list)) {
            parent_list = getCollectionItems(parent_list);
            if (hasParents(parent_list)) {
                //if ( intersect( parent_tree, parent_list ) )
                if (isInOriginal(name, parent_list) || isInOriginal(name, parents)) {
                    return false;
                } else {
                    var j;
                    for (j = 0; j < parent_list.length; j++) {
                        var len = parent_tree.length;
                        parent_tree[len] = parent_list[j];
                    }
                }
            }
        }
    }
    while (hasParents(parent_list));
    return true;
}

/**	This function takes a list of Service Catalog items, determines which of them
 *	are bundles, and returns all items that are in any of these bundles.
 *
 *	@param	{Array}		items	- The list of Service Catalog items to check.
 *	@return		An array of bundles that belong to the original bundles.
 *	@type	Array
 */
function getCollectionItems(items) {
    if (items == null) {
        return null;
    }
    var parent_list = [];
    var scParents = "{";
    var max = items.length;

    var x;
    for (x = 0; x < max; x++) {
        if (items[x] != null) {
            if (x > 0) {
                scParents += ",";
            }
            scParents += "\"" + lib.QueryHelper.querySafe(items[x]) + "\"";
        }
    }
    scParents += "}";

    var item = new SCFile("svcCatalog", SCFILE_READONLY);
    item.setFields(["bundle"]);
    var sql = "name isin " + scParents + " and type=\"bundle\"";

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            var i;
            var length = item.bundle.length();
            for (i = 0; i < length; i++) {
                var l = parent_list.length;

                parent_list[l] = item.bundle[i].item_name;
            }
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return parent_list;
}

/**  This function is used to set the specific sort value for a record.  This value
 * 	is used for sorting only.
 *	 	1 - Category
 *		2 - Bundle
 *		3 - Item
 *	@param	{Record}  record  - The svcCatalog record.
 *	@return		The value of the sort type
 *	@type	Decimal
 */
function setSortValue(record) {
    if (record.type == "bundle") {
        return 2;
    }
    if (record.type == "item") {
        return 3;
    }

    return 1;
}

/**  This function is used to update the cart items with the ID of the 
 * 	interaction that is associated to the cart.  This is done so that the
 *	cart items can be shown in a virtual join to the interaction directly.
 *
 *	@param {Record} record - The current svcCart record
 *	@param {Record} oldrecord - The copy of the svcCart before changes
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function updateCartItems(record, oldrecord) {
    if (record.sdID != oldrecord.sdID) {
        var item = new SCFile("svcCartItem");
        var sql = "cartId =" + record.cartId;

        if (item.doSelect(sql) == RC_SUCCESS) {
            do {
                item.sdID = record.sdID;
                item.doUpdate();
            }
            while (item.getNext() == RC_SUCCESS);
        }
    }

    return true;
}

/**  This function is used to ensure that catalog items that use the 
 *	Service Management connector (Interaction) are marked as "One-click" items.
 *
 *	@param {Record} record - The current svcCatalog record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function setOneClick(record) {
    if (record.interface_type == "Interaction") {
        if (record.non_cart != true) {
            var msg = funcs.scmsg(140, "ScriptLibrary");
            record.non_cart = true;
            print(msg);
        }
    }
}

/**  This function is used to ensure that catalog items that are specified as non-cart items
 *	 only belong to non-cart categories and that service catalog items that are not non-cart
 *    ones don't belong to any non-cart categories.
 *
 *	@param {Record} record - The current svcCatalog record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function validateOneClick(record) {
    var bSucc = true;
    var parent = record.parent;
    if (parent.length() > 0) {
        var itemType = "standard";
        if (record.support_item == true) {
            itemType = "support";
        } else if (record.non_cart == true) {
            itemType = "non-cart";
        }

        var sql = "name isin " + funcs.str(parent);

        var file = new SCFile("svcCatalog", SCFILE_READONLY);
        var rtnCode = file.doSelect(sql);
        while (rtnCode == RC_SUCCESS) {
            var thisType = "standard";
            if (file.support_item == true) {
                thisType = "support";
            } else if (file.non_cart == true) {
                thisType = "non-cart";
            }

            if (itemType != thisType) {
                print(funcs.scmsg("141", "ScriptLibrary", [file.name, itemType]));
                bSucc = false;
            }

            rtnCode = file.getNext();
        }
    }
    return bSucc;
}

/**  This function is used to get the total cost adjustment for all selected options
 *
 *	@param {Record} record - The current svcCatalog record
 *	@return		The total cost adjustment.
 *	@type	Number
 */
function getTotalOptionCost(cartItem, catalogItem) {
    var select = "select";
    var checkbox = "checkbox";
    var total = 0;

    var optionXML = new XML();

    if (cartItem.options != null && cartItem.options != "") {
        if (optionXML.setContent(cartItem.options)) {
            var costXML = new XML();
            if (catalogItem.option_costs != null && catalogItem.option_costs) {
                if (costXML.setContent(catalogItem.option_costs)) {
                    var node = optionXML.getFirstChildElement();
                    while (node != null) {
                        if (node.getName() == select || node.getName() == checkbox) {
                            var id = node.getAttributeValue("id");
                            var value = node.getValue();
                            //The blank here should not be replaced. Otherwise, the value with blank cannot be retrieved
                            var costNode = lib.xmlHelpers.getElement(costXML, id, "id");
                            if (costNode != null) {

                                var costOption = costNode.getFirstChildElement();
                                var cont = true;
                                while (costOption != null && cont) {
                                    if (costOption.getValue() == value) {
                                        var costadj = parseFloat(costOption.getAttributeValue("costadj"));

                                        if (!isNaN(costadj)) {
                                            total += costadj;
                                        }
                                        cont = false;
                                    }
                                    costOption = costOption.getNextSiblingElement();
                                }
                            }

                        }
                        node = node.getNextSiblingElement();
                    }

                }
            }
        }
    }

    return total;
}

/**  This function is used to get the total cost adjustment for all selected options
 *
 *	@param {String} options - the XML string containing the options for the current bundle item.
 *	@param {Record} catalogItem - The current svcCatalog record
 *	@return		The total cost adjustment.
 *	@type	Number
 */
function getTotalBundleOptionCost(options, catalogItem) {
    if (options != null && options != "") {
        var item = new SCFile("svcCartItem", SCFILE_READONLY);
        item.options = options;

        var cost = getTotalOptionCost(item, catalogItem);

        return cost;
    }
    return 0;
}

/**  This function is used to get the total cost for a shopping cart by totalling the cost of all the associated cart items
 *
 *	@param {Record} cart - The current cart record
 *	@return		The total cost.
 *	@type	Number
 */
function getCartCost(cart) {
    var item = new SCFile("svcCartItem", SCFILE_READONLY);
    var sql = "cartId=" + cart.cartId;
    var total = 0;

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            //	    	if ( item.cost != null )
            //	    		var itemCost = (item.unit_cost	* item.quantity );

            total += (item.unit_cost * item.quantity);
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return total;
}

/**  This function is used to determine if the entire request is requested for someone else other than 
 *	 the requester. If that is the case then that person is made the requested for in the interaction.
 *    If there's more than one requested for in the items then we just leave it alone.
 *
 *	@param {Number} cartId - the unique id for this shopping cart.
 *	@param {String} cartOwner - the name of the shopping cart owner.
 *	@return		The name of the person that this cart is requested for.
 *	@type	String
 */
function getIncidentRequestedFor(cartId, cartOwner) {
    var cartItems = new SCFile("svcCartItem", SCFILE_READONLY);

    if (cartItems.doSelect("cartId=" + cartId) == RC_SUCCESS) {
        var strCurrentItemRequestedFor = cartItems.requested_for;

        do {
            if (strCurrentItemRequestedFor != cartItems.requested_for) {
                return cartOwner;
            }
        }
        while (cartItems.getNext() == RC_SUCCESS);
    }

    if (cartOwner != strCurrentItemRequestedFor) {
        return strCurrentItemRequestedFor;
    }

    return cartOwner;
}

/**  This function is used to set the values and display names for the categories in the category list
 *	 in Service Catalog forms for localization. If there is no display name for the name, then the 
 *    name is returned.
 *
 *	@param {Boolean} bNonCartFlag - Non-cart item?
 *   @param {String}  type - Service Catalog type
 *   @param {Boolean} bSupportFlag - Support item ?
 *   @param {Boolean} bActiveOnlyFlag - Select active service catalog only?
 */
function setListAndValuesOfCategories(bNonCartFlag, type, bSupportFlag, bActiveOnlyFlag) {
    vars.$L_valueCat = [];
    vars.$L_displayCat = [];

    var fjoinsvcDisplay = new SCFile("joinsvcDisplay", SCFILE_READONLY);
    var fields1 = ["name", "displayName"];
    fjoinsvcDisplay.setFields(fields1);

    var sql = getParentCategoriesQuery(bNonCartFlag, type, bSupportFlag, bActiveOnlyFlag);

    if (fjoinsvcDisplay.doSelect(sql) == RC_SUCCESS) {
        do {
            // Create the list for the values of the categories
            if (fjoinsvcDisplay.name != null && fjoinsvcDisplay.name != "") {
                vars.$L_valueCat = funcs.insert(vars.$L_valueCat, 0, 1, fjoinsvcDisplay.name);
            }

            if (fjoinsvcDisplay.displayName != null && fjoinsvcDisplay.displayName != "") {
                // Create the list for the displayed values of the categories based on the display name
                vars.$L_displayCat = funcs.insert(vars.$L_displayCat, 0, 1, fjoinsvcDisplay.displayName);

            } else if (fjoinsvcDisplay.name != null && fjoinsvcDisplay.name != "") {
                // Create the list for the displayed values of the categories based on the name
                vars.$L_displayCat = funcs.insert(vars.$L_displayCat, 0, 1, fjoinsvcDisplay.name);

            }
        }
        while (fjoinsvcDisplay.getNext() == RC_SUCCESS);

        //The RTE's sort will maintain the positional relationship between the value and display arrays
        vars.$L_tempGrid = [];
        if (vars.$L_valueCat != null && funcs.lng(vars.$L_valueCat) > 0) {
            vars.$L_tempGrid = funcs.insert(vars.$L_tempGrid, 0, 1, vars.$L_valueCat);
        }
        if (vars.$L_displayCat != null && funcs.lng(vars.$L_displayCat) > 0) {
            vars.$L_tempGrid = funcs.insert(vars.$L_tempGrid, 0, 1, vars.$L_displayCat);
        }
        var retCode = new SCDatum();
        if (vars.$L_tempGrid != null && funcs.lng(vars.$L_tempGrid) > 0) {
            funcs.rtecall("sort", retCode, vars.$L_tempGrid, 0, 0);
            vars.$L_valueCat = vars.$L_tempGrid[0];
            vars.$L_displayCat = vars.$L_tempGrid[1];
        }
    }

    return true;
}

/**  
 *    This function return a SQL query conditon setence for parent categories based on the parameter passed in.
 *
 *	@param {Boolean} bNonCartFlag - Non-cart item?
 *   @param {String}  type - Service Catalog type
 *   @param {Boolean} bSupportFlag - Support item ?    
 *   @param {Boolean} bActiveOnlyFlag - Select active service catalog only?
 *   @return The qeury condition for parent categories list
 */
function getParentCategoriesQuery(bNonCartFlag, type, bSupportFlag, bActiveOnlyFlag) {
    var sql = "type=\"category\"";

    if (!bNonCartFlag) {
        sql += " and (non.cart=NULL or non.cart=false)";
    } else if (bNonCartFlag) {
        sql += " and non.cart=true";

        if (bSupportFlag) {
            sql += " and support.item=true";
        } else if (bSupportFlag == false) {
            sql += " and (support.item=NULL or support.item=false)";
        }
    }

    // Filter list by type: parent of a  category    should be category contains sub-category;
    //                      parent of an item/bundle should be category contains item/bundle
    if (type != null && type.length > 0) // If a specified query is passed, use it.
    {
        if (type == "bundle") // item/bundle belong to same category.type: item
        {
            type = "item";
        }
        sql = sql + " and category.type=\"" + type + "\"";
    }

    if (bActiveOnlyFlag) {
        sql += " and active=true";
    }

    return sql;
}

/**  This function is used to set the values and display names for the items in a bundle components
 *	 in Service Catalog forms for localization. If there is no display name for the name, then the 
 *    name is returned.
 *
 *	@type	Boolean
 */
function setListAndValuesOfBundleItems(name) {
    var fjoinsvcDisplay = new SCFile("joinsvcDisplay", SCFILE_READONLY);
    fjoinsvcDisplay.setFields(["bundle", "syslanguage"]);
    var sql = "type=\"bundle\" and name=\"" + name + "\"";

    if (fjoinsvcDisplay.doSelect(sql) == RC_SUCCESS) {
        var item;
        var len = funcs.lng(fjoinsvcDisplay.bundle);

        var i;
        for (i = 0; i < len; i++) {
            item = lib.dynamicFormGenerator.getLocalizedName(fjoinsvcDisplay.bundle[i].item_name, fjoinsvcDisplay.syslanguage);

            // Create the list for the values of the items in the bundle
            vars.$L_valueItem = funcs.insert(vars.$L_valueItem, 0, 1, fjoinsvcDisplay.bundle[i].item_name);

            // Create the list for the displayed values of the items in the bundle
            if (item != null && item != "") {
                vars.$L_displayItem = funcs.insert(vars.$L_displayItem, 0, 1, item);
            } else {
                vars.$L_displayItem = funcs.insert(vars.$L_displayItem, 0, 1, fjoinsvcDisplay.bundle[i].item_name);
            }
        }
    }
    return true;
}

/**	This fuction will return the currency of the passed in catalog item. We need this because the join
 *   won't always have the currency.
 *
 *	@param {joinsvcDisplay} catalog
 *	@return		The currency code
 *	@type	String
 */
function getCatCurrency(catID) {
    var fCat = new SCFile("svcCatalog", SCFILE_READONLY);
    if (fCat.doSelect("name=\"" + catID + "\"") == RC_SUCCESS) {
        if (fCat.currency != null && fCat.currency != "") {
            return fCat.currency;
        }
    }
    return system.vars.$G_root_currency;
}

/**	
 *   This fuction will return the currency of the passed in catalog item id.
 *
 *	@param  catalog id
 *	@return The currency code
 *	@type	String
 */
function getCatCurrencyByID(catalogID) {
    var fCat = new SCFile("svcCatalog", SCFILE_READONLY);
    if (fCat.doSelect("id=\"" + catalogID + "\"") == RC_SUCCESS) {
        if (fCat.currency != null && fCat.currency != "") {
            return fCat.currency;
        }
    }
    return system.vars.$G_root_currency;
}

function rebuildCategoriesGL(non_cart) {
    var strGLName = "";
    if (non_cart) {
        strGLName = "Service Catalog NonCart Categories";
    } else {
        strGLName = "Service Catalog Categories";
    }
    setListAndValuesOfCategories(non_cart, null, null, true);
    var fgloballists = new SCFile("globallists");
    var sql = "name=\"" + strGLName + "\"";
    if (fgloballists.doSelect(sql) == RC_SUCCESS) {
        fgloballists.value_list = vars.$L_valueCat;
        fgloballists.display_list = vars.$L_displayCat;
        var ret;
        funcs.rtecall("trigger", ret, 0);
        fgloballists.doUpdate();
        funcs.rtecall("trigger", ret, 1);
    }
}

/**	
 *   This fuction is to check if depending options in bracket[] in query does exist or not
 *
 *	@param {query} - statement
 *	@param {optionXML} 	-	the xml String containing the option information
 *	@return An array of unexisted depending options
 *	@type array
 */
function checkDependQuery(query, optionXML) {
    var dependFields = getDependOption(query);
    var xml = new XML();
    result = [];
    if (xml.setContent(optionXML)) {
        var i;
        for (i = 0; i < dependFields.length; i++) {
            var element = lib.xmlHelpers.getElement(xml, dependFields[i], "id");
            if (element == null) {
                result.push(dependFields[i]);
            }
        }
    }

    return result;
}

/**	
 *   This fuction will return all depended options in bracket [] in query
 *	Brackets in double quotation mark should not be checked
 *
 *	@param {query} - statement
 *	@return An array depending options
 *	@type array
 */
function getDependOption(query) {
    var reg = /\"(.*?)\"/gi; //regular expression for finding out double quotation mark ""
    var subStringArr = [];
    var tmp;
    var firstBracketIndex = 0;
    var secondBracketIndex = 0;
    var result = [];
    while ((tmp = reg.exec(query)) != null) {
        firstBracketIndex = tmp.index;
        if (firstBracketIndex > 0) {
            subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
        }
        secondBracketIndex = firstBracketIndex + tmp[0].length;
        subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
    }

    if (secondBracketIndex != query.length) {
        subStringArr.push(query.substring(secondBracketIndex, query.length));
    }

    var i;
    for (i = 0; i < subStringArr.length; i++) {
        var tempstr = subStringArr[i];
        var tempResult;
        if (tempstr.charAt(0) != '"') {
            tempResult = getOptionInBrackets(tempstr);
        }
        result = result.concat(tempResult);
    }
    return result;
}

/**	
 *   This fuction will return all depended options in bracket [] in query
 *
 *	@param {query} - statement
 *	@return An array depending options
 *	@type array
 */
function getOptionInBrackets(query) {
    var reg = /\[(.*?)\]/gi; //regular expression for find out bracket []
    var tmp;
    var result = [];
    while ((tmp = reg.exec(query)) != null) {
        result.push(tmp[1]);
    }
    return result;
}


/**	
 *   This fuction is to check if the option is depended by others
 *
 *	@param {svcCatalog} - catalog item file
 *	@param {id} - name of the user option
 *	@return The options is depended by others or not (true: is depended)
 *	@type boolean
 */
function checkFieldDepended(fCatalogItem, id) {
    var validationXML = new XML();
    var optionsXML = new XML();
    var query;
    var mandatory;
    var visible;
    var readonly;
    var dependFields;
    var node;
    var dependentMapping = [];

    //check validation for query and mandatory.
    validationXML.setContent(fCatalogItem['option.validations']);
    if (validationXML != null) {
        node = validationXML.getFirstChildElement();
        while (node != null) {
            query = node.getAttributeValue("query");
            mandatory = node.getAttributeValue("mandatory");

            if (mandatory != null) {
                dependFields = getDependOption(mandatory);

                if (lib.ArrayUtil.contains(dependFields, id)) {
                    return true;
                }
            }

            if (query != null) {
                dependFields = getDependOption(query);
                if (lib.ArrayUtil.contains(dependFields, id)) {
                    return true;
                }
            }

            node = node.getNextSiblingElement();
        }
    }

    //check option: for visible and readonly
    optionsXML.setContent(fCatalogItem['options']);

    if (optionsXML != null) {
        node = optionsXML.getFirstChildElement();
        while (node != null) {
            visible = node.getAttributeValue("visible");
            readonly = node.getAttributeValue("readonly");

            if (visible != null) {
                dependFields = getDependOption(visible);
                if (lib.ArrayUtil.contains(dependFields, id)) {
                    return true;
                }
            }
            if (readonly != null) {
                dependFields = getDependOption(readonly);
                if (lib.ArrayUtil.contains(dependFields, id)) {
                    return true;
                }
            }
            node = node.getNextSiblingElement();
        }
    }

    dependentMapping = getDependentMappings(fCatalogItem, id);
    if (dependentMapping.length > 0) {
        return true;
    }
    return false;
}

/**	
 *   This fuction is to get User option Names array which user options in optionNames array depends on.
 *
 *	@param {optionNames} - catalog item option Names
 *	@param {optionsXML} - catalog item options
 *	@param {optionValidationsXML} - catalog item option.validations
 *	@return The User option Names array which user options in optionNames array depends on
 *	@type Array
 */
function getDependOptions(optionNames, optionsXML, optionValidationsXML, fCatalogItem) {
    var dependFieldsArray = [];

    var dependFields;
    var optionsLength = lib.ArrayUtil.length(optionNames);

    for (i = 0; i < optionsLength; i++) {
        var fieldId = optionNames[i];
        //check validation for query and mandatory.
        var optionsElement = lib.dynamicFormGenerator.getElementById(optionsXML, fieldId);
        var optionValElement = lib.dynamicFormGenerator.getElementById(optionValidationsXML, fieldId);
        if (optionValElement != null) {

            if (optionValElement.getAttributeValue('matchScript')) {
                var paramList = lib.ExternalLookup.findParamNameList(optionValElement);
                var list = [];
                for (var k = 0; k < paramList.length; k++) {
                    var param = paramList[k];
                    if (lib.ExternalLookup.isOptionName(param)) {
                        list.push(lib.ExternalLookup.getOptionName(param));
                    }
                }

                lib.ArrayUtil.addAllWithoutDuplicate(dependFieldsArray, list);
            }

            query = optionValElement.getAttributeValue("query");
            mandatory = optionValElement.getAttributeValue("mandatory");
            if (mandatory != null && mandatory != "") {
                dependFields = getDependOption(mandatory);
                lib.ArrayUtil.addAllWithoutDuplicate(dependFieldsArray, dependFields);
            }

            if (query != null && query != "") {
                dependFields = getDependOption(query);
                lib.ArrayUtil.addAllWithoutDuplicate(dependFieldsArray, dependFields);
            }
        }
        //check option: for visible	
        if (optionsElement != null) {
            visible = optionsElement.getAttributeValue("visible");
            if (visible != null && visible != "") {
                dependFields = getDependOption(visible);
                lib.ArrayUtil.addAllWithoutDuplicate(dependFieldsArray, dependFields);

            }
        }
        //check defaule value 
        dependFields = lib.svcCatalog.getDependbyMappings(fCatalogItem, fieldId);
        lib.ArrayUtil.addAllWithoutDuplicate(dependFieldsArray, dependFields);
    }

    return dependFieldsArray;
}

/**	
 *   This function is to get User option Names array which user options in dependOptions array recursively depends on.
 *
 *	@param {dependOptions} - catalog item option Names to calculate the dependent User options
 *	@param {optionNames} - catalog item option Names Array holding the whole recursively dependent User Options.
 *	@param {optionsXML} - catalog item options
 *	@param {optionValidationsXML} - catalog item option.validations
 *	@return The User option Names array which user options in dependOptions array depends on
 *	@type Array
 */
function addDependOptions(dependOptions, optionNames, optionsXML, optionValidationsXML, fCatalogItem) {
    lib.ArrayUtil.addAllWithoutDuplicate(optionNames, dependOptions);

    if (lib.ArrayUtil.length(dependOptions) > 0) {

        var aDependOptions = getDependOptions(dependOptions, optionsXML, optionValidationsXML, fCatalogItem);

        var optionNames_length = lib.ArrayUtil.length(optionNames);

        for (i = 0; i < optionNames_length; i++) {
            aDependOptions = Underscore.without(aDependOptions, optionNames[i]);
        }

        if (aDependOptions.length > 0) {
            return addDependOptions(aDependOptions, optionNames, optionsXML, optionValidationsXML, fCatalogItem);
        } else {
            optionNames = sortOptionsByOriginal(optionNames, fCatalogItem['option.names']);
            return optionNames;
        }
    }
}

/***
 * This function is used  to sort the optionNames in the template to be consistent with those in catalog.
 * @optionNames [C,A,B]
 * @originalOptions [A,B,C,D,E]
 * @sortedResults [A,B,C]
 */
function sortOptionsByOriginal(optionNames, originalOptions) {
    var util = lib.ArrayUtil;
    optionNames = util.toJsArray(optionNames);
    originalOptions = util.toJsArray(originalOptions);
    if (!optionNames || !originalOptions || originalOptions.length < optionNames.length) {
        return optionNames;
    }
    var i;
    var len = originalOptions.length;
    var sortedResults = [];
    for (i = 0; i < len; i++) {
        if (util.contains(optionNames, originalOptions[i])) {
            sortedResults.push(originalOptions[i]);
        }
    }
    return util.toSCDatum(sortedResults)
}

/**	
 *   This fuction is to get the dependent option of user option with id
 *
 *	@param {svcCatalog} - catalog item file
 *	@param {id} - name of the user option
 *	@return The Array of dependent options 
 */
function getDependentOptions(fCatalogItem, id) {

    var dependentFieldsArray = [];
    var validationXML = new XML();
    var optionsXML = new XML();
    var query;
    var mandatory;
    var visible;
    var readonly;
    var dependFields;
    var node;
    var mappingDependent = [];

    var paramId = '[' + id + ']';

    //check validation for query and mandatory.
    validationXML.setContent(fCatalogItem['option.validations']);
    if (validationXML != null) {
        node = validationXML.getFirstChildElement();
        while (node != null) {
            query = node.getAttributeValue("query");
            mandatory = node.getAttributeValue("mandatory");
            aId = node.getAttributeValue("id");

            if (node.getAttributeValue('matchScript')) {
                var paramList = lib.ExternalLookup.findParamNameList(node);
                for (var k = 0; k < paramList.length; k++) {
                    var param = paramList[k];
                    if (param == paramId) {
                        dependentFieldsArray.push(aId);
                    }
                }
            }

            if (mandatory != null) {
                dependFields = getDependOption(mandatory);

                if (lib.ArrayUtil.contains(dependFields, id)) {
                    dependentFieldsArray.push(aId);
                }
            }

            if (query != null) {
                dependFields = getDependOption(query);

                if (lib.ArrayUtil.contains(dependFields, id)) {
                    dependentFieldsArray.push(aId);
                }
            }

            node = node.getNextSiblingElement();
        }
    }

    //check option: for visible and readonly
    optionsXML.setContent(fCatalogItem['options']);

    if (optionsXML != null) {
        node = optionsXML.getFirstChildElement();
        while (node != null) {
            visible = node.getAttributeValue("visible");
            readonly = node.getAttributeValue("readonly");
            aId = node.getAttributeValue("id");

            if (visible != null) {
                dependFields = getDependOption(visible);

                if (lib.ArrayUtil.contains(dependFields, id)) {
                    dependentFieldsArray.push(aId);
                }
            }

            if (readonly != null) {
                dependFields = getDependOption(readonly);
                if (lib.ArrayUtil.contains(dependFields, id)) {
                    dependentFieldsArray.push(aId);
                }
            }

            node = node.getNextSiblingElement();
        }
    }
    //dependent by default value mappings
    mappingDependent = getDependentMappings(fCatalogItem, id);
    dependentFieldsArray = lib.ArrayUtil.merge(mappingDependent, dependentFieldsArray);
    return dependentFieldsArray;
}

/**
 * Count query number of joinsvcDisplay records.
 * Use JS to improve query performance, threr is a known performance issue in RAD count panel for join file.
 *
 * @param		{String}
 * @returns	{Number}
 */
function countSvcDisplay(query) {
    return lib.c.$("joinsvcDisplay", SCFILE_READONLY).setFields(["name"]).count(query);
}


function validateRegex(line) {
    try {
        var match = new RegExp(line).test('a');
    } catch (e) {
        return funcs.scmsg('1564', 'fc');
    }

    var regList = [
        /\(.\+\)\+/,
        /\((.)\|\1{2}\)\+/,
        /\((.)\|\1\?\)\+/,
        /\(\[[\-a-zA-Z0-9]+\]\+\)\*/
    ];

    var sampleList = [
        '(a+)+',
        '(a|aa)+',
        '(a|a?)+',
        '([a-zA-Z]+)*',
        '(.*a){x} | for x > 10'
    ];


    for (var i = 0; i < regList.length; i++) {
        var regex = regList[i];
        if (regex.test(line)) {
            return funcs.scmsg('1563', 'fc', [sampleList[i]]);
        }
    }

    var regex = /\(\.\*[0-9a-zA-Z]\)\{(.+)\}/;
    var matchList = regex.exec(line);
    if (null != matchList) {
        var x = +matchList[1];
        if (x > 10) {
            return funcs.scmsg('1563', 'fc', [sampleList[4]]);
        }
    }

    return null;
}

/** 
 *   This fuction is to get the dependent option of user option with id
 *
 *   @param {svcCatalog} - catalog item file
 *   @param {id} - name of the user option
 *   @return The Array of dependent options 
 */
function getDvdvarDependentOptions(fCatalogItem, id) {

    var dependentFieldsArray = [];
    var optionsXML = new XML();
    var visible;
    var mandatory;
    var readonly;
    var visibleDependFields;
    var mandatoryDependFields;
    var readonlyDependFields;
    var node;
    var mappingDependent = [];

    //check option: for visible
    optionsXML.setContent(fCatalogItem['options']);

    if (optionsXML != null) {
        var contains = lib.ArrayUtil.contains;
        node = optionsXML.getFirstChildElement();
        while (node != null) {
            visible = node.getAttributeValue("visible");
            mandatory = node.getAttributeValue("mandatory");
            readonly = node.getAttributeValue("readonly");
            aId = node.getAttributeValue("id");
            if (visible != null) {
                visibleDependFields = getDependOption(visible);
                if (contains(visibleDependFields, id)) {
                    dependentFieldsArray.push(aId);
                }
            }
            if (mandatory != null) {
                mandatoryDependFields = getDependOption(mandatory);
                if (contains(mandatoryDependFields, id)) {
                    if (!contains(dependentFieldsArray, aId))
                        dependentFieldsArray.push(aId);
                }
            }
            if (readonly != null) {
                readonlyDependFields = getDependOption(readonly);
                if (contains(readonlyDependFields, id)) {
                    if (!contains(dependentFieldsArray, aId))
                        dependentFieldsArray.push(aId);
                }
            }
            node = node.getNextSiblingElement();
        }

        mappingDependent = getDependentMappings(fCatalogItem, id);
        dependentFieldsArray = lib.ArrayUtil.merge(mappingDependent, dependentFieldsArray);
    }

    return dependentFieldsArray;
}

/** 
 *   This fuction is to get the dependent option of user option with id
 *   @param {svcCatalog} - catalog item file
 *   @param {id} - name of the user option
 *   @return The Array of dependent options 
 */
function getDependentMappings(fCatalogItem, optionName) {
    var depend = [];
    var mappings = fCatalogItem['option.mappings'];
    if (mappings) {
        mappings = JSON.parse(mappings);
        var key;
        for (key in mappings) {
            try {
                var item = mappings[key];
                var i;
                var len = item.length;
                for (i = 0; i < len; i++) {
                    var kv = item[i];
                    var k;
                    for (k in kv) {
                        var conditions = kv[k];
                        var j;
                        var conditionLength = conditions.length;
                        for (j = 0; j < conditionLength; j++) {
                            var condition = conditions[j];
                            var con;
                            for (con in condition) {
                                if (optionName == con && depend.indexOf(key) == -1) {
                                    depend.push(key);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                getLog("getDependentMappings").info("item is not a Json..");
            }
        }
    }
    return depend;
}

function getDependbyMappings(fCatalogItem, optionName) {
    if (!fCatalogItem || !optionName) {
        return null;
    }
    var dependBy = [];
    var optionNames = fCatalogItem['option.names'];
    var mappings = fCatalogItem['option.mappings'];
    if (mappings) {
        var mapping = lib.dynamicFormValidation.getMapping(optionName, mappings);
        var mappingStr = JSON.stringify(mapping);
        var i;
        var index;
        var optionName;
        var len = optionNames.length();
        for (i = 0; i < len; i++) {
            optionName = optionNames[i];
            index = mappingStr.indexOf(optionName);
            if (index > -1) {
                dependBy.push(optionName);
            }
        }
    }
    return dependBy;
}