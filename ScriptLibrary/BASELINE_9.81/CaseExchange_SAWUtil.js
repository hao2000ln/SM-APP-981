var SM_TEXT_START = '##### SM START #####';
var SM_TEXT_END = '##### SM END #####';
var logger = lib.CaseExchangeLogger.getLogger();
//use Underscore.js
var _ = lib.Underscore.require();
/** 
*   This fuction is to generate http request header for SAW
*
*   @param {direction} 
*   @param {param}
*   @return - header
*   @type - array
*/
function getHttpHeader(direction, param) {
    var header = [];
    var cookie = param.cookie;
    header.push(new Header("Cookie", cookie));

    if (lib.CaseExchange_CommonLib.isOutbound(direction)){ //outbound
        //set Content-Type
        header.push(new Header('Content-Type', 'application/json;charset=UTF-8'));
    }

    return header;
}

/** 
*   This fuction is to do login request
*
*   @param {loginURL}
*   @param {username}
*   @param {password}
*   @param {tenentId}
*   @param {timeout}
*   @return - cookie
*   @type - object {'cookie':cookie}
*/
function doLoginRequest(param) {
    var loginURL = param.loginURL;
    var username = param.username;
    var password = param.password;
    var tenentId = param.tenantId;
    var timeout = param.timeout;
    
    try{
        var token = getToken(loginURL,username,password,tenentId,timeout);
    }catch(ex){
        this.logger.error('CaseExchange_RestRequest', ex);
        throw ex;
    }
    param.cookie = 'SMAX_AUTH_TOKEN=' + token + '; TENANTID=' + tenentId;
}

/** 
*   This fuction is to get SMAX token
*
*   @param {loginURL}
*   @param {username}
*   @param {password}
*   @param {tenentId}
*   @param {timeout}
*   @type - string
*/
function getToken(loginURL,username,password,tenentId,timeout) {
    var url = loginURL + "?TENANTID=" + tenentId;
    var headers = [];
    var body = JSON.stringify({
        "login": username,
        "password": password
    });
    var responseHeader = {};
    try{
        var response = doHTTPRequest('POST', url, headers, body, timeout, timeout, timeout, responseHeader);
        if(responseHeader['returnCode'] == 200){
            var contentType = responseHeader['Content-Type'];
            if(contentType && contentType.toString().indexOf("text/plain")!=-1){
                this.logger.info('CaseExchange_RestRequest', 'Got the token successfully');
                return response;
            }else{
                this.logger.error('CaseExchange_RestRequest', 'returnCode is 200, but response is incorrect.\n' + response);
                throw new Error(funcs.scmsg(27,"CaseExchange"));
            }
        }
        response = parseResponse(response);
        var exception = response['exceptionCause'] || response['message'];
        this.logger.error('CaseExchange_RestRequest', "returnCode:" + response['httpStatus'] + "\n errorMessage:" + response['message']);
        throw new Error(exception);
    }catch(ex){
        this.logger.error('CaseExchange_RestRequest', ex);
        throw ex;
    }
}

/**
 * parse SMAX API response
 *
 * @param {String} response
 * @returns {Object} standard API response format
 */
function parseResponse(response) {
    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {
        respObj = {
            httpStatus: "400",
            message: response
        };
    }
    return respObj;
}


/** 
*   Check if the response of outbound request is successful or not
*   @param {param} - all parameters of case exchange
*   @param {response} - response body
*   @return - boolean
*   @type - boolean
*
*/
function validateOutboundResponse(param, response){
    var obj = lib.smis_CommonLib.fromJSON(response);
    if (!obj || !obj.meta || obj.meta.completion_status !== 'OK') {
        return false;
    }
    var externalKey = param.externalId;

    obj = obj.entities[0];
    return eval('obj.entity.' + externalKey);
}


/** 
*   Check if the response of inbound request is successful or not
*   @param {param} - all parameters of case exchange
*   @param {response} - response body
*   @return - boolean
*   @type - boolean
*
*/
function validateInboundResponse(param, response){
    var obj = lib.smis_CommonLib.fromJSON(response);
    if (obj.meta.completion_status === 'OK') {
        return true;
    }
    return false;
}


