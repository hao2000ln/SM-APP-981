/******************************************************
* Module Name: Case Exchange attachment information base Object
* Function: Manager interface
* Author: Fei, Zhi-Chao
* Version: 1.00
* Creation Date: Feb, 2014
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var CEAttachmentInforClass = Class.create({
	initialize: function () {
		this.id="";//Attachment unique id
		this.file_name ="";//Attachment name
		this.file_extension = "";//Attachment extension
		this.size = ""; //Attachment size
		this.mime_type = ""; //Attachment type
		this.creator = "";
		this.updatetime = "";
    },
	
	getID: function() {
		return this.id;
	},
    
	getFileName: function() {
		return this.file_name;
	},
	
	getFileExtension: function() {
		return this.file_extension;
	},
	
	getSize: function() {
		return this.size;
	},
	
	getFileType: function() {
		return this.mime_type;
	},
	
	getCreator: function() {
		return this.creator;
	},
	
	getUpdateTime: function() {
		return this.updatetime;
	},
	
	setID: function(id) {
		this.id = id;
	},
    
	setFileName: function(filename) {
		this.file_name = filename;
	},
	
	setFileExtension: function(extension) {
		this.file_extension = extension;
	},
	setSize: function(size) {
		this.size = size;
	},
	
	setFileType: function(filetype) {
		this.mime_type = filetype;
	},
	setCreator: function(creater) {
		this.creator = creater;
	},
	
	setUpdateTime: function(updatetime) {
		this.updatetime = updatetime;
	}
	
});

function getClass() {
    return CEAttachmentInforClass;
}