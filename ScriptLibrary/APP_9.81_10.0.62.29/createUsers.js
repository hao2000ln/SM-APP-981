/************************************************
	
	This script creates contacts and operaotors 
	for non ESS/SST users. Tailor the mapOperatorToContact
	function to define exactly how to map fields between
	contacts and operators.
	to map.
	
	@Date: 		9/14/05
	@Author: 	Ayaz Usman
	
*************************************************/

/*
*	Validations done in process record	
*/
function createOperatorWizard( fContact, login , Template, bUpdateContact)
{
	var password =vars.$new_pass;
	return createOperator( fContact, login , Template, bUpdateContact, password);
}

/**
	This function is called from the CAU to 
	create Power users.

	@param {firstName} string
	@param {lastName} string 
	@param {email} string 
	@param {phone} string 
	@param {userTemplate} strig optional
**/
function createUser(firstname, lastname, login, phone, opTemplate, email, contactName, password )
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
  			
  		}
  	}
  	var ret;

  	var fContact = system.library.SelfService.createContact(firstname, lastname, email, phone, contactName, conTemplate);
  	  
 	if (fContact != null)
 	{
  		ret = createOperator( fContact , login , opTemplate, true, password);
 	}
 	//Added by Henrry to fix QCCR1E115164 Cannot Clone Entire Group Info.via User Quick Add Utility
 	if(ret){
 		var templateOperatorLoginName=opTemplate;
 		var myGroup=new SCFile("myGroups");
 		var sql="name=\""+templateOperatorLoginName+"\"" ;
 		if(myGroup.doSelect(sql)===RC_SUCCESS){
 			myGroup['name']=login;
 			myGroup.doSave();
 		}
 	}

 	return ret;
}

/**
	This function creates a contact based on a template.
	
	@param {fOp} record - Operator record
	@param {templateCon} string - Contact to Clone
**/
function createContact(fOp, templateCon)
{

	var fOperator = new SCDatum(fOp);
	var tfContact = new SCFile("contacts");

	if ( (templateCon=="") || (templateCon == null) )
		{
		scmessage=system.functions.scmsg(105, "ScriptLibrary");
		print(scmessage);

		}
	else
	{
	 	var rc = tfContact.doSelect( "contact.name=\""+templateCon+"\"" );
	}

	mapOperatorToContact(fOperator, tfContact);
	var id = tfContact.contact_name;

	rc =tfContact.doInsert();
	if ( rc == RC_SUCCESS )
	{
	    print( system.functions.scmsg( 157, "ScriptLibrary", [id] ) );
		
		return true;
	}
	else
	{
		scmessage=system.functions.scmsg(107, "ScriptLibrary", [RCtoString(rc), id]);	
		print(scmessage);

		return false;	
	}	
	
}

/**
	This function performs a mass create of contacts based on a template.
	
	@param {fOp} record - Operator record
	@param {templateCon} string - Contact to Clone
**/
function massCreateContactsWizard(fOp, templateCon)
{
	var ret;
	
	if ( fOp )
	{
		var count=0;
    	var dOperator = new SCDatum( fOp );
    	do 
    	{
    		var bFound = false;
			var contactName = dOperator.contact_name;

    		//check to see if a contact points to this operator
			ret = system.library.userUtils.findContactByField("operator.id", dOperator.name);
			if ( ret != null )
			{
				bFound=true;

				scmessage=system.functions.scmsg(108, "ScriptLibrary", [dOperator.name, ret.contact_name]);	
				print(scmessage);
			}
			else if ( contactName != null && contactName != "" )
			{
				ret = system.library.userUtils.findContactByField("contact.name", contactName);

				if ( ret != null )
				{
					bFound = true;

					scmessage=system.functions.scmsg(109, "ScriptLibrary", [contactName]);	
					print(scmessage);
				}
			}
			
			if ( !bFound )
			{
	  			ret=createContact(dOperator, templateCon);
		  		if ( ret == true )
		  		{
		  			count++;
		  		}
		  	}
    	}
    	while ( dOperator.getNext() == RC_SUCCESS );   
    }

	scmessage=system.functions.scmsg(110, "ScriptLibrary", [count]);	
	print(scmessage);
}

/**
	This function creates a operator for non ESS/SST users. If an operator.id is filled on contact, it
	tries to use this as the primary key for the operaotr, if not it uses the OperatorID, 
	which is the email address.
	
	@param {fContact} record - contact record
	@param {login} string - email
	@param {Template} string  - Operator to Clone
	@param {bUpdateContact} boolean - update the contact or not with linked operator id
**/

