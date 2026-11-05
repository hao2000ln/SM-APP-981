var $ = lib.c.$;
function removeAbandonedInboxRecords() {
    var sql = "inbox.id isin {168,169,243,251,255,150,152,153,222,53}";
    $("inbox").select(sql).iterate(function(record) {
        record.doDelete();
    });
}
