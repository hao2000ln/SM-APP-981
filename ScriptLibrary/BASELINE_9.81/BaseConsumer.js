var log = getLog("BaseConsumer");
var Class = lib.Prototype.getClass();
var client = {};
var JSON_processElement = lib.XML_JSON.processElement;

client.BaseConsumer = Class.create(lib.BaseObject.getClass(), {

    initialize: function($super, url, user, password) {
        $super();
        this.url = url;
        this.user = user;
        this.password = password;
    },

    setMappingHandler: function(mappingHandler) {
        this.mappingHandler = mappingHandler;
    },

    getClassName: function() {
        return "client.BaseConsumer";
    },

    setBNMMapping: function(mapping) {
        this._mapping = mapping;
    },
    
    setUser: function(user) {
        this.user = user;
    },
    
    setPassword: function(password) {
        this.password = password;
    },
    
    setUrl: function(url) {
        this.url = url;
    },

    /**
    consume the BDM feed from the list page
    */
    consumeJson: function(dao) {
        var feed = this.fetchJson();
        var jsonParser = new JsonParser();
        var result = jsonParser.parse(feed, false);
        var list = result.entryList;
        var count = 0;
        var i;
        for (i = 0; i < list.length; i++) {
            var entry = new BdmJsonObject(list[i]);
            if (log.isDebugEnabled()) {
                log.debug("add Entry to SM: " + entry.getField("id"));
            }
            dao.save(this._BDM2SCFile(entry));
            count++;
        }
        if (log.isDebugEnabled()) {
            log.debug(" total " + count + " consumed ");
        }
        return count;
    },

    /**
        As a client to consume a Feed on remote server
    */
    consumeAtom: function consumeAtom(dao) {
        if (log.isDebugEnabled()) {
            log.debug("consume ATOM feed");
        }

        var strXml = con.fetchAtom();
        var feedParser = new PaginationFeedParser(strXml, this);
        var addCount = 0;
        var updateCount = 0;
        var totolCount = 0;

        while (feedParser.hasNextEntry()) {
            var xmlnode = feedParser.nextEntry();
            var json = {};
            JSON_processElement(xmlnode, json);
            var entryJson = json.entry;

            var dbRecord = this._BDM2SCFile(entryJson);
            if (!this.findEntry(dbRecord, dao)) {
                this.consumeRelationship(dbRecord, xmlnode, dao, true);
                dao.save(dbRecord);
                addCount++;
            } else {
                if (this.isEntryChanged(dbRecord, dao)) {
                    this.consumeRelationship(dbRecord, xmlnode, dao, false);
                    dao.update(dbRecord);
                    updateCount++;
                } else {
                    // means no field changed found util relationShip checking.
                    if (this.consumeRelationship(dbRecord, xmlnode, dao, false)) {
                        // relationShip changed                         
                        dao.update(dbRecord);
                        updateCount++;
                    }
                }
            }
            totolCount++;
        }

        if (log.isDebugEnabled()) {
            log.debug(" total " + totolCount + " consumed, " + addCount + " added " + updateCount + " updated");
        }

        return totalCount;
    },

    /**
    override this method to implement special Relationship logic in each subclass
    @param dbRecord SM the record parsed by field mapping
    @param isToCreate true to indicate this is a new record to be save, false value to indicate this record exists and it should be upated
    @return true to indicate that relationship field is changed.
    */
    consumeRelationship: function(dbRecord, xmlNode, dao, isToCreate) {},

    isEntryChanged: function(dbRecord, dao) {
        var changed = false;
        var f;
        for (f in dbRecord) {
            var value = dao.getFieldValue(f);
            if (log.isDebugEnabled()) {
                log.debug("isEntryChanged() compare " + f);
            }
            if (dbRecord[f] != value) {
                if (!client.BaseConsumer.isEqual(dbRecord[f], value)) {
                    changed = true;
                    if (log.isDebugEnabled()) {
                        log.debug("field \"" + f + "\" is dirty " + dbRecord[f] + " <-> " + dao.getFieldValue(f));
                    }
                    break;
                }
            }
        }

        return changed;
    },

    findEntry: function(dbRecord, dao) {
        var smField = this.mappingHandler.map2smField("id", true);
        var value = dbRecord[smField];
        if (log.isDebugEnabled()) {
            log.debug("findEntry() smField = " + smField + " value=" + value);
        }

        var query = {};
        query[smField] = value;
        var found = dao.search(query);
        if (found && log.isDebugEnabled()) {
            log.debug("entry " + smField + "=" + value + " is found");
        }

        return found;
    },

    /**
    As a server to serve a creation operation.
    For server side creation operation
    */
    consumeXmlEntry: function consumeXmlEntry(strXml, dao) {
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
        delete dbRecord[dao.getKeyField()];
        dao.save(dbRecord);
        if (log.isDebugEnabled()) {
            log.debug("consumeXmlEntry() Entry added to SM: " + dao.getKeyFields()[0]);
        }
    },

    /**
    @param keyFieldNames an array of string which contains SM keyfields
    */
    updateXmlEntry: function updateXmlEntry(strXml, dao, keyFieldNames) {
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
        if (dbRecord.id == "") {
            delete dbRecord.id;
        }

        var i;
        if (keyFieldNames == null) {
            keyFieldNames = [];
            if (dbRecord[dao.getKeyFields()[0]] != null) {
                var l = dao.getKeyFields().length;
                for (i = 0; i < l; i++) {
                    keyFieldNames.push(dao.getKeyFields()[i]);
                }
            } else {
                keyFieldNames.push("id");
            }
        }

        var quiryObj = {};
        for (i = 0; i < keyFieldNames.length; i++) {
            quiryObj[keyFieldNames[i]] = dbRecord[keyFieldNames[i]];
        }

        if (log.isDebugEnabled()) {
            log.debug("updateXmlEntry() dbRecord=" + JSON.stringify(dbRecord) + " query obj=" + JSON.stringify(quiryObj));
        }
        dao.update(quiryObj, dbRecord);
        if (log.isDebugEnabled()) {
            log.debug("updateXmlEntry() Entry updated to SM: " + dao.getKeyFields()[0]);
        }
    },

    representByKey: function(dao, keys) {
        var inquiryMap = {};
        var keyFields = dao.getKeyFields();
        if (keys instanceof Array) {
            var i;
            for (i = 0; i < keys.length; i++) {
                inquiryMap[keyFields[i]] = keys[i];
            }
        } else {
            inquiryMap[dao.getKeyField()] = keys;
        }
        dao.search(inquiryMap);
        var res = this.mappingHandler.SMToBDM(dao.scFile);
        return res;
    },

    removeNullField: function(smobj) {
        var f;
        for (f in smobj) {
            if (smobj[f] == null) {
                delete smobj[f];
            }
        }
    },

    removeIdPrefix: function(id) {
        return id.substring(this.getIdPrefix().length);
    },

    /**
    override this method in sub class
    */
    getIdPrefix: function() {
        return "urn:x-hp:software:servicemanager:incident:id:";
    },

    consume: function(dao) {
        return this.consumeJson();
    },

    /**
    retrieve entries from every page of .../xxx-list/<id>
    */
    deepConsume: function(dao) {
        var feed = this.fetchJson();
        var jsonParser = new JsonParser();
        var result = jsonParser.parse(feed, false);
        var list = result.entryList;
        var i;
        for (i = 0; i < list.length; i++) {
            var id = list[i].id["$"];
            if (log.isDebugEnabled()) {
                log.debug("request CI : " + list[i].id["$"]);
            }
            var entryFeed = this.fetchFeed(this.url + "/" + id + "?alt=application%2Fjson");
            if (log.isDebugEnabled()) {
                log.debug(entryFeed);
            }
            //todo
        }
    },

    fetchFeed: function(url) {
        if (url == null) {
            url = this.url;
        }
        var http_action = "GET";
        var httpHeaders = [];
        var acceptlanguage = new Header();
        acceptlanguage.name = "Accept-Language";
        acceptlanguage.value = "en";
        httpHeaders.push(acceptlanguage);
        if (this.user != null) {
            if (this.password == null) {
                this.password = "";
            }
            var authHeader = new Header();
            authHeader.name = "Authorization";
            authHeader.value = "Basic " + lib.RestClient.encode64(this.user + ":" + this.password);
            if (log.isDebugEnabled()) {
                log.debug("BA=" + authHeader.value);
            }
            httpHeaders.push(authHeader);
        }

        return lib.RestClient.doRestRequest(url, http_action, httpHeaders, 60, 60, 60);
    },

    fetchJson: function() {
        return this.fetchFeed(this.url + "?alt=application%2Fjson");
    },

    fetchAtom: function() {
        return this.fetchFeed(this.url + "?alt=application%2Fatom%2Bxml");
    },

    /**
    This method should be override
    */
    _BDM2SCFile: function(BDMobj) {
        var data = this.mappingHandler.bdmObject2smObject(BDMobj);
        return data;
    }

});

client.BaseConsumer.isEqual = function(o1, o2) {
    if (o1 == o2) {
        return true;
    }
    if (o1 == null) {
        return o2 == null;
    }
    if (o1 instanceof Array) {
        if (o2 == null) {
            return false;
        }
        o2 = o2.toArray();
        if (o1.length != o2.length) {
            return false;
        }

        var i;
        for (i = 0; i < o1.length; i++) {
            if (!client.BaseConsumer.isEqual(o1[i], o2[i])) {
                return false;
            }
        }
        return true;
    } else if (o1 instanceof Date || o1.getTime instanceof Function) {
        return o1.getTime() == o2.getTime();
    }

    return false;
};

function getClass() {
    return client.BaseConsumer;
}