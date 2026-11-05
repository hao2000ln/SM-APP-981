var _ = lib.Underscore.require();

/**
 * This is a XPath like tools to find specific xml node This library should be
 * deprecated when XPath was introduced
 * 
 * <p>
 * TODO: The library name 'XQuery' is not proper, because there already exists
 * one XML technologies called 'XQuery', should rename this library to some
 * other name.
 * </p>
 * 
 * e.g. existing XML document like below
 * 
 * <pre>
 * &lt;root&gt;
 *   &lt;node&gt;
 *     &lt;subnode&gt;The node value&lt;/subnode&gt;
 *   &lt;/node&gt;
 * &lt;/root&gt;
 * </pre>
 * 
 * In order to find the text value of "root/node/subnode", the code is like
 * 
 * <pre>
 * var XQuery = lib.XQuery.require();
 * var doc = new XML();
 * var value = XQuery.queryText('node/subnode', doc);
 * </pre>
 */
var XQuery = (function() {
  // enumeration for query matches status
  var STATUS = {
    ACCEPT    : 0,
    SHIFT     : 1,
    NEXT      : 2,
    SHIFTNEXT : 4
  };

  // traverse the whole xml tree
  function visite(node, level, visitor) {
    if (!node) { return null; }

    var child = node.getFirstChildElement();
    while (child) {
      switch (visitor.accept(child, level)) {
      case STATUS.SHIFT:
        return visite(child, level + 1, visitor);
      case STATUS.ACCEPT:
        return visitor.get();
      // for multiple value extract
      // 1. shift into child node to extract text
      // 2. navigate to sibling to process remain matcher
      case STATUS.SHIFTNEXT:
        visite(child, level + 1, visitor);
        break;
      }
      child = child.getNextSiblingElement();
    }
    return visitor.get();
  }

  function createCollectionVisitor(path) {
    var names = path.split('/'), length = names.length, collection = [];

    function collectionVisitor(xml, level) {
      if (xml.getQualifiedName() !== names[level]) {
        return STATUS.NEXT;
      }
      if (level + 1 >= length) {
        collection.push(xml);
        return STATUS.NEXT;
      }
      return STATUS.SHIFT;
    }

    return {
      accept : collectionVisitor,
      get : function() {
        return collection;
      }
    };
  }

  function createSingleNodeVisitor(path) {
    var names = path.split('/'), length = names.length, node = null;

    function singleNodeVisitor(xml, level) {
      if (xml.getQualifiedName() !== names[level]) {
        return STATUS.NEXT;
      }
      if (level + 1 >= length) {
        node = xml;
        return STATUS.ACCEPT;
      }
      return STATUS.SHIFT;
    }
    return {
      accept : singleNodeVisitor,
      get : function() {
        return node;
      }
    };
  }

  function createMultipleValueMatcher(name, query, output, multiple) {
    query = query || '';
    var names = query.split('/') || [], length = names.length;

    return function(xml, level) {
      var alternatives = (names[level] || '').split('|');
      if (_.indexOf(alternatives, xml.getQualifiedName()) === -1) { // non of the tag matches
        return STATUS.NEXT;
      }

      if (level + 1 >= length) { // at the end
        var oldValue = output[name],
            newValue = xml.getText(),
            value = oldValue !== undefined ? _.flatten([oldValue, newValue]) : newValue;
        output[name] = value;
        return multiple ? STATUS.NEXT : STATUS.ACCEPT;
      }
      return STATUS.SHIFT;
    };
  }

  // cannot use this visitor to extract a collection of nodes
  function createAdvancedSingleNodeVisitor(queries, multiple) {
    var results = {}, name;

    var matchers = _.map(queries, function(query, name) {
      return createMultipleValueMatcher(name, query, results, multiple);
    });

    function advancedVisitor(xml, level) {
      if (matchers.length === 0) { return STATUS.ACCEPT; }
      var remain = [], shift = [];
      _.each(matchers, function(matcher) {
        var status = matcher(xml, level);
        if (status !== STATUS.ACCEPT) { // still need furthor processing
          remain.push(matcher);
        }
        if (status === STATUS.SHIFT) {
          shift.push(matcher);
        }
      });
      matchers = remain;
      return remain.length > 0 ? (shift.length > 0 ? STATUS.SHIFTNEXT : STATUS.NEXT) : STATUS.ACCEPT;
    }

    return {
      accept : advancedVisitor,
      get : function() {
        return results;
      }
    };
  }

  /**
   * Find collection of matched XML node, if nothing found an empty array []
   * will be returned.
   */
  function queryCollection(query, doc) {
    var visitor = createCollectionVisitor(query);
    return visite(doc, 0, visitor) || [];
  }

  /**
   * Find a specific XML node, if nothing found null will be returned
   */
  function queryOne(query, doc) {
    var visitor = createSingleNodeVisitor(query);
    return visite(doc, 0, visitor);
  }

  /**
   * Find a specific XML node text value, if nothing found empty string '' will
   * be returned
   */
  function queryText(path, doc) {
    var node = queryOne(path, doc);
    return node ? node.getText() : '';
  }

  /**
   * Performance reason, read multiple properties at the same time
   * and use alternative query, otherwise it may traverse the whole
   * xml document to find one non-exists node
   */
  function queryObject(queries, doc, multiple) {
    var visitor = createAdvancedSingleNodeVisitor(queries, multiple);
    return visite(doc, 0, visitor) || {};
  }

  return {
    query : queryCollection,
    queryOne : queryOne,
    queryText : queryText,
    queryObject : queryObject
  };
}());

function require() {
  return XQuery;
}