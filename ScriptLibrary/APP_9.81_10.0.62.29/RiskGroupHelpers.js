var _ = lib.Underscore.require();
var denull = funcs.denull;
var lng = funcs.lng;
var $ = lib.c.$;
var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};

function processAddActions(record){

    record.doSave();
    return record.id; 
}

function refreshTotalScore(record){
	var totalScoreStr = "";
    var scoreMins = vars.$riskFactorScoreMins;
    var scoreMaxs = vars.$riskFactorScoreMaxs;
    
    if (lib.ArrayUtil.isEmpty(scoreMins) || lib.ArrayUtil.isEmpty(scoreMaxs)) {
        return "";
    }
    
    var totalMinScore = _.reduce(scoreMins, function(memo, num){ return memo + num; }, 0);
    var totalMaxScore = _.reduce(scoreMaxs, function(memo, num){ return memo + num; }, 0);
    totalScoreStr = totalMinScore + " / " + totalMaxScore;
    return totalScoreStr;
}

function getUnselectedFactors(selected, sql)
{
	var retArr=[];

  	$('riskfactor', SCFILE_READONLY).setFields(["id"]).select(sql).iterate(function(factor){
  		if (lib.ArrayUtil.indexOf(selected, parseInt(factor.id, 10))<0 ) {
  			retArr.push(factor.id);
  		}
  	});

	return retArr;
}

