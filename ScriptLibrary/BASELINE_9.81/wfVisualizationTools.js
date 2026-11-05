var history = new Datum();
var historyInfo = new Datum();
historyInfo.setType(8);
var phaseHistory;
var editMode = false;

var COLOR_DEFAULT = "#E9E9F0"; //"#7591AC"; //"#FCF5EB";
var COLOR_HISTORY = "#C9E2E9";  // "#3F658C"; //"#C9E2E9"
var COLOR_CURRENT = "#2F8CAB";  //"#1164BA"; ///"#2F8CAB"
var COLOR_HIGHLIGHT = "#FE4902";
var COLOR_INACTIVE = "#999999";
var COLOR_DONE = "#666666"; //"#0D6A89"

/** This function initializes an XML object as a graph.
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
	graph.addAttribute("edgemode", " defaultdirected");
	graph.addAttribute("edgeids" , " true");
	
	return graph;
}

function getGraph( strWorkflowName, tableName )
{
	return getCurrentGraph( strWorkflowName, tableName, null, null );
}

/** This function returns an XML representation of a graph for CI visualization.
*	
*	@param {string} strLogicalName - the logical name of the CI to be visualized
*	@param {integer} iGraphDepth  -	the depth to which the graph should be visualized
*	@param {boolean} returnUpstream	- returns the CIs that have an upstream relationship with the visualized CI
*	@param boolean} returnDownstream - returns the CIs that have an downstream relationship with the visualized CI
*	@returns an XML representation of the graph
*   @type String
*/
function getCurrentGraph( strWorkflowName, tableName, currentPhase, id )
{		
	var graphXML = initGraph("mygraph");

	if ( id == null )
	{
		editMode = true;
	}
	else
	{
		editMode = false;
	}
		
	graphXML = graphXML.getDocumentElement();
	
	var workflow = new SCFile("Workflow", SCFILE_READONLY);
	workflow.setFields(["name","defaultPhase"]);
	var sql = "name=\""+strWorkflowName+ "\" and tableName=\""+tableName+"\"";
	if ( strWorkflowName == null )
	{
		sql = "false";
	}

	if ( workflow.doSelect( sql ) == RC_SUCCESS )
	{
		var phaseName = workflow.defaultPhase;
		
		history = getHistory(id, tableName);

		var xmlNode = getNodes( graphXML, phaseName, tableName, workflow.name, currentPhase);
		
	}
	return graphXML.toXMLString();
}

function getHistory( recordId, tableName )
{	
	phaseHistory  = [];
	historyInfo = [];
	var id = new Datum();
	id.setType(8);
	if ( editMode == false )
	{
		var breadcrumb = new SCFile( "WorkflowHistory", SCFILE_READONLY );
		var sql = "linkedTableName = \"" + tableName + "\" and linkedId = \"" + recordId + "\"";
		
		if ( breadcrumb.doSelect( sql ) == RC_SUCCESS )
		{
			do
			{
				phaseHistory.push( breadcrumb.fromPhase );
				id.push(breadcrumb.linkName);
				var text = "<TR><TD>"+breadcrumb.dateTime + "</TD><TD>" + breadcrumb.user +"</TD></TR>";
				historyInfo.push(text);
			}
			while ( breadcrumb.getNext() == RC_SUCCESS );	
		}
	}
	
	return id;
}

function getNodes( graphXML, strNodeID, tableName, workflowName, currentPhase )
{
	var phase = new SCFile("WorkflowPhase");
	var sql = "workflowName=\""+workflowName+ "\" and tableName=\""+tableName+"\""; 
	
	var graphElement = null;
	
	if ( phase.doSelect(sql) == RC_SUCCESS) {
    	do
    	{
    		graphElement = graphXML.addElement( "node" );
    		graphElement.addAttribute("id", phase.phaseName);
    		addAttributesToNode(graphElement, phase.phaseName, currentPhase, strNodeID, phase);
    		
    		var i, length = phase.manualTransition.length();
    		for ( i = 0; i < length; i++ )
    		{
    			if ( phase.manualTransition[i].mtToPhase != null ) {
    				addEdgeToGraph( phase.phaseName, phase.manualTransition[i].mtToPhase, graphElement, false, i+1 );
    			}
    		}
    		
    		length = phase.autoTransition.length();
    		for ( i = 0; i < length; i++ )
    		{
    			if ( phase.autoTransition[i].atToPhase != null ) {
    				addEdgeToGraph( phase.phaseName, phase.autoTransition[i].atToPhase, graphElement, true, i+1 );
    			}
    		}
    		if ( phase.defaultTransition != null && phase.defaultTransition != "" )
    		{
    			addEdgeToGraph( phase.phaseName, phase.defaultTransition, graphElement, true, 0 );
    		}
    	}
    	while ( phase.getNext() == RC_SUCCESS );
    }
    	
	return graphElement;
}



