<?php
class WC_ACF_Admin_Main {
	
	private static $messages = array( );
	
	public static $field_types = array(
		'text' 		=> 'Texte',
		'textarea' 	=> 'Zone de texte',
		'select' 	=> 'Liste de choix',
		'checkbox' 	=> 'Case à cocher',
		'radio' 	=> 'Bouton radio',
		'image' 	=> 'Image',
		'file' 		=> 'Fichier',
		'wysiwyg' 	=> 'Editeur visuel'
	);
	
	public function __construct() {
		add_action( 'admin_init', array( __CLASS__, 'register_assets' ), 99 );
	}
	
	/**
	 * Register the admin assets
	 * 
	 * 
	 * 
	 */
	public static function register_assets() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG === true ? '' : '.min' ;
		// Register the js assets
		wp_register_script( 'wc-acf-admin', WC_ACF_URL.'/assets/js/app'.$suffix.'.js', array( 'jquery', 'backbone' ), WC_ACF_VERSION, true );
		
		wp_localize_script( 'wc-acf-admin' , 'wc_acf_vars', array(
			'fields' => self::$field_types,
			'fields_data' => get_option( WC_ACF_OPTION_FIELDS_NAME, array() )
		) );
		// Register the css assets
		wp_register_style( 'wc-acf-admin', WC_ACF_URL.'/assets/css/admin-page'.$suffix.'.css', array(), WC_ACF_VERSION );
	}
}