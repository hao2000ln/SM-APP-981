var log = getLog("IncidentDAO");
//log.setLevel("debug");
var Class = lib.Prototype.getClass();
var dao = {};

var ResourceInUseException = lib.BasicDAO.ResourceInUseException;
var RecordModifiedException = lib.BasicDAO.RecordModifiedException;
var ValidationFailedException = lib.BasicDAO.ValidationFailedException;
var AuthorizationException = lib.BasicDAO.AuthorizationException;


dao.IncidentDAO = Class.create(lib.BasicDAO.getClass(), {

    initialize: function($super) {
        $super("probsummary");
        this.setKeyField("number");
        this.updateCondition = "this.scFile['problem.status'] == 'Closed'";
    },

    identifierInfo: function() {
        return "number=" + this.scFile["number"];
    },

    getKeyFields: function() {
        return ["number", "id"];
    },

    print: function() {
        if (log.isDebugEnabled()) {
            log.debug(this.identifierInfo());
        }
    },

    findExistedIncident: function(eventid) { //change for QCCR1E110172
        var incidentList = new SCFile("probsummary", SCFILE_READONLY);
        var selectFields = ["id", "number"];
        incidentList.setFields(selectFields);

        try {
            var rc = incidentList.doSelect(new QueryCond("id", EQ, eventid));
            if (rc == RC_SUCCESS) {
                return incidentList;
            }
        } catch (ex) {
            return null;
        }
        return null;
    },

    /**
     * @Override
     * create incident
     */
    save: function($super, obj) {
        if (obj.category != "incident") {
            throw new lib.BasicDAO.ValidationFailedException(this.tableName, "The BDM incident_type (Category field of probsummary) has to be \"incident\" while creating a new incident in SM.");
        }

        var externalProcessRefArray = obj["external.process.reference"];
        if (externalProcessRefArray && externalProcessRefArray[0] &&
            lib.SMOMi.isRefBelongsToOMi(externalProcessRefArray[0])) {

            var eventid = lib.SMOMi.getOmiEventID(externalProcessRefArray[0]); //change for QCCR1E110172
            var existedIncidents = this.findExistedIncident(eventid);
            if (existedIncidents) {
                if (existedIncidents instanceof Array) {
                    existedIncidents = existedIncidents[0];
                }
                this.setFieldValue('id', existedIncidents.id);
                this.setFieldValue('number', existedIncidents.number);
                obj.id = existedIncidents.id;
                obj.number = existedIncidents.number;
                return true;
            }
            //change for QCCR1E110172
            if (eventid) {
                obj.id = eventid;
            }
        }

        // update action
        vars.$G_bg_activity_text = null;
        vars.$G_bg_activity_type = null;

        vars.$pmc_actions = ["Created by BDM"];
        if (obj.update_action && obj.update_action.length > 0) {
            vars.$pmc_actions = ["Created by BDM"].concat(obj.update_action);
            obj.update_action = null;
        }

        if (obj.id == null) {
            obj.id = lib.UUID.generateUUID();
        }

        var result = $super(obj);

        // cleanup activity update
        vars.$pmc_actions = [];

        return result;
    },


    /**
     * @Override
     * update incident
     */
    _update: function($super, objUpdate, appendFields) {
        if (log.isDebugEnabled()) {
            log.debug("to update " + (objUpdate ? JSON.stringify(objUpdate) : "<null>"));
        }

        vars.$pmc_actions = ["Updated by BDM"];

        // append update activities
        var activities = objUpdate["update.action"];
        if (activities && activities.length > 0) {
            if (log.isDebugEnabled()) {
                log.debug("append activity log: " + activities);
            }
            vars.$pmc_actions = ["Updated by BDM"].concat(activities);
            delete objUpdate["update.action"];
        }

        var result = $super(objUpdate, appendFields);

        // cleanup activity update
        vars.$pmc_actions = [];

        return result;
    },

    /**
     * @Override
     */
    findAndUpdate: function($super, objFind, objUpdate, appendFields) {
        var find = this.search(objFind);
        if (this.isUpdatable()) {
            return;
        }

        var isClosed = this.getFieldValue("problem.status") == "Closed";
        if ((!isClosed) && objUpdate["problem.status"] == "Closed") {
            if (log.isDebugEnabled()) {
                log.debug("findAndUpdate() to close incident");
            }
            return this.doClose(objUpdate);
        } else {
            return $super(objFind, objUpdate, appendFields);
        }
    },

    doClose: function(objUpdate, action, appendFields) {
        // activity update
        var activities;

        var f;
        for (f in objUpdate) {
            if (log.isDebugEnabled()) {
                log.debug("store field:" + f + " " + this.scFile[f] + " value = " + JSON.stringify(objUpdate[f]) + " type=" + typeof(objUpdate[f]));
            }
            if (this.scFile[f] != null && this.scFile[f].getType && this.scFile[f].getType() == "ARRAY") {
                if (!objUpdate[f] instanceof Array) {
                    this.scFile[f].appendFieldValue([objUpdate[f]]);
                } else if (appendFields != null && f in appendFields) {
                    this.appendFieldValue(f, objUpdate[f]);
                }
                // special handle activity update
                else if (f == "update.action") {
                    activities = objUpdate[f];
                    if (log.isDebugEnabled()) {
                        log.debug("append close activity log: " + activities);
                    }
                } else {
                    this.setFieldValue(f, objUpdate[f]);
                }
            } else {
                this.setFieldValue(f, objUpdate[f]);
            }
        }

        if (objUpdate.resolution == null) {
            this.appendFieldValue("resolution", ["BDM client request"]);
        }
        if (objUpdate["resolution.code"] == null) {
            this.setFieldValue("resolution.code", 'Out of Scope');
        }

        var activityTextBak = vars.$G_bg_activity_text;
        var activityTypeBak = vars.$G_bg_activity_type;
        vars.$G_bg_activity_text = null;
        vars.$G_bg_activity_type = "external";

        if (activities && activities.length > 0) {
            vars.$pmc_actions = ["Closed by BDM"].concat(activities);
        } else {
            vars.$pmc_actions = ["Closed by BDM"];
        }

        // bypass validation
        var bypassBak = vars.$bypass_failed_validation;
        vars.$bypass_failed_validation = true;

        // close incident through backend transition
        var rc = this.scFile.doAction("_wfE:event.close");

        vars.$bypass_failed_validation = bypassBak;

        vars.$G_bg_activity_text = activityTextBak;
        vars.$G_bg_activity_type = activityTypeBak;

        // clear activity update
        vars.$pmc_actions = [];

        if (rc == RC_SUCCESS) {
            return true;
        } else {
            var msg = this.getActionMessage();
            if (msg) {
                log.error(msg);
            }

            if (rc == RC_VALIDATION_FAILED) {
                throw new ValidationFailedException(this.tableName, "failed to close incident " + this.scFile[this.getKeyField()]);
            } else if (rc == RC_NOT_AUTHORIZED) {
                throw new AuthorizationException(this.tableName, "close");
            } else if (rc == RC_MODIFIED) {
                msg = RCtoString(rc);
                log.info(msg);
                throw new RecordModifiedException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
            } else if (rc == RC_CANT_HAVE) {
                msg = RCtoString(rc);
                log.info(msg);
                throw new ResourceInUseException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
            }
            throw new Error("DAO error code=" + RCtoString(rc));
        }
    }
});

function getClass() {
    return dao.IncidentDAO;
}