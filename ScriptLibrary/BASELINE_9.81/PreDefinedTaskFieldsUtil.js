var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;

var scmsg = system.functions.scmsg;

function getRelationById(id) {
  if (!_str.isBlank(id)) {
    return $("relation").select('id=' + id).uniqueResult();
  } else {
    return null;
  }
}

function getTaskCategoryFileName(fileName) {
  var object = $("Object").select('file.name="' + fileName + '"').uniqueResult();
  return object["category.file.name"];
}

function getCaption(name, fields, captions) {
  var caption = name;
  var idx = $.indexOf(fields, name);
  if (idx != -1) {
    caption = captions[idx];
    var captionStr = scmsg(caption, "sccaption");
    if (captionStr.indexOf("Could not be found") == -1) {
      caption = captionStr;
    }
  }
  return caption;
}

function getFields(filename, restrictedFields) {
  var fields = [];

  var dbdict = $(filename).dbdict();
  var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
  var setting = $("settings").select('name="Condition Editor"').uniqueResult();
  var settingIds = setting["settingId"];
  var settingValues = setting["settingValue"];
  var displaySystemfields = false;
  var displayDeprecatedfields = false;
  for (var i = 0, iLoopTimes = settingIds.length(); i < iLoopTimes; i++) {
    var settingId = settingIds[i];
    if ("display.deprecatedfields" == settingId) {
      displayDeprecatedfields = (settingValues[i] == "true");
    }
  }

  if (dbdict != null && datadict != null) {
    var allFields = dbdict["field"];
    for (var i = 0, iLoopTimes = allFields.length(); i < iLoopTimes; i++) {
      var field = allFields[i];

      if ($.isPrimitiveType(field["type"])) {
        var name = field["name"];
        if (!_.contains(restrictedFields, name)) {
          var datadictFields = datadict["fields"];
          var datadictCaptions = datadict["captions"];
          var datadictTypes = datadict["sysFieldType"];
          var idx = $.indexOf(datadictFields, name);
          if (idx != -1) {
            var datadictType = datadictTypes[idx];
            // skip system fields
            if (datadictType == 1 && !displaySystemfields) {
              continue;
            }

            // skip deprecated fields
            if (datadictType == 4 && !displayDeprecatedfields) {
              continue;
            }

            var caption = datadictCaptions[idx];
            var captionStr = scmsg(caption, "sccaption");
            if (captionStr.indexOf("Could not be found") == -1) {
              caption = captionStr;
            }
            fields.push({
              value: name,
              disp: caption
            });
          }
        }
      }
    }
  }

  if (fields.length > 0) {
    fields = _.sortBy(fields, "disp");
  }
  return fields;
}

function getRelationQuery(sourceFile, sourceField) {
  var query = 'source.file="' + sourceFile + '"';
  query += ' and source.field like "*' + sourceField + '*"';
  return query;
}