# Copyright (c) 2014 The Linux Foundation. All rights reserved.
#
include $(TOPDIR)/rules.mk
include $(INCLUDE_DIR)/image.mk

MODULE_NAME=$(CONFIG_DGC_MODULE_NAME)
MODULE_NAME_CC=$(CONFIG_DGC_MODULE_NAME_CC)
HW_VERSION=$(CONFIG_DGC_HW_VERSION)
FW_VERSION=$(CONFIG_DGC_FW_VERSION)
LG_VERSION=$(CONFIG_DGC_LG_VERSION)
CLOUD_VERSION=$(CONFIG_DGC_CLOUD_VERSION)
HW_ID=$(CONFIG_DGC_HW_ID)
ifndef FW_REGION
	FW_REGION=$(CONFIG_DGC_FW_REGION)
endif

# 8M
#KERNEL_SIZE=3407872
KERNEL_SIZE=3932160
# 10.875M
ROOTFS_SIZE=27787264


UBIFS_OPTS = -m 2048 -e 124KiB -c 4096 -U -F
UBI_OPTS = -m 2048 -p 128KiB

E2SIZE=$(shell echo $$(($(CONFIG_TARGET_ROOTFS_PARTSIZE)*1024)))

define Image/Prepare
	echo "$(MODULE_NAME)" > $(TARGET_DIR)/module_name
	echo "$(HW_VERSION)" > $(TARGET_DIR)/hardware_version
	echo "V$(FW_VERSION)" > $(TARGET_DIR)/firmware_version
	echo "$(CLOUD_VERSION)" > $(TARGET_DIR)/cloud_version
	echo "$(FW_REGION)" > $(TARGET_DIR)/firmware_region
	echo "$(LG_VERSION)" > $(TARGET_DIR)/firmware_language_version
	echo $(HW_ID) > $(TARGET_DIR)/hw_id
	date > $(TARGET_DIR)/firmware_time
	echo "1" > $(TARGET_DIR)/etc/init.d/.hidden_new_features
endef


ifneq ($(CONFIG_TARGET_ROOTFS_UBIFS),)
define Image/mkfs/ubifs_fit
	$(call Image/mkfs/ubifs/generate,$(1))
	$(call Image/Build,ubi,$(1))
	$(call Image/UbiImage,$(1))
endef
endif

define Image/BuildKernel/FIT
	$(CP) $(KDIR)/Image $(BIN_DIR)/$(IMG_PREFIX)-vmlinux.bin
	gzip -9 -c $(KDIR)/Image > $(KDIR)/Image.gz
	$(call CompressLzma,$(KDIR)/Image,$(KDIR)/Image.gz)
ifeq ($(3),compressed-dtb)
	gzip -9 -c $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb > $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb.gz
	$(call Image/BuildKernel/MkFIT,$(1), $(KDIR)/Image.gz, $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb.gz,gzip,$(2),$(2),,$(4))
else
	$(call Image/BuildKernel/MkFIT,$(1), $(KDIR)/Image.gz, $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb,gzip,$(2),$(2))
endif
	$(CP) $(KDIR)/fit-$(1).itb $(BIN_DIR)/$(IMG_PREFIX)-$(1)-fit-uImage.itb
	$(CP) $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb $(BIN_DIR)/$(IMG_PREFIX)-$(1).dtb
	mkdir -p $(BIN_DIR)/dtbs/
	$(CP) $(LINUX_DIR)/arch/arm/boot/dts/qcom-ipq8064*.dtb $(BIN_DIR)/dtbs/
ifneq ($(CONFIG_TARGET_ROOTFS_INITRAMFS),)
	$(CP) $(KDIR)/Image-initramfs $(BIN_DIR)/$(IMG_PREFIX)-vmlinux-initramfs.bin
	$(call Image/BuildKernel/MkFIT,$(1), $(KDIR)/Image-initramfs, $(LINUX_DIR)/arch/arm/boot/dts/$(1).dtb, none,$(2),$(2))
	$(CP) $(KDIR)/fit-$(1).itb $(BIN_DIR)/$(IMG_PREFIX)-$(1)-fit-uImage-initramfs.itb
endif
endef

define Image/BuildKernel/GenericFIT
	$(CP) $(KDIR)/Image $(BIN_DIR)/$(IMG_PREFIX)-vmlinux.bin
	gzip -9 -c $(KDIR)/Image > $(KDIR)/Image.gz
	$(call CompressLzma,$(KDIR)/Image,$(KDIR)/Image.gz)
	$(call Image/BuildKernel/MkFIT,$(1), $(KDIR)/Image.gz,,gzip,$(2),$(2))
	$(CP) $(KDIR)/fit-$(1).itb $(BIN_DIR)/$(IMG_PREFIX)-$(1)-fit-uImage.itb
