// Copyright 2025 Danny Colin
// SPDX-License-Identifier: MPL-2.0

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const Services = globalThis.Services;
const { AppConstants } = ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");
const IS_ESM_READY = parseInt(AppConstants.MOZ_APP_VERSION, 10) >= 128;
const { FileUtils } =
    IS_ESM_READY
      ? ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs")
      : Cu.import("resource://gre/modules/FileUtils.jsm");
const { PrefManager } = ChromeUtils.importESModule(
    'chrome://mobileconfigfirefox/content/PrefManager.sys.mjs'
);
const { UserAgentManager } = ChromeUtils.importESModule(
    'chrome://mobileconfigfirefox/content/UserAgentManager.sys.mjs'
);
const { StyleSheetManager } = ChromeUtils.importESModule(
    'chrome://mobileconfigfirefox/content/StyleSheetManager.sys.mjs'
);
const { AboutMobile } = ChromeUtils.importESModule(
    'chrome://mobileconfigfirefox/content/AboutMobile.sys.mjs'
);
const { TabCounter } = ChromeUtils.importESModule(
    'chrome://mobileconfigfirefox/content/TabCounter.sys.mjs'
);

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  CustomizableUI: "resource:///modules/CustomizableUI.sys.mjs",
});

/**
 * Set prefereces on startup
 *
 * See docs/ for preferences description and reason we're modifying them.
 */
function set_default_preferences() {
    PrefManager.defaultPref('app.shield.optoutstudies.enabled', false);
    PrefManager.defaultPref('apz.allow_zooming', true);
    PrefManager.defaultPref('apz.allow_double_tap_zooming', true);
    PrefManager.defaultPref('browser.ai.control.default', 'blocked');
    PrefManager.defaultPref('browser.ai.control.translations', 'available');
    PrefManager.defaultPref('browser.download.animateNotifications', false);
    PrefManager.defaultPref('browser.ipProtection.enabled', false);
    PrefManager.defaultPref('browser.ml.chat.enabled', false);
    PrefManager.defaultPref('browser.ml.chat.menu', false);
    PrefManager.defaultPref('browser.newtabpage.enabled', false);
    PrefManager.defaultPref('browser.newtabpage.activity-stream.nova.enabled', false);
    PrefManager.defaultPref('browser.search.suggest.enabled', false);
    PrefManager.defaultPref('browser.tabs.hoverPreview.enabled', false);
    PrefManager.defaultPref('browser.tabs.inTitlebar', 1);
    PrefManager.defaultPref('browser.urlbar.clickSelectsAll', true);
    PrefManager.defaultPref('browser.urlbar.suggest.engines', false);
    PrefManager.defaultPref('browser.urlbar.suggest.topsites', false);
    PrefManager.defaultPref('browser.urlbar.trimHttps', true);
    PrefManager.defaultPref('dom.maxtouchpoints.testing.value', 1);
    PrefManager.defaultPref('dom.w3c_touch_events.legacy_apis.enabled', true);
    PrefManager.defaultPref('extensions.unifiedExtensions.button.always_visible', true);
    PrefManager.defaultPref('media.videocontrols.picture-in-picture.enabled', false);
    PrefManager.defaultPref("screenshots.browser.component.enabled", false);
    PrefManager.defaultPref('sidebar.main.tools', 'aichat');
    PrefManager.defaultPref('sidebar.verticalTabs.dragToPinPromo.dismissed', true);
    PrefManager.defaultPref('toolkit.cosmeticAnimations.enabled', false);
    PrefManager.defaultPref('toolkit.legacyUserProfileCustomizations.stylesheets', true);
    PrefManager.defaultPref('widget.use-xdg-desktop-portal.file-picker', 1);

    PrefManager.defaultPref('mcf.tabs.showFocusedTabOnly.enabled', true);
    PrefManager.defaultPref('mcf.tabs.alwaysShowCloseButton', false);
    PrefManager.defaultPref('mcf.toolbar.tabCounter.enabled', true);
    PrefManager.defaultPref('mcf.toolbar.positionOnTop', false);
    PrefManager.defaultPref('mcf.appmenu.showAllEntries', false);
    PrefManager.defaultPref('mcf.contextmenu.showInspector', false);
    PrefManager.defaultPref('mfc.urlbar.showTrustButton', false);

    // Default preferences for Debian (can be overridden by users)

    // Allow Firefox accounts
    PrefManager.defaultPref("webchannel.allowObject.urlWhitelist", "https://accounts.firefox.com https://content.cdn.mozilla.net https://input.mozilla.org https://support.mozilla.org https://install.mozilla.org");

    // Firefox is optimized for desktop.
    // Some desktop optimizations might slow things on mobile.
    // We should especially reduce CPU and RAM usage.

    // Reduce the number of content processes.
    //
    // The more content processes you have,
    // the more CPU and RAM will be assigned to each tab.
    //
    // Source: https://bit.ly/3dc4A7W
    // Default value: 4
    // Goal: Save CPU and RAM.
    PrefManager.defaultPref("dom.ipc.processCount", 1);

    // Disable prefetching.
    //
    // Source: https://bit.ly/3dc4A7W
    // Default value: true
    // Goal: Save bandwith
    PrefManager.defaultPref("network.prefetch-next", false);

    // Limit content redraws.
    //
    // While this helps the browser feel snappy,
    // frequent redraws increase the total page load time,
    // so a longer content notify interval will improve performance.
    //
    // Source: https://bit.ly/3hLX47p
    // Default value: 120000 (0.12s) / true
    // Goal: Speed up page loading
    PrefManager.defaultPref("content.notify.interval", 500000);
    PrefManager.defaultPref("content.notify.ontimer", true);

    // Reduce the content switch threshold.
    //
    // If you haven't moved your mouse or touched the keyboard for the given time
    // (the content switch threshold) then Firefox enters a low frequency interrupt mode,
    // which means its interface becomes less responsive but your page loads more quickly.
    //
    // Source: https://bit.ly/3hLX47p
    // Default value: 750000 (0.75s)
    // Goal: Speed up page loading
    PrefManager.defaultPref("content.switch.threshold", 250000);

    // Reduce the number of visited web pages stored in memory,
    // which you can access using the Back and Forward buttons.
    //
    // Source: https://bit.ly/3dc4A7W
    // Default value: -1 (adaptable)
    // Goal: Save RAM
    PrefManager.defaultPref("browser.sessionhistory.max_total_viewers", 1);
}

