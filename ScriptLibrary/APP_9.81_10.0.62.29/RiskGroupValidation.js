function checkRequired(msgList, file, field, caption) {
    if (file[field] == null) {
        warn(funcs.scmsg(1, 'ruleset', [caption]), msgList);
    }
}


function checkGroup(item) {
    var msgList = [];

    var requiredFields = ['owner', 'title','usageCondDesc'];
    for (var k = 0; k < requiredFields.length; k++) {
        var field = requiredFields[k];
        checkRequired(msgList, item, field, getFieldCaption('riskgroup', field));
    }

    sortScoreRiskMapping(msgList, item);

    return processMsgList(msgList);
}

function removeNullEntityInAnswer(item){
	if(item == null) {
		return;
	}
	var answers = lib.ArrayUtil.toJsArray(item.answer);
	var type = item.type;
	if (answers != null) {
		var oped = [];
		if(type == "isuser"){
			lib.ArrayUtil.each(answers, function(answer) {
				if(answer['score']!=null || answer['label']!=null){
					oped.push(answer);
				}
			});	
		}else{
			lib.ArrayUtil.each(answers, function(answer) {
				if(answer['score']!=null || answer['label']!=null || answer['condition']!=null || answer['collision']!=null){
					oped.push(answer);
				}
			});
		}
		item.answer = lib.ArrayUtil.toSCDatum(oped);
	}
}

function removeNullEntityInMapping(item){
	if(item == null) {
		return;
	}
	var scoreMappingArr = lib.ArrayUtil.toJsArray(item['score.mapping']);
	if (scoreMappingArr != null) {
		var oped = [];
		
		lib.ArrayUtil.each(scoreMappingArr, function(scoreMapping) {
			if(scoreMapping['score.to']!=null || scoreMapping['risk.level']!=null){
				oped.push(scoreMapping);
			}
		});	
		
		item['score.mapping'] = lib.ArrayUtil.toSCDatum(oped);
	}
}

function sortScoreRiskMapping(msgList, item) {
    var list = [];
    removeNullEntityInMapping(item);
    var length = funcs.denull(item['score.mapping']).length();
	
	if(length==0){
		return;
	}
	
    for (var k = 0; k < length; k++) {
        list.push({ score: item['score.mapping'][k].score_to, risk: item['score.mapping'][k].risk_level });
    }

    // validate
    var labelHash = {};
    var scoreTo = {};

    var scoreToCaption = funcs.scmsg('caption_scoreTo', 'riskfactor');
    var riskCaption = funcs.scmsg('caption_risk', 'riskfactor');

    for (var k = 0; k < list.length; k++) {
        var to = list[k].score;
        var line = k + 1;

        if (!isNumber(to) && to != null) {
            var msg = funcs.scmsg('be_integer_in_line', 'riskfactor', [scoreToCaption, line]);
            warn(msg, msgList);

            return;
        }


        validateValue(list[k].score, scoreTo, scoreToCaption, line, msgList);
        validateValue(list[k].risk, labelHash, riskCaption, line, msgList);
    }

    // sort
    var sortedList = lib.ArrayUtil.sortBy(list, function (value) {
        return value.score;
    });


    // set sorted value
    var from = 0;
    for (var k = 0; k < sortedList.length; k++) {
        var to = sortedList[k].score;
        vars.$file['score.mapping'][k].score_from = from;
        vars.$file['score.mapping'][k].score_to = to;
        vars.$file['score.mapping'][k].risk_level = sortedList[k].risk;
        var from = to;
    }
    
}

function validateMaxThreshold(record){
	var _ = lib.Underscore.require();
	var scoreArr = [];
	var maxScore = 0;
	removeNullEntityInMapping(record);
    var length = funcs.denull(record['score.mapping']).length();
	
	if(length==0){
		return true;
	}
	
	for (var k = 0; k < length; k++) {
        scoreArr.push(record['score.mapping'][k].score_to);
    }
    
    var line = 1;
    maxScore = _.max(scoreArr);
    line = _.indexOf(scoreArr, maxScore) + 1;
    var totalScoreStr = record['total.score'];
    var totalScore = funcs.val(totalScoreStr.split("/")[1].replace(/\s*/g,""),1);
    if(maxScore < totalScore){
    	// setcursor
    	funcs.cursor_field_name_set("score.mapping",line);
		return false;
    }else{
    	return true;
    }
}



