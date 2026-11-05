/*
*	This Javascript is used to copy ucmdb related Change to customer environment.
*	Save the customer record to .bak
*	Rename .ucmdb.bak record to current record
*/

var list = [{
	"file": "format",
	"key": "name",
	"records": ["CM.relationship", "CM.relationship.qbe", "CM.relationship.type", "CM.relationship.type.qbe","dataModEventRel.relationship.detail", "dataModEventRel.relationship.qbe", "am.downstream.relationships.vj", "am.upstream.relationships.vj"]
},
	{
	"file": "extaccess",
	"key": 	"object.name",
	"records": ["Relationship"]
},
	{
	"file": "formatctrl",
	"key": "name",
	"records": ["CM.relationship", "CM.relationship.type", "dataModEvent.relationship"]
}];

for (var i = 0; i < list.length; i++) {
	var file = list[i].file;
	var records = list[i].records;

	for (var j = 0; j < records.length; j++) {
		var currentKey=records[j];
		var scFile = new SCFile(file);
		var key=list[i].key;
		var replaced = scFile.doSelect(key + "=\"" + currentKey + ".bak.ucmdb\"");
		if(replaced!=RC_SUCCESS){
			print(file+"["+currentKey+"] was ignored because it has been already processed" );
			continue;
		}
		var ret = scFile.doSelect(key + "=\"" + currentKey + "\"");
		if (ret == RC_SUCCESS) {
			scFile[key] = scFile[key] + ".bak.931";
			if(file=="extaccess"){
			scFile["service.name"]="ucmdbIntegration.bak.931";
			}
			var backRet=scFile.doSave();
			if(backRet==RC_SUCCESS){
				print(file+"["+currentKey+"] was renamed to "+scFile[key] +" for backup");
				var scFile = new SCFile(file);
				var ret = scFile.doSelect(key + "=\"" + currentKey + ".bak.ucmdb\"");
				if (ret == RC_SUCCESS) {
					scFile[key] = currentKey;
					if(file=="extaccess"){
					scFile["service.name"]="ucmdbIntegration";
					}
					scFile.doSave();
				}
				//remove .bak.ucmdb file to avoid run again
				 scFile = new SCFile(file);
				 if ( scFile.doSelect(key + "=\"" + currentKey + ".bak.ucmdb\"") == RC_SUCCESS ) {
				 	scFile.doDelete();
				 }
			}
		}


	}

}

print("Enable script run successfully!");
