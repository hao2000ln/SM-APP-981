

  /**
   * This script is used to reduce the client request to query config info again and again.
   * To make login save time, we want to request all the config info in one request.
   * If there're more config info called during login, please add it below.
   */
   
    function getSMModuleConfig() {
      var config = {}, errors = {};
      if(lib.SMCRemoteService &&   lib.SMCRemoteService.getConfigInfo) {
        try {
          config["smcConfig"] = lib.SMCRemoteService.getConfigInfo();
        } catch (e) {
          errors["smConfig"] =  e.toString();
        }
      } else { 
        config["smcConfig"] = {smcSupported: false};
      }
   
      if(lib.ReportService &&  lib.ReportService.queryReportModuleConfig) {
        try {
          config["reportConfig"] = lib.ReportService.queryReportModuleConfig();
        } catch (e) {
          errors["reportConfig"] = e.toString();
        }       
      }
   
      if(!vars.$G_ess && lib.TodoAlertService &&  lib.TodoAlertService.getTodoAlertConfig ) {
        try {
          config["todoAlertConfig"] = lib.TodoAlertService.getTodoAlertConfig();
        } catch (e) {
          errors["todoAlertConfig"] = e.toString();
        }
      }  
      if(lib.LiveActions &&  lib.LiveActions.initial) {
        try {
          config["globalSearchConfig"] = lib.LiveActions.initial() ;
        } catch (e) {
          errors["globalSearchConfig"] = e.toString();
        }
      }
      config.errors = errors;
      return config;
    }
