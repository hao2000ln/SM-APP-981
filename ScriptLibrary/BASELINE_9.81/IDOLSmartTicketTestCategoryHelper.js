/**
 * helper functions to display information on format 'cate2idol2.tuning'
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLSmartTicketCategory = lib.IDOLSmartTicketCategory.require();

var logger = getLog('IDOLSmartTicketTestCategoryHelper');

var IDOLSmartTicketTestCategoryHelper = (function() {

  // TODO: read from settings
  var TEST_SAMPLE_LIMIT = 200;
  var DOCUMENT_BODY_MAX_LENGTH = 500;

  function initializeTestingsView(client, category, snapshot) {
    var categorizer = category.getCategorizer();

    var refs = category.getTestDocumentRefs();
    var total = refs.length;

    refs = _.first(refs.sort(), TEST_SAMPLE_LIMIT);

    var filename = categorizer.getFilename();
    var iterator = IDOLCommon.createSCFileIDsIterator(filename, refs), tests = [];

    iterator(function(fTicket) {
      tests.push(categorizer.extractTicketModel(fTicket));
    });

    vars['$testing.ticket.id'] = _.pluck(tests, 'reference');
    vars['$testing.ticket.title'] = _.pluck(tests, 'title');
    vars['$testing.ticket.body'] = _.map(tests, function(model) {
      var contents = model.contents || [];
      var body = contents.join('\n');
      return _.truncate(body, DOCUMENT_BODY_MAX_LENGTH);
    });
    var selectedCount = Math.min(total, TEST_SAMPLE_LIMIT);
    vars['$testing.truncated.message'] = funcs.scmsg('test.sample.truncated', 'SmartTicket', [ selectedCount, total ]);
  }

  function initializeTrainingsView(client, category, snapshot) {
    // TODO: compare training docs with snapshot
    var trainings = category.getTrainings(client);
    var docs = trainings.docs || [];
    vars['$training.ticket.id'] = _.pluck(docs, 'ticket.id');
    vars['$training.ticket.title'] = _.pluck(docs, 'title');
    vars['$training.ticket.status'] = _.pluck(docs, 'status');
    vars['$training.ticket.body'] = _.map(docs, function(doc) {
      var body = doc['ticket.body'] || '';
      return _.truncate(body, DOCUMENT_BODY_MAX_LENGTH);
    });
  }

  function initializeTermsView(client, category, snapshot) {
    var terms = category.getTermWeights(client);
    vars['$training.terms'] = _.pluck(terms, 'term');
    vars['$training.terms.weight'] = _.pluck(terms, 'weight');
    vars['$training.terms.generated.weight'] = _.pluck(terms, 'generatedWeight');
    vars['$training.terms.modified.weight'] = _.pluck(terms, 'modifiedWeight');
  }

  function setupCategoryRuningTaskViewModel(client, category) {
    var smisTask = category.findSMISTask() || {};

    vars['$idol.category.smis.task.id'] = smisTask.id;
    vars['$idol.category.smis.task.enqueue.time'] = smisTask.enqueueTime;
    vars['$idol.category.smis.task.retry'] = smisTask.retry;
    vars['$idol.category.smis.task.expired'] = smisTask.expired;
    vars['$idol.category.smis.task.action'] = smisTask.action;
    vars['$idol.category.smis.task.message'] = smisTask.message;
    vars['$idol.category.smis.task.status'] = smisTask.status;

    var actions = category.findACIActions();
    var action = actions[0] || {};

    vars['$idol.category.aci.task.thread.id'] = action.id;
    vars['$idol.category.aci.task.action.id'] = action.action_id;
    vars['$idol.category.aci.task.action'] = action.action;
    vars['$idol.category.aci.task.elapsed'] = action.elapsed;
    vars['$idol.category.aci.task.status'] = action.status;
    vars['$idol.category.aci.task.canceled'] = action.canceled;

    return !_.isEmpty(smisTask);
  }

  function setupCategoryTrainingResultViewModel(client, category, fRound) {
    // TODO: compare with the latest category snapshot
    var snapshot = category.getSnapshot(fRound.id);
    initializeTrainingsView(client, category, snapshot);
    initializeTermsView(client, category, snapshot);
    initializeTestingsView(client, category, snapshot);
  }

  function setupCategoryViewModel(category, fRound) {
    var client = category.createClient();
    var hasTask = setupCategoryRuningTaskViewModel(client, category);
    if (hasTask) {
      vars['$L.format'] = 'cate2idol2.tuning.wait';
      vars['$idol.category.status'] = 'tuning';
    } else {
      setupCategoryTrainingResultViewModel(client, category, fRound);
      vars['$L.format'] = 'cate2idol2.tuning';
      vars['$idol.category.status'] = 'normal';
    }
  }

  function setupCategoryViewerEnvironment(category, fRound) {
    var newTraining = _.compact(vars['$pseudo.fill.training.samples']);
    if (newTraining && newTraining.length > 0) {
      category.addTuningRecords(newTraining);
    }
    var newTesting = _.compact(vars['$pseudo.fill.testing.samples']);
    if (newTesting && newTesting.length > 0) {
      category.addTestingRecords(newTesting);
    }
    vars['$pseudo.fill.training.samples'] = [];
    vars['$pseudo.fill.testing.samples'] = [];
    setupCategoryViewModel(category, fRound);
  }

  function setupEnvironment(fCategory, fRound) {
    vars['$training.ticket.id'] = [];
    vars['$training.ticket.title'] = [];
    vars['$training.ticket.status'] = [];
    vars['$training.ticket.body'] = [];

    vars['$training.terms'] = [];
    vars['$training.terms.weight'] = [];

    vars['$testing.ticket.id'] = [];
    vars['$testing.ticket.title'] = [];
    vars['$testing.ticket.body'] = [];

    vars['$category.company'] = fRound.company;

    try {
      var category = IDOLSmartTicketCategory.wrap(fCategory);
      if (category) {
        setupCategoryViewerEnvironment(category, fRound);
      }
    } catch(e) {
      logger.error(e);
      logger.error(e.stack);
      throw e;
    }
  }

  // load it from server side;
  function getTNWFromUI() {
    var terms = vars['$training.terms'].toArray(),
        weights = vars['$training.terms.weight'].toArray(),
        modified = vars['$training.terms.modified.weight'].toArray();

    var results = _.object(terms, weights),
        tuned = _.object(terms, modified);

    _.each(tuned, function(weight, term) {
      if (!!weight) {
        results[term] = weight;
      }
    });
    return results;
  }

  function saveCategoryTerms(fCategory) {
    var category = IDOLSmartTicketCategory.wrap(fCategory);
    var tnws = getTNWFromUI();
    var client = category.createClient();
    category.updateTerms(client, tnws);
  }

  function addCategoryTerm(fCategory, word, weight) {
    var category = IDOLSmartTicketCategory.wrap(fCategory);
    var client = category.createClient();
    var tnws = getTNWFromUI();
    // add one term can overwrite whole category modified term list
    // has to pass along the existing term definition and merge them
    category.addTerm(client, word, weight, tnws);
  }

  function syncCategoryMeta(fCategory) {
    if (fCategory && fCategory.status === 2 && fCategory.parentid > 0) { // category finish training, it must have root category
      var category = IDOLSmartTicketCategory.wrap(fCategory);
      var trainrefs = category.getAllTrainingDocumentRefs();
      fCategory.traincount = trainrefs.length;
    }
  }

  return {
    setup : setupEnvironment,
    syncMeta : syncCategoryMeta,
    saveCategoryTerms : saveCategoryTerms,
    addCategoryTerm : addCategoryTerm
  };
}());

function setupView() {
  try {
    return IDOLSmartTicketTestCategoryHelper.setup.apply(this, arguments);
  } catch(e) {
    funcs.msg(e, 3);
    logger.error(e);
    logger.error(e.stack || '');
  }
}

function saveTerms() {
  return IDOLSmartTicketTestCategoryHelper.saveCategoryTerms.apply(this, arguments);
}

function addTerm() {
  return IDOLSmartTicketTestCategoryHelper.addCategoryTerm.apply(this, arguments);
}

function syncMeta() {
  return IDOLSmartTicketTestCategoryHelper.syncMeta.apply(this, arguments);
}