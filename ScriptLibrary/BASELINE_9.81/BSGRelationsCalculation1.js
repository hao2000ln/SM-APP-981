/** 
 *  CRB = CI Relation BSG
 */
const CRB_TASK_ACTION_NONE = -1;
const CRB_TASK_ACTION_DELETE = 0;
const CRB_TASK_ACTION_ADD = 1;
const CRB_TASK_ACTION_UPDATE = 2;
// Action to delete CI
const CRB_TASK_ACTION_DELETE_CICASCADE = 3;

/**
 *  CRB_TASK_STATUS_QUEUED: task is created and wait for processing
 *  CRB_TASK_STATUS_FINISHED: task is processed
 *  CRB_TASK_STATUS_EXCEPTION: task is not set correctly or not processed correctly
 */
const CRB_TASK_STATUS_QUEUED = 0;
const CRB_TASK_STATUS_FINISHED = 1;
const CRB_TASK_STATUS_EXCEPTION = -1;

var SEP_CHAR = ';';

var $ = lib.c.$;
var log = getLog("[BSGRelationsCalculation]");

/**
 *  Dijkstra algorithm
 *  The CIs can be considered as the directed graph:
 *  Every CI is vertex and relation is edge with weight 1 (level is 1)
 *  Use the algorithm to calculate the shortest path from one vertex to other vertexes
 *  The shortest distance is the level of CI relation
 */
function searchShortestDistances(matrix, count, start) {
    var weight = 1;
    var distance = {}; // distance is object, like: CI number : distance value
    distance[start] = 0;

    var direct_children = matrix[start];

    var i;
    // initialize the distance of the direct child of the start vertex
    if (direct_children != null) {
        for (i = 0; i < direct_children.length; i++) {
            distance[direct_children[i]] = weight;
        }
    }

    var mark = {};
    mark[start] = true;

    var min;
    var u;
    var j;
    var row;
    var col;
    var v;

    for (i = 0; i < count; i++) {
        min = 1000;
        u = -1;
        // search one vertex which are not used and the smallest distance
        for (j in distance) { // As looped, j has the value. 
            if (mark[j] == null && distance[j] < min) {
                min = distance[j];
                u = j;
            }
        }

        // if u is not found, it means that there is no available vertex
        if (u < 0) {
            break;
        }

        mark[u] = true;

        row = matrix[u];
        if (row != null) {
            for (col = 0; col < row.length; col++) {
                v = row[col];
                // v is not used and, its distance is infinite or larger than the distance of the summary of u and u to v
                if (mark[v] == null && (distance[v] == null || distance[v] > distance[u] + weight)) {
                    distance[v] = distance[u] + weight;
                }
            }
        }
    }

    return distance;
}

function makeRelationBSGName(parent, child) {
    return parent + SEP_CHAR + child + SEP_CHAR;
}

function doAddRelationBSG(parent, child, level) {
    var bsg = new SCFile('cirelationbsg');

    bsg.name = makeRelationBSGName(parent, child);
    bsg.parent = parent;
    bsg.child = child;
    bsg.level = level;

    bsg.doInsert();

    return bsg;
}

/**
 * Add Multiple CI relationships with logical name into matrix. One - Many
 */
function addCIRelationsInMatrixOne2Many(matrix, cilistmap, start_ci, end_ci_list) {
    var m = matrix;
    var start = cilistmap[start_ci];
    var j;
    var end;
    for (j = 0; j < end_ci_list.length; j++) {
        end = cilistmap[end_ci_list[j]];
        m = addRelationInMatrix(m, start, end);
    }

    return m;
}

/**
 * Add Multiple CI relationships with logical name into matrix. Many - One
 */
function addCIRelationsInMatrixMany2One(matrix, cilistmap, start_ci_list, end_ci) {
    var m = matrix;
    var end = cilistmap[end_ci];
    var i;
    var start;
    for (i = 0; i < start_ci_list.length; i++) {
        start = cilistmap[start_ci_list[i]];
        m = addRelationInMatrix(m, start, end);
    }

    return m;
}

/**
 * Add CI relationship with logical name into matrix
 */
