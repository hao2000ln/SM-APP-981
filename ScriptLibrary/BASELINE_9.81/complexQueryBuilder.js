/** @fileoverview complexQueryBuilder DO NOT MODIFY
*   @author Hua Zhang
*/

/**
*   @class complexQueryBuilder
*   @constructor
*/


/**
* converts old query string to select * from * where * format
*/

var parts = [];
var logicals = [];

function buildQuery(table, queryString)
{	
	var query = buildSelectPart(table, queryString);
	query = buildFromPart(query,table, queryString);
	query = buildWherePart(query,table, queryString);
	return query;
}

/** This function builds select part for complex query
*/

function buildSelectPart(table, queryString)
{
	var query = "select file."+table+",*";
	return query;
}

/** This function builds from part for complex query
*/
function buildFromPart(query, table, queryString)
{
	query+=" from "+table;
	return query;

}

/** This function builds where part for complex query
*/
function buildWherePart(query, table, queryString)
{
	parseLogical(queryString);
	query+=" where file."	
	for(var i=0;i<parts.length-1;++i)
	{
		query+=table+"."+parts[i];
		query+=" "+logicals[i]+" ";		
	}	
	query+=" file."+table+"."+parts[i];
	return query;
}

/** This function parses query string based on "and" "or"
* it also removes "("
*/
function parseLogical(queryString)
{	
	parts = [];
	logicals = [];
	
	var hasLogical = false;	
	if(queryString.indexOf(" and ")!=-1 || queryString.indexOf(" or ")!=-1)
		hasLogical = true;			
		
	do {
		print("in loop start, query string is "+queryString);
		var iAnd = queryString.indexOf(" and ");
		var iOr = queryString.indexOf(" or ");
		var currentInt=0;
		
		if(iOr==-1 && iAnd !=-1) 
		{			
			currentInt = iAnd+5;
			logicals.push("and");
			parts.push(queryString.substring(0,iAnd));
		}	
		if(iAnd==-1 && iOr !=-1)
		{			
			currentInt = iOr+4;
			logicals.push("or");
			parts.push(queryString.substring(0,iOr));
		}
		if(iAnd!=-1 && iOr !=-1 && iAnd>iOr)
		{			
			currentInt = iOr+4;
			logicals.push("or");
			parts.push(queryString.substring(0,iOr));
		}
		if(iAnd!=-1 && iOr !=-1 && iAnd<iOr)
		{			
			currentInt = iAnd+5;
			logicals.push("and");
			parts.push(queryString.substring(0,iAnd));
		}
		queryString = queryString.substring(currentInt);
		if(queryString.indexOf("and")!=-1 || queryString.indexOf("or")!=-1)
			hasLogical = true;
		else 
		{
			parts.push(queryString);
			hasLogical = false;	
		}
		
	} while(hasLogical)
	
	//now remove any "()" might be there
	for(var i=0; i<parts.length;++i)
	{
		if(parts[i].indexOf("(") !=-1)
		{
			var start = parts[i].indexOf("(");
			var end = parts[i].indexOf(")");
			parts[i]=parts[i].substring(start+1,end);
		}
	}
	
	//also need to remove white space at the beginning
	for(var i=0; i<parts.length;++i)
	{
		if(parts[i].indexOf(" ")==0)
		{			
			parts[i]=removeWhiteSpace(parts[i]);
		}
	}
	
	
	
}

function removeWhiteSpace(aString)
{
	do
	{
		aString=aString.substring(1);
	}while(aString.indexOf(" ")==0)
	return aString;
}