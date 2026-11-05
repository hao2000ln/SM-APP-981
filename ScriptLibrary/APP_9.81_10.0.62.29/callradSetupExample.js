var rteReturnValue = new SCDatum();
var rteNames = new SCDatum();
var rteValues = new SCDatum();
var argNames = new SCDatum();
var argVals = new SCDatum();
					
rteNames.push("file"); 		
rteNames.push("record"); 		
rteNames.push("name"); 		
rteNames.push("prompt"); 		
rteNames.push("boolean1"); 		

var olddbdict=new SCFile("dbdict");
var newdbdict=new SCFile("dbdict");
var log=new SCDatum();
var retcode=new SCDatum();

olddbdict.doSelect("name=\"svcCatalog\"");
newdbdict.doSelect("name=\"extaccess\"");

log=system.functions.denull(log);

print(log);

rteValues.setType(8);
rteValues=system.functions.insert(rteValues, 0, 1, olddbdict);
rteValues=system.functions.insert(rteValues, 0, 1, newdbdict);
rteValues=system.functions.insert(rteValues, 0, 1, log);
rteValues=system.functions.insert(rteValues, 0, 1, retcode); //won't be used
rteValues=system.functions.insert(rteValues, 0, 1, false);

system.functions.rtecall("callrad", 
							rteReturnValue, 
							"apm.upgrade.merge.new", //RAD app name
							rteNames, 
							rteValues,
							false); //false to run in same thread, true to run in new thread						
