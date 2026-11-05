var _ = lib.Underscore.require();
var $ = lib.c.$;
var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};

var _json = rteJSONStringify;


var NULLSUB = funcs.nullsub;

var FIELD_NAMES = {
		ID:"id",
        TYPE:"type",
        REQUIRED:"required",
		TITLE:"title",
        ANSWER_TYPE:"answer.type"
};

function initComponentCalc(){

  return {
    'text': textComponentCalc,
    'radioButtons': radioComponentCalc,
    'dropdownList': comboComponentCalc,
    'checkBox': checkBoxComponentCalc
  };

}


function initRiskFactors(record){
  	
	vars.$riskFactorIds = [];
	vars.$riskFactorLabels = [];
	vars.$riskFactorTypes = [];
	vars.$riskFactorScoreMins = [];
	vars.$riskFactorScoreMaxs = [];
  	//check if this record has risk factor defined
    if(funcs.lng(funcs.denull(record.factors)) === 0) {
    	return null;
    }
    //get risk factor from riskfactor file in one query, better performance.
    var riskfactorQuery = FIELD_NAMES.ID+' isin '+funcs.str(record.factors);

    $('riskfactor').select(riskfactorQuery).iterate(function(riskfactor){
		if(riskfactor){
			var answers,scores = [];
			var maxscore = 0;
			var minscore = 0;
			answers = riskfactor.answer;
			
			if(riskfactor["type"] == "issystem"){
				var defaultScore = NULLSUB(riskfactor["default.score"], 0);
				var answerArr = lib.ArrayUtil.toJsArray(answers);
				for(var i = 0;i<answerArr.length;i++){
					maxscore += funcs.val(answerArr[i]['score'],1);
				}
				
				_.each(answers, function(answer){
					scores.push(answer.score);
				});
				minscore = _.min(scores) < defaultScore ? _.min(scores) : defaultScore;
				maxscore = maxscore > defaultScore ? maxscore : defaultScore;
			}else if(riskfactor["type"] == "isuser" && (riskfactor["answer.type"]=="radioButtons" || riskfactor["answer.type"]=="dropdownList")){
				
				_.each(answers, function(answer){
					scores.push(answer.score);
				});
				maxscore = _.max(scores);
				if(riskfactor['required'] == true){
					minscore = _.min(scores);
				}
				
				
			}else if(riskfactor["type"] == "isuser" && riskfactor["answer.type"] == "checkBox"){
				minscore = 0;
				answersArr = lib.ArrayUtil.toJsArray(answers);
				var sum = 0;
				for(var k = 0; k < answersArr.length; k++){
					sum += answers[k]["score"];
					
				}
				_.each(answers, function(answer){
					scores.push(answer.score);
				});
				if(riskfactor['required'] == true){
					minscore = _.min(scores);
				}
				maxscore = sum;
			}else {
				maxscore = 0;
				minscore = 0;
			}
			
		    vars.$riskFactorIds.push(riskfactor[FIELD_NAMES.ID]);
		    vars.$riskFactorLabels.push(riskfactor[FIELD_NAMES.TITLE]);
		    vars.$riskFactorTypes.push(riskfactor[FIELD_NAMES.TYPE]);
		    vars.$riskFactorScoreMins.push(minscore);
		    vars.$riskFactorScoreMaxs.push(maxscore);
		    
		}
      
     });
      
}

 /**
	Validation before risk calculation
 */
 function validateCalculationForm(request){
  	
  	var calcComponent = initComponentCalc();
  	var result = true;
    var variableEntityList = JSON.parse(vars.$variable_entity_list);
    
	for (var i = 0; i < variableEntityList.length; i++){
		var variableEntity = variableEntityList[i];
		var variableName = variableEntity['name'];
		var answerType = variableEntity['answerType'];
		var hasValue = calcComponent[answerType].isMandatory(variableEntity);
		var cursorLocation = variableEntity.name[0];
		if(!hasValue && variableEntity['required']){
			var localizedTitle = lib.RiskLocalize.getFactorTitleById(variableEntity['factorId'], variableEntity['factorTitle']);
			var text = funcs.scmsg('be_required', 'riskfactor', [localizedTitle]);
  			request.setAttribute("$L.mb.message", text);
    		request.setAttribute("$L.mb.ok", "#riskView.doShowFactors");
    		result = false;
  			break;
  			
		}
		
		var isValid = calcComponent[answerType].isValid(variableEntity);
		if(!isValid){
			var validText = funcs.scmsg('be_valid', 'riskcalculate', [variableEntity['factorTitle']]);
			request.setAttribute("$L.mb.message", validText);
    		request.setAttribute("$L.mb.ok", "#riskView.doShowFactors");
    		result = false;
  			break;
		}
	}
	
	if(!result){
	// setcursor
		funcs.cursor_field_name_set(cursorLocation);
	}
    
   	return result;
}

