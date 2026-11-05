var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_Interaction_Inbox");

var select = lib.GatewayAPI_RAD._select;
var _count = lib.GatewayAPI_RAD._count;
var queryBuilder = lib.GatewayAPI_RAD._queryBuilder;
var fun = system.functions;
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var tod = lib.GatewayAPI_RAD._tod;
var getDigitAfterDecimal = lib.GatewayAPI_Util.getDigitAfterDecimal;
var getContact = lib.GatewayAPI_Util.getContact;
var count = lib.GatewayAPI_RAD._count;
var fastCount=lib.GatewayAPI_RAD.fastCount;
var getMsg = lib.GatewayAPI_Util.getMessage;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var hasNewActivity = lib.GatewayAPI_WSInterface_Interaction_Info.hasNewActivity;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var currencyConversionRate;
var sortByNames = ["Cost", "Title", "InteractionID", "Status", "ApprovalStatus", "RequestType", "OpenTime"];
var sortByFields = ["sv.cost", "title", "incident.id", "open", "approval.status", "requesttype", "open.time"];
var fileName = "incidents";
var defaultCurrency; // global variable


function queryInteraction() {
  var startDate = new Date();
  var oper;
  var operName = vars.$L_file["loginName"];
  if (operName != null) {
    oper = select("operator", "name=\"" + operName + "\"");
    if (oper == null) { //The interaction owner is not valid.
      setExitType(BAD_VALIDATION_EXIT);
      setErrorMsg(getMsg(125));
      return;
    }
  } else {
    oper = getCurrentOperator();
    vars.$L_file["loginName"] = oper['name'];
  }

  defaultCurrency = oper.display_currency_code || vars.$G_root_currency;

  var requestType = system.functions.tolower(vars.$L_file['request.type']);
  if (requestType != null && requestType != "service" && requestType != "support") { // request type is incorrent
    setExitType(BAD_VALIDATION_EXIT);
    setErrorMsg(getMsg(158));
    return;
  }

  var idString = vars.$L_file['in.id.string'];
  var idAssigned = idString == null ? false : true;
  var updateTime = vars.$L_file.updateTime == null ? null : vars.$L_file.updateTime;
  var status = vars.$L_file['in.status'] == null ? null : vars.$L_file['in.status'];
  var state = vars.$L_file['in.state'];
  var filter = vars.$L_file['filter'] == null ? null : vars.$L_file['filter'];

  var approvalStatus = vars.$L_file['in.approval.status'] == null ? null : vars.$L_file['in.approval.status'];
  if (approvalStatus != null && approvalStatus != "pending" && approvalStatus != "approved" && approvalStatus != "denied") {
    setExitType(BAD_VALIDATION_EXIT);
    setErrorMsg(getMsg(180));
    return;
  }
  var pageSize = vars.$L_file['pagesize'] == null ? 10 : vars.$L_file['pagesize'];
  vars.$L_file['pagesize'] = pageSize;
  var start = vars.$L_file['start'] == null ? 1 : vars.$L_file['start'];
  if (start < 1)
    start = 1;
  vars.$L_file['start'] = start;

  log.debug("queryInteraction start: " + start);
  //define select columns
  //var fields = ['incident.id'];
  var fields;
  var configs;
  //QCCR1E64963 added for performance to limit select column
  var company = vars['$lo.operator']['company'];
  if (company == null)
    company = 'DEFAULT';
  configs = lib.GatewayAPI_svcCatApprovals.getAllSrcConfig(company);
  var additionalFields = lib.GatewayAPI_svcCatApprovals.getAllAddtionalFields(configs);
  fields = ['incident.id', 'callback.contact', 'other', 'contact.fullname', 'svc.cost', 'needed.by.time',
    'open.time', 'opened.by', 'opened.by.uid', 'priority.code', 'title', 'open', 'approval.status',
    'contact.name', 'affected.item', 'source.service', 'description', 'cartId', 'category', 'resolution'
  ];
  if (additionalFields != null) {
    fields = lib.GatewayAPI_svcCatApprovals.unionArray(additionalFields, fields); //fields.concat(additionalFields);
  }

  // calc append query
  var query = _getInteractionSQL(oper);
  var appendSql = " and incident.id isin {" + idString + "}";
  //QCCR1E119799 - advance search support.
  var advanceSearchSql = getAdvanceSearchSql("incidents", vars.$L_file['criteria']);
  if (advanceSearchSql)
    query = query + " and " + advanceSearchSql;

  //currencyConversionRate = getCurrencyConversionRate(vars.$G_root_currency, defaultCurrency, tod());

  if (state != null) {
    if (state == "Open") {
      query = query + " and open ~= \"Closed\" and open ~= \"Canceled\" ";
    } else if (state == "Closed") {
      query = query + " and (open = \"Closed\" or open = \"Canceled\") ";
    }
  }
  if (status != null) {
      var statusstring = getQueryForStatus(status);
      query = query + " and (" + statusstring + ")";
  }
  if (approvalStatus != null) {
    query = query + " and approval.status = \"" + approvalStatus + "\"";
  }
  if (requestType != null) {
    if (requestType == "service") {
      query = query + " and category = \"service catalog\"";
    } else if (requestType == "support") {
      query = query + " and (category ~= \"service catalog\" or category=NULL)";
    }
  }

  if (idAssigned)
    query = "(" + query + ")" + appendSql;

  if (updateTime != null) {
    query = "(" + query + ")" + "and sysmodtime >= '" + new XMLDate(updateTime).getDatum().getText() + "'";
  }
  var startTime = vars.$L_file.startTime;
  var endTime = vars.$L_file.endTime;
  if (startTime != null && endTime != null) {
      query = "(" + query + ")" + " and open.time >= '" + new XMLDate(startTime).getDatum().getText() + "' and open.time <='" + new XMLDate(endTime).getDatum().getText() + "'";
  } else if (startTime != null) {
      query = "(" + query + ")" + " and open.time >= '" + new XMLDate(startTime).getDatum().getText() + "'";
  } else if (endTime != null)  {
      query = "(" + query + ")" + " and open.time <= '" + new XMLDate(endTime).getDatum().getText() + "'";
  }
  
  if (filter != null) {
    query = "(" + query + ")" + " and (" + convertFilter(filter) + ")";
  }

  //log.info("query is "+query);

  var count = 0; //for pagination
  var index = 0;
  var startNum = 0; //for pagination
  //var recordCount = lib.GatewayAPI_RAD._count("incidents", query);
  //vars.$L_file['count'] = recordCount;
  //vars.$L_file._count = recordCount;
  var sortBy = getSortBy();
  var orderBy = getOrderBy();
  var incidents = select("incidents", query, fields, [sortBy], [orderBy]);
  var recordCount = incidents != null? fastCount(incidents) : 0;
  vars.$L_file['count'] = recordCount;
  vars.$L_file._count = recordCount;
  
  if (pageSize==-1) {
        vars.$L_file['in.id.string'] = null; // Clear the user input string
        setExitType(NORMAL_EXIT);
        return;
  }
    
  if (idAssigned) {
    //var incidents = select("incidents", query, fields, [sortBy], [orderBy]);
    if (incidents != null) {
      index = 0;
      //var cartIds = [];
      do {
        _setToFile(incidents, index, configs, oper);
        if (incidents['cartId'] != null) {
          setRecurringCostAndCartItem(incidents['cartId'], index, vars.$L_file['include.recurring.cost']);
        }
        index++;
        rc = incidents.getNext();
      } while (rc == RC_SUCCESS);
      //setRecurringCostAndCartItems(cartIds, vars.$L_file['include.recurring.cost']);
    }
    vars.$L_file['pagesize'] = null;
    vars.$L_file['start'] = null;
  } else {
    //var incidentIds = select("incidents", query,['incident.id'], [sortBy], [orderBy]);
    //var incidentCount = _count("incidents", query);
    var incidentCount = recordCount;
    //log.info("Query Sql to get ids:" + query);
    if (incidentCount != -1) {
      count = incidentCount;
      if (!lib.ArrayUtil.contains(fields, sortBy)) {
        fields.push(sortBy);
      }

      log.debug("query + inSql : " + (query));
      //var incidents = select("incidents", query, fields, [sortBy], [orderBy]);
      if (incidents != null) {
        var recordIndex = 0;
        rc = incidents.getFirst();
        while (rc == RC_SUCCESS && recordIndex < start - 1) {
          recordIndex++;
          rc = incidents.getNext();
        }

        index = 0;
        //var cartIds = [];
        do {
          _setToFile(incidents, index, configs, oper);
          if (incidents['cartId'] != null) {
            setRecurringCostAndCartItem(incidents['cartId'], index, vars.$L_file['include.recurring.cost']);
          }
          index++;
          rc = incidents.getNext();
        } while (rc == RC_SUCCESS && index < pageSize);
        //setRecurringCostAndCartItems(cartIds, vars.$L_file['include.recurring.cost']);
      } else {
        //setExitType(NO_RECORD_EXIT);
        setExitType(NORMAL_EXIT);
        vars.$L_file = null;
        return;
      }
    }
  }

  vars.$L_file['in.id.string'] = null; // Clear the user input string

  log.debug("Return file is : " + vars.$L_file);
  setExitType(NORMAL_EXIT);
  log.debug("queryInteraction Time cost : " + (new Date().getTime() - startDate.getTime()));
}

