/**
 * Currently the inheritance hierachy is like
 * All the 'KMQuery' instance are used to guide how to generate IDOL command
 *
 *
 *                                       IDOLKMQuery (XML)
 *                                              |
 *                 +----------------------------+---------------------+---------------------------------+
 *                 |                            |                     |                                 |
 *   IDOLKMQueryDefault (HTML)    IDOLKMQueryQuickSearch (JSON)    IDOLKMQuerySRC (JSON)    IDOLKMQueryParametric (JSON)
 *                 |                            |
 *    IDOLKMQueryMobile (HTML)    IDOLKMQueryMyCollection (JSON)
 */
var IDOLKMQueryFactory = (function() {

  var CANDICATES = {
    'src'          : 'IDOLKMQuerySRC',
    'mobile'       : 'IDOLKMQueryMobile',
    'default'      : 'IDOLKMQueryDefault',
    'parametric'   : 'IDOLKMQueryParametric',
    'quicksearch'  : 'IDOLKMQueryQuickSearch',
    'mycollection' : 'IDOLKMQueryMyCollection'
  };

  function create(client, fKMQuery, criteria) {
    var name = CANDICATES[client] || 'IDOLKMQueryDefault';
    var IDOLKMQueryLibrary = lib[name];
    if (!IDOLKMQueryLibrary) {
      throw new Error('cannot handle client type: ' + client);
    }
    var IDOLKMQueryFunction = IDOLKMQueryLibrary.require();
    return new IDOLKMQueryFunction(fKMQuery, criteria);
  }
  return {
    create: create
  };
}());

function require() {
  return IDOLKMQueryFactory;
}