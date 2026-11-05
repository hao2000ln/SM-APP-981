/** @fileoverview BSGFunctions DO NOT MODIFY
*   @author Hua Zhang
*/

var $ = lib.c.$;
var _ = lib.Underscore.require();


/** This function gets CIs related to a given CI through the relationship tree. 
*
*	@param {string} ciName    - name of the CI
*	@param {boolean} firstLevelOnly - whether return the directly related CIs (First 
*   Level) or CIs from all level
*   @param {integer} maxLevel - maximun level to search for the relationship tree 
*   
*	@return Array to the RAD app
*   @type Array
*/

var maxMembers=2000;

function getMembers(ciName, firstLevelOnly, maxLevel) {	
	var levelNext = getMemberOneLevel( [ciName] );
	
	if (firstLevelOnly || maxLevel==1) {
		return levelNext;
	}

	var allMembers = levelNext;
	// Do a breadth first search to navigate the entire tree
	maxLevel = maxLevel < 1 ? 10 : maxLevel--;
	for (var count = 0; count < maxLevel; count++) {
		levelNext = getMemberOneLevel(levelNext);
		
		if (levelNext.length == 0)
			break;

		allMembers = allMembers.concat(levelNext);
	}
	allMembers = _.uniq(allMembers);
	return lib.ArrayUtil.removeA(allMembers,ciName);
}	

function getLogicalNameCond( fldName, arrData )
{
	var query = fldName;
	if ( arrData.length == 1 )
	{
		query += '= "' + arrData[0] + '"';
	}
	else
	{
		query += ' isin { ' 
		for (var j = 0; j < arrData.length; j++) {
			if (j != 0)
				query += ',"' + arrData[j] + '"';
			else 
				query += '"' + arrData[j] + '"';
		}

		query += "}";
	}
	return query;
}

/*
	Return all directly related CIs for one CI
*/
function getMemberOneNode(ciName) {	
  return getMemberOneLevel( [ciNames] )
}

/*
	Return all directly related CIs for one level CIs
*/
function getMemberOneLevel(ciNames, allMembers) {	
	var members = [];   

	if (ciNames.length == 0) {
		return members;
	}

	var item = null;	
	var data = new SCFile("cirelationship", SCFILE_READONLY); 

	// split to multiple arrays
	var subCiNames = lib.ArrayUtil.split(ciNames, 1000);

	for (var i = 0; i < subCiNames.length; i++) {
		var query = 'select distinct related.cis from cirelationship where logical.name';
		var subArray = subCiNames[i];
		query += getLogicalNameCond( '', subArray );
		var result = data.doSelect(query);
		while (result == RC_SUCCESS) 
		{
			item = data.related_cis ;
			if ( item != null ) 
	    		members.push(item);

			result = data.getNext();
		}
	}
	data.doClose();
	return members;
}	

/**
 * Filter CI name list by the query
 */
function filterCiList(ciNameList, appendQuery, ciName)
{
	// filter by ciName first, ignore ciName if it is '*' or multiple '***'
	if (ciName != null && ciName != "" && new RegExp("[^*]").test(ciName))
	{
		for (var i = ciNameList.length-1; i>= 0; i--)
		{
			// Case insensitive, since the db setting is unknown, there is no 'ciName' in ciNameList[i], remove ciNameList[i]
			if (ciNameList[i].toUpperCase().indexOf(ciName.toUpperCase()) != 0)
			{
				ciNameList.splice(i,1);
			}
		}
	}
	
	if (appendQuery == null || appendQuery == "" || appendQuery == "true")
	{
		return ciNameList;
	}

	var fFile = new SCFile( "device", SCFILE_READONLY);
	var returnlist = [];

	// split to multiple arrays
	var subCiNames = lib.ArrayUtil.split(ciNameList, 1000);
	for (var i = 0; i < subCiNames.length; i++)
	{
		var query = "select distinct logical.name from device where ";
		var subArray = subCiNames[i];
		var logicalNameCond = getLogicalNameCond( 'logical.name', subArray );
		query += logicalNameCond + " and (" + appendQuery + ")";		
		var rc = fFile.doSelect(query);
		while (rc == RC_SUCCESS)
		{
			returnlist.push(fFile.logical_name);		
			rc = fFile.getNext();
		}
	}
	fFile.doClose();

	return _.uniq(returnlist);
}

