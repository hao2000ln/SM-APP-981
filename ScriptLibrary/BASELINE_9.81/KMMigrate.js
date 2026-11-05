/**   @class KMMigrate
*   @constructor
*/

// BACK UP YOUR DATABASE BEFORE CALLING THIS SCRIPT from the RunKMMigrate ScriptLibrary.

function migrate(fileName)
{
	var xmlObj =  new XML();
	vars.$operatorcnt   = 0;
	vars.$contactscnt   = 0;
	vars.$kmgroupcnt    = 0;
	vars.$kmcategorycnt = 0;
	vars.$kmdoctypecnt  = 0;
	// set max password length to 10 in case we can't read the system information record
	vars.$L_maxpwdlen  = 10; 
	
	// Get the max password length once and store it in a local variable
	var infoFile = new SCFile("info");
	var rc = infoFile.doSelect( "type = \"company\" and format = \"info.company\"");  
	if ( rc == RC_SUCCESS )
	{
		vars.$L_maxpwdlen = infoFile.max_pwd_len;
	}
	
	// The file starts with <?xml version="1.0" encoding="UTF-8"?>, so strip that off
	// The XML element string starts with "<migrationdoc>"
	var textFileStr = readFile( fileName, "t" );
	if (textFileStr  == -1)
	{
		print( "Error: Could not read the file at " + fileName + ". Please check that the path and filename are valid.");
		return;	
	}
	
	var startChar = textFileStr.indexOf("<migrationdoc>");  
	if ( startChar < 0 )
	{
		print("Error: The \"migrationdoc\" element could not be found in file " + fileName + ". No data migration was performed.");
		return;
	}
	
	textFileStr = textFileStr.substring(startChar, textFileStr.length);
	

	if ( xmlObj.setContent( textFileStr ) == false )
	{
		print( "Error: Could not either read the file or parse the XML at " + fileName );
		return null;
	}

	var docElem = xmlObj.getDocumentElement();  // get the root node
	
	if ( docElem == null )
	{
		print("Error: Could not parse this file. No data migration was performed.");
		return;
	}

	if ( docElem.getNodeName() != "migrationdoc" )
	{
		print("Error: The name of the first element must be \"migrationdoc\". No data migration was performed.");
		return;
	}
	
	// The next element names an SC file to import into. 
	// These SC files are tested: contacts, operator, kmgroup, kmcategory. kmdoctype 
	// A count of how many records were imported into each SC file is output at the end of the import.
		
	var strEval = "";
	var node = docElem.getFirstChildElement();
 	 
	while (node != null)
	{
		var nodeName = node.getNodeName();
		

		// Create an SCFile object to fill values into.
		var kmFile = new SCFile(nodeName); // contacts, operator, kmgroup, kmcategory. kmdoctype
		
		
		if ( system.functions.filename(kmFile) == null || system.functions.filename(kmFile) == "" )
		{
			print("Could not determine filename.");
			return;
		}
		
		// If this function has at least two arguments, 
		//   then the second argument is a preprocessor script to be called
		
		
		
		if (arguments.length > 1 && arguments[1] != null && arguments[1] != "")
		{
			
			eval(arguments[1]);
		}
			
		// Fill in the data for this record.
		var child = node.getFirstChildElement();
		while( child != null )
		{   
		   
		   walkXML( child, kmFile );
		   child = child.getNextSiblingElement();
		}  
		
		// Save this imported record, and update the stats
		
		// If this function has at least three arguments, 
		//   then the third argument is a pre-save script to be called
		var okToSave = true;
		if (arguments.length > 2 && arguments[2] != null && arguments[2] != "")
		{
			eval(arguments[2]);
		}
		if (okToSave)
			rc = kmFile.doSave();
		
		// If this function has at least four arguments, 
		//   then the fourth argument is a post-save script to be called
		// You might use this to create or update a related record.
		if (arguments.length > 3 && arguments[3] != null && arguments[3] != "")
		{
			eval(arguments[3]);
		}
		
		strEval = "vars.$" + nodeName + "cnt += 1;"; // Update the statistics.
	    eval(strEval);  
				 
		node = node.getNextSiblingElement();
	}  
	print(vars.$operatorcnt + " operator records added or updated");
	print(vars.$contactscnt + " contact records added or updated");
	print(vars.$kmgroupcnt + " kmgroup records added or updated");
	print(vars.$kmcategorycnt + " kmcategory records added or updated");
	print(vars.$kmdoctypecnt + " kmdoctype records added or updated");
	return;
}
	
	

