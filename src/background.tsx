/// <reference types="chrome" />

// Use chrome namespace (works in both Chrome and Firefox MV3)
const browserAPI =
  typeof chrome !== "undefined" && chrome.runtime ? chrome : browser;

let windowId: number | null = null;

browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browserAPI.tabs.create({
      url: browserAPI.runtime.getURL("welcome.html"),
    });
  }
});

browserAPI.action.onClicked.addListener(async () => {
  if (windowId !== null) {
    try {
      const window = await browserAPI.windows.get(windowId);
      if (window) {
        browserAPI.windows.update(windowId, { focused: true });
        return;
      }
    } catch {
      windowId = null;
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
browserAPI.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "sayHello") {
    sendResponse({ response: "Hello from background!" });
  }
});
