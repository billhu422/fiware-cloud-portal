var SecurityGroup = Backbone.Model.extend({

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
          //console.log("Success");
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

/*    readSecurityGroupRuleDetails:function (options) {
        return this._action('read',options);
    },*/

    createSecurityGroupRule: function(ruleId,ip_protocol, from_port, to_port, cidr, options) {
        options = options || {};
        options.ipProtocol = ip_protocol;
        options.from_port = from_port;
        options.to_port = to_port;
        options.cidrIp = cidr;
        options.ruleId = ruleId;
        return this._action('createSecurityGroupRule', options);
    },

    deleteSecurityGroupRule: function(sec_group_rule_id, options) {
        //console.log("Delete security group rule");
        options = options || {};
        options.secGroupRuleId = sec_group_rule_id;
        return this._action('deleteSecurityGroupRule', options);
    },

    getSecurityGroupforServer: function(server_id, options) {
       //console.log("Get security groups for server");
        options = options || {};
        options.serverId = server_id;
        return this._action('getSecurityGroupforServer', options);
    },

    sync: function(method, model, options) {
           switch(method) {
               case "read":
                   //JSTACK.Nova.getsecuritygroupdetail(model.get("id"), options.success, options.error, this.getRegion());
                   OTHERCLOUD.API.describeSecurityGroupDetail(model.get('instanceId'),model.get('region'),options.success, options.error);
                   break;
               case "delete":
                   //JSTACK.Nova.deletesecuritygroup(model.get("id"), options.success, options.error, this.getRegion());
                   OTHERCLOUD.API.delSecurityGroup(model.get("instanceId"),model.get("region"),options.success, options.error);
                   break;
               case "create":
/*               console.log("Creating, ", options.success);
               console.log('****************************************');
               console.log(this.getRegion());
               console.log('****************************************');*/
                   //JSTACK.Nova.createsecuritygroup( model.get("name"), model.get("description"), options.success, options.error, this.getRegion());
                   OTHERCLOUD.API.createSecurityGroup(model.get("name"),this.getRegion(),model.get("description"),options.success, options.error);
                   break;
               case "createSecurityGroupRule":
               //console.log(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id);
                   //JSTACK.Nova.createsecuritygrouprule(options.ip_protocol, options.from_port, options.to_port, options.cidr, options.group_id, options.parent_group_id, options.success, options.error, this.getRegion());
                   OTHERCLOUD.API.createSecurityGroupRule(model.get('instanceId'),this.getRegion(),'ingress',options.ruleId,
                       options.ipProtocol,options.cidrIp,options.from_port,options.to_port,'accept',options.success, options.error);
                   break;
                case "deleteSecurityGroupRule":
                   //JSTACK.Nova.deletesecuritygrouprule(options.secGroupRuleId, options.success, options.error, this.getRegion());
                    OTHERCLOUD.API.delSecurityGroupRule(model.get('instanceId'),model.get('region'),'ingress',options.secGroupRuleId,options.success, options.error);
                   break;
                case "getSecurityGroupforServer":
                    mySuccess = function(object) {
                        var obj = {};
                        obj.object = object;
                        return options.success(obj);
                    };
                   JSTACK.Nova.getsecuritygroupforserver(options.serverId, mySuccess, options.error, this.getRegion());
                   break;
           }
    },

    parse: function(resp) {
        resp.id = resp.orderId + '-' + resp.orderItemId + '-' + resp.instanceId;
/*        if (resp.security_group !== undefined) {
            return resp.security_group;
        } else {
            return resp;
        }*/
        return resp;
    }
});

var SecurityGroups = Backbone.Collection.extend({
    model: SecurityGroup,

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if(method === "read") {
            //JSTACK.Nova.getsecuritygrouplist(options.success, options.error, this.getRegion());
            OTHERCLOUD.API.describeSecurityGroup( this.getRegion(),options.success, options.error);
        }
    },

    parse: function(resp) {
        resp.instanceInfos.forEach(function(instance){
            instance.id = instance.orderId + '-' + instance.orderItemId + '-' + instance.instanceId;
        });
        return resp.instanceInfos;
    }

});