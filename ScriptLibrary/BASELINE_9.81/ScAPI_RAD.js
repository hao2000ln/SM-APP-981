//
// -- cache for improving performance
//
var createSCDatumArray = lib.ScAPI_Util.createSCDatumArray;
var isArray = lib.ScAPI_Util.isArray;

//TODO: Update js.runRad RAD application.
//var runRAD = lib.RAD.run;


//
// -- logger ------------------------
//
var log = new lib.ScAPI_Logger.log( 'ScAPI_RAD' );
// @override
log.isDebug = function( name ) {
    return 'svcCat_add_item_to_cart' == name;
};

//
// -- SM types ----------------------
//
SMType_Number = lib.ScAPI_Util.SMType.Number;

SMType_Character = lib.ScAPI_Util.SMType.Character;
SMType_Datetime = lib.ScAPI_Util.SMType.Datetime;
SMType_Logical = lib.ScAPI_Util.SMType.Logical;
SMType_File = lib.ScAPI_Util.SMType.File;
SMType_Array = lib.ScAPI_Util.SMType.Array;
SMType_Structure = lib.ScAPI_Util.SMType.Structure;

// select
function _select( fileName, query, fields, orderByFields, orderBySeq ) {
    if (fields != undefined) return _select_fields(fileName, query, fields, orderByFields, orderBySeq);
    var file = new SCFile( fileName );
    var rc = "";
    try {
        if (orderByFields != undefined && orderBySeq != undefined) file.setOrderBy(orderByFields, orderBySeq);
        rc = file.doSelect( query );
        if( rc == RC_SUCCESS ) {
            return file;
        }
    }catch( ex ) {
        log.error( "exception: " + ex );
    }
    return null;
}

// select only list fields
function _select_fields( fileName, query, fields, orderByFields, orderBySeq ) {
    var file = new SCFile( fileName, SCFILE_READONLY);
    var rc = "";
    try {
        file.setFields(fields);
        if (orderByFields != undefined && orderBySeq != undefined) file.setOrderBy(orderByFields, orderBySeq);
        rc = file.doSelect( query );
        if( rc == RC_SUCCESS ) {
            return file;
        }
    }catch( ex ) {
        log.error( "exception: " + ex );
    }
    return null;
}

// RAD: count
function _count( fileName, query ) {
    var file = new SCFile( fileName );
    var count = -1;
    
    if ( typeof file.doCount == 'function' )
    {
       count = file.doCount( query );
    }
    else
    {
       var retCode = new SCDatum();
       var dcount = new SCDatum();
       var cc = system.functions.rtecall("count", retCode, file, query, dcount);

       if (cc) count = parseInt(dcount.getText());
    }
    
    return count;
}

// str
function _str( strArr ) {
    return system.functions.str( strArr );
}

// delete
function _delete( arr, s, m ) {
    return system.functions._delete( arr, s, m ? m : 1 );
}

// index
function _index( value, arr ) {
    var idx = -1;
    var r = isArray( arr );
    if( value != null && r[1] > 0 ) {
        idx = system.functions.index( value, arr ) - 1 ;
    }
    return idx;
}

// RAD: setsort
function _setsort( file, sortFields, bAsc ) {
    system.functions.setsort( file, sortFields, ( bAsc || false ) ? 0 : 1 );
}

// RAD: scmsg
function _scmsg( number, name, textArr ) {
    return system.functions.scmsg( number, name, ( textArr ? textArr : createSCDatumArray() ) );
}

function _tod() {
    return system.functions.tod();
}

function _sysinfo( name ) {
    return system.functions.sysinfo_get( name );
}

function _queryBuilder(str, args)
{
    var result = str;
    if (args.length != undefined)
    {
	    var len = typeof(args.length) == "function" ? args.length() : args.length;
	    for (var i = 0; i < len; i++)
	    {
	        var arg = __escapeString(String(args[i]));
	        result = result.replace("%s", arg);
	    }
    }
    
    return result;
}

// get current thread ID
function currentThreadId() {
    return _sysinfo( 'ThreadID' );
}

// get current client PID
function currentClientPID() {
    return _sysinfo( 'ClientPID' );
}

