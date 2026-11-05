var TYPE_NORMAL = "NORMAL";
var TYPE_ACTION = "ACTION";

var METHOD_GET = "GET";
var METHOD_POST = "POST";
var METHOD_PUT = "PUT";
var METHOD_PATCH = "PATCH";
var METHOD_DELETE = "DELETE";
var METHOD_SEPARATOR = "/";

var URL_ATTACHMENTS = "attachments";
var URL_SINGLE_ATTACHMENT = "attachments/{id}";

function getServiceDocumentInfo() {
	var file = new SCFile("extaccess");
	var ret = file.doSelect("rest.enabled=" + true);
	
	var infos = [];
	while (RC_SUCCESS==ret) {
		var name = file.object_name;
		var items = [];
		// Resource Collection
		var methods = METHOD_GET;
		if (file.rest_list_post != null) 
			methods = methods + METHOD_SEPARATOR + METHOD_POST;
		var url = file.rest_list_name;
		
		items.push(createItemObject("Resource Collection", methods, url, TYPE_NORMAL));
		
		// Single Resource
		methods = METHOD_GET;
		if (file.rest_resource_post != null) 
			methods = methods + METHOD_SEPARATOR + METHOD_POST;
		if (file.rest_resource_put != null) 
			methods = methods + METHOD_SEPARATOR + METHOD_PUT;
		if (file.rest_resource_patch != null)
            methods = methods + METHOD_SEPARATOR + METHOD_PATCH;
		if (file.rest_resource_delete != null) 
			methods = methods + METHOD_SEPARATOR + METHOD_DELETE;
		url = file.rest_list_name;
		var keys = file.rest_keys;
		for (var i = 0; i < system.functions.lng(keys); i++) {
			if (keys[i])
				url = url + "/{" + keys[i] + "}";
		}
		items.push(createItemObject("Single Resource", methods, url, TYPE_NORMAL));
		
		//actions
		var actions = file.allowed_actions;
		var actionNames = file.action_names;
		for (var i = 0; i < system.functions.lng(actions); i++) {
			if (actionNames[i] && actions[i])
				items.push(createItemObject(actionNames[i], METHOD_POST, url + "/action/" + actionNames[i].toLowerCase(), TYPE_ACTION));
		}
		
		//attachment
		if (file.rest_attachment_enabled) {
			items.push(createItemObject("Resource Attachment Collection", 
				METHOD_GET+ METHOD_SEPARATOR + METHOD_POST + METHOD_SEPARATOR + METHOD_DELETE, 
				url + "/" + URL_ATTACHMENTS, 
				TYPE_NORMAL));
			items.push(createItemObject("Resource Single Attachment", 
				METHOD_GET+ METHOD_SEPARATOR + METHOD_PUT + METHOD_SEPARATOR + METHOD_DELETE, 
				url + "/" + URL_SINGLE_ATTACHMENT, 
				TYPE_NORMAL));
		}
		
		var info = {name: name, url: file.rest_list_name,items: items};
		infos.push(info);
		ret = file.getNext();
	}
	
	var result = {ServiceDocumentInfo: infos};
	return lib.JSON2.toJSON(result);
}

function createItemObject(name, methods, url, type) {
	return {
		name: name,
		methods: methods,
		url: url,
		type: type
	};
}
