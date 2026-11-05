/*
 * This ScriptLibrary is used for customization
 */


/**
 * Return tables those has display field defined.
 * It can be customized to support more tables, e.g. operator, contacts
 * 
 * @returns {Array}
 */
function hasDisplayFieldTables() {
    return [
        "device"
    ];
}


/**
 * Return tables - display field mapping.
 * It can be customized to support more tables, e.g. operator, contacts
 * 
 * @returns {Object}
 */
function getTableDisplayNameMapping() {
    return {
        "device": "sm.device.display.name"
    };
}