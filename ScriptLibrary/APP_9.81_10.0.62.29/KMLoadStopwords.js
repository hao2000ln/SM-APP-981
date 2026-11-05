function KMLoadStopwords()
{
}

function loadStopwords()
{
   // if ( (!(system.functions.lioption("Knowledge Management")==true )))
   //    {
   //       return; // KM not purchased, no need to load the stopwords!
   //    }

 

    var defStopwords = new Datum();
	defStopwords.setType(8);
	var sclibFile = new SCFile("kmstopword");
    var scFind = sclibFile.doSelect("langcode = \""+system.library.KMUtils.getKMlangcode(vars.$G_my_language)+"\"");
    if( scFind == RC_SUCCESS )
	{
		 scFind = sclibFile.getFirst();
		 vars.$G_defStopwords = sclibFile.stopwords;
	}
	else
		vars.$G_defStopwords = defStopwords;
}