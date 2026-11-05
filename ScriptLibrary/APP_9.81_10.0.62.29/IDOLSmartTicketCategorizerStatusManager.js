/**
 * Flag to indicate training/tuning/testing progress
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategorizerStatusManager');

var IDOLSmartTicketCategorizerStatusManager = (function() {

  function CategorizerStatusManager(categorizer) {
    this._categorizer = categorizer;
  }

  CategorizerStatusManager.prototype.toString = function() {
    return 'Status Manager: ' + this._categorizer.id;
  };

  function Status(code, getMessage) {
    this.code = code;
    this.getMessage = getMessage;
  }

  /**
   * Class used to tracking training/tuning/testing status
   * status code is always write into specific field of ONE record
   *
   * @param fTarget: which sm record `status code` will read from or write to
   * @param fieldname: which field should be read/write when tracking the status
   * @param statusRange: all possible status code, and its message
   */
  function GenericStatusMonitor(fTarget, statusRange, statusField, descField) {
    this._fTarget = fTarget;
    this._fieldname = statusField;
    this._descField = descField;
    this.STATUS = statusRange;
  }

  GenericStatusMonitor.prototype.updateStatus = function(status) {
    var fTarget = this._fTarget;
    // make sure always load the freshest data
    
    var JSON = lib.JSON.json();
    funcs.rtecall("refresh", vars['$L.void'], fTarget);
    fTarget[this._fieldname] = status.code;
    if (this._descField) {
      fTarget[this._descField] = status.getMessage();
    }
    fTarget.doUpdate();
  };

  GenericStatusMonitor.prototype.reset = function() {
    var status = this.getDefaultStatus();
    this.updateStatus(status);
  };

  GenericStatusMonitor.prototype.findStatus = function(code) {
    return _.find(this.STATUS, function(v, k) {
      return v.code === code;
    });
  };

  GenericStatusMonitor.prototype.getDefaultStatus = function() {
    return this.findStatus(0);
  };

  GenericStatusMonitor.prototype.getStatusMessage = function() {
    var fTarget = this._fTarget;
    var status = fTarget ? (fTarget[this._fieldname] || 0) : 0;
    var v = this.findStatus(status) || this.getDefaultStatus();
    return v ? v.getMessage() : 'unable to get status';
  };


  function scmessage(id, args) { return funcs.scmsg(id, 'SmartTicket', args || []); }


  function createTrainingStatusRange(categorizer) {

    function getTrainedCategoryCount() {
      return categorizer.getTrainedCategory().getCount();
    }

    function getTotalCategoryCount() {
      var fCategory = new SCFile('cate2idol2', SCFILE_READONLY);
      var criteria = categorizer.createCategoryQueryCriteria()
        .and(new QueryCond('traincount', GT, 0));
      return fCategory.doCount(criteria);
    }

    // XXX: it's better to use string as the status, still use number for compatible reason
    var statusRange = {
       NOT_START: new Status(0, function() { return scmessage('training.0.standalone.not.start'); }),
       INDEXING:  new Status(1, function() { return scmessage('training.1.standalone.running', [getTrainedCategoryCount(), getTotalCategoryCount()]); }),
       RUNNING:   new Status(2, function() { return scmessage('training.1.standalone.running', [getTrainedCategoryCount(), getTotalCategoryCount()]); }),
       FINISHED:  new Status(3, function() { return scmessage('training.2.standalone.finished', [getTotalCategoryCount()]); }),
	   FAILED:    new Status(4, function() { return scmessage('training.3.standalone.failed'); })
	};

    return statusRange;
  }

  function createStandardTrainingStatusMonitor(categorizer) {
    var fTarget = categorizer.getSCFile();
    var statusRange = createTrainingStatusRange(categorizer);
    return new GenericStatusMonitor(fTarget, statusRange, 'status');
  }

  function createCompanyTrainingStatusMonitor(categorizer) {
    var fCompanyCategory = categorizer.getRootCategory();
    var fCompanyStatus = new SCFile('idolsecgroup');
    fCompanyStatus.doSelect(
      new QueryCond('adapter.id', EQ, categorizer.id).and(
        new QueryCond('security.id', EQ, fCompanyCategory.name)));

    var statusRange = createTrainingStatusRange(categorizer);
    return new GenericStatusMonitor(fCompanyStatus, statusRange, 'training.status', 'training.status.desc');
  }

  function createMultiCompanyTrainingStatusMonitor(categorizer) {
    function getTrainedCompanyCount() {
      var fCompany = new SCFile('idolsecgroup', SCFILE_READONLY);
      
      return fCompany.doCount(new QueryCond('adapter.id', EQ, categorizer.id)
        .and(new QueryCond('training.status', ISIN, [1, 2, 3]))); // indexing, running or finished 
    }

    function getTotalCompanyCount() {
      var fCompany = new SCFile('idolsecgroup', SCFILE_READONLY);
      return fCompany.doCount(new QueryCond('adapter.id', EQ, categorizer.id));
    }

    var fTarget = categorizer.getSCFile();
    // XXX: unlike single company mode, multi-company training was not train in one time
    // customer can choose those company, but decide to train it later
    //
    // at this moment, `company` training task is available in `idolsecgroup` table
    // but not planned to train
    
    var mandantField = categorizer.getMandantField();
    
    var statusRange = {
      NOT_START: new Status(0, function() { return scmessage('training.multi.company.0.not.start'); }),
      INDEXING:  new Status(1, function() { return scmessage('training.multi.company.1.running', [getTrainedCompanyCount(), getTotalCompanyCount()]); }),
      RUNNING:   new Status(2, function() { return scmessage('training.multi.company.1.running', [getTrainedCompanyCount(), getTotalCompanyCount()]); }),
      FINISHED:  new Status(3, function() { return scmessage('training.multi.company.2.finished', [getTrainedCompanyCount()]); }),
      FAILED:    new Status(4, function() { return scmessage('training.multi.company.3.failed'); })
    };
    
    if( mandantField &&  !vars['$G.system.info']['multi.company'] ){
      var statusRange = {
        NOT_START: new Status(0, function() { return scmessage('training.mand.0.not.start'); }),
        INDEXING:  new Status(1, function() { return scmessage('training.mand.1.running', [getTrainedCompanyCount(), getTotalCompanyCount()]); }),
        RUNNING:   new Status(2, function() { return scmessage('training.mand.1.running', [getTrainedCompanyCount(), getTotalCompanyCount()]); }),
        FINISHED:  new Status(3, function() { return scmessage('training.mand.2.finished', [getTrainedCompanyCount()]); }),
        FAILED:    new Status(4, function() { return scmessage('training.mand.3.failed'); })
      };
    }    
    
    
    return new GenericStatusMonitor(fTarget, statusRange, 'status');
  }

  var TRAINING_STATUS_MONITORS = {
    Categorizer: createStandardTrainingStatusMonitor,
    CompanyCategorizer: createCompanyTrainingStatusMonitor,
    MultiCompanyCategorizer: createMultiCompanyTrainingStatusMonitor
  };

  CategorizerStatusManager.prototype.createTrainingStatusMonitor = function() {
    var categorizer = this._categorizer;
    var type = categorizer.getType();
    var factory = TRAINING_STATUS_MONITORS[type];
    return factory(categorizer);
  };

  CategorizerStatusManager.prototype.getTrainingStatus = function() {
    return this.createTrainingStatusMonitor().getStatusMessage();
  };

  CategorizerStatusManager.prototype.findTrainingStatus = function(status) {
    var item= this.createTrainingStatusMonitor().findStatus(status);
    return item ? item.getMessage() : 'unable to get training status';
  };








  // TODO: merge training/testing status management together
  // they are basically the same thing but running on different field
  function createTestingStatusRange(categorizer) {
    function getTestedCount() {
      var round = categorizer.getLatestTestRound();
      var fTestResults = new SCFile('SmartTicketTestResults', SCFILE_READONLY);
      var count = fTestResults.doCount(new QueryCond('round.id', EQ, round));
      return count;
    }

    function getTotalTestCount() {
      var root = categorizer.getRootCategory();
      return root.sourcecount;
    }

    var statusRange = {
      NOT_START: new Status(0, function() { return scmessage("testing.0.standalone.not.start"); }),
      RUNNING:   new Status(1, function() { return scmessage("testing.1.standalone.running", [ getTestedCount(), getTotalTestCount() ]); }),
      FINISHED:  new Status(2, function() { return scmessage("testing.2.standalone.finished", [ getTestedCount() ]); }),
      FAILED:    new Status(3, function() { return scmessage("testing.3.standalone.failed"); })
    };
    return statusRange;
  }


  // XXX: the behavior is different that `training`, why????  ┑(￣Д ￣)┍
  // 1. `training status` was defined in 'idoladapter' table via field 'status'
  // 3. `testing status` was defined in 'cate2idol2' table via field 'testflag'
  // 2. `testing status` in company level was defined in `idolsecgroup` via field 'testing.status'
  function createStandardTestingStatusMonitor(categorizer) {
    var fTarget = categorizer.getRootCategory();
    var statusRange = createTestingStatusRange(categorizer);
    return new GenericStatusMonitor(fTarget, statusRange, 'testflag');
  }

  function createCompanyTestingStatusMonitor(categorizer) {
    var fCompanyCategory = categorizer.getRootCategory();
    var fCompanyStatus = new SCFile('idolsecgroup');
    fCompanyStatus.doSelect(
      new QueryCond('adapter.id', EQ, categorizer.id).and(
        new QueryCond('security.id', EQ, fCompanyCategory.name)));

    var statusRange = createTestingStatusRange(categorizer);
    return new GenericStatusMonitor(fCompanyStatus, statusRange, 'testing.status', 'testing.status.desc');
  }

  function createMultiCompanyTestingStatusMonitor(categorizer) {
    function getTestedCompanyCount() {
      var fCompany = new SCFile('idolsecgroup', SCFILE_READONLY);
      return fCompany.doCount(new QueryCond('testing.status', ISIN, [1, 2])
        .and(new QueryCond('adapter.id', EQ, categorizer.id))); // running or finished
    }

    function getTotalCompanyCount() {
      var fCompany = new SCFile('idolsecgroup', SCFILE_READONLY);
      return fCompany.doCount(new QueryCond('adapter.id', EQ, categorizer.id));
    }

    var fTarget = categorizer.getRootCategory();
    
    var mandantField = categorizer.getMandantField();
    
    
    var statusRange = {
      NOT_START: new Status(0, function() { return scmessage('testing.multi.company.0.not.start'); }),
      RUNNING:   new Status(1, function() { return scmessage('testing.multi.company.1.running', [getTestedCompanyCount(), getTotalCompanyCount()]); }),
      FINISHED:  new Status(2, function() { return scmessage('testing.multi.company.2.finished', [getTestedCompanyCount()]); }),
      FAILED:    new Status(3, function() { return scmessage('testing.multi.company.3.failed'); })
    };
            
    
    if( mandantField &&  !vars['$G.system.info']['multi.company'] ){
      var statusRange = {
        NOT_START: new Status(0, function() { return scmessage('testing.mand.0.not.start'); }),
        RUNNING:   new Status(1, function() { return scmessage('testing.mand.1.running', [getTestedCompanyCount(), getTotalCompanyCount()]); }),
        FINISHED:  new Status(2, function() { return scmessage('testing.mand.2.finished', [getTestedCompanyCount()]); }),
        FAILED:    new Status(3, function() { return scmessage('testing.mand.3.failed'); })
      };
    }

    return new GenericStatusMonitor(fTarget, statusRange, 'testflag');
  }


  var TESTING_STATUS_MONITORS = {
    Categorizer: createStandardTestingStatusMonitor,
    CompanyCategorizer: createCompanyTestingStatusMonitor,
    MultiCompanyCategorizer: createMultiCompanyTestingStatusMonitor
  };

  CategorizerStatusManager.prototype.createTestingStatusMonitor = function() {
    var categorizer = this._categorizer;
    var type = categorizer.getType();
    var factory = TESTING_STATUS_MONITORS[type];
    return factory(categorizer);
  };

  CategorizerStatusManager.prototype.getTestingStatus = function() {
    return this.createTestingStatusMonitor().getStatusMessage();
  };
  
  CategorizerStatusManager.prototype.findTestingStatus = function(status) {
    var item= this.createTestingStatusMonitor().findStatus(status);
    return item ? item.getMessage() : 'unable to get status';
  };





  // TODO: refine these `status`, they are not consistent, and no patten to follow
  // currently these status flag values are just for compatible reason
  CategorizerStatusManager.prototype.createTuningStatusMonitor = function() {
    var categorizer = this._categorizer;
    var fTarget = categorizer.getSCFile();
    var statusRange = {
      NOT_START: new Status(0, function() { return funcs.scmsg("TuningStatus_2","IDOLCategoryTuning"); }),
      INDEXING: new Status(11, function() { return funcs.scmsg("TuningStatus_4","IDOLCategoryTuning"); }),
      TUNING: new Status(12, function() {
        var total = categorizer.getTrainedCategory().getCount();
        var finished = new SCFile('cate2idol2', SCFILE_READONLY)
          .doCount("tuningstatus isin {1,2} and groupid=" + categorizer.id);
        return funcs.scmsg("TuningStatus_5","IDOLCategoryTuning", [ total - finished ]);
      }),
      FINISHED: new Status(13, function() {
        var count =  new SCFile('cate2idol2', SCFILE_READONLY)
          .doCount("tuningstatus=2 and groupid=" + categorizer.id);
        if(count == 0) {
          return funcs.scmsg("TuningStatus_6","IDOLCategoryTuning");
        } else {
          return funcs.scmsg("TuningStatus_7","IDOLCategoryTuning",[ count ]);
        }
      }),
      FAILED: new Status(100, function() { return funcs.scmsg("TuningStatus_8","IDOLCategoryTuning"); }),
      CATEGORY_SKIPPED: new Status(1, function() { return 'Skipped'; }),
      CATEGORY_FINISHED: new Status(2, function() { return 'Finished'; })
    };
    return new GenericStatusMonitor(fTarget, statusRange, 'tuningstatus');
  };

  CategorizerStatusManager.prototype.getTuningStatus = function() {
    return this.createTuningStatusMonitor().getStatusMessage();
  };

   CategorizerStatusManager.prototype.findTuningStatus = function(status) {
    var item= this.createTuningStatusMonitor().findStatus(status);
    return item ? item.getMessage() : 'unable to get tunning status';
  };

  return {
    create : function(categorizer) {
      return new CategorizerStatusManager(categorizer);
    }
  };
}());


function require() {
  return IDOLSmartTicketCategorizerStatusManager;
}