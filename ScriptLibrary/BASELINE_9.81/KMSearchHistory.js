function KMSearchHistory() {}

/** 
	This function is used to get the next sequential key for th KMSearchHistory table
**/
function newId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, "kmsearchhistory");
    return newid.getText();
}

/**
	This function logs an entry in the kmsearchhistory table.  It is called from
	kmquery.submitsearch everytime a user submits a search
**/
function addSearchHistory(strQuery, numHits, strContext) {
    var searchHistory = new SCFile("kmsearchhistory");
    searchHistory.id = this.newId();
    searchHistory.query = strQuery;

    var hits = typeof(numHits) == "number" ? numHits : parseInt(numHits);
    if (Number.isNaN(hits)) {
        hits = 0;
    }
    searchHistory.hits = hits;

    if (strContext != null) {
        searchHistory.contexttag = strContext;
    }
    if (funcs.nullsub(vars.$G_ess, false)) {
        searchHistory.ESS = true;
    } else {
        searchHistory.ESS = false;
    }
    searchHistory.escalated = false;
    searchHistory.userid = funcs.operator();
    searchHistory.doInsert();
}

function addSearchHistoryEscalation(strQuery, strContext) {
    var searchHistory = new SCFile("kmsearchhistory");
    searchHistory.id = this.newId();
    searchHistory.query = strQuery;
    if (strContext != null) {
        searchHistory.contexttag = strContext;
    }
    if (funcs.nullsub(vars.$G_ess, false)) {
        searchHistory.ESS = true;
    } else {
        searchHistory.ESS = false;
    }
    searchHistory.userid = funcs.operator();
    searchHistory.escalated = true;
    searchHistory.doInsert();
}