function _getInteractionSQL(operator) {
  var sql = "(opened.by.uid = \"%s\" or contact.name = \"%s\" or callback.contact = \"%s\")";
  return lib.GatewayAPI_RAD._queryBuilder(sql, [operator['name'], operator['contact.name'], operator['contact.name']]);
}

function getStatusString(inStatusArray) {
    var index = funcs.index("pending",inStatusArray);
    if (index > 0) {
        inStatusArray=funcs._delete(inStatusArray, index);
    }
    var index = funcs.index("denied",inStatusArray);
    if (index > 0) {
        inStatusArray=funcs._delete(inStatusArray, index);
    }
    return inStatusArray.join("\",\"");
}
function getApprovalStatus(includePending, includeDenied) {
    if (includePending && includeDenied) {
        return "approval.status isin {\"pending\", \"denied\"}";
    } else if (includePending) {
        return "approval.status=\"pending\"";
    } else if  (includeDenied) {
        return "approval.status=\"denied\"";
    }
}

function getQueryForStatus(inStatusString) {
    var array = inStatusString.split(",");
    var includePending = funcs.index("pending",array) > 0;
    var includeDenied = funcs.index("denied",array) > 0;
    if (includePending || includeDenied) {
        return "open isin {\"" + getStatusString(array) + "\"} or " + getApprovalStatus(includePending, includeDenied);
    }
    return "open isin {\"" + getStatusString(array) + "\"} and (null(approval.status) or approval.status=\"approved\")";
}
function getAdvanceSearchSql(fileName, criteria) {
	var relationOperator = ["<", "<=", "=<", "=", ">", ">=", "=>", "¬=", "~=", "<>", "><", "#", "¬#", "~#"];
	var conditions = [];
	if (criteria) {
		var dbdict = lib.GatewayAPI_GetOptionsLookup.getDBDICT(fileName);
		if (dbdict) {
			for (var i = 0; i < criteria.length(); i++) {
				var fieldName = criteria[i]['field.name'];
				var operator = criteria[i]['field.operator'];
				var isValidOperator = lib.ArrayUtil.contains(relationOperator, operator);
				var fieldType = getSearchFieldType(dbdict, fieldName);
				if (fieldType && isValidOperator) {
					var value = criteria[i]['value'];
					var condition = null;
					if (fieldType == lib.DataTypeConst.typeCharacter()) {
						condition = fieldName + " " + operator + " \"" + lib.StringUtil.escapeAllStr(value) + "\"";
					} else if (fieldType == lib.DataTypeConst.typeDateTime()) {
						//for datetime, client should pass a valid datetime string according to operator's date format. for example: 11/02/14 00:00:00.
						var datetime = system.functions.val(value, lib.DataTypeConst.typeDateTime());
						if (datetime) {
							condition = fieldName + " " + operator + " '" + value + "'";
						}
					} else if (fieldType == lib.DataTypeConst.typeNumber()) {
						var number = system.functions.val(value, lib.DataTypeConst.typeNumber());
						if (number) {
							condition = fieldName + " " + operator + " " + value + "";
						}
					} else if (fieldType == lib.DataTypeConst.typeBoolean()) {
						// only take care of the "true" value of boolean. ("true" is explicit value.)
						var bol = system.functions.val(value, lib.DataTypeConst.typeBoolean());
						if (bol) {
							condition = fieldName + " " + operator + " true ";
						}
					}
					if (condition) {
						conditions.push(condition);
					}
				}
			}
		}

	}
	if (conditions.length > 0) {
		return conditions.join(' and ');
	}
	return null;
}

