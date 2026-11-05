function setup() {
    setupFieldNames('contacts');
    setupFieldNames('operator');
}

function filterOperatorList(tableName, list) {
    // for operator table
    var excludeList = ['sysmodcount', 'sysmoduser', 'sysmodtime', 'password', 'password.date',
        'reset.by', 'user.login.count', 'last.login', 'password.errors', 'locked.until',
        'ldapauthbase', 'ldap.dn.userid', 'template.operator', 'systemplate', 'idlewarn',
        'idletime', 'max.logins', 'multi.login', 'expire.password', 'never.expire.pass',
        'no.lock.user', 'man.lockout.user', 'locked.reason', 'pwd.history', 'name'
    ];

    if (tableName == 'contacts') {
        excludeList = ['sysmodcount', 'sysmoduser', 'sysmodtime', 'operator.id'];
    }

    var op = new SCFile(tableName);
    var list1 = [];
    var i = 0;

    for (i = 0; i < list.length(); i++) {
        var fieldName = list[i];
        if (funcs.dbdict_helper('is.alias', tableName, fieldName)) {
            continue;
        }

        var type1 = op.getFieldType(fieldName);
        if (type1 == 8) {
            var type2 = op.getFieldType(fieldName + ',1');
            if (type2 == 9) {
                continue;
            }
        }

        if (excludeList.includes(fieldName)) {
            continue;
        }

        list1.push(fieldName);
    }

    vars.$L_tempList = list1;
    return vars.$L_tempList;

}

function setupFieldNames(tableName) {
    var list1 = lib.GetFieldNames.getFieldData(tableName);

    list1 = filterOperatorList(tableName, list1);

    var list2 = lib.convertToCaptions.getFieldCaptions(list1, tableName)

    var attrList = [];

    var k = 0;
    for (k = 0; k < list1.length(); k++) {
        attrList.push({
            name: list1[k],
            label: list2[k]
        });
    }

    attrList.sort(function(a, b) {
        if (a.label > b.label) {
            return 1;
        }
        if (a.label < b.label) {
            return -1;
        }
        return 0;
    });

    var list3 = attrList.map(item => item.name);
    var list4 = attrList.map(item => item.label);

    vars['$' + tableName + '.sm.field.list'] = list3;
    vars['$' + tableName + '.sm.field.list.display'] = list4;
}

function validate(item) {
    if (!validateTable(item, 'operator', 'Operator')) {
        return false;
    }

    if (!validateTable(item, 'contacts', 'Contacts')) {
        return false;
    }

    trimEmptyLine(item, 'operator');
    trimEmptyLine(item, 'contacts');

    return true;
}


function trimEmptyLine(item, tableName) {
    var smFieldName = tableName + '.sm';
    var idmFieldName = tableName + '.idm';

    var smFieldList = funcs.denull(item[smFieldName]);
    var idmFieldList = funcs.denull(item[idmFieldName]);

    var resultSm = [];
    var resultIdm = [];

    var k = 0;
    for (k = 0; k < smFieldList.length(); k++) {
        if (null == item[smFieldName][k] && null == item[idmFieldName][k]) {
            continue;
        }

        resultSm.push(item[smFieldName][k]);
        resultIdm.push(item[idmFieldName][k]);
    }

    item[smFieldName] = resultSm;
    item[idmFieldName] = resultIdm;
}


function validateTable(item, tableName, tableLabel) {
    var tableLabel = (tableName == 'operator') ? funcs.scmsg('4', 'idm') : funcs.scmsg('5', 'idm');

    var smFieldName = tableName + '.sm';
    var idmFieldName = tableName + '.idm';

    var smFieldList = funcs.denull(item[smFieldName]);
    var idmFieldList = funcs.denull(item[idmFieldName]);

    if (smFieldList.length() != idmFieldList.length()) {
        // 'the number of field list is not match'
        warn(funcs.scmsg('1', 'idm', [tableLabel]));
        return false;
    }

    var k = 0;
    var size = smFieldList.length();
    var hash = {};
    for (k = 0; k < size; k++) {
        var smField = item[smFieldName][k];
        // ignore empty line
        if (null == smField && null == item[idmFieldName][k]) {
            continue;
        }

        // SM field should not be null
        if (null == smField) {
            // 'SM fields' + (k + 1) + ' cannot be null'
            // The value in Field Name %1 is required.
            warn(funcs.scmsg('2', 'idm', [tableLabel, (k + 1)]));
            return false;
        }

        // SM field should not be duplicated
        if (hash[smField]) {
            var fieldLabel = funcs.get_field_caption(smField, tableName);
            warn(funcs.scmsg('6', 'idm', [tableLabel, fieldLabel, (k + 1)]));
            return false;
        } else {
            hash[smField] = true;
        }


        // IDM field should not be null
        if (null == item[idmFieldName][k]) {
            warn(funcs.scmsg('3', 'idm', [tableLabel, (k + 1)]));
            return false;
        }
    }

    return true;

}

function warn(msg) {
    vars.$validatedMsg = msg;
    //    funcs.msg(msg, 2);
}


//setup();