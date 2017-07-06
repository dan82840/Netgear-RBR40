/**
 * For Connected Devices page.
 **/
(function ($$) {

	"use strict";

	$$(function() {

		$$.checkStatus = function() {
			if(satellite_status == "1")
				location.href = "status.htm";
		}
	$$.checkStatus();

	});
}(jQuery));
