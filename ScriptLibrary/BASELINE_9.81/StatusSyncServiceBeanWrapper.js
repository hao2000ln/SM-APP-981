/**
 *  This function is wrapper to call method of JS bean 'StatusSyncService'
 *
 *  @param {methodname} string- The name of meothod.
 *  @param {arg} string - The argument to call the method.
 *  @return {object}  -  The result returned by the method.
 */
function callBeanMethod(methodname, arg) {
    var bean = lib.c.$("#StatusSyncService");
    var res = bean[methodname](arg);
    return res;
}