var _ = lib.Underscore.require();
var $ = lib.c.$;
var xmlHelpers = lib.xmlHelpers;
var lng = funcs.lng;
var denull = funcs.denull;
var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};

function initDefaultConfig(){
	return {
		name: 'riskAssess.preview',
		title: funcs.scmsg("calc_title","riskgroup"),
		fields: [
			{type:'glue', height:1}
		]
	};
}

function initAllComponents(){

  return {
    'text': dynamicTextComponent,
    'radioButtons': dynamicRadioComponent,
    'dropdownList': dynamicComboComponent,
    'checkBox': dynamicCheckBoxComponent
  };

}

function variableEntityBuilder(variableNameList, factor){
	var variableEntity = {};
	variableEntity['name'] = variableNameList;
	variableEntity['required'] = factor['required'];
	variableEntity['factorId'] = factor['id'];
	variableEntity['factorType'] = factor['type'];
	variableEntity['answerType'] = factor['answer.type'];
	
	// var factorTitle = lib.RiskLocalize.getFactorTitle(factor);;
	var factorTitle = factor.title;
	variableEntity['factorTitle'] = factorTitle;
	var mockAnswer = [];
	var answerArr = lib.ArrayUtil.toJsArray(factor['answer']);
	for(var i = 0; i < answerArr.length; i++){
		// var answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factor['id'], i, answerArr[i]['label'])
		var answerLabel = answerArr[i]['label'];
		mockAnswer.push({label: answerLabel, score: answerArr[i]['score']});
	}
	variableEntity['answer'] = mockAnswer;
	
	return variableEntity;
}

var dynamicTextComponent = {

  render: function(config, factor, factorIndex, variableNameList, variableEntityList){
		var fields = config.fields;
		var factorTitle = lib.RiskLocalize.getFactorTitle(factor);
		var _title = _.isNumber(factorIndex)? factorIndex + '. ' + factorTitle : factorTitle;
		var variableName = '$factor.' + factor['id'];
		fields.push({name: variableName, type:'text', title: _title, mandatory: factor['required']});
		config.fields = fields;
		variableNameList.push(variableName);
		var variableEntity = variableEntityBuilder([variableName], factor);
		variableEntityList.push(variableEntity);
		
		
  },
  
  isMandatory: function(factor){
  	var variableName = '$factor_' + factor['id'];
  	return vars[variableName] ? true :false;
  }
};

var dynamicRadioComponent = {

  render: function(config, factor, factorIndex, variableNameList, variableEntityList){
		var fields = config.fields;
		var factorTitle = lib.RiskLocalize.getFactorTitle(factor);
		var _title = _.isNumber(factorIndex)? factorIndex + '. ' + factorTitle : factorTitle;
		var variableName = '$factor.' + factor['id'];
		var options = [];
		//get option lists
	    var answers = factor.answer;
	
	    _.each(answers,function(answer, index){
	    	var option={};
	    	option['name'] = index/* answer['score'] */;//value
	    	var answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factor['id'], index, answer['label']);
	    	option['title'] = answerLabel; //label
	      	options.push(option);
	      });
		fields.push({name: variableName, type:'radio', title: _title, options: options, mandatory: factor['required']});
		config.fields = fields;
		variableNameList.push(variableName);
		var variableEntity = variableEntityBuilder([variableName], factor);
		variableEntityList.push(variableEntity);
  },
  
  isMandatory: function(factor){
  	var variableName = '$factor_' + factor['id'];
  	return vars[variableName] ? true :false;
  }
};

var dynamicComboComponent = {

  render: function(config, factor, factorIndex, variableNameList, variableEntityList){
		var fields = config.fields;
		var factorTitle = lib.RiskLocalize.getFactorTitle(factor);
		var _title = _.isNumber(factorIndex)? factorIndex + '. ' + factorTitle : factorTitle;
		var options = [];
		//get option lists
	    var answers = factor.answer;
	
	    _.each(answers,function(answer, index){
	    	var option={};
	    	// option['name'] = answer['score']; //value
	    	option['name'] = index/* answer['score'] */;//value
	    	var answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factor['id'], index, answer['label']);
	    	option['title'] = answerLabel; //label
	    	option['value'] = answer['score']; //value
	      	options.push(option);
	      });
	    var variableName = '$factor.' + factor['id'];
		fields.push({name: variableName, type:'combo', title: _title, options: options, mandatory: factor['required']});
		config.fields = fields;
		variableNameList.push(variableName);
		var variableEntity = variableEntityBuilder([variableName], factor);
		variableEntityList.push(variableEntity);
  },
  
  isMandatory: function(factor){
  	var variableName = '$factor_' + factor['id'];
  	return vars[variableName] != null ? true : false;
  }
};

var dynamicCheckBoxComponent = {

  render: function(config, factor, factorIndex, variableNameList, variableEntityList){
		var fields = config.fields;
		var factorTitle = lib.RiskLocalize.getFactorTitle(factor);
		var _title = _.isNumber(factorIndex)? factorIndex + '. ' + factorTitle : factorTitle;
		var variableName = '$factor.' + factor['id'];
		var options = [];
		var nameArr = [];
		//get option lists
	    var answers = factor.answer;
	    
		var index = 1;
	    _.each(answers,function(answer, index){
	    	
	    	var option={};
	    	option['name'] = variableName + '.' + index;// variableName
	    	option['value'] = answer['score'];//value
	    	var answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factor['id'], index, answer['label']);
	    	option['title'] = answerLabel; //label
	      	options.push(option);
	      	index++;
	      	variableNameList.push(option['name']);
	      	nameArr.push(option['name']);
	      });
		fields.push({name: variableName, type:'checkbox', title: _title, options: options, mandatory: factor['required']});
		config.fields = fields;
		var variableEntity = variableEntityBuilder(nameArr, factor);
		variableEntityList.push(variableEntity);
  },
  
  isMandatory: function(factor){
  
  	var answers = lib.ArrayUtil.toJsArray(factor['answer']);
  	if (answers.length == 0) {
  		return true;
  	}
  	var index = 1;
  	var count = 0;
  	_.each(answers, function(answer){
  		
  		var variableName = '$factor_' + factor['id'] + '_'+ index;
  		var checkboxValue = vars[variableName];
  		if(checkboxValue != null){
  			
  			count++;
  		}
  		index++;

  	});
  	
  	return count >0 ? true : false;
  }
};