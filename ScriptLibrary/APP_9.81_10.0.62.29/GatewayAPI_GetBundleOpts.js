var select = lib.GatewayAPI_RAD._select;
var sc_get_sla = lib.GatewayAPI_RAD.sc_get_sla;
var scmsg = lib.GatewayAPI_RAD._scmsg;
var fix_bundle_opts_currency = lib.GatewayAPI_RAD.fix_bundle_opts_currency;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var money_format = lib.GatewayAPI_RAD.money_format;
var tod = lib.GatewayAPI_RAD._tod;
var us_array_char_clean = lib.GatewayAPI_RAD.us_array_char_clean;
var str = lib.GatewayAPI_RAD._str;
var se_get_record = lib.GatewayAPI_RAD.se_get_record;
var createSCDatumArray = lib.GatewayAPI_Util.createSCDatumArray;
var log = new lib.GatewayAPI_Logger.log('GatewayAPI_GetBundleOpts');
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var oper = getCurrentOperator();
var defaultCurrency = oper.display_currency_code || vars.$G_root_currency;

function svcCat_get_bundle_opts(cItem, ordInfo) {
	log.debug("svcCat_get_bundle_opts cItem : " + lib.debugUtils.display(cItem));
	log.debug("svcCat_get_bundle_opts ordInfo : " + lib.debugUtils.display(ordInfo));
	var _handler = {
		item: null,
		i: 1,
		id: null,
		bundle_options: null,
		new_options: null,
		has_options: null,
		save_options: null,
		orderInfo: null,
		subItemId: 0,
		
		getBundleOpts: function () {
			if (log.isDebug())
				log.debug("getBundleOpts _start...");
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

			if (log.isDebug())
				log.debug("get.catalog.item...");
			//Noused in the follow steps, so comment it first

			if (log.isDebug())
				log.debug("call.get.opts.sub...");
			var rObj = this._validateBundleOptions(this.item, null, this.bundle_options, null, null);

			this.bundle_options = rObj.getBundleOptions();
			this.cost_adj = rObj.getCostAdj();
			//set.bundle.options
			this.item["bundle.options"] = this.bundle_options;
			this.item["option.costs"] = this.cost_adj;
			log.debug("svcCat_get_bundle_opts item cost : " + this.item["option.costs"]);
			log.debug("svcCat_get_bundle_opts this.options: " + this.item["bundle.options"]);
		},

		/**
		 * processing logic originates from RAD: svcCat.get.bundle.opts.sub
		 */
		_validateBundleOptions: function (cartItem, subbundle, subbundleOptions, costAdj, id) {
			var log_functionName = "_validateBundleOptions";
			if (log.isDebug(log_functionName)) {
				log.debug("-> " + log_functionName + " ...");
			}
			// start
			cartItem['bundle.options'] = cartItem['bundle.options'] || "<bundle></bundle>";
			var item_name = cartItem['item.description'];
			var bundle_options = cartItem['bundle.options'];
			var sub_bundle_options = null;
			
			if (id) {
				bundle_options = lib.svcCatBundles.getSubBundle(bundle_options, "opt" + id);
				bundle_options = bundle_options || "<bundle></bundle>";
				item_name = (subbundle ? subbundle.name : item_name);
				sub_bundle_options = subbundleOptions;
			}

			var cost_adj = costAdj || 0;
			var has_options = createSCDatumArray();
			var old_currency = lib.svcCatalog.getCatCurrency(item_name);
			if (log.isDebug(log_functionName)) {
				log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/start");
				log.debug("_validateBundleOptions bundle_options = " + bundle_options);
				log.debug("_validateBundleOptions cost_adj = " + cost_adj);
			}
			
			// get.catalog.record
			var bundle = se_get_record(item_name, 'name', 'joinsvcDisplay', true);

			// setup.loop
			var max = (bundle.bundle ? bundle.bundle.length() : 0);
			if (log.isDebug(log_functionName)) {
				log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/setup.loop");
				log.debug("_validateBundleOptions max = " + max);
			}

			// start.loop
			var typecheck_string = '';
			for (var i = 0; i < max; i++) {
				this.subItemId++;
				var form = null;
				var catalog_id = bundle.bundle[i]['item.name']; // $L.catalog.id=2 in $L.i in bundle in $L.bundle
				var optional = bundle.bundle[i]['item.option']; // $L.optional=3 in $L.i in bundle in $L.bundle
				var j = i + 1;
				var selected = false;
				var check_options = cartItem.options;
				log.debug("_validateBundleOptions check_options = " + check_options);
				var cartItemId = cartItem.cartItemId;
				if (sub_bundle_options) {
					check_options = sub_bundle_options;
				}
				if ('mandatory' == optional) {
					selected = true;
				} else {
					/****************************************************************/
					//get the options from user's input
					typecheck_string = this._getOrderOptions(this.orderInfo, cartItemId, catalog_id) || check_options;
					
					log.debug("_validateBundleOptions typecheck_string = " + typecheck_string);
					
					/****************************************************************/
					selected = lib.svcCatBundles.isSelected(check_options, "opt" + j);
					log.debug("_validateBundleOptions optj = " + "opt" + j);
					log.debug("_validateBundleOptionsselected = " + selected);
				}
				selected = selected || false;
				if (selected == true || selected == "true") {
					cost_adj += (bundle.bundle[i]['item.cost.adj'] || 0); 
				}
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/start.loop");
					log.debug("_validateBundleOptions catalog_id = " + catalog_id);
					log.debug("_validateBundleOptions optional = " + optional);
					log.debug("_validateBundleOptions selected = " + selected);
					log.debug("_validateBundleOptions cost_adj = " + cost_adj);
					log.debug("_validateBundleOptions check_options = " + check_options);
					log.debug("_validateBundleOptions bundle.name = " + bundle.name);
				}

				// get.component
				var component = se_get_record(catalog_id, 'name', 'joinsvcDisplay', true);

				// get.form
				typecheck_string = null;
				form = lib.svcCatBundles.getForm(bundle_options, "opt" + j, component);
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/get.form");
					log.debug("_validateBundleOptions form = " + form);
				}

				// fix.bundle.opts.currency
				var rtObj = fix_bundle_opts_currency(form, old_currency, defaultCurrency, false, component['option.costs']);
				form = rtObj.getForm();
				component['option.costs'] = rtObj.getCosts();
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/fix.bundle.opts.currency");
					log.debug("_validateBundleOptions form = " + form);
				}

				// finish.get.form
				var display = lib.xmlHelpers.xmlStringHasChildren(form);
				typecheck_string = form;
				has_options.push(display && selected);
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/finish.get.form");
					log.debug("_validateBundleOptions display = " + display);
					log.debug("_validateBundleOptions selected = " + typeof(selected));
				}

				/** --- created for following usage ----- */
				// check.is.bundle
				var check_is_bundle = function (thisPoint) {
					if (log.isDebug(log_functionName)) {
						log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/check.is.bundle");
					}
					if ('bundle' == component.type) {
						// call.sub.bundle
						var pass_sub_bundle_options = typecheck_string;
						var bundle_adj = 0;
						var result = thisPoint._validateBundleOptions(cartItem, component, pass_sub_bundle_options, bundle_adj, j);
						pass_sub_bundle_options = result.getBundleOptions();
						bundle_adj = result.getCostAdj();

						// replace.sub.bundle.options
						bundle_options = lib.svcCatBundles.addNewBundle(bundle_options, "opt" + j, pass_sub_bundle_options, form);
						cost_adj += bundle_adj;
						//TODO add options value
						if (log.isDebug(log_functionName)) {
							log.debug("_validateBundleOptions pass_sub_bundle_options = " + pass_sub_bundle_options);
							log.debug("_validateBundleOptions bundle_adj = " + bundle_adj);
							log.debug("_validateBundleOptions bundle_options = " + bundle_options);
							log.debug("_validateBundleOptionscost_adj = " + cost_adj);
						}
					}
				}

				// decide.display
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/decide.display selected: " + selected);
				}

				if (selected == "true" || selected == true) {
					//log.debug( "svcCat.get.bundle.opts.sub/decide.display display: " + display);
					if (!display) {
						if (log.isDebug(log_functionName)) {
							log.debug("_validateBundleOptionssvcCat.get.bundle.opts.sub/goto -> check.is.bundle");
						}
						check_is_bundle(this);
						continue;
					}
					/****************************************************************/
					//before the validation, set the selections and values user typed
					typecheck_string = this._getOrderOptions(this.orderInfo, cartItemId, catalog_id) || typecheck_string;

					if (log.isDebug()) {
						log.debug("_validateBundleOptions typecheck_string = " + typecheck_string);
					}
					/****************************************************************/
				} else {
					// goto -> increment
					if (log.isDebug(log_functionName)) {
						log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/goto -> increment");
					}
					continue;
				}
				
				// run.validations
				var optionObj = {
					options: typecheck_string,
					bundle: true
				}; //add this line before function call, and pass ‘optionObj’ as the first parameter in next row’s function call
				//log.debug( "optionObj-> optionObj "+   typecheck_string);
				var msg = lib.GatewayAPI_dynamicFormValidation.formIsValid(optionObj, component['option.validations'], false,
						cartItem["requested.for"], cartItem["requested.for.type"], cartItem["requested.for.dept"],
						cartItem["delivery"], cartItem["serviceSLA"], cartItem["quantity"]);
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/run.validations");
					log.debug("_validateBundleOptions msg = " + msg);
				}
				if (msg != null) {
					throw component.name + ": " + msg;
				}
				typecheck_string = optionObj.options; //here, get back the options to the ‘typecheck_string’ variable.

				// set.options
				bundle_options = lib.svcCatBundles.addNewOption(bundle_options, "opt" + j, typecheck_string, component['option.validations']);
				var cost_adjustment = lib.svcCatalog.getTotalBundleOptionCost(typecheck_string, component);
				var item_quantity = bundle.bundle[i]['item.quantity']; // $L.optional=4 in $L.i in bundle in $L.bundle
				cost_adj += (cost_adjustment || 0) * item_quantity;
				if (log.isDebug(log_functionName)) {
					log.debug("_validateBundleOptions svcCat.get.bundle.opts.sub/set.options");
					log.debug("_validateBundleOptions bundle_options = " + bundle_options);
					log.debug("_validateBundleOptions cost_adj = " + cost_adj);
				}

				// check.is.bundle
				check_is_bundle(this);
			}
			log.debug("_validateBundleOptions bundle_options = " + bundle_options);
			return {			    
				getBundleOptions: function () {return bundle_options;},
				getCostAdj: function () {return cost_adj;}
			}
		},

		_getOrderOptions: function (oInfo, parentCartItemId, item_name) {
			if (log.isDebug()) {
				log.debug("_getOrderOptions Get Order Options");
				log.debug("_getOrderOptions parentCartItemId = " + parentCartItemId);
				log.debug("_getOrderOptions item_name = " + item_name)
			}
			if (!oInfo || !parentCartItemId) return null;
			var optionList = oInfo["bundleSubItems"] != null ? oInfo["bundleSubItems"] : oInfo["option.list"];
			log.debug("_getOrderOptions optionList = " + optionList);
			/* Add this logic for ER:QCCR1E90039, since currently RTE not support Embbed Array
			so pass option.list as XML string when called from new Service:createsrcinteractionviaonestep*/
			var ifOptionListArray = lib.GatewayAPI_Util.isArray(optionList);
			log.debug("_getOrderOptions ifOptionListArray = " + ifOptionListArray);
			if (ifOptionListArray[0] == false) {
				var cartItemsList = oInfo["cartItems"];
				if (cartItemsList != null)
					for (var i in cartItemsList) {
						var cartItem = cartItemsList[i];
						var itemName = cartItem.name;
						if (itemName == item_name) {
							optionList = cartItem.option_list;
							break;
						}
					}
				var xmlOptionList = new XML();
				if (xmlOptionList.setContent(optionList)) {
					var node = xmlOptionList.getFirstChildElement();
					while (node != null) {
						if (node.getAttributeValue("subItemName") != null && node.getAttributeValue("subItemName") != "") {
							if (node.getAttributeValue("subItemName") == item_name && node.getAttributeValue("parentCartItemId") == parentCartItemId)
								log.debug("_getOrderOptions optionList[i].subOptions = " + optionList[i].subOptions);
							return node.getValue();
						}
						node = node.getNextSiblingElement();
					}
				}
			} else
					log.debug("_getOrderOptions item_name = " + item_name);
					log.debug("_getOrderOptions parentCartItemId = " + parentCartItemId);
				for (var i in optionList) {
					log.debug("_getOrderOptions optionList[i].subItemName = " + optionList[i].subItemName);
					log.debug("_getOrderOptions optionList[i].parentCartItemId = " + optionList[i].parentCartItemId);
					if (item_name == optionList[i].subItemName && parentCartItemId == optionList[i].parentCartItemId) {
						log.debug("_getOrderOptions optionList[i].subOptions = " + optionList[i].subOptions);
						return optionList[i].subOptions;
					}
				}
			return null;
		}
	};
	_handler.getBundleOpts();
}
