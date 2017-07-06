/**
 * For setup flow
 */
(function ($$) {

	"use strict";
	
	$$(function () {
		/*******************************************************************************************
		 * 
		 * init upgrade page
		 *
		 *******************************************************************************************/
		var t1, t2, download_lang = 0;
		if ( typeof(t1) != undefined )
			clearTimeout(t1);
		if ( typeof(t2) != undefined )
			clearTimeout(t2);
		$$.check_online = function() {
			$$.getData('auto_get_status.htm', function(json) {
				if ( json.wan_status == "1" ) {
					if ( json.status == 9999 ) {
						if ( json.new_language != "")
						{
							$$('#cur_language').html(current_language);
							$$('#new_language').html(json.new_language.substring(1));
							$$('.newLang').show();
							$$('input[type=hidden]:first', '#onlineUpgradeForm').val('download_language');
							download_lang = 1;
						}
						if ( json.new_version != "")
						{
							$$('#cur_version').html(current_version);
							$$('#new_version').html(json.new_version.substring(1));
							new_version=json.new_version.substring(1);
							$$('.newFw').show();
							$$('input[type=hidden]:first', '#onlineUpgradeForm').val('download_image');
							download_lang = 0;
						}
						$$('.fwCheckingResult').show();
						$$('.Checking').hide();
						$$('.firmwareUpdateOptions').hide();
					} else if ( json.status >= 10000 ){
						$$('.Checking').hide();
						$$('.firmwareUpdateOptions').hide();
						$$('#pageMsg').html("<div style='text-align: center;'>"+json.msg+"</div>");
						$$('#fwUpdateMsg').show();
					} else {
						clearTimeout(t1);
						t1 = setTimeout('$$.check_online();', 2 * 1000);
					}
				} else {
					$$('.Checking').hide();
					$$('.firmwareUpdateOptions').hide();
					$$('#pageMsg').html("<p class='red'>"+auto_upg_nowan_head+"</p>"+json.msg);
					$$('#fwUpdateMsg').show();
				}
			});
		};

		$$.get_upgrade_status = function() {
			$$.ajax({
				url: 'satellite_upg_get_status.htm'+$$.ID_2,
				type: 'GET',
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				timeout: 10000,
				success: function(json) {
					if ( $$.reset_login(json) )
						return false;
					if ( json.upgrade_status == "1100" ) {
						//$$.removeCookie('interim');
						$$.processing( 0, $$.REBOOT_TIME);
					} else {
						setTimeout('$$.get_upgrade_status();', 3000);
					}
				},
				failed: function() {
					//$$.removeCookie('interim');
					setTimeout('$$.processing( 0, '+$$.REBOOT_TIME+');', 5000);
				},
				error: function() {
					//$$.removeCookie('interim');
					setTimeout('$$.processing( 0, '+$$.REBOOT_TIME+');', 5000);
				}
			});
		};

		if ( $$.getUrlParam('check') == '1' ) {
			$$.getData('auto_get_status.htm', function(json) {
				if ( json.wan_status == "1" ) {
					if ( json.status == 9999 ) {
						if ( json.new_version != "")
						{
							$$('#cur_version').html(current_version);
							$$('#new_version').html(json.new_version.substring(1));
							$$('.newFw').show();
						}
						if ( json.new_language != "" )
						{
							$$('#cur_language').html(current_language);
							$$('#new_language').html(json.new_language.substring(1));
							$$('.newLang').show();
						}
						$$('.fwCheckingResult').show();
						$$('.Checking').hide();
						$$('.firmwareUpdateOptions').hide();
					} else if ( json.status >= 10000 ){
						$$('.Checking').hide();
						$$('.firmwareUpdateOptions').hide();
						$$('#pageMsg').html(json.msg);
						$$('#fwUpdateMsg').show();
					}
				} else {
					$$('.Checking').hide();
					$$('.firmwareUpdateOptions').hide();
					$$('#pageMsg').html("<p class='red'>"+auto_upg_nowan_head+"</p>"+json.msg);
					$$('#fwUpdateMsg').show();
				}
			});
		}

		if ($$('#checkFwBt').length) {
			$$('#checkFwBt').click(function() {
				$$('.Checking').show();
				$$('.firmwareUpdateOptions').hide();
				$$.postForm('#upgCheckForm','',function(json){
					$$('input[name=submit_flag]', '#upgCheckForm').val("download_confile");
					t2 = setTimeout(function() {
					$$.postForm('#upgCheckForm',
						$$('#upgCheckForm').attr("action").replace(/admin.cgi/, "func.cgi"),
						function(json) {
						$$.check_online();
					});
					}, 6000);
				});
			});
		}
		if ($$('#cancelCheckBt').length) {
			$$('#cancelCheckBt').click(function() {
				if ( typeof(t2) != "undefined" ){
					clearTimeout(t2);
				}
				$$("input[name='upgrade_yes_no']").val(0);
				$$('.Checking').hide();
				$$('.firmwareUpdateOptions').show();
			});
		}

		$$.download_all = function() {
			$$.getData('download_all.htm', function(json) {
				if ( json.status == 0 ) {
					$$('.download_per').html("100%");
					$$('.download_per').css("width", "100%");
					$$('.doing').remove();
					$$('.download_per').html("0%");
					$$('.download_per').css("width", "0%");
					$$('.downloadImage').hide();
					$$('.firmwareUpdateOptions').hide();
					$$('#pageMsg').html(json.msg);
					$$('#fwUpdateMsg').show();
				} else if ( json.percent == "100%" && download_lang ) {
					$$('.download_per').html("100%");
					$$('.download_per').css("width", "100%");
					$$.submit_wait('body', $$.WAITING_DIV);
					$$("input[name='submit_flag']", "#downloadForm").val("reload_language");
					$$.postForm('#downloadForm', '', null);
					setTimeout('location.href="status.htm'+$$.ID_2+'";', 5 * 1000 );
				} else if ( json.status == 1 ) {
					$$('.download_per').html("100%");
					$$('.download_per').css("width", "100%");
					$$('.doing').remove();
					$$.submit_wait('body', $$.UPGRADE_DIV);
					$$("input[name='submit_flag']", "#downloadForm").val("write_image");
					$$.postForm('#downloadForm', '', function(json){});
					$$.get_upgrade_status();
				} else {
					$$('.download_per').html(json.percent);
					$$('.download_per').css("width", json.percent);
					clearTimeout(t1);
					t1 = setTimeout('$$.download_all()', 2 * 1000);
				}
			});
		}
		if ($$('#onlineUpgradeYesBt').length) {
			$$('#onlineUpgradeYesBt').click(function() {
				$$('.Checking').hide();
				$$('.fwCheckingResult').hide();
				$$('.downloadImage').show();
				$$.postForm('#onlineUpgradeForm', '', function(json) {
					$$.download_all();
				});
			});
		}
		if ($$('#onlineUpgradeNoBt').length) {
			$$('#onlineUpgradeNoBt').click(function() {
				$$('.fwCheckingResult').hide();
				$$('.Checking').hide();
				$$('.downloadImage').hide();
				$$('.firmwareUpdateOptions').show();
				if ( typeof(t1) != 'undefined' )
					clearTimeout(t1);
			});
		}
		if ($$('#cancelDlBt').length) {
			$$('#cancelDlBt').click(function() {
				$$("input[name='submit_flag']", "#downloadForm").val("cancel_image");
				if ( typeof(t1) != 'undefined' )
					clearTimeout(t1);
				$$.postForm('#downloadForm', '', function(json){
					$$('.download_per').html("0%");
					$$('.download_per').css("width", "0%");
					$$('.downloadImage').hide();
					$$('.Checking').hide();
					$$('.fwCheckingResult').hide();
					$$('.firmwareUpdateOptions').show();
				});
			});
		}
		if ($$('#uploadBt').length) {
			if (warning_msg != "" ) {
				$$('.firmwareUpdateOptions').hide();
				$$('#updateFirmwareForm').hide();
				$$('#pageMsg').html(warning_msg);
				$$('#fwUpdateMsg').show();
			}
			$$('#uploadBt').click(function() {
				$$('#updateFirmwareForm').show();
				$$.submit_wait('.main:first', $$.PAGE_WAITING_DIV);
				var action = $$('#updateFirmwareForm').attr('action');
				$$('#updateFirmwareForm').attr('action', action+$$.ID_1);
				$$('#updateFirmwareForm').submit();
			});
		}
		if ($$('#updateFile').length) {
			$$('#updateFile').on('change', function () {
				if ($$.check_filesize(this, 30, 'M'))
					$$('#uploadBt').prop("disabled", false);
				else
					$$('#uploadBt').prop("disabled", true);
				var oldvalue=$$(this).val();
				var newvalue=oldvalue.substr(oldvalue.lastIndexOf('\\')+1);
				$$(".fakeInputField").val(newvalue);
			});
		}

		function return_to_upgrade_page() {
			location.href = "fwUpdate.htm"+$$.ID_2;
		}

		if ($$('#okBt').length) {
			$$('#okBt').click(function() {
				return_to_upgrade_page();
			});
		}
		if ($$('#localUpgradeForm').length) {
			$$('#cur_version').html(current_version);
			$$('#new_version').html(new_version);

			if ($$('#localUpgradeYesBt').length) {
				$$('#localUpgradeYesBt').click(function() {
					$$("#upgrade_yes_no").val('1');
					$$.submit_wait('body', $$.UPGRADE_DIV);
					$$.postForm('#localUpgradeForm', '', function(json) {
						if ( json.status == "1" )
						{
							$$.get_upgrade_status();
						}
						else
						{
							$$('.fwCheckingResult').hide();
							$$('.running').remove();
							$$('#pageMsg').html(json.msg);
							$$('#fwUpdateMsg').show();
						}
					});
				});
			}
			if ($$('#localUpgradeNoBt').length) {
				$$('#localUpgradeNoBt').click(function() {
					$$("#upgrade_yes_no").val('0');
					$$.postForm('#localUpgradeForm', '',function(json) {
						return_to_upgrade_page();
					} );
				});
			}

			var file_num=0, i;
			var numa_array=new_version.split('.');
			for(i=0;i<numa_array.length;i++)
				file_num=parseInt(numa_array[i])+file_num*100;

			var netgear_num=0;

			var numc_array=current_version.split('.');
			for(i=0;i<numc_array.length;i++)
				netgear_num=parseInt(numc_array[i])+netgear_num*100;

			var upgMsg = "";
			if(netgear_num<file_num)
			{
				$$('#localUpgradeYesBt').trigger('click');
				$$('.formButtons').hide();
			}
			else if( netgear_num > file_num )
			{
				upgMsg += upg_2_old;
			} else {
				upgMsg += upg_2_same;
			}

			if(current_region == "NA")
			{
				if(new_region.toUpperCase()=="WW" || new_region=="")
				{
					upgMsg += ww_2_na;
				}
			}
			else if(current_region == "" || current_region.toUpperCase() == "WW")
			{
				if(new_region.toUpperCase() == "NA")
				{
					upgMsg += na_2_ww;
				}
			}
			if ( upgMsg != "" ) upgMsg += "<br />" + upg_continue;
			$$('#upgradeMsg').html(upgMsg);
		}
	}); // end ready function

}(jQuery));
