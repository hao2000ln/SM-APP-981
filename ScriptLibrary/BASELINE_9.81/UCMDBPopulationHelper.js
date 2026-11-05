// There is a script to run when you have some errors in the UCMDB when using cirelationship populateion deletion. 
// After run this script, SM can clear the redundant Information in the table of cirelationship1to1.

function deleteRelation1to1ByDevice(startDate) {
	var deviceSql = 'istatus="Retired/Consumed"';
	if(startDate) {
		deviceSql += ' and sysmodtime >=\''+startDate+'\'';
	}
	
	lib.c.$('device', SCFILE_READONLY).setFields('logical.name').select(deviceSql).iterate(function(d){
		var logicalName = lib.StringUtil.escapeAllStr(d.logical_name)
		var sql = '(upstreamci.logical.name="' + logicalName + '" or downstreamci.logical.name="'+logicalName+'") and status="In Used"';
		lib.c.$('cirelationship1to1').select(sql).iterate(function(item){
			item.doDelete();
		});
	});
}

// Please change the date which has issues 
deleteRelation1to1ByDevice('01/07/10 22:15:37');
