var SmalltableView = Backbone.View.extend({

    _template: _.itemplate($('#smalltableTemplate').html()),
    header: undefined,
    title: undefined,
    hasId:true,

    initialize: function() {

    },

    getHeader: function() {
        var str = "<tr>";
        for(var attr in this.header){
            if(attr=="id"&&!this.hasId){
                continue;
            }
            str = str + "<td>" + this.header[attr] + "</td>";
        }
        str = str + "</tr>";
        return str;
    },

    getEntries: function(){
        var str = "";
        for(var i = 0;i< this.model.length;i++){
            var str = str + "<tr>";
            var entry = this.model.models[i];
            for(var attr in this.header){
                //alert(attr);
                if(attr=="id"&&!this.hasId){
                    str = str + "<td style=\'display: none\'>" + entry.get(attr) + "</td>";
                }else{
                    str = str + "<td >" + entry.get(attr) + "</td>";
                }
                //str = str + "<td >" + entry.get(attr) + "</td>";
            }
            str = str + "</tr>";
        }
        return str;
    },

    close: function(){
       $("#smalltableTemplate").remove();
       this.undelegateEvents();
       this.unbind();
    },

    render: function() {
        var new_template = this._template({
            table_header:this.getHeader(),
            table_body:this.getEntries(),
            title: this.title
        });
        $(this.el).html(new_template);
        return this;
    }


});
