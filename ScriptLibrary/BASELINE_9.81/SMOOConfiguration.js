/**
 * Get the configuration item of SMOO Integration
 */
function getConfigurationItem() {
    return lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
}


function isEnabled() {
    return getConfigurationItem() != null;
}