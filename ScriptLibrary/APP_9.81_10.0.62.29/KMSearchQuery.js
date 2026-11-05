/**  @fileoverview KMSearchQuery
 *   @Modified by Huan Li
 */

function getvalidKBs(record, user) {
    record.knowledgebases.pop();
    record.kbselections.pop();
    var tempknowledgebases =  new Datum();
    tempknowledgebases.setType(8);
    var tempShowName =  new Datum();
    tempShowName.setType(8);
    var filemaps = new SCDatum();
    filemaps.setType(8); //type array   
    vars.$fsyslibs = filemaps;
    var kmlibFile = new SCFile("kmknowledgebase");
    var kmFind = kmlibFile.doSelect("true");
    if (kmFind == RC_SUCCESS) {
        kmFind = kmlibFile.getFirst();
        var count = 0; // for the index
        var libArray;
        if(vars.$G_kmsearchengine == "IDOL") {
            libArray =lib.KMQuery_IDOL.require().getOnLineLibs();
        }
        while (kmFind == RC_SUCCESS) {        
        	var nameNoDot = lib.KMUtils.removetoken(kmlibFile.kbname, ".");
            var nameNoUnderscore = lib.KMUtils.removetoken(nameNoDot, "_");
			nameNoUnderscore = nameNoUnderscore.replace(/ /g, "");
			
            // check user rights for this kb
            var strEval = true;
            if (kmlibFile.kbaccessscript) {
            	strEval = eval("lib." + kmlibFile.kbaccessscript + ".checkAccess(user,kmlibFile)");
            }

            if (vars.$G_kmsearchengine != "IDOL")
            {
                if (lib.KMCollection_Statistics.checkIndexStatus(kmlibFile.kbname) != 0)
                {
                    
                    strEval = false;
                }
            }
            else
            {
                if( !lib.ArrayUtil.contains(libArray,kmlibFile.kbname))
                {
                    strEval = false;
                }
            }
            
            if (strEval) {
                tempknowledgebases.push(kmlibFile.kbname);
                tempShowName.push(kmlibFile.kbdescription);
                if (kmlibFile.kbtype == "fsyslib") {
                    var arrayLength = kmlibFile.fileURLlist.length();
                    var m;
                    for (m = 0; m < arrayLength; ++m) {
                        var fileURLlist = kmlibFile.fileURLlist[m];
                        
                        if (!funcs._null(fileURLlist) && fileURLlist.filestartpath != null && fileURLlist.filestartpath != "" && fileURLlist.filestartpath != "null" && fileURLlist.filemapfrom != null && fileURLlist.filemapfrom != "" && fileURLlist.filemapfrom != "null" && fileURLlist.filemapto != null && fileURLlist.filemapto != "" && fileURLlist.filemapto != "null") {
                            vars.$fsyslibs.push(kmlibFile.kbname + ";" + fileURLlist.filestartpath + ";" + fileURLlist.filemapfrom + ";" + fileURLlist.filemapto);
                        }
                    }
                    
                }++count;
                
            } else {
            	
            	if (funcs.exists(nameNoUnderscore, record)) {
                    eval("record." + nameNoUnderscore + "=false;");
                }
                eval("vars.$" + nameNoUnderscore + "index=-1;");
            }
            kmFind = kmlibFile.getNext();
        }
    }
    
    if(tempknowledgebases.length()>0) {
        reorderKnowledgebase(record,tempknowledgebases,tempShowName);
    }
    
}


function getSectionDisplayNames() {
    var tempknowledgebases =  new Datum();
    tempknowledgebases.setType(8);
    var tempShowName =  new Datum();
    tempShowName.setType(8);
    var kmlibFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
    kmlibFile.setFields(["kbname", "kbdescription"]);
    var kmFind = kmlibFile.doSelect("true");
    if (kmFind == RC_SUCCESS) {
        kmFind = kmlibFile.getFirst();
        var count = 0; // for the index
        while (kmFind == RC_SUCCESS) {
            nameNoDot = lib.KMUtils.removetoken(kmlibFile.kbname, ".");
            nameNoUnderscore = lib.KMUtils.removetoken(nameNoDot, "_");
            nameNoUnderscore = nameNoUnderscore.replace(/ /g, "");
            tempknowledgebases.push(kmlibFile.kbname);
            tempShowName.push(kmlibFile.kbdescription);
            kmFind = kmlibFile.getNext();
        }
    }
    if(tempknowledgebases.length()>0) {
        reorderSectionDisplayNames(tempknowledgebases,tempShowName);
    }
}

