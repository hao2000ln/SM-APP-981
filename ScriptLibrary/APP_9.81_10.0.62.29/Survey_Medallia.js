/******************************************************
* Module Name: Survey Connection
* Usage: connection functionality
* Author: Liu, Yong-Liang
* Version: 1.00
* Creation Date: Oct, 2011
*******************************************************/

//some constants
var HTTP_GET_ACTION="GET";
var HTTP_POST_ACTION="POST";
var CUST_URL="";
var CUST_USERNAME = "";
var CUST_PASSWORD = "";


/**
	set URL for web service.

	@param url, url
*/
function setServiceURL(url){
	if(url!=null){
		if(url.match("/$")!="/"){
			CUST_URL=url+"";
		}else{
			CUST_URL=url;
		}
	}
}

/**
	set username for web service.

	@param url, url
*/
function setServiceUserName(username){
	if(username!=null){
		CUST_USERNAME=username;
	}
}

/**
	set URL for web service.

	@param url, url
*/
function setServicePassword(password){
	if(password!=null){
		CUST_PASSWORD=password;
	}
}
/**
	Assembly of http request headers.
	@param user, username for authorization;
	@param password, password for authorization;

	@return an array representing the headers.

	@author Liu,Yong-Liang
*/
function getHTTPHeaders(user,password) {
        var list =new Array();
        list.push(new Header("Content-Type","text/plain"));

        var authHeader = new Header();
        authHeader.name = "Authorization";
        authHeader.value = "Basic " + lib.smis_CommonLib.encode64(user + ":" + password);

        list.push(authHeader);
        return list;
}

/**
	Do http request for REST web service.

	@param httpAction, HTTP ACTION, GET, POST, PUT, etc.;
	@param url, URL of the web service;
	@param httpHeaders, header fields for the http request;
	@param httpBody, body content for the http request;
	@param connTimeout, time out value for connect;
	@param sendTimeout, time out value for sending request;
	@param recvTimeout, time out value for receiving response;

	@return response messages.

	@author Liu,Yong-Liang
*/
function doRESTRequest(httpAction, url, httpHeaders, httpBody, connTimeout, sendTimeout, recvTimeout){

      var rawResponse = null;

      if(connTimeout == null){
            connTimeout = 15;
      }
      if(sendTimeout == null){
            sendTimeout = 15;
      }
      if(recvTimeout == null){
            recvTimeout = 15;
      }

      try {

           rawResponse = doHTTPRequest(httpAction, url, httpHeaders, httpBody, connTimeout, sendTimeout, recvTimeout);

        return rawResponse;

      } catch( ex ) {
            print( "execption: " + ex );
            throw ex;
      }
}

/**
	Do http POST request for Survey - Medallia web service.

	@param url, URL of the web service;
	@param requestBody, body content for the http request;

	@return response messages.

	@author Liu,Yong-Liang
*/
function doSurveyPOSTRequest(url,requestBody){

	try {

        var rawResponse = doRESTRequest(HTTP_POST_ACTION, url, getHTTPHeaders(CUST_USERNAME,CUST_PASSWORD), requestBody, null, null ,null);
        return rawResponse;

      } catch( ex ) {
            print( "execption: " + ex );
            throw ex;
      }
}


/**
	Uploading of variables to Medallia. the values are in a body.

	@param sid, the ID of the survey;
	@param variable, variables to be uploaded;
	@param fileName, the name of the text file;

	@return response messages.

	@author Liu,Yong-Liang
*/
function uploadVariables(variables,log){
	
	var url=CUST_URL;
	try	{
		var response = doSurveyPOSTRequest(url,variables);
		log.debug(response );
		return response;
	}
	catch ( e )
	{
		log.debug(e );
		print( "survey request failed with exception \n" + e );
		throw e;
	}
}


