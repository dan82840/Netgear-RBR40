#
# Copyright (C) 2007-2008 Delta Networks Inc.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=aws-iot-device-sdk
PKG_VERSION:=1.0
PKG_RELEASE:=1

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/aws-iot-device-sdk
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=The AWS IoT Device SDK for Embedded C
endef

define Build/Prepare
	$(CP) ./src/* $(PKG_BUILD_DIR)
endef

define Package/aws-iot-device-sdk/install
	install -d -m0755 $(1)/usr/sbin
	install -m0755 $(PKG_BUILD_DIR)/samples/linux/subscribe_publish_sample/subscribe_publish_sample  $(1)/usr/sbin
endef

$(eval $(call BuildPackage,aws-iot-device-sdk))
