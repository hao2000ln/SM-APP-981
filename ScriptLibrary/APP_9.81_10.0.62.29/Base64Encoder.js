/*
 * SM javascript method "base64encode" is based on UTF-16LE charset, which is not acceptable for SRC-UI.
 * This script address this issue and encode/decode based on UTF-8.
 */

function encode(text) {
	return Base64.encode(text);
}

function decode(text) {
	return Base64.decode(text);
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

function isBase64(text) {
  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/\\-_]{4})*(?:[A-Za-z0-9+/\\-_]{2}==|[A-Za-z0-9+/\\-_]{3}=|[A-Za-z0-9+/\\-_]{4})$");  

   return base64Matcher.test(text);
}  

var base64mapping = {
      "A":"00", "B":"01", "C":"02", "D":"03", "E":"04", "F":"05", "G":"06", "H":"07", "I":"08", "J":"09", "K":"10", "L":"11", "M":"12", "N":"13", "O":"14", "P":"15",
      "Q":"16", "R":"17", "S":"18", "T":"19", "U":"20", "V":"21", "W":"22", "X":"23", "Y":"24", "Z":"25", "a":"26", "b":"27", "c":"28", "d":"29", "e":"30", "f":"31",
      "g":"32", "h":"33", "i":"34", "j":"35", "k":"36", "l":"37", "m":"38", "n":"39", "o":"40", "p":"41", "q":"42", "r":"43", "s":"44", "t":"45", "u":"46", "v":"47",
      "w":"48", "x":"49", "y":"50", "z":"51", "0":"52", "1":"53", "2":"54", "3":"55", "4":"56", "5":"57", "6":"58", "7":"59", "8":"60", "9":"61", "+":"62", "/":"63",
      "=":"64", "-":"65", "_":"66"
    };
    
var base64index = {
      "00":"A", "16":"Q", "32":"g", "48":"w",
      "01":"B", "17":"R", "33":"h", "49":"x",
      "02":"C", "18":"S", "34":"i", "50":"y",
      "03":"D", "19":"T", "35":"j", "51":"z",
      "04":"E", "20":"U", "36":"k", "52":"0",
      "05":"F", "21":"V", "37":"l", "53":"1",
      "06":"G", "22":"W", "38":"m", "54":"2",
      "07":"H", "23":"X", "39":"n", "55":"3",
      "08":"I", "24":"Y", "40":"o", "56":"4",
      "09":"J", "25":"Z", "41":"p", "57":"5",
      "10":"K", "26":"a", "42":"q", "58":"6",
      "11":"L", "27":"b", "43":"r", "59":"7",
      "12":"M", "28":"c", "44":"s", "60":"8",
      "13":"N", "29":"d", "45":"t", "61":"9",
      "14":"O", "30":"e", "46":"u", "62":"+",
      "15":"P", "31":"f", "47":"v", "63":"/",
      "64":"=", "65":"-", "66":"_"
    };

function encodeBase64Again(basecode) {
    if (basecode == null) {
        return null;
    }
    
    var encodedbase = "";
    var length = basecode.length;
    for (var i=0; i<length; i++) {
        var encoded_char = base64mapping[basecode[i]];
        if (encoded_char == null) {
            return null;
        }
        encodedbase += encoded_char;
    }
    
    return encodedbase;
}

function decodeBase64Back(encodedbase) {
    if (encodedbase == null) {
        return null;
    }
    
    var basecode = "";
    var length = encodedbase.length;
    for (var i=0; i<length; i=i+2) {
        if (i+1 >= length) {
            return null;
        }
        var base_char = base64index[encodedbase[i]+encodedbase[i+1]];
        if (base_char == null) {
            return null;
        }
        basecode += base_char;
    }
    
    return basecode;
}
