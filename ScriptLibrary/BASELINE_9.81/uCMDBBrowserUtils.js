var addCIUcmdbIDs = lib.uCMDBBrowserUrl.addCIUcmdbIDs;

/**
	Calculate How many CIs with ucmdb.id in ticket, and divided to how many
	pages to send to UCMDB to do Impact Analysis, due to URL size limitation.
**/
function calcImpactCIsAndPages(file) {

    var filename = funcs.filename(file);

    vars.$L_allimpactsourcecis = [];
    addCIUcmdbIDs(file["affected.item"], vars.$L_allimpactsourcecis);
    vars.$L_customer_id = lib.discoveryEvent.getUCMDBCustomerIDByLogicalName(file["affected.item"]);
    if ("cm3r" == filename) {
        addCIUcmdbIDs(file["assets"], vars.$L_allimpactsourcecis);
        if (!vars.$L_customer_id) {
            vars.$L_customer_id = lib.discoveryEvent.getUCMDBCustomerIDByLogicalNameArray(file["assets"]);
        }
    } else if ("cm3t" == filename) {
        addCIUcmdbIDs(file["asset"], vars.$L_allimpactsourcecis);
        if (!vars.$L_customer_id) {
            vars.$L_customer_id = lib.discoveryEvent.getUCMDBCustomerIDByLogicalNameArray(file["asset"]);
        }
    } else {
        addCIUcmdbIDs(file["logical.name"], vars.$L_allimpactsourcecis);
        if (!vars.$L_customer_id) {
            vars.$L_customer_id = lib.discoveryEvent.getUCMDBCustomerIDByLogicalName(file["logical.name"]);
        }
    }
    vars.$L_ci_ids_string = vars.$L_allimpactsourcecis.join(",");
    var totalCIs = vars.$L_allimpactsourcecis.length();
    vars.$L_impacttotalpages = totalCIs;
    var cisperpage = lib.uCMDBConfiguration.getCIsPerImpactPage();
    if (cisperpage && cisperpage > 0) {
        vars.$L_impacttotalpages = parseInt((totalCIs + cisperpage - 1) / cisperpage);
    }
}

function showUcmdbBrowserRelatedWidgetForCI(ucmdbid) {
    if (lib.BaseUtil.isWebClient() && lib.uCMDBConfiguration.getBrowserUrl() != null) {
        return true;
    }
    return false;
}