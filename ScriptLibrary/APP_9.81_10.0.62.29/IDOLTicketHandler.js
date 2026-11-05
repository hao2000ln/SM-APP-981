var _ = lib.Underscore.require(),
    IDOLModuleConfiguration = lib.IDOLModuleConfiguration.require(),
    IDOLIndexSpec = lib.IDOLIndexSpec.require(),
    IDOLCommon = lib.IDOLCommon.require();

var logger = getLog('IDOLTicketHandler');

var IDOLTicketHandler = (function() {

  function getUniqueField(record) {
    var fields = IDOLCommon.getReferenceFields(funcs.filename(record));
    if (fields.length !== 1) {
      throw new Error(funcs.filename(record) + " doesn't have single unique field");
    }
    return fields[0];
  }

  function getUniqueID(record) {
    var fieldname = getUniqueField(record);
    return record[fieldname];
  }

  function makeDescriptions(source, depends, depSpec) {
    var descriptions = [];

    var rc = depends.getFirst(),
        fieldname = depSpec.keys[0]
    // copy all the descriptions into newly created one
    while (rc === RC_SUCCESS) {
      // Hot topic Analytics can defined multiple content fields
      var id = depends[fieldname],
          line = depends[depSpec.titlefield];
      descriptions.push([id, line].join(' : '));
      rc = depends.getNext();
    }

    return descriptions;
  }

  // 'depends' are ticket list choosing by HTA
  function makeTitle(source, depends, depSpec) {
    // only pick the first one
    depends.getFirst();
    return depends[depSpec.titlefield];
  }

  function makeRelations(source, depends, depSpec) {
    var relations = [], 
        sfilename = funcs.filename(source), 
        dfilename = funcs.filename(depends),
        id = getUniqueID(source),
        ckey = depSpec.keys[0];

    var config = IDOLModuleConfiguration.get(dfilename),
        relType = _.result(config, 'relationship');

    vars.$relationType = relType;
        vars.$sourceType = null;
        vars.$targetType = null;
        if (sfilename == "rootcause") {
            vars.$sourceType = source.isKnownError ? "ke" : "pbm";
        }
        if (dfilename == "rootcause") {
            vars.$targetType = depends.isKnownError ? "ke" : "pbm";
        }

    var rc = depends.getFirst();
    while (rc === RC_SUCCESS) {
      var relation = new SCFile("screlation");
      relation["source"] = id;
      relation["source.filename"] = sfilename;
      relation["source.active"] = true;
      relation["depend"] = depends[ckey];
      relation["depend.filename"] = dfilename;
      relation["depend.active"] = true;
      relation["type"] = relType;
      relations.push(relation);
      rc = depends.getNext();
    }
    return relations;
  }

  function buildChange(change, depends) {
    var depConfig = IDOLModuleConfiguration.get(funcs.filename(depends)),
        escalate = depConfig.escalate,
        result;
    if (!change.number) {
      var cm3rConfig = IDOLModuleConfiguration.get(funcs.filename(change));
      change.number = cm3rConfig.next();
    }

    if (escalate && _.isFunction(escalate)) {
      result = escalate.call(depConfig, change, depends);
    }

    if (result !== false) {
      var spec = IDOLIndexSpec.create(funcs.filename(depends));

      var title = IDOLTicketHandler.makeTitle(change, depends, spec),
          description = IDOLTicketHandler.makeDescriptions(change, depends, spec),
          relations = makeRelations(change, depends, spec);

      change["brief.description"] = title;
      change["description"] = description;
            _.each(relations, function(relation) {
                relation.doSave();
            });
            vars.$sourceType = null;
            vars.$targetType = null;
        }
    return change;
  }

  function buildProblem(problem, depends) {
    var depConfig = IDOLModuleConfiguration.get(funcs.filename(depends)),
        escalate = depConfig.escalate, 
        result;

    if (!problem.id) {
      var pmConfig = IDOLModuleConfiguration.get(funcs.filename(problem));
      problem.id = pmConfig.next();
    }

    if (escalate && _.isFunction(escalate)) {
      result = escalate.call(depConfig, problem, depends);
    }

    if (result !== false) {
      var spec = IDOLIndexSpec.create(funcs.filename(depends));

      var title = makeTitle(problem, depends, spec),
          description = makeDescriptions(problem, depends, spec),
          relations = makeRelations(problem, depends, spec);

      problem["brief.description"] = title;
      problem["description"] = description;
            _.each(relations, function(relation) {
                relation.doSave();
            });
            vars.$sourceType = null;
            vars.$targetType = null;
        }

    return problem;
  }

  function buildIncident(incident, depends) {
    var depConfig = IDOLModuleConfiguration.get(funcs.filename(depends)),
        escalate = depConfig.escalate, 
        result;

    if (!incident.number) {
      var imConfig = IDOLModuleConfiguration.get(funcs.filename(incident));
      incident.number = imConfig.next();
    }

    if (escalate && _.isFunction(escalate)) {
      result = escalate.call(depConfig, incident, depends);
    }

    if (result !== false) {
      var spec = IDOLIndexSpec.create(funcs.filename(depends));

      var title = makeTitle(incident, depends, spec),
          description = makeDescriptions(incident, depends, spec),
          relations = makeRelations(incident, depends, spec);

      incident["brief.description"] = title;
      incident["action"] = description;
            _.each(relations, function(relation) {
                relation.doSave();
            });
            vars.$sourceType = null;
            vars.$targetType = null;
        }
    return incident;
  }


  function buildTicket(source, depends) {
    var DISPACHER = {
      "cm3r"        : IDOLTicketHandler.buildChange,
      "probsummary" : IDOLTicketHandler.buildIncident,
      "rootcause"   : IDOLTicketHandler.buildProblem
    };

    var filename = funcs.filename(source);
    var func = DISPACHER[filename];
    if (func) {
      return func.call(null, source, depends);
    } else {
      logger.warn('cannot find HTA handler for ' + filename)
    }
  }

  return {
    build             : buildTicket,
    buildChange       : buildChange,
    buildProblem      : buildProblem,
    buildIncident     : buildIncident,
    makeTitle         : makeTitle,
    makeDescriptions  : makeDescriptions,
    makeRelations     : makeRelations
  }
})();

function require() {
  return IDOLTicketHandler;
}