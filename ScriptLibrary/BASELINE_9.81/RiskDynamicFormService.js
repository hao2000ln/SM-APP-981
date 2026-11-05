var _ = lib.Underscore.require();
var eval = funcs.evaluate();
var parse = funcs.parse();
var $ = lib.c.$;
var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};

function RiskDynamicFormService(){
  
  var lng = funcs.lng;
  var denull = funcs.denull;
  var ArrayUtil = lib.ArrayUtil;
  var componentStore = {};

  
  function _renderDynamicForm(record, riskgroup, defaultConfig){
  
	if(lng(denull(riskgroup.factors)) < 1){
		return defaultConfig;
	}
    
    var factors = lib.ArrayUtil.toJsArray(riskgroup.factors);
    var formatConfig = defaultConfig;
    var factorIndex = 1;
    var variableNameList = [];
    var variableEntityList = [];
    var systemFactorList = [];
    
    for(var i = 0;i < factors.length; i++){
    	
		var riskfactor = new SCFile("riskfactor");
		var factorId = factors[i];
		var query = "id = "+factorId;
		var rc = riskfactor.doSelect(query);
		if (rc != RC_SUCCESS) {
			continue;
		}
		
		var type = riskfactor['type'];
		var answerType = riskfactor['answer.type'];
		if(type == "issystem"){
//			var sysFactor = {};
//			sysFactor['id'] = riskfactor['id'];
//			sysFactor['default.score'] = riskfactor['default.score'];
//			sysFactor['title'] = riskfactor['title'];
			systemFactorList.push(riskfactor['id']);
		    continue;
		}
		
		componentStore[answerType].render(formatConfig, riskfactor, factorIndex, variableNameList, variableEntityList); 
		factorIndex ++;
    }
    
   	vars.$variable_list = lib.ArrayUtil.toSCDatum(variableNameList);
   	vars.$variable_entity_list = JSON.stringify(variableEntityList);
   	vars.$sysFactor_list = JSON.stringify(systemFactorList);
//   	print("vars.$variable_entity_list: "+vars.$variable_entity_list);
    return formatConfig;
  	
  }
  
  function _calcuateRisk(record, group){
  	
  	vars.$L_file = record;
	var chmRecord = record;
    var riskFactorIds = group.factors;
	var riskFactors = [];
	var riskresultDetails = [];
	_.each(riskFactorIds, function (riskFactorId){
		var riskFactor = new SCFile('riskfactor');
		var query = "id ="+ riskFactorId;
		var rc = riskFactor.doSelect(query);
		if( rc == RC_SUCCESS){
			var mockRiskFactor = riskFactor;
			riskFactors.push(mockRiskFactor);
			
		}
	});
    var totalScore = 0;
   
    //traverse the form to calculate and create riskresultdetail
    for (var k = 0; k < riskFactors.length;k++){
    	var factor = riskFactors[k];
    	if(factor['type'] == 'issystem'){
    	
    		//Todo Calculate System Based
    		totalScore += calculateSystemBasedFactors(factor, riskresultDetails);
    	}else{
    	
    		//calculate userBased factors
    		totalScore += calculateUserBasedFactors(factor, riskresultDetails);
    	}
		
    }
    //create riskresultTotal
    var entityKey = chmRecord['number'];
    var entityFileName = funcs.filename(chmRecord);
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
    riskresultTotal['related.creation.time'] = chmRecord['orig.date.entered'];
    riskresultTotal['creation.time'] =  funcs.tod();
      //todo save
    riskresultTotal.doSave();
    oldResultTotal.current = false;
    oldResultTotal.doSave();
	
	_.each(riskresultDetails,function (riskresultDetail){
        riskresultDetail["total.id"] = riskresultTotal['id'];
        riskresultDetail.doSave();
    });	
//	print("riskresultTotal:"+riskresultTotal);
  
  }
  
  /**
	Calculate User Based Factors
	*/
  function calculateUserBasedFactors(factor, riskresultDetails){
  	
  	var factorScore = 0;
  	var component = componentStore[factor['answer.type']];
	if (component){
		var answerEntity = component.getValue(factor);
		if(answerEntity){
//			print("question: "+ factor['title'] + "  answerLabel:"+ answerEntity['answer'] + "  answerValue: " + answerEntity['score']);
			
			//create riskresultDetail
		    var riskresultDetail = new SCFile("riskresultdetail");
		    riskresultDetail['factor.id'] = factor['id'];
		    riskresultDetail['factor.type'] = factor['type'];
		    riskresultDetail['factor.label'] = factor['title'];
		    riskresultDetail['factor.answer'] = answerEntity['answer'];
		    riskresultDetail['factor.answer.type'] = factor['answer.type'];
		    var answerScore = funcs.val(answerEntity['score'], 1);
		    riskresultDetail['factor.score'] = answerScore;
		    factorScore = answerScore;
			//todo save
			riskresultDetail.doSave();
//			print("riskresultDetail: "+riskresultDetail);
			riskresultDetails.push(riskresultDetail);
		}
	}
	return factorScore;
  	
  }
  
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
  	_.each(answers, function(answer){
  		var condition = answer['condition'];
  		var res = funcs.evaluate(funcs.parse(condition,4));
  		if(res) {
  			var resEntity = {};
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
  		answerLabel = ' - ';
  	}else{
  		score = _.reduce(resultArr,function(memo, result){
  			return memo['score'] + result['score'];
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
	//todo save
	riskresultDetail.doSave();
//	print("riskresultDetail: "+riskresultDetail);
	riskresultDetails.push(riskresultDetail);
	
	return score;
		
  }
  

  return {

    init: function(){
      componentStore = lib.RiskDynamicFormComponent.initAllComponents();
    },
    
    render: function(record, riskgroup){
    	
	 var defaultConfig = lib.RiskDynamicFormComponent.initDefaultConfig();
	 var formatConfig = _renderDynamicForm(record, riskgroup, defaultConfig);
	 return lib.RiskDynamicFormBuilder.buildForm(formatConfig);
		 
    },
    
    calculate: function(record, riskgroup){
      _calcuateRisk(record, riskgroup);
    }
    
  };
}



function getClass() {
  return $(new RiskDynamicFormService());
}
