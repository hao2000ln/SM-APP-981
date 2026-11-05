// This function creates a schedule record for sync or adding a company to UCMDB
function syncCompanyAfterAddOrDelete( company, action )
{
	if (company.ucmdb_customer_id == 1){
		return;
	}
	
	var fSchedule = new SCFile( "schedule" ); 
	var callRtn = new SCDatum();
	var nextNumber = new SCDatum();
	var currentTime = new XMLDate( new Date() );

	var iCompany = company.ucmdb_customer_id;
	
	if (action == "add")
	{
		fSchedule.name = "Synch Company with UCMDB - " + company.ucmdb_customer_id;
	}	
	else 
	{
		fSchedule.name = "Inactivate Company with UCMDB - " + company.ucmdb_customer_id;
	}		
	fSchedule._class ="problem";
	fSchedule.sched_class ="problem";
	fSchedule.expiration = currentTime.getDatum();
	if (action == "add")
	{
		fSchedule.javascript = "system.library.multiTenantUcmdb.addOrDeleteCompany( "+iCompany+",\"\",\"add\" );";
	}
	else 	
	{
		fSchedule.javascript = "system.library.multiTenantUcmdb.addOrDeleteCompany( "+iCompany+",\"\",\"remove\" );";
	}

	fSchedule.doInsert();	
	
	var msg = system.functions.scmsg(6, "ucmdb");
	print(msg);
}


// This function creates a schedule record for sync or adding a company to UCMDB
function syncCompanyAfterUpdate( companyOld, companyNew)
{
	if (companyOld.ucmdb_customer_id == 1){
		return;
	}	
	
	var fSchedule = new SCFile( "schedule" ); 
	var callRtn = new SCDatum();
	var nextNumber = new SCDatum();
	var currentTime = new XMLDate( new Date() );

	var iCompanyOld = parseInt( companyOld.ucmdb_customer_id, 0 );
	var iCompanyNew = parseInt( companyNew.ucmdb_customer_id, 0 );

	
	fSchedule.name = "Update Company with Ucmdb - " + companyOld.ucmdb_customer_id;		
	fSchedule._class ="problem";
	fSchedule.sched_class ="problem";
	fSchedule.expiration = currentTime.getDatum();
	fSchedule.javascript = "system.library.multiTenantUcmdb.addOrDeleteCompany( "+iCompanyOld+","+iCompanyNew+",\"removeandadd\" );";

	fSchedule.doInsert();	
	
	var msg = system.functions.scmsg(6, "ucmdb");
	print(msg);
}

