/**
 * @fileOverview Javascript for net02
 * @author werner@bussedesign.com
 * @requires jQuery 1.11.0
 */

// the jQuery wrapper to prevent conflicts with other libraries
(function ($$) {

	"use strict";

	/*global $$, jQuery, window, document, console*/
	/*jslint plusplus: true, vars: true, indent: 2, bitwise: true*/

	var hasTouch = false,
	isTablet = false,
	isPhone  = false,
	eventType =""; 
			
	// regular expression
	$$.REG_NUM = /^[0-9]*$$/;
	$$.REG_EMAIL = /^\w+([A-Za-z0-9\.-]{0,62}\w+)?@\w+([\.-]?\w+)*(\.[A-Za-z0-9]+[A-Za-z0-9-]*[A-Za-z0-9]+)+$$/;
	$$.REG_PASSWORD = /^[\x20-\x7f]{1,32}$$/;
	$$.REG_KEY_64 = /^([\x20-\x7f]{5}|[0-9a-fA-F]{10})$$/;
	$$.REG_KEY_128 = /^([\x20-\x7f]{13}|[0-9a-fA-F]{26})$$/;
	$$.REG_WPA_PWD = /^([\x20-\x7f]{8,63}|[0-9a-fA-F]{64})$$/;
	$$.REG_SSID = /^[\x20-\x7f]{1,32}$$/;
	$$.REG_ANSWER = /^[\x200-9a-zA-Z]{1,64}$$/;
	$$.REG_IP = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$$/;
	$$.REG_MAC = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$$/;
	$$.REG_TIME = /^([1-9]{1}|1[0-9]{1}):[0-9]{0,2}([a][m]|[p][m])$$/;
	$$.REG_DEVICE = /^([\x30-\x39]|[\x41-\x5A]|[\x61-\x7A]|[\x2D]){1,15}$$/;
	$$.REG_WORKGROUP = /^([\x20-\x7E])$$/;
	$$.REG_SHARE = /^([\x22-\x22]|[\x3A-\x3A]|[\x3C-\x3C]|[\x3E-\x3E]|[\x27-\x27]|[\x7C-\x7C]|[\x2F-\x2F]|[\x5D-\x5D]|[\x3E-\x3E]|[\x5C-\x5C])$$/;

	$$.ING_FORMAT_1 = "<div id=\"waiting\" class=\"running\"></div><div class=\"doing running\"> \
			<div class=\"loadingMessage roundCorners\">";
	$$.ING_FORMAT_2 = "</div></div>";
	$$.ING_FORMAT_3 = "<div id=\"page_waiting\" class=\"running\"></div><div class=\"page_doing running\"> \
			  <div class=\"loadingMessage roundCorners\">";
	$$.CHANGE_LANG_DIV = $$.ING_FORMAT_1 + multi_wait + $$.ING_FORMAT_2;
	$$.WAITING_DIV = $$.ING_FORMAT_1 + wait_serv + $$.ING_FORMAT_2;
	$$.PAGE_WAITING_DIV = $$.ING_FORMAT_3 + wait_serv + $$.ING_FORMAT_2;
	$$.UPGRADE_DIV = $$.ING_FORMAT_1 + upgrade_str + $$.ING_FORMAT_2;
	$$.APPLYING_DIV = $$.ING_FORMAT_1 + apply_settings + $$.ING_FORMAT_2;
	$$.PAGE_APPLYING_DIV = $$.ING_FORMAT_3 + apply_settings + $$.ING_FORMAT_2;
	$$.UPDATEING_DIV = $$.ING_FORMAT_1 + update_head + $$.ING_FORMAT_2;

	$$.SWITCH_LANG_DIV = "<h1>"+language+"</h1>"
			+ "<table><tr><td><hr /></td></tr>"
			+ "<tr><td>"+multi_wait+"</td></tr>"
			+ "<tr><td><hr /></td></tr></table>";

	$$.REBOOT_TIME = 135; //seconds

	var sUserAgent = navigator.userAgent,
	fAppVersion = parseFloat(navigator.appVersion),
	isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows"),
	isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
	isPhonePad = (navigator.platform == "iPhone") || (navigator.platform == "iPad") || (navigator.platform == "iPod"),
	isLin = (navigator.platform == "Linux i686") && !isWin && !isMac;
	var isWin95 = false, isWin98 = false, isWinNT4 = false, isWin2K = false, isWinME = false, isWinXP = false, isWinVista = false, isWin7 = false, isMac68K = false, isMacPPC = false, isMacOS = false, isLinux = false;
	if (isLin)
		isLinux =  sUserAgent.indexOf("Linux") > -1;
	if (isWin) {
		isWin95 = sUserAgent.indexOf("Win95") > -1
			|| sUserAgent.indexOf("Windows 95") > -1;
		isWin98 = sUserAgent.indexOf("Win98") > -1
			|| sUserAgent.indexOf("Windows 98") > -1;
		isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1
			|| sUserAgent.indexOf("Windows ME") > -1;
		isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1
			|| sUserAgent.indexOf("Windows 2000") > -1;
		isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1
			|| sUserAgent.indexOf("Windows XP") > -1;
		isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1
			|| sUserAgent.indexOf("Windows Vista") > -1;
		isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1
			|| sUserAgent.indexOf("Windows 7") > -1;
		isWinNT4 = sUserAgent.indexOf("WinNT") > -1
			|| sUserAgent.indexOf("Windows NT") > -1
			|| sUserAgent.indexOf("WinNT4.0") > -1
			|| sUserAgent.indexOf("Windows NT 4.0") > -1
			&& (!isWinME && !isWin2K && !isWinXP);
	}
	if (isMac) {
		isMac68K = sUserAgent.indexOf("Mac_68000") > -1
			|| sUserAgent.indexOf("68K") > -1;
		isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1
			|| sUserAgent.indexOf("PPC") > -1;
		isMacOS =  sUserAgent.indexOf("Mac OS") > -1;
	}

	$$.isVista = isWinVista || isWin7;
	$$.isMac = isMac68K || isMacPPC || isMacOS;
	$$.isLinux = isLinux;
	$$.isAndroid = sUserAgent.indexOf("Android") > -1;
	$$.isPhonePad = isPhonePad;
	$$.chromeTimer = sUserAgent.indexOf("Chrome") > -1 ? 1000 : 0;
	$$.TS="";

	$$.xss_replace = function(xss_str) {
		if ( typeof(xss_str) == "undefined" || xss_str == "" )
			return "";

		xss_str = xss_str.replace(/&#38;/g,'&').replace(/&#35;/g,'#').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&#40;/g,"(").replace(/&#41;/g,")");
		return xss_str;
	};

	$$.isIE = function() {
		var browser = new Object();
		browser.version = parseInt(navigator.appVersion);
		browser.isNs = false;
		browser.isIe = false;
		if(navigator.appName.indexOf("Netscape") != -1)
			browser.isNs = true;
		else if(navigator.appName.indexOf("Microsoft") != -1)
			browser.isIe = true;

		if(browser.isNs)
			return false;
		else if (browser.isIe)
			return true;
		else
			return false;
	};

	$$.getBrowser = function() {
		if(navigator.userAgent.indexOf("MSIE") != -1)
			return "IE";
		else if(navigator.userAgent.indexOf("Chrome") != -1 )
			return "Chrome";
		else if(navigator.userAgent.indexOf("Firefox") != -1)
			return "Firefox";
		else if(navigator.userAgent.indexOf("Safari") != -1 )
			return "Safari";
		else if(navigator.userAgent.indexOf("Camino") != -1)
			return "Camino";
		else if(navigator.userAgent.indexOf("Gecko/") != -1)
			return "Gecko";
		else if(navigator.userAgent.indexOf("Opera") != -1)
			return "Opera";
		else
			return "";
	};

	/**
	*  the document ready function
	*/
	$$(function () {

		/**
		 * If user using IE8-, it will tell user to using higher version
		 */
		var ua = navigator.userAgent.toLowerCase(),
		isIE = /msie/.test(ua),
		version = (ua.match( /(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];

		if ( isIE && parseInt(version) < 8) {
			$$('body').html('<table width="100%"><tr><td align="center">'+lower_browser+'</td></tr></table>');
			return;
		}
		$$.cookie('sessionEnable', '1');

		// global constants
		$$.MIN_PWD_CHARACTERS = 8;
		// network name
		var NAME_EXISTS      = 0x80,
		// password types
		SAME_PWD         = 0x40,
		DIFF_PWD         = 0x20,
		NO_PWD           = 0x10,
		// network select
		MANUAL_SELECT    = 0x40,
		AUTO_SELECT      = 0x20,
		//DISABLED         = 0x10,
		// security options
		SEC_OPTION_NONE  = 0x08,
		SEC_OPTION       = 0x04,
		// valid password
		VALID_PWD        = 0x02,

		DISABLED         = 0x01, //disabled must be unique, otherwise both networks with no pwd will be wrong

		// reset patterns
		RESET_SEC_OPTIONS              = 0x0c,
		RESET_PWD_TYPE                 = 0x70,
		RESET_SELECT                   = 0x61,
		RESET_SEC_OPTIONS_AND_PWD_TYPE = 0x6d,
		RESET_ALL                      = 0xFF,
		validStates;

		/**
		 *  @function setStatusFlag
		 *  @param  {Object} obj - the network container
		 *  @param  {Number}  statusFlag -a hex number status flag that is used to update the status byte
		 *  @param  {Boolean}  set - If true we set the flag, if false we reset the flag
		 *  @param  {array} validStates - holds the valid states to enable the next button
		 *  @return {Boolean} Returns true if status byte indicates button enable
		 *
		 *  This function updates the status byte of the next button enable state. After the update it
		 *  tests the status byte if it matches any enabling state. It then updates the buttonEnable 
		 *  in the object data and return true if the button can be enabled.
		 */
		function setStatusFlag(obj, statusFlag, set) {

			var statusByte = obj.data('submitStatus'),
			allowNext = false,
			i;

			if (set) {
				// set the individual status flag
				statusByte = statusByte | statusFlag;
			} else {
				// reset the individual status flag
				statusByte = statusByte & ~statusFlag;
			}
			// update the status byte
			obj.data('submitStatus', statusByte);

			// we are using a global array which holds the valid states for this page
			// cycle through the enable states and see if one matches the status byte
			for (i = 0; i < validStates.length; ++i) {
				if (validStates[i] === statusByte) {
					allowNext = true; 
				}
			}
			// update the status for this container
			obj.data('buttonEnable', allowNext);

			return allowNext;
		}


		/**
		 *  @function updateButton
		 *  @param {object} button - the next button object
		 *  @param {string} containerName - the name of the containers
		 *
		 */
		function updateButton(button, containerName) {
			var releaseButton = true,
			allDisabled = DISABLED;

			$$("." + containerName).each(function () {
				// check the buttonEnable variable that is attached to the container data
				if (!($$(this).data('buttonEnable'))) {
					releaseButton = false;
				}
				// if we have all networks disabled, "allDisabled" will be true
				allDisabled = allDisabled & $$(this).data('submitStatus');
			});

			// special case all networks are disabled
			if (allDisabled) {
				releaseButton = false;
			} 

			if (releaseButton) {
				button.prop('disabled', false);
			} else {
				button.prop('disabled', true);
			}
		}

		/**
		 * @ Page ca_extender_setup.htm
		 * 
		 */
		if ( $$('.availableNetworks').length ) {
                        var nextButton = $$('#nextStep');
                        // reset for page refresh as firefox does not resets forms as all other browsers do
                        $$('.tableControl').find(':checkbox').prop('checked', true);
                        $$('.activWrap').find(':radio').prop('checked', false);
                        // build the valid states array for the networks settings page
                        validStates = [];
                        validStates[0] = AUTO_SELECT
                        validStates[1] = NAME_EXISTS | MANUAL_SELECT |  SEC_OPTION_NONE;
                        validStates[2] = NAME_EXISTS | MANUAL_SELECT | SEC_OPTION | VALID_PWD;
                        validStates[3] = DISABLED;
                        $$('.activWrap').each(function () {
                        // on page load the network name is prepopulated and the password is set to
                        // use existing... This is a valid state
                                $$(this).data('submitStatus', 0x00);
                                $$(this).data('buttonEnable', false);
                        });
                        //  update the next button
                        updateButton($$('#nextStep'), 'activWrap');

                	/**
                	*  page behavior

                	*/
                	// make table active if associated checkbox is selected upon selection
                	$$('.tableControl').find(':checkbox').on('change', function () {
                        	var thisContainer = $$(this).parents('.column').find('.activWrap');
                        	if ($$(this).is(':checked')) {
                                	$$(this)
                                	.parents('.tableControl')
                                	// make the table active
	                                .next()
					.find(':input')
					.each(function () {
						var type = this.type,
						tag = this.tagName.toLowerCase();
						if (type === 'checkbox' || type === 'radio') {
							this.checked = false;
							this.disabled = false;
						}
					});
	
					// make the lists inactive and hide the manual input section
					$$(this)
					.parents('.tableControl')
					.next()
	                                .removeClass('inactive');
        	                        // reset DISABLED flag
                	                setStatusFlag(thisContainer, RESET_SELECT, false);
                        	} else {
                                	// we disabled the table
	                                // reset all radio buttons, selects and password fields
        	                        $$(this)
                	                .parents('.tableControl')
                        	        .next()
                                	.find(':input')
	                                .each(function () {
        	                                var type = this.type,
                	                        tag = this.tagName.toLowerCase();
                        	                if (type === 'checkbox' || type === 'radio') {
                                	                this.checked = false;
							this.disabled = true;
	                                        }
        	                        });
                	                // make the lists inactive and hide the manual input section
                        	        $$(this)
                                	.parents('.tableControl')
	                                .next()
        	                        .addClass('inactive')
                	                // reset the select flags
                        	        setStatusFlag(thisContainer, RESET_ALL, false);
                                	// set DISABLED flag
	                                setStatusFlag(thisContainer, DISABLED, true);
        	                }
                	        // update the button to reflect the new select status
				//updateButton($$('#nextStep'), 'activWrap');
	                });
        	        // manage network selection
                	$$('.availableNetworks').find(':radio').on('change', function (e) {
	                        var thisContainer = $$(this).parents('.activWrap');
        	                // do not allow a radio button to be set if the table is inactive
				if ($$(this).is(':checked') && $$(this).parents('activeWrap').hasClass('inactive')) {
					this.checked = false;
					e.stopPropagation();
	                        } else {
					setStatusFlag(thisContainer, RESET_ALL, false);
					setStatusFlag(thisContainer, AUTO_SELECT, true);
					//updateButton($$('#nextStep'), 'activWrap');
	                        }
        	        });

			$$('.refreshBtn').click(function () {
				$$(this).parents('.tableControl').next().find('.loadingMessage').toggle();
			});
		}

		/**
		 * @function addErrMsgAfter
		 * @param {id} - the id which the msg will add for.
		 * @param {msg} - Error msg
		 * @param {flag} - insert after the $$(id) directly.
		 */
		$$.addErrMsgAfter =function (id, msg, flag, err_id){
			if ( arguments.length == 4 ) {
				$$(ERROR_SPAN_BEGIN+" id='"+err_id+"'>"+msg+ERROR_SPAN_END).insertAfter('#'+id);
			} else if ( arguments.length > 2 ) {
				$$(ERROR_SPAN_BEGIN+' >'+msg+ERROR_SPAN_END).insertAfter('#'+id);
			} else {
				$$('#'+id).parent().append(ERROR_SPAN_BEGIN+' >'+msg+ERROR_SPAN_END);
			}
		}

		/**
		 * @function enterSubmit
		 * @param {container} - the form id.
		 * @param {id} - the button id, $$(id) will be triggered click function after Enter.
		 */
		$$.enterSubmit = function(container, id) {
			$$(container).keyup(function(e) {
				var e = e || event,
				keycode = e.which || e.keyCode;
				if(keycode == 13)
					if($$('#'+id).prop('disabled') == false)
						$$('#'+id).trigger('click');
			});
		};

		/**
		 * @function enterForbid
		 * @param {container} - the form id.
		 */
		$$.enterForbid = function(container) {
			$$(container).keypress(function(e) {
				var e = e || event,
				keycode = e.which || e.keyCode;
				if(keycode == 13)
					return false;
			});
		};
		
		/**
		 * @function enableButton
		 * @param {button id} - button ID
		 * @param {container id or class} - the id or class of the container
		 * @param {num} - the number of the item need to check in this form
		 * @param {flag} - true or false, if have this flag, it will ignore arguments {form id}, {num}
		 */
		$$.enableButton = function(buttonId, container, num, flag) {
			if ( arguments.length == 4 ) {
				if ( flag ) {
					$$('#'+buttonId).prop('disabled', false);
					$$.enterSubmit(container, buttonId);
				} else {
					$$('#'+buttonId).prop('disabled', true);
					$$.enterForbid(container);
				}
			} else {
				//$$.alertBox($$('.activeElement', container).length);
				if ( $$('.activeElement', container).length == num ) {
					$$('#'+buttonId).prop('disabled', false);
					$$.enterSubmit(container, buttonId);
				} else {
					$$('#'+buttonId).prop('disabled', true) 
					$$.enterForbid(container);
				}
			}
		};
		
		/**
		 * @function getUrlParam
		 * @param {name] - the name of the element
		 */
		 $$.getUrlParam = function(name)
		{
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$$)","i");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) return unescape(r[2]); return null;
		};
	
		$$.ID_1 = $$.getUrlParam('id') == null ? "" : ("&id="+$$.getUrlParam('id'));
		$$.ID_2 = $$.ID_1.replace(/&/g, "?");
		if ( $$.getUrlParam('id') != null && $$.getUrlParam('id') != "" && $$.getUrlParam('id') != "null" )
			$$.cookie('dsessid', $$.getUrlParam('id'));

		/**
		 * @function getSignalType
		 * @param { signal } - number form 0 -100.
		 */
		$$.getSignalType = function(signal) {
			var sig = parseInt(signal);
			if ( sig > 80 ) {
				return "dnintg-four-bars";
			} else if ( sig > 60 ) {
				return "dnintg-three-bars";
			} else if ( sig > 30 ) {
				return "dnintg-two-bars";
			} else if ( sig > 0 ) {
				return "dnintg-one-bar";
			} else {
				return "dnintg-no-bars";
			}
		};

		/**
		 * @function showPassKey 
		 * @param { sec } - the security value
		 * @param { num } - the num of WEP key - Key 1,2,3,4
		 * @param { tag } - root
		 * @return security password
		 */
		$$.showPassKey = function(sec, num, tag) {
			var password = "";
			if(sec == "2") {
				password = eval(tag+"Key"+num);
			} else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
				password = eval(tag+"Password");
			else
				password = "";
			return password.replace(/ /g, '&nbsp;');
		};

		/**
		 * @function showPassKey5g
		 * @param { sec } - the security value
		 * @param { num } - the num of WEP key - Key 1,2,3,4
		 * @param { tag } - root
		 * @return security password
		 */
		$$.showPassKey5g = function(sec, num, tag) {
			var password = "";
			if(sec == "2") {
				password = eval(tag+"Key5g"+num);
			} else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
				password = eval(tag+"Password5g");
			else
				password = "";
			return password.replace(/ /g, '&nbsp;');
		};

		/**
		 * @function formatSecType
		 * @param { security } - the security value
		 * @return security strings
		 */
		$$.formatSecType = function(security) {
			var securiType = "";
			if(security == "2")
				securiType = "WEP";
			else if(security == "3")
				securiType = "WPA-PSK [TKIP]";
			else if(security == "4")
				securiType = "WPA-PSK [AES]";
			else if(security == "5")
				securiType = "WPA2-PSK [TKIP]";
			else if(security == "6")
				securiType = "WPA2-PSK [AES]";
			else if(security == "7")
				securiType = "WPA/WPA2-PSK";
			else
				securiType = none;

			return securiType;
		};

		/**
		 * @function post form data.
		 * @param {container id or class} - the id or class of the container
		 * @param {url} - request url, if it's NULL or empty, it will auto get formId's action value.
		 * @param {function} - callback function
		 */
		$$.postForm = function (container, url, callback) {
			//Generate JSON data
			if ( !$$(container).length ) {
				$$.alertBox('Error form!');
				return;
			}
			//$$.post(url,$$(container).serialize(),callback);
			if ( url == '') {
				if ( container.indexOf('#') > -1 ) {
					url = $$(container).attr("action");
				} else {
					url = $$(container).parents('form').first().attr("action");
				}
			}
			url += $$.ID_1;
			var funcs = function(json) {
				if ( $$.reset_login(json) )
					return false;
				if ( $$.reload_page(json) )
					return false;
				//resetTimer(4*60);
				if ( callback != null )
					callback(json);
			};
			
			$$.ajax({
				url: url,
				type: "POST",
				data: $$(container).serialize(),
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				success: funcs
			});
		};

		/**
		 * @param {url} - request url
		 * @param {function} - callback function
		 */
		$$.getData = function (url, callback) {
			if ( isChanged )
				return false;

			var new_url = url;
			if ( typeof($$.ID_2) != "undefined" )
				new_url = url +$$.ID_2;
				
			$$.getJSON(new_url, function(json) {
				if ( $$.reset_login(json) )
					return false;
				if ( $$.reload_page(json) )
					return false;
				//resetTimer(4*60);
				callback(json);
			});
		};

		$$.getData2 = function (url, callback, ajax_error) {
                        if ( isChanged )
                                return false;

                        var new_url = url;
                        if ( typeof($$.ID_2) != "undefined" )
                                new_url = url +$$.ID_2;

			$$.ajax({
				url: new_url,
				success: function(json) {
					if ( $$.reset_login(json) )
						return false;
					if ( $$.reload_page(json) )
						return false;
					//resetTimer(4*60);
					callback(json);
				},
				dataType: "json",
				error: function(){
					ajax_error();
				}
			});
                };

		/**
		 * @function: check_filesize - check the filesize is valid or not.
		 * @param {obj_file} - this
		 * @param {max_value} - max value
		 * @param {unit} - value's unit
		 * @return - If valid return true, else return false;
		 **/
		$$.check_filesize = function(obj_file, max_value, unit ) {
			var maxsize;
			switch(unit){
				case 'K':
				case 'k':
					maxsize = max_value*1024;
					break;
				case 'M':
				case 'm':
					maxsize = max_value*1024*1024;
					break;
				default:
					maxsize = max_value;
					break;
			}

			var  browserCfg = {};
			var ua = window.navigator.userAgent;
			if (ua.indexOf("MSIE")>=1){
				browserCfg.ie = true;
			}else if(ua.indexOf("Firefox")>=1){
				browserCfg.firefox = true;
			}else if(ua.indexOf("Chrome")>=1){
				browserCfg.chrome = true;
			}

			if(obj_file.value==""){
				return false;
			}
			try {
			var filesize = 0;
			if(browserCfg.firefox || browserCfg.chrome ){
				filesize = obj_file.files[0].size;
			}else if(browserCfg.ie){
				var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
				var file = fileSystem.GetFile(obj_file.value);
				filesize = file.size;
			}else{
				filesize = obj_file.files[0].size;
			}

			if(filesize==-1){
				return true;
			}else if(filesize>maxsize){
				$$.alertBox(restore_select_correct);
				var textInput = $$(obj_file).parents('.fileInputWidget').first().find('input[type=text]').first();
				textInput.val("");
				$$(obj_file).val("");
				return false;
			}
			} catch(e) {
			}
			return true;
		};
		
		/**
		 *	@function verifyPwdPassword
		 *  @param {object} obj - the password field object
		 *  @param {object} container - the outer container of the form segment
		 *  @return  {Boolean} True if passwords match
		 *  
		 *  This function will compare a password with an adjacent password field
		 *  which must have the class "verifyPwd". If the passwords match True is returned.
		 *  It also updates the status flag VALID_PWD
		 *
		 *  Required html
		 *    <li class="pwdInput">
		 *    <label for="...">...</label>
		 *    <input id="..." class="primaryPwd" type="password">
		 *    <label for="...">verifyPwd Password:</label>
		 *    <input id="..." class="verifyPwd" type="password">
		 *    </li>
		 *
		 */
		$$.verifyPassword = function(obj, container) {

			var thisPwdValue = obj.val(),
			verifyPwdValue = obj.siblings('.verifyPwd').val();

			// reset any prior error message
			obj.siblings('.verifyPwd').siblings('.error').remove();
			obj.siblings('.verifyPwd').removeClass('alert');


			if (thisPwdValue !== verifyPwdValue) {
				// add an error and alert
				obj.siblings('.verifyPwd').addClass('alert').after("<span class='error'>NO MATCH!</span>");

				// if this sub routine is used without a container then container will be empty
				// reset VALID_PWD 
				if (container) {
					setStatusFlag(container, VALID_PWD, false);
				}
				return false;
			} else {
				// set VALID_PWD	
				if (container) {	        
					setStatusFlag(container, VALID_PWD, true);
				}
				return true;
			}
		};
		
		/*******************************************************************************************
		 * 
		 * Check the domain and change it.
		 * Because when the LAN IP is change, browser should change the domain.
		 * Otherwise, browser can get the webpage.
		 *
		 ******************************************************************************************/
		$$.change_domain = function(page) {
			if ( page.indexOf("/") != 0 )
				page = "/" + page;

			var href = location.href;
			var dss = "?id="+$$.cookie('dsessid');
			if ( href.indexOf("www.mywifiext.net") > -1 )
				top.location.href = "http://www.mywifiext.com"+page+dss;
			else if ( href.indexOf("mywifiext.net") > -1 )
				top.location.href = "http://mywifiext.com"+page+dss;
			else if ( href.indexOf("www.mywifiext.com") > -1 )
				top.location.href = "http://www.mywifiext.net"+page+dss;
			else if ( href.indexOf("mywifiext.com") > -1 )
				top.location.href = "http://mywifiext.net"+page+dss;
			else
				top.location.href = "http://www.mywifiext.com"+page+dss;
		};

		/*******************************************************************************************
		*
		* Do the xss replace for some special characters.
		*
		******************************************************************************************/
		$$.special_xss = function(ssid) {
			return ssid.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\\/g,"\\\\\\\\").replace(/`/g,"\\\\\\`").replace(/"/g,"\\\"").replace(/&nbsp;/g, " ")
		};
		$$.do_xss_ssid = function(ssid) {
			return ssid.replace(/\\/g,"\\\\\\\\").replace(/`/g,"\\\\\\`").replace(/"/g,"\\\"");
		};
		$$.do_xss_pass = function(password) {
			return password.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/"/g,"\\\"");
		};
		$$.xss_format = function(xss_str) {
			xss_str = xss_str.replace(/\"/g, '&#34;').replace(/\'/g, '&#39;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;').replace(/\`/g, '&#96;').replace(/ /g, '&nbsp;');
			return xss_str;
		};

		/****************************************************************************************
		*
		* getkey 
		*
		****************************************************************************************/
		$$.getkey = function(type, e) {
			var keycode;
			if (window.event)
				keycode = window.event.keyCode;
			else if (e)
				keycode = e.which;
			else
				return true;

			if(type == "num") {
				if(((keycode>47) && (keycode<58)) || (keycode==8)||(keycode==0))
					return true;
				else
					return false;
			} else if(type == "ipaddr") {
				if (((keycode>47) && (keycode<58))||(keycode==8)||(keycode==0)||(keycode==46)) 
					return true;
				else
					return false;
			} else if(type == "ssid") {
				if (keycode==32) 
					return false;
				else 
					return true;
			} else if(type == "mac") {
				if (((keycode>47) && (keycode<58))||((keycode>64) && (keycode<71))||((keycode>96) && (keycode<103))||(keycode == 8)||(keycode == 0) || (keycode == 58) || (keycode == 45))
					return true;
				else 
					return false;
			} else if(type == "wps_pin") {
				if (((keycode>47) && (keycode<58)) || (keycode==8)||(keycode==0) || (keycode == 32) || (keycode == 45))
					return true;
				else
					return false;
			} else if(type == "shareName") { // not / * ? " <> \ :
				if((keycode==47) || (keycode==42) || (keycode==63) || (keycode==34) || (keycode==58) || (keycode==60) || (keycode==62) || (keycode==92) || (keycode==93) || (keycode==124))
					return false;
				else
					return true;
			} else if(type == "mediaServerName") { // not / * ? " <> \ :
				if((keycode==47) || (keycode==42) || (keycode==63) || (keycode==34)  || (keycode==60) || (keycode==62)  || (keycode==92) || (keycode==93) || (keycode==124))
					return false;
				else
					return true;
			} else
				return false;
		};

		/****************************************************************************************
		 *
		 * getDate
		 *
		 ****************************************************************************************/
		$$.getDate = function(time) {
			var curDate = new Date(time),
			date = curDate.getDate(),
			month = curDate.getMonth()+1,
			year = curDate.getFullYear();

			date = date < 10 ? '0' + date : date;
			month = Date.abbrMonthNames[month-1];

			return date+'-'+month+'-'+year;
		};

		/****************************************************************************************
		 *
		 * getTime
		 *
		 ****************************************************************************************/
		$$.getTime = function(time) {
			var curDate = new Date(time),
			hour = curDate.getHours(),
			minutes = curDate.getMinutes(),
			unit = am_mark;

			if ( hour == 0 ) {
				hour = 12;
			} else if ( hour > 11 ) {
				unit = pm_mark;
				if ( hour > 12 ) {
					hour -= 12;
				}
			}
			minutes = minutes < 10 ? '0' + minutes : minutes;

			return hour+':'+minutes+' '+unit;
		};

		/****************************************************************************************
		*
		* getTime
		*
		****************************************************************************************/
		$$.SelectionTextLength = function(text) {
			var select_text="";
			if (document.selection&& document.selection.createRange)//IE
				select_text=document.selection.createRange().text;
			else if(select_text == "" && text.selectionStart != undefined )
				select_text=text.value.substring(text.selectionStart,text.selectionEnd);
			return select_text.length;
		};

		$$.keydown = function(e,text) {
			if((e.keyCode == 190 || e.keyCode == 110) && text.value.length !=0 && $$.SelectionTextLength(text)==0)
				text.form[($$.getIndex(text)+1) % text.form.length].focus();
		};

		$$.keyup = function(e,text) {
			if(text.value.length == 3 && ((e.keyCode >47 && e.keyCode <58) ||(e.keyCode >95 && e.keyCode <106)))
				text.form[($$.getIndex(text)+1) % text.form.length].focus();
		};

		$$.getIndex = function(input) {
			var index = -1,
			i = 0,
			found = false;
			while (i < input.form.length && index == -1) {
				if (input.form[i] == input)
					index = i;
				else
					i++;
			}
			return index;
		};

		$$.logout = function() {
			$$.ajax({
				url: "admin.cgi?/logout.html timestamp=" + $$.TS + $$.ID_1,
				type: "POST",
				data: { "submit_flag": "logout" },
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				success: function() {}
			});
			location.href = "/logout.html";
		};

		if( $$('#logout').length ) {
			$$('#logout').click(function() {
				$$.logout();
			});
		}

		function relogin() {
			$$.ajax({
				url: "admin.cgi?/status.htm timestamp=" + $$.TS + $$.ID_1,
				type: "POST",
				data: { "submit_flag": "update_time" },
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				timeout: 15000,
				success: function() {}
			});
			if ( typeof(no_auth) != "undefined" && no_auth == "1" )
				location.href = "/status.htm";
			else if ( location.pathname.indexOf("hidden_") > -1 || location.pathname.indexOf("StringTableUpload.html") > -1 )
				location.href = location.pathname;
			else
				location.href = "/login.html";
		}

		$$.reset_login = function(json) {
			if ( typeof(json.reset) != "undefined" && json.reset == '1') {
				$$.removeCookie('interim');
				$$.alertBox(timeout_msg,  ok_mark, function(){
					relogin();
				});
				return true;
			} else if ( typeof(json.expired) != "undefined" && json.expired == '1') {
				$$.removeCookie('interim');
				$$.alertBox(timeout_msg,  ok_mark, function(){
					relogin();
				});
				return true;
			} else if ( typeof(json.multi) != "undefined" && json.multi == '1') {
				location.href = "/multi_login.html";
				return true;
			}
			return false;
		};
		$$.reload_page = function(json) {
			if ( typeof(json.reload) != "undefined" && json.reload == '1') {
				$$.alertBox(timestamp_error);
				$$('.running').remove();
				if ( typeof(timeout) != "undefined" )
					clearTimeout(timeout);
				if ( typeof(remind) != "undefined" )
					clearTimeout(remind);
				return true;
			}
			return false;
		};

		$$.check_email = function(str) {
			if ( !$$.REG_EMAIL.test(str) )
				return false;

			var array = str.split('@');
			if ( array.length != 2 )
				return false;

			if ( array[0].length > 64 )
				return false;

			if ( array[1].length > 255 )
				return false;

			return true;
		};

		function do_search()
		{
			var key = $$('#footerSearchField').val() ;
			var winoptions = "width=960,height=800,menubar=yes,scrollbars=yes,toolbar=yes,status=yes,location=yes,resizable=yes";
			var url="";
			if(key == "" || key == ent_srh_item ) {
				$$('#footerSearchField').val(host_name);
				key = host_name;
				$$('#footerSearchField').addClass('searchInput');
			}
			key = key.replace(/ /g,"%20")
			url = "http://www.netgear.com/search.aspx?q="+key;
			window.open(url,'_blank',winoptions);
		}

		/*******************************************************************************************
		*
		*	tablet/phone navigation
		*
		*  based on an inconsistent nav design we have to accommodate three different nav
		*  scenarios: Regular, medium width and small width.
		*
		******************************************************************************************/
		if ( $$('.login').length == 0 && $$('.setup').length == 0 ) {
			$$('#logo').before('<div id="navButton"><i class="dnintg-menu"></i></div>');
		}
		
		function tablet_phone_navigation() {
			/**
			 *  We are not checking for any device type as that is unreliable. 
			 *  Rather we are defining behavior based on media query breakpoints that change
			 *  the ui. 
			 *  For screen sizes > 980px width the main nav is located in the left sidebar and
			 *  visible.
			 *  For screens < 980px wide a "hamburger" icon is added to the header and the main
			 *  nav is hidden by the content. When the "hamburger" is clicked, content area 
			 *  slides to the right, revealing the main nav.
			 *  For screens < 600px wide the main nav will just slide down from the header
			 *  when the "hamburger" is clicked.
			 *  using 'isTablet' for screen width from 600 to 980px
			 *  We are using two variables to indicate the states of the nav: isTablet and isPhone
			 *  
			 *  isTablet is true when the "hamburger" is visible (#navButton)
			 *  isPhone is true when the "hamburger" is visible and the byline has float left applied
			 *
			 *  These conditions are set via media queries in the main.css
			 *
			 */

			/**
			 *  to deal with touch and clicks we use a jquery event extension >> touchclick
			 *  to detect touch we use modernizr
			 *
			 */
			hasTouch = false,
			isTablet = false,
			isPhone  = false,
			eventType =""; 

			if (document.ontouchstart) {
				hasTouch = true;
			}

			eventType = hasTouch ? "touchstart" : "click";

			jQuery.event.special.touchclick = {
				bindType: eventType,
				delegateType: eventType
			};
			
			if ($$('#navButton').css('display') === 'block') {
				isTablet = true;
			}

			if (($$('#navButton').css('display') === 'block') && ($$('#byline').css('float') === 'left')) {
				isTablet = false;
				isPhone = true;
			}

			if (isTablet || isPhone) {
				if ($$('#language').length) {
					$$('#language').find('>a').unbind('touchclick');
					$$('#language').find('>a').on('touchclick', function () {
						if ($$(this).hasClass('open')) {
							$$(this).removeClass('open');
							$$(this).next().slideUp();
						} else {
							$$(this).addClass('open');
							$$(this).next().slideDown();
						}   
					});
				}

				if ($$('#navButton').length) {
					
					if ( $$('#navButton').hasClass('open') ) {
						$$('.mainNavWrap').slideDown();
					}
				}
				if (isTablet) {
					if ($$('#navButton').length) { 
						$$('#navButton').unbind('touchclick');
						if ( $$('#navButton').hasClass('open') ) {
							$$('#slider').css('marginLeft', '40%');
							$$('.mainNavWrap').slideDown();
						} else {
							$$('#slider').css('marginLeft', '0');
							$$('.mainNavWrap').slideUp();
						}
						$$('#navButton').on('touchclick', function () {
							if ($$(this).hasClass('open')) {
								$$(this).removeClass('open');
								$$('#slider').css('marginLeft', '0');
								$$('.mainNavWrap').slideUp();
							} else {
								$$(this).addClass('open');
								$$('#slider').css('marginLeft', '40%');
								$$('.mainNavWrap').slideDown();
							}          
						});
					}
				}
				if (isPhone) {
					if ($$('#navButton').length) {
						$$('#navButton').unbind('touchclick');
						$$('#slider').css('marginLeft', '0');
						if ( $$('#navButton').hasClass('open') ) {
							$$('.mainNavWrap').slideDown();	
						} else {
							$$('.mainNavWrap').slideUp();
						}
						$$('#navButton').on('touchclick', function () {
							if ($$(this).hasClass('open')) {
								$$(this).removeClass('open');
								$$('.mainNavWrap').slideUp();
							} else {
								$$(this).addClass('open');
								$$('.mainNavWrap').slideDown();
							}          
						});
					}
				}
			}
			else {
				$$('#slider').css('marginLeft', '0');
				$$('.mainNavWrap').slideDown();
			}			
		}
		
		function fixed_position() {
			if (!( $$.isPhonePad || isIE && parseInt(version, 10) <= 8 ))
				return false;
			var winHeight = window.innerHeight;
			if ( typeof(window.innerHeight) == "undefined" )
				winHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
			var scrollY = window.scrollY;
			if ( typeof(window.scrollY) == "undefined"  )
				scrollY = document.documentElement.scrollTop;

			//Adjust Header and Footer position
			$$('#fixedHeader').css("position", "absolute");
			$$('#fixedHeader').css("top", window.scrollY);
			$$('#fixedFooter').css("position", "absolute");
			if ( winHeight < 250 ) {
				$$('#fixedFooter').css("top", "auto");
				$$('#fixedFooter').css("bottom", "0");
			} else if ( isIE ) {
				$$('#fixedHeader').css("position", "fixed");
				$$('#fixedHeader').css("top", "0");
				$$('#fixedFooter').css("position", "fixed");
				$$('#fixedFooter').css("top", "auto");
				$$('#fixedFooter').css("bottom", "0");
			} else {
				$$('#fixedFooter').css("bottom", "auto");
				$$('#fixedFooter').css("top", winHeight + scrollY - $$('#fixedFooter').outerHeight());
			}
		}

		function fixed_modal() {
			//Adjust the modal postion
			if ( !$$('.loadingMessage').length && !$$('.modalBox').length )
				return;

			var winHeight = window.innerHeight;
			if ( typeof(window.innerHeight) == "undefined"  )
				winHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
			var scrollY = window.scrollY;
			if ( typeof(window.scrollY) == "undefined"  )
				scrollY = document.documentElement.scrollTop;

			var marginTop = 0,
			popUpWinHeight = 0;

			$$('.loadingMessage').each(function(ele, index) {
				if ( $$(this).outerHeight() > popUpWinHeight )
					popUpWinHeight = $$(this).outerHeight();
			});
			$$('.modalBox').each(function(ele, index) {
				if ( $$(this).outerHeight() > popUpWinHeight )
					popUpWinHeight = $$(this).outerHeight();
			});

			if ( $$('.running:first', '.main').length ) {
				if ( scrollY + popUpWinHeight > $$('.main:first').outerHeight() )
					return;
			}

			if ( popUpWinHeight < winHeight ) {
				marginTop = scrollY + (winHeight - popUpWinHeight )/3;
			} else {
				if ( scrollY + winHeight < popUpWinHeight )
					marginTop = 0;
				else
					marginTop = scrollY - popUpWinHeight + winHeight;
			}
			$$('.loadingMessage').css("margin-top", marginTop);
			$$('.modalBox').css("margin-top", marginTop);
		}

		function ie8_resize() {
			if ( !isIE || parseInt(version, 10) != 8 )
				return;
			var winWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
			$$('body').removeClass('w980 w800 w768 w650 w640 w600 w540 w525 w480 w400 w350 w280 w180');
			if ( winWidth <= 980 ) {
				$$('body').addClass('w980');
			}
			if ( winWidth <= 800 ) {
				$$('body').addClass('w800');
			}
			if ( winWidth <= 768 ) {
				$$('body').addClass('w768');
			}
			if ( winWidth <= 650 ) {
				$$('body').addClass('w650');
			}
			if ( winWidth <= 640 ) {
				$$('body').addClass('w640');
			}
			if ( winWidth <= 600 ) {
				$$('body').addClass('w600');
			}
			if ( winWidth <= 540 ) {
				$$('body').addClass('w540');
			}
			if ( winWidth <= 525 ) {
				$$('body').addClass('w525');
			}
			if ( winWidth <= 480 ) {
				$$('body').addClass('w480');
			}
			if ( winWidth <= 400 ) {
				$$('body').addClass('w400');
			}
			if ( winWidth <= 350 ) {
				$$('body').addClass('w350');
			}
			if ( winWidth <= 280 ) {
				$$('body').addClass('w280');
			}
			if ( winWidth < 180 ) {
				$$('body').addClass('w180');
			}
			//status page
			$$('img:first', '.currentConnection.accesspoint').attr('src','image/currentConnectionAP1.png');
			$$('img:eq(2)', '.currentConnection.accesspoint').attr('src','image/currentConnectionAP2.png');
			if ( winWidth <= 540 ) {
				$$("img[src$$='outputPower.png']").attr('src', 'image/outputPowerSmall.png');
			} else {
				$$("img[src$$='outputPowerSmall.png']").attr('src', 'image/outputPower.png');
			}
			if ( winWidth <= 600 ) {
				$$("img[src$$='internet1.png']").attr('src','image/internet2.png');
			} else {
				$$("img[src$$='internet2.png']").attr('src','image/internet1.png');
			}
			if ( typeof(diff_product) != "undefined" && typeof(host_name) != "undefined" && diff_product == 1) {
				$$("img[src$$='product1.png']").attr('src','image/'+host_name+'/product1.png');
				$$("img[src$$='product2.png']").attr('src','image/'+host_name+'/product2.png');
			}
		}

		function resize_wps_img() {
			if ( $$('.wps_bg').length ) {
				var winHeight = window.innerHeight,
				winWidth = window.innerWidth;
				if ( typeof(window.innerHeight ) == "undefined" ){
					winHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
					winWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
				}
				var imgHeight = Math.max(winHeight - $$('#fixedHeader').outerHeight() - $$('#fixedFooter').outerHeight() - 300, 100);
				imgHeight = Math.min(imgHeight, 278);
				var imgWidth = imgHeight * 500 / 347;
				if ( imgWidth > winWidth ) {
					imgWidth = winWidth;
					imgHeight = imgWidth * 347 / 500;
				}
				$$('.wps_bg').css('width', imgWidth);
				$$('.wps_bg').css('height', imgHeight);
				var wpsMainWidth = $$('.wpsMain:first').outerWidth();
				var marginLeft = Math.max((wpsMainWidth - imgWidth ) / 2, 0 );
				$$('.wps_bg').css('margin-left', marginLeft);
				$$('.wps_bg').css('margin-right', marginLeft);
			}
		}

		function resize() {
			ie8_resize();
			if ($$('.loginbox').length) {
				var newHeight  = parseInt($$(window).height()) - parseInt($$('.footer').height()) - parseInt($$('body').css('padding-top'));
				newHeight = newHeight - parseInt($$('.loginbox').css('margin-top')) - parseInt($$('.loginbox').css('margin-bottom'));
				newHeight =  newHeight < parseInt($$('.loginbox').css('min-height')) ? parseInt($$('.loginbox').css('min-height')) : newHeight;
				$$('.loginbox').css('height', newHeight+"px");
			}
			fixed_position();
			fixed_modal();
			tablet_phone_navigation();
			resize_wps_img();
		}
		
		//resize loginbox when access login page
		resize();
		
		/*******************************************************************************************
		 *
		 *	page resizing
		 *  When a browser window resize occurs we force a page reload so the page is 
		 *  initialized properly
		 *
		 ******************************************************************************************/
		$$(window).resize (function () {
			resize();
		});

		$$(window).scroll (function () {
			fixed_position();
			fixed_modal();

			//For Timeout
			timestamp = new Date().getTime();
		});
		$$(document).click (function () {
			timestamp = new Date().getTime();
		});
		$$(document).keydown (function () {
			timestamp = new Date().getTime();
		});
		
		/*$$(window).resize (function () {
		if(this.resizeTO) {
		clearTimeout(this.resizeTO);
		}
		this.resizeTO = setTimeout(function() {
		$$(this).trigger('resizeEnd');
		}, 300);
		});

		$$(window).on('resizeEnd', function () {
		document.location.reload();
		});*/

		/*******************************************************************************************
		 *
		 *	date/time picker widget
		 *  time picker: https://github.com/jonthornton/jquery-timepicker
		 *  date picker: http://www.kelvinluck.com/assets/jquery/datePicker/v2/demo/index.html
		 *               http://www.kelvinluck.com/assets/jquery/datePicker/v2/demo/documentation.html
		 *
		 ******************************************************************************************/
		if ($$('.timePicker').length) {
			$$('.timePicker').timepicker({
				disableTouchKeyboard: true,
				disableTextInput: true,
				step: 1,
				lang: { am: am_mark, pm: pm_mark }
			});
		}
		if ($$('.datePicker').length) {
			Date.format = 'dd-mmm-yyyy';
			$$('.datePicker').datePicker({
				startDate: '01-Jan-1970',
				endDate: new Date(),
				clickInput:true,
				createButton:false
			});
			$$('.datePicker').dpSetOffset(25, 0);
		}

		/*******************************************************************************************
		*
		*	modal popups
		*
		******************************************************************************************/

		if ($$('.modal').length) {

			var $$modal = $$('.modal'),
			$$screen = "<div id='modalOverlay'></div>";
			// load the overlay 
			if ( !$$('#modalOverlay').length )
				$$('body').append($$screen);

			// attach click handler on every modal link on this page
			$$modal.each(function (i) {

				// we use the link index to create a unique id for each modal box
				var $$thisLink = $$(this),
				linkIndex = i + 1;

				/**
				* this is the first click only, we build the modal box and load the content
				* any further click will be dealt with a different click handler
				*/
				$$thisLink.one('click', function (e) {

					// build the modal box
					var modalBoxID = 'modalBox' + linkIndex,
					$$modalBox = $$("<div id='" + modalBoxID + "' class='modalBox'><div class='loadingModal'></div></div>");

					// activate the overlay
					$$('#modalOverlay').addClass('active');
					$$('#modalOverlay').fadeIn('fast');
					$$('body').append($$modalBox);

					// check if we are overwriting the width with a data attribute
					// if width exsists we overwrite the css
					if(typeof($$thisLink.data('popup-type')) != "undefined" && $$thisLink.data('popup-type') !== null) {
						$$('#' + modalBoxID).addClass($$thisLink.data('popup-type'));
					}

					// get the url from the link
					var modalBoxContentURL = $$thisLink.attr('href'),
					$$thisModalBox = $$('#' + modalBoxID);

					// and load the content into the modal box
					$$thisModalBox.load(modalBoxContentURL, function (res, sta, xhr) {
						var json;
						try {
							json = eval("(" + res + ")");
						} catch ( e ) {
						} finally {
							if ( typeof(json) === "object" ) {
								$$thisModalBox.hide();
								$$.reset_login(json);
							}
						}
						// attach a close handler
						$$thisModalBox.find('.close').click(function () {
							$$($$thisModalBox).fadeOut();
							$$('#modalOverlay').fadeOut();
						});
						fixed_modal();
					}); // end of load content

					/**
					* this is the click handler for all subsequent clicks
					*/
					$$thisLink.click(function () {
						$$.get($$(this).attr('href'), function(res){
							var json;
							try {
								json = eval("(" + res + ")");
							} catch ( e ) {
							} finally {
								if ( typeof(json) === "object" && $$.reset_login(json) )
									return false;
								$$('#modalOverlay').fadeIn();
								$$($$thisModalBox).fadeIn("normal", function(){
									fixed_modal();
								});
							}
						});
						return false;
					});

					return false;

				}); // end first click   
			}); // end each link
		}

		/*******************************************************************************************
		 *
		 * Rewrite alert and confirm dialog
		 *
		 *******************************************************************************************/
		$$.alertBox = function(msg, str, act) {
			if ( !$$('#modalOverlay').length ) {
				$$('body').append("<div id='modalOverlay'></div>");
			}
			$$('#modalOverlay').addClass('active');
			$$('#modalOverlay').fadeIn('fast');
			
			var date = new Date();
			var id = "alert"+date.getTime();
			var close = function() {
				if ( $$('.modalBox:visible').length == 1 ){
					$$('#modalOverlay').fadeOut();
				}
				$$('#'+id).fadeOut();
				$$('#'+id).remove();
			},
			action = close;

			if ( !str ) str = ok_mark;
			if ( typeof(act) == "function" ) {
				action = function() {
					act();
					close();
				}
			}

			var data = "<div id='"+id+"'class='modalBox'><div class='recommendation'><p>"
				+ msg + "</p><div class='centerButtons'><div class='boxButtons'><a class='btn primary close' id='"+id+"Ok'>"
				+ str + "</a></div></div></div></div>";
			$$('body').append(data);
			$$('#'+id+'Ok').click(action);
			fixed_modal();
		};

		$$.confirmBox = function(msg, str1, act1, str2, act2) {
			if ( !$$('#modalOverlay').length ) {
				$$('body').append("<div id='modalOverlay'></div>");
			}
			$$('#modalOverlay').addClass('active');
			$$('#modalOverlay').fadeIn('fast');
			
			var date = new Date();
			var id = "alert"+date.getTime();
			var close = function() {
				if ( $$('.modalBox:visible').length == 1 ){
					$$('#modalOverlay').fadeOut();
				}
				$$('#'+id).fadeOut();
				$$('#'+id).remove();
			},
			action1 = close,
			action2 = close;
			if ( !str1 ) str1 = ok_mark;
			if ( !str2 ) str2 = cancel_mark;
			if ( typeof(act1) == "function" ) {
				action1 = function() {
					act1();
					close();
				};
			}
			if ( typeof(act2) == "function" ) {
				action2 = function() {
					act2();
					close();
				};
			}


			var data = "<div id='"+id+"'class='modalBox'><div class='recommendation'><p>"
				+ msg + "</p><div class='centerButtons'><div class='boxButtons'><a class='btn primary close' id='"+id+"Cancel'>"
				+ str2 + "</a><a class='btn primary close' id='"+id+"Ok'>"
				+ str1 + "</a></div></div></div></div>";
			$$('body').append(data);
			$$('#'+id+'Ok').click(action1);
			$$('#'+id+'Cancel').click(action2);
			fixed_modal();
		};

		$$.submit_wait = function(container, string) {
			$$(container).append(string);
			fixed_modal();
		};
			
		/*******************************************************************************************
		*
		*    support own style of checkbox.
		*
		*******************************************************************************************/
		if ($$(':checkbox').length) {
			$$('body').find(':checkbox').on('change', function () {
				if($$(this).is(':checked')) {
					$$(this).addClass('checked');
				} else {
					$$(this).removeClass('checked');
				}
			});
		}

		/*******************************************************************************************
		*
		*	show password
		*
		******************************************************************************************/

		if ($$('.showPwd').length) {

		// add the show password function
		// on checkbox click we adjust the password field type
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$$('.showPwd').each(function(i, ele){
					var passwordInput = $$(ele).parents('.formElements').find('.pwd').parent();
					var newEle = "<input type=\"text\" class=\"pwdText\" style=\"display:none;\" />";
					$$(passwordInput).append(newEle);
				});
			}
			$$('.showPwd').on('change', function () {
				var passwordInput = $$(this).parents('.formElements').find('.pwd, .primaryPwd'),
				textInput = $$(this).parents('.formElements').find('.pwdText'),
				verifyPwd = $$(this).parents('.formElements').find('.verifyPwd'),
				verifyText = $$(this).parents('.formElements').find('.verifyText');
				if ($$(this).is(':checked')) {
					// we change the type of the password field to text so we can see the password
					if ( textInput.length ) {
						var text_value = textInput.val();
						textInput.val(text_value);
						textInput.show();
						passwordInput.hide();
					} else {
						passwordInput.attr('type', 'text');
					}
					if ( verifyText.length ) {
						verifyText.show();
						verifyPwd.hide();
					} else if( verifyPwd.length ) {
						 verifyPwd.attr('type', 'text');
					}
				} else {
					if ( isIE && parseInt(version, 10) <= 8 ) {
						textInput.hide();
						passwordInput.show();
					} else {
						passwordInput.attr('type', 'password');
					}
					if ( verifyText.length ) {
						verifyText.hide();
						verifyPwd.show();
					} else  if( verifyPwd.length ) {
						verifyPwd.attr('type', 'password');
					}
				}
			});

			// when the password field gets focus and the show password checkbox is enabled
			// we change the password field type to text
			$$('.pwd').on('focus',function () {
				var textInput = $$(this).parents('.formElements').find('.pwdText').first();
				if ($$(this).parents('.formElements').find('.showPwd').is(':checked')) {
					// we change the type of the password field to text so we can see the password
					if ( textInput.length ) {
						textInput.show();
						$$(this).hide();
					} else {
						$$(this).attr('type', 'text');
					}
				} else {
					if ( textInput.length ) {
						textInput.hide();
						$$(this).show();
					} else {
						$$(this).attr('type', 'password');
					}
				}
			});

			// enable next button after password input
			$$('.pwd').on('keyup', function () {
				var pwdInput = $$(this).val(),
				textInput = $$(this).parents('.formElements').find('.pwdText').first();
				if ( textInput.length ) {
					textInput.val(pwdInput);
				}
			});

			$$('.pwdText').on('keyup', function () {
				var value = $$(this).val(),
				passwordInput = $$(this).parents('.formElements').find('.pwd');
				passwordInput.val(value);
				passwordInput.keyup();
			});
			$$('.pwdText').on('mouseout', function() {
				var value = $$(this).val(),
				passwordInput = $$(this).parents('.formElements').find('.pwd');
				passwordInput.val(value);
				passwordInput.keyup();
			});
		} // end enterPwd

		/*******************************************************************************************
		*
		*	security select
		*
		******************************************************************************************/
		$$.checkSecurity = function(secTypeId, wepEncId, pwdId) {
			if ( $$('#whatPwd').val() == "0" ) {
				var sec_type = $$('#'+secTypeId).val();
				switch(sec_type) {
					case '2': //WEP
						$$('.column.first').find('.key').each(function(i, ele) {
							var reg = $$.REG_KEY_64,
							msg = wep_64;
							if ( $$('#'+wepEncId).val() == '13' ) {
								reg = $$.REG_KEY_128;
								msg = wep_128;
							}
							if ( ( $$(ele).val() != '' && !reg.test($$(ele).val()) )
								|| ( $$(ele).parent().find('input[type=radio]').is(':checked') && !reg.test($$(ele).val()) )) {
								$$.addErrMsgAfter($$(ele).attr('id'), msg, false, 'err_wep');
							}
						});
						break;
					case '3': // WPA-PSK [TKIP]
					case '6': // WPA2-PSK [AES]
					case '7': // WPA-PSK [TKIP] + WPA2-PSK [AES]
						 if ( !$$.REG_WPA_PWD.test($$('#'+pwdId).val()) ) {
							$$.addErrMsgAfter(pwdId, wpa_phrase, false, 'err_pripass');
						 }
						break;
					case '1':
						break;
					default:
						$$.addErrMsgAfter(secTypeId, no_security);
				}
			}
		};

		$$.checkSecurity5g = function(secTypeId, wepEncId, pwdId) {
			if ( $$('#whatPwd5g').val() == "0" ) {
				var sec_type = $$('#'+secTypeId).val();
				switch(sec_type) {
					case '2': //WEP
						$$('.column.second').find('.key').each(function(i, ele) {
							var reg = $$.REG_KEY_64,
							msg = wep_64;
						if ( $$('#'+wepEncId).val() == '13' ) {
							reg = $$.REG_KEY_128;
							msg = wep_128;
						}
						if ( ( $$(ele).val() != '' && !reg.test($$(ele).val()) )
							|| ( $$(ele).parent().find('input[type=radio]').is(':checked') && !reg.test($$(ele).val()) )) {
								$$.addErrMsgAfter($$(ele).attr('id'), msg, false, 'err_wep_5g');
							}
						});
						break;
					case '3': // WPA-PSK [TKIP]
					case '6': // WPA2-PSK [AES]
					case '7': // WPA-PSK [TKIP] + WPA2-PSK [AES]
						if ( !$$.REG_WPA_PWD.test($$('#'+pwdId).val()) ) {
							$$.addErrMsgAfter(pwdId, wpa_phrase, false, 'err_pripass_5g');
						}
						break;
					case '1':
						break;
					default:
						$$.addErrMsgAfter(secTypeId, no_security);
				}
			}
		};

		$$.selectWepEncr = function(wepEncId) {
			$$('#err_wep').remove();
			$$('.column.first.bgn').find('.key').val('');
			$$('.column.first.bgn').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc', '#networkSettingsForm').trigger('change');

		$$.selectWepEncr5g = function(wepEncId) {
			$$('#err_wep_5g').remove();
			$$('.column.second.bgn').find('.key').val('');
			$$('.column.second.bgn').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc5g', '#networkSettingsForm').trigger('change');

		$$.selectWepEncrAccess = function(wepEncId) {
			$$('#err_wep').remove();
			$$('.column.first.access').find('.key').val('');
			$$('.column.first.access').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc', '#accessPointForm').trigger('change');

		$$.selectWepEncrAccess5g = function(wepEncId) {
			$$('#err_wep_5g').remove();
			$$('.column.second.access').find('.key').val('');
			$$('.column.second.access').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc5g', '#accessPointForm').trigger('change');

		$$.selectWepEncrWiFi = function(wepEncId) {
			$$('#err_wep').remove();
			$$('.column.first').find('.key').val('');
			$$('.column.first').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc', '#wifiSettingsForm').trigger('change');

		$$.selectWepEncrWiFi5g = function(wepEncId) {
			$$('#err_wep_5g').remove();
			$$('.column.second').find('.key').val('');
			$$('.column.second').find('.key').attr('maxlength', $$('#'+wepEncId).val()*2);
		};
		$$('#wepEnc5g', '#wifiSettingsForm').trigger('change');

		if ($$('.whatPwd').length) {
			// change of the password option will reveal the associated fields
			$$('.whatPwd').on('change', function () {
				var thisParent = $$(this).parents('.formElements');

				if ($$(this).val() === '0') {
					thisParent.find('.securityOptionsWrap').slideDown();
					thisParent.find('.securityOptions').prop('selectedIndex', 0);
					$$('.securityOptions').trigger('change');
				} else {
					thisParent.find('.securityOptionsWrap').slideUp();
					// we have selected same or none password, we'll reset all password releated selections 
					thisParent.find('.securityOptions').prop('selectedIndex', 0);
					// hide the password pane
					thisParent.find('.pwdInput').hide();
					// reset the password fields
					//thisParent.find('.pwdInput').find(':password').val('');
				}
			});

			$$('.securityOptions').on('change', function () {

				var thisParent = $$(this).parents('.formElements');

				if ($$(this).val() > 2) {
					thisParent.find('.wep').slideUp();
					thisParent.find('.wpa').slideDown();
				} else if ($$(this).val() > 1) {
					if ( $$(this).attr('id') == 'securityOptions' && rootSecurity == '2' || $$(this).attr('id') == 'securityOptions5g' && root5gSecurity == '2' ) {
						$$('.errorMsg').remove();
						$$.alertBox(wep_apsame);
						thisParent.find('.pwdInput').slideUp();
						$$(this).val('0');
						return false;
					}
					thisParent.find('.wep').slideDown();
					thisParent.find('.wpa').slideUp();
				} else {
					// hide the password pane
					thisParent.find('.pwdInput').slideUp();
					// reset the password fields
					//thisParent.find('.pwdInput').find(':password').val('');
				}   
			});
			
			$$('this').trigger('change');
		}



		/*******************************************************************************************
		*
		*	switch language
		*
		******************************************************************************************/
		$$.switch_language = function(value, show_value)
		{
			var cancelSwitch = function() {
				document.location.reload();
			};
			if ( show_value != $$("#curLang").html() )
			{
				$$("#curLang").html(show_value);
				$$("#hiddenLangAvi").val(value);
				$$("nav").hide();
				$$('.container:first', '#content').hide();
				$$('.main.clearfix:first').hide();
				$$('#fixedFooter').hide();
				if ( $$('.promo:first').length )
					$$('<div class="main clearfix changing_lang">' + $$.SWITCH_LANG_DIV + '</div>').insertBefore($$('.promo:first'));
				if ( $$('.container:first', '#content').length )
					$$('<div class="container changing_lang">' + $$.SWITCH_LANG_DIV + '</div>').insertAfter($$('.container:first', '#content'));
				$$.postForm('#langForm','',function(json) {
					$$("input[name='submit_flag']", "#langForm").val('select_language');
					if ( json.status == "1" ) {
						$$("input[name='submit_flag']", "#langForm").val('change_language');
						if ( json.lang_no_change == "1" ) {
							document.location.reload();
						} else if ( json.lang_in_flash == "1" ) {
							$$.postForm('#langForm','',function(json) {
								if ( json.status == "1" ) {
									document.location.reload();
								} else {
									$$.alertBox(json.msg, null, cancelSwitch);
								}
							});
						} else {
							$$('.changing_lang').remove();
							$$.confirmBox(ml_switch+" "+json.from+" "+ml_curlang+" "+json.to,
								null,
								function() {
									if ( $$('.promo:first').length )
										$$('<div class="main clearfix changing_lang">' + $$.SWITCH_LANG_DIV + '</div>').insertBefore($$('.promo:first'));
									if ( $$('.main.clearfix:first').length )
										$$('<div class="container changing_lang">' + $$.SWITCH_LANG_DIV + '</div>').insertAfter($$('.container:first', '#content'));
									$$.postForm('#langForm','',function(json) {
										if ( json.status == "1" ) {
											document.location.reload();
										} else {
											$$.alertBox(json.msg, null, cancelSwitch);
										}
								});
								}, null, cancelSwitch);
						}
					} else {
						$$.alertBox(json.msg, null, cancelSwitch);
					}
				});
					
			}
			else
			{
				$$("ul", "#language").css("display", "none");
				setTimeout('$$("ul", "#language").removeAttr("style")', 10);
			}
		};
		
		if(need_change_lang==1)
		 	$$.switch_language(bro_reg,browser_region);

		/*******************************************************************************************
		 *
		 * Restart device process
		 *
		 ******************************************************************************************/
		$$.processing = function(pass_time, total_time){
			$$('nav').hide();
			$$('.sidebar').hide();
			$$('#slider').hide();
			$$('.running').remove();
			$$('.reboot').show();
			var per;
			if ( isIE && version == 8 ) {
				if( pass_time < total_time ) {
					per = parseInt((pass_time * 100 / total_time)/11,10);
					if ( per != 9 ){
						$$('div:first', '.roundedProcess').attr('class', 'per'+(per*11));
						$$('.perText', '.roundedProcess').html(per*11+"%");
					}
					pass_time++;
					setTimeout("$$.processing("+pass_time+","+total_time+");", 1000);
				} else {
					$$('div:first', '.roundedProcess').attr('class', 'per100');
					$$('.perText', '.roundedProcess').html("100%");
					//if ( new_version.indexOf("1.0.1.") > -1  && current_version.indexOf("1.0.2.") > -1 )
						location.href="ca_welcome.htm";
					//else
					//	$$.change_domain("/status.htm");
				}
			} else {
				if ( pass_time < total_time/2 ) {
					per = parseInt(pass_time * 100 / total_time, 10);
					var i = parseInt(pass_time * 360 / total_time, 10);
					$$(".pie1").css("-ms-transform", "rotate(" + i + "deg)");
					$$(".pie1").css("-o-transform","rotate(" + i + "deg)");
					$$(".pie1").css("-moz-transform","rotate(" + i + "deg)");
					$$(".pie1").css("-webkit-transform","rotate(" + i + "deg)");
					$$(".pie2").css("-ms-transform", "rotate(0deg)");
					$$(".pie2").css("-o-transform","rotate(0deg)");
					$$(".pie2").css("-moz-transform","rotate(0deg)");
					$$(".pie2").css("-webkit-transform","rotate(0deg)");
					pass_time++;
					setTimeout("$$.processing("+pass_time+","+total_time+");", 1000);
				} else if ( pass_time < total_time ) {
					per = parseInt(pass_time * 100 / total_time, 10);
					var i = parseInt((pass_time - (total_time/2)) * 360 / total_time, 10);
					$$(".pie2").css("-ms-transform", "rotate(" + i + "deg)");
					$$(".pie2").css("-o-transform","rotate(" + i + "deg)");
					$$(".pie2").css("-moz-transform","rotate(" + i + "deg)");
					$$(".pie2").css("-webkit-transform","rotate(" + i + "deg)");
					$$(".pie1").css("-o-transform","rotate(180deg)");
					$$(".pie1").css("-moz-transform","rotate(180deg)");
					$$(".pie1").css("-webkit-transform","rotate(180deg)");
					$$(".pie1").css("-ms-transform", "rotate(180deg)");
					pass_time++;
					setTimeout("$$.processing("+pass_time+","+total_time+");", 1000);
				} else {
					per = 100;
					$$(".pie1").css("-o-transform","rotate(180deg)");
					$$(".pie1").css("-ms-transform", "rotate(180deg)");
					$$(".pie1").css("-moz-transform","rotate(180deg)");
					$$(".pie1").css("-webkit-transform","rotate(180deg)");
					$$(".pie2").css("-o-transform","rotate(180deg)");
					$$(".pie2").css("-moz-transform","rotate(180deg)");
					$$(".pie2").css("-webkit-transform","rotate(180deg)");
					$$(".pie2").css("-ms-transform", "rotate(180deg)");
				}
				$$('.perText', '.roundedProcess').html(per+"%");
				if ( per == 100 ) {
					//if ( new_version.indexOf("1.0.1.") > -1  && current_version.indexOf("1.0.2.") > -1 )
						location.href="ca_welcome.htm";
					//else
					//	$$.change_domain("/status.htm");
				}
			}
		};

		/*******************************************************************************************
		 *
		 * Add id for each <a>
		 *
		 ******************************************************************************************/
		$$('a').each(function(i, ele) {
			var old_href = $$(this).attr("href");
			if ( typeof(old_href) != "undefined" && old_href != ""
				&& old_href.indexOf("http") == -1
				&& old_href != "#" && old_href.indexOf('(') == -1) {
				$$(this).attr("href", old_href+$$.ID_2);
			}
		});

		/*******************************************************************************************
		*
		*	sidebar navigation
		*
		******************************************************************************************/
		if ($$('.mainNav').length) {

		$$('.mainNav').find('.expanded').find('ul').slideDown();

		$$('.mainNav').find('ul').prev().on('touchclick', function () {

		if ($$(this).parent().hasClass('collapsed')) {
		$$(this).parent()
		.removeClass('collapsed')
		.addClass('expanded')
		.find('i')
		.removeClass('dnintg-collapsed')
		.addClass('dnintg-expanded')
		.end()
		.find('ul')
		.slideDown();
		} else {
		$$(this).parent()
		.removeClass('expanded')
		.addClass('collapsed')
		.find('i')
		.removeClass('dnintg-expanded')
		.addClass('dnintg-collapsed')
		.end()
		.find('ul')
		.slideUp();
		}
		});      
		}


		/*******************************************************************************************
		*
		*	footer search
		*
		******************************************************************************************/

		if ($$('footer').find('.search').length) {

		// move label into the placeholder attribute
		$$('footer').find('.search').find('input').each(function () {
		var inputType = $$(this).attr('type'),
		labelText;

		// get the label text
		labelText = $$(this).siblings('label').text();
		// and insert it as a plceholder
		$$(this).attr('placeholder', labelText);
		// now hide the label
		$$(this).siblings('label').hide();

		});
		}

		/*******************************************************************************************
		*
		*	phone table cell labels
		*  on a phone we present tables of type "devicesList in a linear form. we hide the table  
		*  header and insert label into each cell with the header text. 
		*
		******************************************************************************************/
		if (isPhone && !isIE && $$('.devicesList').length) {
		$$('.devicesList').find('td').each( function () {
		// get the corresponding table header
		var $$th = $$(this).parents('table').find('th').eq($$(this).index());
		// add a label ionto the table cell
		$$(this).prepend("<span class='tdLabel'>" + $$th.text() + ":</span>");
		});    
		}



		/*******************************************************************************************
		*
		*	available networks listing on a mobile phone will only show first 3 and a see more link
		*
		******************************************************************************************/
		if ($$('.availableNetworks').length) {

		$$('.availableNetworks').each( function () {
		// check each network list
		$$(this).find('tr').each( function (i) {
		if (i > 3) {
		// add helper class so we can hide all found networks > 3
		$$(this).addClass('hideOnMobile');
		}
		if (i === 3) {
		// add the see all link
		$$(this).after("<tr class='moreLink'><td><a>See More</a></td></tr>");
		}
		});
		});

		// show and hide the row >3
		// notice that when showing the rows jQuery assigns display table cell
		// so we will make these rows visible by asigning display block to the tds
		// is is needed for the phone layout
		$$('.availableNetworks').find('.moreLink').find('a').on('touchstart', function () {
		if ($$(this).hasClass('open')) {
		$$(this)
		.removeClass('open')
		.text('See More')
		.parents('.availableNetworks')
		.find('.hideOnMobile')
		// hide the tds as webkit doesn't hide trs
		.each( function () {
		$$(this).find('td').hide();
		});  
		} else {
		$$(this)
		.addClass('open')
		.text('See Less')
		.parents('.availableNetworks')
		.find('.hideOnMobile')
		.each( function () {
		$$(this)
		.find('td')
		.each( function (i) {
		if (i < 2) {
		$$(this).css('display', 'block');
		}
		});
		});
		}
		});

		} // end available networks

		/*******************************************************************************************
		*
		*	USB page
		*
		******************************************************************************************/
		if ($$('.usbPort').length) {
			//  Firefox doesn't refresh the form when page refresh. 
			//  Restore all form fields so FF behaves the same as all other browsers
			// this requires that the form has a name, normally same as the id
			document.usbPortForm.reset();

			// show/hide the usb settings
			$$("#usbOn").on('change', function () {
				$$('#usbOffWrap').slideDown();
				$$('#selSettings').fadeIn();
			});       

			$$("#usbOff").on('change', function () {
				$$('#usbOffWrap').slideUp();
				$$('#selSettings').fadeOut();
			});

			// show/hide the printer sharing message
			$$("#sharePrinter").on('change', function () {
				$$('#sharePrinterWrap').slideUp();
				$$('#printerShareInfo').slideDown();
				$$('#selSettings').fadeOut();
			});

			$$("#shareContent").on('change', function () {
				$$('#sharePrinterWrap').slideDown();
				$$('#printerShareInfo').slideUp();
				$$('#selSettings').fadeIn();
			});

			// hide advanced settings initially
			$$('#workgroupWrap').hide();

			// toggle the workgroup settings
			$$('#selSettings').on ('touchclick', function (){
				if ($$(this).hasClass('showAdvSettings')) {
					$$(this)
						.removeClass('showAdvSettings')
						.text('Advanced Settings')
						.parents('#usbPortForm')
						.find('#workgroupWrap')
						.slideUp();
				} else {
					$$(this)
						.addClass('showAdvSettings')
						.text('Basic Settings')
						.parents('#usbPortForm')
						.find('#workgroupWrap')
						.slideDown();
				}
			});
		} // end USB Page


		/*******************************************************************************************
		*
		*	file input widget
		*
		******************************************************************************************/
		if ($$('.fileInputWidget').length) {
		$$('.fileInputWidget').find(':file').change( function () {

		var fileInput = $$.trim($$(this).val());
		$$(this).parent().find('.fakeInputField').val(fileInput);
		if (fileInput != "") {
		$$(this).parents('form').find(':submit').prop('disabled', false);  
		} else {
		$$(this).parents('form').find(':submit').prop('disabled', true);
		}
		}); 
		} // end file input widget

		/*******************************************************************************************
		*
		*	fast lane page
		*
		******************************************************************************************/
		if ($$('.fastLane').length) {

			$$('#fl').on('change', function () {
				$$('.secondaryOptions .fastLaneOptions').prop('disabled', false);
			});
			$$('#flBasic').on('change', function () {
				$$('.secondaryOptions .fastLaneOptions').prop({'disabled': true, 'checked': false});
			});

			if (isPhone) {
				$$('.fastLaneOptions').find('.secondaryOptions').hide();
			}

			$$('#flBasic').on('change', function () {
				if(this.checked) {
					$$(this).parents('ul').find('#flBasic').siblings('.fastLaneIllustration').show();
					$$(this).parents('ul').find('.secondaryOptions').hide();
				}
			});

			$$('#fl').on('change', function () {
				if(this.checked) {
					$$(this).parents('ul').find('#flBasic').siblings('.fastLaneIllustration').hide();
					$$(this).parents('ul').find('.secondaryOptions').show();
				}

			});
		}

		/*******************************************************************************************
		 *
		 * search help
		 *
		 ******************************************************************************************/
		if ( $$('.dnintg-search').length ) {
			$$('.dnintg-search').click(function(){
				do_search()
			});
		}
		if ( $$('#footerSearchField').length ) {
			$$('#footerSearchField').keyup(function(e) {
				var key = $$(this).val(),
				e = e || event,
				keycode = e.which || e.keyCode;

				if(key.length > 0 ) {
					$$(this).addClass('searchInput');
				} else {
					$$(this).removeClass('searchInput');
				}
                                
				if(keycode == 13)
					$$('.dnintg-search').trigger('click');
			});
		}

		/*******************************************************************************************
		*
		*    support placeholder if the browser not support it.
		*
		*******************************************************************************************/
		// check if support placeholder.
		function placeholderSupport() {
			return 'placeholder' in document.createElement('input');
		}
		if(!placeholderSupport()) {
			$$('[placeholder]').focus(function() {
				var input = $$(this);
				if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
				}
			}).blur(function() {
				var input = $$(this);
				var pwdPlaceholder = "<input type='text' class='placeholder password' value='"
									+input.attr('placeholder')+"' placeholder='"
									+input.attr('placeholder')
									+"' onfocus='$$(this).prev().show(); $$(this).prev().focus(); $$(this).remove();' />";
				if (  input.val() == '' || input.val() == input.attr('placeholder')) {
					if ( input.hasClass('password') ) {
						input.hide();
						$$(pwdPlaceholder).insertAfter(input);
					} else {
						input.addClass('placeholder');
						input.val(input.attr('placeholder'));
					}
				}
			}).blur();
		}		


		/*******************************************************************************************
		*
		*    Status show values page.
		*    If it's Extender mode, return 1->red, 2->orange, 3->green, or 0->gray.
		*    If it's AP mode, return 3->green, or 0->gray.
		*
		*******************************************************************************************/
		$$.auto_check = function() {
			$$.getData('auto_get_status.htm', function(json) {
				$$('body').removeClass('updateInfo');
				if ( json.wan_status == "1" ) {
					if ( json.status == 9999 ) {
						if ( json.new_version != "" && $$('#statusForm').length )
						{
							if (json.popped_up != "1") {
								$$.confirmBox(have_new_fw, update, function() {
									$$('body').append($$.WAITING_DIV);
									$$.postForm('#statusForm', '', function(){
										location.href = "/fwUpdate.htm?check=1"+$$.ID_1;
									});
								}, close, function() {
									$$.postForm('#statusForm', '', null);
								});
							}
							$$('a', '.updateInfo').attr("href", "/fwUpdate.htm?check=1"+$$.ID_1);
							$$('.updateInfo').show();
							$$('h1:first', '#statusForm').hide();
						}
					}
				}
			});
		};

		// show the default value
		if ( $$('#statusForm').length ) {
			if(connectType == "0") {
				$$('.column.apmode').show();
				$$('.column.extender').hide();
			} else {
				$$('.column.apmode').hide();
				if (fastlane_surfing == "1" && furfing_mode_type == "2.4G"){
					$$('.column.extender.first.existing').show();
					$$('.column.extender.second.existing').hide();
					$$('.column.first.wifi').hide();
					$$('.column.second.wifi').show();
				}else if (fastlane_surfing == "1" && furfing_mode_type == "5G"){
					$$('.column.extender.first.existing').hide();
					$$('.column.extender.second.existing').show();
					$$('.column.first.wifi').show();
					$$('.column.second.wifi').hide();
				}else
					$$('.column.extender').show();
			}
			if(wl_security == "1"){
				$$('#sec_24g').html("<b>None</b>");
			}else if (wl_security == "2"){
				$$('#sec_24g').html("<b>WEP</b>");
			}else if (wl_security == "4"){
				$$('#sec_24g').html("<b>WPA2-PSK[AES]</b>");
			}else {
				$$('#sec_24g').html("<b>WPA-PSK[TKIP]+WPA2-PSK[AES]</b>");
			}
			if(wla_security == "1"){
				$$('#sec_5g').html("<b>None</b>");
			}else if (wla_security == "2"){
				$$('#sec_5g').html("<b>WEP</b>");
			}else if (wla_security == "4"){
				$$('#sec_5g').html("<b>WPA2-PSK[AES]</b>");
			}else {
				$$('#sec_5g').html("<b>WPA-PSK[TKIP]+WPA2-PSK[AES]</b>");
			}
			$$.getData('auto_detect.aspx', function(json) {
				setTimeout('$$.auto_check();', 3000);
			});
		} /*else if ( !$$('body.setup').length  && $$.getUrlParam('check') != '1') {
			$$.auto_check();
		}*/

		// add setTimeout for refresh_wait.htm
		if ( $$('#refreshWaitForm').length ) {
			setTimeout('location.href = "wifiSettings.htm'+$$.ID_2+'";', 6000);
		}

		// continue
		if ( $$('#continueChk').length ) {
			$$('#continueChk').click(function() {
				if( $$(this).is(':checked') )
					$$('#continueBt').prop('disabled', false);
				else
					$$('#continueBt').prop('disabled', true);
			});
		}

		// Add bookmark function
		$$.addBookmark = function() {
			var title = moduleName + ' Configuration',
			url = 'http://www.mywifiext.net';
			$$.confirmBox(new_add_bookmark, yes_mark, function(){
				if (document.all) {
					window.external.addFavorite(url, title);
				} else if (window.sidebar) {
					try {
						window.sidebar.addPanel(title, url, "");
					} catch(e) {$$.alertBox(msg_bookmark);
					}
				} else if (window.external) {
					try {
						window.external.AddFavorite(url, title);
					} catch(e) {$$.alertBox(msg_bookmark);
					}
				} else if (window.opera && window.print) {
					$$.alertBox(msg_bookmark);
				} else {
					$$.alertBox(msg_bookmark);
				}
				$$.checkFinish();
			}, no_mark, function(){
				$$('#bookmark').prop('checked', false);
				$$('#bookmark').removeClass('checked');
				$$.checkFinish();
			});
		};

		var isChanged = false;
		/*if ( typeof(session_id) != "undefined" && session_id != "" && $$.getUrlParam('id') != session_id ) {
			var pathname = location.pathname,
			search = location.search,
			index = search.indexOf("id=");
			if ( index == -1 ) {
				if ( search != "" ) {
					location.href = pathname + search + "&id=" + session_id;
				} else {
					location.href = pathname + "?id=" + session_id;
				}
			} else {
				var tmp = search.substr(index+4, search.length-index-4).indexOf('&');
				if ( index == 1 ) {
					if ( tmp == -1 )
						location.href = pathname + "?id=" + session_id;
					else
						location.href = pathname + "?id=" + session_id + search.substr(tmp+1, search.length-tmp-1);
				} else {
					if ( tmp == -1 )
						location.href = pathname + search.substr(0, index) + "&id=" + session_id;
					else
						location.href = pathname + search.substr(0, index) + "&id=" + session_id + search.substr(tmp+1, search.length-tmp-1);
				}
			}
			isChanged = true;
			return;
		}*/

		//Timeout
		var timestamp, start_time, timeout, remind;
		timestamp = start_time = new Date().getTime();
		function resetTimer(time) {
			if ( typeof(timeout) != "undefined" )
				clearTimeout(timeout);
			if ( typeof(remind) != "undefined" )
				clearTimeout(remind);
			if ( typeof(no_auth) != "undefined" && no_auth == "1")
				return false;
			timestamp = start_time = new Date().getTime();
			remind = setTimeout("$$.checkTimeout();", time * 1000);
			return true;
		}
		function update_time() {
			var adjust = parseInt((timestamp - start_time)/1000, 10);
			if ( adjust == 0 )
				adjust = 5 * 60;
			$$.ajax({
				url: "admin.cgi?/status.htm timestamp=" + $$.TS + $$.ID_1,
				type: "POST",
				data: { "submit_flag": "update_time",
					"adjust": adjust
				},
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				timeout: 45000,
				success: function(json) {
					if ( $$.reset_login(json) )
						return false;
					if ( $$.reload_page(json) ) {
						return false;
					}
					if ( json.status == 1 ) {
						//resetTimer(adjust);
					} else {
						relogin();
					}
				},
				error: function() {
					relogin();
				}
			});
		}
		$$.showTimeoutMsg = function() {
			$$('.modalBox').remove();
			$$('.running').remove();
			$$.removeCookie('interim');
			if ( timestamp == start_time ){
				if ( typeof(timeout) != "undefined" )
					clearTimeout(timeout);
				timeout = setTimeout(function(){
						$$.alertBox(timeout_msg,  ok_mark, function(){ relogin();});
					}, 3*1000);
			} else {
				update_time();
			}
		};
		$$.checkTimeout = function() {
			if ( timestamp == start_time ){
				$$.confirmBox(reset_timer, yes_mark, update_time, no_mark, function(){
					timestamp = start_time;
				});
				timeout = setTimeout("$$.showTimeoutMsg()", (60-3) * 1000);
			} else {
				update_time();
			}
		};
			

		//if (typeof(no_auth) != "undefined" && no_auth != "1" && typeof($$.TS) != "undefined" && $$.TS != ""
		//	&& typeof(session_id) != "undefined" && session_id != "" && $$.getUrlParam('id') == session_id)
		//	remind = setTimeout("$$.checkTimeout();", 4 * 60 * 1000);

		if ( $$('.primaryPwd').length ) {

			if ( isIE && parseInt(version, 10) <= 8 ) {
				var newEle = "<input type=\"text\" class=\"pwdText\" style=\"display:none;\" />";
				$$('.primaryPwd').parent().find('label').after(newEle);
			}

			$$('.primaryPwd').focus(function () {
				var pwd = $$(this).val(),
				thisParents = $$(this).parents('.formElements'),
				pwdText = thisParents.find('.pwdText');

				if ($$(this).parents('.formElements').find('.showPwd').is(':checked')) {
					if ( pwdText.length ) {
						pwdText.show();
						pwdText.focus();
						pwdText.val(pwd);
						$$(this).hide();
					}else {
						$$(this).attr('type', 'text');
					}
				}else{
					if ( pwdText.length ) {
						pwdText.hide();
						$$(this).show();
					}else{
						$$(this).attr('type', 'password');
					}
				}
			});

			$$('.primaryPwd').keyup(function () {
				var pwd = $$(this).val(),
				thisParents = $$(this).parents('.formElements'),
				verifyPwd = thisParents.find('.verifyPwd'),
				verifyText = thisParents.find('.verifyText'),
				pwdText = thisParents.find('.pwdText');
				if (pwd.length >= $$.MIN_PWD_CHARACTERS) {
					verifyPwd.prop('disabled', false);
					if( verifyText.length )
						verifyText.prop('disabled', false);
					thisParents.find('span[id*=err_pripass]').remove();
				} else {
					verifyPwd.prop('disabled', true);
					if( verifyText.length )
						verifyText.prop('disabled', true);
				}

				if ( pwdText.length ) {
					pwdText.val(pwd);
				}
				var pwd2 = verifyPwd.val();
				if(pwd2.length && pwd != pwd2) {
					if(!verifyPwd.hasClass('alert'))
						verifyPwd.addClass('alert');
					if(!thisParents.find('#err_passsame').length)
						$$.addErrMsgAfter(verifyPwd.attr("id"), error_not_same_pwd, false, 'err_passsame');
				} else if(pwd == pwd2){
					verifyPwd.removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
			});

			$$('.pwdText').on('keyup', function () {
				var value = $$(this).val(),
				primaryPwd = $$(this).parents('.formElements').find('.primaryPwd');
				primaryPwd.val(value);
				primaryPwd.keyup();
			});

			$$('.pwdText').on('mouseout', function() {
				var value = $$(this).val(),
				primaryPwd = $$(this).parents('.formElements').find('.primaryPwd');
				primaryPwd.val(value);
				primaryPwd.keyup();
			});
		}

		$$.checkPass = function() {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$$('.pwdText').blur(function () {
					var pwd = $$(this).val();
					$$('.primaryPwd').val(pwd);
					$$('#err_pripass').remove();
					if (pwd.length < $$.MIN_PWD_CHARACTERS) {
						$$.addErrMsgAfter($$('.column.first').find('.primaryPwd').attr("id"), wpa_phrase, false, 'err_pripass');
					} else {
						$$('.column.first').find('.verifyPwd').prop('disabled', false);
					}
				});
			} else {
				$$('.column.first').find('.primaryPwd').blur(function () {
					var pwd = $$(this).val();
					$$('#err_pripass').remove();
					if ( pwd.length < $$.MIN_PWD_CHARACTERS )
						$$.addErrMsgAfter($$(this).attr("id"), wpa_phrase, false, 'err_pripass');
					else
						$$('.column.first').find('.verifyPwd').prop('disabled', false);
				});
			}
		};

		$$.checkPass5g = function() {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$$('.pwdText').blur(function () {
					var pwd = $$(this).val();
					$$('.primaryPwd').val(pwd);
					$$('#err_pripass_5g').remove();
					if (pwd.length < $$.MIN_PWD_CHARACTERS) {
						$$.addErrMsgAfter($$('.column.second').find('.primaryPwd').attr("id"), wpa_phrase, false, 'err_pripass_5g');
					} else {
						$$('.column.second').find('.verifyPwd').prop('disabled', false);
					}
				});
			} else {
				$$('.column.second').find('.primaryPwd').blur(function () {
					var pwd = $$(this).val();
					$$('#err_pripass_5g').remove();
					if ( pwd.length < $$.MIN_PWD_CHARACTERS )
					$$.addErrMsgAfter($$(this).attr("id"), wpa_phrase, false, 'err_pripass_5g');
					else
					$$('.column.second').find('.verifyPwd').prop('disabled', false);
				});
			}
		};

		if( $$('.verifyPwd').length ) {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				var newEle = "<input type=\"text\" class=\"verifyText\" style=\"display:none;\" />";
				$$('.verifyPwd').parent().find('label').after(newEle);
			}
			$$('.verifyPwd').focus(function() {
				var thisParents = $$(this).parents('.formElements'),
				pwd2 = $$(this).val(),
				verifyText = thisParents.find('.verifyText');
				if ($$(this).parents('.formElements').find('.showPwd').is(':checked')) {
					if ( verifyText.length ) {
						verifyText.show();
						verifyText.focus();
						verifyText.val(pwd2);
						$$(this).hide();
					}else{
						$$(this).attr('type', 'text');
					}
				}else{
					if ( verifyText.length ) {
						verifyText.hide();
						$$(this).show();
					}else{
						$$(this).attr('type', 'password');
					}
				}
			});

			$$('.verifyPwd').keyup(function() {
				var thisParents = $$(this).parents('.formElements'),
				verifyText = thisParents.find('.verifyText'),
				pwd = thisParents.find('.primaryPwd').val(),
				pwd2 = $$(this).val();
				if(pwd == pwd2) {
					$$(this).removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
				if ( verifyText.length ) {
					verifyText.val(pwd2);
				}
			});

			$$('.verifyPwd').blur(function() {
				var thisParents = $$(this).parents('.formElements'),
				pwd = thisParents.find('.primaryPwd').val(),
				pwd2 = $$(this).val();
				thisParents.find('#err_passsame').remove();
				if(pwd != pwd2) {
					$$(this).addClass('alert');
					$$.addErrMsgAfter($$(this).attr("id"), error_not_same_pwd, false, 'err_passsame');
				} else {
					$$(this).removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
			});
			$$('.verifyText').on('keyup', function () {
				var value = $$(this).val(),
				verifyPwd = $$(this).parents('.formElements').find('.verifyPwd');
				verifyPwd.val(value);
				verifyPwd.keyup();
			});
			$$('.verifyText').on('blur', function () {
				var value = $$(this).val(),
				verifyPwd = $$(this).parents('.formElements').find('.verifyPwd');
				verifyPwd.val(value);
				verifyPwd.blur();
			});
		}
		if ( $$('#langupg').length) {
			$$('.secondary').click(function() {
				top.location.href = "status.htm" + $$.ID_2;
			});
		}

		$$.checkipaddr = function(ipaddr) {
			var ipArray = ipaddr.split("."),
			    ipstr = ipArray[0]+ipArray[1]+ipArray[2]+ipArray[3],
			    i = 0,
			    thisSegment = "";
			if( !$$.REG_IP.test(ipaddr))
				return false;
			if( ipArray[0] > 223 || ipArray[0] == 0 )
				return false;
			if (ipaddr == "0.0.0.0" || ipaddr == "255.255.255.255")
				return false;
			var each=ipaddr.split(".");
			if (each[0] == "127")
				return false;
			if (!ipArray || ipArray.length != 4) {
				return false;
			} else {
				for (i = 0; i < 4; i++) {
					thisSegment = ipArray[i];
					if (thisSegment != "") {
						if (!(thisSegment >=0 && thisSegment <= 255)) {
							return false;
						}
					} else {
						return false;
					}
				}
			}
		};

		$$.checksubnet = function(subnet) {
                        var subnetArray = subnet.split("."),
                        subnetstr = subnetArray[0]+subnetArray[1]+subnetArray[2]+subnetArray[3],
                        i = 0,
                        maskTest = 0,
                        validValue = true,
			thisSegment = "";
                        if( !$$.REG_IP.test(subnet))
                                return false;
                        if (!subnetArray || subnetArray.length != 4)
                                return false;
                        else {
                                for (i = 0; i < 4; i++) {
                                        thisSegment = subnetArray[i];
                                        if (thisSegment != "") {
                                                if (!(thisSegment >=0 && thisSegment <= 255)) { //check if number?
                                                        return false;
                                                }
                                        } else {
                                                return false;
                                        }
                                }
                        }
			if( subnetArray[0] < 255 ) {
                                if( (subnetArray[1] > 0) || (subnetArray[2] > 0) || (subnetArray[3] > 0))
                                        validValue = false;
                                else
                                        maskTest = subnetArray[0];
                        } else {
                                if( subnetArray[1] < 255 ) {
                                        if( (subnetArray[2] > 0) || (subnetArray[3] > 0))
                                                validValue = false;
                                        else
                                                maskTest = subnetArray[1];
                                } else {
                                        if( subnetArray[2] < 255 ) {
                                                if( (subnetArray[3] > 0) )
                                                        validValue = false;
                                                else
                                                        maskTest = subnetArray[2];
                                        } else
                                                maskTest = subnetArray[3];
                                }
                        }
			if( validValue ) {
                                switch( maskTest ) {
                                case "0":
                                case "128":
                                case "192":
                                case "224":
                                case "240":
                                case "248":
                                case "252":
                                case "254":
                                case "255":
                                        break;
                                default:
                                        validValue = false;
                                }
                                if( subnet == "0.0.0.0" )
                                        validValue = false;
                        } else
                                validValue = false;
                        return validValue;
                };

		$$.checkgateway = function(gateway) {
                        var dgArray = gateway.split("."),
                        dgstr = dgArray[0]+dgArray[1]+dgArray[2]+dgArray[3],
                        i = 0,
			thisSegment = "";
                        if( !$$.REG_IP.test(gateway))
                                return false;
                        if( dgArray[0] > 223 || dgArray[0] == 0 )
                                return false;
                        if (gateway == "0.0.0.0" || gateway == "255.255.255.255")
                                return false;
                        if (gateway == "127.0.0.1")
                                return false;
                        if (!dgArray || dgArray.length != 4)
                                return false;
                        else {
                                for (i = 0; i < 4; i++) {
                                        thisSegment = dgArray[i];
                                        if (thisSegment != "") {
                                                if (!(thisSegment >=0 && thisSegment <= 255)) { //check if number?
                                                        return false;
                                                }
                                        } else {
                                                return false;
                                        }
                                }
                        }
                        return true;
                };

		$$.isBroadcast = function(lanIp, lanMask) {
                        var ip_arr = lanIp.split('.'),
                        mask_arr = lanMask.split('.'),
                        ip_broadcast=0,
                        ip_str=0,
                        mask_str=0,
                        n_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                ip_str = parseInt(ip_arr[i]);
                                mask_str = parseInt(mask_arr[i]);
                                n_str = ~mask_str+256;
                                ip_broadcast=ip_broadcast*256+parseInt(ip_str | n_str)
                        }
                        return (ip_broadcast);
                };

		$$.isSub = function(lanIp, lanMask) {
                        var ip_arr = lanIp.split('.'),
                        mask_arr = lanMask.split('.'),
                        ip_sub=0,
                        ip_str=0,
                        mask_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                ip_str = parseInt(ip_arr[i]);
                                mask_str = parseInt(mask_arr[i]);
                                ip_sub=ip_sub*256+parseInt(ip_str & mask_str);
                        }
                        return (ip_sub);
                };

		$$.isGateway = function(lanIp, lanMask,gtwIp) {
                        var gtw_arr = gtwIp.split('.'),
                        ip_gtw=0,
                        gtw_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                gtw_str = parseInt(gtw_arr[i]);
                                ip_gtw=ip_gtw*256+parseInt(gtw_str);
                        }
                        var ip_sub=$$.isSub(lanIp, lanMask),
                        ip_broadcast=$$.isBroadcast(lanIp, lanMask);
                        if((parseInt(ip_sub)<parseInt(ip_gtw))&&(parseInt(ip_gtw)<parseInt(ip_broadcast)))
                                return true;
                        else
                                return false;
                };

		$$.is_sub_or_broad = function(be_checkip, ip, mask) {
                        var addr_arr = be_checkip.split('.'),
                        ip_addr=0,
                        addr_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                addr_str = parseInt(addr_arr[i],10);
                                ip_addr=ip_addr*256+parseInt(addr_str);
                        }
                        var ip_sub=$$.isSub(ip, mask),
                        ip_broadcast=$$.isBroadcast(ip, mask);
                        if(ip_addr == ip_sub || ip_addr == ip_broadcast)
                                return false;
                        return true;
                };

		$$.isSameIp = function(ipstr1, ipstr2) {
                        var count = 0,
                        ip1_array=ipstr1.split('.'),
                        ip2_array=ipstr2.split('.'),
                        num1=0,
                        num2=0,
                        i = 0;
                        for(i = 0; i < 4; i++) {
                                num1 = parseInt(ip1_array[i]);
                                num2 = parseInt(ip2_array[i]);
                                if( num1 == num2)
                                        count++;
                        }
                        if( count == 4)
                                return true;
                        else
                                return false;
                };

		$$.isSameSubNet = function(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {
                        var count = 0,
                        count_error_end = 0,
                        count_error_start = 0,
                        lan1a = lan1Ip.split('.'),
                        lan1m = lan1Mask.split('.'),
                        lan2a = lan2Ip.split('.'),
                        lan2m = lan2Mask.split('.'),
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                var l1a_n = parseInt(lan1a[i]),
                                l1m_n = parseInt(lan1m[i]),
                                l2a_n = parseInt(lan2a[i]),
                                l2m_n = parseInt(lan2m[i]);
                                if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
                                        count++;
                                var lan_error_start=(l1a_n & l1m_n),
                                l2a_n_two=0,
                                l2m_n_two=0,
                                rev = ~l2m_n,
                                lan_error_end=(rev|l2a_n);
                                rev=rev+256;
                                if (lan_error_end==l2a_n)
                                        count_error_end++;
                                if (lan_error_start==l2a_n)
                                        count_error_start++;
                                if (count_error_end == 4)
                                        return false;
                                if (count_error_start == 4)
                                        return false;
                        }
                        if (count == 4)
                                return true;
                        else
                                return false;
                };

	}); // end ready function

}(jQuery));
