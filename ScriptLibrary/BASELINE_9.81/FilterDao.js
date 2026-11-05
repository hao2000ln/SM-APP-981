//Calendar Model
//var log = getLog('FilterDAO');

/**
 * get all filter names
 * @return {FilterInfo[]} an array includes all filters' name.
 */
function getFilterInfos(){
  var filters = [];
  var operator = funcs.operator();
  var filter = new SCFile("calendarFilter", SCFILE_READONLY);
  var query = "public=true or (public=false and operator=\""+ operator +"\")";
  filter.setOrderBy(["name"], [SCFILE_ASC]);
  var ret = filter.doSelect(query);
  while (ret == RC_SUCCESS)
  {
    var f_instance = {};
    f_instance.filterId = filter.id;
    f_instance.name = filter.name;
    f_instance["general"] = filter["public"];
    f_instance["category"] = filter["category"];
    f_instance["description"] = filter["description"];
    f_instance["userRight"] = "";//have to implement this with user right
    filters.push(f_instance);
    ret = filter.getNext();
  }
  return filters;
}

/**
 * get default filter of current user
 * @return {Filter}
 */
function getDefaultFilter(){
  var returnFilter = {};
  var operator = funcs.operator();
  var filter = new SCFile("calendarFilter", SCFILE_READONLY);
  var query = "public=true or (public=false and operator=\""+ operator +"\")";
  var ret = filter.doSelect(query);
  if (ret == RC_SUCCESS)
  {
    returnFilter = lib.CalendarFilterUtil.convertCalendarFilter(filter);
  }
  else
  {
    returnFilter.id="";
    returnFilter.info={};
    returnFilter.groups=[];
    returnFilter.info.category="";
    returnFilter.info.name="";
    returnFilter.info.description="";
    returnFilter.info.general=true;
  }
  return returnFilter;
}

/**
 * get filter by id
 * @param {String} filterId
 * @return {Filter}
 */
function getFilter(filterId){
  var returnFilter = null;
  var filter = new SCFile("calendarFilter", SCFILE_READONLY);
  var query = "id=\""+ filterId +"\"";
  var ret = filter.doSelect(query);
  if (ret == RC_SUCCESS)
  {
    returnFilter = lib.CalendarFilterUtil.convertCalendarFilter(filter);
  }
  else
  {
    returnFilter.id="";
    returnFilter.info={};
    returnFilter.groups=[];
    returnFilter.info.category="";
    returnFilter.info.name="";
    returnFilter.info.description="";
    returnFilter.info.general=true;
  }
  return returnFilter;
}

/**
 * get filter by a query string
 * @param {String} query
 * @return {Filter}
 */
function getFilterByQuery(query){
  return lib.CalendarFilterUtil.convertPredefinedQuery(query);
}

/**
 * get values for a filter field
 * @param {String} fieldName
 * @param {Number} start
 * @param {Number} size
 * @param {String} queryString
 * @param {Boolean} needCount
 * @return {FieldValues}
 */
function queryFieldValues(fieldName, start, size, queryString, needCount)
{
  if ( !fieldName || fieldName=="" ) {
    return {};
  }
  if ( !size ) {
    size = 0;
  }
  var filterField = new SCFile("calendarFilterEditForm");
  var query = "fieldId=\""+fieldName+"\" and active=true";
  var ret = filterField.doSelect(query);
  if (ret!=RC_SUCCESS) {
    return {};
  }
  else if ( filterField["type"]=="TEXT_PICKER" || filterField["type"]=="DATE_PICKER") {
    return {};
  }
  return getPagingFieldValues(filterField, start, size, queryString, needCount);
}

