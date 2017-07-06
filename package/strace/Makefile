# 
# Copyright (C) 2006 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#
# $Id: Makefile,v 1.1.2.1 2008-03-22 04:48:39 xinwei.niu Exp $

include $(TOPDIR)/rules.mk

PKG_NAME:=strace
PKG_VERSION:=4.5.19
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.bz2

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/strace
  SECTION:=utils
  CATEGORY:=Utilities
  DEPENDS:=
  TITLE:=Thread trace utility
endef

define Package/strace/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/strace $(1)/usr/sbin/
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
