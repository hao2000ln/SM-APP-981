/**
 * @fileoverview  Handles the referential integrity functions for the Incident Model.
 * @author Xiongjie MA
 */

/**
 *  This function is called from a trigger on imCategory to delete records from the
 *  imSubCategory and imArea tables if the imCategory is deleted.
 */
function deleteImCategoryTrigger(category, oldCategory) {
	if (oldCategory != null) {
		// delete subCategories for this category
		var subCategorySql = "category=\""+ oldCategory.name +"\"";
		var subCategories = new SCFile("imSubcategory");
		if (subCategories.doSelect(subCategorySql) == RC_SUCCESS) {
			do {
				subCategories.doDelete();
			} while (subCategories.getNext() == RC_SUCCESS);
		}
		
		// delete areas for this category
		var areaSql = "category=\""+ oldCategory.name +"\"";
		var areas = new SCFile("imArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}	
}

/**
 *  This function is called from a trigger on imCategory to update records from the
 *  imSubCategory and imArea tables if the imCategory's name is changed.
 */
function updateImCategoryTrigger(category, oldCategory) {
	if (oldCategory!=null && category!=null && oldCategory.name!=category.name) {
		// update subCategories for this category
		var subCategorySql = "category=\""+ oldCategory.name +"\"";
		var subCategories = new SCFile("imSubcategory");
		if (subCategories.doSelect(subCategorySql) == RC_SUCCESS) {
			do {
				//print("updating subcategory " + subCategories.subcategory_name);   here, ...
				subCategories.category = category.name;
				subCategories.doUpdate();
			} while (subCategories.getNext() == RC_SUCCESS);
		}
		
		// update areas for this category
		var areaSql = "category=\""+ oldCategory.name +"\"";
		var areas = new SCFile("imArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.category = category.name;
				areas.doUpdate();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}	
}

/**
 *  This function is called from a trigger on imSubcategory to delete records from the
 *  imArea table if the imSubcategory is deleted.
 */
function deleteImSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null) {
		// delete areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("imArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.doDelete();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}	
}

/**
 *  This function is called from a trigger on imSubcategory to update records from the
 *  imArea table if the imSubcategory's name is updated.
 */
function updateImSubcategoryTrigger(subcategory, oldSubcategory) {
	if (oldSubcategory != null) {
		// update areas for this subcategory
		var areaSql = "category=\""+ oldSubcategory.category +"\" and subcategory=\"" + oldSubcategory.subcategory_name + "\"";
		var areas = new SCFile("imArea");
		if (areas.doSelect(areaSql) == RC_SUCCESS) {
			do {
				areas.category = subcategory.category;
				areas.subcategory = subcategory.subcategory_name;
				areas.doUpdate();
			} while (areas.getNext() == RC_SUCCESS);
		}
	}	
}