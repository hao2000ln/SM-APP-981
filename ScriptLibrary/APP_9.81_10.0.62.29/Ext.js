String.prototype.ucFirst = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.lcFirst = function() {
	return this.charAt(0).toLowerCase() + this.slice(1);
}


function apply(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

function isDefined(v){
	return typeof v !== 'undefined';
}

function applyIf(o, c){
    if(o){
        for(var p in c){
            if(!isDefined(o[p])){
                o[p] = c[p];
            }
        }
    }
    return o;
}

function isObject(v){
    return !!v && Object.prototype.toString.call(v) === '[object Object]';
}

function override(origclass, overrides){
    if(overrides){
        var p = origclass.prototype;
        apply(p, overrides);
    }
}

var io = function(o){
    for(var m in o){
        this[m] = o[m];
    }
};
var oc = Object.prototype.constructor;
function extend(sb, sp, overrides){
    if(isObject(sp)){
        overrides = sp;
        sp = sb;
        sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
    }
    var F = function(){},
        sbp,
        spp = sp.prototype;

    F.prototype = spp;
    sbp = sb.prototype = new F();
    sbp.constructor=sb;
    sb.superclass=spp;
    if(spp.constructor == oc){
        spp.constructor=sp;
    }
    sb.override = function(o){
        override(sb, o);
    };
    sbp.superclass = sbp.supr = (function(){
        return spp;
    });
    sbp.override = io;
    override(sb, overrides);
    sb.extend = function(o){return extend(sb, o);};
    return sb;
}

