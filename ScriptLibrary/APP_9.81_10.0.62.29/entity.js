function EntityBase()
{
  this._fileSave = null;
  this._file = null;
  this._fileName = null;
  this._ownRecordLock = false;
  this._groupFields = null;
  this._sortFields = null;
  this._sql = null;
  this._isNewRecord = false;
}

EntityBase.prototype.getFileName = function getFileName()
{
  return this._fileName;
}

EntityBase.prototype.getSql = function getSql()
{
  return this._sql;
}

EntityBase.prototype.getSortFields = function getSortFields()
{
  return this._sortFields;
}

EntityBase.prototype.getGroupFields = function getGroupFields()
{
  return this._groupFields;
}

EntityBase.prototype.getCurrentRecord = function getCurrentRecord()
{
  return this._file;
}

EntityBase.prototype.getOldRecord = function getOldRecord()
{
  return this._fileSave;
}

EntityBase.prototype.getFile = function getFile()
{
  return this._file;
}

EntityBase.prototype.getList = function getList()
{
  return this._file;
}

EntityBase.prototype.ownRecordLock = function ownRecordLock()
{
  return this._ownRecordLock;
}

EntityBase.prototype.open = function open( fileName, readonly )
{
  this._fileName = fileName;
  if ( readonly )
  {
    var SCFILE_READONLY = 999;
    this._record = new SCFile(fileName, SCFILE_READONLY);
  }
  else
    this._record = new SCFile(fileName);
	
  this._onRecordChanged();
  return this._record != null;
}

EntityBase.prototype.newRecord = function newRecord( fileName )
{
  return this.open( fileName );
}

EntityBase.prototype.initFromFile = function initFromFile( list, record, sql, locked )
{
  if ( list == null && record == null )
	return true;
  
  if ( this._ownRecordLock == true )
	this.unlock();
	
  if ( record != null )
	this._file = record;
	
  if ( list != null )
	this._file = list;

  this._onRecordChanged();
  
  this._sql = sql;
  this._ownRecordLock = locked;
  
  this._fileName = system.functions.filename( this._file );

  return true;
}

EntityBase.prototype.getUniqueValue = function getUniqueValue()
{
  var valArray =lib._LegacyRadHelper.createArrayDatum();
  system.functions.rtecall("getunique", null, valArray, this._file);
  var res = valArray.toArray();
  if ( res == null )
	res = [];
	
  return res;
}

EntityBase.prototype.getCurrentRecordId = function getCurrentRecordId()
{
  var recordId = new Datum(null);
  system.functions.rtecall("rid", null, this._file, recordId);
  return recordId.getValue();
}

EntityBase.prototype.setNumberRecord = function setNumberRecord( numberRecord )
{
  if ( numberRecord == null )
	return false;

  var res = true;
  var currentFile = this._file;
  var uniqueFields = currentFile.getUniqueFields();
  
  var field = uniqueFields[0];
  if( currentFile[field] == null )
  {
	var number = new Datum(null);
	system.functions.rtecall("getnumber", null, number, numberRecord);
	currentFile[field]=number;
  };
	
  return res;
}

EntityBase.prototype.hasMultiRecords = function hasMultiRecords()
{
  return this._multiRecords == 2;
}

EntityBase.prototype.hasRecord = function hasRecord()
{
  return this._multiRecords != 0;
}

EntityBase.prototype.isNewRecord = function isNewRecord()
{
  return this._isNewRecord;
}

EntityBase.prototype.getFolder = function getFolder()
{
  if (system.functions.exists("folder", this._file))
	return this._file.folder;

  return null;
}

EntityBase.prototype.select = function select( sql )
{
  var res = this._doSelect( sql );
  if ( res == RC_SUCCESS )
    this._sql = sql;

  return res;
}

EntityBase.prototype.save = function save()
{
  var res = this._file.doSave();
  if ( res == 0 )
  {
	this._onRecordChanged();
  }
  
  return res;
}

EntityBase.prototype._doSelect = function _doSelect( sql )
{
  
  var res = this._file.doSelect( sql );
  
  if ( res == RC_SUCCESS )
  {
	this._onRecordChanged();
  }

  return res;
}

EntityBase.prototype._onRecordChanged = function _onRecordChanged()
{
  if ( this._ownRecordLock == true )
	this.unlock();

  system.functions.rtecall("copycurrent", null, this._fileSave, this._file);
  this._ownRecordLock = null;
  this._isNewRecord = Boolean( system.functions._null( system.functions.contents(this._fileSave) ) );
	
  return true;
}

EntityBase.prototype.first = function first()
{
  var rc = this._file.getFirst();
  if ( rc == RC_SUCCESS )
    this._onRecordChanged();
  return rc;
}

EntityBase.prototype.last = function last()
{
  var rc = this._file.getLast();
  if ( rc == RC_SUCCESS )
    this._onRecordChanged();
  return rc;
}

EntityBase.prototype.next = function next()
{
  var rc = this._file.getNext();
  if ( rc == RC_SUCCESS )
    this._onRecordChanged();
  return rc;
}

EntityBase.prototype.previous = function previous()
{
  var rc = this._file.getPrev();
  if ( rc == RC_SUCCESS )
    this._onRecordChanged();
  return rc;
}

EntityBase.prototype.backup = function backup()
{
  var backup = new Datum(null);
  var res = system.functions.fduplicate(backup, this._file);
  if ( !res )
	backup = null;
	
  return backup;
}

EntityBase.prototype.restore = function restore( record )
{
  if ( record == null )
	return false;

  var res = system.functions.fduplicate(this._file, record);
  return res;
}

EntityBase.prototype.clone = function clone()
{
  var res = true;
  var currentFile = this._file;
  var uniqueFields = currentFile.getUniqueFields();
  var newFile = new SCFile(this.getFileName());

  system.functions.rtecall("copycurrent", null, newFile, currentFile);
  
  var length = uniqueFields.length;

  for( var i = 0; i < length;  ++i )
  {
	newFile[uniqueFields[i]] = null;
  }
  
  return newFile;
}
	
EntityBase.prototype.refresh = function refresh()
{
  var res = this._doSelect( this._sql );
  return res;
}

EntityBase.prototype.clear = function clear()
{
  system.functions.rtecall("copycurrent", null, this._file, this._fileSave);
  return true;
}

EntityBase.prototype.getLockName = function getLockName()
{
  var lockName = new Datum(null);
  system.functions.rtecall("tag", null, lockName, this._fileSave);
  if ( system.functions._null( lockName ) )
	return null;
	
  return lockName.getValue();
}

EntityBase.prototype.lock = function lock( wait )
{
  var lockName = this.getLockName();
  if ( lockName == null )
	return 0;
	
  //todo: add lock function in rte
  var res = lib._LegacyRadHelper.lock(lockName, true, Boolean(wait), 2, 1, 0, null);
  switch( res )
  {
	case 0:
	  this._ownRecordLock = null;
	break;
	
	case 1:
	  this._ownRecordLock = true;
	break;
	
	case 2:
	  this._ownRecordLock = false;
	break;
	
  }
  return this._ownRecordLock;
}

EntityBase.prototype.unlock = function unlock()
{
  if ( this._ownRecordLock != true )
  {
	return true;
  }
  
  var lockName = this.getLockName();
  if ( lockName == null )
	return true;

  //todo: add unlock function in rte
  var res = lib._LegacyRadHelper.unlock(lockName, true, false, null);
  return res;
}


