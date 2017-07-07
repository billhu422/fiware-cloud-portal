var ConfirmView = Backbone.View.extend({

    _template: _.itemplate($('#confirmTemplate').html()),

    initialize: function() {
        this.delegateEvents({
            'click #confirm_btn': 'onAccept',
            'click #cancelBtn': 'close',
            'click #closeModalConfirm': 'close',
            'click .modal-backdrop': 'close'
        });
        //this.options.title = this.options.title || "Are you sure?";
        this.options.title = this.options.title || "确定吗？";
        //this.options.message = this.options.message || "Please confirm your selection. This action cannot be undone.";
        this.options.message = this.options.message || "请确认，这个操作不能被撤销";
        //this.options.btn_message = this.options.btn_message || "Confirm";
        this.options.btn_message = this.options.btn_message || "确认";
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
        $('#confirm').remove();
    },

    render: function () {
        if ($('#confirm').html() != null) {
            $('#confirm').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({title:this.options.title, message:this.options.message, btn_message: this.options.btn_message, style: this.options.style}));

        $('.modal:last').modal();
        $('.modal:last').css('z-index', '105011');
        $(".modal-backdrop:last").css('z-index', '105010');

        return this;
    },

    onAccept: function(e){
        this.close();
        this.options.onAccept();
    },

    close: function(e) {
        this.onClose();
    }

});
