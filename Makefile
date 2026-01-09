# Copyright 2023 Oliver Smith
# SPDX-License-Identifier: MPL-2.0

DESTDIR :=
FIREFOX_DIR := /usr/lib/firefox
MCF_DIR := /usr/lib/mobile-config-firefox

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
		"$(DESTDIR)/$(MCF_DIR)/chrome.manifest"
	install -Dm644 src/modules/boot.sys.mjs \
		"$(DESTDIR)/$(MCF_DIR)/boot.sys.mjs"
	# PrefManager
	install -Dm644 src/modules/PrefManager.sys.mjs \
		"$(DESTDIR)/$(MCF_DIR)/PrefManager.sys.mjs"
	# UserAgentManager
	install -Dm644 src/modules/UserAgentManager.sys.mjs \
		"$(DESTDIR)/$(MCF_DIR)/UserAgentManager.sys.mjs"
	# StyleSheetManager
	install -Dm644 src/modules/StyleSheetManager.sys.mjs \
		"$(DESTDIR)/$(MCF_DIR)/StyleSheetManager.sys.mjs"
	## Shared theme
	install -dm755 "$(DESTDIR)/$(MCF_DIR)/themes/shared/chrome/"
	install -dm755 "$(DESTDIR)/$(MCF_DIR)/themes/shared/content/"
	install -Dm644 src/themes/shared/main.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/shared/main.css"
	install -Dm644 src/themes/shared/chrome/*.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/shared/chrome/"
	install -Dm644 src/themes/shared/content/*.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/shared/content/"
	## ESR theme
	install -Dm644 src/themes/esr/main.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/esr/main.css"
	## Release theme
	install -dm755 "$(DESTDIR)/$(MCF_DIR)/themes/release/chrome/"
	install -Dm644 src/themes/release/main.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/release/main.css"
	install -Dm644 src/themes/release/chrome/*.css \
		"$(DESTDIR)/$(MCF_DIR)/themes/release/chrome/"
	# AboutMobile
	install -Dm644 src/modules/AboutMobile.sys.mjs \
		"$(DESTDIR)/$(MCF_DIR)/AboutMobile.sys.mjs"
	install -Dm644 src/modules/aboutmobile/aboutmobile.js \
		"$(DESTDIR)/$(MCF_DIR)/aboutmobile/aboutmobile.js"
	install -Dm644 src/modules/aboutmobile/aboutmobile.css \
		"$(DESTDIR)/$(MCF_DIR)/aboutmobile/aboutmobile.css"
	install -Dm644 src/modules/aboutmobile/index.html \
		"$(DESTDIR)/$(MCF_DIR)/aboutmobile/index.html"
	install -Dm644 src/modules/aboutmobile/locales/en-US/browser/aboutmobile/aboutmobile.ftl \
		"$(DESTDIR)/$(MCF_DIR)/aboutmobile/locales/en-US/browser/aboutmobile/aboutmobile.ftl"
	# Miscs
	install -Dm644 org.postmarketos.mobile_config_firefox.metainfo.xml \
		"$(DESTDIR)/usr/share/metainfo/org.postmarketos.mobile_config_firefox.metainfo.xml"

uninstall:
	src/prepare_uninstall.sh "$(FIREFOX_DIR)" "$(DESTDIR)"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/distribution/policies.json"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	rm -rfv "$(DESTDIR)/$(MCF_DIR)"
	rm -fv "$(DESTDIR)/usr/share/metainfo/org.postmarketos.mobile_config_firefox.metainfo.xml"


.PHONY: all clean install uninstall
