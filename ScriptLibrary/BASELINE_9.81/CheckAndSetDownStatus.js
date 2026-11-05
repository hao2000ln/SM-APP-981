/*
Function:
Query all CI relationship record which include current CI in its relatedci list then
count how many related ci have bean down in the specified CI relationship.If the count less 
than CI relationship's outage threshold the this script will set the upstream ci field 'System 
down' as false.
Parameters: CI logicname(e.g. adv-afr-desk-112)
Author: Fei, Zhi-Chao
Crate Date: 2010.12.17

*/
function SetCIStatus(logicname)
{
	var issuccess=false;
	if(logicname == null || logicname==""){
    	return 	issuccess;
	}
	//get SLA control outage switch whether is active, if 'No' this script will terminate 
	//and return. Otherwise this script will continue.
	var outageisactive = GetSlaControlSpreadIsActive("probsummary");
	if(outageisactive == false)
	{
		return issuccess;
	}
	//Get CI list which include upstream CIS shoud be UP.
	var needupcilist = GetNeedUpCIList(logicname);
	if(needupcilist == null || needupcilist.length == 0){
   		return issuccess;
	}
	//Below set one CI field 'System Down' as false.
	for(var i = 0; i < needupcilist.length;i++)
	{
		var ciitemname = needupcilist[i];
	    var deviceitem = new SCFile("device");
	    var rc = deviceitem.doSelect("logical.name=\""+ciitemname+"\"");
	    if(rc == RC_SUCCESS)
	    {
	    	if (deviceitem.is_down == false)
	    	{
	    		continue;
	    	}
	    	else
	    	{
		        var ret;
		        system.functions.rtecall("trigger", ret, 0);	
		        {
		    		deviceitem.is_down = false;
		    		deviceitem.doUpdate();
		    	}
	            system.functions.rtecall("trigger", ret, 1);	
	        } 
		}
	    
	}
}


/*
Function:
Check every CI relationship and return the CI list which include shoud be up CIs.
Parameters: CI logicname(e.g. adv-afr-desk-112)
Author: Fei, Zhi-Chao
Crate Date: 2010.12.17
*/
function GetNeedUpCIList(logicname)
{
    var rslist = new Array();
	var rs_query="related.cis isin {\""+logicname+"\"} and outage.dependency=true";
	var relationship = new SCFile("cirelationship");
	var rc = relationship.doSelect(rs_query);
	if(rc == RC_SUCCESS)
	{
		do
		{
		   var cidowncount = 0;
	       var cioutage = relationship.outage_threshold;
	       var upstreamci = relationship.logical_name;
	       var relatedcilist = relationship.related_cis;
	       for(var i = 0;i < system.functions.lng(relatedcilist);i++)
	       {
	       		rsci=relatedcilist[i];
	       		//Query outage according to ci name and specified outage duration.
	       		var outage_sql ="logical.name=\""+rsci+"\" and outage.start<=tod() and (outage.end>tod() or outage.end=NULL) and (closed=NULL or closed=false)";
	       		var cioutageObj = new SCFile("outage");
                var outage_rc = cioutageObj.doSelect(outage_sql)
                //If found any outage record, that indicate this CI is down.
                if(outage_rc == RC_SUCCESS){
                	cidowncount = cidowncount +1;
	       		}
	       }
	       //If related ci down count less than ci relationship's outage threshol, then add to return list. 
	       if(cidowncount < cioutage)
	       {
	            //Add need one upstream ci to the return list
	       		rslist.push(upstreamci);
	       }
		
		}while( relationship.getNext() == RC_SUCCESS);
		
	}
	return rslist;
}

/*
Function:
query the SLA control record according the tablename and return the outage spread switch 
whether active.Switch is open return true, otherwise return false. 
Parameters: tablename (e.g. probsummary)

Author: Fei, Zhi-Chao
Crate Date: 2010.12.17
*/
function GetSlaControlSpreadIsActive(tablename)
{
	var isactive=false;//Default value is false
	if(tablename == null || tablename=="")
	{
		return isactive;
	}
	var sql="table.name=\""+tablename+"\"";
	var slacontrol = new SCFile("slamodulecontrol");
	var rc = slacontrol.doSelect(sql);
	if(rc == RC_SUCCESS){
	    //Set the SLA control field spread to the return variable.
		isactive = slacontrol.spread==null?false:slacontrol.spread;
	}
	return isactive;
}