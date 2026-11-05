var decoratorList = new Array();
var READERJSP = "viz/GraphWebClientReader.jsp";
var OPENVIZJSP = "viz/openVisualization.jsp";
var LINEBREAK = "<br>";
var rte = lib.rtecallUtil;

/** This function returns an XML representation of a graph for CI visualization.
*	
*	@param {string} strLogicalName - the logical name of the CI to be visualized
*	@param {integer} iGraphDepth  -	the depth to which the graph should be visualized
*	@param {boolean} returnUpstream	- returns the CIs that have an upstream relationship with the visualized CI
*	@param boolean} returnDownstream - returns the CIs that have an downstream relationship with the visualized CI
*	@returns an XML representation of the graph
*   @type String
*/
function getGraph( strLogicalName, iGraphDepth, returnUpstream, returnDownstream )
{
	if(!strLogicalName) strLogicalName="";
	return system.library.ciVisualizationGraph.getGraph(strLogicalName);
}

/** This function adds a collection of nodes to an xml graph to a specified depth.
*	
*	@param {SCFile} fRelatedDevices	- the collection of nodes to be added
*	@param {integer} iGraphDepth - the depth to which the nodes should be added
*	@param {XML} graphXML - the XML object containing the graph
*	@param {boolean} returnUpstream	- adds the nodes that have an upstream relationship with the visualized CI
*	@param [boolean} returnDownstream - adds the nodes that have a downstream relationship with the visualized CI
*/

function addNodesToDepth( fRelatedDevices, iGraphDepth, graphXML, returnUpstream, returnDownstream )
{
	var currentDepth = 1;
	var fTraverseDevices = fRelatedDevices;
	
	var displayThreshold = getDisplayThreshold();
	
	if (returnUpstream != false)
	{
		do
		{
			var objRelationships = new Object();
			var fRelatedChildDevices = getRelatedUpstreamDevices( fTraverseDevices, objRelationships );
				
			if (fRelatedChildDevices != null)
			{			
				if (objRelationships.objAccount > displayThreshold)
				{
					var aChildFileArray = makeGroupsBySubtype( fRelatedChildDevices, 
																  fTraverseDevices,
																  objRelationships.relationships,
																  graphXML,
																  false );		
					
					for (var i = 0; i < aChildFileArray.length; i++)
					{
						addNodesToGraph( fTraverseDevices,
										   aChildFileArray[i], 
								 		   graphXML, 
										   (currentDepth == iGraphDepth),
										   false );						
					}
				}
				
				else
				{	
					for (var j = 0; j<fRelatedChildDevices.length; j++) {			
						addNodesToGraph( fTraverseDevices, 
								 		   fRelatedChildDevices[j], 
										   graphXML, 
										   (currentDepth == iGraphDepth),
										   false );
					}
				}
			}
			
			rc = fTraverseDevices.getNext();
						
			if (rc != RC_SUCCESS && currentDepth < iGraphDepth && fRelatedChildDevices != null)
			{
				currentDepth++;
				fTraverseDevices = fRelatedChildDevices;

				rc = fTraverseDevices.getFirst();
			}
		}
		
		while (rc == RC_SUCCESS)
	}

	fTraverseDevices = fRelatedDevices;
	currentDepth = 1;

	if (returnDownstream != false)
	{
		do
		{
			var objRelationships = new Object();
			var fRelatedChildDevices = getRelatedDownstreamDevices( fTraverseDevices, objRelationships );
			
			if (fRelatedChildDevices != null)
			{
				if (countDevices(fRelatedChildDevices) > displayThreshold)
				{
					var aChildFileArray = makeGroupsBySubtype( fRelatedChildDevices,
																  fTraverseDevices,
																  objRelationships.relationships, 
																  graphXML,
																  true );		

					for (var i = 0; i < aChildFileArray.length; i++)
					{
						addNodesToGraph( fTraverseDevices,
										   aChildFileArray[i], 
								 		   graphXML, 
										   (currentDepth == iGraphDepth),
										   true );						
					}
				}
				
				else
				{
					for (var j = 0; j<fRelatedChildDevices.length; j++) {	
						addNodesToGraph( fTraverseDevices, 
						   	  	 		   fRelatedChildDevices[j], 
										   graphXML,
										   (currentDepth == iGraphDepth),
										   true );	
					}					
				}
			}
			
			rc = fTraverseDevices.getNext();

			if (rc != RC_SUCCESS && currentDepth < iGraphDepth && fRelatedChildDevices != null)
			{
				currentDepth++;		
				fTraverseDevices = fRelatedChildDevices;

				rc = fTraverseDevices.getFirst();
			}
		}
		
		while (rc == RC_SUCCESS)
	}
    // Add the selected Cis from the group to the single nodes
    fTraverseDevices.getFirst();
    var query = system.vars.$displayedFromGroupCis;
    if ( query != null ) {
        function _findRelationship(from, to) {
            var query = "logical.name=\"" + from.logical_name + "\" and related.cis=\"" + to.logical_name + "\"";
            var file = new lib.FileUtil._file("cirelationship");
            return file.select(query)
        }
        var expands = new lib.FileUtil._file("device");
        expands.select(query).iterate(function(record) {
            _findRelationship(fTraverseDevices, record).iterate(function(relationship) {
                addNodesToGraph(fTraverseDevices, record, graphXML, (currentDepth == iGraphDepth), true);
            });
            _findRelationship(record, fTraverseDevices).iterate(function(relationship) {
                addNodesToGraph(fTraverseDevices, record, graphXML, (currentDepth == iGraphDepth), false);
            });
        });
        system.vars.$displayedFromGroupCis = null;
    }
}


