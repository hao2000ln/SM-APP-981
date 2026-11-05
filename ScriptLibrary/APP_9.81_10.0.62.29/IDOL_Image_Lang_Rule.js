// Convert SM langauge code to IDOL language code
var LANG_MAPPING = {
    'ar': 'ar', // 0=arabic
    'zh-Hans': 'zhs', // 1=chinese
    'zh-Hant': 'zht',
    'cs': 'cs', // 2=czech
    'nl': 'nl', // 3=dutch
    'en': 'en', // 4=english
    'fr': 'fr', // 5=french
    'de': 'de', // 6=german
    'he': 'he', // 7=hebrew
    'hu': 'hu', // 8=hungarian
    'it': 'it', // 9=italian
    'ja': 'ja', // 10=japanese
    'ko': 'ko', // 11=korean
    'pl': 'pl', // 12=polish
    'pt': 'pt', // 13=portuguese
    'ru': 'ru', // 14=russian
    'es': 'es', // 15=spanish
    'sv': 'sv', // 16=swedish
    'tr': 'tr', // 17=turkish
    'pt-Br': 'pt', // 18=Brazilian Portuguese

    // additional languages which IDOL OCR support
    'af': 'af', // Afrikaans 
    'eo': 'eo', // Esperanto 
    'eu': 'eu', // Basque 
    'et': 'et', // Estonian 
    'ga': 'ga', // Irish 
    'ro': 'ro', // Romanian 
    'ca': 'ca', // Catalan 
    'fi': 'fi', // Finnish 
    'la': 'la', // Latin 
    'sk': 'sk', // Slovak 
    'hr': 'hr', // Croatian 
    'lv': 'lv', // Latvian 
    'sl': 'sl', // Slovenian 
    'lt': 'lt', // Lithuanian 
    'da': 'da', // Danish 
    'mt': 'mt', // Maltese 
    'is': 'is', // Icelandic 
    'no': 'no', // Norwegian 
    'io': 'io', // Ido 
    'cy': 'cy', // Welsh 
    'bg': 'bg', // Bulgarian 
    'sr': 'sr', // Serbian 
    'mk': 'mk', // Macedonian 
    'uk': 'uk', // Ukrainian 
    'el': 'el', // Greek 
    'fa': 'fa', // Persian 
    'ur': 'ur'  // Urdu 
};

var IDOL_LANG = {latin: ['af', 'eo', 'it', 'pt', 'eu', 'et', 'ga', 'ro', 'ca', 'fi', 'la', 'sk', 'hr', 'fr', 'lv', 'sl', 'cs', 'de', 'lt', 'es', 'da', 'hu', 'mt', 'sv', 'nl', 'is', 'no', 'tr', 'en', 'io', 'pl', 'cy'],
					cyrillic: ['bg', 'sr', 'mk', 'uk', 'ru'],
					other: ['ko', 'el', 'he', 'ar', 'fa', 'ur', 'ja', 'zhs', 'zht']};

					
var IDOL_Image_Lang_Rule = (function() {
  
  
  function mappingIDOLLang(lang) {
	return LANG_MAPPING[lang] || "";
  }
  
  //The legacy OCR method does not support Korean.
  function koreanRule(langs, newLang) {
  	if (newLang === 'ko') {
  		return false;
  	}
  	
  	return true;
  }
  
  //Arabic cannot be combined with any other alphabets or languages.
  function arabicRule(langs, newLang) {
  	if (newLang === 'ar' && langs.length > 0) {
  		return false;
  	}
  	
  	if (lib.ArrayUtil.contains(langs, 'ar')) {
  		return false;
  	}
  	
  	return true;
  }
  
  //Hebrew cannot be combined with either Japanese, Simplified Chinese, or Traditional Chinese.
  function hebrewRule(langs, newLang) {
  	//if langs contains ja, zhs & zht
  	if (newLang === 'he') {
  		var isContain = false;
  		for (var i = 0; i < langs.length; i++) {
  			if (langs[i] === 'ja' || langs[i] === 'zhs' || langs[i] === 'zht') {
  				isContain = true;
  				break;
  			}
  		}
  		
  		if (isContain) {
  			return false;
  		}
  	}
  	
  	
  	//if newLang is ja, zhs & zht
  	if ((newLang === 'ja' || newLang === 'zhs' || newLang === 'zht') && lib.ArrayUtil.contains(langs, 'he')) {
  		return false;
  	}
  	
  	return true;
  }
  
  //If the legacy OCR method is used, the following languages can be combined with Latin alphabet languages only: js, zhs, zht
  function legacyRule(langs, newLang) {
  	if (newLang === 'ja' || newLang === 'zhs' || newLang === 'zht') {
  		var isContain = false;
  		for (var i = 0; i < langs.length; i++) {
  			if (lib.ArrayUtil.contains(IDOL_LANG.latin, langs[i])) {
  				isContain = true;
  				break;
  			}
  		}
  		if (isContain) {
  			return false;
  		}
  	}
  	
  	var isContain = false;
  	for (var i = 0; i < langs.length; i++) {
  		if (langs[i] === 'ja' || langs[i] === 'zhs' || langs[i] === 'zht') {
  			isContain = true;
  			break;
  		}
  	}
  	if (isContain) {
  		if (lib.ArrayUtil.contains(IDOL_LANG.latin, newLang)) {
  			return false;
  		}
  	}
  	
  	return true;
  }
  
  //Check if the new lang does already exist
  function duplicateRule(langs, newLang) {
  	if (lib.ArrayUtil.contains(langs, newLang)) {
  		return false;
  	}
  	return true;
  }
  
  function addLanguage(langs, newLang) {
  	if (!newLang || newLang === '') {
  		return langs;
  	}
  	
  	if (!duplicateRule(langs, newLang)) {
  		return langs;
  	}
  	
  	//Do not implement korean rule QCCR1E126313
  	/*if (!koreanRule(langs, newLang)) {
  		return langs
  	}*/
  	
  	if (!arabicRule(langs, newLang)) {
  		return langs
  	}
  	
  	if (!hebrewRule(langs, newLang)) {
  		return langs
  	}
  	
  	//Do not implement legacy rule QCCR1E126313
  	/*if (!legacyRule(langs, newLang)) {
  		return langs
  	}*/
  	
  	langs.push(newLang);
  	return langs;
  }
  
  return {
  	mappingIDOLLang: mappingIDOLLang,
  	addLanguage: addLanguage
  }
})();


function require() {
  return IDOL_Image_Lang_Rule;
}