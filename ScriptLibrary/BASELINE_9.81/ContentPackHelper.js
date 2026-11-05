var $ = lib.c.$;


/**
	Array of content module info.
	(1) Each time a new content module is to be developed, 
		the array should be modified to add the new content module info.
	(2) Each time a new version of an existing content module is to be developed, 
		the array should be modified to add the new version info to the existing content module.
		
	@author Liu,Yong-Liang
	
*/
var contentModuleInfo = 
{	      	
	"LanguagePack":
		{
			"shortname":"LP",
			"9.51":{"releasedate":"12/16/16 00:00:00"}
		}	
};


/**
  * Return the compatible application version
  */
function getCompatibleAppVersionForContentPack(module)
{
	return null;
}


/**
	Add a new record into the table patchrelversioninfo.
	This only happens in release build by HP.
	
	@param module, SM Content module,
	@param version, version of the SM Content module.
	@param createtime, create time for this record.	
	
	@return RC_SUCCESS or one of the other global return code values.
					
	@author Liu,Yong-Liang
*/
function addNewVersion(module,version,createtime)  
{     
     //check if there is record for this version
     var v=new SCFile("patchrelversioninfo", SCFILE_READONLY);
     var t_sql="module=\""+module+"\" and version=\""+version+"\"";
     if(v.doSelect(t_sql)==RC_SUCCESS) 
     {
     	return RC_SUCCESS;
     }
	     
     var scfile=new SCFile("patchrelversioninfo");
     scfile.module=module;
     scfile.version=version;
     scfile.type="Content";
     
     var modulename=module.replace("_"," ");
     scfile.description=modulename;
     return scfile.doInsert();
}


/**
	Assembling of version messages for the file AppUpgVersion.txt.
	@param buildtype, indicator for build type.
						"PROD", for product build by customer; or
						"MF", for release build by Micro Focus;
	@param module, SM Content module,
	@param version, version of the SM Content module.
	@param l10nsupport, support multiple language or not
	
	@return, a string representing the SM content version info.
						
	@author Liu,Yong-Liang
*/
function getAppContentRelVersionMsg( buildtype, module,version, l10nsupport)	
{
	var versionstring = version;
	if(buildtype=="PROD"){
		var versionarray=version.split(" ");
		versionstring=versionarray[1];
	}
	
	var msg="";

    msg+="{\n";
	msg+="\"module\":\""+module+"\",\n";
	msg+="\"version\":\""+versionstring+"\",\n";	
	msg+="\"buildtype\":\""+buildtype+"\",\n";
	msg+="\"l10nsupport\":\""+l10nsupport+"\",\n";
	msg+="\"releasedate\":\""+getContentModuleReleaseDate(module,versionstring)+"\"\n";
	msg+="}";

	return msg;	
}


/**
	Get the release date of a specific module, denoted by module name and version.
	
	@param module, SM Content module,
	@param version, version of the SM Content module.
	
	@return, a string representing the SM content release date.
						
	@author Liu,Yong-Liang
*/
function getContentModuleReleaseDate(module,version){

	if(contentModuleInfo[module]!=null && contentModuleInfo[module][version]!=null){
		return contentModuleInfo[module][version].releasedate;
	}

	return "";
}


/**
	Get the short name of a specific module, denoted by module name.
	
	@param module, SM Content module,
	
	@return, a string representing the SM content module short name.
						
	@author Liu,Yong-Liang
*/
function getContentModuleShortName(module){

	if(contentModuleInfo[module]!=null && contentModuleInfo[module]["shortname"]!=null){
		return contentModuleInfo[module]["shortname"];
	}

	return module;
}


