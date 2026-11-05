var contacts = new SCFile("contacts");
var sql = "true";
var rc = contacts.doSelect(sql);
while(rc == RC_SUCCESS)
{
	print("contacts name ="+contacts.contact_name+" ci= "+contacts.logical_name);
	if(contacts.logical_name !=null && system.functions.lng(contacts.logical_name)>0)
	{
		var device =new SCFile("device");
		var query = "logical.name=\""+contacts.logical_name+"\"";
		var rr = device.doSelect(query);
		if (rr==RC_SUCCESS)
		{
			device.contact_name = contacts.contact_name;
			device.doUpdate();
			print("updated device ="+device.logical_name+" for user "+device.contact_name);
		}
	}
	rc = contacts.getNext();	
}