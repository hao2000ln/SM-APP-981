function convertOwnedAttachmentLinks(fDoc, strFieldValue, strFieldName)
{
	var linktag = "answers/attachments/";
	var iLocation =  strFieldValue.indexOf(linktag);
	var linkCount = 0;
	var iIdDelimiterIndex;	
	var strAttachmentId;
	var fTarget;
	var rc;
	var ret;
	var sysatt;
	var fUnresolvedLinks;
	var newLink;
	var tmpatt;
	var strId;
	
	strId = fDoc.id;
	while(iLocation >= 0)
	{
		print("Found owned attachment link at position " + iLocation );
		linkCount++;
		// PROCESS LINK HERE
		 iLocation += linktag.length;
		 	 
         iIdDelimiterIndex =
            strFieldValue.indexOf("\"", iLocation);
         if( iIdDelimiterIndex < 0 )
         {
         	print("ERROR: Unable to find terminating link delimiter.");
			print("Action Taken: Adding to kmunresolvedlinks.");
         	system.library.KMConvertLinks.addToUnresolvedLinks(strId);
         	iLocation = strFieldValue.indexOf(linktag, iLocation+1 );
         	continue;
         }
         strAttachmentId =
            strFieldValue.substring(
                    iLocation,
                iIdDelimiterIndex);
        
        print("Attachment Id (" +strAttachmentId + ") found at position " + iLocation);

		//lookup the target attachment by legacyid
		fTarget = new SCFile("kmattachments");
		rc = fTarget.doSelect("legacyid=\""+strAttachmentId+"\"");  //SCR 40354
		if(rc != RC_SUCCESS &&  strAttachmentId.indexOf("shared_")==0) //check for legacy Get-Answers shared content
		{
			var strTempId = strAttachmentId.substring(7);
			rc = fTarget.doSelect("legacyid=\""+strTempId+"\"");  //SCR 40354		
		}				
		if(rc != RC_SUCCESS)		
			rc = fTarget.doSelect("legacyid#\""+strAttachmentId+"_\"");  //SCR 40354
		if(rc != RC_SUCCESS)
			rc = fTarget.doSelect("legacyid#\""+strAttachmentId+".\""); //SCR 40354		
		if(rc != RC_SUCCESS)
			rc = fTarget.doSelect("legacyid#\"shared_"+strAttachmentId+"_\"");		
		if(rc != RC_SUCCESS)
			rc = fTarget.doSelect("legacyid#\"shared_"+strAttachmentId+".\""); // SCR 40354		
		if(rc != RC_SUCCESS)
		{
			print("ERROR: Unable to locate kmattachment link target by legacyid ", strAttachmentId);
			print("Action Taken: Adding to kmunresolvedlinks.");
         	system.library.KMConvertLinks.addToUnresolvedLinks(strId);  //SCR 40349
		}
		else
		{	
			//if not shared make it owned by this document
			if( fTarget.name.indexOf("shared_") != 0  )
			{
				sysatt = new SCFile("SYSATTACHMENTS"); 
				ret = sysatt.doSelect("application=\"kmattachments\" and topic=\""+fTarget.id+"\"");
				if( ret != RC_SUCCESS)
				{
					print("ERROR: unable to locate SYSATTACHMENT for kmattachment ", fTarget.id );
					print("Action Taken: Adding to kmunresolvedlinks.");
         			system.library.KMConvertLinks.addToUnresolvedLinks(strId);
				}
				else
				{
					fTarget.syslink = sysatt.uid + ":" + sysatt.filename +":kmdocument:" + strId;
					fTarget.owned = true;
					fTarget.doUpdate();
					
					while( ret == RC_SUCCESS)
					{
						tmpatt = new SCFile("SYSATTACHMENTS");
						system.functions.fduplicate(tmpatt, sysatt);
						sysatt.application="kmdocument";
						sysatt.topic= strId;
						sysatt.doSave();
						tmpatt.doRemove();
						ret = sysatt.getNext();
					}
				}
			}
			
			//convert the link syntax 
			newLink = "scattach://"+fTarget.syslink;
			var link = new SCDatum();
			link.setType(9);
			link.push(strFieldName);
			link.push(fTarget.syslink);
			link.push("SYSATTACHMENTS");
			fDoc.links.pop();
			fDoc.links.push(link);
			strFieldValue = strFieldValue.substring(0, iLocation-linktag.length) +newLink+ strFieldValue.substring(iIdDelimiterIndex);	
			
			fTarget.doDelete();// add for fixing QCCR1E102502	
		}

		//scattach://4575eb20003df35403030d88:0642_01_lg.jpg:kmdocument:KM0075
		
		//search for another attachment link
		iLocation = strFieldValue.indexOf(linktag, iLocation+1 );	
	}
	print("No more owned attachments found.", iLocation);
	if( linkCount > 0)
		strFieldValue = system.library.KMUtils.removetoken(strFieldValue, "target=\"_blank\"");
	
	return strFieldValue;
}

