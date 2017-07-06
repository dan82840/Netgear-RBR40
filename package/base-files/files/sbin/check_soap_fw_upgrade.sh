#!/bin/sh

echo check_soap_fw_upgrade.sh is running  >> /dev/console

while [ 1 ]; do

	busy_soap=`ls /tmp/soapclient/busy_mac_info`
	soap_setting=`/bin/config get soap_setting`
	soap_running=`ps | grep soapclient | grep -v grep`

	echo busy_soap is $busy_soap >> /dev/console
	echo soap_setting is $soap_setting >> /dev/console
	echo soap_running is $soap_running >> /dev/console

	if [ "x$busy_soap" != "x" -a "x$soap_running" = "x" ]; then
		echo running CheckFirmware now >> /dev/console
		rm -rf /tmp/soapclient/fmw_info/*
		rm -rf /tmp/soapclient/dev_info/*
		rm -rf /tmp/satellite_has_new_firmware

		/bin/config set soap_setting=CheckFirmware
		/usr/bin/killall -SIGUSR1 soap_agent	
	fi
	
	sleep 15

done
	
