var logger = getLog('RunRestfulGwlibrarylist');
var IDOLGlobalSearchFieldCaption = lib.IDOLGlobalSearchFieldCaption.require();

function GET(request, response) {
    response.status(200).send({entities: getLibraryList()});
}

function getLibraryList() {
    var STATUS = {
        INDEXING: lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING(),
        FINISHED: lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED(), 
        NOT_STARTED : lib.KMCollection_Status_Constant.INDEXSTATUS_NOTSTARTED()
    };
    var operator = funcs.operator();
    var databases =  [];
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var rc = kmbase.doSelect(new QueryCond('indexstatus', ISIN, [ STATUS.INDEXING, STATUS.FINISHED, STATUS.NOT_STARTED ]));

    while (rc === RC_SUCCESS) {
        var accessScript = lib[kmbase.kbaccessscript];
        if (accessScript && accessScript.checkAccess && accessScript.checkAccess(operator, kmbase)) {
            var namesMapping = {};
            if (kmbase.kbtype === 'sclib') {
                namesMapping = IDOLGlobalSearchFieldCaption.getCaptions(kmbase.sclibtablename);
            }
            // check English scmessage first
            var query = 'syslanguage="en" and class="local:kmknowledgebase" and message.id="' + kmbase.kbname + '"';
            var fmsg = lib.c.$("scmessage", SCFILE_READONLY).select(query).uniqueResult();

            var vDescription;
            if (fmsg != null) {
                vDescription = funcs.scmsg(kmbase.kbname, "local:kmknowledgebase");
            }
            else {
               vDescription = funcs.nullsub(kmbase.kbdescription, kmbase.kbname);
            }
            var kbtype = kmbase.kbtype;
            var item = {
                name: kmbase.kbname,
                text: vDescription,
                type: kbtype
            };
            if (kbtype == 'splib' || kbtype == 'confluencelib') {
                item.securityInfo = !kmbase.no_security;
            }
            databases.push(item);
        }
        rc = kmbase.getNext();
    }
    return databases;
}

function authorize() {
    return true;
}