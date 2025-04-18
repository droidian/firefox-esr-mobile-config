// Copyright 2023 Arnaud Ferraris, Oliver Smith
// SPDX-License-Identifier: MPL-2.0
//
// Generate and update userChrome.css and userContent.css for the user's
// profile from CSS fragments in /etc/mobile-config-firefox, depending on the
// installed Firefox version. Set various defaults for about:config options in
// set_default_prefs().
//
// Log file:
// $ find ~/.mozilla -name mobile-config-firefox.log
//
// This is a Firefox autoconfig file:
// https://support.mozilla.org/en-US/kb/customizing-firefox-using-autoconfig
//
// The XPCOM APIs used here are the same as old Firefox add-ons used, and the
// documentation for them has been removed (can we use something else? patches
// welcome). They appear to still work fine for autoconfig scripts.
// https://web.archive.org/web/20201018211550/https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Code_snippets/File_I_O

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const Services = globalThis.Services;
const { AppConstants } = ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");
const IS_ESM_READY = parseInt(AppConstants.MOZ_APP_VERSION, 10) >= 128;

// We need to conditionally load some modules because they haven't been ported
// the ES module yet. This workaround can be removed when ESR128 will be EOL.
const { FileUtils } =
    IS_ESM_READY
      ? ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs")
      : Cu.import("resource://gre/modules/FileUtils.jsm");

var g_ff_version;
var g_updated = false;
var g_fragments_cache = {}; // cache for css_file_get_fragments()
var g_logFileStream;
var g_chromeDir; // nsIFile object for the "chrome" dir in user's profile


function write_line(ostream, line) {
    line = line + "\n"
    ostream.write(line, line.length);
}

// Create <profile>/chrome/ directory if not already present
function chrome_dir_init() {
    g_chromeDir = Services.dirsvc.get("ProfD", Ci.nsIFile);
    g_chromeDir.append("chrome");
    if (!g_chromeDir.exists()) {
        g_chromeDir.create(Ci.nsIFile.DIRECTORY_TYPE, FileUtils.PERMS_DIRECTORY);
    }
}

function log_init() {
    var mode = FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_APPEND;
    var logFile = g_chromeDir.clone();
    logFile.append("mobile-config-firefox.log");
    g_logFileStream = FileUtils.openFileOutputStream(logFile, mode);
}

function log(line) {
    var date = new Date().toISOString().replace("T", " ").slice(0, 19);
    line = "[" + date + "] " + line;
    write_line(g_logFileStream, line);
}

// Debug function for logging object attributes
function log_obj(obj) {
    var prop;
    var value;

    for (var prop in obj) {
        try {
            value = obj[prop];
        } catch(e) {
            value = e;
        }
        log(" - " + prop + ": " + value);
    }
}

function get_firefox_version() {
    return Services.appinfo.version.split(".")[0];
}

function get_firefox_version_previous() {
    var file = g_chromeDir.clone();
    file.append("ff_previous.txt");

    if (!file.exists())
        return "unknown";

    var istream = Cc["@mozilla.org/network/file-input-stream;1"].
                  createInstance(Components.interfaces.nsIFileInputStream);
    istream.init(file, 0x01, 0444, 0);
    istream.QueryInterface(Components.interfaces.nsILineInputStream);

    var line = {};
    istream.readLine(line);
    istream.close();

    return line.value.trim();
}

function set_firefox_version_previous(new_version) {
    log("Updating previous Firefox version to: " + new_version);

    var file = g_chromeDir.clone();
    file.append("ff_previous.txt");

    var ostream = Cc["@mozilla.org/network/file-output-stream;1"].
                  createInstance(Components.interfaces.nsIFileOutputStream);
    ostream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
    write_line(ostream, new_version);
    ostream.close();
}

function trigger_firefox_restart() {
    log("Triggering Firefox restart");
    var appStartup = Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup);
    appStartup.quit(Ci.nsIAppStartup.eForceQuit | Ci.nsIAppStartup.eRestart);
}

// Check if a CSS fragment should be used or not, depending on the current
// Firefox version.
// fragment: e.g. "userChrome/popups.before-ff-108.css"
// returns: true if it should be used, false if it must not be used
function css_fragment_check_firefox_version(fragment) {
    if (fragment.indexOf(".before-ff-") !== -1) {
        var before_ff_version = fragment.split("-").pop().split(".")[0];
        if (g_ff_version >= before_ff_version) {
            log("Fragment with FF version check not included: " + fragment);
            return false;
        } else {
            log("Fragment with FF version check included: " + fragment);
            return true;
        }
    }

    return true;
}

