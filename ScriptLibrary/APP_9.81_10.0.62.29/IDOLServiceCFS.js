/**
 * Smart Analytics Services for Attachment index
 *
 * author He, Peng-Fei
 */

var IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLRequest = lib.IDOLRequest.require();

function createCFSService(cfsURL) {
  
  function indexFile(xml) {
    var doc = IDOLRequest.doIDOLPost(cfsURL, {
      action : 'Ingest',
      adds : xml
    });
    return doc.toXMLString();
  }
  
  function getIndexStatusByToken(token) {
    var param = 'action=QueueInfo&QueueAction=getActionParameters&QueueAction=GetStatus&QueueName=Ingest&Token=' + token;
    return lib.jsaci.runIDOLAction(cfsURL + param, false);
  }
  
  return {
    indexFile: indexFile,
    getIndexStatus: getIndexStatusByToken
  };
}

function require() {
  var cfsURL = IDOLConfigure.getConfig()['default.cfs.url'];
  return createCFSService(cfsURL);
}