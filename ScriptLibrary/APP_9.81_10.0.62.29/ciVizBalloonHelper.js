//script to setup balloon text for CI and decorator

var LINEBREAK = "<br>";


/**
* Set balloon help fields for CI.
*/

function setFieldsForCI(fCIDevice,ciVizAttr,attributeNode)
{
	var balloonText;
	
	if (ciVizAttr != null)
	{
		if (ciVizAttr.balloon_display_field != null)
		{
			var fields = ciVizAttr.balloon_display_field;
			var labels = ciVizAttr.balloon_display_label;
			var delim = "";
			
			var i=0;
			
			for ( i in fields ) 
			{
				if (fields[i] != null)
				{
					if (balloonText == null)
						balloonText = system.functions.scmsg("16", "civiz");
						
					
					var value = fCIDevice[fields[i]];
					
					if (value != null && value != "")
					{
						balloonText = balloonText + delim + labels[i] + " "+value;
					}
					
					delim = LINEBREAK;
				}	
			}	
		}
	}
	
	//default balloon help to CI logical name, if nothing is defined
	if (balloonText == null || balloonText == "")
		balloonText = fCIDevice.display_name;
		
	balloonText = "<html>" + balloonText + "</html>";

	attributeNode.addElement("balloon").setValue( balloonText );
}


/**
* Set balloon help fields for decorator.
*/

function setFieldsForDecorator(fCIDevice,aDecoratorArray,attributeNode)
{
	for (var i = 0; i < aDecoratorArray.length; i++)
	{
		var iconNode = attributeNode.addElement("icon");
		
		iconNode.addElement("path").setValue( aDecoratorArray[i].strSysAttach );
		
		if (aDecoratorArray[i].position != null)
		{
			iconNode.addAttribute("position", aDecoratorArray[i].position );
		}
		
		var balloonText = getBalloonText(fCIDevice,aDecoratorArray[i],true);
		
		if (balloonText != null && balloonText != "")
		{
			iconNode.addElement("balloon").setValue( balloonText );
		}
		
		if (aDecoratorArray[i].category != null)
		{
			iconNode.addAttribute("group", aDecoratorArray[i].category);
		}
	}
}


function setFieldsForGroup( aDecoratorArray, attributeNode )
{
	for (var i = 0; i < aDecoratorArray.length; i++)
	{
		var decorator = aDecoratorArray[i];
		var iconNode = attributeNode.addElement("icon");
		
		iconNode.addElement("path").setValue( decorator.strSysAttach );
		
		if (decorator.position != null)
		{
			iconNode.addAttribute("position", decorator.position );
		}

		if (decorator.balloonText != null && decorator.balloonText != "")
		{
			var balloon = decorator.balloonText;
			
			iconNode.addElement("balloon").setValue( balloon);
		}
		
		if (decorator.category != null)
		{
			iconNode.addAttribute("group", decorator.category);
		}
	}
}


/**
* Get balloon text value.
*/

function getBalloonText(fCIDevice,obj,isDecorator)
{		
	
	var balloonText = "";
	var fields = obj.balloon_display_field;
	var labels = obj.balloon_display_label;
	
	if (fields == null)
		return null;	
	
	var isDeviceTable =true;
	
	if (isDecorator)
	{
		if (obj.external_table_name!=null && obj.external_table_name != "device")					
			isDeviceTable =false;
	}	
	
	if (isDeviceTable)
	{
		var delim="";
		var i=0;
		
		for ( i in fields ) 
		{
			if (fields[i] != null)
			{
				
				var value = fCIDevice[fields[i]];
				
				if (value != null && value != "")
				{		
					/**
					 *	QCCR1E96161 CI Visualization - Tooltip does not show normally for Text type data
					 *	if field is array type, break line for elements inside
					 *  if length is greater than 55, traucate the line with first 55 left,
					 *	others will be replaced be '...' for short.
					**/
					if(system.functions.type(value)== 8) {
						value = value.toArray().join("");
					}	
					if(value.length>55) value = value.substr(0,55) + '...';
					balloonText = balloonText + delim + labels[i] + " "+value;
				}
				
				delim = LINEBREAK;
			}	
		}	
	}
	
	else balloonText = getBalloonForExternal(fCIDevice,obj);	
	
	//default balloon help to ci logical name, if nothing is defined
	if(balloonText == null || balloonText == "")
		balloonText = getDefaultBalloonText(fCIDevice);
		
	balloonText = "<html>" + balloonText + "</html>";
	
	return balloonText;
}


/**
* Get balloon text for fields from external table, such as cm3r.
*/

function getBalloonForExternal(fCIDevice,obj)
{		
	var hasChangeLink = true;
				
	if (obj.change_link_type == null || obj.change_link_type == "none")
		hasChangeLink = false;	
			
	if (hasChangeLink)
	{
		var daysOut = "0";
		
		if (obj.change_link_type == "future" && obj.days_in_advance!=null )
			daysOut =  obj.days_in_advance;
			
		var result = getDecoratorBalloonForExternal(fCIDevice,obj.external_table_name,"",daysOut,obj);
			
		return result		
	}
	
	else return system.functions.scmsg("16", "civiz");
}


