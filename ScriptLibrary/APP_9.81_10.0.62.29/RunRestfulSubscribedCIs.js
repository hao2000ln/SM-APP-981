var JSON = { "toJson": rteJSONStringify, "parse": rteJSONParse };
var subscription_other = lib.ScAPI_Constants.SUBSCRIPTION_OTHER();

function GET(req, res) {
  var name = findNameInQuery(req.options.query, 'contact');
  if (!name) {
    res.status(400).message('contact parameter is required');
    return;
  }

  var search = findNameInQuery(req.options.query, 'filter');

  var start = +req.options.start || 1;
  var count = +req.options.count || 50;
  
  if(start<1) start=1;
  if(count<1) count=50;

  var contact = lib.c.$('contacts', SCFILE_READONLY).setFields(['contact.name', 'dept']).select('contact.name="' + lib.StringUtil.escapeAllStr(name) + '"').uniqueResult();
  if (null == contact) {
    res.status(404).message('contact not found: ' + name);
    return;
  }

  var ename = lib.StringUtil.escapeAllStr(name);
  var edept = lib.StringUtil.escapeAllStr(contact.dept);
  var sql = 'SELECT distinct sb.serviceName, de.sm.device.display.name'
    + ' from Subscription sb LEFT OUTER JOIN device de ON (sb.serviceName=de.logical.name) '
    + ' where ((sb.subscriberType="contacts" and sb.subscriber="' + ename + '")'
    + ' or (sb.subscriberType="dept" and sb.subscriber="' + edept + '"))'
    + ' and (sb.status="Active" or sb.status="Cancellation Requested")';

  var esearch = null;
  if (search) {
    esearch = lib.StringUtil.escapeAllStr(search);
    sql += ' and (de.sm.device.display.name like \"*' + esearch + '*\")';
  }
  sql += ' order by de.sm.device.display.name asc';

  var countSql = 'SELECT count(distinct sb.serviceName)'
    + ' from Subscription sb LEFT OUTER JOIN device de ON (sb.serviceName=de.logical.name) '
    + ' where ((sb.subscriberType="contacts" and sb.subscriber="' + ename + '")'
    + ' or (sb.subscriberType="dept" and sb.subscriber="' + edept + '"))'
    + ' and (sb.status="Active" or sb.status="Cancellation Requested")';

  if (search) {
    countSql += ' and (de.sm.device.display.name like \"' + esearch + '\")';
  }

  var totalCount = lib.c.$('Subscription').select(countSql).uniqueResult()[0];

  var returnFile = new SCFile('Subscription');
  var rc = returnFile.doSelect(sql);

  // skip the start
  var recordIndex = 0;
  while (rc == RC_SUCCESS && recordIndex < start - 1) {
    recordIndex++;
    rc = returnFile.getNext();
  }

  // get the page data    
  var data = [];
  var recordIndex = 0;
  while (rc == RC_SUCCESS && recordIndex < count) {
    data.push({ id: returnFile[0], name: returnFile[1] });
    rc = returnFile.getNext();
    recordIndex++;
  }

  // Add other
  if (start + count > (totalCount + 1) && start <= (totalCount + 1)) {
    data.push({ id: 'others', name: subscription_other });
  }

  res.send({ data: data, '@start': start, '@count': data.length, '@totalcount': totalCount + 1 });

}

function findNameInQuery(query, name) {
  var value = query.match(name + "=\"(.+?)\"");
  if (!value) {
    return null;
  }

  var name = value[1];
  if (name) {
    name = name.replace(/\\\\/g, '\\');
    name = name.replace(/\\\"/g, '\"');
  }

  return name;
}

function authorize() {
  return lib.security.getRights("Common Configuration", "admin") === "true";
}