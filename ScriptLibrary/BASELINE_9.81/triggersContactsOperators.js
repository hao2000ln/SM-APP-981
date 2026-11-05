/************************************************
	@fileoverview triggersContactsOperators
	@author: 	Ayaz Usman
		
	This script creates functions to synronize 
	contacts and operators.  Post 6.2 it is 
	highly recommended that there be a 1-to-1 
	relationship between contacts and operators.
	
	sync Operator  	-> Contact
		 full.name 	-> full.name
		 email 		-> email

	@Date: 		9/26/05

	Updated by Joe Holloway to use scmessage records for
	localization. July 2006	
	
*************************************************/

/**
	This function checks to see if the fields we
	are monitoring for changes have indeed changed.
	
	@param {File} record - contact AFTER update
	@param {File} oldrecord - contact BEFORE update	
	@return {Boolean} 
**/
function checkIfContactChanged(record, oldrecord)
{
	var contactChanged = false;
	if ( record.full_name != oldrecord.full_name )
		contactChanged = true;
		
	if ( record.email != oldrecord.email )
		contactChanged = true;
		
	if ( record.contact_name != oldrecord.contact_name )
		contactChanged = true;
		
	if ( record.operator_id != oldrecord.operator_id )
		contactChanged = true;

	if ( record.fax_phone != oldrecord.fax_phone )
		contactChanged = true;
		
	
	return contactChanged;
}

/**
	This function checks to see if the fields we
	are monitoring for changes have indeed changed.
	
	@param {File} record - operator AFTER update
	@param {File} oldrecord - operator BEFORE update	
	@return {Boolean} 
**/
function checkIfOperatorChanged(record, oldrecord)
{
	var operatorChanged = false;
	
	if ( record.full_name != oldrecord.full_name )
		operatorChanged = true;

	if ( record.email != oldrecord.email )
		operatorChanged = true;
		
	if ( record.name != oldrecord.name )
		operatorChanged = true;
		
	if ( record.contact_name != oldrecord.contact_name )
		operatorChanged = true;
				
	if ( record.fax != oldrecord.fax )
		operatorChanged = true	
		
	
	return operatorChanged;
}

/**
	Called when Updating Contacts after update from trigger. Operator 
	is synced to contact.
	
	@param {File} record - contact AFTER update
	@param {File} oldrecord - contact BEFORE update	
**/
function syncOperatorToContact(record, oldrecord)
{
	

	var doSync = checkIfContactChanged(record, oldrecord);
		
	if (doSync)
	{
		var OpId = record.operator_id;
		
		var fOperator = new SCFile("operator");
		var rc = fOperator.doSelect("name=\""+OpId+"\"");
	 	if ( rc == RC_SUCCESS )		
		{
				
			fOperator.full_name = record.full_name;
			fOperator.email = record.email;
			fOperator.contact_name=record.contact_name;
			fOperator.fax=record.fax_phone;
			
			var ret;	
			system.functions.rtecall("trigger", ret, 0);			
			var rc=fOperator.doUpdate();			
			system.functions.rtecall("trigger", ret, 1);			
			if (rc==RC_SUCCESS)
			{
				themessage2=system.functions.scmsg(104, "ScriptLibrary", [fOperator.name]);
				print(themessage2);

			}
			
		}	
		else
		{
			if ( OpId == null)
			{
				themessage=system.functions.scmsg(100, "ScriptLibrary");
				print(themessage);

			}
			else
			{
				var aMsgArray= new Array(OpId);

				themessage2=system.functions.scmsg(101, "ScriptLibrary", [OpId]);
				

			}
		}
	}

}

/**
	Called when Updating Operators after update by trigger. Contact 
	is synced to operator.

	@param {File} record - operator AFTER update
	@param {File} oldrecord - operator BEFORE update	
**/

function syncContactToOperator(record, oldrecord)
{
	var doSync = checkIfOperatorChanged(record, oldrecord);
	
	if (doSync)
	{
		var ConId = record.contact_name;
		var fContact = new SCFile("contacts");
		var rc = fContact.doSelect("contact.name=\""+ConId+"\"");
	 	if ( rc == RC_SUCCESS )		
		{
		
			fContact.full_name = record.full_name;
			fContact.email = record.email;
			fContact.operator_id = record.name;
			fContact.fax_phone = record.fax;
						
			var ret = new Datum();
			system.functions.rtecall("trigger", ret, 0);
			var rc=fContact.doUpdate();				
			system.functions.rtecall("trigger", ret, 1);
			if (rc==RC_SUCCESS)
			{
				themessage2=system.functions.scmsg(102, "ScriptLibrary", [fContact.contact_name]);
				print(themessage2);
			}
		}	
		else
		{
			themessage2=system.functions.scmsg(103, "ScriptLibrary", [ConId]);
			print(themessage2);
		}
	}

}

/**
	Helper fuction to print a contact. 
**/
function printConRec(rec)
{	
	print("-----------------------");
	print ( "First Name: " + rec.first_name );
	print ( "Last Name: " + rec.last_name );
	print ( "Email: " + rec.email );	
	print ( "Dept: " + rec.dept );	
	print ( "Email: " + rec.email );	
	print("-----------------------");	


}