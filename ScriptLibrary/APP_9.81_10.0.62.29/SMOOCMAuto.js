/******************************************************
 * Module Name: SMOO
 * Function: SMOO Automatically execute OO flow
 * Author: Yang, Wen-Ying
 * Version: 1.00
 * Creation Date: May, 2010
 *******************************************************/
var instance = lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
var logger = instance ? instance.getLogger() : getLog("SMOO");

function autorun(number, change) {
    var link = new SCFile("OOFlowLinks", SCFILE_READONLY);
    link.setFields("seq.no");
    var sql = "type=\"cm3r\" and number=\"" + number + "\"";
    var rc = link.doSelect(sql);
    var seqlist = [];
    while (rc == RC_SUCCESS) {
        var seqno = link.seq_no;
        if (seqno != null) {
            seqlist.push(seqno);
        }
        rc = link.getNext();
    }
    var activityLogID;
    seqlist.sort();
    var i;
    for (i = 0; i < seqlist.length; i++) {
        var currentNo = seqlist[i];
        var linkFile = new SCFile("OOFlowLinks");
        var sql1 = "type=\"cm3r\" and number=\"" + number + "\" and seq.no = " + currentNo;
        var rc1 = linkFile.doSelect(sql1);
        while (rc1 == RC_SUCCESS) {
            var m;
            var length;
            var paraName;
            var paraValue;

            //0. get CI
            var cis = lib.SMOOUtil.getCIs(linkFile.assets);
            if (cis == "") {
                paraName = [];
                paraValue = [];
                length = linkFile.paras.getSize();
                for (m = 0; m < length; m++) {
                    paraName.push(linkFile.paras[m].para_name);
                    if (linkFile.paras[m].para_rfc_field != null) {
                        linkFile.paras[m].para_value = lib.SMOOChangeMapping.getChangeFieldValue(change, linkFile.paras[m].para_rfc_field);
                    }
                    if (linkFile.paras[m].para_value == null && linkFile.paras[m].para_default_value != null) {
                        linkFile.paras[m].para_value = linkFile.paras[m].para_default_value;
                    }
                    paraValue.push(linkFile.paras[m].para_value);
                }

                //Get the sensitive parameters 
                //Add By Fei, Zhi-Chao
                length = linkFile.senparas.getSize();
                for (m = 0; m < length; m++) {
                    paraName.push(linkFile.senparas[m].senpara_name);
                    if (linkFile.senparas[m].senpara_rfc_field != null) {
                        linkFile.senparas[m].senpara_value = lib.SMOOChangeMapping.getChangeFieldValue(change, linkFile.senparas[m].senpara_rfc_field);
                    }
                    if (linkFile.senparas[m].senpara_value == null && linkFile.senparas[m].senpara_default_value != null) {
                        linkFile.senparas[m].senpara_value = linkFile.senparas[m].senpara_default_value;
                    }
                    paraValue.push(linkFile.paras[m].senpara_value);
                }

                try {
                    vars.$response = lib.SMOOHttpRequest.execute(linkFile.OOFlow_uuid, paraName, paraValue, number, "smoo-automation", linkFile.async, "cm3r", activityLogID);
                    //if the activity is already created, reuse the id to insert the new content.
                    //if the response is an error, the size is 1, else the size will be 3 and the last one in the array is the id.
                    if (vars.$response.getSize() == 1) {
                        activityLogID = vars.$response[0];
                    } else {
                        activityLogID = vars.$response[2];
                    }
                } catch (ex) {
                    logger.error("SMOOCMAuto", ex.toString());
                    return "Error";
                }
            } else {
                var k;
                for (k = 0; k < cis.length; k++) {
                    //1. collect parameters
                    var device = getDevice(cis[k]);
                    //print(device);
                    if (device == null) {
                        return "Error";
                    }
                    paraName = [];
                    paraValue = [];
                    length = linkFile.paras.getSize();
                    for (m = 0; m < length; m++) {
                        paraName.push(linkFile.paras[m].para_name);
                        if (linkFile.paras[m].para_rfc_field != null) {
                            linkFile.paras[m].para_value = lib.SMOOChangeMapping.getChangeFieldValue(change, linkFile.paras[m].para_rfc_field);
                        }
                        if (linkFile.paras[m].para_value == null && linkFile.paras[m].para_ci_field != null) {
                            linkFile.paras[m].para_value = lib.SMOOCIMapping.getCIFieldValue(device, linkFile.paras[m].para_ci_field);
                        }
                        if (linkFile.paras[m].para_value == null && linkFile.paras[m].para_default_value != null) {
                            linkFile.paras[m].para_value = linkFile.paras[m].para_default_value;
                        }
                        paraValue.push(linkFile.paras[m].para_value);
                    }

                    //Add by Fei, Zhi-Chao
                    length = linkFile.senparas.getSize();
                    for (m = 0; m < length; m++) {
                        paraName.push(linkFile.senparas[m].senpara_name);
                        if (linkFile.senparas[m].senpara_rfc_field != null) {
                            linkFile.senparas[m].senpara_value = lib.SMOOChangeMapping.getChangeFieldValue(change, linkFile.senparas[m].senpara_rfc_field);
                        }
                        if (linkFile.senparas[m].senpara_value == null && linkFile.senparas[m].senpara_ci_field != null) {
                            linkFile.senparas[m].senpara_value = lib.SMOOCIMapping.getCIFieldValue(device, linkFile.senparas[m].senpara_ci_field);
                        }
                        if (linkFile.senparas[m].senpara_value == null && linkFile.senparas[m].senpara_default_value != null) {
                            linkFile.senparas[m].senpara_value = linkFile.senparas[m].senpara_default_value;
                        }
                        paraValue.push(linkFile.senparas[m].senpara_value);
                    }

                    try {
                        //3. execute
                        vars.$response = lib.SMOOHttpRequest.execute(linkFile.OOFlow_uuid, paraName, paraValue, number, "smoo-automation", linkFile.async, "cm3r", activityLogID);
                        if (vars.$response.getSize() == 1) {
                            activityLogID = vars.$response[0];
                        } else {
                            activityLogID = vars.$response[2];
                        }
                    } catch (ex) {
                        logger.error("SMOOCMAuto", ex.toString());
                        return "Error";
                    }
                }
            }
            rc1 = linkFile.getNext();
            //4. save result
        }
    }
}

function getDevice(name) {
    var device = new SCFile("device");
    var sql = "logical.name = \"" + name + "\"";
    var rc = device.doSelect(sql);
    if (rc == RC_SUCCESS) {
        return device;
    } else {
        return null;
    }
}