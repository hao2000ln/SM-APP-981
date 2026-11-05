/******************************************************
 * Module Name: Case Exchange
 * Function: Call rest request
 * Author: He, Peng-Fei
 * Version: 1.00
 * Creation Date: Dec, 2013
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var CaseExchangeRestRequestClass = Class.create({
    initialize: function(param) {
        this.logger = lib.CaseExchangeLogger.getLogger();
        this.param = param;

        this.headerScript = param.headerScript;
        this.loginScript = param.loginScript;
        this.attachHeaderScript = param.attachHeaderScript;
        this.headerStringScript = param.attachHeaderStringScript;
    },

    /**	
     *   This function is to do inbound request
     *
     *	@param {url} - rest url
     *	@param {timeout}
     *	@param {responseHeader} - responseHeader
     *	@return - response from end point
     *	@type - string
     */
    doInboundRequest: function(url, timeout, responseHeader) {
        var header;
        if (this.headerScript) {
            header = eval('lib.' + this.headerScript + '(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param)');
        } else {
            header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param);
        }

        var response;
        try {
            response = doHTTPRequest('GET', url, header, '', timeout, timeout, timeout, responseHeader);
        } catch (ex) {
            this.logger.error('CaseExchange_RestRequest', ex);
            var responseCode = lib.smis_RestClient.getResponseCode(ex);
            if (responseCode) {
                responseHeader["returnCode"] = responseCode;
            }
            if (responseCode != "401") {
                throw ex;
            }
        }

        var returnCode = responseHeader["returnCode"];
        if (returnCode == "401" && this.loginScript) {
            this.logger.warning('CaseExchange_RestRequest', "Unauthorized!");
            eval('lib.' + this.loginScript + '(this.param)');

            if (this.headerScript) {
                header = eval('lib.' + this.headerScript + '(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param)');
            } else {
                header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param);
            }

            response = doHTTPRequest('GET', url, header, '', timeout, timeout, timeout, responseHeader);
        }

        return response;
    },


    /**	
     *   This function is to do outbound request
     *
     *	@param {httpMethod} - http method POST/PUT/DELETE/...
     *	@param {url} - rest url
     *	@param {httpBody} - http body
     *	@param {timeout}
     *	@param {responseHeader} - responseHeader
     *	@return - response from end point
     *	@type - string
     */
    doOutboundRequest: function(httpMethod, url, httpBody, timeout, responseHeader) {
        var header;
        if (this.headerScript) {
            header = eval('lib.' + this.headerScript + '(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(), this.param)');
        } else {
            header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(), this.param);
        }

        var response;
        try {
            response = doHTTPRequest(httpMethod, url, header, httpBody, timeout, timeout, timeout, responseHeader);
        } catch (ex) {
            this.logger.error('CaseExchange_RestRequest', ex);
            var responseCode = lib.smis_RestClient.getResponseCode(ex);
            if (responseCode) {
                responseHeader["returnCode"] = responseCode;
            }
            if (responseCode != "401") {
                throw ex;
            }
        }

        var returnCode = responseHeader["returnCode"];
        if (returnCode == "401" && this.loginScript) {
            this.logger.warning('CaseExchange_RestRequest', "Unauthorized!");
            eval('lib.' + this.loginScript + '(this.param)');

            if (this.headerScript) {
                header = eval('lib.' + this.headerScript + '(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(), this.param)');
            } else {
                header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(), this.param);
            }
            response = doHTTPRequest(httpMethod, url, header, httpBody, timeout, timeout, timeout, responseHeader);
        }

        return response;
    },

    /**	
     *   This function is to do attachment outbound request
     *
     *	@param {httpMethod} - http method POST/PUT/DELETE/...
     *	@param {url} - rest url
     *	@param {httpBody} - http body
     *	@param {responseHeader} - responseHeader
     *	@return - response from end point
     *	@type - string
     */
    doAttachOutboundRequest: function(httpAction, url, httpBody, timeout, responseHeader, attachmentObj, headers) {
        var response;
        try {
            response = doHTTPRequest(httpAction, url, headers, httpBody, timeout, timeout, timeout, responseHeader, true, false);
        } catch (ex) {
            this.logger.error('CaseExchange_RestRequest', ex);
            var responseCode = lib.smis_RestClient.getResponseCode(ex);
            if (responseCode) {
                responseHeader["returnCode"] = responseCode;
            }
            if (responseCode != "401") {
                throw ex;
            }
        }

        var returnCode = responseHeader["returnCode"];
        if (returnCode == "401" && this.loginScript) {
            this.logger.warning('CaseExchange_RestRequest', "Unauthorized!");
            if (this.loginScript)
                headers = eval('lib.' + this.loginScript + '(this.param)');
            else
                headers = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param);
            response = doHTTPRequest(httpAction, url, headers, httpBody, timeout, timeout, timeout, responseHeader, true, false);
        }

        return response;
    },

    /**	
     *   This function is to do attachment inbound request
     *
     *	@param {url} - rest url
     *	@param {responseHeader} - responseHeader
     *	@return - response from end point
     *	@type - string
     */
    doAttachInboundRequest: function(httpAction, url, timeout, responseHeader, attachmentObj) {
        var header;
        if (this.attachHeaderScript) {
            header = eval('lib.' + this.attachHeaderScript + '(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(),this.param,attachmentObj)');
        } else {
            header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param);
        }

        var response;
        try {
            response = doHTTPRequest(httpAction, url, header, '', timeout, timeout, timeout, responseHeader, false, true);
        } catch (ex) {
            this.logger.error('CaseExchange_RestRequest', ex);
            var responseCode = lib.smis_RestClient.getResponseCode(ex);
            if (responseCode) {
                responseHeader["returnCode"] = responseCode;
            }
            if (responseCode != "401") {
                throw ex;
            }
        }

        var returnCode = responseHeader["returnCode"];
        if (returnCode == "401" && this.loginScript) {
            this.logger.warning('CaseExchange_RestRequest', "Unauthorized!");
            if (this.loginScript)
                header = eval('lib.' + this.loginScript + '(this.param)');
            else
                header = lib.CaseExchange_EPUtil.getHttpHeader(lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT(), this.param);
            response = doHTTPRequest(httpAction, url, header, '', timeout, timeout, timeout, responseHeader, false, true);
        }

        return response;
    },

    /**	
     *   Transport the attachment by stream way
     *
     *	@param {url} - rest url
     *	@param {responseHeader} - responseHeader
     *	@return - response from end point
     *	@type - string
     */

    doAttachOutboundByStream: function(httpAction, url, binaryData, timeout, attachmentObj, headers, boundaryStr) {
        var headerString = "";
        var response = "";

        if (this.headerStringScript) {
            headerString = eval('lib.' + this.headerStringScript + '(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(),this.param,attachmentObj)');
        }
        if (boundaryStr != null && boundaryStr != "" &&
            headerString != null && headerString != "") {
            var conn = null;
            var os = null;
            var is = null;
            try {
                //Start write the binary data to the connection.
                conn = new HttpURLConnection(httpAction, url, headers, timeout, timeout, false);
                os = conn.getOutputStream();
                os.writeString("--" + boundaryStr + "\r\n");
                os.writeString(headerString);
                os.writeString("\r\n");
                os.writeBytes(binaryData);
                os.writeString("\r\n");
                os.writeString("--" + boundaryStr + "--");
                os.close();

                is = conn.getInputStream();
                response = is.readString();
                is.close();
            } catch (ex) {
                this.logger.error('CaseExchange_RestRequest', "Send attachment " + attachmentObj.name + " failed!");
                this.logger.error('CaseExchange_RestRequest', "Exception:" + ex);
                throw ex;
            } finally {
                if (is != null) {
                    is.close();
                }
                if (os != null) {
                    os.close();
                }
            }
        }
        this.logger.info('CaseExchange_RestRequest', 'Response:\n' + response);
        return response;
    }
});

function getClass() {
    return CaseExchangeRestRequestClass;
}