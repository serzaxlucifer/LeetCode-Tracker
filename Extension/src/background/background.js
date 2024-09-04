
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ token: "" });
    chrome.storage.local.set({ extension: false });
    chrome.storage.local.set({ logging: false });
    chrome.storage.local.set({ userRoute: 'https://leetcode-tracker-vavc.onrender.com/dashboard/get-profile' });
    chrome.storage.local.set({ loginRoute: 'https://leetcode-tracker-vavc.onrender.com/auth/google' });
    chrome.storage.local.set({ sendRoute: 'https://leetcode-tracker-vavc.onrender.com/submissions/send-entry' });
    chrome.storage.local.set({ getRoute: 'https://leetcode-tracker-vavc.onrender.com/submissions/get-entry' });
    chrome.storage.local.set({ getRandom: 'https://leetcode-tracker-vavc.onrender.com/dashboard/get-random' });
    chrome.storage.local.set({ getRandomTopic: 'https://leetcode-tracker-vavc.onrender.com/dashboard/get-random-topic' });
    chrome.storage.local.set({ user: {uName: "", firstName: "", lastName: ""}});
  });

  async function checkCookie() {
    return new Promise((resolve, reject) => {
      console.log("CHECKING FOR COOKIE.");
      chrome.cookies.get({ url: 'https://leetcode-tracker.pages.dev', name: 'token' }, function(cookie) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else if (cookie) {
          console.log('Cookie:', cookie);
          resolve(cookie.value); // Resolve with the cookie value
        } else {
          console.log("NO TOKEN FOUND!");
          resolve(null); // Resolve with null if cookie not found
        }
      });
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("GOT A REQUEST!");
    if (message.action === 'getToken') {
      checkCookie().then(token => {
        sendResponse({ token: token }); // Send token back to content script
      }).catch(error => {
        console.log("error ",  error);
        sendResponse({ error: error }); // Send error message back to content script
      });
      return true; // Keep the message channel open for asynchronous response
    }
  });