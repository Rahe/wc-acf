<?php
class WC_ACF_Admin_Page {
	
	private static $page_slug = 'wc-acf';
	
	public function __construct() {
		// Add action for the menu item
		add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );

		add_action( 'admin_post_wc_acf_save', array( __CLASS__, 'save_settings' ) );
	}
	
	public static function admin_menu() {
		$hook = add_submenu_page( 'edit.php', 'Champs personnalisés' , 'Champs personnalisés', 'manage_options', self::$page_slug, array( __CLASS__, 'option_page' ) );
		
		// Add the scripts only on this page
		add_action( 'admin_head-'.$hook, array( __CLASS__, 'enqueue_assets' ) );
	}
	
	public static function option_page() {
		if( isset( $_GET['code'] ) ) {
			switch( $_GET['code'] ) {
				case 0 :
					add_settings_error( 'wc-acf', $_GET['code'], 'Options mises à jour', 'updated success' );
				break;
			}
		}

		// Include the option page view
		if( file_exists( WC_ACF_DIR.'/views/admin/'.'page.php' ) ) {
			require_once ( WC_ACF_DIR.'/views/admin/'.'page.php' );
		}
	}
	
	public static function save_settings() {
		// check currently saving
		if( !isset( $_POST['wc_acf_save_fields'] ) ) {
			return false;
		}
		
		// Check the nonce
		check_admin_referer( 'wc-acf-edit' );
		
		$data = array();
		if( isset( $_POST['wc-acf-field'] ) && !empty( $_POST['wc-acf-field'] ) ) {
			foreach( $_POST['wc-acf-field'] as $key => $fields ) {
				// Get the settings
				$settings = isset( $fields['settings'] ) ? esc_textarea( $fields['settings'] ) : '' ;
				
				// Add the data
				$data[$key] = array_map( 'sanitize_text_field' , $fields );
				$data[$key] = array_map( 'stripslashes_deep' , $fields );
				
				// Put the settings back
				$data[$key]['settings'] = $settings;
				
				// Add the id to the settings
				$data[$key]['id'] = $key;
				
			}

		}
		
		// Update the options
		update_option( WC_ACF_OPTION_FIELDS_NAME , $data );

		wp_safe_redirect( add_query_arg( array( 'code' => 0 ), $_POST['redirect_to'] ) );
		exit;
	}
	
	public static function enqueue_assets() {
		// Register the js assets
		wp_enqueue_script( 'wc-acf-admin' );
		
		// Register the css assets
		wp_enqueue_style( 'wc-acf-admin');
		
		// Add the js templates
		add_action( 'admin_footer', array( __CLASS__, 'js_templates' ), 1 );
	}
	
	public static function js_templates() {
		if( !is_file( WC_ACF_DIR.'views/admin/js-templates.tpl.php' ) ) {
			return false;
		}
		
		include ( WC_ACF_DIR.'views/admin/js-templates.tpl.php' );
	}
}