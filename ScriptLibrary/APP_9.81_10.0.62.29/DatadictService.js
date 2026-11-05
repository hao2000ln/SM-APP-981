/**
 * See {@link module:c}
 *
 * @private
 * @method
 */
var $ = lib.c.$;
var _ = lib.Underscore.require();
var filename = system.functions.filename;
/**
 * @class DatadictService
 * @classdesc The datadict service for handling dbdict.
 */
var DatadictService = $(new function() {

  function checkFields(childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, type) {
    var _index = system.functions.index;
    var scmsg = system.functions.scmsg;
    var sccaption = "";
    for (var i = 0; i < childs.length; i++) {
      var child = childs[i];
      if (child.field.type === type) {
        var fieldName = child.field.name;
        var idx = _index(fieldName, datadictFields);
        if (idx <= 0) { // try filed name with parent
          idx = _index(child.parent.field.name + "," + fieldName, datadictFields);
        }
        if (idx > 0) {
          var datadictType = sysFieldTypes[idx - 1];
          // skip system fields
          if (datadictType === 1 && !displaySystemfields) {
            continue;
          }

          // skip deprecated fields
          if (datadictType === 4 && !displayDeprecatedfields) {
            continue;
          }

          caption = datadictCaptions[idx - 1];
          var captionStr = scmsg(caption, "sccaption");
          if (null !== captionStr && captionStr.indexOf("Could not be found") == -1) {
            caption = captionStr;
          }
          fields.push({
            value: fieldName,
            disp: caption
          });
        }
      } else if (child.childs.length > 0 && child.field.type !== $.Array) {
        checkFields(child.childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, type);
      }
    }
  }
  /** @lends DatadictService.prototype */
  return {

    /**
     * Get a field list of a file with ordered by caption.
     *
     * @param {string}
     *          filename - the file name.
     * @param {(int) array of js}
     *          type - the field type (SM type).
     * @return {array of object} the Array of filed list with field name and localized caption.
     */
    getFileFields: function(filename, typeArray) {
      var fields = [];

      var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
      var setting = $("settings").select('name="Condition Editor"').uniqueResult();
      var settingIds = setting["settingId"];
      var settingValues = setting["settingValue"];
      var displaySystemfields = false;
      var displayDeprecatedfields = false;
      for (var i = 0, iLoopTimes = settingIds.length(); i < iLoopTimes; i++) {
        var settingId = settingIds[i];
        if ("display.systemfields" == settingId) {
          displaySystemfields = (settingValues[i] == "true");
        }
        if ("display.deprecatedfields" == settingId) {
          displayDeprecatedfields = (settingValues[i] == "true");
        }
      }
      if (datadict != null) {
        var dbdict = $(filename).dbdict();
        var descriptor = $("#dbdictService").getDescriptorMeta(dbdict["field"]);
        var allFields = dbdict["field"];
        var datadictFields = datadict["fields"];
        var datadictCaptions = datadict["captions"];
        var sysFieldTypes = datadict["sysFieldType"];
        for (var j = 0; j < typeArray.length; j++) {
          checkFields(descriptor.childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, typeArray[j]);
        }
      }

      if (fields.length > 0) {
        fields = _.sortBy(fields, "disp");
      }

      return fields;
    },
    /**
     * This function is used to retrieve field name and caption.
     * @param  {string}
     *          filename - the file name.
     * @return {Object} Array contains field names and captions.
     */
     getAvailableFields: function(filename) {
      var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
      var ret = [[],[]];
      if (datadict != null) {
        var fields = datadict.fields;
        var captions = datadict.captions;
        var avails = datadict.avail;
        var invisibles = datadict.invisible;
        var sysFieldTypes = datadict.sysFieldType;
        var length = system.functions.lng(fields);
        for (var i = 0; i< length; i++) {
          if (avails[i] != false && invisibles[i] != true && sysFieldTypes[i] != 4) {
            ret[0].push(fields[i]);
            ret[1].push(captions[i]);
          }
        }
      }
      return ret;
    },
    /**
     * This function is used to retrieve display vlaue, if this field has associated global list.
     * @param  {SCFile} record the actual record.
     * @param  {field} field  name of the field to fetch the acutal value.
     * @return {String}        the display value, or, actual value if missing associated global list.
     */
    displayValue: function(record, field) {
      try {
        var fileName = filename(record);
        var value = record[field];
        var query = 'name="' + fileName + '"';
        var datadict = $("datadict").select(query).uniqueResult();
        if (!datadict || system.functions.index(field, datadict.fields)<=0) return value;

        var globalListName = datadict.globallist[system.functions.index(field, datadict.fields) - 1];
        if (!globalListName || globalListName === "" || globalListName === " ") return value;

        var globallist = $("globallists").select('name="' + globalListName + '"').uniqueResult();
        if (!globallist) return value;

        var dispVar = globallist["display.variable"];
        var valuVar = globallist["list.variable"];
        if (!dispVar || dispVar === "" || !valuVar || valuVar === "") return value;

        var returnValue = vars[dispVar][system.functions.index(value, vars[valuVar]) - 1];
        return returnValue ? returnValue : value;

      } catch (e) {
        print(e);
        return value;
      }
    },
    
    getDisplayField: function(table) {
	   	var ret = "";
    	var datadict = $("datadict").select('name="' + table + '"').uniqueResult();
    	
    	if (datadict && datadict['display.field']) {
    		ret = datadict['display.field'];
    	}
    	return ret;
    }

  };
});

function getClass() {
  return DatadictService;
}