function walkXML( node, kmFile )
{
	 var rc;
	 var aIndex = 0;  // array index	 
	 var bIndex = 0;  // array within an array index
	 var strEval = "";
 	 var nodeName = node.getNodeName();
	 
	 
	 var attr = node.getFirstAttribute(); // Only interested in the _type attribute
	 var attrName = "";
	 var attrValue = "";
	 if ( attr != null )
	 {   
		attrName  = attr.getNodeName();
		attrValue = attr.getNodeValue();
		
	 }
	
	 var nodeValue = node.getNodeValue();
	 while (nodeValue == "\n")  // Skip the carriage return linefeeds CR LF
	 	nodeValue = node.getNodeValue();
	 
	 if ( typeof nodeValue == "string"  ) // && nodeValue.length > 0
	 {     
	 	if (attr != null && attrName == "_type")
		{
			var tmpFld = system.library.KMUtils.scToJSName(nodeName);
		
			switch( attrValue )
			{
				case "Text":
					if(nodeValue.indexOf("%0A") > -1)
						nodeValue=nodeValue.replace("%0A","\\n");
					if(nodeValue.indexOf("%0D") > -1)
						nodeValue=nodeValue.replace("%0D","\\r");
										
	    			strEval = "kmFile." + tmpFld + " = \"" + nodeValue + "\";";
	    			
		 			eval(strEval);  
					break;
					
				case "Decimal":
					if (!isNaN(nodeValue))
			    	{			
						var decimalNodeValue = parseFloat(nodeValue);
		    			strEval = "kmFile." + tmpFld + " = " + decimalNodeValue + ";";
	    				
			 			eval(strEval);  
			 		}
			 		else
			 		{
			 			print("Error: Cannot assign invalid decimal value " + nodeValue + " for Node " + nodeName + ". This field was not saved."); 
		    			strEval = "kmFile." + tmpFld + " = 0;";
	    				
			 			eval(strEval);  
					}
					break;
					
				case "Boolean":
					if (nodeValue == "true" || nodeValue == "false")
			    	{			
		    			strEval = "kmFile." + tmpFld + " = " + nodeValue + ";";
			 			eval(strEval);  
			 		}
			 		else
			 		{
			 			print("Error: Cannot assign invalid boolean value " + nodeValue + " for Node " + nodeName + ". This field was not saved."); 
		    			strEval = "kmFile." + tmpFld + " = false;";
			 			eval(strEval);  
					}
					break;	
	
				case "Array":
					// Does this Array already have other 'rows'/structures in it?
					// If so, adjust the array index aIndex; the index starts at 0

					var asChild = node.getFirstChildElement();
					while( asChild != null )
					{   
						var childName  = asChild.getNodeName();
						var childValue = asChild.getNodeValue();
						var attr = asChild.getFirstAttribute(); // Only interested in the type attribute
						attrName  = attr.getNodeName();
						attrValue = attr.getNodeValue();
			   			
			   			while (childValue == "\n")  // Skip the carriage return linefeeds CR LF
			 				childValue = asChild.getNodeValue();
						if ( typeof childValue == "string" && nodeValue.length > 0 )
						{     
						 	if (attrName == "_type")
							{
								var valuePresent = 0;
								switch( attrValue )
								{
									case "Text":
																			
										// Is this value already in the array? If so, do not add it
										strEval = "valuePresent = system.functions.index(childValue,kmFile." + tmpFld + ");";
										eval(strEval);
										
										if (valuePresent == 0)
										{											
											strEval = "kmFile." + tmpFld + "= system.functions.insert(kmFile." + tmpFld + ", 0, 1, \"" + childValue + "\");";
											eval(strEval);	
											break;
										}
										break;
										
									case "Decimal":
										if (!isNaN(childValue))
								    	{
								    		// Is this value already in the array? If so, do not add it
											strEval = "valuePresent = system.functions.index(childValue,kmFile." + tmpFld + ");";
											eval(strEval);
										
											if (valuePresent == 0)
											{											
								    			strEval = "kmFile." + tmpFld + "= system.functions.insert(kmFile." + tmpFld + ", 0, 1, " + parseFloat(childValue) + ");";
												eval(strEval);	
												break;
											}
								 		}
								 		else
								 		{
								 			print("Error: Cannot assign invalid decimal value " + childValue + " for Node " + nodeName + ". This field was not saved.");  
										}
										break;
										
									case "Boolean":
										if (childValue == "true" || childValue == "false")
								    	{	
								    		// Is this value already in the array? If so, do not add it
											strEval = "valuePresent = system.functions.index(childValue,kmFile." + tmpFld + ");";
											eval(strEval);
										
											if (valuePresent == 0)
											{											
								    			strEval = "kmFile." + tmpFld + "= system.functions.insert(kmFile." + tmpFld + ", 0, 1, " + childValue + ");";
												eval(strEval);	
												break;
											}
								 		}
								 		else
								 		{
								 			print("Error: Cannot assign invalid boolean value " + childValue + " for Node " + nodeName + ". This field was not saved."); 
										}
										break;	
										
									case "ArrayStructure":
										// Get each of the children one by one, and add them to the structure at a particular number, based on the dbdict (export will be in this order)
										
										// If no array created yet, create one.
							
										strEval = "kmFile." + tmpFld + "= system.functions.denull(kmFile." + tmpFld + ");";
										eval(strEval);
							
										// Does this Array already have other 'rows'/structures in it?
										// If so, adjust the array index aIndex; the index starts at 0
										strEval = "aIndex = kmFile." + tmpFld + ".length();";
										eval(strEval);
										
								   			
										var astructureChild = asChild.getFirstChildElement();
										while( astructureChild != null )
										{   
										    // Loop through the elements in this structure and add them to the array 
											var childName  = astructureChild.getNodeName();
											childName = system.library.KMUtils.scToJSName(childName);
											
											var childValue = astructureChild.getNodeValue();
											var attr = astructureChild.getFirstAttribute(); // Only intrested in the type attribute
											attrName  = attr.getNodeName();
											attrValue = attr.getNodeValue();
											while (childValue == "\n")  // Skip the carriage return linefeeds CR LF
								 				childValue = astructureChild.getNodeValue();
											 	if (attrName == "_type")
												{
													
													switch( attrValue )
													{
														case "Text":
															if(childValue.indexOf("&lt;") > -1)
																childValue=childValue.replace(/&lt;/g,"<");
															if(childValue.indexOf("&gt;") > -1)
																childValue=childValue.replace(/&gt;/g,">");
															if(childValue.indexOf("&quot;") > -1)
																childValue=childValue.replace(/&quot;/g,"'");
															if(childValue.indexOf("&amp;") > -1)
																childValue=childValue.replace(/&amp;/g,"&");
																
															if(childValue.indexOf("\n") > -1)
																childValue=childValue.replace(/\\n/g,"<br />");
														    
															strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = \"" + childValue + "\";";
															
															eval(strEval);				
															break;
															
														case "Decimal":
															if (!isNaN(childValue))
													    	{			
																strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = " + parseFloat(childValue) + ";";
																eval(strEval);
													 		}
													 		else
													 		{
													 			print("Error: Cannot assign invalid decimal value " + childValue + " for Node " + nodeName + ". This field was not saved.");  
															}
															break;
															
														case "Boolean":
															if (childValue == "true" || childValue == "false")
													    	{			
																strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = " + childValue + ";";
																eval(strEval);
													 		}
													 		else
													 		{
													 			print("Error: Cannot assign invalid boolean value " + childValue + " for Node " + nodeName + ". This field was not saved."); 
															}
															break;	
														
														case "Array":
															// Does this Array already have other 'rows'/structures in it?
															// If so, adjust the array index aIndex; the index starts at 0
															
													   			
															var arrayChild = astructureChild.getFirstChildElement();
															while( arrayChild != null )
															{   
																var subchildName  = arrayChild.getNodeName();
																subchildName = system.library.KMUtils.scToJSName(subchildName);
																var subchildValue = arrayChild.getNodeValue();
																var attr = arrayChild.getFirstAttribute(); // Only interested in the type attribute
																attrName  = attr.getNodeName();
																attrValue = attr.getNodeValue();
													   			while (subchildValue == "\n")  // Skip the carriage return linefeeds CR LF
													 				subchildValue = arrayChild.getNodeValue();
																if ( typeof subchildValue == "string" && subchildValue.length > 0 )
																{     
																 	if (attrName == "_type")
																	{
																		var valuePresent = 0;
																		switch( attrValue )
																		{
																			case "Text":
																				// Is this value already in the array? If so, do not add it
																				//strEval is kmFile.format_view[0].format_view.view_roles[0].view_roles
																				
																					var arrayItems;
																					strEval = "arrayItems = kmFile." + tmpFld + "[" + aIndex + "]."+ childName;
																					eval(strEval);	
																					if (system.functions.index(arrayItems,subchildValue)<=0)
																						arrayItems.push(subchildValue);
																					
																				
																				break;
																				
																			case "Decimal":
																				if (!isNaN(childValue))
																		    	{
																		    		// Is this value already in the array? If so, do not add it
																					strEval = "valuePresent = system.functions.index(childValue,kmFile." + tmpFld + ");";
																					eval(strEval);
																				
																					if (valuePresent == 0)
																					{											
																		    			strEval = "kmFile." + tmpFld + "= system.functions.insert(kmFile." + tmpFld + ", 0, 1, " + parseFloat(childValue) + ");";
																						eval(strEval);	
																						break;
																					}
																		 		}
																		 		else
																		 		{
																		 			print("Error: Cannot assign invalid decimal value " + childValue + " for Node " + nodeName + ". This field was not saved.");  
																				}
																				break;
																				
																			case "Boolean":
																				if (childValue == "true" || childValue == "false")
																		    	{	
																		    		// Is this value already in the array? If so, do not add it
																					strEval = "valuePresent = system.functions.index(childValue,kmFile." + tmpFld + ");";
																					eval(strEval);
																				
																					if (valuePresent == 0)
																					{											
																		    			strEval = "kmFile." + tmpFld + "= system.functions.insert(kmFile." + tmpFld + ", 0, 1, " + childValue + ");";
																						eval(strEval);	
																						break;
																					}
																		 		}
																		 		else
																		 		{
																		 			print("Error: Cannot assign invalid boolean value " + childValue + " for Node " + nodeName + ". This field was not saved."); 
																				}
																				break;	
																				
																									
																			default : print("1Error: Unexpected _type attribute of " + attrValue + " encountered for Node " + nodeName + ". This field was not saved."); // error message
																		} // end switch
																	}  // end if attrName is _type
																	else
																		print("Warning: Node with attribute name " + attrName + " and value " + attrValue + " was not processed. Only fields with an attribute named _type are processed.");    
													   			} 
													   			else
													   			{
													   				
													   				return;
													   			}
											 					
													   			arrayChild = arrayChild.getNextSiblingElement();
													 		}  
															break;	

														default : print("2Error: Unexpected _type attribute of " + attrValue + " encountered for Node " + nodeName + ". This field was not saved."); // error message
													}
													
								   			}
								   			astructureChild = astructureChild.getNextSiblingElement();
											
								 		}  				
										break;	
											
									default : print("3Error: Unexpected _type attribute of " + attrValue + " encountered for Node " + nodeName + ". This field was not saved."); // error message
								}
							}   
							else
								print("Warning: attribute value of " + attrValue + " was not processed.");    
			   			}
			   			asChild = asChild.getNextSiblingElement();
			   			
			 		}  				
					break;	
	
				case "ArrayStructure":
					// Get each of the children one by one, and add them to the structure at a particular number, based on the dbdict (export will be in this order)
					
					// If no array created yet, create one.
		
					strEval = "kmFile." + tmpFld + "= system.functions.denull(kmFile." + tmpFld + ");";
					eval(strEval);
		
					// Does this Array already have other 'rows'/structures in it?
					// If so, adjust the array index aIndex; the index starts at 0
					strEval = "aIndex = aIndex + kmFile." + tmpFld + ".length();";
					eval(strEval);

					var asChild = node.getFirstChildElement();
					while( asChild != null )
					{   
					    // Loop through the elements in this structure and add them to the array 
						var childName  = asChild.getNodeName();
						var childValue = asChild.getNodeValue();
						var attr = asChild.getFirstAttribute(); // Only intrested in the type attribute
						attrName  = attr.getNodeName();
						attrValue = attr.getNodeValue();
						
			   			while (childValue == "\n")  // Skip the carriage return linefeeds CR LF
			 				childValue = asChild.getNodeValue();
						if ( typeof childValue == "string"  ) // && nodeValue.length > 0
						{     
						 	if (attrName == "_type")
							{
								switch( attrValue )
								{
									case "Text":
										strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = \"" + childValue + "\";";
										eval(strEval);				
										break;
										
									case "Decimal":
										if (!isNaN(childValue))
								    	{			
											strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = " + parseFloat(childValue) + ";";
											eval(strEval);
								 		}
								 		else
								 		{
								 			print("Error: Cannot assign invalid decimal value " + childValue + " for Node " + nodeName + ". This field was not saved.");  
										}
										break;
										
									case "Boolean":
										if (childValue == "true" || childValue == "false")
								    	{			
											strEval = "kmFile." + tmpFld + "[" + aIndex + "]."+ childName + " = " + childValue + ";";
											eval(strEval);
								 		}
								 		else
								 		{
								 			print("Error: Cannot assign invalid boolean value " + childValue + " for Node " + nodeName + ". This field was not saved."); 
										}
										break;	
									
										
									default : print("4Error: Unexpected _type attribute of " + attrValue + " encountered for Node " + nodeName + ". This field was not saved."); // error message
								} // end switch
							}  // end if attrName is _type
							else
								print("Warning: Node with attribute name " + attrName + " and value " + attrValue + " was not processed. Only fields with an attribute named _type are processed.");    
			   			} 
			   			else
			   			{
			   				
			   				return;
			   			}
	 					
			   			asChild = asChild.getNextSiblingElement();
			 		}  
					break;	
					
				case "null":
	    			strEval = "kmFile." + tmpFld + " = null;"; // need for operator value where menu prompt is null
		 			eval(strEval);  
					break;	
					
				default : print("5Error: Unexpected _type attribute of " + attrValue + " encountered for node " + nodeName + ". This field was not saved."); // error message
			}
		}  
		else	// no attribute means get the first child -- no sibling;  attribute means a sibling
		{
			print("Error: No attribute found for node " + nodeName + " with value " + nodeValue + ". Node not processed.");
		} 
		
	 }  
}

