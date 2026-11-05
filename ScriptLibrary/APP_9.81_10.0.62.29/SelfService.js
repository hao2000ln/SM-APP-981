/************************************************
	
	This function is used by user self registration.

	
	@Date: 		11/4/05
	@Author: 	Steve Anderson, Ayaz Usman
	
*************************************************/


function registerEssUserWeb(firstName, lastName, email, phone)
{
	var login=email;
	var contactName = system.library.userUtils.createContactId(firstName, lastName);
	
	var pCheck = system.library.userUtils.preCheckCreateUser(contactName, login);
	
	if ( pCheck =="operatorexists")
	{
		var msg = system.functions.scmsg(126, "ScriptLibrary", [email]);
		print(msg);
    	
	}
	
	if ( pCheck == "contactexists" )
	{
		//if a collison with contact name, set contact name for self reg to time
		contactName = system.library.userUtils.getUniqueId();
		pCheck="true";
	}
	
	if ( pCheck == "true")
	{
		//Create User
		var ret;
		system.functions.rtecall("trigger", ret, 0);
		var fCon = createContact(firstName, lastName, email, phone, contactName);
		ret = createOperator( fCon, login , "Template_SelfService", "true");		
		system.functions.rtecall("trigger", ret, 1);
		if ( ret == true )
			{
				var msg = system.functions.scmsg(127, "ScriptLibrary");
				print(msg);
				
			}
	}
}

/*
*	Validations done in process record	
*/

function createOperatorWizard( fContact, login , Template, bUpdateContact)
{
	 createOperator( fContact, login , Template, bUpdateContact);
}


/**
	This function is called from the Web client/CAU(Self Service users) to 
	self register ESS users.

	@param {firstName} string
	@param {lastName} string 
	@param {email} string 
	@param {phone} string 
	@param {userTemplate} strig optional
**/
function registerEssUser(firstName, lastName, login, phone, opTemplate, email, contactName)
{
  var conTemplate;
  if (opTemplate != null && opTemplate != "")
  {
	//We have op Temp, use its Contact as Contact template
	var fOperator = new SCFile("operator");
	var rc = fOperator.doSelect("name=\""+opTemplate+"\"" );
	if ( rc == RC_SUCCESS )
  	{
  		conTemplate = fOperator.contact_name;
		var msg = system.functions.scmsg(128, "ScriptLibrary", [conTemplate]);
		print(msg);
  		
  	}
  }
  var ret;
  system.functions.rtecall("trigger", ret, 0);
  ret = createContact(firstName, lastName, email, phone, contactName, conTemplate);

  if ( ret!= null)
  {
  	ret = createOperator( ret, login, "Template_SelfService", true);
  }
  
  system.functions.rtecall("trigger", ret, 1);
  return ret;
}


/**
	This function creates a contact. It checks to see if an email
	exists in the contact.name and the user.id field first.
	Returns contact if successfull, null if not
	
	@param {firstName} string
	@param {lastName} string 
	@param {email} string 
	@param {phone} string 
	@param {conTemplatephone} string optional
**/
function createContact(firstName, lastName, email, phone, contactName, conTemplate)
{
 	var fContact = new SCFile("contacts");
 	var commit=true;

	if (conTemplate != null && conTemplate != "")
	{
		rc = fContact.doSelect("contact.name=\""+conTemplate+"\"" );
		if ( rc == RC_SUCCESS )
			{
				var msg = system.functions.scmsg(128, "ScriptLibrary", [conTemplate]);
				print(msg);
				
			}
	}
	
	if ( commit==true)
    {
  		fContact.first_name=firstName;
		fContact.last_name=lastName;
  		fContact.email=email;
		fContact.contact_phone=phone;
	
		if ( contactName == "" || contactName == null )
		{
			contactName = system.library.userUtils.createContactId(firstName, lastName);
		}
	
		fContact.contact_name=contactName;  //contact.name is all caps always
		fContact.full_name= firstName + " " + lastName;
		//set to null, create operator, sets contacts operator id later
		fContact.operator_id = "";

	   	var addflag = fContact.doAction("addsave");
		var msg = system.functions.scmsg(129, "ScriptLibrary", [fContact.contact_name]);
		print(msg);	   	
	   	
     	return fContact;
 	}
 	
}



