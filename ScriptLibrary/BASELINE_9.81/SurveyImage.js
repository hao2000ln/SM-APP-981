var $ = lib.c.$;

/**
 * get all image list
 *
 * @returns {Array} [value list, display list]
 */
function getAllImageList() {
    var ids = [];
    var names = [];

    $("!SurveyImage").fields(["id", "name"]).setOrderBy(["name"], [SCFILE_ASC]).selectAll().each(function(image) {
        ids.push(image.id);
        names.push(image.name);
    });

    return [ids, names];
}


/**
 * get all image group list
 *
 * @returns {Array} [value list, display list]
 */
function getAllImageGroupList() {
    var ids = [];
    var names = [];

    $("!SurveyImageGroup").fields(["id", "name"]).setOrderBy(["name"], [SCFILE_ASC]).selectAll().each(function(group) {
        ids.push(group.id);
        names.push(group.name);
    });

    return [ids, names];
}


/**
 * get survey image id according to the value in a specific image group
 *
 * @param {Number} imageGroupId
 * @param {String} value
 * @returns {Number}
 */
function getImageIdByValue(imageGroupId, value) {
    var group = $("!SurveyImageGroup").fields("images").find("id=:id", imageGroupId).one();
    if (!group) {
        return -1;
    }

    var images = group.images;
    if (!images) {
        return -1;
    }

    var i;
    var length = images.length();
    for (i = 0; i < length; i++) {
        var image = images[i];
        if (image.value == value) {
            return image.image;
        }
    }

    return -1;
}


/**
 * check whether image is used in group
 *
 * @param {Number} imageId
 * @returns {Boolean}
 */
function isImageUsedInGroup(imageId) {
    var isUsed = false;

    $("!SurveyImageGroup").fields("images").selectAll().each(function(group) {
        var images = group.images;
        if (!images) {
            return false;
        }

        var i;
        var length = images.length();
        for (i = 0; i < length; i++) {
            var image = images[i];
            if (image.image == imageId) {
                isUsed = true;
                return true;
            }
        }
    });

    return isUsed;
}


/**
 * check whether image group is used in question
 *
 * @param {Number} groupId
 * @returns {Boolean}
 */
function isImageGroupUsedInQuestion(groupId) {
    var question = $("!svcSrcSurveyConfig").fields("id").find("image.list=:id", groupId).one();
    return (question != null);
}


/**
 * sort image mapping according to the value
 *
 * @param {SCFile} imageGroup
 */
function sortImageMapping(imageGroup) {
    var images = lib.ArrayUtil.toJsArray(imageGroup.images);
    if (images) {
        var sorted = lib.ArrayUtil.sortBy(images, function(obj) {
            if (obj[0]) {
                return obj[0];
            }
        });
        imageGroup.images = lib.ArrayUtil.toSCDatum(sorted);
    }
}


/**
 * check image group mapping
 *
 * @param {SCFile} imageGroup
 * @returns {Boolean}
 */
function isImageMappingValid(imageGroup) {
    var images = funcs.denull(imageGroup.images);

    var i;
    var length = images.length();
    var valueSet = new Set();

    for (i = 0; i < length; i++) {
        var image = images[i];
        if (!image) {
            continue;
        }
        image = image.toArray();

        var value = image[0];
        var id = image[1];

        // value should be unique and not null, image id should be valid
        if (!value || valueSet.has(value) || id == null || id <= 0) {
            return false;
        }

        // image should existed
        var fImage = $("!SurveyImage").fields("id").find("id=:id", id).one();
        if (!fImage) {
            return false;
        }

        valueSet.add(value);
    }

    return true;
}