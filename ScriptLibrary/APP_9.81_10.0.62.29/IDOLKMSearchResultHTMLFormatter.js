var _ = lib.Underscore.require(),
    KMSearch = lib.KMSearch,
    KMUtils = lib.KMUtils;

var IDOLKMSearchResultHTMLFormatter = (function() {
  
  var msgNumKBName="9503",
      msgNumRelevancy="9500",
      msgNumStatus="9502";

  function convertUnixToWindowsPath(fsyslib, strViewURL, kbname) {
    var mapArray = KMUtils.parseListToSCArray(fsyslib,";");
    if ( strViewURL.indexOf(mapArray[1]) >= 0 ) {
      if (mapArray[2].charAt(mapArray[2].length - 1) == "//" || mapArray[2].charAt(mapArray[2].length - 1) == "\\") {
        mapArray[2] = mapArray[2].substr(0, mapArray[2].length-1);
      }
      if (mapArray[3].charAt(mapArray[3].length - 1) == "//" || mapArray[3].charAt(mapArray[3].length - 1) == "\\") {
        mapArray[3] = mapArray[3].substr(0, mapArray[3].length - 1);
      }
      strViewURL = mapArray[3] + strViewURL.substr(mapArray[2].length);
    }
    return strViewURL;
  }

  function customizeViewURL(strViewURL) {
    if (strViewURL!= null) {
      strViewURL = strViewURL.replace("file:/","");
    }
    return strViewURL;
  }
  
  function getHTMLHitList(aHitList, strHitlistTemplate) {
    if(aHitList[0] === "error") {
      return aHitList[1];
    }

    var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, "Default"));
    var h0 = hitlist[0];
    var columns = h0.columns;

    var strStyle = vars.$G_km_globalenv.kmhitliststyle;

    var docsSearchedString;
    if (aHitList[0] >= 0) {
      docsSearchedString = funcs.scmsg(163, "km", aHitList);
    } else {
      docsSearchedString = funcs.scmsg(222, "km");
    }

    var strHTML = strStyle + "<DIV class=\"resultHeading\">" + docsSearchedString + "<BR><BR></DIV><DIV class=\"resultTable\">";

    var linkPosition = KMSearch.getLinkPosition(hitlist, columns);
    var kbnamePosition = 2 + KMSearch.getKBNamePosition(hitlist, columns);
    var numColumns = columns.length();

    var rcount = 0;
    var strViewURL;
    var fieldcount;
    var strRowClass;
    var numfields;

    var fsyslibLength = vars.$fsyslibs.length();

    for( var i = 2; i < aHitList.length; i++ ) {
      var record  = aHitList[i];

      strViewURL = record.view_url; //"sclink://kmdocument:id#11";
      var kbname = aHitList[kbnamePosition] + ";";  // with a semi-colon on the end

      for (var k = 0; k < fsyslibLength; k++) {
        if (vars.$fsyslibs[k].indexOf(kbname) == 0) {
          strViewURL = convertUnixToWindowsPath(vars.$fsyslibs[k], strViewURL, kbname);
          break;
        }
      }

      fieldcount = 1; //we are already on position 1 because position 0 is the VIEW_URL
      //add row for each hit

      // XXX: should use css style to determine odd/even row, like
      // div.nth-child(even) {}
      // div.nth-child(odd) {}
      strRowClass = rcount%2==0 ? "evenRow" : "oddRow";
      strHTML += "<DIV CLASS=\""+ strRowClass +"\">"

      for(var j = 0; j < numColumns; j++) {
        var tmpFld = "";
        if( columns[j].heading != null && typeof(columns[j].heading) != "object") {
          var theHdr = columns[j].heading;
          var spec_loc = theHdr.indexOf("*SCMSG");
          var tmpVal = columns[j].heading;

          if (spec_loc >= 0) {
            tmpFld = theHdr.substring(spec_loc + 7, theHdr.length);
            tmpFld = tmpFld.substring(0, tmpFld.indexOf("*SCMSG"));
            tmpVal = funcs.scmsg(tmpFld, 'km');
            tmpVal = tmpVal || '';
          }
          strHTML += "<DIV class=\"fieldLabel\">" + tmpVal +":</DIV>";
        }
        strHTML += "<DIV class=\"" + columns[j].width +"\" >";

        numfields = columns[j].fields.length();

        for(var k = 0; k < numfields; k++) {
          if(fieldcount == linkPosition) {
            strHTML += "<a href=\"" + strViewURL +"\"><SPAN class=\"resultLink\">" + customizeViewURL(record.title) + "</span></a>";
          } else if (columns[j].width  == "resultSummary") {
            strHTML += record.summary ;
          } else if(tmpFld == msgNumKBName) {
            strHTML += record.kbname; //Knowledgebase
          } else if(tmpFld == msgNumRelevancy) {
            strHTML += record.relevancy; //Relevancy
          } else if(tmpFld == msgNumStatus) {
            strHTML += record.status; //Status
          }
          fieldcount++;
        }
        strHTML += "</DIV>"
      }
      strHTML += "</DIV>";
    }
    return strHTML;
  }

  return {
    getHTMLHitList : getHTMLHitList
  }
})();

function require() {
  return IDOLKMSearchResultHTMLFormatter;
}