/**
 * Use category trees to support delta training
 *
 * 1. Use the `diff` method to find the difference between "Working Category Tree" 
 *    and "Staging Category Tree".
 *
 * 2. After agent picks the important catgories and confirmed changes. 
 *    update these delta in `cate2idol2` table (Staging Category Tree), fulfill 
 *    training/testing samples if the categories (cate2idol2) are newly added.
 *
 * 3. Once "Staging Category Tree" updated, push them into "IDOL Category"
 * 3.1. Find the difference between "Staging Category Tree" and "IDOL Category Tree"
 * 3.2. Index training sample if there are newly added Category
 * 3.3. Create IDOL Category node and set the training samples
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLSmartTicketCategorySync');

var IDOLSmartTicketCategorySync = (function() {

  var WorkingCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeWorking.WorkingCategoryTree;
  var StagingCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeStaging.StagingCategoryTree;
  var IDOLCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeIDOL.IDOLCategoryTree;

  function constructWorkingCategoryTree(categorizer) {
    var tree = WorkingCategoryTree.constructCategoryTree(categorizer);
    var depth = categorizer.getCategoryFields().length;
    return tree.prune(function(node) {
      if (node.isRoot()) { return true; }
      if (node.getLevel() < depth) { return node.hasChild(); }
      var value = node.props || {};
      var coverage = (value.acc - value.count) / value.total;
      return coverage <= categorizer.getCoverage();
    });
  }

  function constructStagingCategoryTree(categorizer) {
    var tree = StagingCategoryTree.constructCategoryTree(categorizer);
    var depth = categorizer.getCategoryFields().length;
    // not all category defined in `cate2idol2` table are used
    // some category may not have enough training sample, and considered as irrelevant
    return tree.prune(function(node) {
      if (node.isRoot()) { return true; }
      if (node.getLevel() < depth) { return node.hasChild(); }
      var value = node.props || {};
      // for compatible purpose, in 9.34-9.52, sourcecount can be a negative value 
      // if this category is trival (not trained)
      if (value.sourcecount <= 0) { return false; }
      // 0: newly added
      // 2: already trained
      return value.status === 0 || value.status === 2;
    });
  }

  function constructIDOLCategoryTree(categorizer) {
    var tree = IDOLCategoryTree.constructCategoryTree(categorizer);
    /*
    var depth = categorizer.getCategoryFields().length;
    return tree.prune(function(node) {
      return node.isRoot() || node.hasChild() || (node.getLevel() === depth);
    });
    */
    return tree;
  }

  var CATEGORY_TREE = {
    idol: constructIDOLCategoryTree,
    staging: constructStagingCategoryTree,
    working: constructWorkingCategoryTree
  };

  function createCategoryTree(type, categorizer) {
    var factory = CATEGORY_TREE[type];
    if (!factory) {
      throw new Error('unknown category tree type: ' + type);
    }
    return factory(categorizer);
  }

  function diffCategoryTrees(categorizer, source, destination) {
    var sourceTree = createCategoryTree(source, categorizer);
    var destinationTree = createCategoryTree(destination, categorizer);
    return destinationTree.diff(sourceTree);
  }

  function patchCategoryTree(categorizer, diff, type) {
    var destinationTree = createCategoryTree(type, categorizer);
    return destinationTree.patch(diff);
  }

  return {
    createCategoryTree: createCategoryTree,
    diff: diffCategoryTrees,
    patch: patchCategoryTree
  };
}());

function require() {
  return IDOLSmartTicketCategorySync;
}

