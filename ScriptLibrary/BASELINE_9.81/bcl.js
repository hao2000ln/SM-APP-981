function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.parent = Parent;
    Child.prototype.constructor = Child;
}

function createStructDatum() {
    var datum = new Datum();
    datum.setType(lib.DataTypeConst.typeStructure());
    var nArgs = arguments.length;
    var i;
    for (i = 0; i < nArgs; i++) {
        datum.push(arguments[i]);
    }
    return datum;
}

function createArrayDatum() {
    var datum = new Datum();
    datum.setType(lib.DataTypeConst.typeArray());
    var nArgs = arguments.length;
    var i;
    for (i = 0; i < nArgs; i++) {
        datum.push(arguments[i]);
    }
    return datum;
}

function newLabelDatum(label) {
    var datum = new Datum();
    datum.setType(lib.DataTypeConst.typeLabel());
    datum.setValue(label);

    return datum;
}

function newDateDatum(date) {
    var datum = new Datum();
    datum.setType(lib.DataTypeConst.typeDateTime());
    datum.setValue(date);

    return datum;
}

function newStringDatum(value) {
    var datum = new Datum();
    datum.setType(lib.DataTypeConst.typeCharacter());
    datum.setValue(value);

    return datum;
}