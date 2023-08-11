let pauseScrollEvent = false;

// monitor scroll events and notify service-worker
window.addEventListener("scroll", function () {
  if (pauseScrollEvent) {
    pauseScrollEvent = false;
    return;
  }

  chrome.runtime.sendMessage({
    window_scrollX: window.scrollX,
    window_scrollY: window.scrollY,
  });
});

window.addEventListener("unload", function (event) {
  chrome.runtime.sendMessage({
    unload: true,
  });
});

// receive any scroll events from other tabs via service-worker messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!sender.tab) {
    // from service-worker
    const x = request.window_scrollX;
    const y = request.window_scrollY;

    // prevent firing own scroll event again
    pauseScrollEvent = true;
    window.scroll(x, y);
  }
});
