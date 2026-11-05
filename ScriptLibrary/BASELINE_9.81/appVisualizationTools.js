// exit field of application
const EXITS = ["normal", "error", "exit", "one.rec", "empty", "key.dupl", "key.null", "all.null"];


/**
 * Generate rad grapch 
 *
 * @strApplication:	Rad name
 * @strLabel:		Graph label
 * @bIngoreError:	Ignore "$error" exit
 */
function getGraph(strApplication, strLabel, bIngoreError) {
    // all application panels
    var panels = [];

    var graph = new lib.VisualizationTools.Graph(strApplication, strLabel);

    var strPanel;

    var fApplication = new SCFile("application", SCFILE_READONLY);
    fApplication.setFields(["label", "format"]);
    var strSelect = "application=\"" + strApplication + "\"";

    var rc = fApplication.doSelect(strSelect);
    if (rc != RC_SUCCESS) {
        funcs.log(`application panels not found of rad "${strApplication}"!`);
        return graph.output();
    }

    // node	    
    var param;
    do {
        strPanel = funcs.str(fApplication["label"]);
        param = {};
        if (strPanel == "parameter") {
            param.shape_type = 3; // start shape
        } else if ("decision" == fApplication["format"]) {
            param.shape_type = 2; // decision shape
        }
        graph.addNode(strPanel, strPanel, fApplication["format"], param);
        panels.push(strPanel);
    } while (fApplication.getNext() == RC_SUCCESS);

    var typeCharacter = lib.DataTypeConst.typeCharacter();
    var typeArray = lib.DataTypeConst.typeArray();

    // edge
    fApplication = new SCFile("application", SCFILE_READONLY);
    rc = fApplication.doSelect(strSelect);
    do {
        strPanel = funcs.str(fApplication["label"]);

        var jsonApp = lib.debugUtils.fileToJson(fApplication);

        var i;
        for (i = 0; i < EXITS.length; i++) {
            var strExitPanel;
            var appExit = fApplication[EXITS[i]];

            // handle $ exit specially		    
            if (appExit == null && strPanel != "parameter") {
                if (jsonApp && jsonApp.instance) {
                    appExit = jsonApp.instance[EXITS[i]];
                }
            }

            // skip normal exit error panel, because error exit of most panels are "exit.error.msg".
            // except "exit.normal" to make sure show edge link to "exit.error.msg" once. 
            var skip = bIngoreError && EXITS[i] == "error" && strPanel != "exit.normal";

            if (funcs.type(appExit) == typeCharacter && !skip) {

                strExitPanel = funcs.str(appExit);

                // normal exit of parameter panel is start panel
                if (strPanel == "parameter") {
                    if (EXITS[i] == "normal" && strExitPanel.toLocaleLowerCase() == "$normal") {
                        strExitPanel = "start";
                    } else {
                        continue;
                    }
                }

                // handle $normal and $error specially
                if (strExitPanel == "0" || strExitPanel == "$2") {
                    strExitPanel = "$normal";
                } else if (strExitPanel == "1" || strExitPanel == "$3") {
                    strExitPanel = "$error";
                }

                if (panels.indexOf(strExitPanel) == -1) {
                    param = {};
                    if (strExitPanel.startsWith("$")) {
                        param.shape_type = 3; // end shape
                    }
                    graph.addNode(strExitPanel, strExitPanel, null, param);
                    panels.push(strExitPanel);
                }
                graph.addEdge(strPanel + "-" + EXITS[i], strPanel, strExitPanel, EXITS[i]);
            } else if (funcs.type(appExit) == typeArray) {
                var j;
                var jlength = funcs.lng(appExit);
                for (j = 0; j < jlength; j++) {
                    strExitPanel = funcs.str(appExit[j]);

                    // handle $ exit specially          
                    if (strExitPanel == null) {
                        if (jsonApp && jsonApp.instance && jsonApp.instance[EXITS[i]]) {
                            strExitPanel = jsonApp.instance[EXITS[i]][j];
                        }
                    }

                    if (!strExitPanel) {
                        continue;
                    }

                    // handle $normal and $error specially
                    if (strExitPanel == "0" || strExitPanel == "$2") {
                        strExitPanel = "$normal";
                    } else if (strExitPanel == "1" || strExitPanel == "$3") {
                        strExitPanel = "$error";
                    }

                    if (panels.indexOf(strExitPanel) == -1) {
                        param = {};
                        if (strExitPanel.startsWith("$")) {
                            param.shape_type = 3; // end shape
                        }
                        graph.addNode(strExitPanel, strExitPanel, null, param);
                        panels.push(strExitPanel);
                    }

                    // special handle for rad "display"
                    if (strApplication == "display" && strExitPanel == "co" &&
                        (strPanel == "fdisp.1" || strPanel == "show.rio")) {
                        continue;
                    }

                    graph.addEdge(strPanel + "-" + EXITS[i] + "[" + j + "]", strPanel, strExitPanel, EXITS[i] + "[" + j + "]" + ": " + funcs.str(fApplication["condition"][j]));
                }
            }
        }

    } while (fApplication.getNext() == RC_SUCCESS);

    return graph.output();
}

// print(getGraph("apm.save.problem"));