function addCIRelationInMatrix(matrix, cilistmap, start_ci, end_ci) {
    var start = cilistmap[start_ci];
    var end = cilistmap[end_ci];
    return addRelationInMatrix(matrix, start, end);
}

/**
 * Add CI relationship with number into matrix
 * The number is mapped to CI logical name.
 */
function addRelationInMatrix(matrix, start, end) {
    if (matrix[start] == null) {
        matrix[start] = [];
    }

    // add only unique
    if (!lib.ArrayUtil.contains(matrix[start], end)) {
        matrix[start].push(end);
    }

    return matrix;
}

/**
 * Delete Multiple CI relationships with logical name into matrix. one - many
 */
function deleteCIRelationsInMatrixOne2Many(matrix, cilistmap, start_ci, end_ci_list) {
    var m = matrix;
    var start = cilistmap[start_ci];
    var j;
    var end;
    for (j = 0; j < end_ci_list.length; j++) {
        end = cilistmap[end_ci_list[j]];
        m = deleteRelationInMatrix(m, start, end);
    }

    return m;
}

/**
 * Delete Multiple CI relationships with logical name into matrix. many - one
 */
function deleteCIRelationsInMatrixMany2One(matrix, cilistmap, start_ci_list, end_ci) {
    var m = matrix;
    var end = cilistmap[end_ci];
    var i;
    var start;
    for (i = 0; i < start_ci_list.length; i++) {
        start = cilistmap[start_ci_list[i]];
        m = deleteRelationInMatrix(m, start, end);
    }

    return m;
}

/**
 * Delete CI logical name from matrix which only uses number
 */
function deleteCIRelationInMatrix(matrix, cilistmap, start_ci, end_ci) {
    var start = cilistmap[start_ci];
    var end = cilistmap[end_ci];
    return deleteRelationInMatrix(matrix, start, end);
}

/**
 * Delete CI number into matrix which only uses number
 * The number is mapped to CI logical name.
 */
function deleteRelationInMatrix(matrix, start, end) {
    var relatedgroup = matrix[start];
    if (relatedgroup != null) {
        var updated = false;
        var new_relatedgroup = [];
        var i;
        for (i = 0; i < relatedgroup.length; i++) {
            if (relatedgroup[i] != end) {
                new_relatedgroup.push(relatedgroup[i]);
            } else {
                updated = true;
            }
        }

        if (updated) {
            matrix[start] = new_relatedgroup;
        }
    }

    return matrix;
}

/**
 * ci_list is the array of the CI logical names
 */
function getRelationBSGMultiCIParentGroup(ci_list) {
    var ciGroup = [];
    var i;
    var parentCIGroup;
    for (i = 0; i < ci_list.length; i++) {
        parentCIGroup = getRelationBSGCIParentGroup(ci_list[i]);
        ciGroup = lib.ArrayUtil.merge(ciGroup, parentCIGroup);
    }

    return ciGroup;
}

function getRelationBSGCIParentGroup(ci) {
    var parentCIGroup = [];
    var sql = 'select a1.parent from cirelationbsg a1 where a1.child="' + ci + '" ';
    var pp;
    $('!cirelationbsg').select(sql).iterate(function(item) {
        pp = item[0];
        lib.ArrayUtil.merge(parentCIGroup, [pp]);
    });

    return parentCIGroup;
}


/**
 * ci_list is the array of the CI logical names
 */
function getRelationBSGMultiCIChildGroup(ci_list) {
    var ciGroup = [];
    var i;
    var childCIGroup;
    for (i = 0; i < ci_list.length; i++) {
        childCIGroup = getRelationBSGCIChildGroup(ci_list[i]);
        ciGroup = lib.ArrayUtil.merge(ciGroup, childCIGroup);
    }

    return ciGroup;
}

function getRelationBSGCIChildGroup(ci) {
    var childCIGroup = [];
    var sql = 'select a1.child from cirelationbsg a1 where a1.parent="' + ci + '" ';
    var cc;
    $('!cirelationbsg').select(sql).iterate(function(item) {
        cc = item[0];
        lib.ArrayUtil.merge(childCIGroup, [cc]);
    });

    return childCIGroup;
}

