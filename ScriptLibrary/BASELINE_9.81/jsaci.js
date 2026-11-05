var IDOLURLParser = lib.IDOLURLParser.require();


//*************************part 1 common function***************************

function stringToArray(str) {
    var start = 0;
    var npos = str.indexOf(",");
    var ar = [];
    while (npos != -1) {
        var item = str.substring(start, npos);
        if (item != "") {
            ar.push(item);
        }
        start = npos + 1;
        npos = str.indexOf(",", start);
    }
    if (str != "") {
        var last = str.substring(start, str.length);
        if (last != "") {
            ar.push(last);
        }
    }
    return ar;
}

function getOEMKey() {
    var key = vars.$G_IDOL_OEM_KEY;
    if (key == null || key == "") {
        var f = new SCFile("idolserverinfo", SCFILE_READONLY);
        var rc = f.doSelect(true);
        if (rc == 0) {
            vars.$G_IDOL_SERVER = f.server_url;
            vars.$G_USE_IDOL_OEM_LICENSE = f.use_oem_license;
            vars.$G_IDOL_OEM_KEY = f.oem_license_key;
            key = f.oem_license_key;
        }
    }
    return key;
}

function arrayToString(ar) {
    var str = "";
    for (var i = 0; i < ar.length; i++) {
        if (str != "") {
            str += ",";
        }
        str += ar[i];
    }
    return str;
}

function clearIDOLServer() {
    vars.$G_IDOL_SERVER = null;
    vars.$G_IDOL_INDEXSERVER = null;
}

function setIDOLServer(url) {
    vars.$G_IDOL_SERVER = url;
}

function setIDOLOEMLicenseFlag(isoem) {
    vars.$G_USE_IDOL_OEM_LICENSE = isoem;
}

function getIDOLOEMLicenseFlag() {
    var isoem = vars.$G_USE_IDOL_OEM_LICENSE;
    if (isoem == null) {
        var f = new SCFile("idolserverinfo", SCFILE_READONLY);
        var rc = f.doSelect(true);
        if (rc == 0) {
            vars.$G_IDOL_SERVER = f.server_url;
            vars.$G_USE_IDOL_OEM_LICENSE = f.use_oem_license;
            vars.$G_IDOL_OEM_KEY = f.oem_license_key;
            isoem = f.use_oem_license;
        }
    }
    if (isoem == null) {
        return false;
    }
    return isoem;
}

function setIDOLIndexServer(url) {
    vars.$G_IDOL_INDEXSERVER = url;
}

function getIDOLServerUrl() {
    var url = vars.$G_IDOL_SERVER;
    if (url == null || url == "") {
        var f = new SCFile("idolserverinfo", SCFILE_READONLY);
        var rc = f.doSelect(true);
        if (rc == 0) {
            vars.$G_IDOL_SERVER = f.server_url;
            url = vars.$G_IDOL_SERVER;
            vars.$G_USE_IDOL_OEM_LICENSE = f.use_oem_license;
            vars.$G_IDOL_OEM_KEY = f.oem_license_key;
        }
    }
    return url;
}

function getDistributeNameAndValue(dbname) {
    // var ret =[];
    // var engines = getDistributeType();
    // var distributefieldname = "ContentStore";
    // var distributevalue = "CONTENT";
    // var distributesavevalue = "CONTENT"
    // if(engines.length > 0)
    // {
    //   var existingengine = getVDBEngine(dbname);
    //   //read config from server
    //   var fserver = new SCFile("idolserverinfo");
    //   var myrc = fserver.doSelect(true);
    //   if(myrc == RC_SUCCESS)
    //   {
    //     var lastengine =-1;
    //     if(fserver.distribute_field_name != null && fserver.distribute_field_name !="")
    //     {
    //       distributefieldname=fserver.distribute_field_name;
    //     }
    //     if(fserver.distribute_field_value != null && fserver.distribute_field_value !="")
    //     {
    //       distributesavevalue=fserver.distribute_field_value;
    //     }
    //     if(fserver.last_index_number != null)
    //     {
    //       lastengine = fserver.last_index_number;
    //     }
    //     var isfind = false;
    //     var e=0;
    //     for(e=0;e<engines.length;e++)
    //     {
    //       if( lastengine == engines[e])
    //       {
    //         isfind = true;
    //         break;
    //       }
    //     }
    //     var useengine = -1;
    //     if(isfind && e < (engines.length-1))
    //     {
    //       distributevalue = distributesavevalue+engines[e+1];
    //       useengine = engines[e+1];
    //       fserver.last_index_number = parseInt(engines[e+1]);
    //     }
    //     else
    //     {
    //       distributevalue = distributesavevalue+engines[0];
    //       useengine = engines[0];
    //       fserver.last_index_number = parseInt(engines[0]);
    //     }
    //     if(existingengine == -1)
    //     {
    //       addVDB(dbname, useengine);
    //     }
    //     else
    //     {
    //       fserver.last_index_number = existingengine;
    //       distributevalue = distributesavevalue+existingengine;
    //     }
    //     fserver.doUpdate();
    //   }
    // }
    // else
    // {
    //   distributefieldname="";
    //   distributevalue = "";
    // }
    // ret.push(distributefieldname);
    // ret.push(distributevalue);
    // return ret;

    var IDOLClientFactory = lib.IDOLClientFactory.require();
    var client = IDOLClientFactory.create('SmartTicket');
    var pair = client.getDistributeNameAndValue(dbname);
    var key = 'ContentStore',
        value = pair[key];
    return [key, value];
}

