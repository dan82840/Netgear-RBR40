function initPage()
{
	var head_tag = document.getElementsByTagName("h1");
	
	var head_text = document.createTextNode(bh_important);
	head_tag[0].appendChild(head_text);
	
	
	var paragraph = document.getElementsByTagName("p");
	
	var paragraph_text = document.createTextNode(bh_wanlan_conflict_info);
	paragraph[0].appendChild(paragraph_text);

	var bold_ipaddr = document.createElement("b");
	var ipaddr = document.createTextNode(ip_addr);
	bold_ipaddr.appendChild(ipaddr);
	paragraph[0].appendChild(bold_ipaddr);

	var btns_container_div = document.getElementById("btnsContainer_div");
	if( master == "admin" )
	btns_container_div.onclick = function()
	{
		clickContinue();
	}
	
	var btn = document.getElementById("btn_div");
	var btn_text = document.createTextNode(bh_continue_mark);
	btn.appendChild(btn_text);

	//show firmware version
	// 25613, if top page's ip is different with this page
	// there have a js error: "permission denied" 
	if(toppic == 1) 
	        showFirmVersion("none");
}

function clickContinue()
{
	/*if( location.href.indexOf("10.0.0.") > -1 )
		top.location.href="http://orbilogin.net";
	else if( location.href.indexOf("172.16.0.") > -1 )
		top.location.href="http://orbilogin.com";
	else if( location.href.indexOf("192.168.1.") > -1 )
		top.location.href="http://www.orbilogin.net";
	else if( location.href.indexOf("www.orbilogin.com") == -1 )
		top.location.href="http://www.orbilogin.com";
	else
		top.location.href="http://www.orbilogin.net";

	return true;*/
	var cf = document.forms[0];
	cf.submit();
}


addLoadEvent(initPage);