function countDevices(fDevices)
{
	var iCounter = 0; 
	var number=0
	  
	for (var j= 0; j<fDevices.length; j++){
	
	 	number= Number(lib.rtecallUtil.countFile(fDevices[j]));
	 	iCounter = iCounter + number;
	 	  
	}
	return iCounter;
}


function getDisplayThreshold()
{
	var fSettings = new SCFile("civisualizationadmin");
	var rc = fSettings.doSelect("id=0");
	
	if (rc == RC_SUCCESS)
	{
		return fSettings.default_display_threshold;	
	}
	
	return 50;
}


function makeGroupsBySubtype( fRelatedChildDevicesFiles, fParentDevice, fRelationships, graphXML, bParentIsUpstream )
{
	var retVal = new Array();
	var selectArray = new Array();
	var delim = "";
	var rc = null;
	
	
	for(var m=0 ; m<fRelatedChildDevicesFiles.length; m++ ){
	
	rc = RC_SUCCESS;
	fRelatedChildDevices = fRelatedChildDevicesFiles[m];
	
	
	while (rc == RC_SUCCESS)
	{
		var selectObject = null;
		var decoratorObject = null;
		var aDecoratorArray  = null; 				
		var relationshipType = null;
		var relationshipSubtype = null;
		var relationshipObj = new Object();
		
		relationshipObj = getRelationship(fParentDevice, fRelatedChildDevices, fRelationships, bParentIsUpstream);
		relationshipType = relationshipObj.type;
		relationshipSubtype = relationshipObj.subtype;
														
		for (var i = 0; i < selectArray.length; i++)
		{
			if (selectArray[i].type == fRelatedChildDevices.type &&
			    selectArray[i].subtype == fRelatedChildDevices.subtype &&
			    selectArray[i].relationship_type == relationshipType &&
			    selectArray[i].relationship_subtype == relationshipSubtype)
			{
				selectObject = selectArray[i];
				i = selectArray.length + 1;
			}
		}
		
		if (selectObject == null)
		{
			selectObject = new Object();
			
			selectObject.type = fRelatedChildDevices.type;
			selectObject.subtype = fRelatedChildDevices.subtype;
			selectObject.selectStatement = "logical.name=\"" + fRelatedChildDevices.logical_name + "\"";
			selectObject.count = 1;
			selectObject.relationship_type = relationshipType;
			selectObject.relationship_subtype = relationshipSubtype;


			aDecoratorArray = getDecoratorImageAttributes( fRelatedChildDevices, false );
			
			var decoratorArray = new Array();
	
			for (var i = 0; i < aDecoratorArray.length; i++)
			{
				decoratorObject = new Object();
				decoratorObject.strSysAttach = aDecoratorArray[i].strSysAttach;
			
				if (aDecoratorArray[i].position != null)
				{
					decoratorObject.position = aDecoratorArray[i].position;
				}
			
				if (aDecoratorArray[i].category != null)
				{
					decoratorObject.category = aDecoratorArray[i].category;
				}
					
				delim = LINEBREAK;
				
				
				
				if (aDecoratorArray[i].group_label != null)
				{
					if (aDecoratorArray[i].group_label.indexOf("scmsg") != -1 &&
		    			aDecoratorArray[i].group_label.indexOf("(") != -1 &&
		    			aDecoratorArray[i].group_label.indexOf(")") != -1 )
					{
						decoratorObject.balloonText = 
							eval("system.functions." + aDecoratorArray[i].group_label) + delim + fRelatedChildDevices.logical_name;
					}
					
					else
					{
						decoratorObject.balloonText = 
							aDecoratorArray[i].group_label + delim + fRelatedChildDevices.logical_name;
					}
				}
				
				else
				{
					decoratorObject.balloonText = fRelatedChildDevices.logical_name;				
				}
				
				decoratorObject.priority = aDecoratorArray[i].priority;

				decoratorArray.push(decoratorObject);
				
				decoratorObject = null;
			}
			
			selectObject.decoratorArray = decoratorArray;
				
			selectArray.push(selectObject);
		}
		
		else
		{
			selectObject.selectStatement += " OR logical.name=\"" + fRelatedChildDevices.logical_name + "\"";
			selectObject.count++;
	
			var decoratorArray = selectObject.decoratorArray;
	
			aDecoratorArray = getDecoratorImageAttributes( fRelatedChildDevices, false );
		
			for (var i = 0; i < aDecoratorArray.length; i++)
			{
				for (var j = 0; j < decoratorArray.length; j++)
				{
					if (decoratorArray[j].strSysAttach == aDecoratorArray[i].strSysAttach)
					{
						delim = LINEBREAK;
						decoratorArray[j].balloonText += delim + fRelatedChildDevices.logical_name;
						decoratorObject = decoratorArray[j];
					}
				}
							
				if (decoratorObject == null)
				{
				 	decoratorObject = new Object();
					decoratorObject.strSysAttach = aDecoratorArray[i].strSysAttach;
					
					if (aDecoratorArray[i].position != null)
					{
						decoratorObject.position = aDecoratorArray[i].position;
					}
				
					if (aDecoratorArray[i].category != null)
					{
						decoratorObject.category = aDecoratorArray[i].category;
					}
					
					delim = LINEBREAK;
				
					
				
					if (aDecoratorArray[i].group_label != null)
					{
						if (aDecoratorArray[i].group_label.indexOf("scmsg") != -1 &&
		    				aDecoratorArray[i].group_label.indexOf("(") != -1 &&
		    				aDecoratorArray[i].group_label.indexOf(")") != -1 )
						{
							decoratorObject.balloonText = 
								eval("system.functions." + aDecoratorArray[i].group_label) + delim + fRelatedChildDevices.logical_name;
						}
						
						else
						{
							decoratorObject.balloonText = 
								aDecoratorArray[i].group_label + delim + fRelatedChildDevices.logical_name;
						}
					}
					
					else
					{
						decoratorObject.balloonText = fRelatedChildDevices.logical_name;				
					}
					
					decoratorObject.priority = aDecoratorArray[i].priority;
							
					decoratorArray.push(decoratorObject);
					
					decoratorObject = null;
				}
			}
			
			selectObject.decoratorArray = decoratorArray;			
		}
		
		rc = fRelatedChildDevices.getNext();
	}
	}
	var displayThreshold = getDisplayThreshold();
	for (var i = 0; i < selectArray.length; i++)
	{
		var selectObject = selectArray[i];
		
		if (selectObject.count <= displayThreshold)
		{
			
			var fFile = new SCFile ("device");
		
			rc = fFile.doSelect( selectObject.selectStatement );
		
			if (rc == RC_SUCCESS)
			{
				retVal.push(fFile);
			}
		}
		
		else
		{
			var ciVizAttr = getCIVisualizationDevice( selectObject );
	
			if(ciVizAttr != null && ciVizAttr.default_url != null)
			{
				urlObj = new Object();
				urlObj.strSysAttach = ciVizAttr.default_url;				
				urlObj.priority = 0;
		
				selectObject.decoratorArray.push(urlObj);
			}
		
			selectObject.decoratorArray.sort(prioritySort);
		
			createGroupNode( selectObject.selectStatement,
							   selectObject.type,
							   selectObject.subtype,
							   selectObject.count,
							   selectObject.decoratorArray,
							   selectObject.relationship_subtype,
							   fParentDevice,
							   fRelationships,
							   bParentIsUpstream,
							   graphXML );		
		}

		
	}
	return retVal;	
}


