function migrate(context, smItem) {
    var almId = smItem['qcintegration.id'];
    var almType = smItem['qcintegration.type'];

    // no alm id found
    if (!almId) {
        funcs.msg(getRecordName(smItem) + ' failed, invalid ALM ID found: ' + almId, 2);
        return;
    }

    // no forward flaged
    if (!almType || almType < 1) {
        funcs.msg(getRecordName(smItem) + ' failed, invalid ALM Type found: ' + almType, 2);
        return;
    }

    var almAction = null;
    if (almType == 1) {
        if (funcs.filename(smItem) == 'cm3r') {
            almAction = 'changeToFeature';
        } else {
            almAction = 'problemToDefect';
        }
    } else if (almType == 2) {
        almAction = 'changeToDefect';
    }

    if (!almAction) {
        funcs.msg(getRecordName(smItem) + ' failed, Cannot calc almAction by the almType (qcintegration.type): ' + almType, 2);
        return;
    }

    doMigrate(context, smItem, almAction, almId);

}


function doMigrate(context, smItem, almAction, almId) {
    var smId = getRecordId(smItem);
    var smTable = funcs.filename(smItem);

    var info = lib.c.$('!AlmInfo').fields('id').find('smTable=:table and smId=:id', smTable, smId).one();
    if (info) {
        funcs.msg(getRecordName(smItem) + ' failed, AlmInfo Record with id ' + info.id + ' already exists for ' + smTable + ': ' + smId, 2);
        return;
    }

    var almTable = 'defect';
    if (almAction == 'changeToFeature') {
        almTable = 'requirement';
    }

    var oct2SmFieldList = lib.OctaneUtil.getOct2SmFields(context, almAction);
    var sm2OctFieldList = lib.OctaneUtil.getSm2OctFields(context, almAction);

    var epItem = lib.OctaneTask.getEpItem(context, almTable, almId, oct2SmFieldList);
    if (null == epItem) {
        funcs.msg(getRecordName(smItem) + ' failed, failed to find ' + almTable + ': ' + almId + ' in ALM', 2);
        return;
    }

    var smData = lib.OctaneTask.makeEpInfoSmData(smItem, sm2OctFieldList);

    // create AlmInfo and AlmInfoMore records
    var info = lib.OctaneTask.createEpInfo(context, almAction, smItem, epItem, smData);
    lib.OctaneTask.createEpInfoInfoMore(context, info);


    // Update ALM fields: smId and smTable
    var body = {};
    
    if(almTable=='defect') {
        body[context.field_defect_table_id] = smId;
        body[context.field_defect_table_name] = smTable + '-' + context.intId;
    } else { // requirement
        body[context.field_feature_table_id] = smId;
        body[context.field_feature_table_name] = smTable + '-' + context.intId;
    }
    body = lib.AlmUtil.makeEpBody(body);
    var resp = lib.AlmUtil.updateEpItem(context, almTable + 's', almId, body);

    if (resp.isOk()) {
        print(getRecordName(smItem) + ', migrated success.');
    } else {
        print(getRecordName(smItem) + ', failed to update ALM record.');
    }

    // update almAction in record
    smItem.almAction = almAction;
    smItem.doUpdate();
}

function getRecordId(smItem) {
    var fileName = funcs.filename(smItem);

    if (fileName === 'cm3r') return smItem.number;
    if (fileName === 'rootcause') return smItem.id;

    return null;
}

function getRecordName(smItem) {
    var fileName = funcs.filename(smItem);

    if (fileName === 'cm3r') return 'Change ' + smItem.number;
    if (fileName === 'rootcause') return 'Problem ' + smItem.id;

    return null;
}


function createContext(smisIntId) {
    if (!smisIntId) {
        return;
    }

    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(smisIntId);
    if (!configItem || configItem.template != 'SMALM') {
        funcs.msg('Invalid SMIS intance ID: ' + smisIntId, 2);
        return;
    }

    var context = lib.AlmUtil.createContext(configItem);
    var loginInfo = context.login(context.workspace);

    if (!loginInfo) {
        funcs.msg('Error to login ALM Project, check settings', 2);
        return;
    }

    return context;
}