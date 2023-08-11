let pauseScrollEvent = false;

window.addEventListener("scroll", async function () {
  if (pauseScrollEvent) {
    pauseScrollEvent = false;
    return;
  }

  const x = window.scrollX;
  const y = window.scrollY;
  console.log("tab sends scrollXY:" + x + "," + y);

  const response = await chrome.runtime.sendMessage({
    window_scrollX: x,
    window_scrollY: y,
  });

  if (response.resp === "SENT_TO_TABS") {
    // success
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!sender.tab) {
    // from service-worker
    var x = request.window_scrollX;
    var y = request.window_scrollY;
    console.log("tab receives scrollXY:" + x + "," + y);
    pauseScrollEvent = true;
    window.scroll(x, y);
    sendResponse({ resp: "SCROLL_POSITIONS_RECEIVED" });
  }
});
