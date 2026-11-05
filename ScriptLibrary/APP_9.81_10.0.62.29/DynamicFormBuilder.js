/**
 * new style dynamic form builder
 */

function calcLayout(config) {
    if (!config) {
        config = {};
    }

    var fullWidth = config.fullWidth || 60;
    var labelWidth = config.labelWidth || 20;
    var inputX = config.inputX || labelWidth;
    var inputWidth = config.inputWidth || (fullWidth - inputX);

    return {
        fullWidth,
        labelWidth,
        inputX,
        inputWidth
    };
}


function buildForm(settings) {
    var form = new SCFile('format');
    form.name = settings.name;

    var fields = settings.fields;
    var next = 0;
    var line = 3;
    var layout = calcLayout(settings.layout);

    // if without border, the fields will extend to the total width of the format.
    // if with border, the fields' width will be related with border's width.  
    if (settings.border) {
        makeBorder(layout, form, settings.border, next, 0);
        next++;
    }

    if (settings.title) {
        makeTitle(layout, form, settings.title, next, 1);
        next++;
    }

    var k;
    for (k = 0; k < fields.length; k++) {
        var returnObj = makeField(layout, form, next, fields[k], line);
        next = returnObj.next;
        line = returnObj.line;
    }

    return form;
}

function makeBorder(layout, form, border, next, line) {
    var width = border.width;
    var height = border.height;

    form.field[next].flags = 0;
    form.field[next].line = 0;
    form.field[next].column = 0;
    form.field[next].length = width / 2;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = '';
    form.field[next].property = "BevelFrame;OuterBevelWidth=0\tArrayLength=0\tHeight=" + height + "\tWidth=" + width + "\tX=0\tY=0";
}

function makeField(layout, form, next, field, line) {
    if (field.type == 'text') {
        return makeTextArea(layout, form, next, field, line);
    } else if (field.type == 'input') {
        return makeText(layout, form, next, field, line, null, false, field.visible);
    } else if (field.type == 'password') {
        return makeText(layout, form, next, field, line, null, true, field.visible);
    } else if (field.type == "datetime") {
        return makeDateTime(layout, form, next, field, line);
    } else if (field.type == 'radio') {
        return makeRadio(layout, form, next, field, line);
    } else if (field.type == 'combo') {
        return makeCombo(layout, form, next, field, line);
    } else if (field.type == 'checkbox') {
        return makeMultiCheckBox(layout, form, next, field, line);
    } else if (field.type == 'textArea') {
        return makeTextArea(layout, form, next, field, line);
    } else if (field.type == 'glue') {
        if (field.height) {
            line += field.height;
        } else {
            line++;
        }
        return {
            "next": next,
            "line": line
        };
    } else {
        return {
            "next": next,
            "line": line
        };
    }
}

function getMandatoryTitleSuffix() {
    return "  (*)";
}


function makeText(layout, form, next, field, line, length, password, visible) {

    makeLabel(layout, form, field.title, next, line, false, visible);
    makeInput(layout, form, field.name, next + 1, line, length, password, visible, field.mandatory, field.readonly);
    return {
        "next": next + 2,
        "line": line + 2
    };
}


function makeLabel(layout, form, label, next, line, isLong, visible) {
    var length = layout.labelWidth;
    if (isLong) {
        length = layout.fullWidth;
    }
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = length / 2;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = label;
    form.field[next].property = 'Label;Caption=' + label + '\tHeight=2\tWidth=' + length + '\tX=0\tY=' + line;
    if (visible) {
        form.field[next].property += '\t?Visible=' + visible;
    }
}

function makeTitle(layout, form, label, next, line) {
    var length = layout.fullWidth;

    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = length / 2;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = label;
    form.field[next].property = 'Label;BackColor=14\tForeColor=10\tBold=1\tFontIncrease=2\tCaption=' + label + '\tHeight=2\tWidth=' + length + '\tX=0\tY=' + line;
}

