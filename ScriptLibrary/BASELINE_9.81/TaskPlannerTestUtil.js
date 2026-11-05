var lng=system.functions.lng;

function taskPlannerTestUtil() {
    var action = vars['$L.file']['action'];
    var param = vars['$L.file']['parameter'];
    //convert to JSON object
    param = eval("(" + param + ")");
    var taskplannertestutil = new SCFile("taskplannertestutil");
    taskplannertestutil['result'] = "false";
    var sql = "";

    if (action == "GetRequestTaskOutPutsFields") {
        var requestId = param['requestId'];
        var requestTaskTitle = param['requestTaskTitle'];
                
        //get specific request task id  
        /*var requestTask=new SCFile("requestTask", SCFILE_READONLY);
        requestTask.setFields(["number"]);
        sql="parent.request=\"" + requestId + "\" and title=\""+requestTaskTitle+"\"";
        if (requestTask.doSelect(sql) === RC_SUCCESS) {
            taskplannertestutil['result'] = lib.JSON2.toJSON(requestTask['number']);
        }*/
        
        var changePlan=new SCFile("changePlan", SCFILE_READONLY);
        sql="fileName=\"request\" and number=\""+requestId+"\"";
        if (changePlan.doSelect(sql) === RC_SUCCESS) {
            var taskLng=lng(changePlan['tasks']);
            for (var i=0;i<taskLng;i++){
                if(changePlan['tasks'][i]['taskDescription']==requestTaskTitle){
                    var outputsIds=[];
                    var outputsLng=lng(changePlan['tasks'][i]['outputs']);
                    for (var j=0;j<outputsLng;j++){
                        outputsIds[j]=changePlan['tasks'][i]['outputs'][j]['outputId'];
                    }
                    if(lng(outputsIds)>0){
                        taskplannertestutil['result'] = lib.JSON2.toJSON(outputsIds);
                    }
                    break;
                }
            }            
        }
    }
    else if (action == "SetRequestTaskOutPutsFields") {
        var requestId = param['requestId'];
        var keys=param['keys'];
        var values=param['values'];
        var lngth=lng(keys);
        var ticketContextConfig=new SCFile("ticketContextConfig");
        
        for (var i=0;i<lngth;i++){
            sql="id=\"" + keys[i] + "\" and fileId=\""+requestId+"\" and fileName=\"request\"";
            if (ticketContextConfig.doSelect(sql) === RC_SUCCESS){
                ticketContextConfig['value']=values[i];
                ticketContextConfig.doUpdate();
            }
        }
        taskplannertestutil['result'] = "true";
    }

    vars['$L.file'] = taskplannertestutil;
    vars.$L_exit = "normal";
}