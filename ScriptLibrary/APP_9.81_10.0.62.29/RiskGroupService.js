var _ = lib.Underscore.require();
var $ = lib.c.$;

function RiskGroupService(){

  //import helper functions
  var HELPERS = lib.RiskGroupHelpers;
  
  
  function test(){
  	print("run init riskgroup service");
  }

  /*
  * RiskGroupService singleton object, shared by all sessions in one login.
  */
  return {
  
  	initFields: function(){
//  		print("run init riskgroup service");
  	},
  	
    initRiskFactorsInfo: function(record){
      
      lib.RiskCalculationUtil.initRiskFactors(record);
    },
    refreshTotalSocre: function(record){
      var totalScoreStr = HELPERS.refreshTotalScore(record);
      record["total.score"] = totalScoreStr;
      
    },
    processAddActions: function(record){
      record = record?record:vars.$L_file;
      var rv = HELPERS.processAddActions(record);
      if (rv) {
      	vars.$newRiskFactorId = rv;
      }
    }
  };
}

function getClass() {
  return $(new RiskGroupService());
}
