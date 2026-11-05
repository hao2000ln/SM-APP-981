const ADDON_CONFIG = {
    SIT: {
        USER_ADDON: "csep.admin.01",
        DOMAIN_URL: "10.2",
        IFRAME_ADDON_URL: "http://10.2.18.4:5010",
        GENDOC_URL: "http://10.0.62.26:3000",
    }
};  

const CURRENT_ENV = "SIT";
const CURRENT_CONFIG = ADDON_CONFIG[CURRENT_ENV];


function getConfigObj() {
	var configObj = {
        isShowWFtab: false
    };
	if(CURRENT_ENV == "SIT" ){
	    configObj = {
	        isShowWFtab: true
	    };
	}
    return configObj
}

function getENV(){
    return CURRENT_ENV;
}