var $ = lib.c.$;

function getAppVersion() {
	var scversion =  $("scversion").selectAll().uniqueResult();
	return scversion["application.version"];
}