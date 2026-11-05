/**
 * This is one example for external lookup to get the interaction records according to contact name.  
 *
 * The context variable object has the following attributes:
 *   start: starting from
 *   pageSize: size per page
 *   searchText:  what is used for searching
 *   paramList: values array for parameter list which is defined in options for catalog items
 *
 * Return object has the following attributes:
 *   total: total account of all records. 
 *   fields: field list. If one field should be used for displaying, mark the attrbute "display" to true.
*    data:  data array containing values
*/
var $ = lib.c.$;
function run(context){
    var start =context.start || 1;
    var operator =context.paramList[0];  // input operator name. i.e. $lo.contact.name
    var search=context.searchText;
    var pageSize = context.pageSize || 10;

    var sql = '(callback.contact="' + operator + '" or contact.name="' +  operator + '")';
    if (search) {
        sql = sql +' and (title#"' + search + '" or incident.id#"' + search +'")';
    }

    var returnFile = $("incidents", SCFILE_READONLY).select(sql);

    var f = returnFile.scfile;
    var total = lib.GatewayAPI_RAD.fastCount(f);
    var rc = returnFile.rc;
    var index = 0;
    var result  = [];
    while (rc == RC_SUCCESS && index++ < start - 1) {
        rc = f.getNext();
    }
    index  = 0;
    while (rc == RC_SUCCESS && index++ < pageSize) {
      result.push({
        "id":f["incident.id"],
        "value":"[" + f["incident.id"]  + "] " + f["title"],
        "status":f.open
      }); 
    rc = f.getNext();
    }

    return ({
        fields: [{name: 'id', label: 'Incident ID'}, {name: 'value', label: 'Title', display: true},{name: 'status', label: 'Status'}],
        total: total,
        start: start,
        data: result
    });
}