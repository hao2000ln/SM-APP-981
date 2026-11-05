var $ = lib.c.$;

var dbdict = $("cm3r").dbdict();
var dbdictService = $("#dbdictService");
var descriptor = dbdictService.getDescriptorMeta(dbdict["field"]);
var fieldMeta = dbdictService.getFieldMeta("affected.services", descriptor);

print(dbdictService.isLob(fieldMeta.field["sql.field.options"]));
print(dbdictService.isLobField(fieldMeta));