/**
* Specific to Content
* Check and compare versions between current and target
* Author: Ryan
* @date              20110907
* @param   {String} path
* @returns        {number} code
*
*/
function checkContentVersion( path )
{
    // read version informations from AppUpgVersion.txt
    var content_info = getContentInfo( path );

    // compare app base version with scversion, it can only be installed above 9.40.000
    var current_app = new SCFile( "scversion", SCFILE_READONLY );
    if( current_app.doSelect( "true" ) == RC_SUCCESS )
    {
        current_app = current_app.application_version;
        if( current_app.indexOf( "-" ) > 0 ) 
        {
        	current_app = current_app.slice( 0, current_app.indexOf( "-" ) );
        }
    }
    else 
    {
    	return -1;
    }

    if( !content_info ) 
    {
    	return -1;
    }

    system.vars.$G_target_version = content_info.module + " " + content_info.version;
    system.vars.$G_target_date = funcs.val(content_info.releasedate,3);

    //determine whether it`s PROD
    system.vars.$L_return_type = ( content_info.buildtype == "PROD" )? "production-final" : "production";

	// determine whether support multiple languanges
	system.vars.$L_l10n_support = ( "true" == content_info.l10nsupport ) ? true : false;
	
    //scenario 1: check if contentversion table exists
    //scenario 2: table exists, check if module exists

    var dbdict = new SCFile( "dbdict", SCFILE_READONLY );

    if( dbdict.doSelect( "name=\"contentversion\"" ) != RC_SUCCESS )
    {
        system.vars.$G_current_version = "Not previously installed";
        return -2;
    }
    else
    {
        var contentversion = new SCFile( "contentversion", SCFILE_READONLY );
		var rc = contentversion.doSelect( "module=\"" + content_info.module + "\"" );
		
		if( rc != RC_SUCCESS)
        {
            system.vars.$G_current_version = "Not previously installed";
            return -2;
        }
        else
        {
            system.vars.$G_current_version = contentversion.module + " " + contentversion.version;
            return compareContentVersion( contentversion.version, content_info.version );
        }
    }

}


/**
* Specific to Content
* compare versions between current and target
* Author: Ryan
* @date              20110907
* @param   {String} current
* @param   {String} target
* @returns        {number} code
*
*/
function compareContentVersion( current, target )
{
    if(current == target) 
    {
    	return 0;
    }

    var v1 = current.split(".");
    var v2 = target.split(".");

    if( v1.length != v2.length ) 
    {
    	return -1;
    }

	var i;
    for( i = 0; i < v1.length; i++ )
    {
        if( parseInt(v1[i],10) < parseInt(v2[i],10) ) 
        {
        	return -2;
        }
        if( parseInt(v1[i],10) > parseInt(v2[i],10) ) 
        {
        	return 2;
        }
    }
        
    return 0;
}


/**
* Specific to Content
* Read content information txt file. return them as an object
* Author: Ryan
* @date              20110907
* @param   {String} filename
* @returns        {Object} values for content information
*
*/
function getContentInfo(filename){
    var content = readFile(filename, "t");
    if(content!=-1){
        try
        {
            var cont = null;
            cont = lib.JSON.json().parse(content);
            
        }catch(ex){}

        //print( "The value of textFile is: " + content.module );
        return cont;
    }else{
        return null;
    }
}


/**
  * Pre processing for patch application..
  * This function will be called in the Process patchrel.execute
  *
  * @param module, module name of the content pack.
  */
function preProcessForPatch(module)
{
}


/**
 	Post processing for patch application. Detailed post processing will be dependent on module.
 	
 	This function will be called in the rad:sm.patchrel.apply.post.

	@param module, module name of the release package. "APM" for patch release, and all others for content release.
							
	@author Liu,Yong-Liang
*/
function postProcessForPatch(module)
{	
	// module: language pack bundle
	if (module == "LanguagePack")
	{
		updateLanguageInfo();
		expireLocalizedGlobalLists();
	}		
	else	//other modules
	{
		//module specific operations here.		
	}		
}


