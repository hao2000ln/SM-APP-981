/**
 * @fileOverview  Proivde the functions to Merge Data from cm3groups, ocmgroups to assignment
 * @author Mi Quan
 * @date Dec. 2014/4/2
 */

 
/**
 * @public
 * @description  Merge Data for cm3groups  
 * 
 */
function DataMigration4cm3groups(){
 
	var cm3groups= new SCFile("cm3groups");
	var query="name<>\"Service Desk\"";
	var rc = cm3groups.doSelect(query);
	var assign = null;
	var assign_old = null;
	var company = null;
	var length =0 ;
  	var combinedApprover = new Array();
  	var cm3groupsApprover = new Array();
  	var combinedOperator = new Array();
  	var cm3groupsOperator = new Array();
  	
   	while ( rc == RC_SUCCESS )	{  
  	
 		print("Migrate "+cm3groups.name+ " in cm3groups."  );
 		 		
 		assign = getExistedAssignment(cm3groups.name);
 	 
 	 	if (cm3groups.company!=null) {
			length = system.functions.lng(cm3groups.company);
			if (length>0) {
			company = cm3groups.company[0];
			} 
		} 		
 	  	 
 		if (assign == null) { 	 
			assign  =  insertToAssignment(cm3groups.name,
											cm3groups.duty_table,
											cm3groups.time_zone,
											cm3groups.members,
											cm3groups.approvers,
											cm3groups.manager,
											company);
			 
		} else {
		
			//combine approver			
			if (assign.approvers!=null) {				
				combinedApprover= assign.approvers.toArray();				 
			}
			
			if (combinedApprover==null || combinedApprover.length==0) {
			
				combinedApprover = new Array();
			}
 			if (cm3groups.approvers != null) {
 			
				cm3groupsApprover = cm3groups.approvers.toArray();
			}
			if (cm3groupsApprover==null || cm3groupsApprover.length==0) {
			
				cm3groupsApprover = new Array();
			} 
			
			lib.ArrayUtil.addAllWithoutDuplicate(combinedApprover,cm3groupsApprover);
			
						
			//combine operator
			if (assign.operators!=null) {				
				combinedOperator= assign.operators.toArray();				 
			}
			
			if (combinedOperator==null || combinedOperator.length==0) {
			
				combinedOperator = new Array();
			}
 			if (cm3groups.members != null) {
 			
				cm3groupsOperator = cm3groups.members.toArray();
			}
			if (cm3groupsOperator==null || cm3groupsOperator.length==0) {
			
				cm3groupsOperator = new Array();
			} 
			
			lib.ArrayUtil.addAllWithoutDuplicate(combinedOperator,cm3groupsOperator);
			
			
			assign_old =new SCFile("assignment");  			
 			system.functions.copycurrent(assign_old,assign);	
 							
			assign = updateToAssignment(assign, combinedOperator,combinedApprover); 
			assign_old.approvers = new Array();
 			assign_old.operators = new Array();
			 				
 		}
 		
		lib.MyGroupsSync.syncToMyGroupsWhenAssignmentChange(assign_old,assign);
		
  		rc = cm3groups.getNext();
	}

}

/**
 * @public
 * @description  Merge Data for ocmgroups  
 * 
 */
