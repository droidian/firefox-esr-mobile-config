# Remote Debugger

Firefox' developer tools include a
[remote debugger](https://developer.mozilla.org/en-US/docs/Tools/Remote_Debugging),
which even has the "pick an element" feature. You will be able to click that
button on your PC, then tap on an element of the Firefox UI on your phone, and
then you will see the HTML code and CSS properties on your PC just as if it was
a website.

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
  * Add your phone as "network location" (`172.16.42.1:6000` if connected
    through USB Network)
  * Press the connect button on the left
  * If it does not work, check if a firewall on your phone is blocking the port
    (i.e. [nftables](https://wiki.postmarketos.org/wiki/Nftables) in
    postmarketOS).
* On your phone
  * Confirm the connection on your phone's screen
    * If the button is not visible on the screen, try switching to a terminal
      virtual keyboard, hit "tab" three times and then return
* On your PC
  * Scroll down to Processes, Main Process, and click "Inspect"
  * Now use the "Pick an element" button as described in the introduction.
  * Consider copy pasting the contents to a text editor every now and then, so
    you don't lose it when closing Firefox by accident.

Note that after making changes to CSS files, and deploying them on your
system (`make install`), you might need to restart firefox _twice_ before
changes are applied.
