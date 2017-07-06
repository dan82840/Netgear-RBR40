var Africa=0;
var Asia=1;
var Australia=2;
var Canada=3;
var China=11;
var Europe=4;
var India=12;
var Israel=5;
var Japan=6;
var Korea=7;
var Malaysia=13;
var Mexico=8;
var Middle_East_Algeria_Syria_Yemen=14;
var Middle_East_Iran_Lebanon_Qatar=15;
var Middle_East_Turkey_Egypt_Tunisia_Kuwait=16;
var Middle_East_Saudi_Arabia=17;
var Middle_East_United_Arab_Emirates=18;
var Middle_East=22;
var Russia=19;
var Singapore=20;
var South_America=9;
var Taiwan=21;
var United_States=10;
var qca_region_arr=new Array("za", "none", "au", "ca", "eu", "il", "jp","kr", "mx", "none", "us", "cn", "none", "my", "none", "none", "tr", "sa", "ae", "ru", "sg", "tw","");
function getObj(name)
{
       if (document.getElementById)
       {
               return document.getElementById(name);
       }
       else if (document.all)
       {
               return document.all[name];
       }
       else if (document.layers)
       {
               return document.layers[name];
       }
}

function setSecurity(num)
{
        var form=document.forms[0];
        form.wpa2_press_flag.value=0;
        form.wpas_press_flag.value=0;
        if(num==4)
                getObj("view").innerHTML=str_wpa2;
        else if(num==5)
                getObj("view").innerHTML=str_wpas;
        else
                getObj("view").innerHTML=str_none;
}

//bug 23854:The dialogue of DFS channel is not implemented
function check_dfs()
{
	var cf = document.forms[0]; 
	var each_info = dfs_info.split(':');
	var channel_info;
	var channel = cf.w_channel_an;
        var ch_index = channel.selectedIndex;
        var ch_name = channel.options[ch_index].text;
	var ch_value = channel.options[ch_index].value;
	var ht160_enabled= (top.support_ht160_flag == 1 && enable_ht160 == "1" && ((index == 10 || index == 4)))

	if( ch_name.indexOf('(DFS)') == -1 && !ht160_enabled)
	{ // not a DFS channel and  ht160 disabled, return true, continue other check.
		return true;
	}
	if(top.dfs_radar_detect_flag == 1){	
		var currentMode = wla_mode;
		var index = wl_get_countryA;
		var tmp_array;
		if(ht160_enabled)
		{
			if(dfs_radar_160 == undefined)
				return true;
			tmp_array = dfs_radar_160;
		}
	        else if( 9 == currentMode)
        	{
			if(dfs_radar_80 == undefined)
				return true;

	                tmp_array = dfs_radar_80;
        	}
		else
		{
			if(dfs_radar_40 == undefined)
				return true;
			tmp_array = dfs_radar_40;
		}
		for( var i=0; i<tmp_array.length-1; i++)
		{
			var channel = tmp_array[i].channel;
			var min = tmp_array[i].expire/60;
			var sec = tmp_array[i].expire%60;

			if( channel == ch_value)
			{
				alert("$using_dfs_1" + min.toFixed(0) + "$using_dfs_2" + sec + "$using_dfs_3");
				return false;
			}
		}
	}else{
	  for ( i=0; i<each_info.length; i++ )
	  {
		channel_info = each_info[i].split(' '); //channel; channel_flag; channe_priflag; left_time
		var sec = channel_info[3]%60;		//change left time format
		var min = parseInt(channel_info[3]/60);
		if( (5000 + 5*(parseInt(ch_value, 10))) == parseInt(channel_info[0], 10) )
		{
			alert("$using_dfs_1" + min + "$using_dfs_2" + sec + "$using_dfs_3");
			return false;
		}
	  }
	}
	if( ch_name.indexOf('(DFS)') != -1  && confirm("$select_dfs") == false)
		return false;

	return true;
}