function setCategoryLogFlag(n) {
    vars.$G_CATE2IDOL_LOG_FLAG = n;
}

function myPrint(strmsg) {
    var rte = new Datum(2);
    funcs.rtecall("log", rte, "[acicategory] " + strmsg);
}

function getIDOLServerIndexUrl() {
    var url = vars.$G_IDOL_INDEXSERVER;
    if (url == null || url == "") {
        var serverurl = getIDOLServerUrl();
        var npos = serverurl.lastIndexOf(":");
        if (npos != -1) {
            serverurl = serverurl.substring(0, npos);
            serverurl = serverurl + ":" + getServerIndexPort() + "/";
            vars.$G_IDOL_INDEXSERVER = serverurl;
            url = vars.$G_IDOL_INDEXSERVER;
        } else {
            myPrint("Please configure IDOL server address first");
        }
    }
    return url;
}

function makeParameterMap(str) {
    var params = str.split("&");
    var ret = [];
    for (var i = 0; i < params.length; i++) {
        var onepos = params[i].indexOf("=");
        if (onepos != -1) {
            var hd = new Header(params[i].substring(0, onepos), params[i].substring(onepos + 1, params[i].length));
            ret.push(hd);
        }
    }

    return ret;
}

function runIDOLAction(url, ispost, isbig) {
    var result = null;
    try {
        var nstart = 0;
        var ishttps = false;

        if (url.toLowerCase().indexOf("http://") == 0) {
            nstart = 7;
        } else if (url.toLowerCase().indexOf("https://") == 0) {
            nstart = 8;
            ishttps = true;
        }
        var nend = url.indexOf("/", nstart);

        if (nend == -1) {
            return getWrongUrlMessage();
        }

        var idolServerEP = IDOLURLParser.parse(url);

        var host = idolServerEP.host;
        var port = idolServerEP.port;

        nstart = url.toLowerCase().indexOf("/action=");
        if (nstart == -1) {
            nstart = url.toLowerCase().indexOf("/a=");
            if (nstart != -1) {
                nstart += 3;
            }
        } else {
            nstart += 8;
        }
        if (nstart == -1) {
            var headers = [];
            //no action 
            url = url.replace(/ /g, "%20");
            if (!ispost) {
                result = doHTTPRequest("GET", url, headers, "", 3, 5, 5);
            } else {
                result = doHTTPRequest("POST", url, headers, "", 3, 60, 5);
            }
            return result;
        }
        nend = url.indexOf("&", nstart);
        var strParameters = "";
        if (nend == -1) {
            nend = url.length;
        } else {
            strParameters = url.substring(nend + 1, url.length);
        }
        var straction = url.substring(nstart, nend);

        var hds = null;
        if (strParameters != "") {
            hds = makeParameterMap(strParameters);
        }
        var connecttimeout = 3;
        var readtimeout = 10;
        if (isbig != undefined && isbig == true) {
            connecttimeout = 10;
            readtimeout = 60;
        }
        if (!ispost) {
            result = doIDOLRequest(host, port, straction, hds, false, connecttimeout, readtimeout, true, ishttps, "", getOEMKey());
        } else {
            result = doIDOLRequest(host, port, straction, hds, true, connecttimeout, readtimeout, true, ishttps, "", getOEMKey());
        }
    } catch (e) {
        throw e;
    }

    return result;
}

