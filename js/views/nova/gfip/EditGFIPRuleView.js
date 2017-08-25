var EditGFIPRuleView = Backbone.View.extend({

    _template: _.itemplate($('#editGFIPRuleTemplate').html()),
    tableView:undefined,
    model_parent_id:undefined,

    events: {
        'click #cancelCreateBtn': 'close',
        'click .close': 'close',
        'click #delRule':'delRule',
        'click #gfipRule_add': 'addRule'
    },

    initialize: function() {

        this.model = new GFIPRuleModels();

    },

    getList:function(parent_id){
        this.model.getRuleList(parent_id,this);
    },

    proRender: function(){
        $('#edit_rule').remove();
        $('.modal-backdrop').remove();
        this.render();
    },

    delRule:function(e){
        $('body').spin("modal");
        var ruleId = $(e.target).attr("attrId");
        this.model.delRule(ruleId,this);
    },

    render: function () {
        this.options.quotas = UTILS.GlobalModels.get("quotas");
        $(this.el).append(this._template({ model: this.model}));
        $('.modal:last').modal();
        var header = {"id":"id","protocol":"协议","virtualPort":"转发端口","sourcePort":"源站端口","ipList":"源IPs","operate":"操作"};
        this.tableView = new SmalltableView({
            el: '#iprule-table',
            model: this.model,
            context: this
        });
        this.tableView.header = header;
        this.tableView.hasId = false;
        this.tableView.title = "规则列表";
        this.tableView.render();

        return this;
    },

    close: function(e) {
        while($('#edit_rule').html()!=null||$('.modal-backdrop').html()!=null){
             $('#edit_rule').remove();
        $('.modal-backdrop').remove();
        }
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    addRule: function() {
        $('body').spin("modal");
        var param = $('#gfipRule_form').serialize();
        param = param.replace(/&/g, "','" );
        param = param.replace(/=/g, "':'" );
        param = "({'" +param + "'})" ;
        param = eval(param);
        //var a = $("#abc").serialize().split("%0D%0A");
        this.model.addRule(param,this);
    }

});