function updateLanguageInfo()
{
	var module = "LanguagePack";
	var fStatus = new SCFile("patchrelstatus", SCFILE_READONLY);
	var rc = fStatus.doSelect("version#\"" + module + " \"");

	if (rc != RC_SUCCESS)
	{
		return;
	}
		
	// get version
	var version = fStatus.version.slice(module.length + 1);

	// get patch release info record
	var fInfo = new SCFile("patchrelversioninfo");	
	var query = "module=\"" + module + "\" and version=\"" + version+"\"";

	if (fInfo.doSelect(query) != RC_SUCCESS) 
	{
		return;
	}
	     
	// get applied languages
	var selected = fStatus.lang_selected[0].toArray();
	var languages = fStatus.lang_selected[1].toArray();
	var codes = fStatus.lang_selected[2].toArray();

	var bUpdate = false, i;
	for (i = 0; i < selected.length; i++)
	{
		if (selected[i] == "true") 
		{
			if (!lib.ArrayUtil.contains(fInfo.detail.toArray(), languages[i]))
			{
				// set applied language
				bUpdate = true;
					
				if (fInfo.detail.toArray().length == 0)
				{
					fInfo.detail = [languages[i]];
				}
				else
				{
					fInfo.detail.push(languages[i]);
				}
			}
				
			activeLanguage(codes[i]);
		}		
	}

	// update patch release info record
	if (bUpdate)
	{
		fInfo.doUpdate();
	}	
}


/**
 * Active language
 *
 * @param   {String} code
 */
function activeLanguage(code)
{
	var rc = lib.BaseUtil.activeLanguage(code);
	if (rc == RC_SUCCESS)
	{
		lib.patchrelHelper.info(funcs.scmsg(201, "object", ["language", code]));
	}
	else
	{
		lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["language", code]));
	}					
}


/**
 * Expire localized globallists
 */
function expireLocalizedGlobalLists()
{
	lib.patchrelHelper.info(funcs.scmsg(419, "upg"));
	
	// update expiration date if localized and build at startup with filename
	var query = "not null(filename) and build.startup = true and localize.values = true";
	$("globallists").select(query).iterate(function(list)
	{
		list.expiration = new Date();
		var rc = list.doUpdate();
		
		if (rc != RC_SUCCESS)
		{
			lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["globallists", list.name]));
		}
	});

	lib.patchrelHelper.info(funcs.scmsg(420, "upg"));
}	


function populateLanguageData(module)
{
	var fLangs = new SCFile("language", SCFILE_READONLY);

	var names = new SCDatum();
	var codes = new SCDatum();
	var selected = new SCDatum();  
	var sql;
	
	sql = "unique.id isin {";
	var langs = lib.patchrelHelper.getLanguages();
	var i;
	for (i = 0; i < langs.length - 1; i++)
	{
		sql += "\"" + langs[i] + "\", ";
	}
	sql += "\"" + langs[i] + "\"}";

	if (fLangs.doSelect(sql) == RC_SUCCESS)
	{
		do
		{
			names.push(fLangs.language);
			codes.push(fLangs.unique_id);
			selected.push(fLangs.active && lib.upgradeLanguage.isLanguageApplied(fLangs.unique_id));	
		}
		while(fLangs.getNext() == RC_SUCCESS);
	}

	vars.$wiz_language = names;
	vars.$wiz_codes = codes;	
	vars.$wiz_selected = selected;
}


/**
 *  whether to load dbdict.dta
 */
function dbdictNeeded(module)
{
	if (module.indexOf("LanguagePack") == 0)
	{
		return false;
	}
		
	//TODO the better way is to check patches record
	return true;		
}


/**
 * Read Content Pack information txt file. return unload merge files
 *
 * @param   {String} path
 * @returns	{Array} merge unload and signatures file
 */
function getMergeUnloadInfo(path)
{
	/*
	 * From 940, contentpack.txt is not used, but need to load full PD dta file
	 */	
	if (lib.ProcessDesignerEnablement.isPDEnabled())
	{
		return ["PD.dta","PD_sigs.dta"];
	}
	else
	{
		return null;
	}
}

