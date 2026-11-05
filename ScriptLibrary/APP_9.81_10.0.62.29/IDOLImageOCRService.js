var _ = lib.Underscore.require();
var XQuery = lib.XQuery.require();
var IDOLConfig = lib.IDOLConfigure.require();
var IDOLRequest = lib.IDOLRequest.require();
var IDOLSettings = lib.IDOLSettings.require();

var logger = getLog('IDOLImageOCRService');
var base64 = lib.Base64Encoder;

var IDOLImageOCRService = (function() {

    var encodeImage = function(raw) {
        // XXX: most of the time image OCR was running in background scheduler
        // there is no good chance to make background scheduler to 're-login' to refresh its setting
        // reload settings every time to make sure modification can take effect immediately
        var reader = IDOLSettings.createSettingReader('Smart Ticket');

        /**
         * Sometimes the information density of image is quite low.
         *
         * Use mobile to take photo from the PC monitor.
         * monitor pixel has its physical limitation, and mobile phone has very high resolution camera.
         * that make physical pixel obvious.
         *
         * compress the image to increase its quality.
         */
        const MAX_ALLOWED_IMAGE_SIZE = reader.getIntegerValue('ocr.max.size');
        const OPTIMIZED_IMAGE_SIZE = reader.getIntegerValue('ocr.optimized.size');
        const USE_FFT = reader.getBooleanValue('ocr.fft');

        return compressImage(raw, MAX_ALLOWED_IMAGE_SIZE, OPTIMIZED_IMAGE_SIZE, USE_FFT);
    };

    /**
     * upgrade idol to 12.3
     * use async call
     * fixme: set priority for front/back end 
     **/
    function synchronousParseAnalyze(endpoint, image, languages, retryTimes, intervalTimes, priority) {
        if (!retryTimes) {
            retryTimes = 5;
            logger.info("OCR retry time not config, set it to default:" + retryTimes);
        }
        if (!intervalTimes) {
            intervalTimes = 5;
            logger.info("OCR retry time not config, set it to default:" + intervalTimes);
        }

        logger.info("ocr request to idol, retry time is " + retryTimes + ", interval time is " + intervalTimes);

        if (!image) {
            return null;
        }

        var params = {
            action: 'process',
            sourcedata: encodeImage(image),
            ResponseFormat: 'simplejson',
            config: setupConfigurationAsync('document', languages),
            synchronous: 'false'
        };
        var tokenResponse = IDOLRequest.doIDOLOCRPost(endpoint, params);
        var token = JSON.parse(tokenResponse);
        if (logger.isDebugEnabled()) {
            logger.debug("get OCR token " + token.autnresponse.responsedata.token);
        }

        if (priority) {
            changeOCRRequestPriority(priority, endpoint, token.autnresponse.responsedata.token);
        }

        // get text by token
        var text = null;
        var count = 0;
        while (text == null && count < retryTimes) {
            count++;
            funcs.sleep(intervalTimes);
            try {
                text = getOCRTextByToken(endpoint, token.autnresponse.responsedata.token);
            } catch (e) {
                if (count >= retryTimes) {
                    logger.warn("Tried " + retryTimes + " times, failed get ocr text");
                }
                logger.info(count + " times to get ocr result");
            }
        }

        return text;
    }

    var changeOCRRequestPriority = function(priority, endpoint, token) {
        var changePriority = {
            "action": 'QueueInfo',
            "QueueAction": 'changePriority',
            "ResponseFormat": 'simplejson',
            "QueueName": 'Process',
            "priority": priority,
            "Token": token
        };
        var res = IDOLRequest.doIDOLOCRPost(endpoint, changePriority);
        var resObj = JSON.parse(res);
        if ("SUCCESS" === resObj.autnresponse.response) {
            logger.info("Change priority from 0 to " + priority);
        } else {
            logger.warn("Change priority failed, idol respose:" + res);
        }
    };

    var getOCRTextByToken = function(endpoint, token) {
        var tokenParams = {
            action: 'QueueInfo',
            QueueAction: 'GetStatus',
            State: 'finished',
            ResponseFormat: 'simplejson',
            QueueName: 'Process',
            Token: token
        };
        var response = JSON.parse(IDOLRequest.doIDOLOCRPost(endpoint, tokenParams));
        var action = response.autnresponse.responsedata.actions["action"];
        var records = action[0].output.record;
        var result = "";
        var i;
        for (i in records) {
            result += records[i].OCRResult.text + " ";
        }

        return result;
    };

    var setupConfigurationAsync = function(mode, languageList) {
        // fixme: need figure out if languages is list
        var language = languageList.join(',');
        logger.info("language list " + language);

        var config =
            "[Session]\n" +
            "Engine0 = Source\n" +
            "Engine1 = OCR\n" +
            "Engine2 = Response\n" +
            "[Source]\n" +
            "Type = image\n" +
            "[OCR]\n" +
            "Type = ocr\n" +
            "OCRMode = " + mode + "\n" +
            "Languages = " + language + "\n" +
            "WordRejectThreshold = 60\n" +
            "[Response]\n" +
            "Type = Response\n" +
            "Input = OCR.WordResult";

        if (logger.isTraceEnabled()) {
            logger.trace("base64 config " + lib.Base64Encoder.encode(config));
        }

        return lib.Base64Encoder.encode(config);
    };

    /**
     * 'ocr' action was deprecated, use 'Analyze' instead.
     * But sometimes 'ocr' can run much faster. Uncomment if needed.
     */
    // function synchronousParseOCR(endpoint, image, languages) {
    //   if (!image) return null;
    //   var params = {
    //     action : 'ocr',
    //     imagedata : encodeImage(image),
    //     OutputType : 'Text'
    //   };

    //   if (!_.isEmpty(languages)) {
    //     params.languages = languages.join(',');
    //   }

    //   var doc = IDOLRequest.doIDOLPost(endpoint, params);
    //   var text = XQuery.queryText('responsedata/page', doc);
    //   logger.trace("ocr results:\n" + text);
    //   return text;
    // }

    return {
        synchronousParse: synchronousParseAnalyze
    };
}());

function require() {
    return IDOLImageOCRService;
}

function synchronousParse(image, languages, retryTimes, intervalTimes, priority) {
    var endpoint = IDOLConfig.getImageEndPoint();
    if (languages && !_.isArray(languages)) {
        languages = [languages];
    }
    return IDOLImageOCRService.synchronousParse(endpoint, image, languages, retryTimes, intervalTimes, priority);
}