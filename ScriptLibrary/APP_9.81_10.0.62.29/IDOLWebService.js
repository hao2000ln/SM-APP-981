var _ = lib.Underscore.require(),
    api = lib.acicategory;

var DEFAULT_CANDIDATE_NUM = 3;

function cleanup(record) {
  _.each([
    "adapter.id", 
    "level1.field", 
    "level2.field", 
    "level3.field", 
    "content.fields", 
    "top", 
    "compnay", 
    "level1.assigned.value", 
    "level2.assigned.value"
  ], function(fieldname) {
    record[fieldname] = null;
  });
}

function suggest(record, action) {
  var extaccess = vars['$L.extaccess.file'];
  var condition = extaccess['rest.query.rights'] || 'true';

  if (!funcs.parse_evaluate(condition, 4)){
    var name = funcs.filename(record);
    print(funcs.scmsg('3', 'restful', [name, condition]));
    cleanup(record);
    vars['$L.exit'] = 'no auth';
    return;
  }

  var suggests = api.getCategoryByText(
      record["adapter.id"],
      record["top"] || DEFAULT_CANDIDATE_NUM,
      record["content.fields"].toArray().join('\n'),
      record["level1.assigned.value"] || "",
      record["level2.assigned.value"] || "",
      record["company"] || "");

  var result = _.map(suggests, function(suggest) {
    var datum = new SCDatum();
    datum.setType(9); // structure
    datum.push(suggest[0]);
    datum.push(suggest[1]);
    datum.push(suggest[2]);
    return datum;
  });

  cleanup(record);
  record["suggest.candidates"] = result;
  vars.$L_exit = "normal";
}