# Related Projects

## Packaging with patches

If your distribution is listed here, and you have an issue with
mobile-config-firefox that could be related to the distributions changes,
please report it there first:

* Mobian/Debian [firefox-esr-mobile-config](https://salsa.debian.org/DebianOnMobile-team/firefox-esr-mobile-config)
packaging, [downstream patches](https://salsa.debian.org/DebianOnMobile-team/firefox-esr-mobile-config/-/tree/debian/latest/debian/patches)
* PureOS [firefox-esr-mobile-config](https://source.puri.sm/Librem5/debs/firefox-esr-mobile-config)
packaging, [downstream patches](https://source.puri.sm/Librem5/debs/firefox-esr-mobile-config/-/tree/pureos/latest/debian/patches)
* PocketBlue [firefox-systemconfig](https://github.com/pocketblue/firefox-systemconfig) flatpak packaging,
* PocketBlue [handyfox](https://github.com/pocketblue/handyfox), flatpak packaging, "goal is to provide a browser for mobile devices with mobile-config-firefox and firefox-gnome-theme prenistalled", [patches](https://github.com/pocketblue/handyfox/tree/main/modules/mobile-config/patches).

## Forks

The following distributions are no longer rebasing on this project, and are
continuing on their own - if you have issues, report them there:

* Droidian: [firefox-esr-mobile-config](https://github.com/droidian/firefox-esr-mobile-config)
* FuriOS: [furios-firefox-tweaks](https://github.com/FuriLabs/furios-firefox-tweaks)
\- includes [GNOME theming](https://github.com/rafaelmardojai/firefox-gnome-theme),
requires `coreutils` package for sucessful install on Alpine/postmarketOS.

## Similar efforts

This project is does not share history or code, but accomplishes something
similar (running a Firefox(-derived) desktop browser on a Mobile operating
system):

* uWolf (Librewolf for Ubuntu Touch): [open-store](https://open-store.io/app/uwolf.chromiumos-guy),
[sources](https://github.com/ChromiumOS-Guy/uWolf)
