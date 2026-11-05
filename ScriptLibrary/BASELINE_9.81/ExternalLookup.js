var PAGE_SIZE = 15;

/**
 * return MAP, all options is name, value pair
 *                         and [name] - value    
 */
function getOptionMap(xmlForm) {
    var xml = new XML();
    xml.setContent(xmlForm);

    var options = {};

    var node = xml.getFirstChildElement();
    while (node != null) {
        var name = node.getAttributeValue("id");
        var value = node.getValue();
        if (!value) {
            value = node.getAttributeValue("display");
        }
        options[name] = value;
        // options['['+name+']'] = node.getValue();
        node = node.getNextSiblingElement();
    }

    return options;
}

/**
 * return Node, the validation node which the useroption defines 
 */
function findValidNode(validXml, optionName) {
    var xml = new XML();
    xml.setContent(validXml);

    var node = xml.getFirstChildElement();
    var name = null;

    while (node != null) {
        var name = node.getAttributeValue("id");
        if (name == optionName) {
            break;
        }

        node = node.getNextSiblingElement();
    }

    // no option found
    if (!name) {
        return null;
    }

    return node;
}

/**
 * return Array, The parameters defined in Validation Node for the JS function
 */
function findParamNameList(optionNode) {
    var paramNameList = [];

    var childNode = optionNode.getFirstChildElement();
    if (childNode.getName() == 'parameters') {
        var paramNode = childNode.getFirstChildElement();

        while (paramNode != null) {
            paramNameList.push(paramNode.getValue().trim());
            paramNode = paramNode.getNextSiblingElement();
        }
    }

    return paramNameList;
}

/**
 * Return value of the option name 
 * <ol>
 *  <li>option, the current option value in optionValueMap</li>
 *  <li>RAD variable, return vars[name]</li>
 *   <li>RAD expressions, evaluate/parse it</li>
 * </ol>
 */
function getParamValue(name, optionValueMap) {
    if (isOptionName(name)) { // option name
        var optionName = getOptionName(name);
        return optionValueMap[optionName];
    } else if (isRadVariable(name)) { // rad variable
        return vars[name];
    } else if (isRadExpression(name)) { // RAD Expressions
        return funcs.parse_evaluate(name, 2);
    } else {
        return name;
    }
}

/**
 * Make the context object to run the customer JS
 * Attributes
 * <ol>
 * <li> start, page start, default to 1 </li>
 * <li> pageSize, page size, default to 20 </li>
 * <li> fieldName, name of the field </li>
 * <li> searchText, the current value of the option to Search </li>
 * <li> js, The JS name of customized JS</li>
 * <li> paramList, a list of the parameters of the JS</li>
 * </ol>
 */
function buildContext(formXml, validXml, optionName, page) {
    var context = {};
    var optionValueMap = getOptionMap(formXml);

    var optionNode = findValidNode(validXml, optionName);
    var paramNameList = findParamNameList(optionNode);

    context.start = page ? ((page - 1) * PAGE_SIZE + 1) : 1;
    context.pageSize = PAGE_SIZE;
    context.fieldName = optionName;
    context.searchText = optionValueMap[optionName];
    context.js = optionNode.getAttributeValue('matchScript');
    context.paramList = paramNameList.map(param => getParamValue(param, optionValueMap));

    return context;
}

/**
 * If a string contains only alphacharacters, number, space, dot or dash dot, then it is empty string
 */
function isSimpleString(str) {
    // remove unicode characters
    var reg = /[\u0370-\udfff]/g;
    var strValue = str.replace(reg, "");

    if (/^[A-Za-z0-9 \t\._]$/.test(strValue)) {
        return true;
    }

    return false;
}

/*
 * If not simple string then it is an expression 
 */
function isRadExpression(str) {
    return !isSimpleString(str);
}

function getOptionName(name) {
    return name.substring(1, name.length - 1);
}

/**
 * Option name, like [user], begin with alpha and only contains alpha and numbers.
 */
function isOptionName(name) {
    var regex = /^\[[A-Za-z][A-Za-z0-9]*\]$/;
    return regex.test(name);
}

//print(isOptionName('[region]'));

function isRadVariable(name) {
    var regex = /^\$[A-Za-z0-9\._]+$/;
    return regex.test(name);
}

