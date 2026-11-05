/*
*	Smart Analytics Services for Auto Fill functions
*
*	author He, Peng-Fei
*	
*	var IDOLServiceAutoFill = lib.IDOLServiceAutoFill.require();
*	var incident = new SCFile('incidents');
*	var result = IDOLServiceAutoFill.getSuggestedValueByFile(incident, 3, 'advantage');
*/

var _ = lib.Underscore.require();

var logger = getLog('IDOLServiceAutoFill');

var IDOLServiceAutoFill = function() {
	
	/**
	*   Call idol auto fill/classification function to get the suggested value by a file configured in idoladapter.
	*	All idoladapters configured to the file will be processed.
	*	The result is a js object as below:
		[
		   {
		      "adapterId": 6,
		      "fields": [
		         "category",
		         "subcategory",
		         "product.type"
		      ],
		      "values": [
		         [
		            "incident",
		            "failure",
		            "error message"
		         ],
		         [
		            "incident",
		            "hardware",
		            "hardware failure"
		         ],
		         [
		            "incident",
		            "access",
		            "authorization error"
		         ]
		      ]
		   },
		   {
		      "adapterId": 7,
		      "fields": [
		         "affected.item"
		      ],
		      "values": [
		         [
		            "Applications"
		         ],
		         [
		            "Printing (North America)"
		         ],
		         [
		            "E-mail / Webmail (North America)"
		         ]
		      ]
		   }
		]
	*
	*   @param {record} - SCFile of a ticket need to be processed.
	*	@param {suggestedNumber} - The expected count of suggested value
	*	@param {company} - Company name in multi-company mode
	*	@return - The query result from idol
	*   @type - String
	**/
	function getSuggestedValueByFile(record, suggestedNumber, company) {
		logger.trace('start lib.IDOLServiceAutoFill.getSuggestedValueByFile');
		
		var result = [];
		var filename = funcs.filename(record);
		var adapter = lib.IDOLAdapterDAO.findIDOLAdapter({'table.name': filename, 'is.active':true}, ['adapter.id', 'level1.field', 'level2.field', 'level3.field']);
		if (adapter) {
			do {
				var suggestedValue = lib.acicategory.getCategoryByContent(record,adapter['adapter.id'], suggestedNumber, company);
				var obj = _convertSuggestedValue(adapter, suggestedValue);
				result.push(obj);
			} while (adapter.getNext() === RC_SUCCESS)
			
		}
		
		logger.trace('finish call lib.IDOLServiceAutoFill.getSuggestedValueByFile with result: ' + lib.JSON.json().stringify(result));
		
		return result
	}
	
	
	/**
	*   Call idol auto fill/classification function to get the suggested value by a file and specific fields configured in idoladapter.
	*	All idoladapters configured to the fields of the file will be processed.
	*	The result is a js object as below:
		[
		   {
		      "adapterId": 6,
		      "fields": [
		         "category",
		         "subcategory",
		         "product.type"
		      ],
		      "values": [
		         [
		            "incident",
		            "failure",
		            "error message"
		         ],
		         [
		            "incident",
		            "hardware",
		            "hardware failure"
		         ],
		         [
		            "incident",
		            "access",
		            "authorization error"
		         ]
		      ]
		   },
		   {
		      "adapterId": 7,
		      "fields": [
		         "affected.item"
		      ],
		      "values": [
		         [
		            "Applications"
		         ],
		         [
		            "Printing (North America)"
		         ],
		         [
		            "E-mail / Webmail (North America)"
		         ]
		      ]
		   }
		]
	*
	*   @param {record} - SCFile of a ticket need to be processed.
	*   @param {fields} - Array of the fields name in the file
	*	@param {suggestedNumber} - The expected count of suggested value
	*	@param {company} - Company name in multi-company mode
	*	@return - The query result from idol
	*   @type - String
	**/
	function getSuggestedValueByField(record, fields, suggestedNumber, company) {
		logger.trace('start lib.IDOLServiceAutoFill.getSuggestedValueByField');
		
		var result = [];
		var filename = funcs.filename(record);
		var fieldsQuery = fields.join('","');
		var appendQuery = 'level1.field isin {"' + fieldsQuery + '"} or level2.field isin {"' + fieldsQuery + '"} or level3.field isin {"' + fieldsQuery + '"}';
		var adapter = lib.IDOLAdapterDAO.findIDOLAdapter({'table.name': filename, 'is.active':true}, ['adapter.id', 'level1.field', 'level2.field', 'level3.field'], appendQuery);
		if (adapter) {
			do {
				var suggestedValue = lib.acicategory.getCategoryByContent(record, adapter['adapter.id'], suggestedNumber, company);
				var obj = _convertSuggestedValue(adapter, suggestedValue);
				result.push(obj);
			} while (adapter.getNext() === RC_SUCCESS)
			
		}
		
		logger.trace('finish call lib.IDOLServiceAutoFill.getSuggestedValueByField with result: ' + lib.JSON.json().stringify(result));
		
		return result;
	}
	
	
	function _convertSuggestedValue(adapter, fieldsValue) {
		var fieldArray = [adapter['level1.field']];
			adapterId = adapter['adapter.id'],
			result;
			
		if (adapter['level2.field']) {
			fieldArray.push(adapter['level2.field']);
		}
		
		if (adapter['level3.field']) {
			fieldArray.push(adapter['level3.field']);
		}
				
		if (fieldsValue && fieldsValue.length > 0) {
			var result = {adapterId: adapterId, fields: fieldArray, values: fieldsValue};
		}
		
		return result;
	}
	
	return {
		getSuggestedValueByFile: getSuggestedValueByFile,
		getSuggestedValueByField: getSuggestedValueByField
	}
}()

function require() {
	return IDOLServiceAutoFill;
}