function getSearchFieldType(dbdict, fieldName) {
	var searchable = [
		lib.DataTypeConst.typeCharacter(),
		lib.DataTypeConst.typeNumber(),
		lib.DataTypeConst.typeDateTime(),
		lib.DataTypeConst.typeBoolean()
	];
	if (dbdict) {
		for (var i = 0; i < dbdict.field.length(); i++) {
			if (dbdict.field[i].name == fieldName) {
				var type = dbdict.field[i].type;
				if (lib.ArrayUtil.contains(searchable, type)) {
					return type;
				}
				return false;
			}
		}
	}
	return false;
}

function getSortBy() {
	var sortBy = vars.$L_file['SortBy'];
	var index = lib.ArrayUtil.indexOf(sortByNames, sortBy);
	if (index > -1) {
		return sortByFields[index];
	}
	return "open.time";
}

function getOrderBy() {
	var orderby = vars.$L_file['OrderBy'];
	if (orderby == null) {
		return SCFILE_DSC;
	}

	var requestType = system.functions.tolower(orderby);
	if (requestType == "asc") {
		return SCFILE_ASC;
	}

	if (requestType == "desc") {
		return SCFILE_DSC;
	}

	if (requestType == "des") {
		return SCFILE_DSC;
	}

	return SCFILE_DSC;
}

