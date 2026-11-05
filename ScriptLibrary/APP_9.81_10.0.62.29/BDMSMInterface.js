var log = getLog("BDMSMInterface");

function createResource(objectName, xml, mappingHandler) {
    objectName = objectName.substring(0, 1).toUpperCase() + objectName.substring(1);
    if (log.isDebugEnabled()) {
        log.debug("createResource() objectName " + objectName);
    }
    var Consumer = lib[objectName + "Consumer"].getClass();
    var consumer = new Consumer(mappingHandler);
    var DAO = lib.SMDAOFactory.getDAO(objectName);
    var dao = new DAO();
    consumer.consumeXmlEntry(xml, dao);
    var refnumber = dao.getString(dao.getKeyField());
    log.debug("createResource() key:" + refnumber);
    var ret = consumer.representByKey(dao, refnumber);
    return ret;
}

function updateResource(objectName, xml, mappingHandler) {
    objectName = objectName.substring(0, 1).toUpperCase() + objectName.substring(1);
    if (log.isDebugEnabled()) {
        log.debug("updateResource() objectName " + objectName);
    }
    var Consumer = lib[objectName + "Consumer"].getClass();
    var consumer = new Consumer(mappingHandler);
    var DAO = lib.SMDAOFactory.getDAO(objectName);
    var dao = new DAO();
    consumer.updateXmlEntry(xml, dao);
    var refnumber = dao.getString(dao.getKeyField());
    log.debug("updateResource() key:" + refnumber);
    log.debug("return id:" + dao.scFile.id);
    var res = consumer.representByKey(dao, refnumber);
    return res;
}

function appendActivityLog(objectName, xml, mappingHandler) {
    objectName = objectName.substring(0, 1).toUpperCase() + objectName.substring(1);
    if (log.isDebugEnabled()) {
        log.debug("updateActivities() objectName " + objectName);
    }
    var Consumer = lib[objectName + "Consumer"].getClass();
    var consumer = new Consumer(mappingHandler);
    var DAO = lib.SMDAOFactory.getDAO(objectName);
    var dao = new DAO();
    consumer.appendActivityLog(xml, dao, null);
    var refnumber = dao.getString(dao.getKeyField());
    if (log.isDebugEnabled()) {
        log.debug("updateActivities() key:" + refnumber);
        log.debug("return id:" + dao.scFile.id);
    }
    var res = consumer.representByKey(dao, refnumber);
    return res;
}