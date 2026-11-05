// This library is for handle specific webservice from external system 

var logger = getLog("ExternalWS");


/**
 * Handle external webservice
 *
 * RTE forward the full request XML as the first argument, 
 * the partial URL that after "/SM/External" as the second argument,
 * e.g., if the full URL is "POST http://localhost:13080/SM/External/sap/test", 
 * then pass "sap/test" part, 
 * and all attachments pushed in a JS array as the third argument.
 *
 * @param	{String} request, XML request string
 * @param	{String} url, request url
 * @param	{Array} attachment
 * @returns {String} response
 */
function handleRequest(request, url, attachments) {
    if (logger.isDebugEnabled()) {
        logger.debug("request: " + request);
        logger.debug("url: " + url);
    }

    // external SAP request 
    if (url && url.toUpperCase().indexOf("SAP") == 0) {
        var response = "";

        if (lib.ExternalSAPWS && lib.ExternalSAPWS.search) {
            response = lib.ExternalSAPWS.search(request, url, attachments);
            response = response || "";
        }

        var head = '<?xml version="1.0" encoding="utf-8"?>\n<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">\n';
        var tail = (response.length > 0 ? '\n' : '') + '</soap-env:Envelope>';
        response = head + response + tail;

        if (logger.isDebugEnabled()) {
            logger.debug("response: " + response);
        }

        return "xml://" + response;
    }

    return "Unsupported request URL!";
}