/**
 * Field view
 */
'use strict';
fr.wc_acf.views.Field = Backbone.View.extend({
    template : '',
    tagName: 'table',
    className : 'field_settings',
    events : {
        'click .wc_acf_delete' : 'delete',
        'change .wc_acf_type' : 'change_type',
        'keyup .wc_acf_title' : 'update_title',
        'keyup .wc_acf_name' : 'update_name',
        'blur .wc_acf_title' : 'clear_name',
        'keyup .wc_acf_description' : 'update_description',
        'keyup .wc_acf_settings' : 'update_settings'
    },
    bindings: {
        '.wc_acf_title_label .title': {
            observe: 'title',
            onGet: function(title) {
                return title || 'Nouveau champ';
            }
        },
        '.wc_acf_name': {
            attributes: [{
                name: 'value',
                observe: 'name'
            }]
        }
    },
    initialize : function() {
        this.template = fr.wc_acf.tools.template( 'field' );
    },
    render : function() {
        this.settings = new fr.wc_acf.views.Settings( {
            model : this.model
        });

        this.$el.html( this.template( {
            id : this.model.get('id'),
            type : this.model.get( 'type' ),
            title : this.model.get( 'title' ),
            name : this.model.get( 'name' ),
            settings : this.model.get( 'settings' ),
            description : this.model.get( 'description' ),
            html_field: this.settings.render().$el.html()
        } ) );

        this.stickit();

        return this;
    },
    delete : function( e ) {
        e.preventDefault();
        this.remove();
        Backbone.Mediator.publish( 'field:remove' );
    },
    change_type : function() {
        this.model.set( 'type', this.$el.find( '.wc_acf_type').val() );
        this.render();
    },
    clear_name : function( e ) {
        if( _.isEmpty( this.model.get( 'name' ) ) ) {
            this.model.set( 'name', fr.wc_acf.tools.remove_accents( e.currentTarget.value ) );
        }
    },
    update_title : function(e) {
        this.model.set( 'title', e.currentTarget.value );
    },
    update_name : function(e) {
        this.model.set( 'name', fr.wc_acf.tools.remove_accents( e.currentTarget.value ) );
    },
    update_description : function(e) {
        this.model.set( 'description', e.currentTarget.value );
    },
    update_settings : function(e) {
        this.model.set( 'settings', e.currentTarget.value );
    }
});