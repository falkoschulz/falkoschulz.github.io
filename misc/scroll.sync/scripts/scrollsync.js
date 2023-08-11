export class ScrollSync {
  constructor(isOn = true) {
    this._isOn = isOn;
    this._selectedTabIds = [];
  }

  setOn(tab) {
    this._selectedTabIds.push(tab.id);
    this._isOn = true;
  }

  setOff(tab) {
    this._selectedTabIds.splice(this._selectedTabIds.indexOf(tab.id), 1);
    this._isOn = false;
  }

  async activeTab() {
    return await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  }

  async fireEvent(name, params = {}) {
    console.log("ScrollSync::fireEvent", name, params);

    switch (name) {
      case "install":
        chrome.action.setBadgeText({
          text: "",
        });
        break;
      case "message":
        const { request, sender, sendResponse } = params;

        if (sender.tab && this._isOn) {
          // turn off by default on page unload
          if (request.unload === true) {
            this.setOff(sender.tab);
          }

          // content script has updated scroll position
          this._selectedTabIds.forEach((tabId) => {
            if (tabId !== sender.tab.id) {
              // send to other tabs
              chrome.tabs.sendMessage(tabId, request);
            }
          });
          break;
        }
    }
  }
}

export default new ScrollSync();