/**
 *  Filter add if the CI relation need to be recalculated
 */
function filterCIRelationAdd(parentCI, childrenCI) {
    return filterCIRelationAction(CRB_TASK_ACTION_ADD, parentCI, childrenCI);
}

/**
 *  Filter delete if the CI relation need to be recalculated
 */
function filterCIRelationDelete(parentCI, childrenCI) {
    return filterCIRelationAction(CRB_TASK_ACTION_DELETE, parentCI, childrenCI);
}

/**
 *  Get the count of the relation from database directly
 *  When duplicate, it is more than 1
 */
function getCIRelationCount(parentCI, childCI) {
    var sql = "logical.name=\"" + parentCI + "\" and related.cis=\"" + childCI + "\"";
    var count = $('!cirelationship').fields("logical.name").count(sql);
    return count;
}

/**
 *  Filter if the CI relation need to be recalculated
 *  Only invoke after the relation is updated to db but not synchronized in matrix
 *  If count = 1 for add or count = 0 for delete, it means there is duplicated and no need to calculate and filter it
 */
function filterCIRelationAction(action, parentCI, childrenCI) {
    var filteredChildrenCI = [];
    var i;
    var childCI;
    var count;
    var compare_count;

    for (i = 0; i < childrenCI.length; i++) {
        childCI = childrenCI[i];
        count = getCIRelationCount(parentCI, childCI);
        compare_count = -1;
        switch (action) {
            case CRB_TASK_ACTION_ADD:
                compare_count = 1;
                break;
            case CRB_TASK_ACTION_DELETE:
                compare_count = 0;
                break;
        }

        // should not less than 0. If so, copy all
        if (compare_count < 0 || count == compare_count) {
            filteredChildrenCI.push(childCI);
        }
    }

    return filteredChildrenCI;
}

/**
 *  Calculate the shortest distances between the CIs in startCIGroup and endCIGroup
 *  Then do action to cirelationbsg: 
 *    Add    - When the distance is calculated and there is no relation in cirelationbsg
 *    Update - When the distance is calculated and it is not equal to the one in cirelationbsg
 *    Delete - When the distance is not calculated but there is relation in cirelationbsg
 *  Parameter reverse: true - child->parent, false - parent->child
 */
function actionBSGRelation(matrix, cilistmap, cinumbermap, cicount, startCIGroup, endCIGroup, reverse) {
    var i;
    var j;
    var startci;
    var start;
    var distance;
    var endci;
    var end;
    var printstring;
    var dist;
    var sql;
    var bsg;
    var rc;

    for (i = 0; i < startCIGroup.length; i++) {
        startci = startCIGroup[i];
        start = cilistmap[startci];
        distance = searchShortestDistances(matrix, cicount, start);
        for (j = 0; j < endCIGroup.length; j++) {
            endci = endCIGroup[j];

            if (startci == endci) {
                continue;
            }

            end = cilistmap[endci];
            printstring = !reverse ? startci + "->" + endci : endci + "->" + startci;

            sql = reverse ? "parent=\"" + endci + "\" and child=\"" + startci + "\"" : "parent=\"" + startci + "\" and child=\"" + endci + "\"";
            bsg = new SCFile("cirelationbsg");
            rc = bsg.doSelect(sql);
            if (rc == RC_SUCCESS) {
                if (distance == null || distance[end] == null) {
                    // delete when not dist but exist in db
                    log.info("Delete cirelationbsg: " + printstring);
                    bsg.doDelete();
                } else {
                    // get level to compare with distance[j] and then update.
                    dist = +distance[end];
                    if (dist > 0 && dist != bsg["level"]) { // As the dist is calculated to the shortest, always update the one in db if not equal
                        bsg["level"] = dist;
                        log.info("Update cirelationbsg: " + printstring);
                        bsg.doUpdate();
                    }
                }
            } else {
                if (distance != null && distance[end] != null) { // Add when dist is calculated but doesn't exist in db
                    dist = +distance[end];
                    if (dist <= 0) {
                        continue;
                    }

                    log.info("Add cirelationbsg: " + printstring);
                    if (!reverse) {
                        doAddRelationBSG(startci, endci, dist);
                    } else {
                        doAddRelationBSG(endci, startci, dist);
                    }
                }
            }
        }
    }
}

