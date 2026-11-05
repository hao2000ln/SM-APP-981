/******************************************************
 * Module Name: SMIS Rest Client
 * Function: Utility class for retrieving restful resource
 * Author: Tian, Shao-Qin
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/


/**
 *	@function:
 *		retrieve BAF using using global method: doHTTPRequest. 
 * 	@param url:
 * 		BAF retrieve url; type:string
 *	@param httpHeaders:  
 * 		http headers; type:array
 *	@param connTimeout, sendTimeout, recvTimeout.
 * 		timeout parameters; type:number
 *	@return:
 *		Array of BAF entry object; type:array
 *	
 */
function retrieveBAF(url, httpHeaders, connTimeout, sendTimeout, recvTimeout, respHeader) {
    // constants   
    const HTTP_ACTION = "GET";
    var rawJSON;

    try {
        rawJSON = doHTTPRequest(HTTP_ACTION, url, httpHeaders, null, connTimeout, sendTimeout, recvTimeout, respHeader || {});
        //print(rawJSON);
    } catch (ex) {
        //throw new Error("1 - Error when doHTTPRequest. Please check the bac.cialert.rest.url in the configuration.");
        throw new(lib.smis_Exceptions.NetworkException())();
    }

    //var normlizedJSON = _normaliseJSON(rawJSON);

    //print(rawJSON);
    try {
        var response = lib.smis_CommonLib.fromJSON(rawJSON);
        var feed = response.feed;
        if (feed == undefined) {
            throw new Error("2 - RestClient feed not found, Please check the json format of server response.");
        }
        return feed;
    } catch (ex) {
        //throw new Error("3 - RestClient parse error, Please check the json data format.");  	
        throw new(lib.smis_Exceptions.JSONFormatException())();
    }
}

/**  
 * @function: 
 *     replaces '@' with "_attr_" for JS syntax;
 *
 *	@param 
 *		json: input JSON text; type: string
 * @return
 *		normalizedJSON; type:string
 */
function _normaliseJSON(json) {
    if (typeof(json) != "string") {
        throw new TypeError("Is not String format.");
    }

    return json.replace(/@/g, "_attr_");
}


/**
 *	@function:
 *		Do Get Action using using global method: doHTTPRequest. 
 * 	@param url:
 * 		url; type:string
 *	@param httpHeaders:  
 * 		http headers; type:array
 *	@param connTimeout, sendTimeout, recvTimeout.
 * 		timeout parameters; type:number
 * 	@param errorMsg:
 * 		errorMsg; type:string
 *	@return:
 *		response; type:string
 *	
 */
function doRESTGetRequest(url, httpHeaders, connTimeout, sendTimeout, recvTimeout, respHeaders) {
    // constants   
    const HTTP_ACTION = "GET";
    var rawResponse;
    if (connTimeout == null) {
        connTimeout = 30;
    }
    if (sendTimeout == null) {
        sendTimeout = 30;
    }
    if (recvTimeout == null) {
        recvTimeout = 30;
    }
    try {
        rawResponse = doHTTPRequest(HTTP_ACTION, url, httpHeaders, null, connTimeout, sendTimeout, recvTimeout, respHeaders || {});
        return rawResponse;
    } catch (ex) {
        throw new Error(ex);
    }
}

/**
 *	@function:
 *		Do POST Action using using global method: doHTTPRequest. 
 * 	@param url:
 * 		url; type:string
 *	@param httpHeaders:  
 * 		http headers; type:array
 *	@param postBody:  
 * 		post body; type:string
 *	@param connTimeout, sendTimeout, recvTimeout.
 * 		timeout parameters; type:number
 * 	@param errorMsg:
 * 		errorMsg; type:string
 *	@return:
 *		response; type:string
 *	
 */
function doRESTPostRequest(url, httpHeaders, postBody, connTimeout, sendTimeout, recvTimeout, respHeader) {
    // constants   
    const HTTP_ACTION = "POST";
    var rawResponse;
    if (connTimeout == null) {
        connTimeout = 30;
    }
    if (sendTimeout == null) {
        sendTimeout = 30;
    }
    if (recvTimeout == null) {
        recvTimeout = 30;
    }
    try {
        rawResponse = doHTTPRequest(HTTP_ACTION, url, httpHeaders, postBody, connTimeout, sendTimeout, recvTimeout, respHeader || {});
        return rawResponse;
    } catch (ex) {
        throw new Error(ex);
    }
}

