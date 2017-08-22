var GFIPListView = Backbone.View.extend({

    _template: _.itemplate($('#gfiplistTemplate').html()),

    keypairsView: undefined,
    securityGroupsView: undefined,
    floatingIPsView: undefined,

    initialize: function() {
        this.render();
        this.floatingIPsView = new NovaGFIPView({model: UTILS.GlobalModels.get("gFIPLModels"), el: '#gf_ips'});
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
