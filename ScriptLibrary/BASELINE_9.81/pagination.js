/* 
 * 
 */

function paginate( varName_stepward, varName_curPage, varName_itemsPerPage, varName_totalPages /*, arrName1, arrName2, ... */) {
    var N = 4;
    if( arguments.length > N ) {
        var arr1 = vars[ arguments[N] ];
        var total = arr1 && arr1.length() || 0;
        if( total > 0 ) {
            var curPage = parseInt( vars[ trimVarName( varName_curPage ) ] );
            curPage = ( isNaN( curPage ) ? 1 : curPage );
            var stepward = vars[ trimVarName( varName_stepward ) ]; /* 'previous', 'next' or '' */
            var p = new Pagination( total, ( curPage <= 0 ? ( 'next' == stepward ? 0 : 1 ) : curPage ), 
                            vars[ trimVarName( varName_itemsPerPage ) ] );
            var f = p[ stepward ]; 
            if( f && typeof f == 'function' ) {
                f.call( p );
            }
            for( var i = N, length = arguments.length; i < length; i++ ) {
                var varName = trimVarName( arguments[i] );
                p.copyArrayByPage( vars[ varName + '_copy' ], vars[ varName ] );
            }
            vars[ trimVarName( varName_curPage ) ] = p.getCurPage();
            vars[ trimVarName( varName_totalPages ) ] = p.getTotalPages();
            vars[ trimVarName( varName_stepward ) ] = "";
        }
    }
}

function copyBack( total, curPage, itemsPerPage /*, arrName1, arrName2, ... */ ) {
    if( arguments.length > 3 ) {
        var p = new Pagination( total, curPage, itemsPerPage );
        for( var i = 3, length = arguments.length; i < length; i++ ) {
            var varName = trimVarName( arguments[i] );
            p.copyBack( vars[ varName ], vars[ varName + '_copy' ] );
        }
    }
}

function trimVarName( name ) {
    return name.replace( /\./g, '_' );
}

function Pagination( total, curPage, itemsPerPage ) {
    this.curPage = ( curPage <= 0 ? 0 : curPage );
    this.total = total;
    this.itemsPerPage = ( itemsPerPage <= 0 ? 20 : itemsPerPage );
    var totalPages = this.getTotalPages();
    if( this.curPage > totalPages ) {
        this.curPage = totalPages;
    }
}

Pagination.prototype.getCurPage = function() {
    return this.curPage;
}

Pagination.prototype.getTotalPages = function() {
    var n = 0;
    if( this.total > 0 ) {
        n = Math.ceil( this.total / this.itemsPerPage );
    }
    return n;
}

Pagination.prototype.next = function() {
    if( this.curPage * this.itemsPerPage < this.total ) {
        this.curPage++;
    }
}

Pagination.prototype.previous = function() {
    if( this.curPage > 1 ) 
        this.curPage--;
}

Pagination.prototype.getCurStartPosInArray = function() {
    return ( this.curPage - 1 ) * this.itemsPerPage;
}

Pagination.prototype.copyArrayByPage = function( targetArr, srcArr ) {
    var length = this.arrLen( srcArr );
    var i = this.getCurStartPosInArray();
    var end = i + this.itemsPerPage;
    if( end > length ) {
        end = length;
    }
    for( ; i < end; i++ ) {
        targetArr.push( srcArr[i] );
    }
    return targetArr;
}

Pagination.prototype.copyBack = function( srcArr, copyArr ) {
    var i = this.getCurStartPosInArray();
    var length = Math.min( this.arrLen( srcArr ) - i, this.arrLen( copyArr ) );
    for( var j = 0; j < length; j++ ) {
        srcArr[ i + j ] = copyArr[j];
    }
}

Pagination.prototype.arrLen = function( srcArr ) {
    return ( srcArr != null ? ( srcArr instanceof Array ? srcArr.length : srcArr.length() ) : 0 );
}
