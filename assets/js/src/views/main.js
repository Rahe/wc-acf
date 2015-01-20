/**
 * Main view
 */
'use strict';
fr.wc_acf.views.Main = Backbone.View.extend({
    el : jQuery( '#wc-acf-edit' ),
    events :{
      'click #wc_acf_add_field' : 'add'
    },
    subscriptions: {
        'field:remove': 'field_remove'
    },
    initialize : function() {
      this.counter = 0;
    },
    add : function( e ) {
        'use strict';

        e.preventDefault();

        this.append_item( {
            id : fr.wc_acf.tools.uniqid()
        } );
    },
    append_item : function( data ) {
        'use strict';

        var self = this,
            model = new fr.wc_acf.models.Field( data ),
            item_view = new fr.wc_acf.views.Field( {
                model : model
            } );
        self.counter++;
        var rendered = item_view.render( ).$el;

        self.$el.find( '.wc_acf_fields .fields' ).append( rendered );

        rendered.find( 'input:first').focus();

        // Update the fields
        this.on_empty_fields();
    },
    field_remove : function() {
        this.counter--;
        this.on_empty_fields();
    },
    on_empty_fields : function() {
        if( this.counter <= 0 ) {
            this.$el.find('.no_fields_message').show();
        } else {
            this.$el.find('.no_fields_message').hide();
        }
    }
});