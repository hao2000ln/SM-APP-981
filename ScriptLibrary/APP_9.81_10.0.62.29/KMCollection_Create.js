/*   @author Tony Bray
 *
 *   Package: KMAdmin
 * 
 *   Description: Perform record locking, gather's collection information, makes plugin call
 *
*/

function createCollection(strCollectionAlias)
{
  var result = 0;
  result = system.library.KMSearchInterface.createIndex(strCollectionAlias);
  return result;

}


function addScripts(inFile)
{
    var scfile = inFile ? inFile : vars.$L_file;
	var arrayArgs = new SCDatum();
	arrayArgs.setType(8);  //type array
	arrayArgs.push(scfile.kbname);
	print(system.functions.scmsg(45, "km", arrayArgs));

  	var scriptlibFile = new SCFile("ScriptLibrary");
  	var scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_kmcategoryidxscript\"");

   	if( scFind == RC_SUCCESS )
	{
		arrayArgs = new SCDatum();
    	arrayArgs.setType(8);  //type array
    	arrayArgs.push(scriptlibFile.name);
    	print(system.functions.scmsg(46, "km", arrayArgs));
        scfile.categoryindexscript = scriptlibFile.name;
	}
	else
	{
		scFind = scriptlibFile.doSelect("name = \"kmcategoryidxscript\"");
	 	if (scFind == RC_SUCCESS )
	 	{
       		arrayArgs = new SCDatum();
       		arrayArgs.setType(8);  //type array
       		arrayArgs.push(scriptlibFile.name);
       		arrayArgs.push(scfile.kbname);	
       		print(system.functions.scmsg(47, "km", arrayArgs));
	  
	 		scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
	 		scriptlibFile.doInsert();
	 		scfile.categoryindexscript = scriptlibFile.name;
	 	}
	}
	
	// check for script in the field name....
   	var scriptlibFile = new SCFile("ScriptLibrary");
   	var scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_kmaccess\"");

   	if( scFind == RC_SUCCESS )
	{
		arrayArgs = new SCDatum();
    	arrayArgs.setType(8);  //type array
    	arrayArgs.push(scriptlibFile.name);
    	print(system.functions.scmsg(46, "km", arrayArgs));
        scfile.kbaccessscript = scriptlibFile.name;
	}
	else
	{
		scFind = scriptlibFile.doSelect("name = \"kmaccess\"");
		scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
		scriptlibFile.doInsert();
		scfile.kbaccessscript = scriptlibFile.name;
	}
	
	// check for script in the field name....
   	var scriptlibFile = new SCFile("ScriptLibrary");
   	var scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_kmsearchsecurity\"");

   	if( scFind == RC_SUCCESS )
	{
		arrayArgs = new SCDatum();
    	arrayArgs.setType(8);  //type array
    	arrayArgs.push(scriptlibFile.name);
    	print(system.functions.scmsg(46, "km", arrayArgs));
        scfile.searchsecurityscript = scriptlibFile.name;
		
	}
	else
	{
	 	scFind = scriptlibFile.doSelect("name = \"kmsearchsecurity\"");
	 	scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
	 	scriptlibFile.doInsert();
	 	scfile.searchsecurityscript = scriptlibFile.name;
	}	
	
