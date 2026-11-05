var _str = system.functions.str;
var _denull = system.functions.denull;

/**
 *
 * @param {SCFile} fOp - the operator record
 */
function getUserCapability( fOp )
{
  var capWords = system.functions.denull(fOp.cap_exec);

  return capWords;
}

function getInboxNamebyId( inbox_id )
{
  var inboxName = "";
  var f = new SCFile("inbox");
  var rc = f.doSelect("SELECT inbox.name FROM inbox WHERE inbox.id=" + inbox_id );
  if (rc == RC_SUCCESS)
  {
    inboxName = f.inbox_name;
  }

  return inboxName;
}

/**
 * Get the filter query base on operator's assignment groups, groups, roles
 * @param {String}     opName : operator name
 *
 * @returns {string}   The query to be appended at the original query
 */
function getFilterQuery( opName, bIncludeDisabled )
{
  //print("getFilterQuery for operator: " + opName)
  var query = "";

  var f = new SCFile("operator");
  var rc = f.doSelect('name="' + opName + '"');

  if ( rc == RC_SUCCESS )
  {
    capWords = getUserCapability(f);

    query = (bIncludeDisabled) ? '' : ' AND ( null(report.disabled) or report.disabled=false ) ';

    if ( system.functions.index("SysAdmin", capWords) <= 0  && lib.security.getRights("Report","admin")!="true")
    {
      var _denull = system.functions.denull;
      var _str = system.functions.str;
      var _nullsub = system.functions.nullsub;

      var assignments = f.assignment_groups;
      var groups = f.groups;
      groups.push(opName);
      var role = f.user_role;

      query += ' and (inbox.manager ="' + opName + '" or operator.name= "' + opName + '" or audience.type = "everyone" or ';
      query += ' (audience.type = "assignmentgroups" and assignment.groups isin ' + _str(_denull(assignments)) + ') or ';
      query += ' (audience.type = "groups" and groups isin ' + _str(_denull(groups)) + ') or ';
      query += ' (audience.type = "role" and role ="' + role + '" ) ) ';
    }

    f.doClose();
  }

  //print("getFilterQuery, filter query: " + query);

  return query;
}

/**
 * Pass a report/dashboard id list, filter out all the report/dashboard which are not accessible for operator opName
 * @param {SM Array}  report_list - list of report/dashboard id
 * @param {String} opName - Operator name
 *
 * @return the report/dashboard list ( in SCDatum-type-8 ) which are accessible by operator opName
 */
function filterReport(report_list, opName)
{
  var dtRet = new SCDatum();
  dtRet.setType(8);

  var q = 'SELECT inbox.id FROM inbox WHERE ( inbox.id isin ' + _str(_denull(report_list)) + ') ';
  q += getFilterQuery(opName);

  var f = new SCFile('inbox');
  var rc = f.doSelect(q);

  while ( rc == RC_SUCCESS )
  {
    dtRet.push(f.inbox_id);
    rc = f.getNext();
  }

  return dtRet;
}

/**
 * Pass a report/dashboard id list, return all the report/dashboard which are not accessible for operator opName
 * @param {SM Array}  report_list - list of report/dashboard id
 * @param {String} opName - Operator name
 * @param {SCDATUM-ARRAY} dtRet - returned array
 *
 * @return the report/dashboard name list ( in SCDatum-type-8 ) which are NOT accessible by operator opName
 */
function getUnauthorizedReports(report_list, opName, dtRet )
{
  var q = 'SELECT inbox.id FROM inbox WHERE ( inbox.id isin ' + _str(_denull(report_list)) + ') ';
  var qFilter = getFilterQuery(opName);
  if ( qFilter && qFilter.length > 0 )
  {
    q += qFilter;
  }

  // inbox id list which is accessible to current operator
  var dtAuth = new SCDatum();
  dtAuth.setType(8);

  var f = new SCFile('inbox');
  var rc = f.doSelect(q);

  while ( rc == RC_SUCCESS )
  {
    dtAuth.push(f.inbox_id);
    rc = f.getNext();
  }

  delete f;

  getUnAuthInboxNames( report_list, dtAuth, dtRet );
}

/**
 * Remove all the null items from specified report/dashboard id list
 * @param {SCDATUM-ARRAY} report_list
 *
 * @return the report/dashboard name list ( in SCDatum-type-8 )
 */
