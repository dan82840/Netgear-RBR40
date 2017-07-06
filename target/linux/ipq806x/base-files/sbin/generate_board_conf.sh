#!/bin/sh

CONFIG=/bin/config
board_model_id="$(/sbin/artmtd -r board_model_id | cut -f 2 -d ":")"

/sbin/artmtd -r region
firmware_region=`cat /tmp/firmware_region | awk '{print $1}'`

#When board_model_id on HW board data area is RBR50 or RBR40 or RBR30
if [ "$board_model_id" = "RBR50" -o "$board_model_id" = "RBR40" -o "$board_model_id" = "RBR30" ];then
	echo $board_model_id > /module_name
	echo $board_model_id > /hardware_version

	if [ "x$($CONFIG get board_region_default)" = "x1" ]; then
		/bin/config set wan_hostname=$board_model_id
		/bin/config set netbiosname=$board_model_id
		/bin/config set upnp_serverName="ReadyDLNA: $board_model_id"
	fi

	/bin/config set bridge_netbiosname=$board_model_id
	/bin/config set ap_netbiosname=$board_model_id
    	/bin/config set device_name=$board_model_id
	/bin/rm /sbin/udhcpd-ext
	/bin/rm /sbin/udhcpc-ext
	/bin/rm /usr/share/udhcpc/default.script-ext
	/bin/rm /usr/share/udhcpc/default.script.ap-ext
	/bin/rm /usr/sbin/net-scan-ext
	/bin/rm /usr/sbin/dev-scan-ext
	/bin/rm /usr/sbin/ntpclient-ext
	/bin/rm /etc/init.d/ntpclient-ext
	/bin/rm /etc/init.d/net-lan-ext
	/bin/rm /sbin/ap-led
#When board_model_id on HW board data area is RBS50 or RBS40 or RBS30
else 
	echo $board_model_id > /module_name
	echo $board_model_id > /hardware_version
	echo 1 > /proc/sys/net/ipv4/is_satelite
	if [ "x$($CONFIG get board_region_default)" = "x1" ]; then
		/bin/config set wan_hostname=$board_model_id
		/bin/config set netbiosname=$board_model_id
		/bin/config set upnp_serverName="ReadyDLNA: $board_model_id"
	fi

	/bin/config set bridge_netbiosname=$board_model_id
	/bin/config set ap_netbiosname=$board_model_id
    	/bin/config set device_name=$board_model_id
	/bin/mv /sbin/udhcpd-ext /sbin/udhcpd
	/bin/mv /sbin/udhcpc-ext /sbin/udhcpc
	/bin/mv /usr/share/udhcpc/default.script-ext /usr/share/udhcpc/default.script
	/bin/mv /usr/share/udhcpc/default.script.ap-ext /usr/share/udhcpc/default.script.ap
	/bin/mv /usr/sbin/net-scan-ext /usr/sbin/net-scan
	/bin/mv /usr/sbin/dev-scan-ext /usr/sbin/dev-scan
	/bin/mv /usr/sbin/ntpclient-ext /usr/sbin/ntpclient
	/bin/mv /etc/init.d/ntpclient-ext /etc/init.d/ntpclient
	/bin/mv /etc/init.d/net-lan-ext /etc/init.d/net-lan
	/bin/rm /etc/init.d/net-wan
	/bin/rm /etc/init.d/soap_agent
	/bin/rm /etc/init.d/dnsmasq
	/bin/rm /usr/sbin/dnsmasq
	/bin/rm /sbin/ping-netgear
	/bin/rm /usr/sbin/net-wall
	/bin/rm /etc/init.d/openvpn
fi

