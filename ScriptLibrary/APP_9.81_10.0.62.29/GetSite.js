var $ = lib.c.$;
function run(context) {
	//var start = context.start || 1;
    //var search = context.searchText;
	//var pageSize = context.pageSize || 20;
	//var total;
	var result = [];
	var region = context.paramList[0];		//Input parameter is user option: [region]
	
    if (region == 'APJ')
    {
		result = [
			{'id': 'Shanghai', 'value': 'Shanghai'},
			{'id': 'Beijing', 'value': 'Beijing'},
			{'id': 'Chongqing', 'value': 'Chongqing'}
		];
	}
	else if (region == 'AMS')
    {
		result = [
			{'id': 'Site1', 'value': 'Site1'},
			{'id': 'Site2', 'value': 'Site2'}
		];
	}
	else
	{
		result = [
			{'id': 'Site3', 'value': 'Site3'},
			{'id': 'Site4', 'value': 'Site4'}
		];
	}
	
	return ({
		fields: [{name: 'id', label: 'ID'}, {name: 'value', label: 'Full Name', display: true}],
		data: result
	});
}