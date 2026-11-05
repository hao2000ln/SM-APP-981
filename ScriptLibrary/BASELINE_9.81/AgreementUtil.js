var $ = lib.c.$;
var _ = lib.Underscore.require();

var _syseval = funcs.evaluate;
var _fduplicate = funcs.fduplicate;
var _tod = funcs.tod;
var _type = funcs.type;
var _str = funcs.str;
var _lng = funcs.lng;
var _denull = funcs.denull;
var _month = funcs.month;
var _year = funcs.year;
var _filename = funcs.filename;

var toJsArray = lib.ArrayUtil.toJsArray;
var contains  = lib.ArrayUtil.contains;
var addAllWithoutDuplicate = lib.ArrayUtil.addAllWithoutDuplicate;

// check two scArray whether there are equal
function compareArray(arrDatum1, arrDatum2) {
    var jsArray1 = lib.ArrayUtil.toJsArray(arrDatum1);
    var jsArray2 = lib.ArrayUtil.toJsArray(arrDatum2);
    var jsArray11 = lib.ArrayUtil.removeDuplicateEmptyElement(jsArray1);
    var jsArray22 = lib.ArrayUtil.removeDuplicateEmptyElement(jsArray2);
    if (jsArray11.sort().toString() == jsArray22.sort().toString()) {
        return true;
    } else {
        return false;
    }
}

/**
 * This function is called by RAD us.save.relation, while determine the message strings.
 * @param  {String} type the type of screlationtype record
 */
function getTypeString(type) {
    if (type === " " || type === null) {
    	type = "sla";
    }
    if (type === "ola") {
    	return funcs.scmsg(50, "slm");
    }
    if (type === "uc") {
    	return funcs.scmsg(51, "slm");
    }
    if (type === "sla") {
    	return funcs.scmsg(52, "slm");
    }
	if (type === "kmdocument") {
		return funcs.scmsg(2302, "us");
	}
}

/**
 *  build global list  against agreement display category
 *  @author    Neil Yu
 *
 */
function buildList4DisplayCat() {
    var slmCats = vars.$G_slmCategories ? toJsArray(vars.$G_slmCategories) : [];
    var slmCatsLocl = vars.$G_slmCategories_local ? toJsArray(vars.$G_slmCategories_local) : slmCats;
    slmCats.push("slr");
    slmCatsLocl.push(funcs.scmsg("sla", "local:slmCategory"));
    var index = lib.ArrayUtil.indexOf(slmCats, "sla");
    if (index >= 0) {
    	slmCatsLocl[index] = funcs.scmsg("slr", "local:slmCategory");
    }
    vars.$G_slmDisplayCategories = slmCats;
    vars.$G_slmDisplayCategories_local = slmCatsLocl;
}


/**
 *  build global list of agreement against different category and type
 *  @author    Neil Yu
 *
 */
function buildList4Agreement(condition) {
    if (condition==null) {condition="true";}

    vars["$G.ola.ids"] = [];
    vars["$G.ola.names"] = [];
    vars["$G.uc.ids"] = [];
    vars["$G.uc.names"] = [];
    vars["$G.cust.sla.ids"] = [];
    vars["$G.cust.sla.names"] = [];
    vars["$G.sevc.sla.ids"] = [];
    vars["$G.sevc.sla.names"] = [];
    
//    var filebak = null;
//    if (!$.isEmpty(vars["$L.file"])&&typeof(vars["$L.file"]) == "object") {
//        filebak = new SCFile();
//        _fduplicate(filebak, vars["$L.file"]);
//    }

    try {
        $("sla", SCFILE_READONLY).setFields(["category", "type", "agreement.id", "title"]).select(_str(condition)).iterate(function(sla) {
        
//            vars["$L.file"] = sla;

//            if (evaluate(condition)) {
                var category = sla.category;
                var type = sla.type;
                var agreementId = sla.agreement_id;
                var title = sla.title;
    
                if (category == "ola") {
                    vars["$G.ola.ids"].push(agreementId);
                    vars["$G.ola.names"].push(title);
                }
                else if (category == "uc") {
                    vars["$G.uc.ids"].push(agreementId);
                    vars["$G.uc.names"].push(title);
                }
                else if (category == "sla") {
                    if (type == "customer") {
                        vars["$G.cust.sla.ids"].push(agreementId);
                        vars["$G.cust.sla.names"].push(title);
                    }
                    else if (type == "service") {
                        vars["$G.sevc.sla.ids"].push(agreementId);
                        vars["$G.sevc.sla.names"].push(title);
                    }
                }
//            }
        });
    } catch (e) {
        print(e.toString());
    }
//    finally {
//        vars["$L.file"] = filebak;
//    }

}

