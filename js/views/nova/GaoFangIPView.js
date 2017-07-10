var GaoFangIPView = Backbone.View.extend({

    _template: _.itemplate($('#novaGaoFangIPTemplate').html()),

    keypairsView: undefined,
    gaoFangIPsView: undefined,
    floatingIPsView: undefined,

    initialize: function() {
        this.render();
        this.floatingIPsView = new NovaFloatingIPsView({model: UTILS.GlobalModels.get("floatingIPsModel"), el: '#floating_ips'});
        this.gaoFangIPsView = new NovaGaoFangIPsView({model: UTILS.GlobalModels.get("gaoFangIPsModel"), el: '#gaoFangIPs'});
        this.keyparisView = new NovaKeypairsView({model: UTILS.GlobalModels.get("keypairsModel"), el: '#keypairs'});
    },

    close: function(e) {
        this.undelegateEvents();
        this.unbind();
    },

    onClose: function() {
        this.keyparisView.close();
        this.secuirtyGroupsView.close();
        this.floatingIPsView.close();
        this.undelegateEvents();
        this.unbind();
    },

    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);

    }

});