function createOperator( fContact, login , Template, bUpdateContact, password)
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

	if (password){
	    fOperator.password = password;
	} else {
	    fOperator.password = null;
	}
	fOperator.name = login;
  	fOperator.expire_password = true;
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
	fOperator.multi_login = false;
	fOperator.no_lock_user = false;
	
    vars.$file_into_js = fOperator;
    
    var result = lib.RAD.run('js.action', 
    	["index", "prompt"], [0, "addsave"], [6,6], ["index"]);
    
    ret = result.results[0];
    
    if ( ret == RC_SUCCESS)
    {
		scmessage=system.functions.scmsg(111, "ScriptLibrary", [login]);	
		print(scmessage);

		ret = true; 	
    }
    else 
    {
		scmessage=system.functions.scmsg(112, "ScriptLibrary", [login, RCtoString(ret)]);	
		print(scmessage);

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
			scmessage=system.functions.scmsg(113, "ScriptLibrary", [dContact.contact_name]);
			print(scmessage);

	    }
     	else
      	{
      	   	var ret=createOperatorWizard( dContact, login, Template,  bUpdate );
   	  		if ( ret == true )
   	  		{
	  			count++;
	  		}
		   	else
		    {
				scmessage=system.functions.scmsg(114, "ScriptLibrary", [login]);
				print(scmessage);

		    }
		}
    }
    while ( dContact.getNext() == RC_SUCCESS );    

	scmessage=system.functions.scmsg(115, "ScriptLibrary", [count]);
	print(scmessage);
  }
}


function mapOperatorToContact(fOperator, fContact)
{
	var contactId = fOperator.contact_name;
	var bContinue = true;
	
	if ( contactId != null && contactId != "" )
	{
		var ret = system.library.userUtils.findContactByField("contact.name", contactId.toUpperCase());
		if ( ret == null )
		{
			bContinue=false;
		}
	}
			
	//try full name
	if ( fOperator.full_name != null && fOperator.full_name != ""  && bContinue==true)
	{
		contactId = fOperator.full_name;
		ret = system.library.userUtils.findContactByField("contact.name", contactId.toUpperCase());			
		if ( ret == null )
		{
			bContinue=false;
		}
	}
	
	if ( bContinue == true )
	{
		contactId = system.library.userUtils.getUniqueId();
	}
		
	fContact.contact_name=contactId.toUpperCase();		
	fContact.full_name=fOperator.full_name;	
	fContact.email=fOperator.email;
	fContact.company=fOperator.company;	
	fContact.contact_phone=fOperator.phone;
	fContact.language=fOperator.syslanguage;
	fContact.manager=fOperator.manager;
	fContact.operator_id=fOperator.name;
	
	//Generated
	if ( fContact.dept_name == null )
	{
		fContact.dept_name="Sales";
	}

	fContact.logical_name="ACME Phone 0001";	

	fContact.title="Telesales";
	fContact.group="Outside Sales";
	if ( fContact.email == null )
	{
		fContact.email="sales@sm.hp.com";
	}
		
	fContact.shift="day";
	fContact.payroll_no="213456";	
	
		
	if ( fContact.manager == null )
	{
		fContact.manager="MANAGER, MAX";		
	}
		
	fContact.contract_id=1;
	fContact.corp_structure="HP/Sales";			
	fContact.user_type="mobile";
	fContact.location="Chicago";
	fContact.building="1";
	fContact.floor="3";
	fContact.room="Falcon";	
	fContact.office_cube="3A3";
	
	if ( fContact.contact_phone == null )
	{
		fContact.contact_phone="(888) 555-1212";		
	}
		
	fContact.extension="x257";
	fContact.fax_phone="(888) 555-2000";
}


function printContact(fContact)
{
	print("---------------------");
	print("First Name = " + fContact.first_name);
	print("Last Name = " + fContact.last_name);
	print("Contact Name = " + 	fContact.contact_name);
	print("Company = " + fContact.company);
	print("Department = " + fContact.dept_name);
	print("Language = " + fContact.language);	
	print("Email = " + fContact.email);
	print("Manager = " + fContact.manager);	
	print("Phone = " + fContact.contact_phone);
	print("User Id = " + fContact.user_id);	
	print("Operator Id =" +  fContact.operator_id );
	print("---------------------");

}

function printOperator(fOperator)
{
	print("---------------------");
	print("Id = " + fOperator.name);
	print("Full Name = " + fOperator.full_name);
	print("Email = " + fOperator.email);
	print("---------------------");

}

var log = getLog("syncUserFromIdm");

