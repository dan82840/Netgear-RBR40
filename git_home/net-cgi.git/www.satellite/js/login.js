/**
 * For setup flow
 */
(function ($$) {

	"use strict";
	
	var checkNum = 0;
	
	$$(function () {
		/*******************************************************************************************
		 * 
		 * init login button action
		 *
		 *******************************************************************************************/
		if ( typeof(no_auth) != 'undefined' && no_auth == "1" ) {
			location.href = "start.htm" + $$.ID_2 ;
		}

		function postLoginForm(json) {
			if ( json.status == '1' ) {
				$$.removeCookie('dsessid');
				if ( typeof(json.session) != 'undefined' ) {
					$$.cookie('session', json.session,{ expires: 3650 });
				} else {
					$$.removeCookie('session');
				}
				if ( typeof(json.tmp) != 'undefined' )
					$$.cookie('dsessid', json.tmp);
				location.href = json.url;
					
			} else {
				if (typeof(json.confirm) != 'undefined' ) {
					$$('.running').remove();
					$$.confirmBox(json.confirm, null, function() {
						$$.submit_wait('body', $$.WAITING_DIV);
						$$.ajax({
							url: $$('#loginForm').attr("action"),
							type: "POST",
							data: { "submit_flag": "login",
								"email": $$.base64.encode($$('#userId').val()),
								"password": $$.base64.encode($$('#password').val()),
								"hid_remember_me": $$('#hid_remember_me').val(),
								"multiLogin": "1"
							      },
							dataType: 'json',
							contentType: "application/json; charset=utf-8",
							success: postLoginForm
						});
					}, null, function() {
						location.href = "goodbye.html";
					});
				} else if ( typeof(json.msg) != 'undefined' ) {
					$$('.running').remove();
					$$.addErrMsgAfter('password', json.msg);
				}
			}
		}
		if ($$('#loginForm').length) {
			var str = $$.base64.decode($$.cookie("session")),
			index = str.indexOf(':');
			if ( index != -1 ){
				setTimeout(function(){
					$$('#userId').removeAttr("style");
					$$('#userId').val(str.substr(0, index));
					$$('#password').val(str.substr(index+1, str.length-index-1));
					$$('#rememberMe').prop('checked', true);
					$$('#rememberMe').addClass('checked');
				}, $$.chromeTimer);
			} else {
				setTimeout(function(){
				if ( 'placeholder' in document.createElement('input') ) {
					$$('#userId').val("");
					$$('#password').val("");
				}
				$$('#userId').removeAttr("style");
				}, $$.chromeTimer);
			}
			$$.enterSubmit("#loginForm", "loginBt");

			$$('#newExtSetup').click(function() {
				top.location.href = "new_extender_setup.html";
			});

			$$('#loginBt').click(function() {
				$$('.errorMsg').remove();
				if ( !$$.check_email( $$('#userId').val() ) ) {
					$$.addErrMsgAfter('userId', invalid_username);
				}
				if ( !$$.REG_PASSWORD.test($$('#password').val()) ) {
					$$.addErrMsgAfter('password', error_password_format);
				}
				if($$('#rememberMe').is(':checked'))
				{
					$$('#hid_remember_me').val("on");
				} else {
					$$('#hid_remember_me').val("off");
				}
				if (!$$('.errorMsg').length){
					$$.removeCookie('interim');
					$$.removeCookie('session');
					$$.submit_wait('body', $$.WAITING_DIV);
					if ( location.pathname != "/login.html" )
						$$('#loginForm').attr("action", $$('#loginForm').attr("action").replace(/\/start.htm/g, location.pathname));
					$$.ajax({
						url: $$('#loginForm').attr("action"),
						type: "POST",
						data: { "submit_flag": "login",
							"email": $$.base64.encode($$('#userId').val()),
							"password": $$.base64.encode($$('#password').val()),
							"hid_remember_me": $$('#hid_remember_me').val()
						},
						dataType: 'json',
						contentType: "application/json; charset=utf-8",
						success: postLoginForm
					});
				}
			});
		}

		/*******************************************************************************************
		 * 
		 * Username & Password Help
		 *
		 *******************************************************************************************/
		 if ($$('#pwdHelpForm').length) {
		 	checkNum = 2;
			$$('.answer').keyup( function() {
				var input = $$(this);
				if ( input.val().length > 0 ) {
					$$(this).addClass("activeElement");
				} else {
					$$(this).removeClass("activeElement");
				}
				$$.enableButton('nextStep', '#pwdHelpForm', checkNum);
			});
			$$('#nextStep').click(function(){
				$$('.errorMsg').remove();
				$$.submit_wait('body', $$.WAITING_DIV);
				$$.postForm('#pwdHelpForm', '', function(json){
					$$('.running').remove();
					if ( json.status == '1' ) {
						$$('#email').html($$.base64.decode(json.email));
						$$('#password').html($$.base64.decode(json.password));
						$$('.answerElements').removeClass('answerElements');
						$$('.quesElements').hide();
						$$('#nextStep').hide();
					} else {
						$$('.running').remove();
						$$.alertBox(json.msg);
						$$('.answer').val('');
					}
				});
			});
		 }
		 
		 /*******************************************************************************************
		 * 
		 * NEW EXTENDER SETUP page
		 *
		 *******************************************************************************************/
		if ( $$('#newExtendSetupForm').length ) {
			/*checkNum = 8;
			$$('#acceptCheckbox').click( function() {
				if ( $$(this).is(':checked') ) {
					$$(this).addClass('activeElement');
				} else {
					$$(this).removeClass('activeElement');
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
			});*/
			checkNum = 7;

			$$('#newPwd').keyup(function () {
				var pwd = $$(this).val(),
				pwd2 = $$('#newPwdVerify').val();
				if (pwd.length > 0 ) {
					$$('#newPwdVerify').prop('disabled', false);
				} else {
					$$('#newPwdVerify').prop('disabled', true);
				}
				if(pwd2 != '' && pwd != pwd2){
					if( !$$('#newPwdVerify').hasClass('alert') )
						$$('#newPwdVerify').addClass('alert');
					if( !$$('#repass').length )
						$$.addErrMsgAfter('newPwdVerify', error_not_same_pwd, false, 'repass');
				}else if(pwd == pwd2){
					$$('#newPwdVerify').removeClass('alert');
					$$('#repass').remove();
				}
			});

			/*$$('#newPwd').focus(function () {
				var pwd = $$(this).val();
				$$('#newPwdVerify').val('').removeClass('alert').removeClass('activeElement');
				$$('#repass').remove();
			});*/

			$$('#newPwdVerify').keyup(function() {
				var pwd = $$('#newPwd').val(),
				pwd2 = $$(this).val();
				if( $$.trim(pwd) == $$.trim(pwd2) && pwd2.length != 0 ) {
					$$(this).removeClass('alert');
					$$('#repass').remove();
				}
			});

			$$('#newPwdVerify').blur(function() {
				var pwd = $$('#newPwd').val(),
				pwd2 = $$(this).val();
				$$('#repass').remove();
				if( $$.trim(pwd) != $$.trim(pwd2) && pwd2.length != 0 ) {
					$$(this).addClass('alert');
					$$.addErrMsgAfter('newPwdVerify', error_not_same_pwd, false, 'repass');
				} else {
					$$(this).removeClass('alert');
					$$('#repass').remove();
				}
			});
			
			$$('input:not([type="button"])', '#newExtendSetupForm').each(function(i,ele){
				$$(ele).keyup( function() {
					if ($$(this).val().length > 0) {
						$$(this).addClass('activeElement');
					} else {
						$$(this).removeClass('activeElement');
					}
					$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
				});
			});

			$$('#newUserName').change( function() {
				var str = $$('#newUserName').val();
				if ($$.trim(str).length > 0) {
					$$(this).addClass('activeElement');
					if ( $$.check_email(str) ) {
						$$(this).removeClass('alert');
						$$('#err_email').remove();
					}
				} else {
					$$(this).removeClass('activeElement');
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
			});
			$$('#newUserName').trigger('change');

			$$('#newUserName').blur(function() {
				var str = $$('#newUserName').val();
				$$('#err_email').remove();
				if ( !$$.check_email(str) && str.length != 0 ) {
					$$(this).addClass('alert');
					$$.addErrMsgAfter('newUserName', invalid_emaill, false, 'err_email');
				} else {
					$$(this).removeClass('alert');
				}
			});

			$$('#newUserName').keyup(function() {
				var str = $$('#newUserName').val();
				if ($$.trim(str).length > 0) {
					$$(this).addClass("activeElement");
					if ( $$.check_email(str) ) {
						$$(this).removeClass('alert');
						$$('#err_email').remove();
					}
				} else {
					$$(this).removeClass("activeElement");
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
			});

			$$('#newPwd').change( function() {
				if ($$(this).val().length > 0) {
					$$(this).addClass('activeElement');
					$$('#newPwdVerify').prop('disabled', false);
				} else {
					$$(this).removeClass('activeElement');
					$$('#newPwdVerify').prop('disabled', true);
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
			});
			$$('#newPwd').trigger('change');

			$$('body').mouseover( function() {
				$$('#newPwd').trigger('change');
			});
			
			$$('#que1').change(function() {
				if ( $$(this).val() != -1 ) {
					$$(this).addClass('activeElement');
				} else {
					$$(this).removeClass('activeElement');
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
				$$('#securityQuestion1').html($$(this).find('option:selected').text() + '<span class=downArrow></span>').css({'color':'#7D706C','font-weight':'bold'});
			});

			$$('#que2').change(function() {
				if ( $$(this).val() != -1 ) {
					$$(this).addClass('activeElement');
				} else {
					$$(this).removeClass('activeElement');
				}
				$$.enableButton('nextStep', '#newExtendSetupForm', checkNum);
				$$('#securityQuestion2').html($$(this).find('option:selected').text() + '<span class=downArrow></span>').css({'color':'#7D706C','font-weight':'bold'})
			});

			$$('#newUserName').removeClass('activeElement');
			setTimeout(function(){
				if ( 'placeholder' in document.createElement('input') ) {
					$$('#newUserName').val("");
					$$('#newPwd').val("");
				}
				$$('#newUserName').removeAttr("style");
			}, $$.chromeTimer);
			$$('#nextStep').click(function(){
				$$('.errorMsg').remove();
				if ( !$$.check_email($$('#newUserName').val()) ) {
					$$('#newUserName').addClass('alert');
					$$.addErrMsgAfter('newUserName', invalid_emaill, false, 'err_email');
				}
				if ( !$$.REG_PASSWORD.test($$('#newPwd').val()) ) {
					$$.addErrMsgAfter('newPwd', error_password_format);
				}
				if ( !$$.REG_PASSWORD.test($$('#newPwdVerify').val()) ) {
					$$('#newPwdVerify').addClass('alert');
					$$.addErrMsgAfter('newPwdVerify', error_password_format, false, 'repass');
				} else if ($$('#newPwd').val() != $$('#newPwdVerify').val() ) {
					$$('#newPwdVerify').addClass('alert');
					$$.addErrMsgAfter('newPwdVerify', error_not_same_pwd, false, 'repass');
				}
				if ($$('#que1').val() == -1 ) {
					$$.addErrMsgAfter('que1', error_no_question);
				}
				if ($$('#ans1').val().length == 0 ) {
					$$.addErrMsgAfter('ans1', error_no_answer);
				}
				if (!$$.REG_ANSWER.test($$('#ans1').val())) {
					$$.addErrMsgAfter('ans1', invalid_answer);
				}
				if ($$('#que2').val() == -1 ) {
					$$.addErrMsgAfter('que2', error_no_question);
				}
				if ($$('#ans2').val().length == 0 ) {
					$$.addErrMsgAfter('ans2', error_no_answer);
				}
				if (!$$.REG_ANSWER.test($$('#ans2').val())) {
					$$.addErrMsgAfter('ans2', invalid_answer);
				}
				if (!$$('.errorMsg').length){
					$$.submit_wait('body', $$.WAITING_DIV);
					$$.postForm('#newExtendSetupForm','',function(json){
						if ( json.status == '1' ) {
							$$.removeCookie('dsessid');
							$$.removeCookie('session');
							if ( typeof(json.tmp) != 'undefined' )
							{
								$$.cookie('dsessid', json.tmp);
							}
							location.href = json.url;								
						} else {
							$$.removeCookie('dsessid');
							$$.removeCookie('session');
							$$('.running').remove();
							$$.alertBox(json.msg);
						}
					});
				}
			});
		}
		
		if ( $$('#multiLoginForm').length ) {
			$$('#nextStep').click(function() {
				$$.submit_wait('body', $$.WAITING_DIV);
				$$.postForm('#multiLoginForm', '', function(json) {
					location.href = json.url;
				});
			});
		}

	}); // end ready function

}(jQuery));
