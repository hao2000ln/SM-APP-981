var toJSON = lib.JSON2.toJSON;
var logger = getLog('ScorecardCommon');
function calcInterval(startDate,interval){
    var startt = funcs.val(startDate,2)
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();          

    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8); 

    argNames.push("times,1"); 
    argNames.push("times,2"); 
    argNames.push("times,3");     

    argVals.push(startDate)          
    argVals.push(interval);            

    argTypes.push(3);
    argTypes.push(3);
    argTypes.push(3);
    results.push("times,3");

    var radResults = system.library.RAD.run( "calendar.calc.date", argNames, argVals, argTypes, results );
    return radResults.results[0];
}


function setField(name, caption)
{
    var module = {
        "name": name,
        "caption": caption
    }
    return module;
}

function setFieldArray(metaItem, names)
{
    size = names.length;
    for(var i = 0;i < size; i++){
        module = setField(names[i],funcs.scmsg(names[i],'ScoreCard'));
        metaItem.push(module);
    }
}
    
function setTypeField(name, caption, type)
{
    var module = {
    "name": name,
    "type": type,
    "caption": caption
    }
    return module;
}

function setTypeFieldArray(metaItem, type, names)
{
    size = names.length;
    for(var i = 0;i < size; i++){
        module = setTypeField(names[i],funcs.scmsg(names[i],'ScoreCard'), type);
        metaItem.push(module);
    }
}

function packageElements(symbol, placeholder)
{
    var line = symbol;
    if (!line) {
        line = "";
    }
    var len = line.length;
    if(len == null){
        line = funcs.str(symbol);
        len = line.length;
    }
    if (!placeholder) {
        placeholder = 0;
    }
    if ((placeholder-1) < len)
        placeholder = len+2;
    while(len < placeholder)
    {
        line += ' ';
        len++;
    }
    return line;
}
function buildLine(file, count, item1,ph1,item2,ph2,item3,ph3,item4,ph4,item5,ph5)
{
    var line = "";
    line += packageElements(item1, ph1);
    line += packageElements(item2, ph2);
    if (count > 2)
        line += packageElements(item3, ph3);
    if (count > 3)
    {
        line += packageElements(item4, ph4);
        line += packageElements(item5, ph5);
    }
    return file + line + "\n";
}
function buildHorizontalDivider(symbol,count)
{
    var line = "";
    while (count > 0)
    {
        line = line + symbol;
        count = count - 1;
    }
    line  = line + "\n";
    return line;
}

function buildHorizontalDivider_N(symbol,count)
{
    var line = "";
    while (count > 0)
    {
        line = line + symbol;
        count = count - 1;
    }
    return line;
}

function buildMidDivider(sysmbol,content,count)
{
    var len = content.length;
    if(len == null){
        var line = funcs.str(content);
        len = line.length;
    }
    if (len > count)
        return "";
    var before = parseInt((count-len-2)/2);
    var after = count - len - 2 - before;
    var str = "";
    str += buildHorizontalDivider_N(sysmbol,before);
    str += ' '+content+' ';
    str += buildHorizontalDivider_N(sysmbol,after);
    return str;
}

function subTimeSecond(curTime, interval)
{
    var td;
    if (curTime == null)
        td = funcs.tod();
    else 
        td = curTime;
    var t1 = funcs.val(td)-interval;
    var t2 = funcs.val(t1,3);
    return t2;
}


function getSettingsJsonData()
{
    var f = new SCFile("settings");
    var rc = f.doSelect("name=\"Scorecard\"");
    var data = {};
    
    if (rc == RC_SUCCESS)
    {
        var sz1 = f[3].length();
        var sz2 = f[4].length();
        if (sz1 == sz2)
        {
            var i = 0;
            while(i < sz1)
            {
                data[f[3][i]]=f[4][i];
                i++;
            }
        }
    }
    return data;
}
    
function getRecord(table,query)
{
    var f = new SCFile(table);
    var rc = f.doSelect(query);
    if (rc == RC_SUCCESS)
        return f;
    else
        return null;
}

function updateSystemSnapshotInterval(interval,name)
{
    var f = getRecord("schedule","class=\"scorecard\" and name=\""+name+"\"");
    if (f!=null){
        f["repeat"] = funcs.val(interval*60,3);
        var rc = f.doUpdate();
        if (rc!=RC_SUCCESS)
            logger.error("update "+name+" failed!");
    }
    else
        logger.error("get schedule record "+name+" failed!");
}



function validateNumberOfFloatingThreshold(str){
    var valid =  /^\+?([1-9]\d*)$/.test(str);
    var result = true;
    var msg = '';
    if(valid){
        var processors = str - 0;
        if(processors < 1){
            result = false;
        }
    }else{
        result = false;
    }
    if(!result){
        var label = funcs.scmsg("Scorecard;login.floating.threshold","local:settingsConfig");
        msg = funcs.scmsg("invalid_threshold","ScoreCard",[label]);
    }        
    return msg;
}

function validateNumberOfNamedThreshold(str){
    var valid =  /^\+?([1-9]\d*)$/.test(str);
    var result = true;
    var msg = '';
    if(valid){
        var processors = str - 0;
        if(processors < 1){
            result = false;
        }
    }else{
        result = false;
    }
    if(!result){
        var label = funcs.scmsg("Scorecard;login.named.threshold", "local:settingsConfig");
        msg = funcs.scmsg("invalid_threshold", "ScoreCard",[label]);
    }    
    return msg;
}

function validateNumberOfSessionThreshold(str){
    var valid =  /^\+?([1-9]\d*)$/.test(str);
    var result = true;
    var msg = '';
    if(valid){
        var processors = str - 0;
        if(processors < 1){
            result = false;
        }
    }else{
        result = false;
    }
    if(!result){
        var label = funcs.scmsg("Scorecard;sessions.usage.threshold", "local:settingsConfig");
        msg = funcs.scmsg("invalid_threshold","ScoreCard",[label]);
    }        
    return msg;
}

