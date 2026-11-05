function sendResetPasswordEmail(username, emailAddr, token, lang, expire) {
    if (expire == null) {
        expire = "30";
    }
    expire = "" + expire;
    
    var mail = createMail("EmailResetPassword", username, emailAddr, lang, ["Token", "Username", "Expire"], [token, username, expire]);
    if (mail == null) {
        return false;
    }
    
    sendMail(mail);
    
    return true;
}

function sendUserLockedEmail(username, emailAddr, lang) {
    var mail = createMail("EmailUserLocked", username, emailAddr, lang, ["Username"], [username]);
    if (mail == null) {
        return false;
    }
    
    sendMail(mail);
    
    return true;
}


function createMail(templateName, username, emailAddr, lang, parameters, values) {
    var language = lib.NotificationRecipientsHelp.getLang(username);
    if (language != null) {
        lang = language;
    }
    
    if (lang == null) {
        lang = "en";
    }
    
    initGlobalVars();
    
    var emailSubject = lib.htmlemailtemplates.getMailHeader(templateName, null, null, null, lang);
    var emailBody = lib.htmlemailtemplates.getMailBody(templateName, null, null, null, lang);
    
    if (emailBody == null) {
        return null;
    }
    
    if (parameters != null && values != null) {
        var length = parameters.length;
        if (length > values.length) {
            length = values.length;
        }
        
        for (var i=0; i<length; i++) {
            var re =new RegExp("\\$\\$" + parameters[i] + "\\$\\$", "gi");
            emailBody = emailBody.replace(re, values[i]);
        }
    }
    
    var mail = new SCFile("mail");
    mail["user.from"] = username;
    mail["user.to"] = emailAddr;
    mail["user.array"] = [emailAddr];
    mail["subject"] = emailSubject;
    mail["text"] = emailBody.split("\n");
    
    mail["date.to.send"] = funcs.tod();
    
    mail["status"] = "sent";
    mail["application"] = "email";
    
    mail["bccuser.array"] = null;
    mail["ccuser.array"] = null;
    
    return mail;
}

function sendMail(mail) {
    var rteNames = new SCDatum();
    rteNames.push("record");
	
    var rteValues = new SCDatum();
    rteValues.push(mail);
    
    var rteReturnValue = new SCDatum();

    funcs.rtecall("callrad", rteReturnValue, "axces.email", rteNames, rteValues, false);
}

/**
 * Forget Password need to invoke this function to to initialize the global variable
 * $G.webserver.url to generate logo url in htmltemplates expression before create email.
 *
 * Forget Password doesn't follow the standard login mechanism.
 * $G.webserver.url is initialzed from $G.system.info in RAD set.login.globalvars
 *   - $G.system.info is initialized in RAD login when login,
 * or generated in ScriptLibrary ScAPI_svcCatRequest and GatewayAPI_svcCatRequest
 */
function initGlobalVars() {
    if (vars["$G.webserver.url"] == null || vars["$G.webserver.url"] == "") {
        if (vars["$G.system.info"] == null) {
            vars["$G.system.info"] = lib.ScAPI_Util.getSystemInfo();
            if (vars["$G.system.info"] == null) {
                return;
            }
        }

        vars["$G.webserver.url"] = vars["$G.system.info"]["webserver.url"];
    }
}