function getCiMembers(ciName, firstLevelOnly, maxLevel, ciDisplayName, appendQuery) {
	if (ciName == null || ciName.length == 0 )
		return [];

	//get first level matched members
	var allMembers = getCiMemberOneLevel( [ciName], ciDisplayName, appendQuery);

	//If only retrieve the first level members, need parse CI DisplayName and appendQuery into sql
	if (firstLevelOnly || maxLevel==1 || allMembers.length > maxMembers )
		return _.uniq(allMembers);

	maxLevel = maxLevel < 1 ? 10 : maxLevel;

	//get first level all members prepare for the deeper query
	var levelNext = getCiMemberOneLevel( [ciName], "", "");

	//get matched members from the second level
	for (var count = 2; count <= maxLevel; count++) {
		var avaiMembers = getCiMemberOneLevel(levelNext,ciDisplayName,appendQuery);
		if( avaiMembers != null && avaiMembers.length !== 0){
			allMembers = allMembers.concat(avaiMembers);
			if(allMembers.length > maxMembers)
				break;
		}
		levelNext = getCiMemberOneLevel(levelNext,"","");
		if (levelNext == null || levelNext.length == 0)
			break;
	}
	return _.uniq(allMembers);
}

function getCiMemberOneNode(ciName,ciDisplayName,appendQuery) 
{
	return getCiMemberOneLevel( [ciName], ciDisplayName, appendQuery );
}

function getCiMemberOneLevel(ciNames,ciDisplayName,appendQuery) 
{
	if ( ciNames == null || ciNames.length == 0)
		return [];

	var members = [];
	var data = new SCFile("cirelationship", SCFILE_READONLY); 
	
	// split to multiple arrays
	var subCiNames = lib.ArrayUtil.split(ciNames, 1000);

	for (var i = 0; i < subCiNames.length; i++) 
	{
		var subArray = subCiNames[i];
		var logicalNameCond = getLogicalNameCond( '', subArray )
		var bSingleTab = true;
		var sql  = 'select distinct related.cis from cirelationship where (logical.name' + logicalNameCond + ')';
		var sql2 = 'SELECT distinct ta02.logical.name FROM cirelationship ta01 JOIN device ta02 ON ( ta02.logical.name = ta01.related.cis )  WHERE (ta01.logical.name' + logicalNameCond + ')';	

		if(ciDisplayName!==null && ciDisplayName!=="")
		{
			sql = sql2 + ' and ( ta02.display.name#"' + ciDisplayName + '" )';
			bSingleTab = false;
		}

		if(appendQuery!==null && appendQuery!=="" && appendQuery!==undefined)
		{
			if(bSingleTab) 
		  		sql = sql2;

			sql += ' and ( ta02.' + appendQuery + ')';
		}
		var rc = data.doSelect(sql);
		while (rc == RC_SUCCESS) 
		{
			if ( data[0] != null && data[0] != "" ) // && !lib.ArrayUtil.contains(ciNames, data[0])
				members.push(data[0]);

			if (members.length > maxMembers && ciDisplayName!==null && ciDisplayName!=="")
				break;

			rc = data.getNext();
		}
	}
	data.doClose();

	return members;
}	


/**
 * Get parent CIs
 *
 * @param {String} CI identifier
 * @param {Number} maximum CI relation levels
 * @returns {Array} all parent CIs
 */
function getParentCIs(ciId, maxLevel) {
	return getParentCIsOfMultipleNode([ciId], maxLevel);
}


/**
 * Get parent CIs of multiple child CIs
 *
 * @param {Array} CI identifiers
 * @param {Number} maximum CI relation levels
 * @returns {Array} all parent CIs
 */
function getParentCIsOfMultipleNode(ciIds, maxLevel) {

	if (ciIds == null || ciIds.length == 0) {
		return [];
	}
	
	var query = "select distinct logical.name from cirelationship where related.cis isin {";
	var i;
	for (i = 0; i < ciIds.length; i++) {
		query += '"' + ciIds[i] + '"';
		if (i < ciIds.length - 1) {
			query += ",";
		}
	}
	query += "}";
	
	var parent = [];
	$("cirelationship", SCFILE_READONLY).select(query).iterate(function(relation) {
			parent.push(relation.logical_name);
	});
	
//	print("parent of query " + query + " is " + (parent.length == 0 ? "empty" : parent));
	
	if (parent.length == 0) {
		return parent;
	}

	if (maxLevel > 1) {
		// get higher level parent CIs
		var parentHigh = getParentCIsOfMultipleNode(parent, maxLevel-1);
		parent = _.union(parent, parentHigh);
	}
	
	return parent; 	
}