/**
 *  @function:
 *      Do PATCH Action using using global method: doHTTPRequest. 
 *  @param url:
 *      url; type:string
 *  @param httpHeaders:  
 *      http headers; type:array
 *  @param postBody:  
 *      post body; type:string
 *  @param connTimeout, sendTimeout, recvTimeout.
 *      timeout parameters; type:number
 *  @param errorMsg:
 *      errorMsg; type:string
 *  @return:
 *      response; type:string
 *  
 */
function doRESTPatchRequest(url, httpHeaders, postBody, connTimeout, sendTimeout, recvTimeout, respHeader) {
    // constants   
    const HTTP_ACTION = "PATCH";
    var rawResponse;
    if (connTimeout == null) {
        connTimeout = 30;
    }
    if (sendTimeout == null) {
        sendTimeout = 30;
    }
    if (recvTimeout == null) {
        recvTimeout = 30;
    }
    try {
        rawResponse = doHTTPRequest(HTTP_ACTION, url, httpHeaders, postBody, connTimeout, sendTimeout, recvTimeout, respHeader || {});
        return rawResponse;
    } catch (ex) {
        throw new Error(ex);
    }
}

/**
 *	@function:
 *		Do DELETE Action using using global method: doHTTPRequest. 
 * 	@param url:
 * 		url; type:string
 *	@param httpHeaders:  
 * 		http headers; type:array
 *	@param connTimeout, sendTimeout, recvTimeout.
 * 		timeout parameters; type:number
 * 	@param errorMsg:
 * 		errorMsg; type:string
 *	@return:
 *		response; type:string
 *	
 */
function doRESTDeleteRequest(url, httpHeaders, connTimeout, sendTimeout, recvTimeout, respHeader) {
    // constants   
    const HTTP_ACTION = "DELETE";
    var rawResponse;
    if (connTimeout == null) {
        connTimeout = 30;
    }
    if (sendTimeout == null) {
        sendTimeout = 30;
    }
    if (recvTimeout == null) {
        recvTimeout = 30;
    }
    try {
        rawResponse = doHTTPRequest(HTTP_ACTION, url, httpHeaders, null, connTimeout, sendTimeout, recvTimeout, respHeader || {});
        return rawResponse;
    } catch (ex) {
        throw new Error(ex);
    }
}

/**
 *	@function:
 *		Create http headers for basic authentication
 * 	@param acceptLanguage:
 * 		Accept Language; type:string
 *	@param userName:  
 * 		userName; type:string
 *	@param passWord
 * 		passWord; type:string
 *	@return:
 *		httpHeaders; type:array
 *	
 */
function createBasicAuthHttpHeaders(acceptLanguage, userName, passWord) {
    var httpHeaders = [];
    if (acceptLanguage) {
	    var languageHeader = new Header();
	    languageHeader.name = "Accept-Language";
	    languageHeader.value = acceptLanguage;
	    httpHeaders.push(languageHeader);
	}
    var authHeader = new Header();
    authHeader.name = "Authorization";
    var base64String = getBase64Encode(userName + ":" + passWord);
    authHeader.value = "Basic " + base64String;
    httpHeaders.push(authHeader);
    return httpHeaders;
}

function getBase64Encode(input) {
    var keystr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    
    var i = 0;
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = 64;
            enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keystr.charAt(enc1) + keystr.charAt(enc2) +
            keystr.charAt(enc3) + keystr.charAt(enc4);
    }

    return output;
}

/**
 *  Parse return code from exception message of http request
 *  Move from SmartEmailSMHelperAPI as the general function for SMIS
 *  One example of exception messesage is:
 *      Error calling method: doHttpRequest Exception (java.lang.Exception: Return Code: 401)
 *  It will retrun 401.
 *  If exception is null or no return code in the message, return null.
 */
function getResponseCode(exception) {
    if (!exception) {
        return null;
    }
    var regex = /(response code|Return Code): ([0-9]+)/i;
    var match = exception.match(regex);
    if (match != null) {
        return match[2];
    }
    return null;
}


function genRESTBaseURL() {
    var host = system.sysinfo["ServerNetAddress"];
    var port = system.sysinfo["ServerNetPort"];
    
    if (system.sysinfo["ssl"] === "true") {
        return 'https://' + host + ':' + port + '/SM/9/rest/';
    }
    return 'http://' + host + ':' + port + '/SM/9/rest/';
}