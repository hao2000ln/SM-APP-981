/**
 * This method is used to return a json object {'<document type'>: [<'field_1', 'feidl_2'>]} for links.
 * Related type and fields should be appended to this json object if a new document type is added.
 **/
function getKmFieldsForLinks() {
    return {
        "probsol": ["problem", "solution"],
        "howto": ["question", "answer"],
        "errormsg": ["error", "cause", "fix"],
        "reference": ["reference"]
    };
}