function checkFactor(item) {

    var type = item.type;
    var labelHash = {};
    var scoreHash = {};
    var conditionHash = {};

    var msgList = [];
    var table = 'riskfactor';
    var field = 'title';
    checkRequired(msgList, item, field, getFieldCaption(table, field));

    if (type == 'isuser') {
        var field = 'answer.type';
        checkRequired(msgList, item, field, getFieldCaption(table, field));
    }

    var length = funcs.denull(item.answer).length();

    var answerType = item['answer.type'];
    if (type == 'issystem' || answerType == 'radioButtons' || answerType == 'checkBox' || answerType == 'dropdownList' ) {
        if (length < 1) {
            var answerCaption = funcs.scmsg('caption_answer', 'riskfactor');
            warn(funcs.scmsg(1, 'ruleset', [answerCaption]), msgList);
        }
    }

    if (type == 'issystem') {
        var defaultScore = item.default_score;

        var defaultScoreCaption = funcs.scmsg('caption_defaultScore', 'riskfactor');
        if ('' === defaultScore || null === defaultScore) {
            warn(funcs.scmsg(1, 'ruleset', [defaultScoreCaption]), msgList);
        } else if (!isNumber(defaultScore)) {
            var msg = funcs.scmsg('be_integer', 'riskfactor', [defaultScoreCaption]);
            warn(msg, msgList);
        }
    }

    for (var k = 0; k < length; k++) {
        var line = k + 1;

        // Label
        var label = item.answer[k].label;
        var answerCaption = funcs.scmsg('caption_answer', 'riskfactor');
        if (type == 'issystem') {
            answerCaption = funcs.scmsg('caption_label', 'riskfactor');
        }
        validateValue(label, labelHash, answerCaption, line, msgList);

        // Score
        var score = item.answer[k].score;
        var scoreCaption = funcs.scmsg('caption_score', 'riskfactor');
        validateValue(score, null, scoreCaption, line, msgList);
        if (!isNumber(score) && score != null) {
            var msg = funcs.scmsg('be_integer_in_line', 'riskfactor', [scoreCaption, line]);
            warn(msg, msgList);
        }

        // Condition
        if (type == 'issystem') {
            var condition = item.answer[k].condition;
            validateValue(condition, null, 'Condition', line, msgList);
        }
        
        // Collision
        if (type == 'issystem') {
            var collision = item.answer[k].collision;
            validateValue(collision, null, 'Collision', line, msgList);
        }
    }

    return processMsgList(msgList);
}

function validateValue(value, hash, label, line, msgList) {
    if (value == null) {
        var msg = funcs.scmsg('caption_required_in_line', 'riskfactor', [label, line]);
        warn(msg, msgList);
    } else {
        if (!hash) {
            return true;
        }

        if (hash[value]) {
            var msg = funcs.scmsg('caption_duplicated_in_line', 'riskfactor', [label, line]);
            warn(msg, msgList);
        } else {
            hash[value] = true;
            return true;
        }
    }

    return false;
}


function warn(msg, msgList) {
    msgList.push(msg);
}

function isNumber(value) {
    if (value == 0) {
        return true;
    }

    return /^[1-9]\d*$/.test(value);
}


function processMsgList(msgList) {


    for (var k = 0; k < msgList.length - 1; k++) {
        funcs.msg(msgList[k], 3);
    }

    vars.$vaidateMsg = msgList[msgList.length - 1];


    if (msgList.length > 0) {
        return false;
    }

    return true;
}


function getFieldCaption(table, field) {
    return lib.tableFunctions.getFieldCaption(field, table);
}
