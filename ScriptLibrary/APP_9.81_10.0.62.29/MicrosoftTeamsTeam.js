var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsTeam");
var API = lib.MicrosoftGraphAPI;

const CHANNEL_TYPE_PRIVATE = "private";


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
    API.setLoggerLevel(level);
}


/**
 * list my joined teams
 *
 * @returns {Object}
 *          { 
 *              error: Object,
 *              teams: [ {id, displayName, description} ]
 *          }
 */
function listJoinedTeams(intId) {
    logger.info(`[${intId}]`, "list joined teams.");

    // retrieve joined teams
    var response = API.joinedTeams(intId);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    var value = respObj.value;
    if (!value || value.length == 0) {
        return {
            "teams": []
        };
    }

    var teams = [];
    value.forEach(function(team) {
        teams.push({
            id: team.id,
            displayName: team.displayName,
            description: team.description
        });
    });

    return {
        "teams": teams
    };
}


/**
 * list my owned groups
 *
 * @returns {Object}
 *          { 
 *              error: Object,
 *              groups: [id]
 *          }
 */
function listOwnedGroups(intId) {
    logger.info(`[${intId}]`, "list owned objects.");

    // retrieve owned objects
    var response = API.ownedObjects(intId, "$select=id");
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    var value = respObj.value;
    if (!value || value.length == 0) {
        return {
            "groups": []
        };
    }

    var groups = [];
    value.forEach(function(object) {
        if (object["@odata.type"] == "#microsoft.graph.group") {
            groups.push(object.id);
        }
    });

    return {
        "groups": groups
    };
}


/**
 * list owned teams to synchronize
 *
 * @param   {Boolean} create only
 * @returns {Object}
 *          { 
 *              error: Object,
 *              teams: [ {id, displayName, description} ]
 *          }
 */
function listOwnedTeamsToSynchronize(intId, createOnly) {

    // retrieve joined teams
    var result = listJoinedTeams(intId);
    if (result.error) {
        return result;
    }

    var teams = result.teams;
    if (teams.length == 0) {
        return result;
    }

    // retrieve owned groups
    var ownerResult = listOwnedGroups(intId);
    if (ownerResult.error) {
        return ownerResult;
    }
    var ownedGroups = ownerResult.groups;

    // filter teams not owned
    teams = teams.filter((team) => ownedGroups.indexOf(team.id) >= 0);

    // filter teams already created
    if (createOnly) {
        var createdTeams = [];
        $("!msTeamsTeamInfo").fields("teamId").selectAll().each(function(team) {
            createdTeams.push(team.teamId);
        });

        teams = teams.filter((team) => createdTeams.indexOf(team.id) == -1);
    }

    return {
        "teams": teams
    };
}


/**
 * synchronize team and contained channels
 *
 * @param {String} teamId
 * @returns {Object}  result
 *          {
 *              error: Object,
 *              message: String
 *          }
 */
function synchronizeTeam(intId, teamId) {

    logger.info(`[${intId}]`, `synchronize team ${teamId}.`);

    // 1. retrieve team
    var response = API.team(intId, teamId);

    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    // 2. synchronize team record
    var fteam = $("msTeamsTeamInfo").find('teamId=:id', teamId).one();
    if (!fteam) {
        fteam = new SCFile("msTeamsTeamInfo");
        fteam.teamId = teamId;
        fteam.active = true;
    }

    fteam.displayName = respObj.displayName;
    fteam.description = respObj.description ? respObj.description.split("\n") : [];

    // integration id
    fteam.intId = intId;

    fteam.doSave();

    // 3. retrieve all channels
    response = API.teamChannels(intId, teamId);
    respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    // 4. create or update existed record
    var channels = respObj.value;
    var channelIds = [];

    var myId;

    var i;
    for (i = 0; i < channels.length; i++) {
        var channel = channels[i];

        var membershipType = channel.membershipType;

        // check owner for private channel
        if (membershipType == CHANNEL_TYPE_PRIVATE) {
            if (!myId) {
                myId = lib.MicrosoftTeamsUtil.getMyId(intId);
                if (!myId) {
                    logger.warn(`[${intId}]`, "Could not find my user id!");
                    continue;
                }
            }

            // don't synchronize if private channel not owned 
            if (!lib.MicrosoftTeamsChannel.isChannelOwner(intId, teamId, channel.id, myId)) {
                logger.info(`[${intId}]`, 'private channel "' + channel.displayName + '" not owned, ignore.');
                continue;
            }
        }

        var id = channel.id;
        channelIds.push(id);

        var fchannel = $("msTeamsChannelInfo").find('channelId=:id', id).one();
        if (!fchannel) {
            fchannel = new SCFile("msTeamsChannelInfo");
            fchannel.channelId = id;
            fchannel.active = fteam.active;
        }

        fchannel.teamId = teamId;
        fchannel.displayName = channel.displayName;
        fchannel.membershipType = membershipType;
        fchannel.description = channel.description ? channel.description.split("\n") : [];
        fchannel.webUrl = channel.webUrl;

        // get channel file folder
        logger.info(`[${intId}]`, 'synchronize files folder of channel "' + channel.displayName + '".');

        response = API.channelFilesFolder(intId, teamId, id);
        respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

        if (respObj.error) {
            logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        } else {
            fchannel.driveItemId = respObj.id;
            var itemParent = respObj.parentReference;
            if (itemParent) {
                fchannel.driveId = itemParent.driveId;
            }
        }

        fchannel.doSave();
    }

    // 5. inactive the channels those not existed
    var query = `teamId="${teamId}"`;
    if (channelIds.length > 0) {
        query += ' and channelId~="' + channelIds[0] + '"';
        for (i = 1; i < channelIds.length; i++) {
            query += ' and channelId~="' + channelIds[i] + '"';
        }
    }
    $("msTeamsChannelInfo").find(query).each(function(channel) {
        channel.active = false;
        channel.doUpdate();
    });

    return {
        message: funcs.scmsg("5", "msteams")
    };
}


/**
 * check whether team has channel
 *
 * @param {String} teamId
 * @returns {Boolean}
 */
function checkTeamHasChannel(teamId) {
    var channel = $("!msTeamsChannelInfo").fields("channelId").find("teamId=:id", teamId).one();
    return channel != null;
}


/**
 * check whether team is owned
 *
 * @param {String} teamId
 * @returns {Boolean}
 */
function checkTeamOwned(intId, teamId) {

    if (!teamId) {
        return false;
    }

    // retrieve owned groups
    var ownerResult = listOwnedGroups(intId);
    if (ownerResult.error) {
        return false;
    }

    var groups = ownerResult.groups;
    return (groups && groups.indexOf(teamId) >= 0);
}