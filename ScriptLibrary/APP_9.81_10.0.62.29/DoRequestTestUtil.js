var $ = lib.c.$;
var doRequest = lib.c.doRequest;

/**
 * used for unit test for c.doRequest
 * @param name
 * @param requestAttrNames
 * @param requestAttrValues
 * @returns The attribute value
 */
function getRequestAttr(name, requestAttrNames, requestAttrValues) {
	for (var i = 0; i < requestAttrNames.length(); i++) {
		var attrName = requestAttrNames[i];
		var attrValue = requestAttrValues[i];
		if (attrName == name) {
			return attrValue;
		}
	}
	return null;
}

function mockRequest(parameters) {
	var request = {
		params: parameters,
		attrs : {},
		getParameter : function(name) {
			return this.params[name];
		},
		setAttribute : function(name, value) {
			this.attrs[name] = value;
		},
		getAttribute : function(name) {
			return this.attrs[name];
		},
		removeAttribute : function(name) {
			delete this.attrs[name];
		}
	}
	return request;
}