function convertLinksToOtherDocs(fDoc, strFieldValue, strFieldName)
{
	var linktag = "e_answers_kmSearchAlternate_viewDocTransition";
	var iLocation =  strFieldValue.indexOf(linktag);
	var linkCount = 0;	
	var iIdDelimiterIndex;
	var strIdField;
	var strLinkId;
	var fTarget;
	var rc;
	var fUnresolvedLinks;
	var newLink;
	var strId;
	
	strId = fDoc.id;
	while(iLocation >= 0)
	{
		print("Found owned document link at position " + iLocation );
		linkCount++;
		//PROCESS LINK HERE
		iIdDelimiterIndex =
			strFieldValue.indexOf("=", iLocation);
	 	if( iIdDelimiterIndex < 0 )
	 	{
			print("ERROR: Unable to find terminating link delimiter.");
			print("Action Taken: Adding to kmunresolvedlinks.");
			system.library.KMConvertLinks.addToUnresolvedLinks(strId);
			iLocation = strFieldValue.indexOf(linktag, iLocation+1 );
			continue;
	 	}			
		strIdField =
			strFieldValue.substring(
				strFieldValue.indexOf("?", iLocation + 1)+1,
				iIdDelimiterIndex);
        print("Id Field (" +strIdField + ") found at position " + iIdDelimiterIndex+1);
		strLinkId =
			strFieldValue.substring(
				iIdDelimiterIndex + 1,
				strFieldValue.indexOf(
					"&",
					iIdDelimiterIndex + 1));
		print("strLinkId = " + strLinkId);
		
		//lookup the target document by legacyid
		fTarget = new SCFile("kmdocument");
		rc = fTarget.doSelect("legacyid=\""+strLinkId+"\"");
		if(rc != RC_SUCCESS)
		{
			print("ERROR: Unable to locate kmdocument link target by legacyid ", strLinkId);
			print("Action Taken: Adding to kmunresolvedlinks.");
			system.library.KMConvertLinks.addToUnresolvedLinks(strId);
			//removed by Joe A. 5/29/2007. We will now let the document import but log the id in kmunresolvedlinks for
			//later processing
		}			
		else
		{
			//convert the link syntax 
			newLink = "scactivelink://kmdocument:id=&quot;"+fTarget.id+"&quot;";
			var link = new SCDatum();
			link.setType(9);
			link.push(strFieldName);
			link.push("kmdocument:id=&quot;"+fTarget.id+"&quot;");
			link.push("kmdocument");
			fDoc.links.pop();
			fDoc.links.push(link);
			strFieldValue = strFieldValue.substring(0, iLocation) +newLink+ strFieldValue.substring(strFieldValue.indexOf("\"", iIdDelimiterIndex + 1));		
		}
		
		//search for next link
		iLocation = strFieldValue.indexOf(linktag, iLocation + 1);	
	}
	print("No more document links found.", iLocation);
	if( linkCount > 0)
		strFieldValue = system.library.KMUtils.removetoken(strFieldValue, "target=\"_blank\"");
	return strFieldValue;
}

function convertDocumentLinks(fDoc)
{
		
	var xmlDocRecord = fDoc.getXML().instance;
	var node;
	var childNode;
	var nodeName;
	var nodeValue;
	var newValue;
	var childValue;	  
	var fldIndex;
	var isArray;
		  
	for ( fldIndex in xmlDocRecord )
	{
	    node = xmlDocRecord[fldIndex];
	    
	    if ( node.getFirstChildElement() != null ) // this node has child elements
	    {  
	      var i;
	      for ( i in node ) 
	      {
	        childNode = node[i];
	        nodeName = system.library.KMUtils.scToJSName(childNode.getName());
	        childValue =  childNode.getValue();     
	        	        
	        newValue = convertOwnedAttachmentLinks( fDoc, childValue, nodeName );
	        newValue = convertLinksToOtherDocs(fDoc, newValue, nodeName);
	        if(newValue != childValue)
	        {
	            isArray = system.library.KMUtils.isSCArray( eval("fDoc."+nodeName ) );
	              isArray ? eval("fDoc."+nodeName+".push(newValue)") 
	              		  : eval("fDoc."+nodeName+ "=newValue");
	        }
		  }
	    }
	    else
		{	   
			nodeName = system.library.KMUtils.scToJSName(node.getName());
			nodeValue = node.getValue();
	        newValue = convertOwnedAttachmentLinks( fDoc, nodeValue, nodeName );
	        newValue = convertLinksToOtherDocs(fDoc, newValue, nodeName);
	        if(newValue != nodeValue)
	        {
	            isArray = system.library.KMUtils.isSCArray( eval("fDoc."+nodeName ) );
	              isArray ? eval("fDoc."+nodeName+".push(newValue)") 
	              		  : eval("fDoc."+nodeName+ "=newValue");
	        }	        
		}
	}
}


function addToUnresolvedLinks(strId)
{
	fUnresolvedLinks = new SCFile("kmunresolvedlinks");
	fUnresolvedLinks.id = strId;
	var rc = fUnresolvedLinks.doSave();	
}

function reconcileUnresolvedLinks()
{
	var fUnresolvedLinks = new SCFile("kmunresolvedlinks");
	var fReconcileDoc;
	fUnresolvedLinks.doSelect(true);
	while( getLastRC() == RC_SUCCESS )
	{
		fReconcileDoc = new SCFile("kmdocument")
		fReconcileDoc.doSelect("id=\""+fUnresolvedLinks.id+"\"");
		if( getLastRC() == RC_SUCCESS )
		{
			//first remove the id from kmunresolvedlinks
			fUnresolvedLinks.doDelete();
			//attempt to reconcile the links again
			convertDocumentLinks(fReconcileDoc);
			fReconcileDoc.doSave();
		}
		else
		{
			print("ERROR: Unable to reconcile links for kmdocument ("+fUnresolvedLinks.id+"). The document was not found.");
		}
		fUnresolvedLinks.getNext();
	}
}



