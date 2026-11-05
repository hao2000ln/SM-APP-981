
_denull  = funcs.denull;
_str     = funcs.str;
_nullsub = funcs.nullsub;
_scmsg   = funcs.scmsg;
_radEval = funcs.evaluate;

function getPermissionSQL4Inbox()
{
  var groups = _denull(vars['$lo.groups']);
  var opName = funcs.operator();

  var sql  = "(null(report.disabled) or report.disabled=false) and " +
      " (inbox.manager=\"" + opName + "\" or " + 
      "  (audience.type=\"everyone\") or " +
      "  (audience.type=\"oneperson\" and operator.name=\"" + opName + "\") or " +
      "  (audience.type=\"groups\" and groups isin "+ _str(_denull(vars['$lo.groups'])) + ") or " +
      (vars['$lo.pm.assignments'] != null ? "  (audience.type=\"assignmentgroups\" and assignment.groups isin " + _str(_denull(vars['$lo.pm.assignments'])) + ") or " : "") +
      "  (audience.type=\"role\" and role=\"" + lib.StringUtil.escapeAllStr(_nullsub(vars['$G.user.role'], "NONE")) + "\")) ";

  return sql;
}

/**
 *
 * @returns No output, will update the local variable $L.files and $L.files.display locally
 */
function fillInboxList()
{
  var inbox_query = " SELECT distinct inbox.type FROM inbox WHERE ";
  inbox_query    += " (inbox.class=\"classList\" OR inbox.class=\"classView\") and " +
      " (inbox.type isin " + _str(getAllObjects()) + ") and (" + getPermissionSQL4Inbox() + ") ";

  if (_nullsub(vars['$G.client.type'], "")=="mobile")
  {
    inbox_query += " and is.mobile.used=true ";
  }
  inbox_query += " ORDER BY inbox.type ASC";

  var f = new SCFile('inbox', SCFILE_READONLY);
  var rc = f.doSelect(inbox_query);

  var fileList = vars['$L.files'];
  var displayList = vars['$L.files.display'];

  if ( !fileList )
  {
    fileList = new SCDatum();
    fileList.setType(8);
  }

  if ( !displayList )
  {
    displayList = new SCDatum();
    displayList.setType(8);
  }

  while ( rc == RC_SUCCESS )
  {
    var fname = f.inbox_type;
    fileList.push(fname);
    //QCRQ1E99738: Change Problem queue name from Problem to Problem/Known Error, start with PM PD enabled. 
    if(vars.$G_pd_pm_enabled == true && fname == "rootcause")
    {
      fname = "rootcause_pd_queue";
    }
    displayList.push( _str(_nullsub(_scmsg(fname, "tablename"), fname)) );

    //print("fillInboxList: " + f.getText());
    rc = f.getNext();
  }

  vars['$L.files'] = fileList;
  vars['$L.files.display'] = displayList;

  return 0;
}


function getAllObjects() {

  	var fObj = new SCFile("Object", SCFILE_READONLY);
  	fObj.setFields(["file.name","scm.condition"]);
	var query = "not null(sc.manage.screen)";
  	var rc = fObj.doSelect(query);

  	var objs = new SCDatum();
  	objs.setType(8);

  	while (rc == RC_SUCCESS) {
  	
		var cond = _nullsub(fObj.scm_condition, "true");
		var rcEval = _radEval(cond);

		if (rcEval) {
  			objs.push(fObj.file_name);
		}

    	rc = fObj.getNext();
  	}

  	return objs;
}