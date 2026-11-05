//
// -- cache for improving performance
//
var select = lib.ScAPI_RAD._select;
var svcCat_add_item_to_cart = lib.ScAPI_RAD.svcCat_add_item_to_cart;
var sc_get_sla = lib.ScAPI_RAD.sc_get_sla;
var scmsg = lib.ScAPI_RAD._scmsg;
var fix_bundle_opts_currency = lib.ScAPI_RAD.fix_bundle_opts_currency;
var svcCat_setup_del_obj_list = lib.ScAPI_RAD.svcCat_setup_del_obj_list;
var svcCat_setup_service_sla_list = lib.ScAPI_RAD.svcCat_setup_service_sla_list;
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var money_format = lib.ScAPI_RAD.money_format;
var tod = lib.ScAPI_RAD._tod;
var us_array_char_clean = lib.ScAPI_RAD.us_array_char_clean;
var str = lib.ScAPI_RAD._str;
var _delete = lib.ScAPI_RAD._delete;
var index = lib.ScAPI_RAD._index;
var se_get_record = lib.ScAPI_RAD.se_get_record;

var createSCDatumArray = lib.ScAPI_Util.createSCDatumArray;
var setSCDatumArrayValue = lib.ScAPI_Util.setSCDatumArrayValue;
var isArray = lib.ScAPI_Util.isArray;
var trimString = lib.ScAPI_Util.trimString;
var getMessage = lib.ScAPI_Util.getMessage;
var mergeArray = lib.ScAPI_Util.mergeArray;
//
// -- logger ------------------------
//
var log = new lib.ScAPI_Logger.log( 'ScAPI_CartItem' );



