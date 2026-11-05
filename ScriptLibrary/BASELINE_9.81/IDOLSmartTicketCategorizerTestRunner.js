/**
 * There are three basic blocks to save/calculate the test result
 *
 * 1. SmartTicketTestRounds: SCFile
 *    One categorizer can be tested several times.
 *    SmartTicketTestRounds record is inserted before categorizer test and will 
 *    be updated when test finished
 *
 * 2. SmartTicketTestResults: SCFile
 *    Save all kinds of test results, organized by SmartTicketTestRounds
 *
 * 3. SmartTicketCategorySnapshot: SCFile
 *    Since the training document, term weight can be changed during tuning iteration. 
 *    The category configuration must be saved at the end of test, otherwise 
 *    its not easy to tell why the test is correct/incorrect. 
 *
 *    And this snapshot also allow admin rollback to certain test round which 
 *    he/she think is better.
 */
var _ = lib.Underscore.require();
var IDOLCommon = lib.IDOLCommon.require();
var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();
var IDOLSmartTicketCategorizerTestReport = lib.IDOLSmartTicketCategorizerTestReport.require();
var IDOLSmartTicketCategorizerTestConfusionMatrix = lib.IDOLSmartTicketCategorizerTestConfusionMatrix.require();
    
var logger = getLog('IDOLSmartTicketCategorizerTestRunner');

