/****************************************************************
 *  Functions used in Joint link query for Muti-languange    	*
 *  Author: zhenqing.zhang@hp.com                               *
 *  Date:2012/07/19                                             *
 *  Version:1.0                                                 *
 ****************************************************************/

function buildMLangLinkQuery(fieldName, inputVlue, valueList, dispList, exactMatch)
{
 	if (inputVlue==null || inputVlue=="" || inputVlue.length==0) return "";
 	var tmpQuery="";
	inputVlue = lib.StringUtil.escapeAllStr(inputVlue);
	if (!isEmpty(valueList) && !isEmpty(dispList)){ // this jusdagement is for preventing valueList is null
		for (var i = 0, iLoopTimes = valueList.length() ; i < iLoopTimes; i++)
		{		
			if (((valueList[i].substring(0,inputVlue.length)==inputVlue || dispList[i].substring(0,inputVlue.length)==inputVlue) && !exactMatch)
			     || ((valueList[i] == inputVlue ||  dispList[i] == inputVlue) && exactMatch )  ){
				if (tmpQuery=="") 
					tmpQuery = fieldName+"=\""+valueList[i]+"\"";
				else
					tmpQuery += " or "+fieldName+"=\""+valueList[i]+"\"";
			}
		}
	}

	if (tmpQuery !="") 
		return (" and ("+tmpQuery+")"); 
	else {
	    var querySign = exactMatch?"=":"#";
		return (" and "+fieldName+querySign+"\""+inputVlue+"\"")
		}
		
}


function isEmpty(arrList)
{
	return arrList == null || arrList.length == 0;
}

function replaceStartWith2EqualQuery(query, filename) {
    var fieldMappings = [{"table" : "cm3t", "field" : "header,status"}];
    for (var i=0; i<fieldMappings.length; i++) {
        var fieldMapping = fieldMappings[i]
        if (fieldMapping["table"] == filename) {
            var startWith = fieldMapping["field"] + "#";
            if (query.indexOf(startWith) >= 0) {
                var equal = fieldMapping["field"] + "=";
                query = query.replace(startWith, equal);
            }
        }
    }
    
    return query;
}
