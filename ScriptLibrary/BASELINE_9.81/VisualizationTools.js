/**
 * Create graph
 *
 * @strGraphId:		Graph id
 * @strFocusedNode:	Focus node
 */
function Graph(strGraphId, strFocusedNode) {
    this.gxl = new XML("gxl");
    this.graph = this.gxl.addElement("graph");
    this.graph.addAttribute("id", strGraphId);
    this.focusedNode = strFocusedNode;

    this.addNode = function(strNodeId, strLabel, strFormat, param) {
        var newNode = this.graph.addElement("node");
        newNode.addAttribute("id", strNodeId);

        var newAttribute = newNode.addElement("attr");
        newAttribute.addAttribute("name", "Viz");
        if (strFormat != null) {
            newAttribute.addElement("balloon").setValue(strFormat);
        }

        var newLabel = newAttribute.addElement("label");
        newLabel.addAttribute("font", "Tahoma");
        newLabel.addAttribute("style", "0");
        newLabel.addAttribute("size", "11");
        newLabel.setValue(strLabel);

        var newShape = newAttribute.addElement("shape");
        if (param && param["shape_type"]) {
            newShape.addAttribute("type", param["shape_type"]);
        } else {
            newShape.addAttribute("type", "0");
        }
        newShape.addAttribute("width", "80");
        newShape.addAttribute("height", "30");
        var strColor = strNodeId == this.focusedNode ? "#CCFF66" : "#CCCCCC";
        newShape.addAttribute("color", strColor);

        var newAction = newAttribute.addElement("action");
        newAction.addAttribute("forcemenu", "true");
        newAction.addElement("action").setValue("goto");
        newAction.addAttribute("type", "goto");
        newAction.addAttribute("label", "Go To...");
    };

    this.addEdge = function(strEdgeId, strFrom, strTo, strLabel) {
        var newEdge = this.graph.addElement("edge");
        newEdge.addAttribute("id", strEdgeId);
        newEdge.addAttribute("from", strFrom);
        newEdge.addAttribute("to", strTo);
        var newAttribute = newEdge.addElement("attr");
        newAttribute.addAttribute("name", "Viz");
        var newLabel = newAttribute.addElement("label");
        newLabel.addAttribute("font", "Tahoma");
        newLabel.addAttribute("style", "0");
        newLabel.addAttribute("size", "11");
        newLabel.setValue(strLabel);
        var newLine = newAttribute.addElement("line");
        newLine.addAttribute("style", "0");
        newLine.addAttribute("weight", "1");
        newLine.addAttribute("color", "#000000");
        newLine.addAttribute("end", "2");
    };

    this.output = function() {
        return this.gxl.getDocumentElement().toXMLString();
    };
}


/**
 * Generate Graph
 *
 * @nextField:		field of "next"
 * @conditionField:	field of "next condition"
 * @isFullMode:		true:full mode, false:compact mode
 */
function createGraph(fFile, nextField, conditionField, isFullMode) {
    // all the nodes
    var nodes = [];

    // find unique key
    var filename = funcs.filename(fFile);
    var keys = lib.dbdictHelper.getUniqueKey(filename);
    var key = keys[0];
    var name = fFile[key];

    // create graph
    var graph = new Graph(name, name);
    nodes.push(name);

    var param = {};
    if (filename == "wizard" && fFile.start) {
        param.shape_type = 3; // start shape
    } else {
        fFile = new SCFile(filename, SCFILE_READONLY);
        fFile.doSelect(`${key}="${name}"`);
        if (fFile[nextField] == null || funcs._null(fFile[nextField])) {
            param.shape_type = 3; // end shape
        }
    }
    graph.addNode(name, name, name, param);

    // add related nodes
    // var t0 = new Date();
    addPostNodes(graph, nodes, fFile, key, nextField, conditionField, isFullMode);
    addPreNodes(graph, nodes, fFile, key, nextField, conditionField, isFullMode);
    // var t1 = new Date();

    return graph.output();
}


/**
 * Add post related nodes
 */
function addPostNodes(graph, nodes, fFile, key, nextField, conditionField, isFullMode) {
    if (fFile[nextField] == null) {
        return;
    }

    var filename = funcs.filename(fFile);

    var i;
    var length = fFile[nextField].length();
    for (i = 0; i < length; i++) {
        var postName = fFile[nextField][i];
        if (postName == null) {
            continue;
        }

        if (!lib.ArrayUtil.contains(nodes, postName)) {
            nodes.push(postName);

            // get next node record
            var fPost = new SCFile(filename, SCFILE_READONLY);
            fPost.setFields([key, nextField]);
            var rc = fPost.doSelect(`${key}="${postName}"`);

            var param = {};
            if (rc == RC_SUCCESS && (fPost[nextField] == null || funcs._null(fPost[nextField]))) {
                param.shape_type = 3; // end shape
            }
            graph.addNode(postName, postName, postName, param);

            if (rc == RC_SUCCESS) {
                addPostNodes(graph, nodes, fPost, key, nextField, conditionField, isFullMode);

                // add post nodes in full mode
                if (isFullMode) {
                    addPreNodes(graph, nodes, fPost, key, nextField, conditionField, isFullMode);
                }
            }
        }

        // add edge
        var edgeLabel = funcs.str(fFile[conditionField][i]);
        graph.addEdge(fFile[key] + "-" + postName, fFile[key], postName, edgeLabel);
    }
}


/**
 * Add pre related nodes
 */
function addPreNodes(graph, nodes, fFile, key, nextField, conditionField, isFullMode) {
    var filename = funcs.filename(fFile);
    var name = fFile[key];
    var fPre = new SCFile(filename, SCFILE_READONLY);
    fPre.setFields([key, nextField]);

    var rc = fPre.doSelect(`${nextField}="${name}"`);
    while (rc == RC_SUCCESS) {
        var preName = fPre[key];

        if (!lib.ArrayUtil.contains(nodes, preName)) {
            nodes.push(preName);

            var param = {};
            if (filename == "wizard" && fPre.start) {
                param.shape_type = 3; // start shape
            }
            graph.addNode(preName, preName, preName, param);

            // add post nodes in full mode
            if (isFullMode) {
                addPostNodes(graph, nodes, fPre, key, nextField, conditionField, isFullMode);
            }

            addPreNodes(graph, nodes, fPre, key, nextField, conditionField, isFullMode);
        }

        // add edge in compact mode
        if (!isFullMode) {
            var index = lib.ArrayUtil.indexOf(fPre[nextField], name);
            var edgeLabel = funcs.str(fPre[conditionField][index]);
            graph.addEdge(preName + "-" + name, preName, name, edgeLabel);
        }

        rc = fPre.getNext();
    }
}