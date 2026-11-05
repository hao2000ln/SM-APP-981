var str = system.functions.str;
var MIXED_FIELD_NAME = 'children.type';

function CHILDREN_TYPE () {}
CHILDREN_TYPE.CATEGORY = 'category';
CHILDREN_TYPE.ITEM     = 'item';
CHILDREN_TYPE.MIXED    = 'mixed';
CHILDREN_TYPE.EMPTY    = 'empty';


/**
 * This function does this operation
 *
 *  +-----------------+-------------+----------+
 *  |   parent\child  | item/bundle | category |
 *  +-----------------+-------------+----------+
 *  |      empty      |  item       | category |
 *  +-----------------+-------------+----------+
 *  |      item       |  item       |   mixed  |
 *  +-----------------+-------------+----------+
 *  |      category   |  mixed      | category |
 *  +-----------------+-------------+----------+
 *  |      mixed      |  mixed      |   mixed  |
 *  +-----------------+-------------+----------+
 *
 **/
function calcChildrenType(childrenType, childType) {
	if (!childrenType)
		childrenType = CHILDREN_TYPE.EMPTY;
	if (childType == 'bundle')
		childType = 'item';
	if (childrenType == CHILDREN_TYPE.EMPTY)
		return childType;
	else if (childrenType == CHILDREN_TYPE.MIXED)
		return CHILDREN_TYPE.MIXED;
	else if (childrenType == childType)
		return childrenType;
	else
		return CHILDREN_TYPE.MIXED;
}

var Catalog = function (file) {
	this.file = file;
}
Catalog.prototype = {
	eachParent: function (callback) {
		for (
				var parent = new SCFile('svcCatalog'), 
					r = parent.doSelect('name isin ' + str(this.file.parent));
				RC_SUCCESS == r;
				r = parent.getNext()
			) {
				if (false === callback(parent)) {
					break;
				}
		}
	}
}


var Category = function (file) {
	this.file = file;
}
Category.prototype = {
	onAddChild: function (child) {
		var old = this.file[MIXED_FIELD_NAME],
			result = calcChildrenType(old, child.type);
		if (old != result) {
			this.file[MIXED_FIELD_NAME] = result;
			this.file.doUpdate();
		}
	},
	
	onRemoveChild: function (child) {
		var result = CHILDREN_TYPE.EMPTY;
		this.eachChild(function (c) {
			if (c.name != child.name) {
				result = calcChildrenType(
						result, c.type);
			}
		});
		
		if (result != this.file[MIXED_FIELD_NAME]) {
			this.file[MIXED_FIELD_NAME] = result;
			this.file.doUpdate();
		}
	},
	
	eachChild: function (callback) {
		for (
				var child = new SCFile('svcCatalog'), 
					r = child.doSelect('parent = "' + this.file.name + '"');
				RC_SUCCESS == r;
				r = child.getNext()
			) {
			if (callback(child) === false) {
				break;
			}
		}
		
	}
}

function afterAdd(record) {
	var catalog = new Catalog(record);
	catalog.eachParent(function (p) {
		var category = new Category(p);
		category.onAddChild(record);
	});
}

function subtract(set1, set2) {
	if (!(set1 instanceof Array))
		return [];
	if (!(set2 instanceof Array))
		return set1;
	var ret = [];
	each(set1, function (item) {
		if (!contains(set2, item)) {
			ret[ret.length] = item;
		}
	});
	return ret;
}

function each(arr, callback) {
	for (var i=0; i<arr.length; ++i) {
		callback(arr[i]);
	}
}

function indexOf(arr, item) {
	for (var i=0; i<arr.length; ++i)
		if (arr[i] == item)
			return i;
	return -1;
}

function contains(arr, item) {
	return indexOf(arr, item) != -1;
}

function afterUpdate(before, after) {
	// removed parents
	var removed = subtract(before.parent.toArray(), after.parent.toArray());
	each(removed, function (c) {
		var f = new SCFile('svcCatalog'), r = f.doSelect('name="' + c + '"');
		if (RC_SUCCESS == r) {
			var category = new Category(f);
			category.onRemoveChild(after);
		}
	});
	// added parents
	var added = subtract(after.parent.toArray(), before.parent.toArray());
	each(added, function (c) {
		var f = new SCFile('svcCatalog'), r = f.doSelect('name="' + c + '"');
		if (RC_SUCCESS == r) {
			var category = new Category(f);
			category.onAddChild(after);
		}
	});
}

function afterDelete(record) {
	var catalog = new Catalog(record);
	catalog.eachParent(function (p) {
		var category = new Category(p);
		category.onRemoveChild(record);
	});
}