var cilistmap;            // JS Object, CI logical name -> Number
var cinumbermap;          // JS Object, Number -> CI logical name
var cicount;              // The number of CIs used in cirelationship
var matrix_parent_child;  // JS Object, parent number -> child number array
var matrix_child_parent;  // JS Object, child number -> parent number array

var log = getLog("[BSGRelationsStructure]");


function initializeCIRelations() {
    if (cicount != null && cilistmap != null && cinumbermap != null && matrix_parent_child != null && matrix_child_parent != null) {
        return;
    }

    log.info("Initializing CI Relation Matrix is starting ...");

    cilistmap = {};
    cinumbermap = {};
    cicount = 0;
 
    matrix_parent_child = {};
    matrix_child_parent = {};
    
    var mapped = {}
 
    lib.c.$('cirelationship').select("true").iterate(function (item) {
        if (item["related.cis"] != null) {
            var parent_index = cilistmap[item["logical.name"]];
            if (parent_index == null) {
                parent_index = cicount;
                cilistmap[item["logical.name"]] = parent_index;
                cinumbermap[parent_index] = item["logical.name"];
                cicount++;
            }
        
            var lng = funcs.lng(item["related.cis"]);
            var i, child_ci, child_index, key;
            for (i=0; i<lng; i++) {
                child_ci = item["related.cis"][i];
                if (child_ci == null) {
                    continue;
                }
            
                child_index = cilistmap[child_ci];
                if (child_index == null) {
                    child_index = cicount;
                    cilistmap[child_ci] = child_index;
                    cinumbermap[child_index] = child_ci;
                    cicount++;
                }
            
                if (matrix_parent_child[parent_index] == null) {
                    matrix_parent_child[parent_index] = [];
                }
            
                if (matrix_child_parent[child_index] == null) {
                    matrix_child_parent[child_index] = [];
                }
                
                // skip duplicate relationship
                key = parent_index + ":" + child_index;
                if (mapped[key] == null) {
                    mapped[key] = true;
                    matrix_parent_child[parent_index].push(child_index);
                    matrix_child_parent[child_index].push(parent_index);
                }
            }
        }
    })
   
    log.info("Initializing CI Relation Matrix is finished.");
}  
  
function getParentChildMatrix() {
    return matrix_parent_child;
}
  
function setParentChildMatrix(matrix) {
    matrix_parent_child = matrix;
}
  
function getChildParentMatrix() {
    return matrix_child_parent;
}
  
function setChildParentMatrix(matrix) {
    matrix_child_parent = matrix;
}
  
function getCIListMap() {
    return cilistmap;
}
  
function getCINumberMap() {
    return cinumbermap;
}
  
function getCICount() {
    return cicount;
}

function checkAddNewCI(ci) {
    var cinumber = cilistmap[ci];
    if (cinumber == null) { // add new ci
        cilistmap[ci] = cicount;
        cinumbermap[cicount] = ci;
        cicount++;
    }
}

function checkAddNewCIList(cilist) { // cilist is an array including ci
    for (var i=0; i<cilist.length; i++) {
        checkAddNewCI(cilist[i]);
    }
}

/**
 *  Return the direct child CI logical name list from matrix
 */
function getChildCINameListInMatrix(parentCI) {
    var childNameList = [];
    var parent = cilistmap[parentCI];
    if (parent != null) {
        var childList = matrix_parent_child[parent];
        if (childList != null) {
            var i, childName;
            for (i=0; i<childList.length; i++) {
                childName = cinumbermap[childList[i]];
                childNameList.push(childName);
            }
        }
    }
    
    return childNameList;
}

/**
 *  Return the direct parent CI logical name list from matrix
 */
function getParentCINameListInMatrix(childCI) {
    var parentNameList = [];
    var child = cilistmap[childCI];
    if (child != null) {
        var parentList = matrix_child_parent[child];
        if (parentList != null) {
            var i, parentName;
            for (i=0; i<parentList.length; i++) {
                parentName = cinumbermap[parentList[i]];
                parentNameList.push(parentName);
            }
        }
    }
    
    return parentNameList;
}
  
