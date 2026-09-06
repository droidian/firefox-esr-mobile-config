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

### Flatpak installs

#### Classic (mutable) distributions

To install mobile-config-firefox for the [Firefox flatpak](https://flathub.org/apps/org.mozilla.firefox) installed for all users, simply run:

```
sudo make FLATPAK=1 install
```

For a "flatpak install --user" Firefox, override FLATPAK_EXT_DIR, e.g.:

```
make FLATPAK=1 FLATPAK_EXT_DIR=~/.local/share/flatpak/extension/org.mozilla.firefox.systemconfig/aarch64/stable install
```

#### Immutable distributions

On immutable distributions, you will need to build and install mobile-config-firefox as a flatpak that extends the [Firefox flatpak](https://flathub.org/apps/org.mozilla.firefox).

For that, you will need to have `org.flatpak.Builder` and `org.freedesktop.Sdk` (same release as specified in the [manifest](https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/raw/main/org.mozilla.firefox.systemconfig.yml) installed and run

```
flatpak run org.flatpak.Builder --user --install --install-deps-from=flathub --force-clean --repo=repo build org.mozilla.firefox.systemconfig.yml
```

inside the mobile-config-firefox folder. The manifest architected in such a way, that it builds what ever is in the folder at the time of build, so you should be able to hack on mobile-config-firefox on immutable distributions just fine.