function makeInput(layout, form, name, next, line, length, isPassword, visible, mandatory, readonly) {
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = layout.inputX;
    form.field[next].length = layout.inputWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = name;
    form.field[next].output = 'VO';
    var str = 'Text;Height=2\tName=' + name + '\tWidth=' + layout.inputWidth + '\tX=' + layout.inputX + '\tY=' + line;

    if (length) {
        str += '\tMaxChars=' + length;
    }

    if (isPassword) {
        str += '\tPassword=1';
    }

    if (visible) {
        str += '\t?Visible=' + visible;
    }

    if (mandatory) {
        str += '\tMandatory=1';
    }

    if (readonly) {
        str += '\tReadOnly=1';
    }

    form.field[next].property = str;
}

function makeDateTime(layout, form, next, field, line) {
    makeLabel(layout, form, field.title, next, line, false, true);

    var name = field.name;
    next++;

    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = layout.inputX;
    form.field[next].length = layout.inputWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = name;
    var str = 'DateTime;Height=2\tName=' + name + '\tWidth=' + layout.inputWidth + '\tX=' + layout.inputX + '\tY=' + line;

    form.field[next].property = str;

    return {
        "next": next + 1,
        "line": line + 2
    };
}

function makeTextArea(layout, form, next, field, line) {
    var title = field.title;
    if (field.mandatory && lib.BaseUtil.isWindowsClient()) {
        title += getMandatoryTitleSuffix();
    }

    makeLabel(layout, form, title, next, line, true);

    var name = field.name;

    next++;
    line += 2;

    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = layout.fullWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = name;
    form.field[next].output = 'VO';

    var height = field.height || 4;

    var str = 'MultiText;Name=' + name + '\tHeight=' + height + '\t\tWidth=' + layout.fullWidth + '\tX=0\tY=' + line + '\tInput=' + name;
    if (field.mandatory && lib.BaseUtil.isWebClient()) {
        str += '\tMandatory=1';
    }
    if (field.readonly) {
        str += '\tReadOnly=1';
    }
    form.field[next].property = str;

    return {
        "next": next + 1,
        "line": line + height + 1
    };
}

function makeSimpleRadio(layout, form, next, field, line) {
    makeLabel(layout, form, field.title, next, line, true);
    var x = layout.inputX;
    var k;
    for (k = 0; k < field.options.length; k++) {
        next++;
        var option = field.options[k];
        form.field[next].flags = 0;
        form.field[next].line = line;
        form.field[next].column = x;
        form.field[next].length = layout.inputWidth / 2;
        form.field[next].window = 0;
        form.field[next].input = field.name;
        form.field[next].output = option.title;
        var str = 'Radio;Value=' + option.name + '\tHeight=2\tName=' + (field.name + '-' + option.value) + '\tWidth=' + layout.inputWidth + '\tX=' + x + '\tY=' + line + '\tCaption=' + option.title;
        // 'Radio;Name=input1514344548587\tCaption=GIT\tValue=git\tHeight=1\tName=input1514344548587\tWidth=34\tCaption=GIT\tX=8\tY=20\t\tInput=git';
        if (field.mandatory) {
            str += '\tMandatory=1';
        }
        form.field[next].property = str;

        x += 10;
        // line=line+2;
    }

    return {
        "next": next + 1,
        "line": line + 2
    };
}


function makeRadio(layout, form, next, field, line) {
    var title = field.title;
    if (field.mandatory && lib.BaseUtil.isWindowsClient()) {
        title += getMandatoryTitleSuffix();
    }

    // create frame
    var height = field.options.length * 2 + 3;
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = layout.fullWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = title;
    var str = 'Frame;Height=' + height + '\tName=' + field.name + '\tWidth=' + layout.fullWidth + '\tX=0\tY=' + line + '\tCaption=' + title;
    if (field.mandatory) {
        str += '\tMandatory=1\tradiogroup=1';
    }
    form.field[next].property = str;

    // create options
    var k;
    for (k = 0; k < field.options.length; k++) {

        next++;
        var y = line + 2 + 2 * k;
        var option = field.options[k];
        form.field[next].flags = 0;
        form.field[next].line = y;
        form.field[next].column = 2;
        form.field[next].length = layout.inputWidth / 2;
        form.field[next].window = 0;
        form.field[next].input = field.name;
        form.field[next].output = option.title;
        str = 'Radio;Value=' + option.name + '\tHeight=2\tName=' + (field.name + '-' + option.value) + '\tWidth=' + layout.inputWidth + '\tX=1\tY=' + y + '\tCaption=' + option.title + '\tInput=' + field.name;
        // 'Radio;Name=input1514344548587\tCaption=GIT\tValue=git\tHeight=1\tName=input1514344548587\tWidth=34\tCaption=GIT\tX=8\tY=20\t\tInput=git';
        //if(field.mandatory){
        //  str += '\tMandatory=1';
        //}
        form.field[next].property = str;
        // line=line+2;
    }

    return {
        "next": next + 1,
        "line": line + height + 1
    };
}

