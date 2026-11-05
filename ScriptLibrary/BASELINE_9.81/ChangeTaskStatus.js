function initialStatus(){

	
	vars.$statusvalues=system.functions.nullsub(vars.$valuelist,["0", "1", "2", "20", "21", "3", "30", "31", "32", "4"]);
	var planned = system.functions.scmsg("taskStatus;0","local:codes");
	var ready = system.functions.scmsg("taskStatus;1","local:codes");
	var assigned = system.functions.scmsg("taskStatus;2","local:codes");
	var completed = system.functions.scmsg("taskStatus;20","local:codes");
	var completed_wp = system.functions.scmsg("taskStatus;21","local:codes");
	var inprogress = system.functions.scmsg("taskStatus;3","local:codes");
    var cancelled = system.functions.scmsg("taskStatus;30","local:codes");
   	var withdrawn = system.functions.scmsg("taskStatus;31","local:codes");
    var failed = system.functions.scmsg("taskStatus;32","local:codes");
    var blocked = system.functions.scmsg("taskStatus;4","local:codes");
		
	
	
	vars.$statusdisplays=system.functions.nullsub(vars.$displaylist,[planned, ready, assigned, completed, completed_wp, inprogress, cancelled, withdrawn, failed, blocked]);
	var valuelist=vars.$statusvalues.toArray();
	var displaylist=vars.$statusdisplays.toArray();
	var _valuelist=new Array();
	var _displaylist=new Array();
	
	switch (vars.$L_file.current_phase)
	{
		case "Waiting":
			_displaylist=[planned,ready];
			_valuelist=valueListEntry(valuelist,displaylist,_displaylist);
			break;
		case "Active":
			_displaylist=[ready, assigned, inprogress,  blocked, completed, completed_wp,failed, cancelled];
			_valuelist=valueListEntry(valuelist,displaylist,_displaylist);
			break;
		case "Review":
			_displaylist=[completed,completed_wp,failed, cancelled];
			_valuelist=valueListEntry(valuelist,displaylist,_displaylist);
			break;
		case "Cancelled":
			_displaylist=[withdrawn];
			_valuelist=valueListEntry(valuelist,displaylist,_displaylist);
			break;
		case "Closed":
			_displaylist=[completed,completed_wp,failed];
			_valuelist=valueListEntry(valuelist,displaylist,_displaylist);
			break;
			
	}
	
	vars.$G_chmTask_status_initial = _valuelist;
	vars.$G_chmTask_status_local_initial = _displaylist;


}

function valueListEntry(valuelist,displaylist,_displaylist)
{
	var _valuelist=new Array();
	for (var i=0;i<_displaylist.length;i++)
	{
		for (var j=0;j<displaylist.length;j++)
		{
			if (_displaylist[i]==displaylist[j])
			{
				_valuelist.push(valuelist[j]);
				break;
			}
		}
	}
	return _valuelist;
}

