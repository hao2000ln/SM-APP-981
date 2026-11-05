/**
 * The `Category Tree` is used in three different places
 *
 * 1. Working Category Tree: 
 *    Calculate category tree from ticket data distribution. This tree represents
 *    the real categories usage in the system.
 *
 * 2. Staging Category Tree:
 *    Category entities defined in `cate2idol2`. 
 *    Because ticket category distribution can vary along the time, not stable, 
 *    cannot be used to do the training.
 *    Take a `snapshot` and use them to decide which categories are important.
 *
 * 3. IDOL Category Tree:
 *    Synchronize important categoires from "Staging Category Tree"
 *    These categories need training/testing samples, and the training samples
 *    need indexed before training start
 */
var _ = lib.Underscore.require(),
    // XXX: rteJSONStringify cannot stringify object if its key is a number
    JSON = lib.JSON.json();

var logger = getLog('IDOLSmartTicketCategorizerCategoryTree');

var OPS = { ADD: 'add', REMOVE: 'remove' };

// two category tree differences, can be used in confirm UI?
function Diff(initial) {
  this._ops = initial || [];
}

Diff.prototype.add = function(node) {
  node.traverse(function(node) {
    this._ops.push(_.extend({ op: OPS.ADD }, node.flatten()));
  }, this, { order: 'pre'}); // parent node need to be added first
  return this;
};

Diff.prototype.remove = function(node) {
  node.traverse(function(node) {
    this._ops.push(_.extend({ op: OPS.REMOVE }, node.flatten()));
  }, this, { order: 'post' }); // child node need to be destroyed first
  return this;
};

Diff.prototype.concat = function(others) {
  this._ops = this._ops.concat(others);
  return this;
};

Diff.prototype.get = function() {
  return this._ops;
};


function Node(props) {
  if (!props.name) {
    throw new Error('category name is required. Got: ' + JSON.stringify(props));
  }
  this.props = props;

  // XXX `id` doesn't exists when calculating category from ticket data distribution
  this.id = props.id;

  // category `name` is not unique, two category can have same name but with 
  // different parent. `full path` is required if you want to locate on exactly 
  // category.
  this.name = props.name;
  this.level = 0;
  this.parent = null;
  // use associate array to improve search performance, this `children` will be
  // converted to array when serializing into JSON
  this.children = {};
}

Node.prototype.getId = function() { return this.id; };

Node.prototype.getName = function() { return this.name; };

Node.prototype.getProps = function() { return this.props; };

Node.prototype.getLevel = function() { return this.level; };

Node.prototype.isRoot = function() { return !this.parent; };

// XXX: leaf node doesn't means leaf category
Node.prototype.hasChild = function() { return _.size(this.children) > 0; };

Node.prototype.getChain = function() {
  return this.parent ? this.parent.getChain().concat(this) : [];
};

Node.prototype.getPath = function() {
  var chain = this.getChain();
  return _.map(chain, function(d) { return d.getName(); });
};

Node.prototype.getFullName = function() {
  return this.getPath().join(' / ');
};

Node.prototype.flatten = function() {
  return {
    id: this.getId(),
    path: this.getPath(),
    props: this.getProps()
  };
};

Node.prototype.find = function(path) {
  if (_.isString(path)) {
    return this.children[path];
  } else if (_.isArray(path)) {
    if (path.length === 0) { return this; }
    var child = this.find(_.first(path));
    return child ? child.find(_.rest(path)) : null;
  } else {
    throw new Error('unsupported `find` arguments: ' + path);
  }
};

Node.prototype.toJSON = function() {
  var json = { id: this.id, name: this.name, props: this.props };
  if (this.hasChild()) {
    json.children = _.map(this.children, function(d) { return d.toJSON(); });
  }
  return json;
};

Node.prototype.toString = function() {
  return "Node: " + JSON.stringify(this.props);
};

Node.prototype.traverse = function(callback, scope, options) {
  options = _.defaults(options || {}, { order : 'pre' });
  if (options.order === 'pre') { callback.call(scope, this); }

  _.each(this.children, function(child) {
    child.traverse(callback, scope, options);
  });

  if (options.order === 'post') { callback.call(scope, this); }
};

Node.prototype.add = function(props) {
  var child = new Node(props);
  child.parent = this;
  child.level = this.level + 1;
  this.children[props.name] = child;
  return child;
};