function preprocessScript( node, kmFile )
{
	var recordExists = 0;   // assume it's a new record to be inserted
	var fileName = system.functions.filename( kmFile );
	var keyName = "";
	if ( fileName == "contacts" )
		keyName = "operator.id";
	else if ( fileName == "operator" )
		keyName = "name";
	else if ( fileName == "kmgroup" )
		keyName = "name";
	else if ( fileName == "kmcategory" )
		keyName = "name";
	else if ( fileName == "kmdoctype" )
		keyName = "name";
	else
	{
		print("Error: preprocessScript was called with an invalid filename of " + fileName);
		return kmFile;
	}
	// get the value for the key "operator.id" for contacts or "name" for operator
	var keyNode = system.library.KMMigrate.findTargetElement( node, keyName );
	if ( keyNode != null )
	{
		var nodeValue = keyNode.getNodeValue();
		if ( nodeValue != null )
		{
			
			var rc = kmFile.doSelect( keyName + " =  \"" + nodeValue + "\"" );
			if( rc != RC_SUCCESS )
				print("No record where " + keyName + " = \"" + nodeValue + "\" could be found in table " + fileName + ". A new record will be created.");
			else
				recordExists = 1;
		}
		else
			print("Error: preprocessScript could not find key " + keyName + " in filename " + fileName);
	
	}
	else
		print("Error: preprocessScript could not find a value for key " + keyName + " in filename " + fileName);
	
	
	// names and values 
	/*
	    <names _type="Array" xml:space="preserve">
            <names _type="Text"><![CDATA[name]]></names>
            <names _type="Text"><![CDATA[string1]]></names>
        </names>
        <values _type="Array" xml:space="preserve">
            <values _type="Text"><![CDATA[MAIN MENU]]></values>
            <values _type="Text"><![CDATA[HOME]]></values>
        </values>
	
	*/
	if ( fileName == "operator" )
	{
		var namesNode = system.library.KMMigrate.findTargetElement( node, "names" );
		var valuesNode = system.library.KMMigrate.findTargetElement( node, "values" );
		if ( namesNode != null && valuesNode != null)
		{
			var namesChild = namesNode.getFirstChildElement();
			var valuesChild = valuesNode.getFirstChildElement();
			while( namesChild != null && valuesChild != null )
			{   
				var namesChildNodeValue  = namesChild.getNodeValue();
				var valuesChildNodeValue = valuesChild.getNodeValue();
				
				// We need not check the attribute _type to ensure that it is a Text string
				
	   			while (namesChildNodeValue == "\n")  // Skip the carriage return linefeeds CR LF
	 				namesChildNodeValue = namesChild.getNodeValue();
	   			while (valuesChildNodeValue == "\n")  // Skip the carriage return linefeeds CR LF
	 				valuesChildNodeValue = valuesChild.getNodeValue();
	 				
	 			
	 				
				if ( typeof namesChildNodeValue == "string" && typeof valuesChildNodeValue == "string" ) // It better be
				{     
					// Is this value already in the array? If so, do not add it
					var valuePresent = system.functions.index(namesChildNodeValue,kmFile.names);
	 				
									
					if (valuePresent > 0)
					{											
						kmFile.values[valuePresent-1] = valuesChildNodeValue;
					}
				}
				
	   			namesChild = namesChild.getNextSiblingElement();			   			
	   			valuesChild = valuesChild.getNextSiblingElement();			   			
	 		}  				
		}
		// DE124 - do not modify the password of an existing SC user who had a Get-Answers account
		//  and set the expire.password flag to false if it exists
		if (recordExists == 0)
		{
			var nameNode = system.library.KMMigrate.findTargetElement( node, "name" );

			if ( nameNode != null )
			{
				kmFile.password = nameNode.getNodeValue();
				if (kmFile.password.length > vars.$L_maxpwdlen)
	    			kmFile.password = kmFile.password.substr(0,vars.$L_maxpwdlen-1);
				
				kmFile.expire_password = true;
			}
		}
	}	
	return kmFile;	
}

