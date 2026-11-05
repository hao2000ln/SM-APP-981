var logger = getLog('RunRestfulGwRoles');
var TABLE_NAME = 'secRole';
var $ = lib.c.$;

function GET(request, response) {
    getRoles(request, response);
}

//getRoles();

function getRoles(request, response) {
    var result = [];
    var secRole = new SCFile(TABLE_NAME, SCFILE_READONLY);
    var orderBySeq = [SCFILE_ASC];
    var fields = ['name'];
    secRole.setOrderBy(fields, orderBySeq);
    secRole.setFields(['name']);
    var sql = "true";
    if (secRole.doSelect(sql) === RC_SUCCESS) {
        do {
            result.push(secRole['name']);
        } while (secRole.getNext() === RC_SUCCESS)
    }
    //print(lib.JSON2.toJSON(result));
    response.send({roles: result});
}

function authorize() {
    var optor = $('operator', SCFILE_READONLY).setFields(["name"]).select('name = \"' + funcs.operator() + '\"  and (cap.exec isin {\"SysAdmin\"})').uniqueResult();
    if (optor) {
        return true;
    }
    return false;
}