function sendRequestToIDOL(url, strdata, isbig) {
    var result = null;
    var headers = [];
    try {
        //no data, get function first
        var hasaction = false;
        if (strdata == "" && url.toLowerCase().indexOf("/action=") != -1) {
            hasaction = true;
        } else if (strdata != "" && strdata.toLowerCase().indexOf("action=") == 0) {
            hasaction = true;
        }
        var nStart = 0;
        var ishttps = false;
        if (url.toLowerCase().indexOf("http://") == 0) {
            nStart = 7;
        } else if (url.toLowerCase().indexOf("https://") == 0) {
            nStart = 8;
            ishttps = true;
        }

        var nEnd = url.indexOf("/", nStart);
        if (nEnd == -1) {
            return getWrongUrlMessage();
        }

        var idolServerEP = IDOLURLParser.parse(url);
        var host = idolServerEP.host;
        var port = idolServerEP.port;

        if (hasaction && getIDOLOEMLicenseFlag()) {
            nStart = url.toLowerCase().indexOf("action=", nStart);
            var straction = "";
            var strParameters = "";
            if (nStart == -1 && strdata != "") {
                nStart = strdata.indexOf("=");
                nEnd = strdata.indexOf("&");
                if (nEnd == -1) {
                    nEnd = strdata.length;
                } else {
                    strParameters = strdata.substring(nEnd + 1, strdata.length);
                }
                straction = strdata.substring(nStart + 1, nEnd);

            } else {
                nEnd = url.indexOf("&");
                if (nEnd == -1) {
                    nEnd = url.length;
                } else {
                    strParameters = url.substring(nEnd + 1, url.length);
                }
                straction = url.substring(nStart + 7, nEnd);
            }

            var hds = null;
            if (strParameters != "") {
                hds = makeParameterMap(strParameters);
            }

            var connecttimeout = 3;
            var readtimeout = 5;
            if (isbig != undefined && isbig == true) {
                connecttimeout = 10;
                readtimeout = 60;
            }
            if (strdata == "") {
                result = doIDOLRequest(host, port, straction, hds, false, connecttimeout, readtimeout, true, ishttps, "", getOEMKey());
            } else {
                result = doIDOLRequest(host, port, straction, hds, true, connecttimeout, readtimeout, true, ishttps, "", getOEMKey());
            }
        } else {
            url = url.replace(/ /g, "%20");
            if (strdata == "") {
                result = doHTTPRequest("GET", url, headers, "", 10, 20, 60);
            } else {
                result = doHTTPRequest("POST", url, headers, strdata, 10, 60, 60);
            }
        }
    } catch (e) {
        var rte = new Datum(2);
        funcs.rtecall("log", rte, "[acicategory] " + e);
        print(funcs.scmsg("sendRequestToIDOL", "jsaci"));

        return null;
    }

    return result;
}

function encodeStringForFieldText(strsource) {
    var strdest = strsource.replace(/%/g, "%25");
    strdest = strdest.replace(/\\/g, "%5C");
    strdest = strdest.replace(/,/g, "%252C");
    strdest = strdest.replace(/&/g, "%26");
    strdest = strdest.replace(/{/g, "%257B");
    strdest = strdest.replace(/}/g, "%257D");

    return strdest;
}

