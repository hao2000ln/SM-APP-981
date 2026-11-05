/**
This class allows reading of a CSV formatted file.
*/

/**
Default constructor. Takes in a fully qualified path to the csv file.
@param strPath - String 
*/
function CSVFileReader ( strPath )
{
	this.file = system.library.DiskFileUtility.readTextFile(strPath);
	this.cursor = 0;	
}

/**
Returns the next piece of data in the file. Returns null if the end of file has been reached.
@return string - the next piece of data or null if there is no more data.
*/
CSVFileReader.prototype.getNext=function()
{
	var returnValue;
	var nextComma = this.file.indexOf(",", this.cursor);
	if (nextComma === -1)
	{
		returnValue = null;
	}
	else
	{
		returnValue = this.file.substring(this.cursor, nextComma);
		this.cursor = nextComma + 1;
	}
	
	if (returnValue === "null")
	{
		returnValue = null;
	}
	
	return returnValue;
};

/**
Returns the next piece of data in the file as an int. Returns null if the end of file has been reached.
@return int - the next piece of data or null if there is no more data.
*/
CSVFileReader.prototype.getNextAsInt=function()
{
	var returnValue;
	var nextComma = this.file.indexOf(",", this.cursor);
	if (nextComma === -1)
	{
		returnValue = null;
	}
	else
	{
		returnValue = this.file.substring(this.cursor, nextComma);
		this.cursor = nextComma + 1;
	}
	
	if (returnValue === "null")
	{
		returnValue = null;
	}
	else
	{
		returnValue = parseInt(returnValue);
	}
		
	if (returnValue === NaN)
	{
		returnValue = null;
	}
	
	return returnValue;
};


/**
Returns all the data in the file as a single string.
@return string - file data
*/
CSVFileReader.prototype.getFileDataAsString=function()
{
	var stringData = this.file.substr(0);
	return stringData;
};

/**
Returns all the data in the file as a single integer
@return int file data
*/
CSVFileReader.prototype.getFileDataAsInt=function()
{
	var stringData = this.file.substr(0);
	return parseInt(stringData);
};

/**
Returns all the data in the CSV file in a JavaScript Array. Returns null if the file is empty.
@return Array<String> - the data in an array
*/
CSVFileReader.prototype.getFileDataAsArray=function()
{
	var returnValue = new Array();
	var dataString;
	var localcursor = 0;
	
	var nextComma = this.file.indexOf(",", localcursor);
	while(nextComma != -1)
	{
		returnValue.push(this.file.substring(localcursor, nextComma));
		localcursor = nextComma + 1;
		nextComma = this.file.indexOf(",", localcursor);
	}
	
	//pick up the last element
	returnValue.push(this.file.substr(localcursor));
		
	return returnValue;
};


/**
Resets the cursor to the begining of the file.
*/
CSVFileReader.prototype.resetToFileStart=function()
{
	this.cursor = 0;
};