/**
 *  check agreement is effective or not
 *  @author    Neil Yu
 *  @param    {number}          id           -agreement  id
 *  @return   {boolean}         true         -effective agreement
 *                              false        -ineffective agreement
 */
function checkValidAgreementByID(id) {
    var filebak = null;
    if (id==null) {
    	return false;
    }
    if (!$.isEmpty(vars["$L.file"])&&typeof(vars["$L.file"]) == "object") {
        filebak = new SCFile();
        _fduplicate(filebak, vars["$L.file"]);
    }
    try {
        var agreement = $("sla", SCFILE_READONLY).select("agreement.id=" + id).uniqueResult();
        if (agreement != null) {

            vars["$L.file"] = agreement;
            var condition = vars.$G_sla_environment["effective.condition"];
            if (evaluate(condition)) {
                return true;
            }

        }
        return false;
    } catch (e) {
        print(e.toString());
        return false;
    } finally {
        vars["$L.file"] = filebak;
    }

}


/**
 *  check agreement is effective or not
 *  @author    Neil Yu
 *  @param    {record}          agreement    -agreement  record
 *  @return   {boolean}         true         -effective agreement
 *                              false        -ineffective agreement
 */
function checkValidAgreementByRecord(agreement) {
    var filebak = null;
    if (!$.isEmpty(vars["$L.file"])&&typeof(vars["$L.file"]) == "object") {
        filebak = new SCFile();
        _fduplicate(filebak, vars["$L.file"]);
    }

    try {
        vars["$L.file"] = agreement;
        var condition = vars.$G_sla_environment["effective.condition"];
        if (evaluate(condition)) {
            return true;
        }
        return false;
    } catch (e) {
        print(e.toString());
        return false;
    } finally {

        vars["$L.file"] = filebak;
    }

}


/**
 *  validate each agreement in the list which is effective or not
 *  @author    Neil Yu
 *  @param    {array of number}         list   -agreement  ids
 *  @return   {array of number}         null   -not valid agreement found
 *                                             -one or more agreements which are effective
 */
function validateAgreementList(list) {

    var validAgreementList = [];
    var lng = _.arrayLen(list);
    var i;
    for (i = 0; i < lng; i++) {
        if (checkValidAgreementByID(list[i])) {
            validAgreementList.push(list[i]);
        }
    }

    return validAgreementList;
}

/**
 *get id list of agreement which is effective against specify category
 *@author  Neil Yu
 *@param   {string }     category        "sla"              - Service Level Agreements
 *                                       "ola"              - Operational  Level Agreements
 *                                       "uc"               - Underpinning Contracts
 *@param   {boolean}     checkEffective  true               - check agreement is effective or not
 *                                       false              - ignore effective checking
 *@return  {array of number}                                - agreement  ids
 */
function getAgreementIDs(checkEffective, category) {

    var sql = "true";
    var agreementList = [];
    var filebak = null;
    if (!$.isEmpty(vars["$L.file"])&&typeof(vars["$L.file"]) == "object") {
        filebak = new SCFile();
        _fduplicate(filebak, vars["$L.file"]);
    }
    if (category != null && category != "") {
        sql = "category=\"" + category + "\"";
    }

    var condition = vars.$G_sla_environment["effective.condition"];
    
    try {
        $("sla", SCFILE_READONLY).select(sql).iterate(function(record) {
            if (checkEffective) {
                vars["$L.file"] = record;

                if (evaluate(condition)) {
                    agreementList.push(record["agreement.id"]);
                }

            } else {
                agreementList.push(record["agreement.id"]);
            }

        });
    } catch (e) {

        print(e.toString());

    } finally {
        vars["$L.file"] = filebak;
    }

    return agreementList;
}

