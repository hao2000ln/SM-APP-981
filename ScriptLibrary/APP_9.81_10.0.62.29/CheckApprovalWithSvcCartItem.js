/**
 * This function delete dead approval records without cart items related with. 
 *
 **/
function ClearApprovalWithoutCartItems() 
{

try
{
  print("checking the approvals for all service catalog cart items...");


  var fApproval = new SCFile("Approval");
  var fSql = "file.name=\"" + "svcCartItem" + "\"";
  var fRlt = fApproval.doSelect(fSql);
  while(fRlt == RC_SUCCESS)
   {
    print("Approval unique.key:"+fApproval.unique_key);
    var fsvcCartItem = new SCFile("svcCartItem");
    var fRlt2 = fsvcCartItem.doSelect("cartItemId=\"" +fApproval.unique_key +"\"");
  	if (fRlt2 != RC_SUCCESS)
     {
       print("no cartitem with Id:"+fApproval.unique_key+". Detele this approval");

       fApproval.doDelete();

     }
     else
     {
       print("svcCartItem:"+fApproval.unique_key+ " exists");
     }


      fRlt = fApproval.getNext();
    }
   print("finished");

}
catch ( exception )
{
  print( exception.toString() );
}

}


