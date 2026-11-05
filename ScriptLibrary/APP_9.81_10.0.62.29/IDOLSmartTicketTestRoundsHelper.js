/**
 * Helper functions to communicate with RAD: 'smart.ticket.tuning.utils'
 * for `SmartTicketTestRounds`
 */
var _ = lib.Underscore.require(),
    IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require(),
    IDOLSmartTicketCategorizerTestReport = lib.IDOLSmartTicketCategorizerTestReport.require(),
    IDOLSmartTicketCategorizerTestConfusionMatrix = lib.IDOLSmartTicketCategorizerTestConfusionMatrix.require();

var logger = getLog('IDOLSmartTicketTestRoundsHelper');

function countCategory(fCategorizer, company) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
  var collection = categorizer.getTrainedCategory();
  return collection ? collection.getCount() : 0;
}

// After one categorization 're-trained', the full category tree can be rebuilt, 
// same category can have different `category id` between these two training.
//
// Use root category id as the identifier, once root category id is same the
// whole category tree must be the same.
//
// P.S.
// For tuning, training documents change doesn't change `category id`
function generateTuningHistorySQL(fCategorizer, company) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
  // every company has its own root category.
  var root = categorizer.getRootCategory();
  return ' select * from SmartTicketTestRounds' +
         ' where root.category.id=' + root.id + 
         ' order by test.time desc';
}

// local variable cannot pass cross RAD application, use thread variable instead
function saveVisualizationSettings() {
  var options = {
    categorizer : {
      id : vars['$L.categorizer.id'],
      company : vars['$L.company']
    },
    confusion : {
      type: vars['$L.confusion.type'], // 'bycount' or 'bypercentage'
      topN : vars['$L.category.topN'],
      low : vars['$L.confusion.low'],
      mid : vars['$L.confusion.mid']
    }
  };

  var strOptions = rteJSONStringify(options);
  // JSON object cannot be saved in a thread variable, serialize it to string
  vars['$smart.ticket.visualization.options'] = strOptions;
  return strOptions;
}

function setupConfusionMatrixChart(fRound) {
  var strOptions = vars['$smart.ticket.visualization.options'];
  logger.debug('visualization options: ' + strOptions);

  try {
    if (!strOptions) {
      vars['$smart.ticket.visualization.html'] = '<h1>No visualization settings</h1>';
      vars['$smart.ticket.test.result.summary'] = '';
    } else {
      var options = rteJSONParse(strOptions),
          args = options.categorizer || {};

      var categorizer = IDOLSmartTicketCategorizerFactory.create(args.id, args.company);
      
      var matrix = IDOLSmartTicketCategorizerTestConfusionMatrix.create(categorizer, fRound);
      var reporter = IDOLSmartTicketCategorizerTestReport.create(categorizer, fRound);

      var confusion = options.confusion || {}; // confusion matrix display settings

      // since there may exists quite large amount of category, may not possible to
      // display all of them in one page, only display selected categories
      var topN = confusion.topN || 25;

      var collection = categorizer.getTrainedCategory({
        orderBy : { sourcecount : SCFILE_DSC }
      });
      var categories = collection.map(function(category) { return category.getId(); });

      categories = _.first(categories, topN);
      confusion = _.extend({ categories : categories }, confusion);

      vars['$smart.ticket.visualization.html'] = matrix.toHTML(confusion);
      vars['$smart.ticket.test.result.summary'] = reporter.generateTextReport(options);
    }
  } catch(e) {
    logger.error(e);

    var errorHTML = '';
    errorHTML += '<h1>' + e + '</h1>';
    errorHTML += '<pre>' + e.stack + '</pre>';
    vars['$smart.ticket.visualization.html'] = errorHTML;
    vars['$smart.ticket.test.result.summary'] = '';
  }
}
