/** @fileoverview svcCatalogTriggers - contains functions used by the Service Catalog module relating to triggers
 *   @author Pete Budic
 */

/**  This function is used when deleting a Service Catalog category.  
 *	It will select any item/bundle/category that had the category being deleted
 *	as a parent and remove it from the parent array.
 *
 *	@param {Record} record - The current category record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function removeDeletedCategory(record) {
    var item = new SCFile("svcCatalog");
    var sql = "parent =\"" + lib.QueryHelper.querySafe(record.name) + "\"";
    var name = record.name;
    var update;

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            update = false;
            var i;
            var length = item.parent.length();
            for (i = 0; i < length; i++) {
                if (item.parent[i] == name) {
                    item.parent[i] = null;
                    update = true;
                }
            }
            if (update == true) {
                item.doUpdate();
            }
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return true;
}

/**  This function is used when renaming a Service Catalog category.  
 *	It will select any item/bundle/category that had the category being renamed
 *	as a parent and update it in the parent array.
 *
 *	@param {Record} record - The current category record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function renameCategory(record, oldrecord) {
    var item = new SCFile("svcCatalog");
    var sql = "parent =\"" + lib.QueryHelper.querySafe(oldrecord.name) + "\"";
    var oldname = oldrecord.name;
    var name = record.name;
    var update;

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            update = false;
            var i;
            var length = item.parent.length();
            for (i = 0; i < length; i++) {
                if (item.parent[i] == oldname) {
                    item.parent[i] = name;
                    update = true;
                }
            }
            if (update == true) {
                item.doUpdate();
            }
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return true;
}

/**  This function is used when renaming a Service Catalog item or bundle.  
 *	It will select any bundle that contains the item/bundle being renamed
 *	and update it with the new name
 *
 *	@param {Record} record - The current item/bundle record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function renameItem(record, oldrecord) {
    var item = new SCFile("svcCatalog");
    var sql = "item.name =\"" + lib.QueryHelper.querySafe(oldrecord.name) + "\"";
    var oldname = oldrecord.name;
    var name = record.name;
    var update;

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            update = false;
            var i;
            var length = item.bundle.length();
            for (i = 0; i < length; i++) {
                if (item.bundle[i].item_name == oldname) {
                    item.bundle[i].item_name = name;
                    update = true;
                }
            }
            if (update == true) {
                item.doUpdate();
            }
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return true;
}

/**  This function is used when renaming a Service Catalog category, item or bundle.  
 *	It will select the image related to the category/item/bundle being renamed
 *	and update it with the new name
 *
 *	@param {Record} record - The current category/item/bundle record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function renameImage(record, oldrecord) {
    var image = new SCFile("SYSATTACHMENTS");
    var sql = "application=\"svcCatalog\" and topic =\"" + lib.QueryHelper.querySafe(oldrecord.name) + "\"";

    if (image.doSelect(sql) == RC_SUCCESS) {
        image.topic = record.name;
        image.doUpdate();
    }

    return true;
}

/**  This function is used when deleting a Service Catalog item or bundle.  
 *	It will select any bundle that contains the item/bundle being renamed
 *	and remove the deleted component.  It will also print a message to that effect.
 *
 *	@param {Record} record - The current item/bundle record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function removeItem(oldrecord) {
    var item = new SCFile("svcCatalog");
    var sql = "item.name =\"" + lib.QueryHelper.querySafe(oldrecord.name) + "\"";
    var name = oldrecord.name;
    var update;

    if (item.doSelect(sql) == RC_SUCCESS) {
        do {
            update = false;
            var i;
            var length = item.bundle.length();
            for (i = 0; i < length; i++) {
                if (item.bundle[i].item_name == name) {
                    item.bundle[i].item_name = null;
                    item.bundle[i].item_id = null;
                    item.bundle[i].item_option = null;
                    item.bundle[i].item_quantity = null;
                    update = true;
                }
            }
            if (update == true) {
                var msg = funcs.scmsg(142, "ScriptLibrary", [name, item.name]);
                print(msg);
                item.doUpdate();
            }
        }
        while (item.getNext() == RC_SUCCESS);
    }

    return true;
}

/**  This function is used to determine whether or not a category is being
 *	used as a parent category in any other catalog record.
 *
 *	@param {Record} record - The current category record
 *	@return		True if it is a parent, false if not.
 *	@type	Boolean
 */
function checkCategoryUsed(record) {
    var item = new SCFile("svcCatalog", SCFILE_READONLY);
    item.setFields("name");
    var sql = "parent =\"" + lib.QueryHelper.querySafe(record.name) + "\"";

    if (item.doSelect(sql) == RC_SUCCESS) {
        return true;
    }

    return false;
}

/**  This function is used to determine whether or not an item or bundle is being
 *	used as a component of another catalog bundle.
 *
 *	@param {Record} record - The current item or bundle record
 *	@return		True if it is a component of another bundle, false if not.
 *	@type	Boolean
 */
function checkItemUsed(record) {
    var item = new SCFile("svcCatalog", SCFILE_READONLY);
    item.setFields("name");
    var sql = "item.name =\"" + lib.QueryHelper.querySafe(record.name) + "\"";

    if (item.doSelect(sql) == RC_SUCCESS) {
        return true;
    }

    return false;
}

function refreshCategoriesGL(non_cart) {
    var strScheduleName = "";
    if (non_cart) {
        strScheduleName = "Refresh Service Catalog NonCart Categories GL";
    } else {
        strScheduleName = "Refresh Service Catalog Categories GL";
    }

    var fschedule = new SCFile("schedule");
    var sql = "name=\"" + strScheduleName + "\"";
    var theXMLDate = new XMLDate(new Date());

    if (fschedule.doSelect(sql) == RC_SUCCESS) {
        fschedule.expiration = theXMLDate.getDatum();
        fschedule.doUpdate();
    } else {
        fschedule.name = strScheduleName;
        fschedule["class"] = "lister";
        fschedule.expiration = theXMLDate.getDatum();
        fschedule.javascript = "lib.svcCatalog.rebuildCategoriesGL(" + non_cart + ")";
        fschedule.doInsert();
    }
}