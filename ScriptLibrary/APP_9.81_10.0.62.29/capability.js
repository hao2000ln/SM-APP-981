/**
 * get all the capability words by corresponding operator
 */
function getAllCapabilityWordbyOperator(operatorName)
{
    var ucapex;
    if (operatorName == undefined || operatorName == null)
    {
        ucapex = vars.$lo_ucapex;
    } 
    else 
    {
        var operator = new SCFile("operator", SCFILE_READONLY);
        operator.setFields("cap.exec");

        var rc = operator.doSelect("name=\""+operatorName+"\"");
        if (rc != RC_SUCCESS) {     
            return null;
        }
        ucapex = operator.cap_exec;
    }
    
    var wordArray = [];

    var i, iLoopTimes = ucapex.length(); 
    for (i = 0; i < iLoopTimes; i++)
    {
        addChildCapabilityWords(wordArray, ucapex[i]);
    }
    
    return wordArray;
}


function getAllCapabilityWordDatumbyOperator(operatorName)
{
    var wordArray = getAllCapabilityWordbyOperator(operatorName);
	return 	lib.ArrayUtil.toSCDatum(wordArray);
}


function addChildCapabilityWords(capabilityWordArray, capabilityWord)
{
    if (capabilityWord == null) {
        return;
    }
        
    if (lib.ArrayUtil.contains(capabilityWordArray, capabilityWord)) {
        return;
    }

    capabilityWordArray.push(capabilityWord);
    
    var capFile = new SCFile( "capability", SCFILE_READONLY );
    capFile.setFields(["capability"]);
    var rc = capFile.doSelect("parent=\"" + capabilityWord + "\"" );
    while(rc == RC_SUCCESS)  
	{ 	
        addChildCapabilityWords(capabilityWordArray, capFile.capability);
        rc = capFile.getNext();
    }
}


function checkPermission( capabilityWord, operatorName )
{
    //  This function will return true if the current operator
    //  has the passed capability word, or any capability word that 
    //  is in the parent tree of that capability word.  Otherwise
    //  it returns false.
  
  	//Add this statement for serviceCatalog project  	
    var wordArray = getAllCapabilityWordbyOperator(operatorName);
    if (wordArray == null) {
        return false;
    }
        
    return lib.ArrayUtil.contains(wordArray, capabilityWord);
}


function updateParentTree(record)
{
  // Walk up the parents for this capability word
  // and populate the parent tree accordingly.
  var x = new SCFile("capability", SCFILE_READONLY);
  x.setFields(["parent"]);
  var nextParent;
  var current = record.capability;
  record.parent_tree = [];
  if ( record.parent != null) 
  {
    nextParent = record.parent;
    var index = 0;

    while ( nextParent != null )
    {
      var i, iLoopTimes = record.parent_tree.length();
      for (i = 0; i < iLoopTimes; i++)
      {
          if ( nextParent == record.parent_tree[i] || nextParent == current ) 
          {
            print( funcs.scmsg( 149, "ScriptLibrary" ) );
            nextParent = null;
            return -1;
          }  
      }
      record.parent_tree[index] = nextParent;
      index++;
      if ( x.doSelect( "capability=\""+ nextParent +"\"") == RC_SUCCESS )
      {
        nextParent = x.parent;
      }
      else {
        nextParent = null;
      }
    }
  }
  return 0;
}

function updateChildCapabilities(record)
{
  //  if we changed the parent of this capability word then all the children
  //  of this capability need to be recalculated as well.
  
  //  It would be quicker to simply grab the immediate parent and use its
  //  parent tree but then we would run into problems with records being loaded
  //  and unloaded into different systems.  While slower, this process is much
  //  safer, and since we wont be added capability words too often it should be fine.
  
  var x = new SCFile("capability");
  
  if ( x.doSelect( "parent=\""+ record.capability +"\"") == true )
  {
     do
        {
          x.doUpdate();
        }
     while (x.getNext() == RC_SUCCESS);
  }
}

