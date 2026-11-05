// Convert the emoji symbol to code
function convertEmojiSymbol2Code(str) {
    if (!str) {
        return str;
    }

    var i;
    var convertedStr = "";
    for (i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (isHighSurrogate(charCode)) {
            if (i + 1 < str.length) {
                var nextCharCode = str.charCodeAt(i + 1);
                if (isLowSurrogate(nextCharCode)) {
                    convertedStr += getCodePointString(charCode, nextCharCode);
                    i++;
                    continue;
                }
            }
        }
        convertedStr += str.charAt(i);
    }
    return convertedStr;
}

// Convert the emoji surrogate to code
function convertEmojiSurrogate2Code(str) {
    var regex = /&#x([0-9a-fA-F]{4});&#x([0-9a-fA-F]{4});/ig;
    var convertedStr = str.replace(regex,
        function($1, $2, $3) {
            var surrogateHigh = parseInt($2, 16);
            var surrogateLow = parseInt($3, 16);
            if (isHighSurrogate(surrogateHigh) && isLowSurrogate(surrogateLow)) {
                return getCodePointString(surrogateHigh, surrogateLow);
            }
            return $1;
        });
    return convertedStr;
}

function isHighSurrogate(charCode) {
    return charCode >= 0xd800 && charCode <= 0xdbff;
}

function isLowSurrogate(charCode) {
    return charCode >= 0xdc00 && charCode <= 0xdfff;
}

function getCodePoint(surrogateHigh, surrogateLow) {
    var code = (surrogateHigh - 0xD800) * 0x400 + surrogateLow - 0xDC00 + 0x10000;
    return code;
}

function getCodePointString(surrogateHigh, surrogateLow) {
    var code = getCodePoint(surrogateHigh, surrogateLow);
    return "&#x" + code.toString(16).toUpperCase() + ";";
}

//Convert unicode like &amp;#x1F60A and #x1F60A; to Emoji
function convertUnicode2Emoji(sourceCode) {
    if (!sourceCode) {
        return sourceCode;
    }

    if (funcs.type(sourceCode) == lib.DataTypeConst.typeArray() || Array.isArray(sourceCode)) {
        var sourceEmojis = [];
        lib.ArrayUtil.toJsArray(sourceCode).forEach(function(item) {
            sourceEmojis.push(convertEmoji(item));
        });
        return sourceEmojis;
    } else if (funcs.type(sourceCode) == lib.DataTypeConst.typeCharacter()) {
        return convertEmoji(sourceCode);
    } else {
        return sourceCode;
    }
}

function convertEmoji(code) {
    if (!code) {
        return code;
    }

    // convert \u0026 as & for the emoji code for Hex, refer to convertEmojiFromHex
    code = code.replace(/\\u0026#x([0-9a-fA-F]{5});/g, function($1, $2) {
        return "&#x" + $2 + ";";
    });

    // convert \u0026 as & for the emoji code for Dec, refer to convertEmojiFromDec
    code = code.replace(/\\u0026#([0-9]{6});/g, function($1, $2) {
        return "&#" + $2 + ";";
    });

    return convertEmojiFromDec(convertEmojiFromHex(code));
}

//Hex code &#x1F60A;
function convertEmojiFromHex(code) {
    var regex = /&#x([0-9a-fA-F]{5});/g;
    return code.replace(regex, function($1, $2) {
        return String.fromCodePoint(parseInt($2, 16));
    });
}
//Dec code &#128523;
function convertEmojiFromDec(code) {
    var regex = /&#([0-9]{6});/g;
    return code.replace(regex, function($1, $2) {
        return String.fromCodePoint($2);
    });
}