function encodeStringForText(strsource) {
    var strdest = strsource.replace(/&/g, "26%");
    strdest = strdest.replace(/~/g, " ");
    strdest = strdest.replace(/\[/g, " ");
    strdest = strdest.replace(/\]/g, " ");
    strdest = strdest.replace(/\*/g, " ");
    strdest = strdest.replace(/\?/g, " ");
    strdest = strdest.replace(/:/g, " ");
    strdest = strdest.replace(/\(/g, " ");
    strdest = strdest.replace(/\)/g, " ");
    strdest = strdest.replace(/\"/g, " ");
    return strdest;
}

function encodeStringForCategory(strsource) {
    var strdest = encodeURIComponent(strsource);

    return strdest;
}

function decodeStringForCategory(strsource) {
    var strdest = decodeURIComponent(strsource);

    return strdest;
}

function getNumValueFromHeader(head) {
    return parseInt(head.value);
}

//check a head->value is less than any of a array, if is, put it in
function checkMinValueForArray(head, ar, maxlen) {
    if (ar.length < maxlen) {
        ar.push(head);
    } else if (getNumValueFromHeader(head) < getNumValueFromHeader(ar[ar.length - 1])) {
        ar[ar.length - 1] = head;
    } else {
        return;
    }
    for (var n = ar.length - 1; n >= 1; n--) {
        if (getNumValueFromHeader(ar[n]) < getNumValueFromHeader(ar[n - 1])) {
            var tmp = ar[n];
            ar[n] = ar[n - 1];
            ar[n - 1] = tmp;
        }
    }
}

//check a head->value is bigger than any of a array, if is, put it in
function checkMaxValueForArray(head, ar, maxlen) {
    if (ar.length < maxlen) {
        ar.push(head);
    } else if (getNumValueFromHeader(head) > getNumValueFromHeader(ar[ar.length - 1])) {
        ar[ar.length - 1] = head;
    } else {
        return;
    }
    for (var n = ar.length - 1; n >= 1; n--) {
        if (getNumValueFromHeader(ar[n]) > getNumValueFromHeader(ar[n - 1])) {
            var tmp = ar[n];
            ar[n] = ar[n - 1];
            ar[n - 1] = tmp;
        }
    }

}

function isExistingInArray(ar, value) {
    for (var n = 0; n < ar.length; n++) {
        if (ar[n] == value) {
            return true;
        }
    }
    return false;
}

//generate a random number array from 1 to imax,size is inum)
function generateRandomArray(imax, inum) {
    var ar = [];
    for (var i = 0; i < inum; i++) {
        var value = parseInt(Math.random() * imax + 1);
        while (isExistingInArray(ar, value)) {
            value = parseInt(Math.random() * imax + 1);
        }
        ar.push(value);

        for (var n = ar.length - 1; n >= 1; n--) {
            if (ar[n] < ar[n - 1]) {
                var tmp = ar[n];
                ar[n] = ar[n - 1];
                ar[n - 1] = tmp;
            }
        }

    }

    return ar;
}

//*******************XML parese function**************
function getResponsedata(result) {
    var ret = null;
    var child = result.getFirstChildElement();

    while (child != null) {
        if (child.getNodeName() == "responsedata") {
            return child;
        }

        child = child.getNextSiblingElement();
    }

    return ret;
}

function findFirstNamedItem(item, name) {
    var ret = null;
    var child = item.getFirstChildElement();
    while (child != null) {
        if (child.getNodeName() == name) {
            return child;
        }
        child = child.getNextSiblingElement();
    }
    return ret;
}

function getFirstNamedItemValue(item, name) {
    var child = item.getFirstChildElement();
    while (child != null) {
        if (child.getNodeName() == name) {
            return child.getNodeValue();

        }
        child = child.getNextSiblingElement();
    }
    return "";
}

function retriveall2(ret, item, ar) {
    var child = item.getFirstChildElement();
    var ret2 = "";
    while (child !== null) {
        if (child.getNodeName() === "title") {
            ret.push(child.getNodeValue());
        }
        if (child.getNodeName() === "id") {
            ret2 = child.getNodeValue();
        }
        if (child.getNodeName() === "weight" && ar.length < 2) {
            ar.push(100 * parseFloat(child.getNodeValue()));
        }
        if (child.getNodeName() === "links" && ar.length < 2) {
            ar.push(child.getNodeValue());
        }

        child = child.getNextSiblingElement();
    }
    return ret2;
}

//**************************************IDOL function for category***********************************
function checkCategoryStatus(id) {
    if (checkIndexComponent(getIDOLServerIndexUrl()) == false) {
        myPrint("maybe due to wrong configuration, index component is not ready to use now!");
        return false;
    }
    var result = sendRequestToIDOL(getIDOLServerUrl() + "action=CategoryGetHierDetails&Category=" + id, "");
    if (result == null) {
        myPrint("checkCategoryStatus [" + id + "] timeout");

        return false;
    } else {
        var xml = new XML();
        xml.setContent(result);
        if (getFirstNamedItemValue(xml, "response") == "SUCCESS") {
            return true;
        }
    }

    return false;
}

function getTrainingWeightForDoc(categoryid, docid, docref, outar, taxtonomy) {
    var strurl = getIDOLServerUrl() + "action=CategorySuggestFromDocument";
    if (docref == "") {
        strurl += "&DocID=" + docid;
    } else {
        strurl += "&DocRef=" + docref;
    }
    if (taxtonomy != null && taxtonomy != "") {
        strurl += "&TaxonomyName=" + taxtonomy;
    }
    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        myPrint("getTrainingWeightForDoc [" + docid + "] timeout");

        return -1;
    }

    var xml = new XML();
    xml.setContent(result);
    if (findFirstNamedItem(xml, "response") != null && getFirstNamedItemValue(xml, "response") != "SUCCESS") {
        return 0;
    }
    var child = getResponsedata(xml);

    if (child != null) {

        var item = findFirstNamedItem(child, "hit");
        if (item != null) {
            var id = getFirstNamedItemValue(item, "id");
            var terms = getFirstNamedItemValue(item, "links");
            var weight = parseInt(parseFloat(getFirstNamedItemValue(item, "weight")) * 100);
            outar.push(id);
            outar.push(terms);
            outar.push(weight);
            if (categoryid.toString() != id) {
                return 0; //get wrong category
            } else {
                return weight;
            }

        }
    }

    return 0;
}


// if index =-1, check the system's index status
// return value 1 means can't get response or server is die
// 2 means is busy to handle index
// 0 index finish
function checkIndexStatus(index) {
    queryStr = "action=indexergetstatus"
    if (index != null && index > 0) {
        queryStr += "&index=" + index;
    } else {
        queryStr += "&MaxResults=20";
    }
    result = sendRequestToIDOL(getIDOLServerUrl() + queryStr, "");
    if (result == null) {
        return 1;
    }
    var ret = 2;
    var xml = new XML();
    xml.setContent(result);
    var child = getResponsedata(xml);
    if (child != null) {
        var item = findFirstNamedItem(child, "item");
        var statusnow = getFirstNamedItemValue(item, "status");
        if (statusnow == "-4") {
            throw "Index data fail due to database name error!";
        } else if (statusnow == "-5") {
            throw "Index data fail due to bad parameter!";
        }
        if (statusnow == "-1" || statusnow == "-37" || "-10" == statusnow) {
            ret = 0;
        }
    }
    return ret;
}

function setBooleanTraining(id, str) {
    var strdata = "action=CategorySetTraining&Category=" + id + "&Boolean=" + str + "&BuildNow=true";

    var result = sendRequestToIDOL(getIDOLServerUrl(), strdata, true);
    if (result == null) {}
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("setBooleanTraining for [" + id + "] successfully ");
            isokay = true;
        } else {
            myPrint("setBooleanTraining for category [" + id + "] fail , result is: " + result);
        }
    }
    return isokay;
}

