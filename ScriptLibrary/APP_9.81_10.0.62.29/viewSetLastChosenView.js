//This function retrieves the ViewDefault record for the current operator and updates the default view on a table basis.
//if the operator does not have a ViewDefault record then one is created and the appropriate table/view entry is inserted.

function setLastChosenView( filename, view )
{
	var operator = system.functions.operator();
	var viewDefault = new SCFile("ViewDefault");
	var sql = "name=\""+operator+"\"";
	
	//look for a ViewDefault record for the current operator
	if (viewDefault.doSelect( sql ) == RC_SUCCESS)
	{
		var tableFound = false;
		var index = 0;
		var tableLng = system.functions.lng(system.functions.denull(viewDefault.defaults));

		while (index < tableLng && tableFound == false)
		{
			//find an entry in the table for the current table and reset the view name
			if (viewDefault.defaults[index].tablename == filename)
			{
				tableFound = true;
				if(!viewDefault.defaults[index].userSet) {
					viewDefault.defaults[index].view = view;
					viewDefault.doUpdate();
				}
				break;
			} else {
				index++;
			}
		}
		//
		//if table is not found in the record then add and entry for the table
		if (tableFound == false)
		{
			viewDefault.defaults[index].tablename = null;
			viewDefault.defaults[index].view = null;
			viewDefault.defaults[index].tablename = filename;
			viewDefault.defaults[index].view = view;
			viewDefault.doAction("save");
		}
	}
	//if there is no ViewDefault record for the user then create a new one and create and entry
	else
	{
		viewDefault.name = operator;
		viewDefault.defaults[0].tablename = filename;
		viewDefault.defaults[0].view = view;
		viewDefault.doInsert();
	}
}