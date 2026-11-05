var logger = getLog('RunRestfulGwgwkmfeedbackcount');
var JSON = lib.JSON.json();
var parse_evaluate = system.functions.parse_evaluate;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var $ = lib.c.$;
var operCurrency;

function GET(req, res) {
	var appendquery = cleanParameter(req.options.query);
	oper = getCurrentOperator();
	var voteUpSql = "useful=true";
	var voteUpSqlOper = "useful=true and author=\""+oper['name']+"\"";
	var voteDownSql = "useful=false";
	var voteDownSqlOper = "useful=false and author=\""+oper['name']+"\"";
	var commentSql = "not null(feedbacktext)";
	if (appendquery != null && appendquery != '') {
		voteUpSql += " and " + appendquery;
		voteUpSqlOper += " and " + appendquery;
		voteDownSql += " and " + appendquery;
		voteDownSqlOper += " and " + appendquery;
		commentSql += " and " + appendquery;
	}
	var voteUpCount = $("kmfeedback", SCFILE_READONLY).count(voteUpSql);
	var voteUpCountOper = $("kmfeedback", SCFILE_READONLY).count(voteUpSqlOper);
	var voteDownCount = $("kmfeedback", SCFILE_READONLY).count(voteDownSql);
	var voteDownCountOper = $("kmfeedback", SCFILE_READONLY).count(voteDownSqlOper);
	var commentCount= $("kmfeedback", SCFILE_READONLY).count(commentSql);
	var retEntities = [];
	$("kmfeedback", SCFILE_READONLY).select(commentSql).iterate(function(record) {
			retEntities.push(
		{
			//kmfeedbackId : record.kmfeedbackId,
			kmDocumentId: record.kmdocumentid,
			feedbackText: record.feedbacktext,
			useful: record.useful,
			author: record.author,
			createTime: new XMLDate(record.createtime).getISODateTimeString()
		
		 }
		)
	});	
	
	res.status(200).send({
		returnCode: 200,
		messages: ["SUCCESS"],
		"voteUpCount": voteUpCount,
		"voteUpCountOper": voteUpCountOper,
		"voteDownCount": voteDownCount,
		"voteDownCountOper": voteDownCountOper,
		"commentCount": commentCount,
		comments: retEntities
	});

}

function cleanParameter(parm) {	
    if (parm) {
        parm = parm.replace(/\\\\/g, '\\');
        parm = parm.replace(/\\\"/g, '\"');
        parm = parm.replace(/""/g, '"');
    } 
    return parm;
}

function authorize() {
	return true;
}