function createGroupNode( strSelectStatement, strType, strSubtype, count, decoratorArray, relationshipSubtype, fParentDevice, fRelationships, bParentIsUpstream, graphXML )
{	
	var groupObject = new Object();
	
	if (strSubtype != null)
	{
		groupObject.logical_name = strSubtype + " (" + count + ")";
	}
	
	else
	{
		groupObject.logical_name = strType + " (" + count + ")";	
	}
	
	groupObject.label_name = "LABEL";
	groupObject.type = strType;
	groupObject.subtype = strSubtype;
	
	var nodeID = "group " + getGUID(); 
	var xmlNode = getNewDeviceNode( graphXML, nodeID );
	var attributeNode = xmlNode.addElement( "attr" );
	
	attributeNode.addAttribute("name", "Viz");
	setLabelAttribute( groupObject, attributeNode );
	attributeNode.addElement("balloon").setValue( groupObject.logical_name );


    // Add "Expand Group" menu action
	var  urlElement = attributeNode.addElement("action");
	urlElement.addAttribute("forcemenu", "true");
	
	urlElement.addElement("action").setValue("expand");
	urlElement.addAttribute("type", "expand");
	var tmplabel = rte.scmsg("25","civiz");
	urlElement.addAttribute("label", tmplabel);			

	
	setGroupIconAttribute( attributeNode );
	setIconAttribute( groupObject, attributeNode );
	
	lib.ciVizBalloonHelper.setFieldsForGroup(decoratorArray, attributeNode);
	
	
	var edgeNode = graphXML.addElement( "edge" );
	
	if (!bParentIsUpstream)
	{
		edgeNode.addAttribute("id", nodeID + "-" + fParentDevice.logical_name);
		edgeNode.addAttribute("from", nodeID); //strSelectStatement;
		edgeNode.addAttribute("to", fParentDevice.logical_name);
	}
	
	else
	{
		edgeNode.addAttribute("id", fParentDevice.logical_name + "-" + nodeID);
		edgeNode.addAttribute("from", fParentDevice.logical_name);
		edgeNode.addAttribute("to", nodeID) ; //strSelectStatement;	
	}
	
	var vizNode = edgeNode.addElement( "attr" );
	
	vizNode.addAttribute("name", "Viz");

	setLineAttribute( fParentDevice, groupObject, fRelationships, vizNode, relationshipSubtype, true );			

    //Set the thread variables for the grouped cis for future actions on the graph
    if(strSelectStatement != null)
    {
    	system.vars.$relatedCis = system.functions.insert( system.vars.$relatedCis, 0, 1, strSelectStatement );
    	system.vars.$relatedNodeIds = system.functions.insert( system.vars.$relatedNodeIds, 0, 1, nodeID );
    }	

}


/** This function adds the group icon.
*	
*	@param {XML} xmlNode - the XML object containing the node
*	@param {SCFile} fDevice	- the root device
*/

function setGroupIconAttribute( attributeNode  )
{	
	var fDecoratorFile = new SCFile ("civisualizationdecorator");
	var rc = fDecoratorFile.doSelect( "name=\"Group Icon\" and special.disabled=false");
	
	if (rc == RC_SUCCESS)
	{
		var fSysAtt = new SCFile("SYSATTACHMENTS");
		var rc1 = fSysAtt.doSelect("application=\"civisualizationdecorator\" and topic=\"Group Icon\"");

		if (rc1 == RC_SUCCESS)
		{
			var GROUPICON;
			
			GROUPICON = "scattach://img:" + fSysAtt.uid + ":" + fSysAtt.filename + ":" + fSysAtt.application + ":" + fSysAtt.topic;

			attributeNode.addElement("icon").setValue( GROUPICON );
		}
	}
}


/** This function initalizes an XML object as a graph.
*	
*	@param {string} strID -	the ID of the graph
*	@returns an initialized but otherwise empty graph
*   @type XML
*/