function preActionCIRelations(parentCI, childrenCI) {
    lib.BSGRelationsStructure.checkAddNewCI(parentCI);
    lib.BSGRelationsStructure.checkAddNewCIList(childrenCI);
}

/**
 * Add one child CIs to parent CI
 * The parameter childrenCI is an array including the CI logical name.
 */
function addCIRelations(parentCI, childrenCI) {
    preActionCIRelations(parentCI, childrenCI);

    // filter the child CI if the relation with parent after cirelationship added into db and before cirelationbsg add action
    var filteredChildrenCI = filterCIRelationAdd(parentCI, childrenCI);

    var listmap = lib.BSGRelationsStructure.getCIListMap();

    var pcmatrix = lib.BSGRelationsStructure.getParentChildMatrix();
    var cpmatrix = lib.BSGRelationsStructure.getChildParentMatrix();

    // add the relations into parent-child matrix
    cpmatrix = addCIRelationsInMatrixMany2One(cpmatrix, listmap, filteredChildrenCI, parentCI);
    // add the relations into child-parent matrix
    pcmatrix = addCIRelationsInMatrixOne2Many(pcmatrix, listmap, parentCI, filteredChildrenCI);

    lib.BSGRelationsStructure.setParentChildMatrix(pcmatrix);
    lib.BSGRelationsStructure.setChildParentMatrix(cpmatrix);

    // fetch all parent CIs of the parent CI from cirelationbsg and also add parent CI into parent CI group
    var parentCIGroup = getRelationBSGCIParentGroup(parentCI);
    parentCIGroup = lib.ArrayUtil.merge(parentCIGroup, [parentCI]);

    // fetch all child CIs of the child CIs from cirelationbsg and also add child CIs into child CI group
    var childCIGroup = getRelationBSGMultiCIChildGroup(filteredChildrenCI);
    childCIGroup = lib.ArrayUtil.merge(childCIGroup, filteredChildrenCI);

    // by default, calculate the relation from parent to child CIs
    var startCIGroup = parentCIGroup;
    var endCIGroup = childCIGroup;
    var matrix = pcmatrix;
    var reverse = false;
    // when the number of parent CI group is more than the one of child CI group, calculate the relation from child to parent CIs
    if (parentCIGroup.length > childCIGroup.length) {
        startCIGroup = childCIGroup;
        endCIGroup = parentCIGroup;
        matrix = cpmatrix;
        reverse = true;
    }

    var cicount = lib.BSGRelationsStructure.getCICount();
    var ciNumberMap = lib.BSGRelationsStructure.getCINumberMap();

    actionBSGRelation(matrix, listmap, ciNumberMap, cicount, startCIGroup, endCIGroup, reverse);
}

/**
 * Remove child CIs of parent CI
 * The parameter childrenCI is an array including the CI logical name.
 */
