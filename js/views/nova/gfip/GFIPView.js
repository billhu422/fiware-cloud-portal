var NovaGFIPView = Backbone.View.extend({

    _template: _.itemplate($('#novaGFIPTableTemplate').html()),

    tableView: undefined,

    initialize: function() {
        this.options.pools = UTILS.GlobalModels.get("novaGFIPModel");
        this.options.instances = UTILS.GlobalModels.get("instancesModel");
        this.model.unbind("sync");
        this.model.bind("sync", this.render, this);
        //this.model.bind("sync", this.renderFirst, this);
        this.renderFirst();
    },


    getOneSelectedID: function(){
        if(this.tableView.getSelectedEntries().length == 1)
            return this.tableView.getSelectedEntries()[0];
        else return undefined;
    },

    getMainButtons: function() {
        var btns = [];
        UTILS.GlobalModels.get("quotas");

        btns.push({
            //label:  "Allocate IP to Project",
            label:  "详情",
            action: "detail"
        });
        return btns;
    },

    getDropdownButtons: function() {
        var self = this;
        var btns = [];
        var oneSelected = function(size, id) {
            if (size === 1) {
                return true;
            }
        };
        btns.push ({
                label: "编辑高防ip信息",
                action: "editInfo",
                activatePattern: oneSelected
            },  {
                label: "编辑高防ip规则",
                action: "editRule",
                activatePattern: oneSelected
            }
            /*
            ,  {
                label: "编辑高仿ip白名单",
                action: "editWhiteList",
                activatePattern: oneSelected
            }
            */
        );
        return btns;
    },

    getHeaders: function() {
        var btns = [
            {
                name: "ID/名称",
                tooltip: "IP Address",
                size: "15%",
                hidden_phone: false,
                hidden_tablet: false
            },
            {
                name: "高防IP",
                tooltip: "Instance the IP is attached to",
                size: "10%",
                hidden_phone: true,
                hidden_tablet: false
            },
            {
                name: "转发规则数",
                tooltip: "Fixed address the IP is attached to",
                size: "10%",
                hidden_phone: true,
                hidden_tablet: false
            },
            {
                name: "转发目标",
                tooltip: "Corresponding Floating Pool",
                size: "15%",
                hidden_phone: false,
                hidden_tablet: false
            },
            {
                name: "保底防护峰值",
                tooltip: "Fixed address the IP is attached to",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            },
            {
                name: "超峰次数",
                tooltip: "Fixed address the IP is attached to",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            },
            {
                name: "运行状态",
                tooltip: "Fixed address the IP is attached to",
                size: "15%",
                hidden_phone: true,
                hidden_tablet: false
            },
            {
                name: "到期时间",
                tooltip: "Fixed address the IP is attached to",
                size: "25%",
                hidden_phone: true,
                hidden_tablet: false
            }];

        btns.splice(0,0, {
            type: "checkbox",
            size: "5%"
        });

        return btns;
    },

    getEntries: function() {
        var entries = [];
        for (var index in this.model.models) {
            var gf_ip = this.model.models[index];
            var entry = {
                id: gf_ip.get('id'),
                cells: [{
                    value:  gf_ip.get('id')
                }, {
                    value:  gf_ip.get("boundIP")
                }, {
                    value:  gf_ip.get("transRules")
                },{
                    value:  gf_ip.get("TransTargetName")
                },{
                    value:  gf_ip.get("elasticLimit")
                },{
                    value:  gf_ip.get("overloadCount")
                },{
                    value:  gf_ip.get("GFStatusName")
                },{
                    value:  gf_ip.get("expire")
                }]
            };
            entries.push(entry);
        }
        return entries;
    },

    onClose: function() {
        this.tableView.close();
        this.model.unbind("sync");
        this.unbind();
        this.undelegateEvents();
    },

    onAction: function(action, floatingIds) {

        var subview;

        switch (action) {
            case 'detail':
                //subview = new AllocateIPView({el: 'body', pools: this.options.pools, model: self.model});
                if(!this.getOneSelectedID()){
                    alert("请之选择一个高防ip!");
                    return;
                }
                var mode = null;
                for(var i=0;i<this.model.length;i++){
                    var t = this.model.models[i];
                    if(t.id == this.getOneSelectedID()){
                        mode = t;
                        break;
                    }
                }
                subview = new GFIPInfoView({el: 'body',model: mode});
                //subview = new AllocateIPView({el: 'body', pools: this.options.pools, model: self.model});
                subview.render();
                break;
            case 'editInfo':
                //subview = new AssociateIPView({el: 'body',  model: floa, instances: this.options.instances});
                //subview = new AssociateIPView({el: 'body',  model: floa, instances: this.options.instances});
                if(!this.getOneSelectedID()){
                    alert("请之选择一个高防ip!");
                    return;
                }
                var mode = null;
                for(var i=0;i<this.model.length;i++){
                    var t = this.model.models[i];
                    if(t.id == this.getOneSelectedID()){
                        mode = t;
                        break;
                    }
                }
                subview = new EditGFIPInfoView({el: 'body',model: mode});
                subview.render();
                break;
            case 'editRule':
                if(!this.getOneSelectedID()){
                    alert("请之选择一个高防ip!");
                    return;
                }
                var mode = null;
                for(var i=0;i<this.model.length;i++){
                    var t = this.model.models[i];
                    if(t.id == this.getOneSelectedID()){
                        mode = t;
                        break;
                    }
                }
                subview = new EditGFIPRuleView({el: 'body',  model_parent_id: mode.id});
                subview.getList(mode.id);
                //subview.render();
                break;
            case 'editWhiteList':
                if(!this.getOneSelectedID()){
                    alert("请之选择一个高防ip!");
                    return;
                }
                var mode = null;
                for(var i=0;i<this.model.length;i++){
                    var t = this.model.models[i];
                    if(t.id == this.getOneSelectedID()){
                        mode = t;
                        break;
                    }
                }
                subview = new EditWhiteListView({el: 'body'});
                //subview.getList(mode.id);
                subview.render();
                break;

        }
    },

    renderFirst: function() {
        $(this.el).empty();
        UTILS.Render.animateRender(this.el, this._template, {models: this.model.models, pools: this.options.pools, instances: this.options.instances});
        this.tableView = new TableView({
            model: this.model,
            el: '#gfips-table',
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

    render: function() {
        if ($(this.el).html() !== null) {
            this.tableView.render();
        }
        return this;
    }
});