/**
	This function creates a operator. If an operator.id is filled on contact, it
	tries to use this as the primary key for the operaotr, if not it uses the OperatorID, 
	which is the email address.
	
	@param {fContact} record - contact record
	@param {login} string - email
	@param {Template} string  - Operator to Clone
	@param {bUpdateContact} boolean - update the contact or not with linked operator id
**/
function createOperator( fContact, login , Template, bUpdateContact)
{
	var id = fContact.operator_id;
  	var fOperator = new SCFile( "operator" );
  	
  	if (Template != null && Template != "")
  	{
  		var	rc = fOperator.doSelect("name=\""+Template+"\"" );
  		if ( rc == RC_SUCCESS )
  		{
  			if (fOperator.template_operator == true)
  			{
			  	fOperator.systemplate = Template;
			}
  		}
  	}

	fOperator.name = login;

  	fOperator.expire_password = true;
  	fOperator.ess_access_only = true;
  	fOperator.full_name = fContact.full_name;
	fOperator.contact_name=fContact.contact_name;   
	fOperator.email = fContact.email; 
	
	// clear value of "never expire password"
	fOperator.never_expire_pass = false;
	fOperator.pwd_history=[];
	fOperator.last_login=null;
	fOperator.password_errors=0;
	fOperator.password_date=null;
	fOperator.reset_by=null;
	fOperator.user_login_count=null;
	
    var ret = fOperator.doAction("addsave");
    
    if ( ret == RC_SUCCESS)
    {
		var msg = system.functions.scmsg(111, "ScriptLibrary", [login]);
		print(msg);	   	
    	
		ret = true; 	
    }
    else
    { 
    	ret = false;
    }
     
   if (bUpdateContact != "false" && ret == true )
   {
     //Since operator inserted, fContact has been sycned by triggers
	 //so fContact is now stale data so query for updated fContact
	 var fContact2= new SCFile("contacts");
	 rc = fContact2.doSelect("contact.name=\""+fOperator.contact_name+"\"" );
	 
	 //Set contacts operator id
	 fContact2.operator_id = fOperator.name;
     var rc = fContact2.doAction("save");
	 if ( rc == RC_SUCCESS )	  		
	 {
		ret=true;
	 }
	 else
	 { 
		ret=false;     
	 }
   }
   
   return ret;
   
}

/**
	This function performs a mass operator creation. 
	
	@param {fContact} record - contact record
	@param {Template} string  - Operator to Clone
**/
function massCreateOperatorsWizard( fContact, Template )
{
  if ( fContact )
  {
    var count =0;
    var dContact = new SCDatum( fContact );
    var login;
    var bUpdate = "true";
    do 
    {
      	if ( dContact.operator_id != null && dContact.operator_id != "")
      	{
	 		login = dContact.operator_id;
	 	}
		else if ( dContact.email != null && dContact.email != "")
		{
			login = dContact.email;
		}
		else
		{
			login = null;
		}
			
      	if ( login == null )
      		{
				var msg = system.functions.scmsg(111, "ScriptLibrary", [dContact.contact_name]);
				print(msg);	   	
      			
      		}	
      	else
      	{
      	   	var ret=createOperator( dContact, login, Template,  bUpdate );
   	  		if ( ret == true )
   	  		{
	  			count++;
	  		}
		   	else
				{
					var msg = system.functions.scmsg(114, "ScriptLibrary", [login]);
					print(msg);	   	
		   			
		   		}
		}
    }
    while ( dContact.getNext() == RC_SUCCESS );
	var msg = system.functions.scmsg(115, "ScriptLibrary", [login]);
	print(msg);	   	
    
  }
}