function syncUserFromIdm(userName, userInfoJson) {
    var fOperator;
    var fContact;
    var opTemplate = "Template_IdM";
    var opNewFlag = 0;
    var contactNewFlag = 0;
    var userInfo = JSON.parse(userInfoJson);

    fOperator = system.library.userUtils.findOperatorByField("name", userName);
    if (fOperator != null)
        fContact = system.library.userUtils.findContactByField("contact.name", fOperator.contact_name.toUpperCase());
    else {
        fOperator = new SCFile("operator");
        var fTemplate = system.library.userUtils.findOperatorByField("name", opTemplate);
        if (fTemplate==null)
        { 
            fOperator["user.role"] = "self service";
            log.error("No Template_IdM found, please create.");
        }

        fOperator.systemplate = opTemplate;
        opNewFlag = 1;
    }

    if (fContact == null) {
        contactNewFlag = 1;
        fContact = new SCFile("contacts");
    }

    var fSmIdmMapping = new SCFile("idmmapping");
    var rc = fSmIdmMapping.doSelect("true");
    if (rc != RC_SUCCESS) {
        log.error("No SM/IDM mapping relation found.");
        return false;
    }

    var i;
    var OpFieldsArr = fSmIdmMapping.operator_sm.toArray();
    var idmOpAttrArr = fSmIdmMapping.operator_idm.toArray();
    //operator name received from idm cannot be null/""
    if (userInfo['username'] == null || userInfo['username'] == "") {
        log.error("No operator name found, sync user from IdM failed.");
        return false;
    }
    fOperator['name'] = userInfo['username'];

    for (i = 0; i < OpFieldsArr.length; i++) {
        if (opNewFlag || OpFieldsArr[i] != "contact.name") //when update, don't update the operator's contact name
            if (OpFieldsArr[i] != null && userInfo[idmOpAttrArr[i]] != null)
                parseValue(fOperator, fOperator.getFieldType(OpFieldsArr[i]), OpFieldsArr[i], userInfo[idmOpAttrArr[i]]);
    }
    var contactFieldsArr = fSmIdmMapping.contacts_sm.toArray();
    var idmContactAttrArr = fSmIdmMapping.contacts_idm.toArray();

    for (i = 0; i < contactFieldsArr.length; i++) {
        if (contactFieldsArr[i] == "contact.name") {
            //contacts contact name received from idm cannot be null/""
            if (userInfo[idmContactAttrArr[i]] == null || userInfo[idmContactAttrArr[i]] == "") {
                log.error("No contact name found, sync user from IdM failed.");
                return false;
            }

            if (opNewFlag == 0 && fOperator.contact_name != userInfo[idmContactAttrArr[i]].toUpperCase()) //when update, check if operator contact name is equal to received contact name
            {
                log.error("The received contact name [" + userInfo[idmContactAttrArr[i]] + "] from IdM is different from the local operator contact name[" + fOperator.contact_name + "], sync user from IdM failed.");
                return false;
            }

            fContact.contact_name = fOperator.contact_name;
        } else if (contactFieldsArr[i] != null && userInfo[idmContactAttrArr[i]] != null)
            parseValue(fContact, fContact.getFieldType(contactFieldsArr[i]), contactFieldsArr[i], userInfo[idmContactAttrArr[i]]);
    }

    if (fContact.first_name != null )
      fContact.full_name = fContact.first_name;
    if (fContact.last_name != null)
    {
      if (fContact.full_name != null)
      {
        fContact.full_name = fContact.full_name + " " + fContact.last_name;
      } else {
         fContact.full_name = fContact.last_name;
      }
    }
    fOperator.full_name = fContact.full_name;

    fOperator.contact_name = fOperator.contact_name.toUpperCase();
    fContact.contact_name = fOperator.contact_name;
    fContact.operator_id = fOperator.name;

    //save operator
    if (!createOperatorFromIdm(opNewFlag, fOperator))
        return false

    if (!contactNewFlag) {
        rc = fContact.doUpdate();
        if (rc == RC_SUCCESS)
            log.info("Updated contact " + fContact.contact_name);
        else {
            log.warn("Cannot update contact " + fContact.contact_name);
            //return false;
        }
    } else {
        rc = fContact.doInsert();
        if (rc == RC_SUCCESS)
            log.info("Created contact " + fContact.contact_name);
        else {
            log.error("Cannot create contact " + fContact.contact_name);
            //return false;
        }
    }

    return true;
}

function createOperatorFromIdm(newFlag, fOperator) {
    var ret = true;
    if (newFlag) {
        fOperator.password = "Aa@1" + (Math.random() * 0x10000).toString(0xF);
        ret = fOperator.doInsert();
        if (ret == RC_SUCCESS)
            log.info("Created operator " + fOperator.name);
        else
            log.warn("Cannot create operator " + fOperator.name);
    } else {
        ret = fOperator.doUpdate()
        if (ret == RC_SUCCESS)
            log.info("Updated operator " + fOperator.name);
        else
            log.warn("Cannot update operator " + fOperator.name);
    }

    return ret==RC_SUCCESS;
}

function parseValue(targetFile, fieldType, smField, idmVal) {
    if (fieldType == 1) //number
        targetFile[smField] = +idmVal;
    else if (fieldType == 3) //time
        targetFile[smField] = funcs.val(idmVal, 3);
    else if (fieldType == 4) //bool
        targetFile[smField] = parseInt(idmVal) ? true : false;
    else if (fieldType == 8) //array
    {
        var type = targetFile.getFieldType(targetFile[smField][0]);
        if (type == 1) targetFile[smField][0] = +idmVal;
        else if (type == 3) targetFile[smField][0] = funcs.val(idmVal, 3);
        else if (type == 4) targetFile[smField][0] = parseInt(idmVal) ? true : false;
        else targetFile[smField][0] = idmVal;
    } else //string and so on
        targetFile[smField] = idmVal;
}