function _setToFile(incidents, index, configs, oper) {
	if (!oper) {
		oper = getCurrentOperator();
	}
	vars.$L_file.interactionInbox[index]['contact.fullname'] = incidents['contact.fullname'];
	vars.$L_file.interactionInbox[index]['currency'] = defaultCurrency;

	var svcCost = incidents['svc.cost'];
	if (svcCost == null)
		svcCost = 0;
	if (incidents['svc.cost'] != null) {
		var costTmp = incidents['svc.cost'];
		vars.$L_file.interactionInbox[index]['svc.cost'] = "" + costTmp;
	}

	var desc = "";
	for (var j = 0; j < incidents['description'].length(); j++) {
		if (incidents['description'][j] != null) {
			if (j == 0) {
				desc = incidents['description'][j];
			} else {
				desc = desc + "\n" + incidents['description'][j];
			}
		} else {
			if (j != 0) {
				desc = desc + "\n";
			}
		}
	}
	
   var solution = "";
   for (var j = 0; j < incidents['resolution'].length(); j++){
        if (incidents['resolution'][j] != null){
            if (j == 0){
                solution = incidents['resolution'][j];
            } else {
                solution = solution + "\n" + incidents['resolution'][j];
            }
        } else {
            if (j!=0){
                solution = solution + "\n";
            }
        }
    }   
	vars.$L_file.interactionInbox[index]['description'] = desc;

	vars.$L_file.interactionInbox[index]['incident.id'] = incidents['incident.id'];
	vars.$L_file.interactionInbox[index]['needed.by.time'] = incidents['needed.by.time'];
	vars.$L_file.interactionInbox[index]['open.time'] = incidents['open.time'];
	vars.$L_file.interactionInbox[index]['opened.by'] = incidents['opened.by.uid'];
	vars.$L_file.interactionInbox[index]['priority.code'] = incidents['priority.code'];
	vars.$L_file.interactionInbox[index]['title'] = incidents['title'];
	vars.$L_file.interactionInbox[index]['open'] = incidents['open']; //status
	vars.$L_file.interactionInbox[index]['approval.status'] = incidents['approval.status'];
	vars.$L_file.interactionInbox[index]['affected.item'] = getDisplayNameByLogicalName(incidents['affected.item']); //service
	vars.$L_file.interactionInbox[index]['category'] = incidents['category'];
    vars.$L_file.interactionInbox[index]['subcategory'] = solution;
	// Set serviceType
	var serviceType = null;
	if (incidents['category'] == 'service catalog') {
		serviceType = 'service catalog';
	} else { // if category in not "service catalog", determine its type need to know whether it related to one cart
		if (incidents['source.service'] == 'support catalog')
			serviceType = 'support catalog';
		else
			serviceType = 'self-service';
	}

	vars.$L_file.interactionInbox[index]['serviceType'] = serviceType;

	vars.$L_file.interactionInbox[index]['cartId'] = incidents['cartId'];
	var includeHasNewActivity = vars.$L_file['include.has.new.activity'];
	if (includeHasNewActivity) {
		if (oper['name'] == incidents['opened.by.uid']) {
			vars.$L_file.interactionInbox[index]['has.new.activity'] = hasNewActivity(incidents['incident.id'], vars.$L_file["loginName"], incidents['opened.by.uid']);
		}
	}
}

