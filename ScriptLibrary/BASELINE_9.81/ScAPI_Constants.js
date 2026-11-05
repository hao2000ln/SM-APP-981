function GET_TOP_CATEGORY_QUERY() {
    return "type=\"category\" and null(parent) and active=true";
}

function JOINSVCDISPLAY_FILENAME() {
    return "joinsvcDisplay";
}

function SVCCATALOG_FILENAME() {
    return "svcCatalog";
}

function SVCCART_FILENAME() {
    return "svcCart";
}

function SVCCARTITEM_FIELNAME() {
    return "svcCartItem";
}

function SVCCAT_ORD_INFO() {
    return "svcCatOrdInfo";
}

function WS_OBJECTNAME_ITEM() {
    return "Item";
}

function WS_OBJECTNAME_CART() {
    return "Cart";
}

function WS_OBJECTNAME_ORDER() {
    return "Order";
}

function WS_OBJECTNAME_CATALOG() {
    return "Catalog";
}

function NORMAL_EXIT() {
    return lib.BaseUtil_Constants.NORMAL_EXIT();
}

function NO_RECORD_EXIT() {
    return lib.BaseUtil_Constants.NO_RECORD_EXIT();
}

function BAD_VALIDATION_EXIT() {
    return lib.BaseUtil_Constants.BAD_VALIDATION_EXIT();
}

function CURRENTRECORD_LOCKED() {
    return lib.BaseUtil_Constants.CURRENTRECORD_LOCKED();
}

function CURRENTRECORD_NOT_UPDATE2DATE() {
    return "currentrecord.not.update2date";
}

function SUBSCRIPTION_OTHER() {
    return "Other - See Description";
}