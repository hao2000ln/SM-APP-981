var $ = lib.c.$;
var MIGRATE_PROFILE_SUFFIX = "_migrated";
/**
* Script to update Request module to PD style
* TODO upgradeOperator and upgradeUserRoles can be refect and reuse in other module
**/
var RequestUpgradeManager = $(lib.ProcessDesignCPUpgradeManager.getClass(),
		new function() {

			return {
				upgradeProfiles : function() {
					var profile = new SCFile( "ocmprofile" );
					var sql = "true";
					var upgradeInfoObj={};
					// all the fields not included in this oob dbdict list will treat as customized fields
					upgradeInfoObj["dbdict_profile_930"]=["access.li","active.query","alert.add","alert.brw","alert.del","alert.upd","all","all.query","allowed.cats","allowedStatus","append.query","appr.active","apprcfrm.delete","apprdis","apprdism","approval.groups","approvals","approve","approve.add","approve.brw","approve.del","approve.delegate","approve.mass","approve.override","approve.reeval","approve.reset","approve.upd","apprun","area","audit","avail.to.order","bg.fkey","calcrsk","cat","cfrm.alertdel","cfrm.close","cfrm.copy","cfrm.end","cfrm.nextphase","cfrm.open","cfrm.phasechg","cfrm.print","cfrm.reopen","cfrm.update","clear","close","closed.update","count","cpyopn","database","default.category","deferred","duplicates","expand","fill","find","generate.order","groups","history","initial.fmt","line.initial.inbox","line.manage.format","manager.group","mult.select","name","name.alias","new","new.category","new.phase","open","order.initial.inbox","order.manage.format","pagelist","partial.key","phase.log","post","print","print.bg","print.fg","print.qbe","printer","qbe.format","qbelist.format","qbelist.report","qberecs","qberecs.format","qberecs.report","qberestore","query.time.limit","query.window","quote.initial.inbox","quote.manage.format","receive","reopen","require.password","scripts","search.format","select.components","skip.warning","split","standard","statements","structured","subtotal","sysmodcount","sysmodtime","sysmoduser","update","valid.lkup","view","views"];
					upgradeInfoObj["mapped_fields"]=["allowedStatus","append.query","approvals","approve.delegate","canAlternateForm","editTaskPlanner","intialFormat","initialView","manager.group","qbe.format","queueFormat","skip.warning"];
					upgradeInfoObj["profile_dbdict_name"]="ocmprofile";
					upgradeInfoObj["script_setup_name"]="SecuritySetupEnvironment";
					upgradeInfoObj["areas"]=["Request","Request Tasks"];
					
					if ( profile.doSelect( sql ) == RC_SUCCESS )
					{
						do
						{
						//using the new role upgrade script	
                        lib.SecurityProfileCopy.upgradeProfiles(profile.name, upgradeInfoObj, profile.name + MIGRATE_PROFILE_SUFFIX);
						}
						while ( profile.getNext() == RC_SUCCESS );
						
					}
            },

            upgradeOperators: function() {
                var operator = new SCFile("operator");
                var sql = "true";
                var index = 0;
                if (operator.doSelect(sql) == RC_SUCCESS) {
                    do {
                        for (var i = 0, lng = operator.profile_request.length(); i < lng; i++) {
                            if (operator.profile_request[i] != null && operator.profile_request[i] != "" && funcs.index(operator.profile_request[i] + MIGRATE_PROFILE_SUFFIX, operator.secRole) == 0) {
                                operator.secRole = funcs.insert(operator.secRole, 0, 1, operator.profile_request[i] + MIGRATE_PROFILE_SUFFIX);
                            }
                        }
                        index = funcs.index("default", operator.secRole);
                        if (index > 0) {
                            operator.secRole[index - 1] = "DEFAULT";
                        }

                        if (funcs.lng(funcs.denull(operator.secRole)) == 0) {
                            operator.secRole[0] = "DEFAULT";
                        }
                        operator.doUpdate();
                    }
                    while (operator.getNext() == RC_SUCCESS);
                }
            },

            upgradeUserRoles: function() {
                var usrRole = new SCFile("userrole");
                var sql = "true";
                var index = 0;
                usrRole.doSelect(sql);
                if (usrRole.getFirst() == RC_SUCCESS) {

                    do {

                        vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, usrRole.profile_request, 0, 0);
                        usrRole.profile_request = funcs.denull(usrRole.profile_request);

                        var i;
                        var lng = usrRole.profile_request.length();
                        for (i = 0; i < lng; i++) {

                            if (usrRole.profile_request[i] != null) {
                                if (funcs.index(usrRole.profile_request[i] + MIGRATE_PROFILE_SUFFIX, usrRole.secRole) == 0) {
                                    usrRole.secRole.push(usrRole.profile_request[i]+MIGRATE_PROFILE_SUFFIX);
                                }
                            }

                        }
                        index = funcs.index("default", usrRole.secRole);
                        if (index > 0) {
                            usrRole.secRole[index - 1] = "DEFAULT";
                        }

                        if (funcs.lng(funcs.denull(usrRole.secRole)) == 0) {
                            usrRole.secRole[0] = "DEFAULT";
                        }

                        vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, usrRole.secRole, 0, 0);
                        usrRole.doUpdate();

                    } while (usrRole.getNext() == RC_SUCCESS);

                }

            }
			};
		});

function getClass() {
	return RequestUpgradeManager;
}

function getInstance() {
	return new RequestUpgradeManager("request","Request","profile.request");
}