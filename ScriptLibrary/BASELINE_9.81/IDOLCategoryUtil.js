/*
*	Utilities for idol category training
*/

function getArrayString(ar) {
    var str = "";
    for (var i = 0; ar !== null && i < ar.length; i++) {
        str += ar[i].toString() + "\n";
    }
    return str;
}



function getDateString(td) {
	var str = new String();
	str = td.getFullYear()+"/";
	if(td.getMonth() < 9 ) {
		str += "0";
	}
	str +=(1+td.getMonth())+"/";
	if(td.getDate()<10 ){
		str +="0";
	}
	str +=td.getDate();
	return str;
}



function getFieldIndex(ar,strname)
{
	for( var i=0;ar!=null && i<ar.length;i++)
	{
		if(ar[i].toString() == strname)
		{
			return i;
		}
	}
	return -1;
}


function stringAleadyInArray(str,ar)
{
	for(var i=0;i<ar.length;i++)
	{
		if(str == ar[i])
		{
			return true;
		}
	}
	return false;
}


function getObjectString(obj)
{
	if(obj == null )
	{
		return "";
	}
	if(typeof(obj) == "object")
	{
		return  getArrayString(obj.toArray()) ;
	}
	
	return obj.toString();
}