function initGraph( strID )
{
	var gxl=new XML("gxl");
	var graph = gxl.addElement("graph");
	
	graph.addAttribute("id", strID);
	
	return graph;
}


/** This function adds a collection of nodes to an xml object.
*	
*	@param {SCFile} fParentDevice -	the parent to the collection of nodes to be added
*	@param {SCFile} fRelatedDevices	- the collection of nodes to be added
*	@param {XML} graphXML -	the XML object containing the graph
*	@param {boolean} flagHasChildren - adds a flag to an added node if the node has children when true
*/

function addNodesToGraph( fParentDevice, fCIDevices, graphXML, flagHasChildren, parentIsUpstream )
{	
	var rc;
	
	do
	{		
		if (addNodeToGraph( fParentDevice, fCIDevices, graphXML, flagHasChildren ))
		{		
			if (parentIsUpstream)
			{
				addEdgeToGraph( fParentDevice, fCIDevices, graphXML,true );
			}
			
			else
			{
				addEdgeToGraph( fCIDevices, fParentDevice, graphXML,false );
			}
		}
		
		rc = fCIDevices.getNext();
	}
	
	while (rc == RC_SUCCESS)
}


/** This function adds a node to an XML graph and will flag it as having children when needed.
*	
*	@param {SCFile} fCIDevice -	the node to be added
*	@param {XML} graphXML -	the XML object containing the graph
*	@param {boolean} flagHasChildren - adds a flag to an added node if the node has children when true
*	@returns true if the node was added to the graph and false if it was not
*   @type Boolean
*/

function addNodeToGraph( fParentDevice, fCIDevice, graphXML, flagHasChildren, flagPointOfFocus ) 
{
	//We run into the parent CI in some cases and we do not want to add it again.
		
	var xmlNode = getNewDeviceNode( graphXML, fCIDevice.logical_name );
		
	addAttributesToNode( xmlNode, fParentDevice, fCIDevice, flagPointOfFocus, flagHasChildren);
		
	return true;
}


/** This function adds the point of focus to the first node in the tree.
*	
*	@param {XML} xmlNode - the XML object containing the node
*	@param {SCFile} fDevice	- the root device
*/

function setFocusPointAttribute( attributeNode )
{	
	var fDecoratorFile = new SCFile ("civisualizationdecorator");
	var rc = fDecoratorFile.doSelect( "name=\"Point of Focus\" and special.disabled=false");
	
	if (rc == RC_SUCCESS)
	{
		var fSysAtt = new SCFile("SYSATTACHMENTS");
		var rc1 = fSysAtt.doSelect("application=\"civisualizationdecorator\" and topic=\"Point of Focus\"");

		if (rc1 == RC_SUCCESS)
		{
			var FOCUSICON;
			
			FOCUSICON = "scattach://img:" + fSysAtt.uid + ":" + fSysAtt.filename + ":" + fSysAtt.application + ":" + fSysAtt.topic;

			attributeNode.addElement("icon").setValue( FOCUSICON );
		}
	}
}


/** This function adds an edge between two nodes.
*	
*	@param {SCFile} fFromDevice	- the upstream node
*	@param {SCFile} fToDevice -	the downstream node
*	@param {XML} graphXML -	the XML object containing the graph
*/

function addEdgeToGraph( fFromDevice, fToDevice, graphXML,isDownStream )
{
	
	var edgeNode = graphXML.addElement( "edge" );
	var id = fFromDevice.logical_name + "-" + fToDevice.logical_name;
	
	edgeNode.addAttribute("from", fFromDevice.logical_name);
	edgeNode.addAttribute("to", fToDevice.logical_name);
	
	var vizNode = edgeNode.addElement( "attr" );
	
	vizNode.addAttribute("name", "Viz");
	
	var rel = setLineAttribute ( fFromDevice, fToDevice, null, vizNode, null, isDownStream );
	
	if (rel!=null)
	{
	  id = rel.logical_name + rel.relationship_name;
	}
	
	edgeNode.addAttribute("id", id);
}


/** This function adds attributes such as icons and labels to an XML element based on the CI.
*	
*	@param {Element} xmlNode - the XML element 
*	@param {SCFile} fCIDevice -	the node that the element represents
*/

function addAttributesToNode( xmlNode, fParentDevice, fCIDevice, flagFocusPoint, flagHasChildren)
{		
	var attributeNode = xmlNode.addElement( "attr" );
	
	attributeNode.addAttribute("name", "Viz");
	
	setLabelAttribute( fCIDevice, attributeNode );

	
	if (flagFocusPoint == true)
	{
		setFocusPointAttribute( attributeNode );
	}
	
	var ciVizAttr = setIconAttribute( fCIDevice, attributeNode );
	
	setDecoratorAttribute( fCIDevice, attributeNode);
	
	
	
	if (flagHasChildren || fParentDevice != null)
	{
	        var urlElement = attributeNode.addElement("action");
			urlElement.setValue("XMLADD");	
			urlElement.addAttribute("type", "XMLADD");
	}

    // Add "View CI Details" menu action
	var  urlElement = attributeNode.addElement("action");
	urlElement.addAttribute("forcemenu", "true");
	
	urlElement.addElement("action").setValue("detail");
	urlElement.addAttribute("type", "detail");
	var tmplabel = rte.scmsg("26","civiz");
	urlElement.addAttribute("label",tmplabel);			
}


/** This function sets the label attribute on the XML element passed in.
*	
*	@param {SCFile} fCIDevice -	the node that the element represents
*	@param {Element} attributeNode - the XML element 
*/

