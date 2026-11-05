var log = getLog("IncidentConsumer");
var Class = lib.Prototype.getClass();
var client = {};
var JSON_processElement = lib.XML_JSON.processElement;

client.IncidentConsumer = Class.create(lib.BaseConsumer.getClass(), {

    initialize: function($super, mappingHandler) {
        $super();
        this.setMappingHandler(mappingHandler);
        this.keyFields = ["id", "number"];
    },

    getKeyFields: function() {
        return this.keyFields;
    },

    getActivityLogBdmField: function() {
        return "activity_log";
    },

    updateXmlEntry: function($super, strXml, dao, keyFieldNames) {
        log.debug("updateXmlEntry()");
        if (keyFieldNames == null) {
            var xml = new XML();
            xml.setContent(strXml);
            var root = xml.getDocumentElement();
            var json = {};
            JSON_processElement(root, json);
            var entryTag;
            var f;
            for (f in json) {
                entryTag = json[f];
                break;
            }
            var dbRecord = this._BDM2SCFile(entryTag);
            this.removeNullField(dbRecord);
            if (log.isDebugEnabled()) {
                log.debug("updateXmlEntry()" + JSON.stringify(dbRecord));
            }
            if (dbRecord.id == "") {
                delete dbRecord.id;
            }
            var quiryObj = {};
            if (dbRecord.id != null) {
                quiryObj.id = dbRecord.id;
                if (log.isDebugEnabled()) {
                    log.debug("update incident by id " + quiryObj.id);
                }
            }
            if (dbRecord.number != null) {
                quiryObj.number = dbRecord.number;
                if (log.isDebugEnabled()) {
                    log.debug("update incident by number " + dbRecord.number);
                }
            }
            dao.setMappingHandler(this.mappingHandler);
            dao.update(quiryObj, dbRecord);
        } else {
            return $super(strXml, dao, keyFieldNames);
        }
    },

    appendActivityLog: function(strXml, dao) {
        var xml = new XML();
        xml.setContent(strXml);
        var root = xml.getDocumentElement();
        var json = {};
        JSON_processElement(root, json);
        var entryTag;
        var f;
        for (f in json) {
            entryTag = json[f];
            break;
        }
        var dbRecord = this._BDM2SCFile(entryTag);
        var actlog = this.mappingHandler.mappingContext.getActivityLog();
        var quiryObj = {};
        var keyFieldNames = this.getKeyFields();
        var i;
        for (i = 0; i < keyFieldNames.length; i++) {
            if (dbRecord[keyFieldNames[i]] != null) {
                quiryObj[keyFieldNames[i]] = dbRecord[keyFieldNames[i]];
                if (log.isDebugEnabled()) {
                    log.debug("appendActivityLog() by " + keyFieldNames[i] + " = " + dbRecord[keyFieldNames[i]]);
                }
                break;
            }
        }
        dao.appendActivityLog(quiryObj, actlog);
        if (log.isDebugEnabled()) {
            log.debug("appendActivityLog() Entry updated to SM: " + dao.getKeyFields()[0]);
        }
    },

    updateXmlEntryByNumber: function($super, strXml, dao) {
        this.updateXmlEntry(strXml, dao, ["number"]);
    },

    updateXmlEntryById: function($super, strXml, dao) {
        this.updateXmlEntry(strXml, dao, ["id"]);
    },

    getIdPrefix: function() {
        return "urn:x-hp:software:servicemanager:incident:id:";
    },

    getClassName: function() {
        return "client.IncidentConsumer";
    }
});

function getClass() {
    return client.IncidentConsumer;
}