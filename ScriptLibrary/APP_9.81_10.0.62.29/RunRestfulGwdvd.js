var _ = lib.Underscore.require();
var _null = system.functions._null;
var logger = getLog('RunRestfulgwscripteval');
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;

/**
 * Request payload, a json object of input fields, for e.g.:
 *   fields: {
 *     "NewORDeactivate": {
 *         mandatory: false,
 *         visible: true,
 *         type: 'radio',
 *         value: ''
 *     },
 *     "SerialNumber": {
 *         mandatory: '[NewORDeactivate]="Deactivate"',
 *         visible: '[NewORDeactivate]="Deactivate"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "SecureIDORSoftID": {
 *         mandatory: '[NewORDeactivate]="New"',
 *         visible: '[NewORDeactivate]="New"',
 *         type: 'combo',
 *         value: ''
 *     },
 *     "Company": {
 *         mandatory: false,
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'combo',
 *         value: ''
 *     },
 *     "Department": {
 *         mandatory: '$L.format<>"svcCat.disp.item"',
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "Address": {
 *         mandatory: '$L.format="svcCat.disp.item"',
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "OperatingSystem": {
 *         mandatory: '[SecureIDORSoftID]="Soft ID"',
 *         visible: '[SecureIDORSoftID]="Soft ID"',
 *         type: 'combo',
 *         value: ''
 *     }
 * }
 * Response body, the validated json object, for e.g.:
 *   fields: {
 *     "NewORDeactivate": {
 *         mandatory: false,
 *         visible: true,
 *         type: 'radio',
 *         value: ''
 *     },
 *     "SerialNumber": {
 *         mandatory: '[NewORDeactivate]="Deactivate"',
 *         visible: '[NewORDeactivate]="Deactivate"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "SecureIDORSoftID": {
 *         mandatory: '[NewORDeactivate]="New"',
 *         visible: '[NewORDeactivate]="New"',
 *         type: 'combo',
 *         value: ''
 *     },
 *     "Company": {
 *         mandatory: false,
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'combo',
 *         value: ''
 *     },
 *     "Department": {
 *         mandatory: '$L.format<>"svcCat.disp.item"',
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "Address": {
 *         mandatory: '$L.format="svcCat.disp.item"',
 *         visible: '[SecureIDORSoftID]="Secure ID"',
 *         type: 'string',
 *         value: ''
 *     },
 *     "OperatingSystem": {
 *         mandatory: '[SecureIDORSoftID]="Soft ID"',
 *         visible: '[SecureIDORSoftID]="Soft ID"',
 *         type: 'combo',
 *         value: ''
 *     }
 * } 
 */
function POST(req, res) {
	initThreadVariables(req);						 
	var msgs = [];
	var oriOperator=getCurrentOperator().name;
	//logger.info("oldoper"+oriOperator);
	if (req.body.gwdvdfields.operator !=null) {
	   var requestOnBehalf=req.body.gwdvdfields.operator;
	   if (oriOperator!=requestOnBehalf)
	    lib.GatewayAPI_Util.changeUserSession(requestOnBehalf);
	} 
	var newOper=getCurrentOperator().name;
	//logger.info("newoper"+newOper);
	var fields = req.body.gwdvdfields.fields;
	// 1. validate whether the mandatory and visible condition are supported or not
	for (var fieldId in fields) {
		var msg = checkFieldCondition(fieldId, fields[fieldId], 'mandatory');
		if(msg!=null) {
			msgs.push(msg);
		}
		var msg = checkFieldCondition(fieldId, fields[fieldId], 'visible');
		if(msg!=null) {
			msgs.push(msg);
		}
		var msg = checkFieldCondition(fieldId, fields[fieldId], 'query');
		if(msg!=null){
			msgs.push(msg);
		}
		var msg = checkFieldCondition(fieldId, fields[fieldId], 'value');
		if(msg!=null){
			msgs.push(msg);
		}
		var msg = checkFieldArrayCondition(fieldId, fields[fieldId], 'parameters');
        if(msg != null) {
            msgs.push(msg);
        }
        var msg = checkFieldCondition(fieldId, fields[fieldId], 'readonly');
        if(msg!=null) {
            msgs.push(msg);
        }
	}
	
	// 2, evaluate the fields 
	var validatedFieldsObj = lib.GatewayAPI_Form_DVD.evaluate(req.body.gwdvdfields.fields);
	var result;
	if(validatedFieldsObj!=null) {
		result = rteJSONStringify(validatedFieldsObj);		
	} else {
		result = '';
	}
	res.send({
		Messages: msgs,
		fields: result
	});
	if (newOper!=oriOperator) lib.GatewayAPI_Util.changeUserSession(oriOperator);
}

function checkFieldCondition(fieldId, field, condType) {
	var cond = field[condType];
	if(cond != undefined && typeof(cond)==='string' && cond.indexOf('$L.')>=0) {
		field[condType] = false;
		return 'The field ' + fieldId + '\'s ' + condType + ' condition "' + cond + '" is not supported, reset to false by default!';
	}
	return null;
}
function checkFieldArrayCondition(fieldId, field, condType) {
    var cond = field[condType];
    if (cond != undefined) {
        for (var i = 0; i< funcs.lng(cond); i++) {
            if (cond[i].indexOf('$L.')>=0) {
                cond[i] = false;
                return 'The field ' + fieldId + '\'s ' + condType + ' condition "' + cond[i] + '" is not supported, reset to false by default!';
            }
        }
    }
    return null;
}

// For fixing Defect 1371145 - Problem evaluation the visible condition of a user selection in a catalog item
function initThreadVariables(req) {
    var requestedForType = req.body.gwdvdfields.requestedForType;
    var requestedFor = req.body.gwdvdfields.requestedFor;

    //Clear variables value
    vars['$requested.for'] = null;
    vars['$requested.for.dept'] = null;
    vars['$requested.for.type'] = null;

    if (requestedForType && !_null(requestedForType) && requestedFor && !_null(requestedFor)) {
        if (requestedForType == "individual") {
            vars['$requested.for'] = requestedFor;
            vars['$requested.for.type'] = requestedForType;
        } else if (requestedForType == "department") {
            vars['$requested.for.dept'] = requestedFor;
            vars['$requested.for.type'] = requestedForType;
        }
    }
}																																				   


function authorize() {
	return true;
}

