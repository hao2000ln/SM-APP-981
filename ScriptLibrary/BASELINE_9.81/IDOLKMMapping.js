var _ = lib.Underscore.require();

var IDOLKMMapping = (function() {
  function getSearchFields(filename) {
    var kmmapping = new SCFile('kmmapping');
    var query = new QueryCond('name', EQ, filename);
    var rc = kmmapping.doSelect(query);
    if (rc === RC_SUCCESS) {
      var fields = kmmapping['search.fields'];
      return _.map(fields, function(field) {
        return {
          source: field['sc.searchfield'],
          target: field['km.target']
        };
      });
    }
    return [];
  }

  function canProvideSolution(kmmapping, file) {
    var targets = [];
    var fields = kmmapping['retrieval.fields'];
    var filename = funcs.filename(file);
    var matchers = _.chain(fields).pluck('km.type').uniq().value();

    if (filename === 'kmdocument') {
      if (_.indexOf(matchers, 'all') !== -1) {
        return true;
      }
      var doctype = file.doctype;
      if (_.indexOf(matchers, doctype) !== -1) {
        return true;
      }
    }
    return _.indexOf(matchers, filename) !== -1;
  }

  function getSolutionTargets(file) {
    var filename = funcs.filename(file);
    var kmmapping = new SCFile('kmmapping', SCFILE_READONLY);
    var rc = kmmapping.doSelect(true);
    var targets = [];
    while (rc === RC_SUCCESS) {
      if (canProvideSolution(kmmapping, file)) {
        targets.push(kmmapping.name);
      }
      rc = kmmapping.getNext();
    }
    return targets;
  }

  function toJSON(kmmapping) {
    var name = kmmapping.name,
        fields = kmmapping['fields'],
        searchFields = kmmapping['search.fields'];

    var mappings = _.map(fields, function(field) {
      return { name : field['sc.field'], type : field['km.doctype'] };
    });
    var searchs = _.map(searchFields, function(field) {
      return { name : field['sc.searchfield'], target : field['km.target'] };
    });

    return {
      "filename" : name,
      "searchs" : searchs,
      "solutions" : mappings
    };
  }

  function getFieldMappings() {
    var kmmapping = new SCFile('kmmapping', SCFILE_READONLY);
    var rc = kmmapping.doSelect(true);
    var mappings = [];
    while (rc === RC_SUCCESS) {
      mappings.push(toJSON(kmmapping));
      rc = kmmapping.getNext();
    }
    return mappings;
  }

  return {
    getFieldMappings : getFieldMappings,
    getSearchFields : getSearchFields,
    getSolutionTargets : getSolutionTargets
  };
}());

function require() {
  return IDOLKMMapping;
}