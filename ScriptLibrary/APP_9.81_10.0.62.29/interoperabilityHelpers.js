function doScheduleAction( record, action, expiration )
{
  //  This function will schedule an interoperability action to be performed
  //  against the record that is passed in.
  
  var myRecord = record;
  var schedule = new SCFile("schedule");
  schedule._class = "linker";
  
  if ( expiration != null )
    schedule.expiration = expiration;
  else
  {
  	var time = new Date();
  	schedule.expiration = time;
  }
  schedule.name = "Interoperability Record";
  schedule.application = "ioevents.process";
  
  var dTag = new Datum();
  system.functions.tag(dTag, record);

  schedule.strings[0] = dTag;
  schedule.strings1[0] = action;
  
  if ( schedule.doInsert() == RC_SUCCESS)
  {
    
  	return true;
  }
 
  return false;
}

function scheduleAction( record, action )
{
  
  var time = new Date();
  return doScheduleAction( record, action, time );
   
}

function rescheduleAction( record, action )
{
  var time=new Date();
  
  var sched = new Date(time.getTime() + 120*1000);
  
  return doScheduleAction( record, action, sched );
   
}


function doDeleteAction(problemId){
    var sql = "source=\"" + problemId + "\" and source.filename=\"rootcause\" and depend.filename=\"problem\"";
    
    var iTotal= new SCDatum();
    var returnCode = 0;    
    var relation = new SCFile("screlation");    
    
    system.functions.rtecall("count", returnCode, relation, sql, iTotal); 
    var count = parseInt(iTotal.getText());
        
    var problem = new SCFile("rootcause");
    if ( problem.doSelect("id=\"" + problemId + "\"" ) == RC_SUCCESS ){
        if ( count != problem.incident_count ){
            problem.incident_count = count;
            var result = problem.doAction("updatecount");
            if ( result != RC_SUCCESS){
                if ( result == RC_CANT_HAVE || result == 51 ){
                    var returnCode = system.library.interoperabilityHelpers.rescheduleAction( relation, "PM.open.incidents");
                }
            }
        };
    
    };
}

//QCCRIE74727-When an screlation is deleted between a problem and a known error, the parent.problem is not cleaned up
function updateKnownError(problemId){
	
	var knownerror = new SCFile("knownerror");
	
	var rc = knownerror.doSelect("parent.problem=\""+problemId+"\"");
	if (rc==RC_SUCCESS)
	{
	  
	  var ret;
	  system.functions.rtecall("trigger", ret, 0); 
	  do
	  {
	  	knownerror.parent_problem='';
	  	var rc= knownerror.doUpdate();
	  	

	  }
	  while( knownerror.getNext() == RC_SUCCESS);
	  system.functions.rtecall("trigger", ret, 1);

	}

}
//QCCRIE74727-associate knownerror with problem
function updateParentProbleminKnownError(problemId,knownErrorId){
	
	var knownerror = new SCFile("knownerror");
	
	var rc = knownerror.doSelect("id=\""+knownErrorId+"\"");
	if (rc==RC_SUCCESS)
	{
	  
	  var ret;
	  system.functions.rtecall("trigger", ret, 0); 
	  if (knownerror.parent_problem==null)
	  {
	  	do
	  	{
	  		knownerror.parent_problem=problemId;
	  		var rc= knownerror.doUpdate();
	  	
	  	}
	  	while( knownerror.getNext() == RC_SUCCESS);
	  }
	  system.functions.rtecall("trigger", ret, 1);

	}

}

function shceduleDeleteAction(problemId){

  var schedule = new SCFile("schedule");
  schedule._class = "linker";
  
  var time=new Date();
  var sched = new Date(time.getTime() + 60*1000);
  schedule.expiration = sched;
  
  schedule.name = "Interoperability Record";
  schedule.javascript=    		
            "var id = \""+problemId+"\";\r\n" + 
            "var returnCode = system.library.interoperabilityHelpers.doDeleteAction(id)";
  
  if ( schedule.doInsert() == RC_SUCCESS)
  {
    
  	return true;
  }
  
  
 
  return false;
}

