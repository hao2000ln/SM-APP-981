var $ = lib.c.$;
var log = getLog("KMCategory");


function getSubcategories( strParentId, subCatIds, subCatNames )
{
	var subcats = new Query("kmcategory", new QueryCond("parent.category", EQ, strParentId));
	var row;
	for(row in subcats)
	{
		subCatNames.push(subcats[row].name);
		subCatIds.push(subcats[row].id);
	}
}

/**
	This function returns the top-level categories in kmcategory
	
	@return Array of top-level category name strings 
**/
function getTopLevelCategories( topCatIds, topCatNames )
{
	// Get the list of top-level km categories.
	var kmcategoryFile = new SCFile("kmcategory", SCFILE_READONLY);
	kmcategoryFile.setFields(["id", "name"]);
	var catRC = kmcategoryFile.doSelect( "level.in.hierarchy = 0");  
	if ( catRC == RC_SUCCESS )
	{
		while( catRC == RC_SUCCESS )
		{
			topCatNames.push(kmcategoryFile.name);
			topCatIds.push(kmcategoryFile.id);
			catRC = kmcategoryFile.getNext();
		}
	}
	else
	{
		print(funcs.scmsg(7, "km"));
		// No top-level categories in kmcategory. Click New to add a top-level category.
	}
}

/** 
  This function returns the breadcrumb html string for a given category
  
**/
function getBreadcrumb( fKMCategory )
{
	var strStyle = vars.$G_km_globalenv.kmhitliststyle;
	var strBreadcrumb = strStyle + "<DIV class=\"breadcrumb\">";
	if (fKMCategory.level_in_hierarchy == 0 || fKMCategory.pathname == null || fKMCategory.pathid == null)
	{
		fKMCategory.pathname = "";
		fKMCategory.pathid = "";
	}
	var aPathNames = fKMCategory.pathname.split(" > ");
	var aPathIds = fKMCategory.pathid.split(">");
	var strSeparator;
	var i;
	for( i=0; i < aPathNames.length; i++ )
	{
		strSeparator = i > 0 ? " > " : "";
		strBreadcrumb += strSeparator + "<a href=\"scactivelink://kmcategory:id=&quot;"+aPathIds[i]+"&quot;\">"+aPathNames[i]+"</a>";
	}	
	strBreadcrumb += "</DIV>";
	return strBreadcrumb;	
}

