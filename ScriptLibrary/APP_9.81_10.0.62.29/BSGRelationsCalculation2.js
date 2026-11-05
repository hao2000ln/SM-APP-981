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
var MAX_LEVEL = vars['$G.cilevel'];
var TYPE_BIZ = 'biz';
var TYPE_OTHER = 'other';

var _ = lib.Underscore.require();
var $ = lib.c.$;
var log = getLog('bsg.calc');
//log.setLevel('debug');
var j = rteJSONStringify;

/**
 * CI class
 * id: logical name of a CI
 * level: the level to the parent ci
 * childList: ci children
 */
function CI(id, level, type) {
    if (id.id) {
        printStack();
    }
    this.id = id;
    this.level = level;
    this.childList = null;
    if (type) {
        this.type = type;
    }
}

/**
 * Add a child
 * @param {*} child
 * @param {*} hash
 */
CI.prototype.addChild = function(childId) {
    this.childList.push(new CI(childId, this.level + 1));
};

/**
 * Get the related CI as children
 
 * @returns
 */
CI.prototype.getChildList = function() {
    if (this.childList) {
        return this.childList;
    }

    this.childList = [];
    var that = this;

    // ci ==> child, find related parent
    var func2 = function(item) {
        that.addChild(item.child);
    };
    $('!cirelationbsg').fields('child').find('parent=:ci and level=1', this.id).each(func2);

    return this.childList;
};

/**
 * @param {*} hash used to remove duplicate
 * @returns
 */
CI.prototype.filterChildList = function(hash) {
    return this.filterList(this.getChildList(), hash);
};

CI.prototype.filterList = function(list, hash) {
    var returnList = [];
    var k;
    var ci;
    for (k = 0; k < list.length; k++) {
        ci = list[k];
        if (!hash[ci.id]) {
            returnList.push(ci);
        }
    }
    return returnList;
};

/**
 * Get Parent List
 * @param {*} hash
 * @returns
 */
CI.prototype.getParentList = function() {
    if (this.parentList) {
        return this.parentList;
    }

    this.parentList = [];
    var that = this;

    // ci ==> child, find related children
    var func1 = function(item) {
        that.parentList.push(new CI(item.parent));
    };

    $('!cirelationbsg').fields('parent').find('child=:ci and level=1', this.id).each(func1);

    return this.parentList;
};

CI.prototype.filterParentList = function(hash) {
    return this.filterList(this.getParentList(), hash);
};

/**
 * Get BSG record to parent
 * @param {*} parent
 * @returns
 */
CI.prototype.getBsg = function(biz) {
    var bizId = biz.id || biz;
    if (this.biz == bizId) {
        return this.bsg;
    }

    this.biz = bizId;
    this.bsg = getBsg(biz, this);
    if (this.bsg) {
        this.bizLevel = this.bsg.level;
    }

    return this.bsg;
};

/**
 * Related Biz List
 * @returns
 */
CI.prototype.getBizList = function(isBiz) {
    if (this.bizList) {
        return this.bizList;
    }

    var list = [];
    if (isBiz) {
        list.push(new CI(this.id, 0));
    }

    $('!cirelationbsg')
        .fields('parent', 'level')
        .sortBy('level')
        .find('level<:level and child=:ci and type=:type', MAX_LEVEL, this.id, TYPE_BIZ)
        .each(function(item) {
            list.push(new CI(item.parent, item.level));
        });

    this.bizList = list;
    return this.bizList;
};

/**
 * Get level that bsg record to the parent
 * @param {*} parent
 * @returns
 */
CI.prototype.getBizLevel = function(biz) {
    if (this.biz != biz.id) {
        this.getBsg(biz);
    }

    return this.bizLevel;
};

CI.prototype.toString = function() {
    return 'CI:' + this.id;
};

/**
 * Matrix used to calc shortest path among nodes
 */
function Matrix(parent, child) {
    this.matrix = {};
    this.list = [];
    this.nodeCache = {};
    this.add(parent);
    this.add(child);
}

/**
 * Add a node
 * @param {*} ci
 * @return true if added,  false if the ci existed
 */
Matrix.prototype.add = function(ci) {
    var item = this.ci(ci);
    if (item) {
        return item;
    }

    ci.index = this.list.length;
    this.list.push(ci);

    var id = ci.id || ci;
    this.nodeCache[id] = ci;

    return ci;
};