// Get an array of paths to the fragments for one CSS file
// name: either "userChrome" or "userContent"
function css_file_get_fragments(name) {
    if (name in g_fragments_cache)
        return g_fragments_cache[name];

    var ret = [];
    var path = "/etc/mobile-config-firefox/" + name + ".files";
    log("Reading fragments from file: " + path);
    var file = new FileUtils.File(path);

    var istream = Cc["@mozilla.org/network/file-input-stream;1"].
                  createInstance(Components.interfaces.nsIFileInputStream);
    istream.init(file, 0x01, 0444, 0);
    istream.QueryInterface(Components.interfaces.nsILineInputStream);

    var has_more;
    do {
        var line = {};
        has_more = istream.readLine(line);
        if (css_fragment_check_firefox_version(line.value))
            ret.push("/etc/mobile-config-firefox/" + line.value);

    } while (has_more);

    istream.close();

    g_fragments_cache[name] = ret;
    return ret;
}

// Create a nsIFile object with one of the CSS files in the user's profile as
// path. The file doesn't need to exist at this point.
// name: either "userChrome" or "userContent"
function css_file_get(name) {
    var ret = g_chromeDir.clone();
    ret.append(name + ".css");
    return ret;
}

// Delete either userChrome.css or userContent.css inside the user's profile if
// they have an older timestamp than the CSS fragments (or list of CSS
// fragments) installed system-wide.
// name: either "userChrome" or "userContent"
// file: return of css_file_get()
function css_file_delete_outdated(name, file) {
    var depends = css_file_get_fragments(name).slice(); /* copy the array */
    depends.push("/etc/mobile-config-firefox/" + name + ".files");
    for (var i in depends) {
        var depend = depends[i];
        var file_depend = new FileUtils.File(depend);

        if (file.lastModifiedTime < file_depend.lastModifiedTime) {
            log("Removing outdated file: " + file.path + " (newer: "
                + depend + ")");
            file.remove(false);
            return;
        }
    }

    log("File is up-to-date: " + file.path);
    return;
}

// Create userChrome.css / userContent.css in the user's profile, based on the
// CSS fragments stored in /etc/mobile-config-firefox.
// name: either "userChrome" or "userContent"
// file: return of css_file_get()
function css_file_merge(name, file) {
    log("Creating CSS file from fragments: " + file.path);

    var ostream = Cc["@mozilla.org/network/file-output-stream;1"].
                  createInstance(Components.interfaces.nsIFileOutputStream);
    ostream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);

    var fragments = css_file_get_fragments(name);
    for (var i in fragments) {
        var line;
        var fragment = fragments[i];
        log("- " + fragment);
        write_line(ostream, "/* === " + fragment + " === */");

        var file_fragment = new FileUtils.File(fragment);

        var istream = Cc["@mozilla.org/network/file-input-stream;1"].
                      createInstance(Components.interfaces.nsIFileInputStream);
        istream.init(file_fragment, 0x01, 0444, 0);
        istream.QueryInterface(Components.interfaces.nsILineInputStream);

        var has_more;
        do {
            var line = {};
            has_more = istream.readLine(line);
            write_line(ostream, line.value);
        } while (has_more);

        istream.close();
    }

    ostream.close();
    g_updated = true;
}

function css_files_update() {
    g_ff_version = get_firefox_version();
    var ff_previous = get_firefox_version_previous();
    log("Firefox version: " + g_ff_version + " (previous: " + ff_previous + ")");

    var names = ["userChrome", "userContent"];
    for (var i in names) {
        var name = names[i];
        var file = css_file_get(name);

        if (file.exists()) {
            if (g_ff_version != ff_previous) {
                log("Removing outdated file: " + file.path + " (Firefox" +
                    " version changed)");
                file.remove(false);
            } else {
                css_file_delete_outdated(name, file);
            }
        }

        if (!file.exists()) {
            css_file_merge(name, file);
        }
    }

    if (g_ff_version != ff_previous)
        set_firefox_version_previous(g_ff_version);
}

/**
 * Set default user agent and override it for specific websites
 * (See also: src/userChrome.js in furios-firefox-tweaks.git)
 */
