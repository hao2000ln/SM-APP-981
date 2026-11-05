
/*   
*@Author Yu Li
*@Date since 08/06/2012    
*@Category Search
*/
var CONTAIN_CATEGORY="category";
var CONTAIN_BUNDLE_ITEM="item";


function CatalogItem (name,categoryType,parent)
{
	this.name = name; 
	this.categoryType = categoryType; 
	this.parent = parent;

}

function getAllItemsbyType(itemType,nonCart)
{
	var items =new Array();
	var fsvcCatalogItem = new SCFile("svcCatalog");
	
	var fSql = "type=\"" + itemType + "\" and active=true";
	if (nonCart)
		fSql+=" and non.cart=true ";
	else 
		fSql+=" and (non.cart=NULL or non.cart=false)";
	
	var fRlt = fsvcCatalogItem.doSelect(fSql);
	while (fRlt == RC_SUCCESS)
	{       
		items.push( new CatalogItem( fsvcCatalogItem.name, fsvcCatalogItem.category_type,  fsvcCatalogItem.parent.toArray() ) ); 
		fRlt = fsvcCatalogItem.getNext();
	}
	return items;           
}

function isBottonCategoryItem( itemName)
{

    var fsvcCatalogItem = new SCFile("svcCatalog");
    var fSql = "name=\"" + itemName + "\"";
    var fRlt = fsvcCatalogItem.doSelect(fSql);     
    while (fRlt == RC_SUCCESS)
    {   
        if (CONTAIN_BUNDLE_ITEM==fsvcCatalogItem.category_type)
        {	
        	return true;
        } else if (CONTAIN_CATEGORY==fsvcCatalogItem.category_type)
        {
            return false;
        }else
        {
            return false;
        }
    }
    return false;


}
function getAllChildCategoryItem(rootItem,items)
{
  
    var childItems=new Array();
    var restItems=new Array();
    var cItems=new Array();
    while(items.length>0)
    {
		var item=items.pop();
      	if (indexOf(rootItem.name,item.parent)>0)
      	{  
			childItems.push(item); 
         	if (CONTAIN_CATEGORY==item.categoryType)
         	{
				while(restItems.length>0)
            	{
                 	items.push(restItems.pop());
            	}
            	cItems=getAllChildCategoryItem(item,items); 
            	while(cItems.length>0)
            	{
                	childItems.push(cItems.pop());
            	}
            }
         
   
      	}else{
      		restItems.push(item);   
		}
     
    }

    return childItems;

}

function getAllBottomCategoryItem(rootItem,items)
{
  
	var btomItems=new Array();
    var restItems=new Array();
    var bItems=new Array();
    while(items.length>0)
    {
      
      var item=items.pop();
  
      if (indexOf(rootItem.name,item.parent)>0)
      {
      
         if (CONTAIN_BUNDLE_ITEM==item.categoryType)
         {
         
             btomItems.push(item);
         
         }else{

           
             while(restItems.length>0)
             {
                
                 items.push(restItems.pop());
             }
           
             bItems=getAllBottomCategoryItem(item,items);
            
             while(bItems.length>0)
             {
                btomItems.push(bItems.pop());
             }
         }
         
   
      }else{
         
         restItems.push(item);   
  
      }
    }

    return btomItems;

}

function buildCatQuery(itemName,isAll,nonCart)
{
	var sql="";
  	var items=new Array();
  	var itemNames=new Array();
  	if (isBottonCategoryItem(itemName))
  	{
    	sql="parent=\""+itemName+"\"";
  
  	} else {
  	
  		var items=getAllItemsbyType("category",nonCart);
 		var catalogItem=new CatalogItem(itemName);
 		if (isAll)
 		{
 	    	items=getAllChildCategoryItem(catalogItem, items);
 	    	items.push(catalogItem);
 		}else{
 	
 			items=getAllBottomCategoryItem(catalogItem,items);
  	
  		}

  		while( items.length>0 )
 		{
 			itemNames.push(escape(items.pop().name));
 		}
		sql= "parent isin {\""+itemNames.join('","')+"\"}";
	}
  return sql;
}

function buildSearchQuery(searchStr){
    return  "displayName=\""+ searchStr+ "\"" ;
}

function buildRADSetSearchQuery(){

	var type = vars["$L.type"];
	var searchStr = vars["$search.string"];
	var searchCategory = vars["$search.category"];
	var nonCategory = vars["$noncategory"];
	var myLang = vars["$G.my.language"];

	var subSql="";
	var catalogSql="";
	
	if (type == "noncart") 
	{ 
		subSql=" and non.cart=true ";
	}else { 
		subSql=" and (non.cart=NULL or non.cart=false)";
	} 

	catalogSql="active=true"+subSql; 
	if (searchStr!=null && searchStr!="") 
	{ 
		catalogSql=catalogSql+" and "+buildSearchQuery(searchStr);
	}
	
	if (searchCategory != null && nonCategory == false) 
		if (type=="noncart") {
			catalogSql=buildCatQuery(searchCategory, true, true)+" and "+catalogSql;
		}else {
			catalogSql=buildCatQuery(searchCategory, true, false)+" and "+catalogSql;
		}
		
	if (searchCategory != null && nonCategory == true) 
		if (type=="noncart") {
			catalogSql=buildCatQuery(searchCategory, false, true)+" and "+catalogSql;
		}else {
			catalogSql=buildCatQuery(searchCategory, false, false)+" and "+catalogSql;
		}
		
	if (nonCategory == true) {
		catalogSql = catalogSql +" and type~=\"category\"";
	}

	if ("en" == myLang) {
		catalogSql = catalogSql +" and syslanguage=\"en\"";
	}
	
	
	return catalogSql;
}

function buildRADInitFieldsQuery(){
  var catalogSql = "type=\"category\" and null(parent) and active=true";
	
  if ("en"==vars["$G.my.language"]){
	catalogSql = catalogSql + " and syslanguage=\"en\"";  
  }
  if ("noncart"==vars["$L.type"]){
    catalogSql = catalogSql + " and non.cart=true";
  } else {
    catalogSql = catalogSql + " and (non.cart=NULL or non.cart=false)";
  }

  return catalogSql;	
}

function escape( str ) 
{
    return str ? str.replace( /(\\|"|')/g , '\\$1' ) : str;
}

function indexOf(item, itemArray)
{
	for( i=0;i<itemArray.length; i++ )
    {
		if (item==itemArray[i])
			return i+1;
    }
    return -1;
   
}


















