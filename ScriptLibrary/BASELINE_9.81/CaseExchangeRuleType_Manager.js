/*
Description:These APIS used to add/edit the instance of CaseExchange ruleset.
Auther: Zhichao Fei
Date:2013-12-11
*/
var CE_SM_REST_METHODS="restTargetMethods";
var CE_SM_SOAP_METHODS="wsdlTargetMethods";

var CE_IS_REST_CALL="isOutboundREST";
var CE_SM_OBJECT_NAME="object";

var select = lib.ScAPI_RAD._select;
var logger = getLog("CaseExchangeRuleType_Manager");

function getCESMISConfiguration()
{
	var connInfors = [];
	var connectors = [];//Contain Connector name
	var instances = [];//Contain SMIS instance id;
	var operations = [];
	
	var smFields = [];
	var smFieldsDis = [];
	var tablename = vars['$tablename'];
	
	var query = "template #\"CaseExchange\"";
	var fields = ['paramInfo','intId','SMFields','name','status'];
	
	var smisinfo = select("SMISConfiguration", query ,fields);
	if (smisinfo != null)
	{
		do
		{
			var operationName = "";
			//Append SMIS Instance ID
			var instanceid = smisinfo.intId;
			var instancename = smisinfo.name;
			
			var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceid);
			if (smisConfig == null)
			{
				continue;
			}
			var objectName = smisConfig.getConfigParameterValue(CE_SM_OBJECT_NAME);
			if (objectName != tablename)
			{
				continue;
			}
			instances.push(instanceid);
			connectors.push(instancename);
			//
			
			var isRest = smisConfig.getConfigParameterValue(CE_IS_REST_CALL);
			var methodParameterName = isRest?CE_SM_REST_METHODS:CE_SM_SOAP_METHODS;

			operationName = smisConfig.getConfigParameterValue(methodParameterName);
			var operationList=this.splitString(operationName,"~");
			operations[instanceid]=operationList;
			
			//Below code is parsing what fields are configured in SMIS?
			var smfieldsobj = getSMMappingFields(instanceid,tablename);
			if (logger.isDebugEnabled()) {
			    logger.debug("getCESMISConfiguration()-Fields configuration "+smfieldsobj.data+" for SMIS instanceid "+instanceid);
			    logger.debug("getCESMISConfiguration()-FInd fields "+smfieldsobj.data.length+" for SMIS instanceid "+instanceid);
			}
			smFields[instanceid]=smfieldsobj.data;
			smFieldsDis[instanceid]=smfieldsobj.dis;
			
		}while (smisinfo.getNext()==RC_SUCCESS);
	}
	
	//Return Connector Name
	if (logger.isDebugEnabled()) {
	    logger.debug("getCESMISConfiguration()-Find "+connectors.length+" SMIS instance.");
	}
	connInfors.push(connectors);
	
	//Return SMIS Instance ID
	connInfors.push(instances);
	connInfors.push(smFields);
	connInfors.push(operations);
	connInfors.push(smFieldsDis);
	return connInfors;
}

/*
Function: Construct the a SMIS instance sm fields as a array.
*/
function getSMMappingFields(instanceid,tablename)
{
	var smfields = [];
	var smfieldsDis = [];
	var smfieldobj = {};

	var query = "intId=\""+instanceid+"\"";
	var fields = ['intId','fieldMapping'];
	
	var smisMapping = select("SMISFieldMapping", query ,fields);
	
	if (tablename == null && tablename == "")
	{
		tablename = vars['$tablename'];
	}
	
	if (smisMapping != null)
	{
		do
		{
			var fieldsCount = smisMapping.fieldMapping.length();
			var i;
			for (i = 0; i < fieldsCount; i ++)
			{
				//Only sm-to-saw dreation and both drection fields mapping are used.
				if (smisMapping.fieldMapping[i].direction =="BOTH" || smisMapping.fieldMapping[i].direction=="LR")
				{
					var isDuplicated = false;
					var fieldname = smisMapping.fieldMapping[i].SMField;
					var j;
					for (j = 0; j < smfields.length;j++)
					{
						if (smfields[j] == fieldname)
						{
							isDuplicated = true;
							break;
						}
					}
					//If the field information has append to the Array, we will ignore it.
					if (isDuplicated)
					{
						continue;
					}
					smfields.push(fieldname);
					var fieldAttribute = getFieldAttribute(instanceid,fieldname);
					var fieldcaption = "";
					if (fieldAttribute != null)
					{
						if (fieldAttribute.type == "variable")
						{
							fieldcaption = fieldAttribute.caption;
						}
						else
						{
							fieldcaption =  funcs.get_field_caption(fieldname,tablename);
						}
						if (fieldcaption != null && fieldcaption !="" && fieldcaption !="null")
						{
							smfieldsDis.push(fieldcaption);
						}
						else
						{
							smfieldsDis.push(fieldname);
						}
					}
				}
			}
			
		}while (smisMapping.getNext()==RC_SUCCESS);
	}
	smfieldobj.data=smfields;
	smfieldobj.dis=smfieldsDis;
	
	return smfieldobj;
}


