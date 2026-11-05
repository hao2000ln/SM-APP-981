/*
*	Smart Analytics Services for OCR functions
*
*	author He, Peng-Fei
*	
*	var IDOLServiceOCR = lib.IDOLServiceOCR.require();
*	var result = IDOLServiceOCR.processOCR(SCFile.getAttachments()[0].value, 'en');
*/

var logger = getLog('IDOLServiceOCR');

var IDOLServiceOCR = function() {

	
	/**
	*   Call IDOL Image Service to process an image
	*
	*   @param {image} - The binary value of an image. Can get it by SCFile.getAttachments()[0].value;
	*	@param {language} - Language code
	*	@return - The text of the OCR result
	*   @type - String
	**/
	function processOCR(image, language) {
		logger.trace('start call lib.IDOLImageOCRService.processOCR()');
		
		var result = lib.IDOLImageOCRService.synchronousParse(image, language);
		
		logger.trace('finish call lib.IDOLImageOCRService.processOCR() with result: ' + result);
		
		return result
	}
	
	
	/**
	*   Call IDOL Image Service to process the attachment in a ticket and set it to target field
	*	The style of the OCR result will looks like 
	* 	---------------------------------------------------------------------
	*	image1...
	*	------------------------------------------------------------
	*	image2...
	*	------------------------------------------------------------
	*
	*   @param {record} - SCFile of a ticket record
	*   @param {targetField} - The field name of the ticket into which the ocr result will be written. e.g. description of an interaction record
	*	@param {language} - Language code
	*	@return - If the tichet has no image type attachment, returns false. else return true. The targetField of the record will be set with the OCR result.
	*   @type - boolean
	**/
	function processOCRToTicket(record, targetField, language) {
		logger.trace('start call lib.IDOL_Utilities.processOCR() with parameter record: ' + funcs.str(record) + ', targetField: ' + targetField + ', language: ' + language);
		
		var result = lib.IDOL_Utilities.processOCR(record, targetField, language);
		
		logger.trace('find call lib.IDOL_Utilities.processOCR() with result: ' + result + ' record: ' + funcs.str(record));
		
		return result;
	}
	
	return {
		processOCR: processOCR,
		processOCRToTicket: processOCRToTicket
	}
}()

function require() {
	return IDOLServiceOCR;
}