function makeResult(resp) {
    if (!resp.fields || !resp.data || !resp.fields.length || !resp.data.length) {
        vars.$L_totalSize = 0;
        // msg: Cannot find related records.
        var msg = funcs.scmsg('2778', 'us');
        funcs.msg(msg, 2);
        return;
    }

    var size = resp.fields.length;
    var listOfList = Array.from({
        length: size
    }, x => []);

    for (var k = 0; k < resp.data.length; k++) {
        for (var m = 0; m < size; m++) {
            listOfList[m].push(resp.data[k][resp.fields[m].name]);
        }
    }

    // print('resp.total', resp.total)
    if (resp.total) {
        vars.$L_maxPage = Math.floor((resp.total - 1) / PAGE_SIZE) + 1;
    } else {
        vars.$L_maxPage = 0;
    }

    vars.$L_totalSize = resp.data.length;
    if (resp.total > resp.data.length) {
        vars.$L_totalSize = resp.total;
    }

    if (0 == vars.$L_totalSize) {
        // msg: Cannot find related records.
        var msg = funcs.scmsg('2778', 'us');
        funcs.msg(msg, 2);
        return;
    }

    listOfList.forEach((x, k) => vars['$list.' + (k + 1)] = x);
}

function run(xmlStr, validStr, name, page) {
    if (page < 0) {
        page = 1;
    }

    if (vars.$L_maxPage && page > vars.$L_maxPage) {
        page = vars.$L_maxPage;
    }


    var ctx = buildContext(xmlStr, validStr, name, page);

    // var resp = lib[ctx.js].run(ctx);
    var paramList = [ctx, ...ctx.paramList, ctx.start, ctx.pageSize];
    var resp = lib[ctx.js].run.apply(null, paramList);
    // print(JSON.stringify(resp));
    makeResult(resp);

    if (resp.fields) {
        vars['$L.qbe.format'] = makeGridForm(resp.fields);
    } else {
        vars['$L.qbe.format'] = null;
    }

    return resp;
}


function makeGridForm(fieldList) {
    var form = new SCFile('format');
    form.name = 'ExternalLookup';

    var next = 1;
    var fieldSize = fieldList.length;

    var columnNames = fieldList.map(item => item.label);

    var width = parseInt(100 / fieldSize);
    var lastWidth = 100 - width * (fieldSize - 1);

    next = addTableStart(form, next, columnNames);

    fieldList.forEach((field, index) => {
        var fieldWidth = index == fieldSize - 1 ? width : lastWidth;
        var inputVarName = '$list.' + (index + 1);
        next = addColumnStart(form, next, inputVarName, field.label, fieldWidth);
        next = addTableColumnEnd(form, next);
    });

    next = addTableColumnEnd(form, next);


    // form.doInsert();

    return form;
}

function addColumnStart(form, next, name, label, width) {
    form.field[next].flags = 4100;
    form.field[next].line = 6;
    form.field[next].column = 6;
    form.field[next].length = 0;
    form.field[next].window = 0;
    form.field[next].input = name;
    form.field[next].output = label;
    var str = 'Column;Caption=' + label + '\tColumn Width%=' + width + '\tInput=' + name + '\tY=10\tX=10\tReadOnly=1\tscType=Text\t';
    form.field[next].property = str;

    return next + 1;
}

function addTableStart(form, next, columnNameList) {
    form.field[next].flags = 4100;
    form.field[next].line = 1;
    form.field[next].column = 1;
    form.field[next].length = 80;
    form.field[next].window = 14;
    form.field[next].input = '';
    form.field[next].output = '';
    var str = 'Table;ColumnHeadings=1\tColumns=' + columnNameList + '\tMultipleSelection=0\tdoubleclicktofillvalue=1\tName=Table0\tDoubleClickButtonID=502\tHeight=31\tReadOnly=1\tWidth=160\tX=0\tY=0';
    form.field[next].property = str;

    return next + 1;
}

function addTableColumnEnd(form, next) {
    form.field[next].flags = 4096;
    form.field[next].line = 1;
    form.field[next].column = 1;
    form.field[next].length = 1;
    form.field[next].window = 1;
    form.field[next].input = '';
    form.field[next].output = '';
    var str = 'end;X=1\tY=1\tHeight=2\tWidth=2\t';
    form.field[next].property = str;

    return next + 1;
}

// run(xmlStr, validStr, 'xxx');