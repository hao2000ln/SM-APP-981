var KMIdolSearch_Filter = lib.KMIdolSearch_Filter,
    IDOLGlobalSearchHighLight = lib.IDOLGlobalSearchHighLight.require(),
    XQuery = lib.XQuery.require();

var IDOLKMSearchXMLConverter = (function() {

  function convert(doc) {
    var name, 
        numhits = 0, 
        total_searched = 0,
        respdata  = XQuery.queryOne('responsedata', doc),
        docs = [],
        hitnodes =[], 
        i;

    if(respdata) {
      var child_node = respdata.getFirstChildElement();

      while(child_node != null){
        name = child_node.getNodeName();
        if(name == "numhits" ){
          numhits = child_node.getNodeValue();
        }
        if (name == "totaldbdocs"){
          total_searched = child_node.getNodeValue();
        }
        if(name == "hit"){
          hitnodes.push(child_node);
        }
        child_node = child_node.getNextSiblingElement();
      }
    }

    for(i = 0; i < hitnodes.length; i++){
      var weight = 0, 
          dbname = "", 
          view_url = "", 
          summary = "", 
          title = "", 
          status = "",
          kbname = "",
          id = "",
          fileurl = "",
          itemurl = "",
          docref = "";

      var subnode = hitnodes[i].getFirstChildElement();

      while(subnode != null) {
        name = subnode.getNodeName();
        if(name == "weight") {
          weight = subnode.getNodeValue();
        } else if (name == "database") {
          dbname = subnode.getNodeValue();
        } else if ( name == "title") {
          title = subnode.getNodeValue();
        } else if ( name == "summary") {
          summary = subnode.getNodeValue();
        } else if (name == "content") {
          var tmpNode = subnode.getFirstChildElement().getFirstChildElement();
          while( tmpNode ){
            name =  tmpNode.getNodeName();
            if (name == "KMSTATUS") {
              status = tmpNode.getNodeValue();
            } else if (name == "KNOWLEDGEBASE_NAME_MATCH"|| name=="KNOWLEDGEBASE_NAME")  {
              kbname = tmpNode.getNodeValue();
            } else if (name == "ID") {
              id = tmpNode.getNodeValue();
            } else if (name  == "FILEURL") {
              fileurl  = tmpNode.getNodeValue();
            } else if (name  == "LISTITEMURL") {
              itemurl = tmpNode.getNodeValue();
            }
            tmpNode = tmpNode.getNextSiblingElement();
          }
        } else if( name =="reference"){
          docref=decodeURIComponent(subnode.getNodeValue());
        } else{
          subnode = subnode.getNextSiblingElement();
          continue;
        }
        subnode = subnode.getNextSiblingElement();
      }

      //for weblib  fslib and sharepoint lib
      
      view_url = itemurl || fileurl || docref;
      title = title || view_url;
      kbname = kbname || dbname;

      var record ={
        "id" : id,
        "title" : IDOLGlobalSearchHighLight.escape(title || view_url),
        "view_url" : view_url,
        "summary" : IDOLGlobalSearchHighLight.escape(summary),
        "kbname" : kbname,
        "relevancy" : weight,
        "status" : status
      };

      //if is catalog_library, need check permission after search
      if (kbname == 'Catalog_Library') {
        if (KMIdolSearch_Filter.filterCatalog(id)) {
          docs.push(record);
        } else {
          numhits--;
        }
      } else {
        docs.push(record);
      }
    }

    return {
      data : docs,
      total : total_searched,
      num : numhits
    };
  }

  return {
    convert : convert
  };
}());

function require() {
  return IDOLKMSearchXMLConverter;
}