/** 
  This function deletes a category and all subcategories under it
  
**/
// catRecord is the kmcategory object to be deleted
function deleteCategory(catRecord)
{
	// Can delete this category and all subcategories under it if no documents 
	//  (other than retired documents) list it as an approval category.
	
	// Look for a prefix in each kmdocuments's category array that starts with:
	// catRecord.pathid + catRecord.id + subcatid
	// If none are found, then delete all the kmcategories below this cat, too.
	
	var catToCheck;

	var reg = />/g;
	if (catRecord.pathid == null || catRecord.pathid == "") { 
		catToCheck = catRecord.id;
    }
	else {
		catToCheck = catRecord.pathid + ">" + catRecord.id;
	}
	var catToCheckInDocs = catToCheck.replace(reg, ":");

	var kmdocFile = new SCFile("kmdocument", SCFILE_READONLY);
	kmdocFile.setFields("title");
	var docCount = 0;
	// This check is legacy code because it now occurs in the Process before the system asks if the user is sure. 
	// Leave it in as an extra check in case the Process code is deleted.
	var retcode = kmdocFile.doSelect("categories#\""+catToCheckInDocs+"\" AND status<>\"retired\"");
	if( retcode == RC_SUCCESS)
	{
		var docListString = kmdocFile.title;
		++docCount;
		retcode = kmdocFile.getNext();
		while( retcode == RC_SUCCESS )
		{
			docListString += ", " + kmdocFile.title;
			++docCount;
			retcode = kmdocFile.getNext();
		}
		var arrayArgs = new SCDatum();
        arrayArgs.setType(8);  //type array
        arrayArgs.push(catRecord.name );
        arrayArgs.push(docCount);
        arrayArgs.push(docListString);
        print(funcs.scmsg(48, "km", arrayArgs));
	}
	else // OK to delete since no documents are approved in this category or a subcategory.
	{
	    kmdocFile = new SCFile("kmdocument");
	    
		// Remove this category from any retired documents
		retcode = kmdocFile.doSelect("categories#\""+catToCheckInDocs+"\" AND status=\"retired\"");
		while( retcode == RC_SUCCESS )
		{
			var k = 0;
			while (k < kmdocFile.categories.length())
			{
				// If cats below this level are already in the list, replace them.
				if ( kmdocFile.categories[k].indexOf(catToCheckInDocs) >= 0 )
				{
					// Remove the category from the document.
					kmdocFile.categories = funcs._delete(kmdocFile.categories,k+1);
					kmdocFile.generatedcats = funcs._delete(kmdocFile.generatedcats,k+1);						
				}
				else {
					k++;
				}
			}
			
			kmdocFile.doUpdate();
			retcode = kmdocFile.getNext();
		}
		print(funcs.scmsg(17, "km")); // The category was removed from all retired documents.

		// Delete the subcategories under the category first.
		var delCats = new SCFile("kmcategory");
		retcode = delCats.doSelect("pathid#\""+catToCheck+"\"");
		var catCount = 0;
		while( retcode == RC_SUCCESS )
		{
			catCount += 1;
			print("Deleting category: " + delCats.name);
			retcode = delCats.doDelete();
			if( retcode == RC_SUCCESS) {
				retcode = delCats.getNext();
			}
			else
			{
			    arrayArgs = new SCDatum();
                arrayArgs.setType(8);  //type array
                arrayArgs.push(delCats.name);
                print(funcs.scmsg(49, "km", arrayArgs));
			}
		}	
		
		// Then delete the category itself.
		retcode = delCats.doSelect("id=\""+catRecord.id+"\"");
		if ( retcode == RC_SUCCESS )
		{
			catCount += 1;
			retcode = delCats.doDelete();
			if( retcode != RC_SUCCESS)
			{
			    arrayArgs = new SCDatum();
                arrayArgs.setType(8);  //type array
                arrayArgs.push(delCats.name);
                print(funcs.scmsg(49, "km", arrayArgs));
			}
			else
			{
			    arrayArgs = new SCDatum();
                arrayArgs.setType(8);  //type array
                arrayArgs.push(delCats.name);
                print(funcs.scmsg(50, "km", arrayArgs));
			}
		}
		arrayArgs = new SCDatum();
        arrayArgs.setType(8);  //type array
        arrayArgs.push(catCount);
        print(funcs.scmsg(51, "km", arrayArgs));
	}
}

/** 
  This function returns all the km groups a user belongs to
  
**/
function getUserProfGroupCatNames(loginName, profNames, groupNames, catNames)
{
	// Get all the km groups this user belongs to
	var fullpathname;
	var opgroups = new Query("kmgroup", new QueryCond("operators", EQ, loginName));
	var row;
	for(row in opgroups)
	{
		var cats = new Query("kmcategory", new QueryCond("kmgroup", EQ, opgroups[row].id));
		var catrow;
		for(catrow in cats)
		{
			var catFilePermissions = cats[catrow].permission;
			// Determine which profiles have this group. 
			// If a profile has the group, read the profile and check the checkbox settings to see if these
			//  are set: approve int/ext, view int/ext, contrib, retire, modify, revert, delete, all that
			// Just add the globals here as you go. :-P
			// link_field is at the same level as level.in.hierarchy or pathid
			var pIndex;
			var length = catFilePermissions.length(); 
			for (pIndex = 0; pIndex < length; pIndex++)
			{
				var idx = funcs.index( opgroups[row].id, catFilePermissions[pIndex].kmgroup); 
				if(idx > 0)
				{
					// This profile has the kmgroup in it. Get the full path name.
					// The pathname field CAT1 > CAT2 > CAT3 does not includes this category CAT4
					if (catFilePermissions[pIndex].pathname != null && catFilePermissions[pIndex].pathname != "") {		
						fullpathname = catFilePermissions[pIndex].pathname + " > " + catFilePermissions[pIndex].name; // e.g.,KMCAT1>KMCAT2>KMCAT3 + > + KMCAT4
					}						
					else {
						fullpathname = catFilePermissions[pIndex].name; // top level name -- nothing precedes it
					}
								
					groupNames.push(opgroups[row].name);
					profNames.push(catFilePermissions[pIndex].kmprofile);
					catNames.push(fullpathname);
				}
			}
		}
	}
}

