var EditSecurityGroupRulesView = Backbone.View.extend({

    _template: _.itemplate($('#editSecurityGroupRulesFormTemplate').html()),

    tableView: undefined,

    events: {
        'click #closeModal': 'close',
        'click #deleteRuleBtn': 'deleteRule',
        'click #cancel': 'close',
        'submit #rulesForm': 'createRule',
        'click .editSecGroup': 'close',
        'click #from_port': 'showTooltipFromPort',
        'click #to_port': 'showTooltipToPort',
        'click #cidr': 'showTooltipCidr',
        'change .secGroupSelect': 'dissapearCIDR',
        'change .IPProtocolSelect': 'changeInputs'
    },

    initialize: function() {
        var self = this;
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [];
    },

    getDropdownButtons: function() {
        return [];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            name: "IP Protocol",
            tooltip: "TCP, UDP, ...",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "From Port",
            tooltip: "Min port number",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "To Port",
            tooltip: "Max port number",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Source",
            tooltip: "Source address",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Action",
            tooltip: "Available actions",
            size: "20%",
            hidden_phone: false,
            hidden_tablet: false
        }];
    },

    getEntries: function() {
        var entries = [];
        var securityGroupsModel = this.model.get(this.options.securityGroupId);
        console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
        console.log(this.options.securityGroupId);
        console.log(securityGroupsModel);
        var securityGroupRules;
/*        for (var i in securityGroupsModel.get('rules')) {
            securityGroupRules = securityGroupsModel.get('rules')[i];
            if (securityGroupRules.from_port === null || securityGroupRules.ip_protocol === null) {
                continue;
            }
            var entry = {
                id: securityGroupRules.id,
                cells: [{
                    value: securityGroupRules.ip_protocol.toUpperCase()
                }, {
                    value: securityGroupRules.from_port
                }, {
                    value: securityGroupRules.to_port
                }, {
                    value: securityGroupRules.group.name !== undefined ? securityGroupRules.group.name : securityGroupRules.ip_range.cidr+" (CIDR)"
                }, {
                    value: '<button type="button" id="deleteRuleBtn" value="' + securityGroupRules.id + '" class="ajax-modal btn btn-small btn-blue btn-delete btn-danger"  data-i18n="Delete Rule">Delete Rule</button>'
                }]
            };
            entries.push(entry);
        }*/
        var ingress_fmt = [];
        for(var i in securityGroupsModel.get('ingress')){

            var rule = securityGroupsModel.get('ingress')[i];
            if (rule.portRange === null || rule.ipProtocol === null) {
                continue;
            }

            if(rule.action.toUpperCase() != 'ACCEPT')
                continue;

            if(rule.portRange === '' || rule.portRange === null ) {
                console.log("error");
            }else if(rule.portRange.split(',')[1] != undefined) {
                    //console.log(", 格式");
                    for( j in rule.portRange.split(',')){
                        var rule_j = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange.split(',')[j],
                            to_port:rule.portRange.split(',')[j],
                            ipProtocol: rule.ipProtocol
                        }
                        ingress_fmt.push(rule_j);
                    }
            } else if(rule.portRange.split('-')[1] != undefined){
                //console.log("range");
                var rule_j = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange.split('-')[0],
                            to_port:rule.portRange.split('-')[1],
                            ipProtocol: rule.ipProtocol
                }
                ingress_fmt.push(rule_j);
            }else {
                //console.log("unkown format");
                var rule_j = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange,
                            to_port:rule.portRange,
                            ipProtocol: rule.ipProtocol
                }
                ingress_fmt.push(rule_j);
            }
        }
        //console.log(ingress_fmt);
        for (var i in ingress_fmt) {
            securityGroupRules = ingress_fmt[i];

            var entry = {
                id: securityGroupRules.id,
                cells: [{
                    value: securityGroupRules.ipProtocol.toUpperCase()
                }, {
                    value: securityGroupRules.from_port
                }, {
                    value: securityGroupRules.to_port
                }, {
                    value: securityGroupRules.cidrIp +" (CIDR)"
                }, {
                    value: '<button type="button" id="deleteRuleBtn" value="' + securityGroupRules.index + '" class="ajax-modal btn btn-small btn-blue btn-delete btn-danger"  data-i18n="Delete Rule">Delete Rule</button>'
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onAction: function(action, ruleIds) {

    },

    render: function() {
        $(this.el).append(this._template({
            model: this.model,
            securityGroupId: this.options.securityGroupId
        }));
        $('.modal:last').modal();
        $('.modal-backdrop').addClass("editSecGroup");
        this.tableView = new TableView({
            model: this.model,
            el: '#edit_security_group_rules',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
        return this;
    },

    autoRender: function() {

 /*          $(this.el).find("#edit_security_group_rule").remove();
     $(this.el).append(self._template({
            model: this.model,
            securityGroupId: this.options.securityGroupId
        }));*/
        this.tableView.render();
    },

    close: function(e) {
        this.onClose();
    },

    onClose: function() {
        $('#edit_security_group_rule').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
        this.tableView.close();
    },

    showTooltipFromPort: function() {
        $('#from_port').tooltip('show');
    },

    showTooltipToPort: function() {
        $('#to_port').tooltip('show');
    },

    showTooltipCidr: function() {
        $('#cidr').tooltip('show');
    },

    dissapearCIDR: function(e) {
        if ($('.secGroupSelect :selected').val() !== 'CIDR') {
            $('.cidrSelect').hide();
        } else {
            if ($('.cidrSelect:hidden')) {
                $('.cidrSelect').show();
            }
        }
    },

    changeInputs: function(e) {
        if ($('.IPProtocolSelect :selected').val() == 'ICMP') {
            // $("label[for='from_port']").text("Type");
            // $("label[for='to_port']").text("Code");
            $("#from_port").prop('max', 255);
            $("#from_port").prop('min', -1);
            $("#to_port").prop('max', 255);
            $("#to_port").prop('min', -1);
        } else {
            $("label[for='from_port']").text("From Port*");
            $("label[for='to_port']").text("To Port*");
            $("#from_port").prop('max', 65535);
            $("#from_port").prop('min', -1);
            $("#to_port").prop('max', 65535);
            $("#to_port").prop('min', -1);
        }
    },

    deleteRule: function(e) {
        self = this;
        var secGroupRuleId = e.target.value;
        var securityGroupsModel = this.model.get(this.options.securityGroupId);

        var subview = new ConfirmView({
            el: 'body',
            title: "Delete Security Group Rule",
            btn_message: "Delete Security Group Rule",
            onAccept: function() {
                securityGroupsModel.deleteSecurityGroupRule(secGroupRuleId, {
                    callback: function(resp) {
                        securityGroupsModel.fetch({
                            success: function(resp) {
                                self.autoRender();
                                var subview2 = new MessagesView({
                                    state: "Success",
                                    title: "Security Group Rule deleted.",
                                    el: "#log-messages-rules"
                                });
                                subview2.render();
                            }, error: function(model, resp) {
                                var subview3 = new MessagesView({
                                    state: "Error", title: "Error deleting security group rule. Cause: " + resp.message, info: resp.body,
                                    el: "#log-messages-rules"
                                });
                                subview3.render();
                            }
                        });
                    }
                });
            }
        });
        subview.render();
    },

    createRule: function(e) {
        console.log("Creating rule");
        e.preventDefault();
        self = this;

        var cidrOK, fromPortOK, toPortOK;
	// Derived from "Regular Expressions Cookbook, 2nd Edition" by
	// Jan Goyvaerts and Steven Levithan, O'Reilly Media.
	// Copyright Jan Goyvaerts and Steven Levithan, 2012, ISBN
	// 978-1-449-31943-4.
        var cidr_pattern = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\/(3[012]|[012]?\d)$|^\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\/(1([01]\d|2[0-8])|\d\d?)$/i;
        //var portPattern = /^([1-65535]){1,5}$/;
        //var icmpPattern = /^([\-1-255]){1,3}$/;

        var parentGroupId = this.options.securityGroupId;
        var ipProtocol = $('.IPProtocolSelect :selected').val();
        var fromPort = $('input[name=fromPort]').val();
        var toPort = $('input[name=toPort]').val();
        var sourceGroup = $('.secGroupSelect :selected').val();
        var cidr = $('input[name=cidr]').val();
        console.log('9999999999999999999');
        console.log(ipProtocol,fromPort,toPort,cidr);
        var subview;

        cidrOK = cidr_pattern.test(cidr);
        fromPortOK = (fromPort >= -1 && fromPort <= 65535);
        toPortOK = (toPort >= -1 && toPort <= 65535);

        var securityGroupsModel = self.model.get(this.options.securityGroupId);
//////////////////////////////
        var ingress_fmt = [];
        for(var i in securityGroupsModel.get('ingress')){

            var rule = securityGroupsModel.get('ingress')[i];
            if (rule.portRange === null || rule.ipProtocol === null) {
                continue;
            }

            if(rule.action.toUpperCase() != 'ACCEPT')
                continue;

            if(rule.portRange === '' || rule.portRange === null ) {
                console.log("error");
            }else if(rule.portRange.split(',')[1] != undefined) {
                    //console.log(", 格式");
                    for( j in rule.portRange.split(',')){
                        var rule_j = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange.split(',')[j],
                            to_port:rule.portRange.split(',')[j],
                            ipProtocol: rule.ipProtocol
                        }
                        ingress_fmt.push(rule_j);
                    }
            } else if(rule.portRange.split('-')[1] != undefined){
                //console.log("range");
                var rule_a = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange.split('-')[0],
                            to_port:rule.portRange.split('-')[1],
                            ipProtocol: rule.ipProtocol
                }
                ingress_fmt.push(rule_a);
            }else {
                //console.log("unkown format");
                var rule_b = {
                            index:rule.index,
                            cidrIp: rule.cidrIp,
                            from_port: rule.portRange,
                            to_port:rule.portRange,
                            ipProtocol: rule.ipProtocol
                }
                ingress_fmt.push(rule_b);
            }
        }
/////////////////////////////


        for (var index in ingress_fmt) {
            var securityGroupRules = ingress_fmt[index];
            if (securityGroupRules.ip_protocol === null) {
                continue;
            }
            var thisIpProtocol = securityGroupRules.ipProtocol.toUpperCase();
            var thisFromPort = securityGroupRules.from_port;
            var thisToPort = securityGroupRules.to_port;
 //           var thisSourceGroup = securityGroupRules.group.name;
            var thisCidr = securityGroupRules.cidrIp;

            if ((ipProtocol === thisIpProtocol) && (fromPort === thisFromPort) && (toPort === thisToPort)) {
                console.log("first three equal");
                //if ((sourceGroup == thisSourceGroup) || (cidr == thisCidr)) {
                if(cidr == thisCidr)
                    subview = new MessagesView({
                        state: "Error",
                        title: "Security Group Rule already exists. Please try again.",
                        el: "#log-messages-rules"
                    });
                    subview.render();
                    return false;
                }
        }

        if (cidrOK && fromPortOK && toPortOK) {
 /*           if ($('.secGroupSelect :selected').val() !== 'CIDR') {
                securityGroupsModel.createSecurityGroupRule(ipProtocol, fromPort, toPort, "", sourceGroup, parentGroupId, {
                    callback: function(resp) {
                        securityGroupsModel.fetch({
                            success: function(resp) {
                                self.autoRender();
                                subview = new MessagesView({
                                    state: "Success",
                                    title: "Security group rule created.",
                                    el: "#log-messages-rules"
                                });
                                subview.render();
                            },
                            error: function(model, resp) {
                                var subview3 = new MessagesView({
                                    state: "Error", title: "Error creating security group rule. Cause: " + resp.message, info: resp.body,
                                    el: "#log-messages-rules"
                                });
                                subview3.render();
                            }
                        });
                    }
                });
            } else {*/

                securityGroupsModel.createSecurityGroupRule(ingress_fmt.length === 0?-1:ingress_fmt.length,ipProtocol, fromPort, toPort, cidr, {
                    callback: function(resp) {
                        securityGroupsModel.fetch({
                            success: function(resp) {
                                self.autoRender();
                                subview = new MessagesView({
                                    state: "Success",
                                    title: "Security group rule created.",
                                    el: "#log-messages-rules"
                                });
                                subview.render();
                            }, error: function(model, resp) {
                                var subview3 = new MessagesView({
                                    state: "Error", title: "Error creating security group rule. Cause: " + resp.message, info: resp.body,
                                    el: "#log-messages-rules"
                                });
                                subview3.render();
                            }
                        });
                    }
                });
           // }

        } else {
            subview = new MessagesView({
                state: "Error",
                title: "Wrong input values for Security Group Rule. Please try again.",
                el: "#log-messages-rules"
            });
            subview.render();
        }
    }
});