var Class = lib.Prototype.getClass();

function getDAO(name){
	return getClass(name + "DAO");
}

function getClass(className){
	var cls = lib[className].getClass();
	return cls;
}

function importPackage(){
	var pk = {
		IncidentDAO:lib.IncidentDAO.getClass(),
		DeviceDAO:lib.DeviceDAO.getClass(),
		BasicDao:lib.BasicDao.getClass()
	};
	return pk;
}