/**
 * Return a node
 * @param {*} ci
 */
Matrix.prototype.ci = function(ci) {
    var name = ci.id || ci;
    return this.nodeCache[name];
};

/**
 * Return a node
 * @param {*} ci
 */
Matrix.prototype.hasCi = function(ci) {
    return !!this.ci(ci);
};

/**
 * set a path
 * @param {*} x The from node
 * @param {*} y The to node
 * @param {*} value The weight of the path
 */
Matrix.prototype.set = function(x, y, value) {
    // if (x > y) {
    //   var z = y;
    //   y = x;
    //   x = z;
    // }
    if (isDebug()) {
        log.debug('matrix.set:', x, y, value);
    }
    this.matrix[x + '-' + y] = value;
};

/**
 * Return a path weight
 * @param {*} x The from node
 * @param {*} y The to node
 * @returns
 */
Matrix.prototype.get = function(x, y) {
    // if (x > y) {
    //   var z = y;
    //   y = x;
    //   x = z;
    // }

    return this.matrix[x + '-' + y];
};

/**
 * Dijkstra algorithm
 * Calc the distance of first element (always be a business service) to other elements
 * @returns distance list
 */
Matrix.prototype.calc = function() {
    var size = this.list.length;

    var distList = [0];
    var markList = [1];

    var x;
    var y;
    var value;
    var minValue;
    var minValueIndex;

    /** initialize the distance */
    for (x = 1; x < size; x++) {
        value = this.get(0, x);
        if (value) {
            distList[x] = value;
        }
    }

    var k;
    for (k = 0; k < size; k++) {
        minValue = -1;
        minValueIndex = -1;

        // Find mininum value that not marked
        for (x in distList) {
            // skip marked elements
            if (markList[x]) {
                continue;
            }

            // Find a mininum value
            value = distList[x];
            if (value && (minValue < 0 || minValue > value)) {
                minValue = value;
                minValueIndex = x;
            }
        }

        // No mininum value found, no path found
        if (minValueIndex < 0) {
            break;
        }

        // update markers
        markList[minValueIndex] = 1;

        for (y = 0; y < size; y++) {
            if (markList[y]) {
                continue;
            }

            value = this.get(minValueIndex, y);

            if (!distList[y] || distList[y] < value + minValue) {
                distList[y] = value + minValue;
            }
        }
    }

    return distList;
};

/** ----------------------------- Utility methods  --------------------------------- */
function isDebug() {
    return false;
    // return log.isDebugEnabled();
}

function printStack(msg) {
    try {
        throw new Error();
    } catch (e) {
        if (msg) {
            print('Print-Stack:' + msg);
        }

        print(e.stack);
    }
}

/**
 * Hash, used to remove dupliated, add both parent and child ci at beginning
 * @param {*} p
 * @param {*} c
 * @returns
 */
function makeHash(p, c) {
    var hash = {};
    hash[p] = true;
    hash[c] = true;
    return hash;
}

function getBsg(p, c) {
    var pId = p.id || p;
    var cId = c.id || c;

    if (isDebug()) {
        log.debug('getBsg', pId + '->' + cId);
    }
    if (p.id == c.id) {
        return null;
    }
    var name = makeRelationBSGName(pId, cId);
    return $('!cirelationbsg', true).find('name=:name', name).one();
    // return $('!cirelationbsg', true).find('parent=:p and child=:c', p.id, c.id).one();
}

function makeRelationBSGName(parent, child) {
    return parent + SEP_CHAR + child + SEP_CHAR;
}

function doAddRelationBSG(parent, child, level, isBiz) {
    var bsg = new SCFile('cirelationbsg');
    bsg.name = makeRelationBSGName(parent, child);
    bsg.parent = parent;
    bsg.child = child;
    bsg.level = level;
    bsg.type = isBiz ? TYPE_BIZ : TYPE_OTHER;
    bsg.doInsert();
    return bsg;
}

function getCIType(id) {
    var item = $('!device').fields('type').find('logical.name=:id', id).one();
    if (item && item.type == 'bizservice') {
        return TYPE_BIZ;
    }

    return TYPE_OTHER;
}

