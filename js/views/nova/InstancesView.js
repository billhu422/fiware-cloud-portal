var NovaInstancesView = Backbone.View.extend({

    _template: _.itemplate($('#novaInstancesTemplate').html()),

    tableView: undefined,
    initialize: function() {
        this.options.projects = UTILS.GlobalModels.get("projects");
        this.options.keypairs = UTILS.GlobalModels.get("keypairsModel");
        this.options.flavors = UTILS.GlobalModels.get("flavors");
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        this.renderFirst();
    },

    getMainButtons: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        return [{
            label: "Launch New Instance",
            url: "#nova/images/"
        }];
    },

    getDropdownButtons: function() {
        // dropdown_buttons: [{label:label, action: action_name}]
        var self = this;
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        var groupSelected = function(size, id) {
            if (size >= 1) {
                return true;
            }
        };
        var activeSelected = function(size, id) {
            if (size === 1) {
                var entry = self.model.get(id);
                if (entry.get("status") !== "PAUSED" && entry.get("status") !== "SUSPENDED") {
                    return true;
                }
            }
        };
        var activeGroupSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") === "PAUSED" || entry.get("status") === "SUSPENDED" || entry.get("status") === "SHUTOFF") {
                        return false;
                    }
                }
                return true;
            }
        };
        var pausedSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") !== "PAUSED") {
                        return false;
                    }
                }
                return true;
            }
        };
        var suspendedSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") !== "SUSPENDED") {
                        return false;
                    }
                }
                return true;
            }
        };
        var stoppedSelected = function(size, ids) {
            if (size >= 1) {
                for (var id in ids) {
                    var entry = self.model.get(ids[id]);
                    if (entry.get("status") !== "SHUTOFF") {
              //          return false;
                        return true;
                    }
                }
                return true;
            }
        };
        return [{
            label: "Edit Instance",
            action: "edit",
            activatePattern: oneSelected
        }, {
            label: "Connect to Instance",
            action: "vnc",
            activatePattern: oneSelected
        }, {
            label: "View Log",
            action: "log",
            activatePattern: oneSelected
        }, {
            label: "Create Snapshot",
            action: "snapshot",
            activatePattern: oneSelected
        }, {
            label: "Pause Instance",
            action: "pause",
            activatePattern: activeGroupSelected
        }, {
            label: "Unpause Instance",
            action: "unpause",
            activatePattern: pausedSelected
        }, {
            label: "Suspend Instance",
            action: "suspend",
            activatePattern: activeGroupSelected
        }, {
            label: "Resume Instance",
            action: "resume",
            activatePattern: suspendedSelected
        }, {
            label: "Stop Instance",
            action: "stop",
            activatePattern: activeGroupSelected
        }, {
            label: "Start Instance",
            action: "start",
            activatePattern: stoppedSelected
        },{
            label: "Change Password",
            action: "password",
            warn: true,
            activatePattern: activeSelected
        }, {
            label: "Reboot Instance",
            action: "reboot",
            warn: true,
            activatePattern: groupSelected
        }, {
            label: "Terminate Instance",
            action: "terminate",
            warn: true,
            activatePattern: groupSelected
        }];
    },

    getHeaders: function() {
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        return [{
            type: "checkbox",
            size: "5%"
        }, {
            name: "Instance Name",
            tooltip: "Server's name",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "IP Address",
            tooltip: "IP Address",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            tooltip: "Server's RAM, number of virtual CPUs, and user disk",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Keypair",
            tooltip: "ssh credentials for the instance",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "Current server status",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Task",
            tooltip: "Current tasks performed on the server",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }/*,
 {
            name: "Power State",
            tooltip: "Server's power state",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }*/
      ];
    },

    getEntries: function() {
               //qcloud
        var VM_STATUS = {
            1: "Error",
            2: "RUNNING",
            3: "BUILDING",
            4: "SHUTOFF",
            5: "RETURNED",
            6: "RETURNING",
            7: "REBOOTING",
            8: "STARTING",
            9: "SHUTING OFF",
           10: "PASSWD RESETING",
           11: "FORMATING",
           12: "BUILDING IMG",
           13: "SETTING BANDWIDTH",
           14: "REINSTALLING",
           15: "BINGDING DN",
           16: "UNBINGDING DN",
           17: "BINGDING LB",
           18: "UNBINGDING LB",
           19: "UPGRADING",
           20: "ISSUING KEY"
         };
       var entries = [];
       var entry = {};
       for (var instance_idx1 in this.model.models) {
            console.log("got it ........");     
            var instance1 = this.model.models[instance_idx1];
            console.log(instance1);
       
            entry = {
                id: instance1.cid,
                cells: [{
                    value: instance1.get("unInstanceId"),
                    link: "#nova/instances/" + "112233" + "/detail",
                    tooltip: "InsName"
                }, {
                    value: instance1.get("lanIp")
                }, {
                    value: instance1.get("cpu") + " VCPU" + "|" + instance1.get("mem") + "GB RAM"   
                }, {
                    value: "key"
                }, {
                    value: VM_STATUS[instance1.get("status")]
                }, {
                    value:  "None"
                }
              /* , {
                    value: "powner stateaaa"
                }*/
               ]
            };
        }
        entries.push(entry);
        return entries;

        var flavorlist = {};
        for (var index in this.options.flavors.models) {
            var flavor = this.options.flavors.models[index];
            flavorlist[flavor.id] = flavor.get("ram") + " MB RAM | " + flavor.get("vcpus") + " VCPU | " + flavor.get("disk") + "GB Disk";
        }
        var POWER_STATES = {
            0: "NO STATE",
            1: "RUNNING",
            2: "BLOCKED",
            3: "PAUSED",
            4: "SHUTDOWN",
            5: "SHUTOFF",
            6: "CRASHED",
            7: "SUSPENDED",
            8: "FAILED",
            9: "BUILDING"
        };
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        //var entries = [];
        for (var instance_idx in this.model.models) {
             var instance = this.model.models[instance_idx];
            var addresses;
            var address = "";

            if (JSTACK.Keystone.getendpoint(UTILS.Auth.getCurrentRegion(), "network") !== undefined) {
                if (instance.get("addresses") != null) {
                    addresses = instance.get("addresses");
                    for (var i in addresses) {
                        var ips = addresses[i];
                        for (var j in ips) {
                            var ip = ips[j].addr;
                            address += ip + "<br/>";
                        }
                    }
                }
            } else {
                if ((instance.get("addresses") != null) && (instance.get("addresses")["public"] !== null || instance.get("addresses")["private"] !== null)) {
                    addresses = instance.get("addresses")["public"];
                    for (var addr_idx in addresses) {
                        address += addresses[addr_idx].addr + "<br/>";
                    }
                    addresses = instance.get("addresses")["private"];
                    for (var addr_idx2 in addresses) {
                        address += addresses[addr_idx2].addr + "<br/>";
                    }
                }
            }
            //var entry = {
             entry = {
                id: instance.get('id'),
                cells: [{
                    value: instance.get("name"),
                    link: "#nova/instances/" + instance.id + "/detail",
                    tooltip: instance.get("name")
                }, {
                    value: address
                }, {
                    value: flavorlist[instance.get("flavor").id]
                }, {
                    value: instance.get("key_name")
                }, {
                    value: instance.get("status")
                }, {
                    value: instance.get("OS-EXT-STS:task_state") ? instance.get("OS-EXT-STS:task_state") : "None"
                }, {
                    value: POWER_STATES[instance.get("OS-EXT-STS:power_state")]
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onClose: function() {
        this.tableView.close();
        this.undelegateEvents();
        this.unbind();
        this.model.unbind("sync", this.render, this);
    },

    onAction: function(action, instanceIds) {
        console.log("action 1 ....");
        console.log(instanceIds);
        console.log(instanceIds[0]);
        console.log("action 2 ....");
        var instance, inst, subview;
        var self = this;
        if (instanceIds.length === 1) {
            instance = instanceIds[0];
            inst = this.model.get(instance);
        }
        console.log('ACTIOOOOOOOOOOOn', action, instance);
        switch (action) {
            case 'edit':
                subview = new UpdateInstanceView({
                    el: 'body',
                    model: inst
                });
                subview.render();
                break;
            case 'vnc':
                window.location.href = '#nova/instances/' + instance + '/detail?view=vnc';
                break;
            case 'log':
                window.location.href = '#nova/instances/' + instance + '/detail?view=log';
                break;
            case 'snapshot':
                subview = new CreateSnapshotView({
                    el: 'body',
                    model: this.model.get(instance)
                });
                subview.render();
                break;
            case 'password':
                subview = new ChangePasswordView({
                    el: 'body',
                    model: inst
                });
                subview.render();
                break;
            case 'pause':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Pause Instances",
                    btn_message: "Pause Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.pauseserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " paused.", "Error pausing instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'unpause':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Unpause Instances",
                    btn_message: "Unpause Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.unpauseserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " unpaused.", "Error unpausing instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'stop':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Stop Instances",
                    btn_message: "Stop Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            console.log("eeeeeeeeeeeeech");
                            console.log(instance);
                            inst = self.model.get(instance);
                            console.log(inst);
                            //inst.stopserver(UTILS.Messages.getCallbacks("Instance a "+inst.get("name") + " stopped.", "Error stopping instance "+inst.get("name")));
                            console.log("view stop!!!!");
                            //inst.stopserver(UTILS.Messages.getCallbacks("Instance a "+inst.get("unInstanceId") + " stopped.", "Error stopping instance "+inst.get("unInstanceId")));
                            inst.stopserver(undefined);
                        });
                    }
                });
                subview.render();
                break;
            case 'start':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Start Instances",
                    btn_message: "Start Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            console.log("start vm ...");
                            inst = self.model.get(instance);
                            //inst.startserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " started.", "Error starting instance "+inst.get("name")));
                            //inst.startserver(UTILS.Messages.getCallbacks("Instance a "+inst.get("unInstanceId") + " started.", "Error starting instance "+inst.get("unInstanceId")));
                            inst.startserver(undefined);
                        });
                    }
                });
                subview.render();
                break;
            case 'suspend':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Suspend Instances",
                    btn_message: "Suspend Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.suspendserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " suspended.", "Error suspending instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'resume':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Resume Instances",
                    btn_message: "Resume Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.resumeserver(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " resumed.", "Error resuming instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'reboot':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Reboot Instances",
                    btn_message: "Reboot Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.reboot(true, UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " rebooted.", "Error rebooting instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            case 'terminate':
                subview = new ConfirmView({
                    el: 'body',
                    title: "Terminate Instances",
                    btn_message: "Terminate Instances",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.destroy(UTILS.Messages.getCallbacks("Instance "+inst.get("name") + " terminated.", "Error terminating instance "+inst.get("name")));
                        });
                    }
                });
                subview.render();
                break;
            default:
                break;
        }
    },

    renderFirst: function() {
        UTILS.Render.animateRender(this.el, this._template, {
            models: this.model.models,
            flavors: this.options.flavors
        });
        this.tableView = new TableView({
            model: this.model,
            el: '#instances-table',
            onAction: this.onAction,
            getDropdownButtons: this.getDropdownButtons,
            getMainButtons: this.getMainButtons,
            getHeaders: this.getHeaders,
            getEntries: this.getEntries,
            context: this
        });
        this.tableView.render();
    },

    render: function() {
	console.log("renderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        console.log(this.model.models);
	console.log("renderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }

});
