function labelAlreadyExists(label, labels)
{
	var count = labels.length
	for( var i = 0; i < count; i++) {
		if(label == labels[i]) {
			return true;
		}
	}	
		return false;   
}

function processChildren(parent, operatorName, audienceType, parentID)
{
  var childrenLabels = new Array(0)
  var child = parent.getFirstChildElement()      
  while(child != null)
  {
    var inboxRecord = new SCFile("inbox")    
    //compute the class of the favorite + populate class specific fields
    var inboxClass = null
    var generator = child.getAttributeValue("generator")
    if (generator == "com.peregrine.generators.RecordGenerator")
    {
      if (child.getAttributeValue("dbrecord") == "yes")
      	inboxClass = "classRecord"
      else {
      	inboxClass = "classList"
      	if (child.getAttributeValue("count") == "yes")
      	  inboxRecord.list_display_count = true
      	else
      	  inboxRecord.list_display_count = false
      }
      inboxRecord.inbox_type = child.getAttributeValue("file")
      inboxRecord.short_query = child.getAttributeValue("query")
    }
    else if (generator == "com.peregrine.generators.FavoritesGenerator")
    {
      // default to folder
      inboxClass = "favoritesfolder"
      var favoriteClass = child.getAttributeValue("class")
      // dashboard
      if (favoriteClass == "dashboard" || favoriteClass == "publicdashboard")
        inboxClass = "com.peregrine.eclipse.chart.dashboard"
      // chart
      if (child.getAttributeValue("chart") == "chart")
      {
        inboxClass = "com.peregrine.eclipse.chart"
        inboxRecord.inbox_type = child.getAttributeValue("file")
        inboxRecord.short_query = child.getAttributeValue("query")
        inboxRecord.chart_type = child.getAttributeValue("type")
        inboxRecord.chart_break_down_by = child.getAttributeValue("field")
        if (child.getAttributeValue("look") == "look_3d")
          inboxRecord.chart_3d = true
        else
          inboxRecord.chart_3d = false
      }
    }
    else {
      // unknown type -> ignore this node
      child = child.getNextSiblingElement()
      continue
    }
    
    // common attributes
    inboxRecord.inbox_class = inboxClass
    // hierarchy attribute
    if (parentID != null)
      inboxRecord.container_id = parentID
    // audience and ownership       
    inboxRecord.operator_name = operatorName
    inboxRecord.audience_type = audienceType
    if (audienceType == "oneperson")
      inboxRecord.inbox_manager = operatorName
    // inbox label -> several sibling could have the same label in 6.0 but not in 6.1
    var favLabel = child.getAttributeValue("label")
	// limit the length of the inbox name to 150 characters
	favLabel = favLabel.substring(0, 149)
    var inboxLabel = favLabel
    var suffix = 1
    while (labelAlreadyExists(inboxLabel, childrenLabels) == true) {
    	inboxLabel = inboxLabel + "[" + suffix + "]"
    	suffix++
    }         
    childrenLabels.push(inboxLabel)
    inboxRecord.inbox_name = inboxLabel  
      
    // create inbox record
    var retCode = inboxRecord.doInsert()
    // recurse to children
    if (retCode == RC_SUCCESS)
    {           
      system.vars.$inbox_counter++
      var inboxID = inboxRecord.inbox_id
      processChildren(child, operatorName, audienceType, inboxID)
    }            
    child = child.getNextSiblingElement()
  }     
} 

function convertOldFavorites() {
	print( system.functions.scmsg(4, "inbox" ) )
	var systext = new SCFile("systext")
	var retCode = systext.doSelect("section=\"favorites\"")
    var counter = Array()
    counter[0] = 0
    system.vars.$inbox_counter = 0
	while(retCode == RC_SUCCESS)
	{
	  // retrieved record and set operator and audience
	  var operator = "%NONE%"
	  var audienceType = "everyone"
	  if (systext.entry == "private")
	  {
	    operatorName = systext.operator
	    audienceType = "oneperson"
	  }
	  var favoritesDef = systext.memo
	  var xmlDoc = new XML()
	  if( xmlDoc.setContent(favoritesDef, false) )
	  {           
	    var docRoot = xmlDoc.getDocumentElement()
	    processChildren(docRoot, operatorName, audienceType, null)  
	
	  }
	  else
	  {
		print( system.functions.scmsg( 148, "ScriptLibrary" ) );
	 	//print("Error parsing XML")
	  }
	  counter[0] += 1
	  if ( (counter[0] < 100 & counter[0] % 10 == 0 ) | counter[0] % 100 == 0 )
	  {
	    print( system.functions.scmsg(1, "inbox", counter) )
	  }
	  //get next systext record
	  retCode = systext.getNext()
	}
	var inbox_counter = Array()
	inbox_counter[0] = system.vars.$inbox_counter
    print( system.functions.scmsg(1, "inbox", counter) )
	print( system.functions.scmsg(3, "inbox", inbox_counter) )
	print( system.functions.scmsg(2, "inbox" ) )

}

