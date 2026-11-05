var logger = getLog('RunRestfulPortalnotifications');
var JSON = lib.JSON.json();

function GET(request, response) {
    retrieveNotification(request, response);
}

function POST(request, response) {
    postProcessNotification(request, response);
}

function retrieveNotification(request, response){  
    var pagesize = 1;
    var start = 1;
  
    if (request.options){
        if (request.options.count){
            pagesize = parseInt(request.options.count);
        }
        if (request.options.start){
            start = parseInt(request.options.start);
        }
    }

    var result = [];
    var fPortalNotification = new SCFile("PortalNotification");
    var query='processed=false';
    if (fPortalNotification.doSelect(query) == RC_SUCCESS){
        var row = 1;
        var end = -1;
	    if (start < 1) {
	        start =1;
	    }
	    if (pagesize > 0) {
	        end = start + pagesize - 1;
	    }
        var rc = RC_SUCCESS;
        while (rc == RC_SUCCESS){
            if (row >= start) {
                var data = {};
                data['id'] = fPortalNotification['id'];
                data['entityType'] = fPortalNotification['entityType'];
                data['notificationType'] = fPortalNotification['notificationType'];
                data['entityId'] = fPortalNotification['entityId'];
                data['entityTitle'] = fPortalNotification['entityTitle'];
                data['receipients'] = fPortalNotification['receipients'].toArray();
                data['retriedTimes'] = fPortalNotification['retriedTimes'];
                result.push(data);
                fPortalNotification['processed'] = true;
                fPortalNotification.doUpdate();
            }
            if (end!=-1 && row>=end) break;
            rc = fPortalNotification.getNext();
            row++;
        }
    }
    response.send({ '@start': start, '@count': pagesize, '@totalcount': pagesize, entities:result });
}

function postProcessNotification(request, response){
    var code;
    var resultStr;
    var reqObj = request.body.portalnotification;
    if (reqObj && reqObj.ids && reqObj.action) {
        var ids = reqObj.ids;
        var action = reqObj.action;
        var fPortalNotification = new SCFile("PortalNotification");
        var query="id isin {";
        var len=ids.length;
        for (i=0;i<len;i++){
            query+='"' + ids[i] + '"';
            if (i !== len-1) query += ",";
        }
        query += "}";
        if (fPortalNotification.doSelect(query)==RC_SUCCESS){
            if (action=="ROLLBACK"){
                do{
                    fPortalNotification['processed']=false;
                    fPortalNotification['retriedTimes']=fPortalNotification['retriedTimes']+1;
                    fPortalNotification['updatedOn'] = new Date();
                    fPortalNotification.doUpdate();
                }while(fPortalNotification.getNext()==RC_SUCCESS)
            }
            else if (action=="DELETE"){
                do{
                    fPortalNotification.doDelete();
                }while(fPortalNotification.getNext()==RC_SUCCESS)
            }
        }
    }
    else{
        code = 400;
        resultStr = "Bad request payload";
    }
    response.status(200).send({
        "ReturnCode": code,
        "Result": resultStr
    });
}

function authorize() {
  return true;
}