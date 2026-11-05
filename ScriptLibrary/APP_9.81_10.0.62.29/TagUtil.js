/*
 * This JS is for tag function.
 */

var IS_SUPPORT_GROUP = lib.SystemSettings.getBooleanValue("system.hashtag.assignmentgroup");

/**
 * Synchronize Tags
 *
 * @param {SCFile} new record
 * @param {SCFile} old record
 */
function synchronizeHashtags(record, oldrecord) {
    var tags = getHashtags(record);
    if (tags == null || tags.length == 0) {
        return;
    }
    
    var filename = funcs.filename(record);
    var assignments = lib.ArrayUtil.toJsArrayRemoveDuplicateEmptyElement(vars.$G_myGroups.member_of);
    var oldtags = getHashtags(oldrecord);
    if (!IS_SUPPORT_GROUP || (IS_SUPPORT_GROUP && assignments.length == 0) || assignments.length == 0 || filename == "kmdocument") {
        
        //add/update mode: tag is null in old record
        if (oldtags == null || oldtags.length == 0) {
            updateHashtags(filename, tags);
        }
        //Update mode: handle tag those exist in new record but not exist in old record
        else {
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (!lib.ArrayUtil.contains(oldtags, tag)) {
                    updateHashtag(filename, tag);
                }
            }
        }
    }
    else {
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if (!lib.ArrayUtil.contains(oldtags, tag)) {
                updateHashtagByGroups(filename, tag, assignments);
            }
        }
    }
}

function updateHashtagByGroups(filename, tag, assignments) {
    if (tag == null || tag.length == 0) {
        return;
    }
    var query = 'filename="' + filename + '" and tag="' + lib.StringUtil.escapeAllStr(tag) + '" and assignment isin ' + funcs.str(assignments);
    var taghints = new SCFile("taghints");
    var rc = taghints.doSelect(query);

    //easigns is to filter records which need to be added
    var easigns = [];
    var asignsLen = assignments.length;
    while (rc == RC_SUCCESS) {
        easigns.push(taghints.assignment);
        taghints._count = updateTagCount(taghints);
        taghints.doUpdate();
        rc = taghints.getNext();
    }
    //add
    if (easigns.length != asignsLen) {
        for (var i = 0; i < asignsLen; i++) {
            var assignmentObj = assignments[i];
            if (!lib.ArrayUtil.contains(easigns, assignmentObj)) {
                var taghints = new SCFile("taghints");
                taghints.filename = filename;
                taghints.tag = tag;
                taghints._count = 1;
                taghints.assignment = assignmentObj;
                taghints.doInsert();
            }
        }
    }
}

/**
 * Get tag of a record
 *
 * @param {SCFile} record
 * @returns {Array}
 */
function getHashtags(record) {
    if (record == null) {
        return null;
    }
    var tagField = getTagField(funcs.filename(record));
    var tags = record[tagField];
    if (tags == null || typeof tags != "object") {
        return null;
    }
    return lib.ArrayUtil.toJsArrayRemoveDuplicateEmptyElement(tags);
}


/**
 * Update tag hints
 *
 * @param {String} file name
 * @param {Array} tags
 */
function updateHashtags(filename, tags) {
    if (tags == null || tags.length == 0) {
        return;
    }
    for (var i = 0; i < tags.length; i++) {
        updateHashtag(filename, tags[i]);
    }
}


/**
 * Update tag hint
 *
 * @param {String} file name
 * @param {String} tag
 */
function updateHashtag(filename, tag) {
    if (tag == null || tag.length == 0) {
        return;
    }
    var query = 'filename="' + filename + '" and tag="' + lib.StringUtil.escapeAllStr(tag) + '" and assignment = NULL';
    var taghints = lib.c.$("taghints").select(query).uniqueResult();
    // add
    if (taghints == null) {
        taghints = new SCFile("taghints");
        taghints.filename = filename;
        taghints.tag = tag;
        taghints._count = 1;
        taghints.doInsert();
    }
    // update
    else {
        taghints._count = updateTagCount(taghints);
        taghints.doUpdate();
    }
}


/**
 * Get tag field
 *
 * @param {String} file name
 * @returns {String} tag field
 */
function getTagField(filename) {
    // for customization if use other field
    return "tags";
}


/**
 * Get top tags according to the file name
 * This function is invoked by web client RemoteJS
 *
 * @param {String} file name
 * @returns {Array} top tags object
 */
function getTopTags(filename) {
    var tags = [];
    var sql = "";
    var topcount = getTopCount();
    var ftags = new SCFile("taghints", SCFILE_READONLY);
    var rc;
    if (IS_SUPPORT_GROUP && filename != "kmdocument") {
        var groups = lib.ArrayUtil.toJsArray(vars.$G_myGroups.member_of);
        if (groups != null && groups.length != 0) {
            sql = 'select top ' + topcount + ' tag, sum(count) as popularity FROM taghints where filename="' + filename + '" and assignment isin ' + funcs.str(groups) + " group by tag order by popularity desc";
            rc = ftags.doSelect(sql);
         }
         while (rc == RC_SUCCESS) {
            var tagObj = {
                tag: ftags.tag,
                count: ftags.popularity
            };
            tags.push(tagObj);
            rc = ftags.getNext();
        }
    }

    sql = 'select top ' + topcount + ' tag, count From taghints where filename="' + filename + '"' + ' and assignment = NULL order by count desc';
    rc = ftags.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (tags.length != topcount && !containsTag(tags, ftags.tag)) {
            var tagObj = {
                tag: ftags.tag,
                count: ftags._count
            };
            tags.push(tagObj);
        }
        rc = ftags.getNext();
    }
    return tags;
}

function containsTag(tags, value) {
    for (var i=0; i < tags.length; i++) {
        if (tags[i].tag == value) {
            return true;
        }
    }
    return false;
}

function getTopCount() {
    return 100;
}

function updateTagCount(taghints) {
    var count = taghints._count;
    if (count == null || count <= 0) {
        count = 1;
    }
    else {
        count++;
    }
    return count;
}
