/**
 * Manage Category entity in `cate2idol2` database table
 *
 * this `cate2idol2` table is a staging area, every changes should first
 * apply on this record, then sync them on to IDOL server.
 */
var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('IDOLSmartTicketCategorizerCategoryTreeStaging');

var CategoryTree = lib.IDOLSmartTicketCategorizerCategoryTree.CategoryTree;
var Node = CategoryTree.Node;

// TODO: this is the limitation of table 'cate2idol2', enlarge this settings
// when additional level is required
var CATEGORY_FIELD_NAMES = ['category', 'subcategory', 'product.type'];

function StagingCategoryTree() {
  CategoryTree.apply(this, arguments);
}

function F1() {}
F1.prototype = CategoryTree.prototype;
StagingCategoryTree.prototype = new F1();
StagingCategoryTree.prototype.constructor = StagingCategoryTree;

StagingCategoryTree.prototype.remove = function(names) {
  var path = _.initial(names), name = _.last(names);
  var parent = this.find(path);
  if (parent) {
    parent.remove({ name: name }); // remove child by name
  }
};

StagingCategoryTree.prototype._findParent = function(names) {
  var path = _.initial(names);
  return this.find(path);
};

StagingCategoryTree.prototype.add = function(names, props) {
  var parent = this._findParent(names), name = _.last(names);
  var nodeProps = _.extend({ name: name }, props);
  return parent.add(nodeProps);
};

StagingCategoryTree.prototype._findCategory = function(path) {
  var initialCriteria = this._categorizer.createCategoryQueryCriteria();
  var names = _.first(CATEGORY_FIELD_NAMES, path.length);
  var kvs = _.object(names, path);
  var criteria = _.reduce(kvs, function(criteria, value, name) {
    return criteria.and(new QueryCond(name, EQ, value));
  }, initialCriteria);
  var fCategory = new SCFile('cate2idol2');
  var rc = fCategory.doSelect(criteria);
  return rc === RC_SUCCESS ? fCategory : null;
};

StagingCategoryTree.prototype._destroyCategory = function(fCategory) {
  var parentid= fCategory.id;
  if( fCategory.doDelete() ==  RC_SUCCESS) 
  {
    //parent is gone, so children should delete also
    var rc = fCategory.doSelect("parentid="+parentid);
    while(rc == RC_SUCCESS)
    {
      fCategory.doDelete();
      rc = fCategory.getNext();
    }
  }
  else
  {
    throw new Error('unable to delete category: ' + parentid);
  }
};

StagingCategoryTree.prototype._createCategory = function(names, value) {
  var fCategory = this._categorizer.newCategory();
  fCategory.name = _.last(names);
  
  var kvs = _.object(CATEGORY_FIELD_NAMES, names);
  _.each(kvs, function(value, fieldname) {
    fCategory[fieldname] = value;
  });

  var parent = this._findParent(names);
  fCategory.parentid = parent ? parent.id : 0;
  return fCategory;
};

// sometimes category entity(cate2idol2) exists, but not trained 
// (e.g. doesn't have enough traning sample)
// we only need to get this record and update its training docs in this situation.
StagingCategoryTree.prototype._findOrCreateCategory = function(names, value) {
  var fCategory = this._findCategory(names);
  if (!fCategory) {
    fCategory = this._createCategory(names, value);
  }
  return fCategory;
};

StagingCategoryTree.prototype.create = function(names, props) {
  var categorizer = this._categorizer;
  logger.info(categorizer + ', creating category with name: ' + JSON.stringify(names) + ', props: ' + JSON.stringify(props));
  var fCategory = this._findOrCreateCategory(names, props);
  fCategory.status = 0;
  fCategory.testflag = 0;
  fCategory.sourcecount = 0;
  fCategory.indexcount = 0;
  fCategory.traincount = 0;
  fCategory.traindocs = [];
  fCategory.testdocs = [];

  var category = categorizer.wrapCategory(fCategory);
  category.pickSamples();

  var rc = fCategory.doSave();
  if (rc !== RC_SUCCESS) {
    throw new Error('unable to save category: ' + names);
  }
  return category.getValue();
};

StagingCategoryTree.prototype.destroy = function(names) {
  var categorizer = this._categorizer;
  logger.info(categorizer + ', destroying category with name: ' + JSON.stringify(names));
  var fCategory = this._findCategory(names);
  if (fCategory) {
    var category = this._categorizer.wrapCategory(fCategory);
    logger.info(categorizer + ' destroying ' + category);
    this._destroyCategory(fCategory);
  }
};

StagingCategoryTree._findStagingCategories = function(categorizer) {
  //var names = categorizer.getCategoryFields();
  // always sort by id instead of use null sort
  var names=['id'];
  var orders = _.reduce(names, function(orders, name) {
    orders[name] = SCFILE_ASC;
    return orders;
  }, {});
  return categorizer.getCategories({ orderBy : orders });
};

StagingCategoryTree.constructCategoryTree = function(categorizer) {
  var tree = new this(categorizer);

  var categoryCollection = this._findStagingCategories(categorizer);
  categoryCollection.each(function(category) {
    tree.add(category.getNames(), category.getValue());
  }, this);
  return tree;
};


/* Test Code */

// var _ = lib.Underscore.require();
// var JSON = lib.JSON.json();
// var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();
// var StagingCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeStaging.StagingCategoryTree;

// var categorizer = IDOLSmartTicketCategorizerFactory.create(6);

// var tree = StagingCategoryTree.constructCategoryTree(categorizer);
// print(JSON.stringify(tree._inspect(), null, '     '));