// RAD: se.get.record
function se_get_record( name, uniqueField, fileName, bBG, objectRecord, list ) {

    var params = [
        input_String( 'name', name ),// $INTO.NAME
        output_File( 'file' ),// $RECORD
        input_String( 'empty', null ),// $none
        input_Logical( 'boolean1', bBG || false ),// $INTO.BG
        input_String( 'text', uniqueField ),// $INTO.FIELD
        input_String( 'string1', fileName ),// $INTO.FILENAME
        input_File( 'second.record', objectRecord || null ),// $INTO.OBJECT
        input_File( 'second.file', list || null )// $INTO.LIST
    ];

    return invokeRAD( 'se.get.record', params ).file;

}

// RAD: us.link
function us_link( file, fieldName, linkRecord, action ,bg) {
  	var params = [
	    input_File( 'record', file ),            // INTO.FILE
	    input_String( 'name', fieldName ),        // INTO.FIELD
	    input_File( 'second.record', linkRecord ),        // INTO.LINK
		input_String( 'prompt', action ),      // INTO.ACTION
	    input_Logical( 'boolean1', bg )      // INTO.BG
	    
    ];
    
    var results = invokeRAD( 'us.link', params );
    
    return results.record;
}

// RAD: us.notify
function us_notify( notifyName, currFile, extraArgs, savedCopyFile, argNames) {
  	var params = [
  	    input_String( 'name', notifyName),    // $INTO.NAME
	    input_File( 'record', currFile ),            // INTO.FILE
	    input_Array( 'names', extraArgs ),        // $INTO.ARGS
	    input_File( 'second.file', savedCopyFile ),        // $INTO.OLD
		input_Array( 'types', argNames )      // $INTO.ARG.NAMES	    
    ];
    
    var results = invokeRAD( 'us.notify', params );
    
    return true;
}


// RAD: us.array.char.clean
function us_array_char_clean( arrValues ) {
    var params = [
        inout_Array( 'names', arrValues )   // INTO.ARRAY
    ];
    return invokeRAD( 'us.array.char.clean', params ).names;
}

// RAD: fix.bundle.opts.currency
function fix_bundle_opts_currency( form, oldCurrency, newCurrency, bCheck, costs ) {

    var params = [
        inout_String( 'string1', form ),            // INTO.FORM
        input_String( 'name', oldCurrency ),        // INTO.OLD.CURRENCY
        input_String( 'text', newCurrency ),        // INTO.NEW.CURRENCY
        input_Logical( 'cond.input', bCheck ),      // INTO.CHECK
        inout_String( 'query', costs )              // INTO.COSTS
    ];

    var results = invokeRAD( 'fix.bundle.opts.currency', params );
    return {
        getForm : function() { return results.string1; },
        getCosts : function() { return results.query; }
    };

}

// RAD: svcCat.setup.del.obj.list
function svcCat_setup_del_obj_list( item, agreementID ) {
    var params = [
        input_File( 'file', item ),                 // INTO.ITEM
        output_Array( 'names' ),                    // DEL.OPT.NAMES
        input_String( 'string1', agreementID )      // INTO.AGREEMENT.ID
    ];
    return invokeRAD( 'svcCat.setup.del.obj.list', params ).names;
}

// RAD: svcCat.setup.service.sla.list
function svcCat_setup_service_sla_list( item, agreementID ) {
    var params = [
        input_File( 'file', item ),                 // INTO.ITEM
        output_Array( 'numbers' ),                  // SERVICE.SLA.IDS
        output_Array( 'names' ),                    // SERVICE.SLA.TITLES
        input_String( 'string1', agreementID )      // INTO.AGREEMENT.ID
    ];
    var results = invokeRAD( 'svcCat.setup.service.sla.list', params );
    return {
        getServiceSLAIDs : function() { return results.numbers; },
        getServiceSLATitles : function() { return results.names; }
    };
}

// RAD: sc.get.sla
function sc_get_sla( file ) {

    var params = [
        input_File( 'file', file ),         // INTO.FILE
        output_Number( 'index' ),           // OUT.ID
        output_Number( 'number1' ),         // OUT.SERVICECONTRACT
        output_Array( 'numbers' )           // OUT.IDS
    ];

    var results = invokeRAD( 'sc.get.sla', params );

    return { 
        getAgreementID : function() { return results.index; },
        getServiceContract : function() { return results.number1; },
        getAgreementIDs : function() { return results.numbers; }
    };
}

// RAD: money.format
function money_format( amount, currency ) {
    var params = [
        input_Number( 'number1', amount ),      // Amount
        input_String( 'text', currency ),       // Currency
        output_String( 'string1' )              // Return
    ];
    return invokeRAD( 'money.format', params ).string1;
}

