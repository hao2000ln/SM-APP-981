/** @fileoverview sloDisplay - This script contains functions that are used
*   to set the display information for SLOs on ticket screens.
*	@author	Pete Rietkerk
*/

/** This function is used to return the record ID field name specified in
*   the slamodulecontrol record for the associated filename.
*
*	@param {Record}	filename - file name of the current record
*	@return {String} - field name for the record ID
*/
function getRecordIdField( filename )
{
	var control = new SCFile( "slamodulecontrol", SCFILE_READONLY);
	control.setFields(["record.id.field"]);
	var rcControl = control.doSelect( "table.name = \"" + filename + "\"" );
	
	if ( rcControl == RC_SUCCESS )
	{
		var recordIdField = control.record_id_field;
		return recordIdField;
	}
}

/** This function is used to create a list of SLO data pieces for display on the record.
*
*	@param {Record}	filename - file name of the current record
*   @param {String} RecordId - unique id of the current record
*   @param {Array} slas - SLAs associated to the current record
*   @param {String} fields - SLO fields array used for populating the list of SLO info
*	@return {2-dimensional Array} - list of SLO data pieces with each row for each element in fields array
*                                   each row in this 2-dim array is an array of each field
*/

function getListSLOs( filename, recordId, slas, fields )
{
	if (recordId==null)
	{
		return null;
	}
	
	var i;
	var fldsNum = funcs.lng(fields);
	var sloList = new Array(fldsNum);
	for( i = 0; i< fldsNum; i++)
	{
	    sloList[i] = [];
	}
	if ( funcs._null(slas) ) {
	    return sloList; 
	}

	var arrayString = "";
	var length = slas.length(); 
	for(i=0; i<length; ++i)
	{	
		if (slas[i]!=null)
		{
			arrayString+=slas[i];
			if (i<length) {
			    arrayString += ",";
			}
		}
	}
	if (arrayString=="")
	{
		return null;
	}

    var sloResponse = new SCFile( "sloresponse", SCFILE_READONLY );      
	var sloResponseQry = "foreign.filename = \"" + filename + "\" and foreign.key = \"" + recordId + "\" and agreement.id isin {" +arrayString+"}";

	var v = 0;
	if ( sloResponse.doSelect( sloResponseQry ) == RC_SUCCESS )
	{
		do
		{
		    for ( i = 0; i < fldsNum; i++)
		    {
		        var field = fields[i];
		        if ( field == "sla.id" ) {
			        sloList[i][v] = sloResponse.agreement_id;
			    }
		        if ( field == "slo.current.status" ) {
			        sloList[i][v] = sloResponse.current_status;
			    }
		        if ( field == "slo.name" ) {
			        sloList[i][v] = sloResponse.slo_name;
			    }
		        if ( field == "slo.initial.state" ) {
			        sloList[i][v] = sloResponse.initial_state;
			    }
		        if ( field == "slo.final.state" ) {
			        sloList[i][v] = sloResponse.final_state;
			    }
		        if ( field == "slo.expiration.time" ) {
			        sloList[i][v] = sloResponse.expiration_time;
			    }
			}
		    v++;		
		}
		while ( sloResponse.getNext() == RC_SUCCESS );
	}
	
	return sloList;
}

//Get the workflow from the tableName
function getWorkflowFromTableName(tableNm)
{
    var workflowName=[];
    var sql="select distinct name from Workflow where tableName=\"" + tableNm + "\"";
    lib.c.$("Workflow", SCFILE_READONLY).setFields(["tableName"]).select(sql).iterate(function(record){
        workflowName.push(record.name);
    });
    return workflowName;
}

//Get the slamodulecontrol Status
function getLocalizedModuleStatus(tableName,statusList)
{
    if (tableName == null) {
        return [];
    }
    
    var dispMsg = new SCFile("scmessage", SCFILE_READONLY);
	var len=statusList.length();
	var returnList=[];
	var workflow=[];
	if(tableName=="svcCartItem")
	{
	   tableName="svcCatalog";
	}
	workflow=getWorkflowFromTableName(tableName);
	var wfLen=workflow.length;
	if(wfLen==1)
	{
	   returnList=lib.custom.getDisplayList(tableName,statusList,workflow[0]);
	}
	else
	{
	   var m, n;
	   for(m=0;m<len;m++)
       {
          var messageId="";
          var queryRecord="";
          for(n=0;n<wfLen;n++)
          {
               if(n==0)
               {
                  messageId+="(message.id=\""+tableName+";"+statusList[m]+";"+workflow[n]+"\" or message.id=\""+tableName+";"+statusList[m]+";NULL\"";
               }
               else
               {
                   messageId+=" or message.id=\""+tableName+";"+statusList[m]+";"+workflow[n]+"\" or message.id=\""+statusList[m]+";"+workflow[n]+";NULL\"";
               } 
               
          }//for n
         queryRecord="class=\"local:ModuleStatus\"" + " and "+ messageId + ")";  
         if (dispMsg.doSelect(queryRecord)==RC_SUCCESS)
	     {
		     returnList[m]=dispMsg.message;
	     }
	     else
	     {
	        returnList[m]=statusList[m];
	     }
      }//for m
    }//for else
	return returnList;
}

//Get the localized WorkflowPhase
function getLocalizedWfPhase(tableName,phaseList)
{
   if (phaseList == null) {
      return null;
   }
   
   var dispMsg = new SCFile("scmessage", SCFILE_READONLY);
   var returnList=[];
   var workflow=[];
   workflow=getWorkflowFromTableName(tableName);
   var wf_len=workflow.length;
   var phase_len = lib.ArrayUtil.length(phaseList);
   if(wf_len==1)
   {
      lib.custom.selectWfPhaseByWorkflow(workflow);
      return vars.$L_WfPhaseName_local;
   }
   else
   {
      var m, n; 
      for(m=0;m<phase_len;m++)
      {
         var messageId="";
         var queryRecord="";
         for(n=0;n<wf_len;n++)
         {
              if(n==0)
              {
                 messageId+="(message.id=\""+phaseList[m]+";"+workflow[n]+";"+tableName+"\" or message.id=\""+phaseList[m]+";"+workflow[n]+";NULL\"";
              }
              else
              {
                  messageId+=" or message.id=\""+phaseList[m]+";"+workflow[n]+";"+tableName+"\" or message.id=\""+phaseList[m]+";"+workflow[n]+";NULL\"";
              } 
         }//for n
         queryRecord="class=\"local:WorkflowPhase\"" + " and "+ messageId + ")";
         if (dispMsg.doSelect(queryRecord)==RC_SUCCESS)
	     {
		     returnList[m]=dispMsg.message;
	     }
	     else
	     {
	        returnList[m]=phaseList[m];
	     }
      }//for m
      
	  return returnList;
    }
} 
