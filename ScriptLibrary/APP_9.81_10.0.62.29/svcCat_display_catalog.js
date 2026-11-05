
function getHandler() {

    return {

        type : "",
        catalogSql : "",

        init : function( $INTO_ITEM, $INTO_NUMBER, $INTO_FIRST ) {
            print( 'svcCat_display_catalog -> init ... '
            		+ '$INTO_ITEM=' + $INTO_ITEM + ", type=" + $INTO_ITEM.type
            		+ ', $INTO_NUMBER=' + $INTO_NUMBER
            		+ ', $INTO_FIRST=' + $INTO_FIRST );
        },

        initFields : function() {
            this.catalogSql = 'type="category" and null(parent) and active=true'
                + ( this.type == 'noncart' ? ' and non.cart=true' : ' and (non.cart=NULL or non.cart=false)' );

        },

        retrieveCatalogItems : function( queryString ) {
            print( 'svcCat_display_catalog -> retrieveCatalogItems ... ' + "queryString=" + queryString );
        },

        countCatalogItems : function( queryString ) {
            return lib.ScAPI_RAD._count( 'joinsvcDisplay', queryString );
        },

        getCatalogSql : function() {
            return this.catalogSql;
        }
    }

}


function getCategoryType(cataName) {
	var cat = new SCFile("svcCatalog");
	var rc = cat.doSelect("name=\"" + cataName + "\"");
	if (rc == RC_SUCCESS) {
		return cat["category.type"];
	}
	return null;
}