function set_user_agent() {
    const APP_VERSION = `${AppConstants.MOZ_APP_VERSION.split(".")[0]}.0`;

    // We added `Mobile;` to the default Firefox Desktop user agent
    const UA_FIREFOX_DESKTOP = `Mozilla/5.0 (X11; Linux x86_64; Mobile; rv:${APP_VERSION}) Gecko/20100101 Firefox/${APP_VERSION}`;
    const UA_FIREFOX_ANDROID = `Mozilla/5.0 (Android 15; Mobile; rv:${APP_VERSION}) Gecko/${APP_VERSION} Firefox/${APP_VERSION}`;
    // Google version API: https://developer.chrome.com/docs/web-platform/versionhistory/reference
    const UA_CHROME_ANDROID = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.135 Mobile Safari/537.36";
    const UA_CHROME_CHROMEOS = "Mozilla/5.0 (X11; CrOS aarch64 15329.44.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.137 Safari/537.36";

    // Set default user agent
    defaultPref('general.useragent.override', UA_FIREFOX_DESKTOP);

    const userAgentRules = {
        // Google
        // FIX: Google login not trusting the browser
        "^https?://accounts.google.com($|/)": UA_FIREFOX_DESKTOP,
        // FIX: Google Search showing up as the old layout
        "^https?://(wwww.)?google.com($|/)": UA_FIREFOX_ANDROID,
        // FIX: ???
        "^https?://drive.google.com($|/)": UA_CHROME_ANDROID,
        // FIX: Google Maps search bar not being interactive
        "^https?://(www.)?google.com/maps($|/)": UA_FIREFOX_DESKTOP,
        "^https?://maps.google.com($|/)": UA_FIREFOX_DESKTOP,

        // Firefox
        // FIX: Sync login not completing
        "^https?://accounts.firefox.com($|/)": UA_FIREFOX_DESKTOP,

        // Mozilla
        // FIX: AMO thinks we want the android extensions
        "^https?://addons.mozilla.org($|/)": UA_FIREFOX_DESKTOP,

        // Youtube
        // FIX: YouTube fullscreen acting weird
        "^https?://(m.)?youtube.com($|/)": UA_FIREFOX_ANDROID,

        // Netflix
        // FIX: Netflix refusing to playback even if EME is working
        "^https?://(www.)?netflix.com($|/)": UA_CHROME_CHROMEOS,
    };

    const requestObserver = {
        observe: function(subject, topic, data) {
            if (topic == "http-on-modify-request") {
                const httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
                const uri = httpChannel.URI.spec;

                for (const [urlPattern, userAgentRule] of Object.entries(userAgentRules)) {
                    if (new RegExp(urlPattern).test(uri)) {
                        httpChannel.setRequestHeader("User-Agent", userAgentRule, false);
                        break;
                    }
                }
            }
        }
    };

    const observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    observerService.addObserver(requestObserver, "http-on-modify-request", false);
}

function set_default_prefs() {
    log("Setting default preferences");

    // Do not suggest facebook, ebay, reddit etc. in the urlbar. Same as
    // Settings -> Privacy & Security -> Address Bar -> Shortcuts. As
    // side-effect, the urlbar results are not immediatelly opened once
    // clicking the urlbar.
    defaultPref('browser.urlbar.suggest.topsites', false);

    // Do not suggest search engines. Even though amazon is removed via
    // policies.json, it gets installed shortly after the browser is opened.
    // With this option, at least there is no big "Search with Amazon" message
    // in the urlbar results as soon as typing the letter "a".
    defaultPref('browser.urlbar.suggest.engines', false);

    // Show about:home in new tabs, so it's not just a weird looking completely
    // empty page.
    defaultPref('browser.newtabpage.enabled', true);

    // FF >= 116 allows to use cameras via Pipewire. While it will likely still
    // take a while until this is made the default, on most mobile devices it
    // makes a lot of sense to enable it unconditionally, as cameras usually
    // only work with libcamera, not via plain v4l2.
    defaultPref('media.webrtc.camera.allow-pipewire', true);

    // Make navigator.maxTouchPoints return 1 for clients to determine this is a
    // touch device. This is the same value used by Web Developer Tools ->
    // Responsive Design Mode -> Enable touch simulation.
    defaultPref('dom.maxtouchpoints.testing.value', 1);

    // Hide https:// in urlbar by default to save space and make more relevant
    // parts of the urlbar visible.
    defaultPref('browser.urlbar.trimHttps', true);

    // Use the xdg-desktop-portal.file-picker by default, e.g., for a native
    // file-picker instead of gtk-file-picker on Plasma Mobile
    defaultPref('widget.use-xdg-desktop-portal.file-picker', 1);

    // Enable android-style pinch-to-zoom
    defaultPref('dom.w3c.touch_events.enabled', true);
    defaultPref('apz.allow_zooming', true);
    defaultPref('apz.allow_double_tap_zooming', true);

    // Enable legacy touch event APIs, as some websites use this to check for mobile compatibility
    // and Firefox on Android behaves the same way
    defaultPref('dom.w3c_touch_events.legacy_apis.enabled', true);

    // Save vertical space by hiding the titlebar
    defaultPref('browser.tabs.inTitlebar', 1);

    // Disable search suggestions
    defaultPref('browser.search.suggest.enabled', false);

    // Empty new tab page: faster, less distractions
    defaultPref('browser.newtabpage.enabled', false);

    // Allow UI customizations with userChrome.css and userContent.css
    defaultPref('toolkit.legacyUserProfileCustomizations.stylesheets', true);

    // Select the entire URL with one click
    defaultPref('browser.urlbar.clickSelectsAll', true);

    // Disable cosmetic animations, save CPU
    defaultPref('toolkit.cosmeticAnimations.enabled', false);

    // Disable download animations, save CPU
    defaultPref('browser.download.animateNotifications', false);
}

function main() {
    log("Running mobile-config-autoconfig.js");
    css_files_update();

    // Set default user agent and override it for specific websites
    set_user_agent();

    // Restart Firefox immediately if one of the files got updated
    if (g_updated == true)
        trigger_firefox_restart();
    else
        set_default_prefs();

    log("Done");
}

chrome_dir_init();
log_init();
try {
    main();
} catch(e) {
    log("main() failed: " + e);

    // Let Firefox display the generic error message that something went wrong
    // in the autoconfig script.
    error;
}
g_logFileStream.close();
