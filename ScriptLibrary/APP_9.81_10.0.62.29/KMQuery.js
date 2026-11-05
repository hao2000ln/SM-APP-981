/*   @author Tony Bray
 */
/**
 *   @class KMQuery
 *   @constructor
 *
 *  Purpose:  To overcome deficiencies in the natural language query parser (nlq) provided
 * by Verity.  The OEM nlq parser can only handle a single language stopword list, so not
 * useful for multilingual queries.  Verity also was unable to handle multilingual 
 * thesauri without major effort.  This function only add this additional support to the 
 * nlq and as such, can be used as a replacement.
 *
 *  Usage:  The only function in this library that should be called directly is:
 * function nlqToVQL(query, langCode);  
 * All other functions in this library are helper functions and should not be called 
 * directly from any other script.  This function takes two parameters, query and langCode.
 * query is the raw natural language string submitted by the user for the search.  
 * langCode is the two character code for the language the search is to be submitted in.
 * 
 * Returns:  This function returns a string with the resultant query in Verity Query Language
 * format (VQL).  This result is intended to be passed to the search engine using the VQL
 * parser, not the NLQ parser.
 */
function KMQuery() {}


function compressWhiteSpace(s) {

    // Condense white space.
    if (vars.$G_kmsearchengine == "IDOL") {
        s = s.replace(/[^\w\d\s?*]/g, "");
        s = s.replace(/\s+/g, " ");
        s = s.replace(/^\s(.*)/, "$1");
        s = s.replace(/(.*)\s$/, "$1");
    } else {
        s = s.replace(/[<\&]/g, " ");
        s = s.replace(/^\s(.*)/, "$1");
        s = s.replace(/(.*)\s$/, "$1");
        s = s.replace(/[\-]/g, "\\-");

        // Remove unnecessary white space around operators, braces and parentices.
        s = s.replace(/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/g, "$1");
        s = s.replace(/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/g, "$1");
    }

    return s;
}


function stripPhrases(query) {
    // remove phrases from the query..
    var startquote = query.indexOf("\"");
    while (startquote >= 0) {
        var newstripstr = "";
        var closequote = query.indexOf("\"", startquote + 1);
        if (closequote < 0) {
            newstripstr = query.substring(0, startquote);
            newstripstr += query.substring(startquote + 1);
            query = newstripstr;
            break;
        }
        if (closequote > 0) {
            newstripstr = query.substring(0, startquote);
            newstripstr += query.substring(closequote + 1);
            query = newstripstr;

            startquote = query.indexOf("\"");
        }
    }

    return query;
}


function parsePhrases(query) {
    // pull phrases out of the query...
    var phrase = "";

    var startquote = query.indexOf("\"");
    while (startquote >= 0) {
        var closequote = query.indexOf("\"", startquote + 1);
        if (closequote < 0) {
            break;
        }
        if (closequote > 0) {
            if (phrase.length > 0) {
                phrase += ";";
            }
            var toValue = compressWhiteSpace(query.substring(startquote, closequote + 1));
            var regx = new RegExp('^".*"$');
            if (regx.test(toValue)) {
                toValue = toValue.substring(1, toValue.length - 1);
            } else {
                toValue = "\"" + toValue + "\""; // +";";
            }

            phrase += toValue;
            query = query.substring(closequote + 1);

            startquote = query.indexOf("\"");
        }
    }
    return phrase.toLowerCase();
}

function stripWildcards(query, wildcards) {
    if (query.indexOf("*") == -1 && query.indexOf("?") == -1 && query.indexOf("/") == -1 && query.indexOf("-") == -1) {
        return query;
    }

    var wordarray = query.split(" ");
    var rtnquery = "";
    var words;
    for (words = 0; words < wordarray.length; words++) {
        if (wordarray[words].indexOf("*") == -1 && wordarray[words].indexOf("?") == -1 && wordarray[words].indexOf("/") == -1 && wordarray[words].indexOf("-") == -1) {
            if (rtnquery.length > 1) {
                rtnquery += " " + wordarray[words];
            } else {
                rtnquery += wordarray[words];
            }
        }
    }

    return rtnquery;
}

function parseWildcards(query) {
    //check for wildcard characters first
    if (query.indexOf("*") == -1 && query.indexOf("?") == -1 && query.indexOf("/") == -1 && query.indexOf("-") == -1) {
        return "";
    }

    // wildcards found, pull them out
    var wildcards = "";
    var wordarray = query.split(" ");

    var words;
    for (words = 0; words < wordarray.length; words++) {
        if (wordarray[words].indexOf("*") > -1 || wordarray[words].indexOf("?") > -1 || wordarray[words].indexOf("/") > -1 || wordarray[words].indexOf("-") > -1) {
            if (wordarray[words].length > 1) {
                var value = wordarray[words].replace(/[\&\^\(\)\/]+/g, "?") + "";
                var value = value.replace(/[\-]+/g, "\\-") + "";

                if (wildcards.length > 1) {
                    wildcards += ", " + value;
                } else {
                    wildcards += "" + value;
                }
            }
        }
    }

    return wildcards;
}

function stripStop(stripstr, langCode) {
    // load the correct stopword list based on language code.  If lang code for the search
    // is the default lang, use the preloaded global variable to save time.  Otherwise,
    // load the new table for this query only.

    var local_my_language = "";
    if (vars.$G_my_language.length > 2) {
        local_my_language = vars.$G_my_language.split(0, 2);
    } else {
        local_my_language = vars.$G_my_language;
    }

    var wordsList;
    if (langCode == local_my_language) {
        if (!system.functions.exists(vars.$G_defStopwords)) {
            system.library.KMLoadStopwords.loadStopwords();
        }
        wordsList = vars.$G_defStopwords;
    } else {
        // load the alternate language stopwords here

        var defStopwords = new Datum();
        defStopwords.setType(8);
        var sclibFile = new SCFile("kmstopword", SCFILE_READONLY);
        var scFind = sclibFile.doSelect("langcode = \"" + langCode + "\"");
        if (scFind == RC_SUCCESS) {
            scFind = sclibFile.getFirst();
            defStopwords = sclibFile.stopwords;
        }
        wordsList = defStopwords;
    }
    //remove the stopwords found in the string here...

    // remove one or more non-word characters followed by a space
    var searchString = " " + stripstr + " ";
    searchString = searchString.replace(/\s[a-zA-Z_"]\s/gi, " ");

    // remove one or more non-word characters preceeded by a space
    //searchString = searchString.replace(/ \b[a-zA-Z0-9_"\*]+/gi, " ");
    // remove a bound word (/b) from the ignore word list
    var i, length = wordsList.length();
    for (i = 0; i < length; i++) {
        try {
            var regExp = new RegExp('\\s' + RegExp_escape(wordsList[i]) + '\\s', 'gi');
            var tmpsub = "";
            // incase of " stopwords stopwords" changed to "stopwords" after replaced
            while (tmpsub != searchString) {
                searchString = " " + searchString + " ";
                tmpsub = searchString;
                searchString = searchString.replace(regExp, " ");
            }
        } catch (ex) {
            print(system.functions.scmsg(254, "km", [wordsList[i]]));
        }
    }
    // return stripped string 

    return lib.c.$.trim(searchString);
}

function RegExp_escape(str) {
    // escaping mechanism for literal strings
    if (str == null || str == "") {
        return str;
    }
    var specials = new RegExp("[.*+?|()\\[\\]{}\\\\\\/\\^$]", "g"); // .*+?|()[]{}\/^$
    return str.replace(specials, "\\$&");
}