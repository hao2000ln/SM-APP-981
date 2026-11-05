// This script builds and returns a string of library-specific query values 
//   using the KMQuery object. The values in KMQuery were entered by the user  
//   under the tabs in the Advanced Search screen.
// Tailor this script if this knowledgebase has a tab in the Advanced Search screen.

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 reimplemented the search criteria, add fieldmapping to define the relation between kmquery field and search engine field.
 every element in fieldmapping stands for one relation.
 first record in the relation stands for the kmquery field
 secord means the search engine field
 third one defines if the field reuqests fullmatch.
 **/
var fieldmapping = [
    ['kmlib_id','id',false],
    ['kmlib_locale','locale',false],
    ['kmlib_title','title',false],
    ['kmlib_author','author',false],
    ['kmlib_doctype','doctype',true],
    ['kmlib_status','status',true],
    ['kmlib_publishedto','publishedto',false],
    ['kmlib_summary','summary',false],
    ['kmlib_logicalname','logicalname',false]
];

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 remove the criteria parsing for K2 since no K2 support since 9.30
 **/
function ProcessLibCriteria(KMQuery,kbname)
{
    var idolSearch = lib.KMQuery_IDOL.require();
    var strQuery = idolSearch.processIDOL(KMQuery, fieldmapping, this,kbname);

    return strQuery;
}

/**
 QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 defines the special query mapping which are not simply field:value
 **/
function processSpecial(KMQuery){
    var strQuery = "";

    var buff = [];
    var epochSeconds;
    var idolQuery = lib.KMQuery_IDOL.require();
    if(KMQuery.kmlib_beforecreationdate != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.kmlib_beforecreationdate);
        buff.push('RANGE{.,'+epochSeconds+'}:'+idolQuery.dateField("creationdate"));
    }
    if(KMQuery.kmlib_aftercreationdate != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.kmlib_aftercreationdate);
        buff.push('RANGE{'+epochSeconds+',.}:'+idolQuery.dateField("creationdate"));
    }

    //this item is not displayed on the Advanced Search UI but is Searchable through the HotNews button
    if(KMQuery.kmlib_hotnews != null || KMQuery.kmlib_hotnews == true)
    {
        var tod = idolQuery.getEpochSeconds(funcs.tod());
        var hotnews = [];
        hotnews.push('MATCH{true}:'+idolQuery.normalField("hotnews", "Knowledge_Library"));
        hotnews.push('RANGE{.,'+tod+'}:'+idolQuery.dateField("hotnews_start_date"));
        hotnews.push('RANGE{'+tod+',.}:'+idolQuery.dateField("hotnews_end_date"));
        buff.push('('+hotnews.join('+AND+') +')');
        hotnews = null;
    }

    var i;
    var length;
    
    //handle the category filtering
    KMQuery.categories = funcs.denull(KMQuery.categories);
    var kmcats = [];
    if (KMQuery.categories.length() > 0) {

        length = KMQuery.categories.length();
        for( i=0; i < length; i++ )
        {
            kmcats.push(KMQuery.categories[i]+'*');
        }
        var strCats ="WILD{"+kmcats.join(',')+"}:KMSEARCHCATEGORY_MATCH";
        kmcats = null;
        buff.push(strCats);
    }
    ///////////////////////////////////////////////////////////////////////////////////////
    //QCRQ1E99949 As an agreement operator, I can create knowledge doc base on Agreement.//
    ///////////////////////////////////////////////////////////////////////////////////////
    KMQuery.kmlib_tags = funcs.denull(KMQuery.kmlib_tags);
    var temp = [];
    length = KMQuery.kmlib_tags.length();
    for(i=0; i<length; i++){
        if(!funcs._null(KMQuery.kmlib_tags[i])){
            temp.push(KMQuery.kmlib_tags[i]);
        }
    }

    if(temp.length >0) {
        buff.push("MATCH{"+temp.join(',')+'}:'+idolQuery.normalField("tags","Knowledge_Library"));
    }

    strQuery = buff.join('+AND+');
    buff = null;

    /////////////////////////////////////////////////////////////////////
    return strQuery;
}


function getFieldMapping() {
    return fieldmapping;
}