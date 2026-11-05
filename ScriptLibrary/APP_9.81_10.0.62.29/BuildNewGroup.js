//Author: Weihui Zhang
//Date: 03/17/2011
//Re-build the km group global lists

function buildGroup()
{
  var gl = new SCFile();
  var q = new QueryCond("name", EQ, "KM Group");
  var arrValue = new SCDatum();
  var arrList = new SCDatum();
  arrValue.setType(8);
  arrList.setType(8);
  
  if (gl.doSelect("globallists", q) == RC_SUCCESS)
  {
     
     arrValue = gl.value_list;
     arrValue = arrValue.slice(0, arrValue.length-1) + ", " + "\"" + vars.$L_file.id + "\"" + "}";
     arrList = gl.display_list;
     arrList = arrList.slice(0, arrList.length-1) + ", " + "\"" + vars.$L_file.name + "\"" + "}";
 
     gl.value_list = arrValue;
     gl.display_list = arrList;
     if (gl.doSave() == RC_SUCCESS)
     {
         var rteReturnValue = new SCDatum();
         var argNames = new SCDatum();
         var argVals = new SCDatum();
         argNames.setType(8);
         argVals.setType(8);
         
         argNames.push("file", "name");
         argVals.push(gl, "globallist.rebuild");
         
         system.functions.rtecall("callrad", 
                                            rteReturnValue,
                                            "se.call.process",
                                            argNames,
                                            argVals,
                                            true);
      }
  }
  else
  {
     print("Could not find globallist. " + RCtoString(gl));
     return null;
  }
}
     