/**	
*   This function is to get sm field attribute(field type and field caption);
*	@param {instanceid} - SMIS Instance ID
*	@param {fieldName} - SM Field Name
*/
function getFieldAttribute(instanceid,fieldName)
{
	var fieldAttri = null;
	var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceid);
	if (smisConfig != null)
	{
		var smFields = smisConfig['SMFields'];
		if (smFields != null)
		{
		    var i;
		    var length = smFields.length();
			for(i = 0; i < length; i++)
			{
				if (smFields[i].SMFieldName == fieldName)
				{
					fieldAttri = {};
					fieldAttri.type = smFields[i].SMFieldType;
					fieldAttri.caption = smFields[i].SMAlias;
				}
			
			}
		}
	}
	
	return fieldAttri;
}


function arrayToString(array)
{
	var str = "";
	if (array != null && array.length() > 0)
	{
	    var i;
	    var length = array.length();
		for(i = 0; i < length;i++)
		{
			if (array[i] != null && 
			    array[i] != "" && 
			    array[i] !="null")
			    {
			
				str = str + array[i]+",";
			}
			
		}
	}	
	
	return str.substring(0,str.length - 1);
}

function splitString(str,spe)
{
	var splitArray = [];
	if (str != null && 
	    str != "" && 
	    str !="null")
	    {
	    	splitArray = str.split(spe);
	    }
	return splitArray;
}

/*
Function: Parse the xml data as a js object.
*/
function parseXMLAsObject(xml)
{
	var ruleInstance = {};
	//Parse connector
	var connctor = lib.xmlHelpers.getElement( xml, "connctor", null );

	if (connctor != null) 
	{
		ruleInstance.connctor = connctor.getValue();
	}
	//Parse event
	var event = lib.xmlHelpers.getElement( xml, "event", null );

	if (event != null) 
	{
		ruleInstance.event = event.getValue();
	}
	//Parse selected fields.
	var selectedField = lib.xmlHelpers.getElement( xml, "selectedfields", null );
	if (selectedField != null) 
	{
		ruleInstance.selected = selectedField.getValue();
	}
	
	var selector = lib.xmlHelpers.getElement( xml, "fieldselector", null );
	if (selector != null) 
	{
		ruleInstance.selector = selector.getValue();
	}
	
	return ruleInstance;
}


function parseRuleSetXMLAsObject(ruleConfig)
{
	var xml = lib.xmlHelpers.getElement( ruleConfig, "CaseExchange", null );
	var ruleInstance = {};
	//Parse connector
	var connctor = lib.xmlHelpers.getElement( xml, "connctor", null );

	if (connctor != null) 
	{
		ruleInstance.connctor = connctor.getValue();
	}
	//Parse event
	var event = lib.xmlHelpers.getElement( xml, "event", null );

	if (event != null) 
	{
		ruleInstance.event = event.getValue();
	}
	//Parse selected fields.
	var selectedField = lib.xmlHelpers.getElement( xml, "selectedfields", null );
	if (selectedField != null) 
	{
		ruleInstance.selected = selectedField.getValue();
	}
	return ruleInstance;
}


/*
Construct xml format data using connector, event type and selected fields.
*/
function constructXml(connectorid,eventtype,fields,selector)
{
	var xml = new XML();
	xml.setContent("<CaseExchange></CaseExchange>");
	//Fill out the connector data in xml tag
	var connctor = xml.addElement( "connctor");
	connctor.setValue( connectorid);

	//Fill out the event data in xml tag	
	var event = xml.addElement( "event");
	event.setValue( eventtype);
	//Fill out the selected fields data in xml tag
	var selectedfields = xml.addElement( "selectedfields");
	selectedfields.setValue( fields);
	
	var fieldselector = xml.addElement("fieldselector");
	fieldselector.setValue( selector);
	if (logger.isDebugEnabled()) {
	    logger.debug("constructXml()-XML data is "+xml.toXMLString());
	}
	return xml;
}