endef

define Image/BuildKernel/MultiDTBFIT

ifneq ($(CONFIG_TARGET_ROOTFS_INITRAMFS),)
	$(CP) $(KDIR)/Image-initramfs $(BIN_DIR)/$(IMG_PREFIX)-vmlinux-initramfs.bin
	$(call Image/BuildKernel/MkFITMulti,$(1),$(KDIR)/Image-initramfs,$(2),none,$(3),$(3))
	$(CP) $(KDIR)/fit-$(1).itb $(BIN_DIR)/$(IMG_PREFIX)-$(1)-fit-uImage-initramfs.itb
endif
	$(CP) $(KDIR)/Image $(BIN_DIR)/$(IMG_PREFIX)-vmlinux.bin
	gzip -9 -c $(KDIR)/Image > $(KDIR)/Image.gz
	$(call CompressLzma,$(KDIR)/Image,$(KDIR)/Image.gz)
	$(call Image/BuildKernel/MkFITMulti,$(1),$(KDIR)/Image.gz,$(2),gzip,$(3),$(3))
	$(CP) $(KDIR)/fit-$(1).itb $(BIN_DIR)/$(IMG_PREFIX)-$(1)-fit-uImage.itb
endef

define Image/BuildKernel
	$(CP) $(KDIR)/vmlinux$(subst openwrt-ipq806x,,$(IMG_PREFIX)).debug $(BIN_DIR)/$(IMG_PREFIX)-vmlinux.elf
	$(call Image/BuildKernel/MultiDTBFIT,qcom-ipq40xx-ap.dkxx,"qcom-ipq40xx-ap.dk04.1-c1 \
																qcom-ipq40xx-ap.dk04.1-c2 \
																qcom-ipq40xx-ap.dk04.1-c3 \
																qcom-ipq40xx-ap.dk01.1-c1 \
																qcom-ipq40xx-ap.dk01.1-c2 \
																qcom-ipq40xx-db.dk01.1-c1 \
																qcom-ipq40xx-db.dk02.1-c1 \
																 qcom-ipq40xx-ap.dk04.1-c4 \
																 qcom-ipq40xx-ap.dk06.1-c1"\
																,0x80208000)
	$(call Image/BuildKernel/MultiDTBFIT,qcom-ipq40xx-ap.dkxx_cc,"qcom-ipq40xx-ap.dk04.1-c1_cc \
																qcom-ipq40xx-ap.dk04.1-c2_cc \
																qcom-ipq40xx-ap.dk04.1-c3_cc \
																qcom-ipq40xx-ap.dk01.1-c1_cc \
																qcom-ipq40xx-ap.dk01.1-c2_cc \
																qcom-ipq40xx-db.dk01.1-c1_cc \
																qcom-ipq40xx-db.dk02.1-c1_cc \
																qcom-ipq40xx-ap.dk04.1-c4_cc \
																qcom-ipq40xx-ap.dk06.1-c1_cc"\
																,0x80208000)
endef

define Image/UbiImage

ifeq ($(1),-ipq806x)
endif
endef

define Image/Build/squashfs
	$(call prepare_generic_squashfs,$(KDIR)/root.squashfs)
endef

KERNEL_IMG:=$(IMG_PREFIX)-qcom-ipq40xx-ap.dkxx-fit-uImage.itb
KERNEL_IMG_CC:=$(IMG_PREFIX)-qcom-ipq40xx-ap.dkxx_cc-fit-uImage.itb
ROOTFS_IMG:=$(IMG_PREFIX)-squashfs-root.img
ONE_IMAGE:=$(BIN_DIR)/oneimage.img
ONE_IMAGE_CC:=$(BIN_DIR)/oneimage_cc.img
DNI_IMAGE:=$(BIN_DIR)/$(MODULE_NAME)-V$(FW_VERSION)$(FW_REGION).img
DNI_IMAGE_CC:=$(BIN_DIR)/$(MODULE_NAME_CC)-V$(FW_VERSION)$(FW_REGION).img
ONE_IMAGE_FINAL:=$(BIN_DIR)/oneimage.img.final
ONE_IMAGE_FINAL_CC:=$(BIN_DIR)/oneimage_cc.img.final

