function TEMPLATE_EMAILOUT() {
    return "EmailOut";
}


/**
 * get EmailOut token module
 *
 * @param {String} intId
 * @returns {String}
 */
function getEmailOutTokenModule(intId) {
    // append integration id, like "EmailOut-1" to support multiple instances
    return TEMPLATE_EMAILOUT() + "-" + intId;
}


/**
 * check whether token module is for EmailOut
 *
 * @param {String} module
 * @returns {Boolean}
 */
function isTokenModuleForEmailOut(module) {
    return module && module.startsWith(TEMPLATE_EMAILOUT() + "-");
}


/**
 * Get the configuration item of EmailOut Integration
 */
function getConfigurationItem() {
    return lib.smis_ConfigurationManager.getEnabledConfigItem(TEMPLATE_EMAILOUT());
}


function isEnabled() {
    return getConfigurationItem() != null;
}


/**
 * Check whether Emailout background process existed
 *
 * @returns {Boolean}
 */
function isEmailOutProcessExist() {
    var processes = funcs.processes();

    if (!processes) {
        return false;
    }

    // emailout process name
    const processNames = [
        "SMTPMail", // Windows 
        "EMAILOUT" // Linux
    ];

    var i;
    var length = processes.length();
    for (i = 0; i < length; i++) {
        var process = processes[i];
        // print(process);

        var device = process[i + 0.2];
        var name = process[i + 0.3];

        if (device == "SCAuto" && processNames.includes(name)) {
            return true;
        }
    }

    return false;
}