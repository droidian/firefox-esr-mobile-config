# Copyright 2023 Oliver Smith
# SPDX-License-Identifier: MPL-2.0

DESTDIR :=
FIREFOX_DIR := /usr/lib/firefox
FIREFOX_CONFIG_DIR := /usr/lib/mobile-config-firefox

dummy:
	@echo "Running 'make' is not needed anymore, just do 'sudo make install'."

install:
	src/prepare_install.sh "$(FIREFOX_DIR)" "$(DESTDIR)"
	# Firefox Policies
	install -Dm644 src/policies.json \
		"$(DESTDIR)/$(FIREFOX_DIR)/distribution/policies.json"
	# Mobile Config Firefox
	install -Dm644 src/mobile-config-prefs.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	install -Dm644 src/mobile-config-autoconfig.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	install -Dm644 src/modules/chrome.manifest \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/chrome.manifest"
	install -Dm644 src/modules/boot.sys.mjs \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/boot.sys.mjs"
	# PrefManager
	install -Dm644 src/modules/PrefManager.sys.mjs \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/PrefManager.sys.mjs"
	# UserAgentManager
	install -Dm644 src/modules/UserAgentManager.sys.mjs \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/UserAgentManager.sys.mjs"
	# StyleSheetManager
	install -Dm644 src/modules/StyleSheetManager.sys.mjs \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/StyleSheetManager.sys.mjs"
	install -dm755 "$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/themes/chrome/"
	install -dm755 "$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/themes/content/"
	install -Dm644 src/themes/main.css \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/themes/main.css"
	install -Dm644 src/themes/chrome/*.css \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/themes/chrome/"
	install -Dm644 src/themes/content/*.css \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/themes/content/"
	# AboutMobile
	install -Dm644 src/modules/AboutMobile.sys.mjs \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/AboutMobile.sys.mjs"
	install -Dm644 src/modules/aboutmobile/aboutmobile.js \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/aboutmobile/aboutmobile.js"
	install -Dm644 src/modules/aboutmobile/aboutmobile.css \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/aboutmobile/aboutmobile.css"
	install -Dm644 src/modules/aboutmobile/index.html \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/aboutmobile/index.html"
	install -Dm644 src/modules/aboutmobile/locales/en-US/browser/aboutmobile/aboutmobile.ftl \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/aboutmobile/locales/en-US/browser/aboutmobile/aboutmobile.ftl"
	# Miscs
	install -Dm644 org.postmarketos.mobile_config_firefox.metainfo.xml \
		"$(DESTDIR)/usr/share/metainfo/org.postmarketos.mobile_config_firefox.metainfo.xml"

uninstall:
	src/prepare_uninstall.sh "$(FIREFOX_DIR)" "$(DESTDIR)"
	rm -fv "$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/policies/policies.json"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	rm -rfv "$(DESTDIR)/$(FIREFOX_CONFIG_DIR)"
	rm -fv "$(DESTDIR)/usr/share/metainfo/org.postmarketos.mobile_config_firefox.metainfo.xml"


.PHONY: all clean install uninstall