/**
*   Convert activity to comments json for SAW
*
*   @param {activity} - activity in SM
*   @return - json of activity(comments) SAW required
*   @type - string
*/
function activityLogToJson(activity){
    var obj = {Body: activity};
    return lib.JSON2.toJSON(obj);
}
/**
*   update attachment info to SAW
*
*   @param {mapObj} - object after field and value mapping process
*   @param {sm} - sm record data
*   @param {ep} - end point record data
*   @param {context} - smis context
*   @param {param} - case exchange connector parameters
*   @param {attachmentInfoObj} - attachment info
*   @return - response
*   @type - string
*/
function updateAttachmentInfo(mapObj, sm, ep, context, param, attachmentInfoArray){
    //if action is update, need get the existed attachment info from SAW and merge the added one
    var response = null;
    var url, restRequest;

    var timeout = param.timeout;
    var tenantId = param.tenantId;
    
    if (context.action !== 'Create') {
        var baseURL = param.baseURL;
        var retrieveQuery = param.query;
        retrieveQuery = retrieveQuery.replace("time=${param.lastPullingTime}&","");
        
        url = baseURL + '/rest/' + tenantId + '/ces/' + context.externalId + retrieveQuery;
        restRequest = new (lib.CaseExchange_RestRequest.getClass())(param);
        response = restRequest.doInboundRequest(url, timeout, {});
    }
    
    var sawAttachObj;
    var sawHasAttachment = false;
    
    var i;
    
    var attachmentInfoObj = {};
    if (attachmentInfoArray != null && attachmentInfoArray.length > 0)
    {
        var filesAttribute = {"complexTypeProperties":[]};
        for (i = 0; i < attachmentInfoArray.length; i++)
        {
            var sawAttachInfor = attachmentInfoArray[i];
            var sawFileObject = {};
            var sawFileAttributeJson = {};
            
            sawFileAttributeJson['id'] = sawAttachInfor.getID();
            sawFileAttributeJson['file_name'] = sawAttachInfor.getFileName();           
            sawFileAttributeJson['file_extension'] = sawAttachInfor.getFileExtension();
            sawFileAttributeJson['mime_type'] = sawAttachInfor.getFileType();
            sawFileAttributeJson['size'] = sawAttachInfor.getSize();
            sawFileAttributeJson['Creator'] = sawAttachInfor.getCreator();
            sawFileAttributeJson['LastUpdateTime'] = sawAttachInfor.getUpdateTime();
            sawFileObject['properties'] = sawFileAttributeJson;
            filesAttribute['complexTypeProperties'][i]=sawFileObject;
            
        }
        attachmentInfoObj['IncidentAttachments']=lib.smis_CommonLib.toJSON(filesAttribute);
    }
    
    if (response) {
        var incidentObj = lib.smis_CommonLib.fromJSON(response);
        var sawAttachment = incidentObj.entities[0].properties.IncidentAttachments;

        if (sawAttachment) {
            sawAttachObj = lib.smis_CommonLib.fromJSON(sawAttachment);
            if (sawAttachObj.complexTypeProperties && sawAttachObj.complexTypeProperties.length > 0) {
                sawHasAttachment = true;
                var addedAttachmentInfo = lib.smis_CommonLib.fromJSON(attachmentInfoObj.IncidentAttachments);
                for (i in addedAttachmentInfo.complexTypeProperties){
                    sawAttachObj.complexTypeProperties.push(addedAttachmentInfo.complexTypeProperties[i]);
                }
            }
        }
    }

    var jsonObj = {entities: [{properties:{}, ext_properties:
                   {Operation:'Update',ExternalStatus:sm['problem.status'],
                   ExternalId:context.internalId,ExternalSystem:"SM",ExternalEntityType:'Incident'},entity_type:'Incident'}]};
    jsonObj.entities[0].properties.Id = context.externalId;
    
    if (sawHasAttachment){
        jsonObj.entities[0].properties.IncidentAttachments = lib.JSON2.toJSON(sawAttachObj);
    } else {
        jsonObj.entities[0].properties.IncidentAttachments = attachmentInfoObj.IncidentAttachments;
    }

    
    var json = lib.JSON2.toJSON(jsonObj);
    url = param.baseURL + '/rest/' + tenantId + '/ces';
    restRequest = new (lib.CaseExchange_RestRequest.getClass())(param);
    return restRequest.doOutboundRequest('POST', url, json, timeout, {});
}

