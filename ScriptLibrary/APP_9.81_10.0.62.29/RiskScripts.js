/**
 * This script is used to allow customers to tailor the system based risk factor conditions
 */
function getFieldValuefromTable(dbdict, field, query)
{
    var file = new SCFile(dbdict, SCFILE_READONLY);
    file.setFields([field]);
    if (file.doSelect(query)== RC_SUCCESS)
    {
        return file[field];
    }
    
}


function getFieldIntValuefromTable(dbdict, field, query) {
	var value = getFieldValuefromTable(dbdict, field, query);
    return value==null?0:+value;
}


function userBase(){
    return getFieldIntValuefromTable("device","useBase","logical.name=\""+vars['$L.file'].affected_item+"\"");
}

function between(value, from, to){
    return value >=from && value <= to;
}


function countRecords(dbdict, query)
{
    if(query==null) return 0;
    var file = new SCFile(dbdict, SCFILE_READONLY);
    var count = file.doCount(query);
    return count;
}


function countConflictChangeRecords(){
    var sql = conflictChangeRecordsSql();
    return countRecords('cm3r', sql);
}


function conflictChangeRecordsSql(){
    return "open=true and number~=number in $L.file and (affected.item=affected.item in $L.file or affected.services=affected.item in $L.file) and ((planned.start>=planned.start in $L.file and planned.start<=planned.end in $L.file) or (planned.end>=planned.start in $L.file and planned.end<=planned.end in $L.file))";
}


function conflictTpSql(){
    var overlap = {};
    lib.timeperiodConflict.handleTPConflicts(overlap, vars.$L_file);
    
    var freezeNogoTP = "conflictNogoTP"; 
    var exceedGoTP = "overlapGoTP";
    var missGoTP = "missedGoTP";
    
    var list = [];
    lib.ArrayUtil.addAll(list, overlap.conflictNogoTP);
    lib.ArrayUtil.addAll(list, overlap.missedGoTP);
    lib.ArrayUtil.addAll(list, overlap.overlapGoTP);

    vars.$COLLISTION_TP_LIST = list;
    return "id isin $COLLISTION.TP.LIST";
}


