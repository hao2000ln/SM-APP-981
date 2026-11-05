/****************************************************************
*  Functions used to maintain the Relation Manager enablement related functions*
*  Update:
*  Version:0.1
****************************************************************/


/** This method is used to enable the Relation Manager to initial the relation records in SM
*
*/
function enableRelationManager(){
	lib.RelationManager.buildRelations();
}