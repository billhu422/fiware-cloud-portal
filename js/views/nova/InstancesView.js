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
            //label: "Launch New Instance",
            label: "创建新实例",
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
            //label: "Edit Instance",
            label: "编辑实例",
            action: "edit",
            activatePattern: oneSelected
        }, {
            //label: "Connect to Instance",
            label: "连接到实例",
            action: "vnc",
            activatePattern: oneSelected
        }, {
            label: "查看日志",
            action: "log",
            activatePattern: oneSelected
        }, {
            label: "创建镜像",
            action: "snapshot",
            activatePattern: oneSelected
        }, {
            label: "暂停实例",
            action: "pause",
            activatePattern: activeGroupSelected
        }, {
            label: "(暂停)恢复实例",
            action: "unpause",
            activatePattern: pausedSelected
        }, {
            label: "挂起实例",
            action: "suspend",
            activatePattern: activeGroupSelected
        }, {
            label: "(挂起)恢复实例",
            action: "resume",
            activatePattern: suspendedSelected
        }, {
            label: "关闭实例",
            action: "stop",
            activatePattern: activeGroupSelected
        }, {
            label: "启动实例",
            action: "start",
            activatePattern: stoppedSelected
        },{
            label: "更改密码",
            action: "password",
            warn: true,
            activatePattern: activeSelected
        }, {
            label: "重启实例",
            action: "reboot",
            warn: true,
            activatePattern: groupSelected
        }, {
            label: "删除实例",
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
            tooltip: "实例名称",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "IP Address",
            tooltip: "IP 地址",
            size: "10%",
            hidden_phone: true,
            hidden_tablet: false
        }, {
            name: "Size",
            //tooltip: "Server's RAM, number of virtual CPUs, and user disk",
            tooltip: "实例的内存，VCPU数量以及硬盘空间",
            size: "25%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "秘钥对",
            //tooltip: "ssh credentials for the instance",
            tooltip: "实例的ssh信任凭证",
            size: "15%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "Status",
            tooltip: "实例当前状态",
            size: "10%",
            hidden_phone: false,
            hidden_tablet: false
        }, {
            name: "云服务商",
            //tooltip: "Current tasks performed on the server",
            tooltip: "提供云服务的厂商",
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
/*
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
*/
        var VM_STATUS = {
            1: "故障",
            2: "运行中",
            3: "创建中",
            4: "已关机",
            5: "已退还",
            6: "退还中",
            7: "重启中",
            8: "开机中",
            9: "关机中",
           10: "密码重置中",
           11: "格式化中",
           12: "镜像制作中",
           13: "宽带设置中",
           14: "重装系统中",
           15: "域名绑定中",
           16: "域名解绑中",
           17: "负载均衡绑定中",
           18: "负载均衡解绑中",
           19: "升级中",
           20: "秘钥下发中"
         };

       var entries = [];
       var entry = {};
       for (var instance_idx1 in this.model.models) {
            console.log("got it ........");     
            var instance1 = this.model.models[instance_idx1];
            console.log(instance1);
       
            entry = {
                id: instance1.id,
                cells: [{
                    value: instance1.get("id"),
                    link: "#nova/instances/" + "112233" + "/detail",
                    tooltip: "实例名称"
                }, {
                    value: instance1.get("lanIp")
                }, {
                    value: instance1.get("cpu") + " VCPU" + "|" + instance1.get("mem") + "GB RAM"   
                }, {
                    value: "空"
                }, {
                    value: VM_STATUS[instance1.get("status")]
                }, {
                    value:  instance1.get('provider')
                }
              /* , {
                    value: "powner stateaaa"
                }*/
               ]
            };
            entries.push(entry);
        }

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
                    value: instance.get("id"),
                    link: "#nova/instances/" + instance.id + "/detail",
                    tooltip: instance.get("id")
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
                    //title: "Pause Instances",
                    title: "暂停实例",
                    //btn_message: "Pause Instances",
                    btn_message: "暂停实例",
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
                    title: "(暂停)恢复实例",
                    btn_message: "(暂停)恢复实例",
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
                    title: "关闭实例",
                    btn_message: "关闭实例",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.stopserver(UTILS.Messages.getCallbacks("Instance a "+inst.get("id") + " stopped.", "Error stopping instance "+inst.get("id")));

                        });
                    }
                });
                subview.render();
                break;
            case 'start':
                subview = new ConfirmView({
                    el: 'body',
                    title: "启动实例",
                    btn_message: "启动实例",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            console.log("start vm ...");
                            inst = self.model.get(instance);
                            inst.startserver(UTILS.Messages.getCallbacks("Instance "+inst.get("id") + " started.", "Error starting instance "+inst.get("id")));
                        });
                    }
                });
                subview.render();
                break;
            case 'suspend':
                subview = new ConfirmView({
                    el: 'body',
                    title: "挂起实例",
                    btn_message: "挂起实例",
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
                    title: "挂起恢复实例",
                    btn_message: "挂起恢复实例",
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
                    title: "重启实例",
                    btn_message: "重启实例",
                    onAccept: function() {
                        instanceIds.forEach(function(instance) {
                            inst = self.model.get(instance);
                            inst.reboot(true, UTILS.Messages.getCallbacks("Instance "+inst.get("id") + " rebooted.", "Error rebooting instance "+inst.get("id")));
                        });
                    }
                });
                subview.render();
                break;
            case 'terminate':
                subview = new ConfirmView({
                    el: 'body',
                    title: "删除实例",
                    btn_message: "删除实例",
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
