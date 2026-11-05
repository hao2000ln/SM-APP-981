var _ = lib.Underscore.require(),
  XQuery = lib.XQuery.require(),
  IDOLConfigure = lib.IDOLConfigure.require(),
  IDOLRequest = lib.IDOLRequest.require(),
  IDOLCommon = lib.IDOLCommon.require(),
  IDOLQueryBuilder = lib.IDOLQueryBuilder.require(),
  DisplayNameHelper = lib.DisplayName,
  KMIDOLLanguageMap = lib.KMIDOLLanguageMap.require(),
  _sf = system.functions;

var logger = getLog('IDOLProblemHunter');

var IDOLProblemHunter = (function () {

  function topicmap(keyword, record, range, customQuery, handler, hintMinScore, language) {
    var filename = funcs.filename(record),
      conf = IDOLConfigure.getTopicmapConfig(filename),
      endpoint = IDOLConfigure.getHTAServerEndPoint();

    var sqls = [ customQuery ];

    if (vars['$hta.analytics.action']!=null && vars['$hta.analytics.action']!="") {
      var aryCandActions = conf.candidatesAction;
      var aryCandQuerys = conf.candidatesQuery;

      var lng = aryCandActions.length();
      for (var i=0;i<lng;i++) {
        if (aryCandActions[i]!=null && vars['$hta.analytics.action']==aryCandActions[i])
        {
          var q = aryCandQuerys[i] || "true";
          if ( q.indexOf("jscall") >= 0 )
          {
            vars['$hta.action.facet'] = "getSearchCriteria";
            var extendActionRet = _sf.parse_evaluate(q, 2);
            if ( extendActionRet && typeof extendActionRet === 'string' )
              q = extendActionRet;
          }
          sqls.push( " ( " + q + " ) " );
        }
      }
    }

    var sql = _.chain(sqls)
      // ignore empty query or "true" search
      .filter(function(sql) { return sql && sql !== true && sql !== 'true'; })
      // no need to add parenthesis if there is only one sql condition
      .map(function(sql, list) { return list.length > 1 ? '(' + sql + ')' : sql; })
      .value()
      .join(' and ');
   
    var criteria = IDOLQueryBuilder.buildCriteria(keyword, record, range, sql, handler);
    //print("queri:"+lib.smis_CommonLib.toJSON(criteria));
    var stopwords = "";
    var fs = new SCFile("idolStopPhrase");
    var rc_fs = fs.doSelect("true");
    if( rc_fs == RC_SUCCESS && fs.StopPhrases != null)
    {
       stopwords = fs.StopPhrases.toArray().join(";");
    }
    var idollanguage = "";
   if(language!=null && language!=""){
      idollanguage = KMIDOLLanguageMap[language];
    }
   if(conf.async)
   {
     //logger.info("launch the backend schedule to do htalda right now");
     return findHtaLdaResult(criteria,stopwords,conf.maxresults, 0, endpoint,conf.printFields,conf.titleField, idollanguage);
   }
   else
   {
     var settings = {
      action : 'query',
      Print : "Fields",
      PrintFields:conf.printFields,
      ldaTitleFields:conf.titleField,
      totalResults:true,
      //QuerySummaryPlus:true,
      QuerySummaryLength:vars["$idol.hta.topic.number"],
      Topicthreshold:vars["$idol.hta.topic.threshold"],
      //QuerySummaryPhraseLength:6,
      //QuerySummaryTerms:50,
      //QuerySummaryLength
      isRunLda:true,
      LdaStopWords: stopwords,
      outputencoding : 'utf8',
      //QuerySummary : true,
      detectlanguagetype : true,
      anylanguage : true,
      //casesensitive : true,
	  //QuerySummaryAdvanced : true,
	 // QuerySummaryIDs : true,
      //summary : conf.summary,
      maxresults : conf.maxresults,
      minscore : conf.minscore,
      characters : conf.maxchars
     };
     if(language!=null && language!=""){
      settings.anylanguage = false;
      settings.languagetype = idollanguage;
    }
    
     if ( hintMinScore >= 0 )
     {
      settings.minscore = hintMinScore;
     }
     var params = _.extend(criteria, settings);
     var json = IDOLRequest.doIDOLJsonPost(endpoint, params);
     json = lib.smis_CommonLib.fromJSON(json.json);
     
     json["topic"]= keyword;
     if(json["subtopics"] == null || json["subtopics"].length == 0 )
     {
       var message = funcs.scmsg('610', 'idol' );
       json =  {"recommends":[message],"subtopics":[{
			"topic": message,
			"subtopics": [],
			"docs": [],
			"id": 1
		}],"summaries":{},"docs":[],"id":0,"topic":keyword};
		vars["$hta.lda.add.stopwords"] = false;
     }
     else
     {
       json = lib.IDOL_Help.handleOther(json);
       vars["$hta.lda.add.stopwords"] = true;
     }
     //logger.info(lib.smis_CommonLib.toJSON(json.subtopics));
     return json;
    }
  }
  
  function sameContent(str, obj)
  {
    if((str == null || str == "") && (obj == null || obj.toString()==""))
    {
      return true;
    }
    else if( str != null && obj != null && str == obj.toString())
    {
      return true;
    }
    return false;
    
  }
  function findHtaLdaResult(criteria, stopwords, maxresults, minscore,  endpoint, printFields,titleField,idollanguage)
  {
    var f = new SCFile("htalda");
    var query = lib.smis_CommonLib.toJSON(criteria);
    var dt = new Date();
    var tpthrshold = vars["$idol.hta.topic.threshold"];
    var tpnumber = vars["$idol.hta.topic.number"];
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    var yesterday = dt.getTime() + dt.getTimezoneOffset()*60*1000;
    var dDate = new XMLDate(new Date(yesterday));
	dDate = dDate.getSCDateTimeString();
	var condition = 'topicthreshold='+tpthrshold+' and topicnumber='+tpnumber+' and titlefield ="'+titleField+'" and printfields="'+printFields+'" and text="'+criteria["text"]+'" and database="'+criteria["databasematch"]+'" and maxresults='+maxresults+' and minscore='+minscore + " and gentime>='"+dDate+"'";
	//logger.info("query condition is:"+condition);
    var rc = f.doSelect(condition);
    var bfind = false;
    while (rc == RC_SUCCESS)
    {
      
      if(sameContent(query, f.query) && sameContent(stopwords,f.stopwords))
      {
        bfind = true;
        //logger.info("find the cached lda result"+f.result);
        break;
      }
      else
      {
         //logger.info("query or stopwords is not sampe");
         //logger.info("query is:"+query);
         //logger.info("equal is:"+query== f.query.toString());
         //logger.info("stopword is:"+stopwords+"f.stopword is:"+f.stopwords+" type:"+ typeof f.stopwords);
         //logger.info("stopwords equl:"+f.stopwords.toString() == stopwords);
      }
      rc =f.getNext();
    }
    if(bfind)
    {

      var topic=lib.smis_CommonLib.fromJSON(f.result.toString());
      if(topic["htaldaid"])
      {
        vars["$hta.lda.add.stopwords"] = false;
      }
      else
      {
        //topic = lib.IDOL_Help.handleOther(topic);
        vars["$hta.lda.add.stopwords"] = true;
      }
      return topic;
    }
    else
    {
      //clear the cache right now,
      f.doPurge("finish=true and gentime<'"+dDate+"'");
      var message = funcs.scmsg('609', 'idol' );
      var no_topic = {"recommends":[message],"subtopics":[{
			"topic": message,
			"subtopics": [],
			"docs": [],
			"id": 1
		}],"summaries":{},"docs":[],"id":0,"topic":criteria["text"]};

      var callRtn = new SCDatum;
	  var nextNumber = new SCDatum;
	  system.functions.rtecall("getnumber", callRtn, nextNumber, "htalda");
	  f.id = system.functions.val(nextNumber, 1);
	  f.maxresults=maxresults;
	  f.minscore=minscore;
	  f.gentime=new Date();
	  f.lastmodify= new Date();
	  f.stopwords= stopwords;
	  f.query= query;
	  f.text=criteria["text"];
	  f.finish = false;
	  f.lastmodify = f.gentime;
	  f.database=criteria["databasematch"];
	  no_topic["htaldaid"]=f.id;
	  f.result=lib.smis_CommonLib.toJSON(no_topic);
	  f.sessionid= system.functions.sysinfo_get("ClientSID");
	  f.printfields=printFields;
	  f.titlefield = titleField;
	  f.topicthreshold = tpthrshold;
	  f.topicnumber = tpnumber;
	  f.doInsert();
	 
	  //no insert schedule to make it
	  var myquery = lib.Base64Encoder.encode(query);
	  var parameters = [{value: endpoint, type: "String"},{value: myquery, type: "String"},  {value: stopwords, type: "String"}, 
	  {value: maxresults, type: "Number"}, {value: minscore, type: "Number"}, {value: f.id, type: "Number"},{value: printFields, type: "String"},{value: titleField, type: "String"}, {value: tpthrshold, type: "Number"}, {value: tpnumber, type: "Number"},{value: idollanguage, type: "String"}];
	  var taskId = lib.IDOL_SMIS.addHtaTask("htalda", f.id, 'htalda', parameters);
	  if (taskId) system.functions.msg(system.functions.scmsg('612','idol'), 1);
      vars["$hta.lda.add.stopwords"] = false;
	  return no_topic;
    }
    
  }
  function validateAdvancedSearch(doc) {
    var hits = XQuery.queryText('responsedata/autn:numhits', doc);
    if (!!hits && hits !== '0') {
      var qs = XQuery.queryOne('responsedata/autn:qs', doc);
      if (!qs) {
        // scmsg: IDOL response document format error, need enable "%S" option
        throw new Error(funcs.scmsg(1002, 'idol', ['QuerySummaryAdvanced']));
      }
      var elem = XQuery.queryOne('autn:element', qs);
      if (!elem.getAttributeValue('ids')) {
        throw new Error(funcs.scmsg(1002, 'idol', ['QuerySummaryIDs']));
      }
    }
  }
  /*
   <autn:qs>
   <autn:element pdocs="498" poccs="1734" cluster="-1" docs="498">Apollo</autn:element>
   <autn:element pdocs="53"  poccs="75"   cluster="0"  docs="115">Apollo program</autn:element>
   <autn:element pdocs="47"  poccs="99"   cluster="0"  docs="55">lunar module</autn:element>
   <autn:element pdocs="47"  poccs="60"   cluster="1"  docs="55">Greek mythology/autn:element>
   <autn:element pdocs="36"  poccs="60"   cluster="0"  docs="38">Space Shuttle</autn:element>
   <autn:element pdocs="29"  poccs="43"   cluster="0"  docs="50">lunar orbit</autn:element>
   <autn:element pdocs="19"  poccs="31"   cluster="1"  docs="77">Mount Olympus</autn:element>
   <autn:element pdocs="25"  poccs="31"   cluster="0"  docs="82">Apollo spacecraft</autn:element>
   <autn:element pdocs="20"  poccs="24"   cluster="2"  docs="33">Apollo Theater/autn:element>
   <autn:element pdocs="20"  poccs="23"   cluster="0"  docs="20">Neil Armstrong/autn:element>
   ...
   </autn:qs>

   Each autn:element tag contains information on the specified element. The entries are:

   pdocs
   The number of documents of the results set in which this element appears as a phrase.

   poccs
   The total number of occurrences of this element in the results set.

   docs
   The number of documents of the results set in which all terms of this element appear.

   cluster
   The cluster into which the phrase has been grouped. This value allows you to cluster
   the elements according to their occurrence.
   In the previous example:
   * cluster 0 corresponds to the Apollo space flights.
   * cluster 1 is the Greek God Apollo.
   * cluster 2 is the Apollo Theater.
   Unless the result set is unusually broad, there are rarely more than three strong clusters.
   When using the clusters for cluster analysis, you should ignore elements with negative
   cluster numbers (because they are too common, too rare, or too indiscriminate).

   ids
   An additional attribute, which is returned if you have set QuerySummaryIDs to
   true in your configuration. It contains a comma-separated list of the document
   IDs of the results set in which this element occurs as a phrase.
   */
  function Builder(doc, filename) {
    var conf = IDOLConfigure.getTopicmapConfig(filename);

    function makeRecommends() {
      var qs = XQuery.queryText('responsedata/autn:querysummary', doc);
      return _.chain(qs.split(',')).map(_.trim).compact().value();
    }

    function getDisplayNameMapping(contents) {
      var refTable = DisplayNameHelper.getRefTable(conf.groupby, filename);

      if (refTable) {
        var types = _.chain(contents).pluck('type').uniq().value();
        var values = new SCDatum();
        values.setType(8); // SCArray;
        _.each(types, function(type) { values.push(type); });
        var names = [], displays = [];
        DisplayNameHelper.getDisplayNamesByIds(refTable, values, names, displays);
        return _.object(names, displays);
      }
      return {};
    }

    function buildDocumentCollection() {
      var hits = XQuery.query('responsedata/autn:hit', doc), groupByFieldName;

      if (conf.groupby) {
        groupByFieldName = IDOLCommon.toIDOLFieldName(conf.groupby);
      }

      return _.reduce(hits, function(memo, node) {
        var docid = XQuery.queryText('autn:id', node);
        weight = parseFloat(XQuery.queryText('autn:weight', node));

        var record = {
          reference : XQuery.queryText('autn:reference', node),
          title: XQuery.queryText('autn:title', node),
          summary: XQuery.queryText('autn:summary', node),
          weight: isNaN(weight) ? 0 : weight
        };

        if (groupByFieldName) {
          record.type = XQuery.queryText('autn:content/DOCUMENT/' + groupByFieldName, node);
        }
        memo[docid] = record;
        return memo;
      }, {});
    }

    function makeSummaries(contents) {
      return _.chain(contents).values().indexBy('reference').value();
    }

    function makeTopics(contents) {
      var elems = XQuery.query('responsedata/autn:qs/autn:element', doc);

      return _.chain(elems).map(function(elem) {
        var related = elem.getAttributeValue('ids') || '',
          ids = _.compact(related.split(','));
        return {
          topic : elem.getText(),
          cluster : parseInt(elem.getAttributeValue('cluster'), 10),
          ids: ids
        };
      }).filter(function(elem) {
        // as idol document mentioned, ignore elements with negative cluster numbers 
        // because they are too common, too rare, or too indiscriminate.
        return conf.showall ? true : elem.cluster >= 0;
      }).value();
    }

    function buildTopicHierachy(topics) {
      return _.chain(topics)
        .groupBy(function(d) { return String(d.cluster); })
        .map(function(v) {
          var node = _.first(v), children = _.rest(v);
          node.subtopics = children;
          return node;
        })
        .value();
    }

    var needGroup = conf.groupby, index = 0;

    function groupTopics(topic, contents, displayNameMapping) {
      var docs = _.map(topic.ids, function(id) { return contents[id]; });
      topic.docs = _.pluck(docs, 'reference');
      // these fields are not used by client side
      delete topic.ids;
      delete topic.cluster;
      topic.id = index++;

      if (!_.isEmpty(topic.subtopics)) {
        topic.subtopics = _.map(topic.subtopics, function(topic) {
          return groupTopics(topic, contents, displayNameMapping);
        });
      } else if (needGroup) {
        var empty = funcs.scmsg('empty.group', 'idol');
        var subtopics = _.chain(docs).groupBy('type')
          .map(function(v, k) {
            return {
              id: index++,
              topic: displayNameMapping[k] || k || empty,
              raw: k || '',
              trivial: true,
              docs: _.pluck(v, 'reference')
            };
          }).value();

        if (subtopics.length > 1) {
          // No need to split topic if there is only one "Affected Service"
          topic.subtopics = subtopics;
        }
      } else {
        topic.subtopics = [];
      }
      return topic;
    }

    function refineHierachy(topic, contents) {
      var mappings = needGroup ? getDisplayNameMapping(contents) : {};
      return groupTopics(topic, contents, mappings);
    }

    function collectReferences(topic) {
      return _.chain(topic.subtopics).map(function(topic) {
        var references = _.clone(topic.docs) || [];
        if (!_.isEmpty(topic.subtopics)) {
          references = references.concat(collectReferences(topic));
        }
        return references;
      }).flatten().compact().sort().uniq().value();
    }

    function cleanup(topic) {
      var references = collectReferences(topic),
        summaries = topic.summaries;

      topic.summaries = _.reduce(references, function(memo, reference) {
        memo[reference] = summaries[reference];
        return memo;
      }, {});

      return topic;
    }

    function getValidTicketIDs(ids) {
      var keys = IDOLCommon.getReferenceFields(filename);
      if (keys.length > 1) {
        throw new Error("cannot handle composite unique key. (" + filename + ")");
      }
      if (keys.length === 0) {
        throw new Error("unique key not found. (" + filename + ")");
      }

      var unique = keys[0],
        query = unique + ' isin {' + _.map(ids, function(id) { return '"' + id + '"'; }).join(',') + '}',
        table = new SCFile(filename, SCFILE_READONLY),
        validTicketIDs = [],
        rc;

      table.setFields(keys);
      rc = table.doSelect(query);
      while (rc === RC_SUCCESS) {
        validTicketIDs.push(table[unique]);
        rc = table.getNext();
      }
      return validTicketIDs;
    }

    function stripTopicDocs(topics, ids) {
      return _.chain(topics)
        .map(function(topic) {
          topic.docs = _.intersection(topic.docs, ids);
          return topic;
        })
        .filter(function(topic) { return topic.docs.length > 0; })
        .value();
    }

    function stripSummaries(summaries, ids) {
      return _.pick(summaries, ids);
    }

    this.build = function(validate) {
      //validateAdvancedSearch(doc);

      var contents = buildDocumentCollection();

      var recommends = makeRecommends(),
        topics = makeTopics(contents),
        summaries = makeSummaries(contents);

      if (validate) {
        var ids = getValidTicketIDs(_.keys(summaries));
        summaries = stripSummaries(summaries, ids);
        topics = stripTopicDocs(topics, ids);
      }

      var subtopics = buildTopicHierachy(topics, contents);

      var hierachy = {
        recommends : recommends,
        subtopics : subtopics,
        summaries : summaries
      };

      hierachy = refineHierachy(hierachy, contents);
      return cleanup(hierachy);
    };
  }

  return {
    query : topicmap,
    buildResult : function(doc, filename, validate) {
      var builder = new Builder(doc, filename);
      return builder.build(validate);
    }
  };
}());

function require() {
  return IDOLProblemHunter;
}