// RAD: us.convert.currency
function us_convert_currency( sourceCode, targetCode, sourceQuantity, date ) {
    var params = [
        input_String( 'query', sourceCode ),        // Source code, INTO.SOURCE
        input_String( 'string1', targetCode ),      // Target code, INTO.TARGET
        input_Datetime( 'time1', date ),            // Transaction date, INTO.DATE
        input_Number( 'index', sourceQuantity ),    // Source quantity, INTO.AMOUNT
        output_Number( 'number1' ),                 // Target quantity, RETURN
        output_String( 'text' )                     // Return code, RC
    ];
    var results = invokeRAD( 'us.convert.currency', params );
    return {
        getTargetQuantity : function() { return results.number1; },
        getReturnCode : function() { return results.text; }
    };
}

// RAD: svcCat.get.items
function svcCat_get_items( file, interaction, requestFor, showCount, bFirst, bAllowOneClick ) {

    var params = [
        input_File( 'file', file ),                          // INTO.ITEM
        input_File( 'record', interaction ),                 // INTO.FILE
        input_String('string1',requestFor),					 //OPERATOR.NAME
        input_Number( 'number1', showCount ),                // INTO.NUMBER
        input_Logical( 'cond.input', bAllowOneClick ),       // INTO.ALLOW.ONE.CLICK
        inout_Logical( 'boolean1', bFirst ),         // INTO.FIRST
        output_Array( 'names' ),         // ITEMS
        output_Array( 'values' ),        // IMAGES
        output_Array( 'types' ),         // DESC
        output_Number( 'index' ),        // TOTAL
        output_Array( 'statements' ),    // ONE.CLICK.ITEM
        output_String( 'text' ),         // FIRST.ID
        output_Array( 'description' ),   // ITEMS.DISPLAY
        output_Array( 'sort' ),          // COST
        output_Array('levels')			  //Types
    ];
    var results = invokeRAD( 'svcCat.get.items', params );
    var obj = {
        getItems : function() { return results.names; },
        getImages : function() { return results.values; },
        getDesc : function() { return results.types; },
        getTotal : function() { return results.index; },
        getOneClickItem : function() { return results.statements; },
        getFirstId : function() { return results.text; },
        getItemsDisplay : function() { return results.description; },
        getCosts : function() { return results.sort; },
        isFirst : function() { return results.boolean1; },
        getTypes : function() {return results.levels}
    }
    return obj;
}


// RAD: Filter items
function svcCat_get_items_for_wsapi( item, interaction,requestedFor) {

    var params = [
        input_File( 'file', interaction ),                          // INTO.FILE
        input_File( 'record',  item),			                 // INTO.ITEM
        input_String( 'string1',  requestedFor),	                         //INTO.REQUESTEDFOR
        output_Logical('boolean1')	  //return
    ];
    return invokeRAD( 'svcCat.wsapi.check.item.allowed', params ).boolean1;
    
   
}

// RAD: svcCat.add.item.to.cart
function svcCat_add_item_to_cart( cart, item, cartItem, requestedFor, quantity,
                                    bSuppress, bByPass, splitItems,orderInfo ) {

   
    if (item.type == "bundle") {
    	
    	if ( log.isDebug( 'svcCat_add_item_to_cart' ) ) {
	        log.debug("Start ...");
	        log.debug( "-- Bundle Item -----------------------------------------" );
	        log.debug( cartItem );
	        log.debug( "-----------------------------------------------------" );
    	}
    	lib.ScAPI_AddBundleToCart.addBundleToCart(cart,item,cartItem,requestedFor,quantity,bSuppress,
    						bByPass,splitItems,orderInfo);
    						
    	if ( log.isDebug( 'svcCat_add_item_to_cart' ) ) {
	        log.debug("Over... ");
	        log.debug( "-- Bundle Item -----------------------------------------" );
	        log.debug( cartItem );
	        log.debug( "-----------------------------------------------------" );
    	}
    	
    } else {
    
    	if ( log.isDebug( 'svcCat_add_item_to_cart' ) ) {
	        log.debug("svcCat_add_item_to_cart ...");
	        log.debug( "-- Simple Item -----------------------------------------" );
	        log.debug( cartItem );
	        log.debug( "-----------------------------------------------------" );
    	}
    	
    	var params = [
	        input_File( 'file', cart ),                 // INTO.CART
	        input_File( 'record', item ),               // INTO.ITEM
	        input_String( 'name', requestedFor ),       // INTO.FOR
	        input_Logical( 'boolean1', bSuppress ),          // INTO.SUPPRESS
	        output_String( 'text' ),                    // EXIT
	        input_Number( 'number1', quantity ),        // INTO.QUANTITY
	        input_Logical( 'cond.input', bByPass ),        // INTO.BYPASS
	        input_Array( 'booleans', splitItems ),      // SPLIT.ITEMS
	        input_File( 'second.file', cartItem )       // INTO.CARTITEM
	    ];
	    var rt = invokeRAD( 'svcCat.add.item.to.cart', params ).text;
	    if( log.isDebug( 'svcCat_add_item_to_cart' ) ) {
	        log.debug("--- exit = " + rt );
	        log.debug("--- saved cartItem = " + cartItem );
	    }
	    return rt;
    }
    
    
}