var IDOLSmartTicketCategorizerTestRunner = (function() {

  function CategorizationAccuracyTest(categorizer) {
    var client = categorizer.createClient();
    this._categorizer = categorizer;
    this._client = client;
    this._agent = categorizer.createSuggestionAgent(client, { env : 'test' });
  }

  /**
   * Save full test enviroment for later reference, or rollback to this snapshot
   */
  CategorizationAccuracyTest.prototype._takeSnapshot = function(fRound) {
    var categorizer = this._categorizer;
    var client = this._client;
    var collection = categorizer.getTrainedCategory();

    var matrix = IDOLSmartTicketCategorizerTestConfusionMatrix.create(categorizer, fRound);
    collection.each(function(category) {
      var id = category.getId();
      var meta = {
        round: fRound.id,
        precision : matrix.calculatePrecision(id),
        recall : matrix.calculateRecall(id),
        "f1.score" : matrix.calculateF1Score(id)
      };
      logger.info(categorizer + ', taking snapshot for category: ' + id);
      category.takeSnapshot(client, meta);
    });

    var report = IDOLSmartTicketCategorizerTestReport.create(categorizer, fRound);
    var categorySummary = report.createSummary();
    fRound['category.count'] = collection.getCount();

    var summary = _.reduce(categorySummary, function(result, d) {
      result.hit1 += d.hit1 || 0;
      result.hit2 += d.hit2 || 0;
      result.hit3 += d.hit3 || 0;
      result.total += d.total || 0;
      return result;
    }, { hit1: 0, hit2: 0, hit3: 0, total: 0});

    fRound['test.hit.1.count'] = summary.hit1;
    fRound['test.hit.2.count'] = summary.hit2;
    fRound['test.hit.3.count'] = summary.hit3;
    fRound['test.sample.count'] = summary.total;
  };

  CategorizationAccuracyTest.prototype._createTestSampleExecutor = function(iterateTicket) {
    // var categorizer = this._categorizer;
    var agent = this._agent;

    return function(receiveResult, scope) {
      // `category` is only available when running confusion matrix test
      iterateTicket(function(fTicket, i, category) {
        var predicteds;
        var err;
        try {
          predicteds = agent.suggestIDOLCategory(fTicket);
          err = null;
        } catch(e) {
          logger.error(e);
          logger.error(e.stack);
          predicteds = [];
          err = e;
        }
        return receiveResult.call(scope, err, fTicket, predicteds, category);
      });
    };
  };

  CategorizationAccuracyTest.prototype._createCategorizerTestSampleIterator = function() {
    var categorizer = this._categorizer;
    var filename = categorizer.getFilename();
    return function(callback, scope) {
      var collection = categorizer.getTrainedCategory();
      var skip = false;
      collection.each(function(category) {
        if (skip) { return; }
        var refs = category.getTestDocumentRefs();
        var iterateTestSample = IDOLCommon.createSCFileIDsIterator(filename, refs);
        var rc = iterateTestSample(function(fTicket, i) {
          // XXX: this a dirty hack,
          // since for confusion matrix test, we need to know which category this test sample belongs to
          // otherwise have to invoke `this.findCategory` to find related record which will introduce
          // one more database access
          //
          // and since this iteration is internal used only, so it is feasible to do so.
          return callback.call(scope, fTicket, i, category);
        }, scope);
      }, this);
    };
  };

  CategorizationAccuracyTest.prototype._saveTestResults = function(err, fRound, category, fTicket, predicteds) {
    predicteds = predicteds || [];
    var predicted = predicteds[0] || {};
    var agent = this._agent;
    var plain;
    var explains;

    try {
      // cannot throw exception again while saving errors
      plain = agent.getPlainDocument(fTicket);
      explains = agent.explainText(plain); // for test sample analyze purpose
    } catch(e) {
      logger.error(e);
    }

    var categorizer = this._categorizer;
    var recordId = categorizer.getRecordId(fTicket);
    logger.info(categorizer + ', ' + recordId + ', expected: ' + category.getId() + ', predicted: ' + predicted.id);

    var status = err ? 'failed' : 'normal';

    // it's possible to have a test which has no prediction result, but still
    // need to add one result record
    predicteds = predicteds || [];
    predicteds = _.isArray(predicteds) ? predicteds : [predicteds];

    var predictedIds = _.pluck(predicteds, 'id');
    var predictedScores = _.pluck(predicteds, 'weight');
    var predictedKeywords = _.pluck(predicteds, 'links');

    // it has counter: SmartTicketTestResults -> id
    var instance = new SCFile('SmartTicketTestResults');
    instance['round.id'] = fRound.id;
    instance['categorizer.id'] = categorizer.id;
    instance['record.id'] = IDOLCommon.getIdentity(fTicket);
    instance['category.id'] = category.getId();
    instance['company'] = fRound.company;

    instance['predicted.id'] = predictedIds;
    instance['predicted.score'] = predictedScores;
    instance['predicted.keywords'] = predictedKeywords;

    // duplicate results to make it be able to aggregate result via single SQL
    _.each(predicteds, function(predicted, i) {
      if (i <= 2) {
	      var index = i + 1;
	      var idKey = 'predicted.' + index + '.id';
	      var scoreKey = 'predicted.' + index + '.score';
	      var keywordsKey = 'predicted.' + index + '.keywords';
	      instance[idKey] = predicted.id;
	      instance[scoreKey] = predicted.weight;
	      instance[keywordsKey] = IDOLCommon.toSCArray(predicted.links);
	  }
    });

    instance['test.sample.terms'] = _.pluck(explains, 'term');
    instance['test.sample.terms.weight'] = _.pluck(explains, 'weight');
    instance['test.sample.terms.occurs'] = _.pluck(explains, 'occurrences');
    instance['test.sample.terms.total.occurs'] = _.pluck(explains, 'total');

    // when exception occurred, add test results with `error` status
    instance.status = status || 'normal';
    instance.source = plain;

    if (err) {
      var comment = err;
      comment += '\n';
      comment += err.stack || '';
      instance.comment = comment;
    }
    return instance.doInsert();
  };

  CategorizationAccuracyTest.prototype.runIteratorTest = function(iterateTicket, receiveResult, scope) {
    var executeTest = this._createTestSampleExecutor(iterateTicket);
    return executeTest(receiveResult, scope);
  };

  // XXX: use transaction? dbStartTransaction/dbRollback
  CategorizationAccuracyTest.prototype.run = function() {
    var categorizer = this._categorizer;
    var startTime = new Date();
    var fRound = new SCFile('SmartTicketTestRounds');
    // if `root category` id doesn't change, they must be the same category tree
    fRound['root.category.id'] = categorizer.getRootCategory().id;
    fRound['test.time'] = new Date();
    fRound['categorizer.id'] = categorizer.id;
    fRound['suggestion.threshold'] = categorizer.getThreshold();
    fRound['pre.filled.fields'] = this._agent.getPrefilledFields().join(',');
    fRound['company'] = categorizer._company;
    
//    fRound.status = 'running';

    var rc = fRound.doInsert();
    if (rc !== RC_SUCCESS) {
      throw new Error('cannot start a new round of Smart Ticket testing');
    }

    logger.info(categorizer + ', smart ticket testing started, round: ' + fRound.id);

    var monitor = categorizer.getStatusManager().createTestingStatusMonitor();
    var TEST_STATUS = monitor.STATUS;

    try {
      var ticketIterator = this._createCategorizerTestSampleIterator();

      monitor.updateStatus(TEST_STATUS.RUNNING);

      this.runIteratorTest(ticketIterator, function(err, fTicket, predicteds, category) {
        this._saveTestResults(err, fRound, category, fTicket, predicteds);
      }, this);

      this._takeSnapshot(fRound);

      monitor.updateStatus(TEST_STATUS.FINISHED);

//      fRound.status = 'finished';
    } catch(e) {
      logger.error('fail to generate test results');
      logger.error(e);
      logger.error(e.stack);
//      fRound.status = 'failed';

      monitor.updateStatus(TEST_STATUS.FAILED);
      throw e;
    } finally {
      fRound.doSave();
      var endTime = new Date();
      logger.info(categorizer + ', smart ticket testing finished in ' + (endTime - startTime) + 'ms');
    }
    return fRound;
  };

  CategorizationAccuracyTest.prototype.findCategory = function(fTicket) {
    return this._agent.findCategory(fTicket);
  };


  function MultiCompanyCategorizationAccuracyTest(fCategorizer, companies) {
    this._fCategorizer = fCategorizer;
    this._companies = companies;
  }

  MultiCompanyCategorizationAccuracyTest.prototype.run = function() {
    var fCategorizer = this._fCategorizer;
    // XXX: no company parameter specified, it will update status for ALL company wide
    var multiCompanyCategorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
    var monitor = multiCompanyCategorizer.getStatusManager().createTestingStatusMonitor();

    var TESTING_STATUS = monitor.STATUS;
    try {
      monitor.updateStatus(TESTING_STATUS.RUNNING);
      _.each(this._companies, function(company) {
        var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
        logger.info(categorizer + ', start testing categories');
        new CategorizationAccuracyTest(categorizer).run();
      });
      monitor.updateStatus(TESTING_STATUS.FINISHED);
    } catch (e) {
      monitor.updateStatus(TESTING_STATUS.FAILED);
      throw e;
    }
  };

  return {
    create : function(fCategorizer, company) {
      company = company || '';
      var companies = company.split(',');
      if (companies.length > 0) {
        return new MultiCompanyCategorizationAccuracyTest(fCategorizer, companies);
      } else {
        var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
        return new CategorizationAccuracyTest(categorizer);
      }
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerTestRunner;
}