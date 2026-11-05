function enableUnicode(){
	var f = new SCFile('sqldbinfo');
	var ret = f.doSelect('sql.db.type="sqlserver"');
	if (RC_SUCCESS==ret) {
		f['use.unicode.type']=true;
		f['long.text.type']='nvarchar(max)';
		for (var k = 0, kLoopTimes = f['data.types'].length();k < kLoopTimes;k++) {
			var p4type = f['data.types'][k]['p4.type'];
			
			
			if ('2'!=p4type && '5'!=p4type) { // character and label
				continue;
			}
			
			var type = f['data.types'][k]['sql.type'];
			if (!type) {
				continue;
			}
			
			type = type.toLowerCase();
			
			
			if (type=='varchar') {
				f['data.types'][k]['sql.type']='nvarchar';
			}
			
			if (type=='text') {
				f['data.types'][k]['sql.type']='nvarchar(max)';
			}
			
			if (type=='char') {
				f['data.types'][k]['sql.type']='nchar';
			}
		}
		
		f.doUpdate();
	}
}

function isUnicodeType(type){
	if (null==type) return false;
	type=type.toUpperCase();
	
	if (type.indexOf('NCHAR')==0){
		return true;
	}
	
	if (type.indexOf('NVARCHAR')==0){
		return true;
	}
	
	if (type.indexOf('NTEXT')==0){
		return true;
	}
	
	return false;
}