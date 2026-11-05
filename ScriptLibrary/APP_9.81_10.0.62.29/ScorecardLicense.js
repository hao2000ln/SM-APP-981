var common = lib.ScorecardCommon;

var Elements = {
    count:0,
    item:[],
    placeholder:[]
};
function setNumberModuleLic(licenseName,namedLicUsed,namedLicAvail,floatingLicUsed,floatingLicAvail)
{
    var module = {
        "licenseName":licenseName,
        "namedLicUsed":parseInt(namedLicUsed),
        "namedLicAvail":parseInt(namedLicAvail),
        "floatingLicUsed":parseInt(floatingLicUsed),
        "floatingLicAvail":parseInt(floatingLicAvail)
    }
    return module;
}

function setStateModuleLic(licenseName,namedLicState,floatingLicState)
{
    var module = {
        "licenseName":licenseName,
        "namedLicState":namedLicState,
        "floatingLicState":floatingLicState
    }
    return module;
}

function setStateModuleLicSCAuto(licenseName,namedLicState)
{
    var module = {
        "licenseName":licenseName,
        "namedLicState":namedLicState
    }
    return module;
}

function setLoginLic(licenseName,licUsed,licAvail)
{
    var module = {
        "licenseName": licenseName,
        "licUsed": licUsed,
        "licAvail": licAvail
    }
    return module;
}


function getLicenseInfo()
{
    return updateLicenseInfo();
}

