/**
 * Field model
 */
'use strict';
fr.wc_acf.models.Field = Backbone.Model.extend({
    defaults: {
        type : 'text',
        title : '',
        name : '',
        settings : '',
        description : ''
    }
});