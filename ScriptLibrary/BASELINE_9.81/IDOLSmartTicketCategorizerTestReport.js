/**
 * Generate text report for Smart Ticket category testing
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategorizerTestReport');

var IDOLSmartTicketCategorizerTestReport = (function() {

  function CategorizerTestResultReporter(categorizer, round) {
    this._categorizer = categorizer;
    this._round = round;
  }

  CategorizerTestResultReporter.prototype._countCategoryTestResult = function(sql) {
    logger.debug('execute SQL: ' + sql);
    var matrix = new SCFile('SmartTicketTestResults', SCFILE_READONLY);
    var rc = matrix.doSelect(sql), result = {};
    while (rc === RC_SUCCESS) {
      var category = matrix[0], count = matrix[1];
      result[category] = count;
      rc = matrix.getNext();
    }
    return result;
  };

  CategorizerTestResultReporter.prototype._countCategoryWithRestriction = function(restrict) {
    var id = this._categorizer.id, round = this._round;
    restrict = restrict || 'true';
    var sql = 
      'select category.id, count(category.id) ' +
      'from SmartTicketTestResults ' + 
      'where round.id = ' + round + ' and ' + 
            'categorizer.id=' + id + ' and ' +
            restrict + ' ' +
      'group by category.id';
    return sql;
  };

  CategorizerTestResultReporter.prototype._generateHitNSQL = function(fieldname) {
    var restrict = '(category.id=' + fieldname + ' and (status="normal" or status=NULL))';
    return this._countCategoryWithRestriction(restrict);
  };

  CategorizerTestResultReporter.prototype._generateTotalSQL = function() {
    //2018. 01.31: Total = fail + miss + hit
    return this._countCategoryWithRestriction('(status="normal" or status=NULL or status="failed")');
  };

  CategorizerTestResultReporter.prototype._generateFailSQL = function() {
    return this._countCategoryWithRestriction('status = "failed"');
  };

  CategorizerTestResultReporter.prototype._categoryTestResultModel = function(category) {
    var categorizer = this.getCategorizer(),
        round = this.getRound();

    var categoryId = category.getId();

    var sql = 
      'select predicted.1.id, count(*) ' +
      'from SmartTicketTestResults ' + 
      'where round.id = ' + round + ' and categorizer.id=' + categorizer.id + ' and category.id=' + categoryId + ' ' +
      'group by predicted.1.id';

    var results = new SCFile('SmartTicketTestResults', SCFILE_READONLY);
    logger.debug('calculate Smart Ticket category accuracy via SQL: ' + sql);
    var rc = results.doSelect(sql), output = [];
    while(rc === RC_SUCCESS) {
      output.push({
        category: categoryId,
        predicted: matrix[1] || '',
        value: matrix[2]
      });
      rc = matrix.getNext();
    }
    return output;
  };

  CategorizerTestResultReporter.prototype.createSummary = function() {
    var hit1Counts = this._countCategoryTestResult(this._generateHitNSQL('predicted.1.id')),
        hit2Counts = this._countCategoryTestResult(this._generateHitNSQL('predicted.2.id')),
        hit3Counts = this._countCategoryTestResult(this._generateHitNSQL('predicted.3.id')),
        failCounts = this._countCategoryTestResult(this._generateFailSQL()),
        totalCounts = this._countCategoryTestResult(this._generateTotalSQL());

    var result = {};
    _.each(totalCounts, function(total, category) {
      var hit1 = hit1Counts[category] || 0,
          hit2 = hit2Counts[category] || 0,
          hit3 = hit3Counts[category] || 0,
          fail = failCounts[category] || 0;

      // because there is no `number of results` restriction for category suggestion test
      // that is to say, it is possible to have matched category at 4th position
      // 
      // But in Smart Ticket feature, we only consider top 3 categories
      // mark test result as `miss` when category doesn't appears in top 3;
      // 2018. 01.31: fail is count as miss, since it does not have predict result
      var miss = total - hit1 - hit2 - hit3;

      result[category] = {
        hit1 : hit1,
        hit2 : hit2,
        hit3 : hit3,
        fail : fail,
        miss : miss,
        total : total
      };
    });
    return result;
  };


  CategorizerTestResultReporter.prototype.generateTestStatistics = function() {
    var summary = this.createSummary();
    // accumulated values
    var accHit1 = 0, accHit2 = 0, accHit3 = 0, accMiss = 0, accFail = 0, accTotal = 0;
    _.each(summary, function(v, category) {
      accHit1 += v.hit1;
      accHit2 += v.hit2;
      accHit3 += v.hit3;
      accMiss += v.miss;
      accFail += v.fail;
      accTotal += v.total;
    });
    return {
      accHit1: accHit1,
      accHit2: accHit2,
      accHit3: accHit3,
      accMiss: accMiss,
      accFail: accFail,
      accTotal: accTotal
    };
  };

  CategorizerTestResultReporter.prototype.generateTextReport = function(options) {
    var statistics = this.generateTestStatistics();

    var accTotal = statistics.accTotal;
    var accHit1 = statistics.accHit1;
    var accHit2 = statistics.accHit2;
    var accHit3 = statistics.accHit3;
    var accMiss = statistics.accMiss;
    var accFail = statistics.accFail;
    
    // prevent devide by zero, but it cannot happen, because at least one test sample exists
    if (accTotal > 0) {
      var hit1Rate = 100 * accHit1 / accTotal,
          hit2Rate = 100 * (accHit1 + accHit2) / accTotal,
          hit3Rate = 100 * (accHit1 + accHit2 + accHit3) / accTotal,
          missRate = 100 * accMiss / accTotal,
          failRate = 100 * accFail / accTotal;
     
      var report = '';
      report += funcs.scmsg("TestReport_7", "acicategory", [ accHit1 , hit1Rate.toFixed(2) ]) + "%\n";
      report += funcs.scmsg("TestReport_8", "acicategory", [ accHit2 , hit2Rate.toFixed(2) ]) + "%\n";
      report += funcs.scmsg("TestReport_9", "acicategory", [ accHit3 , hit3Rate.toFixed(2) ]) + "%\n";
      // TODO: refine `no suggestion` and `miss` definition
      // report += funcs.scmsg("TestReport_10", "acicategory", [ accFail , failRate.toFixed(2) ]) + "%\n";
      report += funcs.scmsg("TestReport_11", "acicategory", [ accMiss , missRate.toFixed(2) ]) + "%\n";
      report += funcs.scmsg("TestReport_12","acicategory", [accTotal]);
    } else {
      report = funcs.scmsg("TestReport_2","acicategory");
    }
    return report;
  };

  CategorizerTestResultReporter.prototype.generateCategoryReport = function(category) {
    var results = this._categoryTestResultModel(category);
    var total = 0, hit = 0;
    _.each(results, function(d) {
      var count = d.value;
      total += count;
      if (d.category === d.predicted) {
        hit += count;
      }
    });
    return results;
  };

  return {
    create : function(categorizer, fRound) {
      var round = _.isNumber(fRound) ? fRound : fRound.id;
      return new CategorizerTestResultReporter(categorizer, round);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerTestReport;
}
