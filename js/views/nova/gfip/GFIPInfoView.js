var GFIPInfoView = Backbone.View.extend({

    _template: _.itemplate($('#gfipInfoTemplate').html()),

    events: {
        'click #cancelCreateBtn': 'close',
        'click .close': 'close'
        //'click .modal-backdrop': 'close'
    },

    initialize: function() {
        /*
        this.model.bind("change", this.render, this);
        this.model.fetch();
        */
    },

    render: function () {
        $(this.el).append(this._template({ model: this.model}));
        $('.modal:last').modal();
        return this;
    },

    close: function(e) {
        while($('#gfip_info').html()!=null||$('.modal-backdrop').html()!=null){
            $('#gfip_info').remove();
            $('.modal-backdrop').remove();
        }
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    }

});