function setRecurringCostAndCartItem(cartId, index, is_include_recurring_cost) {
	if (cartId && cartId != null) {
		log.debug("svcCartItem cartIds:" + cartId);
		var itemStartDate = new Date();
		var inSql = "cartId=\"" + cartId + "\"";

		var svcCartItem_fields = ['sdID', 'cartId', 'cartItemId', 'svcCatalogId', 'recurring.cost', 'recurring.cost.interval',
			'item.description', 'quantity', 'cost', 'requested.for.fullname', 'requested.for.type', 'requested.for.dept', 'status', 'expiration', 'sla.breach', 'requested.for','displayName','bundle']; // this line is added by Xiong-jie in order to handle the cart items
		log.debug("inSql to get svcCartItem:" + inSql);
		var beforeQueryDate = new Date();
		var svcCartItem = select("joinCartItemDisplay", inSql, svcCartItem_fields);
		log.debug("svcCartItem time cost:" + (new Date().getTime() - beforeQueryDate.getTime()));
		if (svcCartItem != null) {
			if (is_include_recurring_cost && svcCartItem['recurring.cost'] != 0) {
				if (vars.$L_file.interactionInbox[index]['recurring.cost.info'] == null) {
					vars.$L_file.interactionInbox[index]['recurring.cost.info'] = "";
				}
				vars.$L_file.interactionInbox[index]['recurring.cost.info'] += svcCartItem['cartItemId'] + ":" + svcCartItem['svcCatalogId'] + ":" + svcCartItem['recurring.cost'] + ":" + svcCartItem['recurring.cost.interval'] + ";";
			}
			var cartItemsObj = [];
			do {
				cartItemsObj.push({
					cartItemId: svcCartItem['cartItemId'],
					catalogId: svcCartItem['svcCatalogId'],
					name: svcCartItem['item.description'],
					displayName:svcCartItem['displayName'],
					bundle:svcCartItem['bundle']==true?"true":"false",
					quantity: svcCartItem['quantity'],
					cost: svcCartItem['cost'],
					requestedForFullName: svcCartItem['requested.for.fullname'],
					requestedForType: svcCartItem['requested.for.type'],
					requestedForDept: svcCartItem['requested.for.dept'],
					requestedFor: svcCartItem['requested.for'],
					status: svcCartItem['status'],
					//expiration: svcCartItem['expiration'],
					serviceSla: svcCartItem['serviceSLA']
				});

				rc = svcCartItem.getNext();
			} while (rc == RC_SUCCESS);
			vars.$L_file.interactionInbox[index]['svc.src.xml'] = rteJSONStringify(cartItemsObj);
		}
	}
}

