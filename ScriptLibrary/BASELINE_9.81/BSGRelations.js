var SEP_CHAR = ';';
var _e = lib.StringUtil.escapeAllStr;

// Add a relation
// if the relation is new
//	add it an add related
// else
//	update levels of related 
function addRelation(parent, child, level) {
	log.info('addRelation', parent, child, level);
	
    if (parent === child) return;

    var file = findItemByName(parent, child);
    if(file) {
		log.info('addRelation, file.level, level==', file.level, level);
	}
	
    if (file == null) { // not exist
        doAddRelation(parent, child, level);
        if (level == 1) {
            addRelatedRelation(parent, child, level);
        }
        return;
    } else if (file.level > level) { // relation exists, check and update levels 
        file.level = level;
        file.doUpdate();
        if (level == 1) {
            updateLevelsByAdd(parent, child, level);
        }
    }
}

function doAddRelation(parent, child, level) {
	log.info('doAddRelation', parent, child, level);
	
    var file = new SCFile('cirelationbsg');

    file.name = makeName(parent, child);
    file.parent = parent;
    file.child = child;
    file.level = level;

    file.doInsert();

    return file;
}

function makeName(parent, child) {
    return parent + SEP_CHAR + child + SEP_CHAR;
}


function findItemByName(parent, child) {
    var name = makeName(parent, child);
    var sql = 'name="' + _e(name) + '"';
    var item = lib.c.$('cirelationbsg').select(sql).uniqueResult();
    return item;
}

function addRelatedRelation(parent, child, level) {
	log.info('addRelatedRelation', parent, child, level);
	
    var eparent = _e(parent);
    var echild = _e(child);

    // add a, b-xxx
    var sql = ' select a1.id, a1.level, a1.child from cirelationbsg a1 where a1.parent="' + echild + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var level1 = item[1];
        var childChild = item[2];

        addRelation(parent, childChild, level1 + level);
    });

    // update xxx - a, b
    var sql = ' select a1.level, a1.parent from cirelationbsg a1 where a1.child="' + eparent + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var level1 = item[0];
        var parentParent = item[1];
        addRelation(parentParent, child, level1 + level);
    });

    // update xxx - a - b - xxx
    var sql = ' select a1.parent, a2.child, a1.level, a2.level from cirelationbsg a1, cirelationbsg a2 '
        + ' where a1.child="' + eparent + '" and a2.parent="' + echild + '"';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var pp = item[0];
        var cc = item[1];
        var level1 = item[2];
        var level2 = item[3];

        addRelation(pp, cc, level1 + level + level2);
    });
}

function updateLevelsByAdd(parent, child, level) {
	log.info('updateLevelsByAdd', parent, child, level);
    if (parent == child) return;

    var eparent = _e(parent);
    var echild = _e(child);

    // update a - b - xxx
    var sql = ' select a1.id, a1.level, a2.level from cirelationbsg a1 join cirelationbsg a2 on (a1.child=a2.child) '
        + ' where a1.parent="' + eparent + '" '
        + ' and a2.parent="' + echild + '" and a1.level>a2.level+' + level;

    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
    	log.info('sql1', item);
        var id = item[0];
        var level1 = item[1];
        var level2 = item[2];

        lib.c.$('cirelationbsg').select('id="' + id + '"').iterate(function (item) {
        	log.info('=>item:', item);
            item.level = level2 + level;
            item.doUpdate();
        });
    });

    // update xxx - a - b
    var sql = ' select a1.id, a1.level, a2.level from cirelationbsg a1 join cirelationbsg a2 on (a1.parent=a2.parent) '
        + ' where a1.child="' + echild + '" '
        + ' and a2.child="' + eparent + '" and a1.level>a2.level+' + level;

    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
    	log.info('sql2', item);
    	
        var id = item[0];
        var level1 = item[1];
        var level2 = item[2];

        lib.c.$('cirelationbsg').select('id="' + id + '"').iterate(function (item) {
        	log.info('=>item:', item);
            item.level = level2 + level;
            item.doUpdate();
        });
    });

    // update xxx - a - b - xxx
    var sql = ' select a1.id, a2.level, a3.level from cirelationbsg a1 join cirelationbsg a2 on (a1.parent=a2.parent) join cirelationbsg a3 on (a1.child=a3.child) '
        + ' where a2.child="' + eparent + '" '
        + ' and a3.parent="' + echild + '" and a1.level>a3.level+a2.level+' + level;

    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
    	log.info('sql3', item);
    	
        var id = item[0];
        var level2 = item[1];
        var level3 = item[2];

        lib.c.$('cirelationbsg').select('id="' + id + '"').iterate(function (item) {
        	log.info('=>item:', item);
            item.level = level3+level2 + level;
            item.doUpdate();
        });
    });
}


