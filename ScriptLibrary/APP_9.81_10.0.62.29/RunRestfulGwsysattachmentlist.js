var logger = getLog('RunRestfulGwsysattachmentlist');
var $ = lib.c.$;

function POST(req, res) {
    var gwsysattachment = req.body.gwsysattachment;
    var application = gwsysattachment.application;
    var refEntityId = gwsysattachment.refEntityId;
    var segment = gwsysattachment.segment;
    var type = gwsysattachment.type;
    var aclQuery = gwsysattachment.query;
    var auth = true;
    if (application == 'incidents') {
        if (aclQuery) {
            auth = lib.GatewayAPI_Security.checkInteractionRightsWithSQL(refEntityId, aclQuery);
        } else {
            auth = lib.GatewayAPI_Security.checkInteractionRights(refEntityId);
        }
    } else if (application == 'request') {
        auth = lib.GatewayAPI_Security.checkRequestRights(refEntityId);
    } else if (application == 'cm3r') {
        auth = lib.GatewayAPI_Security.checkChangeRights(refEntityId);
    }
    if (auth) {
        var query = 'application="' + application + '" and topic="' + refEntityId + '"';
        if (segment != null) {
            query += ' and segment=' + segment;
        }
        if (type != null) {
            query += ' and type=' + type;
        }
        var returnFile = $("SYSATTACHMENTS", SCFILE_READONLY).select(query);
        var rc = returnFile.rc;
        var f = returnFile.scfile;
        var result = [];
        while (rc == RC_SUCCESS) {
             result.push({
                 "application": f.application,
                 "refEntityId": f.topic,
                 "uid": f.uid,
                 "fileName": f.filename,
                 "mimeType": f.mimetype,
                 "sysModTime": new XMLDate(f.sysmodtime).getISODateTimeString(),
                 "sysModUser": f.sysmoduser,
                 "size": f.size,
                 "segment": f.segment,
                 "type": f.type
             });
             rc = f.getNext();
        }
        res.send({entities: result});
    } else {
        res.status(404);
    }
}

function authorize() {
    return true;
}
