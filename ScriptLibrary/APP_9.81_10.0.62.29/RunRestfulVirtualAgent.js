var logger = getLog('RunRestfulVirtualAgent');
var _ = lib.Underscore.require();

function POST(req, res) {
    if (logger.isDebugEnabled()) {
        logger.debug("POST request: " + (req ? JSON.stringify(req) : "NULL"));
    }

    vars["$G.virtualagent"] = true;
    
    var json={"ReturnCode":-1, "answer" : {"type":"text", "content":"Sorry, I cannot recognize your request."}};
    if (req && req.body && req.body.chat) {
        var answer = lib.VirtualAgentProcessor.chat(req.body.chat);
        if (answer) {
            json={"ReturnCode":0, "answer":answer};
        }        
    }
    
    if (logger.isDebugEnabled()) {
        logger.debug("POST response json: " + (json ? JSON.stringify(json) : "NULL"));
    }
    
    res.status(200).send(json);
    
    vars["$G.virtualagent"] = false;
    
    if (logger.isDebugEnabled()) {
        logger.debug("POST response end.");
    }
}

function authorize() {
    if(_.contains(vars["$lo.ucapex"], "RESTful API")) {
        return true;
    }
    
    if (logger.isDebugEnabled()) {
        logger.debug('authorize: No "RESTful API".');
    }
    
    return false;
}
