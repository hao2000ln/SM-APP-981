var Class = lib.smis_Prototype.getClass();

var SMSAPManagerClass = Class.create(lib.smis_Manager.getClass(), {

  isScheduleBased: function() {
  	return false;
  }
});
	

function getClass() {return SMSAPManagerClass;}