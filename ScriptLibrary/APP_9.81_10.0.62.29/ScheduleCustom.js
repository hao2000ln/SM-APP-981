var REQUIRE_LIST = ['sla', 'alert'];

/**
 * Whether to send email notification
 * @param actionList: [{type:'force-unlock', value:'nameOfLock'}, {}]
 * @param bgList: [{name:'alert', count:2}, {name:'sla', count:2}..]
 * @param oldBgList: [{name:'alert', count:2}, {name:'sla', count:2}..]
 */
function shouldSendEmail(actionList, bgList, oldBgList) {
    if (actionList.length > 0) return true;

    var bgMap = {};
    for (var k = 0; k < bgList.length; k++) {
        var item = bgList[k];
        bgMap[item.name] = item.count;
    }

    for (var k = 0; k < REQUIRE_LIST.length; k++) {
        var name = REQUIRE_LIST[k];
        if (!bgMap[name]) return true;
    }

    return false;
}