//function isBizDevice(ciId) {
//  return ciId && (ciId.charAt(0) == 'B' || ciId.charAt(0) == 'b');
//}

/**
 * Find parent relation list that is business service
 * @param {*} ci
 * @param {*} isBiz
 * @returns
 */
function getParentBizList(ci, isBiz) {
    var list = [];
    if (isBiz) {
        list.push(new CI(ci, 0));
    }

    $('!cirelationbsg')
        .fields('parent', 'level')
        .sortBy('level')
        .find('level<:level and child=:ci and type=:type', MAX_LEVEL, ci, TYPE_BIZ)
        .each(function(item) {
            list.push(new CI(item.parent, item.level));
        });

    return list;
}

/** ----------------------------- Add Relation  --------------------------------- */
function addCIRelationList(parentId, childIdList, parentType) {
    var k = 0;
    var newList = filterCIRelationAdd(parentId, childIdList);

    var parent = new CI(parentId);
    for (k = 0; k < newList.length; k++) {
        addCIRelation(parent, new CI(newList[k], 1), parentType);
    }
}

/**
 * Add one child CI to parent CI
 * @param parent parent CI
 * @param childId  Logical Name of parent CI
 */
function addCIRelation(parent, child, parentType) {
    if (isDebug()) {
        log.debug('---------------------------------------------------------');
        log.debug('Add Relation: ' + parent.id + '->' + child.id, parentType);
    }
    // var isBiz = isBizDevice(parent.id);
    var isBiz = parentType == TYPE_BIZ;
    var bizList = parent.getBizList(isBiz);

    _addCIRelation(bizList, parent, child);

    // Add the one-one relation
    if (!isBiz) {
        doAddRelationBSG(parent.id, child.id, 1, isBiz);
    }
}

function _addCIRelation(bizList, parent, child) {
    var hash = makeHash(parent.id, child.id);
    var biz;
    var k;
    for (k = 0; k < bizList.length; k++) {
        biz = bizList[k];
        if (child.id == biz.id) {
            continue;
        }

        hash[biz.id] = true;
        addParentChildBsg(biz, child, 1, hash);
    }
}

// Add/Update bsg level by level
function addParentChildBsg(biz, child, level, hash) {
    if (isDebug()) {
        log.debug('addParentChildBsg: ' + biz.id + '->' + child.id);
    }

    if (biz.id == child.id) {
        return;
        // var msg = 'Error found! Same Biz-Child: ' + biz.id;
        // print(msg);
        // printStack();
    }

    if (isDebug()) {
        log.debug('addParentChildBsg: biz=', biz.id, ', child=', child.id, ', biz level=', biz.level, 'child level=', child.level);
    }

    var toLevel = biz.level + level;
    // Need not to save bsg which's level is more than MAX Level. 
    if (toLevel > MAX_LEVEL) {
        return;
    }

    // find biz-child
    // var bsg = getBsg(biz, child);
    var bsg = child.getBsg(biz);

    if (!bsg) { // no bsg before, add it
        doAddRelationBSG(biz.id, child.id, toLevel, true);
    } else if (bsg.level > toLevel) { // bsg level is greater than new one, update it
        bsg.level = toLevel;
        bsg.doUpdate();
    } else { // bsg level is not greater than new one, keep unchanged.
        return;
    }

    // Added and updated bsg, need to update child ones
    if (toLevel < MAX_LEVEL) {
        var childList = child.filterChildList(hash);
        // print('childList:', j(childList));
        var k;
        for (k = 0; k < childList.length; k++) {
            addParentChildBsg(biz, childList[k], level + 1, hash);
        }
    }
}

/** ----------------------------- Delete Relation  --------------------------------- */
function deleteCIRelationList(parentId, childIdList, parentType) {
    var k = 0;
    var newList = filterCIRelationDelete(parentId, childIdList);
    var parent = new CI(parentId);
    for (k = 0; k < newList.length; k++) {
        deleteCIRelation(parent, new CI(newList[k], 0), parentType);
    }
}

/**
 * Delete child CIs of parent CI
 * The parameter childrenCI is an array including the CI logical name.
 */