function getCategoryDetail(id) {
    var strurl = getIDOLServerUrl() + "action=CategoryGetDetails&Category=" + id;

    var result = sendRequestToIDOL(strurl, "");
    var ret = [];
    if (result == null) {
        return ret;
    }
    var xml = new XML();
    xml.setContent(result);
    var retcode = getFirstNamedItemValue(xml, "response");
    if (retcode != "SUCCESS") {
        return ret;
    }
    var resdata = getResponsedata(xml);
    var paras = findFirstNamedItem(resdata, "categoryparameters");
    if (paras != null) {
        var item = paras.getFirstChildElement();
        while (item != null && ret.length < 2) {
            if ("name" == item.getNodeName()) {
                ret[0] = item.getNodeValue();
            } else if ("taxonomyroot" == item.getNodeName()) {
                ret[1] = decodeStringForCategory(item.getNodeValue());
            }

            item = item.getNextSiblingElement();
        }
    }

    return ret;
}

function setRootTaxonomy(id) {
    var strurl = getIDOLServerUrl() + "action=CategorySetDetails&Category=" + id + "&TaxonomyRoot=true";

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {}
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("setRootTaxonomy for [" + id + "] successfully ");
            isokay = true;
        } else {
            myPrint("setRootTaxonomy for category [" + id + "] fail , result is: " + result);
        }
    }
    return isokay;
}

// if terms or weight is empty, it mean remove the modify
function setCategoryTermWeight(id, terms, weight) {
    var strPost = "action=CategorySetTNW&Category=" + id;
    if (weight != "" && terms != "") {
        strPost += "&Terms=" + terms + "&Weights=" + weight;
    }
    strPost += "&BuildNow=true"

    var result = sendRequestToIDOL(getIDOLServerUrl(), strPost);
    if (result == null) {
        myPrint("get the result timeout for setCategoryTermWieght [" + id + "]  with terms " + terms);

    }
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("setCategoryTermWieght for [" + id + "] successfully with terms " + terms);
            isokay = true;
        } else {
            myPrint("setCategoryTermWieght for category [" + id + "] fail with terms " + terms + " result is: " + result);
        }
    }
    return isokay;
}

function trainingCategoryByPost(id, docs, refers) {
    var strPost = "action=CategorySetTraining&Category=" + id;
    if (docs != "") {
        strPost += "&DocID=" + docs + "&BuildNow=true";
    } else if (refers != "") {
        strPost += "&DocRef=" + refers + "&BuildNow=true";
    }

    var result = sendRequestToIDOL(getIDOLServerUrl(), strPost, true);
    if (result == null) {
        myPrint("get the result timeout for traing category [" + id + "]  with reference " + refers);

    }
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("training category [" + id + "] successfully with reference " + refers);
            isokay = true;
        } else {
            myPrint("traing category [" + id + "] fail with reference " + refers + " result is: " + result);
        }
    }
    return isokay;
}

function trainingCategoryByTerms(id, terms) {
    var strPost = "action=CategorySetTraining&Category=" + id + "&Training=" + terms + "&BuildNow=true";

    var result = sendRequestToIDOL(getIDOLServerUrl(), strPost, true);
    if (result == null) {
        myPrint("get the result timeout for traing category [" + id + "]  with terms " + terms);
    }
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("training category [" + id + "] successfully with terms " + terms);
            isokay = true;
        } else {
            myPrint("traing category [" + id + "] fail with terms " + terms + " result is: " + result);
        }
    }
    return isokay;
}

function getCategoryIDByName(catename, parentid) {
    var result = sendRequestToIDOL(getIDOLServerUrl() + "action=CategoryFind&Name=" + encodeStringForCategory(catename) + "&parent=" + parentid, "");
    if (result == null) {
        myPrint("getCategoryIDByName fail for category [" + catename + "]");

        return -2;
    }

    var xml = new XML();
    xml.setContent(result);
    var child = getResponsedata(xml);
    if (child != null) {
        var item = child.getFirstChildElement();
        if (item != null && "id" == item.getNodeName()) {
            return parseInt(item.getNodeValue())
        }
    }
    return -1;
}

function getCategoryTermWeight(id) {
    var hd = new Header();
    var result = sendRequestToIDOL(getIDOLServerUrl() + "action=CategoryGetTNW&Category=" + id, "");
    if (result == null) {
        myPrint("getCategoryTermWeight fail for category [" + id + "]");

        return hd;
    }

    var xml = new XML();
    xml.setContent(result);
    var child = getResponsedata(xml);
    if (child != null) {
        var item = child.getFirstChildElement();
        while (item != null) {
            if ("generatedterms" == item.getNodeName()) {
                hd.name = item.getNodeValue();
            }

            if ("generatedweights" == item.getNodeName()) {
                hd.value = item.getNodeValue();
                break;
            }

            item = item.getNextSiblingElement();
        }
    }
    return hd;
}

function getIndexID(response) {
    var indexResult = response.toLowerCase();
    if (indexResult.indexOf("indexid=") === 0) {
        return indexResult.split("=")[1]
    } else {
        return -1;
    }
}

function flushIndexData() {
    var strurl = getIDOLServerIndexUrl() + "DRESYNC?";

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        myPrint("get result timeout for flushIndexData");
    }
    indexID = getIndexID(result);
    myPrint("flushIndex get indexid:" + indexID);
    return indexID;
}