function setRecurringCostAndCartItems(cartIds, is_include_recurring_cost) {
	if (cartIds && cartIds.length > 0) {
		//var cartItemWithRecurringCost = new Array();
		//var inSql = "recurring.cost~=0 and cartId isin {";
		var inSql = "cartId isin {";
		for (var i = 0; i < cartIds.length; i++) {
			inSql = inSql + '"' + cartIds[i] + '"';
			if (i < (cartIds.length - 1)) {
				inSql = inSql + ",";
			}
		}
		inSql = inSql + "}";
		var svcCartItem_fields = ['sdID', 'cartId', 'cartItemId', 'svcCatalogId', 'recurring.cost', 'recurring.cost.interval',
			'item.description', 'quantity', 'cost', 'requested.for.fullname', 'requested.for.type', 'requested.for.dept', 'status', 'expiration', 'sla.breach', 'requested.for']; // this line is added by Xiong-jie in order to handle the cart items
		//log.info("inSql to get svcCartItem:" + inSql);
		// retrieve svcCartItems
		var svcCartItem = select("svcCartItem", inSql, svcCartItem_fields);
		if (svcCartItem != null) {
			var cartItemsObj = {};
			do {
				//cartItemWithRecurringCost.push(svcCartItem);
				for (var i = 0, len = vars.$L_file.interactionInbox.length(); i < len; i++) {
					if (vars.$L_file.interactionInbox[i]['cartId'] == svcCartItem['cartId']) {
						// set recurring cose info
						if (is_include_recurring_cost && svcCartItem['recurring.cost'] != 0) {
							if (vars.$L_file.interactionInbox[i]['recurring.cost.info'] == null) {
								vars.$L_file.interactionInbox[i]['recurring.cost.info'] = "";
							}
							vars.$L_file.interactionInbox[i]['recurring.cost.info'] += svcCartItem['cartItemId'] + ":" + svcCartItem['svcCatalogId'] + ":" + svcCartItem['recurring.cost'] + ":" + svcCartItem['recurring.cost.interval'] + ";";
						}

						// set cartItems
						if (cartItemsObj[i] == null) {
							cartItemsObj[i] = [];
						}
						cartItemsObj[i].push({
							cartItemId: svcCartItem['cartItemId'],
							catalogId: svcCartItem['svcCatalogId'],
							name: svcCartItem['item.description'],
							quantity: svcCartItem['quantity'],
							cost: svcCartItem['cost'],
							requestedForFullName: svcCartItem['requested.for.fullname'],
							requestedForType: svcCartItem['requested.for.type'],
							requestedForDept: svcCartItem['requested.for.dept'],
							requestedFor: svcCartItem['requested.for'],
							status: svcCartItem['status'],
							//expiration: svcCartItem['expiration'],
							serviceSla: svcCartItem['serviceSLA']
						});
					}
				}
				rc = svcCartItem.getNext();
			} while (rc == RC_SUCCESS);

			// convert the cart items into json string and set to returned object (as RTE currently does not support array of object)
			for (var key in cartItemsObj) {
				vars.$L_file.interactionInbox[parseInt(key)]['svc.src.xml'] = rteJSONStringify(cartItemsObj[key]); // the returned caption is cartItems
			}
		}
	}
}

function getRecurringCostInfo(cartId) {
	var svcCartItem_Recurring_Cost_Info = "";
	if (cartId != null) {
		var svcCartItem_Query = _getSvcCartItemByCartSQL(cartId);
		var svcCartItem_fields = ['cartItemId', 'svcCatalogId', 'recurring.cost', 'recurring.cost.interval'];
		var svcCartItem = select("svcCartItem", svcCartItem_Query, svcCartItem_fields);

		if (svcCartItem != null) {
			var svcCartItem_Index = 0;
			do {
				var svcCartItem_Recurring_Cost = "";
				var svcCartItem_Recurring_Cost_Type = "";
				if (svcCartItem['recurring.cost']) {
					svcCartItem_Recurring_Cost_Info += svcCartItem['cartItemId'] + ":" + svcCartItem['svcCatalogId'] + ":" + svcCartItem['recurring.cost'] + ":" + svcCartItem['recurring.cost.interval'];
				}

				rc = svcCartItem.getNext();
				if (rc == RC_SUCCESS && svcCartItem_Recurring_Cost_Info != "" && svcCartItem['recurring.cost']) {
					svcCartItem_Recurring_Cost_Info += ";";
				}
			} while (rc == RC_SUCCESS);
		}
	}
	return svcCartItem_Recurring_Cost_Info;
}

function _getSvcCartItemByCartSQL(cartId) {
	var sql = "(cartId = %s)";
	return queryBuilder(sql, [cartId]);
}

function _getSvcCartItemSQL(incidents) {
	var sql = "(cartId = %s)";
	return queryBuilder(sql, [incidents['cartId']]);
}

/* Build xml from given file and fields, only support data type (1,2,3,4)
 * @Return: xml string
 */