/** 
  This function performs three validy checks on a category record's name
  
**/
function validityCheck(record)
{
	// I1707 -- Three checks to make:
	// 1) Ensure there are no two top-level categories with the same name, 
	//	e.g., no two top level categories each named HP.
	var kmcategoryFile = new SCFile("kmcategory", SCFILE_READONLY);
	kmcategoryFile.setFields("id");
	if (record.level_in_hierarchy == 0)
	{
		var rc = kmcategoryFile.doSelect("level.in.hierarchy=0 and name = \""+record.name+"\" and id<>\""+record.id+"\""); 
		if ( rc == RC_SUCCESS )
		{
        	print(funcs.scmsg(52, "km"));
			return -1;
		}
	}

	// 2) Below the top level, ensure there are no two same-level categories 
	//	with the same name with the same parent.
	//	e.g., this is OK:
	//		HP > Printers > Services
	//		HP > Laptops > Services
	//	Not OK: Two of these with different cat ids for Services
	//		HP > Printers > Services
	//		HP > Printers > Services
	var catRC = kmcategoryFile.doSelect("level.in.hierarchy=\""+record.level_in_hierarchy+"\" and name = \""+record.name+"\" and id<>\""+record.id+"\" and parent.category=\""+record.parent_category+"\""); 
	if ( catRC == RC_SUCCESS )
	{
		print(funcs.scmsg(53, "km"));
		return -1;
	}

	// 3) Ensure there are no categories with the same name in the same hierarchy at different nodes.
	//	This is not OK:
	// 		HP > Hardware > Services > Printers > Services
	// Reasoning: 	- It's too confusing when viewed.
	//				- Duplicates at the same level are discouraged in taxonomy, so duplicates at 
	//				different nodes in the same tree are even harder to grok and more discouraged. :0)
	//				- The kmcategory.update.trigger replaces any re-named categories 
	//				in the pathname field; this simplifies the category name changes.
	// Is the category name above this node in the tree?
	if (record.pathname && record.pathname.indexOf(record.name)>=0)
	{
		// divide record.pathname by " > " to see if any are identical
		var aPathNames = record.pathname.split(" > ");
		var arrayLength = aPathNames.length; // separate variable makes SM7 more efficient 
		// Loop through the category name of each preceeding category to check if any identical
        var i;         
		for ( i=0; i < arrayLength; i++ )
		{
			if ( aPathNames[i] == record.name )
			{
				print(funcs.scmsg(54, "km"));
				return -1;
			}
		}	
	}
		
	// Is the category name below this node in the tree?
	var pathToCheck = "";
	if (record.pathid == null || record.pathid == "") {
		pathToCheck = record.id;
	}
	else {
		pathToCheck = record.pathid + ">" + record.id;
	}
	
	catRC = kmcategoryFile.doSelect("pathid # \""+pathToCheck+"\" and name = \""+record.name+"\""); 
	if ( catRC == RC_SUCCESS )
	{
		print(funcs.scmsg(55, "km"));
		return -1;
	}
	
	return 1;
}

