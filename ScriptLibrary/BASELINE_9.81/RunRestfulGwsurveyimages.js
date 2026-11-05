var logger = getLog('RunRestfulGwsurveyimages');
var $ = lib.c.$;

function GET(req, res) {
    var returnFile = findSurveyImages();
    var f = returnFile.scfile;
    var rc = returnFile.rc;
    var attrs = [];
    while (rc == RC_SUCCESS) {
       attrs.push({
                id: f['id'],
                name: f['name'],
                image:getImageId(f['id'])
            });
       rc = f.getNext();
    }
    res.send({surveyImages: attrs});
}

function findSurveyImages() {   
    var query = 'true';
    return $("SurveyImage", SCFILE_READONLY).select(query);
}
function getImageId(topic) {
    var query = 'application="SurveyImage" and type=3 and topic="' + topic + '"';    
    var image = lib.c.$("SYSATTACHMENTS", SCFILE_READONLY).setFields(["uid"]).select(query).uniqueResult();
    if (image) {
        return image.uid;
    } else {
        return null;
    }
}
function authorize() {
    return true;
}
