function KMAdmin_Server()
{
}

function verifyServer(hostname, port, instance)
{
//called from kmknowledgebase.verify_server process record...
  var getenginename = system.library.KMSearchInterface.getEngineName();
  var result = 0;
  
  print("verifying server");
  
  if (getenginename == "IDOL") 
  {
     return result;
  }
  else // not k2, use api method
  {
  	var args = new Datum();
	args.setType(8);
    args.push(hostname);
	args.push(port);
	args.push(instance);
	var pingResponse =system.library.KMSearchInterface.pingEngine(args)
	if(pingResponse == RC_SUCCESS)
	{

		system.library.KMUtils.domessageBox(system.functions.scmsg(67, "km"));
        return 0;
        
	}
	else
	{

		arrayArgs = new SCDatum();
		arrayArgs.setType(8);  //type array
		arrayArgs.push(hostname);
		arrayArgs.push(port);
		arrayArgs.push(instance);
		system.library.KMUtils.domessageBox(system.functions.scmsg(221, "km", arrayArgs));
		return -1;		
		
	}
   	
  }
}

function verifyPath(path)
{
  return 0;


}