function removeFactors(record,factors)
{
   var arr=record.factors;
   var arr2=factors;
   if(!arr2) {
   	return arr;
   }
   var i, length = arr2.length(); 
   for (i=0;i<length;i++)
    {
       var n=funcs.index(parseInt(arr2[i], 10),arr);
       arr=funcs._delete(arr,n);
    }
   record.factors = arr;
   return arr;
 }
 
 function updateFactorsInRiskGroups(record){
 	var factorId = record['id'];
 	var riskgroup = new SCFile("riskgroup");
 	var rc = riskgroup.doSelect("true");
 	
 	while(rc == RC_SUCCESS){
 		var factors = lib.ArrayUtil.toJsArray(riskgroup.factors);
 		var i = lib.ArrayUtil.indexOf(factors,factorId);
 		
 		if( i>=0 ){
 			factors = funcs._delete(factors,i+1);
 			riskgroup.factors = factors;
 			riskgroup.doSave();
 		}
 		rc = riskgroup.getNext();
 	}
 }
 
 function convertCharacterInRiskFactor(record){
 	if(funcs.lng(record.answer) == 0) {
 		return;
 	}
 	_.each(record.answer,function(answer){
 		if(answer['label']){
 			answer['label'] = answer['label'].replace(/\t/g,"");
 		}
	});
 }

  /**
	Get Chm Related riskgroup
 */
 function findRiskGroupbyChange(cm3r){
 	var record = cm3r;
 	var category = record['category'];
	var riskgroup = new SCFile("riskgroup");
	var sql = "active = true and current.phase = \"Active\"";
	var flag = false;
	var rc = riskgroup.doSelect(sql);
	
    if (rc != RC_SUCCESS) {
    	return;
    }
    
	while(rc == RC_SUCCESS){
		
		var usageCondition = riskgroup['usageCondition'];
		var usageCondXML = riskgroup['usageCondXML'];
		if (usageCondXML != null && usageCondXML != "" && (funcs.index("\"crosstablefield\"", usageCondXML) > 0 || funcs.index("\"useroption\"", usageCondXML) > 0)){
			lib.Workflow.initVarForCondition(usageCondXML);
		}
		var condition = funcs.evaluate(funcs.parse(funcs.str(usageCondition),4));
		if(condition){
			flag = true;
			break;
		} 
		rc = riskgroup.getNext();
	}
    return  flag ? riskgroup : null;
 }
 
 function findSelectedAnswer(factor, selectedScore){
 	if(factor.type == "text"){
 		return selectedScore;
 	}
 	
 	var answers = lib.ArrayUtil.toJsArray(factor.answer);
 	var selectedItem = '';
 	var i;
 	for (i = 0; i <answers.length; i++){
 		if(answers[i].score == selectedScore){
 			selectedItem = answers[i].label;
 			break;
 		}
 	}
 	return selectedItem;
 }
 
 function copyScoremapping(riskMappings, riskresultTotal){

	var i;
	for(i = 0; i<riskMappings.length; i++){
		riskresultTotal['score.mapping'][i]['risk.level'] = riskMappings[i]['risk.level'];
		riskresultTotal['score.mapping'][i]['score.from'] = riskMappings[i]['score.from'];
		riskresultTotal['score.mapping'][i]['score.to'] = riskMappings[i]['score.to'];
	}
 }
 
 /**
	Validation before risk calculation
 */
 function validateCalculationForm(group, request){
  	
  	var componentStore = lib.RiskDynamicFormComponent.initAllComponents();
  	var result = true;
    var riskFactorIds = group.factors;
	var riskFactors = [];
	_.each(riskFactorIds, function (riskFactorId){
		var riskFactor = new SCFile('riskfactor');
		var query = "id ="+ riskFactorId;
		var rc = riskFactor.doSelect(query);
		if( rc == RC_SUCCESS){
			var mockRiskFactor = riskFactor;
			riskFactors.push(mockRiskFactor);
			
		}
	});
	
	var k;
	for (k = 0; k < riskFactors.length; k++){
    	var factor = riskFactors[k];
    	if(factor['type'] == 'issystem') {
    		continue;
    	}
    
    	var component = componentStore[factor['answer.type']];
		if (component){
			var hasValue = component.isMandatory(factor);
//			print(factor['title'] + "hasValue: "+ hasValue);
			if(!hasValue && factor['required']){
				
				var text = funcs.scmsg('be_required', 'riskfactor', [factor['title']]);
      			request.setAttribute("$L.mb.message", text);
        		request.setAttribute("$L.mb.ok", "#riskView.doShowFactors");
        		result = false;
      			break;
			}
		}	
    }
    
   	return result;
  }
  
  function clearDynamicFormInputValue(){
  	var nameList = lib.ArrayUtil.toJsArray(vars.$variable_list);
  	if(nameList == null || nameList.lenth == 0) {
  		return;
  	}
  	
  	_.each(nameList, function(name){
  		if(vars[name]){
  			vars[name] = null;
  		}
  	});
  	
  	vars.$variable_entity_list = null;
  	vars.$sysFactor_list = null;
  }
 
 // Get the count of the risk result total related to the record 
 function getRiskResultTotalCount(record) {
 	var chm = record;
 	var riskResultTotal = new SCFile("riskresulttotal", SCFILE_READONLY);
 	riskResultTotal.setFields(["id"]);
 	var query = "related.id = \"" + record['number'] + "\" and related.type = \"" + funcs.filename(chm) + "\"";
 	
 	var count = riskResultTotal.doCount(query);
 	
 	return count;
 }
 
 /**
	Get Risk History
  */
 function findRiskResultTotal(record, version){
 	var chm = record;
// 	print("version:"+version);
 	var riskResultTotal = new SCFile("riskresulttotal");
 	var query = "related.id = \"" + record['number'] + "\" and related.type = \"" + funcs.filename(chm) + "\"";
 	if(version){
 		query += " and version =" + version;
 	}else{
 		query += " and current = true";
 	}
 	
 	var rc = riskResultTotal.doSelect(query);
 	
 	return rc == RC_SUCCESS ? riskResultTotal:null;
 }
 
 function findRiskResultDetailByTotal(riskResultTotal){
// 	var riskResultDetails = new SCDatum();
// 	riskResultDetails.setType(8);
 	var riskResultDetails =[];
 	if(!riskResultTotal){
 		return riskResultDetails;
 	}
 	var riskResultDetail = new SCFile("riskresultdetail");
 	var query = "total.id =" + riskResultTotal['id'];

 	$("riskresultdetail", SCFILE_READONLY).select(query).iterate(function(record) {
 		var frecord = new SCFile("riskresultdetail");
 		funcs.fduplicate(frecord, record);
		riskResultDetails.push(frecord);
    });
//    print("riskResultDetails: "+riskResultDetails);
    return riskResultDetails;
 }
 
 function setTotalCollisionFromDetails(riskresultDetailList){
 	
 	var collisionFlag = false;
 	var i;
 	for(i = 0; i < riskresultDetailList.length; i++){
 		var riskresultDetail = riskresultDetailList[i];
 		if(riskresultDetail['factor.answer.collision'] == 'T'){
 			collisionFlag = true;
 			break;
 		}
 	}
 	return collisionFlag;
 }
 
 function initRiskResultHist(record){
 	var chm = record;
 	var verionArr = [];
 	var versionDescArr = [];
 	var query = "related.id = \"" + record['number'] + "\" and related.type = \"" + funcs.filename(chm) + "\"";

 	lib.c.$('riskresulttotal', SCFILE_READONLY).setFields(["version","creation.time", "current"]).setOrderBy(["creation.time"], [SCFILE_DSC]).select(query).iterate(function(riskresulttotal){
		verionArr.push(riskresulttotal['version']);
		var displayVersion = funcs.scmsg("Version","sccaption") + ' - '+riskresulttotal['version'] + ' - ' + funcs.str(riskresulttotal['creation.time']);
		if (riskresulttotal['current'] == true) {
		    displayVersion += " (" + funcs.scmsg("latest_version","riskresult") + ')';		    
		}
		versionDescArr.push(displayVersion);
	});
	vars.$riskresult_ver = verionArr;
	vars.$riskresult_ver_disp = versionDescArr;
 }
 
 
  function generateRiskResult(record, version){
 	
	var getLocalizedFieldCaption = lib.tableFunctions.getLocalizedFieldCaption;

 	var riskResultTotal = findRiskResultTotal(record, version);
 	if (riskResultTotal == null) {
 	    return "";
 	}
 	
 	var totalScore = riskResultTotal["total.score"];
 	var validTotalScore = true;
 	if (totalScore == null) {
 	    totalScore = 0;
 	    validTotalScore = false;
 	}
 	
 	if (vars["$selected.ver"] == null) { // invoke by displayscreen RiskResult.show and $selected.ver is passed as version
 	    vars["$selected.ver"] = riskResultTotal["version"];
 	}
 	var createdBy = riskResultTotal["created.by"];
 	vars["$result.createdby"] = createdBy;
 	var riskResultDetails = findRiskResultDetailByTotal(riskResultTotal);
 	var strStyle = "<STYLE>\
				   	table.gridtable {\
				   		font-family: MetricWeb,Arial;\
						color:#333333;\
						border-width: 1px;\
						border-color: #666666;\
						border-collapse: collapse;\
					}\
					\
					table.gridtable th {\
				        border-width: 1px;\
				        padding: 8px;\
				        border-style: solid;\
				        border-color: #666666;\
				        background-color: #dedede;\
				        font-size:16px;\
				        text-align: left;\
 				        font-weight: bold;\
			    	}\
			        .accessible-mode table.gridtable th{\
			            font-size:18.26px;\
			        }\
			        \
			        table.gridtable th.right {\
				        text-align: right;\
			    	}\
					\
			        table.gridtable td {\
			        	border-width: 1px;\
			            padding: 8px;\
			            border-style: solid;\
			            border-color: #666666;\
			            background-color: #ffffff;\
			            font-size:14px;\
			        }\
			        .accessible-mode table.gridtable td{\
			            font-size:18.26px;\
			        }\
			        \
			        table.gridtable td.right {\
			        	text-align: right;\
			        }\
			        table.gridtable td.bold {\
			        	font-weight: bold;\
			        }\
			        table.gridtable td.seperate {\
			        	border-width: 0px;\
			        	border-color: #ffffff;\
			        	color: #ffffff;\
			        }\
					</STYLE>";
	
	var strDetailHTML = "<table class=\"gridtable\" width='1000'>\
						<tr>\
            				<th>" + funcs.scmsg("riskfactor","tablename") + "</th>\
				            <th>" + getLocalizedFieldCaption("answer", "riskfactor") + "</th>\
							<th>" + getLocalizedFieldCaption("collision", "riskresulttotal") + "</th>\
				            <th class='right'>" + funcs.scmsg("caption_score","riskfactor") + "</th>\
        				</tr>";
    if(riskResultDetails.length != 0){
    	_.each(riskResultDetails, function(riskResultDetail){
    		var factorId = riskResultDetail['factor.id'];
    		
    		var answerLabel = "";
    		var collisionLabel = " - ";
    		var item;
    		
    		if(riskResultDetail['factor.type'] == 'issystem') {
    		    if (riskResultDetail['factor.answer.collision'] == 'T') {
    			    collisionLabel = funcs.scmsg("yes", "pdtf");
    			} else {
    			    collisionLabel = funcs.scmsg("no", "pdtf");
    			}
    		}
    		if(riskResultDetail['factor.answer.type'] == 'checkBox' || riskResultDetail['factor.type'] == 'issystem'){
    			var text = riskResultDetail['factor.answer'];
    			var isNoAnswer = false;
    			if(text == ' - ' || text=='{}'){
    				isNoAnswer = true;
    				answerLabel = ' - ';
    			}
    			
    			if(!isNoAnswer) {
	    			var answerEntityJson = JSON.parse(text);
	    			var answerEntityArr = answerEntityJson['answer'];
	    			if(answerEntityArr.length == 1){
	    				item = answerEntityArr[0];
	    				answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factorId, item.index, item.label);
	    			}else{
	    				var j;
	    				for(j = 0,len=answerEntityArr.length; j < len; j++) {
	    					item = answerEntityArr[j];
	    					itemLabel = lib.RiskLocalize.getFactorAnswerLabel(factorId, item.index, item.label);
	   						answerLabel += itemLabel + ', '+funcs.scmsg('caption_score', 'riskfactor')+': ' + item.score + "\n";
						}
	    			}	
    			}
    		}else if (riskResultDetail['factor.answer.type'] != 'text'){
    			if(riskResultDetail['factor.answer'] == '{}'){
    				//No answer
    				answerLabel = ' - ';
    			}else{
    				item = JSON.parse(riskResultDetail['factor.answer']);
    				answerLabel = lib.RiskLocalize.getFactorAnswerLabel(factorId, item.index, item.label);
    			}
    			
    		} else {
    			answerLabel = riskResultDetail['factor.answer'];
    		}
    		
    		var factorTitle = lib.RiskLocalize.getFactorTitleById(factorId, riskResultDetail['factor.label']);
    		var encodedAnswerLabel = escapeXml(answerLabel);
    		encodedAnswerLabel = encodedAnswerLabel.replace(/\n/g, '<br>');
    		var factorScore = riskResultDetail['factor.score'];
    		if (factorScore == null) {
    		    factorScore = 0;
    		}
    		if (!validTotalScore) {
    		    totalScore += factorScore;
    		}
    		var link = makeDetailLink(riskResultDetail);
    		var encodedFactorTitle = escapeXml(factorTitle);
    		if(link){
    			encodedFactorTitle = '<a href="scactivelink://'+link+'" style="color:#0079ef">'+encodedFactorTitle+'</a>'
    		}
    		strDetailHTML += "<tr>\
            					<td width='40%'>" + encodedFactorTitle + "</td>\
            					<td width='40%'>" + encodedAnswerLabel + "</td>\
            					<td>" + escapeXml(collisionLabel) + "</td>\
            					<td width='15%' class='right'>" + escapeXml(factorScore) + "</td>\
        					 </tr>";
    	});
    }
    strDetailHTML += "<tr>\
            			<th colspan='3'>" + getLocalizedFieldCaption("total.score", "riskresulttotal") + "</th>\
            			<th class='right'>" + escapeXml(riskResultTotal ? totalScore : "") + "</th>\
        			</tr>\
        			</table><br>";
    
    var strTotalHTML = "<table class=\"gridtable\" width='700'>\
                        <tr>\
            				<th width='%50'>" + getLocalizedFieldCaption("total.score", "riskresulttotal") + "</th>\
            				<td width='%50' class='bold'>" + escapeXml(riskResultTotal ? totalScore : "") + "</td>\
        				</tr>";

	var strRiskDefHTML = "<tr>\
							<th width='%50'>" + funcs.scmsg("score_definition","riskresult") + "</th>\
							<th width='%50'>" + funcs.scmsg("assess_definition","riskresult") + "</th>\
						</tr>";
	var strRiskLevelResult = "";
	var mapped = false;
	var zero = false; //if score 0 is in mapping
    var scoreMappings = (riskResultTotal ? lib.ArrayUtil.toJsArray(riskResultTotal['score.mapping']) : []);
    _.each(scoreMappings, function(scoreMapping){
    
    	var impactLevelDesc = lib.ArrayUtil.toJsArray(vars.$G_impact_desc);
    	var impactLevelArr = lib.ArrayUtil.toJsArray(vars.$G_impact);
    	var index = _.indexOf(impactLevelArr, scoreMapping['risk.level']);
    	var riskLevel = scoreMapping['risk.level'];
    	var riskLevelDesc = scoreMapping['risk.level'];
    	
    	if(index != -1){
    		riskLevelDesc = impactLevelDesc[index];
    	}
    		
    	strRiskDefHTML += "<tr>\
            				<td width='%50'";
        
        var bold = false;    				
        if(!mapped && (scoreMapping['score.from'] < totalScore || (scoreMapping['score.from'] == 0 && totalScore == 0)) 
            && scoreMapping['score.to'] >= totalScore){
        	mapped = true;
        	bold = true;
        	strRiskDefHTML += "class='bold'";
        }
        
        strRiskDefHTML += ">";
        if (scoreMapping['score.from'] == scoreMapping['score.to']) {
            strRiskDefHTML += scoreMapping['score.to'];
            if (!zero && scoreMapping['score.from'] == 0) {
                zero = true;
            }
        } else {
            if (!zero && scoreMapping['score.from'] == 0) {
                zero = true;
                strRiskDefHTML += "" + scoreMapping['score.from'];
            } else {
                strRiskDefHTML += "" + (scoreMapping['score.from'] + 1);
            }
            strRiskDefHTML += " - " + scoreMapping['score.to'];
        }
        strRiskDefHTML += "</td>\
            				<td width='%50'";
        if(bold){
        	strRiskDefHTML += "class='bold'";
        	strRiskLevelResult = riskLevelDesc;
        }	
        strRiskDefHTML += ">" + escapeXml(riskLevelDesc) + "</td>\
        				 </tr>";
    });
    strRiskDefHTML += "</table><br>";
    
    strTotalHTML += "<tr>\
            				<th width='%50'>" + getLocalizedFieldCaption("risk.assessment", "cm3r") + "</th>\
            				<td width='%50' class='bold'>" + escapeXml(strRiskLevelResult) + "</td></tr>";    
    var strSeperateHTML = "<tr><td colspan='2' class='seperate'>&nbsp;</td></tr>";

    var strHTML = strStyle + strTotalHTML + strSeperateHTML + strRiskDefHTML + strDetailHTML;

	return strHTML;
 }
 
 function makeDetailLink(detailItem) {
 	var table = detailItem.factor_detail_table;
 	var query = detailItem.factor_detail_query;
 	
 	if(!detailItem || !table || !query) {
 		return null;
 	}
 	
 	if(query.indexOf('jscall(')==0){
 		query = funcs.parse_evaluate(query, 2);
 	}
 	
 	return 'showDetailFile:'+detailItem.id; //.replace(/\"/g, '&quot;');
 }
 
 
 function escapeXml(str) {
 	str = funcs.str(str);
 	if(!str || !str.replace) {
 		// print(str);
 		return '';
 	}
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function findUserBasedFactors(riskgroup){
	var result =false;
	var factorIds = lib.ArrayUtil.toJsArray(riskgroup['factors']);
	var query = "id isin {" + factorIds.join(',')+"}";
	lib.c.$('riskfactor', SCFILE_READONLY).select(query).iterate(function(factor){
			if(factor.type == "isuser"){
				result = true;
				return true;
			}
	});
	return result;

}

function getCreatedBy(){

	if(vars["$G.cm3.global.environment"]["full.name"]){
		return vars["$lo.ufname"];
	}else{
		return vars["$lo.user.name"];
	}
}
