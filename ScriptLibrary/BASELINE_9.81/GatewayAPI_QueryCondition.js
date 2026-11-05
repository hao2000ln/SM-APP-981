/*This function is to config query condition for "Requested For" field,which is used by service portal.
The query  string can be  RAD expression: 
    var querycondition="company=company in $lo.operator";
or it can be a hardcode string:
    var querycondition="company=\"advantage\"";
By default, the query condition is set to "true"
 */

function getQueryCondition() {
    var querycondition="true";
    if (querycondition==null){
        return "true";
    } else {
        return querycondition;
    }    
}