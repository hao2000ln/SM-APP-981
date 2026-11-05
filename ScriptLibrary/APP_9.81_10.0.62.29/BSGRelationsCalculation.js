/**
 * BSG1 uses a cache and can process bsg more quickly
 */
var bsg = lib.BSGRelationsCalculation1;

/**
 * BSG2 uses less cache and memory resource.
 * It only generate records that level < Max CI levels.
 * If memeory issues occurs with BSG1, try this solution 
 */
// var bsg = lib.BSGRelationsCalculation2;

function triggerDeleteCICascadeRelations(logical_name, type) {
    return bsg.triggerDeleteCICascadeRelations(logical_name, type);
}

function triggerAddCIRelation(relation) {
    return bsg.triggerAddCIRelation(relation);
}

function triggerDeleteCIRelation(relation) {
    return bsg.triggerDeleteCIRelation(relation);
}

function triggerUpdateCIRelation(_new, _old) {
    return bsg.triggerUpdateCIRelation(_new, _old);
}

function beginProcessTask(){
    return bsg.beginProcessTask();
}
