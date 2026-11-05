var $ = lib.c.$;

function checkOpenChanges( problemNumber )
{
  /**
    * Returns a boolean value that represents whether or not the specified
    * Problem record has any open related Changes (RFC's).
    * <p>
    *
    * @param  problemNumber  a string representing the ID of the Problem in question
    * @return      Returns true if there are open related changes, otherwise returns false
    */

  var relation = new SCFile("screlation", SCFILE_READONLY);
  relation.setFields(["source"]);

  if ( relation.doSelect("source=\"" + problemNumber + "\" and " +
                      "source.filename=\"knownerror\" and "+
                      "depend.filename=\"cm3r\" and "+
                      "depend.active = true" ) == RC_SUCCESS )
  {
    return true;
  }

  return false;
}

function getNextPhase( phaseName, category, categoryFile )
{
  // Give the current phase and category of the Problem, this function will return the name of the next phase.
  // If there is no next phase, or the current phase is not valid, it will return the current phase name.

  var phaseList = new SCFile(categoryFile, SCFILE_READONLY);
  phaseList.setFields(["phases"]);
  if ( phaseList.doSelect("name=\"" + category + "\"" ) == RC_SUCCESS )
  {
    phaseList.phases= funcs.denull(phaseList.phases);
    var i;
    var length = phaseList.phases.length();
    for (i=0; i<length; i++)
    {
      if (phaseList.phases[i] == phaseName && phaseList.phases[i + 1] != null &&
                                              phaseList.phases[i + 1] != undefined )
      {
        return phaseList.phases[i + 1];
      }
    }
  }

  return phaseName;
}


function getPreviousPhase( phaseName, category, categoryFile )
{
  // Give the current phase and category of the Problem, this function will return the name of the previous phase.
  // If there is no previous phase, or the current phase is not valid, it will return the current phase name.

  var phaseList = new SCFile(categoryFile, SCFILE_READONLY);
  phaseList.setFields(["phases"]);
  if ( phaseList.doSelect("name=\"" + category + "\"" ) == RC_SUCCESS )
  {
    phaseList.phases= funcs.denull(phaseList.phases);
    var i;
    for (i=phaseList.phases.length()-1; i>=0; i--)
    {
      if (phaseList.phases[i] == phaseName && phaseList.phases[i - 1] != null &&
                                              phaseList.phases[i - 1] != undefined )
      {  
        return phaseList.phases[i - 1];
      }
    }
  }

  return phaseName;
}

function getLastPhase( category, categoryFile )
{
 //This function will get the last phase of any given category
 var phaseList = new SCFile(categoryFile, SCFILE_READONLY);
 phaseList.setFields(["phases"]);
 if ( phaseList.doSelect("name=\"" + category + "\"" ) == RC_SUCCESS )
 {
  phaseList.phases= funcs.denull(phaseList.phases);
  var phaseLength=phaseList.phases.length();
  return phaseList.phases[phaseLength-1];
    }
 return null;
}

function getFirstPhase( category, categoryFile  )
{
  //This function will get the first phase of any given category
  var phaseList = new SCFile( categoryFile, SCFILE_READONLY );
  phaseList.setFields(["phases"]);
  if ( phaseList.doSelect("name=\"" + category + "\"" ) == RC_SUCCESS )
    {
      phaseList.phases= funcs.denull(phaseList.phases);
      return phaseList.phases[0];
    }
      return null;
}

function getParentDueDate( parentID )
{
  //This function gets the expected.resolution.time of the parent problem of task
  var parentProblem = new SCFile( "rootcause", SCFILE_READONLY );
  parentProblem.setFields(["expected.resolution.time"]);
  if ( parentProblem.doSelect("id=\"" + parentID +"\"" ) == RC_SUCCESS )
     {
       return parentProblem.expected_resolution_time;
     }
       return null;
}