function deleteRelation(parent, child, level) {
	log.info('deleteRelation', parent, child, level);
    if (parent == child) return;

    if (level == 1) {
        LEVAL_CACHE_COUNT = 0;
        LEVAL_CACHE = {};
    }

    var file = findItemByName(parent, child);
    if (file == null || file.level < level) {
        return;
    }

    var minLevel = calcMinLevel(parent, child);
    if (minLevel > 0) {
        if (minLevel <= file.level) { // same level exists
            return;
        } else {
            updateLevelsByDelete(parent, child, minLevel); // level to be larger
            return;
        }
    } else {
        file.doDelete();

        if (level == 1) {
            deleteRelatedRelation(parent, child, level);
        }
    }
}

function deleteRelatedRelation(parent, child, level) {
	log.info('deleteRelatedRelation', parent, child, level);
	
    if (parent == child) return;

    var eparent = _e(parent);
    var echild = _e(child);

    // delete a, b-xxxx
    var sql = ' select a1.level, a1.child from cirelationbsg a1 where a1.parent="' + echild + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var level1 = item[0];
        var childChild = item[1];
        deleteRelation(parent, childChild, level + level1);
    });

    // delete xxx - a,  b
    var sql = ' select a1.level, a1.parent from cirelationbsg a1 where a1.child="' + eparent + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var level1 = item[0];
        var pp = item[1];

        deleteRelation(pp, child, level + level1);
    });

    // delete xxx - a, b - xxx
    var sql = ' select a1.level, a2.level, a1.parent, a2.child from cirelationbsg a1, cirelationbsg a2'
        + ' where a1.child="' + eparent + '" '
        + ' and a2.parent="' + echild + '" ';

    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var level1 = item[0];
        var level2 = item[1];

        var pp = item[2];
        var cc = item[3];
        deleteRelation(pp, cc, level1 + level2 + level);
    });
}


var LEVAL_CACHE = {};
var LEVAL_CACHE_COUNT = 0;

function calcMinLevel(parent, child) {
    var stack = [child];
    var level = findParentLevel(child, parent, stack, 1);
    return level;
}


function findParentLevel(child, parent, stack, index) {
    var cache = LEVAL_CACHE[makeName(parent, child)];
    if (cache) {
        return cache;
    }

    var level = _findParentLevel(child, parent, stack, index);
    if (level < 4) {
        LEVAL_CACHE[makeName(parent, child)] = level;
    }

    return level;
}

function _findParentLevel(child, parent, stack, index) {
    if (!index) { index = 1 };
    var list = [];
    var findParent = false;

    lib.c.$('cirelationbsg').select('select parent from cirelationbsg where child="' + _e(child) + '" and level=1').iterate(function (item) {
        var p = item[0];
        if (p == parent) {
            if (index > 1) {
                findParent = true;
                return true;
            }
        } else {
            list.push(p);
        }
    });

    if (findParent) {
        return 1;
    }

    var saveLevel = 1001;
    for (var k = 0; k < list.length; k++) {
        var cc = list[k];

        var isLoop = false;
        for (var i = 0; i < index; i++) { // skip loop relation
            if (cc == stack[i]) {
                isLoop = true;
                break;
            }
        }

        if (isLoop) break;

        stack[index] = cc;

        var c = findParentLevel(cc, parent, stack, index + 1);
        if (c > 0) {
            if (c < saveLevel) saveLevel = c;
        }
    }

    if (saveLevel > 1000) {
        return -1;
    }

    return 1 + saveLevel;
}

function doUpdateLevelsByDelete(parent, child, level, checkLevel) {
	log.info('doUpdateLevelsByDelete', parent, child, level, checkLevel);
    if (parent == child) return;

    var item = findItemByName(parent, child);
    if (item == null) {
        return false;
    }

    if (item.level == 1 && !level) {
        return false;
    }

    if (checkLevel && item.level != checkLevel) {
        return false;
    }

    if (!level) {
        level = calcMinLevel(parent, child);
    }

    if (item.level != level) {
        item.level = level;

        item.doUpdate();

        return true;
    }

    return false;
}