function deleteCIRelations(parentCI, childrenCI) {
    preActionCIRelations(parentCI, childrenCI);

    // filter the child CI if the relation with parent after cirelationship deleted into db and before cirelationbsg delete action
    var filteredChildrenCI = filterCIRelationDelete(parentCI, childrenCI);

    var listmap = lib.BSGRelationsStructure.getCIListMap();

    var pcmatrix = lib.BSGRelationsStructure.getParentChildMatrix();
    var cpmatrix = lib.BSGRelationsStructure.getChildParentMatrix();

    // delete the relations from parent-child matrix
    cpmatrix = deleteCIRelationsInMatrixMany2One(cpmatrix, listmap, filteredChildrenCI, parentCI);
    // delete the relations from child-parent matrix
    pcmatrix = deleteCIRelationsInMatrixOne2Many(pcmatrix, listmap, parentCI, filteredChildrenCI);

    lib.BSGRelationsStructure.setParentChildMatrix(pcmatrix);
    lib.BSGRelationsStructure.setChildParentMatrix(cpmatrix);

    // fetch all parent CIs of the parent CI from cirelationbsg and also add parent CI into parent CI group
    var parentCIGroup = getRelationBSGCIParentGroup(parentCI);
    parentCIGroup = lib.ArrayUtil.merge(parentCIGroup, [parentCI]);

    // fetch all child CIs of the child CIs from cirelationbsg and also add child CIs into child CI group
    var childCIGroup = getRelationBSGMultiCIChildGroup(filteredChildrenCI);
    childCIGroup = lib.ArrayUtil.merge(childCIGroup, filteredChildrenCI);

    // by default, calculate the relation from parent to child CIs
    var startCIGroup = parentCIGroup;
    var endCIGroup = childCIGroup;
    var matrix = pcmatrix;
    var reverse = false;
    // when the number of parent CI group is more than the one of child CI group, calculate the relation from child to parent CIs
    if (parentCIGroup.length > childCIGroup.length) {
        startCIGroup = childCIGroup;
        endCIGroup = parentCIGroup;
        matrix = cpmatrix;
        reverse = true;
    }

    var cicount = lib.BSGRelationsStructure.getCICount();
    var ciNumberMap = lib.BSGRelationsStructure.getCINumberMap();

    actionBSGRelation(matrix, listmap, ciNumberMap, cicount, startCIGroup, endCIGroup, reverse);
}

/**
 *  Update child CIs of parent CI: update equals add + delete
 *  The parameter addedChildrenCI is an array including the CI logical name added.
 *  The parameter deletedChildrenCI is an array including the CI logical name deleted.
 */
function updateCIRelations(parentCI, addedChildrenCI, deletedChildrenCI) {
    preActionCIRelations(parentCI, addedChildrenCI);
    preActionCIRelations(parentCI, deletedChildrenCI);

    // filter added child CI if the relation with parent after cirelationship update into db and before cirelationbsg update action
    var filteredAddedChildrenCI = filterCIRelationAdd(parentCI, addedChildrenCI);
    // filter deleted child CI if the relation with parent after cirelationship update into db and before cirelationbsg update action
    var filteredDeletedChildrenCI = filterCIRelationDelete(parentCI, deletedChildrenCI);

    var listmap = lib.BSGRelationsStructure.getCIListMap();

    var pcmatrix = lib.BSGRelationsStructure.getParentChildMatrix();
    var cpmatrix = lib.BSGRelationsStructure.getChildParentMatrix();

    // add the relations from parent-child matrix
    cpmatrix = addCIRelationsInMatrixMany2One(cpmatrix, listmap, filteredAddedChildrenCI, parentCI);
    // add the relations from child-parent matrix
    pcmatrix = addCIRelationsInMatrixOne2Many(pcmatrix, listmap, parentCI, filteredAddedChildrenCI);

    // delete the relations from parent-child matrix
    cpmatrix = deleteCIRelationsInMatrixMany2One(cpmatrix, listmap, filteredDeletedChildrenCI, parentCI);
    // delete the relations from child-parent matrix
    pcmatrix = deleteCIRelationsInMatrixOne2Many(pcmatrix, listmap, parentCI, filteredDeletedChildrenCI);

    lib.BSGRelationsStructure.setParentChildMatrix(pcmatrix);
    lib.BSGRelationsStructure.setChildParentMatrix(cpmatrix);

    // fetch all parent CIs of the parent CI from cirelationbsg and also add parent CI into parent CI group
    var parentCIGroup = getRelationBSGCIParentGroup(parentCI);
    parentCIGroup = lib.ArrayUtil.merge(parentCIGroup, [parentCI]);

    var childCIGroup = [];
    // fetch all child CIs of added child CIs from cirelationbsg and also add added child CIs into child CI group
    var addedChildCIGroup = getRelationBSGMultiCIChildGroup(filteredAddedChildrenCI);
    childCIGroup = lib.ArrayUtil.merge(childCIGroup, addedChildCIGroup, filteredAddedChildrenCI);

    // fetch all child CIs of deleted child CIs from cirelationbsg and also add deleted child CIs into child CI group
    var deletedChildCIGroup = getRelationBSGMultiCIChildGroup(filteredDeletedChildrenCI);
    childCIGroup = lib.ArrayUtil.merge(childCIGroup, deletedChildCIGroup, filteredDeletedChildrenCI);

    // by default, calculate the relation from parent to child CIs
    var startCIGroup = parentCIGroup;
    var endCIGroup = childCIGroup;
    var matrix = pcmatrix;
    var reverse = false;
    // when the number of parent CI group is more than the one of child CI group, calculate the relation from child to parent CIs
    if (parentCIGroup.length > childCIGroup.length) {
        startCIGroup = childCIGroup;
        endCIGroup = parentCIGroup;
        matrix = cpmatrix;
        reverse = true;
    }

    var cicount = lib.BSGRelationsStructure.getCICount();
    var ciNumberMap = lib.BSGRelationsStructure.getCINumberMap();

    actionBSGRelation(matrix, listmap, ciNumberMap, cicount, startCIGroup, endCIGroup, reverse);
}