function addOrDeleteCompany(customerId1, customerId2,action)
{
	var ucmdbSvc = new lib.UcmdbManagementService.UcmdbManagementService();
	                       
	ucmdbSvc.location = getManagementServiceUrl();					
	ucmdbSvc.user     = lib.uCMDBConfiguration.getMultiTenantUsername(); 
	ucmdbSvc.password = lib.operatorUtil.getPassword(lib.uCMDBConfiguration.getMultiTenantPassword());
	
	var addCustomerReq;
	var removeCustomerReq;
	if(action == "add")
	{
		addCustomerReq = new lib.UcmdbManagementService.addCustomerRequest();
	}
	else if(action == "remove")
	{
		removeCustomerReq = new lib.UcmdbManagementService.removeCustomerRequest();
	}	
	else 
	{	
		addCustomerReq = new lib.UcmdbManagementService.addCustomerRequest();
		removeCustomerReq = new lib.UcmdbManagementService.removeCustomerRequest();	
	}

    if(action == "add")
    {
		addCustomerReq.CustomerID.setValue( customerId1 );
	}
	else if(action == "remove")
	{
		removeCustomerReq.CustomerID.setValue( customerId1 );
	}
	else
	{
		addCustomerReq.CustomerID.setValue( customerId2 );
		removeCustomerReq.CustomerID.setValue( customerId1 );
	}	
	
	
	try{
		var addCustomerResp, removeCustomerResp;
		if(action =="add")
		{
			addCustomerResp = ucmdbSvc.invoke( addCustomerReq );
		}	
		else if(action =="remove")
		{
			removeCustomerResp = ucmdbSvc.invoke( removeCustomerReq );
		}	
		else
		{
			removeCustomerResp = ucmdbSvc.invoke( removeCustomerReq );	
			addCustomerResp = ucmdbSvc.invoke( addCustomerReq );	
		}	
		if(action =="add")
		{
			updateSyncFlag(customerId1, action);
		}
		else if(action=="removeandadd")
		{
			updateSyncFlag(customerId2, action);
		}	
		
		vars.$L_repeat_flg = false;	
	} 
	catch (e)
	{
		var eString = e.toString();
		
		if(eString.indexOf("SOAPExceptionImpl")>0)
		{
			var currentTime = new XMLDate( new Date() );
			var fSchedule = new SCFile( "schedule" ); 
			
			var sqlStr;
			if(action =="add")
			{
				sqlStr = "name=\"Synch Company with UCMDB - "+ customerId1+"\"";
			}
			else 	
			{
				sqlStr = "name=\"Inactivate Company with UCMDB - "+ customerId1+"\"";
			}
   			var rc = fSchedule.doSelect( sqlStr );

       		if ( rc == RC_SUCCESS )
   			{
				fSchedule.sched_class ="problem";
				var duration = new XMLDate("P0Y0M0DT0H5M0S");
				fSchedule.repeat = duration.getDatum();

				var expiration = currentTime.addDuration("P0Y0M0DT0H5M0S");
				var expireDate = new XMLDate(expiration);
				fSchedule.expiration = expireDate.getDatum();

				fSchedule._class ="problem";
				fSchedule.status = "rescheduled";

				fSchedule.doUpdate();	
			}			
		}			
		else
		{
			var msg = eString;
   		
   			print( "SOAP Fault: " + msg );
		
			// Add a msglog for the SOAP fault returned from UCMDB 
			var fMsglog = new SCFile( "msglog" ); 
 			var currentMsgTime = new XMLDate( new Date() );
 			var operator = system.functions.operator();
			var retCode = new SCDatum();
			var nextCount = new SCDatum();
		
			system.functions.rtecall( "count", retCode, fMsglog, nextCount );

			fMsglog.record_number = nextCount; 
			fMsglog.operator = operator;
			fMsglog.msg_time = currentMsgTime.getDatum();
			fMsglog.msg_class = "UCMDB communication error"; 
			fMsglog.msg_name = "multiTenantUcmdb";
			fMsglog.msg_text[0] = msg;
			fMsglog.device = "SYSTEM";
			fMsglog.msg_level = 3;
			fMsglog.msg_number = 1;

 			fMsglog.doInsert();	
 		
   			Quit();
		}
		return;
	}	

	if(action == "add")
	{
		print("No Error, Completed adding a Company");
	}
	if(action == "remove")
	{
		print("No Error, Completed removing a Company");
	}	
	else 
	{
		print("No Error, Completed updating a Company");
	}	
}

function getManagementServiceUrl()
{
	if (lib.uCMDBConfiguration.getMultiTenantWebserviceUrl() != null)
	{
		return lib.uCMDBConfiguration.getMultiTenantWebserviceUrl();
	}
	else 
	{		
		var aString  = lib.uCMDBConfiguration.getWebserviceUrl();
		var url = aString.substring(0,aString.indexOf("/ucmdbSMService"))+"/UcmdbManagementService";
		return url;
	}		
}

function cleanupScheduler(customerId, action)
{
	var fSchedule = new SCFile( "schedule" ); 
			
	var sqlStr;
	if(action =="add")
	{
		sqlStr = "name=\"Synch Company with UCMDB - "+ customerId+"\"";
	}
	else 
	{
		sqlStr = "name=\"Inactivate Company with UCMDB - "+ customerId+"\"";
	}
   	var rc = fSchedule.doSelect( sqlStr );

    if ( rc == RC_SUCCESS )
   	{
		fSchedule.doDelete();	
	}			
}

function updateSyncFlag(customerId, action)
{
	if (action == "add")
	{
		var fCompany = new SCFile( "company" );
		var sqlStr = "ucmdb.customer.id=\""+ customerId+"\"";
		var rc = fCompany.doSelect(sqlStr);
		if ( rc == RC_SUCCESS )
   		{
        	fCompany.ucmdb_synced = true;
        	fCompany.show_company = "Y";
			fCompany.doUpdate();	
		}	 
	}
}

function checkExistSchedule(customerId, action)
{
	var fSchedule = new SCFile( "schedule", SCFILE_READONLY ); 
			
	var sqlStr;
	if(action =="add")
	{
		sqlStr = "name=\"Synch Company with UCMDB - "+ customerId+"\"";
	}
	else 
	{
		sqlStr = "name=\"Inactivate Company with UCMDB - "+ customerId+"\"";
	}
   	var rc = fSchedule.doSelect( sqlStr );

    if ( rc == RC_SUCCESS )
   	{
		return true;	
	}			
	else 
	{
		return false;
	}
}

function addElement(list, type, value){
	var element = new SCDatum();
	element.setType(type); //string                           
	element = value;
	list.push(element);
}