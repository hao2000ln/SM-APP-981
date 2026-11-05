/******************************************************
 * Module Name: SMIS Email Out Manager
 * Function: Manager Interface
 * Author: Zhang, Qi
 * Version: 1.00
 * Creation Date: Nov, 2024
 *******************************************************/
var Class = lib.smis_Prototype.getClass();

var EmailOutManagerClass = Class.create(lib.smis_Manager.getClass(), {

    validateParams: function() {
        // check mandatory
        var mandatoryList = ["mailFrom", "smtpHost", "smtpPort", "smtpUsername"];

        var oauthEnabled = this.isOAuthEnabled();
        if (oauthEnabled) {
            mandatoryList.push("clientID");
            mandatoryList.push("clientSecret");
        }
        // smtp password is required when oauth disabled
        else {
            mandatoryList.push("smtpPassword");
        }

        var result = lib.smis_CommonLib.validateSMISParams(this.configItem, mandatoryList, "SmartEmail");
        if (result) {
            return result;
        }

        // check email format
        var mailFrom = this.configItem.getConfigParameterValue("mailFrom");
        if (!lib.MailUtil.isSingleEmailAddress(mailFrom.trim())) {
            var caption = funcs.scmsg("caption;mailFrom", "SmartEmail");
            return funcs.scmsg("2", "ruleset", [caption]);
        }

        // check number value
        var fields = ["smtpPort", "sleep", "mailThreadCount"];

        var sslEnabled = this.configItem.getConfigParameterValue("smtpEnableSSL");
        if (sslEnabled) {
            fields.push("smtpSSLPort");
        }

        var i;
        for (i = 0; i < fields.length; i++) {
            result = lib.smis_CommonLib.validatePositiveNumberSMISParams(this.configItem, fields[i], "SmartEmail");
            if (result) {
                return result;
            }
        }

        return null;
    },

    isOAuthEnabled: function() {
        var oauthEnabled = this.configItem.getConfigParameterValue("enableOAuth");
        return !!oauthEnabled;
    },

    beforeEnableInstance: function() {
        var oauthEnabled = this.isOAuthEnabled();

        // check access token first if OAuth enabled
        if (oauthEnabled) {
            const module = lib.EmailOutUtil.getEmailOutTokenModule(this.intId);
            var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);
            if (!lib.OAuthAuthentication.isTokenAvailable(ftoken)) {
                funcs.rtecall("msg", new SCDatum(), funcs.scmsg("73", "smis"), 2);
                return false;
            }
        }

        return true;
    },

    afterEnableInstance: function() {
        var processExist = lib.EmailOutUtil.isEmailOutProcessExist();

        // show need to restart warning message if emailout background process existed 
        if (processExist) {
            var msg = funcs.scmsg("restart_process_emailout", "SmartEmail");
            funcs.rtecall("msg", new SCDatum(), msg, 2);
        }
    },

    afterDelInstance: function() {
        // clear oauth data
        const module = lib.EmailOutUtil.getEmailOutTokenModule(this.intId);
        lib.OAuthAuthentication.clearOAuthData(module);
    }

});

function getClass() {
    return EmailOutManagerClass;
}

function hideFields() {
    return true;
}