function makeMultiCheckBox(layout, form, next, field, line) {
    // simple checkbox
    if (!field.options) {
        return makeCheckBox(layout, form, next, field, line);
    }

    var title = field.title;
    if (field.mandatory && lib.BaseUtil.isWindowsClient()) {
        title += getMandatoryTitleSuffix();
    }

    // create frame
    var height = field.options.length * 2 + 3;
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = layout.fullWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = title;
    var str = 'Frame;Height=' + height + '\tName=' + field.name + '\tWidth=' + layout.fullWidth + '\tX=0\tY=' + line + '\tCaption=' + title;
    if (field.mandatory) {
        str += '\tMandatory=1\tradiogroup=1';
    }
    form.field[next].property = str;

    // create options
    var k;
    for (k = 0; k < field.options.length; k++) {

        next++;
        var y = line + 2 + 2 * k;
        var option = field.options[k];
        form.field[next].flags = 0;
        form.field[next].line = y;
        form.field[next].column = 2;
        form.field[next].length = layout.inputWidth / 2;
        form.field[next].window = 0;
        form.field[next].input = option.name;
        form.field[next].output = option.title;
        str = 'CheckBox;Height=2\tName=' + (field.name + '-' + option.value) + '\tWidth=' + layout.inputWidth + '\tX=1\tY=' + y + '\tCaption=' + option.title + '\tInput=' + option.name;
        // 'CheckBox;Name=input1514344548587\tCaption=GIT\tValue=git\tHeight=1\tName=input1514344548587\tWidth=34\tCaption=GIT\tX=8\tY=20\t\tInput=git';
        //if(field.mandatory){
        //  str += '\tMandatory=1';
        //}
        form.field[next].property = str;
        // line=line+2;
    }

    return {
        "next": next + 1,
        "line": line + height + 1
    };
}

function makeCheckBox(layout, form, next, field, line) {
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = layout.inputWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = field.name;
    form.field[next].output = field.title;
    var str = 'CheckBox;Height=2\tName=' + field.name + '\tWidth=' + layout.inputWidth + '\tX=0\tY=' + line + '\tCaption=' + field.title;
    form.field[next].property = str;

    return {
        "next": next + 1,
        "line": line + 2
    };
}


function makeCombo(layout, form, next, field, line) {
    var title = field.title;
    if (field.mandatory && lib.BaseUtil.isWindowsClient()) {
        title += getMandatoryTitleSuffix();
    }

    makeLabel(layout, form, title, next, line, true);

    next++;
    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = layout.inputX;
    form.field[next].length = layout.inputWidth / 2;
    form.field[next].window = 0;
    form.field[next].input = field.name;
    form.field[next].output = field.title;
    var x = 0;
    line += 2;
    var str = 'ComboBox;Height=2\tSelectOnly=1\tName=' + field.name + '\tWidth=' + layout.inputWidth + '\tX=' + x + '\tY=' + line + '\tCaption=' + field.title + '\tInput=' + field.name;
    //ComboBox;Name=select1542247328759 Height=2    Name=select1542247328759    Mandatory=1 Width=40    X=44    Y=2     Input=$qeustion2    DisplayList=one;two;three   ValueList=1;2;3 
    if (field.mandatory && lib.BaseUtil.isWebClient()) {
        str += '\tMandatory=1';
    }
    var displayList = [];
    var valueList = [];

    var k;
    for (k = 0; k < field.options.length; k++) {
        var option = field.options[k];
        displayList.push(option.title);
        valueList.push(option.name);
    }
    var displayStr = displayList.join(';');
    var valueStr = valueList.join(';');
    str += '\tDisplayList=' + displayStr + '\tValueList=' + valueStr;

    form.field[next].property = str;

    return {
        "next": next + 1,
        "line": line + 2
    };
}