function updateLicenseInfo()
{
    var len = 0;
    var count = 0;
    var module;
    var lic = getLicInfo();
    var jlic = JSON.parse(lic);
    var inf = new SCFile("scorecardLicense");
    inf['record.time'] = funcs.tod();
    
    inf.expiration = jlic.EXPIRATION;
    inf.named_state = jlic.BASE[0].namedLicUsed+"/"+jlic.BASE[0].namedLicAvail;  
    inf.floating_state = jlic.BASE[0].floatingLicUsed+"/"+jlic.BASE[0].floatingLicAvail;

    len = jlic.HELPDESK.length;
    var i = 0;
    for(count = 0; count < len; count++)
    {
        if (jlic.HELPDESK[count].licenseName == "Self Service Ticketing")
        {
            inf.ess_state = jlic.HELPDESK[count].essLoginLicUsed+"/Unlimited";
            inf.overview_name[0] = "Self Service Ticketing";
            inf.overview_used[0] = parseInt(jlic.HELPDESK[count].essLoginLicUsed);
            inf.overview_avail[0] = "Unlimited";
        }
        else
        {
            inf.helpdesk_name[i] = jlic.HELPDESK[count].licenseName;
            inf.helpdesk_named_used[i] = jlic.HELPDESK[count].namedLicUsed;
            inf.helpdesk_named_avail[i] = jlic.HELPDESK[count].namedLicAvail;
            inf.helpdesk_floating_used[i] = jlic.HELPDESK[count].floatingLicUsed;
            inf.helpdesk_floating_avail[i] = jlic.HELPDESK[count].floatingLicAvail;
            i++;
        }
    }
    /* process OTHER  */
    len = jlic.OTHER.length;
    i = 0;
    var iE = 0;
    for(count = 0; count < len; count++)
    {
        // process ess licenses and module licenses
        if (jlic.OTHER[count].licenseName == "Service Catalog" || jlic.OTHER[count].licenseName == "Knowledge Management ESS")
        {
            inf.ess_name[iE] = jlic.OTHER[count].licenseName;
            inf.ess_used[iE] = jlic.OTHER[count].floatingLicUsed<0? 0:jlic.OTHER[count].floatingLicUsed;
            inf.ess_avail[iE] = jlic.OTHER[count].floatingLicAvail<0? 0:jlic.OTHER[count].floatingLicAvail;
            iE++;
        }
        else
        {
            inf.module_name[i] = jlic.OTHER[count].licenseName;
            inf.module_named_used[i] = jlic.OTHER[count].namedLicUsed<0? 0:jlic.OTHER[count].namedLicUsed;
            inf.module_named_avail[i] = jlic.OTHER[count].namedLicAvail<0? 0:jlic.OTHER[count].namedLicAvail;
            inf.module_floating_used[i] = jlic.OTHER[count].floatingLicUsed<0? 0:jlic.OTHER[count].floatingLicUsed;
            inf.module_floating_avail[i] = jlic.OTHER[count].floatingLicAvail<0? 0:jlic.OTHER[count].floatingLicAvail;
            i++;
        }
    }
    /* process FOUNDATION  */
    len = jlic.FOUNDATION.length;
    i = 0;
    for(count = 0; count < len; count++)
    {
        if (jlic.FOUNDATION[count].hasOwnProperty('namedLicUsed')){
            inf.foundation_name[i] = jlic.FOUNDATION[count].licenseName;
            inf.foundation_named_state[i] = jlic.FOUNDATION[count].namedLicUsed+"/"+jlic.FOUNDATION[count].namedLicAvail;
            inf.foundation_floating_state[i] = jlic.FOUNDATION[count].floatingLicUsed+"/"+jlic.FOUNDATION[count].floatingLicAvail;
        }
        else
        {
            inf.foundation_name[i] = jlic.FOUNDATION[count].licenseName;
            inf.foundation_named_state[i] = jlic.FOUNDATION[count].namedLicState;
            inf.foundation_floating_state[i] = jlic.FOUNDATION[count].floatingLicState;
        }
        i++;
    }
    /* process SMAUTO  */
    i = 0;
    len = jlic.SMAUTO.length;
    for(count = 0; count < len; count++)
    {
        inf.scauto_name[i] = jlic.SMAUTO[count].licenseName;
        inf.scauto_named_state[i] = jlic.SMAUTO[count].namedLicState;
        inf.scauto_floating_state[i] = jlic.SMAUTO[count].floatingLicState;
        i++;
    }
    
    inf.overview_name[1] = "Login License (Named)";
    inf.overview_used[1] = parseInt(jlic.BASE[0].namedLicUsed);
    inf.overview_avail[1] = parseInt(jlic.BASE[0].namedLicAvail);
    var ratioNamed = lib.settings.getSettingValue("Scorecard", "login.named.threshold");
    ratioNamed = inf.overview_avail[1] * ratioNamed / 100;
    inf.overview_ratio[1] = 0;
    if (inf.overview_used[1] > ratioNamed)
        inf.overview_ratio[1] = 1;
    inf.overview_name[2] = "Login License (Floating)";
    inf.overview_used[2] = parseInt(jlic.BASE[0].floatingLicUsed);
    inf.overview_avail[2] = parseInt(jlic.BASE[0].floatingLicAvail);
    var ratioFloat = lib.settings.getSettingValue("Scorecard", "login.floating.threshold");
    ratioFloat = inf.overview_avail[2] * ratioNamed / 100;
    inf.overview_ratio[2] = 0;
    if (inf.overview_used[2] > ratioFloat)
        inf.overview_ratio[2] = 1;

    return inf;
}