function deleteCIRelation(parent, child, parentType) {
    if (isDebug()) {
        log.debug('---------------------------------------------------------');
        log.debug('Delete Relation: ' + parent.id + '->' + child.id, parentType);
    }
    // var isBiz = isBizDevice(parent.id);
    var isBiz = TYPE_BIZ == parentType;

    // get the affected business service
    var bizList = parent.getBizList(isBiz);

    // No biz affected
    if (!isBiz) {
        var bsg = child.getBsg(parent);
        if (bsg) {
            bsg.doDelete();
        }
    }

    var k;
    var biz;
    var hash;
    var matrix;
    for (k = 0; k < bizList.length; k++) {
        biz = bizList[k];

        hash = makeHash(parent.id, child.id);
        matrix = new Matrix(biz, child);

        addParentToMatrix(matrix, biz, child, MAX_LEVEL, hash);
        addChildToMatrix(matrix, biz, child, biz.level + 1, hash);

        if (isDebug()) {
            log.debug('Delete Matrix: ' + j(matrix.matrix));
        }

        doUpdateRelationBsg(matrix.list, matrix.calc());
    }
}

/**
 * @param {*} p The parent business service
 * @param {*} c The child node
 * @param {*} level The level biz to child node
 */
function addChildToMatrix(matrix, biz, c, level, hash) {
    if (isDebug()) {
        log.debug('>>> Add child to matrix: ', c.id, ', level=', level);
    }

    if (level > MAX_LEVEL) {
        return;
    }
    var bsgLevel = c.getBizLevel(biz);

    if (bsgLevel != level) {
        matrix.set(biz.index, c.index, bsgLevel);
    } else {
        var childList = c.filterChildList(hash);
        var k;
        var child;
        for (k = 0; k < childList.length; k++) {
            child = childList[k];
            child = matrix.add(child);
            matrix.set(c.index, child.index, 1);
            addParentToMatrix(matrix, biz, child, MAX_LEVEL, hash);
            addChildToMatrix(matrix, biz, child, level + 1, hash);
        }
    }

    if (isDebug()) {
        log.debug('<<< Add child to matrix: end of ', c.id, ', level=', level);
    }
}

function addParentToMatrix(matrix, biz, c, maxLevel) {
    if (isDebug()) {
        log.debug('>>> Add parent to matrix: ', c.id, ', level=', maxLevel);
    }

    var parentList = c.getParentList();
    if (isDebug()) {
        log.debug('addParentToMatrix: parentList1=', j(_.map(parentList, function(item) {
            return item.id;
        })));
    }
    var newList = [];
    var k;
    var parent;
    var bsg;
    for (k = 0; k < parentList.length; k++) {
        parent = parentList[k];
        if (biz.id == parent.id) {
            continue;
        }
        // No bsg means, no path  biz->parent->ci
        // bsg.level>=level means, the max path level exceeded
        // skip both
        bsg = parent.getBsg(biz);
        if (!bsg || bsg.level >= maxLevel) {
            continue;
        }

        newList.push(parent);
    }

    // sort by level, if a mini path found, then skip others
    newList.sort(function(a, b) {
        return a.bsg.level > b.bsg.level;
    });

    if (isDebug()) {
        log.debug('addParentToMatrix: parentList2=', j(_.map(parentList, function(item) {
            return item.id;
        })));
    }

    var ci;
    for (k = 0; k < newList.length; k++) {
        parent = newList[k];

        ci = matrix.ci(parent);
        if (ci) {
            matrix.set(ci.index, c.index, 1);
            continue;
        }

        // add to matrix
        matrix.add(parent);
        matrix.set(parent.index, c.index, 1);

        // bsg level is greater than biz level, may be a loop from c to parent
        // otherwise, no need to check
        bsg = parent.getBsg(biz);
        if (bsg.level > 1 && bsg.level > biz.level) {
            addParentToMatrix(matrix, biz, parent, maxLevel - 1);
        } else {
            matrix.set(biz.index, parent.index, bsg.level);
            break;
        }
    }

    if (isDebug()) {
        log.debug('<<< Add parent to matrix: end of ', c.id, ', level=', maxLevel);
    }
}

