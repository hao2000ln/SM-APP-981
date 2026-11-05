//QCCR1E122360, when holiday and duty udpated, add schedules to refresh the sloresponse records in background base on their running sloresponse records.

function Recalculator(duty) {
    if(system.functions.filename(duty) != "caldutyhours" && system.functions.filename(vars.$L_file) != "caldutyhours" ){
        print("invalid parameter, it should be type of caldutyhours or $L.file should be caldutyhours");
        return null;
    } else if(!duty) {
        duty = vars.$L_file;
    }
    var _ = system.library.Underscore.require();
    
    this.getAffectedSLODefs = function(file){
        if(!file) {
            file = duty;
        }
        var record = file;
        var sloDef = [];
        sloDef=getSLOByDuty(record);
        return sloDef;
    }
    
    getSLOByDuty = function(d) {
        var slos = [];
        system.library.c.$SCFile("slo",SCFILE_READONLY)
            // .setFields(['name'])
            .select('schedule="' + d['name'] +'"')
            .iterate(function(s){
                slos.push(s['slo.id'])
        });
        return slos;
    }
    
    this.createRecalcSchedule=function(tag){
        var schd = new SCFile("schedule");
        schd["class"] = 'sla';
        schd["name"] = "SLA Refresh for " + tag;
        schd["application"] = "sla.refresh.active.wrapper";
        schd["expiration"] = system.functions.tod();
        schd["strings"] = [tag];
        return schd.doAction("add");
    }
    this.recalc=function(file){
        if(!file) {
            file = duty;
        }
        var sloreps = new SCFile("sloresponse", SCFILE_READONLY);
        sloreps.setFields(['foreign.filename', 'foreign.key'])
        var sloDefs = this.getAffectedSLODefs(file);  
        var subSloDefs = lib.ArrayUtil.split(sloDefs, 1000);
        for (var i = 0; i < subSloDefs.length; i++)
        {       
            var query = 'slo.id isin {"' + subSloDefs[i].join('","') + '"} and running=true and breached=false and suspended=false';
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
        
    }
    
    return this;
}
