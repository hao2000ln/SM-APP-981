/**
 * This category tree represent the system category usage
 *
 * Sometimes one category can be defined but never use, calculate category
 * from ticket distribution directly can avoid this problem.
 *
 * Ticket data can have missing category value, some indirect category record 
 * can appear in sql aggregation results
 *
 * e.g.
 * +---+------------+------------+------------+-------+
 * | # | category 1 | category 2 | category 3 | count |
 * +---+------------+------------+------------+-------+
 * | 1 | value 1    | value 2    | NULL       | 10    |
 * | 2 | value 1    | value 2    | value 3    | 500   |
 * +---+------------+------------+------------+-------+
 *
 * should exclude data rows like #1, because the child catgory defined in 
 * service manager usually doesn't have conceptual relationship with its parent
 * 'parent category' here is only works like container, doesn't have real meaning
 *
 *
 * TODO: Some security restriction can be applied on this category dimension 
 * table, such as 'append query', may take them into consideration.
 *
 * XXX: Every background scheduler has an associated "operator", but this 
 * operator may not be the one you want
 */
var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('IDOLSmartTicketCategorizerCategoryTreeWorking');
var CategoryTree = lib.IDOLSmartTicketCategorizerCategoryTree.CategoryTree;
var Node = CategoryTree.Node;

function WorkingCategoryTree() {
  CategoryTree.apply(this, arguments);
}

function F1() {}
F1.prototype = CategoryTree.prototype;
WorkingCategoryTree.prototype = new F1();
WorkingCategoryTree.prototype.constructor = WorkingCategoryTree;

WorkingCategoryTree.prototype.destroy = function() {
  throw new Error('working category tree is not allowed to destroy node');
};

WorkingCategoryTree.prototype.remove = function() {
  throw new Error('working category tree is not allowed to remove node');
};

WorkingCategoryTree.prototype.create = function() {
  throw new Error('working category tree is not allowed to create node');
};

WorkingCategoryTree.prototype.add = function(path, props) {
  var depth = path.length - 1;
  return _.reduce(path, function(parent, name, i) {
    if (i < depth) {
      var child = parent.find(name);
      return child || parent.add({ name: name, count: 0 });
    } else {
      var nodeProps = _.extend({ name: name }, props);
      return parent.add(nodeProps);
    }
  }, this.getRoot());
};

WorkingCategoryTree._reshapeDistribution = function(categorizer, distribution) {
  var fieldnames = categorizer.getCategoryFields();

  var extractCategoryValues = function(row) {
    return _.map(fieldnames, function(name) { return row[name]; });
  };

  var results = [], total = 0;
  _.each(distribution, function(row, i) {
    var names = extractCategoryValues(row);
    if (_.compact(names).length !== names.length) {
      logger.warn('record "' + names.join(',') + '" doesn\'t have enought category levels defined, skip these ' + row.amount + ' records');
      return;
    }

    total += row.amount;
    results.push({ names: names, count: row.amount, acc: total });
  });
  return { total: total, results: results };
};

WorkingCategoryTree.constructCategoryTree = function(categorizer) {
  var JSON = lib.JSON.json();
  //var IDOLSmartTicketCategoryDistribution = lib.IDOLSmartTicketCategoryDistribution.require();
  
  var IDOLSmartTicketCategoryDistribution = lib.IDOLSmartTicketCategoryDistributionMand.require();
  var model = IDOLSmartTicketCategoryDistribution.analyze(categorizer);  
  var data = this._reshapeDistribution(categorizer, model.distribution);
  var total = data.total, rows = data.results;

  // root category is required even there is no data, otherwise it is not able 
  // compare with other category tree with `diff`
  var tree = new this(categorizer);
  _.each(rows, function(row, i) {
    var props = { count: row.count, acc: row.acc, total: total };
    tree.add(row.names, props);
  });
  return tree;
};


/* Test code */

// var _ = lib.Underscore.require();
// var JSON = lib.JSON.json();
// var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();
// var WorkingCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeWorking.WorkingCategoryTree;
// var categorizer = IDOLSmartTicketCategorizerFactory.create(6);
// var tree = WorkingCategoryTree.constructCategoryTree(categorizer);
// print(JSON.stringify(tree._inspect(), null, '     '));
