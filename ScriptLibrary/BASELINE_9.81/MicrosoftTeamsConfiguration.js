const TEMPLATE_TEAMS = lib.MicrosoftTeamsConstants.TEMPLATE_TEAMS();

/**
 * Get the configuration item of Microsoft Teams Integration
 */
function getConfigurationItem(intId) {
    if (!intId) {
        return lib.smis_ConfigurationManager.getEnabledConfigItem(TEMPLATE_TEAMS);
    } else {
        var configItem = lib.smis_ConfigurationManager.getInstanceConfig(intId);
        if (configItem && configItem.template == TEMPLATE_TEAMS && configItem.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
            return configItem;
        }

        return null;
    }
}


/**
 * check whether it is multiple instance mode
 */
function isMultiInstanceMode() {
    var registry = lib.c.$("!SMISRegistry").fields("instCount").find("name=:name", TEMPLATE_TEAMS).one();
    return registry && registry.instCount > 1;
}


function isEnabled(intId) {
    return getConfigurationItem(intId) != null;
}


function getConfigParameterValue(intId, param) {
    var config = getConfigurationItem(intId);
    if (config != null) {
        return config.getConfigParameterValue(param);
    } else {
        return null;
    }
}


function getGrantType(intId) {
    return getConfigParameterValue(intId, "grantType");
}


function getUsername(intId) {
    return getConfigParameterValue(intId, "username");
}


function getPassword(intId) {
    return getConfigParameterValue(intId, "password");
}


function getClientID(intId) {
    return getConfigParameterValue(intId, "clientID");
}


function getTenantID(intId) {
    return getConfigParameterValue(intId, "tenantID");
}


function getClientSecret(intId) {
    return getConfigParameterValue(intId, "clientSecret");
}


function getBotClientID(intId) {
    return getConfigParameterValue(intId, "botClientID");
}


function getBotClientSecret(intId) {
    return getConfigParameterValue(intId, "botClientSecret");
}


function getNotificationMode(intId) {
    return getConfigParameterValue(intId, "notificationMode");
}


function getProxyHost(intId) {
    return getConfigParameterValue(intId, "proxyHost");
}


function getProxyPort(intId) {
    return getConfigParameterValue(intId, "proxyPort");
}


function getProxyUsername(intId) {
    return getConfigParameterValue(intId, "proxyUsername");
}


function getProxyPassword(intId) {
    return getConfigParameterValue(intId, "proxyPassword");
}


function getMessagePostTemplate(intId) {
    return getConfigParameterValue(intId, "messagePostTemplate");
}


function isSynchronizeMessage(intId) {
    return getConfigParameterValue(intId, "synchronizeMessage");
}