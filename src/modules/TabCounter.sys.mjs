// Copyright 2026 Peter Mack
// SPDX-License-Identifier: MPL-2.0

export class TabCounter {
    init() {
        const windowListener = {
            onOpenWindow: (xulWindow) => {
                const window = xulWindow.docShell.domWindow;
                window.addEventListener('load', () => {
                    if (window.location.href !== 'chrome://browser/content/browser.xhtml') return;
                    this._setupForWindow(window);
                }, { once: true });
            },
        };

        Services.wm.addListener(windowListener);

        const windows = Services.wm.getEnumerator('navigator:browser');
        while (windows.hasMoreElements()) {
            const window = windows.getNext();
            if (window.document.readyState === 'complete') {
                this._setupForWindow(window);
            } else {
                window.addEventListener('load', () => this._setupForWindow(window), { once: true });
            }
        }
    }

    _setupForWindow(window) {
        const updateCount = () => {
            const count = window.gBrowser.tabs.length;
            const displayValue = count > 99 ? '∞' : count;
            window.document.documentElement.style.setProperty('--tab-count', `"${displayValue}"`);
        };

        updateCount();

        const container = window.gBrowser.tabContainer;
        container.addEventListener('TabOpen', updateCount);
        container.addEventListener('TabClose', updateCount);
        container.addEventListener('TabMove', updateCount);
    }
}
