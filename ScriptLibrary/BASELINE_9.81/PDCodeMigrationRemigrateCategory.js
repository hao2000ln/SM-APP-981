var $ = lib.c.$;

function remigrate() {
    vars['$cat2migrate'] = [""];
    vars['$sdcat2migrate.selected'] = ["complaint", "incident", "request for change", "request for information", "service catalog"];
    vars['$imcat2migrate.selected'] = ["complaint", "incident", "request for information", "request for change"];
    vars['$pmcat2migrate.selected'] = ["problem"];
    lib.PDCodeMigration.utilCleanPDCategories("sdCategory", vars['$sdcat2migrate.selected'].toArray());
    lib.PDCodeMigration.utilCleanPDCategories("imCategory", vars['$imcat2migrate.selected'].toArray());
    lib.PDCodeMigration.utilCleanPDCategories("pbmCategory", vars['$pmcat2migrate.selected'].toArray());

    lib.PDCodeMigration.migrateIncidentCategories();
}





function reSyncSteriaCustFields() {
    var producttype = new SCFile("producttype");
    var rc = producttype.doSelect('true');
    while(rc == RC_SUCCESS) {
        var sql = 'area.name="' + producttype["product.type"] + '" and category="' + producttype["category"] + '" and subcategory="' + producttype["subcategory"] + '"';
        if(producttype["company"]==null) {
          sql += ' and company=NULL';
        } else {
          sql += ' and company="' + producttype["company"] + '"';
        }
        var imArea = $("imArea").select(sql).uniqueResult();
        if (imArea!=null) {
            imArea.severity = producttype.severity;
            imArea.assignment = producttype.assignment;
            imArea["secondary.assignment"] = producttype["secondary.assignment"];
            imArea.variable1 = producttype.variable1;
            imArea.variable2 = producttype.variable2;
            imArea.variable3 = producttype.variable3;
            imArea["variable3.all"] = producttype["variable3.all"];
            imArea.doUpdate();
        } else {
        }
        
        var sdArea = $("sdArea").select(sql).uniqueResult();
        if (sdArea!=null) {
            sdArea.severity = producttype.severity;
            sdArea.assignment = producttype.assignment;
            sdArea["secondary.assignment"] = producttype["secondary.assignment"];
            sdArea.variable1 = producttype.variable1;
            sdArea.variable2 = producttype.variable2;
            sdArea.variable3 = producttype.variable3;
            sdArea["variable3.all"] = producttype["variable3.all"];
            sdArea.doUpdate();
        } else {
        }
        
        var pbmArea = $("sdArea").select(sql).uniqueResult();
        if (pbmArea!=null) {
            pbmArea.severity = producttype.severity;
            pbmArea.assignment = producttype.assignment;
            pbmArea["secondary.assignment"] = producttype["secondary.assignment"];
            pbmArea.variable1 = producttype.variable1;
            pbmArea.variable2 = producttype.variable2;
            pbmArea.variable3 = producttype.variable3;
            pbmArea["variable3.all"] = producttype["variable3.all"];
            pbmArea.doUpdate();
        } else {
        }

        rc = producttype.getNext();
    }
}

