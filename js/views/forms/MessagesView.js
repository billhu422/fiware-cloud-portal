var MessagesView = Backbone.View.extend({
    
    _template: _.template($('#messagesTemplate').html()),
    
    initialize: function() {
        this.options.state = this.options.state || "Success"
    },
    
    close: function() {
    	
    },

    render: function () {
    	var self = this;
        $(this.el).after(this._template({title:this.options.title, state:this.options.state}));
        $('.messages').fadeOut(4000, function() {
        	self.close();
  		});
        return this;
    },
   
});