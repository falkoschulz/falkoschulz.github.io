import ScrollSync from "./scrollsync.js";

chrome.runtime.onInstalled.addListener(() => {
  ScrollSync.fireEvent("install");

  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  ScrollSync.fireEvent("message", {request, sender, sendResponse});
});

chrome.action.onClicked.addListener(async (tab) => {
  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    ScrollSync.setOn(tab);
  } else if (nextState === "OFF") {
    ScrollSync.setOff(tab);
  }
});