/**
 *get id list of SLA which is effective against specify type
 *@author  Neil Yu
 *@param   {string }     type                   "customer"              - customer sla
 *                                              "service"               - service   sla
 *@param   {boolean}     checkEffective         true                    - check agreement is effective or not
 *                                              false                   - ignore effective checking
 *@return  {array of number}                                            - agreement  ids
 */
function getSLAIDs(checkEffective, type)
{
    var sql = "category=\"sla\"";
    var agreementList = [];
    var filebak = null;
    if (!$.isEmpty(vars["$L.file"])&&typeof(vars["$L.file"]) == "object") {
        filebak = new SCFile();
        _fduplicate(filebak, vars["$L.file"]);
    }
    if (type != null && type != "") {
        sql += " and type=\"" + type + "\"";
    }

    var condition = vars.$G_sla_environment["effective.condition"];
    
    try {
        $("sla", SCFILE_READONLY).select(sql).iterate(function(record) {
            if (checkEffective) {
                vars["$L.file"] = record;

                if (evaluate(condition)) {
                    agreementList.push(record["agreement.id"]);
                }

            } else {
                agreementList.push(record["agreement.id"]);
            }

        });
    } catch (e) {
        print(e.toString());
    } finally {
        vars["$L.file"] = filebak;
    }

    return agreementList;
}

/**
 * evaluate the specify condition against current agreement
 *
 *@author   Neil Yu
 *@param   {operator}     condition           - agreement effective condition
 *
 *@return  {boolean}      true                - effective agreement
 *                        false               - infective agreement
 */
function evaluate(condition) {
    if ($.isEmpty(condition)) {
    	return true;
    }

    return _syseval(condition);
}

/**
 *get id list of OLA or UC which is effective against assignment group
 *
 *@author  Neil Yu
 *@param   {string }     asgnNm                                         - assignment group name
 *@param   {boolean}     checkEffective         true                    - check agreement is effective or not
 *                                              false                   - ignore effective checking
 *@return  {array of number}                                            - agreement  ids
 */
function getAgreementIDsByAssignment(checkEffective, asgnNm, asgnTbl) {

    var olaids = [];
    var defaultOlaId=vars.$G_sla_environment["default.ola"];
    var ids = [];
    var qryAsgn = ""; // the query of search assignment
    var extqry = "";
    var inqry = "";
    var filebak = null;
    var externalGroups = []; // external assignment groups
    var supportGroups = []; // internal assignment groups
    
    if ($.isEmpty(asgnNm)||$.isEmpty(asgnTbl)) {
        if (checkValidAgreementByID(defaultOlaId)) {
            ids.push(defaultOlaId);
        }
        return ids;
    }

    if (!$.isEmpty(vars["$L.file"]) && typeof(vars["$L.file"]) == "object") {
        filebak = new SCFile();
        _fduplicate(filebak, vars["$L.file"]);
    }

    if (_type(asgnNm) == 8) {
        qryAsgn = "name isin " + _str(asgnNm);
    } else {
        qryAsgn = "name=\"" + asgnNm + "\"";
    }

    $(asgnTbl, SCFILE_READONLY).setFields(["name","is.external.group"]).select(qryAsgn).iterate(function(record) {
        if (record["is.external.group"]) {
            externalGroups.push(record["name"]);
        } else {
            supportGroups.push(record["name"]);
        }
    });

    var condition = vars.$G_sla_environment["effective.condition"];
        
    try {
        if (!$.isEmpty(externalGroups)) {
            extqry = "external.support.groups isin " + _str(externalGroups) + " and category=\"uc\"";

            $("sla", SCFILE_READONLY).select(extqry).iterate(function(record) {

                if (checkEffective) {
                    vars["$L.file"] = record;

                    if (evaluate(condition) && record["start"] <= _tod() && record["expiration"] >= _tod()) {
                        ids.push(record["agreement.id"]);
                    }

                } else {
                    ids.push(record["agreement.id"]);
                }

            });
        }

        if (!$.isEmpty(supportGroups)) {
            inqry = "support.groups isin " + _str(supportGroups) + " and category=\"ola\"";

            $("sla", SCFILE_READONLY).select(inqry).iterate(function(record) {

                if (checkEffective) {
                    vars["$L.file"] = record;

                    if (evaluate(condition) && record["start"] <= _tod() && record["expiration"] >= _tod()) {
                        olaids.push(record["agreement.id"]);
                        ids.push(record["agreement.id"]);
                    }

                } else {
                    olaids.push(record["agreement.id"]);
                    ids.push(record["agreement.id"]);
                }

            });
        }
    } catch (e) {
        print(e.toString());

    } finally {
 
        if ($.isEmpty(olaids)) {

            if (checkValidAgreementByID(defaultOlaId)) {
            	ids.push(defaultOlaId);
            }
        }

        vars["$L.file"] = filebak;
    }

    return ids;
}