function postprocessScript( node, kmFile )
{
	var recordExists = 0;   // assume it's a new record to be inserted
	var fileName = system.functions.filename( kmFile );
	var queryCheck = "";
	if ( fileName == "contacts" )
	{
		// Do not update the contact record if the contact already exists		
		var compareFile = new SCFile("contacts");
	    if ( compareFile.doSelect( "operator.id =  \"" + kmFile.operator_id + "\"" ) == RC_SUCCESS)
	    {
	    	print("The contact with operator id " + kmFile.operator_id + " already exists, so no update occurred.");
	    	return false;
	    }
	}
	else if ( fileName == "operator" )
	{
		// Update only the exec.capabilities if the operator already exists
		// kmgroups are updated via the groups xml file		
		var compareFile = new SCFile("operator");
	    if ( compareFile.doSelect( "name =  \"" + kmFile.name + "\"" ) == RC_SUCCESS)
	    {
	    	// Update the existing file with the new exec capablities; kmgroups are updated in the groups xml file
			var execCap = "";
	    	for (var i=0; i<kmFile.cap_exec.length(); ++i)
	    	{
	    		execCap = kmFile.cap_exec.pop();
	    		if (system.functions.index(execCap,compareFile.cap_exec) == 0)
	    			compareFile.cap_exec.push(execCap);
	    	}
	    	// Save the updated existing file if a group or capability could have been added
	    	if ( execCap != "")
	    	{
	    		compareFile.doSave();
	    		print("The operator with login " + kmFile.name + " already exists. Only new capabilities were added. Any new knowledge groups will be added in the group import.");
	    	}
	    	else
	    		print("The operator with login " + kmFile.name + " already exists. No updates were made because no new capabilities were added. Any new knowledge groups will be added in the group import.");
	    			    	
	    	return false;
	    }
	    else
	    {
	    	// operator is not in the database
	    	// truncate the password if it exceeds the 
	    	//   max password length in the system information record
	    	if (kmFile.password.length > vars.$L_maxpwdlen)
	    		kmFile.password = kmFile.password.substr(0,vars.$L_maxpwdlen-1);
	    }
	}
	else
	{
		print("Error: postprocessScript was called with an invalid filename of " + fileName);
		return false;
	}
	
	return true;	
}


// Straight out of the help file on tailoring "JavaScript method: XML.getNodeValue()"
/* Create a function that searches an XML object (node) for a particular
*  element (targetElem) and returns an XML object containing the element.
*  This function assumes that there is only one instance of the target
*  element in the source data. If it finds more than one element in the
*  data it only returns the first instance of the element. */
function findTargetElement( node, targetElem )
{
	var topNodeName = node.getNodeName();
	while (node != null && node.getNodeName() != targetElem )
	{
		var childNode = node.getFirstChildElement();
		if (childNode == null)
		{
			childNode = node.getNextSiblingElement();
			while (childNode == null)
			{
				node = node.getParentNode();
				if ( node == null || topNodeName == node.getNodeName() )
				{
					return null;
				}
				childNode = node.getNextSiblingElement(); 
			}
			node = childNode;
  		}
  		else
  		{
   			node = childNode;  
		}
	}
	return node;
}