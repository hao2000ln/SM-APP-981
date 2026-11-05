var $ = lib.c.$;

var LinkService = $(new function() {
    var formatService = $("#formatService");
    var dbdictService = $("#relationManagerDbdictService");
    var relationService = $("#relationService");
    var rte = new Datum(2);


    return {
        buildRelations: function() {

            var tmpThis = this;
            var links = $("!link").selectAll().iterate(function(record) {
                tmpThis.buildRelationWithLink(record);
            });
        },

        isBlank: function(value) {
            if ($.isEmpty(value)) {
                return true;
            } else if (value.length() == 0) {
                return true;
            } else {
                return false;
            }
        },

        buildRelationWithLink: function(link) {
            var hasPostExpression = false;
            var sourceFile;

            var sourceFields = link["source.fields"];
            var targetFiles = link["target.files"];
            var targetFields = link["target.fields"];
            var postExpressions = link["post.expressions"];
            var postJavascripts = link["javascript.post"];

            var dbdict1 = dbdictService.getDbdictWithCacheByLinkName(link["name"]);
            if (dbdict1 != null) {
                sourceFile = dbdict1["name"];
            }

            var i;
            var length = sourceFields.length();
            for (i = 0; i < length; i++) {
                var targetFile = targetFiles[i];
                var postExpression = postExpressions[i];
                var postJavascript = postJavascripts[i];
                var sourceField = sourceFields[i];
                var targetField = targetFields[i];

                // skip the empty linkline
                if ($.isEmpty(sourceField) && $.isEmpty(targetFile) && $.isEmpty(targetField)) {
                    continue;
                }

                hasPostExpression = !($.isEmpty(postJavascript) && this.isBlank(postExpression));

                relationService.buildRelation(sourceFile,
                    sourceField,
                    targetFile,
                    targetField,
                    "link",
                    'name="' + link["name"] + '"',
                    hasPostExpression, null);
            }
        }
    };
});

function getClass() {
    return LinkService;
}