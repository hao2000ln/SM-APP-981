
function DIRECTION() {}
DIRECTION.EP1TOEP2 = 'R'; // '>'
DIRECTION.EP2TOEP1 = 'L'; // '<'
DIRECTION.BOTH = DIRECTION.EP2TOEP1 + DIRECTION.EP1TOEP2; // <->

function FIELDNAME() {}
FIELDNAME.ep1ObjectField = "ep1ObjectField";
FIELDNAME.ep1ObjectQField = "ep1ObjectQField";
FIELDNAME.ep1ObjectFieldType = "ep1ObjectFieldType";
FIELDNAME.ep1Callback = "ep1Callback";
FIELDNAME.ep1DefaultValue = "ep1DefaultValue";
FIELDNAME.ep2ObjectField = "ep2ObjectField";
FIELDNAME.ep2ObjectQField = "ep2ObjectQField";
FIELDNAME.ep2ObjectFieldType = "ep2ObjectFieldType";
FIELDNAME.ep2Callback = "ep2Callback";
FIELDNAME.ep2DefaultValue = "ep2DefaultValue";
FIELDNAME.direction = "direction";
FIELDNAME.description = "description";
FIELDNAME.valueMappingGroup = "valueMappingGroup";

function SMBDMFIELDNAME() {}
SMBDMFIELDNAME.smObjectField = FIELDNAME.ep1ObjectField;
SMBDMFIELDNAME.smObjectFieldType = FIELDNAME.ep1ObjectFieldType;
SMBDMFIELDNAME.smCallback = FIELDNAME.ep1Callback;
SMBDMFIELDNAME.smDefaultValue = FIELDNAME.ep1DefaultValue;
SMBDMFIELDNAME.bdmObjectField = FIELDNAME.ep2ObjectField;
SMBDMFIELDNAME.bdmObjectQField = FIELDNAME.ep2ObjectQField;
SMBDMFIELDNAME.bdmObjectFieldType = FIELDNAME.ep2ObjectFieldType;
SMBDMFIELDNAME.bdmCallback = FIELDNAME.ep2Callback;
SMBDMFIELDNAME.bdmDefaultValue = FIELDNAME.ep2DefaultValue;
SMBDMFIELDNAME.direction = FIELDNAME.direction;
SMBDMFIELDNAME.description = FIELDNAME.description;
SMBDMFIELDNAME.valueMappingGroup = FIELDNAME.valueMappingGroup;

SMBDMFIELDNAME.atomObjectField = FIELDNAME.ep2ObjectField;
SMBDMFIELDNAME.atomObjectFieldType = FIELDNAME.ep2ObjectFieldType;
SMBDMFIELDNAME.abdmObjectField = FIELDNAME.ep1ObjectField;

function VALUEFIELDNAME() {}
VALUEFIELDNAME.groupField = "groupField";
VALUEFIELDNAME.ep1ValueField = "ep1ValueField";
VALUEFIELDNAME.ep1ValueFieldType = "ep1ValueFieldType";
VALUEFIELDNAME.ep2ValueField = "ep2ValueField";
VALUEFIELDNAME.ep2ValueFieldType = "ep2ValueFieldType";

function SMBDMVALUEFIELDNAME() {}
SMBDMVALUEFIELDNAME.groupField = VALUEFIELDNAME.groupField;
SMBDMVALUEFIELDNAME.smValueField = VALUEFIELDNAME.ep1ValueField;
SMBDMVALUEFIELDNAME.bdmValueField = VALUEFIELDNAME.ep2ValueField

function CALLBACK() {}
CALLBACK.EP1TOEP2 = '_ep1_to_ep2_';
CALLBACK.EP2TOEP1 = '_ep2_to_ep1_';

function CALLBACKFACTORY() {}
CALLBACKFACTORY.SMBDM = '_SMBDM_';


function SMTYPES() {}
SMTYPES.Number = 1;
SMTYPES.Character = 2;
SMTYPES.Datetime = 3;
SMTYPES.Logical = 4;
SMTYPES.Array = 8;
SMTYPES.Structure = 9;

function BDMTYPES() {}
BDMTYPES.String = 1;
BDMTYPES.Number = 2;
BDMTYPES.Datetime = 3;


