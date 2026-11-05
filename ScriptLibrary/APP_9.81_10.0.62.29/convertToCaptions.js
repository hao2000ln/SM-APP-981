/************************************************
	@fileoverview convertToCaptions
	@author: 	Joe Holloway
		
	This script creates function to convert  
	and array field names to the field captions
	
	

	@Date: 		12/17/06
	
*************************************************/

/**
	This function checks to see if the fields we
	are monitoring for changes have indeed changed.
	
	@param {Array} fieldlist - list of field names
	@param {String} datadictname - name of datadict to
	use to get captions from.	
	@return {Array}  -  list of captions. 
**/



function getFieldCaptions(fieldlist, datadictname)

{

 	var returnCaptions = new Datum();
    returnCaptions.setType(8); 
 
    var flarrayLength = 0;                        

  		if ( fieldlist != null )
      	{
      		flarrayLength = fieldlist.length();                                                    
           

      		for (var m = 0; m < flarrayLength; m++)
      			{
            		var theField=fieldlist[m];

            		if ( theField != null && theField != "")
            		{

                        returnCaptions.push( system.functions.get_field_caption(theField, datadictname) );                        

            		}     // end if
                                                                  
      			}	      // end For loop         
 
		
     
     	}	 			// end if
 	return returnCaptions;
}




/**

var fieldarray = new Datum();
fieldarray.setType(8); 
//fieldarray[0]="number";

fieldarray.push("severity");

fieldarray.push("priority.code");



print("This the field array :"+ fieldarray);

getFieldCaptions(fieldarray, "probsummary");



**/









