/*
 * This Script is for OAuth 2.0 callback authentication, called by webtier remote JS
 */

var logger = getLog("OAuthAuthenticationRemoteService");

/**
 * get auth token by access code, is used in auth code grant type
 *
 * @param {String} state
 * @param {String} authCode
 * @returns {String}
 */
function requestAccessTokenByAuthCode(state, authCode) {
    logger.info(`Requesting access token by authorization code for state "${state}".`);

    var result = lib.OAuthAuthentication.requestAccessTokenByAuthCode(state, authCode);
    return JSON.stringify(result);
}


/**
 * delete oauth state record by state
 *
 * @param {String} state
 */
function deleteOAuthStateByState(state) {
    logger.info(`Delete state record by state "${state}".`);

    if (!state) {
        return RC_BAD_QUERY;
    }

    var fstate = lib.c.$("oauthState").find("state=:state", state).one();
    if (fstate) {
        return fstate.doDelete();
    }

    return RC_NO_MORE;
}