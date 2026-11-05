var logger = getLog('RunRestfulGwgwquerycondition');
var JSON = lib.JSON.json();
var $ = lib.c.$;
var query=lib.GatewayAPI_QueryCondition.getQueryCondition();

function GET(req, res) {
    var retEntities = [{queryString:query}]; 
	res.status(200).send({
		returnCode: 200,
		messages: ["SUCCESS"],
		entities: retEntities
	});

}

function authorize() {
	return true;
}
