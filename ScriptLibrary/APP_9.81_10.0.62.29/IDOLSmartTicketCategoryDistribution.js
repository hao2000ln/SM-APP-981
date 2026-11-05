/**
 * Calculate category distribution for Smart Ticket
 *
 * Smart Ticket cannot handle too much categories
 * most of the time the category distribution can be very skew, admin can
 * choose most significent category which covered marjority of the tickets.
 *
 * Help to improve the prediction accuracy.
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategoryDistribution');
var IDOLCommon = lib.IDOLCommon.require();

var IDOLSmartTicketCategoryDistribution = (function() {

  function toSummary(rs, names) {
    var result = {};
    _.each(names, function(name, i) {
      var value = rs[i + 1];
      result[name] = value;
    });
    result.amount = rs[0];
    return result;
  }

  function analyzeCategoryDistribution(categorizer) {
    var JSON = lib.JSON.json();
    
    var filename = categorizer.getFilename(),
        query = categorizer.getRestrictionQuery(),
        categoryFields = categorizer.getCategoryFields(),
        mquery = categorizer.getMandantQuery();
        
    query = IDOLCommon.compositeCriteria([query, mquery],' and ');

    var sql = '';
    sql += ' select ';
    sql += ' count(*) as amount, ' + categoryFields.join(',');
    sql += ' from ' + filename;
    sql += ' where (' + query + ')';
    sql += ' group by ' + categoryFields.join(',');
    sql += ' order by amount desc';

    logger.info('calculating category distribution via SQL: ' + sql);

    var target = new SCFile(filename, SCFILE_READONLY);
    var rc = target.doSelect(sql), results = [];
    while (rc === RC_SUCCESS) {
      var summary = toSummary(target, categoryFields);
      results.push(summary);
      rc = target.getNext();
    };

    var acc = 0;
    _.each(results, function(result) {
      acc += result.amount;
      result._acc = acc;
    });

    var captions = {};
    _.each(categoryFields, function(name) {
      var caption = funcs.get_field_caption(name, filename);
      captions[name] = caption;
    });
    
    var localmsg = {"amount":funcs.scmsg("1041","idol"), "accumulation":funcs.scmsg("1042","idol")};
    
    var ret = {
      sql: sql,
      total: acc,
      distribution: results,
      categories: categoryFields,
      captions: captions,
      localmsg: localmsg
    };
    
    
    logger.info("-->" + JSON.stringify(ret));
    
    return ret;
  }

  function toHTML(data) {
    var tpl = new SCFile('idolwebresources', SCFILE_READONLY);
    var rc = tpl.doSelect('name="IDOL_SMART_TICKET_CATEGORY_DISTRIBUTION"');
    if (rc !== RC_SUCCESS) {
      throw new Error('unable to get html template');
    }
    var template = _.template(tpl.raw)
    return template(data);
  }

  return {
    analyze : analyzeCategoryDistribution,
    toHTML : toHTML
  }
}());

function require() {
  return IDOLSmartTicketCategoryDistribution;
}
