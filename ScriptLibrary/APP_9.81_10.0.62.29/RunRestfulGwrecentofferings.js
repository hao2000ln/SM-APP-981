var _ = lib.Underscore.require();
var $ = lib.c.$;
var restm=lib.RestfulMain;
var logger = getLog('RunRestfulGwrecentofferings');
var makeSort=lib.RestfulQuery.makeSort;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;

function POST(req, res) {
    //logger.setLevel("debug");
    var startTime = new Date();
    var count = +req.body.gwrecentoffering.count || 4;
    var language = req.body.gwrecentoffering.language || 'en';
    var msgs=[];
    if (count<1) count=4;
    var oper = getCurrentOperator();
    var operator =  oper['name'];

    var sql = 'select  t1.svcCatalogId svcCatalogId, t3.name name,t3.active active,t4.displayName, t3.type type ,t3.infoOnly infoOnly,t3.support.item support.item,t3.category.type category.type'+ 
          ',t4.displayName displayName,t4.description description, t2.open.time openTime'+
          ' from incidents t2 left outer join svcCartItem t1 on (t1.sdID = t2.incident.id)' +
          ' left outer join svcCatalog t3 on (t1.svcCatalogId = t3.id)' +
          ' left outer join svcDisplay t4 on (t3.name = t4.name and t4.syslanguage="' + language +'")' +
          ' where ((t2.opened.by.uid = "' + operator  + '" or t2.contact.name = $lo.contact.name or callback.contact = $lo.contact.name or alternate.contact=$lo.contact.name) and not null(t3.name))' +
           ' order by t2.open.time desc';

    // logger.debug("sql is" + sql);
    var fieldList = ['name','displayName','popularity','isPopular','active','cost','currency','description','type','infoOnly','support.item','category.type'];
    var returnFile = $("joinsvcDisplayItemCount", SCFILE_READONLY).setFields(fieldList).select(sql);
    var rc=returnFile.rc;
    var f = returnFile.scfile;
    // get the page data    
    var data = [];
    var catalogNames = [];
    var recordIndex = 0;
    var currentIndex = 0;
    while (rc == RC_SUCCESS && recordIndex < count && currentIndex < 100) {
        var name = f.name;
        currentIndex++;
        if (!name || funcs.index(name, catalogNames) > 0) {
            rc = f.getNext();
            continue;
        }
        var value = {
            name: f.name,
            displayName: f.displayName,
            active: f.active,
            type: f.type,
            description: f.description,
            categoryType: f.category_type,
            informationOnly: f.infoOnly,
            detailedDescription: f.detailedDescription,
            supportItem: f.support_item,
            image: lib.GatewayAPI_Cache.getCatalogImageCache().get(f.name),
            openTime: f.openTime.getTime()
        };
        catalogNames.push(f.name);
        if (!value.displayName) {
            value.displayName = value.name;
        }
        data.push(removeEmptyKeysAndWrapIt(value));
         rc = f.getNext();
         recordIndex++;
    }
    res.send({Messages: msgs, entities: data});
}

function removeEmptyKeysAndWrapIt(obj) {
    if(obj != null) {
        for(var key in obj) {
            if(obj[key]==null || obj[key]==='') {
                delete obj[key];
            }
        }
    }
    return obj;
}

function authorize() {
  return true;
}