/** 
*   This fuction is parse the attachment json as object.
*   @param {taskObj} - SMIS TaskQueue Record
*   @return {attachArray} - An array which includes multi-js object.
*/
function getAttachmentInfor(mapObj, sm, ep, context, param)
{
    var attachArray = [];
    try{
        if (sm != null)
        {   
            //attachData is a Json object
            var attachData = sm['properties'];
            
            if (!(attachData instanceof Object))
            {
                attachData =  eval ('('+attachData+')' );
            }
            
            var attchRoot = attachData['IncidentAttachments'];
            attchRoot =  eval ('('+attchRoot+')' );
            if (attchRoot != null)
            {
                var attachProper = attchRoot['complexTypeProperties'];
                if (attachProper != null && attachProper.length > 0)
                {
                    var i;
                    for (i = 0; i < attachProper.length; i++)
                    {
                        if (attachProper[i]['properties']['IsHidden'])
                        {
                            continue;
                        }
                        var attchObj = new (lib.CEAttachmentInfor.getClass())();
                        attchObj.setID(attachProper[i]['properties']['id']);
                        attchObj.setFileName(attachProper[i]['properties']['file_name']);
                        attchObj.setFileExtension(attachProper[i]['properties']['file_extension']);
                        attchObj.setSize(attachProper[i]['properties']['size']);
                        attchObj.setFileType(attachProper[i]['properties']['mime_type']);
                        attachArray.push(attchObj);
                    }
                }
            }
        }
    }
    catch(ex)
    {
        throw ex;
    }
    return attachArray;
}


/** 
*   This fuction is to generate http request header for attachment API In SAW
*
*   @param {task} 
*   @param {configItem}
*   @return - header
*   @type - array
*/


function getAttachHttpHeader(direction, param,attachObj) {

    var header = [];
    header.push(new Header("Cookie", param.cookie));
    
    if (lib.CaseExchange_CommonLib.isOutbound(direction)){ 
            var curDate = new Date();
            var boundary = "---------------------------7d"+curDate.getTime();
            header.push(new Header("Content-Type", "multipart/form-data; boundary="+boundary));
        }
    return header;
}
/** 
*   This fuction is to generate the header string of the body when execute attachment outbound
*
*   @param {task} 
*   @param {configItem}
*   @return - header
*   @type - array
*/


function getBodyHeaderString(direction, param,attachObj) {
    var headerString = "";
    
    if (lib.CaseExchange_CommonLib.isOutbound(direction)){ 
            headerString='Content-Disposition: form-data; name="files[]"; filename="'+attachObj.name+'"\r\n';
            headerString=headerString+'Content-Type: '+attachObj.type+'\r\n';
        }
    return headerString;
}


/** 
*   This fuction is to generate http request header for attachment API In SAW
*
*   @param {reponse} 
*   @param {action}
*   @param {name}
*   @return - header
*   @type - CEAttachmentInfor
*/

function parseSAWCreateAttachResponse(reponse,action,param)
{
    var attchObj = new (lib.CEAttachmentInfor.getClass())();
    reponse = lib.smis_CommonLib.fromJSON(reponse); //eval ('('+reponse+')' );
    if (action == lib.CaseExchangeConstants.REST_CREATE_ATTACHMENT())
    {
        attchObj.setID(reponse['guid']);
        var filename = reponse['name'];
        attchObj.setFileName(filename);
        var contentType = reponse['contentType'];
        var type = contentType.split(";");
        var filetype = filename.split(".");
        
        attchObj.setFileExtension(filetype[1]);
        attchObj.setFileType(type[0]);
        attchObj.setSize(reponse['contentLength']);
        attchObj.setCreator(reponse['creator']);
        attchObj.setUpdateTime(reponse['lastModified']);
    }
    return attchObj;
}

/** 
*   This fuction is to process the text with html tag from SAW
*   1. Save the html tag to context
*   2. Remove the SM placeholder
*   3. Remove html tag
*
*   @param {context} - Context obj of smis
*   @param {fieldname} - field name
*   @param {text} - value of the text
*   @return - The converted text
*   @type - String
*/
function processHtmlText(param, context, fieldName, text) {
    if (fieldName === 'description') {
        context.externalReferences.customField1 = text;
    } else if (fieldName === 'solution') {
        context.externalReferences.customField2 = text;
    }
    var convertedText = convertSAWTextToSM(text);
    return stripHtml(removeHtmlTag(param, context, convertedText, text));
}


