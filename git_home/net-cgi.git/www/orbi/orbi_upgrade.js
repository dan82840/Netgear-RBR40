function see_detail(num)
{
	var win = window.open('UPG_show_version.htm?num='+num,'fw_status','width=625,height=400,top=70,left=230,status=yes,resizable=yes,scrollbars=yes');
	win.focus();
}
var MAX_UPG_TRIES = 30, MAX_CHK_TRIES = 75;
var wait_time=0, check_satellite_times=0;
var newVer_count=0, router_newVer=0;
var timeout;
var fw_info = new Array();
var dropped_num=0, upg_flag=1;
function update_fw_info(type, json)
{
	var null_dev_num = 0;
	eval(json);
	fw_info = [];
	var base_obj = {
		type: router_status_router,
		mac: "",
		modelname: base_dev_info['module name'],
		devname: base_dev_info['device name'],
		curver: base_dev_info['current version'],
		newver: base_check_info['new version'],
		chkstatus: base_check_info['check status'],
		upgstatus: base_upg_info['upgrade status'],
		detail_num: 0
	};
	fw_info.push(base_obj);

	update_devname();
	for(var i=0, len=ext_dev_info.length; i<len; i++)
	{
		var obj = {};
		if(ext_dev_info[i]['mac address'] == undefined)
		{
			null_dev_num++;
			continue;
		}
		obj['type'] = ORT_005;
		obj['mac'] = ext_dev_info[i]['mac address'];
		obj['modelname'] = ext_dev_info[i]['module name'];
		obj['devname'] = ext_dev_info[i]['device name'];
		obj['curver'] = ext_dev_info[i]['current version'];
		obj['newver'] = "0";
		obj['chkstatus'] = "0";
		obj['upgstatus'] = "0";
		obj['detail_num'] = -1;
		for(var j=0, len2=ext_check_info.length; j<len2; j++)
		{
			if(ext_check_info[j]['mac address'] == obj['mac'])
			{
				obj['newver'] = ext_check_info[j]['new version'];
				obj['chkstatus'] = ext_check_info[j]['check status'];
				obj['detail_num'] = j+1;
			}
		}
		if(type != "check" && obj['newver'] != "0")
		{
			for(var j=0, len2=ext_upg_info.length; j<len2; j++)
			{
				if(ext_upg_info[j]['mac address'] == obj['mac'])
					obj['upgstatus'] = ext_upg_info[j]['upgrade status'];
			}
		}
		fw_info.push(obj);
	}
	if(isCDLESS() || isWIZARD())
		dropped_num = satellite_num - (ext_dev_info.length - null_dev_num);
	else
		dropped_num = 0;
	for(var i=0; i<dropped_num; i++ )
	{
		var dropped_obj={
			type: ORT_005,
			mac: "",
			modelname: "BRS40",
			devname: "RBS40",
			curver: "--.--.--.--",
			newver: "",
			chkstatus: -1,
			upgstatus: -1,
			detail_num: 0
		}
		fw_info.push(dropped_obj);
	}
	upg_flag = 1;
	for(var i=0, len=fw_info.length; i<len; i++)
	{
		if(fw_info[i].chkstatus !== "000" && fw_info[i].chkstatus !== "003")
		{
			upg_flag = 0;
			break;
		}
	}
}

