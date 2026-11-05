var $ = lib.c.$;

var JoindefsService = $(new function() {
	var dbdictService = $("#dbdictService");

	return {
		getDbdictByJoinName : function(joinName, joinField) {
			var dbdict = dbdictService.getValidDbdict(joinName);
			if (dbdict == null) {
				var joindefs = $("joindefs").select(
						'join.name="' + joinName + '"').uniqueResult();
				if (joindefs != null) {
					var joinTables = joindefs["join.tables"];
					for ( var i = 0; i < joinTables.length(); i++) {
						var joinTable = joinTables[i];
						var tableName = joinTable["table.name"];
						var table = dbdictService.getValidDbdict(tableName);
						if (table != null) {
							if (dbdictService.getFieldByName(joinField,
									table["field"]) != null) {
								dbdict = table;
								break;
							}
						}
					}
				}
			}
			return dbdict;
		}
	};
});

function getClass() {
	return JoindefsService;
}