/**
*	This function string xpath of category names and returns the corresponding category id string or null if invalid
*	@param strCategoryXPath a string representing the xpath of the category hierarchy (A/B/C)
*	@param bCreateIfNotFound a boolean if set to true will create categories and subcategories if they are not found.
*	@return String string containing the colon delimited category id path (1:2:3) or null if the xpath is invalid
*   @type String
*/
function getCategoryIdString(strCategoryXPath, bCreateIfNotFound)
{
	//split the xpath into it's individual elements
	var categories = strCategoryXPath.split("/");
	var kmcategoryFile = new SCFile("kmcategory", SCFILE_READONLY);
	kmcategoryFile.setFields("id");
	var rc;
	var strReturn="";
	var lastid = "";
	var currentpath = "";
	var selectString = "level.in.hierarchy=0 and name = \""+categories[0]+"\"";
	var i;
	for (i = 0; i < categories.length; i++)
	{
		if (i > 0) {	
			selectString = "level.in.hierarchy="+i+" and name = \""+categories[i]+"\" and parent.category = \""+lastid+"\"";
		}						

		rc = kmcategoryFile.doSelect(selectString); 
		if(rc==RC_SUCCESS)
		{
			strReturn += i<categories.length-1 ? kmcategoryFile.id+":":kmcategoryFile.id;
			lastid = kmcategoryFile.id;
		}
		else
		{
			if(bCreateIfNotFound)
			{
				var newCategory = new SCFile("kmcategory");
				var callRtn = new SCDatum();
				var nextNumber = new SCDatum();
				funcs.rtecall("getnumber", callRtn, nextNumber, "kmcategory");
				newCategory.id = nextNumber.getText();
				newCategory.name = categories[i];
				if(i == 0) //create a new top level
				{
					newCategory.pathname = "";
					newCategory.pathid = "";
					newCategory.level_in_hierarchy = 0;
				}
				else //create a new subcat
				{
					newCategory.parent_category = lastid;
					newCategory.pathname = currentpath;
					var strpathid = system.library.KMUtils.stripTrailing(strReturn, ':');
					newCategory.pathid = strpathid.replace(/:/g, ">");
					newCategory.level_in_hierarchy = i;
				}	
				rc = newCategory.doInsert();
				//problem...bail
				if(rc != RC_SUCCESS) {
					return null;
				}
				strReturn += (i<categories.length-1) ? newCategory.id +":" : newCategory.id;
				lastid = newCategory.id;
			}
			else
			{
				//invalid category xpath
				return null;
			}
		}
		currentpath +=  (i > 0 ? " > " : "") + categories[i];		
	}
	
	return strReturn;
}


/**
 * synchronize category name to document if category renamed
 *
 * @param {String} catelogId
 * @param {String} nameOld
 * @param {String} nameNew
 * @returns {Number} updated document count 
 */
function synchronizeGeneratedCategories(catelogId, nameOld, nameNew) {
    if (!nameOld || !nameNew || nameOld == nameNew) {
        return 0;
    }

    var count = 0;

    var sql = 'categories like "*' + catelogId + '*"';
    $("kmdocument").find(sql).each(function(document) {
    
        var update = false;

        // ID1:ID2:ID3
        var categories = document.categories.toArray();

        // NAME1 > NAME2 > NAME3
        var generatedcats = document.generatedcats.toArray();
        var generatedcatsOld = generatedcats.slice();

        var i;
        for (i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (!category) {
                continue;
            }

            // position in single category
            var index = -1;

            if (category.split(":").indexOf(catelogId) >= 0) {
                index = i;
            }

            if (index == -1 || generatedcats.length < index + 1) {
                continue;
            }

            // category found, update label
            var generatedcat = generatedcats[index];
            var generatedcatArray = generatedcat.split(" > ");
            var indexName = generatedcatArray.indexOf(nameOld);
            if (indexName == -1) {
                continue;
            }

            generatedcatArray[indexName] = nameNew;
            generatedcats[index] = generatedcatArray.join(" > ");
            update = true;
        }

        if (update) {
            log.info(`Update Generated Categories of document ${document.id} from "${generatedcatsOld}" to "${generatedcats}".`);

            document.generatedcats = generatedcats;
            document.doUpdate();

            count++;
        }
    });

    return count;
}