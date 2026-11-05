var $ = lib.c.$;
function run(context) {
	//var start = context.start || 1;
	//var search = context.searchText;
	//var pageSize = context.pageSize || 20;
	//var total;
	//var result = [];
	
	return ({
		fields: [{name: 'id', label: 'ID'}, {name: 'value', label: 'Full Name', display: true}],
		data: [
			{'id': 'APJ', 'value': 'Asia Pacific'},
			{'id': 'AMS', 'value': 'Americas'},
			{'id': 'EMEA', 'value': 'EMEA'}
		]
	});
}