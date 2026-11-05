var tod = lib.GatewayAPI_RAD._tod;

var log = new lib.GatewayAPI_Logger.log('GatewayAPI_AddBundleToCart');


function addBundleToCart(p_cart, p_item, p_cartItem, p_requestedFor, p_quantity,
    p_bSuppress, p_bByPass, p_splitItems, p_Orderinfo) {
    var _handler = {
        //Input parameters
        cart: null,
        item: null,
        cart_item: null,
        added_msg: null,
        exit: "normal",
        supress: null,
        quantity: null,
        configure: false,
        bypass: false,
        default_del_time: null,
        split: false,

        form: null,
        cost_adj: null,

        //Order Info
        order: null,
        delivery: null,
        serviceSLA: null,

        _init: function() {
            if (log.isDebug()) {
                log.debug("_start...");
            }

            this.cart = p_cart;
            this.item = p_item;
            this.cart_item = p_cartItem;

            var dName = lib.GatewayAPI_Util.createSCDatumArray();
            dName.push(this.item.displayName);

            this.added_msg = lib.GatewayAPI_RAD._scmsg(34, "svcCat", dName);
            this.supress = p_bSuppress || false;
            this.quantity = p_quantity || 1;

            this.configure = lib.xmlHelpers.xmlStringHasChildren(this.item.options);
            this.bypass = p_bByPass;
            this.order = p_Orderinfo;
            if (this.bypass) {
                this.configure = false;
            }
            this.default_del_time = '1 00:00:00';
            this.split = p_splitItems || false;

            //the Cart Item have the two values
            this.delivery = this.cart_item.delivery;
            this.service_sla = this.cart_item.serviceSLA;

            this['svcCat.add.item.to.cart/check.parms']();
        },

        'svcCat.add.item.to.cart/check.parms': function() {
            if (log.isDebug()) {
                log.debug("svcCat.add.item.to.cart/check.parms...");
            }

            if (this.cart_item == null) {
                //init.cart.item
                if (log.isDebug()) {
                    log.debug("init.cart.item...");
                }
                this.cart_item = new SCFile("svcCartItem");
                this['svcCat.add.item.to.cart/fix.opts.start']();
            } else {
                //set.cart.item
                if (log.isDebug()) {
                    log.debug("set.cart.item...");
                }
                this.cart_item.cartId = this.cart_item.cartId || this.cart.cartId;
                this.cart_item["item.description"] = this.cart_item["item.description"] || this.item.name;
                this.cart_item.quantity = this.cart_item.quantity || this.quantity;
                this.cart_item["requested.by"] = this.cart.owner || vars.$lo_contact_name;
                this.cart_item.status = this.cart_item.status || "Requested";
                var itemId = this.cart_item.svcCatalogId || this.item.id;
                if (itemId) {
                    this.cart_item.svcCatalogId = parseInt(itemId);
                }
                this.cart_item.options = this.cart_item.options || this.item.options;
                this.cart_item["option.instructions"] = this.cart_item["option.instructions"] || this.item["option.instructions"];
                this.cart_item["request.time"] = this.cart_item["request.time"] || tod();
                this.cart_item.delivery = this.cart_item.delivery || this.delivery; // TODO
                this.cart_item.serviceSLA = this.cart_item.serviceSLA || this.service_sla; // TODO

                if (this.cart.sdID != null) {
                    this.cart_item.sdID = this.cart.sdID;
                }
                this.cart_item.bundle = !!(this.item.type == "bundle");

                this.cart_item["recurring.cost"] = this.cart_item["recurring.cost"] || this.item["recurring.cost"] * this.cart_item.quantity;
                this.cart_item["recurring.cost.interval"] = this.cart_item["recurring.cost.interval"] || this.item["recurring.cost.interval"];

                if (log.isDebug()) {
                    log.debug("check.null.requested...");
                }
                if (this.cart_item["requested.for.type"] == null && this.cart_item["requested.for"] == null) {
                    //set.requested.for
                    if (log.isDebug()) {
                        log.debug("set.requested.for...");
                    }
                    if (this.item.createSubscription || false) {
                        this.cart_item.subscription = true;
                        this.cart_item.subscriptionItem = this.item.subscriptionItem;
                        this.cart_item["requested.for.type"] = "individual";
                    } else {
                        this.cart_item.subscription = false;
                        this.cart_item.subscriptionItem = null;
                        this.cart_item["requested.for.type"] = null;
                    }
                    this.cart_item["requested.for"] = vars.$lo_contact_name;
                    this.cart_item["subscribeDept"] = null;
                    this.cart_item["requested.for.dept"] = null;
                }

                //get.delivery
                if (log.isDebug()) {
                    log.debug("get.delivery... -> se.get.reocrd....");
                }
                var svcCatDelivery = lib.GatewayAPI_RAD.se_get_record(this.delivery, 'name', 'svcCatDelivery', true);

                if (log.isDebug()) {
                    log.debug("set.duration...");
                }
                this.cart_item.duration = svcCatDelivery.duration;
                this.cart_item.schedule = svcCatDelivery.schedule;

                if (log.isDebug()) {
                    log.debug("check.user.selections...");
                }

                if (this.configure) {
                    this['svcCat.add.item.to.cart/get.configure.options']();
                } else if (this.item.type == "bundle") {
                    //get.bundle.options
                    this['svcCat.add.item.to.cart/get.bundle.options'](this.cart_item);
                } else {
                    //check.cost
                    this['svcCat.add.item.to.cart/check.cost']();
                }
            }
        },

        'svcCat.add.item.to.cart/get.bundle.options': function() {
            if (log.isDebug()) {
                log.debug("get.bundle.options...");
            }
            lib.GatewayAPI_GetBundleOpts.svcCat_get_bundle_opts(this.cart_item, this.order);

            if (log.isDebug()) {
                log.debug("The current cart item is: " + this.cart_item);
                log.debug("check.exit...");
            }

            this['svcCat.add.item.to.cart/check.cost']();
        },

        'svcCat.add.item.to.cart/check.cost': function() {
            if (log.isDebug()) {
                log.debug("check.cost...");
            }
            if (this.item.type != "bundle") {
                this.cost_adj = lib.svcCatalog.getTotalOptionCost(this.cart_item, this.item) || 0;
                this.cart_item["option.costs"] = this.cost_adj;
            }
            this.item.currency = this.item.currency || vars.$G_root_currency;
            this.item.cost = this.item.cost || 0;
            if (log.isDebug()) {
                log.debug("check.cost.1...");
            }
            if (this.item.cost != null && vars.$G_root_currency != this.item.currency) {
                if (log.isDebug()) {
                    log.debug("get.root.cost...");
                }

                var source_cost = (this.item.cost || 0) + (this.cart_item["option.costs"] || 0);

                if (log.isDebug()) {
                    log.debug("get.root.cost.1...");
                }
                var rtObj = lib.GatewayAPI_RAD.us_convert_currency(this.item.currency, vars.$G_root_currency,
                    source_cost, tod());
                this.cart_item["unit.cost"] = rtObj.getTargetQuantity();

                if (log.isDebug()) {
                    log.debug("set.root.cost...");
                }
                this.cart_item.cost = this.cart_item["unit.cost"] * this.cart_item.quantity;
                if (this.split) {
                    this.cart_item.cost = this.cart_item["unit.cost"];
                }

                if (log.isDebug()) {
                    log.debug("decide.split.item...this.split->" + this.split);
                }
                if (this.split) {
                    return; //go to split.cart.item  SKIP here
                }
            } else if (this.item.cost != null) {
                if (log.isDebug()) {
                    log.debug("set.cost...");
                }
                this.cart_item["unit.cost"] = this.item.cost + (this.cart_item["option.costs"] || 0);
                this.cart_item.cost = this.cart_item["unit.cost"] * this.cart_item.quantity;
                if (this.split) {
                    this.cart_item.cost = this.cart_item["unit.cost"];
                }

                if (log.isDebug()) {
                    log.debug("decide.split.item...this.split->" + this.split);
                }
                if (this.split) {
                    return; //go to split .cart.items. SKIP here
                }
            } else if (this.split != null && this.split) { //skip
                if (log.isDebug()) {
                    log.debug("split.cart.items...");
                }
                return;
            }

            this['svcCat.add.item.to.cart/fix.opts.start']();
        },

        'svcCat.add.item.to.cart/fix.opts.start': function() {
            if (log.isDebug()) {
                log.debug("fix.opts.start...");
            }
            var new_currency = lib.svcCatalog.getCatCurrency(this.item.name);
            if (this.cart_item.bundle) {
                this.form = this.cart_item["bundle.options"];
            } else {
                this.form = this.cart_item.options;
            }
            if (log.isDebug()) {
                log.debug("put.form.in.cart.item...");
            }
            if (this.cart_item.bundle) {
                this.cart_item["bundle.options"] = this.form;
            } else {
                this.cart_item.options = this.form;
            }
            this['svcCat.add.item.to.cart/add.item']();
        },

        'svcCat.add.item.to.cart/add.item': function() {
            if (log.isDebug()) {
                log.debug("add.item...");
            }
            var RC = this.cart_item.doInsert();
            if (RC != RC_SUCCESS) {
                throw "Add cart item failed";
            }

            if (log.isDebug()) {
                log.debug("check.added.msg...");
            }
            if (this.supress) {
                this['svcCat.add.item.to.cart/init.itemcount']();
            }
            //added.msg  for success msg ignore
            //throw this.added_msg;
        },

        'svcCat.add.item.to.cart/get.configure.options': function() {
            //get.configuration.options
            if (log.isDebug()) {
                log.debug("get.configuration.options..."); //skip
                log.debug("get.configure.options.1..."); //skip
                log.debug("get.configure.options.1..."); //skip
                log.debug("post.display..."); //skip
                log.debug("display.decide..."); //skip
            }

            //default action is continue -> check.add.item
            if (log.isDebug()) {
                log.debug("check.add.item...");
            }
            var valid = lib.GatewayAPI_dynamicFormValidation.formIsValid(this.cart_item, this.item["option.validations"], false,
                this.cart_item["requested.for"], this.cart_item["requested.for.type"], this.cart_item["requested.for.dept"],
                this.cart_item["delivery"], this.cart_item["serviceSLA"], this.cart_item["quantity"]);

            if (log.isDebug()) {
                log.debug("check.is.valid...");
            }

            if (!valid) {
                throw "Options is invaild."; //goto check.is.item
            }

            if (this.item.type == "bundle") {
                //get.bundle.options
                this['svcCat.add.item.to.cart/get.bundle.options']();
            } else {
                //check.cost
                this['svcCat.add.item.to.cart/check.cost']();
            }
        },

        'svcCat.add.item.to.cart/addorupdate.count': function(count, model) {

            if (model == "add") {
                if (log.isDebug()) {
                    log.debug("add.count...");
                }
                if (count.doAction("addsave") != RC_SUCCESS) {
                    throw "Add count record failed.";
                }
            } else {
                if (log.isDebug()) {
                    log.debug("update.count...");
                }
                if (count.doAction("save") != RC_SUCCESS) {
                    throw "Update count record failed.";
                }
            }
        },

        'svcCat.add.item.to.cart/init.itemcount': function() {

            if (log.isDebug()) {
                log.debug("init.itemcount...");
                log.debug("get.query...");
                log.debug("get.count...1");
            }

            var count = new SCFile("svcItemCount");
            var month = system.functions.month(tod());
            var year = system.functions.year(tod());
            var mode = "update";
            var sql = "item.name=\"" + this.item.name + "\" and month=" + month + " and year=" + year;

            var RC1 = count.doSelect(sql);
            if (RC1 != RC_SUCCESS) {
                if (log.isDebug()) {
                    log.debug("setup.new.count...");
                }
                count.itemId = parseInt(this.item.id);
                count["item.name"] = this.item.name;
                count.month = month;
                count.year = year;
                count._count = 1;
                mode = "add";
                count["non.cart"] = this.item["non.cart"] || false;

                //add.count
                try {
                    this['svcCat.add.item.to.cart/addorupdate.count'](count, mode);
                    return;
                } catch (ex) {
                    throw ex;
                }
            } else {
                if (log.isDebug()) {
                    log.debug("increment.count...");
                }
                count._count = count._count || 0;
                count._count = count._count + 1;
                count["non.cart"] = this.item["non.cart"] || false;

                //check.mode
                if (log.isDebug()) {
                    log.debug("check.mode...");
                }

                try {
                    this['svcCat.add.item.to.cart/addorupdate.count'](count, mode);
                    return;
                } catch (ex) {
                    throw ex;
                }
            }
        }
    };

    _handler._init();
}