/** 
*   This fuction is to return the reg str of SM Text place holder
*
*   @return - The reg str
*   @type - String
*/
function SMTextPlaceholderReg() {
    var regStr = '\\' + SM_TEXT_START + '([\\s\\S]*?)\\' + SM_TEXT_END + '';
    return regStr;
}


/** 
*   This fuction is to convert the SAW text to SM.
*   It removes the placeholder and append the text in placeholder to SAW text.
*
*   @param {text} - value of the text
*   @return - The converted text
*   @type - String
*/
function convertSAWTextToSM(text) {
    var regStr = SMTextPlaceholderReg();
    var reg = new RegExp(regStr, 'g');
    var removePlaceholder = function(match, $1) {
        return $1;
    };
    text = text.replace(reg, removePlaceholder);
    return text;
}


/** 
*   This fuction is to remove the html tag in a string.
*   But for the <img> tag, it will try to download the image and append a replacement message
*
*   @param {text} - value of the text
*   @return - The converted text
*   @type - String
*/
function removeHtmlTag(param, context, text, originalText) {
    var imgPaths = [];  //all relative image path
    var successImgs = [];   //all successful downloaded image names
    var failedImgs = [];    //all failed downloaded image names
    var downloadedImgs = [];    //all images already downloaded before
    var absolutePaths = [];     //all image path start with http 
    
    
    //remove all invisible character
    text = text.replace(/\s/g, replaceInvisible);
    //replace </p> and <br/> with a new line
    text = text.replace(/<\/p>|<br(\s)*\/>/g, '\n');
    
    text = lib.CaseExchange_CommonLib.removeHtmlTagButImage(text);
    
    var imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
    
    /* if has <img> tag, try to download image and append a replacement string */
    var replaceImgTag = function(match, $1) {
        var filepath = $1;
        if (isAbsolutePath(filepath)) {
            absolutePaths.push(filepath);
        } else {
            imgPaths.push(filepath);
        }
        
        // call download image api
        var tmp = downloadSAWImage(param, context, imgPaths);
        successImgs = tmp[0];
        failedImgs = tmp[1];
        downloadedImgs = tmp[2];
        return '';
    };
    
    /* check if the path in <img> is a absolution path (start with http) or relative path */
    var isAbsolutePath = function(path) {
        var reg = /^http/;
        var result = reg.test(path);
        return result;
    };
    
    var i;
    
    /* covert array to string */
    function array2str(arr) {
        var result = '';
        for (i = 0; i < arr.length; i++) {
            result += arr[i];
            if (i < arr.length - 1) {
                result += ', ';
            }
        }
        return result;
    }

    text = text.replace(imgReg, replaceImgTag);
    
    if (downloadedImgs && downloadedImgs.length > 0) {
        var regStr = SMTextPlaceholderReg();
        var reg = new RegExp(regStr, '');
        if (!reg.test(originalText)) {
            if (!successImgs) {
                successImgs = [];
            }
            for (i = 0; i < downloadedImgs.length; i++) {
                successImgs.push(downloadedImgs[i]);
            }
        }
    }
    
    if ((successImgs && successImgs.length > 0) || (failedImgs && failedImgs.length) || absolutePaths.length > 0){
        text += '\n' + system.functions.scmsg('14', 'CaseExchange', []) + '\n';
        
        if (successImgs && successImgs.length > 0) {
            text += '(' + system.functions.scmsg('15', 'CaseExchange', [successImgs.length, array2str(successImgs)]) + ')\n';
        }
        
        if (failedImgs && failedImgs.length > 0) {
            text += '(' + system.functions.scmsg('16', 'CaseExchange', [failedImgs.length, array2str(failedImgs)]) + ')\n';
        }
        
        if (absolutePaths.length > 0) {
            text += '( ' + system.functions.scmsg('17', 'CaseExchange', [array2str(absolutePaths)]) + ')\n';
        }
    }

    return _.unescapeHTML(text);
}

/**
* replace all invisible characher except space
**/
function replaceInvisible(match, $1) {
    if(match === ' '){
        return match;
    }
    return '';
}


