function addCategoryRecord(tablename, name, workflow, active, sharedflag, company, description) {
    var record = new SCFile(tablename);
    record.name = name;
    record.active = active;
    record.workflow = workflow;
    record.sharedflag = sharedflag;
    record.company = company;
    record.description = description;
    record.doInsert();
}

function addSubCategoryRecord(tablename, subcategory_name, category, active, sharedflag, company, description) {
    var record = new SCFile(tablename);
    record.category = category;
    record.subcategory_name = subcategory_name;
    record.active = active;
    record.sharedflag = sharedflag;
    record.company = company;
    record.description = description;
    record.doInsert();
}

function addAreaRecord(tablename, area_name, subcategory, category, active, sharedflag, company, description) {
    var record = new SCFile(tablename);
    record.area_name = area_name;
    record.category = category;
    record.subcategory = subcategory;
    record.active = active;
    record.sharedflag = sharedflag;
    record.company = company;
    record.description = description;
    record.doInsert();
}

function checkCateoryIsExisting(tablename, categoryname) {
    var sql = "name=\"" + categoryname + "\"";
    var record = new SCFile(tablename);
    if (record.doSelect(sql) == RC_SUCCESS) {
        return true;
    }
    return false;
}