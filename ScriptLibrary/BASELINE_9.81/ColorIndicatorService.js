/**
 * Get color indicator setting
 */
function queryColorIndicator() {
  
  
  
  var f = new SCFile("colorindicatorsetting", SCFILE_READONLY);
  var ret = new Object();
  ret["files"] = new Array();
  var setOrderByRC = f.setOrderBy( ["file", "field"], [SCFILE_ASC, SCFILE_ASC]);
  var fileObj = new Object();
  fileObj["fields"] = new Array();
  var _last = null;
  if (RC_SUCCESS == f.doSelect("not null(field)"))
  {
    var _file = f.file;
    fileObj["name"] = _file;
    _last = _file;
    do
    {
      var fieldObj = new Object();
      fieldObj["name"] = f["field"];
      
      // skip sla.status field
      if(_file=='sla' && f.field=='sla.status') continue;
      
      if (f["apply.to.list"] != null) {
        fieldObj["applyToList"] = f["apply.to.list"];
      }
      if (f["apply.to.detail"] != null) {
        fieldObj["applyToDetail"] = f["apply.to.detail"];
      }
      if (f["apply.to.report"] != null) {
        fieldObj["applyToChart"] = f["apply.to.report"];
      }
      var length = system.functions.lng(f.value);
      var arr = [];
      for (var i=0; i<length; i++) {
        var o = new Object();
        if (f.value[i] == null) {
          continue;
        }
        o["value"] = f.value[i];
        if (f.fgcolor[i] != null) {
          o["foregroundColor"] = f.fgcolor[i];
        }
        if (f.bgcolor[i] != null) {
          o["backgroundColor"] = f.bgcolor[i];
        }
        arr.push(o);
      }
      fieldObj["setting"] = arr;
      _file = f.file;
      if (_file != _last) {
        ret["files"].push(fileObj);
        fileObj = new Object();
        fileObj["name"] = _file;
        fileObj["fields"] = new Array();
        _last = _file;
      }     
      fileObj["fields"].push(fieldObj);
    } while (RC_SUCCESS == f.getNext());
  }
  if (_last != null) {
    ret["files"].push(fileObj);
  }
  
  var slaListStatus = calcSlaStatusField();
  
  if(null!=slaListStatus) {
    for(var k=0;k<ret.files.length;k++) {
      ret.files[k].fields.push(slaListStatus);
    }
  }
  
  // getLog('xxx').info('JSON-COLOR::', rteJSONStringify(ret));
  return ret;
}


function calcSlaStatusField() {
    var item = lib.c.$('!colorindicatorsetting').fields("file", "field", "value", 'bgcolor').find('file="sla" and field="sla.status"').one();
  
    if(item) {
	    var field = {name: '__slaViewField__', applyToList: true, applyToDetail:false, applyToChart:false, setting:[]};
	    
	    var length = funcs.lng(item.value);
	    var arr = [];
	    for (var i=0; i<length; i++) {
	        if (item.value[i] == null) {
	          continue;
	        }
	        var value  = {value: item.value[i], foregroundColor: '#000000', backgroundColor: item.bgcolor[i]};
	        arr.push(value);
	    }
	    field.setting=arr;
	    
	    return field;
  }
  
  return null;
}

/**
 * Get version string for color indicator setting module.
 */
function queryColorVersion() {
 return lib.ComponentVersionService.getVersion("COLOR_INDICATOR_SETTING");
}

/**
 * Refresh version string for color indicator setting module.
 */
function refreshVersion() {
  var f = new SCFile("componentversion");
  var rc = f.doSelect('key="COLOR_INDICATOR_SETTING"');
  if (rc == RC_SUCCESS) {
    f.version = "" + (parseFloat(f.version) + 1);
    f.doSave();
  } else {
    f.key = "COLOR_INDICATOR_SETTING";
    f.version = "1";
    f.doInsert();
  }
}

/**
 * Get color indicator setting
 *
 * @param filename: the file name
 * @param fieldname: the field name
 * @returns {Object}
 */
function queryFieldColor( filename, fieldname )
{
  var ret = [];

  var q = 'file="' + filename + '" and field = "' + fieldname + '" and apply.to.report = true';
  var f = new SCFile("colorindicatorsetting", SCFILE_READONLY);
  var setOrderByRC = f.setOrderBy( ["file", "field"], [SCFILE_ASC, SCFILE_ASC]);

  var rc = f.doSelect(q);
  while( rc == RC_SUCCESS )
  {
      var valueLen = f.value.getSize();

      for (var i=0; i < valueLen ; i++)
      {
        if ( f.value[i] )
        {
          var item ={
            "value"             : f.value[i],
            "backgroundColor" : f.bgcolor[i],
            "foregroundColor"  : f.fgcolor[i],
            "operator"         : "="
          };

          ret.push(item);
        }
      } // for

    rc = f.getNext();
  }

  return (ret && ret.length > 0 ) ? ret : null;
}