function calculate(record, group){
	
	
	var calcComponent = initComponentCalc();
	var riskresultDetails = [];
	var variableEntityList = JSON.parse(vars.$variable_entity_list);
	var systemFactorList =  JSON.parse(vars.$sysFactor_list);
	var totalScore = 0;
	var chmrecord = record;
	vars.$L_file = chmrecord;
	//Calc User Based
	for (var i = 0; i < variableEntityList.length; i++){
		var variableEntity = variableEntityList[i];
		var variableName = variableEntity['name'];
		var answerType = variableEntity['answerType'];
		var answerEntity = calcComponent[answerType].getValue(variableEntity);
		
		if(answerEntity){
//			print("question: "+ variableEntity['factorTitle'] + "  answerLabel:"+ answerEntity['answer'] + "  answerValue: " + answerEntity['score']);
			//create riskresultDetail
		    var riskresultDetail = new SCFile("riskresultdetail");
		    riskresultDetail['factor.id'] = variableEntity['factorId'];
		    riskresultDetail['factor.type'] = variableEntity['factorType'];
		    riskresultDetail['factor.label'] = variableEntity['factorTitle'];
		    riskresultDetail['factor.answer'] = answerEntity['answer'];
		    riskresultDetail['factor.answer.type'] = variableEntity['answerType'];
		    var answerScore = funcs.val(answerEntity['score'], 1);
		    riskresultDetail['factor.score'] = answerScore;
		    totalScore += answerScore;
			riskresultDetail.doSave();
			
//			print("riskresultDetail: "+riskresultDetail);
			riskresultDetails.push(riskresultDetail);
		
		}
		
	}
	
	//Calc System Based
	var sql = "id isin " + funcs.str(lib.ArrayUtil.toSCDatum(systemFactorList));
	lib.c.$('riskfactor').select(sql).iterate(function(sysfactor){
		var sysScore = calculateSystemBasedFactors(sysfactor, riskresultDetails);
		totalScore += sysScore;
	});
	
	//create riskresultTotal
    var entityKey = chmrecord['number'];
    var entityFileName = funcs.filename(chmrecord);
    var isFirst = true;
    var oldResultTotal = new SCFile("riskresulttotal");
    var query = "current = true and related.id =\"" + entityKey +"\" and related.type = \"" + entityFileName +"\"";
    var rc2 = oldResultTotal.doSelect(query);
    
    var riskresultTotal = new SCFile("riskresulttotal");
    riskresultTotal['current'] = true;
    riskresultTotal['related.id'] = entityKey;
    riskresultTotal['related.type'] = entityFileName;
    riskresultTotal['total.score'] = funcs.val(totalScore, 1);
    if(rc2 !== RC_SUCCESS){
    
       riskresultTotal['version'] = 1;
    }else{
    
       riskresultTotal['version'] = oldResultTotal['version'] + 1;
       isFirst = false;
    }
    riskresultTotal["group.id"] = group["id"];
      
    var riskMappings = lib.ArrayUtil.toJsArray(group["score.mapping"]);
    //mock scoremapping for riskgroup
    lib.RiskGroupHelpers.copyScoremapping(riskMappings, riskresultTotal);
	  
    riskMappings = _.sortBy(riskMappings, 'score.to');
      
    //calculate final risk assess
    var riskAssess = '';
    for (var i=0; i<riskMappings.length; i++){
		var riskmapping = riskMappings[i];
        if(totalScore <= riskmapping['score.to']){
			riskAssess = riskmapping['risk.level'];
      		break;
        }
        riskAssess = riskmapping['risk.level'];
    }
    riskresultTotal["risk.assess"] = riskAssess;
    //set collision in risk result total
    var collisonResult = lib.RiskGroupHelpers.setTotalCollisionFromDetails(riskresultDetails);
    riskresultTotal['collision'] = collisonResult ? 'T' : 'F';
    riskresultTotal['related.creation.time'] = chmrecord['orig.date.entered'];
    riskresultTotal['creation.time'] =  funcs.tod();
    riskresultTotal['created.by'] =  lib.RiskGroupHelpers.getCreatedBy();
      //todo save
    riskresultTotal.doSave();
    if(!isFirst){
        oldResultTotal.current = false;
        oldResultTotal.doSave();
    }
	
	_.each(riskresultDetails,function (riskresultDetail){
        riskresultDetail["total.id"] = riskresultTotal['id'];
        riskresultDetail.doSave();
    });	
    
    chmrecord['risk.assessment'] = riskAssess;
//	print("riskresultTotal:"+riskresultTotal);
	
}

