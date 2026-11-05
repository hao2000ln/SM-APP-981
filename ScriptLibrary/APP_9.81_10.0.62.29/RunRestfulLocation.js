
function GET(req, res) {
    var userName = findUserName(req.options.query);
    if(!userName){
    	res.status(400).message('user parameter is required');
    	return;
    }

	var location = findLocation(userName);
    
    if(location){
    	res.send({Location: location});
    } else {
    	res.status(404).message('location not found for operator ' + userName);
    }
}

function findLocation(userName) {	
	var location2;
    var sql = 'select * from location l join contacts c on (l.location=c.location) where c.operator.id="' + lib.StringUtil.escapeAllStr(userName) + '"';
    var location = lib.c.$('location').select(sql).uniqueResult();

    if (location) {
        var config = lib.c.$('extaccess').select('rest.list.name="locations"').uniqueResult();
        location2 = lib.RestfulMain.file2Object(location, config.soafield, config.soacaption, config.soatype, 'Location')
        location2 = toSimple(location2.value.Location);
    }
    
    return location2;
}

function findUserName(query) {	
    value = query.match("user=\"(.*)+\"");
	if (!value) {
		return null;
	}
	
    var userName = value[1];
    if (userName) {
        userName = userName.replace(/\\\\/g, '\\');
        userName = userName.replace(/\\\"/g, '\"');
    } 
    
    return userName;
}

function toSimple(obj) {
    if (obj.type == 'object' || obj.type == 'record') {
        var ret = {};
        for (var k in obj.value) {
            ret[k] = toSimple(obj.value[k]);
        }

        return ret;
    } else if (obj.type == 'array') {
        var list = [];

        for (var k = 0; k < obj.value.length; k++) {
            list[k] = toSimple(obj.value[k]);
        }

        return list;
    }

    return obj.value;
}

function authorize() {
    return lib.security.getRights("Common Configuration", "admin") === "true";
}