function setChannel()
{
	var cf = document.forms[0];
	var index = region_index;
	if(netgear_region.toUpperCase() == "NA" || netgear_region.toUpperCase() == "US")
		index = "21";
	if(netgear_region.toUpperCase() == "RU")
		index = "17";
	if(netgear_region.toUpperCase() == "CA")
		index = "3";
	if(netgear_region.toUpperCase() == "JP")
		index = "8";
	index=parseInt(index)+1;
	var chIndex = cf.w_channel.selectedIndex;
	var currentMode = wl_mode;
	var endChannel;
  
		endChannel = FinishChannel[index];
	if (FinishChannel[index]==14)
		cf.w_channel.options.length = endChannel - StartChannel[index];
	else
		cf.w_channel.options.length = endChannel - StartChannel[index] + 2;

	cf.w_channel.options[0].text = "$auto_mark";
	cf.w_channel.options[0].value = 0;

	for (var i = StartChannel[index]; i <= endChannel; i++) {
		if (i==14)
			continue;
		cf.w_channel.options[i - StartChannel[index] + 1].value = i;
		cf.w_channel.options[i - StartChannel[index] + 1].text = (i < 10)? "0" + i : i;
	}
	cf.w_channel.selectedIndex = ((chIndex > -1) && (chIndex < cf.w_channel.options.length)) ? chIndex : 0 ;
}

function setBChannel()
{
	var cf = document.forms[0];
	var index = region_index;
	if(netgear_region.toUpperCase() == "NA" || netgear_region.toUpperCase() == "US")
		index = "21";
	if(netgear_region.toUpperCase() == "RU")
		index = "17";
	if(netgear_region.toUpperCase() == "CA")
		index = "3";
	if(netgear_region.toUpperCase() == "JP")
		index = "8";
		
	index = parseInt(index)+1;
	var chIndex = cf.w_channel.selectedIndex;
	var endChannel;

	endChannel = FinishChannelB[index];
	if (FinishChannelB[index]==14)
		cf.w_channel.options.length = endChannel - StartChannelB[index];
	else
		cf.w_channel.options.length = endChannel - StartChannelB[index] + 2;

	cf.w_channel.options[0].text = "$auto_mark";
	cf.w_channel.options[0].value = 0;

	for (var i = StartChannelB[index]; i <= endChannel; i++) {
		if (i==14)
			continue;
		cf.w_channel.options[i - StartChannelB[index] + 1].value = i;
		cf.w_channel.options[i - StartChannelB[index] + 1].text = (i < 10)? "0" + i : i;
	}
	cf.w_channel.selectedIndex = ((chIndex > -1) && (chIndex < cf.w_channel.options.length)) ? chIndex : 0 ;
}

function chgChA(from)
{   
	var cf = document.forms[0];

	setAChannel(cf.w_channel_an);
}


function setAChannel(channel)
{
	var cf = document.forms[0];
	var index = wl_get_countryA;
	var currentMode = wla_mode;
	var option_array=document.getElementById("wireless_channel_an").options;
	var chValue = channel.value;
	var find_value = 0;
	var i, j=0, val;
	var tmp_array = ht40_array[index];

	if ( 1 == currentMode || 2 == currentMode || 7 == currentMode )
	{
		tmp_array = ht20_array[index];
	}
	else if( 9 == currentMode)
	{
		tmp_array = ht80_array[index];
	}

	channel.options.length = tmp_array.length+1;

	if ( dfs_channel_router_flag == 1 ) //Australia, Canada, Europe
	{
		channel.options[j].value = 0;
		channel.options[j].text = "$auto_mark";
		j++;
	}

	for ( i = 0; i < tmp_array.length; i++ )
	{
		if ( 0 == hidden_dfs_channel && ( 1 == dfs_channel_router_flag ||
			( dfs_canada_router_flag == 1 &&  index == 3 ) || //Australia, Canada, Europe
			( dfs_australia_router_flag == 1 &&  index == 2 ) ||
			( dfs_europe_router_flag == 1 && index == 4) ||
			( dfs_japan_router_flag && index == 6 ) ) ) //Japan, United States
		{
			if ( tmp_array[i].indexOf("(DFS)") > -1 )
			{
				val =  tmp_array[i].split("(DFS)")[0];
				channel.options[j].value = val;
				channel.options[j].text = tmp_array[i];
				j++;
			}
			else
			{
				channel.options[j].value = channel.options[j].text = tmp_array[i];
				j++
			}
		}
		else
		{
			if ( tmp_array[i].indexOf("(DFS)") > -1 )
				continue;
			if(currentMode == 9 && index == 21)//50244
				if(tmp_array[i] == "60" || tmp_array[i] == "64")
					continue;
			if( (index ==10 || index == 17) && (tmp_array[i] == "149" || tmp_array[i] == "153" || tmp_array[i] == "157" || tmp_array[i] == "161") )//53381
				continue;
			channel.options[j].value = channel.options[j].text = tmp_array[i];
			j++;
		}

	}
	channel.options.length = j;

	for(i=0; i<option_array.length; i++)
	{
		if(option_array[i].value == chValue)
		{
			find_value = 1;
			channel.selectedIndex = i;
			break
		}
	}
	if (find_value == 0)
	{/* to fix bug 27403 */
		for(i=0;i<option_array.length;i++)
		{
			if(option_array[i].value == wla_get_channel)
			{
				find_value = 1;
				channel.selectedIndex = i;
				break;
			}
		}	
	}
	if(find_value == 0)
		channel.selectedIndex = 0;
}