function getKnownErrorDueDate( parentID )
{
  //This function gets the expected.resolution.time of the parent known error of task
  var parentError = new SCFile( "knownerror", SCFILE_READONLY );
  parentError.setFields(["expected.resolution.time"]);
  if ( parentError.doSelect("id=\"" + parentID +"\"" ) == RC_SUCCESS )
     {
       return parentError.expected_resolution_time;
     }
       return null;
}

/*
	This function checks to see if there are any open Known Error Tasks open on a
	specified Known Error. The output is either 'false', if there are no (more) open
	tasks, or 'true', if there are still tasks outstanding. The input is the
	 KnownError ID.
	
	This function is called from the rca.close Process.
*/
function checkOpenTasks( ErrorID )
{
	var fket = new SCFile( "knownerrortask", SCFILE_READONLY );
	fket.setFields(["id"]);
	var sql = "parent.error=\"" + ErrorID + "\" and status~=\"Closed\"";
	
	if (fket.doSelect( sql ) == RC_SUCCESS)
	{
		return true;
	}
	else
	{
		return false;
	}
}


/**
 * This function is called by RAD us.save.relation, while determine the message strings.
 * @param  {String} type the type of screlationtype record
 */
function getTypeString(type){

	if(!type) {
        type="pbm";
    }
	if(type===" " || type==="rootcause") {
        type="pbm";
	}
	if(type==="pbm") {
        return funcs.scmsg(50,"rc");
	}
	if(type==="ke") {
        return funcs.scmsg(51,"rc");
    }
}

/**
 * This function is called by RAD AdvFind.setup:setup.advFind, while building the advFind list variables.
 * When it is on PD, replace the table display name with "Problem/Known Error".
 */
function replaceAdvFindName(){

	var i = lib.ArrayUtil.indexOf(vars.$L_advFind_tables,"rootcause");
	if(i != -1) {
        vars.$L_advFind_names[i] = funcs.scmsg("rootcause_pd_queue","tablename");
    }
}


/**
 * synchronize field 'affected.ci.names' of all rootcause records
 */
function synchronizeAllAffectedCiNames() {

    // disable trigger and bypass validation
    var rc = new SCDatum();
    funcs.rtecall("trigger", rc, 0);
    vars.$bypass_failed_validation = true;
    
    // only few records has affected.ci, so use setFields() to query all the records first for performance
    $("rootcause", SCFILE_READONLY).setFields(["id","affected_ci"]).select("true").iterate(function(record) {
        var cis = funcs.denull(record.affected_ci);
        if (cis == null || cis.length() == 0) {
            return false;
        }
       
        var problem = $("rootcause").select('id="' + record.id + '"').uniqueResult();
        print("Update " + problem.id);
        problem.doAction("save");
    });
    
    funcs.rtecall("trigger", rc, 1);
    vars.$bypass_failed_validation = false;
}


/**
 *  This functions build and return problem task attachment HTML tables
 *   
 *  @param {String} problem Id
 *  @returns {string} problem task attachment HTML table
 */
function getTaskAttachmentHTML(problemId) {

    var numbers = [];
    $("rootcausetask", SCFILE_READONLY).setFields(['id']).setOrderBy(['id'], [SCFILE_DSC]).select('parent.problem="' + problemId + '"').iterate(function(task) {
        numbers.push(task.id);
    });

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("rootcausetask", numbers);
    
    return sHtmlReturn;
}


/**
 *  This functions build and return problem attachment HTML tables
 *   
 *  @param {String} problem Id
 *  @returns {string} problem attachment HTML table
 */
function getAttachmentHTML(problemId) {

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("rootcause", [problemId]);
    
    return sHtmlReturn;
}


/**
 *  Return the total attachment number of problem tasks
 *   
 *  @param {String} problem Id
 *  @returns {Number} the total attachment number of task records
 */
function countTaskAttachments(problemId) {
    
    var attach_number = 0;

    $("rootcausetask", SCFILE_READONLY).setFields(['id']).select('parent.problem="' + problemId + '"').iterate(function(task) {
        attach_number += lib.AttachmentUtil.countAttachments(task.id, "rootcausetask");
    });

    return attach_number;
}
