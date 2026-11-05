var _ = lib.Underscore.require(),
		IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require();

function createInteractionInstance(contact) {
  var interaction = new SCFile("incidents");
  interaction["contact.name"] = contact;
  interaction["callback.contact"] = contact;
  interaction["alternate.contact"] = contact;
  interaction["category"] = "service catalog";
  interaction["subcategory"] = "service catalog";
  interaction["problem.type"] = "service catalog";
  interaction["product.type"] = "service catalog";

  var link = lib.ScAPI_RAD.se_get_record("incidents", "name", "link", true);

  lib.ScAPI_RAD.us_link(interaction,"contact.name",link,"fill",true);
  lib.ScAPI_RAD.us_link(interaction,"callback.contact",link,"fill",true);
  lib.ScAPI_RAD.us_link(interaction,"alternate.contact",link,"fill",true);

  return interaction;
}

// smart search sometimes works in "login as" environment, the global variable
// may change at runtime.
var createDummyInteraction = _.memoize(createInteractionInstance);

function filterCatalog(catalogId) {
  var catalog = new SCFile('svcCatalog', SCFILE_READONLY);

  var rc = catalog.doSelect('id = "' + catalogId + '" and active = true and type isin {"item","bundle"}');
  if (rc !== RC_SUCCESS) {
    return false;
  }
  //check access filter
  var accessFilter = catalog['access.filter'];
  if (accessFilter != null) {
    accessFilter = accessFilter.toString();
    if (accessFilter != '' && accessFilter != 'true'){
      var dummyInteraction =  createDummyInteraction(vars.$lo_contact_name);
      return IDOLGlobalSearchSandbox.evaluate({
        '$L.file' : dummyInteraction
      }, function() {
        return funcs.evaluate(funcs.parse(accessFilter, 2));
      });
    }
  }
  
  return true;
}