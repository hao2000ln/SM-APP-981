var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLMandant = lib.IDOLMandant.require(),
    IDOLIndexer = lib.IDOLIndexer.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLIDXDocument = lib.IDOLIDXDocument.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();

var logger = getLog('IDOLIndexExecutor');

var IDOLIndexExecutor = (function() {
  // when indexing data, pack every 2000 document into one idol post request
  var PACK_SIZE = 2000;
  var WAITING_INTERVAL = 10;
  var STATUS = IDOLIndexer.STATUS;

  function getIndexStatusMessage(idolindex) {
    var status = idolindex.status || STATUS.READY;
    var message;
    switch(status) {
      case STATUS.READY:      message = funcs.scmsg(1004, 'idol'); break;
      case STATUS.FINISHED:   message = funcs.scmsg(1005, 'idol'); break;
      case STATUS.PROCESSING: message = funcs.scmsg(1006, 'idol', [idolindex.indexcount, idolindex.sourcecount]); break;
      // for useability reason, 'READY/CANCEL' should work same.
      // case STATUS.CANCEL:     message = funcs.scmsg(1007, 'idol'); break;
      case STATUS.CANCEL:     message = funcs.scmsg(1004, 'idol'); break;
      case STATUS.ERROR:      message = funcs.scmsg(1008, 'idol'); break;
      default:                message = funcs.scmsg(1009, 'idol', [status]);
    }
    return [status, message];
  }

  // only for full re-index
  function resetIndexStatus(client, idolindex) {
    var filename = idolindex['table.name'];

    if (IDOLConfigure.isMultiCompany(filename)) {
      var companies = IDOLMandant.detectMandantValues(filename, 'true');
      _.each(companies, function(company) {
        var database = IDOLMandant.buildDatabaseName(filename, company);
        logger.info('removing documents in IDOL database : ' + database);
        client.executeIndexAction('DREDELDBASE', { 'DREDbName': database});
      });
    } else {
      logger.info('removing documents in IDOL database : ' + filename);
      client.executeIndexAction('DREDELDBASE', { 'DREDbName': filename});
    }

    idolindex["last.index.time"] = null;
    idolindex.doSave();
  }


  // send generated idx document to IDOL server
  // send documents in batch mode
  function createTransfer(client, idolindex) {
    var batch = [], counter = 0, send = function(database) {
      if (!this.alive()) {
        throw "cancel";
      }

      var count = batch.length;
      batch.push("#DREENDDATAREFERENCE\n\n");

      var idxdocs = batch.join('\n\n');
      logger.info('sent ' + count + ' documents into database "' + database + '"');
      logger.trace(idxdocs);

      var response = client.executeIndexAction('DREADDDATA', {
        'DREDbName': database, 
        'CreateDatabase': 'TRUE'
      }, idxdocs);

      logger.info('response: ' + response);
      
      this.reportProgress(counter);

      batch = [];
      counter = 0;
      return _.trim(response.split('=')[1]);
    };

    function busywait(retries, name, task) {
      var finished = false;
      while(retries-- && !finished && this.alive()) {
        var status = task.call(this);
        finished = (status === '-1'); // Finished
        if (!finished) {
          logger.info(name + ' is not finished, wait ' + WAITING_INTERVAL + ' seconds to retry (' + retries + ' times left)');
          funcs.sleep(WAITING_INTERVAL);
        }
      }
      if (!finished && this.alive()) {
        logger.warn(name + ' exceed max waiting time, stop waiting ...');
      }
    }

    function waitIndexTask(indexer, id) {
      client.executeIndexAction('DRESYNC');

      busywait.call(indexer, 10, 'index task', function() {
        var doc = client.executeAction({ action : 'indexergetstatus', index : id });

        var status = XQuery.queryText('responsedata/item/status', doc),
            message = XQuery.queryText('responsedata/item/description', doc);

        logger.info('The status of index task ' + id + ' is ' + status + ' (' + message + ')');
        return status;
      });
    }

    // XXX: for multiple company, the database name is sm tablename plus company name
    return function(query, processor, database) {
      processor.iterateWithQuery(query, function(model) {
        var idx = IDOLIDXDocument.convert(model);
        batch.push(idx);
        counter++;
        if (counter % PACK_SIZE === 0) {
          send.call(this, database);
        }
      }, this);

      if (batch.length > 0) {
        var id = send.call(this, database);
        waitIndexTask(this, id);
      }
    };
  }


  function runIndex(client, idolindex, onsuccess) {
    var indexer = IDOLIndexer.create(client, idolindex),
        transfer = createTransfer(client, idolindex);
    indexer.run(transfer, onsuccess);
  }

  function incrementalIndex(idolindex, onsuccess) {
    var filename = idolindex['table.name'], 
        client = IDOLClientFactory.create('HotTopic');
    logger.info('start incremental indexing "' + filename + '" into IDOL');
    runIndex(client, idolindex, onsuccess);
  }

  function fullReindex(idolindex, onsuccess) {
    var filename = idolindex['table.name'], 
        client = IDOLClientFactory.create('HotTopic');
    logger.info('start full reindexing "' + filename + '" into IDOL');
    resetIndexStatus(client, idolindex);
    runIndex(client, idolindex, onsuccess);
  }

  function cancelIndex(idolindex) {
    var client = IDOLClientFactory.create('HotTopic');
    var indexer = IDOLIndexer.create(client, idolindex);
    indexer.cancel();
  }

  return {
    getIndexStatusMessage : getIndexStatusMessage,
    incrementalIndex : incrementalIndex,
    fullReindex : fullReindex,
    cancelIndex : cancelIndex
  };
}());

function require() {
  return IDOLIndexExecutor;
}