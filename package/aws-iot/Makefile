#
# Copyright (C) 2007-2008 Delta Networks Inc.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=aws-iot
PKG_VERSION:=1.0
PKG_RELEASE:=1
PKG_BUILD_DEPENDS:=datalib

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/aws-iot
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=The AWS IoT to Publish Topic
endef

define Build/Prepare
	$(CP) ./src/* $(PKG_BUILD_DIR)
	$(CP) ./files/* $(PKG_BUILD_DIR)
endef

define Package/aws-iot/install
	install -d -m0755 $(1)/usr/sbin
	install -d -m0755 $(1)/etc/init.d
	install -d -m0755 $(1)/etc/router_analytics
	install -m0755 $(PKG_BUILD_DIR)/aws-iot.init $(1)/etc/init.d/aws-iot
	install -m0755 $(PKG_BUILD_DIR)/certs/*  $(1)/etc/router_analytics
	install -m0755 $(PKG_BUILD_DIR)/data_collector  $(1)/usr/sbin
	install -m0755 $(PKG_BUILD_DIR)/aws-iot  $(1)/usr/sbin
endef

$(eval $(call BuildPackage,aws-iot))
