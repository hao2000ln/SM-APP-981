/**
 * @fileoverview  Handles the referential integrity functions for the Probelm Model.
 */

/**
 *  This function is called from a trigger on rootcausecat to delete records from the
 *  pbmSubCategory and pbmArea tables if the rootcausecat is deleted.
 */
function deletePbmCategoryTrigger(category, oldCategory) {
	if (oldCategory != null) {
		// delete subCategories for this category
		var subCategorySql = "category=\""+ oldCategory.name +"\"";
		var subCategories = new SCFile("pbmSubcategory");
		if (subCategories.doSelect(subCategorySql) == RC_SUCCESS) {
			do {
				subCategories.doDelete();
			} while (subCategories.getNext() == RC_SUCCESS);
		}
		
		// delete areas for this category
		var areaSql = "category=\""+ oldCategory.name +"\"";
		var areas = new SCFile("pbmArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}
}

/**
 *  This function is called from a trigger on pbmSubcategory to delete records from the
 *  pbmArea table if the pbmSubcategory is deleted.
 */
function deletePbmSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null) {
		// delete areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("pbmArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}
}

/**
 *  This function is called from a trigger on pbmSubcategory to update records from the
 *  pbmArea table if the pbmSubcategory name is updated.
 */
function updatePbmSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null) {
		// update areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("pbmArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.category = subcategory.category;
				areas.subcategory = subcategory.subcategory_name;
				areas.doUpdate();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}
}