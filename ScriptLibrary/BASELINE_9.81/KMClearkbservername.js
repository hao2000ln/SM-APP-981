	var collectionFile = new SCFile("kmknowledgebase");
   	var collFind = collectionFile.doSelect("true");
   	if (collFind == RC_SUCCESS)
   	{
		collFind = collectionFile.getFirst();
	  	while (collFind == RC_SUCCESS)
	  	{
			
				collectionFile.searchservername = "";
				collectionFile.doUpdate();
			
			collFind = collectionFile.getNext();
		}
	}