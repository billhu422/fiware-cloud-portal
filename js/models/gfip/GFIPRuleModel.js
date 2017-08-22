
var GFIPRuleModel = Backbone.Model.extend({

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    _action:function(method, options) {
        var model = this;
        options = options || {};
        var error = options.error;
        options.success = function(resp) {
            console.log("Success");
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        options.error = function(resp) {
            model.trigger('error', model, resp, options);
            if (error!==undefined) {
                error(model, resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    createSecurityGroupRule: function(ip_protocol, from_port, to_port, cidr, group_id, parent_group_id, options) {
        options = options || {};
        options.ip_protocol = ip_protocol;
        options.from_port = from_port;
        options.to_port = to_port;
        options.cidr = cidr;
        options.group_id = group_id;
        options.parent_group_id = parent_group_id;
        return this._action('createSecurityGroupRule', options);
    },

    deleteSecurityGroupRule: function(sec_group_rule_id, options) {
        console.log("Delete security group rule");
        options = options || {};
        options.secGroupRuleId = sec_group_rule_id;
        return this._action('deleteSecurityGroupRule', options);
    },

    getSecurityGroupforServer: function(server_id, options) {
        console.log("Get security groups for server");
        options = options || {};
        options.serverId = server_id;
        return this._action('getSecurityGroupforServer', options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                //       JSTACK.Nova.getsecuritygroupdetail(model.get("id"), options.success, options.error, this.getRegion());
                break;
            case "delete":
                //     JSTACK.Nova.deletesecuritygroup(model.get("id"), options.success, options.error, this.getRegion());
                break;
            case "create":
                console.log("Creating, ", options.success);
                //     JSTACK.Nova.createsecuritygroup( model.get("name"), model.get("description"), options.success, options.error, this.getRegion());
                break;
            case "createSecurityGroupRule":
                //console.log(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id);
                //     JSTACK.Nova.createsecuritygrouprule(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id, options.success, options.error, this.getRegion());
                break;
            case "deleteSecurityGroupRule":
                //     JSTACK.Nova.deletesecuritygrouprule(options.secGroupRuleId, options.success, options.error, this.getRegion());
                break;
            case "getSecurityGroupforServer":
                mySuccess = function(object) {
                    var obj = {};
                    obj.object = object;
                    return options.success(obj);
                };
                //   JSTACK.Nova.getsecuritygroupforserver(options.serverId, mySuccess, options.error, this.getRegion());
                break;
        }
    },

    parse: function(resp) {
        if (resp.security_group !== undefined) {
            return resp.security_group;
        } else {
            return resp;
        }
    }
});

var GFIPRuleModels = Backbone.Collection.extend({
    model: GFIPRuleModel,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    getRuleList:function(parent_id,obj){
        var options = options || {};
        options.parent_id = parent_id;
        options.obj = obj;
        return this._action('getList', options);
    },

    delRule:function(ruleId,obj){
        var tag = confirm("确定要删除吗？");
        if(tag){
            var options = options || {};
            options.ruleId = ruleId;
            options.obj = obj;
            return this._action('delRule', options);
        }
    },

    addRule:function(context,obj){
        var options = options || {};
        options.context = context;
        options.obj = obj;
        return this._action('addRule', options);
    },

    _action:function(method, options) {
        var model = this;
        options = options || {};
        var error = options.error;
        options.parse = this.parse;
        options.success = function(resp) {
            options.obj.model.reset();
            options.obj.model.set(options.parse(resp));
            options.obj.proRender();
        };
        options.error = function(resp) {
            model.trigger('error', model, resp, options);
            if (error!==undefined) {
                error(model, resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    sync: function(method, model, options) {
        switch(method) {
            case "read":
            break;
            case "getList":
                OTHERCLOUD.API.getRuleList(model, options.success, options.error, options,this.getRegion());
            break;
            case "delRule":
                OTHERCLOUD.API.delRule(model, options.success, options.error, options,this.getRegion());
            break;
            case "addRule":
                OTHERCLOUD.API.addRule(model, options.success, options.error, options,this.getRegion());
            break;
        }

    },

    parse: function(resp) {
        resp.gfipRules.forEach(function(instance){
            instance.operate = "<button id=\'delRule\' class=\'btn btn-blue pull-right\' attrId='"+instance.id+"'>删除规则</button>";
        });
        return resp.gfipRules;
    }

});
