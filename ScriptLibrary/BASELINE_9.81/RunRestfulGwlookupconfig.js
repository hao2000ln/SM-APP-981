var logger = getLog('RunRestfulGwlookupconfig');

function GET(req, res) {
    // lookup configuration
    var retEntity = [
      {
        component:"approval-delegation",
        lookupField:"name",
        lookupTable:"operator"
      }
    ];
    res.status(200).send(
    {
        returnCode: 200,
        messages: ["SUCCESS"],
        entities: retEntity
    });
}

function authorize() {
  return true;
}