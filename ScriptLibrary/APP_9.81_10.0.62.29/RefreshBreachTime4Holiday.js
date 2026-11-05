//QCCR1E122360, when holiday and duty udpated, add schedules to refresh the sloresponse records in background base on their running sloresponse records.

function Recalculator(holiday) {
    if(funcs.filename(holiday) != "calholidays" && funcs.filename(vars.$L_file) != "calholidays" ){
        print("invalid parameter, it should be type of calholidays or $L.file should be calholidays");
        return null;
    } else if(!holiday) {
        holiday = vars.$L_file;
    }
    
    var _ = lib.Underscore.require();
    var $ = lib.c.$;
    
    this.getAffectedSLODefs = function(file){
        if(!file) {
            file = holiday;
        }
        var record = file;
        var ht = record['holiday_tables'];
        
        if (!ht) {
            return [];
        }
        
        var that = this;
        var sloDef = [];
        $("caldutyhours",SCFILE_READONLY)
            .setFields(['name'])
            .select('holiday.table isin ' + ht.getText())
            .iterate(function(d){
                sloDef = sloDef.concat(that.getSLOByDuty(d));
            });
        return sloDef;
    };
    
    this.getSLOByDuty = function(duty) {
        var slos = [];
        $("slo",SCFILE_READONLY)
            .setFields(['slo.id'])
            .select('schedule="' + duty['name'] +'"')
            .iterate(function(s){
                slos.push(s['slo.id']);
        });
        return slos;
    };
    
    this.createRecalcSchedule=function(tag){
        var schd = new SCFile("schedule");
        schd["class"] = 'sla';
        schd["name"] = "SLA Refresh for " + tag;
        schd["application"] = "sla.refresh.active.wrapper";
        schd["expiration"] = funcs.tod();
        schd["strings"] = [tag];
        return schd.doAction("add");
    };
    
    this.recalc=function(file){
        if(!file) {
            file = holiday;
        }
        var sloreps = new SCFile("sloresponse", SCFILE_READONLY);
        sloreps.setFields(['foreign.filename', 'foreign.key']);
        var sloDefs = this.getAffectedSLODefs(file);       
        var subSloDefs = lib.ArrayUtil.split(sloDefs, 1000);
        var i;
        for (i = 0; i < subSloDefs.length; i++)
        {       
            var query = 'slo.id isin {"' + subSloDefs[i].join('","') + '"} and running=true and breached=false and suspended=false';
            query = query + " and expiration.time > '" + funcs.str(file['start.date'])  +"'";            
            //print("query:"+query);
            var tags = [];
            var tag = '';
            var rc = sloreps.doSelect(query);
            while(rc == RC_SUCCESS) {
                tag = sloreps['foreign.filename'] + ';' + sloreps['foreign.key'];
                if(_.contains(tags,tag)) {
                    rc = sloreps.getNext();
                    continue;
                } else {
                    tags.push(tag);
                }
                this.createRecalcSchedule(tag);
                rc = sloreps.getNext();             
            }          
        }
        
    };
    
    return this;
}
