/**
 * For Connected Devices page.
 **/
(function ($$) {

	"use strict";

	$$(function() {

		$$.refreshAttachedDevices = function() {
			if ( !$$('.running').length ) {
				$$.submit_wait('.main:first', $$.PAGE_WAITING_DIV);
			}
			$$.getData("refresh_dev.aspx", function(json) {
				var newRow = "",
				i = 0,
				ip
                                
				$$('tbody','.wiredDevices:first').html("");
				if ( json.device.length > 0 ) {

					for ( i = 0; i < json.device.length; i++ ) {
						newRow = '<tr>';
						newRow += '<td><span class="tdLabel">'+lan_mark_ip+'</span>' + json.device[i].ip + '</td>';
						newRow += '<td><span class="tdLabel">'+lan_mark_name+'</span>' + json.device[i].name + '</td>';
						newRow += '<td><span class="tdLabel">'+qos_mac+'</span>' + json.device[i].mac.toUpperCase() + '</td>';
						newRow += '<td><span class="tdLabel">'+trigger_contype+'</span>' + json.device[i].type + '</td>';
						newRow += '</tr>';
						$$('tbody','.wiredDevices:first').append(newRow);
					}
				}
				
				$$('.running').remove();
			});
		}
	$$.refreshAttachedDevices();

	});
}(jQuery));
