var Class = lib.Prototype.getClass();
var BaseObject = Class.create({
		initialize:function(){
			this._hashCode_= this.getClassName() + BaseObject.OBJECT_COUNT;
			BaseObject.OBJECT_COUNT++;
		},
		hashCode:function(){
			return this._hashCode_;
		},
		/**
		please override it
		*/
		getClassName:function(){
			return "BaseObject";
		}
});
BaseObject.OBJECT_COUNT=0;
function getClass(){
	return BaseObject;
}