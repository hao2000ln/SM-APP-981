/** 
** Author: Weihui Zhang on 31.Mar.2011
** QC CR 62682
** Description: Make the not expression more sensitive for user reading and understanding.
** @@IsNegated = true   Check box of 'Not' checked (true)
**
*/

function convertToNot(filter, type)
{
 var op = filter.aOperator;
 var op_temp = op;
 var desc = filter.aDescription;
 var _msg = system.functions.scmsg;
   if (type == 3)    //type of date
   {
       if (op == "eq") {
            op = "neqDate";
            op_temp = "eqDate";
       }
       if (op == "isbetween")
            op = "isnotbetween";
       if (op == "gte") {
            op = "ngteDate";
            op_temp = "gteDate";
       }
       if (op == "lte") {
            op = "nlteDate";
            op_temp = "lteDate";
       }
       if (op == "null")
            op = "notnull";
            
   }
   
   if (type == 2)     //type of string
   {
       if (op == "isin")
            op = "isnotin";
       if (op == "eq")
            op = "neq";
       if (op == "startswith")
            op = "nstartswith";
       if (op == "null")
            op = "notnull";
           
   }
   
   if (type == 4)    //type of logical
   {
       if (op == "eq")
            op = "neq";
       if (op == "nneq") {
            op = "notneqLogical";
       }
              
   }
   
   if (type == 1)     //type of number
   {
      if (op == "eq")
           op = "neq";
      if (op == "nneq")
           op = "notneqLogical";
      if (op == "gt")
           op = "lteNum";
      if (op == "lt")
           op = "gteNum";
      if (op == "gte"){
           op = "lt";
           op_temp = "gteNum";
      }
      if (op == "lte"){
           op = "gt";
           op_temp = "lteNum";
      }
      if (op == "isbetween")
           op = "isnotbetween";
      if (op == "null")
           op = "notnull";
    }
    
    if (desc.indexOf(" (") != -1)         //add compound
    {
        desc = _msg("Negate", "view") + " " + desc;
    }
    
    if (desc.indexOf("is between") != -1)
    { 
        desc = desc.replace("is between", "is Not between");
    }
    else
    {
        desc = desc.replace(_msg(op_temp, "view"), _msg(op, "view"));
    }
    return desc;

}