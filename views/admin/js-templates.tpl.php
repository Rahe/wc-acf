<script type="text/html" id="wc-acf-field">
	<table class="field_settings" data-id='<%= id %>' >
		<tbody>
			<tr>
				<th class="wc_acf_title_label" colspan="2" ><strong class="title"><%= title %></strong> - <i><%- id %></i></th>
			</tr>
			<tr class="field_label">
				<th class="label" >
					<label for="wc-acf-field-<%= id %>-title" >Titre</label>
					<p>Ce nom apparaîtra sur la page d‘édition</p>
				</th>
				<td>
					<input type='text' class="widefat wc_acf_title" value="<%= title %>" name='wc-acf-field[<%= id %>][title]' id="wc-acf-field-<%= id %>-title" />
				</td>
			</tr>
			<tr class="field_label">
				<th class="label" >
					<label for="wc-acf-field-<%= id %>-name" >Identifiant</label>
					<p>Un seul mot sans espace.</p>
					<p>Les '_' et '-' sont autorisés</p>
				</th>
				<td>
					<input type='text' class="widefat wc_acf_name" value="<%= name %>" name='wc-acf-field[<%= id %>][name]' id="wc-acf-field-<%= id %>-name" />
				</td>
			</tr>
			<tr class="field_label">
				<th class="label" >
					<label for="wc-acf-field-<%= id %>-type" >Type de champs</label>
				</th>
				<td>
					<select class='wc_acf_type widefat' name='wc-acf-field[<%= id %>][type]' id="wc-acf-field-<%= id %>-type">
						<% _.each( wc_acf_vars.fields, function( label, field ) { %>
							<option value="<%= field %>" <%= fr.wc_acf.tools.selected( type, field ) %>; >
								<%= label %>
							</option>
						<% } ); %>
					</select>
				</td>
			</tr>
			<tr class="field_label">
				<th class="label" >
					<label for="wc-acf-field-<%= id %>-description" >Description</label>
					<p>Instructions pour les auteurs.</p> <p>Affichées lors de la soumission de données.</p>
				</th>
				<td>
					<textarea rows="4" class="widefat" name="wc-acf-field[<%= id %>][description]" id="wc-acf-field-<%= id %>-description"><%= description %></textarea>
				</td>
			</tr>
			<%= html_field %>
			<tr class='wc_acf_delete_line' >
				<th colspan="2" ><button class="wc_acf_delete button-secondary" value="" >Retirer</button></th>
			</tr>
		</tbody>
	</table>
</script>

<script type="text/html" id="wc-acf-field-text"></script>

<script type="text/html" id="wc-acf-field-checkbox">
	<tr class="field_setting field_label" >
		<th class="label" >
			<label for="wc-acf-field-<%= id %>-settings" >Configuration du champs</label>
			<p>Indiquez une valeur par ligne</p>
			
			<p>Pour un contrôle plus poussé, vous pouvez spécifier la valeur et le libellé de cette manière :</p>
			<p>rouge : Rouge<br/>
			bleu : Bleu</p>
		</th>
		<td>
			<textarea rows="4" class="widefat" name="wc-acf-field[<%= id %>][settings]" id="wc-acf-field-<%= id %>-settings"><%= settings %></textarea>
		</td>
	</tr>
</script>

<script type="text/html" id="wc-acf-field-radio">
	<tr class="field_setting field_label" >
		<th class="label" >
			<label for="wc-acf-field-<%= id %>-settings" >Configuration du champs</label>
			<p>Indiquez une valeur par ligne</p>
			
			<p>Pour un contrôle plus poussé, vous pouvez spécifier la valeur et le libellé de cette manière :</p>
			<p>rouge : Rouge<br/>
			bleu : Bleu</p>
		</th>
		<td>
			<textarea rows="4" class="widefat" name="wc-acf-field[<%= id %>][settings]" id="wc-acf-field-<%= id %>-settings"><%= settings %></textarea>
		</td>
	</tr>
</script>

<script type="text/html" id="wc-acf-field-select">
	<tr class="field_setting field_label" >
		<th class="label" >
			<label for="wc-acf-field-<%= id %>-settings" >Configuration du champs</label>
			<p>Indiquez une valeur par ligne</p>
			
			<p>Pour un contrôle plus poussé, vous pouvez spécifier la valeur et le libellé de cette manière :</p>
			<p>rouge : Rouge<br/>
			bleu : Bleu</p>
		</th>
		<td>
			<textarea rows="4" class="widefat" name="wc-acf-field[<%= id %>][settings]" id="wc-acf-field-<%= id %>-settings"><%= settings %></textarea>
		</td>
	</tr>
</script>