/*
Function: Check whether the SMIS instance id is valid or not.
          For example, an instance of SMIS was remove by another administrator when an administrator performing the RuleSet configuration.

*/
function checkSMISInstance(instanceid)
{
	var isPass = false;
	
	var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceid);
	if (smisConfig == null)
	{
		isPass = false;
	
		//If current SMIS instance id is invalid, then erase it and refresh the drop-down list.
		var smisConfigs = getCESMISConfiguration();
		pagedataInit(smisConfigs);
		var  instanceNames=smisConfigs[0];
		var  instanceArray= smisConfigs[1];
		
		vars['$event']="";
		vars['$connector']="";		
		vars['$connectorsValue'] =instanceArray;
		vars['$connectorsDisp']= instanceNames;
		
		vars['$selectedfields']= [];
		vars['$smfields']= [];
		vars['$smfieldsDis']= [];
	}
	else 
	{
		isPass = true;
	}
	return isPass;
}

/*
Function: Check whether the Event type is valid or not.
          For example, an event configuration was changed by another administrator when an administrator performing the RuleSet configuration. 

*/
function checkEventType(instanceid,eventtype)
{
	var isPass = false;
	
	var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceid);
	
	if (smisConfig != null)
	{
		//Parse the event type parameter
		
		var isRest = smisConfig.getConfigParameterValue(CE_IS_REST_CALL);
		var methodParameterName = isRest?CE_SM_REST_METHODS:CE_SM_SOAP_METHODS;
		
		var eventstring = smisConfig.getConfigParameterValue(methodParameterName);
		if (eventstring != null && eventstring != "")
		{
			var eventarray = splitString(eventstring,"~");
			if (eventarray != null && eventarray.length > 0)
			{
			    var i;
				for (i = 0; i < eventarray.length; i++)
				{
					if (eventtype != eventarray[i] && i == eventarray.length -1)
					{
						isPass = false;
					
					}
					else if (eventtype == eventarray[i])
					{
						isPass = true;
						break;
					}
				}
			}
			if (isPass == false)
			{
				pagedataInit(null);
				//Refresh event type drop-down list.
				vars['$event']="";
				vars['$operationList'] = eventarray;
			}
			
		}
	}
	
	return isPass;
}

/*
Function: Check whether the fields selected is valid or not.
          For example, and fields mapping was changed by another administrator when an administrator performing the RuleSet configuration. 

*/
function checkSelectedFields(instanceid,fields)
{
	var isPass = false;
	
	var smMappingObj = getSMMappingFields(instanceid,vars['$tablename']);
	var avaifields = funcs.denull(smMappingObj.data);
	var avaifieldsDis = funcs.denull(smMappingObj.dis);
	
	var selectedfields = funcs.denull(fields);
	
	if (avaifields != null && avaifields.length() > 0)
	{
	    var i;
	    var ilength = selectedfields.length();
		for (i=0;i<ilength;i++)
		{
			if (selectedfields[i] == null || 
			    selectedfields[i] == "" || 
			    selectedfields[i] == "null")
			{
				continue;
			}
			var isMatch=true;
			var j;
			var jlength = avaifields.length();
			for(j =0; j < jlength;j++)
			{
				if(selectedfields[i] == avaifields[j])
				{
					isMatch = true;
					break;
				}
				else if (selectedfields[i] != avaifields[j] && j == avaifields.length() - 1)
				{
					isMatch = false;
				}
			}
			if (!isMatch)
			{
				pagedataInit(null);
				isPass=false;
				vars['$selectedfields']=[];
				vars['$smfields']=avaifields;
				vars['$smfieldsDis']=avaifieldsDis;
				break;
			}
			else
			{
				isPass=true;
			}
		}
	}
	return isPass;
}

/*
Function:Verify if the related data is valid.
         It includes instance of SMIS, Event and selected fields.

*/
function initializationValidate(instanceid,event,fields)
{
	var ispass = true;
	var reslut = false;
	var selectedfields = funcs.denull(fields);
	
	//Verify if the instance is valid
	if (instanceid != null && instanceid !="")
	{
		reslut = checkSMISInstance(instanceid);
	}
	
	//Verify if the event is valid
	ispass = reslut;
	if (reslut && (instanceid !=null && instanceid !="") &&
	     (event !=null && event !=""))
	{
		ispass = checkEventType(instanceid,event);
	}
	
	//Verify if the selected fields are valid	
	if (reslut && (instanceid !=null && instanceid !="") &&
	     (selectedfields !=null && selectedfields.length() > 0))
	{
		ispass = checkSelectedFields(instanceid,selectedfields);
	}
}

function pagedataInit(smsiConf)
{
	if (smsiConf == null)
	{
	 	smsiConf = lib.CaseExchangeRuleType_Manager.getCESMISConfiguration();
	}
	vars.$connectorsDisp=smsiConf[0];
	vars.$connectorsValue=smsiConf[1];
	vars.$fieldsList=smsiConf[2];
	vars.$operations=smsiConf[3];
	vars.$fieldsDisList=smsiConf[4];	
}