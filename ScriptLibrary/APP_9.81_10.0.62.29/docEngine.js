/** @fileoverview xmlHelpers
*   @author Pete Budic
*/

/** This function initializes variables for the Document Engine.  Initialization is
*   done here to reduce the size of the se.view.engine code record due to Oracle size limitations.
*/
function initViewEngine()
{
	vars.$L_soap = false;
	vars.$L_lock_on_display = false;
	vars.$L_last_msg = system.functions.scmsg( 3, "us" );
	vars.$L_first_msg = system.functions.scmsg( 2, "us" );
	vars.$L_newcat = false;
	vars.$L_no_auth_msg = system.functions.scmsg( 33, "object" );
	vars.$L_prompt_message = system.functions.scmsg( 10, "object" );
	vars.$L_deleted_msg = system.functions.scmsg( 2, "object" );
	vars.$L_locked = false;
	vars.$L_bg = false;
}

//merge from DocEngineUtils
/*
* This function sync up $L.category and $L.phase record after record is reselected. It is called from view engine
*/

function syncCategoryAndPhase()
{
	//check if we need get category
	if(system.functions.exists("category", vars.$L_file) && vars.$L_object.category_file_name!=null)
	{
		if (system.vars.$L_category.name != system.vars.$L_file.category)
		{
			var catFile = system.vars.$L_object.category_file_name;
			var category =  new SCFile(catFile);
			var sql = "name=\""+system.vars.$L_file.category+"\"";
			var rc = category.doSelect(sql);
			if ( rc == RC_SUCCESS)
				system.vars.$L_category = category;
		}
	}
	
	//check if we need to get phase
	if(system.functions.exists("current.phase", vars.$L_file) && system.vars.$L_object.phase_file_name!=null)
	{
		if (system.vars.$L_phase.name != system.vars.$L_file.current_phase)
		{
			var phaseFile = system.vars.$L_object.phase_file_name;
			var phase =  new SCFile(phaseFile);
			var sql = "name=\""+system.vars.$L_file.current_phase+"\"";
			var rc = phase.doSelect(sql);
			if ( rc == RC_SUCCESS)
				system.vars.$L_phase = phase;
		}
	}
}