function doUpdateRelationBsg(ciList, levelList) {
    if (isDebug()) {
        var debugList = _.map(ciList, function(item) {
            return item.id;
        });
        log.debug('doUpdateRelationBsg: ciList=' + j(debugList));
        log.debug('doUpdateRelationBsg: levelList=' + j(levelList));
    }

    if (!ciList || ciList.length < 2) {
        return;
    }

    var parent = ciList[0];
    var k;
    var item;
    var bsg;
    var level;
    for (k = 1; k < ciList.length; k++) {
        item = ciList[k];
        level = levelList[k];

        bsg = item.getBsg(parent);
        if (bsg && bsg.level != levelList[k]) {
            if (!level || level > MAX_LEVEL) {
                if (isDebug()) {
                    log.debug('Delete BSG: ' + bsg.parent + '->' + bsg.child);
                }
                bsg.doDelete();
                item.bsg = null;
            } else {
                bsg.level = levelList[k];
                bsg.doUpdate();

                if (isDebug()) {
                    log.debug('Update BSG: ' + bsg.parent + '->' + bsg.child + ', level=' + bsg.level);
                }
            }
        }
    }
}

/** ----------------------------- Tasks And Triggers --------------------------------- */

function saveCIRelationBSGAddedTask(parent, addedChildrenList) {
    var parentType = getCIType(parent);
    saveCIRelationBSGTask(parent, addedChildrenList || [], [], CRB_TASK_ACTION_ADD, parentType);
}

function saveCIRelationBSGDeletedTask(parent, deletedChildrenList) {
    var parentType = getCIType(parent);
    saveCIRelationBSGTask(parent, [], deletedChildrenList || [], CRB_TASK_ACTION_DELETE, parentType);
}

function saveCIRelationBSGUpdatedTask(parent, addedChildrenList, deletedChildrenList) {
    var parentType = getCIType(parent);
    saveCIRelationBSGTask(
        parent,
        addedChildrenList || [],
        deletedChildrenList || [],
        CRB_TASK_ACTION_UPDATE,
        parentType
    );
}

/**
 *  Save cirelationbsgtask
 */
function saveCIRelationBSGTask(parent, addedChildrenList, deletedChildrenList, action, parentType) {
    var addedLength = addedChildrenList == null ? 0 : addedChildrenList.length;
    var deletedLength = deletedChildrenList == null ? 0 : deletedChildrenList.length;

    if (action != CRB_TASK_ACTION_DELETE_CICASCADE && addedLength <= 0 && deletedLength <= 0) {
        return;
    }

    var task = new SCFile('cirelationbsgtask');
    task['parent'] = parent;
    task['child.added'] = addedChildrenList;
    task['child.deleted'] = deletedChildrenList;
    task['status'] = CRB_TASK_STATUS_QUEUED;
    task['action'] = action;
    task['parent.type'] = parentType;

    var number = new Datum();
    var rc = new Datum();
    funcs.rtecall('getnumber', rc, number, 'cirelationbsgtask');
    task['id'] = number;

    task['created.time'] = funcs.tod();

    task.doInsert();
}

/**
 *  Fetch the queued task from cirelationbsgtask
 *  Process the task to calculate cirelationbsg by action
 *  When processed, set the status to
 */
function processCIRelationBSGTask() {
    var task = new SCFile('cirelationbsgtask');
    var sql = 'status=' + CRB_TASK_STATUS_QUEUED;
    var rc = task.doSelect(sql);

    while (rc == RC_SUCCESS) {
        task['status'] = CRB_TASK_STATUS_FINISHED;

        switch (task['action']) {
            case CRB_TASK_ACTION_ADD:
                addCIRelationList(task['parent'], task['child.added'] == null ? [] : task['child.added'].toArray(), task['parent.type']);
                break;
            case CRB_TASK_ACTION_DELETE:
                deleteCIRelationList(task['parent'], task['child.deleted'] == null ? [] : task['child.deleted'].toArray(), task['parent.type']);
                break;
            case CRB_TASK_ACTION_UPDATE:
                deleteCIRelationList(task['parent'], task['child.deleted'] == null ? [] : task['child.deleted'].toArray(), task['parent.type']);
                addCIRelationList(task['parent'], task['child.added'] == null ? [] : task['child.added'].toArray(), task['parent.type']);
                break;
            case CRB_TASK_ACTION_DELETE_CICASCADE:
                deleteCICascadeRelations(task['parent'], task['parent.type']);
                break;
            default:
                task['status'] = CRB_TASK_STATUS_EXCEPTION;
        }

        task['processed.time'] = funcs.tod();
        task.doUpdate();
        rc = task.getNext();
    }
}

