var $ = lib.c.$;
var msg = funcs.scmsg;
var str = funcs.str;
var denull = funcs.denull;
var lng = funcs.lng;
var _ = lib.Underscore.require();
var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};

var RiskView = $({
	doShowFactors: function (request){
		var file = request.getParameter("$L.file.cm3r");
		var riskgroup = request.getParameter("$L.riskgroup");
		if(!riskgroup){
			print(msg('not_found', 'riskgroup', [file['number']]));
			return ;
		}
		if(funcs.lng(funcs.denull(riskgroup['factors'])) == 0){
			print(msg('no_factor', 'riskgroup', [riskgroup['id']]));
			return;
		}
		var hasUserBasedFactors = lib.RiskGroupHelpers.findUserBasedFactors(riskgroup);
		if(hasUserBasedFactors){
			return "RiskAssess.calc.preview";
		}else{
			//Only calc system based factors
			lib.RiskCalculationUtil.onlyCalculateSystemBasedFactors(file, riskgroup);
			print(msg('calc_done','riskresult'));
			vars.$showResult = true;
			return;
		}
		
	},
	
	doCalcFactors: function (request){
		var file = request.getParameter("$L.file.cm3r");
		var riskgroup = request.getParameter("$L.riskgroup");
		
		var validationResult = lib.RiskCalculationUtil.validateCalculationForm(request);
		if(!validationResult){
        	return "mb.ok";
		}

		lib.RiskCalculationUtil.calculate(file, riskgroup);
		lib.RiskGroupHelpers.clearDynamicFormInputValue();
		vars.$showResult = true;
		print(msg('calc_done','riskresult'));
	},
	
	doCalcCancel: function (request){
		lib.RiskGroupHelpers.clearDynamicFormInputValue();
	},
	
	//Open Risk Result
	doShowRiskResult:function (request) {
		vars.$selected_ver = null;
		return "RiskResult.show";
	},
	
	doShowRiskResultHist:function (request) {
		return "RiskResult.show";
	},

    //Open Search format to search existing factors
     doOpenSearch: function (request) {     
     	return "RiskSearch.factor.new";
    },
    
    //Search existing factors from search format
    doSearchRiskFactors: function (request) {
    
    	var file = request.getParameter("$L.file");
    	
    	vars.$factorIds = [];
		vars.$titles = [];
		vars.$factorTypes = [];
		vars.$answerTypes = [];
		vars.$factorMandatoryFlags = [];
				    	
    	var msgIds = [];
    	
    	var availableIds = lib.RiskGroupHelpers.getUnselectedFactors(file.factors, "true");
    	var query = "id isin {" + availableIds.join(',')+"}";
		
		//id
		if(vars.$id)
		{
			if (isNaN(vars.$id)) {
				query = "false";
			}
			else {
				query = query + " and id="+vars.$id;
			}
		}

        //todo mutilanguage
		if (vars.$title)
		{	
			query = query + " and title#\""+vars.$title+"\"";
		}

        //answer type
		if (vars.$factorAnswerType)
		{
			query = query + " and answer.type#\""+vars.$factorAnswerType+"\"";
		}
		
		//type
		if (vars.$factorType)
		{
			query = query + " and type#\""+vars.$factorType+"\"";
		}
		
		//required		
		if (vars.$factorMandatoryFlag)
		{
			if (vars.$factorMandatoryFlag=="true")
			{				
				query = query + " and required = true";		
			}
			else
			{				
				query = query + " and required = false";
			}			
		}
		
		var showList = false;
		
		$('riskfactor', SCFILE_READONLY).select(query).iterate(function(factor){
			showList = true;
			(vars.$factorIds).push(factor.id);			
			(vars.$titles).push (factor.title);			
			(vars.$factorTypes).push (factor.type);
			if(factor.type == "issystem"){
				(vars.$answerTypes).push(" - ");	
			}else{
				(vars.$answerTypes).push(factor.answer_type);
			}
			
			if(factor. required != true){
				(vars.$factorMandatoryFlags).push("false"); 
			}else{
				(vars.$factorMandatoryFlags).push("true");
			} 
		});
		
		if (showList)
		{	
			return "riskfactor.list";
		}
		
		var text = msg(96, "us");
        request.setAttribute("$L.mb.message", text);
        request.setAttribute("$L.mb.ok", "#riskView.doNoRecordOk");
        return "mb.ok";
    },
    
    doNoRecordOk: function (request) {
        return "RiskSearch.factor.new";
    },
    
    //select the factors from factor list
   	doSelect: function (request) {
   	
   		if (vars.$newfactorIds)
     	{
   			var file = request.getParameter("$L.file");
   		
     		var len = (vars.$newfactorIds).length();
     		if(len > 0) {
     			var k;
				for (k = 0; k < len; k ++) {
					if(file.factors[0] === null)  {
						file.factors[0] = parseInt(vars.$newfactorIds[k], 10);
					}
					else {
						file.factors.push(parseInt(vars.$newfactorIds[k], 10));
					}
				}
				file.factors = _.sortBy(file.factors);
			}
     	}     	
     	else
     	{
     		print(msg(1624, "us", []));
     		return "riskfactor.list";
     	}
    },
    
    
    doBack: function (request) {
        return "RiskSearch.factor.new";
    },
    
    doCancel: function (request) {
    }
    
 });
    

function getClass() {
    return RiskView;
}



function doShowRisk(table, id, riskResultId){
	var item = lib.c.$(table).select('number="'+lib.StringUtil.escapeAllStr(id)+'"').uniqueResult();
	if(!item) {
		return;
	}
	
	var resultItem = lib.c.$('riskresulttotal', SCFILE_READONLY).setFields().select('id="'+lib.StringUtil.escapeAllStr(riskResultId)+'"').uniqueResult();
	if(!resultItem || resultItem.related_id!=id){
		return;
	}
	
	var names  =  ['name', 'file'];
	var values =  ['riskAssess.show.result', item];
	var resultNames = ['name'];
	
	funcs.rtecall('callrad', 1, 'se.call.process', names, values, true);
}

function showRisk(name){
	var list = name.split(':');
	
	if(list.length<3) {
	    return;
	}
	
	var table = list[0];
	var id = list[1];
	var resultId = list[2];
	
	doShowRisk(table, id, resultId);
}