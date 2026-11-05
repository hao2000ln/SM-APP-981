var _ = lib.Underscore.require(),
  JSON = lib.JSON.json(),
  IDOLMandant = lib.IDOLMandant.require(),
  IDOLConfig = lib.IDOLConfigure.require(),
  IDOLFieldProcessor = lib.IDOLFieldProcessor.require();

var logger = getLog('IDOLIndexer');

var IDOLIndexer = (function() {
  var STATUS = { READY : 0, FINISHED : 1, PROCESSING : 2, CANCEL : 3, ERROR : 4 };

  function extractTag(scfile) {
    var dTag = new SCDatum();
    funcs.tag(dTag, scfile);
    return funcs.str(dTag);
  }

  function Indexer(client, record) {
    var indexDef = new SCFile();
    funcs.fduplicate(indexDef, record);
    this.indexDef = indexDef;

    this._acc = 0;
    this.tag = extractTag(indexDef);
    this.client = client;
  }

  Indexer.prototype.getFileName = function() {
    return funcs.filename(this.indexDef);
  };

  Indexer.prototype.reload = function() {
    var filename = this.getFileName();
    var scfile = new SCFile(filename);
    var dSql = new SCDatum();
    funcs.tagquery(scfile, dSql, this.tag);
    return scfile;
  };

  Indexer.prototype.update = function(name, value) {
    // since "indexDef" may changed by user manually, so reload record to get the latest version
    var scfile = this.reload();
    if (arguments.length < 2) {
      var obj = name;
      _.each(obj, function(value, name) {
        scfile[name] = value;
      });
    } else {
      scfile[name] = value;
    }
    scfile.doSave();
  };

  Indexer.prototype.alive = function() {
    var scfile = this.reload();
    return scfile.status !== STATUS.CANCEL;
  };

  Indexer.prototype.reportProgress = function(acc) {
    this._acc += acc;
    this.update({ "status": STATUS.PROCESSING, "indexcount": this._acc });
  };

  Indexer.prototype.cancel = function() {
    this.update("status", STATUS.CANCEL);
    logger.info('stop index task for "' + this.indexDef["table.name"] + '"');
  };

  Indexer.prototype.getRecentScrelationIDs = function() {
    var indexDef = this.indexDef;
    var lastIndexTime = indexDef["last.index.time"];
    var filename = this.indexDef["table.name"];
    var wantedFile = 'probsummary';
    if ( filename !== wantedFile )
      return "";

    if (lastIndexTime)
    {
      var f = new SCFile('screlation', SCFILE_READONLY);
      f.setFields(['source']);
/*
      var q = new QueryCond('sysmodtime', GT, lastIndexTime)
        .and( new QueryCond('source.filename', EQ, 'problem') );

*/
      var q = new QueryCond('sysmodtime', GE, lastIndexTime)
        .and( new QueryCond('source.filename', EQ, 'problem') );

      q = q.asRAD();

      var rc = f.doSelect(q);
      var ids = [];
      var nMaxIDCount = 500;
      var i = 0;
      while ( rc == RC_SUCCESS )
      {
        ids.push( '"' + f.source + '"' );
        rc = f.getNext();

        if ( i++ >= nMaxIDCount )
          break;
      }

      var query = "";
      if ( ids.length > 0 )
      {
        ids = ids.join(',')
        query = ' or ( number isin {' + ids + '} ) ';
      }
    }

    return query;
  };

  Indexer.prototype.buildIndexQuery = function() {
    var indexDef = this.indexDef;
    var lastIndexTime = indexDef["last.index.time"],
      filterQuery = indexDef["filter.query"] || 'true';

    var query = filterQuery;
    if (lastIndexTime) {
      // incremental query condition
      //var incQC = new QueryCond('sysmodtime', GT, lastIndexTime);
      var incQC = new QueryCond('sysmodtime', GE, lastIndexTime);
      var addition = incQC.toString().replace(/\[[^\]]+\] -(.*)/, "$1");
      query = [query, addition].join(" and ");
      query += this.getRecentScrelationIDs();
    }
    return query;
  };

  /**
   * @filename: String, the target which 'query' parameter applied to
   * @query: String, query to determine which record should be indexed into IDOL
   * @database: String, IDOL database name. For MSP, one sm table will be mapped into
   *            serveral IDOL database with different database name
   * @callback: Function, function to process data from sm table
   */
  Indexer.prototype.runIndex = function(filename, query, database, callback) {
    var client = this.client;
    var isDistributive = client.isDistributeMode();

    var isMultiCompany = IDOLConfig.isMultiCompany(filename),
      indexDef = this.indexDef,
      executor = function(query, database) {
        // IDOL database has its own 'tag' for MSP
        var processor = IDOLFieldProcessor.create(indexDef);
        if (isDistributive) {
          var pair = client.getDistributeNameAndValue(database);
          var tags = processor.tagfields || {};
          tags = _.extend(tags, pair);
          processor.tagfields = tags;
        }
        if (logger.isTraceEnabled()) {
          logger.trace('the index processor is: ' + JSON.stringify(processor, null, ' '));
        }
        callback.call(this, query, processor, database);
      };

    logger.debug('distribute mode is: ' + isDistributive);

    if (isMultiCompany) {
      var operator = vars['$lo.operator'],
        scgroups = operator ? operator['security.group'].toArray() : [];

      if (scgroups.length > 0) {
        // when current operator has scsecuritygroup defined, it can only see the security groups allowed
        // but for multiple company mode, we need to index ALL record into IDOL
        // by default, when task is running in SMIS schedule, it run as a super user without security group.
        logger.warn('The operator for IDOL index "' + operator.name + '" has security group defined, some data may not be able to index ...');
      }

      var companies = IDOLMandant.detectMandantValues(filename, query), // This may take a long time
        mandant = IDOLMandant.getMandantField(filename);

      _.each(companies, function(company) {
        var mandantDatabase =  IDOLMandant.buildDatabaseName(database, company),
        // TODO: plain text sql concat is not safe, may use QueryCond to replace it
          mandantQuery = [query, mandant + '="' + company + '"'].join(' and ');

        if (this.alive()) {
          executor.call(this, mandantQuery, mandantDatabase);
        } else {
          logger.info('The index task has been canceled. (' +
          'file: '     + filename + ', ' +
          'query: '    + mandantQuery + ', '+
          'database: ' + mandantDatabase + ')');
          // make sure it doesn't write "finished" status, or create next SMIS schedule
          throw "cancel";
        }
      }, this);
    } else {
      executor.call(this, query, database);
    }
  };

  Indexer.prototype.run = function(callback, onsuccess) {
    if (!_.isFunction(callback)) {
      throw new Error('should pass in a function to handle index data');
    }

    var indexDef = this.indexDef,
      filename = indexDef["table.name"],
      database = indexDef["db.name"] || indexDef["table.name"],
      query = this.buildIndexQuery();

    try {
      var total = new SCFile(filename, SCFILE_READONLY).doCount(query),
        now = new Date();
      this.update({ "status" : STATUS.READY, "sourcecount" : total, "indexcount" : 0 });

      if (total > 0) {
        this.runIndex(filename, query, database, callback);
      }

      this.update({"status": STATUS.FINISHED, "last.index.time": now});

      // Index finished, but need restart automatically via SMIS task
      if (_.isFunction(onsuccess) && this.alive()) {
        onsuccess.apply(this);
      }
    } catch (e) {
      if (e === "cancel") {
        // should not throw exception when task was canceled, otherwise SMIS may trigger a retry ...
        this.update("status", STATUS.CANCEL);
      } else {
        this.update("status", STATUS.ERROR);
        throw e;
      }
    }
  };


  return {
    STATUS : STATUS,
    /**
     * @param idolindex: SCFile(idolindex)
     * @param client: IDOLClient object created by IDOLClientFactory
     */
    create : function(idolindex, client) {
      return new Indexer(idolindex, client);
    }
  };
}());

function require() {
  return IDOLIndexer;
}