// RAD: svcCat.checkout.total
function svcCat_checkout_total( sql, total) {

  
    
	if ( log.isDebug( 'svcCat_checkout_total' ) ) {
        log.debug("svcCat_checkout_total ...");
        log.debug( "-- Simple Item -----------------------------------------" );
        log.debug( cartItem );
        log.debug( "-----------------------------------------------------" );
	}
	
	var params = [
        input_String( 'query', sql ),                 // INTO.CART
        input_Number( 'number1', total ),               // INTO.ITEM
        output_Number( 'index' )       // INTO.FOR
    ];
    var rt = invokeRAD( 'svcCat.checkout.total', params ).index;
    if( log.isDebug( 'svcCat_checkout_total' ) ) {
        log.debug("--- exit = " + rt );
        log.debug("--- saved cartItem" );
    }
    return rt;
   
    
    
}


// RAD: cc.set.approval
function cc_set_approval( file, object, mode) {

  
    
	if ( log.isDebug( 'cc_set_approval' ) ) {
        log.debug("cc_set_approval ...begin");
	}
	
	var params = [
        input_File( 'file', file ),                 // INTO.CART
        input_File( 'record', object ),               // INTO.ITEM
        input_String( 'index', mode )       // INTO.FOR
    ];
    invokeRAD( 'cc.set.approval', params );
    if( log.isDebug( 'cc_set_approval' ) ) {
        log.debug("--- exit = ");
    }
   
    
    
}

function svcCat_create_request( cart, incident) {
    var params = [
        input_File( 'record', cart ),                 //INTO.CART
        input_File('target.file', incident),		   //INTO.INCIDENT
        output_String('text')
    ];
    var results = invokeRAD('svcCat.create.request',params);
    
    return results.text;
}


function svcCat_get_catalog_structure(contactName, operator, opertype,categoryname) {

	var params = [
	    input_String( 'name', contactName ),            // $INTO.CONTACT.NAME
	    input_File('file', operator),
	    input_File('prompt', categoryname),
	    input_File('string1', opertype),
	    output_String( 'text' )        // $OUT.XML
	    
    ];
    var results = invokeRAD('svcCat.get.catalog.structure',params);
    
    return results.text;
}

// RAD: svcCat.check.catalog
function svcCat_check_catalog( contactName, operator) {
    var params = [
	    input_String( 'name', contactName ),            // $INTO.CONTACT.NAME
	    input_File('file', operator),					//$INTO.OPERATOR
	    output_Logical( 'boolean1' ),                 // HAS Support catalog
        output_Logical( 'cond.input' )                     // HAS Service catalog
	    
    ];
    var results = invokeRAD( 'svcCat.check.catalog', params );
    return {
        hasSupport : function() { return results.boolean1; },
        hasService : function() { return results['cond.input']; }
    };
}

function svcCat_filter_catalog(inIDStr, contactName)
{
    var params = [
        inout_String('text', contactName),
        input_String('string1', inIDStr),
        output_String('prompt')
    ];
    
    var results = invokeRAD('svcCat.filter.catalog',params);
    
    return results;
}

function catalog_sync_fr_ver(lstVer, thisVer)
{
    var params = [
        input_Number('index', lstVer),
        input_Number('number1', thisVer),
        output_Array('numbers'),
        output_Array('prompt'),
        output_Array('types'),
        output_Array('names'),
        output_Array('sort')
    ];
    
    var results = invokeRAD('catalog.sync.fr.ver',params);
    
    return results;
}

