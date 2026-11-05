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
    ["knownerrorlib_id","id",false],
    ["knownerrorlib_status","rcStatus",true],
    ["knownerrorlib_description","description",false],
    ["knownerrorlib_resolution","resolution",false],
    ["knownerrorlib_openedby","openedby",false],
    ["knownerrorlib_category","category",true],
    ["knownerrorlib_subcategory","subcategory",true],
    ["knownerrorlib_producttype","producttype",true],
    ["knownerrorlib_ownedby","ownedby",false],
    ["knownerrorlib_assignment","assignment",false],
    ["knownerrorlib_assignee","assignee",false],
    ["knownerrorlib_primaryci","primaryci",true],
    ["knownerrorlib_priority","priority",false],
    ["knownerrorlib_impact","impact",false],
    ["knownerrorlib_severity","severity",false]
];

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Author: Zhang, Ming-Di
 **/
function ProcessLibCriteria(KMQuery,kbname) {
    var idolSearch = lib.KMQuery_IDOL.require();
    var strQuery = idolSearch.processIDOL(KMQuery,fieldmapping, this, kbname);

    return strQuery;
}

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Author: Zhang, Ming-Di
 defines the special query mapping which are not simply field:value
 **/
function processSpecial(KMQuery){
    var strQuery = "";

    var buff = [];
    var epochSeconds;
    var idolQuery = lib.KMQuery_IDOL.require();

    if(KMQuery.knownerrorlib_openedbefore != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.knownerrorlib_openedbefore);
        buff.push('RANGE{.,'+epochSeconds+'}:'+idolQuery.dateField("opentime"));
    }
    if(KMQuery.knownerrorlib_openedafter != null) {
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.knownerrorlib_openedafter);
        buff.push('RANGE{'+epochSeconds+',.}:'+idolQuery.dateField("opentime"));
    }

    strQuery = buff.join('+AND+');
    buff = null;

    return strQuery;
}


function getFieldMapping() {
    return fieldmapping;
}