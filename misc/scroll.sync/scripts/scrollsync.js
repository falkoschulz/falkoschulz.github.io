export class ScrollSync {
  constructor(isOn = true) {
    this._isOn = isOn;
    this._selectedTabIds = [];
  }

  setOn(tabId) {
    console.log("ScrollSync::setOn", tabId);
    if (this._selectedTabIds.indexOf(tabId) === -1) {
      this._selectedTabIds.push(tabId);
    }
    this._isOn = true;
  }

  setOff(tabId) {
    console.log("ScrollSync::setOff", tabId);
    this._selectedTabIds.splice(this._selectedTabIds.indexOf(tabId), 1);
    this._isOn = false;
  }

  async activeTab() {
    return await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  }

  async fireEvent(name, params = {}) {
    switch (name) {
      case "install":
        console.log("ScrollSync::fireEvent", "install");
        chrome.action.setBadgeText({
          text: "",
        });
        break;
      case "message":
        const { request, sender, sendResponse } = params;

        if (sender.tab && this._isOn && this._selectedTabIds.length > 1) {
          console.log(
            "ScrollSync::fireEvent",
            "scroll",
            `sender: ${sender.tab}`
          );

          // content script has updated scroll position
          this._selectedTabIds.forEach((tabId) => {
            if (tabId !== sender.tab.id) {
              // send to other tabs
              chrome.tabs.sendMessage(tabId, request);
            }
          });
        }
        break;
    }
  }
}

export default new ScrollSync();
