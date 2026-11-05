// This script returns a string containing a search query
// that filters the search based on the user's rights and
// permissions.
function mappingIDOLField(fieldname)
{
    return fieldname.toUpperCase()+"_MATCH";
}
function getSecurityInfo(user, record) {
    var querystr = "";
    var usrrights = lib.KMSecurity.kbname_kmsearchsecurity(user);
    if (usrrights.length > 0) {
        usrrights = consolidateusrrights(usrrights);
        var getenginename = lib.KMSearchInterface.getEngineName();
        if (getenginename == "IDOL") {
            var usrrightsarray = usrrights.split(";");
            var cats;
            for (cats = 0; cats < usrrightsarray.length - 1; cats++) {
                var categorystatusarray = usrrightsarray[cats].split(",");
                var categorystr = categorystatusarray[0];

                var statusarray;
                if (categorystatusarray.length > 0) {
                    statusarray = categorystatusarray[1].split(":");
                }
                if (querystr.length > 0) {
                    querystr += "+OR+";
                }

                //The STRING field specifier (case sensitive) allows you to specify one or more strings of which one must be contained as a substring in a specified field.
                querystr += "(WILD{"+categorystr+ "*}:"+mappingIDOLField("kmsearchcategory");

                if (statusarray.toString().length > 1)
                {
                    querystr += "+AND+MATCH{" + statusarray.toString() +"}:"+mappingIDOLField("status");
                }
                querystr+=")";
            }

        }
    }	/** start: QCCR1E89335 */
    else if(funcs.index("SysAdmin", vars.$lo_ucapex) == 0 &&
        funcs.index("KMAdmin", vars.$lo_ucapex) == 0 &&
        !vars.$G_km_environment.admin_search_all)
    {
        if ("IDOL" == vars.$G_kmsearchengine){
            querystr +="MATCH{NONE}:"+mappingIDOLField("kmsearchcategory");
        }
        else
        {
            querystr += "kmsearchcategory:NONE";
        }
    }
    /** end: QCCR1E89335 */
    if (querystr.length > 0) {
        querystr = "("+querystr+")";
    }
    return querystr;
}

function consolidateusrrights(usrrights) {
    // Consolidate multiple rights to the same category into a single category instance.
    // if user has all status flags, they "null" themselves and do not need to be specified
    var currentcat = "";
    var statusarray = [];
    var newusrrights = "";
    var categorystatusarraystr = "";
    var statusarraystr = "";
    var statusstring = "";
    var usrrightsarray = [];

    if (usrrights.length > 0) {
        usrrightsarray = usrrights.split(";");
        usrrightsarray = usrrightsarray.sort();
        var cats;
        for (cats = 0; cats < usrrightsarray.length; cats++) {
            var stats;
            var tmpstatusarray;
            categorystatusarraystr = usrrightsarray[cats].substring(0, usrrightsarray[cats].indexOf(","));
            statusarraystr = usrrightsarray[cats].substring(usrrightsarray[cats].indexOf(",") + 1, usrrightsarray[cats].length);
            if (currentcat == categorystatusarraystr) { // found matching category....
                tmpstatusarray = statusarraystr.split(":");
                for (stats = 0; stats < tmpstatusarray.length; stats++) {
                    statusstring = statusarray.join(""); //make array into a string
                    if (statusstring.indexOf(tmpstatusarray[stats]) < 0) // look for current flag
                    { //not there so add it...
                        statusarray.push(tmpstatusarray[stats]);
                    }
                }
            } else { // current cat does not match previous cat...
                // check if we even had a previous cat
                if (currentcat.length > 0) { // we must be done with all the cats that previously matched
                    newusrrights += currentcat + ",";
                    // if all three status flags, just use a comma, otherwise list them
                    if (statusarray.length < 3) {
                        newusrrights += statusarray.join(":"); //array to string with ":" seperators
                    }
                    newusrrights += ";";
                }

                statusarray = [];
                currentcat = categorystatusarraystr;
                tmpstatusarray = statusarraystr.split(":");
                for (stats = 0; stats < tmpstatusarray.length; stats++) {
                    statusstring = statusarray.join(""); //make array into a string
                    if (statusstring.indexOf(tmpstatusarray[stats]) < 0) // look for current flag
                    { //not there so add it...
                        statusarray.push(tmpstatusarray[stats]);
                    }

                }
            }
        }
        //we are at the last category, add it's info to the user rights string
        newusrrights += currentcat + ",";
        // if all three status flags, just use a comma, otherwise list them
        if (statusarray.length < 3) {
            newusrrights += statusarray.join(":");
        }
        newusrrights += ";";
        return (newusrrights);
    }
}