function saveCIRelationBSGAddedTask(parent, addedChildrenList) {
    saveCIRelationBSGTask(parent, addedChildrenList || [], [], CRB_TASK_ACTION_ADD);
}

function saveCIRelationBSGDeletedTask(parent, deletedChildrenList) {
    saveCIRelationBSGTask(parent, [], deletedChildrenList || [], CRB_TASK_ACTION_DELETE);
}

function saveCIRelationBSGUpdatedTask(parent, addedChildrenList, deletedChildrenList) {
    saveCIRelationBSGTask(parent, addedChildrenList || [], deletedChildrenList || [], CRB_TASK_ACTION_UPDATE);
}

/**
 *  Save cirelationbsgtask
 */
function saveCIRelationBSGTask(parent, addedChildrenList, deletedChildrenList, action) {
    var addedLength = addedChildrenList == null ? 0 : addedChildrenList.length;
    var deletedLength = deletedChildrenList == null ? 0 : deletedChildrenList.length;

    if (action != CRB_TASK_ACTION_DELETE_CICASCADE && addedLength <= 0 && deletedLength <= 0) {
        return;
    }

    var task = new SCFile("cirelationbsgtask");
    task["parent"] = parent;
    task["child.added"] = addedChildrenList;
    task["child.deleted"] = deletedChildrenList;
    task["status"] = CRB_TASK_STATUS_QUEUED;
    task["action"] = action;

    var number = new Datum();
    var rc = new Datum();
    funcs.rtecall("getnumber", rc, number, "cirelationbsgtask");
    task["id"] = number;
    task["created.time"] = funcs.tod();

    task.doInsert();
}

/**
 *  Fetch the queued task from cirelationbsgtask
 *  Process the task to calculate cirelationbsg by action
 *  When processed, set the status to 
 */
function processCIRelationBSGTask() {
    var task = new SCFile("cirelationbsgtask");
    var sql = "status=" + CRB_TASK_STATUS_QUEUED;
    var rc = task.doSelect(sql);

    while (rc == RC_SUCCESS) {
        task["status"] = CRB_TASK_STATUS_FINISHED;

        switch (task["action"]) {
            case CRB_TASK_ACTION_ADD:
                addCIRelations(task["parent"], task["child.added"] == null ? [] : task["child.added"].toArray());
                break;
            case CRB_TASK_ACTION_DELETE:
                deleteCIRelations(task["parent"], task["child.deleted"] == null ? [] : task["child.deleted"].toArray());
                break;
            case CRB_TASK_ACTION_UPDATE:
                updateCIRelations(task["parent"], task["child.added"] == null ? [] : task["child.added"].toArray(), task["child.deleted"] == null ? [] : task["child.deleted"].toArray());
                break;
            case CRB_TASK_ACTION_DELETE_CICASCADE:
                deleteCICascadeRelations(task["parent"]);
                break;
            default:
                task["status"] = CRB_TASK_STATUS_EXCEPTION;
        }

        task["processed.time"] = funcs.tod();
        task.doUpdate();

        rc = task.getNext();
    }
}

function triggerAddCIRelation(relation) {
    var parent = relation['logical.name'];
    var childList = relation['related.cis'].toArray();
    saveCIRelationBSGAddedTask(parent, childList);
}

