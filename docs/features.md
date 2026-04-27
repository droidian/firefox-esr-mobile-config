# Features

* Adapt UI elements and "about:" pages to small screen sizes (when opened on
  small screen)
* Moves the UI chrome (address- and tab-bar) to the bottom
* Enable mobile gestures
* Show one tab to show the page title and add a tab counter
* Use the native file-picker through xdg-portals
* Privacy tweaks:
  * Disable search suggestions
  * Disable Firefox studies
  * Disable Telemetry
  * Set DuckDuckGo as default search engine, remove other search engines except
    for Wikipedia (only works in Firefox ESR, limitation of
    [policies.json](https://github.com/mozilla/policy-templates/blob/cab6a5076c1d8e5a1574637709c19b54bdbd669e/README.md#searchengines--remove))
  * Install [uBlock origin](https://github.com/gorhill/uBlock) by default
    ([why?](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/commit/160a1056c2cf35572157762f66174ea7c0b1db06))
* Uncluttering:
  * Disable built-in advertisements (e.g. hardcoded links for certain social
    media sites on the start page)
  * Disable "User Messaging" about new features etc.
  * Hide protections menu (the shield icon) in urlbar by default
  * Hide https in urlbar by default

There's a
[screenshot thread](https://fosstodon.org/web/@ollieparanoid/107394745970284867)
of the `3.0.0_rc1` release.

