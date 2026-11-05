function getVATitleTagPrefix() {
    return getVATagPrefix("title");
}

function getVATitleTagSuffix() {
    return getVATagSuffix("title");
}

function getVAButtonTagPrefix() {
    return getVATagPrefix("button");
}

function getVAButtonTagSuffix() {
    return getVATagSuffix("button");
}

function getVAFactsTagPrefix() {
    return getVATagPrefix("facts");
}

function getVAFactsTagSuffix() {
    return getVATagSuffix("facts");
}

function getVAFactTagPrefix() {
    return getVATagPrefix("fact");
}

function getVAFactTagSuffix() {
    return getVATagSuffix("fact");
}

function getVATagPrefix(tagname) {
    return "##" + tagname + "##";
}

function getVATagSuffix(tagname) {
    return "==" + tagname + "==";
}

function getVAMessagePrefix() {
    return "VA_";
}

function getButtonCaption(buttonName) {
    return getVAMessagePrefix() + buttonName.toUpperCase().replace(/\s+/g, "_")
}
