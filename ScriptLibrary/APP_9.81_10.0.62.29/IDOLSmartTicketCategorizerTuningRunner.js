/**
 * From IDOL server's perspective, there is no speicifc action for 'tuning'.
 * IDOL only accept indexing/training commands.
 *
 * Tuning is only available in Service Manager, its internal backend is still
 * IDOL training/indexing
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategorizerTuningRunner');

var IDOLSmartTicketCategorizerTuningRunner = (function() {

  function TuningRunner(category, round) {
    this._categorizer = category.getCategorizer();
    this._category = category;
    this._round = round;
  }

  TuningRunner.prototype._doRollback = function(client, options) {
    var category = this._category;
    var fSnapshot = category.getSnapshot(this._round);
    logger.info('restore training documents, category: ' + category.getId());
    category.rollbackTo(fSnapshot);
    this._doTune(client, options);

    logger.info('update term info after category restored, category: ' + category.getId());
    var terms = fSnapshot.term.toArray(),
        weights = fSnapshot['term.weight'].toArray();
    var tnw = _.object(terms, weights);

    // TODO: reset status if term weight doesn't change
    category.updateTerms(client, tnw);
  };

  TuningRunner.prototype._doTune = function(client, options) {
    var category = this._category;
    var statusManager = this._categorizer.getStatusManager();
    var tuneMonitor = statusManager.createTuningStatusMonitor();
    var STATUS = tuneMonitor.STATUS;

    var startTime = new Date();
    // by default, only changed category need tuning
    // but if this `force` flag was set, rebuild category even it doesn't changed
    var force = !!options.force; 
    try {
      logger.info('smart ticket tuning started, ' + this._categorizer);
      tuneMonitor.reset();
      tuneMonitor.updateStatus(STATUS.NOT_START);

      var database = this._categorizer.getIDOLDatabaseName();
      var tags = client.getDistributeNameAndValue(database);

      tuneMonitor.updateStatus(STATUS.INDEXING);
      category.each(function(category) {
        category.doIndex(client, tags);
      });
      client.flushAndWait();

      tuneMonitor.updateStatus(STATUS.TUNING);
      category.each(function(category) {
        // category training can take quite a long time, skip category which
        // doesn't have any modification.
        if (category.hasChanged(client) || force) {
          category.doTrain(client);
          // tuneMonitor.updateCategoryStatus(category, STATUS.CATEGORY_FINISHED);
        } else {
          logger.info('category: ' + category.getId() + ' doesn\'t have any modification, skip');
          // tuneMonitor.updateCategoryStatus(category, STATUS.CATEGORY_SKIPPED);
        }
      });
      
      // backup category
      lib.IDOL_Restore.backupCategoryEntrance();
      // backup category

      tuneMonitor.updateStatus(STATUS.FINISHED);
    } catch (e) {
      logger.error(e);
      logger.error(e.stack);
      tuneMonitor.updateStatus(STATUS.FAILED);
      throw e;
    } finally {
      var endTime = new Date();
      logger.info('smart ticket tuning finished in ' + (endTime - startTime) + 'ms');
      this._categorizer.updateProps('last.tuning.time', endTime);
    }
  };

  TuningRunner.prototype.run = function(client, options) {
    options = options || {};
    if (this._round) {
      logger.info('rollback category ' + this._category.getId() + ' to round: ' + this._round);
      this._doRollback(client, options);
    } else {
      logger.info('tune category ' + this._category.getId());
      this._doTune(client, options);
    }
  };

  return {
    create : function(client, round) {
      return new TuningRunner(client, round);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerTuningRunner;
}