function setLabelAttribute( fCIDevice, attributeNode )
{	
	var labelNode =	attributeNode.addElement("label");
	
	setLabelAttributes( fCIDevice, labelNode );
	labelNode.setValue( fCIDevice.logical_name );
}	


/** This function sets the attributes of a label itself.
*	
*	@param {SCFile} fCIDevice -	the device that the label represents
*	@param {Element} labelNode - the XML element 
*/

function setLabelAttributes( fCIDevice, labelNode )
{
	
	var labelName = "DEFAULT";
	var fLabel = lib.ciVizCacheManager.getLabel(labelName);
	
	if(fLabel==null)
		fLabel = lib.ciVizCacheManager.getLabel("DEFAULT");
	
	
	if ( fLabel.label_font != null || fLabel.label_font != "")
		labelNode.addAttribute("font", fLabel.label_font);
		
	if ( fLabel.label_style != null || fLabel.label_style != "")
		labelNode.addAttribute("style", fLabel.label_style);
		
	if ( fLabel.label_size != null || fLabel.label_size != "")
		labelNode.addAttribute("size", fLabel.label_size);
}


function setBoundsAttribute( fCIDevice, attributeNode )
{
	var fBounds = new SCFile("civisualizationbounds");
	var rc = fBounds.doSelect("bound.name=\"" + fCIDevice.bound_name + "\"");
	
	if (rc == RC_SUCCESS)
	{
		var boundsNode = attributeNode.addElement("bounds");

		if ( fBounds.x_bound != null || fBounds.x_bound != "")
			boundsNode.addAttribute("x", fBounds.x_bound );
			
		if ( fBounds.y_bound != null || fBounds.y_bound != "")
			boundsNode.addAttribute("y", fBounds.y_bound );
			
		if ( fBounds.width != null || fBounds.width != "")	
			boundsNode.addAttribute("width", fBounds.width );
			
		if ( fBounds.height != null || fBounds.height != "")
			boundsNode.addAttribute("height", fBounds.height );
	}
}	


/** This function sets the icon attribute on the xml element passed in.
*	
*	@param {SCFile} fCIDevice - the node that the element represents
*	@param {Element} labelNode - the XML element 
*/

function setIconAttribute(fCIDevice, attributeNode) {
    var strImageSysAttach = "";
    var ciVizAttr = getCIVisualAttr(fCIDevice);
    if (ciVizAttr != null) {

        strImageSysAttach = "scattach://img:" + ciVizAttr.uid + ":" + ciVizAttr.filename + ":" + ciVizAttr.application + ":" + ciVizAttr.topic;
        attributeNode.addElement("icon").setValue(strImageSysAttach);
        
    }
    
    return ciVizAttr;
}


/** This function decorates an xml element passed in based on the device.
*	
*	@param {SCFile} fCIDevice -	the node that the element represents
*	@param {Element} attributeNode - the XML element 
*/

function setDecoratorAttribute( fCIDevice, attributeNode )
{
	var aDecoratorArray = getDecoratorImageAttributes( fCIDevice, true );

		decoratorList.push(aDecoratorArray);

	lib.ciVizBalloonHelper.setFieldsForDecorator(fCIDevice,aDecoratorArray,attributeNode)

}





function getCIVisualizationDevice( fCIDevice )
{	       
	var fcivizdev = new SCFile("civisualizationdevice");
	var rc = fcivizdev.doSelect("device.type=\"" + fCIDevice.type + 
									 "\" and device.subtype=\"" + fCIDevice.subtype + "\"");
	if (rc != RC_SUCCESS)
	{
		rc = fcivizdev.doSelect("device.type=\"" + fCIDevice.type + "\"");
	}
	
	if (rc != RC_SUCCESS)
	{
		rc = fcivizdev.doSelect("device.type=\"DEFAULT\" and device.subtype=\"DEFAULT\"");
	}
	
	if (rc != RC_SUCCESS)
		return null;

	return fcivizdev;
}


/** This function gets the image attribute for an xml element passed in based on the device.
*	
*	@param {SCFile} fCIDevice - the node that the element represents
*	@return {String} image attribute
*/

function getCIVisualAttr( fCIDevice )
{
	var fSysAttachments = new SCFile("SYSATTACHMENTS");
	var SubType;
	var strUniqueID;
	
	if (fCIDevice.subtype == null)
	{
		SubType = "none";
	}
	
	else
	{
		SubType = fCIDevice.subtype;
	}
	
	strUniqueID = fCIDevice.type + SubType;
	
	var rc = fSysAttachments.doSelect("application=\"civisualizationdevice\" and topic=\"" + strUniqueID + "\"");

	if (rc != RC_SUCCESS)
	{
		strUniqueID = fCIDevice.type + "none";
		
		var rc = fSysAttachments.doSelect("application=\"civisualizationdevice\" and topic=\"" + strUniqueID + "\"");
	}

	if (rc != RC_SUCCESS)
	{
		var rc = fSysAttachments.doSelect("application=\"civisualizationdevice\" and topic=\"DEFAULTDEFAULT\"");
	}
	
	if (rc != RC_SUCCESS)
		return null;
	
	return fSysAttachments;
}


/** This function sets the line attribute for an xml element passed in based on the device.
*	
*	@param {SCFile} fCIDevice	-	the node that the element represents
*	@param {Element} attributeNode	-	the xml element 
*/

