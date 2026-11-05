/*
 * Version: 1.01
 * Date:    2010.06
 */

function CreateDemandRequest(CartItem) {

	addTask(CartItem);

}

function addTask(CartItem) {
	var smppmtasks = new SCFile("smppmtasks");
	smppmtasks.id = CartItem.cartItemId;
	smppmtasks.status = 'New';
	var rc = smppmtasks.doInsert();
	if(rc == RC_SUCCESS) {
		//print("Succedded in adding a new smppmtask: " + smppmtasks.id);
	}else {
		print("Failed to add smppmtask: " + smppmtasks.id + ", " + RCtoString( rc ));
	}
}