function denullReports(report_list)
{
  var dtRet = new SCDatum();
  dtRet.setType(8);

  for ( var i = 0; i < report_list.getSize(); i++)
  {
    var item = report_list[i];
    if ( item )
      dtRet.push( item );
  }

  return dtRet;
}

function getUnAuthInboxNames( dtAllIDs, dtAuthIDs, dtRet )
{
  var q = 'SELECT inbox.name FROM inbox WHERE ( inbox.id isin ' + _str(_denull(dtAllIDs)) + ') AND ( not (inbox.id isin ' + _str(_denull(dtAuthIDs)) + '))';

  var f = new SCFile('inbox');
  var rc = f.doSelect(q);

  while ( rc == RC_SUCCESS )
  {
    dtRet.push(f.inbox_name);
    rc = f.getNext();
  }

  delete f;
}

/**
 * Get Inbox names from inbox id list
 * @param (SM-DATUM-ARRAY) dtInboxIds
 *
 * @return JS string
 */
function getInboxNames( dtInboxIds )
{
  var ret = "";

  if ( dtInboxIds && dtInboxIds.getSize() > 0 )
  {
    var q = 'SELECT inbox.name FROM inbox WHERE ( inbox.id isin ' + _str(_denull(dtInboxIds)) + ' ) ORDER BY inbox.name asc';

    var f = new SCFile('inbox');
    var rc = f.doSelect(q);

    while ( rc == RC_SUCCESS )
    {
      ret += f.inbox_name + "\r\n";
      rc = f.getNext();
    }

    delete f;
  }

  return ret;
}

/**
 * Same as getInboxNames exception use HTML <BR> tag to break the line
 * @param dtInboxIds
 * @returns {string}
 */
function getInboxNamesBR( dtInboxIds )
{
  var ret = "";

  if ( dtInboxIds && dtInboxIds.getSize() > 0 )
  {
    var q = 'SELECT inbox.name FROM inbox WHERE ( inbox.id isin ' + _str(_denull(dtInboxIds)) + ' ) ORDER BY inbox.name asc';

    var f = new SCFile('inbox');
    var rc = f.doSelect(q);

    while ( rc == RC_SUCCESS )
    {
      ret += f.inbox_name + "<br>";
      rc = f.getNext();
    }

    delete f;
  }

  return ret;
}

/**
 *
 * @param (DATUM-ARRAY) opNames
 */
function getInvalidOperators( opNames, dtRet )
{
  var q = 'SELECT name FROM operator WHERE name isin ' + _str(_denull(opNames));
  var f = new SCFile('operator');
  var rc = f.doSelect(q);

  var dtAuth = new SCDatum();
  dtAuth.setType(8);

  while ( rc == RC_SUCCESS )
  {
    dtAuth.push(f.name);
    rc = f.getNext();
  }

  var lenAll = opNames.getSize();
  var lenAuth = dtAuth.getSize();

  if ( lenAuth < lenAll )
  {
    for ( var i = 0; i < lenAll; i++ )
    {
      var item = opNames[i];
      if ( item )
      {
        var bFound = false;
        for ( var j = 0; j < lenAuth; j++ )
        {
          if ( dtAuth[j] === item )
          {
            bFound = true;
            break;
          }
        }

        if ( !bFound )
        {
          dtRet.push(item);
        }
      }

    }
  }
}

function getInvalidAssignGrps( grpNames, dtRet )
{
  var q = 'SELECT name FROM assignment WHERE name isin ' + _str(_denull(grpNames));
  var f = new SCFile('assignment');
  var rc = f.doSelect(q);

  var dtAuth = new SCDatum();
  dtAuth.setType(8);

  while ( rc == RC_SUCCESS )
  {
    dtAuth.push(f.name);
    rc = f.getNext();
  }

  var lenAll = grpNames.getSize();
  var lenAuth = dtAuth.getSize();

  if ( lenAuth < lenAll )
  {
    for ( var i = 0; i < lenAll; i++ )
    {
      var item = grpNames[i];
      if ( item )
      {
        var bFound = false;
        for ( var j = 0; j < lenAuth; j++ )
        {
          if ( dtAuth[j] === item )
          {
            bFound = true;
            break;
          }
        }

        if ( !bFound )
        {
          dtRet.push(item);
        }
      }
    }
  }
}