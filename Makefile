# Copyright 2023 Oliver Smith
# SPDX-License-Identifier: MPL-2.0

DESTDIR :=
FIREFOX_DIR := /usr/lib/firefox
MCF_DIR := /usr/lib/mobile-config-firefox

FLATPAK :=
FLATPAK_ARCH := $(shell uname -m)
FLATPAK_BRANCH := stable
FLATPAK_EXT_DIR := /var/lib/flatpak/extension/org.mozilla.firefox.systemconfig/$(FLATPAK_ARCH)/$(FLATPAK_BRANCH)

ifeq ($(FLATPAK),1)
FIREFOX_DIR := $(FLATPAK_EXT_DIR)
MCF_DIR := $(FLATPAK_EXT_DIR)/mobile-config-firefox
POLICIES_DIR := $(FIREFOX_DIR)/policies
MODE := flatpak
else
POLICIES_DIR := $(FIREFOX_DIR)/distribution
MODE := native
endif

dummy:
	@echo "Running 'make' is not needed anymore, just do 'sudo make install'."

install:
	src/prepare_install.sh "$(FIREFOX_DIR)" "$(DESTDIR)" "$(MODE)"

	# Firefox Policies
	install -Dm644 src/policies.json \
		"$(DESTDIR)/$(POLICIES_DIR)/policies.json"

	# Firefox autoconfig
	install -Dm644 src/mobile-config-prefs.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	install -Dm644 src/mobile-config-autoconfig.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"

	# Mobile-config-firefox
	mkdir -p "$(DESTDIR)/$(MCF_DIR)"
	cp -rv "src/modules/"* "$(DESTDIR)/$(MCF_DIR)"
	cp -rv "src/themes/" "$(DESTDIR)/$(MCF_DIR)"

ifneq ($(FLATPAK),1)
	install -Dm644 eco.nura.mobile_config_firefox.metainfo.xml \
		"$(DESTDIR)/usr/share/metainfo/eco.nura.mobile_config_firefox.metainfo.xml"
endif

uninstall:
	src/prepare_uninstall.sh "$(FIREFOX_DIR)" "$(DESTDIR)" "$(MODE)"
	rm -fv "$(DESTDIR)/$(POLICIES_DIR)/policies.json"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	rm -rfv "$(DESTDIR)/$(MCF_DIR)"
ifneq ($(FLATPAK),1)
	rm -fv "$(DESTDIR)/usr/share/metainfo/eco.nura.mobile_config_firefox.metainfo.xml"
endif

.PHONY: all clean install uninstall
