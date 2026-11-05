var versions = lib.upgradeConstants.SUPPORT_VERSIONS();
                  
var languages = lib.upgradeLanguage.getAllSupportedLanguages();

var isIIA=false;

var indexVersion=getVersionIndex();
version_date=funcs.str(funcs.tod());

var enableUpdate=false;

var add_count=0;
var update_count=0;
var none_count=0;

function getLanguages() {
    return languages;
}

function getTag(file)
{
    var tag = new SCDatum();
    funcs.rtecall("tag", 1, tag, file);
    var tagStr = tag.getText();
    return tagStr;
}

function getTagQuery(filename, tag)
{
    var fileTag = new SCFile(filename);
    
    var query=new SCDatum();    
    var ret =0;
    system.functions.rtecall("tagquery", ret, fileTag, query, tag);
	return query.getText();
}

function existTable(table) {
    var dbdict=new SCFile("dbdict");
    var rc=dbdict.doSelect("name=\""+table+"\"");
    if (rc==RC_SUCCESS) {
        return true;
    }
    print("Table "+table+" doesn't exist.");
    return false;
}

function ignoreTable(table) {
    if (table=="pdpatches") {
        print("Table "+table+" is ignored.");
        return true;
    }
    return false;
}


function makeSignatures(table, query, language) {
    if (table == null || !existTable(table) || ignoreTable(table)) {
        return;
    }
    
    var sql="true";
    if (query != null) {
        sql=query;
    }
    if (language != null) {
        if (sql.length>0) {
            sql=sql+" and ";
        }
        sql=sql+"syslanguage=\""+language+"\"";
    }
    
    var sigmake=new SCFile("signaturemake");
    var rc=sigmake.doSelect("table.name=\""+table+"\"");
    
    
    if (rc != RC_SUCCESS) {
        return;
    }
        
    var include=sigmake.fieldarray_type;
    
    var file=new SCFile(table);
    rc=file.doSelect(sql);
    
    var count=0;
    while (rc == RC_SUCCESS) {
        count=count+1;
        
        var name="";
        var oldname="";
        
        if (table=="inbox") {
            name=file["inbox.id"];
        }
        
        var i, length = sigmake.key.length();
        for (i=0; i<length; i++) {
            
            if ((table == "help" || table == "format" || table == "scmessage") && sigmake.key[i]=="syslanguage") {
                continue;
            }
            if (table=="inbox") {
                break;
            }
            if (file[sigmake.key[i]]==null) {
                name+="NULL";
            }
            else {
                name+=file[sigmake.key[i]];
            }
        }
        
        if (table == "help" || table == "format" || table == "scmessage") {
            oldname=name+file.syslanguage;
            name=file.syslanguage+name;        
        }
        
        
        var signature;
        var fields = sigmake.fields;
        if (include == null) {
            signature=funcs.make_sig(file);
        } else {
            signature=funcs.make_sig(file, sigmake.fields, include);
        }
        if (signature != null) {
            var tag=getTag(file);
            if (table=="inbox") {
                tag=table+";"+file["inbox.id"];
            }
            insertSignature(table, name, signature, indexVersion, oldname, tag);
        }
        
        if (count % 1000==0) {
            print("Make "+count+" Signatures for table "+table+(language!=null? " language "+language : "")+".");
        }
        rc=file.getNext();
    }
    print("Make "+count+" Signatures for table "+table+(language!=null? " language "+language : "")+".");
    funcs.rtecall("log", 1, "[Finish] Table "+table+" count "+count+" is finished.");
}

function length(array) {
	if (array == null) {
		return 0;
	}
		
	if (array instanceof Array) {
		return array.length;
	}
		
	return array.length();
}

function indexOfArray(array, value) {
	if (array==null || length(array)==0 || value == null) {
		return -1;
	}

	var i, len = length(array);
	for (i=0; i < len; i++) {
		if (array[i] == value) {
			return i;
		}
	}
	
	return -1;
}

function getRecord(table, query) {
	var file = new SCFile(table);
	var rc = file.doSelect(query);
	if(rc == RC_SUCCESS){
		return file;
	}
	return null;
}

function getVersionIndex() {
    var currVer = lib.upgradeVersionUtil.getCurrentVersion();
    
    if (currVer=="SM7" && isIIA) {
        currVer="SM7IIA";
    }
    
    var index=indexOfArray(versions, currVer);
    return index;
}

function insertSignature(table, name, signature, verindex, oldname, tag) {
    if (!isSignatureNew(table, name, signature, verindex, oldname, tag)) {
        return;
    }
    var file=new SCFile("signatures");
    file.object_type=table;
    file.object_name=name;
    file.type="Release";
    file.signature=signature;
    file.release_version=versions[verindex];
    
    file.tag=tag;
    file.signature_date=funcs.val(version_date, 3);
    add_count++;
    funcs.rtecall("log", 1, "[Add] Signature "+signature+" of table "+table+" name "+name+" for "+versions[verindex]+" tag:"+tag+" is added.");
    if (enableUpdate) {
        funcs.rtecall("log", 1, "Execute insert");
        file.doInsert();
    }
}

