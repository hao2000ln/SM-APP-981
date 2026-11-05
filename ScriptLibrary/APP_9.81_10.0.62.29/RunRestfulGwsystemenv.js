var logger = getLog('RunRestfulGwsystemenv');
var JSON = lib.JSON.json();
var $ = lib.c.$;

function GET(req, res) {
	var ret=system.functions.lioption("Smart Analytics")&&vars['$lo.idol.enabled'];
	var retEntity = [{smartTicketEnabled:ret}];	
	res.status(200).send({
		returnCode: 200,
		messages: ["SUCCESS"],
		entities: retEntity
	});
}

function authorize() {
  return true;
}