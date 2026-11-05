/**
*data migration from model to product catalog
*/
function requestmodelDataMigration()
{
	var req= new SCFile("model");
	var query="true";
	var rc = req.doSelect(query);
	var count=0;
	if ( rc == RC_SUCCESS )	{
		
		do
		{
			if (req.component_category[0]===null){
			count=count+1;
			//insert data;
			insertProductCatalog(req);
			
			}
			rc = req.getNext();
			
		}while (rc == RC_SUCCESS);			   
  	
	}

}

/**
	*insert data in Product Catalog
	* @param {rModel} The object of Model .
*/
function insertProductCatalog(rModel)
{
	var productCatalog=new SCFile("productCatalog");
	var product_catalog_category=checkmasterCategory(rModel.category);

	insertProductCatalogCategory(product_catalog_category);	
	
	productCatalog.part_no=rModel.part_no;
	productCatalog.product_catalog_category=product_catalog_category;
	productCatalog.part_desc=rModel.part_desc;
	productCatalog.description=rModel.description;
	productCatalog.cost=rModel.cost;
	productCatalog.cost_currency_code=rModel.cost_currency_code;
	productCatalog.manufacturer=rModel.manufacturer;
	productCatalog.gl_number=rModel.gl_number;
	productCatalog.model=rModel.model;
	productCatalog.model_ext=rModel.model_ext;
	productCatalog.default_qty=rModel.default_qty;
	productCatalog.serialized=rModel.serialized;
	productCatalog.folder=rModel.folder;
	productCatalog.company=rModel.company;
	productCatalog.application_name=rModel.application_name;
	productCatalog.license_type=rModel.license_type;
	productCatalog.rights=rModel.rights;
	productCatalog.evaluation_rights=rModel.evaluation_rights;
	productCatalog.multi_type=rModel.multi_type;
	productCatalog.points=rModel.points;
	productCatalog.version=rModel.version;
	productCatalog.authorized=rModel.authorized;
	productCatalog.available=rModel.available;
	productCatalog.receiving_field_default=rModel.receiving_field_default;
	productCatalog.receiving_field_desc=rModel.receiving_field_desc;
	productCatalog.receiving_field_required=rModel.receiving_field_required;
	productCatalog.receiving_field_type=rModel.receiving_field_type;
	productCatalog.receiving_field_value=rModel.receiving_field_value;
	productCatalog.receiving_format=rModel.receiving_format;
	productCatalog.track_receiving=rModel.track_receiving;
	productCatalog.unit_cost=rModel.unit_cost;
	productCatalog.instructions=rModel.instructions;
	
	productCatalog.doSave();
}

/**
	*insert data in Product Catalog Category
	* @param {lineCategory} The line Category name.
*/
function insertProductCatalogCategory(lineCategory)
{
	var productCatalogCategory=new SCFile("prodCatalogCategory");
	
	productCatalogCategory.name=lineCategory;
	productCatalogCategory.description=lineCategory;
	productCatalogCategory.active=true;
	productCatalogCategory.doSave();
}

/**
	*check whether data in master category if not insert into ProductCatalog Category
	* @param {lineCategory} The line Category name.
	* return The value of mast category.
*/
function checkmasterCategory(lineCategory)
{
	var ocmcatselect= new SCFile("ocmcatselect");
	var query="true";
	var rc = ocmcatselect.doSelect(query);
	var returnstr=lineCategory;
	if ( rc == RC_SUCCESS )	{
		do
		{
		    var i, length = funcs.lng(ocmcatselect.line_item_categories); 			
			for(i=0; i<length; i++ )
			{
				if (ocmcatselect.line_item_categories[i]==lineCategory)
				{
				    returnstr=ocmcatselect.name;
				}
			
			}
			rc = ocmcatselect.getNext();
			
		}while (rc == RC_SUCCESS);		
	}

	return returnstr;
}


/**
 * @requestmodelDataMigration  generate oob data for product catalog table (copy records from old 'model' table)
 * @author WangYonglei
 * @date Feb. 2014
 */