function getDecoratorBalloonForExternal(fCIDevice, externalTableName,externalQuery, daysOut,obj)
{
	//see which table it is, then route to that function
	if (externalTableName == "cm3r" && daysOut !="0")
		return processChangeFuture(fCIDevice, externalTableName,externalQuery,daysOut,obj);
	else if (externalTableName == "cm3r" && daysOut =="0")
		return processChangeCurrent(fCIDevice, externalTableName,externalQuery,obj);	
	else if (externalTableName == "probsummary")
		return processIncident(fCIDevice,obj);
	else if (externalTableName == "slamonthly")
		return processBreached(fCIDevice,obj);
}


function processChangeCurrent(fCIDevice, externalTableName,externalQuery,obj)
{	
	var change = new SCFile("cm3r");
	var queryStr = lib.ciVizProcessExternal.getQueryString("currentChange",fCIDevice);
	var rc = change.doSelect(queryStr);
	var balloonText = "";
	
	do
	{		
		balloonText = balloonText + getBalloonForRecord(change,obj);
		rc = change.getNext();
				
		if (rc == RC_SUCCESS)
		{
			balloonText = balloonText + LINEBREAK + LINEBREAK;
		}
		
	} while (rc == RC_SUCCESS)	
	
	if (balloonText == null)
		balloonText = system.functions.scmsg("16", "civiz");
		
	return balloonText;	
}


function processChangeFuture(fCIDevice, externalTableName,externalQuery,daysOut,obj)
{		
	var change = new SCFile("cm3r");
	var queryStr = lib.ciVizProcessExternal.getQueryString("futureChange",fCIDevice,daysOut);
	var rc = change.doSelect(queryStr);
	var balloonText = "";
	
	do
	{		
		balloonText = balloonText + getBalloonForRecord(change,obj);		
		rc = change.getNext();
		
		if (rc == RC_SUCCESS)
		{
			balloonText = balloonText + LINEBREAK + LINEBREAK;
		}

	} while (rc == RC_SUCCESS)	

	if (balloonText == null)
		balloonText = system.functions.scmsg("16", "civiz");

	return balloonText;	
}


function processIncident(fCIDevice,obj)
{
	var incident = new SCFile("probsummary");
	var queryStr = lib.ciVizProcessExternal.getQueryString("incident",fCIDevice);
	var rc = incident.doSelect(queryStr);
	var balloonText = "";
	
	do
	{		
	    balloonText = balloonText + getBalloonForRecord(incident,obj);	
		rc = incident.getNext();

		if (rc == RC_SUCCESS)
		{
			balloonText = balloonText + LINEBREAK + LINEBREAK;
		}

	} while (rc == RC_SUCCESS)

	if (balloonText == null)
		balloonText = system.functions.scmsg("16", "civiz");

	return balloonText;	
}


function processBreached(fCIDevice,obj)
{
	var slamonthly = new SCFile("slamonthly");
	var queryStr = lib.ciVizProcessExternal.getQueryString("breached",fCIDevice);
	var rc = slamonthly.doSelect(queryStr);
	var balloonText = "";
	
	do
	{		
	    balloonText = balloonText + getBalloonForRecord(slamonthly,obj);	
		rc = slamonthly.getNext();

		if (rc == RC_SUCCESS)
		{
			balloonText = balloonText + LINEBREAK + LINEBREAK;
		}

	} while (rc == RC_SUCCESS)

	if (balloonText == null)
		balloonText = system.functions.scmsg("16", "civiz");

	return balloonText;	
}


function getBalloonForRecord(aRecord, obj)
{	
	
	var balloonText;
	var fields = obj.balloon_display_field;
	var labels = obj.balloon_display_label;
	var delim = "";
	var i=0;
	
	for ( i in fields ) 
	{
		if (fields[i] != null)
		{
			if (balloonText == null)
				balloonText= "";
				
			
			var value = aRecord[fields[i]];
			
			if (value != null && value != "")
			{
				balloonText = balloonText + delim +  labels[i] + " "+value;
			}
			
			delim = LINEBREAK;
		}	
	}
	
	if (balloonText == null || balloonText == "")
		balloonText = system.functions.scmsg("16", "civiz");

	//balloonText = "<html>" + balloonText + "</html>";	
	return 	balloonText;
}


function getDefaultBalloonText(fCIDevice)
{
	//retrieve balloon help from DEFAULT 
	var fCIVisualizationMap = new SCFile("civisualizationdevice");
	
	fCIVisualizationMap.doSelect("device.type=\"DEFAULT\" AND device.subtype=\"DEFAULT\"");
	
	var balloonText = getBalloonForRecord(fCIDevice,fCIVisualizationMap);
	
	if (balloonText == null || balloonText == "")
		balloonText = fCIDevice.display_name;
	
	return balloonText;
}