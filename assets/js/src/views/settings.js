/**
 * Settings view
 */
'use strict';
fr.wc_acf.views.Settings = Backbone.View.extend({
    template : '',
    tagName: 'tr',
    className : 'field_setting field_label',
    initialize : function() {
        this.template = fr.wc_acf.tools.template( 'field-'+this.model.get( 'type' ) );
    },
    render : function() {
        this.$el.html( this.template( {
            id : this.model.get( 'id' ),
            settings : this.model.get( 'settings' )
        } ) );

        return this;
    }
});