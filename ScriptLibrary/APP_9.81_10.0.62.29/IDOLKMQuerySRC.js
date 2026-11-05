var _ = lib.Underscore.require(),
    IDOLKMQuery = lib.IDOLKMQuery.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    logger = getLog('IDOLKMQuerySRC');

var IDOLKMQuerySRC = (function() {
    function KMQuerySRC(fKMQuery) {
        IDOLKMQuery.apply(this, arguments);
        this.fKMQuery = fKMQuery;
        this.filters=[];
        this.libTypes =[];
    }

    function F() {}
    F.prototype = IDOLKMQuery.prototype;

    KMQuerySRC.prototype = new F();

    KMQuerySRC.prototype.constructor = KMQuerySRC;
    
    function getLibType(filters){
     this.libTypes = [];
     if(filters && filters.length){
         for(var i  = 0; i < filters.length; i++){
             if(filters[i].field == 'scope'){
                this.libTypes = filters[i].value.split(',');
                break;
             }
         }
     }
     
     return this.libTypes;
    }
    
    function getFilters(filters)
    {
        var fieldtext = [];
        var field_name,value,opt, temp,i;

        for (var i=0; i < filters.length; i++) {
            field_name = filters[i].field;
            value = filters[i].value;
            opt = filters[i].operator;
            temp = "";
            if(field_name == 'scope'){
                this.libTypes = value.split(',');
                continue;
            }
            
            if(value === undefined){continue;}

            if(field_name ==='language') {continue; }
            else if(field_name === "sysmodtime") { field_name = IDOLKMFieldMapping.mappingIDOLDateField(field_name);}
            else {field_name = IDOLKMFieldMapping.mappingIDOLField(field_name,'Knowledge_Library');}

            switch (opt) {
                case "=":
                    temp = "MATCH{" + value + "}:" + field_name;
                    break;

                case "like":
                    temp = "WILD{" + value + "}:" + field_name;
                    break;
                case "between":
                    temp = "RANGE{" + value + "}:" + field_name;
                    break;
                default:
                    break;
            }

            if (temp.length) { fieldtext.push(temp);}
        }
        return fieldtext.join(' AND ');
    }

    KMQuerySRC.prototype.perLibAdHocCriteria = function(kmlib) {
        var filter = '';
        if(kmlib.kbname ==='Knowledge_Library'&& this.filters &&this.filters.length){
            filter =getFilters(this.filters);
        }
        return filter;
    };

    KMQuerySRC.prototype.getSelectedLibraries = function() {
        var kmlibs = this.getAvailableLibraries(funcs.operator());

        this.libTypes = getLibType(this.filters);
        var selectedLibs = _.filter(kmlibs, function(kmlib) {
            if(this.libTypes && this.libTypes.length && !_.contains(this.libTypes,kmlib.kbtype)){return false;}
            if(kmlib.kbname !== 'Knowledge_Library' && kmlib.kbtype ==='sclib'){return false;}
            return true;
        });
        this.getSelectedLibraries = function() { return selectedLibs; };
        return selectedLibs;
    };

    return KMQuerySRC;
}());

function require() {
    return IDOLKMQuerySRC;
}