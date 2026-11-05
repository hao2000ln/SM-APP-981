/**
 * Use test sample to test the categorizer accuracy
 * https://en.wikipedia.org/wiki/Precision_and_recall
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategorizerTestConfusionMatrix');

var IDOLSmartTicketCategorizerTestConfusionMatrix = (function() {

  function formatNum(value) {
    return Number.prototype.toFixed.call(value, 2);
  }

  function CategoryViewModel(id, matrix, cfg) {
    this._id = id;
    this._matrix = matrix;
    this._name = matrix.getCategoryCaption(id);
    this._cfg = cfg;
  }

  CategoryViewModel.prototype.toString = function() {
    return 'Category View: ' + this._id + ' ' + this._name;
  };

  CategoryViewModel.prototype.getSCActiveLink = function() {
    var query = 'id="' + this._id + '"';
    return 'scactivelink://cate2idol2:' + _.escape(query);
  };

  CategoryViewModel.prototype.generateLink = function() {
    var id = this._id,
        title = 'Category: ' + this._name,
        link = this.getSCActiveLink();
    return '<a href="' + link + '" title="' + title + '">' + id + '</a>';
  };

  CategoryViewModel.prototype._highlightStyle = function(value) {
    var cfg = this._cfg;
    var low = cfg.low, mid = cfg.mid;
    if      (!value) /* NaN or 0 */       { return 'plain'; } 
    else if (value <= low)                { return 'low'; } 
    else if (low < value && value <= mid) { return 'mid'; } 
    else                                  { return 'high'; }
  };

  CategoryViewModel.prototype.getCellStyle = function(category, predicted, value) {
    if (category === predicted) {
      return 'normal';
    } else {
      return 'highlight ' + this._highlightStyle(value);
    }
  };

  CategoryViewModel.prototype.getCellValue = function(category, predicted) {
    var cfg = this._cfg;
    if (cfg.type === 'bypercentage') {
      var count = this._matrix.getCount(category, predicted),
          total = this._matrix.getTotal();
      return (count / total) * 100;
    } else {
      return this._matrix.getCount(category, predicted);
    }
  };

  CategoryViewModel.prototype.getCellText = function(value) {
    return this._cfg.type === 'bypercentage' ? formatNum(value) : value;
  };

  CategoryViewModel.prototype.generateCell = function(predicted) {
    var round = this._matrix.getRound(),
        from = this._id, 
        to = predicted._id;

    var value = this.getCellValue(from, to);
    if (value > 0) {
      var query = "category.id=\"" + from + "\" and predicted.1.id=\"" + to + "\" and round.id=" + round;
      var link = 'scactivelink://SmartTicketTestResults:' + _.escape(query);
      var cls = this.getCellStyle(from, to, value);
      var title = 'Category: ' + this._name + '\n' + 'Predicted: ' + predicted._name;
      var text = this.getCellText(value);
      return '<a class="' + cls + '" href="' + link + '" title="' + title + '">' + text + '</a>';
    } else {
      return value;
    }
  };

  CategoryViewModel.prototype.generateNoSuggestCell = function() {
    var round = this._matrix.getRound(),
        from = this._id;

    var value = this.getCellValue(from);
    if (value > 0) {
      var query = "category.id=\"" + from + "\" and predicted.1.id=NULL and round.id=" + round;
      var link = 'scactivelink://SmartTicketTestResults:' + _.escape(query);
      var cls = this.getCellStyle(from, null, value);
      var text = this.getCellText(value);
      return '<a class="' + cls + '" href="' + link + '">' + text + '</a>';
    } else {
      return value;
    }
  };

  // TODO:
  CategoryViewModel.prototype.generateFailedCell = function() {

  };

  CategoryViewModel.prototype.getCount = function(predicted) {
    if (predicted) {
      var from = this._id, to = predicted._id;
      return this._matrix.getCount(from, to);
    } else {
      return 0;
    }
  };

  CategoryViewModel.prototype.getCategoryCount = function() {
    return this._matrix.categoryCount(this._id);
  };

  CategoryViewModel.prototype.getPrecision = function() {
    var precision = this._matrix.calculatePrecision(this._id);
    return formatNum(precision);
  };

  CategoryViewModel.prototype.getRecall = function() {
    var recall = this._matrix.calculateRecall(this._id);
    return formatNum(recall);
  };

  CategoryViewModel.prototype.getF1Score = function() {
    var f1 = this._matrix.calculateF1Score(this._id);
    return formatNum(f1);
  };

  function getTemplate(name) {
    var resources = new SCFile('idolwebresources', SCFILE_READONLY);
    var rc = resources.doSelect(new QueryCond('name', EQ, name));
    if (rc !== RC_SUCCESS) {
      throw new Error('resource ' + name + ' is not available');
    }
    var tpl = resources.min || resources.raw;
    return _.template(tpl);
  }

  function hasher() {
    var args = _.toArray(arguments);
    return _.compact(args).join('_');
  }

  function ConfusionMatrix(data, meta, options) {
    var captions = meta.captions,
        round = meta.round,
        countLookupMap = {}, 
        categories = [],
        total = 0;

        
    var localData = data['results'];
    var trainedCategoryNum = data['trainedCategoryNum']
    _.each(localData, function(row) {
      var category = row.category,
          predicted = row.predicted,
          count = row.value || 0;
      total += count;
      var compoundKey = hasher(category, predicted);
      countLookupMap[compoundKey] = count;
      categories.push(category);
    });

    this._countLookupMap = countLookupMap;
    this._categories = _.uniq(categories);
    this._total = total;
    this._round = round;
    this._captions = captions;
    this._trainedCategoryNum = trainedCategoryNum;
  }

  ConfusionMatrix.prototype.toString = function() {
    return 'Confusion Matrix: ' + rteJSONStringify(this._categories);
  };

  ConfusionMatrix.prototype.getCategories = function() {
    return this._categories;
  };

  ConfusionMatrix.prototype.getCategoryCaption = function(id) {
    return this._captions[id];
  };

  ConfusionMatrix.prototype.getRound = function() {
    return this._round;
  };

  ConfusionMatrix.prototype.getCount = function(from, to) {
    return this._countLookupMap[hasher(from, to)] || 0;
  };

  ConfusionMatrix.prototype.getTotal = function() {
    return this._total;
  };

  ConfusionMatrix.prototype.getTruePositive = function(id) {
    return this.getCount(id, id) || 0;
  };

  ConfusionMatrix.prototype.categoryCount = function(id) {
    var count = 0;
    _.each(this._categories, function(predicted) {
      count += this.getCount(id, predicted);
    }, this);
    return count;
  };

  ConfusionMatrix.prototype.predictionCount = function(id) {
    var count = 0;
    _.each(this._categories, function(category) {
      count += this.getCount(category, id);
    }, this);
    return count;
  };

  ConfusionMatrix.prototype.calculatePrecision =function(id) {
    var tp = this.getTruePositive(id),
        total = this.predictionCount(id);
    return tp / total; 
  };

  ConfusionMatrix.prototype.calculateRecall = function(id) {
    var tp = this.getTruePositive(id),
        total = this.categoryCount(id);
    return tp / total;
  };
  
  ConfusionMatrix.prototype.calculateF1Score = function(id) {
    var precision = this.calculatePrecision(id),
        recall = this.calculateRecall(id);
    return (2 * precision * recall) / (precision + recall);
  };

  ConfusionMatrix.prototype.toHTML = function(cfg) {
    var categories = cfg.categories || this.getCategories();
    var vm = _.map(categories, function(id) {
      return new CategoryViewModel(id, this, cfg);
    }, this);
    var template = getTemplate('IDOL_SMART_TICKET_CONFUSION_MATRIX');
    //var total = this.getCategories().length;
    var total = this._trainedCategoryNum;
    var selected = categories.length;
    var message = funcs.scmsg('confusion.matrix.category.selection', 'SmartTicket', [selected, total]);
    
    var localmsg = {
      "confusion.matrix.sample.category": funcs.scmsg('confusion.matrix.sample.category', 'SmartTicket'),
      "confusion.matrix.sample.predicated.category": funcs.scmsg('confusion.matrix.sample.predicated.category', 'SmartTicket'),
      "confusion.matrix.high.error": funcs.scmsg('confusion.matrix.high.error', 'SmartTicket'),
      "confusion.matrix.midium.error": funcs.scmsg('confusion.matrix.midium.error', 'SmartTicket'),
      "confusion.matrix.low.error": funcs.scmsg('confusion.matrix.low.error', 'SmartTicket'),
      "confusion.matrix.correct.prediction": funcs.scmsg('confusion.matrix.correct.prediction', 'SmartTicket'),
      "confusion.matrix.row.label.category": funcs.scmsg('confusion.matrix.row.label.category', 'SmartTicket'),
      "confusion.matrix.row.label.count": funcs.scmsg('confusion.matrix.row.label.count', 'SmartTicket'),
      "confusion.matrix.row.label.no.suggestion": funcs.scmsg('confusion.matrix.row.label.no.suggestion', 'SmartTicket'),
      "confusion.matrix.row.label.precision": funcs.scmsg('confusion.matrix.row.label.precision', 'SmartTicket'),
      "confusion.matrix.row.label.recall": funcs.scmsg('confusion.matrix.row.label.recall', 'SmartTicket')
      
      
    }
    // TODO: L10N message
    return template({
      title : funcs.scmsg('confusion.matrix.title', 'SmartTicket'),
      message : message,
      categories : vm,
      localmsg: localmsg
    });
  };
  
  function aggregateTestResults(categorizer, round) {
    var matrix = new SCFile('SmartTicketTestResults', SCFILE_READONLY);
    var id = categorizer.id;
    var sql = 
      'select category.id, predicted.1.id, count(*) ' +
      'from SmartTicketTestResults ' + 
      'where round.id = ' + round + ' and categorizer.id= ' + id + ' ' +
      'group by category.id, predicted.1.id';

    logger.debug('aggregate Smart Ticket prediction result via SQL: ' + sql);
    var rc = matrix.doSelect(sql), results = [];
    while(rc === RC_SUCCESS) {
      results.push({
        category: matrix[0] || '',
        predicted: matrix[1] || '',
        value: matrix[2]
      });
      rc = matrix.getNext();
    }
    
    
    var collection = categorizer.getTrainedCategory();
    var totalNum = 0;
    collection.each(function(category) {
       totalNum ++;
    });
    return {'results':results, 'trainedCategoryNum': totalNum};
  }

  function getCategoryCaptionsMapping(categorizer, options) {
    // TODO: select all categories ? 
    // since the confusion matrix aggregate scope can expand in the future
    var collection = categorizer.getTrainedCategory(),
        mapping = {};

    collection.each(function(category) {
      var id = category.getId();
      mapping[id] = category.getName();
    });
    return mapping;
  }

  return {
    create : function (categorizer, fRound, options) {
      var captions = getCategoryCaptionsMapping(categorizer, options);
      var meta = { captions : captions, round : fRound.id };
      var data = aggregateTestResults(categorizer, fRound.id);

      var matrix = new ConfusionMatrix(data, meta);
      // memoize result to make it more efficient
      matrix.calculatePrecision = _.memoize(matrix.calculatePrecision);
      matrix.calculateRecall = _.memoize(matrix.calculateRecall);
      matrix.calculateF1Score = _.memoize(matrix.calculateF1Score);
      matrix.categoryCount = _.memoize(matrix.categoryCount);
      matrix.predictionCount = _.memoize(matrix.predictionCount);

      return matrix;
    }
  };
}());


function require() {
  return IDOLSmartTicketCategorizerTestConfusionMatrix;
}