function check_wlan()
{
	if( check_dfs() == false)
	{
		return false;
	}
	//fix bug 29094
	var tag1=0;//when the value is 1, not pop up "guest_tkip_300_150" for 5G 
	var tag2=0;//when the value is 1, not pop up "guest_tkip_aes_300_150" for 5G
	var tag3=0;//when the value is 1, not pop up "wlan_tkip_aes_300_150" for 5G
	var cf=document.forms[0];
	
	var ssid_bgn = document.forms[0].ssid.value;
	//var space_flag=0;
	var haven_wpe=0;
	var haven_alert_tkip=0;

	var wla1_ssid=document.forms[0].wla1ssid.value;
	var wlg1_ssid=document.forms[0].wlg1ssid.value;
	
	var ssid_len = ssid_bgn.length;
	for(i=0;i<ssid_bgn.length;i++)
	{
		if(ssid_bgn.charCodeAt(i)==32)
			ssid_len--;
	}
	
	if(ssid_bgn == "" || ssid_len == 0)
	{
		alert("$ssid_null");
		return false;
	}
	
	if(ssid_bgn == wlg1_ssid)
	{
		alert("$ssid_not_allowed_same");
		return false;
	}
	
	for(i=0;i<ssid_bgn.length;i++)
	{
		if(isValidChar_space(ssid_bgn.charCodeAt(i))==false)
		{
			alert("$ssid_not_allowed");
			return false;
		}
	}

	cf.wl_ssid.value = ssid_bgn;
	
	
	cf.wl_apply_flag.value = "1";//bug 30924,if click the 'Apply' wl_apply_flag is '1',otherwise is '0'
	if ( wds_endis_fun == 1 )
	{
		if ( cf.w_channel.selectedIndex == 0 )
		{
			alert("$wds_auto_channel");
			return false;
		}
	}
	cf.wl_hidden_wlan_channel.value = cf.w_channel.value;
	if( cf.enable_coexist.checked == true)
                cf.hid_enable_coexist.value="0";
        else
                cf.hid_enable_coexist.value="1";

	if(cf.security_type[1].checked == true)
	{
		if( checkpsk(cf.passphrase, cf.wl_sec_wpaphrase_len)== false)
			return false;
		cf.wl_hidden_sec_type.value=4;
		cf.wl_hidden_wpa_psk.value = cf.passphrase.value;
	}	
	else if(cf.security_type[2].checked == true)
	{
		if( checkpsk(cf.passphrase, cf.wl_sec_wpaphrase_len)== false)
			return false;
		cf.wl_hidden_sec_type.value=5;
		cf.wl_hidden_wpa_psk.value = cf.passphrase.value;
	}	
	else
		cf.wl_hidden_sec_type.value=1;


	var flad_op = false;
	if(parent.bgn_mode3_value > 150 && cf.enable_coexist.checked == true)
	{
	    flad_op = true;
	     alert(msg);
	}
	
	if(an_router_flag == 1)
	{		
		document.forms[0].ssid_an.value= document.forms[0].ssid.value;
		var ssid_an = document.forms[0].ssid_an.value;
		if( ssid_an == "")
		{
			alert("$ssid_null");
			return false;
		}
		if(ssid_bgn == wlg1_ssid || ssid_bgn == wla1_ssid || ssid_an == wlg1_ssid || ssid_an == wla1_ssid)
		{
			alert("$ssid_not_allowed_same");
			return false;
		}
		for(i=0;i<ssid_an.length;i++)
		{
			if(isValidChar_space(ssid_an.charCodeAt(i))==false)
			{
				alert("$ssid_not_allowed");
				return false;
			}
		}
		
		cf.wla_ssid.value = ssid_an;

		//16400
		
		cf.wla_hidden_wlan_channel.value = cf.w_channel_an.value;
		cf.wla_hidden_sec_type.value=cf.wl_hidden_sec_type.value;
		if(cf.wla_hidden_sec_type.value == "3" || cf.wla_hidden_sec_type.value == "4" || cf.wla_hidden_sec_type.value == "5")
		{
			cf.passphrase_an.value = cf.passphrase.value;
			if( checkpsk(cf.passphrase_an, cf.wla_sec_wpaphrase_len)== false)
				return false;
			cf.wla_hidden_wpa_psk.value = cf.passphrase_an.value;	
		}
		
		var channel_a=cf.w_channel_an.value;
		var country=wl_get_countryA;
		//transmit power control, according to the change of country, change values of wl_txctrl and wla_txctrl.
		wlan_txctrl(cf, wl_txctrl_web, wla_txctrl_web, channel_a, country);

	}

	if( endis_wl_radio == 1 && (cf.wl_hidden_sec_type.value == "2" || cf.wl_hidden_sec_type.value == "3") ||
	(an_router_flag ==1 && endis_wla_radio == 1 &&( cf.wla_hidden_sec_type.value == "2" || cf.wla_hidden_sec_type.value == "3" )) )
	{
		if(haven_wpe == 0)
		{
			if(!confirm("$wps_warning2"))
				return false;
		}
	}

	if( cf.wl_hidden_sec_type.value == "1" || (an_router_flag ==1 && cf.wla_hidden_sec_type.value == "1" ) )
	{
		if(!confirm("$wps_warning3"))
			return false;
	}

	if((endis_wl_radio == 1 && cf.wl_hidden_sec_type.value == "6" ) ||
	(an_router_flag ==1 && cf.wla_hidden_sec_type.value == "6" && endis_wla_radio == 1))
	{
		if(haven_wpe == 0)
		{
			if (!confirm("$wpae_or_wps"))
				return false;
		}
	}
	
	cf.submit();
	return true;	
}

