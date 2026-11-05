
var dataService = lib.c.$("#dataService");

var runInitialScript=InitializeCartItemTotal();

function InitializeCartItemTotal(){
    var sql = "insert into GWSVCITEMCOUNTTOTALM1 (ITEMID, NAME, POPULARITY,ISPOPULAR) (select ITEMID, ITEM_NAME as NAME, sum(COUNT) as POPULARITY,(case when sum(COUNT)>3 then 't' else 'f' END) ISPOPULAR from SVCITEMCNTM1 group by ITEMID,ITEM_NAME)"
    var result = dataService.executeSQL(sql);
    print("Records added to gwsvcItemCountTotal table successfully.")
}	
