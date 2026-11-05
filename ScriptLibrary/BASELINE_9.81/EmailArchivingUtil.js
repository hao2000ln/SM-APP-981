var $ = lib.c.$;

function newEmailStoreId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = system.functions.rtecall("getnumber", rcode, newid, "emailarchivingstore");
    return newid.getText();
}

function backupEventOut(eventRecord, mailRecord) {
	var needArchive = lib.settings.getSettingValue("SmartEmail", "enableEmailArchiving");
    if(needArchive != 'true'){
    	return;
    }
    try {
        var backupEO = new SCFile("emailarchivingstore");
        backupEO["email.id"] = newEmailStoreId();
        backupEO["from"] = mailRecord["user.from"];
        if (mailRecord["user.to"]) {
            backupEO["to"] = mailRecord["user.to"].split(";");
        }
        if (mailRecord["ccuser.array"]) {
            backupEO["cc"] = mailRecord["ccuser.array"].split(";");
        }
        if (mailRecord["bccuser.array"]) {
            backupEO["bcc"] = mailRecord["bccuser.array"].split(";");
        }

        backupEO["reference.id"] = eventRecord["reference.id"];
        backupEO["sent.time"] = eventRecord["evtime"];
        backupEO["email.body"] = mailRecord["text"];
        backupEO["subject"] = mailRecord["subject"];
        backupEO["type"] = "outbound";

        backupEO["attachment"] = eventRecord["evattachment"];

        backupEO.doInsert();
    } catch(ex) {


    }

}

function backupEmailIn(emailRecord) {
    try {
        var backupEO = new SCFile("emailarchivingstore");
        backupEO["email.id"] = newEmailStoreId();
        backupEO["from"] = emailRecord["user.from"];
        if (emailRecord["user.to"]) {
            backupEO["to"] = emailRecord["user.to"].split(";");
        }
        if (emailRecord["ccuser.array"]) {
            backupEO["cc"] = emailRecord["ccuser.array"].split(";");
        }
        if (emailRecord["bccuser.array"]) {
            backupEO["bcc"] = emailRecord["bccuser.array"].split(";");
        }

        backupEO["reference.id"] = emailRecord["reference.id"];
        backupEO["sent.time"] = null;
        backupEO["email.body"] = null;
        backupEO["received.time"] = emailRecord["received.time"];
        backupEO["subject"] = emailRecord["subject"];
        backupEO["type"] = "inbound";
        if(emailRecord["uid"]){
	        var lng = emailRecord["uid"].length;
	        for(var i = 0; i < lng; i++){
	        	backupEO["attachment"][i]["uid"] = emailRecord["uid"][i];
	        }
        }

        backupEO.doInsert();
    } catch(ex) {

    }

}

/**
*  This functions build and return the CSS Style for the interaction attachment HTML tables in the fulfilled record
*	
*  @returns {string} style - the CSS style
*/
function getHTMLAttachmentCSS() {

    var style;
    style = "<style> ";
    style += "body{border:0 0 0 0;margin:0;padding:0;font-family: Metric Regular, arial, Helvetica, sans-serif;}";
    style += ".main{width:100%;font-size: 12;text-align: left}";
    style += ".main th{font-weight: bold;font-size: 14;padding:4;background: #E0E0E0;}";
    style += ".main td{padding:8}";
    style += ".oddRow{background: #edf3fe;color: black}";
    style += ".evenRow{background: white;color: black}";
    style += "</style>"

    return style;

}

function buildHTMLAttachmentList(emailarchiveid) {
    var _sf = system.functions;
    var sCR = "\n";
    var iLineCount = 0;
    var sHtmlReturn = getHTMLAttachmentCSS();
    sHtmlReturn += "<table class=\"main\">" + sCR;

    // Table header          
    sHtmlReturn += "<tr>" + "<th><div tabindex=\"0\">" + _sf.scmsg(1, "interaction") + "</div></th>" + // Attachment Name
    "<th><div tabindex=\"0\">" + _sf.scmsg(2, "interaction") + "</div></th>" + // Size
    "<th><div tabindex=\"0\">" + _sf.scmsg(5, "interaction") + "</div></th>"; // INteraction ID
    sHtmlReturn += "</th></tr>"; // closing tag for header
    var emailArch = new SCFile("emailarchivingstore", SCFILE_READONLY);
    var query = 'email.id="' + emailarchiveid + '"';
    var ret = emailArch.doSelect(query);

    if (ret == RC_SUCCESS) {
        var attachments = emailArch["attachment"];

        if (attachments) {
            var len = system.functions.lng(attachments);
            for (var i = 0; i < len; i++) {

                var query = "uid=\"" + attachments[i]["uid"] + "\" and segment=0";

                $("SYSATTACHMENTS", SCFILE_READONLY).select(query).iterate(function(attachment) {
                    // build HTML
                    var sRowClass = iLineCount % 2 == 0 ? "evenRow": "oddRow";
                    var file_size = Math.round(attachment.size / 1024);
                    if (file_size == 0) {
                        file_size = 1;
                    }
                    iLineCount++; // counter for even / odd row
                    sHtmlReturn += "<tr>";
                    //sHtmlReturn += "<td class=\"" + sRowClass + "\" ><a href=\"scattach://" + attachment.uid + ":" +encodeURIComponent(attachment.filename) + ":" + attachment.application + ":" + attachment.topic + "\">" + attachment.filename + "</a></td>";
                    sHtmlReturn += "<td class=\"" + sRowClass + "\" ><a href=\"scattach://" + attachment.uid + ":" +attachment.filename.replace(/[\\\/:\*\"?]/g, "") + ":" + attachment.application + ":" + attachment.topic + "\">" + attachment.filename + "</a></td>";
                    sHtmlReturn += "<td class=\"" + sRowClass + "\"><div tabindex=\"0\">" + file_size + "</div></td>";
                    sHtmlReturn += "<td class=\"" + sRowClass + "\"><div tabindex=\"0\">" + attachment.topic + "</div></td>";
                    sHtmlReturn += "</tr>" + sCR;
                });

            }

        }
    }
    sHtmlReturn += "</table>" + sCR;
    return sHtmlReturn;

}

function buildPurgeQuery(){
	var interval = lib.settings.getSettingValue("SmartEmail", "purgeInterval");
	
	if(!interval){
		interval = '7 00:00:00';
	}
	var query = 'sysmodtime<tod()-\'' + interval + '\'';
	return query;
}

function buildViewQuery(record){

	var pk = lib.dbdictHelper.getUniqueKey(system.functions.filename(record));
	var refId = record[pk[0]];
	var query = 'reference.id="' + refId + '"';

	return query;
}