function deleteCICascadeRelations(id, parentType) {
    var hash = {};
    var ci = new CI(id);
    // delete children
    var childList = ci.getChildList();
    var k;
    for (k = 0; k < childList.length; k++) {
        deleteCIRelation(new CI(id), new CI(childList[k].id), parentType);
    }

    // delete parent-relation
    var parentList = ci.getParentList();
    var parentId;
    for (k = 0; k < parentList.length; k++) {
        parentId = parentList[k].id;
        deleteCIRelation(new CI(parentId), new CI(id), getCIType(parentId));
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
 *  
 */
function beginProcessTask() {
    return processCIRelationBSGTask();
}

/**
 *  Trigger to add the delete cirelationbsg task when delete the CI directly, invoked by device post delete trigger
 *  When CI is deleted, the trigger is switched off in RAD am.cascade.update.wrapper
 *  Then it will invoke RAD process.update.config.record to update cirelationship cascade defined in cascadeupd
 *  So we have to define one special delete task action for deleting CI cascade relations.
 */
function triggerDeleteCICascadeRelations(logical_name, type) {
    var parentType = type == 'bizservice' ? TYPE_BIZ : TYPE_OTHER;
    saveCIRelationBSGTask(logical_name, [], [], CRB_TASK_ACTION_DELETE_CICASCADE, parentType);
}

/**
 *  Filter add if the CI relation need to be recalculated
 */
function filterCIRelationAdd(parentId, childIdList) {
    return filterCIRelationAction(CRB_TASK_ACTION_ADD, parentId, childIdList);
}

/**
 *  Filter delete if the CI relation need to be recalculated
 */
function filterCIRelationDelete(parentId, childIdList) {
    return filterCIRelationAction(CRB_TASK_ACTION_DELETE, parentId, childIdList);
}

/**
 *  Get the count of the relation from database directly
 *  When duplicate, it is more than 1
 */
function getCIRelationCount(parentId, childId) {
    var sql = 'logical.name="' + parentId + '" and related.cis="' + childId + '"';
    var count = $('!cirelationship').fields("logical.name").count(sql);
    return count;
}

/**
 *  Filter if the CI relation need to be recalculated
 *  Only invoke after the relation is updated to db but not synchronized in matrix
 *  If count = 1 for add or count = 0 for delete, it means there is duplicated and no need to calculate and filter it
 */
function filterCIRelationAction(action, parentId, childIdList) {
    var filteredChildrenCI = [];
    var i;
    var childId;
    var count;
    var compare_count;
    for (i = 0; i < childIdList.length; i++) {
        childId = childIdList[i];
        count = getCIRelationCount(parentId, childId);
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
            filteredChildrenCI.push(childId);
        }
    }

    return filteredChildrenCI;
}

/**
 *  Generate cirelationbsg records from CI Relation
 */
function buildRelation() {
    var count = 0;
    $('!cirelationship')
        .fields("logical.name", "related.cis")
        .select('true')
        .iterate(function(item) {
            addCIRelationList(item.logical_name, item.related_cis.toArray(), getCIType(item.logical_name));
            count++;

            if (count % 1000 == 0) {
                print('processed', count, 'records');
            }
        });

    print('Total processed', count, 'records');
}

/**
 *  Before execute this function, cleanup all records in cirelationbsg.
 *  Direct to operate database to delete records: delete from CIRELATIONBSGM1
 *  Then execute this function to generate cirelationbsg records from CI Relation
 */
function run() {
    new SCFile('cirelationbsg').doPurge('true');

    var begin = Date.now();
    buildRelation();
    var end = Date.now();
    print('Total Time:', (end - begin) / 1000.0, 's');
}


function addRelation(p, c, type) {
    return addCIRelation(new CI(p), new CI(c), type);
    // return lib.BSGCalc.addCIRelationList(p, [c]);
}


function deleteRelation(p, c, type) {
    return deleteCIRelation(new CI(p), new CI(c), type);
    // return lib.BSGCalc.deleteCIRelationList(p, [c]);
}