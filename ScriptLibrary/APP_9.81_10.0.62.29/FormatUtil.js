var $ = lib.c.$;
/**
 * Get match format name of the file
 */
function getMatchFileFormatName(name, fuzzyMatch) {
    if (name == null || name == "") {
        return name;
    }

    var fFormat = new SCFile("format", SCFILE_READONLY);
    fFormat.setFields("name");

    var queries = [
        //exactly match
        "(name=\"" + name + ".g\" or name=\"" + name + "\") and file.name=\"" + name + "\"",
        //approximate match
        "name#\"" + name + "\" and file.name=\"" + name + "\"",
        "name=\"" + name + ".g\" or name=\"" + name + "\""
    ];

    if (fuzzyMatch) {
        //match filename only
        queries.push('file.name="' + name + '"');
    }

    var i;
    for (i = 0; i < queries.length; i++) {
        var query = queries[i];
        var rc = fFormat.doSelect(query);
        if (rc == RC_SUCCESS) {
            return fFormat['name'];
        }
    }

    return name;
}


/**
 * get format query sql
 *
 * @param	 {String} formatName
 * @returns {String} query sql
 */
function getQueryByFormatName(formatName) {

    if (formatName == null) {
        return "false";
    }

    var _ = lib.Underscore.require();

    // consider format name end with ".g"
    if (_.endsWith(formatName, ".g")) {
        return 'name="' + formatName + '"';
    } else {
        return 'name isin {"' + formatName + '","' + formatName + '.g"}';
    }
}

/**
 * get pageList formatName by current formatName
 * @param   {String} current formatName
 * @returns {String} pageList format
 */
function getPageFormatByCurrentFormat(currentFormatName, fileName) {
    var pageFormatName = currentFormatName + ".page";
    var pageFormat = $("#formatService").getFormat(pageFormatName);
    if (pageFormat) {
        return pageFormat.name;
    } else {
        var currentFormat = $("#formatService").getFormat(currentFormatName);
        if (currentFormat) {
            return currentFormat.name;
        }else{
            return fileName;
        }
    }
}