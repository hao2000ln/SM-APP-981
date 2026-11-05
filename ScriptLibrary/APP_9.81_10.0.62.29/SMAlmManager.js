var log = getLog('smis.task.alm.SMAlmManager');

var Class = lib.smis_Prototype.getClass();
var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

var REQUIRED = ['alm.name', 'alm.domain', 'alm.project', 'alm.baseUrl', 'alm.clientId', 'alm.clientSecret'];
var REQUIRED_LABEL = ['name', 'domain', 'project', 'baseUrl', 'clientId', 'clientSecret'];

var SMAlmManagerClass = Class.create(lib.smis_Manager.getClass(), {
    isScheduleBased: function() {
        return true;
    },
    validateParams: function() {
        var name = this.configItem.getConfigParameterValue('alm.name');
        if (name) {
            if (name != name.trim()) {
                this.configItem.setConfigParameterValue('alm.name', name.trim())
            }

            if (!this.isAliasValid(this.configItem.intId, name)) {
                funcs.cursor_field_name_set('$param.alm.name');
                var msg = funcs.scmsg('param.name.duplicated', 'alm', [name]);
                return msg;
            }
        }

        var value = null;
        var k = 0;

        // validate required
        for (k = 0; k < REQUIRED.length; k++) {
            value = this.configItem.getConfigParameterValue(REQUIRED[k]);
            if (isNull(value)) {
                var name = REQUIRED_LABEL[k];
                var label = funcs.scmsg('param.' + REQUIRED_LABEL[k], 'alm');
                funcs.cursor_field_name_set('$param.alm.' + name);
                return lib.smis_CommonLib.msg("58", [label]);
            }
        }

        var isChangeToDefect = this.configItem.getConfigParameterValue("alm.changeToDefectEnabled");
        var isChangeToFeature = this.configItem.getConfigParameterValue("alm.changeToFeatureEnabled");
        var isProblemToDefect = this.configItem.getConfigParameterValue("alm.problemToDefectEnabled");

        if (isChangeToDefect || isProblemToDefect) {
            var smId = this.configItem.getConfigParameterValue('alm.defect.field.smId');
            var smTable = this.configItem.getConfigParameterValue('alm.defect.field.smTable');

            if (!smId) {
                var label = funcs.scmsg('param.defect.smId', 'alm');
                funcs.cursor_field_name_set('$param.alm.defect.field.smId');
                return lib.smis_CommonLib.msg("58", [label]);
            }

            if (!smTable) {
                var label = funcs.scmsg('param.defect.smTable', 'alm');
                funcs.cursor_field_name_set('$param.alm.defect.field.smTable');
                return lib.smis_CommonLib.msg("58", [label]);
            }
        }

        if (isChangeToFeature) {
            var smId = this.configItem.getConfigParameterValue('alm.feature.field.smId');
            var smTable = this.configItem.getConfigParameterValue('alm.feature.field.smTable');

            if (!smId) {
                var label = funcs.scmsg('param.requirement.smId', 'alm');
                funcs.cursor_field_name_set('$param.alm.feature.field.smId');
                return lib.smis_CommonLib.msg("58", [label]);
            }

            if (!smTable) {
                var label = funcs.scmsg('param.requirement.smTable', 'alm');
                funcs.cursor_field_name_set('$param.alm.feature.field.smTable');
                return lib.smis_CommonLib.msg("58", [label]);
            }
        }

        // validate module select, at least 1 module selected.
        var moduleList = this.EPAdapter.getModuleList();
        if (moduleList.valueList.length < 1) {
            // return "Please select the moduels to enable.";
            return funcs.scmsg('module-required', 'octane');
        }
    },

    isAliasValid: function(intId, name) {
        var config = lib.c.$('!SMISConfiguration').fields('paramInfo', 'name', 'intId').find('template="SMALM" and intId~=:id', intId);

        var found = false;
        config.each(function(item) {
            var alias = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue(item, 'alm.name');
            if (alias == name) {
                found = true;
                return true;
            }
        });

        return !found;
    },

    appendTasks: function() {},
    processTask: function(task) {
        log.debug('processTask');
    },

    beforeEnableInstance: function() {
        var intId = this.configItem.intId;
        
        // check alias
        var name = this.configItem.getConfigParameterValue('alm.name');
        if (!this.isAliasValid(this.configItem.intId, name)) {
            var msg = funcs.scmsg('param.name.duplicated', 'alm', [name]);
            funcs.msg(msg, 2);
            return false;
        }
        
        // get modules
        var modules = this.EPAdapter.getModuleList();
        var j = rteJSONStringify;

        var moduleList = lib.ArrayUtil.map(modules.valueList, function(name, k) {
            return ({
                name: name,
                label: modules.displayList[k]
            });
        });

        // check field mapping
        var fm = lib.c.$("!SMISFieldMapping", true).find("intId=:id", intId).one();
        if (null == fm) {
            return false;
        }

        var size = fm.fieldMapping.length();
        var fieldCount = {};
        for (var k = 0; k < size; k++) {
            var name = fm.fieldMapping[k].SMField;
            var direction = fm.fieldMapping[k].direction;
            var _module = fm.fieldMapping[k].SMModule;
            if (!_module) continue;

            if (fieldCount[_module]) {
                fieldCount[_module] = fieldCount[_module] + 1;
            } else {
                fieldCount[_module] = 1;
            }
        }

        for (var k = 0; k < moduleList.length; k++) {
            var item = moduleList[k];

            if (!fieldCount[item.name] || fieldCount[item.name] < 1) {
                //'At least one field mapping is required for module \'' + item.label + '\' in SMIS Field Mapping.';
                var msg = funcs.scmsg('field-mapping-required', 'alm', [item.label]);
                funcs.msg(msg, 2);
                return false;
            }
        }

        return true;
    },

    enableInstance: function() {
        lib.OctaneChange.checkEnable(lib.OctaneChange.makeAlmContext());
    }
});

function getClass() {
    return SMAlmManagerClass;
}

function isNull(value) {
    if (value === false) return false;
    if (value == null) return true;
    if (value == undefined) return true;
    if (value && value.length == 0) return true;

    return false;
}