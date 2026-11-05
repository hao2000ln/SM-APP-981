function importCellPhoneToCatalog(source, target){
	target['detailedDescription']='';
	for(var i in source){
		target['detailedDescription']+=('<p>'+i +":" +source[i]+'</p>');
	}
	var providers = source['Carrier'].split(';');
	var cost = source['Cost'].split(';');
	cost = cost.concat(new Array(providers.length-cost.length));
	cost = lib.ArrayUtil.toSCDatum(cost);
	providers = lib.ArrayUtil.toSCDatum(providers);
	lib.dynamicFormGenerator.addNewSelection(target, 'combo','version','versions',providers,providers,lib.ArrayUtil.toSCDatum(new Array(providers.length())));
	target['parent']=['Mobile Communication Devices'];
    target['active']=true;
	target['type']='item';
	
	var display = new SCFile('svcDisplay');
	var rc = display.doSelect('name="'+target['name']+'"');
	display['syslanguage']='en';
	display['displayName'] = 'bulkload_' + target['name'];
	display['detailedDescription'] = target['detailedDescription'];
	display['description'] = target['name'];
	display['options'] = target['options'];
	if(rc == RC_SUCCESS) {
		display.doUpdate();
	} else {
		display['name'] = target['name'];
		display.doInsert();
	}
	return target;
}

function importInventoryToDevice(source, target){
	target['logical.name'] = source['Make'] + '_' + source['Product Line'] + source['Model'];
	target['device.type']='networkcomponents';
	target['network.name']='bulkload';
	target['istatus']='In Stock';
	target['assignment'] = 'Hardware';
	var newid = new Datum();
	var rcode = new Datum();
	for(var item in source) {
		target['comments'].push(item+':'+source[item]);
	}
	return target;
}


function importCellPhoneToCatalogDisplay(source, target){
	target['detailedDescription']='';
	for(var i in source){
		target['detailedDescription']+=('<p>'+i +":" +source[i]+'</p>');
	}
	var providers = source['Carrier'].split(';');
	var cost = source['Cost'].split(';');
	cost = cost.concat(new Array(providers.length-cost.length));
	cost = lib.ArrayUtil.toSCDatum(cost);
	providers = lib.ArrayUtil.toSCDatum(providers);
	lib.dynamicFormGenerator.addNewSelection(target, 'combo','version','versions',providers,providers,cost);
	target['parent']=['bulkload'];
	return target;
}