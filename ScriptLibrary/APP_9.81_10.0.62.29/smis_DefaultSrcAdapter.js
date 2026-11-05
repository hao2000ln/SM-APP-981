var Class = lib.smis_Prototype.getClass();

var DefaultSrcAdapterClass = Class.create({

  records : null,  	

  initialize: function(configItem) {
    this.configItem = configItem;
  },
  
  getFields: function() {
  	return [];
  }
 

});


function getClass() {return DefaultSrcAdapterClass;}