// props can be `Node` object or plain javascript object, but they have same data structure
Node.prototype.remove = function(props) {
  var name = props.name;
  var node = this.children[name];
  delete this.children[name];
  return node;
};

// prune child node first, it is possible to delete all children node
// so their parent node also need to be deleted
Node.prototype.prune = function(callback, scope) {
  if (this.children) {
    this.children = _.chain(this.children)
                     .filter(function(child) { return child.prune(callback, scope); })
                     .indexBy('name')
                     .value();
  }
  var valid = callback.call(scope, this, scope);
  if (!valid) { return null; }
  return this;
};

Node.prototype.diff = function(that, hash) {
  var thisNode = this, thatNode = that;
  var delta = new Diff();

  if (hash(thisNode) !== hash(thatNode)) {
    delta.remove(thisNode).add(thatNode).get();
  } else {
    var thisChildren = _.indexBy(thisNode.children, hash),
        thatChildren = _.indexBy(thatNode.children, hash);

    var thisKeys = _.keys(thisChildren),
        thatKeys = _.keys(thatChildren);

    var toAdd = _.difference(thatKeys, thisKeys),
        toRemove = _.difference(thisKeys, thatKeys),
        toKeep = _.intersection(thisKeys, thatKeys);

    _.each(toRemove, function(key) {
      delta.remove(thisChildren[key]);
    }, this);

    _.each(toAdd, function(key) {
      delta.add(thatChildren[key]);
    }, this);

    _.each(toKeep, function(key) {
      var thisNode = thisChildren[key],
          thatNode = thatChildren[key];
      delta.concat(thisNode.diff(thatNode, hash));
    }, this);
  }
  return delta.get();
};



// Category tree representation in system memory
function CategoryTree(categorizer, root) {
  this._categorizer = categorizer;
  this._root = root || new Node({
    id: categorizer.getTaxonomyRoot().id,
    name: categorizer.getTaxonomy()
  });
}

CategoryTree.Node = Node;

CategoryTree.prototype.getRoot = function() {
  return this._root;
};

CategoryTree.prototype.traverse = function(callback, scope, options) {
  this._root.traverse(callback, scope, options);
};

CategoryTree.prototype.prune = function(callback, scope) {
  this._root = this._root.prune(callback, scope);
  return this;
};

CategoryTree.prototype.getSize = function() {
  var size = 0;
  this.traverse(function() { size++; });
  return size;
};

// the returned value is an array, like
// [{
//   op: 'add',
//   path: ['incident', 'application', 'vpn'],
//   props: { }    // props schema can vary
// }, ...]
CategoryTree.prototype.diff = function(tree, options) {
  options = options || {};
  var thisNode = this._root, thatNode = tree._root; // real category node

  // because Service Manager category text can be renamed, the "name" cannot
  // be an entity identifier, allow overwrite the hash function
  var hash = options.hash || function(node) { return node.name; };
  return thisNode.diff(thatNode, hash);
};

// apply the patches which generated by 'diff' method
CategoryTree.prototype.patch = function(actions, options) {
  options = options || {};
  logger.debug('applying patch: ' + JSON.stringify(actions));
  _.each(actions, function(action) {
    var op = action.op,
        path = action.path,
        props = action.props;

    switch(op) {
      case OPS.ADD:
        var node = this.create(path, props, options);
        this.add(path, node, options);
        break;
      case OPS.REMOVE:
        this.destroy(path, props, options);
        this.remove(path, options);
        break;
      default:
        throw new Error('unknown patch operator: ' + op);
    }
  }, this);
  return this;
};

CategoryTree.prototype.find = function(path) {
  path = _.isString(path) ? [ path ] : path;
  if (!_.isArray(path)) {
    throw new Error('unable to find category node by ' + path);
  }
  return this._root ? this._root.find(path) : null;
};

CategoryTree.prototype._inspect = function() {
  return {
    categorizer: this._categorizer.toString(),
    nodes: this._root.toJSON()
  }
};

// abstract methods
// NOTE: name conventions
// 
// add/remove:     add or remove node onto category tree, work in memory
// create/destroy: create or destory category entity, have persistent storage
CategoryTree.prototype.add = function(path, props, options) {
  throw new Error('unimplemented exception');
};

CategoryTree.prototype.remove = function(path, options) {
  throw new Error('unimplemented exception');
};

CategoryTree.prototype.create = function(path, props, options) {
  throw new Error('unimplemented exception');
};

CategoryTree.prototype.destroy = function(path, props, options) {
  throw new Error('unimplemented exception');
};