/**
 * This function is used to populate the attribute variables used for assignment group to display related agreement records.
 * @author  Gary Gao
 * @param   {string }     asgnNm                                         - assignment group name
 * @return
 * @type Void
 */
function populateRelatedAgreementInfo(asgnNm) {
    vars.$relatedId = [];
    vars.$relatedTitle = [];
    vars.$relatedCategory = [];
    vars.$relatedPhase = [];

    var assignment = $("assignment", SCFILE_READONLY).setFields(["is.external.group"]).select("name=\"" + asgnNm + "\"").uniqueResult();
    if (assignment == null) {
    	return;
    }
    
    var qry = "";
    var filebak = vars["$L.file"];
    if (assignment["is.external.group"]) {
        qry = "external.support.groups isin {\"" + asgnNm + "\"} and category=\"uc\"";
    } else {
        qry = "support.groups isin {\"" + asgnNm + "\"} and category=\"ola\"";
    }
    try {
        $("sla", SCFILE_READONLY).select(qry).iterate(function(record) {

            vars.$relatedId.push(record["agreement.id"]);
            vars.$relatedTitle.push(record["title"]);
            vars.$relatedCategory.push(record["category"]);
            vars.$relatedPhase.push(record["current.phase"]);
        });
    } catch (e) {
        print(e.toString());
    }
}

function populateRelatedInfo(id) {
  var idFieldNameMap = {
    incidents: "incident.id",
    cm3r: "number",
    rootcause: "id",
    knownerror: "id",
    probsummary: "number",
    ocmq: "number",
    request: "number",
    requestTask: "number",
    sla:"agreement.id",
    kmdocument: "id"
  };
  // define the column attribute name for differnt record type
  var statusFieldMap = {
    incidents: "open",
    cm3r: "current_phase",
    rootcause: "rcStatus",
    knownerror: "rcStatus",
    probsummary: "problem_status",
    ocmq: "status",
    request: "status",
    requestTask: "status",
    sla:"display.category",// since agreement has status field, use field "display.category" instead of field "status"
    kmdocument: "status"
  };
  var titleFieldMap = {
    incidents: "title",
    cm3r: "brief_description",
    rootcause: "brief_description",
    knownerror: "brief_description",
    probsummary: "brief_description",
    ocmq: "brief_description",
    request: "brief_description",
    requestTask: "title",
    sla:"title",
    kmdocument: "title"
  };
  var relation = new SCFile("screlation", SCFILE_READONLY);
  // column from the related record
  vars.$SLArelatedTitle = [];
  vars.$SLArelatedStatus = [];
  vars.$SLArelatedPhase = [];

  // column from screlation table
  vars.$SLArelatedId = [];
  vars.$SLArelatedType = [];
  vars.$SLArelatedFilename = [];

  var sql = "source=\"" + id + "\" and depend.filename=\"kmdocument\"";
  var rc = relation.doSelect(sql);

  while (rc == RC_SUCCESS) {

    // ignore screlation type of "Master to Child"
    if (relation.type == "Master to Child") {
      rc = relation.getNext();
      continue;
    }
	
	var dependFileName = relation.depend_filename;

    // populate fields in screlation table
    vars.$SLArelatedId.push(relation.depend);

    var relationType = relation.type;
    var screlationtype = $("screlationtype").select(
            'value="' + relationType + '" and source.file="' + "sla"
                    + '"  and target.file="' + "kmdocument" + '"').uniqueResult();
    if (screlationtype != null) {
      var tag = lib.RelationUtil.getValueTag(screlationtype);
      var typeStr = funcs.scmsg(tag, "local:screlationtype");
      if (typeStr.indexOf("Could not be found") == -1) {
        relationType = typeStr;
      }
    }
    vars.$SLArelatedType.push(relationType);

    vars.$SLArelatedFilename.push(dependFileName);

    var dependFile = new SCFile(dependFileName, SCFILE_READONLY);
    var relatedSql = idFieldNameMap[dependFileName] + "=\"" + relation.depend + "\"";
    var relatedRC = dependFile.doSelect(relatedSql);
    if (relatedRC == RC_SUCCESS) {
      // populate fields from related record
      vars.$SLArelatedTitle.push(dependFile[titleFieldMap[dependFileName]]);
      vars.$SLArelatedStatus.push(dependFile[statusFieldMap[dependFileName]]);
      vars.$SLArelatedPhase.push(dependFile.current_phase);
    }
    rc = relation.getNext();
  }

  vars.$source = id;
  vars.$sourceFilename = funcs.filename(vars.$L_file);
  vars.$hasRecords = funcs.nullsub(funcs.lng(vars.$relatedTitle), 0) > 0;
}