function check_wlan_guest(type)
{
	var cf=document.forms[0];

	var ssid = document.forms[0].ssid.value;
	cf.s_gssid.value=ssid;
	cf.s_gssid_an.value=ssid;

	var wl_ssid=document.forms[0].wlssid.value;
	var wla_ssid=document.forms[0].wlassid.value;
	var tag1 = 0;

	if(ssid == "")
	{
		alert("$ssid_null");
		return false;
	}

        if(ssid == wl_ssid)
        {
                alert("$ssid_not_allowed_same");
                return false;
        }
	for(i=0;i<ssid.length;i++)
	{
		if(isValidChar_space(ssid.charCodeAt(i))==false)
		{
			alert(ssid + "$ssid_not_allowed");
			return false;
		}
	}

	if(cf.enable_bssid.checked == true)
	{
		cf.hidden_enable_guestNet.value=1;
		cf.hidden_enable_guestNet_an.value=1;
	}
	else
	{
		cf.hidden_enable_guestNet.value=0;
		cf.hidden_enable_guestNet_an.value=0;
	}
		
	if(cf.enable_ssid_bc.checked == true)
	{
		cf.hidden_enable_ssidbro.value=1;
		cf.hidden_enable_ssidbro_an.value=1;
	}
	else
	{
		cf.hidden_enable_ssidbro.value=0;
		cf.hidden_enable_ssidbro_an.value=0;
	}

	if(cf.allow_access.checked == true)
	{
		cf.hidden_allow_see_and_access.value=1;
		cf.hidden_allow_see_and_access_an.value=1;
	}
	else
	{
		cf.hidden_allow_see_and_access.value=0;
		cf.hidden_allow_see_and_access_an.value=0;
	}

	var haven_alert_tkip = 0;
	cf.wl_hidden_wlan_mode.value = wl_simple_mode;
	cf.wl_hidden_wlan_mode_an.value = wl_simple_mode_an;

	if(cf.security_type[1].checked == true)
	{
		cf.hidden_guest_network_mode_flag.value=0;
		cf.hidden_guest_network_mode_flag_an.value=0;
		if( checkpsk(cf.passphrase, cf.sec_wpaphrase_len)== false)
			return false;
		cf.passphrase_an.value = cf.passphrase.value;
		cf.sec_wpaphrase_len_an.value = cf.sec_wpaphrase_len.value;
		cf.hidden_sec_type.value=4;
		cf.hidden_sec_type_an.value=4;
		cf.hidden_wpa_psk.value = cf.passphrase.value;
		cf.hidden_wpa_psk_an.value = cf.passphrase_an.value;
	}	
	else if(cf.security_type[2].checked == true)
	{
		if( checkpsk(cf.passphrase, cf.sec_wpaphrase_len)== false)
			return false;
		cf.passphrase_an.value = cf.passphrase.value;
		cf.sec_wpaphrase_len_an.value = cf.sec_wpaphrase_len.value;
		if(wl_simple_mode != "1")
        {
			tag1 = 1;
			if(confirm("$wlan_tkip_aes_300_150") == false)
			{
				cf.hidden_guest_network_mode_flag.value=0;
				cf.hidden_guest_network_mode_flag_an.value=0;
				return false;
			}
		}
		cf.hidden_guest_network_mode_flag.value=2;
		cf.hidden_guest_network_mode_flag_an.value=2;
		cf.wl_hidden_wlan_mode.value = wl_simple_mode;
		cf.wl_hidden_wlan_mode_an.value = wl_simple_mode_an;

		cf.hidden_sec_type.value=5;
		cf.hidden_sec_type_an.value=5;
		cf.hidden_wpa_psk.value = cf.passphrase.value;
		cf.hidden_wpa_psk_an.value = cf.passphrase_an.value;
	}	
	else
	{
		cf.hidden_sec_type.value=1;
		cf.hidden_sec_type_an.value=1;
	}
	
	cf.submit();
	return true;
}