function build_list(suppressMsg, query, sortFields, fileName, valueList, valueField, displayList, displayField, maxRecord, duplicate, sortList)
{
    var params = [
        input_Array('booleans', suppressMsg),
        input_String('query', query),
        input_Array('sort', sortFields),
        input_String('name', fileName),
        inout_Array('names', valueList),
        input_String('string1', valueField),
        inout_Array('values', displayList),
        input_String('text', displayField),
        input_Number('number1', maxRecord),
        input_Logical('boolean1', duplicate ), 
        input_Logical('cond.input', sortList )
    ];
    
    var results = invokeRAD('build.list',params);
    
    return results;
}

// RAD: Subscriptions.select.subscriptions
function select_subscriptions(file)
{
    var params = [
        input_File('file', file),
        output_Array('names')
    ];
    
    var results = invokeRAD('Subscriptions.select.subscriptions',params);
    
    return results.names;
}

// RAD: se.call.process
function se_call_process(file, processName, bg, multRecord, env, tranList, fileSave, objects, names, values)
{
    var params = [
        input_File('file', file),
        input_String('name', processName),
        input_Logical('boolean1', bg),
        input_Logical('cond.input', multRecord),
        input_File('record', env),
        output_Logical('text'), // Run standard after completion
        input_File('second.file', tranList),
        input_File('second.record', fileSave),
        input_Array('file.variables', objects),
        inout_Array('names', names),
        inout_Array('values', values)
    ];
    
    var results = invokeRAD('se.call.process',params);
    
    return results;
}

// RAD: approval.delegation.get.groups
function approval_delegation_get_groups(module)
{
	if (module=="Change" && vars.$G_myGroups && vars.$G_myGroups.approver_of) { //With PD available
		vars['$module.approval.groups'] = vars.$G_myGroups.approver_of;
	} else { //Non-PD
		vars['$module.approval.groups'] = new Array();
    
    	var params = [
        	input_String('name', module)
    	];
    
    	var results = invokeRAD('approval.delegation.get.groups',params);
	}
	return vars['$module.approval.groups'];
}


function svcCat_get_catalog_favorite(operator, count) {

	var params = [
	    input_File('name', operator),
	    input_Number('number1', count),
	    output_Array('names')
	    
    ];
    var results = invokeRAD('svcCat.get.catalog.favorite',params);
    
    return results.names;
}


function findDefaultQBEFormat(table) {
	var params = [
	    input_String('name', null),
	    input_String('prompt', table),
	    input_Logical('boolean1', false),
	    output_File('file')
    ];
    var qbe_format = invokeRAD('us.set.multiselect',params);
    return qbe_format;
}

/**
 *@params = [
        //input_xxx() | inout_xxx() | output_xxx()
    ]
*/
function invokeRAD( radName, params ) {

    if( log.isDebug( 'invokeRAD' ) ) log.debug( "invokeRAD: " + radName );
    
    var rteNames = [];
    var rteValues = [];
    var parmTypes = [];
    var resultNames = [];
    var resultTypes = [];
    for( var i=0; i<params.length; i++ ) {
        rteNames.push( params[i].getParamName() );
        rteValues.push( params[i].getParamValue() );
        parmTypes.push( params[i].getParamType() );
        if( log.isDebug( 'invokeRAD' ) ) {
            log.debug( "paramName: " + params[i].getParamName()
                        + ", paramValue: " + params[i].getParamValue()
                        + ", paramType: " + params[i].getParamType() );
        }
        if( params[i].isOutput() ) {
            resultNames.push( params[i].getParamName() );
            resultTypes.push( params[i].getParamType() );
        }
    }
    var resultValues = {};
    var result = runRAD( radName, rteNames, rteValues, parmTypes, resultNames );
    var __results = result.results;
    if( __results != null && __results.length() <= resultNames.length ) {
        for( var j=0; j<__results.length(); j++ ) {
            switch( resultTypes[j] ) {
            case SMType_File: case SMType_Array:
                resultValues[ resultNames[j] ] = system.functions.val( __results[j], resultTypes[j] );
                break;
            default :
                resultValues[ resultNames[j] ] = __results[j];
            }
            if( log.isDebug( 'invokeRAD' ) ) {
                log.debug( "resultName: " + resultNames[j] + ", value: " + resultValues[ resultNames[j] ] );
            }
        }
    }

    return resultValues;
}

