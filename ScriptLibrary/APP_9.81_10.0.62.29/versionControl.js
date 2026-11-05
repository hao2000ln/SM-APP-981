/** @fileoverview versionControl DO NOT MODIFY
*   @author Hua Zhang
*/

/**
*   @class versionControl
*   @constructor
*/

/** This function checks and validates the version string for baseline 
*   group. Based on the administrative settings for each version level,
*   it ensures version string is in accordance with the rules set by 
*   administrator
*
*	@param {String} oldVersion    - previous version
*	@param {String} newVersion - new version
*   @param {Array} maxIncrement - maximun increment allowed for each 
*   version level 
*	@return integer to the RAD app
*   @type integer
*/
function checkVersionString( oldVersion,newVersion, maxIncrement )
{	
	//convert SC object to javascript array
	var maxIncreInt=0;
	var maxObj=new SCDatum(maxIncrement);
	var maxArray=maxObj.toArray();	

	var alist=newVersion.split(".");	
	//first, make sure no more than 5 levels
	if(alist.length>5 || alist.length>maxArray.length)
	  return -1;
	
	//make sure each levels are with 0 to 9  
	var newVersionInt=0;	
	for(var count=0; count<alist.length;++count)
	{
	  if(alist[count].length!=1)
	    return -2; 	
	  if(isNaN(parseInt(alist[count])))
	    return -2;	
	  if(parseInt(alist[count])>9 || parseInt(alist[count])<0)
	   return -2; 
	  else  //convert old version and new version to integer for comparision
	  	newVersionInt=newVersionInt + alist[count]*powerof((5-count));	  
	}  	
	
	//convert old version to integer for comparision
	var blist=oldVersion.split(".");
	var oldVersionInt=0;
	if(blist.length!=alist.length)
	  return -3;	
	for(var count=0; count<blist.length;++count)
	{
	  if(parseInt(blist[count])>9 || parseInt(blist[count])<0)		
	   return -2; 
	  else  //convert old version and new version to integer for comparision
	  	oldVersionInt=oldVersionInt + blist[count]*powerof((5-count));  
	}  	
	//convert max increment to integer	
	for(var count=0;count<maxArray.length;++count)
	{
	  maxIncreInt=maxIncreInt + maxArray[count]*powerof((5-count));
	}	
	
	if(newVersionInt-oldVersionInt<=0)
	  return -4;

	if(newVersionInt-oldVersionInt<=maxIncreInt)
	  return 1
	else return 0;  
}	

/** This function checks if there is only 1 option for the next version
*   If this is true, then return the next verison number
*
*	@param {String} oldVersion    - previous version
*   @param {Array} maxIncrement - maximun increment allowed for each 
*   version level 
*	@return String to the RAD app
*   @type String
*/
function checkAllowedOption(oldVersion, maxIncrement)
{
	//convert SC object to javascript array
	var maxIncreInt=0;
	var maxObj=new SCDatum(maxIncrement);
	var maxArray=maxObj.toArray();
	var lastLevelOnly=true;
	for(var count=0;count<maxArray.length-1;++count)
	{
		if(parseInt(maxArray[count])>0	)
		{
			lastLevelOnly=false;
			break;
		}		
	}		
	if(lastLevelOnly && parseInt(maxArray[maxArray.length-1])==1)
	{
	  return getNextVersion(oldVersion,maxArray.length);
	}
	else return "more"  			
}

/** This function validates input values for baseline version initial values
*   and maximum increment, make sure they are number between 0-9
*
*   @param {Array} inputData - input, could be either initial values
*   or  maximum increment
*	@return String to the RAD app
*   @type String
*/
function isInvalidInput(inputData)
{	
	var inputObj=new SCDatum(inputData);
	var inputArray=inputObj.toArray();
	var isInvalid=false;
	for(var count=0; count<inputArray.length;++count)
	{
	  if(isNaN(parseInt(inputArray[count]))) {
	    isInvalid=true;	
	    break;
	  }  
	  if(parseInt(inputArray[count])>9 || parseInt(inputArray[count])<0) {		
	   isInvalid=true;
	   break;
	  } 
	}	
	return isInvalid;   			
}

//private function
function powerof(number)
{
	var total=1;
	for(var count=0;count<number;++count)
	{
	  total=total*10;	
	}	
	return total;
}

//private function
function getNextVersion(oldVersion,levels)
{
	//convert old version to integer for comparision
	var blist=oldVersion.split(".");
	
	var oldVersionInt=0;
	for(var count=0; count<blist.length;++count)
	{
	  //convert old version and new version to integer for comparision
	  oldVersionInt=oldVersionInt + blist[count]*powerof(levels-count-1); 	   
	}  
			
	var newVersionInt= oldVersionInt+1;
	//convert back to string
	var newVersionStr=newVersionInt.toString();
	var newVersionStr2="";
	//add "." 
	var tempArray=new Array();
	for(var count=0;count<levels;++count)
	{
	  	tempArray[count]=newVersionStr.substring(count,count+1)+".";
	  	newVersionStr2=newVersionStr2+tempArray[count];
	}
	
	return newVersionStr2.substring(0,newVersionStr2.length-1);
	
}