var Instance = Backbone.Model.extend({

    _action:function(method, options) {
        var model = this;
        options = options || {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!==undefined) {
                options.callback(resp);
            }
        };
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },

    createsnapshot: function(options) {
        return this._action('snapshot', options);
    },

    pauseserver: function(options) {
        return this._action('pause', options);
    },

    unpauseserver: function(options) {
        return this._action('unpause', options);
    },

    suspendserver: function(options) {
        return this._action('suspend', options);
    },

    resumeserver: function(options) {
        return this._action('resume', options);
    },

    reboot: function(soft, options) {
        options = options || {};

        options.soft = soft;
        return this._action("reboot", options);
    },

    resize: function(flavor, options) {
        options = options || {};
        options.flavor = flavor;
        return this._action('resize', options);
    },

    confirmresize: function(options) {
        return this._action('confirm-resize', options);
    },

    revertresize: function(options) {
        return this._action('revert-resize', options);
    },

    changepassword: function(adminPass, options) {
        options = options || {};
        options.adminPass = adminPass;
        return this._action('change-password', options);
    },

    createimage: function(name, options) {
        options = options || {};
        options.name = name;
        return this._action('create-image', options);
    },

    vncconsole: function(options) {
        return this._action('get-vncconsole', options);
    },

    consoleoutput: function(options) {
        if (options === undefined) {
            options = {};
        }
        if (options.length === undefined) {
            options.length = 35;
        }
        return this._action('consoleoutput', options);
    },

    attachvolume: function(options) {
        if (options === undefined) {
            options = {};
        }
        return this._action('attachvolume', options);
    },

    detachvolume: function(options) {
        if (options === undefined) {
            options = {};
        }
        return this._action('detachvolume', options);
    },

    attachedvolumes: function(options) {
        if (options === undefined) {
            options = {};
        }
        return this._action('attachedvolumes', options);
    },

    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.createserver(model.get("name"), model.get("imageReg"), model.get("flavorReg"), model.get("key_name"),
                   model.get("user_data"), model.get("security_groups"), model.get("min_count"), model.get("max_count"),
                   model.get("availability_zone"), options.success, options.error);
                break;
            case "delete":
                JSTACK.Nova.deleteserver(model.get("id"), options.success, options.error);
                break;
            case "update":
                JSTACK.Nova.updateserver(model.get("id"), model.get("name"), options.success, options.error);
                break;
            case "read":
                JSTACK.Nova.getserverdetail(model.get("id"), options.success, options.error);
                break;
            case "reboot":
                if (options.soft !== undefined && options.soft) {
                    JSTACK.Nova.rebootserversoft(model.get("id"), options.success, options.error);
                } else {
                    JSTACK.Nova.rebootserverhard(model.get("id"), options.success, options.error);
                }
                break;
            case "resize":
                JSTACK.Nova.resizeserver(model.get("id"), options.flavor.id, options.success, options.error);
                break;
            case "snapshot":
                JSTACK.Nova.createsnapshot(model.get("id"), model.get("name"), options.success, options.error);
                break;
            case "confirm-resize":
                JSTACK.Nova.confirmresizedserver(model.get("id"), options.success, options.error);
                break;
            case "revert-resize":
                JSTACK.Nova.revertresizedserver(model.get("id"), options.success, options.error);
                break;
            case "pause":
                JSTACK.Nova.pauseserver(model.get("id"), options.success, options.error);
                break;
            case "unpause":
                JSTACK.Nova.unpauseserver(model.get("id"), options.success, options.error);
                break;
            case "suspend":
                JSTACK.Nova.suspendserver(model.get("id"), options.success, options.error);
                break;
            case "resume":
                JSTACK.Nova.resumeserver(model.get("id"), options.success, options.error);
                break;
            case "change-password":
                JSTACK.Nova.changepasswordserver(model.get("id"), options.adminPass, options.success, options.error);
                break;
            case "create-image":
                UTILS.SM.createimage(model.get("id"), options.name, undefined, options.success, options.error);
                break;
            case "get-vncconsole":
                JSTACK.Nova.getvncconsole(model.get("id"), "novnc", options.success, options.error);
                break;
            case "consoleoutput":
                JSTACK.Nova.getconsoleoutput(model.get("id"), options.length, options.success, options.error);
                break;
            case "attachvolume":
                JSTACK.Nova.attachvolume(model.get("id"), options.volume_id, options.device, options.success, options.error);
                break;
            case "detachvolume":
                JSTACK.Nova.detachvolume(model.get("id"), options.volume_id, options.success, options.error);
                break;
            case "attachedvolumes":
                JSTACK.Nova.getattachedvolumes(model.get("id"), options.success, options.error);
                break;
        }
    },

    parse: function(resp) {
        if (resp.server !== undefined) {
            return resp.server;
        } else {
            return resp;
        }
    }
});

var Instances = Backbone.Collection.extend({

    model: Instance,

    sync: function(method, model, options) {
        if (method === "read") {
            JSTACK.Nova.getserverlist(true, this.alltenants, options.success);
        }
    },

    parse: function(resp) {
        return resp.servers;
    }

});