function updateSignature(file, signature, verindex) {
    funcs.rtecall("log", 1, "[Update] Signature "+signature+" of table "+file.object_type+" name "+file.object_name+" with signature "+signature+" for "+versions[verindex]+" is updated from signature "+file.signature+" for "+file.release_version);
    file.release_version=versions[verindex];
    file.signature_date=funcs.val(version_date, 3);
    update_count++;
    if (enableUpdate) {
        funcs.rtecall("log", 1, "Execute update");
        file.doUpdate();
    }
}

function escapeQuote(str) {
    if (str != null && str.length>0) {
		str = str.replace(/"/g, "\\\"");
	}
	return  str;
}

function isSignatureNew(table, name, signature, verindex, oldname, tag) {
    var query="object.type=\""+table+"\" and object.name=\""+escapeQuote(name)+"\" and signature="+signature;
    if (table == "help" || table == "format" || table == "scmessage") {
        query="object.type=\""+table+"\" and (object.name=\""+escapeQuote(name)+"\" or object.name=\""+escapeQuote(oldname)+"\") and signature="+signature;
    }
    var file=new SCFile("signatures");
    var rc=file.doSelect(query);
    if (rc==RC_SUCCESS) {
        if (file.release_version==null || file.release_version.length==0 || verindex<indexOfArray(versions, file.release_version)) {
            file.tag=tag;
            updateSignature(file, signature, verindex);
        } else {
            none_count++;
            funcs.rtecall("log", 1, "[None] Signature "+signature+" of table "+table+" name "+name+" is not changed");
        }
        return false;
    }
    return true;
}

function updateSignatureName(table) {
   var sigmake = getSignatureMake(table);
   if (sigmake == null) {
       return;
   }
   var file = new SCFile(table);
   var rc = file.doSelect("true");
   while (rc == RC_SUCCESS) {
       var oldname = getSignatureName(file, sigmake, true, table);
       var newname = getSignatureName(file, sigmake, false, table);
       var sig = new SCFile("signatures");
       var rc1 = sig.doSelect("object.type=\""+table+"\" and object.name=\""+oldname+"\"");
       while (rc1 == RC_SUCCESS) {
           sig.object_name=newname;
           if (!hasDuplicateSignature(sig)) {
               funcs.rtecall("log", 1, "[Update] Signature "+sig.signature+" of table "+sig.object_type+" name "+oldname+" for "+sig.release_version+" is updated to name "+sig.object_name);
               if (enableUpdate) {
                   funcs.rtecall("log", 1, "Execute update");
                   sig.doUpdate();
               }
           }
           rc1 = sig.getNext();
       }
       rc = file.getNext();
   }
}

function getSignatureName(file, sigmake, old, table) {
    var name="";
    var i, length = sigmake.key.length();
    for (i=0; i<length; i++) {
        
        if (table == "help" && sigmake.key[i] == "syslanguage") {
            continue;
        }
        if (file[sigmake.key[i]]==null) {
            name+="NULL";
        }
        else { 
            name+=file[sigmake.key[i]];
        }
    }
    
    if (table == "help") {
       if (old) {
           name+=file.syslanguage;
       } else {
           name=file.syslanguage+name;
       }
    }
    
    return name;
}

function getSignatureMake(table) {
    var sigmake = new SCFile("signaturemake");
    var rc = sigmake.doSelect("table.name=\""+table+"\"");
    if (rc == RC_SUCCESS) {
        return sigmake;
    }
    return null;
}

function hasDuplicateSignature(sigrecord) {
    var sig = new SCFile("signatures");
    var rc = sig.doSelect("object.type=\""+sigrecord.object_type+"\" and object.name=\""+sigrecord.object_name+"\" and signature="+sigrecord.signature);
    if (rc == RC_SUCCESS) {
        funcs.rtecall("log", 1, "[Duplicated]Signature "+sig.signature+" of table "+sig.object_type+" name "+sig.object_name+" has duplicated signature in "+sig.release_version);
        var index1 = indexOfArray(versions, sigrecord.release_version);
        var index2 = indexOfArray(versions, sig.release_version);
        if (index1 < index2) {
            funcs.rtecall("log", 1, "Update high version to lower");
            sig.release_version = sigrecord.release_version;
            sig.release_date = sigrecord.signature_date;
            if (enableUpdate) {
                funcs.rtecall("log", 1, "Execute update");
                sig.doUpdate();
            }
        } else if (index1 == index2) {
            funcs.rtecall("log", 1, "Strange Same");
        } else {
            funcs.rtecall("log", 1, "Do nothing");
        }
        return true;
    } else {
        return false;
    }
}

