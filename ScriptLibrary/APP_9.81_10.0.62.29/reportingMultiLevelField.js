
_index    = system.functions.index;
_lng      = system.functions.lng;
_str      = system.functions.str;
_insert   = system.functions.insert;
_denull   = system.functions.denull;
_operator = system.functions.operator;
_rtecall  = system.functions.rtecall;
_scmsg    = system.functions.scmsg;
_val      = system.functions.val;
_nullsub  = system.functions.nullsub;
_getFieldCaption = system.functions.get_field_caption;

function setToTableAndFieldList(sourceTable, sourceField)
{
  var objFile = new SCFile("relation", SCFILE_READONLY);
  var rc = objFile.doSelect("source.file=\""+sourceTable+"\" and (source.field=\""+sourceField+"\" or source.field#\"*,"+sourceField+"\") and status isin {\"new\", \"fixed\"}");

  if (rc == RC_SUCCESS)
  {
    vars.$L_toTableList        = [];
    vars.$L_toTableCaptionList = [];
    vars.$L_toFieldList        = [];

    do
    {
      if (objFile.target_file!=null && _index(objFile.target_file,vars.$L_toTableList)<=0)
      {
        vars.$L_toTableList.push(objFile.target_file);
        vars.$L_toTableCaptionList.push( _nullsub(_scmsg(objFile.target_file, "tablename"), objFile.target_file) );
        vars.$L_toFieldList.push(objFile.target_field);
      }
    }while (objFile.getNext() == RC_SUCCESS)

    return true;
  } else {
    vars.$L_toTableList = null;
    vars.$L_toFieldList = null;

    return false;
  }
}
