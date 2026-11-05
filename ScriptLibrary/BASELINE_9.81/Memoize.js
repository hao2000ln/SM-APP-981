
// memoize: a general-purpose function to enable a function to use memoization
//   func: the function to be memoized
//   context: the context for the memoized function to execute within
//   Note: the function must use explicit, string-serializable parameters
/**
function memoize (func, context) {
    
    function memoizeArg (argPos) {
        var cache = {};
        return function () {
            if (argPos == 0) {
                if (!(arguments[argPos] in cache)) {
                    cache[arguments[argPos]] = func.apply(context, arguments);
                }
                return cache[arguments[argPos]];
            }
            else {
                if (!(arguments[argPos] in cache)) {
                    cache[arguments[argPos]] = memoizeArg(argPos - 1);
                }
                return cache[arguments[argPos]].apply(this, arguments);
            }
        }
    }
    // JScript doesn't grok the arity property, but uses length instead
    var arity = func.arity || func.length;
    return memoizeArg(arity - 1);

}
*/

function createCacheObject() {
    return {
        _store : {},

        //@args: key1, key2, key3 ... , keyn, value
        cache : function() {
            if( arguments && arguments.length > 1 ) {
                var p = this._store;
                for( var i = 0; i < arguments.length - 2; i++ ) {
                    if( ! p[ arguments[i] ] ) {
                        p[ arguments[i] ] = {};
                    }
                    p = p[ arguments[i] ];
                }
                p[ arguments[ arguments.length - 2 ] ] = arguments[ arguments.length - 1 ];
            }
        },

        get : function() {
            var value = null;
            if( arguments && arguments.length > 0 ) {
                var p = this._store;
                for( var i = 0; i < arguments.length - 1; i++ ) {
                    if( p[ arguments[i] ] ) {
                        p = p[ arguments[i] ];
                    }
                }

                if( p ) {
                    value = p[ arguments[ arguments.length - 1 ] ];
                }
            }

            return value;
        },

        remove : function() {
            var value = null;
            if( arguments && arguments.length > 0 ) {
                var p = this._store;
                for( var i = 0; i < arguments.length - 1; i++ ) {
                    if( p[ arguments[i] ] ) {
                        p = p[ arguments[i] ];
                    }
                }

                if( p ) {
                    value = p[ arguments[ arguments.length - 1 ] ];
                    delete p[ arguments[ arguments.length - 1 ] ];
                }
            }

            return value;
        }
    };
}