function setLineAttribute( fFromCIDevice, fToCIDevice, fRelationArray, attributeNode, relationshipSubtype, isDownStream )
{	
	var fCIDevice;
	var queryStr;	
	var rc;
	
	if (fRelationArray == null || fRelationArray.length == 0 )
	{
		queryStr = "logical.name=\"" + fFromCIDevice.logical_name + "\"";
		queryStr = queryStr + " and related.cis=\"" + fToCIDevice.logical_name + "\"";

		if(isDownStream) 
		{
			fCIDevice = fFromCIDevice;
		}
		
		else
		{ 	
			fCIDevice = fToCIDevice;	
		}
		
		fRelation = new SCFile ("cirelationship");	
		rc = fRelation.doSelect( queryStr);			
	}
	
	else 
	{
		if (isDownStream) 
		{
			fCIDevice = fFromCIDevice;
		}
		
		else
		{ 	
			fCIDevice = fToCIDevice;
		}
		
		fRelation = fRelationArray[0];
		rc = RC_SUCCESS;
	}
			
	var lineLabel;	
	
	if(relationshipSubtype == null){
		lineLabel = fRelation.relationship_subtype;
	}
	else{
		lineLabel = relationshipSubtype;
	}	
			
	var fRelationship = lib.ciVizCacheManager.getRelation(fRelation.relationship_type, fRelation.relationship_subtype);									 									 											 			
	
	var lineName = "Solid Line";
	
	if (fRelationship != null)	
		lineName = fRelationship.line_name;
	
	var fLine = lib.ciVizCacheManager.getLine(lineName);
	var direction;
			
	if(isDownStream)
		direction = "up";
		
	else direction = "down";
	
	var highlight = getHighlightColor(decoratorList,fFromCIDevice.logical_name,fToCIDevice.logical_name,direction);
	
			
	if (highlight != null && rc != RC_SUCCESS)
	{
		var lineAttribute = attributeNode.addElement("line");
		
		lineAttribute.setAttributeValue("highlightcolor", "#" + highlight);
		
	}	

	if 	(rc == RC_SUCCESS)
	{
	
	
		var lineAttribute = attributeNode.addElement("line");		

		if ( fLine.line_color != null || fLine.line_color != "")
		{
			lineAttribute.addAttribute("color", "#" + fLine.line_color);
			if(highlight != null)
			{
				lineAttribute.setAttributeValue("highlightcolor", "#" + highlight);					

			}	

		}		
		if ( fLine.line_style != null || fLine.line_style != "")
			lineAttribute.addAttribute("style", fLine.line_style);
			
		if ( fLine.line_weight != null || fLine.line_weight != "")	
			lineAttribute.addAttribute("weight", fLine.line_weight);
			
		if (lineLabel != null)
		{
			var labelNode = attributeNode.addElement("label");
			
			setLabelAttributes( fCIDevice, labelNode );
			labelNode.setValue( lineLabel );			
		}			
	}
	
  return fRelation;
}


/** This function sets the shape attribute for an xml element passed in based on the device.
*	
*	@param {SCFile} fCIDevice	-	the node that the element represents
*	@param {Element} attributeNode	-	the xml element 
*/

function setShapeAttribute( fCIDevice, attributeNode )
{
	if (fCIDevice.shape_name != null)
	{
		var fShape = new SCFile("civisualizationshape");
		
		fShape.doSelect("shape.name=\"" + fCIDevice.shape_name + "\"");
		
		var shapeAttribute = attributeNode.addElement("shapetype");

		if ( fShape.shape_color != null || fShape.shape_color != "")	
			shapeAttribute.addAttribute("color", fShape.shape_color);
			
		if ( fShape.shape_type != null || fShape.shape_type != "")	
			shapeAttribute.setValue( fShape.shape_type );
	}
}


/** This function initializes a CI xml element and gives it an ID.
*	
*	@param {SCFile} fCIDevice	-	the node that the element represents
*	@param {Element} attributeNode	-	the xml element 
*	@return An initalized but otherwise empty CI XML element
*   @type Element 
*/

function getNewDeviceNode( graphXML, strNodeID )
{
	var graphElement = graphXML.addElement( "node" );
	
	graphElement.addAttribute("id", strNodeID);
	
	return graphElement;
}


/** This function returns the balloon text associated with a given device
*	
*	@param {SCFile} fCIDevice	-	the device
*	@return The associated balloon text.
*   @type String 
*/

function getBalloonValue( fCIDevice )
{
	var fCIVisualizationMap = new SCFile("civisualizationdevice");
	
	var rc = fCIVisualizationMap.doSelect("device.type=\"" + fCIDevice.type + "\" AND device.subtype=\"" +
										   fCIDevice.subtype + "\"");
	
	if (rc != RC_SUCCESS)
	{
		fCIVisualizationMap.doSelect("device.type=\"DEFAULT\" AND device.subtype=\"DEFAULT\"");
	}
	
	var strBalloon = fCIVisualizationMap.ballon_field
	
	if (strBalloon == null)
	{
		strBalloon = "logical_name";
	}
	
	return fCIDevice[strBalloon];
}


function evaluateParseString(fCIDevice, parsestring) {
         
		
		if (parsestring == null || parsestring == "" || parsestring == "false" || parsestring == "FALSE") {
           return false;
        }
        
		if (parsestring == "true" || parsestring == "TRUE") {
           return true;
        }
        
		parsestring = parsestring.replace(/\$L.file/g, "$G.parsefile");	
		
		
		system.vars.$G_parsefile=fCIDevice;
		
		return system.functions.parse_evaluate(parsestring, 2);
		/*
		system.functions.rtecall("callrad", 
	 								new SCDatum(), 
									"civiz.parse.eval.helper", //RAD app name
									new SCDatum(), 
									new SCDatum(),
									false);
									
		var evaldata = system.vars.$retval;	
		return evaldata;
		*/
}


/** This function returns an array of image urls that are associated with a given device.
*	Each element of the array is an Object with a decorator_url and priority. The array is 
* 	already sorted by priority when returned.
*	
*	@param {SCFile} fCIDevice	-	the device
*	@return The array of image URLs
*   @type Array 
*/

