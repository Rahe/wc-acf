var fr;
if( !fr ) {
	fr = {};
} else {
	if( typeof fr != "object" ) {
		throw new Error( 'fr already exists and not an object' );
	}
}
if( !fr.bea_acf ) {
	fr.bea_acf = {};
} else {
	if( typeof fr.bea_acf != "object" ) {
		throw new Error( 'fr.bea_acf already exists and not an object' );
	}
}

fr.bea_acf.page = {
	form : '',
	templates : {},
	init : function( ) {
		this.form = jQuery( '#bea-acf-edit' );
		this.fields_container = this.form.find( '.bea_acf_fields' );
		
		// Init the templates
		this.init_templates( );
		
		// Load existing fields
		this.load_existing_fields();

		// Listen the changes like Add,Delete etc...
		this.listen_changes( );
	},
	init_templates : function( ) {
		this.templates = {};
		// Add the settings row
		this.templates[ 'row' ] = jQuery( '#bea_acf_row' ).html( );
		_.each( bea_acf_vars.fields, function( label, slug ) {
			// Fill the tempalte string if possible, empty strong of not
			fr.bea_acf.page.templates[ slug ] = jQuery( '#bea_acf_field_' + slug ).html( ) || '';
		} );
	},
	listen_changes : function( ) {
		// On fomr element Add
		this.form.on( 'click', '#bea_acf_add_field', function( e ) {
			e.preventDefault( );
			fr.bea_acf.page.create_field( );
		} );

		// On form type change
		this.form.on( 'change', '.bea_acf_type', function( e ) {
			e.preventDefault( );

			// Change the type giving the line changed
			fr.bea_acf.page.change_field_type( jQuery( this ).closest( '.field_settings' ), this.value );
		} );

		// On key typing
		this.form.on( 'blur', '.bea_acf_title', function( e ) {
			var el = jQuery( this ), line = el.closest( '.field_settings' ), key_field = line.find( '.bea_acf_name' );

			// If the use change the title and already having a key, do not edit it
			if( _.isEmpty( key_field.val( ) ) ) {
				key_field.val( fr.bea_acf.tools.remove_accents( el.val( ) ) );
			}
		} );
		
		this.form.on( 'keyup', '.bea_acf_title', function( e ) {
			var el = jQuery( this );
			el.closest( '.field_settings' ).find('.bea_acf_title_label strong').text( el.val() );
		} );

		// On blur of the field, remove the unwanted characters
		this.form.on( 'blur', '.bea_acf_name', function( e ) {
			var el = jQuery( this );
			el.val( fr.bea_acf.tools.remove_accents( el.val( ) ) );
		} );
		
		// Remove the fields
		this.form.on( 'click', '.bea_acf_delete', function( e ) {
			e.preventDefault();
			jQuery( this ).closest( '.field_settings' ).remove();
			if( fr.bea_acf.page.fields_container.find( '.field_settings' ).length === 0 ) {
				fr.bea_acf.page.fields_container.removeClass( 'fields' );
			}
		} );
	},
	load_existing_fields : function( ) {
		// Load the fields for
		if( !_.isEmpty( bea_acf_vars.fields_data ) ) {
			_.each( bea_acf_vars.fields_data, function( data ) {
				fr.bea_acf.page.create_field(data);
			} );
		}
	},
	create_field_line : function( data ) {
		return _.template( this.templates[ data.type ], data );
	},
	create_field : function( data ) {
		// Defualt + vars
		var defaults = {
			'type' : 'text',
			'id' : '',
			'title' : '',
			'name' : '',
			'settings' : '',
			'description' : ''
		}, html = '', html_field = '', row_tpl = this.templates.row, field_group;
		
		// Parse the data
		data = _.defaults( data || {}, defaults );
		
		// If creation without id, then generate id
		if( _.isEmpty( data.id ) ) {
			data.id = fr.bea_acf.tools.uniqid( 'field_' );
		}

		// Create the field
		data.html_field = this.create_field_line( data );

		// Create the html
		html = _.template( row_tpl, data );

		// Create the html elements
		this.fields_container.find( '.bea_acf_add_wrapper' ).before( html );
		
		// Add the class fields
		this.fields_container.addClass( 'fields' );
	},
	change_field_type : function( line, type ) {
		var data = {
			'id' : line.data( 'id' ),
			'type' : type,
			'settings' : ''
		};
		html_field = this.create_field_line( data );

		// Remove the line
		line.find( '.field_setting' ).remove( );

		line.find( 'tbody .bea_acf_delete_line' ).before( html_field );
	}
};

// Add the function
jQuery( function( ) {
	fr.bea_acf.page.init( );
} );
