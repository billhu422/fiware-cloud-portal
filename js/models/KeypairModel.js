var Keypair = Backbone.Model.extend({

    initialize: function() {
      //this.id = this.get("name");
        this.id = this.get("id");
    },

    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },
    destroy: function(options) {
        return this._action('delete', options);
    },

    _action:function(method, options) {
        var model = this;
        options = options || {};
        var error = options.error;
        options.success = function(resp) {
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

    sync: function(method, model, options) {
           switch(method) {
               case "create":
                   //JSTACK.Nova.createkeypair(model.get("name"), model.get("public_key"), options.success, options.error, this.getRegion());
                   console.log('create keypair:' + model.get("name") + '/' + model.get("public_key"));
                   OTHERCLOUD.API.createQcloudKeypair(model.get("name"),this.getRegion(),model.get("public_key"),options.success, options.error);
                   break;
               case "delete":
                   //JSTACK.Nova.deletekeypair(model.get("name"), options.success, options.error, this.getRegion());
                   OTHERCLOUD.API.delQcloudKeypair(model.get("instanceId"),model.get("region"),options.success, options.error);
                   break;
           }
   }


});

var Keypairs = Backbone.Collection.extend({
    model: Keypair,
    
    region: undefined,

    getRegion: function() {
        if (this.region) {
            return this.region;
        }
        return UTILS.Auth.getCurrentRegion();
    },

    sync: function(method, model, options) {
        if (method === "read") {
            //JSTACK.Nova.getkeypairlist(options.success, options.error, this.getRegion());
            OTHERCLOUD.API.describeQcloudKeypair(this.getRegion(),options.success, options.error)
        }
    },

    parse: function(resp) {
        resp.instanceInfos.forEach(function (keypair) {
            keypair.id = keypair.orderId + '-' + keypair.orderItemId + '-' + keypair.instanceId;
        });

        console.log(resp.instanceInfos);
        return resp.instanceInfos;
    }
});