function getPagingFieldValues(filterField, start, size, filterValue, needCount)
{
  var retValue = {};
  var valueArray = [];
  var count = 0;
  var valueType = filterField["dataSource"];
  var infos = {};
  infos.values = [];
  infos.labels = [];
  var selfdefValues = filterField["uservalues"];
  var selfdefLabels = filterField["userlabels"];
  var valuesCount = funcs.lng(selfdefValues);
  var labelsCount = funcs.lng(selfdefLabels);
  var tempCount = Math.max( valuesCount , labelsCount);
  var x;
  for (x=0; x < tempCount; x++)
  {
    var value = "";
    var label = "";
    if ( x <= valuesCount)
    {
      value = lib.CalendarUtilities.getEval(selfdefValues[x]);
      if (value == null) {
        value = "";
      }
    }
    else 
    {
      value = selfdefLabels[x];
    }
    if ( x <= labelsCount )
    {
      if (selfdefLabels[x])
      {
        label = lib.CalendarUtilities.getEval(selfdefLabels[x]);
        if (label == null) {
          label = "";
        }
      }
    }
    else 
    {
      label = value;
    }
    if (value == "" && label!="")
    {
      value = label;
    }
    else if (value != "" && label == "" )
    {
      label = value;
    }
    if (value!="" && label!="")
    {
      if (value.toLowerCase()=="null") {
        value = "null";
      } 
      infos.values.push(value);
      infos.labels.push(label);
    }
  }
  if (valueType=="gl" && filterField["globalListName"] && filterField["globalListName"]!="") 
  {
    infos = lib.CalendarUtilities.getValuesFromGL(filterField["globalListName"], infos);
  }
  else if (valueType=="rad" && filterField["radExp"] && filterField["radExp"]!="")
  {
    infos = lib.CalendarUtilities.getValuesFromRADExp(filterField["radExp"], infos);
  } 
  else if (valueType=="query")
  {
    retValue = lib.CalendarUtilities.getFiledValuesFromQuery( filterField["valueField"], 
                                                           filterField["displayField"], 
                                                           filterField["queryTable"], 
                                                           filterField["query"],
                                                           filterField["orderField"],
                                                           filterValue, start, size , infos );
    return retValue;
  }
  
  if (!infos || infos == {} ) {
    return {};
  }
  var values = [];
  var labels = [];
  if (filterValue && filterValue!="")
  {   
      filterValue = filterValue.replace(/(\\)/g,"\\\\");
	  var tmpreg = lib.CalendarFilterUtil.convertQueryToRegexp(filterValue);
	  var tmpvalues = infos.values;
	  var len = funcs.lng(tmpvalues);
	  var tmplabels = infos.labels;
	  var j;
	  for (j = 0; j < len; j++)
	  {
	     var tmpText = "";
	     if (tmplabels[j] && tmplabels[j]!="") {
	       tmpText = tmplabels[j];
	     }
	     else {
	       tmpText = tmpvalues[j];
	     }
	       
	     var ret = tmpText.match(tmpreg);
	     
	     if (ret)
	     {
	       values.push(tmpvalues[j]);
	       labels.push(tmplabels[j]);
	     }
	  }
  }
  else 
  {
    values = infos.values;
    labels = infos.labels;
  }
  
  retValue.valueCount = funcs.lng(values);
  count =  funcs.lng(values);
  if (size==0) 
  {
    start = 0;
  }
  else 
  {
    count = start + Math.min(size , count-start);
  }
  var i;
  for (i = start; i < count; i++)
  {
	var valueObj = {};
	valueObj.value = values[i];
	if (labels[i]) {
	  valueObj.text = labels[i];
	}
	else {
	  valueObj.text = values[i];
	}    
	valueArray.push(valueObj);
  }
  retValue.values = valueArray;
  return retValue;
}

/**
 * add an unsaved filter
 * @param {Filter} filter
 * @return {Boolean} whether create successfully
 */
function createFilter(filter) {
  var retValue = null;
  if (filter.info.general && lib.security.getRights("Calendar Administration","AddPublicFilter")!="true")
  {
  	return retValue;
  }
  var filtertosave = new SCFile("calendarFilter");
  filtertosave["id"] = lib.CalendarFilterUtil.newId();
  filtertosave["category"] = filter.info.category;
  filtertosave["name"] = filter.info.name;
  filtertosave["description"] = filter.info.description;
  filtertosave["active"] = true;
  filtertosave["public"] = filter.info.general;
  if (!filter["general"])
  {
    filtertosave.operator = funcs.operator();
  }
  var i;
  var ilength = funcs.lng(filter["groups"]);
  for (i = 0 ; i < ilength; i++)
  {
    var group = filter["groups"][i];
    var grouptosave = filtertosave["groups"][i];                 
    grouptosave.virtualgroup = group["virtual"] ? true : false;
    var j;
    var jlength = funcs.lng(group["fields"]);
    for (j = 0; j < jlength; j++)
    {
      var field = group["fields"][j];
      var fieldtosave = grouptosave.filterfields[j];
      fieldtosave.fieldname = field["field"];
      fieldtosave.oper = field["oper"];
      fieldtosave.panel = field["tab"];
      fieldtosave.values = [];
      var k;
      var klength = funcs.lng(field["values"]);
      for (k = 0 ; k < klength; k++)
      { 
        var value = field["values"][k];
        fieldtosave.values[k].value = value.value;
        fieldtosave.values[k].text = value.text;
      }
    }
  }
  retValue = filtertosave.doSave();
  if (retValue==RC_SUCCESS)
  {
    return filtertosave.id;
  }
  return null;
}

/**
 * update a saved filter
 * @param {Filter} filter
 * @return {Boolean} whether update successfully
 */
