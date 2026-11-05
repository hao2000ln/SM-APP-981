var $ = lib.c.$;

var ScrelationService = $({
	countRelatedRecords : function(source, qry) {
		qry = qry || "";
		var count = $("screlation").count("source=\"" + source + "\"" + qry);
		return count;
	},
	
	getRelatedRecord : function(query) {
		return $("screlation", SCFILE_READONLY).select(query).uniqueResult();
	}
});

function getClass() {
	return ScrelationService;
}