function getTagQuery(file, tag)
{
    var fileTag = new SCFile();
    system.functions.fduplicate(fileTag, file);
    
    var query=new SCDatum();    
    var ret =0;
    system.functions.rtecall("tagquery", ret, fileTag, query, tag);
	return query.getText();
} 
   

function getSignaturemake(filename)
{
	var fMake = new SCFile("signaturemake", SCFILE_READONLY);
	query = "table.name = \"" + filename + "\"";
	rc = fMake.doSelect(query);

	return fMake;
}

/**
 * return name of patchrel object
 */
function getNameOfPatchrelobjects(objType, objName)
{
	// patchrelobject name
	var poName = objType + ", " + objName;
	
	if ("code" == objType)
	{
		poName = "Application Cluster: " + objName;
	}
	else if ("format" == objType)
	{
		poName = "Format Record : " + objName;
	}
		
	return poName;
}


/**
 * create new patchrelobject & smpatches record
 *
 * @param	file
 * @returns	rc
 */
function addSignatures(file)
{
	var tag = lib.upgradeSignatures.getTag(file);
	var tagQuery = getTagQuery(file, tag);	
	// print("tag: " + tag);
	// print("tagQuery: " + tagQuery);

	// 1.patchrelobjects record
	var fPO = new SCFile("patchrelobjects");
	
	var objType = funcs.filename(file);
	
	// if new object is code (RAD application), remove related format smpatches & patchrelobject
	if ("code" == objType)
	{
		deleteFormatSignatures(file.application);
	}
	
	// object name
	var objName = "";	
	var make = getSignaturemake(objType);	
	var keys = make.key;	
	var length = keys.length(), i;	
	for (i = 0; i < length; i++)
	{
		objName += file[keys[i]];
	}
	
	// format, move "en" to the last	
	if ("format" == objType)
	{
		objName = objName.substr(2, objName.length) + "en";
	}
		
	// patchrelobject name
	var poName = getNameOfPatchrelobjects(objType, objName);
	// print(poName);

	fPO.object_name = poName;
	var sig = makeSignature(file, make.fields, make.fieldarray_type);
	
	// create a new patchrelobject
	fPO.object_name = poName;
	fPO.contents[0].name = objName;
	fPO.contents[0].table = objType;
	fPO.contents[0].query = tagQuery;
	fPO.contents[0].validate = true;
	fPO.contents[0].new_sig = sig;		

	// signature
	var newsig = new SCDatum();
	newsig.setType(lib.DataTypeConst.typeStructure());
	newsig.push(sig);
	newsig.push(lib.patchrelHelper.getBaseAppVersion());
	newsig.push(new Date());
	fPO.contents[0].sigs[0] = newsig;

	// add patchrelobject record
	var rc = fPO.doSave();	
	if (rc != RC_SUCCESS)
	{
		return rc;
	}

	// 2.smpatches record
	var fPatch = new SCFile("smpatches");
	fPatch.version = lib.patchrelHelper.getAppVersionForDiff();
	fPatch.filename = objType;
	fPatch.tag = tag;
	fPatch.action = "add";
	fPatch.curr_sig = sig.toString();
			
	// save smpatches record
	rc = fPatch.doSave();
	return rc;
}   
		
		
/**
 * Delete smpatches & patchrelobjects for format record
 */
function deleteFormatSignatures(name)
{
	// delete smpatches
	var fPatch = new SCFile("smpatches");
	var query = "tag=\"format;en;" + name + "\"";
	var rc = fPatch.doSelect(query); 
	if (rc == RC_SUCCESS)
	{
		rc = fPatch.doDelete();
	}
		
	// delete patchrelobjects
	var fPO = new SCFile("patchrelobjects");
	query = "object.name=\"Format Record : " + name + "en\"";
	rc = fPO.doSelect(query);
	if (rc == RC_SUCCESS)
	{
		rc = fPO.doDelete();
	}
}


/**
 * Make signatures
 */
