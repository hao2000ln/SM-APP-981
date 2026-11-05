/** @fileoverview QuetoDetail - get quote detail information
*   @author Zheng, Xiang
*/

var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var isRequestEnabled = lib.ProcessDesignerEnablement.isRequestEnabled;
var _select = lib.GatewayAPI_RAD._select;
var getQuoteFileName = lib.GatewayAPI_Util.getQuoteFileName;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_QuetoDetail");

function getQuoteDetailForApproval() {
	setExitType(NORMAL_EXIT);
	var number = vars['$L.file']['number'];
    if (number == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(138)); 
		return;
    }

    var inboundFileName = vars['$L.file']['file.name'];
    var fileName;
    var passInFileName;
    if (inboundFileName && (inboundFileName=='ocmq' || inboundFileName=='request')) {
    	fileName = inboundFileName;
    	passInFileName = inboundFileName;
    } else {
    	fileName = getQuoteFileName();
    }

	var File = lib.DBUtils.File;
    var pdEnabled = isRequestEnabled();
    var file = _select(fileName, "number=\""+number+"\"");
    
    var target = vars['$L.file'];
   
    if (file) {
	    copyValues(target, file, ['number', 'brief.description', 'description', 'requested.for', 'requestor.name', 'requested.date', 'approval.status',
	    	'status', 'current.phase', 'total.cost'
	    	]);

	    if ((passInFileName=='request') || (!passInFileName && pdEnabled)) {
			copyValues(target, file, ['cost.currency.code', 'global.lead.time', 'category', 'subcategory', 'modelname', 'bill.to.code', 'bill.to.dept',
			'project.id', 'ship.to.code', 'reason', 'priority', 'impact', 'assigned.to', 'assigned.group', 'coordinator.name', 'delivery.date', 'severity',
			'affected.item', 'logical.name']);
			target['pd.enabled'] = true;
	    } else if ((passInFileName=='ocmq') || (!passInFileName && !pdEnabled)) {
	    	target['pd.enabled'] = false;
	    	var sourceBundles = file['bundles'];
	    	for (var i=0;i<sourceBundles.length();i++) {
	    		var bundleNumber = sourceBundles[i]['bundle.number'];
	    		target['bundles'][i]['bundle.number'] = parseInt(bundleNumber);
	    		target['bundles'][i]['bundle.description'] = sourceBundles[i]['bundle.description'] ;
	    		target['bundles'][i]['bundle.qty'] = sourceBundles[i]['bundle.qty'] ;
	    		target['bundles'][i]['bundle.cost'] = sourceBundles[i]['bundle.cost'] ;
	    	}
	    }
	    
	    var relationRecord = _select('screlation', 'depend=\"' + number + '\" and source.filename=\"incidents\"');
	    if (relationRecord!=null) {
	    	target['incident.id'] = relationRecord['source'];
	    }
	    
	    return;
    } else {
    	setExitType(NO_RECORD_EXIT);
    	return;
    }
}

function copyValues(target, source, fields) {
	var field;
	for (var i=0; i<fields.length; i++) {
		field = fields[i];
		var value = source[field];
		if( 'affected.item' == field || 'logical.name'== field) value = getDisplayNameByLogicalName(value);
		target[field] = value;
	}
}

function getLineItems() {
	setExitType(NORMAL_EXIT);
	var parentId = vars['$L.file']['parent.quote'];
	var pdEnabled = isRequestEnabled();
	var fileName = "ocml";
	var query = 'parent.quote=\"' + parentId + '\"';
	if (pdEnabled) {
		fileName = getQuoteFileName();;
		var quoteFile = _select(fileName, "number=\""+parentId+"\"");
		if (quoteFile && quoteFile['svcCartId']) {
			var svcCartItemFile = _select("svcCartItem", "cartId=" + quoteFile['svcCartId']);
			if (svcCartItemFile != null) {
				var i = 0;
				do {
					vars['$L.file']['lineItems'][i]['number'] = "" + svcCartItemFile['svcCatalogId'];
					vars['$L.file']['lineItems'][i]['part.desc'] = svcCartItemFile['item.description'];
					vars['$L.file']['lineItems'][i]['status'] = svcCartItemFile['status'];
					vars['$L.file']['lineItems'][i]['total'] = svcCartItemFile['cost'];
					vars['$L.file']['lineItems'][i]['quantity'] = svcCartItemFile['quantity'];
					i++;
				} while (svcCartItemFile.getNext() == RC_SUCCESS)
			} else {
				setExitType(NO_RECORD_EXIT);
			}
		} else {
			setExitType(NO_RECORD_EXIT);
		}
	} else {
		fileName = "ocml";
		query = 'parent.quote=\"' + parentId + '\"';
		var ocmlFile = _select(fileName, query);
		if (ocmlFile != null) {
			var i = 0;
			do {
				vars['$L.file']['lineItems'][i]['number'] = ocmlFile['number'];
				vars['$L.file']['lineItems'][i]['part.desc'] = ocmlFile['part.desc'];
				vars['$L.file']['lineItems'][i]['status'] = ocmlFile['status'];
				vars['$L.file']['lineItems'][i]['total'] = ocmlFile['total'];
				vars['$L.file']['lineItems'][i]['quantity'] = ocmlFile['quantity'];
				i++;
			} while (ocmlFile.getNext() == RC_SUCCESS)
		} else {
			setExitType(NO_RECORD_EXIT);
		}
	}
}