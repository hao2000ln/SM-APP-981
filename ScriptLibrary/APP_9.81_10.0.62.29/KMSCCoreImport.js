/*   Created on 19th Sept 2006
     by Gabe Nicklas
     
     This script library file holds the code for importing data from the core table in 
     ServiceCenter that supports the IRExpert functionality retrospectively. This 
     import code is only designed for a one time transfer of all files from the core
     table into the KM application.  Running this code multiple times will cause
     duplicate data to be imported into the KM application.
     
     The scripts found here can, and will, need to be edited to take into account any
     user customizations of either their core table or the data contained therein.
     These areas where changes are allowed/expected will be clearly marked as will 
     those sections of the code that should not be changed.  Please be mindful of these
     notices when working within this file.
     
     To use this import script, simply make sure the parameter and the desired code are
     set right and then hit the execute button.  You will be notified when the process
     is complete by a message in the messages window.
*/


/*
  main function for import of core table into knowledge management application
  param coreoob - boolean value that determines whether the core table 
  				   and/or import code has been customized
*/


function importCoreToKMNow(coreoob)
{
	//the default assumption will be that the core table has NOT been modified
	//lets check here for this value
	if (coreoob)
	{
		//generally there should be no reason for users to change this code
		//first we need to query for all of the core records
		
		var corerecs = new SCFile("core");
        var rc = corerecs.doSelect(true);
        if (getLastRC() == RC_SUCCESS)
        {
  	        rc = corerecs.getFirst();
            while (getLastRC() == RC_SUCCESS)
            {
                var newKMDoc = new SCFile("kmdocument");                
                //we are going to default to the howto doctype
                //since its fields most closely match the oob
                //fields of the core table pulled from the probcause table
                newKMDoc.doctype = "howto";
                
                newKMDoc.author = corerecs.created_by;
                newKMDoc.creation_date = corerecs.created_on;
                
                //in the default core table there is a field called error.message
                //this field is another choice for the title
                //however it doesn't appear to be used by default
                //so we just use the core title field here...
                newKMDoc.title = corerecs.title;
                //...however if you want to import the error.message field
                //as the title field instead, comment out the line above and
                //remove the comment lines in front of the follwoing line
                //newKMDoc.title = corerecs.error_message;
                
                //in KM the title is also a link in the hitlist so it can't be blank
                //if it is blank, give it a title placeholder (this will be very rare)
                if (newKMDoc.title == "" || newKMDoc.title == null)
                {
                	newKMDoc.title = "Unknown Title";
                }                
                
                //need to make the legacyid into a string but in core it is a number
                //so we have to change it here
                newKMDoc.legacyid = system.functions.val(corerecs.entry_id,2);
                newKMDoc.status = "internal";
                newKMDoc.summary = "document imported from core table";
                
                //in the default setup, the category and subcat fields of the core table
                //appear not to be used so we will just shove all core records into
                //a single category within KM - Service Manager/KM/CoreImport
                var newcat = system.library.KMCategory.getCategoryIdString("Service Manager/Knowledge Management/CoreImport", true);
                newKMDoc.categories[0] = newcat;
                newKMDoc.generatedcats[0] = "Service Manager/Knowledge Management/CoreImport";
                //if however, the cat and subcat fields are used and the user
                //would like to use them for categorization, then comment out the three
                //lines above and remove the commenting before the next lines
                //var newcat = system.library.KMCategory.getCategoryIdString(corerecs.category+"/"+corerecs.subcategory, true);
                //newKMDoc.categories[0] = newcat;
                //newKMDoc.generatedcats[0] = corerecs.category+"/"+corerecs.subcategory;
                
                //in the core table, the description and resolution fields are arrays of strings
                //so we have to cycle through them and put them together to get
                //our question and answer fields' values respectively
                
                var descarray = corerecs.description;
                for (var lupes=0; lupes < descarray.length();lupes++)
                {
                	if (descarray[lupes] != "" && descarray[lupes] != null)
                	{
                    	if (lupes > 1)
                		{
                			newKMDoc.question = newKMDoc.question + " " + descarray[lupes];
                		}
                		else
                		{
                			newKMDoc.question = descarray[lupes];
                		}
                    }
                }
                
                var resarray = corerecs.resolution;
                for (var lupez=0; lupez < resarray.length();lupez++)
                {
                	if (resarray[lupez] != "" && resarray[lupez] != null)
                	{
                		if (lupez > 1)
                		{
	                    	newKMDoc.answer = newKMDoc.answer + " " + resarray[lupez];
	                    }
	                    else
	                    {
	                    	newKMDoc.answer = resarray[lupez];
	                    }
	                }
                }  
                
                //if we have made it this far then we need to get a number for
                //the id of the record
			    var callRtn = new SCDatum;
			    var nextNumber = new SCDatum;
			    system.functions.rtecall("getnumber", callRtn, nextNumber, "kmdocument");

		    	var strID = nextNumber.getText();
                newKMDoc.id = strID;
                newKMDoc.doInsert();
                
                rc = corerecs.getNext();
            }
            
        }
		// The import from the core table is complete.
		print(system.functions.scmsg(165, "km"));
		
	}
	else
	{
		//###This is one area where customizations of this script may be necessary
		//due to customizations made in the core table

	
	//***********DO NOT CHANGE CODE IN FOLLOWING SECTION**********************************************
	
		//by default, most of the code below is identical to the default core table code
		//users should show exceeding care in changing or adding/subtracting any of this code
		var corerecs = new SCFile("core");
        var rc = corerecs.doSelect(true);
        if (getLastRC() == RC_SUCCESS)
        {
  	        rc = corerecs.getFirst();
            while (getLastRC() == RC_SUCCESS)
            {
                var newKMDoc = new SCFile("kmdocument");
                
                
	//***********DO NOT CHANGE CODE ABOVE THIS LINE*****************************************************
	                                
    //the code between the question marks is similar to the code used for 
    //an out-of-the-box core table import - this code can be changed, removed 
    //or commented out as suits the user...the section following the question
    //mark delimited code is set aside for additions/customizations the user
    //might like to add to the import fro mthe core table
    
    //??????????????????????????????????????????????????????????????????????????????????????????????????
                
                //we are going to default to the howto doctype
                //since its fields most closely match the oob
                //fields of the core table pulled from the probcause table
                newKMDoc.doctype = "howto";
                
                newKMDoc.author = corerecs.created_by;
                newKMDoc.creation_date = corerecs.created_on;
                
                //in the default core table there is a field called error.message
                //this field is another choice for the title
                //however it doesn't appear to be used by default
                //so we just use the core title field here...
                newKMDoc.title = corerecs.title;
                //...however if you want to import the error.message field
                //as the title field instead, comment out the line above and
                //remove the comment lines in front of the follwoing line
                //newKMDoc.title = corerecs.error_message;

                //in KM the title is also a link in the hitlist so it can't be blank
                //if it is blank, give it a title placeholder (this will be very rare)
                if (newKMDoc.title == "" || newKMDoc.title == null)
                {
                	newKMDoc.title = "Unknown Title";
                }                

                //need to make the legacyid into a string but in core it is a number
                //so we have to change it here
                newKMDoc.legacyid = system.functions.val(corerecs.entry_id,2);
                newKMDoc.status = "internal";
                newKMDoc.summary = "document imported from core table";
                
                //in the default setup, the category and subcat fields of the core table
                //appear not to be used so we will just shove all core records into
                //a single category within KM - Service Manager/KM/CoreImport
                var newcat = system.library.KMCategory.getCategoryIdString("Service Manager/Knowledge Management/CoreImport", true);
                newKMDoc.categories[0] = newcat;
                newKMDoc.generatedcats[0] = "Service Manager/Knowledge Management/CoreImport";
                //if however, the cat and subcat fields are used and the user
                //would like to use them for categorization, then comment out the three
                //lines above and remove the commenting before the next lines
                //var newcat = system.library.KMCategory.getCategoryIdString(corerecs.category+"/"+corerecs.subcategory, true);
                //newKMDoc.categories[0] = newcat;
                //newKMDoc.generatedcats[0] = corerecs.category+"/"+corerecs.subcategory;
                
                //in the core table, the description and resolution fields are arrays of strings
                //so we have to cycle through them and put them together to get
                //our question and answer fields' values respectively
                
                var descarray = corerecs.description;
                for (var lupes=0; lupes < descarray.length();lupes++)
                {
                	if (descarray[lupes] != "" && descarray[lupes] != null)
                	{
                    	if (lupes > 1)
                		{
                			newKMDoc.question = newKMDoc.question + " " + descarray[lupes];
                		}
                		else
                		{
                			newKMDoc.question = descarray[lupes];
                		}
                    }
                }
                
                var resarray = corerecs.resolution;
                for (var lupez=0; lupez < resarray.length();lupez++)
                {
                	if (resarray[lupez] != "" && resarray[lupez] != null)
                	{
                		if (lupez > 1)
                		{
	                    	newKMDoc.answer = newKMDoc.answer + " " + resarray[lupez];
	                    }
	                    else
	                    {
	                    	newKMDoc.answer = resarray[lupez];
	                    }
	                }
                }  
                
    
    //this is the section of the customized code where additional code should be added
    //if the user so desires...the following are a few example lines of code
    //NOTE: if a fieldname has a dot delimiter such as in entry.id, in javascript
    //it has to be changed to an underscore as in entry_id...you can see another example
    //of this in the example code below 
    //newKMDoc.reference = corerecs.description + " " + corerecs.mycustom_field;
    //newKMDoc.doctype = corerecs.mycustomdoctype;
    
    			
    //if the customizations to the core table include fields that do not directly 
    //translate to any fields in the default kmdocument table, and yet the user still
    //wants to maintain that data, they should follow the instructions in the user guide
    //for how to add a new field to the kmdocument table (WARNING: this is a very serious
    //and involved task so be sure you know what you are doing before taking this step - it
    //is advised that only admin users perform any sort of changes like this).  Once the new
    //field has been added to the kmdocument table, you can use lines like the following example:
    //newKMDoc.mynewcustomfield = corerecs.myothercustomizedfield;
    			
    //PLEASE NOTE however the caveat that adding new customized fields to the kmdocument
    //table impacts many different aspects of the program that MUST be considered such as the
    //searching and document type/document view structure(s) that represent the raw data in
    //end user form...as well as the forms used to edit the documents once they have been 
    //imported...all of these areas must also be considered before making any changes...
    
    
    
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@            

	//**********DO NOT CHANGE ANYTHING BELOW HERE************************************************************

                //if we have made it this far then we need to get a number for
                //the id of the record
			    var callRtn = new SCDatum;
			    var nextNumber = new SCDatum;
			    system.functions.rtecall("getnumber", callRtn, nextNumber, "kmdocument");

		    	var strID = nextNumber.getText();
                newKMDoc.id = strID;
                newKMDoc.doInsert();
                
                rc = corerecs.getNext();
            }
        }
		// The import from the core table is complete.
		print(system.functions.scmsg(165, "km"));
    }
}


//this line of code is here to run when the user clicks the execute button 
//while viewing the script library...if the user sets up some form of interface
//such as a button somewhere that will run this script function, this line will
//be meaningless and should likely be commented out


