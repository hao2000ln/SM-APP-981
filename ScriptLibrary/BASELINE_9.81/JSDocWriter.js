/**
* @fileoverview  Takes Service Manager ScriptLibrary files and writes them to .js files in the local operating system that are then used by JSDoc to create HTML help documents
* @author Pete Budic
*/

var globalText = "";
var hasConstructor = false;

/**
*  This function takes a query and writes out all of the ScriptLibrary records that match
*  that query in a format that is JSDoc compliant.  The .js files are written to the
*  directory that is passed in as the path parameter.
*
*  At this time the Service Manager JavaScript implementation only allows writing a file
*  to the server, so the path must be valid on the server.
*
*  @param {String} path - The path to the directory on the server in which to write the .js files
*  @param {String} sql - The query used to determine which ScriptLibrary records are written as .js files 
*/
function writeAllFunctions( path, sql )
{
	var scriptLib = new SCFile("ScriptLibrary");
	if ( sql == null )
		sql = "true";

	if ( scriptLib.doSelect( sql ) == RC_SUCCESS )
	{
		
		do
		{
			
			var name = scriptLib.name;
			writeFunction( name, path );
		}
		while (scriptLib.getNext() == RC_SUCCESS);
		createMakeFile( path );
	}
}

/**
*  This function takes the name of one ScriptLibrary record and writes it out in a format that 
*  is JSDoc compliant.  The .js file is written to the direcory specified by the path paramenter.
*
*  Currently some substitution is necessary.  \" is replaced with a single quote.
*
*  @param {String} functionName - The name of the ScriptLibrary record to be written as a .js file.
*  @param {String} path - The path to the directory on the server in which to write the .js file.
*/
function writeFunction( functionName, path )
{
	var functionRecord = new SCFile("ScriptLibrary");
	var functionJS = functionName+".js"
	var fileName = path + functionJS;
	var text;
	var sql;
	var protoText;
	
	sql = "name=\"" + functionName + "\"";
	
	if ( functionRecord.doSelect( sql ) == RC_SUCCESS )
    {
    	text = functionRecord.script;
    	protoText = getFunctionNames( text, functionName );
    	if ( hasConstructor == false )
    	{
    		text = protoText + text;
	    	text = createConstructor( functionName ) + text;
    		
    	}
    	text = text.replace( /\\"/g, "$quote$");
    	
    	var rc = writeFile( fileName, "t", text);
    	globalText+=" "+ functionJS;
    	
    	
    }
}

/**
*  This function is used to create a fake constructor for the .js version of the ScriptLibrary record.
*  This is done in order to make the JSDoc output more easily categorized and understood.
*
*  @param {String} functionName - The name of the ScriptLibrary record.
*  @return A text representation of the constructor
*  @type String 
*/
function createConstructor( functionName )
{
	var conText;
	conText = "/**\n* @class "+ functionName+"\n*/ \n function "+functionName+"() \n {  \n}\n";
	
	return conText
}


/**
*  This function takes the function names inside of a ScriptLibrary record and creates 
*  prototype functions for them in the .js file.  This is done in order to make the JSDoc output
*  more easily categorized and understood.
*
*  @param {String} script - The script portion of the ScriptLibrary record.
*  @param {String} libName - The name of the ScriptLibrary record.
*  @return  the text containing prototype functions for all of the functions in the ScriptLibrary record.
*  @type String
*/
function  getFunctionNames( script, libName )
{
	var testScript = "\n"+ script;
	var index = 0;
	var lng = script.length;
	var addText = "";
	var temp;
	var next;
	var pos;
	hasConstructor = false;
	
	do 
	{
		temp = testScript.indexOf( "\nfunction ", index );
		if (temp > -1 )
		{
			 pos = temp + 9;
			 next = testScript.indexOf( "(",pos);
			 var fnName = testScript.slice( pos, next );
			 do
			 {
			 	fnName = fnName.substr(1);
			 }
			 while
			 	( fnName.charAt(0) == " " );
			 
			 if ( libName.toString() == fnName.toString() )
			 {
			 	hasConstructor = true;
			 }
			 addText = addText + createPrototype( libName, fnName );
			 index = pos + 1;
		}
		else
			index = lng;
	}
	while
		( index < lng && index >=0 && index != null) ;
	return addText;
}

/**
*  This function creates a prototype statement that is used to connect the function
*  with the ScriptLibrary record by having the ScriptLibrary record mimic a JS Class.
*
*  @param {String} name - The name of the ScriptLibrary record.
*  @param {String} func - The name of the function to prototype.
*  @return text containing the prototype statement for this function
*  @type String
*/
function createPrototype( name, func )
{
	if ( name != null )
	{
		
		var temp = name + ".prototype." + func + " = " + func +";\n";
		return temp;
	}
	return null;
}

/**
*  This function creates the make.bat file that may be used to call the JSDoc Perl script and create
*  the HTML documentation for the Service Manager ScriptLibrary records.
*
*  @param {String} path - The path in which to create the make.bat file.
*/
function createMakeFile( path )
{
	var fileName = path + "make.bat";
	var text;
	text = "perl ..\\jsdoc.pl --page-footer \"ServiceCenter JavaScript\" --logo servicecenter.gif " +
	       "--project-name \"ServiceCenter JavaScript Library\" --directory ..\\destination\\SCJS --no-sources " + globalText;
	       //"--package-nameing "
	       
    
    var rc = writeFile( fileName, "t", text);
}