function input_Number( name, value ) { return __param( name, value, SMType_Number, false ); }
function input_String( name, value ) { return __param( name, __escapeString( value ), SMType_Character, false ); }
function input_Datetime( name, value ) { return __param( name, value, SMType_Datetime, false ); }
function input_Logical( name, value ) { return __param( name, value, SMType_Logical, false ); }
function input_File( name, value ) { return __param( name, value, SMType_File, false ); }
function input_Array( name, value ) { return __param( name, value, SMType_Array, false ); }
function input_Structure( name, value ) { return __param( name, value, SMType_Structure, false ); }

function inout_Number( name, value ) { return __param( name, value, SMType_Number, true ); }
function inout_String( name, value ) { return __param( name, __escapeString( value ), SMType_Character, true ); }
function inout_Datetime( name, value ) { return __param( name, value, SMType_Datetime, true ); }
function inout_Logical( name, value ) { return __param( name, value, SMType_Logical, true ); }
// file object does not need to output, the updation made by the RAD will on the same input object
function inout_Array( name, value ) { return __param( name, value, SMType_Array, true ); }
function inout_Structure( name, value ) { return __param( name, value, SMType_Structure, true ); }

function output_Number( name ) { return __param( name, 0, SMType_Number, true ); }
function output_String( name ) { return __param( name, "", SMType_Character, true ); }
function output_Datetime( name ) { return __param( name, new SCDatum(), SMType_Datetime, true ); }
function output_Logical( name ) { return __param( name, false, SMType_Logical, true ); }
function output_File( name ) { return __param( name, new SCDatum(), SMType_File, true ); }
function output_Array( name ) { return __param( name, new SCDatum(), SMType_Array, true ); }
function output_Structure( name ) { return __param( name, new SCDatum(), SMType_Structure, true ); }

function __param( name, value, type, bOutput ) {

    return {
        getParamName : function() { return name; },
        getParamValue : function() { return value; },
        getParamType : function() { return type; },
        isOutput : function() { return bOutput }
    };
}

function __escapeString( str ) {
	if( str != null && str != '' ) {
		str = str.replace( /\\/g, "\\\\" ).replace( /"/g, "\\\"" );
	}
	return str;
}


//TODO: Re merge the code to call the RAD script library
/*
	The functions RADResults() and runRAD() are copies from the RAD script library. The are only here
	to accomodate the changes needed in ScAPI.js.runRad RAD application. DO NOT DO NEW FEATURE WORK
	ON THIS CODE. ANY BUG FIX FOUND FOR THESE FUNCTIONS MUST BE APPLIED TO THE RAD SCRIPT LIBRARY AS WELL.
*/

function RADResults()
{
	this.results;
	this.messages;
}

function runRAD( applicationName, parmNames, parmValues, parmTypes, resultNames )
{
	var ERROR = "####ERROR IN APPLICATION####"
	var rteReturnValue = new SCDatum();
	var rteNames = new SCDatum();
	var rteValues = new SCDatum();
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	
	rteNames.push("name");
	rteNames.push("names"); 
	rteNames.push("values");
	rteNames.push("numbers");
	rteNames.push("description")

	rteValues.push(applicationName);
	rteValues.push(parmNames);
	rteValues.push(parmValues);
	rteValues.push(parmTypes);
	rteValues.push(resultNames);
	
	var rc = system.functions.rtecall("callrad", 
								rteReturnValue, 
								"ScAPI.js.runRad", //RAD app name
								rteNames, 
								rteValues,
								false); //false to run in same thread, true to run in new thread	
			
	var radResults = new RADResults();				
	radResults.results = vars.$smtestresult;
	radResults.messages = vars.$smtestmessages
	if ( radResults.results.length() >0 && radResults.results[0] == ERROR )
	{
		throw new Error("RAD Exception");
	}
	
	return radResults;					
}
function password_change(ifskipOldPassword,userName, oldPassword,newPassword)
{
   if ( log.isDebug( 'password_change' ) ) {
        log.debug("password_change ...begin");
	}
	
	var params = [
	 input_File( 'cond.input', ifskipOldPassword ),    
        input_File( 'name', userName ),                 // NAME       
        output_String('prompt')            
        
    ];
    vars.$oldPassword = oldPassword;
    vars.$newPassword = newPassword;
    var results =invokeRAD( 'password.change', params );
    if( log.isDebug( 'password_change' ) ) {
        log.debug("--- exit = ");
    }
    
       
    return results.prompt;
}
/*
 END OF RAD SCRIPT LIBRARY COPY
*/