function updateFilter(filter) {
  var retValue = null;
  var filtertosave = new SCFile("calendarFilter");
  if (filter["id"]!=null && filter["id"]!="" )
  {
    var oldfilter = new SCFile("calendarFilter");
    var query = "id=\""+ filter["id"] +"\"";
    var ret = oldfilter.doSelect(query);
    if (ret == RC_SUCCESS)
    {
      if (oldfilter["public"] )
      {
         if (lib.security.getRights("Calendar Administration","UpdatePublicFilter")!="true")
		 {
		  	return null;
		 }
      }
      else if (filter.info.general )
      {
        if (lib.security.getRights("Calendar Administration","AddPublicFilter")!="true")
		 {
		  	return null;
		 }
      }
      ret = oldfilter.doDelete();
      if ( ret == RC_SUCCESS )
      {
        filtertosave["id"] = filter["id"];
      }
      else 
      {
        return null;
      }
    }
    else
    {
      return null;
    }
  }
  else
  {
    filtertosave["id"] = lib.CalendarFilterUtil.newId();
  }
  filtertosave["category"] = filter.info.category;
  filtertosave["name"] = filter.info.name;
  filtertosave["description"] = filter.info.description;
  filtertosave["active"] = true;
  filtertosave["public"] = filter.info.general;
  if (!filter["general"])
  {
    filtertosave.operator = funcs.operator();
  }
  var i;
  var ilength = funcs.lng(filter["groups"]);
  for (i = 0 ; i < ilength; i++)
  {
    var group = filter["groups"][i];
    var grouptosave = filtertosave["groups"][i];                 
    grouptosave.virtualgroup = group["virtual"] ? true : false;
    var j;
    var jlength = funcs.lng(group["fields"]);
    for (j = 0; j < jlength; j++)
    {
      var field = group["fields"][j];
      var fieldtosave = grouptosave.filterfields[j];
      fieldtosave.fieldname = field["field"];
      fieldtosave.oper = field["oper"];
      fieldtosave.panel = field["tab"];
      fieldtosave.values = [];
      var k;
      var klength = funcs.lng(field["values"]);
      for (k = 0 ; k < klength; k++)
      { 
        var value = field["values"][k];
        fieldtosave.values[k].value = value.value;
        fieldtosave.values[k].text = value.text;
      }
    }
  }
  retValue = filtertosave.doSave();
  if (retValue==RC_SUCCESS)
  {
    return filtertosave.id;
  }
  return null;
}

/**
 * delete a saved filter
 * @param {String} filterId
 * @return {Boolean} whether delete successfully
 */
function deleteFilter(filterId) {
  var oldfilter = new SCFile("calendarFilter");
  var query = "id=\""+ filterId +"\"";
  var ret = oldfilter.doSelect(query);
  if (ret == RC_SUCCESS)
  {
    if (oldfilter["public"] && lib.security.getRights("Calendar Administration","DeletePublicFilter")!="true")
    {
       return false;
    }
    ret = oldfilter.doDelete();
    return true;
  }
  return false;
}

/**
 * get a filter form with all groups' fields
 * @return {FilterField[]}
 */
function queryFields(){
  var fields = [];
  var calendarFilterEditForm = new SCFile("calendarFilterEditForm", SCFILE_READONLY);
  calendarFilterEditForm.setOrderBy(["order"], [SCFILE_ASC]);
  var query = "active=true and panel=\"common\"";
  var fieldObj;
  var ret = calendarFilterEditForm.doSelect(query);
  while (ret == RC_SUCCESS)
  {
    fieldObj = {};
    fieldObj.field = calendarFilterEditForm.fieldId;
    fieldObj.label = lib.CalendarFilterUtil.localizedLable(calendarFilterEditForm.id , "calendarFilterEditForm" ,calendarFilterEditForm.alternateLabel); 
    fieldObj.type = calendarFilterEditForm.type;
    fieldObj.multiSelect = calendarFilterEditForm.multiSelectable ? true : false ;
    fieldObj.tab = lib.CalendarFilterUtil.getFieldTabname(calendarFilterEditForm.panel);
    fields.push(fieldObj);
    ret = calendarFilterEditForm.getNext();
  }
  
  calendarFilterEditForm = new SCFile("calendarFilterEditForm", SCFILE_READONLY);
  calendarFilterEditForm.setOrderBy(["order"], [SCFILE_ASC]);
  query = "active=true and panel~=\"common\"";
  ret = calendarFilterEditForm.doSelect(query);
  while (ret == RC_SUCCESS)
  {
    fieldObj = {};
    fieldObj.field = calendarFilterEditForm.fieldId;
    fieldObj.label = lib.CalendarFilterUtil.localizedLable(calendarFilterEditForm.id , "calendarFilterEditForm" ,calendarFilterEditForm.alternateLabel);
    fieldObj.type = calendarFilterEditForm.type;
    fieldObj.multiSelect = calendarFilterEditForm.multiSelectable ? true : false ;
    fieldObj.tab = lib.CalendarFilterUtil.getFieldTabname(calendarFilterEditForm.panel);
    fields.push(fieldObj);
    ret = calendarFilterEditForm.getNext();
  }
  return fields;
}

//--------------------- add for ide -------------------------
lib.FilterDao = {
  "getFilterInfos": getFilterInfos,
  "getDefaultFilter": getDefaultFilter,
  "getFilter": getFilter,
  "getFilterByQuery": getFilterByQuery,
  "queryFieldValues": queryFieldValues,
  "createFilter": createFilter,
  "updateFilter": updateFilter,
  "deleteFilter": deleteFilter,
  "queryFields": queryFields
};