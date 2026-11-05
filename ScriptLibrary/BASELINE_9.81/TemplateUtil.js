function removeTemplate(sFileName)
{
  var ret = RC_SUCCESS;
  var n = 0;
  var file = new SCFile(sFileName);
  
  if (RC_SUCCESS == file.doSelect('true'))
  {
    do
    {
      if (!system.functions.rtecall("templateRemove", ret, file))
        break; 
      ++n;
    }
    while (RC_SUCCESS == file.getNext());
  }
  print("done, total "+n+" records.");
}

function restoreTemplate(sFileName)
{
  var ret = RC_SUCCESS;
  var n = 0;
  var file = new SCFile(sFileName);
  
  if (RC_SUCCESS == file.doSelect('true'))
  {
    do
    { 
      if(!system.functions.rtecall("templateRestore", ret, file))
        break;
      ++n;
    }
    while (RC_SUCCESS == file.getNext()); 
  }
  print("done, total "+n+" records.");
}



