let pauseScrollEvent = false;

// simple throttle function to limit number of scroll messages fired
const throttle = (func, wait, scope) => {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    const args = arguments;
    timer = setTimeout(function () {
      timer = null;
      func.apply(scope, args);
    }, wait);
  };
};

// monitor scroll events and notify service-worker
window.addEventListener(
  "scroll",
  throttle(() => {
    if (pauseScrollEvent) {
      pauseScrollEvent = false;
      return;
    }

    window &&
      chrome.runtime.sendMessage({
        window_scrollX: window.scrollX,
        window_scrollY: window.scrollY,
      });
  }, 50)
);

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
