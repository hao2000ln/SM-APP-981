/*
 * This Restful utilities API is used for some special admin operations.
 */

var $ = lib.c.$;
var logger = getLog('RunRestfulUtilities');
//logger.setLevel("debug");


function POST(req, res) {
    if (logger.isDebugEnabled()) {
        logger.debug("POST request: " + (req ? JSON.stringify(req) : "NULL"));
    }

    // invalid action
    var rc = 70;

    var message;

    if (req && req.body && req.body.action) {
        var action = req.body.action;
        var name = action.name;
        var data = action.data;

        if (logger.isDebugEnabled()) {
            logger.debug("POST request action: " + name);
        }

        switch (name) {
            case "setMaxAttachmentSize":
                rc = setMaxAttachmentSize(data);
                break;
            case "lockRecord":
                rc = lockRecord(data);
                break;
            case "unlockRecord":
                rc = unlockRecord(data);
                break;
            default:
                message = `Unsupported action "${name}"`;
        }
    }

    var json = {
        "ReturnCode": RC_SUCCESS
    };
    if (rc != RC_SUCCESS) {
        json = JSON.parse(lib.RestfulMain.makeErrorMsg(rc, message));
    }

    if (logger.isDebugEnabled()) {
        logger.debug("POST response json: " + (json ? JSON.stringify(json) : "NULL"));
    }

    res.status(200).send(json);

    if (logger.isDebugEnabled()) {
        logger.debug("POST response end.");
    }
}

function authorize() {
    // only SysAdmin is allowed
    if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0) {
        return true;
    }

    logger.info('authorize: No "SysAdmin".');
    return false;
}


/**
 * set system maximum attachment size (B)
 *
 * "action": {
 *     "name": "setMaxAttachmentSize",
 *     "data": 1000
 * }
 */
function setMaxAttachmentSize(size) {
    var info = $("info").find('type="company"').one();
    if (size == null) {
        info.max_attach_size = null;
        logger.info("clear maximum attachment size.");
    } else {
        size = Number(size);
        info.max_attach_size = size;
        logger.info(`set maximum attachment size to ${size}(B).`);
    }

    return info.doUpdate();
}


function findRecordbyData(data) {
    var table = data.table;
    var value = data.id;

    var key = lib.dbdictHelper.getUniqueKey(table)[0];
    return $(table).find(`${key}=:value`, value).one();
}


/**
 * lock record
 *
 * "action": {
 *     "name": "lockRecord",
 *     "data": {
 *         "table": "cm3r",
 *         "id": "C10001"
 *     }
 * }
 */
function lockRecord(data) {
    var record = findRecordbyData(data);
    if (!record) {
        return RC_NO_MORE;
    }

    logger.info(`lock record "${data.table}-${data.id}".`);

    var tag = lib.DBUtils.getTagByRecord(record);
    return Lock(tag);
}

/**
 * unlock record
 *
 * "action": {
 *     "name": "unlockRecord",
 *     "data": {
 *         "table": "cm3r",
 *         "id": "C10001"
 *     }
 * }
 */
function unlockRecord(data) {
    var record = findRecordbyData(data);
    if (!record) {
        return RC_NO_MORE;
    }

    logger.info(`unlock record "${data.table}-${data.id}".`);

    var tag = lib.DBUtils.getTagByRecord(record);
    return Unlock(tag);
}