//
// -----------------------------------
//
function createCartItemHandler( itemName, cartID) {
    var _handler = {
        
        cart : null,
        item : null,

        options : '',
        quantity : 0,
        restrictQuantity : false,

        agreement_id : null,
        contract_id : null,
        
        requested_for : null,
        requested_for_type : 'individual',
        requested_for_dept : null,

        createSubscription : false,
        subscribeIndividual : false,
        subscribeDept : false,
        subscribertype : '',
        subscribevalue : '',

        msg_1 : '',
        msg_2 : '',
        msg_3 : '',

        service_id_list : null,
        service_sla : null,
        service_title_list : null,
        service_readonly : false,

        old_currency : '',
        default_currecny : '',

        delivery : null,
        delivery_list : null,

        bundle_items : createSCDatumArray(),
        bundle_types : createSCDatumArray(),
        bundle_subscriptionItem : createSCDatumArray(),
        bundle_ref : createSCDatumArray(),

        s_type : '',
        s_name : '',

        svcCartItem_all_items : createSCDatumArray(),
        svcCartItem_all_types : createSCDatumArray(),
        svcCartItem_all_subscriptionItem : createSCDatumArray(),
        svcCartItem_all_rf : createSCDatumArray(),

        split_items : false,
        one_click : false,
        cost : '',
        root_cost : '',
        recurring_cost : '',

		orderInfo : null,
	
		
        addItemToCart : function( requestedFor, quantity, options,
                            delivery, serviceSLA,requestedForType,requestedForDept,oInfo,defaultCurrency) {
            var log_functionName = 'addItemToCart';
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            this.default_currecny = defaultCurrency;
            this.requested_for = requestedFor;
            if (requestedForType) {
            	this.requested_for_type = requestedForType;
            }
			if (requestedForType != 'department' && !this.requested_for)
				this.requested_for = vars.$lo_ufname;
            this.options = ( options != null && options != '' ? trimString( options ) : '<form/>' );
            this.quantity = quantity || 1;
            this.service_sla = serviceSLA;
			
			//support order, add bundle to cart
			this.orderInfo = oInfo;
			
            //set the department, if the department has value.
            if (requestedForDept) 	this.requested_for_dept = requestedForDept;
			
            var cartItemTemp = new SCFile( 'svcCartItem' );
            cartItemTemp['options'] = this.options;
            cartItemTemp['delivery'] = delivery;
            cartItemTemp['serviceSLA'] = this.service_sla;
            this._initCartItem( cartItemTemp );

            this['svcCat.display.item/post.display']( cartItemTemp );
            // display.decide
            if( this.quantity <= 0 ) {
                var msg = scmsg( 91, "svcCat" );
                if( log.isInfo( log_functionName ) ) { log.info( msg ); }
                throw msg;
            }

            if( this.service_id_list != null && this.service_id_list.length() > 0
                    && ( this.service_sla == null || '' == this.service_sla ) ) {
                var msg2 = scmsg( 136, "svcCat" );
                if( log.isInfo( log_functionName ) ) { log.info( msg2 ); }
                throw msg2;
            }
            this['svcCat.display.item/display.decide[$L.action="additem"]']( cartItemTemp );
            if( log.isDebug( log_functionName ) ) { log.debug( "-> cartItemTemp=" + cartItemTemp ); }
            return cartItemTemp;

        },

        extractOrderInformation : function() {
            var log_functionName = 'extractOrderInformation';
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }

            var cartItemTemp = new SCFile( 'svcCartItem' );
            this._initCartItem( cartItemTemp );

        },

        _init : function() {
            var log_functionName = '_init';
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var query = 'name="' + trimString( itemName ) + '"';
            var item = select( 'joinsvcDisplay', query);
            if(item == null || item.syslanguage == null){
            	query = query + ' and syslanguage like "*"';
            	item = select( 'joinsvcDisplay', query);
            }
            if( item == null ) {
                var msg2 = "Item does not exist with name: " + itemName;
                if( log.isInfo( log_functionName ) ) { log.info( msg2 ); }
                throw msg2;
            }
            this.item = item;

            if( cartID ) {
                var cart = select( 'svcCart', 'cartId=' + cartID );
                if( cart == null ) {
                    var msg = "Cart does not exist with ID: " + cartID;
                    if( log.isInfo( log_functionName ) ) { log.info( msg ); }
                    throw msg;
                }
                this.cart = cart;
            }

            this.one_click = ( true == this.item['non.cart'] );

            this['svcCat.display.item/decide.bundle']();

            this['svcCat.display.item/set.requested.for']();

            // fix.opts.currency
            var rtObj = fix_bundle_opts_currency( this.item.options, this.old_currency,
                                this.default_currecny, false,  this.item['option.costs'] );
            this.item.options = rtObj.getForm();
            this.item['option.costs'] = rtObj.getCosts();
			
			if (log.isDebug()) log.debug("init finish");
        },

        _initCartItem : function( cartItem ) {
            var log_functionName = '_initCartItem';
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }

            // set.cart.item
            cartItem['requested.by'] = ( this.cart != null && this.cart.owner != null ? this.cart.owner : vars.$lo_contact_name );

            var rt_sla = sc_get_sla( cartItem );
            this.agreement_id = rt_sla.getAgreementID();
            this.contract_id = rt_sla.getServiceContract();
            if( this.contract_id == 0 ) {
                this.contract_id = null;
            }
            // set.agreement.id
            cartItem['agreement.id'] = this.agreement_id;
            cartItem['contract.id'] = this.contract_id;

            if( log.isDebug( log_functionName ) ) {
                log.debug( "agreement.id = " + this.agreement_id );
                log.debug( "contract.id = " + this.contract_id );
            }

            this['svcCat.display.item/check.delivery']();
            this['svcCat.display.item/check.service']();
            this['svcCat.display.item/check.cost/check.recurring.cost']();

        },

        /**
         * processing logic originates from RAD: svcCat.get.bundle.opts.sub
         */
        _validateBundleOptions : function( cartItem, subbundle, subbundleOptions, costAdj, id ) {
            var log_functionName = "_validateBundleOptions";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            // start
            cartItem['bundle.options'] = cartItem['bundle.options'] || "<bundle></bundle>";
            var item_name = cartItem['item.description'];
            var bundle_options = cartItem['bundle.options'];
            var sub_bundle_options = null;
            if( id ) {
                bundle_options = lib.svcCatBundles.getSubBundle( bundle_options, "opt" + id );
                bundle_options = bundle_options || "<bundle></bundle>";
                item_name =  ( subbundle ? subbundle.name : item_name );
                sub_bundle_options = subbundleOptions;
            }

            var cost_adj = costAdj || 0;

            var old_currency = lib.svcCatalog.getCatCurrency( item_name );

            if( log.isDebug( log_functionName ) ) {
                log.debug( "svcCat.get.bundle.opts.sub/start" );
                log.debug( "bundle_options = " + bundle_options );
                log.debug( "cost_adj = " + cost_adj );
            }

            // get.catalog.record
            var bundle = se_get_record( item_name, 'name', 'joinsvcDisplay', true );

            // setup.loop
            var max = ( bundle.bundle ? bundle.bundle.length() : 0 ) + 1;

            if( log.isDebug( log_functionName ) ) {
                log.debug( "svcCat.get.bundle.opts.sub/setup.loop" );
                log.debug( "max = " + max );
            }

            // start.loop
            var typecheck_string = '';

            for( var i = 1; i < max; i++ ) {
                var form = null;
                var catalog_id = bundle.bundle[i]['item.name']; // $L.catalog.id=2 in $L.i in bundle in $L.bundle
                var optional = bundle.bundle[i]['item.option']; // $L.optional=3 in $L.i in bundle in $L.bundle

                var selected = false;
                var check_options = cartItem.options;
                if( sub_bundle_options ) {
                    check_options = sub_bundle_options;
                }

                if( 'mandatory' == optional ) {
                    selected = true;
                }else {
                    selected = lib.svcCatBundles.isSelected( check_options, "opt" + i );
                }

                if( selected ) {
                    cost_adj += ( bundle.bundle[i]['item.cost.adj'] || 0 ); // if $L.selected then $L.cost.adj+=nullsub(5 in $L.i in bundle in $L.bundle, 0)
                }

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/start.loop" );
                    log.debug( "catalog_id = " + catalog_id );
                    log.debug( "optional = " + optional );
                    log.debug( "selected = " + selected );
                    log.debug( "cost_adj = " + cost_adj );
                }

                // get.component
                var component = se_get_record( catalog_id, 'name', 'joinsvcDisplay', true );

                // get.form
                typecheck_string = null;
                form = lib.svcCatBundles.getForm( bundle_options, "opt" + i, component );

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/get.form" );
                    log.debug( "form = " + form );
                }
                
                // fix.bundle.opts.currency
                var rtObj = fix_bundle_opts_currency( form, old_currency,
                                    this.default_currecny, false,  component['option.costs'] );
                form = rtObj.getForm();
                component['option.costs'] = rtObj.getCosts();

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/fix.bundle.opts.currency" );
                    log.debug( "form = " + form );
                }

                // finish.get.form
                var display = lib.xmlHelpers.xmlStringHasChildren( form );
                typecheck_string = form;

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/finish.get.form" );
                    log.debug( "display = " + display );
                }

                /** --- created for following usage ----- */
                // check.is.bundle
                var check_is_bundle = function() {
                    if( log.isDebug( log_functionName ) ) {
                        log.debug( "svcCat.get.bundle.opts.sub/check.is.bundle" );
                    }
                    if( 'bundle' == component.type ) {
                        // call.sub.bundle
                        var pass_sub_bundle_options = typecheck_string;
                        var bundle_adj = 0;
                        var result = _validateBundleOptions( cartItem, component, pass_sub_bundle_options, bundle_adj, i );
                        pass_sub_bundle_options = result.getBundleOptions();
                        bundle_adj = result.getCostAdj();

                        // replace.sub.bundle.options
                        bundle_options = lib.svcCatBundles.addNewBundle( bundle_options, "opt" + i, pass_sub_bundle_options, form );
                        cost_adj += bundle_adj;

                        if( log.isDebug( log_functionName ) ) {
                            log.debug( "pass_sub_bundle_options = " + pass_sub_bundle_options );
                            log.debug( "bundle_adj = " + bundle_adj );
                            log.debug( "bundle_options = " + bundle_options );
                            log.debug( "cost_adj = " + cost_adj );
                        }
                    }
                }
                /** -------------------------------------- */

                // decide.display
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/decide.display" );
                }
                if( selected ) {
                    if( ! display ) {
                        // goto -> check.is.bundle
                        if( log.isDebug( log_functionName ) ) {
                            log.debug( "svcCat.get.bundle.opts.sub/goto -> check.is.bundle" );
                        }
                        check_is_bundle();
                        continue;
                    }
                }else {
                    // goto -> increment
                    if( log.isDebug( log_functionName ) ) {
                        log.debug( "svcCat.get.bundle.opts.sub/goto -> increment" );
                    }
                    continue;
                }

                // run.validations
                var optionObj={options:typecheck_string};//add this line before function call, and pass ‘optionObj’ as the first parameter in next row’s function call
                var valid = lib.ScAPI_dynamicFormValidation.formIsValid( optionObj, component['option.validations'], false, this.requested_for,
            	this.requested_for_type, this.requested_for_dept, this.delivery, this.service_sla, this.quantity);
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/run.validations" );
                    log.debug( "valid = " + valid );
                }
                if( ! valid ) {
                    throw "Value of [bundle.options] is invalid";
                }
                typecheck_string=optionObj.options;//here, get back the options to the ‘typecheck_string’ variable.

                // set.options
                bundle_options = lib.svcCatBundles.addNewOption( bundle_options, "opt" + i, typecheck_string );
                var cost_adjustment = lib.svcCatalog.getTotalBundleOptionCost( typecheck_string, component );
                var item_quantity = bundle.bundle[i]['item.quantity']; // $L.optional=4 in $L.i in bundle in $L.bundle
                cost_adj += ( cost_adjustment || 0 )*item_quantity;

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/set.options" );
                    log.debug( "bundle_options = " + bundle_options );
                    log.debug( "cost_adj = " + cost_adj );
                }

                // check.is.bundle
                check_is_bundle();

            }

            return {
                getBundleOptions : function() { return bundle_options; },
                getCostAdj : function() { return cost_adj; }
            }
        },

        /**
         * The processing logic of the following functions originate from RAD/label
         * as the functions names indicate
         */
        'svcCat.display.item/decide.bundle' : function() {
            var log_functionName = "'svcCat.display.item/decide.bundle'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            if( this.item.type == 'bundle' ) {
                if( log.isDebug( log_functionName ) ) { log.debug( " item.type == 'bundle', pre.bundle.vars ... " ); }
                // pre.bundle.vars
                var nested_next = createSCDatumArray( this.item.name );

                do {
                    // init.bundle.vars
                    var nested = nested_next[0];
                    if( log.isDebug( log_functionName ) ) { log.debug( "nested = " + nested ); }
                    var bundle_items_tmp = createSCDatumArray();
                    var bundle_types_tmp = createSCDatumArray();
                    var bundle_subscriptionItem_tmp = createSCDatumArray();

                    // init.svcCatalog.main
                    var svcCatalog_main = null;

                    // build.svcCatalog.main.qry
                    var svcCatalog_main_qry = 'name="' + nested + '"';
                    if( log.isDebug( log_functionName ) ) { log.debug( "svcCatalog_main_qry = " + svcCatalog_main_qry ); }

                    // select.svcCatalog.main
                    svcCatalog_main = select( 'svcCatalog', svcCatalog_main_qry, ['bundle'] );
                    if( null == svcCatalog_main ) {
                        // goto -> delete.nested
                        if( log.isDebug( log_functionName ) ) { log.debug( "< goto: delete.nested >" ); }
                        
                    }else {
                        // init.svcCatalog
                        var svcCatalog = null;
                        // build.bundle.array
                        var bundle_lng = isArray( svcCatalog_main.bundle )[1];
                        for( var i=0; i<bundle_lng; i++ ) {
                            if( svcCatalog_main.bundle['item.name'] != null ) {
                                bundle_items_tmp.push( svcCatalog_main.bundle['item.name'] ); // 2 in $L.i in bundle in $L.svcCatalog.main
                            }
                        }

                        // clean.bundle.array
                        bundle_items_tmp = us_array_char_clean( bundle_items_tmp );
                        if( log.isDebug( log_functionName ) ) { log.debug( "bundle_items_tmp = " + bundle_items_tmp ); }

                        // build.svcCatalog.qry
                        var svcCatalog_qry = 'name isin ' + str( bundle_items_tmp );
                        if( log.isDebug( log_functionName ) ) { log.debug( "svcCatalog_qry = " + svcCatalog_qry ); }

                        // select.svcCatalog
                        var fields = ['name', 'type', 'createSubscription', 'subscribeIndividual', 'subscriptionItem', 'subscribeDept'];
                        svcCatalog = select( 'svcCatalog', svcCatalog_qry, fields );
                        var rc = 0;
                        if( null == svcCatalog
                            || ( rc = svcCatalog.getFirst() ) == RC_NO_MORE ) {
                            // goto -> set.requested.for
                            if( log.isDebug( log_functionName ) ) { log.debug( "< goto: set.requested.for>" ); }
                            return;
                        }else {
                            if( log.isDebug( log_functionName ) ) { log.debug( "< set.requested.for.types >" ); }
                            while( rc != RC_NO_MORE ) {
                                // set.requested.for.types
                                if( svcCatalog.type != 'bundle' ) {
                                    if( true == svcCatalog.createSubscription ) {
                                        if( true == svcCatalog.subscribeIndividual ) {
                                                bundle_types_tmp.push( 'SI' );
                                                bundle_subscriptionItem_tmp.push( svcCatalog.subscriptionItem ? svcCatalog.subscriptionItem : 'NONE' );
                                        }else {
                                            if( true == svcCatalog.subscribeDept ) {
                                                bundle_types_tmp.push( 'SD' );
                                                bundle_subscriptionItem_tmp.push( 'NONE' );
                                            }
                                        }
                                    }else {
                                        bundle_types_tmp.push( 'NS' );
                                        bundle_subscriptionItem_tmp.push( 'NONE' );
                                    }
                                }else { // if bundle
                                    bundle_types_tmp.push( 'BUNDLE' );
                                    bundle_subscriptionItem_tmp.push( 'NONE' );
                                    nested_next.push( svcCatalog.name );
                                }

                                rc = svcCatalog.getNext();
                            }

                            if( log.isDebug( log_functionName ) ) {
                                log.debug( "bundle_types_tmp = " + bundle_types_tmp );
                                log.debug( "bundle_subscriptionItem_tmp = " + bundle_subscriptionItem_tmp );
                                log.debug( "nested_next = " + nested_next );
                            }

                            // goto -> delete.nested
                        }
                    }

                    // delete.nested
                    nested_next = _delete( nested_next, 1, 1 );
                    if( bundle_items_tmp.length() > 0 ) {
                        mergeArray(this.bundle_items, bundle_items_tmp );
                        mergeArray(this.bundle_types, bundle_types_tmp );
                        mergeArray(this.bundle_subscriptionItem, bundle_subscriptionItem_tmp );
                    }

                } while( nested_next.length() > 0 ); // decide.continue.bundles, goto -> init.bundle.vars

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "bundle_items = " + this.bundle_items );
                    log.debug( "bundle_types = " + this.bundle_types );
                    log.debug( "bundle_subscriptionItem = " + this.bundle_subscriptionItem );
                }

                // check.dept
                if( index( 'SD', this.bundle_types ) >= 0 ) {
                    // msg.dept.not.allowed
                    var msg5 = scmsg( 5, 'subscription' );
                    if( log.isInfo( log_functionName ) ) { log.info( msg5 ); }
                    throw msg5;
                }

                // goto -> set.requested.for
            }
        },

        'svcCat.display.item/set.requested.for' : function() {
            var log_functionName = "'svcCat.display.item/set.requested.for'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            if( this.item.type != 'bundle'
                    && true == this.item.createSubscription ) {
                this.createSubscription = true;

                if( true == this.item.subscribeIndividual ) {
                    this.subscribeIndividual = true;
                }

                if( true == this.item.subscribeDept ) {
                    this.subscribeDept = true;

                    if( null == this.item.subscribeIndividual
                        || false == this.item.subscribeIndividual ) {
                        this.requested_for_type = 'department';
                        this.requested_for = null;
                    }

                }
            }

            if( true == this.item.createSubscription ) {
                this.restrictQuantity = true;
                this.quantity = 1;
            }

            this.old_currency = lib.svcCatalog.getCatCurrency( this.item.name );

        },

        'svcCat.display.item/check.delivery' : function() {
            var log_functionName = "'svcCat.display.item/check.delivery'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var deliveryObjectives = this.item['delivery.objectives'];
            var del_opt_names = svcCat_setup_del_obj_list( this.item, '' + this.agreement_id );
            this.delivery_list = ( del_opt_names ? del_opt_names : createSCDatumArray() );
            this.delivery = ( this.delivery_list.length() > 0 ? this.delivery_list[0] : null );
            if( log.isDebug( log_functionName ) ) {
                log.debug( "delivery_list = " + this.delivery_list );
                log.debug( "delivery = " + this.delivery );
            }
        },

        'svcCat.display.item/check.service' : function() {
            var log_functionName = "'svcCat.display.item/check.service'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var serviceSLAs = this.item['serviceSLAs'];
            if( serviceSLAs != null && serviceSLAs.length() > 0 ) {
                var rtObj = svcCat_setup_service_sla_list( this.item, '' + this.agreement_id );
                this.service_id_list = rtObj.getServiceSLAIDs();
                if( this.service_id_list != null && this.service_id_list.length() > 0) {
                    this.service_sla = this.service_id_list[0];
                }
                this.service_title_list = rtObj.getServiceSLATitles();
                this.service_readonly = ( this.service_id_list != null && this.service_id_list.length() == 1 );
            }

            if( log.isDebug( log_functionName ) ) {
                log.debug( "service_id_list = " + this.service_id_list );
                log.debug( "service_sla = " + this.service_sla );
                log.debug( "service_title_list = " + this.service_title_list );
                log.debug( "service_readonly = " + this.service_readonly );
            }
        },

        'svcCat.display.item/check.cost/check.recurring.cost' : function() {
            var log_functionName = "'svcCat.display.item/check.cost/check.recurring.cost'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            // check.cost
            if( this.item.cost != null ) {
                var rtObj = us_convert_currency( this.item.currency, this.default_currecny,
                                    this.item.cost, tod() );
                this.cost = money_format( rtObj.getTargetQuantity(), this.default_currecny );
                if( log.isDebug( log_functionName ) ) { log.debug( "cost = " + this.cost ); }
                if( this.item.currency != null
                    && this.item.currency != vars.$G_root_currency ) {
                    var rtObj2 = us_convert_currency( this.item.currency, vars.$G_root_currency,
                                        this.item.cost, tod() );
                    this.root_cost = money_format( rtObj2.getTargetQuantity(), vars.$G_root_currency );
                    if( log.isDebug( log_functionName ) ) { log.debug( "root_cost = " + this.root_cost ); }
                }
            }

            // check.recurring.cost
            if( this.item['recurring.cost'] != null ) {
                var rtObj3 = us_convert_currency( this.item.currency, this.default_currecny,
                                    this.item['recurring.cost'], tod() );
                var recurring_cost_val = money_format( rtObj3.getTargetQuantity(), this.default_currecny );
                // set.recurring.cost
                this.recurring_cost = scmsg( 83, "svcCat",
                            createSCDatumArray( recurring_cost_val, this.item['recurring.cost.interval'] ) );
                if( log.isDebug( log_functionName ) ) { log.debug( "recurring_cost = " + this.recurring_cost ); }
            }
        },

        'svcCat.display.item/post.display' : function( cartItem ) {
            var log_functionName = "'svcCat.display.item/post.display'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            if( this.item.type != 'bundle' ) {
                if( this.createSubscription ) {
                    cartItem.subscription = true;
                    cartItem.subscriptionItem = this.item.subscriptionItem;

                    if( this.requested_for_type == 'department' ) {

                        if( this.requested_for_dept == null ) {
                            this.requested_for_type = 'individual';
                            this.requested_for = ( this.requested_for ? this.requested_for : vars.$lo_ufname );
                            cartItem['requested.for'] = this.requested_for;
                        }

                        cartItem['requested.for.type'] = 'department';
                        cartItem['requested.for.dept'] = this.requested_for_dept;
                        cartItem['requested.for'] = null;
                    }

                    if( this.requested_for_type == 'individual' ) {
                        cartItem['requested.for.type'] = 'individual';
                        cartItem['requested.for'] = this.requested_for;
                        cartItem['requested.for.dept'] = null;
                    }

                }else {
                    cartItem.subscription = false;
                    cartItem['requested.for.type'] = 'individual';
                    cartItem['requested.for'] = this.requested_for;
                    cartItem['requested.for.dept'] = null;
                }

            }else if( this.item.type == 'bundle' ) {
                cartItem.subscription = false;
                cartItem.subscriptionItem = null;
                cartItem['requested.for.type'] = null;
                cartItem['requested.for'] = this.requested_for;
                cartItem['requested.for.dept'] = null;
            }

            if( log.isDebug( log_functionName ) ) {
                log.debug( "requested_for_type = " + this.requested_for_type );
                log.debug( "requested_for = " + this.requested_for );
                log.debug( "requested_for_dept = " + this.requested_for_dept );
            }

            var contact = '';
            if( this.requested_for != null ) {
                contact = lib.userUtils.findContactByField( "contact.name", this.requested_for );
                if( contact != null ) {
                    cartItem['requested.for'] = contact['contact.name'];
                    cartItem['requested.for.fullname'] = contact['full.name'];
                } else {
                	var msg3 = getMessage(129, null);
		            if( log.isInfo( log_functionName ) ) { log.info( msg3 ); }
		            throw msg3;
		        }
            }else {
                cartItem['requested.for'] = this.requested_for;
                cartItem['requested.for.fullname'] = this.requested_for;
            }

            if( log.isDebug( log_functionName ) ) {
                log.debug( "cartItem.subscription = " + cartItem.subscription );
                log.debug( "cartItem.subscriptionItem = " + cartItem.subscriptionItem );
                log.debug( "cartItem['requested.for.type'] = " + cartItem['requested.for.type'] );
                log.debug( "cartItem['requested.for.dept'] = " + cartItem['requested.for.dept'] );
                log.debug( "cartItem['requested.for'] = " + cartItem['requested.for'] );
                log.debug( "cartItem['requested.for.fullname'] = " + cartItem['requested.for.fullname'] );
            }
        },

        'svcCat.display.item/display.decide[$L.action="additem"]' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/display.decide[$L.action=\"additem\"]'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            // init.nested.next
            var nested_next = createSCDatumArray();
            var nested_next_rf = createSCDatumArray();
            // build.svcCartItem.all.build.qry
            var svcCartItem_qry = 'requested.for="' + cartItemTemp['requested.for'] + '" and bundle=true and completed~=true';
            if( log.isDebug( log_functionName ) ) { log.debug( "svcCartItem_qry = " + svcCartItem_qry ); }
            var svcCartItem = select( 'svcCartItem', svcCartItem_qry, ['svcCatalogId'] );
            var rc = 0;
            if( svcCartItem == null
                    || ( rc = svcCartItem.getFirst() ) == RC_NO_MORE ) {

                this['svcCat.display.item/check.subscriptions']( cartItemTemp );
                return;

            }else {
                if( log.isDebug( log_functionName ) ) { log.debug( "< add.to.nested.next >" ); }
                while( rc != RC_NO_MORE ) {
                    // add.to.nested.next
                    var svcCatalog = select( 'svcCatalog', 'id=' + svcCartItem.svcCatalogId, ['name'] );
                    if( svcCatalog != null ) {
                        nested_next.push( svcCatalog.name );
                        nested_next_rf.push( cartItemTemp['requested.for'] );
                    }

                    rc = svcCartItem.getNext();
                }

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "nested_next = " + nested_next );
                    log.debug( "nested_next_rf = " + nested_next_rf );
                }

                if( log.isDebug( log_functionName ) ) { log.debug( "< init.bundle.vars.2 >" ); }
                do {
                    // init.bundle.vars.2
                    var nested = ( nested_next.length() > 0 ? nested_next[0] : null );
                    var nested_rf = ( nested_next_rf.length() > 0 ? nested_next_rf[0] : null );
                    if( log.isDebug( log_functionName ) ) {
                        log.debug( "nested = " + nested + ", nested_rf = " + nested_rf);
                    }

                    var bundle_items_tmp = createSCDatumArray();
                    var bundle_types_tmp = createSCDatumArray();
                    var bundle_subscriptionItem_tmp = createSCDatumArray();
                    var bundle_rf_tmp = createSCDatumArray();

                    var _pThis = this;
                    var delete_nested_2 = function() {
                        // delete.nested.2
                        nested_next = _delete( nested_next, 1, 1 );
                        nested_next_rf = _delete( nested_next_rf, 1, 1 );

                        if( bundle_items_tmp != null && bundle_items_tmp.length() > 0 ) {
                            mergeArray(_pThis.svcCartItem_all_items, bundle_items_tmp );
                            mergeArray(_pThis.svcCartItem_all_types, bundle_types_tmp );
                            mergeArray(_pThis.svcCartItem_all_subscriptionItem, bundle_subscriptionItem_tmp );
                            mergeArray(_pThis.svcCartItem_all_rf, bundle_rf_tmp );
                        }
                    };

                    // select.svcCatalog.main.2
                    var svcCatalog_main = select( 'svcCatalog', nested ? 'name="' + nested + '"' : 'false', ['bundle'] );
                    if( svcCatalog_main == null ) {
                        if( log.isDebug( log_functionName ) ) { log.debug( "< delete.nested.2 >" ); }
                        // delete.nested.2
                        delete_nested_2();
                    }else {
                        if( log.isDebug( log_functionName ) ) { log.debug( "< init.svcCatalog.2 >" ); }
                        // init.svcCatalog.2
                        var svcCatalog2 = null;

                        // build.bundle.array.2
                        var bundle_lng = isArray( svcCatalog_main.bundle )[1];
                        for( var i=0; i < bundle_lng; i++ ) {
                            var value = svcCatalog_main.bundle[i]['item.name']; // 2 in $L.i in bundle in $L.svcCatalog.main
                            if( value != null ) {
                                bundle_items_tmp.push( value );
                            }
                        }

                        // clean.bundle.array.2
                        bundle_items_tmp = us_array_char_clean( bundle_items_tmp );
                        // build.svcCatalog.qry.2
                        var svcCatalog_qry = 'name isin ' + str( bundle_items_tmp );
                        if( log.isDebug( log_functionName ) ) { log.debug( "svcCatalog_qry = " + svcCatalog_qry ); }
                        // select.svcCatalog.2
                        var catalog2Fields = ['name','type','createSubscription','subscribeIndividual','subscriptionItem','subscribeDept'];
                        svcCatalog2 = select( 'svcCatalog', svcCatalog_qry, catalog2Fields );
                        var rc2 = 0;
                        if( svcCatalog2 == null
                                || ( rc2 = svcCatalog2.getFirst() ) == RC_NO_MORE ) {
                            if( log.isDebug( log_functionName ) ) { log.debug( "< goto: set.count >" ); }
                            // goto -> set.count
                            this['svcCat.display.item/set.count']( cartItemTemp );
                            return;
                        }else {
                            if( log.isDebug( log_functionName ) ) { log.debug( "< set.requested.for.types.2 >" ); }
                            while( rc2 != RC_NO_MORE ) {
                                // set.requested.for.types.2
                                if( svcCatalog2.type != 'bundle' ) {
                                    if( svcCatalog2.createSubscription == true ) {
                                        if( svcCatalog2.subscribeIndividual == true ) {
                                                bundle_types_tmp.push( 'SI' );
                                                bundle_subscriptionItem_tmp.push( svcCatalog2.subscriptionItem ? svcCatalog2.subscriptionItem : 'NONE' );
                                                bundle_rf_tmp.push( nested_rf );
                                        }else {
                                            if( svcCatalog2.subscribeDept == true ) {
                                                bundle_types_tmp.push( 'SD' );
                                                bundle_subscriptionItem_tmp.push( 'NONE' );
                                                bundle_rf_tmp.push( nested_rf );
                                            }
                                        }
                                    }else {
                                        bundle_types_tmp.push( 'NS' );
                                        bundle_subscriptionItem_tmp.push( 'NONE' );
                                        bundle_rf_tmp.push( nested_rf );
                                    }
                                }else { // if bundle
                                    bundle_types_tmp.push( 'BUNDLE' );
                                    bundle_subscriptionItem_tmp.push( 'NONE' );
                                    bundle_rf_tmp.push( nested_rf );

                                    nested_next.push( svcCatalog2.name );
                                    nested_next_rf.push( nested_rf );
                                }

                                rc2 = svcCatalog2.getNext();
                            }

                            // delete.nested.2
                            delete_nested_2();
                        }
                    }

                } while( nested_next.length() > 0 ); // decide.continue.bundles.2, goto -> init.bundle.vars.2
                

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCartItem_all_items = " + this.svcCartItem_all_items );
                    log.debug( "svcCartItem_all_types = " + this.svcCartItem_all_types );
                    log.debug( "svcCartItem_all_subscriptionItem = " + this.svcCartItem_all_subscriptionItem );
                    log.debug( "svcCartItem_all_rf = " + this.svcCartItem_all_rf );
                }

                // check.subscriptions
                 this['svcCat.display.item/check.subscriptions']( cartItemTemp );
            }
        },

        'svcCat.display.item/check.subscriptions' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/check.subscriptions'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            if( this.createSubscription && this.item.type != 'bundle' ) {
                if( this.requested_for_type == 'individual' ) {
                    this.subscribertype = 'contacts';
                    this.subscribevalue = cartItemTemp['requested.for'];
                    this.msg_1 = cartItemTemp['requested.for'];
                }else {
                    this.subscribertype = 'dept';
                    this.subscribevalue = this.requested_for_dept;
                    this.msg_1 = this.requested_for_dept;
                }

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "subscribertype = " + this.subscribertype );
                    log.debug( "subscribevalue = " + this.subscribevalue );
                }

                // build.Subscription.qry
                var subscription_qry = '';
                if( this.item.subscriptionItem != null ) {
                    subscription_qry = 'serviceName="' + this.item.subscriptionItem + '"'
                        + ' and subscriber="' + this.subscribevalue + '"'
                        + ' and subscriberType="' + this.subscribertype + '"'
                        + ' and status isin {"Requested", "Active", "Cancellation Requested"}';
                }else {
                    subscription_qry = 'serviceName=NULL and svcCatItem="' + this.item['name'] + '"'
                        + ' and subscriber="' + this.subscribevalue + '"'
                        + ' and subscriberType="' + this.subscribertype + '"'
                        + ' and status isin {"Requested", "Active", "Cancellation Requested"}';
                }
                if( log.isDebug( log_functionName ) ) { log.debug( "subscription_qry = " + subscription_qry ); }

                // select.Subscription
                var subscription = select( 'Subscription', subscription_qry );
                if( null == subscription ) {
                    // init.svcCartItem
                    // build.svcCartItem.qry
                    var svcCartItem_qry = this['svcCat.display.item/build.svcCartItem.qry']( cartItemTemp );
                    if( log.isDebug( log_functionName ) ) { log.debug( "svcCartItem_qry = " + svcCartItem_qry ); }

                    // select.svcCartItem
                    var svcCartItem = select( 'svcCartItem', svcCartItem_qry );
                    if( null == svcCartItem ) {
                        if( log.isDebug( log_functionName ) ) { log.debug( "< check.if.nested >" ); }
                        // check.if.nested
                        var pending = false;
                        if( this.requested_for_type == 'individual' ) {
                            this.s_type = 'SI';
                            this.s_name = this.requested_for;
                        }else {
                            this.s_type = 'SD';
                            this.s_name = this.requested_for_dept;
                        }
                        if( log.isDebug( log_functionName ) ) {
                            log.debug( "s_type = " + this.s_type );
                            log.debug( "s_name = " + this.s_name );
                        }

                        for( var i=0; i < this.svcCartItem_all_items.length(); i++ ) {
                            if( this.svcCartItem_all_items[i] == this.item.name
                                && this.svcCartItem_all_types[i] == this.s_type
                                && (this.item.subscriptionItem == null || this.svcCartItem_all_subscriptionItem[i] == this.item.subscriptionItem)
                                && this.svcCartItem_all_rf[i] == this.s_name ) {

                                pending = true;
                                if( log.isDebug( log_functionName ) ) { log.debug( "pending = " + pending ); }
                                break; // not clear ?
                            }
                        }

                        if( pending ) {
                            this['svcCat.display.item/set.Subscription.msg']();
                            return;
                        }

                        // goto -> check.add.to.cart
                        this['svcCat.display.item/check.add.to.cart']( cartItemTemp );
                        return;
                    }

                    // goto -> set.Subscription.msg
                    this['svcCat.display.item/set.Subscription.msg']();
                    return;
                }

                // set.Subscription.msg
                this['svcCat.display.item/set.Subscription.msg']();
                return;
                
            }else if( this.item.type == 'bundle'
                && index( 'SI', this.bundle_types ) >= 0 ) {
                // goto -> set.count
                this['svcCat.display.item/set.count']( cartItemTemp );
                return;

            }else {
                // check.add.to.cart
                this['svcCat.display.item/check.add.to.cart']( cartItemTemp );
                return;
            }

        },

        'svcCat.display.item/set.Subscription.msg' : function() {
            var log_functionName = "'svcCat.display.item/set.Subscription.msg'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var msg3 = scmsg( 3, "subscription", createSCDatumArray( this.msg_1 ) );
            if( log.isInfo( log_functionName ) ) { log.info( msg3 ); }
            throw msg3;
        },

        'svcCat.display.item/build.svcCartItem.qry' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/build.svcCartItem.qry'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var svcCartItem_qry = 'item.description="'  + itemName + '"'
                        + ' and completed~=true and status~="Canceled"';
           	var tempSubscription = this.item.subscriptionItem ? '"' + this.item.subscriptionItem + '"' : 'NULL';
            if( this.requested_for_type == 'individual' ) {
            	var tempRequestedFor = cartItemTemp['requested.for'] ? '"' + cartItemTemp['requested.for'] + '"' : 'NULL';
                svcCartItem_qry = 'subscriptionItem='  + tempSubscription
                        + ' and requested.for.type="individual"'
                        + ' and requested.for=' + tempRequestedFor
                        + ' and completed~=true and status~="Canceled"';
                this.msg_1 = cartItemTemp['requested.for'];

            }else if( this.requested_for_type == 'department' ) {
            	var tempRequestedForDept = this.requested_for_dept ? '"' + this.requested_for_dept + '"' : 'NULL';
                svcCartItem_qry = 'subscriptionItem=' + tempSubscription
            		+ ' and requested.for.type="department"'
            		+ ' and requested.for.dept=' + tempRequestedForDept
                    + ' and completed~=true and status~="Canceled"';
                this.msg_1 = this.requested_for_dept;
            }
            
            if ( this.item.subscriptionItem == null ) {
            	svcCartItem_qry += ' and svcCatalogId=' + this.item['id'];
            }

            return svcCartItem_qry ? svcCartItem_qry : 'false';
        },

        'svcCat.display.item/set.count' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/set.count'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            // set.count
            var count = 0; // $L.count=1
			if(this.bundle_types.length() > 0){
            	do {
                	//decide.svcCartItem.bundle
                	if( this.bundle_types[count] == 'SI' ) {
                    	// init.Subscription.bundle
                    	var subscription = null;
                    	// build.Subscription.bundle.qry
                    	var subscription_qry = null;
                    	if( this.item.subscriptionItem != null ) {
                        	subscription_qry = 'serviceName="' + this.item.subscriptionItem + '"'
                                            	+ ' and subscriber="' + cartItemTemp['requested.for'] + '"'
                                            	+ ' and subscriberType="contacts"'
                                            	+ ' and status~="Canceled"';
                    	}else {
                        	subscription_qry = 'serviceName="NONE"'
                                            	+ ' and subscriber="' + cartItemTemp['requested.for'] + '"'
                                            	+ ' and subscriberType="contacts"'
                                            	+ ' and status~="Canceled"';
                    	}
                    	subscription = select( 'Subscription', subscription_qry );
                    	if( subscription == null ) {
                        	// init.svcCartItem.bundle
                        	var svcCartItem = null;
                        	// build.svcCartItem.bundle.qry
                        	var svcCartItem_qry = 'subscriptionItem="' + this.bundle_subscriptionItem[count] + '"'
                                                	+ ' and requested.for.type="individual"'
                                                	+ ' and requested.for="' + ( cartItemTemp['requested.for'] ? cartItemTemp['requested.for'] : 'NONE' ) + '"'
                                                	+ ' and completed~=true' ;

                        	this.msg_1 = cartItemTemp['requested.for'];
                        	this.msg_2 = this.bundle_items[count];

                        	// select.svcCartItem.bundle
                        	svcCartItem = select( 'svcCartItem', svcCartItem_qry );
                        	if( null == svcCartItem ) {
                            	// check.if.nested.bundle
                            	var pending = false;
                            	var n = isArray( this.svcCartItem_all_items )[1];
                            	for( var i=0; i < n; i++ ) {
                                	if( this.svcCartItem_all_items[i] == this.bundle_items[count]
                                    	&& this.svcCartItem_all_types[i] == 'SI'
                                    	&& this.svcCartItem_all_subscriptionItem[i] == this.bundle_subscriptionItem[count]
                                    	&& this.svcCartItem_all_rf[i] == cartItemTemp['requested.for'] ) {

                                    	pending = true;
                                    	break; // ???
                                	}
                            	}

                            	if( pending ) {
                                	// set.Subscription.bundle.msg
                                	this['svcCat.display.item/set.Subscription.bundle.msg']();
                                	return;
                            	}else {
                                	// goto -> check.add.to.cart
                                	this['svcCat.display.item/check.add.to.cart']( cartItemTemp );
                                	return;
                            	}

                        	}else {
                            	// set.Subscription.bundle.msg
                            	this['svcCat.display.item/set.Subscription.bundle.msg']();
                            	return;
                        	}

                    	}else {
                        	// set.Subscription.bundle.msg
                        	this['svcCat.display.item/set.Subscription.bundle.msg']();
                        	return;
                    	}

                	}else {
                    	// inc.count
                    	count++;
                	}

            	} while( this.bundle_items != null && this.bundle_items.length() > count ); // check.next.svcCartItem.bundle, goto -> decide.svcCartItem.bundle
			}
            // goto -> check.add.to.cart
            this['svcCat.display.item/check.add.to.cart']( cartItemTemp );

        },

        'svcCat.display.item/set.Subscription.bundle.msg' : function() {
            var log_functionName = "'svcCat.display.item/set.Subscription.bundle.msg'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            var msg4 = scmsg( 4, "subscription", createSCDatumArray( this.msg_1, this.msg_2 ) );
            if( log.isInfo( log_functionName ) ) { log.info( msg4 ); }
            throw msg4;
        },

        'svcCat.display.item/check.add.to.cart' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/check.add.to.cart'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }
            if( lib.xmlHelpers.xmlStringHasChildren( this.item.options ) ) {

                this['svcCat.display.item/validate.options']( cartItemTemp );
                return;
            }
            
            // set the delivery name to system var $delivery, RAD svcCat.add.item.to.cart will retrieve the duration from this var.
			vars['$delivery'] = cartItemTemp["delivery"];

            if( log.isDebug( log_functionName ) ) { log.debug( "< add.to.cart >" ); }
            // add.to.cart
            svcCat_add_item_to_cart( this.cart, this.item, cartItemTemp, this.requested_for, this.quantity,
                                true, false, this.split_items,this.orderInfo );
            
        },

        'svcCat.display.item/validate.options' : function( cartItemTemp ) {
            var log_functionName = "'svcCat.display.item/validate.options'";
            if( log.isDebug( log_functionName ) ) { log.debug( "-> " + log_functionName + " ..." ); }

            // validate.options
            msg_3 = lib.ScAPI_dynamicFormValidation.formIsValid( cartItemTemp, this.item['option.validations'], false, this.requested_for,
            	this.requested_for_type, this.requested_for_dept, this.delivery, this.service_sla, this.quantity);
            var valid = false;
            if( msg_3 == null ) {
            	valid = true;
            } else {
            	throw msg_3;
            }
            if( log.isDebug( log_functionName ) ) { log.debug( "valid = " + valid ); }
            var split_suppress_validation = true;
            // check.valid.item
            if( valid ) {
            	// set the delivery name to system var $delivery, RAD svcCat.add.item.to.cart will retrieve the duration from this var.
				vars['$delivery'] = cartItemTemp["delivery"];
                if( this.split_items ) {
                    if( log.isDebug( log_functionName ) ) { log.debug( "< split.add.to.cart >" ); }
                    // split.add.to.cart
                    svcCat_add_item_to_cart( this.cart, this.item, cartItemTemp, this.requested_for, this.quantity,
                            true, split_suppress_validation, this.split_items ,this.orderInfo);
                }else {
                    if( log.isDebug( log_functionName ) ) { log.debug( "< add.one.item.to.cart >" ); }
                    // add.one.item.to.cart
                    svcCat_add_item_to_cart( this.cart, this.item, cartItemTemp, this.requested_for, this.quantity,
                            true, true, this.split_items,this.orderInfo);
                }
            }
        }

        
    };

    _handler._init();
    
    return _handler;
}