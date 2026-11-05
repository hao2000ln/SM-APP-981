function createXML(record)
{
	var xml = record.getXML();
	
	var instance = lib.xmlHelpers.getElement(xml, "instance",null);
	var tasks = lib.xmlHelpers.getElement(instance, "tasks",null);
	if ( tasks != null )
	{
		vars.$taskXml = tasks.toXMLString();
	}
}

function saveFromXML( fromClient )
{
	if ( vars.$taskXml != null && vars.$taskXml!= "" )
	{
		var taskxml = new XML();
		var i = 0;
		for ( var n=0, lng = vars.$L_file.tasks.length(); n < lng; n++ )
		{
			vars.$L_file.tasks = system.functions._delete( vars.$L_file.tasks, 1, 1);
		}
		if ( fromClient )
		{
			vars.$taskXml=vars.$taskXml.replace(/\&/g, "&amp;")
		}
		taskxml.setContent( vars.$taskXml  );
		
		var xml = taskxml.getDocumentElement();
		if ( xml != null )
		{
			element = xml.getFirstChildElement();
			if ( element != null )
			{
				do
				{
										vars.$L_file.tasks = system.functions.insert( vars.$L_file.tasks, 1, 0 );
					var tempElement = lib.xmlHelpers.getElement( element, "taskId", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].taskId = system.functions.val( tempElement.getValue() );
					}
					tempElement = lib.xmlHelpers.getElement( element, "taskCategory", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].taskCategory = tempElement.getValue();
					}
					tempElement = lib.xmlHelpers.getElement( element, "taskCoords", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].taskCoords = tempElement.getValue();
					}
					tempElement = lib.xmlHelpers.getElement( element, "taskTemplate", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].taskTemplate = tempElement.getValue();
					}
					tempElement = lib.xmlHelpers.getElement( element, "taskDescription", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].taskDescription = tempElement.getValue();
					}			
					tempElement = lib.xmlHelpers.getElement( element, "openInPhase", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].openInPhase = tempElement.getValue();
					}	
					tempElement = lib.xmlHelpers.getElement( element, "closeByPhase", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].closeByPhase = tempElement.getValue();
					}
					/*Active Condition*/
					tempElement = lib.xmlHelpers.getElement( element, "activeCondDesc", null );
					if ( tempElement != null )
					{
						vars.$L_file.tasks[i].activeCondDesc = tempElement.getValue();
					}
					tempElement = lib.xmlHelpers.getElement( element, "activeCondXML", null );					
					if ( tempElement != null )
					{					
						tempElement =  tempElement.getFirstChildElement();						
						if ( tempElement != null )
						{						
							vars.$L_file.tasks[i].activeCondXML = tempElement.toXMLString();
							var result = lib.conditionXmlParser.getRadQueryFromCondtionXml(vars.$L_file.tasks[i].activeCondXML );								
							vars.$L_file.tasks[i].activeCond = lib.WorkflowTriggers.convertResult(result[0]);	
						}
					}
					tempElement = lib.xmlHelpers.getElement( element, "mandatory", null );					
					if ( tempElement != null )
					{	
						tempElement =  tempElement.getValue();
						vars.$L_file.tasks[i]["mandatory"]=tempElement;
						//print(vars.$L_file.tasks[i]["mandatory"]);
					}
					tempElement = lib.xmlHelpers.getElement( element, "dependentIds", null );
					if ( tempElement != null )
					{
						var dI = 0;
						var dIdElement = tempElement.getFirstChildElement();
						
						if ( dIdElement != null )
						{
							do 
							{
								vars.$L_file.tasks[i].dependentIds = system.functions.insert( vars.$L_file.tasks[i].dependentIds,0,1, 
											system.functions.val( dIdElement.getValue() ) );
											
								dIdElement = dIdElement.getNextSiblingElement();
								dI++;
							}
							while ( dIdElement != null );
						}
					}
					tempElement = lib.xmlHelpers.getElement( element, "dependentCoords", null );
					if ( tempElement != null )
					{
						var dI = 0;
						var dCoordElement = tempElement.getFirstChildElement();
						if ( dCoordElement != null )
						{	
							do 
							{
								vars.$L_file.tasks[i].dependentCoords = system.functions.insert( vars.$L_file.tasks[i].dependentCoords,0,1, 
											system.functions.str( dCoordElement.getValue() ) );
								dCoordElement = dCoordElement.getNextSiblingElement();
								dI++
							}
							while ( dCoordElement != null );
						}			
					}
					i++;
					element = element.getNextSiblingElement();
				}
				while ( element != null );
			}
		}
	}
}