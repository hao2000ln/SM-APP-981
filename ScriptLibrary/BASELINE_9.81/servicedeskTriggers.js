/**
 * @fileoverview  Handles the referential integrity functions for the Service Desk Model.
 */

/**
 *  This function is called from a trigger on sdCategory to delete records from the
 *  sdSubcategory and sdArea tables if the sdCategory is deleted.
 */
function deleteSdCategoryTrigger(category, oldCategory) {
	if (oldCategory != null) {
		// delete subCategories for this category
		var subCategorySql = "category=\""+ oldCategory.name +"\"";
		var subCategories = new SCFile("sdSubcategory");
		if (subCategories.doSelect(subCategorySql) == RC_SUCCESS) {
			do {
				subCategories.doDelete();
			} while (subCategories.getNext() == RC_SUCCESS);
		}
		
		// delete areas for this category
		var areaSql = "category=\""+ oldCategory.name +"\"";
		var areas = new SCFile("sdArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}
		
		if (oldCategory.sharedflag == 3) {
			deleteSharedCategory("imCategory", oldCategory);
		}
		if (oldCategory.sharedflag == 4) {
			deleteSharedCategory("imCategory", oldCategory);
			deleteSharedCategory("pbmCategory", oldCategory);
		}
		if (oldCategory.sharedflag == 5) {
			deleteSharedCategory("pbmCategory", oldCategory);
		}		
	}	
}
function deleteSharedCategory(tablename, oldCategory) {
	var sql = "name=\""+ oldCategory.name +"\"";
	var record = new SCFile(tablename);
	if (record.doSelect(sql) == RC_SUCCESS) {
		do {
			record.doDelete();
		} while (record.getNext() == RC_SUCCESS);
	}
}

/**
 *  This function is called from a trigger on sdSubcategory to delete records from the
 *  sdArea table if the sdSubcategory is deleted.
 */
function deleteSdSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null) {
		// delete areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("sdArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}

		if (oldSubcategory.sharedflag == 3) {
			deleteSharedSubcategory("imSubcategory", oldSubcategory);
		}
		if (oldSubcategory.sharedflag == 4) {
			deleteSharedSubcategory("imSubcategory", oldSubcategory);
			deleteSharedSubcategory("pbmSubcategory", oldSubcategory);
		}
		if (oldSubcategory.sharedflag == 5) {
			deleteSharedSubcategory("pbmSubcategory", oldSubcategory);
		}
	}
}
function deleteSharedSubcategory(tablename, oldSubcategory) {
	var sql = "category=\""+ oldSubcategory.category +"\" and subcategory.name=\"" + oldSubcategory.subcategory_name + "\"";
	var record = new SCFile(tablename);
	if (record.doSelect(sql) == RC_SUCCESS) {
		do {
			record.doDelete();
		} while (record.getNext() == RC_SUCCESS);
	}
}

function deleteSdAreaTrigger(sdArea, oldSdArea) {
	if (oldSdArea != null) {
		if (oldSdArea.sharedflag == 3) {
			deleteSharedArea("imArea", oldSdArea);
		}
		if (oldSdArea.sharedflag == 4) {
			deleteSharedArea("imArea", oldSdArea);
			deleteSharedArea("pbmArea", oldSdArea);
		}
	}
}
function deleteSharedArea(tablename, oldSdArea) {
	var sql = "category=\""+ oldSdArea.category +"\" and subcategory=\"" + oldSdArea.subcategory + "\" and area.name=\"" + oldSdArea.area_name + "\"";
	var record = new SCFile(tablename);
	if (record.doSelect(sql) == RC_SUCCESS) {
		do {
			record.doDelete();
		} while (record.getNext() == RC_SUCCESS);
	}
}

/**
 *  This function is called from a trigger on sdCategory to update records from the
 *  sdSubCategory and sdArea tables if the sdCategory's name is changed.
 */
function updateSdCategoryTrigger(category, oldCategory) {
	if (oldCategory!=null && category!=null && oldCategory.name!=category.name) {
		// update subCategories for this category
		var subCategorySql = "category=\""+ oldCategory.name +"\"";
		var subCategories = new SCFile("sdSubcategory");
		if (subCategories.doSelect(subCategorySql) == RC_SUCCESS) {
			do {
				subCategories.category = category.name;
				subCategories.doUpdate();
			} while (subCategories.getNext() == RC_SUCCESS);
		}
		
		// update areas for this category
		var areaSql = "category=\""+ oldCategory.name +"\"";
		var areas = new SCFile("sdArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.category = category.name;
				areas.doUpdate();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}	
}

/**
 *  This function is called from a trigger on sdSubcategory to update records from the
 *  sdArea table if the sdSubcategory name is updated.
 */
function updateSdSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null && oldSubcategory.subcategory_name!=subcategory.subcategory_name) {
		// update areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("sdArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.category = subcategory.category;
				areas.subcategory = subcategory.subcategory_name;
				areas.doUpdate();
			} while (areas.getNext() == RC_SUCCESS);
		}
		if (oldSubcategory.sharedflag == 3) {
			updateSharedSubcategory("imSubcategory", subcategory, oldSubcategory);
		}
		if (oldSubcategory.sharedflag == 4) {
			updateSharedSubcategory("imSubcategory", subcategory, oldSubcategory);
			updateSharedSubcategory("pbmSubcategory", subcategory, oldSubcategory);
		}
		if (oldSubcategory.sharedflag == 5) {
			updateSharedSubcategory("pbmSubcategory", subcategory, oldSubcategory);
		}
	}
}
function updateSharedSubcategory(tablename, subcategory, oldSubcategory) {
	var sql = "category=\""+ oldSubcategory.category +"\" and subcategory.name=\"" + oldSubcategory.subcategory_name + "\"";
	var record = new SCFile(tablename);
	if (record.doSelect(sql) == RC_SUCCESS) {
		do {
			record.category = subcategory.category;
			record.subcategory_name = subcategory.subcategory_name;
			record.doUpdate();
		} while (record.getNext() == RC_SUCCESS);
	}
}

function updateSdAreaTrigger(sdArea, oldSdArea) {
	if (oldSdArea != null && oldSdArea.area_name!=sdArea.area_name) {
		if (oldSdArea.sharedflag == 3) {
			updateSharedArea("imArea", sdArea, oldSdArea);
		}
		if (oldSdArea.sharedflag == 4) {
			updateSharedArea("imArea", sdArea, oldSdArea);
			updateSharedArea("pbmArea", sdArea, oldSdArea);
		}
	}
}
function updateSharedArea(tablename, sdArea, oldSdArea) {
	var sql = "category=\""+ oldSdArea.category +"\" and subcategory=\"" + oldSdArea.subcategory + "\" and area.name=\"" + oldSdArea.area_name + "\"";
	var record = new SCFile(tablename);
	if (record.doSelect(sql) == RC_SUCCESS) {
		do {
			record.area_name = sdArea.area_name;
			record.doUpdate();
		} while (record.getNext() == RC_SUCCESS);
	}
}