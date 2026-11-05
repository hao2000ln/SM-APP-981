// This script builds and returns a string of library-specific query values 
//   using the KMQuery object. The values in KMQuery were entered by the user  
//   under the tabs in the Advanced Search screen.
// Tailor this script if this knowledgebase has a tab in the Advanced Search screen.

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Author: Zhang, Ming-Di
 reimplemented the search criteria, add fieldmapping to define the relation between kmquery field and search engine field.
 every element in fieldmapping stands for one relation.
 first record in the relation stands for the kmquery field
 secord means the search engine field
 third one defines if the field reuqests fullmatch.
 **/
var fieldmapping = [
    [ "interactionlib_id", "id", false ],
    [ "interactionlib_company", "company", false ],
    [ "interactionlib_description", "description", false ],
    [ "interactionlib_resolution", "resolution", false ],
    [ "interactionlib_openedby", "openedby", false ],
    [ "interactionlib_status", "status", true ],
    [ "interactionlib_category", "category", true ],
    [ "interactionlib_subcategory", "subcategory", true ],
    [ "interactionlib_logicalname", "logicalname", true ],
    [ "interactionlib_impact", "impact", true ],
    [ "interactionlib_severity", "severity", true ],
    [ "interactionlib_priority", "priority", true ],
    [ "interactionlib_producttype", "producttype", true ],
    [ "interactionlib_ownedby", "ownedby", false ],
    [ "interactionlib_assignment", "assignment", true ] ];
    
/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Author: Zhang, Ming-Di
 remove the criteria parsing for K2 since no K2 support since 9.30
 **/
function ProcessLibCriteria(KMQuery, kbname) {
    var idolSearch = lib.KMQuery_IDOL.require();
    var strQuery = idolSearch.processIDOL(KMQuery, fieldmapping, this,kbname);

    return strQuery;
}

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Author: Zhang, Ming-Di
 defines the special query mapping which are not simply field:value
 **/
function processSpecial(KMQuery) {

    var strQuery = "";

    var buff = [];
    var idolQuery = lib.KMQuery_IDOL.require();
    var epochSeconds;
    
    if(KMQuery.interactionlib_openedbefore != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.interactionlib_openedbefore);
        buff.push('RANGE{.,'+epochSeconds+'}:'+idolQuery.dateField("opentime"));
    }
    if(KMQuery.interactionlib_openedafter != null) {
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.interactionlib_openedafter);
        buff.push('RANGE{'+epochSeconds+',.}:'+idolQuery.dateField("opentime"));
    }

    strQuery = buff.join('+AND+');
    buff = null;

    return strQuery;
}


function getFieldMapping() {
    return fieldmapping;
}