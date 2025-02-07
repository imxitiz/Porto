/// <reference types="chrome" />
/// <reference types="firefox-webext-browser" />

const browserAPI = typeof chrome !== "undefined" ? chrome : browser;

let windowId: number | null = null;

browserAPI.action.onClicked.addListener(async () => {
  if (windowId !== null) {
    const window = await browserAPI.windows.get(windowId);
    if (window) {
      browserAPI.windows.update(windowId, { focused: true });
      return;
    }
  }

  const window = await browserAPI.windows.create({
    url: "index.html",
    type: "popup",
    width: 500,
    height: 800,
    focused: true,
  });

  // Store the window ID
  windowId = window.id || null;

  // Listen for window close
  browserAPI.windows.onRemoved.addListener((removedWindowId) => {
    if (removedWindowId === windowId) {
      windowId = null;
    }
  });
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sayHello") {
    console.log("Hello from the background script!");
    sendResponse({ response: "Hello from background!" });
  }
});
