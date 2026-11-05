/*
 * reassign incident to its assingment group's stage 2 or stage 3 assignment group if applicable.
 *
 * @param incident the Incident record
 */
function stageReassignment(incident) {
    if (incident.status == "alert stage 2" || incident.status == "alert stage 3") {
        var assignment = new SCFile("assignment");
        assignment.doSelect("name=\"" + incident.assignment + "\"")
        if (assignment.reassign) {
            if (incident.status == "alert stage 2" && assignment.assignment2) {
                incident.assignment = assignment.assignment2;
            } else if (incident.status == "alert stage 3" && assignment.assignment3) {
                incident.assignment = assignment.assignment3;
            }
        }
    }

}

/*
 * reassign incident to its deadline assignment group if applicable.
 *
 * @param incident the Incident record
 * @param deadlineGroup the deadline assingment group name
 */
function deadlineReassignment(incident, deadlineGroup) {

    if (deadlineGroup && deadlineGroup != "") {
        var assignment = new SCFile("assignment");
        assignment.doSelect("name=\"" + incident.assignment + "\"")
        if (assignment.reassign) {
            incident.assignment = deadlineGroup;
        }
    }
}