function buildLicenseInformation()
{
    var inf = getLicenseInfo();
    var file = "";
    var i = 0;
    var len;
    var len1 = 45;
    var len2 = 35;
    var len3 = len1+len2*4;
    if (inf != false)
    {
        file += common.buildMidDivider('-',funcs.scmsg( "report", 'ScoreCard',[funcs.scmsg("licStatus",'ScoreCard')]),len3)+'\n';
        
        file += funcs.scmsg("reportTime",'ScoreCard')+': '+funcs.tod()+"\n";
        file += common.buildHorizontalDivider('-',len3)+'\n';
        
        file += funcs.scmsg("expirDate",'ScoreCard')+": "+inf.expiration+"\n\n";
        file += funcs.scmsg("tabLoginLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 3, funcs.scmsg("licenseName",'ScoreCard'),len1,funcs.scmsg("licUsed",'ScoreCard'),len2,funcs.scmsg("licAvail",'ScoreCard'),len2);
        i = 0;
        len = inf.overview_name.length();
        while(i < len)
        {
            if (inf.overview_name[i]) {
                 file = common.buildLine(file, 3, inf.overview_name[i],len1,funcs.str(inf.overview_used[i]),len2,inf.overview_avail[i],len2);
            }
            i++;
        }
        file += "\n"+funcs.scmsg("tabFoundationLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 3, funcs.scmsg("licenseName",'ScoreCard'),len1,funcs.scmsg("namedLicState",'ScoreCard'),len2,funcs.scmsg("floatingLicState",'ScoreCard'),len2);
        i = 0;
        len = inf.foundation_name.length();
        while(i < len)
        {
            if (inf.foundation_name[i]) {
                file = common.buildLine(file, 3, inf.foundation_name[i],len1,inf.foundation_named_state[i],len2,inf.foundation_floating_state[i],len2);
            }
            i++;
        }
        
        file += "\n"+funcs.scmsg("tabSCAutoLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 2, funcs.scmsg("licenseName",'ScoreCard'),len1,funcs.scmsg("namedLicState",'ScoreCard'),len2);
        i = 0;
        len = inf.scauto_name.length();
        while(i < len)
        {
            if (inf.scauto_name[i]) {
                file = common.buildLine(file, 2, inf.scauto_name[i],len1,inf.scauto_named_state[i],len2);
            }
            i++;
        }
        
        file += "\n"+funcs.scmsg("tabHelpdeskLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 5, 
            funcs.scmsg("licenseName",'ScoreCard'),len1,
            funcs.scmsg("namedLicUsed",'ScoreCard'),len2,
            funcs.scmsg("namedLicAvail",'ScoreCard'),len2,
            funcs.scmsg("floatingLicUsed",'ScoreCard'),len2,
            funcs.scmsg("floatingLicAvail",'ScoreCard'),len2);
        i = 0;
        len = inf.helpdesk_name.length();
        while(i < len)
        {
            if (inf.helpdesk_name[i]) {
                file = common.buildLine(file, 5, inf.helpdesk_name[i],len1,
                    inf.helpdesk_named_used[i],len2,inf.helpdesk_named_avail[i],len2,
                    inf.helpdesk_floating_used[i],len2,inf.helpdesk_floating_avail[i],len2);
            }
            i++;
        }
        
        file += "\n"+funcs.scmsg("tabModuleLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 5, 
            funcs.scmsg("licenseName",'ScoreCard'),len1,
            funcs.scmsg("namedLicUsed",'ScoreCard'),len2,
            funcs.scmsg("namedLicAvail",'ScoreCard'),len2,
            funcs.scmsg("floatingLicUsed",'ScoreCard'),len2,
            funcs.scmsg("floatingLicAvail",'ScoreCard'),len2);
        i = 0;
        len = inf.module_name.length();
        while(i < len)
        {
            if (inf.module_name[i]) {
                file = common.buildLine(file, 5, inf.module_name[i],len1,
                    inf.module_named_used[i],len2,inf.module_named_avail[i],len2,
                    inf.module_floating_used[i],len2,inf.module_floating_avail[i],len2);
            }
            i++;
        }
        
        file += "\n"+funcs.scmsg("tabESSLicense",'ScoreCard')+'\n';
        file += common.buildHorizontalDivider('-',len3);
        file = common.buildLine(file, 3, funcs.scmsg("licenseName",'ScoreCard'),len1,funcs.scmsg("licUsed",'ScoreCard'),len2,funcs.scmsg("licAvail",'ScoreCard'),len2);
        i = 0;
        len = inf.ess_name.length()
        while(i < len)
        {
            if (inf.ess_name[i]) {
                file = common.buildLine(file, 3, inf.ess_name[i],len1,inf.ess_used[i],len2,inf.ess_avail[i],len2);
            }
            i++;
        }
            
    }
    return file;
}




