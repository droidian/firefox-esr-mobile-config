# Installation

## From package manager

Alpine Linux (postmarketOS):
```
apk add mobile-config-firefox
apk add mobile-config-firefox-librewolf  # (only needed for librewolf)
```

Arch Linux (DanctNIX, AUR)
```
yay -S mobile-config-firefox
```

Debian (Mobian):
```
apt install firefox-esr-mobile-config
```

## Manual install

If you want to install this config manually, e.g. to see if a bug is still
present in the current state of the project, or to test your changes, clone the
repository (or download it).

From inside the `mobile-config-firefox` folder run:

```
sudo make FIREFOX_DIR=/usr/lib/firefox-esr install
```

for Firefox ESR. For [other variants](https://whattrainisitnow.com/) of
Firefox, change the part after `FIREFOX_DIR=` as follows:

* Release: `/usr/lib/firefox` (or plain `sudo make install`, as it's the
  default value if none is set)
* Beta: `/usr/lib/firefox-beta`
* Nightly: `/usr/lib/firefox-nightly`
* Librewolf: `/usr/lib/librewolf`

Note that Firefox ESR and Release are the only officially supported variants by
mobile-config-firefox. Other variants might not fully work.

Testing with Beta and Nightly is possible via a Debian distrobox using
[Mozilla's repo](https://blog.nightly.mozilla.org/2023/10/30/introducing-mozillas-firefox-nightly-deb-packages-for-debian-based-linux-distributions/).
The easiest way to add the mozilla repo is via
[extrepo](https://manpages.debian.org/trixie/extrepo/extrepo.1p.en.html).

Flatpak installs are
[currently unsupported](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/issues/104),
help welcome!
