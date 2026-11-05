var $ = lib.c.$;
var getSettingValue = lib.settings.getSettingValue;
var filenm = system.functions.filename;
var CategoryService = $({
    isCategoryInUse: function (file) {
        var defaultcategory;
        switch (filenm(file)) {
        case "pbmCategory":
            defaultcategory = getSettingValue("Problem", "default.category");
            break;
        case "pbmTaskCat":
            defaultcategory = getSettingValue("Problem Task", "default.category");
            break;
        case "imCategory":
            defaultcategory = getSettingValue("Incident", "default.category");
            break;
        case "imTaskCat":
            defaultcategory = getSettingValue("Incident Task", "default.category");
            break;
        case "sdCategory":
            defaultcategory = getSettingValue("Service Desk", "default.category");
            break;
        default:
            defaultcategory = "";
        }
        if (defaultcategory == file["name"])
            return true;
        return false;

    }

});

function getClass() {
    return CategoryService;
}