/*
 * This JS is for backward compatible only.
 * Please use native "JSON.stringify" and "JSON.parse" directly. 
 */
var jsonProxy = {

    stringify: function (value, replacer, space) {
        return JSON.stringify(value, replacer, space);
    },
    
    parse: function (text, reviver) {
        return JSON.parse(text, reviver);
    }
};

function json() {
    return jsonProxy;
}