function makeSignature(file, fields, fieldsType)
{
	/*
	 * Duplicate file first. 
	 * 
	 * Because of RTE known issue, sometimes the file will be changed if RTE thinks its field type is incorrect.
	 * Sometimes it occurs. e.g. add a string value into a condition array which type should be operator.
	 */
	var fileCopy = new SCFile();
    funcs.fduplicate(fileCopy, file);

	return funcs.make_sig(fileCopy, fields, fieldsType);
}


/**
 * update patchrelobject record
 *
 * @param	file
 * @returns	rc
 */
function updateSignatures(file)
{	
	var objType = funcs.filename(file);
	
	// object name
	var objName = "";	
	var make = getSignaturemake(objType);	
	var keys = make.key;	
	var length = keys.length(), i;	
	for (i = 0; i < length; i++)
	{
		objName += file[keys[i]];
	}
	
	// format, move "en" to the last	
	if ("format" == objType)
	{
		objName = objName.substr(2, objName.length) + "en";
	}
	
	// patchrelobject name
	var poName = getNameOfPatchrelobjects(objType, objName);
	
	// patchrelobjects record
	var fPO = new SCFile("patchrelobjects");
	var query = "object.name=\"" + poName + "\"";

	var rc = fPO.doSelect(query);
	if (rc != RC_SUCCESS)
	{
		return rc;
	}

	var sig = makeSignature(file, make.fields, make.fieldarray_type);	
	if (fPO.contents[0].new_sig == sig)
	{
		return RC_SUCCESS;
	}
	
	// update new.sig of patchrelobject according to the current file.
	fPO.contents[0].new_sig = sig;
	return fPO.doUpdate();
}   


/**
 * merge signatures
 *
 * @param	fileSignature
 * @returns	rc
 */
function mergeSignatures(fileSignature)
{
	var objType = fileSignature.object_type;

	// 1.update patchrelobjects record

	// format, move "en" to the last
	var objName = fileSignature.object_name;
	if ("format" == objType)
	{
		objName = objName.substr(2, objName.length) + "en";
	}
	
	var poName = getNameOfPatchrelobjects(objType, objName);
	var query = "object.name=\"" + poName + "\"";
	
	var fPO = new SCFile("patchrelobjects");
	var rc = fPO.doSelect(query);
	if (rc != RC_SUCCESS)
	{
		return rc;
	}

	// push new signature
	var newsig = new SCDatum();
	newsig.setType(lib.DataTypeConst.typeStructure());
	newsig.push(fileSignature.signature);
	newsig.push(fileSignature.release_version);
	newsig.push(fileSignature.signature_date);
	
	fPO.contents[0].sigs.push(newsig);
	// print(fPO.contents[0].sigs);
	
	rc = fPO.doUpdate();
	if (rc != RC_SUCCESS)
	{
		return rc;
	}

	// generate record tag
	var fObj = new SCFile(objType);
	rc = fObj.doSelect(fPO.query);
	if (rc != RC_SUCCESS)
	{
		// return success if the signature related with a new record
		return RC_SUCCESS;
	}
	
	var tagStr = lib.upgradeSignatures.getTag(fObj);  
	// print(tagStr);
	
	// 2.update smpatches record
	var fPatch = new SCFile("smpatches");
	query = "action=\"update\" and tag=\"" + tagStr + "\"";
	rc = fPatch.doSelect(query);
	
	if (rc == RC_SUCCESS)
	{
		fPatch.pre_sigs.push(fileSignature.signature.toString());
		fPatch.pre_sigs_ver.push(fileSignature.release_version);
		// print(fPatch);
	
		rc = fPatch.doUpdate();
		return rc;
	}
	else 
	{
		// return if "add" record exists
		query = "action=\"add\" and tag=\"" + tagStr + "\"";
		return fPatch.doSelect(query);
	}
}


/**
 * Generate data according the patch record
 *
 * @param patch, name of patches record
 * @return array, [[table1,query1,objname1],[table2,query2,objname2],...]
 */
