var $ = lib.c.$;

var FormatService = $({
	getFormat : function(name) {
		return $("format").select('name="' + name + '"').uniqueResult();
	},

	getFormatForFile : function(fileName) {
		var format = $("format").select('file.name="' + fileName + '"')
				.uniqueResult();
		if (format == null) {
			format = $("format").select('name like "' + fileName + '*"')
					.uniqueResult();
		}
		return format;
	}
});

function getClass() {
	return FormatService;
}