function updatePatchSignatures(name, englishOnly) {
    if (englishOnly == null) {
        englishOnly = false;
    }
    
    var patch=new SCFile("patches");
    var rc=patch.doSelect("name=\""+name+"\"");
    if (rc==RC_SUCCESS) {
        makeSignatures("code", patch.applicaton_sql);
        if (englishOnly) {
            makeSignatures("format", patch.format_sql, "en");
        } else {
            for (var j=0; j<languages.length; j++) {
                makeSignatures("format", patch.format_sql, languages[j]);
            }
        }
        
        var i, length = funcs.lng(patch.secondary);
        for (i=0; i<length; i++) {
            var dbdict=patch.secondary[i].dbdict;
            if (dbdict=="code" || dbdict=="format" || dbdict=="pdpatches") {
                continue;
            }
            if (dbdict=="help" || dbdict=="scmessage" || dbdict=="unitofmeasure") {
            	if (englishOnly) {
                    makeSignatures(dbdict, patch.secondary[i].query, "en");
                } else {
            	    for (var j=0; j<languages.length; j++) {
                        makeSignatures(dbdict, patch.secondary[i].query, languages[j]);
                    }
                }
            } else {
                makeSignatures(dbdict, patch.secondary[i].query);
            }
        }
        
    }
    funcs.rtecall("log", 1, "[Total] Signatures Add: "+add_count+" Update: "+update_count+" None: "+none_count);
}

function getObjectNameFromTag(table, tag) {
    return tag.replace(/;/g, "").substring(table.length);
}

function updatePdPatchSignatures() {
    var pdpatch=new SCFile("pdpatches");
    var rc=pdpatch.doSelect("filename~=\"datadict\" and action~=\"remove\"");
    while (rc==RC_SUCCESS) {
        var query=getTagQuery(pdpatch.filename, pdpatch.tag);
        if (pdpatch.filename=="inbox") {
            var objname=getObjectNameFromTag(pdpatch.filename, pdpatch.tag);
            query="inbox.id="+objname;
        }
        makeSignatures(pdpatch.filename, query);
        rc=pdpatch.getNext();
    }
    funcs.rtecall("log", 1, "[Total] Signatures Add: "+add_count+" Update: "+update_count+" None: "+none_count);
}

function generateSignatureUnloadScripts() {
    var objecttypes = getSignaturesObjectTypes();
    var i;
    for (i=0; i<objecttypes.length; i++) {
        createSignatureUnloadScript(objecttypes[i]);
    }
}

function getSignaturesObjectTypes() {
    var objecttypes = [];
    var sql = "select object.type, count(*) from signatures group by object.type order by object.type";
    var signature = new SCFile("signatures", SCFILE_READONLY);
    var rc = signature.doSelect(sql);
    while (rc == RC_SUCCESS) {
        objecttypes.push(signature["object.type"]);
        rc = signature.getNext();
    }
    
    return objecttypes;
}

function getUnloadScriptName(objecttype, language) {
    var name = "GoldSignatures_Unload_"+objecttype;
    if (language!=null && language!="") {
        name+="_"+language;
    }
    return name;
}

function createSignatureUnloadScript(objecttype, language) {
    var unload = new SCFile("unload");
    var unload_name = getUnloadScriptName(objecttype, language);
    var rc = unload.doSelect("name=\""+unload_name+"\"");
    if (rc == RC_SUCCESS) {
        unload.doDelete();
    } 
    unload = new SCFile("unload");
    unload["name"] = unload_name;
    unload["unload"] = true;
    unload["record"][0]["filename"] = "signatures";
    unload["record"][0]["query"] = "object.type=\""+objecttype+"\"";
    if (language!=null && language!="") {
        unload["record"][0]["query"]+=" and (object.name like \"*"+language+"\" or object.name like \""+language+"*\")";
    }
    
    unload.doInsert();

    return unload;
}

/* id is the value of the field id of hotfix
 * when localized is true, calculate signatures for other languages or only english
 */
function makeHotfixSignatures(id, localized) {
    if (localized == null) {
        localized = false;
    }
    
    var hotfix = new SCFile("hotfix")
    var rc = hotfix.doSelect("id=\"" + id + "\"");

    if (rc == RC_SUCCESS) {
        var files = hotfix["files"];
        var l = funcs.lng(files);
        for (var i=0; i<l; i++) {
            if (files[i] != null) {
                var name = files[i]["files.file"];
                var query = files[i]["files.query"];
                if (name != null && query != null) {
                    if (name == "RAD") {
                        name = "code";
                        query = query.replace(/application.name/g, "application");
                    } 
                
                    if (localized && (name == "format" || name == "scmessage" || name == "help" || name == "unitofmeasure")) {
                       for (var j=0; j<languages.length; j++) {
                            makeSignatures(name, query, languages[j]);
                        }
                    } else {
                        makeSignatures(name, query);
                    }
                }
            }
        }
    }
}

enableUpdate=true;
isIIA=false;


/*
for (var j=0; j<languages.length; j++) {
    makeSignatures("format", "true", languages[j]);
}

makeSignatures("currency");
makeSignatures("assignment");
makeSignatures("inbox");
makeSignatures("scripts");
makeSignatures("code"); 

updatePatchSignatures("SM96");
updatePatchSignatures("SM96", true); // Only for English
updatePdPatchSignatures();
*/