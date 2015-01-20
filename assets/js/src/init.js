/**
 * Created by Nicolas on 16/01/2015.
 */

fr.wc_acf.main_view = new fr.wc_acf.views.Main();

// Fill the view
if( !_.isUndefined( wc_acf_vars.fields_data ) ) {
    _.each( wc_acf_vars.fields_data , function(field) {
        fr.wc_acf.main_view.append_item(field);
    } );
}