define Image/Build/Orbi
	echo "Generating $(2) Firmware"
	test `cat $(BIN_DIR)/$(KERNEL_IMG) |wc -c` -le $(KERNEL_SIZE)
	test `cat $(BIN_DIR)/$(ROOTFS_IMG) |wc -c` -le $(ROOTFS_SIZE)
	rm -f $(ONE_IMAGE)
	(\
		dd if=$(BIN_DIR)/$(KERNEL_IMG) bs=$(KERNEL_SIZE) conv=sync; \
		dd if=$(BIN_DIR)/$(ROOTFS_IMG) bs=64k; \
	) > $(ONE_IMAGE)
	$(STAGING_DIR_HOST)/bin/orbi $(BIN_DIR)/$(KERNEL_IMG) $(BIN_DIR)/$(KERNEL_IMG).normal
	dd if=$(BIN_DIR)/$(KERNEL_IMG) bs=$(shell expr $(KERNEL_SIZE) - 64) conv=sync of=$(BIN_DIR)/$(KERNEL_IMG).final
	$(call Image/BuildKernel/MkuImage,lzma,0x40908000,0x40908000,$(BIN_DIR)/$(ROOTFS_IMG),$(BIN_DIR)/$(ROOTFS_IMG).uImage)
	$(STAGING_DIR_HOST)/bin/orbi $(BIN_DIR)/$(ROOTFS_IMG).uImage $(BIN_DIR)/$(ROOTFS_IMG).tmp
	dd if=$(BIN_DIR)/$(ROOTFS_IMG).tmp bs=64 count=1 >> $(BIN_DIR)/$(KERNEL_IMG).final
	(\
		dd if=$(BIN_DIR)/$(KERNEL_IMG).final bs=$(KERNEL_SIZE) conv=sync; \
		dd if=$(BIN_DIR)/$(ROOTFS_IMG) bs=64k; \
	) > $(ONE_IMAGE_FINAL)
	$(STAGING_DIR_HOST)/bin/mkdniimg \
		-B $(MODULE_NAME) -v $(FW_VERSION) -r $(FW_REGION) -H $(HW_ID) \
		-i $(ONE_IMAGE_FINAL) \
		-o $(DNI_IMAGE)

	echo "Generating $(2) Firmware"
	test `cat $(BIN_DIR)/$(KERNEL_IMG_CC) |wc -c` -le $(KERNEL_SIZE)
	test `cat $(BIN_DIR)/$(ROOTFS_IMG) |wc -c` -le $(ROOTFS_SIZE)
	rm -f $(ONE_IMAGE_CC)
	(\
		dd if=$(BIN_DIR)/$(KERNEL_IMG_CC) bs=$(KERNEL_SIZE) conv=sync; \
		dd if=$(BIN_DIR)/$(ROOTFS_IMG) bs=64k; \
	) > $(ONE_IMAGE_CC)
	$(STAGING_DIR_HOST)/bin/orbi $(BIN_DIR)/$(KERNEL_IMG_CC) $(BIN_DIR)/$(KERNEL_IMG_CC).normal
	dd if=$(BIN_DIR)/$(KERNEL_IMG_CC) bs=$(shell expr $(KERNEL_SIZE) - 64) conv=sync of=$(BIN_DIR)/$(KERNEL_IMG_CC).final
	$(call Image/BuildKernel/MkuImage,lzma,0x40908000,0x40908000,$(BIN_DIR)/$(ROOTFS_IMG),$(BIN_DIR)/$(ROOTFS_IMG).uImage)
	$(STAGING_DIR_HOST)/bin/orbi $(BIN_DIR)/$(ROOTFS_IMG).uImage $(BIN_DIR)/$(ROOTFS_IMG).tmp
	dd if=$(BIN_DIR)/$(ROOTFS_IMG).tmp bs=64 count=1 >> $(BIN_DIR)/$(KERNEL_IMG_CC).final
	(\
		dd if=$(BIN_DIR)/$(KERNEL_IMG_CC).final bs=$(KERNEL_SIZE) conv=sync; \
		dd if=$(BIN_DIR)/$(ROOTFS_IMG) bs=64k; \
	 ) > $(ONE_IMAGE_FINAL_CC)
	 $(STAGING_DIR_HOST)/bin/mkdniimg \
	 	-B $(MODULE_NAME_CC) -v $(FW_VERSION) -r $(FW_REGION) -H $(HW_ID) \
		-i $(ONE_IMAGE_FINAL_CC) \
		-o $(DNI_IMAGE_CC)
endef

define Image/Build
	$(call Image/Build/$(1),$(1))
	dd if=$(KDIR)/root$(2).$(1) of=$(BIN_DIR)/$(IMG_PREFIX)$(2)-$(1)-root.img bs=128k conv=sync
	$(call Image/Build/Orbi,$(1),orbi)
endef

$(eval $(call BuildImage))