function DataMigration4ocmgroups(){
 
	var ocmgroups= new SCFile("ocmgroups");
	var query="name<>\"SERVICE DESK\"";
	var rc = ocmgroups.doSelect(query);
	var assign = null;
	var combinedApprover = new Array();
	var ocmgroupsApprover =new Array();
	var combinedOperator = new Array();
	var ocmgroupsOperator =new Array();
	var assign_old = null;
	
 	while ( rc == RC_SUCCESS )	{  
 		print("Migrate "+ocmgroups.name+ " in ocmgroups."  );
	 		
	 	assign = getExistedAssignment(ocmgroups.name);
 	 	if (assign==null) {
	 		assign = insertToAssignment(ocmgroups.name,
								 			ocmgroups.duty_table,
											ocmgroups.time_zone,
											ocmgroups.members,
											ocmgroups.approvers
											);
		 
		} else {
			//combine approver	 
						
			if (assign.approvers!=null) {				
				combinedApprover= assign.approvers.toArray();				 
			}
			
			if (combinedApprover==null || combinedApprover.length==0) {
			
				combinedApprover = new Array();
			}
 			if (ocmgroups.approvers != null) {
 			
				ocmgroupsApprover = ocmgroups.approvers.toArray();
			}
			if (ocmgroupsApprover==null || ocmgroupsApprover.length==0) {
			
				ocmgroupsApprover = new Array();
			}
									
			lib.ArrayUtil.addAllWithoutDuplicate(combinedApprover,ocmgroupsApprover);
			
			//combine operator
			
			if (assign.operators!=null) {				
				combinedOperator= assign.operators.toArray();				 
			}
			
			if (combinedOperator==null || combinedOperator.length==0) {
			
				combinedOperator = new Array();
			}
 			if (ocmgroups.members != null) {
 			
				ocmgroupsOperator = ocmgroups.members.toArray();
			}
			if (ocmgroupsOperator==null || ocmgroupsOperator.length==0) {
			
				ocmgroupsOperator = new Array();
			}
									
			lib.ArrayUtil.addAllWithoutDuplicate(combinedOperator,ocmgroupsOperator);
			
			assign_old =new SCFile("assignment");  			
			system.functions.copycurrent(assign_old,assign);	
			assign = updateToAssignment(assign,combinedOperator,combinedApprover);  
			assign_old.approvers = new Array();
 			assign_old.operators = new Array();
			
		}
	
		
 		
		lib.MyGroupsSync.syncToMyGroupsWhenAssignmentChange(assign_old,assign);
		
  		rc = ocmgroups.getNext();
	}

}

/**
 * @public
 * @description  Merge Data for legacyAssignment    
 * 
 * 
*/
function DataMigration4legacyAssignment(){

    var assignment = new SCFile("assignment");
    var ret = assignment.doSelect("true");
    while (ret==RC_SUCCESS)
    {
      lib.MyGroupsSync.syncToMyGroupsWhenAssignmentChange(null, assignment);
      ret = assignment.getNext();
    }
}

/**
 * @public
 * @description  get Assignment by Name  
 * @param {String} name - Assignment Name
 * @return {Assignment} assignment - Assignment 
*/
function getExistedAssignment(name){

	var assignment=new SCFile("assignment");
	var rc= assignment.doSelect("name=\""+name+"\""); 	
  	if(rc == RC_SUCCESS ){  	
  		return assignment;
  	}else {
  	
  		return null;
  	}
}

/**
 * @public
 * @description  Create Data in assgignment  
 * @param {String} name - Assignment Name
 * @param {String} calendar - Assignment Calendar
 * @param {String} timezone - Assignment Timezone
 * @param {Array} operators - Assignment Operators
 * @param {Array} approvers - Assignment Approvers
 * @param {String} manager - Assignment Manager
 * @param {String} company - Assignment Company
 * @return {Assignment} assignment - Assignment 
 */
function insertToAssignment(name, calendar, timezone, operators,approvers,manager, company ){


	var assignment=new SCFile("assignment");

	assignment.name = name;
	assignment.calendar_name = calendar;
	assignment.time_zone = timezone;
	assignment.operators = operators;
	assignment.approvers = approvers 
	assignment.wdManagerName = manager;
	assignment.company = company ; 		 
	assignment.coordinator_request = "Request.Coordinator";
	assignment.doSave();
	return assignment;
  		
}

/**
 * @public
 * @description  Update Data in assgignment  
 * @param {assignment} assignment - Assignment
 * @param {Array} operators - Assignment Operators
 * @param {Array} approvers - Assignment Approvers
 * @return {Assignment} assign - Assignment 
 */
function updateToAssignment(assign,operators,approvers){ 
	
 	assign.approvers = approvers ;	
 	assign.coordinator_request = "Request.Coordinator"; 
   	assign.operators = operators; 		 
	assign.doSave();	
	return assign;
  		
}

function DataMigrationForLegacyGroups() {

    DataMigration4legacyAssignment();
    
    DataMigration4cm3groups();

    DataMigration4ocmgroups();
}