/**
 * Register about:mobile
 */
function register_about_mobile() {
    // TODO:
    // - Move ComponentRegistrar and factory to the AboutMobile class
    // - Refactor AboutMobile.sys.mjs to be a generic about:page creator.
    const Cm = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
    const { ComponentUtils } = ChromeUtils.importESModule(
        "resource://gre/modules/ComponentUtils.sys.mjs"
    );
    const factory = ComponentUtils.generateSingletonFactory(function () {
        return new AboutMobile({
            chromeUrl: "chrome://mobileconfigfirefox/content/aboutmobile/index.html",
            aboutHost: "mobile",
            classID: "{6cb98913-a163-482c-9622-4faedc0e923f}",
            description: "About Mobile Page",
            uriFlags:
              Ci.nsIAboutModule.ALLOW_SCRIPT |
              Ci.nsIAboutModule.IS_SECURE_CHROME_UI,
        });
    });

    Cm.registerFactory(
        Components.ID("{6cb98913-a163-482c-9622-4faedc0e923f}"),
        "about:mobile",
        "@mozilla.org/network/protocol/about;1?what=mobile",
        factory
    );
}

/**
 * Registers Fluent strings.
 *
 * TODO: This should be ideally moved in AboutMobile.sys.mjs
 */
function register_fluent_sources() {
  try {
    const aboutmobileFileSource = new L10nFileSource(
      "aboutmobile",
      "app",
      ["en-US"],
      `resource://aboutmobile/locales/{locale}/`
    );
    L10nRegistry.getInstance().registerSources([aboutmobileFileSource]);
  } catch (e) {
    console.error(`Error on registering fluent files:`, e);
  }
}

/**
 * Bootstrapping
 */
(function main() {
    try {
        set_default_preferences();
        const userAgent = new UserAgentManager();
        // TODO:
        // - Can we target chrome or content context separately?
        //   See: https://searchfox.org/mozilla-central/source/dom/interfaces/base/nsIDOMWindowUtils.idl#1891-1915
        const stylesheet = new StyleSheetManager();
        try {
            const tabCounter = new TabCounter();
            tabCounter.init();
        } catch(e) {
            console.error("TabCounter failed to initialize:", e);
        }
        // TODO:
        // - Fix CSP issue that prevents to load our styles/scripts in about:mobile
        register_about_mobile();
        register_fluent_sources();
    } catch(e) {
        console.log(e);
    }
})();