/**
 * This function is used to check whether the fields dataType in slamodulecontrol table is valid or not.
 * @author  Gary Gao
 * @param   {record }    record  	- slamodulecontrol  			 		
 * @return  
 * @type  	{Bollean}	 true 		- Field(s) in record is Valid Data Type
 *						 false		- Field(s) in record is NOT Valid Data Type
 */
function checkFieldTypeValid(record){
	var fileName = record["table.name"];
	var dbdictService=$("#dbdictService");
	var dataService=$("#dataService");
	var dbdict = $(fileName).dbdict();
	var descriptorSourceMeta = dbdictService.getDescriptorMeta(dbdict["field"]);
	
	var results = [];
	var checkFields = record["ci.fields"];
	var sourceType;
	var cilength = _lng(_denull(checkFields));
	
	if (cilength >0){
		var i;
		var length = _lng(checkFields);
		for (i =0; i<length; i++){
			if (!$.isEmpty(checkFields[i])){
				sourceType = getFieldTypeByPath(checkFields[i], descriptorSourceMeta);
				if (sourceType.type==2){
					results.push(true);
				}
				else if (sourceType.type ==8){
					if (getFieldChildTypes(checkFields[i], descriptorSourceMeta) ==2){
						results.push(true);
					}
					else{
						results.push(false);
					}
				}
				else{
					results.push(false);
				}
			}
		}	
		if (contains(results, false)){return false;}
		else {return true;}
	}
	return true;
}


/*********************Functions Copied from ScriptLibrary 'Migration'  Start *******************/
function getFieldTypeByPath(path, meta) {
	var dbdictService=$("#dbdictService");
	var dataService=$("#dataService");
    var fieldMeta = dbdictService.getFieldMeta(path, meta, false);
    var compoundTypeDesc = null;
    if (fieldMeta.childs != null) {
        compoundTypeDesc = getCompoundType(fieldMeta);
        compoundTypeDesc = JSON.stringify(compoundTypeDesc);
    }

    return {
        type: fieldMeta.field.type,
        compoundTypeDesc: compoundTypeDesc
    };
}

function getCompoundType(fieldMeta) //{me:8, childs:[{me:1}]}
{
	var dbdictService=$("#dbdictService");
	var dataService=$("#dataService");
	
    var typeDesc = {};
    typeDesc.me = fieldMeta.field.type;
    if (fieldMeta.childs != null && fieldMeta.childs.length > 0) {
    	typeDesc.childs = [];
    }
    var i;
    for (i = 0; i < fieldMeta.childs.length; i++) {
        typeDesc.childs.push(getCompoundType(fieldMeta.childs[i]));
    }
    return typeDesc;
}


function getFieldChildTypes(fieldName, mate){
	var dbdictService=$("#dbdictService");
	var dataService=$("#dataService");
	
	if(mate==null){
	mate=descriptorTargetMeta;
	}
	var field=dbdictService.getFieldMeta(fieldName,mate, false);
	if(field!=null){
	 var fields=[];
	 var i;
	 for(i=0;i<field.childs.length;i++){
	 	fields.push(field.childs[i].field["type"]);
	 }
	 return fields.join(",");
	}else{
	 return null;
	}
}
/*********************Functions Copied from ScriptLibrary 'Migration'  End *******************/
