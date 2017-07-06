#!/bin/sh

find_mtd_part() {
	local PART="$(grep "\"$1\"" /proc/mtd | awk -F: '{print $1}')"
	local PREFIX=/dev/mtd

	PART="${PART##mtd}"
	[ -d /dev/mtd ] && PREFIX=/dev/mtd/
	echo "${PART:+$PREFIX$PART}"
}

echo "Save the collect log into debug-log.zip and upload to user"

#Disblae wireless debug log
iwpriv ath0 dbgLVL 0x0
iwpriv ath1 dbgLVL 0x0
iwpriv ath01 dbgLVL 0x0
iwpriv ath2 dbgLVL 0x0

module_name=`cat /module_name`

# Save the router config file
/bin/config backup /tmp/NETGEAR_$module_name.cfg

mtd_oops="$(find_mtd_part 'crashdump')"

#/sbin/debug_save_panic_log $mtd_oops

cd /tmp

# System will zipped all debug files into 1 zip file and save to client browser
# So a debug-log.zip file will includes
# (1) Console log
# (2) Basic debug information
# (3) router config file
# (4) LAN/WAN packet capture
# (5) thermal log

#Disable the capture
killall tcpdump
killall tcpdump
killall basic_log.sh 
killall console_log.sh 
killall wireless_log.sh  
killall thermal_log.sh  
killall hyt_dbglog.sh

#AS long as user click "Save logs" form debug page, the current HYCTL log should be generated and captured
if [ -f /tmp/wireless-log1.txt ]; then
	echo "AS long as user click "Save logs" form debug page, the current HYCTL log should be generated and captured" >>/tmp/wireless-log1.txt
	echo -n "gethatbl:" >>/tmp/wireless-log1.txt;	hyctl gethatbl br0 1000 >>/tmp/wireless-log1.txt	
	echo -n "gethdtbl:" >>/tmp/wireless-log1.txt;   hyctl gethdtbl br0 100 >>/tmp/wireless-log1.txt	
	echo -n "getfdb:" >>/tmp/wireless-log1.txt;   hyctl getfdb br0 100 >>/tmp/wireless-log1.txt
elif [ -f /tmp/wireless-log2.txt ]; then
	echo "AS long as user click "Save logs" form debug page, the current HYCTL log should be generated and captured" >> /tmp/wireless-log2.txt
	echo -n "gethatbl:" >>/tmp/wireless-log2.txt;	hyctl gethatbl br0 1000 >>/tmp/wireless-log2.txt	
	echo -n "gethdtbl:" >>/tmp/wireless-log2.txt;   hyctl gethdtbl br0 100 >>/tmp/wireless-log2.txt	
	echo -n "getfdb:" >>/tmp/wireless-log2.txt;   hyctl getfdb br0 100 >>/tmp/wireless-log2.txt

	echo -n "=== iwpriv ath0 txrx_fw_stats 3 ===" >>/tmp/wireless-log2.txt;   iwpriv ath0 txrx_fw_stats 3 >>/tmp/wireless-log2.txt
	echo -n "=== iwpriv ath0 txrx_fw_stats 6 ===" >>/tmp/wireless-log2.txt;   iwpriv ath0 txrx_fw_stats 6 >>/tmp/wireless-log2.txt
	echo -n "=== iwpriv ath1 txrx_fw_stats 3 ===" >>/tmp/wireless-log2.txt;   iwpriv ath1 txrx_fw_stats 3 >>/tmp/wireless-log2.txt
	echo -n "=== iwpriv ath1 txrx_fw_stats 6 ===" >>/tmp/wireless-log2.txt;   iwpriv ath1 txrx_fw_stats 6 >>/tmp/wireless-log2.txt
	echo -n "=== iwpriv ath2 txrx_fw_stats 3 ===" >>/tmp/wireless-log2.txt;   iwpriv ath2 txrx_fw_stats 3 >>/tmp/wireless-log2.txt
	echo -n "=== iwpriv ath2 txrx_fw_stats 6 ===" >>/tmp/wireless-log2.txt;   iwpriv ath2 txrx_fw_stats 6 >>/tmp/wireless-log2.txt
fi
	

echo close > /sys/devices/platform/serial8250/console

collect_log=`cat /tmp/collect_debug`


if [ "x$collect_log" = "x0" ];then
	/sbin/basic_log.sh &
	sleep 20
	killall basic_log.sh 
fi


dd if=/dev/mmcblk0p22 of=/tmp/panic_log.txt bs=131072 count=2
[ -f /tmp/panic_log.txt ] && unix2dos /tmp/panic_log.txt
#[ -f /tmp/Panic-log.txt ] && unix2dos /tmp/Panic-log.txt
[ -f /tmp/Console-log1.txt ] && unix2dos /tmp/Console-log1.txt
[ -f /tmp/Console-log2.txt ] && unix2dos /tmp/Console-log2.txt 
[ -f /tmp/wireless-log1.txt ] && unix2dos /tmp/wireless-log1.txt 
[ -f /tmp/wireless-log2.txt ] && unix2dos /tmp/wireless-log2.txt 
[ -f /tmp/basic_debug_log.txt ] && unix2dos /tmp/basic_debug_log.txt
[ -d /tmp/soapclient ] && unix2dos /tmp/soapclient/*
[ -d /var/log/soapclient ] && unix2dos /var/log/soapclient/*
[ -f /var/log/soapapp ] && unix2dos /var/log/soapapp
[ -f /tmp/hyt_result ] && unix2dos /tmp/hyt_result
[ -f /tmp/satellite_status ] && unix2dos /tmp/satellite_status
[ -e /tmp/radardetect.log ] && RADARLOG=radardetect.log
[ -f /tmp/thermal-log1.txt ] && unix2dos /tmp/thermal-log1.txt
[ -f /tmp/thermal-log2.txt ] && unix2dos /tmp/thermal-log2.txt
[ -f /tmp/HYT-dbg-log1.txt ] && unix2dos /tmp/HYT-dbg-log1.txt
[ -f /tmp/HYT-dbg-log2.txt ] && unix2dos /tmp/HYT-dbg-log2.txt

if [ "x$collect_log" = "x1" ];then
	zip debug-log.zip  NETGEAR_$module_name.cfg panic_log.txt /firmware_version Console-log1.txt Console-log2.txt  thermal-log1.txt thermal-log2.txt basic_debug_log.txt wireless-log1.txt wireless-log2.txt lan.pcap wan.pcap soapclient/* /var/log/soapclient/* /var/log/soapapp hyt_result satellite_status hyd-restart.log wsplcd-restart.log $RADARLOG HYT-dbg-log1.txt HYT-dbg-log2.txt
else
	zip debug-log.zip NETGEAR_$module_name.cfg  panic_log.txt /firmware_version Console-log1.txt Console-log2.txt thermal-log1.txt thermal-log2.txt wireless-log1.txt wireless-log2.txt basic_debug_log.txt lan.pcap wan.pcap soapclient /var/log/soapclient/* /var/log/soapapp hyt_result satellite_status hyd-restart.log wsplcd-restart.log $RADARLOG HYT-dbg-log1.txt HYT-dbg-log2.txt
fi

cd /tmp
rm -rf debug-usb debug_cpu debug_flash debug_mem debug_mirror_on debug_session NETGEAR_$module_name.cfg panic_log.txt Console-log1.txt Console-log2.txt thermal-log1.txt thermal-log2.txt basic_debug_log.txt lan.pcap wan.pcap wireless-log1.txt wireless-log2.txt /var/log/soapapp HYT-dbg-log1.txt HYT-dbg-log2.txt

echo 0 > /tmp/collect_debug
