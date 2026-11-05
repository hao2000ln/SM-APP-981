var _ = lib.Underscore.require(),
    IDOLSmartTicketCategorySync = lib.IDOLSmartTicketCategorySync.require(),
    IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();

var logger = getLog('IDOLSmartTicketCategorizerTrainingRunner');

var IDOLSmartTicketCategorizerTrainingRunner = (function() {


  function syncCategorizer(categorizer) {
    var monitor = categorizer.getStatusManager().createTrainingStatusMonitor();
    var TRAINING_STATUS = monitor.STATUS;
    var startTime = new Date();

    try {
      logger.info(categorizer + ' training started');
      monitor.updateStatus(TRAINING_STATUS.RUNNING);

      // TODO: found the newly added/remoted category, the result is a JSON array
      // can display in UI to allow agent confirm
      var diffs1 = IDOLSmartTicketCategorySync.diff(categorizer, 'working', 'staging');
      if (diffs1.length > 0) {
        // Once agent confirmed, use the returned diff and applied to staging environment
        // and staging environment can sync changes to IDOL server automatically
        //
        // this 'sync' depends on the requirement, the basic data structure is `tree`
        IDOLSmartTicketCategorySync.patch(categorizer, diffs1, 'staging');
      }

      var diffs2 = IDOLSmartTicketCategorySync.diff(categorizer, 'staging', 'idol');

      if (diffs2.length > 0) {
        // XXX: it is possible to have a system have category defined but crashed during index
        // at that time we cannot found any modification on category, but have error during training
        // because training samples are not there, so always index the training sample even it already exists
        var client = categorizer.createClient();
        categorizer.indexTrainingSamples(client);

        IDOLSmartTicketCategorySync.patch(categorizer, diffs2, 'idol');
      } else {
        logger.warn(categorizer + ', no category change found, skip training');
      }

      categorizer.done();
      monitor.updateStatus(TRAINING_STATUS.FINISHED);
      logger.info(categorizer + ', training finished');
    } catch (e) {
      logger.error(categorizer + ', training failed');
      logger.error(e);
      logger.error(e.stack);

      monitor.updateStatus(TRAINING_STATUS.FAILED);
      throw e;
    } finally {
      var endTime = new Date();
      logger.info(categorizer + ', smart ticket training finished in ' + (endTime - startTime) + 'ms');
    }
  }

  function MultiCompanyTrainingRunnder(fCategorizer, companies) {
    this._fCategorizer = fCategorizer;
    this._companies = companies;
  }

  MultiCompanyTrainingRunnder.prototype.run = function() {
    var fCategorizer = this._fCategorizer;
    // XXX: no company parameter specified, it will update status for ALL company wide
    var multiCompanyCategorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
    var monitor = multiCompanyCategorizer.getStatusManager().createTrainingStatusMonitor();

    var TRAINING_STATUS = monitor.STATUS;
    try {
      monitor.updateStatus(TRAINING_STATUS.RUNNING);
      _.each(this._companies, function(company) {
        var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
        logger.info(categorizer + ', start sync categories');
        syncCategorizer(categorizer);
      });
      monitor.updateStatus(TRAINING_STATUS.FINISHED);
      
      // backup category
      lib.IDOL_Restore.backupCategoryEntrance();
      // backup category
    } catch (e) {
      monitor.updateStatus(TRAINING_STATUS.FAILED);
      throw e;
    }
  };

  function TrainingRunner(fCategorizer) {
    this._fCategorizer = fCategorizer;
  }

  TrainingRunner.prototype.run = function() {
    var categorizer = IDOLSmartTicketCategorizerFactory.create(this._fCategorizer);
    syncCategorizer(categorizer);
    // backup category
    lib.IDOL_Restore.backupCategoryEntrance();
    // backup category
  };

  return {
    create: function(fCategorizer, company) {
      company = company || '';
      var companies = company.split(',');
      if (companies.length > 0) {
        return new MultiCompanyTrainingRunnder(fCategorizer, companies);
      } else {
        return new TrainingRunner(fCategorizer);
      }
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerTrainingRunner;
}