function getDecoratorImageAttributes( fCIDevice, bGetCIIcon )
{	
	var urlObj;
	var strFilterString;
	var retVal=new Array();
	var decoratorArray = lib.ciVizCacheManager.getDecorators();
	
	for (var i=0; i < decoratorArray.length; i++)	
	{		
		/* do this again once the parse eval bug is fixed */		
		
		var parsestring = decoratorArray[i].filter_criteria;
						
		var evaldata = evaluateParseString(fCIDevice, parsestring);	
		var hasExtLink = true;
				
		if(decoratorArray[i].change_link_type == null || decoratorArray[i].change_link_type == "none")
			hasExtLink = false;					
		
		if(evaldata && hasExtLink)
		{
			
			var daysOut = "0";
			
			if(decoratorArray[i].change_link_type == "future" && decoratorArray[i].days_in_advance!=null )
				daysOut =  decoratorArray[i].days_in_advance;
				
			var tableName = "cm3r";
			
			if(decoratorArray[i].change_link_type == "incident")
				tableName = "probsummary";
				
			if(decoratorArray[i].change_link_type == "breached")
				tableName = "slamonthly";
				
			var result = lib.ciVizProcessExternal.hasDecoratorForExternal(fCIDevice,tableName,"",daysOut);
			
			evaldata = evaldata && result;
			
		}
		
		if (evaldata == true)		
		{				
			urlObj = new Object();
			
			urlObj.name = decoratorArray[i].name;
			urlObj.ciname = fCIDevice.logical_name;
			urlObj.priority = decoratorArray[i].priority;
			urlObj.highlight_upstream = decoratorArray[i].highlight_upstream;
			urlObj.highlight_downstream = decoratorArray[i].highlight_downstream;
			urlObj.position = decoratorArray[i].position;
			urlObj.external_table_name = decoratorArray[i].external_table_name;
			urlObj.change_link_type = decoratorArray[i].change_link_type;
			urlObj.days_in_advance = decoratorArray[i].days_in_advance;
			urlObj.balloon_display_field = copyArray(decoratorArray[i].balloon_display_field);
			urlObj.balloon_display_label = copyArray(decoratorArray[i].balloon_display_label);	
			urlObj.category = decoratorArray[i].category;	
			urlObj.group_label = decoratorArray[i].group_label;
			urlObj.strSysAttach = decoratorArray[i].strSysAttach;			
			
			retVal.push(urlObj);										
		}

		system.functions.cleanup(evaldata);						
	}
	
	if (bGetCIIcon)
	{		
		var ciVizDev = getCIVisualizationDevice( fCIDevice );
		var SysAttachment = getCIVisualAttr( fCIDevice );
		
		urlObj = new Object();
	
		if (ciVizDev != null)
		{
			urlObj.balloon_display_field = copyArray(ciVizDev.balloon_display_field);
			urlObj.balloon_display_label = copyArray(ciVizDev.balloon_display_label);	
			urlObj.priority = 0;
		}
		
		if (SysAttachment != null)
		{
			urlObj.strSysAttach = "scattach://img:" + SysAttachment.uid + ":" + SysAttachment.filename + ":" + SysAttachment.application + ":" + SysAttachment.topic;

			retVal.push(urlObj);
		}
	}
	
	retVal.sort(prioritySort);		
	
	return retVal;
}


function copyArray(arrayA)
{
	var arrayB = new Array();
	
	for ( i in arrayA ) {
		arrayB[i] = arrayA[i];		
	}
	return arrayB;
}


/** Javascript array sorting routine.
*	
*	@param {Object} elementOne
*	@param {Object} elementTwo
*	@return Number to indicate which element is greater
*   @type Number 
*/

function prioritySort(elementOne, elementTwo)
{
	if (elementOne.priority > elementTwo.priority)
		return 1;
		
	if (elementOne.priority < elementTwo.priority)
		return -1;
	
	return 0;
}	



function getRelatedDevices (fCIDevice, type, objRelationships)
{
 	var fFile = new SCFile("cirelationship");
	var rc = null;
	var sqlQuery = "";
	
	if(type=="up") {
		 sqlQuery="related.cis=\"" + fCIDevice.logical_name + "\"";
	}else {
	     sqlQuery ="logical.name=\"" + fCIDevice.logical_name + "\"";
	}	 
	
	var relationshipObjArray = new Array();
	var objAccount = 0;
	var rc = fFile.doSelect( sqlQuery);
	var logicalNames = new Array();  
	
	if (rc == RC_SUCCESS)
	{
		
		var strRelatedSQL = "";
		
		do
		{			
			var obj = new Object();
			obj.logical_name = fFile.logical_name;
			obj.relationship_type = fFile.relationship_type;
			obj.relationship_subtype = fFile.relationship_subtype;
			obj.related_cis = fFile.related_cis.toArray();
			relationshipObjArray.push(obj);
			
			if (type=="up"){				
				objAccount++;
				logicalNames.push(fFile.logical_name);	
						
			}else{			
				for (var i = 0; i < fFile.related_cis.length(); i++)
				{		
					if (fFile.related_cis[i] != null)
					{	
						logicalNames.push(fFile.related_cis[i]);				
						 
					}
				}			
			}		
			rc = fFile.getNext(); 
			 			
		}
		while (rc == RC_SUCCESS)		
		
		
		objRelationships.relationships = relationshipObjArray;
		if(type=="up")
		{
			objRelationships.objAccount = objAccount;
		}
		
			// split to multiple arrays
		var subLogicalNames = lib.ArrayUtil.split(logicalNames, 1000);
		
		var fRelatedDevicesFiles = new Array();
		
		var hasData = false;
		
		for (var i = 0; i < subLogicalNames.length; i++)
		{
		
			fRelatedDevicesFiles[i] = new SCFile("device");
			strRelatedSQL= "";
			for (var j=0 ; j <subLogicalNames[i].length ; j ++ )
			{
				strRelatedSQL += "logical.name=\"" + subLogicalNames[i][j] + "\"";
				if(j<subLogicalNames[i].length-1){
					strRelatedSQL += " OR ";
				}
				
			}
				
			rc = fRelatedDevicesFiles[i].doSelect( strRelatedSQL );
			if (rc == RC_SUCCESS) 
			    hasData = true;
		}		
		
		if (hasData == true)
		{
			return fRelatedDevicesFiles;
			
		}	
	 
	}
	
	return null;

}


