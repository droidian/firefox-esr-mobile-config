# Preferences

Mobile-Config-Firefox has custom preferences, which can be set via the
`about:mobile` page (or alternatively in `about:config`).

## Preference naming convention

* Always uses `mcf` as the root branch name
* Boolean preferences should always end with `.enabled`
* Use camel case if there's more than one word in one of the branch

Example:
```
mcf.toolbar.tabCounter.enabled
```

## Default Preferences

### browser.urlbar.suggest.topsites

* Value: false
* Description: ...
* Reason: Do not suggest facebook, ebay, reddit etc. in the urlbar. Same as
  Settings -> Privacy & Security -> Address Bar -> Shortcuts. As side-effect, the
  urlbar results are not immediatelly opened once clicking the urlbar.

### browser.urlbar.suggest.engines

* Value: false
* Description: ...
* Reason: Do not suggest search engines. Even though amazon is removed via
  policies.json, it gets installed shortly after the browser is opened. With this
  option, at least there is no big "Search with Amazon" message in the urlbar
  results as soon as typing the letter "a".

### media.webrtc.camera.allow-pipewire

* Value: true
* Description: ...
* Reason: FF >= 116 allows to use cameras via Pipewire. While it will likely
  still take a while until this is made the default, on most mobile devices it
  makes a lot of sense to enable it unconditionally, as cameras usually only work
  with libcamera, not via plain v4l2.

### dom.maxtouchpoints.testing.value

* Value: 1
* Description: ...
* Reason: Make navigator.maxTouchPoints return 1 for clients to determine this is
  a touch device. This is the same value used by Web Developer Tools > Responsive
  Design Mode > Enable touch simulation.

### browser.urlbar.trimHttps

* Value: true
* Description: ...
* Reason: Hide https:// in urlbar by default to save space and make more relevant
  parts of the urlbar visible.

### widget.use-xdg-desktop-portal.file-picker

* Value: 1
* Description: ...
* Reason: Use the xdg-desktop-portal.file-picker by default, e.g., for a native
  file-picker instead of gtk-file-picker on Plasma Mobile.

### apz.allow_zooming

* Value: true
* Description: ...
* Reason: Enable android-style pinch-to-zoom

### apz.allow_double_tap_zooming

* Value: true
* Description: ...
* Reason: Enable android-style pinch-to-zoom

### defaultPref('dom.w3c_touch_events.legacy_apis.enabled

* Value: true
* Description: ...
* Reason: Enable legacy touch event APIs, as some websites use this to check for
  mobile compatibility and Firefox on Android behaves the same way.

### browser.tabs.inTitlebar

* Value: 1
* Description: ...
* Reason: Save vertical space by hiding the titlebar.

### browser.search.suggest.enabled

* Value: false
* Description: ...
* Reason: Disable search suggestions

### browser.newtabpage.enabled

* Value: false
* Description: Show Firefox New Tab page as the homepage
* Reason: Faster startup time and less distractions.

### toolkit.legacyUserProfileCustomizations.stylesheets

* Value: true
* Description: ...
* Reason: Allow UI customizations with userChrome.css and userContent.css

### browser.urlbar.clickSelectsAll

* Value: true
* Description: ...
* Reason: Select the entire URL with one click.

### toolkit.cosmeticAnimations.enabled

* Value: false
* Description: ...
* Reason: Reduce CPU usage.

### browser.download.animateNotifications

* Value: false
* Description: ...
* Reason: Reduce CPU usage.

### browser.ai.control.default

* Value: 'blocked'
* Description: Turn AI killswitch to off
* Reason: Reduce CPU usage.

### browser.ai.control.translations

* Value: 'available'
* Description: Translation service
* Reason: Keep translations feature despite the AI killswitch has been switched to off.

### browser.ml.chat.enabled

* Value: false
* Description: Disable AI chat feature
* Reason: Declutter tab bar with vertical tabs.

### browser.ml.chat.menu

* Value: false
* Description: AI chat interaction from context menu
* Reason: Declutter context menu, LLMs bad.

### sidebar.main.tools

* Value: 'aichat'
* Description: Menu items next to Customize icon in vertical tab sidebar
* Reason: Don't show poorly working (width too narrow) history menus by default, improves landscape experience (set to aichat as setting to '' has no effect).

### sidebar.verticalTabs.dragToPinPromo.dismissed

* Value: true
* Description: Hint that suggests dragging tabs to the top to pin them
* Reason: Dismiss outright, as tab dragging does not work with touch.

### browser.tabs.hoverPreview.enabled

* Value: false
* Description: Small preview popups
* Reason: Hide to avoid interference with/overlap of the urlbar with vertical tabs.
