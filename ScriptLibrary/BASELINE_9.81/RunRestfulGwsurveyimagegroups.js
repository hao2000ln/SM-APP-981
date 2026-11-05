var logger = getLog('RunRestfulGwsurveyimagegroups');
var $ = lib.c.$;

function GET(req, res) {
    var returnFile = findSurveyImageGroups();
    var f = returnFile.scfile;
    var rc = returnFile.rc;
    var attrs = [];
    while (rc == RC_SUCCESS) {
       var images = f['images'];
       var imageList = [];
       for (var i=0;i<funcs.lng(images);i++) {
           imageList.push({
             value: images[i].value,
             image:images[i].image
           });
       }
       attrs.push({
                id: f['id'],
                name: f['name'],
                images: imageList
            });
       rc = f.getNext();
    }
    res.send({surveyImageGroups: attrs});
}

function findSurveyImageGroups() {   
    var query = 'true';
    return $("SurveyImageGroup", SCFILE_READONLY).select(query);
}

function authorize() {
    return true;
}
