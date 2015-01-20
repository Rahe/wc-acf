<?php
/*
 Plugin Name: WC Paris - ACF
 Version: 0.1
 Description: Interface for ACf simplified
 Author: BeApi
 Author URI: http://www.beapi.fr
 Domain Path: languages
 Text Domain: bea-acf

 ----

 Copyright 2013 Nicolas Juen (technique@beapi.fr)

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

// don't load directly
if ( !defined( 'ABSPATH' ) )
	die('-1');

// Plugin constants
define( 'WC_ACF_VERSION', '0.1' );
define( 'WC_ACF_OPTION_FIELDS_NAME', 'wc_acf_fields' );

// Plugin URL and PATH
define( 'WC_ACF_URL', plugin_dir_url ( __FILE__ ) );
define( 'WC_ACF_DIR', plugin_dir_path( __FILE__ ) );

// Function for easy load files
function _bea_acf_load_files($dir, $files, $prefix = '') {
	foreach ($files as $file) {
		if ( is_file($dir . $prefix . $file . ".php") ) {
			require_once($dir . $prefix . $file . ".php");
		}
	}	
}

// Plugin client classes
_bea_acf_load_files( WC_ACF_DIR . 'classes/', array( 'main' ) );

// Plugin admin classes
if ( is_admin() ) {
	_bea_acf_load_files( WC_ACF_DIR . 'classes/admin/', array( 'main', 'page' ) );
}

add_action( 'plugins_loaded', 'init_bea_acf_plugin' );
function init_bea_acf_plugin() {
	// Client
	new WC_ACF_Main();

	// Admin
	if ( is_admin() ) {
		new WC_ACF_Admin_Main();
		new WC_ACF_Admin_Page();
	}
}