function reorderSectionDisplayNames(tempknowledgebases,tempShowName)
{
    var oldindex=0;
    oldindex = checkLibraryAvailable(tempknowledgebases,"Knowledge_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name1=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name1=\""+ tempknowledgebases[oldindex] +"\";");
		}
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"KnownError_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name2=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name2=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Problem_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name3=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name3=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Incident_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name4=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name4=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Interaction_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name5=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name5=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Change_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name6=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name6=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Request_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name7=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name7=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Catalog_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name8=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name8=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Contact_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name9=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name9=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Location_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name10=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name10=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Device_Library");
    if(oldindex>=0)
    {
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	eval("vars.$L_name11=\""+ tempShowName[oldindex] +"\";");
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	eval("vars.$L_name11=\""+ tempknowledgebases[oldindex] +"\";");
        }
    }
    funcs.cleanup(tempknowledgebases);
    funcs.cleanup(tempShowName);
}

function reorderKnowledgebase(record,tempknowledgebases,tempShowName)
{
    var tmpindex=0;
    var oldindex=0;
    oldindex = checkLibraryAvailable(tempknowledgebases,"Knowledge_Library");
    if(oldindex>=0)
    {
        record.kbselections.push(true);
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	record.knowledgebases.push(tempShowName[oldindex]);
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	record.knowledgebases.push(tempknowledgebases[oldindex]);
        }
        eval("record.KnowledgeLibrary=true;");
        eval("vars.$KnowledgeLibraryindex=" + tmpindex + ";");
        tmpindex++;
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"KnownError_Library");
    if(oldindex>=0)
    {
        record.kbselections.push(true);
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	record.knowledgebases.push(tempShowName[oldindex]);
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	record.knowledgebases.push(tempknowledgebases[oldindex]);
        }
        eval("record.KnownErrorLibrary=true;");
        eval("vars.$KnownErrorLibraryindex=" + tmpindex + ";");
        tmpindex++;
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Problem_Library");
    if(oldindex>=0)
    {
        record.kbselections.push(true);
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	record.knowledgebases.push(tempShowName[oldindex]);
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	record.knowledgebases.push(tempknowledgebases[oldindex]);
        }
        eval("record.ProblemLibrary=true;");
        eval("vars.$ProblemLibraryindex=" + tmpindex + ";");
        tmpindex++;
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Incident_Library");
    if(oldindex>=0)
    {
        record.kbselections.push(true);
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	record.knowledgebases.push(tempShowName[oldindex]);
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	record.knowledgebases.push(tempknowledgebases[oldindex]);
        }
        eval("record.IncidentLibrary=true;");
        eval("vars.$IncidentLibraryindex=" + tmpindex + ";");
        tmpindex++;
    }
    oldindex = checkLibraryAvailable(tempknowledgebases,"Interaction_Library");
    if(oldindex>=0)
    {
        record.kbselections.push(true);
        if(tempShowName[oldindex]!=null)
        {
        	tempShowName[oldindex] = getLocalizedLibraryName(tempShowName[oldindex]);
        	record.knowledgebases.push(tempShowName[oldindex]);
        }
        else 
        {
        	tempknowledgebases[oldindex] = getLocalizedLibraryName(tempknowledgebases[oldindex]);
        	record.knowledgebases.push(tempknowledgebases[oldindex]);
        }
        eval("record.InteractionLibrary=true;");
        eval("vars.$InteractionLibraryindex=" + tmpindex + ";");
        tmpindex++;
    }
    
    var j, length = tempknowledgebases.length(); 
    for(j =0;j<length;++j)
    {
        if(tempknowledgebases[j]!="Knowledge_Library" && tempknowledgebases[j]!="Problem_Library" &&
            tempknowledgebases[j]!="KnownError_Library" && tempknowledgebases[j]!="Incident_Library" && tempknowledgebases[j]!="Interaction_Library")
        {
            record.kbselections.push(true);
            if(tempShowName[j]!=null)
            {
            	tempShowName[j] = getLocalizedLibraryName(tempShowName[j]);
            	record.knowledgebases.push(tempShowName[j]);
            }
            else 
            {
            	tempknowledgebases[j] = getLocalizedLibraryName(tempknowledgebases[j]);
            	record.knowledgebases.push(tempknowledgebases[j]);
            }
            var tmpnameNoDot = lib.KMUtils.removetoken(tempknowledgebases[j], ".");
            var tmpnameNoUnderscore = lib.KMUtils.removetoken(tmpnameNoDot, "_");
            tmpnameNoUnderscore = tmpnameNoUnderscore.replace(/ /g, "");
            eval("record."+ tmpnameNoUnderscore +"= true;");
            eval("vars.$"+ tmpnameNoUnderscore +"index=" + tmpindex + ";");
            tmpindex++;
        }
    }
    funcs.cleanup(tempknowledgebases);
    funcs.cleanup(tempShowName);
}

