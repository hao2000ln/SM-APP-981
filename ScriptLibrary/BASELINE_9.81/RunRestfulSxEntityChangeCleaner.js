/**
 * Batch Remove SxEntityChange Records 
 * Request body:
 * id: entity id list to be removed.
 * body:
 * {
 *   "entities":{
 *	  "id":["1001","1002"]
 *   }
 * }
 * Purge success:   200
 */
function POST(req, res) {
  var entities = req.body.entities;
  if (entities && entities.id) {
    var idToRemove = entities.id;
    var entityChanges = new SCFile("SxEntityChangesV2");
    var sql="id isin " + system.functions.str(idToRemove);
    var rc = entityChanges.doPurge(sql);
  }
  res.status(200);
}

function authorize() {
  return true;
}