/** 
*   This fuction is to process the field in outbound process if the mapped field in SAW is a rich text
*   1. Retrieve the original SAW text from context
*   2. Merge the original SAW text with SM text
*
*   @param {context} - Context obj of smis
*   @param {fieldname} - field name
*   @param {text} - value of the text
*   @return - The converted text
*   @type - String
*/
function processOutboundText(context, fieldName, text) {
    var sawText = '';
    if (fieldName === 'description') {
        if (!context.externalReferences.customField1) {
            return text;
        }
        sawText = context.externalReferences.customField1;
    } else if (fieldName === 'solution') {
        if (!context.externalReferences.customField2) {
            return text;
        }
        sawText = context.externalReferences.customField2;
    }

    text = _.escapeHTML(text);
    
    //replace all \n to <br/>
    text = text.replace(/\n/g, '<br />');

    sawText = mergeText(sawText, text);
    return sawText;
}



/** 
*   This fuction is to merge the SM text with SAW text
*   1. If SAW text has no placeholder, append with SM text directly
*   2. If SAW already has the placeholder, replace exsted one with SM text
*
*   @param {sawText} - Original SAW text
*   @param {smText} - SM text
*   @return - The merged text
*   @type - String
*/
function mergeText(sawText, smText) {
    var smTextNew = SM_TEXT_START + '<br />' + smText + '<br />' + SM_TEXT_END + '<br />';
    var regStr = '\\' + SM_TEXT_START + '([\\s\\S]*?)\\' + SM_TEXT_END + '';
    var reg = new RegExp(regStr, 'g');
    
    var text = '';
    
    if (reg.test(sawText)) {
        text = sawText.replace(reg, smTextNew);
    } else {
        text = sawText + smTextNew;
    }
    return text;
}


/** 
*   Download the embled in SAW description/solution image data as an SM attachment.
*
*   @param {imgURLArray} includes the url of images.
*   @return - {result} download attachment result
*/