function IndexDataToIdol(database, strdata) {
    var strurl = getIDOLServerIndexUrl() + "DREADDDATA?&DREDBNAME=" + database + "&CreateDatabase=TRUE";

    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        myPrint("get result timeout for index data");

    }
    return result;
}

function removeAllDataFromDatabase(database) {
    var strurl = getIDOLServerIndexUrl() + "DREDELDBASE?DREDbName=" + database;

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        myPrint("get result timeout for removeAllDataFromDatabase");
    }

    return result;
}

function compactData() {
    var strurl = getIDOLServerIndexUrl() + "DRECOMPACT";

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        myPrint("get result timeout for compactData");
    }

    return result;
}

function createOneCategory(name, id, parentid) {
    var strurl = getIDOLServerUrl();
    var strdata = "action=CategoryCreate&Name=" + encodeStringForCategory(name) + "&Category=" + id;
    if (parentid > 0) {
        strdata += "&parent=" + parentid;
    }
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        myPrint("get result timeout when create category [" + name + "] with id [" + id + "] ");
    }
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("create category [" + name + "] with [" + id + "] successfully.");
            isokay = true;
        } else {
            myPrint("create category [" + name + "] with [" + id + "] fail.error is \n" + result);

        }
    }
    return isokay;
}


function getServerIndexPort() {
    var strurl = getIDOLServerUrl() + "action=getStatus";

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        return "9001";
    }

    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var response = getResponsedata(xml);
        if (response != null) {
            var port = getFirstNamedItemValue(response, "indexport");
            if (port != null) {
                return port;
            }
        }

    }
    return "9001";
}


function getServerCategoryPort() {
    var strurl = getIDOLServerUrl() + "action=getStatus";
    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        return "9020";
    }

    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var response = getResponsedata(xml);
        if (response != null) {
            var componentNode = findFirstNamedItem(response, "component")
            var categoryNode = findFirstNamedItem(componentNode, "category");
            var port = getFirstNamedItemValue(categoryNode, "aciport");

            return port;
        }

    }
    return "9020";
}


function getCategoryTrainingStatus(id) {
    var strurl = getIDOLServerUrl() + "action=categorygettraining&category=" + id;

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        return false;
    }

    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            return true;
        }

    }
    return false;
}

function getCategoryTraining(id) {
    var strurl = getIDOLServerUrl() + "action=categorygettraining&category=" + id;

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        return false;
    }

    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var response = getResponsedata(xml);
        if (response != null && findFirstNamedItem(response, "trainingdoc") != null) {
            return true;
        } else if (response != null && findFirstNamedItem(response, "trainingtext") != null) {
            return true;
        }

    }
    return false;
}


function getBestTerms(referdocs, maxterm) {
    var strdata = "action=TermGetBest&Reference=" + referdocs + "&MaxTerms=" + maxterm;

    var result = sendRequestToIDOL(getIDOLServerUrl(), strdata);
    if (result == null) {
        return "";
    }
    var terms = "";
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var response = getResponsedata(xml);
        var term = findFirstNamedItem(response, "term");
        while (term != null) {
            if (terms != "") {
                terms += " ";
            }
            terms += term.getNodeValue();
            term = term.getNextSiblingElement();
        }
    }
    return terms;
}

function DeleteOneCategory(id) {
    var strurl = getIDOLServerUrl() + "action=CategoryDelete&Category=" + id + "&DeletedChildIDs=true";

    var result = sendRequestToIDOL(strurl, "");
    if (result == null) {
        myPrint("get result timeout when DeleteOneCategory with id [" + id + "] ");

        return false;
    }
    var isokay = false;
    if (result != null) {
        var xml = new XML();
        xml.setContent(result);
        var ret = getFirstNamedItemValue(xml, "response");
        if (ret == "SUCCESS") {
            myPrint("delete category [" + id + "] successfully.");
        }
        isokay = true;
    }
    return isokay;
}


function suggestCategory(querytext, taxonomy, dbname, category, subcategory, producttype, maxResult) {
    var strurl = getIDOLServerUrl();
    var strdata = "action=SuggestOnText&FieldText=MATCH{" + taxonomy + "}:SRCTAXONOMY&DatabaseMatch=" + dbname + "&MaxResults=" + maxResult + "&DetectLanguageType=true&print=all";

    var encodestr = encodeStringForText(querytext);
    strdata += "&Text=" + encodestr;
    var result = null;
    var ret = [];
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        return null;
    }
    var xml = new XML();
    xml.setContent(result);
    var response = getResponsedata(xml);
    if (response == null) {
        return ret;
    }
    var mycate = category.replace(/\./g, "_");
    mycate = mycate.toUpperCase();
    var mysubcate = null;
    if (subcategory != undefined && subcategory != null && subcategory != "") {
        mysubcate = subcategory.replace(/\./g, "_");
        mysubcate = mysubcate.toUpperCase();
    }
    var myprod = null;
    if (producttype != undefined && producttype != null && producttype != "") {
        myprod = producttype.replace(/\./g, "_");
        myprod = myprod.toUpperCase();
    }

    var item = findFirstNamedItem(response, "hit");
    while (item != null) {
        var content = findFirstNamedItem(item, "content");
        if (content != null) {
            var asugegst = [];
            var doc = findFirstNamedItem(content, "DOCUMENT");
            var prop = doc.getFirstChildElement();
            while (prop != null) {
                if (prop.getNodeName() == mycate) {
                    asugegst[0] = prop.getNodeValue();
                } else if (mysubcate != null && mysubcate == prop.getNodeName()) {
                    asugegst[1] = prop.getNodeValue();
                } else if (myprod != null && myprod == prop.getNodeName()) {
                    asugegst[2] = prop.getNodeValue();
                }

                if (asugegst.length == 1 && mysubcate == null && myprod == null) {
                    break;
                } else if (asugegst.length == 2 && mysubcate == null) {
                    break;
                } else if (asugegst.length == 3) {
                    break;
                }

                prop = prop.getNextSiblingElement();
            }
            if (asugegst.length > 0) {
                ret.push(asugegst);
            }
        }

        item = item.getNextSiblingElement();
    }

    return ret;
}

