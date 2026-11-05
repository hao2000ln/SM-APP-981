var _ = lib.Underscore.require();
var p = system.functions.processes();

var ret = _.any(p, function(e) {
 
 e = system.functions.str(e);
 return e.indexOf('falcon')>0;
});

print(ret);