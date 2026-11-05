var $ = lib.c.$;
function run(context) {
	//var start = context.start || 1;
	//var search = context.searchText;
	//var pageSize = context.pageSize || 20;
	//var total;
	var region = context.paramList[0];		//Input parameter is user option - [region]
	var site = context.paramList[1];		//Input parameter is user option - [site]
	
	var datacenter1Value = region + '-' + site + '-dc1';
	var datacenter2Value = region + '-' + site + '-dc2';
	
	return ({
		fields: [{name: 'id', label: 'ID'}, {name: 'value', label: 'Data Center Name', display: true}],
		data: [
			{'id': datacenter1Value, 'value': 'Datacenter1 (' + datacenter1Value + ')'},
			{'id': datacenter2Value, 'value': 'Datacenter2 (' + datacenter2Value + ')'}
		]
	});
}