function triggerDeleteCIRelation(relation) {
    var parent = relation['logical.name'];
    var childList = relation['related.cis'].toArray();
    saveCIRelationBSGDeletedTask(parent, childList);
}

function triggerUpdateCIRelation(_new, _old) {
    if (_new.logical_name != _old.logical_name) {
        // When the parent is also updated, it equals deleting the old one and add a new one
        triggerDeleteCIRelation(_old);
        triggerAddCIRelation(_new);
    } else {
        doTrigerUpdateCIRelation(_new, _old);
    }
}

/**
 *  Trigger to update cirelationbsg when only children is updated.
 */
function doTrigerUpdateCIRelation(_new, _old) {
    var diff = lib.createRelations.diffArray(_new['related.cis'].toArray(), _old['related.cis'].toArray());
    var added = diff.add;
    var deleted = diff.del;

    var parent = _new.logical_name;
    //saveCIRelationBSGAddedTask(parent, deleted);
    //saveCIRelationBSGDeletedTask(parent, added);
    saveCIRelationBSGUpdatedTask(parent, added, deleted);
}

/**
 *  Trigger to add the delete cirelationbsg task when delete the CI directly, invoked by device post delete trigger
 *  When CI is deleted, the trigger is switched off in RAD am.cascade.update.wrapper
 *  Then it will invoke RAD process.update.config.record to update cirelationship cascade defined in cascadeupd
 *  So we have to define one special delete task action for deleting CI cascade relations.
 */
function triggerDeleteCICascadeRelations(logical_name) {
    saveCIRelationBSGTask(logical_name, [], [], CRB_TASK_ACTION_DELETE_CICASCADE);
}

/**
 *  Define this function to delete relevant cirelationbsg for deleting CI cascade
 *  As the CI is deleted, the cirelationship can only be fetched from matrix: its childrent and parents
 *  The matrix only exists in the bg process for configuration management.
 *  Execute the delete task for its children and for the every relation from its parent
 */
function deleteCICascadeRelations(ciname) {
    var childNameList = lib.BSGRelationsStructure.getChildCINameListInMatrix(ciname);
    if (childNameList.length > 0) {
        deleteCIRelations(ciname, childNameList);
    }

    var parentNameList = lib.BSGRelationsStructure.getParentCINameListInMatrix(ciname);
    if (parentNameList.length > 0) {
        var i;
        for (i = 0; i < parentNameList.length; i++) {
            deleteCIRelations(parentNameList[i], [ciname]);
        }
    }
}

function beginProcessTask() {
    lib.BSGRelationsStructure.initializeCIRelations();
    processCIRelationBSGTask();
}

/**
 *  Generate cirelationbsg records from CI Relation
 */
function generateCIRelationBSG() {
    lib.BSGRelationsStructure.initializeCIRelations();
    var pcmatrix = lib.BSGRelationsStructure.getParentChildMatrix();
    var ciNumberMap = lib.BSGRelationsStructure.getCINumberMap();
    var cicount = lib.BSGRelationsStructure.getCICount();

    var count = 0;
    var number;
    var parent;
    var distance;
    var n;
    var dist;
    var child;
    for (number in ciNumberMap) {
        parent = ciNumberMap[number];

        distance = searchShortestDistances(pcmatrix, cicount, number);

        for (n in distance) {
            dist = +distance[n];
            if (dist <= 0) {
                continue;
            }

            child = ciNumberMap[n];
            doAddRelationBSG(parent, child, dist);
        }

        count++;
        if (count % 1000 == 0) {
            print("Processed " + count + " configuration items.");
        }
    }

    if (count % 1000 != 0) {
        print("Processed " + count + " configuration items.");
    }
}

/**
 *  Before execute this function, cleanup all records in cirelationbsg. 
 *  Direct to operate database to delete records: delete from CIRELATIONBSGM1
 *  Then execute this function to generate cirelationbsg records from CI Relation
 */
function run() {
    var begin = Date.now();
    generateCIRelationBSG();
    var end = Date.now();
    print('Total Time:', (end - begin) / 1000.0, 's');
}