/****************************************************************
 *  Functions used in Add and Update ApprovalDef				*
 *  Author: Beddy(huan.li@hp.com)                               *
 *  Date:2011/03/24                                             *
 *  Version:1.0                                                 *
 ****************************************************************/

function validateFields(fFile)
{
	var tmplen = Math.max(fFile.group_name.length(),fFile.sequence.length());
	for( var i = 0; i < tmplen-1; i++){
  	if(fFile.sequence[i]!=null && fFile.sequence[i]!=Math.floor(Math.abs(fFile.sequence[i])))
    	return false;
   	}    
  	return true;
}