function updateLevelsByDelete(parent, child, level) {
	log.info('updateLevelsByDelete', parent, child, level);
    if (parent == child) return;

    if (!doUpdateLevelsByDelete(parent, child, level)) {
        return;
    }

    var eparent = _e(parent);
    var echild = _e(child);

    // update a, b, -xxxx
    var sql = ' select a1.id, a1.level, a1.child from cirelationbsg a1 where a1.parent="' + echild + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var cc = item[2];
        var level1 = item[1];
        doUpdateLevelsByDelete(parent, cc, null, 1 + level1);
    });

    // update xxx - a - b
    var sql = ' select a1.level, a1.parent from cirelationbsg a1 where a1.child="' + eparent + '" ';
    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var pp = item[1];
        var level1 = item[0];
        doUpdateLevelsByDelete(pp, child, null, null, 1 + level1);
    });


    // update xxx - a - b - xxx
    var sql = ' select a1.level, a2.level, a1.parent, a2.child from cirelationbsg a1, cirelationbsg a2'
        + ' where a1.child="' + eparent + '" '
        + ' and a2.parent="' + echild + '" ';

    lib.c.$('cirelationbsg').select(sql).iterate(function (item) {
        var pp = item[2];
        var cc = item[3];
        var level1 = item[0];
        var level2 = item[1];
        doUpdateLevelsByDelete(pp, cc, null, 1 + level1 + level2);
    });
}

//////////////////////////////////////////////////////////////////////////////////
////////                    Triggers Calls                            ////////////
//////////////////////////////////////////////////////////////////////////////////
function triggerDeleteDevice(name) {
    lib.c.$('cirelationbsg').select('name like "*' + name + SEP_CHAR + '*"').iterate(function (item) {
        item.doDelete();
    });
}

function triggerDeleteRelation(relation) {
    var parent = relation['logical.name'];
    var childList = relation['related.cis'].toArray();
    var type = relation['relationship.subtype'];

    for (var k = 0; k < childList.length; k++) {
        doTriggerDeleteChildRelation(parent, childList[k])
    }
}

function doTriggerDeleteChildRelation(parent, child) {
    var count = lib.c.$('cirelationship').count('logical.name="' + parent + '" and related.cis="' + child + '"');
    if (count > 0) {
        return;
    }

    deleteRelation(parent, child, 1);
}


function triggerUpdateRelation(_new, _old) {
    if (_new.logical_name != _old.logical_name) {
        deleteRelation(_old);
        addRelation(_new);
    }
    else {
        doTrigerUpdateRelation(_new, _old);
    }
}

function doTrigerUpdateRelation(_new, _old) {
    var diff = lib.createRelations.diffArray(_new['related.cis'].toArray(), _old['related.cis'].toArray());
    var added = diff.add;
    var deleted = diff.del;

    var parent = _new.logical_name;
    var type = _new['relationship.subtype'];
    for (var k = 0; k < deleted.length; k++) {
        var child = deleted[k];
        deleteRelation(parent, child, 1);
    }

    var parent = _new.logical_name;
    for (var k = 0; k < added.length; k++) {
        var child = added[k];
        addRelation(parent, child, 1);
    }
}


function triggerAddRelation(relation) {
    var parent = relation['logical.name'];
    var childList = relation['related.cis'].toArray();
    var type = relation['relationship.subtype'];

    for (var k = 0; k < childList.length; k++) {
        addRelation(parent, childList[k], 1);
    }
}


function buildRelation() {
    var count = 0;
    lib.c.$('cirelationship').select('true').iterate(function (item) {
        triggerAddRelation(item);
        count++;

        if (count % 1000 == 0) {
            print('processed', count, 'records');
        }
    });

    print('Total processed', count, 'records');
}

function run() {
	new SCFile('cirelationbsg').doPurge('true');
	
    var begin = new Date().getTime();
    buildRelation();
    var end = new Date().getTime();
    print('Total Time:', (end - begin) / 1000.0, 's');
}

// var log = getLog('xxx.bsg.relation');
var log = {info:function(){}}

