var _ = lib.Underscore.require(),
    IDOLSmartTicketCategory = lib.IDOLSmartTicketCategory.require();

var logger = getLog('IDOLSmartTicketTestResultsHelper');

function loadTermUsage(fCategory, term, weight) {
  logger.debug('view term: ' + term + ', weight: ' + weight);

  var category = IDOLSmartTicketCategory.wrap(fCategory);
  var client = category.createClient();

  try {
    var matches = category.termInDocuments(client, term);
    var filename = category.getFilename(),
        fieldname = category._categorizer.getRecordIdName();

    // TODO: handle XSS
    var htmls = _.map(matches, function(m) {
      var query = fieldname + '="' + m.reference + '"';
      var activelink = 'scactivelink://' + filename + ':' + _.escape(query);
      var link = '<a href="' + activelink + '">' + m.reference + '</a>';
      var html = '';
      html += '<h4>' + link + '&nbsp;' + m.title + '</h4>';
      html += '<p>' + m.summary + '</p>';
      return html;
    });

    vars['$idol.term.text'] = term;
    vars['$idol.term.weight'] = weight;
    vars['$idol.term.documents'] = htmls.join('\n');
  } catch(e) {
    logger.error(e);

    vars['$idol.term.text'] = term;
    vars['$idol.term.weight'] = '';
    vars['$idol.term.documents'] = [
      '<h1 style="color:red">' + e.message + '</h1>',
      '<pre><code>' + e.stack + '</code></pre>'
    ].join('\n');
  }
}

function isInTrainingSample(fTestResult) {
  var fCategory = new SCFile('cate2idol2', SCFILE_READONLY);
  var rc = fCategory.doSelect(new QueryCond('id', EQ, fTestResult['category.id']));
  if (rc === RC_SUCCESS) {
    return _.chain(fCategory.testdocs)
            .compact()
            .map(function(line) { return line.split(','); })
            .flatten()
            .contains(fTestResult['record.id'])
            .value();
  }
  return false;
}