// check for script in the field name....
   
    var scriptlibFile = new SCFile("ScriptLibrary");
    var scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_kmprocesslibcriteria\"");
    if( scFind == RC_SUCCESS )
	{
		arrayArgs = new SCDatum();
	    arrayArgs.setType(8);  //type array
	    arrayArgs.push(scriptlibFile.name);
	    print(system.functions.scmsg(46, "km", arrayArgs));
	    scfile.processlibcriteriascript = scriptlibFile.name;
		

	}
	else
	{
		 scFind = scriptlibFile.doSelect("name = \"kmprocesslibcriteria\"");
		 scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
		 scriptlibFile.doInsert();
		 scfile.processlibcriteriascript = scriptlibFile.name;
	}	
	
	if(scfile.kbtype == "okmlib")
	{
	  // check for script in the field name....
      scriptlibFile = new SCFile("ScriptLibrary");
      scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_OKMFeature\"");
      if( scFind == RC_SUCCESS )
	  {
		arrayArgs = new SCDatum();
	    arrayArgs.setType(8);  //type array
	    arrayArgs.push(scriptlibFile.name);
	    print(system.functions.scmsg(46, "km", arrayArgs));
	    scfile.featurescript = scriptlibFile.name;
	  }
	  else
	  {
		 scFind = scriptlibFile.doSelect("name = \"OKMFeature\"");
		 scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
		 scriptlibFile.doInsert();
	 	 scfile.featurescript = scriptlibFile.name;
	  }	
	}
	if(scfile.kbtype == "confluencelib")
    {
      // check for script in the field name....
      scriptlibFile = new SCFile("ScriptLibrary");
      scFind = scriptlibFile.doSelect("name = \""+system.library.KMUtils.scToJSName(scfile.kbname)+"_ConfluenceFeature\"");
      if( scFind == RC_SUCCESS )
      {
        arrayArgs = new SCDatum();
        arrayArgs.setType(8);  //type array
        arrayArgs.push(scriptlibFile.name);
        print(system.functions.scmsg(46, "km", arrayArgs));
        scfile.featurescript = scriptlibFile.name;
      }
      else
      {
         scFind = scriptlibFile.doSelect("name = \"ConfluenceFeature\"");
         scriptlibFile.name = system.library.KMUtils.scToJSName(scfile.kbname)+"_"+scriptlibFile.name;
         scriptlibFile.doInsert();
         scfile.featurescript = scriptlibFile.name;
      } 
    }
		
  return 0;	
}

function addTriggers()
{
  if (vars.$L_file.kbtype != "sclib" || vars.$L_file.sclibtablename == null)
    return;	var arrayArgs = new SCDatum();
  	arrayArgs.setType(8);  //type array
  	arrayArgs.push(vars.$L_file.sclibtablename);
  	print(system.functions.scmsg(41, "km", arrayArgs));
  	
  	var triglibFile = new SCFile("triggers");
   	var scFind = triglibFile.doSelect("trigger.name = \"after.add.KM."+vars.$L_file.sclibtablename+"\" and table.name=\""+vars.$L_file.sclibtablename+"\"");
   	if( scFind == RC_SUCCESS )
	{
	  
	}
   	else
   	{
    	var scFind = triglibFile.doSelect("trigger.name = \"after.add.KM\"");
    	if (scFind == RC_SUCCESS)
    	{
     		triglibFile.trigger_name += "."+vars.$L_file.sclibtablename;
     		triglibFile.table_name = vars.$L_file.sclibtablename;
     		triglibFile.doInsert();
    	} 
   	}
   	var scFind = triglibFile.doSelect("trigger.name = \"before.update.KM."+vars.$L_file.sclibtablename+"\" and table.name=\""+vars.$L_file.sclibtablename+"\"");
   	if( scFind == RC_SUCCESS )
	{
	  
	}
   	else
   	{
    	var scFind = triglibFile.doSelect("trigger.name = \"before.update.KM\"");
    	if (scFind == RC_SUCCESS)
    	{
     		triglibFile.trigger_name += "."+vars.$L_file.sclibtablename;
     		triglibFile.table_name = vars.$L_file.sclibtablename;
     		triglibFile.doInsert();
    	} 
   	}
   	var scFind = triglibFile.doSelect("trigger.name = \"after.update.KM."+vars.$L_file.sclibtablename+"\" and table.name=\""+vars.$L_file.sclibtablename+"\"");
   	if( scFind == RC_SUCCESS )
	{
	  
	}
   	else
   	{
    	var scFind = triglibFile.doSelect("trigger.name = \"after.update.KM\"");
    	if (scFind == RC_SUCCESS)
    	{
     		triglibFile.trigger_name += "."+vars.$L_file.sclibtablename;
     		triglibFile.table_name = vars.$L_file.sclibtablename;
     		triglibFile.doInsert();
    	} 
   	}
   	var scFind = triglibFile.doSelect("trigger.name = \"before.delete.KM."+vars.$L_file.sclibtablename+"\" and table.name=\""+vars.$L_file.sclibtablename+"\"");
   	if( scFind == RC_SUCCESS )
	{
	  
	}
   	else
   	{
    	var scFind = triglibFile.doSelect("trigger.name = \"before.delete.KM\"");
    	if (scFind == RC_SUCCESS)
    	{
     		triglibFile.trigger_name += "."+vars.$L_file.sclibtablename;
     		triglibFile.table_name = vars.$L_file.sclibtablename;
     		triglibFile.doInsert();
    	} 
   	}	  
}

