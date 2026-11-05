function savePersonalRefreshInterval(inboxId){
    var viewId=inboxId;
    var interval=parseInt(vars['$refresh.interval']);
    var f=new SCFile("viewautorefresh");
    var opt=vars['$lo.user.name'];
    var sql="operator=\""+opt+"\"";
    if(f.doSelect(sql)==RC_SUCCESS){
        var lng=f['inbox.id'].length();
        var existing=false;
        if(lng>0){
            for(var i=0;i<lng;i++){
                if(f['inbox.id'][i]==viewId){
                    f['refresh.interval'][i]=interval;
                    existing=true;
                    break;
                }
            }
            if(!existing){
                f['inbox.id'][lng]=viewId;
                f['refresh.interval'][lng]=interval;    
            }
        }
        else{
            f['inbox.id'][0]=viewId;
            f['refresh.interval'][0]=interval;
        }
        f.doUpdate();
    }
    else{
        f['operator']=opt;
        f['inbox.id'][0]=viewId;
        f['refresh.interval'][0]=interval;
        f.doInsert();
    }
    if(vars['$clientType']!="scguiwswt"){
        vars['$converted.refresh.interval']=parseInt("-"+vars['$refresh.interval']);
    }
}

function getRefreshInterval(inboxId){
    var interval=null;
    var viewId=inboxId;
    var inbox=new SCFile("inbox",SCFILE_READONLY);
    inbox.setFields(["dashboard.refresh.enable","dashboard.refresh.interval"]);
    var sql = "inbox.id = \"" + viewId + "\"";
    if(inbox.doSelect(sql)==RC_SUCCESS){
        if(inbox['dashboard.refresh.enable']){
            var fAutoRefresh=new SCFile("viewautorefresh",SCFILE_READONLY);
            var opt=vars['$lo.user.name'];
            sql="operator=\""+opt+"\"";
            if(fAutoRefresh.doSelect(sql)==RC_SUCCESS){
                var lng=fAutoRefresh['inbox.id'].length();
                if(lng>0){
                    for(var i=0;i<lng;i++){
                        if(fAutoRefresh['inbox.id'][i]==viewId){
                            interval=fAutoRefresh['refresh.interval'][i];
                        }
                    }
                }
            }
            if(interval=="" || system.functions._null(interval)){
                interval=inbox['dashboard.refresh.interval'];
            }
        }
    }
    return interval;
}

function autoRefreshEnabled(inboxId){
    if(system.functions._null(inboxId)) return false;
    var enable=false;
    var viewId=inboxId;
    var inbox=new SCFile("inbox",SCFILE_READONLY);
    inbox.setFields(["dashboard.refresh.enable","dashboard.refresh.interval"]);
    var sql = "inbox.id = \"" + viewId + "\"";
    if(inbox.doSelect(sql)==RC_SUCCESS){
        enable=inbox['dashboard.refresh.enable'];
    }
    return enable;
}