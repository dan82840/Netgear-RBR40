#
# Copyright (c) 2014 The Linux Foundation. All rights reserved.
# Copyright (C) 2009 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

define Profile/Default
	NAME:=Default Profile (minimum package set)
	PACKAGES:= \
		kmod-usb-core kmod-usb-ohci kmod-usb2 kmod-ledtrig-usbdev \
		wide-dhcpv6-client kmod-qca-edma kmod-qca-ssdk-hnat \
		kmod-qca-wifi-10.4-dakota-perf qca-wrapd-10.4 \
		qca-wifi-fw-hw5-10.4-asic \
		qca-hostap-10.4 qca-hostapd-cli-10.4 qca-wpa-supplicant-10.4 \
		qca-wpa-cli-10.4  \
		-dnsmasq dnsmasq-dhcpv6 \
		-dropbear -firewall -ip6tables -iptables -mtd-utils-mkfs.ubifs \
		-mtd-utils-ubiattach -mtd-utils-ubidetach -mtd-utils-ubiformat \
		-mtd-utils-ubimkvol -mtd-utils-ubiupdatevol -ppp -ppp-mod-pppoe \
		-uboot-ipq806x -AUDIO_SUPPORT -USES_UBIFS -DISPLAY_SUPPORT \
		-KERNEL_DEBUG_FS -KERNEL_DEBUG_KERNEL -KERNEL_DEBUG_INFO -KERNEL_COREDUMP \
		-GDB -kmod-ipt-nathelper -PCI_SUPPORT -kmod-lib-crc-ccitt

endef

define Profile/Default/Description
	Default package set compatible with most boards.
endef
$(eval $(call Profile,Default))