function generatePatchData(patch)
{
	var result = [];
	
	// patches record
	var patches = $("patches", SCFILE_READONLY).select("name=\"" + patch + "\"").uniqueResult();
	
	var tables = patches.secondary;

	var length = tables.length(), i;
	for (i = 0; i < length; i++)
	{
		var table = tables[i];
		var tableName  = table[0];
		var tableQuery = table[2];
		
		if (tableQuery == "false")
		{
			continue;
		}
		
		// compare signatures by each table
		var r = compareFileSignatures(tableName, tableQuery);
		
		var j;
		for (j = 0; j < r.length; j++)
		{
			result.push(r[j]);
		}
	}
	
	//for (i = 0; i < result.length; i++)
	//	print(result[i]);
		
	return result;
}


/**
 * Compare file signatures
 *
 * @param table, table name
 * @param query, query string
 * @return array, [[table1,query1,objname1],[table2,query2,objname2],...]
 */
function compareFileSignatures(table, query)
{
	var count = 0;
	var result = [];
	
	// signaturemake record
	var make = $("signaturemake", SCFILE_READONLY).select("table.name=\"" + table + "\"").uniqueResult();
	var key = make.key;
	
	var records = $(table, SCFILE_READONLY).select(query).iterate(function(record)
	{
		// make signature
		var sig = funcs.make_sig(record, make.fields, make.fieldarray_type);

		// generate object name
		var length = key.length(), i;
		var objName = "";
		for (i = 0; i < length; i++)
		{
			objName += record[key[i]];
		}
		
		// query existed signatures
		var sigQuery = "object.type = \"" + table + "\" and " +
					   "object.name = \"" + objName + "\" and " +
					   "release.version # \"" + lib.patchrelHelper.getBaseSignatureVersion() + "\"";
			
		var sigs = $("signatures", SCFILE_READONLY).select(sigQuery).list();			
			
		// if the current signatures doesn't match with base version signatures, 
		// means the record has been updated since base version
		var match = false;
		for (i = 0; i < sigs.length; i++)
		{
			if (sig == sigs[i].signature)
			{
				match = true;
				break;
			}
		}
		
		if (!match)
		{
			var tag = lib.upgradeSignatures.getTag(record);
			var tagQuery = getTagQuery(record, tag);
			
			result.push([table, tagQuery, objName]);

			count ++;		
		}
	});
	
	//print(table + ": " + count);
	return result;
}


/**
 * Check dbdict for patch those have prefix name.
 * Create the dbdict record if not existed.
 */
function checkDbdictWithPrefix(filename)
{	
	var prefixName = lib.patchrelHelper.getDtaPrefix() + filename;
	var dtaDbdict = $("dbdict", SCFILE_READONLY).setFields(["name"]).select("name=\"" + prefixName + "\"").uniqueResult();
	
	// return if exists
	if (dtaDbdict)
	{
		return;
	}

	// copy from original dbdict
	var dbdict = $("dbdict").select("name=\"" + filename + "\"").uniqueResult();
	
	dtaDbdict = new SCFile();
    funcs.fduplicate(dtaDbdict, dbdict);
    
	// 1. update name
	dtaDbdict.name = prefixName;
	
	// 2. update sql table name
	var tables = dtaDbdict.sql_tables;
	
	var length = tables.length(), i;
	for (i = 0; i < length; i++)
	{
		var tableName = tables[i][1];
		if (tableName && tableName.toUpperCase() != "NULLTABLE")
		{
			tables[i][1] = "U_" + tableName;
		}
	}
	
//	print(lib.debugUtils.display(dtaDbdict));

	// create dbdict
    var rc = callrad("fcreate", ["record"], [dtaDbdict]);	
	if (rc == RC_SUCCESS)
	{
		lib.patchrelHelper.detailLog(funcs.scmsg(200, "object", ["dbdict", prefixName]));
	}
	else
	{
		lib.patchrelHelper.errorLog(funcs.scmsg(124, "patchrel", ["dbdict", prefixName]));
	}
}