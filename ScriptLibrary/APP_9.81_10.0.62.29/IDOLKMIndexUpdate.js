var logger = getLog('IDOLKMIndexUpdate');
var IDOLKMIndexService = lib.IDOLKMIndexService.require();
var KMIDOLUtils = lib.KMIDOLUtils.require();
var KMDocument_Index_IDOL = lib.KMDocument_Index_IDOL.require();

var IDOLKMIndexUpdate = function() {

    var dbType = lib.dbdictHelper.getDbType();
    var adapter = lib.DataService.getAdaptor(dbType);

    function updatePendingCategory(kmlibfile, kbname) {
        var kmfind = kmlibfile.doSelect("collectionname = \"" + kbname + "\" and action = \"PCU\"");
        if (kmfind === RC_SUCCESS) {
            kmfind = kmlibfile.getFirst();
            //we have pending category updates, reset them to normal.
            var added_docid = "";
            while (kmfind == RC_SUCCESS) {
                kmlibfile.action = "D";
                kmlibfile.doUpdate();
                var newdocid = kmlibfile.docid;
                newdocid = newdocid.slice(0, newdocid.indexOf("_"));

                if (added_docid.indexOf(newdocid) < 0) {
                    kmlibfile.id = lib.KMCollection_Update_Utils.getNextKMUpdateId();
                    kmlibfile.docid = newdocid;
                    kmlibfile.action = "U";
                    kmlibfile.doSave();
                    added_docid += newdocid + ";";
                }
                kmfind = kmlibfile.getNext();
            }
        }
    }

    function processPendingDeleteDocs(kmlibfile, kbname) {
      try
      {
        var tablename = lib.upgradeUtility.getDatabaseTableName("kmknowledgebaseupdates");
        var sql = "update " + tablename + " set " + adapter.escapeField("ACTION") + "='D' where " +
            adapter.escapeField("ACTION") + "='PD' and " + adapter.escapeField("COLLECTIONNAME") + "='" + kbname + "'";
 
        var rc = lib.upgradeHelper.executeSQL(sql);
      }
      catch(e)
      {
        logger.error("meet exception in processPendingDeleteDocs:"+e);
      }
      /*
        var kmfind = kmlibfile.doSelect("collectionname = \"" + kbname + "\" and action = \"PD\"");
        if (kmfind == RC_SUCCESS) {
            kmfind = kmlibfile.getLast();
            //we have pending deletes, reset them to normal deletes
            do {
                kmlibfile.action = "D";
                kmlibfile.doUpdate();
                kmfind = kmlibfile.getPrev();
            } while (kmfind == RC_SUCCESS);
        }
      */
    }


    function processPendingUpdateDocs(kmlibfile,kbname)
    {
       try
       {
         var tablename = lib.upgradeUtility.getDatabaseTableName("kmknowledgebaseupdates");
         var sql = "update " + tablename + " set " + adapter.escapeField("ACTION") + "='U' where " +
            adapter.escapeField("ACTION") + "='PU' and " + adapter.escapeField("COLLECTIONNAME") + "='" + kbname + "'";
 
         var rc = lib.upgradeHelper.executeSQL(sql);
      }
      catch(e)
      {
         logger.error("meet exception in processPendingUpdateDocs:"+e);
      }
      /*  var kmfind = kmlibfile.doSelect("collectionname = \"" + kbname + "\" and action = \"PU\"");

        if (kmfind == RC_SUCCESS) {
            kmfind = kmlibfile.getLast();
            do {
                kmlibfile.action = "U";
                kmlibfile.doUpdate();
                kmfind = kmlibfile.getPrev();
            } while (kmfind == RC_SUCCESS);
        }*/
    }

    function processUpdate(strCollectionFile,kmlibfile, kbname)
    {
        var result = 0;
        // check for updates, if found, process them
        var kmfind = kmlibfile.doSelect("collectionname = \"" + kbname + "\"");
        if (kmfind === RC_SUCCESS) {

            result = processDeleteDocs(strCollectionFile,kmlibfile,kbname);
            print("processDeleteDocs: " + result);
            if (result == 0){
                deleteRecs("kmknowledgebaseupdates", "collectionname = \"" + kbname + "\" and action = \"PD\"");
            }

            result = processUpdateDocs(strCollectionFile,kmlibfile,kbname);
            print("processUpdateDocs: " + result);
            if (result == 0) {
                deleteRecs("kmknowledgebaseupdates", "collectionname = \"" + kbname + "\" and action = \"PU\"");
            }

            //set lastindextime
            var endDate = new Date();
            strCollectionFile.lastindextime = endDate;
            strCollectionFile.doSave();
        }

        return result;
    }

    function updateIndex(strCollectionFile) {
        var arrayArgs = new SCDatum();
        arrayArgs.setType(8);  //type array
        var kbname = lib.KMUtils.scToJSName(strCollectionFile.kbname);
        arrayArgs.push(kbname);
        print(funcs.scmsg(39, "km", arrayArgs));
        if(lib.IDOLKMHotnewsSearch.needShowHotnewsTop()) {
            lib.IDOLKMHotnewsSearch.updateHotNews();
        }
        var kmlibfile = new SCFile("kmknowledgebaseupdates");

        updatePendingCategory(kmlibfile,kbname);

        processPendingDeleteDocs(kmlibfile,kbname);
        processPendingUpdateDocs(kmlibfile,kbname);

        return processUpdate(strCollectionFile,kmlibfile, kbname);
    }

    function deleteAttachment(strCollectionFile,doc_id)
    {
        if(strCollectionFile.indexattachments) {
            lib.KMAttachment_Index.removeDocumentAttachment(doc_id, strCollectionFile);  
        }
    }

    function processDeleteDocs(strCollectionFile,kmlibfile,kbname) {
        var result = 0;
        var kmfind = kmlibfile.doSelect("collectionname = \"" + kbname + "\" and action = \"D\"");

        if (kmfind === RC_SUCCESS) {
            kmfind = kmlibfile.getFirst();
        }

        while (kmfind === RC_SUCCESS) {
            try {
        		//result = IDOLKMIndexService.deleteDocument(strCollectionFile.kbname, kmlibfile.sedocid);
        		result = IDOLKMIndexService.deleteIDOLKMDocument(strCollectionFile, kmlibfile.docid);
        	} catch (e) {
        		var exMsg =  'error occurs when deleting document ' + kmlibfile.sedocid + ', error message = ' + e.message;
        		logger.error(exMsg);
        		processIndexFailure( kmlibfile,  exMsg ) ;
        		kmlibfile.doDelete();
        		kmfind = kmlibfile.getNext();
        		continue;
        	}
            deleteAttachment(strCollectionFile, kmlibfile.docid);

			copyRecord(kmlibfile);
			
            if (result == 0) {
                kmlibfile.action = "PD";
                kmlibfile.doUpdate();
            }

            kmfind = kmlibfile.getNext();
        }

        return result;
    }

    function processIndexFailure(kmlibfile,errStr)
    {
        var tmpSedocid = kmlibfile.collectionname + "_" + kmlibfile.docid;
        lib.KMCollection_Update_Utils.createKnowledgebaseerror(kmlibfile.collectionname, tmpSedocid, errStr);
    }
    
    function processUpdateDocs(strCollectionFile,kmlibfile,kbname)
    {
        vars.$L_currRec = 0;
        var kmlibQuery = "collectionname = \"" + kbname + "\" and action = \"U\"";
        var totRec = kmlibfile.doCount(kmlibQuery);

        var result = lib.KMCollection_Update_Utils.setCurrentIndexTotRec(strCollectionFile, totRec);
        print(funcs.scmsg(40, "km"));

        var kmfind = kmlibfile.doSelect(kmlibQuery);

        if (kmfind == RC_SUCCESS) {
            kmfind = kmlibfile.getFirst();
            var currRec = 0;

            while (kmfind == RC_SUCCESS) {

                var sclibfile = new SCFile(strCollectionFile.sclibtablename);
                try {
                    sclibfile.setRecord(_reviseDateTimeFormat(kmlibfile.recdata));
                } catch (e) {
                    processIndexFailure(kmlibfile, "unable to index, table name and model mismatch");
                    kmfind = kmlibfile.doDelete();
                    
                    if (kmfind != RC_SUCCESS) {
                        processIndexFailure(kmlibfile, "unable to delete error record.");
                        break;
                    }
                    kmfind = kmlibfile.getNext();
                    continue;
                }

                currRec++;
                vars.$L_currRec = currRec;

                lib.KMCollection_Update_Utils.setCurrentIndexCurrRec(strCollectionFile, currRec);

                try{
                   result = KMDocument_Index_IDOL.indexDocument(strCollectionFile, sclibfile, false);
                   
                   if (result == -1) { 
                     processIndexFailure(kmlibfile, "Index failed.");
                     kmfind = kmlibfile.doDelete();
                   }
                } catch (e) {
                    processIndexFailure(kmlibfile, e.message);
                    kmfind = kmlibfile.doDelete();
                }
                
                copyRecord(kmlibfile);
                
                kmlibfile.action = "PU";
                kmlibfile.sedocid = kbname + "_" + lib.KMUtils.scToJSName(kmlibfile.docid) + "_0";
                kmlibfile.doUpdate();

                kmfind = kmlibfile.getNext();
            }
        }

        return 0;
    }


    function deleteRecs(table, query) {
        var kmuFile = new SCFile(table);
        kmuFile.doPurge(query);
    }
    
    function copyRecord( kmlibfile ){
       if (logger.isDebugEnabled()) {
           logger.debug("copy kmlibfile:" + kmlibfile);
       }
       
       var redo_file = new SCFile("kmknowledgebaseupdatesredo");
       var checkExistingSql = "id=\""+ kmlibfile["id"] +"\"";
       
       var redoRecordFind = redo_file.doSelect(checkExistingSql);

       if (redoRecordFind == RC_SUCCESS) {
           logger.info("found existing redo record in redofile , skiping copy file which kmupdate id is:" + kmlibfile["id"]);
       }else{
	       //funcs.fduplicate(redo_file, kmlibfile);
	       redo_file["docid"] = kmlibfile["docid"];
	       redo_file["collectionname"] = kmlibfile["collectionname"];
	       redo_file["action"] = kmlibfile["action"];
	       redo_file["sysmodtime"] = kmlibfile["sysmodtime"];
	       redo_file["sysmoduser"] = kmlibfile["sysmoduser"];
	       redo_file["sysmodcount"] = kmlibfile["sysmodcount"];
	       redo_file["id"] = kmlibfile["id"];
	       redo_file["sedocid"] = kmlibfile["sedocid"];
	       redo_file["recdata"] = kmlibfile["recdata"];
	       redo_file["origindate"] = kmlibfile["sysmodtime"]   ;
	       var rc = redo_file.doInsert();
	       if (rc != RC_SUCCESS) {
	          logger.error("Error inserting into kmknowledgebaseupdatesredo table, with return value is: " + rc);
	      }
       }
    }
    
    
    /*
     * QCCR72469: Field contains an invalid date/time value
     */
    function _reviseDateTimeFormat(modelXML) {

        var sf_datemake = funcs.datemake;
        var sf_str = funcs.str;
        var rexDT = /\s*(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+):(\d+)\s*/; // mm/dd/yy

        function _datemake(year, month, day, hour, minute, second) {
            var dt = new SCDatum();
            dt.setType(3);
            sf_datemake(dt, year, month || 1, day || 1, hour || 0, minute || 0, second || 0);
            return dt;
        }

        function reviseDateTime(strDT) {
            var arr = rexDT.exec(strDT);
            if (arr && arr.length > 0) {
                var month = parseInt(arr[1], 10);
                var day = parseInt(arr[2], 10);
                var year = parseInt(arr[3], 10);
                var hour = parseInt(arr[4], 10);
                var minute = parseInt(arr[5], 10);
                var second = parseInt(arr[6], 10);
                
                var scdt = _datemake(year, month, day, hour, minute, second);
                return sf_str(scdt);
            } else {
                return strDT;
            }
        }

        function reviseThrough(curEle) {
            if (curEle) {
                var type = curEle.getAttributeValue('type');
                type = ( type ? type.toLowerCase() : '' );
                if ('datetime' === type) {
                    curEle.setText(reviseDateTime(curEle.getText()));
                } else {
                    var ele = curEle.getFirstChildElement();
                    if (ele) {
                        reviseThrough(ele);
                        while ( ele = ele.getNextSiblingElement() ) {
                            reviseThrough(ele);
                        }
                    }
                }
            }
        }

        // revise date time in the model xml
        var xmlNode = new XML();
        xmlNode.setContent(modelXML);
        reviseThrough(xmlNode);
        return xmlNode.toXMLString();
    }

    return{
        "updateIndex": updateIndex
    };
}();

function require()
{
    return IDOLKMIndexUpdate;
}