function downloadSAWImage(param,context,imgURLArray)
{
    var faildImgs = [];
    var succImgs = [];
    var hasDownload = [];
    
    var imgInfors = []; 
    var restRequest = new (lib.CaseExchange_RestRequest.getClass())(param);
    var baseUrl = param.baseURL;
    var timeout = param.attachTimeout;
    var attachUrl =lib.smis_CommonLib.processPlaceholder(null,null,param,context,param['attachRestURL']);
    
    if (imgURLArray != null && imgURLArray.length > 0)
    {
        var attachRelation = getAttachRelationsById(context.externalId);//ep['properties.Id']);
        //Init image key array
        if (context.sawKeys == undefined || context.sawKeys == null)
        {
            context.sawKeys = [];
        }
        //Init image media data array
        if (context.mediaData == undefined || context.mediaData == null)
        {
            context.mediaData = [];
        }

        var i, j;               
        for (i = 0; i < imgURLArray.length; i++)
        {
            // TODO it might be safe to first rule out embedded image payload identified by the "data:" URL schedme (see RFC 2397)  
            
            var regSawUrl = new RegExp("/rest/"); 
            //This image is an internal image data
            if (regSawUrl.test(imgURLArray[i]))
            {
                var imgName = "";
                var imgID = "";
                try
                {
                    var index = imgURLArray[i].lastIndexOf("/");
                    imgID = imgURLArray[i].substring(index+1);
                    var hasAttachRelation = false;
                    //If the images which embled in description/solution has downloaded or not. 
                    if (attachRelation != null)
                    {
                        var attachIds = attachRelation.ids;
                        var attachNames = attachRelation.names;
                        
                        for (j = 0; j < attachIds.length; j++)
                        {
                            if (attachIds[j] == imgID)
                            {
                                hasDownload.push(attachNames[j]);
                                hasAttachRelation = true;
                                break;
                            }
                        }
                    }
                    //If the impage has been downloaded in SM, We will ignore it.
                    if (hasAttachRelation)
                    {
                        continue;
                    }
                    var imageDataUrl = baseUrl+attachUrl+imgID;
                    var responseHeader = {};
                    var imgData = restRequest.doAttachInboundRequest(lib.CaseExchangeConstants.HTTP_ACTION_GET(),imageDataUrl,timeout,responseHeader,null);
                    imgName = responseHeader['fs_filename'];
                    var imgAttach = new Attachment();
                    imgAttach.type = responseHeader['content-type'];
                    imgAttach.name = imgName;
                    imgAttach.value = imgData;
                    //
                    var isProcessed = false;
                    if (context.sawKeys != null && context.sawKeys.length > 0)
                    {
                        for (j = 0; j < context.sawKeys.length;j++)
                        {
                            if (context.sawKeys[j] == imgID)
                            {
                                succImgs.push(imgName);
                                isProcessed = true;
                                break;
                            }
                        }
                    }
                    //If the array included two or more same image url, we will process the image one time.
                    if (isProcessed)
                    {
                        continue;
                    }
                    context.sawKeys.push(imgID);
                    context.mediaData.push(imgAttach);
                    succImgs.push(imgName);
                }
                catch(ex)
                {
                    //If the image is null, we will put the id instead.
                    if (imgName != null && imgName != "")
                    {
                        faildImgs.push(imgName);
                    }
                    else
                    {
                        faildImgs.push(imgID);
                    }
                }
            }
        }
        imgInfors.push(succImgs);
        imgInfors.push(faildImgs);
        imgInfors.push(hasDownload);
    }
    return imgInfors;
}

 /**
 * Function:Update the task attachment id to incident attachment id.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date    20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function getAttachRelationsById(externalid)
{
    var attachInfor = {};
    var existedAttaIds = [];
    var existedAttaNames = [];
    
    var sql ="externalId=\""+externalid+"\" and active=true";
    var reference = new SCFile("ExternalReferences", SCFILE_READONLY);
    reference.setFields(["internalId"]);
    var ret = reference.doSelect(sql);
    
    sql = "externalid=\""+externalid+"\"";
    if (ret == RC_SUCCESS && reference.internalId != null && reference.internalId != "")
    {
        sql = sql + " and internalid=\""+reference.internalId+"\"";
    }
    var attRelation = new SCFile("AttachmentRelationship", SCFILE_READONLY);
    attRelation.setFields(["epattachid","filenameinep"]);
    ret = attRelation.doSelect(sql);
    if (ret == RC_SUCCESS)
    {
        do{
            if (attRelation.epattachid != null && attRelation.epattachid != "")
            {
                existedAttaIds.push(attRelation.epattachid);
                existedAttaNames.push(attRelation.filenameinep);
            }
        }while(attRelation.getNext() == RC_SUCCESS);
    }
    attachInfor.ids = existedAttaIds;
    attachInfor.names = existedAttaNames;
    
    return attachInfor;
}


/** 
*   Create Sm attachments and link it to tickets(Incident/Change/Problem, ETC)
*
*   @param {imgURLArray} includes the url of images.
*   @return - {result} download attachment result
*/

function linkSawImageToTickets(file,ep,context,param)
{
    if (context != null && file != null)
    {
        var attachIDs = context.sawKeys;
        var attachObjs = context.mediaData;

        if (attachIDs != null && attachObjs != null && 
            attachIDs.length > 0 && attachObjs.length > 0)
        {
            var i;
            for (i = 0; i < attachObjs.length; i++)
            {
                try
                {
                    var smattachid = file.insertAttachment(attachObjs[i]);
                    var attachRelation = {};
                    attachRelation.smattachid = smattachid;
                    attachRelation.epattachid = attachIDs[i];
                    attachRelation.internalid = file[param['internalId']];
                    attachRelation.createdby = lib.CaseExchangeConstants.CREATE_BY_EP();
                    attachRelation.filenameinsm = attachObjs[i]['name'];
                    attachRelation.filenameinep = attachObjs[i]['name'];
                    attachRelation.smisInstanceId = context.intId;//SMIS Instance id
                    attachRelation.internalObject = param['object'];//SM Table name
                    attachRelation.externalid = context.externalId;
                    attachRelation.removedinsm = false;
                    attachRelation.removedinep = false;
                    
                    attachRelation.createdate = system.functions.tod();
                    lib.CaseExchange_AttachRelationShip.createAttachRelationShip(attachRelation);
                }
                catch(ex)
                {
                    logger.error("Link image "+attachObjs[i]['name']+" to ticket "+file[param['internalId']]+" faild.");
                    logger.error("Link failure reason:"+ex);
                }       
            }
        }
    }
    if (context != null)
    {
        context.sawKeys = null;
        context.mediaData = null;
    }
}