function refresh_content(type)
{
	var xmlhttp, xmlDoc;
	var base,module,devname,curver,sta,newver,discription;
	var fw_sta,i;
	var count=0;
	var wait_count=0, upg_success=0; router_success=0;
	var msg='<table border=1 cellpadding=2 cellspacing=0>'
		+'<tr><td></td><td>'+orbi_model_name+'</td><td>'+edit_devname+'</td><td>'+old_ver+'</td><td>'+stalist_Status+'</td></tr>';

	newVer_count=0, router_newVer=0;
	if ( window.XMLHttpRequest)
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.onreadystatechange = function()
	{
		if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 )
		{
			update_fw_info(type, xmlhttp.responseText);
			for(var i=0, len=fw_info.length; i<len; i++)
			{
				var fw_sta = fw_info[i]['chkstatus'],
				upg_sta = fw_info[i]['upgstatus'],
				newversion = fw_info[i]['newver'];
				if(fw_sta == -1)
				{
					discription = wait_for_conn;
				}
				else if(wan_status == 1)
				{
					if(type == "check" || fw_sta !== "000" || newversion == "0")
					{
						if(fw_sta == "000" && newversion != "0")
						{
							discription = '<a class="havenew" onclick="see_detail('+fw_info[i]['detail_num']+')">'+fw_info[i]['newver']+'</a>';
							newVer_count ++;
							if(i==0)
								router_newVer=1;
						}
						else if(fw_sta == "000" && newversion == "0")
							discription = no_new_version;
						else if(fw_sta == "001")
							discription = no_internet;
						else if(fw_sta == "002")
							discription = serv_unreachable;
						else if(fw_sta == "003")
							discription = no_new_version;
						else if(fw_sta == "005" && wait_time < MAX_CHK_TRIES && type == "check")
						{
							discription = down_in_back;
							wait_count ++;
						}
						else if(fw_sta === "004")
							discription = upg_failed;
						else if(wait_time >= MAX_CHK_TRIES || fw_sta == "0" && wait_time>20 && check_satellite_times > 10) { //This satellite lost connection to base
							discription = "No response";
							dropped_num ++;
						}
						else{
							discription = plz_wait_moment;
							wait_count ++;
						}
					}
					else if(type == "upgrade"){
						if(upg_sta == "001" || upg_sta == "002")
							discription = upg_failed;
						else if(wait_time >= MAX_UPG_TRIES)
							discription = "No response";
						else{
							if(upg_sta == "000"){
								upg_success ++;
								if(i == 0)
									router_success = 1;
							}
							else
								wait_count ++;
							discription = ORT_013;
						}
					}
				}
				else
					discription = no_internet;
				if(type=="check" && i==0){
					if(fw_sta == "005" || fw_sta == "0" || fw_sta == "006"){
						check_satellite_times = 0;
					}else{
						check_satellite_times ++;
					}
				}
				msg = msg + '<tr><td>' + fw_info[i]['type'] + '</td><td>' + fw_info[i]['modelname'] + '</td><td>' + fw_info[i]['devname'] + '</td><td>' + fw_info[i]['curver'] + '</td><td style="text-align:left">' + discription + '</td></tr>';
			}
			msg = msg + '</table>';
			document.getElementById("fw_check_table").innerHTML=msg;

			console.log("wait_count:"+wait_count+"; wait_time:"+wait_time+"; type:" +type+"; router_success:"+router_success+"; check_satellite_times:"+check_satellite_times);

			if(type == "check" && (wait_time<1 || wait_count > 0 && wait_time < MAX_CHK_TRIES)){
				document.getElementById("refresh").disabled = true;
				document.getElementById("upgrade_all").disabled = true;
				timeout = setTimeout("refresh_content('check');", wait_time<10? 1000:5000);
				wait_time ++;
			}else if(type == "upgrade" && router_success==0 && wait_count > 0 && wait_time < MAX_UPG_TRIES){
				document.getElementById("refresh").disabled = true;
				document.getElementById("upgrade_all").disabled = true;
				timeout = setTimeout("refresh_content('upgrade');", 3000);
				wait_time ++;
			}else if(type == "upgrade" && (upg_success > 0 || router_success== 1)){
				document.location.href = "pls_wait.html";
			}else if(type == "check" && newVer_count == 0 && upg_flag == 1 && (isCDLESS() || isWIZARD())){
				document.getElementById("refresh").disabled = false;
				document.getElementById("upgrade_all").disabled = false;
				document.getElementById("upgrade_all").value = "NEXT";
			}else if(dropped_num > 0 || upg_flag == 0 || type == "check" && newVer_count == 0 || type == "upgrade"){
				document.getElementById("refresh").disabled = false;
				document.getElementById("upgrade_all").disabled = true;
			}else{
				document.getElementById("refresh").disabled = false;
				document.getElementById("upgrade_all").disabled = false;
			}
		}
	};
	xmlhttp.open("GET", "online_upgrade_info.html?ts=" + new Date().getTime(), true);
	xmlhttp.send();
}
function do_upgrade(cf, url)
{
	if(router_newVer == 1 && newVer_count > 1){
		cf.submit_flag.value="upgrade_orbi_image";
		cf.action="/func.cgi?/"+url+"?type=upgrade timestamp="+ts;
		cf.submit();
	}else if(router_newVer == 1){
		cf.submit_flag.value="upgrade_base_image";
		cf.action="/func.cgi?/"+url+"?type=upgrade timestamp="+ts;
		cf.submit();
	}else if(newVer_count>0){
		cf.submit_flag.value="upgrade_satellite_image";
		cf.action="/apply.cgi?/"+url+"?type=upgrade timestamp="+ts;
		cf.submit();
	}else if(newVer_count == 0 && upg_flag == 1 && (isCDLESS() || isWIZARD())){
		toInternet();
	}
}
function do_check(cf, url)
{
	cf.submit_flag.value="download_orbi_confile";
	cf.action="/func.cgi?/"+url+"?type=check timestamp="+ts;
	cf.submit();
}
function update_devname()
{
	for(var i=0, len=ext_dev_info.length; i<len; i++){
		var dev_name  = device_names[ext_dev_info[i]['mac address']];
		if(typeof dev_name != "undefined")
			ext_dev_info[i]['device name'] = dev_name;
	}
}
function init_check_table()
{
	var msg = '<table border=1 cellpadding=2 cellspacing=0 width=80%>'
		+'<tr><td></td><td>'+orbi_model_name+'</td><td>'+edit_devname+'</td><td>'+old_ver+'</td><td>'+stalist_Status+'</td></tr>';
	msg += '<tr><td>'+router_status_router+'</td><td>' + base_dev_info['module name'] + '</td><td>' + base_dev_info['device name'] + '</td><td>' + base_dev_info['current version'] + '</td><td></td></tr>';
	for(var i=0, len=ext_dev_info.length; i<len; i++){
		if(ext_dev_info[i]['mac address'] == undefined)
			continue;
		msg += '<tr><td>'+ORT_005+'</td><td>' + ext_dev_info[i]['module name'] + '</td><td>' + ext_dev_info[i]['device name'] + '</td><td>' + ext_dev_info[i]['current version'] + '</td><td></td></tr>';
	}
	msg += '</table>';
	document.getElementById("fw_check_table").innerHTML=msg;

	document.getElementById("refresh").disabled = true;
	document.getElementById("upgrade_all").disabled = true;
}

