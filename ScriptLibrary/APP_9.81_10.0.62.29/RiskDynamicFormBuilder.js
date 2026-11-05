
function buildForm(settings) {
    var builder = lib.DynamicFormBuilder;
    
    var form = new SCFile('format');
    form.name = settings.name;

    var fields = settings.fields;
    var next = 0;
    var line = 3;
    var layout = builder.calcLayout(settings.layout);
    
    if( settings.title) {
        builder.makeTitle(layout, form, settings.title, next, 1);
    }
    next++;
    
    for( var k=0;k<fields.length;k++) {
        var returnObj = builder.makeField(layout, form, next, fields[k], line);
        var next = returnObj.next;
        var line = returnObj.line;
    }
    
    if( fields.length == 1){
        var text = funcs.scmsg('no_userbased_factor', 'riskgroup');
        makeNoUserbasedFactorForm(layout, form, text, next, 4);
    }

    return form;
}


function makeNoUserbasedFactorForm(layout, form, label, next, line){
    var length = layout.fullWidth;

    form.field[next].flags = 0;
    form.field[next].line = line;
    form.field[next].column = 0;
    form.field[next].length = length;
    form.field[next].window = 0;
    form.field[next].input = '';
    form.field[next].output = label;
//  form.field[next].property = 'Label;BackColor=14\tForeColor=10\tBold=1\tFontIncrease=2\tCaption='+label+'\tHeight=2\tWidth='+length+'\tX=0\tY='+line;
    form.field[next].property = 'Label;Caption='+label+'\tBold=1\tHeight=2\tWidth='+length+'\tX=0\tY='+line;
}