var ht20_array = new Array(
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "136(DFS)", "140(DFS)" ), //0
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ), //1
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "132(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ), //2
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ), //3
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)" ), //4
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)" ), //5
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)" ), //6
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "149", "153", "157", "161" ), //7
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161", "165" ), //8
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ), //9
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ), //10
	new Array ( "149", "153", "157", "161", "165" ), //11
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161", "165" ), //12
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161", "165" ), //13
	new Array ( "" ), //14
	new Array ( "149", "153", "157", "161", "165" ), //15
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)" ), //16
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "165" ), //17
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)" ), //18
	new Array ( "36", "40", "44", "48" ), //19
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161", "165" ), //20
	new Array ( "56", "60", "64", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "140(DFS)", "149", "153", "157", "161", "165" ) //21
);
var ht40_array = new Array(
	new Array ( "" ), //0
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "149", "153", "157", "161" ), //1
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "132(DFS)", "136(DFS)", "149", "153", "157", "161" ), //2
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "149", "153", "157", "161" ), //3
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)" ), //4
	new Array ( "" ), //5
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)" ), //6
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "149", "153", "157", "161" ), //7
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161" ), //8
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "149", "153", "157", "161" ), //9
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "149", "153", "157", "161" ), //10
	new Array ( "149", "153", "157", "161" ), //11
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161" ), //12
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161" ), //13
	new Array ( "" ), //14
	new Array ( "149", "153", "157", "161" ), //15
	new Array ( "" ), //16
	new Array ( "" ), //17
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)" ), //18
	new Array ( "36", "40", "44", "48" ), //19
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "149", "153", "157", "161" ), //20
	new Array ( "60", "64", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)", "132(DFS)", "136(DFS)", "149", "153", "157", "161" ) //21
);
var ht80_array = new Array(
	new Array ( "36", "40", "44", "48" ), //0
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)" ), //1
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)"), //2
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)"), //3
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)" ), //4
	new Array ( "36", "40", "44", "48" ), //5
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)" ), //6
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)"), //7
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)"), //8
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)"), //9
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)" ), //10
	new Array ( "36", "40", "44", "48" ), //11
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)" ), //12
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)" ), //13
	new Array ( "36", "40", "44", "48" ), //14
	new Array ( "36", "40", "44", "48" ), //15
	new Array ( "36", "40", "44", "48" ), //16
	new Array ( "36", "40", "44", "48" ), //17
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)" ), //18
	new Array ( "36", "40", "44", "48" ), //19
	new Array ( "36", "40", "44", "48", "52(DFS)", "56(DFS)", "60(DFS)", "64(DFS)"), //20
	new Array ( "36", "40", "44", "48", "100(DFS)", "104(DFS)", "108(DFS)", "112(DFS)", "116(DFS)", "120(DFS)", "124(DFS)", "128(DFS)") //21
);
