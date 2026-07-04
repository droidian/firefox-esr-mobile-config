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

	# Firefox autoconfig
	install -Dm644 src/mobile-config-prefs.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	install -Dm644 src/mobile-config-autoconfig.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"

	# Mobile-config-firefox
	mkdir -p "$(DESTDIR)/$(MCF_DIR)"
	cp -rv "src/modules/"* "$(DESTDIR)/$(MCF_DIR)"
	cp -rv "src/themes/" "$(DESTDIR)/$(MCF_DIR)"

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
