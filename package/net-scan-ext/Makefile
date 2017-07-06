# 
#  Copyright (C) 2007-2009 Delta Networks Inc.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=net-scan-ext
PKG_RELEASE:=1

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

PKG_GIT_TREEISH:=net-scan-v1.0-dni23

include $(INCLUDE_DIR)/package.mk

define Package/net-scan-ext
	SECTION:=utils
	CATEGORY:=Network
	DEPENDS:=@TARGET_ipq806x
	TITLE:=Scanning the attached devices according to NETGEAR's spec.
	DEPENDS:=datalib
endef

define Build/Prepare
	$(CP) $(GIT_HOME)/net-scan-ext.git/* $(PKG_BUILD_DIR)/
endef

define Package/net-scan-ext/install
	install -d -m0755 $(1)/usr/sbin
	install -m0755 $(PKG_BUILD_DIR)/net-scan $(1)/usr/sbin/net-scan-ext
	install -m0755 $(PKG_BUILD_DIR)/dev-scan $(1)/usr/sbin/dev-scan-ext
endef

$(eval $(call BuildPackage,net-scan-ext))
