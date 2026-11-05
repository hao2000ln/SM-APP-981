function getDate(str) {
	if (str=='' || str==null) {
		return null;
	}
	
	var date = system.functions.val(str, 3);	
	var TYPE_DATE = 3;
	var type = system.functions.type(date);
		
	if (TYPE_DATE == type) {
		return date.getTime();
	} 
	
	return null;
}
function isValidStartEndDate(start, end) {
	var start = getDate(start);
	var end = getDate(end);
	
	if(null==start || null==end) {
		return true;
	} 
	
	if (start> end) {
		return false;
	} 
	
	return true;
}

function isDateValid(theDate)
{
	var date = new Date(theDate);	
	return false==isNaN(date);
}

function sortReport(){
	var field = system.functions.cursor_field_name();

	if (field=='id') {
		field = 'b.service.status';
	}
	
	if (vars.$sort_field!=field ) {
		vars.$sort_order = 'asc';	
	} else {
		vars.$sort_order = vars.$sort_order=='asc'?'desc':'asc';
	}
	
	vars.$sort_field=field;
}

function filterAvailReport() {
	
	var name  = vars['$ci.name'];
	var start = vars['$outage.start'];
	var end   = vars['$outage.end'];
	if (!isValidStartEndDate(start, end)) {		
		var msg = system.functions.scmsg(78, 'rw');
		system.functions.msg(msg, 2);
	}
	
	if(vars['$ci.name.save']!=vars['$ci.name']){		
		vars['$link.ci.id']   =null;
	}
	
	var id = vars['$link.ci.id'];
	
	vars['$ci.name.save'] = vars['$ci.name'];
	
	var paramList = [];
	
	var where = ' where ';
	var hasWhere = false;
	
	if(!isNull(name)) {
		if(id!=null){
			where +='d.logical.name="'+lib.StringUtil.escapeAllStr(id)+'"';
		} else {			
			where +='d.sm.device.display.name#$ci.name';
		}
		hasWhere = true;
	}
	
	if(!isNull(start) && isDateValid(start)){
		if(hasWhere) {
			where += ' and ';	
		}
		
		var index = start.indexOf(' ');
		if(index>0){
			start = start.substring(0, index);
		}
		start+=' 00:00:00';
		
		where +='o.outage.start>=\''+start+'\'';
		paramList.push(start);
		hasWhere = true;
	}
	
	if(!isNull(end) && isDateValid(end)){
		if(hasWhere) {
			where += ' and ';
		}
		
		var index = end.indexOf(' ');
		if(index>0){
			end = end.substring(0, index);
		}
		end+=' 23:59:59';
		where +='o.outage.end<=\''+end+'\'';
		paramList.push(end);
		hasWhere = true;
	}
	
	var query = getAvailQuery();
	
	if(hasWhere){
		query += where;	
	}
	
	if (vars.$sort_field) {
		query += ' order by ' + vars.$sort_field;
		
		if(vars.$sort_order) {
			query += ' ' + vars.$sort_order;
		}	
	}
	
	vars.$ci_records_exists = vars.$L_filed.doSelect(query);		
}

function getAvailQuery(){
	return 'select distinct d.logical.name,d.type,d.istatus,d.location,d.is.down,d.sm.device.display.name,d.network.name,d.device.severity, b.service.status as id from device d left join bizservice b on (d.logical.name=b.logical.name) join outage o on (d.logical.name=o.logical.name)';
}


function filterReliabilityReport() {
	
	var name  = vars['$ci.name'];
	var year = vars['$year'];
	var month  = vars['$month'];
	
	if(vars['$ci.name.save']!=vars['$ci.name']){		
		vars['$link.ci.id']   =null;
	}
	
	var id = vars['$link.ci.id'];
	
	vars['$ci.name.save'] = vars['$ci.name'];
	
	var paramList = [];
	
	var where = ' where ';
	var hasWhere = false;
	
	if(!isNull(name)) {
		if(id!=null){
			where +='d.logical.name="'+lib.StringUtil.escapeAllStr(id)+'"';
		} else {			
			where +='d.sm.device.display.name#$ci.name';
		}
		hasWhere = true;
	}
	
	if(!isNull(year)){
		if(hasWhere) {
			where += ' and ';	
		}
		
		where +='m.year='+year+'';
		paramList.push(year);
		hasWhere = true;
	}
	
	if(!isNull(month)){
		if(hasWhere) {
			where += ' and ';
		}
		where +='m.month='+month+'';
		paramList.push(month);
		hasWhere = true;
	}
	
	var query = getReliabilityQuery();
	
	if(hasWhere){
		query += where;	
	}
	
	if (vars.$sort_field) {
		query += ' order by ' + vars.$sort_field;
		
		if(vars.$sort_order) {
			query += ' ' + vars.$sort_order;
		}	
	}
	
	vars.$ci_records_exists = vars.$L_filed.doSelect(query);
		
}

function getReliabilityQuery(){
	return 'select m.* from slamonthly m join device d on ( d.logical.name=m.logical.name) ';
}


function filterAvailPlansReport() {
	
	var name  = vars['$ci.name'];
	var status = vars['$ci.status'];//vars['$ci.status'];
	
	if(vars['$ci.name.save']!=vars['$ci.name']){		
		vars['$link.ci.id']   =null;
	}
	
	var id = vars['$link.ci.id'];
	
	vars['$ci.name.save'] = vars['$ci.name'];
	
	var where = '';
	if(!isNull(name)) {
		if(id!=null){
			where +=' and d.logical.name="'+lib.StringUtil.escapeAllStr(id)+'"';
		} else {			
			where +=' and d.sm.device.display.name#$ci.name';
		}
	}
	
	if(!isNull(status)){		
		where +=' and d.istatus="'+lib.StringUtil.escapeAllStr(status)+'"';
	}
	
	var query = getAvailPlansQuery();
	
	if(where!=''){
		query += where;	
	}
	
	if (vars.$sort_field) {
		query += ' order by ' + vars.$sort_field;
		
		if(vars.$sort_order) {
			query += ' ' + vars.$sort_order;
		}	
	}
	
	vars.$ci_records_exists = vars.$L_filed.doSelect(query);
		
}

function isNull(str){
	return null==str || ''==str;
}

function getAvailPlansQuery(){
	return 'select distinct d.logical.name,d.type,d.istatus,d.location,d.is.down,d.sm.device.display.name,d.network.name,d.device.severity, b.service.status as id from device d left join bizservice b on (d.logical.name=b.logical.name) join kmdocument k on (d.logical.name=k.logical.name) where d.type="bizservice" and k.subtype="Availability Plan" and k.doctype="reference" and (k.status="external" or k.status="internal")';
}