function buildXmlFromFile(lFile, fieldsAry) {
	if (fieldsAry == null)
		return null;

	var srcXml = new XML();
	srcXml.setContent('<fields></fields>');

	var relAry = ['null', 'number', 'character', 'datetime', 'logical', 'label', 'file', 'offset', 'array', 'structure', 'operator', 'expression'];
	var sType = function (value) // sType private function
	{
		var iType = fun.type(value);
		if (iType == null)
			iType = 0;

		return relAry[iType];
	}
	var xmlstr = function (value) // xmlstr private function
	{
		if (value == null)
			return '';

		var type = fun.type(value);
		if (type == 1 || type == 2 || type == 4) {
			return value;
		} else if (type == 3) {
			return new XMLDate(value).getISODateTimeString();
		} else if (type == 8) //Support customization for "description" field
		{
			var desc = "";
			for (var j = 0; j < value.length(); j++) {
				if (value[j] != null) {
					if (j == 0) {
						desc = value[j];
					} else {
						desc = desc + "\n" + value[j];
					}
				} else {
					if (j != 0) {
						desc = desc + "\n";
					}
				}
			}

			return desc;
		} else // other not support type, only use RAD str function
		{
			return fun.str(value);
		}
	}

	for (var i in fieldsAry) {
		var field = fieldsAry[i];
		var value = lFile[field];
		if (value != null) {
			var node = srcXml.createNode(1, 'field');
			node.addAttribute('name', field);
			node.addAttribute('fieldType', sType(value));
			node.setText(xmlstr(value));

			if (lib.dynamicFormGenerator.needDisplayField(fileName, field)) {
				node.addAttribute("display", lib.DisplayName.getDisplayNameByLogicalName(value));
			}

			srcXml.appendNode(node);
		} else if (field == "affected.item") { //special handling for "affected.item", if it is null, then it means user already select "Other - See description".
			var node = srcXml.createNode(1, 'field');
			node.addAttribute('name', field);
			node.addAttribute('fieldType', sType(value));
			node.setText(lib.GatewayAPI_Constants.SUBSCRIPTION_OTHER());

			srcXml.appendNode(node);
		}
	}
	return srcXml.toXMLString();
}

function getCurrencyConversionRate(source, target, date) {
	if (source == target)
		return 1;
	var rootCurrency = vars['$G.root.currency'];
	if (rootCurrency == null) {
		rootCurrency = "USD";
	}
	var rootRate = 1;
	var targetRate = 1;
	var sqlSource = "currency.code=\"" + source + "\" and date <= '" + system.functions.str(date) + "' and root.code=\"" + rootCurrency + "\"";
	var sqlTarget = "currency.code=\"" + target + "\" and date <= '" + system.functions.str(date) + "' and root.code=\"" + rootCurrency + "\"";
	var fields = ['sortcode', 'rate']
	if (source != rootCurrency) {
		var rootConversion = select('curconvert', sqlSource, fields);
		if (rootConversion == null)
			return -1;
		rootRate = sort(rootConversion)[0]['rate'];
	}
	if (target != rootCurrency) { //rootConversion['root.code']){
		var targetConversion = select('curconvert', sqlTarget, fields);
		if (targetConversion == null)
			return -1;
		targetRate = sort(targetConversion)[0]['rate'];
	}
	return targetRate / rootRate;
}

function sort(conversion) {
	var tmpList = new Array();
	var result;
	do {
		tmpConversion = new SCFile("curconvert");
		system.functions.fduplicate(tmpConversion, conversion);
		tmpList.push(tmpConversion);
		result = conversion.getNext();
	} while (result == RC_SUCCESS)
	tmpList = tmpList.sort(_compare);
	return tmpList;
}

function _compare(conversion1, conversion2) {
	return conversion1['sortcode'] - conversion2['sortcode'];
}

function convertInStatusString(inStatusString) {
	var str = inStatusString;
	//var str1=str.replace(/_/g,"");
	var str1 = str.replace(/,/g, "\",\"");
	return ("\"" + str1 + "\"");
}

function convertFilter(filter) {
	var instr = filter;
	var outstr = instr.replace(/'/g, "\"");
	return (outstr);
}
