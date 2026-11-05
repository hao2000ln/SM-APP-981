var logger = getLog("Encrypt");

/**
 *  Functions in this JavaScript are private. Customers should not use these functions. 
 */

/**
 *  Check if the string matches the format of encrypted
 *  The format start from FEFE and end with EFEF
 *  There are more than 30 characters of number or upper case letter between them
 *  Actually, the minimum length of total encrypted string is 40
 */
function isEncrypted(str) {
    if (str == null) {
        return false;
    }
    
    // RTE function "encrypt" encrypts to one object, need to convert to string
    if (typeof(str) == "object") {
        str = funcs.str(str);
    }
    
    return /^FEFE[0-9A-F]{30,}EFEF$/.test(str);
}

/**
 *  Encrypt the string if it is not encrypted
 *  If the string matches the format of encrypted, only return itself
 */
function encrypt(str, useHardcodeKey, useSessionKey) {
    if (!isEncrypted(str)) {
        var encrypted = new Datum();
        var ret = funcs.encrypt(encrypted, str, useHardcodeKey, useSessionKey);
        if (ret) {
            return funcs.str(encrypted);
        }
    }
    
    return str;
}

/**
 *  Decrypt the string if it is encrypted.
 *  If the string doesn't match the format of encrypted, only return itself
 */
function decrypt(str, useHardcodeKey, useSessionKey) {
    if (isEncrypted(str)) {
        var decrypted = new Datum();
        var ret = funcs.decrypt(decrypted, str, useHardcodeKey, useSessionKey);
        if (ret) {
            return funcs.str(decrypted);
        }
    }
    
    return str;
}

/**
 *  Parameter encryptionkey is changed from RTE side,
 *  any encrypted values by encrypt function with encryptionkey
 *  could be re-encrypted from here.
 */
function encryptionkeyChanged() {
    var lng;
    var i;
    var update;
    var reencryptValue;
    var smis = new SCFile("SMISConfiguration");
    var rc = smis.doSelect("true");
    while (rc == RC_SUCCESS) {
        logger.info("Process SMIS instance: " + smis["name"]);
        update = false;
        if (smis["paramInfo"]) {
            lng = funcs.lng(smis["paramInfo"]);
            for (i=0; i<lng; i++) {
                if (smis["paramInfo"][i]["ispwd"] == true && smis["paramInfo"][i]["paramType"] == "Character") {
                    logger.info("Found field: " + smis["paramInfo"][i]["paramName"]);
                    reencryptValue = reEncrypt(smis["paramInfo"][i]["paramValue"]);
                    if (!reencryptValue) {
                        logger.error("Failed to re-Encrypted.");
                    } else if (reencryptValue != smis["paramInfo"][i]["paramValue"]) {
                        logger.info("Value is re-Encrypted.");
                        update = true;
                        smis["paramInfo"][i]["paramValue"] = reencryptValue;
                    } else {
                        logger.info("Value is not changed.");
                    }
                }
            }
            if (update) {
                smis.doUpdate();
                logger.info("SMIS instance is updated.");
            }
        }
        logger.info("Process SMIS instance: " + smis["name"] + " finished.");
        rc = smis.getNext();
    }
    
    return 0;
}

/**
 *  Re-Encrypt the string if it is encrypted by encryptionkey.
 *  It should only be called when encryptionkey changed.
 *  If the string isn't encrypted, encryptionkey not changed, re-encrypt failed, return null.
 */
function reEncrypt(str) {
    if (isEncrypted(str)) {
        return reencryption(str);
    }

    return null;
}
