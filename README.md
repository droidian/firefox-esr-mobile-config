# mobile-config-firefox

Mobile and privacy friendly configuration for current standard and extended
support releases of Firefox.

This does not replace a proper implementation in
[Firefox upstream](https://bugzilla.mozilla.org/show_bug.cgi?id=1579348)
*(interesting stuff happens in issues linked in "References")*.

## Matrix / IRC channel

* Matrix: `#mobile-config-firefox:postmarketos.org`
* IRC: `#mobile-config-firefox` at OFTC

## What this config does

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

## Manual install

If you want to install this config, e.g., to see if a bug is still present in
the current state of the project, or to test your changes, clone the repository
(or download it).

From inside the `mobile-config-firefox` folder run

~~~
sudo make FIREFOX_DIR=/usr/lib/firefox-esr install
~~~

for Firefox ESR. For [other variants](https://whattrainisitnow.com/) of Firefox, change the part after
`FIREFOX_DIR=`

* Release: `/usr/lib/firefox` (or plain `sudo make install`, as it's the default value if none is set)
* Beta: `/usr/lib/firefox-beta`
* Nightly: `/usr/lib/firefox-nightly`
* Librewolf: `/usr/lib/librewolf`

Testing with Beta and Nightly is possible via a Debian distrobox using
[Mozilla's repo](https://blog.nightly.mozilla.org/2023/10/30/introducing-mozillas-firefox-nightly-deb-packages-for-debian-based-linux-distributions/). The easiest way to add the mozilla repo is via [extrepo](https://manpages.debian.org/trixie/extrepo/extrepo.1p.en.html).

Flatpak installs are [currently unsupported](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/issues/104)
, help welcome!

## For users: making changes

As user, it is possible to override all options set by this project. Usually it
can be done in the preferences (which are now adaptive, so you can actually use
them on your phone).

To remove elements (e.g., the reload button, if you do not use it often) you tap
and hold the extensions Menu and select "Customize Toolbar".

If you don't like that the Firefox UI is moved to the bottom, you can undo this
change by adding `mcf.addressbarontop` and set it to true in `about:config`.

If you don't like the single tab mode, you can show multiple tabs in tab-bar
by adding `mcf.multipletabs` and set it to true in `about:config`. If you want
to have a close button on every tab, add `mcf.multipletabs.showclose` and set it
to true. If you don't like the tab counter, you can disable it by adding
`mcf.tabcounter.disable` in `about:config` and setting it to true.

If you want to use the protections icon in urlbar, you can unhide it by
adding  `mcf.showprotectionsicon` and set it to true in `about:config`.

If you don't like the hiding of https:// in the urlbar, you can get back to
default behavior by setting `browser.urlbar.trimHttps` to false in
`about:config`.

If you should have issues with the file picker, you can set
`widget.use-xdg-desktop-portal.file-picker` to 2 in about:config.

If it cannot be changed in preferences, look in
`/etc/firefox/policies/policies.json`. You can see the active policies while
Firefox is running in `about:policies`. The uBlock origin add-on for example,
is getting installed through `policies.json` and can be removed in that file
if you do not want it. Without editing the file, it can only be disabled in the
add-on settings, and not removed, this is a limitation of `policies.json`. If
you just want to un-pin uBlock Origin, long-pressing its icon and de-selecting
"Pin to toolbar" should be enough.

Feel free to
[create an issue](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/issues)
if you run into problems. Or even better, attempt to fix the problem yourself
(see development instructions below) and submit a
[merge request](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/merge_requests).


## Contributing changes to userChrome
Firefox' developer tools include a
[remote debugger](https://developer.mozilla.org/en-US/docs/Tools/Remote_Debugging),
which even has the "pick an element" feature. You will be able to click that
button on your PC, then tap on an element of the Firefox UI on your phone, and
then you will see the HTML code and CSS properties on your PC just as if it was
a website. So this is highly recommended when contributing changes to
`userChrome.css`.

* Connect your phone and your PC to the same network (Wi-Fi or USB network)
* On your phone, open Firefox and `about:config`:
  * Change `devtools.chrome.enabled` to `true`
  * Change `devtools.debugger.remote-enabled` to `true`
  * The debugger will only listen on localhost by default. If you know what you
    are doing, you may set `devtools.debugger.force-local` to `false`, so it
    listens on all interfaces. Otherwise you'll need something like an SSH
    tunnel.
  * Close firefox
* Connect to your phone via [SSH](https://wiki.postmarketos.org/wiki/SSH)
  * Set up environment variables properly, so you can start programs (one lazy
    way to do it, is `tmux` on your phone in the terminal, then `tmux a` in
    SSH)
  * Run `firefox --start-debugger-server 6000` (or another port if you desire)
* Run Firefox on your PC
  * Go to `about:debugging`
  * Add your phone as "network location" (`172.16.42.1:6000` if connected through USB Network)
  * Press the connect button on the left
  * If it does not work, check if a firewall on your phone is blocking the port
    (i.e. [nftables](https://wiki.postmarketos.org/wiki/Nftables) in postmarketOS).
* On your phone
  * Confirm the connection on your phone's screen
    * If the button is not visible on the screen, try switching to a terminal
      virtual keyboard, hit "tab" three times and then return
* On your PC
  * Scroll down to Processes, Main Process, and click "Inspect"
  * Now use the "Pick an element" button as described in the introduction. Find
    the `userChrome.css` file in the "Style editor" tab and edit it as you
    like.
  * Consider copy pasting the contents to a text editor every now and then, so
    you don't lose it when closing Firefox by accident.

Note that after making changes to CSS files, and deploying them on your
system (`make install`), you might need to restart firefox _twice_ before
changes are applied.

## Log file

The `src/mobile-config-autoconfig.js` script generates `userChrome.css` and
`userContent.css` while Firefox starts. It logs to your Firefox profile
directory, follow the log file with:

```
$ tail -F $(find ~/.mozilla -name mobile-config-firefox.log)
```

## Coding guidelines

* Don't make longer lines than 79 columns where possible (like in PEP-8)
* Use 4 spaces for indent in all files, except for shell scripts (use tabs
  there). Consider configuring your editor to use `.editorconfig`, then it gets
  configured automatically.
* Linter: `.ci/lint.sh` (consider setting it as pre-commit hook, requires GNU
  grep)

## Packaging, forks and similar efforts

### Packaging with patches

If your distribution is listed here, and you have an issue with
mobile-config-firefox that could be related to the distributions changes,
please report it there first:

* Mobian/Debian [firefox-esr-mobile-config](https://salsa.debian.org/DebianOnMobile-team/firefox-esr-mobile-config)
packaging, [downstream patches](https://salsa.debian.org/DebianOnMobile-team/firefox-esr-mobile-config/-/tree/debian/latest/debian/patches)
* PureOS [firefox-esr-mobile-config](https://source.puri.sm/Librem5/debs/firefox-esr-mobile-config)
packaging, [downstream patches](https://source.puri.sm/Librem5/debs/firefox-esr-mobile-config/-/tree/pureos/latest/debian/patches)

### Forks

The following distributions are no longer rebasing on this project, and are
continuing on their own - if you have issues, report them there:

* Droidian: [firefox-esr-mobile-config](https://github.com/droidian/firefox-esr-mobile-config)
* FuriOS: [furios-firefox-tweaks](https://github.com/FuriLabs/furios-firefox-tweaks)
\- includes [GNOME theming](https://github.com/rafaelmardojai/firefox-gnome-theme),
requires `coreutils` package for sucessful install on Alpine/postmarketOS.

### Related Projects

This project is does not share history or code, but accomplishes something similar
(running a Firefox(-derived) desktop browser on a Mobile operating system):

* uWolf (Librewolf for Ubuntu Touch): [open-store](https://open-store.io/app/uwolf.chromiumos-guy),
[sources](https://github.com/ChromiumOS-Guy/uWolf)

## Additional resources

* [How to use the Firefox Browser Toolbox](https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox)
* [firefox-csshacks](https://github.com/MrOtherGuy/firefox-csshacks/)
* [FirefoxCSS subreddit](https://www.reddit.com/r/FirefoxCSS/)
* [whattrainisitnow.com](https://whattrainisitnow.com/): FF and FF ESR releases
  currently supported upstream, we try to support these with this config

