import ScrollSync from "./scrollsync.js";

chrome.runtime.onInstalled.addListener(() => {
  ScrollSync.fireEvent("install");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  ScrollSync.fireEvent("message", { request, sender, sendResponse });
});

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "on" ? "" : "on";

  // update action badge
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "on") {
    ScrollSync.setOn(tab);
  } else {
    ScrollSync.setOff(tab);
  }
});
