function getCategoryStr(record)
{
  var categoryStr = null;
  //
  // check the filename
  
  if (system.functions.filename(record) == "probsummary")
  {
    if (record.category != null)
    {
      categoryStr = record.category;
      if (record.subcategory != null)
      { 
        categoryStr += ":"+ record.subcategory;
        if (record.product_type != null)
        {
          categoryStr +=  ":"+ record.product_type;
          if (record.problem_type != null)
          {
            categoryStr +=  ":"+ record.problem_type;
            //categoryStr +=  ";"+ categoryStr;
          }
        }
      }
    }      
  }
  else
    categoryStr = "";
    
  return categoryStr;
}