/** This function sets the icon attribute on the xml element passed in.
*	
*	@param {SCFile} fCIDevice - the node that the element represents
*	@param {Element} labelNode - the XML element 
*/
function setIconAttribute(attributeNode) {
    var strImageSysAttach = "";
    var ciVizAttr = getCIVisualAttr();
    if (ciVizAttr != null) {

        strImageSysAttach = "scattach://img:" + ciVizAttr.uid + ":" + ciVizAttr.filename + ":" + ciVizAttr.application + ":" + ciVizAttr.topic;
        attributeNode.addElement("icon").setValue(strImageSysAttach);
    }

    return ciVizAttr;
}

/** This function gets the image attribute for an xml element passed in based on the device.
*	
*	@param {SCFile} fCIDevice - the node that the element represents
*	@return {String} image attribute
*/
function getCIVisualAttr()
{
	var fSysAttachments = new SCFile("SYSATTACHMENTS");
	
	var rc = fSysAttachments.doSelect("application=\"civisualizationdevice\" and topic=\"applicationBusiness\"");

	if (rc != RC_SUCCESS) {
		return null;
	}
	
	return fSysAttachments;
}


/** This function adds attributes such as icons and labels to an XML element based on the CI.
*	
*	@param {Element} xmlNode - the XML element 
*	@param {SCFile} fCIDevice -	the node that the element represents
*/
function addAttributesToNode( xmlNode, phaseName, currentPhase, defaultPhase, phase)
{		
	var attributeNode = xmlNode.addElement( "attr" );
	
	attributeNode.addAttribute("name", "Viz");
	setShapeAttributes( attributeNode, phaseName, currentPhase, phase ); 
	setLabelAttributes( attributeNode, phase.description, phase.detailedDescription ) ;
	if ( editMode == true )
	{
		setPhaseAttribute( attributeNode );
	}
}

function setPhaseAttribute( attrNode )
{
	var  editElement = attrNode.addElement("action");
	editElement.addAttribute("forcemenu", "true");
	
	editElement.addElement("action").setValue("editPhase");
	editElement.addAttribute("type", "editPhase");
	editElement.addAttribute("label", "Edit Phase");	
	
	var  delElement = attrNode.addElement("action");
	delElement.addAttribute("forcemenu", "true");
	
	delElement.addElement("action").setValue("deletePhase");
	delElement.addAttribute("type", "deletePhase");
	delElement.addAttribute("label", "Delete Phase");
	
	var  transElement = attrNode.addElement("action");
	transElement.addAttribute("forcemenu", "true");
	
	transElement.addElement("action").setValue("newTransition");
	transElement.addAttribute("type", "newTransition");
	transElement.addAttribute("label", "New Transition");	
}


/** This function sets the attributes of a label itself.
*	
*	@param {SCFile} fCIDevice -	the device that the label represents
*	@param {Element} labelNode - the XML element 
*/
function setShapeAttributes( attrNode, name, currentPhase, phase )
{
	var shapeNode = attrNode.addElement("shape");
	var shapeType = 3;
	var height = 30;
	var width = 120;
	
	if ( phase.defaultTransition != null && phase.defaultTransition != "" )
	{
		shapeType = 2;
	}
	
	var hIncrement = Math.max( name.length / 10, 1 );
	
	height = height * ( hIncrement + 1 );
	var words = name.split(" ");
	var i;
	for (i = 0; i<words.length; i++ )
	{
		width = Math.max(120, ( words[i].length + 1) * 10  );
	}
	
	shapeNode.addAttribute("type", shapeType );
	shapeNode.addAttribute("height", height);
	shapeNode.addAttribute("width", width);
	var color = COLOR_DEFAULT;
	for ( i = 0; i < phaseHistory.length; i++ )
	{
		if ( phaseHistory[i] == name )
		{
			color = COLOR_HISTORY;
		}
	}
	if ( name == currentPhase )
	{
		color = COLOR_CURRENT;
		if ( phase.active == false )
		{
			color = COLOR_DONE;
		}
	}
	if ( color == COLOR_DEFAULT &&  phase.active != true )
	{
		color = COLOR_INACTIVE;
	}
	
	shapeNode.addAttribute("color", color);
}