function queryCategory(querytext, ar, schema, taxonomy, numresult, catenames) {
    var strurl = getIDOLServerUrl();
    var strdata = "action=CategorySuggestFromText";
    if (schema !== -1) {
        strdata += "&schema=" + schema;
    }
    if (taxonomy != "" && taxonomy != "undefined") {
        strdata += "&TaxonomyName=" + encodeStringForCategory(taxonomy);
    }
    if (numresult > 0) {
        strdata += "&NumResults=" + numresult;
    }
    var encodestr = encodeStringForText(querytext);
    strdata += "&QueryText=" + encodestr + "&AgentBoolean=true&params=DetectLanguageType&values=true";
    var result = null;
    var ret = [];
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        return null;
    }

    var xml = new XML();
    xml.setContent(result);
    var child = xml.getFirstChildElement();
    var isokay = true;
    while (child !== null && isokay) {
        if (child.getNodeName() === "response") {
            if (child.getNodeValue() !== "SUCCESS") {
                ret.push(0);
                isokay = false;
                break;
            }
        }
        if (child.getNodeName() === "responsedata") {
            var strid = "";

            var response_child = child.getFirstChildElement();
            while (response_child !== null) {
                strid = retriveall2(catenames, response_child, ar);
                if (strid !== "") {
                    ret.push(parseInt(strid));
                }

                response_child = response_child.getNextSiblingElement();
            }
        }
        child = child.getNextSiblingElement();
    }

    return ret;
}

function getDistributeType() {
    var strurl = getIDOLServerUrl();
    var strdata = "action=getStatus";
    var result = null;

    var ret = [];
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        myPrint("Fail to connect to IDOL server!");
        return ret;
    }

    var xml = new XML();
    xml.setContent(result);
    var response = getResponsedata(xml);
    var component = findFirstNamedItem(response, "component");
    var hasdih = false;
    if (component != null) {
        var conent = findFirstNamedItem(component, "content");
        if (conent != null) {
            return ret;
        }
        if (findFirstNamedItem(component, "dih") != null) {
            hasdih = true;
        }
    }
    if (hasdih) {
        var engines = findFirstNamedItem(response, "engines");
        var engine = engines.getFirstChildElement();
        while (engine != null) {
            var str = getFirstNamedItemValue(engine, "status");

            if ("ONLINE" == str.toUpperCase()) {
                ret.push(getFirstNamedItemValue(engine, "number"));
            }
            engine = engine.getNextSiblingElement();
        }
    }

    return ret;
}

function getVDBEngine(vdbname) {
    var strurl = getIDOLServerUrl();
    var strdata = "action=VDBManagement&VDBAction=ShowStatus";
    var result = null;
    var ret = -1;
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        myPrint("Fail to connect to IDOL server!");
        return ret;
    }
    try {
        var xml = new XML();
        xml.setContent(result);
        var response = getResponsedata(xml);
        var vdbs = findFirstNamedItem(response, "vdbs");
        if (vdbs != null) {
            var vdb = findFirstNamedItem(vdbs, "vdb");
            while (vdb != null) {
                if (vdb.getAttributeValue("name") == vdbname) {
                    var maptos = findFirstNamedItem(vdb, "mapstos");
                    if (maptos != null) {
                        var map = findFirstNamedItem(maptos, "mapsto");
                        if (map != null) {
                            ret = parseInt(map.getAttributeValue("engine"));
                        }
                    }
                    break;
                }
                vdb = vdb.getNextSiblingElement();
            }
        }
    } catch (e) {}

    return ret;
}

function addVDB(vdbname, engine) {
    var strurl = getIDOLServerUrl();
    var strdata = "action=VDBManagement&VDBAction=VDBAdd&VDBName=" + vdbname + "&VDBType=Combinator&VDBMapsTo=" + engine + ":" + vdbname;
    var result = null;
    var ret = false;
    var result = sendRequestToIDOL(strurl, strdata);
    if (result == null) {
        myPrint("Fail to connect to IDOL server!");
        return ret;
    }

    var xml = new XML();
    xml.setContent(result);
    var child = xml.getFirstChildElement();

    while (child !== null) {
        if (child.getNodeName() === "response") {
            if (child.getNodeValue() == "SUCCESS") {
                ret = true;
            }
            break;
        }
        child = child.getNextSiblingElement();
    }

    return ret;
}