function checkLibraryAvailable(tempknowledgebases,kbname)
{
	var k, length = tempknowledgebases.length(); 
    for(k = 0; k<length;++k)
    {
        if(tempknowledgebases[k]==kbname)
        {
            return k;
        }
    }
    return -1;
}

function getsearchSecurity(user, kblist) {
    var kmsearchquery = "";
    var tmpsearchquery = "";
    var kmlibFile = new SCFile("kmknowledgebase");
    var kmFind = kmlibFile.doSelect("true");
    if (kmFind == RC_SUCCESS) {
        kmFind = kmlibFile.getFirst();
        while (kmFind == RC_SUCCESS) {
            
            // check kbname in kblist, no need to check kbs the user doesn't have access to.
            if (kblist.indexOf(kmlibFile.kbname) > -1) {
                tmpsearchquery = eval("lib." + kmlibFile.searchsecurityscript + ".getSecurityInfo(user, kmlibFile)");
                
                if (tmpsearchquery.length > 1)
                {
                    if (kmsearchquery.length < 1)
                    {
                        kmsearchquery = "(" + tmpsearchquery + " AND ( knowledgebase_name: " + kmlibFile.kbname + "))";
                    }
                    else
                    {
                        kmsearchquery += " OR " + tmpsearchquery;
                    }
                }
                else {
                    if (kmsearchquery.length < 1) {
                        kmsearchquery += " ( knowledgebase_name: " + kmlibFile.kbname + ")";
                    } else {
                        kmsearchquery += " OR ( knowledgebase_name: " + kmlibFile.kbname + ")";
                    }
                }
            } // if (kblist.indexOf(kmlibFile.kbname) > -1)
            kmFind = kmlibFile.getNext();
        } //while( kmFind == RC_SUCCESS ) 


    } //if( kmFind == RC_SUCCESS )
    return kmsearchquery;
}


/**
 * Generate search query based on the kmdocument query SCFile
 *
 * @param {SCFile} kmfile
 * @returns {String} the query string
 */
function buildKMDSearchQuery(kmfile) {
	var queryStr = "true";

	if (kmfile.id != null) {
		queryStr += " and id = \""+kmfile.id+"\"";
	}

	if (kmfile.doctype != null) {
		queryStr += " and doctype = \""+kmfile.doctype+"\"";
	}

	if (kmfile.locale != null) {
		queryStr += " and locale = \""+kmfile.locale+"\"";
	}

	if (kmfile.title != null) {
		queryStr += " and title like \"*"+kmfile.title+"*\"";
	}

	if (kmfile.summary != null) {
		queryStr += " and summary like \"*"+kmfile.summary+"*\"";
	}

	//print ("kmfile.status  is " + kmfile.status );
	if (kmfile.status != null && kmfile.status != "all") {
		queryStr += " and status=\"" + kmfile.status + "\"";
	}

	if (kmfile.logical_name != null && kmfile.logical_name.length() > 0 && kmfile.logical_name[0] != null) {
	 
		queryStr += " and logical.name like \"*"+kmfile.logical_name[0]+"*\"";
	}
	
	if (kmfile.author != null) {
		queryStr += " and author = \""+kmfile.author+"\"";
	}
		
	var number_categories = funcs.lng(funcs.denull(kmfile.categories));
	if (number_categories > 0) {
		var connector = " and (";
		var i;
		for (i = 0; i < number_categories; ++i) {
			if (kmfile.categories[i] != null) {
				queryStr += connector + "categories # \"" + kmfile.categories[i] + "\"";
				connector = " or ";				
			}
		}
		queryStr += ")";
	}
	//print("Query: " + queryStr);
	return queryStr;
}


