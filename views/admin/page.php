<!-- Create a header in the default WordPress 'wrap' container -->
<div class="wrap">
	<?php
	// Get the current screen
	$screen = get_current_screen();

	settings_errors( 'wc-acf' );
	?>
	<h2><?php echo get_admin_page_title() ?></h2>
	<form method='POST' id="wc-acf-edit" action="<?php echo admin_url( 'admin-post.php' ); ?>">
		<div class="wc_acf_fields widefat postbox" >
			<div class="no_fields_message">Aucun champs. Cliquez sur le bouton <strong>+ Ajouter</strong> pour créer votre premier champ.	</div>
			<div class="fields"></div>
			<div class="wc_acf_add_wrapper">
				<?php submit_button( 'Ajouter +', 'primary', 'add_field', false, array( 'id' => 'wc_acf_add_field' ) ); ?>
			</div>
		</div>
		<?php wp_nonce_field( 'wc-acf-edit' ); ?>
		<?php submit_button(); ?>
		<input type='hidden' name="wc_acf_save_fields" value="1" />
		<input type='hidden' name="redirect_to" value="<?php echo add_query_arg( array( 'page' => self::$page_slug ), admin_url( $screen->parent_file ) ); ?>" />
		<input type='hidden' name="action" value="wc_acf_save" />
	</form>
</div>
<!-- /.wrap -->