/* 
These utililities are used to handle array with TextArea
@author: xxia
*/


/*
This utility is used to convert value of Text Area into SC Array.
For example,

text=
"We
Are
Multi-Line
Characters"

convertTextAreaValueToArray(text) returns
{"We","Are","Multi-line","Characters"}

text=
"1
2
3"

convertTextAreaValueToArray(text, 1) returns
{1,2,3}
*/
function convertTextAreaValueToArray(text, datatype)
{
	if(datatype == null)
	{
		datatype = 2;
	}
	var retSCArray = new SCDatum();
	if(text == null)
	{
		return retSCArray;
	}
	var textLines = text.split(/\r\n|\r|\n/);
	for(var i = 0; i < textLines.length; i++)
	{
		retSCArray.push(system.functions.val(textLines[i], datatype));
	}
	return retSCArray;
}


/*
This utility is used to convert value of Text Area into the text that desribes the 
array value, so that it can be stored into the text field.
For example,

text="We
Are
Multi-Line
Characters"

convertTextAreaValueToText(text) returns
"{\"We\",\"Are\",\"Multi-line\",\"Characters\"}"

text="1
2
3"

convertTextAreaValueToText(text, 1) returns
"{1,2,3}"
*/
function convertTextAreaValueToText(text, datatype)
{
	return system.functions.str(convertTextAreaValueToArray(text));
}


/*
This utility is used to convert SC Array value into the multi-line text that desribes 
the array value and can show in Text Area.
For example,

scArray={"One","Two","Three",""}

convertArrayToTextAreaValue(scArray) returns
"One
Two
Three
"

scArray={1,2,3}

convertTextAreaValueToText(text, 1) returns
"1
2
3"
*/
function convertArrayToTextAreaValue(scArray)
{
	var retText = "";
	var length = scArray.length();
	for(var i = 0; i < length; i++)
	{
		retText += scArray[i];
		if(i < length - 1)
		{
			retText += "\n";
		}
	}
	return retText;
}


/*
This utility is used to convert the text that describes a SC Array value into 
the multi-line text that show in Text Area
For example,

text="{\"One\",\"Two\",\"Three\"}"

convertTextToTextAreaValue(text) returns
"One
Two
Three"

scArray="{1,2,3}"

convertTextToTextAreaValue(text) returns
"1
2
3"
*/
function convertTextToTextAreaValue(text)
{
	return convertArrayToTextAreaValue(system.functions.val(text, 8));
}
