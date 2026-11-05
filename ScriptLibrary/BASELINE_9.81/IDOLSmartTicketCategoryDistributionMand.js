var _ = lib.Underscore.require();
var JSON = lib.JSON.json();
var IDOLCommon = lib.IDOLCommon.require();
var logger = getLog('IDOLSmartTicketCategoryDistributionMand');

var IDOLSmartTicketCategoryDistributionMand = (function() {
  function getDistinctCategoryList( categorizer ){
    var filename = categorizer.getFilename();
    var categoryFields = categorizer.getCategoryFields();
    var query = categorizer.getRestrictionQuery();
    var mquery = categorizer.getMandantQuery();
	    
    var sql = '';
        sql += ' select ';
	    sql += ' distinct ' +  categoryFields.join(',');
	    sql += ' from ' + filename;
	    sql += ' where (' + query + ')';
	
	logger.info('calculating category distribution via SQL: ' + sql);
	logger.info('restriction query is: ' + query);    
	logger.info('mandant query is: ' + mquery);
	    	    
	var target = new SCFile(filename, SCFILE_READONLY);
	var rc = target.doSelect(sql), results = [];
	    
	while (rc === RC_SUCCESS) {
	  var summary = toSummary(target, categoryFields);
	  var amount = getCountByCategoryField(filename, categoryFields, summary, mquery, query);
	  if(amount != 0){
	     summary.amount = amount;
	     results.push(summary);
	  }
	  rc = target.getNext();
	};
	    
	var ret = _.chain(results).sortBy(function(result){ return -result.amount; }).value();
    var acc = 0;
    _.each(ret, function(result) {
      acc += result.amount;
      result._acc = acc;
    });

    var captions = {};
    _.each(categoryFields, function(name) {
      var caption = funcs.get_field_caption(name, filename);
      captions[name] = caption;
    });
    
    var localmsg = {"amount":funcs.scmsg("1041","idol"), "accumulation":funcs.scmsg("1042","idol")};
    
    var retObj = {
      sql: sql,
      total: acc,
      distribution: ret,
      categories: categoryFields,
      captions: captions,
      localmsg: localmsg
    };
       
    logger.info(JSON.stringify(retObj));
    return retObj;	    
  }
	
  function getCountByCategoryField(filename, categoryFieldNames, categoryFieldValues, mandantQuery, restrictionQuery){
	 var categoryQuery = toCategoryQuery(categoryFieldNames, categoryFieldValues);
     var sql = IDOLCommon.compositeCriteria([categoryQuery, mandantQuery, restrictionQuery],' and ');
	 logger.info(sql);
	 var datatable = new SCRecordList(filename, sql);
	 var trainingTotalCount = datatable.getCount();
	 return trainingTotalCount;
  }
	
  function toCategoryQuery(categoryFieldNames, categoryFieldValues){
	 var result = [];
	 _.each(categoryFieldNames, function(categoryFieldName, i) {
	   var value = categoryFieldValues[categoryFieldName];
	   if(value){
	      var tempStr = categoryFieldName + '=' +'"'+ value +'"'
	   }else{
	      var tempStr = 'null('+categoryFieldName+')'
	   }  
	   result.push(tempStr);
	 });
	   
	 resultstr = IDOLCommon.compositeCriteria(result,' and ');   
	 return resultstr;
  }
	
  function toSummary(rs, names) {
	var result = {};
	_.each(names, function(name, i) {
	   var value = rs[i];
	   result[name] = value;
	});
	result.amount = 0;
	return result;
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
    analyze : getDistinctCategoryList,
    toHTML : toHTML
  }
}());

function require() {
  return IDOLSmartTicketCategoryDistributionMand;
}
