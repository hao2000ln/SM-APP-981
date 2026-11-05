function getHitList(aHitList, fKMQuery) {
    if(aHitList[0] === "error") {
      return aHitList[1];
    }

    var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, "Default"));
    var columns = hitlist[0].columns;

    var strStyle = vars.$G_km_globalenv.kmhitliststyle;

    var docsSearchedString
    if (aHitList[0] >= 0) {
      docsSearchedString = funcs.scmsg(163, "km", aHitList);
    } else {
      docsSearchedString = funcs.scmsg(222, "km");
    }
    
    var result = new SCDatum();
    result.setType(8);
    
    var num = aHitList.num, 
        total = aHitList.total;

    result.push(num);
    result.push(total);
 
    for( var i = 0; i < aHitList.data.length; i++ ) {
      //result
      if (fKMQuery.doccount > 0 && i >= fKMQuery.doccount) {
        break;
      }
      var record  = aHitList.data[i];
      result.push(record["view_url"]);
      result.push(record["title"]);
      result.push(record["summary"]);
      result.push(record["kbname"]);
      result.push(record["relevancy"]);
      result.push(record["status"]);

    }
    return result;
  }