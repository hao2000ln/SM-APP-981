var select = lib.ScAPI_RAD._select;
var sc_get_sla = lib.ScAPI_RAD.sc_get_sla;
var scmsg = lib.ScAPI_RAD._scmsg;
var fix_bundle_opts_currency = lib.ScAPI_RAD.fix_bundle_opts_currency;
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var money_format = lib.ScAPI_RAD.money_format;
var tod = lib.ScAPI_RAD._tod;
var us_array_char_clean = lib.ScAPI_RAD.us_array_char_clean;
var str = lib.ScAPI_RAD._str;
var se_get_record = lib.ScAPI_RAD.se_get_record;

var createSCDatumArray = lib.ScAPI_Util.createSCDatumArray;

var log = new lib.ScAPI_Logger.log( 'ScAPI_GetBundleOpts' );

var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;

var oper = getCurrentOperator();
var defaultCurrency = oper.display_currency_code || vars.$G_root_currency;

function svcCat_get_bundle_opts(cItem,ordInfo){

    var _handler = {
        item:null,
        i:1,
        id:null,

        bundle_options:null,
        new_options:null,
        has_options:null,
        save_options:null,
        orderInfo: null,
        
        subItemId: 0,
//        bg: false,

        getBundleOpts: function() {
            if (log.isDebug()) log.debug("_start...");
            this.item = cItem;
            this.i = 1;
            this.id = this.item.name;
            this.item["bundle.options"] = this.item["bundle.options"] || "<bundle></bundle>";
            this.bundle_options = this.item["bundle.options"];
            this.new_options = "<bundle></bundle>";
            this.has_options = createSCDatumArray();
            this.save_options = this.item["bundle.options"];
            //init Order Info
            this.orderInfo = ordInfo;
            this.subItemId = 0;
            
            if (log.isDebug()) log.debug("get.catalog.item...");
            //Noused in the follow steps, so comment it first

            if (log.isDebug()) log.debug("call.get.opts.sub...");
            var rObj = this._validateBundleOptions(this.item,null,this.bundle_options,null,null);

            this.bundle_options = rObj.getBundleOptions();
            this.cost_adj = rObj.getCostAdj();

            //set.bundle.options
            this.item["bundle.options"] = this.bundle_options;
            this.item["option.costs"] = this.cost_adj;

        },

        

       /**
         * processing logic originates from RAD: svcCat.get.bundle.opts.sub
         */
        _validateBundleOptions : function( cartItem, subbundle, subbundleOptions, costAdj, id) {
            
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
            var has_options = createSCDatumArray();
            var old_currency = lib.svcCatalog.getCatCurrency( item_name );

            if( log.isDebug( log_functionName ) ) {
                log.debug( "svcCat.get.bundle.opts.sub/start" );
                log.debug( "bundle_options = " + bundle_options );
                log.debug( "cost_adj = " + cost_adj );
            }

            // get.catalog.record
            var bundle = se_get_record( item_name, 'name', 'joinsvcDisplay', true );
           

            // setup.loop
            var max = ( bundle.bundle ? bundle.bundle.length() : 0 ) ;

            if( log.isDebug( log_functionName ) ) {
                log.debug( "svcCat.get.bundle.opts.sub/setup.loop" );
                log.debug( "max = " + max );
            }

            // start.loop
            var typecheck_string = '';
            for( var i = 0; i < max; i++ ) {
            	this.subItemId++;
                var form = null;
                var catalog_id = bundle.bundle[i]['item.name']; // $L.catalog.id=2 in $L.i in bundle in $L.bundle
                var optional = bundle.bundle[i]['item.option']; // $L.optional=3 in $L.i in bundle in $L.bundle
				var j = i + 1;
                var selected = false;
                var check_options = cartItem.options;
                if( sub_bundle_options ) {
                    check_options = sub_bundle_options;
                }
                if( 'mandatory' == optional ) {
                    selected = true;
                }else {
                    /****************************************************************/
                    //get the options from user's input
                	typecheck_string = this._getOrderOptions(this.orderInfo, this.subItemId,item_name) || check_options ;
					
                    /****************************************************************/                	
                    selected = lib.svcCatBundles.isSelected( check_options, "opt" + j);
                }
                selected = selected || false;
                if( selected == true || selected == "true") {
                    cost_adj += ( bundle.bundle[i]['item.cost.adj'] || 0 ); // if $L.selected then $L.cost.adj+=nullsub(5 in $L.i in bundle in $L.bundle, 0)
                }
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/start.loop" );
                    log.debug( "catalog_id = " + catalog_id );
                    log.debug( "optional = " + optional );
                    log.debug( "selected = " + selected );
                    log.debug( "cost_adj = " + cost_adj );
                    log.debug( "check_options = " + check_options);
                    log.debug( "bundle.name = " + bundle.name);
                }

                // get.component
                var component = se_get_record( catalog_id, 'name', 'joinsvcDisplay', true );
                
                // get.form
                typecheck_string = null;
                form = lib.svcCatBundles.getForm( bundle_options, "opt" + j, component );
                
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/get.form" );
                    log.debug( "form = " + form );
                }

                // fix.bundle.opts.currency
                var rtObj = fix_bundle_opts_currency( form, old_currency,
                                    defaultCurrency, false,  component['option.costs'] );
                      
                form = rtObj.getForm();
                component['option.costs'] = rtObj.getCosts();

                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/fix.bundle.opts.currency" );
                    log.debug( "form = " + form );
                }

                // finish.get.form
                
                var display = lib.xmlHelpers.xmlStringHasChildren( form );
                typecheck_string = form;
                has_options.push(display && selected);
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/finish.get.form" );
                    log.debug( "display = " + display );
                    log.debug( "selected = " + typeof(selected) );
                }
				
                /** --- created for following usage ----- */
                // check.is.bundle
                var check_is_bundle = function(thisPoint) {
                    if( log.isDebug( log_functionName ) ) {
                        log.debug( "svcCat.get.bundle.opts.sub/check.is.bundle" );
                    }
                    if( 'bundle' == component.type ) {
                        // call.sub.bundle
                        var pass_sub_bundle_options = typecheck_string;
                        var bundle_adj = 0;
                        var result = thisPoint._validateBundleOptions( cartItem, component, pass_sub_bundle_options, bundle_adj, j);
                        pass_sub_bundle_options = result.getBundleOptions();
                        bundle_adj = result.getCostAdj();

                        // replace.sub.bundle.options
                        bundle_options = lib.svcCatBundles.addNewBundle( bundle_options, "opt" + j, pass_sub_bundle_options, form );
                        cost_adj += bundle_adj;
                        //TODO add options value
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
                
                if( selected == "true" || selected == true) {
                    if( ! display ) {
                        // goto -> check.is.bundle
                        if( log.isDebug( log_functionName ) ) {
                            log.debug( "svcCat.get.bundle.opts.sub/goto -> check.is.bundle" );
                        }
                        check_is_bundle(this);
                        continue;
                    }
                    /****************************************************************/
	                //before the validation, set the selections and values user typed
	                typecheck_string = this._getOrderOptions(this.orderInfo, this.subItemId,item_name) ||typecheck_string ;
					
					if( log.isDebug() ) {
						log.debug("typecheck_string = "+typecheck_string);
					}
                    /****************************************************************/					
                }else {
                    // goto -> increment
                    if( log.isDebug( log_functionName ) ) {
                        log.debug( "svcCat.get.bundle.opts.sub/goto -> increment" );
                    }
                    continue;
                }

                
                // run.validations
                var optionObj={options:typecheck_string};//add this line before function call, and pass ‘optionObj’ as the first parameter in next row’s function call
                var msg = lib.ScAPI_dynamicFormValidation.formIsValid( optionObj, component['option.validations'], false,
                 cartItem["requested.for"], cartItem["requested.for.type"], cartItem["requested.for.dept"],
                  cartItem["delivery"], cartItem["serviceSLA"], cartItem["quantity"]);
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/run.validations" );
                    log.debug( "msg = " + msg );
                }
                if( msg != null ) {
                    throw component.name + ": " + msg;
                }
                typecheck_string=optionObj.options;//here, get back the options to the ‘typecheck_string’ variable.

                // set.options
                bundle_options = lib.svcCatBundles.addNewOption( bundle_options, "opt" + j, typecheck_string, component['option.validations'] );                
                var cost_adjustment = lib.svcCatalog.getTotalBundleOptionCost( typecheck_string, component );

                var item_quantity = bundle.bundle[i]['item.quantity']; // $L.optional=4 in $L.i in bundle in $L.bundle
                cost_adj += ( cost_adjustment || 0 )*item_quantity;
                
                if( log.isDebug( log_functionName ) ) {
                    log.debug( "svcCat.get.bundle.opts.sub/set.options" );
                    log.debug( "bundle_options = " + bundle_options );
                    log.debug( "cost_adj = " + cost_adj );
                }

                // check.is.bundle
                check_is_bundle(this);

            }

            return {
                getBundleOptions : function() { return bundle_options; },
                getCostAdj : function() { return cost_adj; }
            }
        },

		_getOrderOptions :function (oInfo,subItemId,item_name) {
			if( log.isDebug() ) {
				log.debug( "Get Order Options" );
				log.debug( "subItemId = " + subItemId );
			}
			if (!oInfo || !subItemId) return null;
			var optionList = oInfo["option.list"];
			/* Add this logic for ER:QCCR1E90039, since currently RTE not support Embbed Array
			 so pass option.list as XML string when called from new Service:createsrcinteractionviaonestep*/
			var ifOptionListArray = lib.ScAPI_Util.isArray(optionList);
			if(ifOptionListArray[0] == false) 
			 {	
			 var cartItemsList = oInfo["cartItems"];
			  if(cartItemsList != null)
              for (var i in cartItemsList) 
              {
			  var cartItem = cartItemsList[i];	
			  var itemName = cartItem.name;
			  if( itemName == item_name)
			  {
			  optionList = cartItem.option_list;
			  break;
			  }
			  }		
			  var xmlOptionList = new XML(); 
			  if ( xmlOptionList.setContent(optionList) )
			   {	
			    
				var node = xmlOptionList.getFirstChildElement();		
		        while ( node != null)
		        {	
			     if ( node.getAttributeValue("SubItemId") != null  && node.getAttributeValue("SubItemId") != "")
			     {
				   if(node.getAttributeValue("SubItemId") == subItemId)				
				   return node.getValue();				
			      }			
			     node = node.getNextSiblingElement();
		       }
			 }			   
			 }
		  else
			for (var i in optionList) {
				if( subItemId == optionList[i].subItemId) {
					return optionList[i].subOptions;
				}
			}
			return null;
		}
        
    };
    _handler.getBundleOpts();

}