function checkIndexComponent(url) {
    url += "REUNDELETEDOC?docs=1";
    var headers = [];
    var result = null;
    try {
        result = doHTTPRequest("GET", url, headers, "", 10, 10, 10);
    } catch (e) {
        return false;
    }
    if (result != null) {
        return true;
    }
    return false;
}

function checkServerStatus(url, boem) {
    var result = null;
    var ispost = false;
    //var host ="";
    var ishttps = false;
    try {
        var nstart = 0;
        if (url.toLowerCase().indexOf("http://") == 0) {
            nstart = 7;
        } else if (url.toLowerCase().indexOf("https://") == 0) {
            nstart = 8;
            ishttps = true;
        }

        var nend = url.indexOf("/", nstart);
        if (nend == -1) {
            return getWrongUrlMessage();
        }

        var idolServerEP = IDOLURLParser.parse(url);
        var host = idolServerEP.host;
        var port = idolServerEP.port;

        if (boem == false) {
            var headers = [];
            //no action 
            url = url.replace(/ /g, "%20");
            if (!ispost) {
                result = doHTTPRequest("GET", url + "action=getstatus", headers, "", 10, 10, 10);
            } else {
                result = doHTTPRequest("POST", url + "action=getstatus", headers, "", 10, 10, 10);
            }

        }

        var hds = null;
        if (!ispost) {
            result = doIDOLRequest(host, port, "getStatus", hds, false, 10, 10, true, ishttps, "", getOEMKey());
        } else {
            result = doIDOLRequest(host, port, "getStatus", hds, true, 10, 10, true, ishttps, "", getOEMKey());
        }
    } catch (e) {
        return false;
    }
    if (result == null) {
        return false;
    }

    var xml = new XML();
    xml.setContent(result);
    var isokay = true;
    if (getFirstNamedItemValue(xml, "response") != "SUCCESS") {
        isokay = false;
    }
    if (isokay == false && boem == false && getFirstNamedItemValue(xml, "action") == "NONE") {
        print(funcs.scmsg("checkServerStatus_1", "jsaci"));
        return false;
    }
    var response = getResponsedata(xml);
    if (response != null) {
        if (isokay == false) {
            var err = findFirstNamedItem(response, "error");
            if (err != null) {
                if (boem && getFirstNamedItemValue(err, "errorcode") == "ERRORENCRYPTIONFAILED") {
                    print(funcs.scmsg("checkServerStatus_2", "jsaci"));
                    return false;
                } else {
                    var errstr = getFirstNamedItemValue(err, "errorstring");
                    if (errstr != null) {
                        print(errstr);
                    } else {
                        print(funcs.scmsg("checkServerStatus_3", "jsaci"));
                    }
                    return false;
                }
            }

        } else {
            var port = getFirstNamedItemValue(response, "indexport");
            if (port != null && port != "" && port != undefined) {
                var indexurl = "http://";
                if (ishttps) {
                    indexurl = "https://"
                }
                if (host.indexOf(":") > 0) {
                    indexurl += '[' + host + "]:" + port + "/";
                } else {
                    indexurl += host + ":" + port + "/";
                }
                if (checkIndexComponent(indexurl) == false) {
                    print(funcs.scmsg("checkServerStatus_3", "jsaci"));
                    return false;
                }

            }
        }
        var component = findFirstNamedItem(response, "component");

        if (isokay && component != null) {
            var comp = component.getFirstChildElement();
            while (comp != null) {
                var runstatus = getFirstNamedItemValue(comp, "status");
                if (runstatus == null) {
                    print(funcs.scmsg("checkServerStatus_6", "jsaci", [comp.getNodeName()]));
                    return false;
                }
                var upperstatus = runstatus.toUpperCase();
                if (upperstatus != "RUNNING") {
                    print(funcs.scmsg("checkServerStatus_4", "jsaci", [comp.getNodeName(), runstatus]));
                    return false;
                }
                comp = comp.getNextSiblingElement();
            }
        }
    } else if (boem && isokay == false) {
        print(funcs.scmsg("checkServerStatus_5", "jsaci"));
        return false;
    }

    return isokay;
}

function checkCurrentServerStatus(url, boem) {
    try {
        var result = runIDOLAction(url + 'action=getStatus', false, false);
    } catch (e) {
        return false;
    }

    if (result == null) {
        return false;
    }

    var xml = new XML();
    xml.setContent(result);
    var isokay = true;
    if (getFirstNamedItemValue(xml, "response") != "SUCCESS") {
        isokay = false;
    }
    if (isokay == false && boem == false && getFirstNamedItemValue(xml, "action") == "NONE") {
        print(funcs.scmsg("checkServerStatus_1", "jsaci"));
        return false;
    }

    return isokay;
}

function getWrongUrlMessage() {
    return "Wrong url!";
}