/** This function sets the attributes of a label itself.
*	
*	@param {SCFile} fCIDevice -	the device that the label represents
*	@param {Element} labelNode - the XML element 
*/
function setLabelAttributes( attrNode, name, detail )
{
	var labelNode = attrNode.addElement("label");
	var dispName = name;
	if(null!=dispName) {
		dispName = dispName.replace(/ /g, "<p>");
	}
	labelNode.setValue( dispName );
	labelNode.addAttribute("font", "Arial");
	labelNode.addAttribute("color", "#030303");
	labelNode.addAttribute("style", "0");
	labelNode.addAttribute("size", "12" );
	var balloon = attrNode.addElement("balloon");
	if ( detail != null )
	{
		balloon.setValue( detail );
	}
	
	return labelNode;
}

/** This function adds an edge between two nodes.
*	
*	@param {SCFile} fFromDevice	- the upstream node
*	@param {SCFile} fToDevice -	the downstream node
*	@param {XML} graphXML -	the XML object containing the graph
*/

function addEdgeToGraph( fromPhase, toPhase, graphXML, auto, position )
{
	var edgeNode = graphXML.addElement( "edge" );
	var id = auto.toString() + ":"+position +":"+ fromPhase + ":" + toPhase;
	var highlight = false;
	var index = 0;
	edgeNode.addAttribute("from", fromPhase);
	edgeNode.addAttribute("to", toPhase);
	
	var vizNode = edgeNode.addElement( "attr" );
	
	vizNode.addAttribute("name", "Viz");

	index = funcs.index( id, history );
	if ( editMode == false && index > 0 )
	{
		var historyNode = vizNode.addElement( "balloon" );
		var historyText = "";
		highlight = true;
		do
		{
			historyText = historyText + historyInfo[ index - 1] + "<p>";
			index = funcs.index( id, history, index + 1  );
		}
		while ( index > 0 );
		historyText = "<TABLE>" + historyText + "</TABLE>";
		historyNode.setValue( historyText);
	}
	var rel = setLineAttribute ( fromPhase, toPhase, auto, vizNode, highlight, position );
	
	edgeNode.addAttribute("id", id);
}

function setLineEditAttribute( attrNode )
{
	var  editElement = attrNode.addElement("action");
	editElement.addAttribute("forcemenu", "true");
	
	editElement.addElement("action").setValue("editTransition");
	editElement.addAttribute("type", "editTransition");
	editElement.addAttribute("label", "Edit Transition");	
	
	var  urlElement = attrNode.addElement("action");
	urlElement.addAttribute("forcemenu", "true");
	
	urlElement.addElement("action").setValue("deleteTransition");
	urlElement.addAttribute("type", "deleteTransition");
	urlElement.addAttribute("label", "Delete Transition");
}

function setLineAttribute( fromPhase, toPhase, auto, attributeNode, highlight, position )
{
	var lineAttribute = attributeNode.addElement("line");		
	var fLine = new SCFile("civisualizationline", SCFILE_READONLY);
	var lineType = "Solid Line";
	if ( auto == true )
	{
		if ( position == 0 )
		{
			lineType = "Dash Dot Line";
		}
		else
		{
			lineType = "Dashed Line";
		}
	}
	var sql = "line.name=\"" + lineType + "\"";
	lineAttribute.addAttribute("end", "2");
	lineAttribute.addAttribute("weight",1);
	if ( highlight )
	{
	  lineAttribute.addAttribute("highlightcolor", COLOR_HIGHLIGHT );
	}

	if ( fLine.doSelect( sql ) == RC_SUCCESS )
	{
		if ( fLine.line_color != null || fLine.line_color != "")
		{
			lineAttribute.addAttribute("color", "#" + fLine.line_color);

		}		
		if ( fLine.line_style != null || fLine.line_style != "") {
			lineAttribute.addAttribute("style", fLine.line_style);
		}
	}
	
	if ( editMode )
	{
		var rel= setLineEditAttribute( attributeNode );	
	}

}

function addStartDecorator( attributeNode )
{
	var ICONPATH ="scattach://img:4893a15a0010d2870363ccc0:Exit:civisualizationdecorator:Exit";
	var POSITION = "NW";
	var iconNode = attributeNode.addElement("icon");
		
	iconNode.addElement("path").setValue( ICONPATH );
	iconNode.addAttribute("position", POSITION );
}