function onlyCalculateSystemBasedFactors(record, group){

	var riskresultDetails = [];
	var totalScore = 0;
	var chmrecord = record;
	vars.$L_file = chmrecord;
	
	//Calc System Based
	var sql = "id isin " + funcs.str(group.factors);
	lib.c.$('riskfactor').select(sql).iterate(function(sysfactor){
		var sysScore = calculateSystemBasedFactors(sysfactor, riskresultDetails);
		totalScore += sysScore;
	});
	
	//create riskresultTotal
    var entityKey = chmrecord['number'];
    var entityFileName = funcs.filename(chmrecord);
    var isFirst = true;
    var oldResultTotal = new SCFile("riskresulttotal");
    var query = "current = true and related.id =\"" + entityKey +"\" and related.type = \"" + entityFileName +"\"";
    var rc2 = oldResultTotal.doSelect(query);
    
    var riskresultTotal = new SCFile("riskresulttotal");
    riskresultTotal['current'] = true;
    riskresultTotal['related.id'] = entityKey;
    riskresultTotal['related.type'] = entityFileName;
    riskresultTotal['total.score'] = funcs.val(totalScore, 1);
    if(rc2 !== RC_SUCCESS){
    
       riskresultTotal['version'] = 1;
    }else{
    
       riskresultTotal['version'] = oldResultTotal['version'] + 1;
       isFirst = false;
    }
    riskresultTotal["group.id"] = group["id"];
      
    var riskMappings = lib.ArrayUtil.toJsArray(group["score.mapping"]);
    //mock scoremapping for riskgroup
    lib.RiskGroupHelpers.copyScoremapping(riskMappings, riskresultTotal);
	  
    riskMappings = _.sortBy(riskMappings, 'score.to');
      
    //calculate final risk assess
    var riskAssess = '';
    for (var i=0; i<riskMappings.length; i++){
		var riskmapping = riskMappings[i];
        if(totalScore <= riskmapping['score.to']){
			riskAssess = riskmapping['risk.level'];
      		break;
        }
        riskAssess = riskmapping['risk.level'];
    }
    riskresultTotal["risk.assess"] = riskAssess;
    //set collision in risk result total
    var collisonResult = lib.RiskGroupHelpers.setTotalCollisionFromDetails(riskresultDetails);
    riskresultTotal['collision'] = collisonResult ? 'T' : 'F';
    riskresultTotal['related.creation.time'] = chmrecord['orig.date.entered'];
    riskresultTotal['creation.time'] =  funcs.tod();
    riskresultTotal['created.by'] =  lib.RiskGroupHelpers.getCreatedBy();
      //todo save
    riskresultTotal.doSave();
    if(!isFirst){
        oldResultTotal.current = false;
        oldResultTotal.doSave();
    }
	
	_.each(riskresultDetails,function (riskresultDetail){
        riskresultDetail["total.id"] = riskresultTotal['id'];
        riskresultDetail.doSave();
    });	
    
    chmrecord['risk.assessment'] = riskAssess;
}


