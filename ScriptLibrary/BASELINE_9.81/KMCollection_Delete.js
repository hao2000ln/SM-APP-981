/*   @author Tony Bray
 *
 *   Package: KMAdmin
 * 
 *   Description: Perform record locking, gather collection information, make plugin call
 *
*/

function deleteCollection(strCollectionAlias) {
  var result = 0;
  result = system.library.KMSearchInterface.deleteIndex(strCollectionAlias);
  return result;
}

function removeTriggers(kmknowledgebase) {
  if (kmknowledgebase.kbtype != "sclib") {
    return;  
  }

  var kmlibFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
  var rc = kmlibFile.doSelect("sclibtablename = \"" + kmknowledgebase.sclibtablename+"\" and kbname ~=\""+kmknowledgebase.kbname+"\"");
  if (rc == RC_SUCCESS) {
    print(system.functions.scmsg(42, "km"));
  } else {
    print(system.functions.scmsg(43, "km"));
    var triglibFile = new SCFile("triggers");
    var rc1 = triglibFile.doSelect("table.name = \"" + kmknowledgebase.sclibtablename + "\"");
    if( rc1 == RC_SUCCESS) {
      rc1 = triglibFile.getFirst();
      while( rc1 == RC_SUCCESS ) {
        if (triglibFile.trigger_name == "after.add.KM." + kmknowledgebase.sclibtablename) {
          triglibFile.doDelete();
        }
        if (triglibFile.trigger_name == "before.update.KM." + kmknowledgebase.sclibtablename) {
          triglibFile.doDelete();
        }
        if (triglibFile.trigger_name == "after.update.KM." + kmknowledgebase.sclibtablename) {
          triglibFile.doDelete();
        } 
        if (triglibFile.trigger_name == "before.delete.KM." + kmknowledgebase.sclibtablename) {
          triglibFile.doDelete();
        } 
        rc1 = triglibFile.getNext();
      }
    } else {
      print(system.functions.scmsg(44, "km"));
    }
  }  
}
