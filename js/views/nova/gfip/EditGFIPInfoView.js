var EditGFIPInfoView = Backbone.View.extend({

    _template: _.itemplate($('#editGaoFangIPInfoTemplate').html()),

    events: {
        'click #cancelCreateBtn': 'close',
        'click .close': 'close',
        'submit #form_gaofangipInfo': 'updateGFIPInfo',
        'click #threshold_button':'editThreshold',
        'click #cc_protect_button':'editCCprotect',
        'click #elastic_protect_button':'editElasticProtect',
        'click .modal-backdrop': 'close'
    },

    initialize: function(){
           //this.model.set({'cc_protect':0,'threshold':100});
    },


    proRender:function(){
        while($('#edit_info').html()!=null||$('.modal-backdrop').html()!=null){
            $('#edit_info').remove();
            $('.modal-backdrop').remove();
        }
        this.render();
    },

    render: function () {
        while($('#editGaoFangipInfo').html()!=null){
            $('#editGaoFangipInfo').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({ model: this.model}));
        $('.modal:last').modal();
        return this;
    },

    editThreshold: function(){
        var value = $("#threshold").val();
        this.model.updateThreshold(value,this);
    },

    editCCprotect: function(){
        var value=$('#cc_protect').val();
        this.model.updateCCStatus(value,this);
    },

    editElasticProtect: function(){
        var value=$('#elastic_protect').val();
        this.model.updateElasticProtect(value,this);
    },

    close: function(e) {
        while($('#editGaoFangipInfo').html()!=null){
            $('#editGaoFangipInfo').remove();
            $('.modal-backdrop').remove();
        }
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    updateGFIPInfo: function() {
        var context = $('#form_gaofangipInfo').serialize();
        context = decodeURIComponent(context,true);
        context = context.replace(/&/g, "','" );
        context = context.replace(/=/g, "':'" );
        context = "({'" +context + "'})" ;
        var p = eval(context);
        this.model.updateInfo(p,this);
    }
})