var textComponentCalc = {
    
  getValue: function(variableEntity){
  	
  	var variableName = variableEntity['name'][0];
  	var answerEntity={};
  	if(vars[variableName] == null || vars[variableName] == '') {
  		//No answer
  		answerEntity['answer'] = ' - ';
  	}else{
  		answerEntity['answer'] = vars[variableName];
  	}
  	
  	answerEntity['question'] = variableEntity['factorTitle'];
  	answerEntity['score'] = 0;
  	return answerEntity;
  },
  
  isMandatory: function(variableEntity){
  	var variableName = variableEntity['name'][0];
  	return vars[variableName] != null && vars[variableName] != '' ? true :false;
  },
  
   isValid: function(variableEntity){
  	return true;
  }
};

var radioComponentCalc = {

  getValue: function(variableEntity){
  	
  	var variableName = variableEntity['name'][0];
  	var answers = variableEntity['answer'];
  	
  	if(answers == null) {
  		return null;
  	}
  	
  	var answerEntity={};
//  	var answerLable = '';
  	if(vars[variableName] == null){
  		//No answer
  		answerEntity['answer'] = _json({});
  		answerEntity['score'] = 0;
  	}else{
  		var answerIndex = funcs.val(vars[variableName],1);
	  	if(answerIndex>=0) {
	  		var item = answers[answerIndex];
	  		var answerScore = item.score;
	  		var answerLabel = item.label;
	  		answerEntity['answer'] = _json({index:answerIndex, label:answerLabel}); // answerLabel;
	  		answerEntity['score'] = answerScore;
	  	}
  	}
  	
  	answerEntity['question'] = variableEntity['factorTitle'];
  	// print("answerEntity['score'] ", answerEntity['score']);
  	return answerEntity;
  },
  
  
  isMandatory: function(variableEntity){
  	var variableName = variableEntity['name'][0];
  	return vars[variableName] != null ? true :false;
  },
  
  isValid: function(variableEntity){
  	return true;
  }
};

var comboComponentCalc = {

  getValue: function(variableEntity){
  	var variableName = variableEntity['name'][0];
  	var answers = variableEntity['answer'];
  	if(answers == null) {
  		return null;
  	}
  	
  	var answerEntity={};
//  	var answerLabel = '';	
  	if(vars[variableName] == null){
		//No answer
		answerEntity['answer'] = _json({});
		answerEntity['score'] = 0;
  	}else{
  		var answerIndex = funcs.val(vars[variableName],1);
	  	if(answerIndex>=0) {
	  		var answerScore = answers[answerIndex]['score'];
	  		var answerLabel = answers[answerIndex]['label'];
	  		answerEntity['answer'] = _json({index:answerIndex, label:answerLabel}); // answerLabel;
	  		answerEntity['score'] = answerScore;
	  	}
  	}
  	
  	answerEntity['question'] = variableEntity['factorTitle'];
  	return answerEntity;
  },
  
  isMandatory: function(variableEntity){
  	var variableName = variableEntity['name'][0];
  	return vars[variableName] != null ? true : false;
  },
  
  isValid: function(variableEntity){
  	return true;
//  	var count = 0;
//  	var variableName = variableEntity['name'][0];
//  	var answerScore = funcs.val(vars[variableName],1);
//  	if(answerScore == null) return false;
//  	var answers = variableEntity['answer'];
//  	
//  	for (var k=0; k<answers.length; k++){
//  		if(k == answerScore){
//  			count++;
//  			break;
//  		}
//  	}
//  	return count ==0 ? false : true
//  	
  }
};

