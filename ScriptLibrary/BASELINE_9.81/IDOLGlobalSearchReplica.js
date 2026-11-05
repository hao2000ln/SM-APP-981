var _ = lib.Underscore.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();
var logger = getLog('IDOLGlobalSearchReplica');

var IDOLGlobalSearchReplica = (function() {

    function getReplica() {
        var IDOLClient = IDOLClientFactory.create('GlobalSearch');

        var idolReplicas = getSystemCacheValue("GlobalSearch", "Default", "idol_replicas");
        if (!IDOLClient.isInContainer() && !idolReplicas) {
            try {
                var config = IDOLClient.executeServiceAction({
                    "action": 'getConfig'
                });
                var replicas = /^\s*replicas\s*=\s*(\d+)/igm;

                var match = replicas.exec(config);
                if (match) {
                    var count = parseInt(match[1], 10) || 0;
                    idolReplicas = count + 1;
                } else {
                    idolReplicas = 1;
                }
                setSystemCacheValue("GlobalSearch", "Default", "idol_replicas", idolReplicas);
            } catch (e) {
                logger.error("getReplica catch exception:" + e);
                return 1;
            }
        }
        if (idolReplicas == null) {
            return 1;
        }
        return parseInt(idolReplicas, 10);
    }

    return {
        getReplica: _.memoize(getReplica)
    };
}());


function require() {
    return IDOLGlobalSearchReplica;
}