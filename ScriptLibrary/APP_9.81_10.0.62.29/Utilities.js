/**
* Basic utilities for support other function
*
* Author: Beddy(guo.zou@hp.com)
*/

function getElementFromTag(lTag, lIndex, lEscStr)
{
    var rlt = "";
    var arr = getElementsFromTag(lTag, lEscStr);
    var arrLen = funcs.lng(arr);

    if (lIndex < arrLen)
    {
        rlt = arr[lIndex];
    }
    
    return rlt;
}

function getElementsFromTag(lTag, lEscStr)
{
    var elem = [];
    if (lTag == null)
	{
    	return elem;
    }
    
    if (!lEscStr)
    {
        lEscStr = ";";
    }
    
    var lastIdx = -1;
    var thisIdx = -1;
    while (true)
    {
        lastIdx = thisIdx;
        do
        {
            thisIdx = lTag.indexOf(lEscStr, thisIdx + 1);
        } while (thisIdx > 0 && lTag.substr(thisIdx - 1,1) == "\\");
        
        var tmp;
        if (thisIdx > 0)
        {
            tmp = lTag.substring(lastIdx + 1, thisIdx);
            tmp = tmp.replace(/\\;/g, ";");
            elem.push(tmp);
        }
        else
        {
            tmp = lTag.substr(lastIdx + 1);
            tmp = tmp.replace(/\\;/g, ";");
            elem.push(tmp);
            break;
        }
    }
    
    return elem;
}

function getKeyValueFromTag(lTag, lKeyName, lEscStr)
{
    var rtnValue = null;
    if (!lKeyName)
	{
    	return rtnValue;
    }
    lKeyName = lKeyName.toUpperCase(); // Key name to upper case
    
    var arr = getElementsFromTag(lTag, lEscStr);
    var table = new SCFile("dbdict");
    var rlt = table.doSelect("name=\"" + arr[0] + "\"");
    if (rlt == RC_SUCCESS)
    {
        var keyLen = funcs.lng(funcs.denull(table.key));
        var i, j;
        for (i = 0; i < keyLen; i++)
        {
            if (table.key[i].flags == 12) // Unique key
            {
                var uniqueKey = table.key[i].name;
                var uniqueKeyLen = funcs.lng(funcs.denull(uniqueKey));
                for (j = 0; j < uniqueKeyLen; j++)
                {
                    if (uniqueKey[j].toUpperCase() == lKeyName && arr.length > j + 1)
                    {
                        rtnValue = arr[j + 1];
                        break;
                    }
                }
            }
        }
    }
    
    // NULL value process
    if (rtnValue == "NULL")
	{
    	rtnValue = null;
    }
    
    return rtnValue;
}

function trim(str)
{
    if (str != null)
    {
        str = str.replace(/(^\s*)|(\s*$)/g, "");
    }
    
    return str;
}

function escstr(str)
{
	if(str != null)
	{
		str = str.replace( /\\/g, "\\\\" ).replace( /"/g, "\\\"" );
	}
	
	return str;
}

function sprintf(formatString)
{
    var fsAry = formatString.split('%');
    var len = Math.min(fsAry.length, arguments.length);
    var is = 1;
    var i;
    for (i = 1; i < len; i++)
    {
       var tmpz = fsAry[i].charAt(0);
       if (tmpz == 's' || tmpz == 'S')
       {
           fsAry[i] = arguments[is] + fsAry[i].substr(1);
           is++;
       }
       else
       {
           var idx = fsAry[i].search(/[sS]/);
           if (idx > 0)
           {
               var tmpfc, tmplen;
               if (idx == 1)
               {
                   tmpfc  = ' ';
                   tmplen = parseInt(tmpz, 0);
               }
               else
               {
                   tmpfc  = tmpz;
                   tmplen = parseInt(fsAry[i].substring(1, idx), 0);
               }
               var tmps = String(arguments[is]);
               is++;
               tmplen -= tmps.length;
               while (tmplen > 0)
               {
                   tmps = tmpfc + tmps;
                   tmplen--;
               }
               fsAry[i] = tmps + fsAry[i].substr(idx + 1);
           }
           else
           {
               fsAry[i] = '%' + fsAry[i];
           }
       }
    }
    
    return fsAry.join('');
}

function strquery(formatString)
{
    var str = formatString;
    var len = arguments.length;
    var i;
    for (i = 1; i < len; i++)
    {
        str = str.replace(/\%[sS]/, escstr(String(arguments[i])));
    }
    
    return str;
}

/*
validate globallist edit 
String as {"aaa","bbb",ccc,",d,d,d,","aa,,bb"}
sub "{","}"not supported in the string
@Author: huan.li@hp.com 
*/
function getStrArrayLength(stringValue) {
	var str0 = stringValue;
	if(str0==null || str0=="") {
		return 0;
	}
	
	if (str0.length > 0) {
		var str = str0.match( /\{\s*(.*)\s*\}/ );
		if(str!=null && str.length>1) {
			str = str[1] + ",";
			var arr = str.match( /((("((\\["'\\])|[^\\"])*")|('((\\["'\\])|[^\\'])*'))|([^",]*))\s*,/g );
			return arr.length;
		}
	}

	return 0;
}