var checkBoxComponentCalc = {
  
  getValue: function(variableEntity){
  
  	var count = 0;
  	var answerScore = 0;
  	var answerLable = '';
  	var answerEntity = {};
  	var labelList = [];
  	var labelEntity = {};
  	
  	var answers = variableEntity['answer'];
  	if (answers.length == 0) {
  		return null;
  	}
  	
  	var index = 0;
  	_.each(answers, function(answer, index){
  		
  		var variableName = variableEntity['name'][index];
  		var checkboxValue = vars[variableName];
  		
  		if(checkboxValue != null){
  			count++;
  			checkboxValue = funcs.val(checkboxValue,4);
  		}
  		
  		if(checkboxValue){
  			answerScore += answer['score'];
  			labelList.push({"index":index,  "label":answer['label'], "score":''+answer['score']});
  		}
  		
  		index++;
  	});
  	
  	if (count == 0){
  		//No answer
  		answerEntity['answer'] = JSON.stringify({});
  		answerEntity['score'] = 0;
  	}else{
	  	labelEntity['answer'] = labelList;
	  	answerEntity['answer'] = JSON.stringify(labelEntity);
	  	answerEntity['score'] = answerScore;
  	}

  	answerEntity['question'] = variableEntity['factorTitle'];
  	
  	return answerEntity;	
  
  },
  
  isMandatory: function(variableEntity){
  
  	var answers = variableEntity['answer'];
  	if (answers.length == 0) {
  		return true;
  	}
  	var index = 0;
  	var count = 0;
  	_.each(answers, function(answer){
  		
  		var variableName = variableEntity['name'][index];
  		var checkboxValue = vars[variableName];
  		if(checkboxValue != null){
  			
  			count++;
  		}
  		index++;

  	});
  	
  	return count >0 ? true : false;
  },
  
   isValid: function(variableEntity){
  	return true;
  }
 };
 
 
 /**
	Calculate System Based Factors
	*/
 function calculateSystemBasedFactors(factor, riskresultDetails){
  	
  	var answers = factor['answer'];	
  	var resultArr = [];
  	var resultJson = {};
  	var answerLable = '';
  	var score = 0;
  	var collisionFlag = false;
  	_.each(answers, function(answer, index){
  		var condition = answer['condition'];
  		var res = funcs.evaluate(funcs.parse(condition,4));
  		if(res) {
  			var resEntity = {};
  			resEntity['index'] = index;
  			resEntity['label'] = answer['label'];
  			resEntity['score'] = answer['score'];
  			resultArr.push(resEntity);
  			if(answer['collision'] == 'T' && !collisionFlag){
  				collisionFlag = true;
  			}
  		}
  		
  	});
  	
  	if(resultArr.length == 0){
  		score = factor['default.score'];
  		answerLabel = '{}';
  	}else{
  		score = _.reduce(resultArr,function(memo, result){
  			var next = memo['score'] + result['score'];
  			return {score:next};
  		})['score'];
  		resultJson['answer'] = resultArr;
  		answerLabel = JSON.stringify(resultJson);
  	}
  	
  
	//create riskresultDetail
	var riskresultDetail = new SCFile("riskresultdetail");
	riskresultDetail['factor.id'] = factor['id'];
	riskresultDetail['factor.type'] = factor['type'];
	riskresultDetail['factor.label'] = factor['title'];
	riskresultDetail['factor.answer'] = answerLabel;
	riskresultDetail['factor.score'] = score;
	riskresultDetail['factor.answer.collision'] = collisionFlag ? 'T' : 'F';
	riskresultDetail['factor.detail.table'] = factor['detail.table'];
	riskresultDetail['factor.detail.query'] = factor['detail.query'];
	//todo save
	riskresultDetail.doSave();
//	print("riskresultDetail: "+riskresultDetail);
	riskresultDetails.push(riskresultDetail);
	
	return score;
		
 }