/**
 * Generate search query for published kmdocument
 *
 * @param {String} status
 * @returns {String} the query string
 */
function buildKMDSearchPublishPermissionQuery(status) {
	var queryStr = "true";
	
	// return all published documents if user is admin
	if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
	    funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ) {
		if (status == null || status == "all") { 
			queryStr = "status isin {\"external\",\"internal\"}";
		}
		else {
			queryStr = "status=\"" + status + "\"";
		}
	} 
	else if (status == null || status == "all") {
		queryStr  = "( ( status=\"external\" ";
		queryStr += lib.KMSecurity.getCatsQueryForDocument(vars.$G_viewext);
		queryStr += ") or ";
		queryStr += "( status=\"internal\"";
		queryStr += lib.KMSecurity.getCatsQueryForDocument(vars.$G_viewintext);
		queryStr += ") )";
	} 
	else if (status == "external") { 
		queryStr  = "( status=\"external\" ";
		queryStr += lib.KMSecurity.getCatsQueryForDocument(vars.$G_viewext);
		queryStr += ")";
	} 
	else if (status == "internal") {
		queryStr  = "( status=\"internal\" ";
		queryStr += lib.KMSecurity.getCatsQueryForDocument(vars.$G_viewintext);
		queryStr += ")";
	}
	
	return queryStr;
}

 /*
  * QCCR1E90473 KM doc's URL is out of security control
  * build kmdocument external search permission query
  * added by Zhang, Zhen-Qing
  */
function buildExtKMDSearchPermissionSubQuery() {

	var _index = funcs.index;
	var subQuery = "";
	
	// admin 	
	if (_index("SysAdmin", vars.$lo_ucapex) > 0 ||
		_index("KMAdmin", vars.$lo_ucapex) > 0 || 
		_index("SysAdmin", vars.$lo_operator["cap.exec"]) >0 || 
		_index("KMAdmin", vars.$lo_operator["cap.exec"])> 0) {
		if (vars.$G_ess) {
			subQuery += " and status isin {\"external\", \"internal\"}";
		}
	} 
	// normal user
	else {
		subQuery += "and (";
		
		// publish
		subQuery += buildKMDSearchPublishPermissionQuery(); 

		if (!vars.$G_ess) {
		
			// retire
			if (vars.$G_km_environment.retire) {
				subQuery += " or (" + vars.$G_retiredquery + ")";
			}
			
			// review
			subQuery += ' or (status="review"';
			if (vars.$G_viewwc.length() > 0) {
				subQuery += lib.KMSecurity.getCatsQueryForDocument(vars.$G_viewwc);
			}
			subQuery += ')';
			
			// draft	 
			subQuery += " or (" + vars.$G_draftquery + ")";
						
			// other
			subQuery += " or (" + vars.$G_wcquery + ")";
		}
		
		subQuery += ") ";
	}
	
//	print(subQuery);
	return subQuery;
}


 /*
  *  Return localized library name in KMSearch page.
  * added by Liu, Hou-Dong
  */
function getLocalizedLibraryName(libraryName){
	if (libraryName == null){
		return null;
	}else{
		var msgText = funcs.scmsg(libraryName,"kmquery");
		if (msgText.indexOf("Could not be found")>-1){
			msgText = libraryName;
		}
		return msgText;
	}
}  