/** This function returns all the imediate devices that are upstream from the device passed in.
*	Returns null if there are none.
*	
*	@param {SCFile} fCIDevice	-	the device
*	@return the related upstream devices
*   @type SCFile 
*/

function getRelatedUpstreamDevices( fCIDevice, objRelationships )
{
	return getRelatedDevices(fCIDevice, "up",objRelationships);
}	


function getRelationship( fParent, fChild, fRelationshipArray, bIsParentUpstream )
{
	var upstreamCI;
	var downstreamCI;
		
	for ( var ii=0; ii< fRelationshipArray.length; ii++) 
	{
	    var fRelationship = fRelationshipArray[ii];
		for (var i = 0; i < fRelationship.related_cis.length; i++)
		{	
			if (bIsParentUpstream)
			{
				upstreamCI = fParent.logical_name;
				downstreamCI = fChild.logical_name;
			}
			
			else
			{
				upstreamCI = fChild.logical_name;
				downstreamCI = fParent.logical_name;
			}
			
			if (upstreamCI == fRelationship.logical_name && fRelationship.related_cis[i] == downstreamCI)
			{
				var obj = new Object();
				
				obj.type = fRelationship.relationship_type;
				obj.subtype = fRelationship.relationship_subtype;
				
				return obj;
			}
		}
	}

	return null;
}


/** This function returns all the immediate devices that are downstream from the device passed in.
*	Returns null if there are none.
*	
*	@param {SCFile} fCIDevice	-	the device
*	@return the related downstream devices
*   @type SCFile 
*/

function getRelatedDownstreamDevices( fCIDevice, objRelationships ) 
{	
	 return getRelatedDevices(fCIDevice, "down",objRelationships);
}


/**
* This script returns the highlight color 
*/

function getHighlightColor(decoratorsAll, fromCi,toCi, direction)
{
	var ci = fromCi;
	
	direction = "down";
	
	//determine line direction up or down		
	for(var j=0;j<decoratorsAll.length;++j)
	{
		var decArray = decoratorsAll[j];
		
		for(var i=0;i<decArray.length;++i)
		{		
			if(decArray[i].ciname == toCi)
				direction="up";
		}
	}	

	if(direction == "up") 
	{
		for(var j=0;j<decoratorsAll.length;++j)
		{
			var decArray = decoratorsAll[j];
			
			for(var i=0;i<decArray.length;++i)
			{	

				if(decArray[i].highlight_upstream != null && decArray[i].ciname == toCi)
				{
					
					return decArray[i].highlight_upstream;
				}
			}
		}
	}
	
	else 
	{
		for(var j=0;j<decoratorsAll.length;++j)
		{
			var decArray = decoratorsAll[j];
			
			for(var i=0;i<decArray.length;++i)
			{		

				
				if(decArray[i].ciname == ci && decArray[i].highlight_downstream != null)
				{
					
					return decArray[i].highlight_downstream;
				}
			}
		}	
	}
	
	return null;		
}


/**
 * Builds a url for displaying the named CI as the point of focus for the visualization.
 */
 
function getGraphPath(ciName)
{
	
	var strUrl = READERJSP + "?name=" + encodeURIComponent(ciName);
	
	strUrl = OPENVIZJSP + "?layoutstyle=HIERARCHICAL&url="+encodeURIComponent(strUrl);
	
	return strUrl;
}


function getDecoratorCategories()
{
	var fCats = new SCFile("civisualizationcat");
	var rc = fCats.doSelect("category.name<>NULL");
	var catXML = new XML("decoratorcategories");
	
	while (rc == RC_SUCCESS)
	{
		var element = catXML.addElement("decoratorcategory");
		
		if (fCats.category_name.indexOf("scmsg") != -1 &&
	    	fCats.category_name.indexOf("(") != -1 &&
	    	fCats.category_name.indexOf(")") != -1 )
		{
			element.addElement("categoryname").setValue(eval("system.functions." + fCats.category_name));
		}
		
		else
		{
			element.addElement("categoryname").setValue( fCats.category_name );
		}
		
		element.addElement("categoryvalue").setValue( fCats.category_value );
		
		rc = fCats.getNext();
	}
	
	return catXML.toXMLString();
}		


function saveDisplayThreshold()
{
	var fAdmin = new SCFile("civisualizationadmin");
	var rc = fAdmin.doSelect("id=0");

 	fAdmin.default_display_threshold = system.vars.$L_file.default_display_threshold;
 	
	if (rc != RC_SUCCESS)
	{
		fAdmin.doInsert();
	}
	
	else
	{
		fAdmin.doUpdate();
	}
}


function getGUID()
{
    var guid = "{";
    
    for(var i = 0; i < 32; i++)
    guid += Math.floor(Math.random() * 0xF).toString(0xF) + 
         (i == 8 || i == 12 || i == 16 || i == 20 ? "-" : "")
    return guid + "}";
}

