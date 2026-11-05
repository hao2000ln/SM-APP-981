// Set $lo.contact.name variable when first logging in.
// The variable will be set based on the operator record and 
// matching the login name of the operator with Service Center Id field of 
// the pertaining contact record.
// There will not be an error message if there is no matching contact record for the operator.
function setloContactName()
{
  var fContacts = new SCFile("contacts", SCFILE_READONLY);
  fContacts.setFields(["contact.name"]);
  if ( typeof fContacts == "object" && fContacts.doSelect != undefined ) 
  {
  	var rc = fContacts.doSelect("operator.id=\""+ funcs.operator()+"\"");
    
    // We need to set the variable. Returning of the variable to the RAD function 
    // does not work properly
  	if ( fContacts != null )
  	{
  	  vars.$lo_contact_name=fContacts.contact_name;
  	}  	
  	  //DO NOT RETURN   
  	  //return fContacts.contact_name;
  }
}