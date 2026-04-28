console.log("Background script loaded");

// ---------- WHITELIST ----------
const WHITELIST = [
  "google.com",
  "microsoft.com",
  "wikipedia.org",
  "github.com",
  "amazon.com",
  "apple.com",
  "linkedin.com"
];

function isWhitelisted(url) {
  try {
    const host = new URL(url).hostname;
    return WHITELIST.some(d => host.includes(d));
  } catch {
    return false;
  }
}

// ---------- SHORTENERS ----------
const SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly"
];

function isShortened(url) {
  try {
    const host = new URL(url).hostname;
    return SHORTENERS.some(d => host.includes(d));
  } catch {
    return false;
  }
}

// ---------- SUSPICIOUS URL HEURISTIC ----------
function looksSuspicious(url) {
  const keywords = [
    "login",
    "verify",
    "update",
    "secure",
    "account",
    "bank",
    "confirm",
    "password"
  ];

  const riskyTlds = [".xyz", ".info", ".top", ".club", ".online"];

  const lower = url.toLowerCase();
  const keywordHit = keywords.some(k => lower.includes(k));
  const hyphens = (lower.match(/-/g) || []).length;
  const tldHit = riskyTlds.some(tld => lower.endsWith(tld));

  return keywordHit && (hyphens >= 2 || tldHit);
}

// ---------- MAIN LISTENER ----------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action !== "scan_url") return;

  console.log("Scanning:", message.url);

  // 1️⃣ Whitelist
  if (isWhitelisted(message.url)) {
    sendResponse({ status: "whitelisted" });
    return true;
  }

  // 2️⃣ Short URL
  if (isShortened(message.url)) {
    chrome.tabs.sendMessage(sender.tab.id, { action: "phishing_detected" });
    sendResponse({ status: "shortened" });
    return true;
  }

  // 3️⃣ Heuristic URL rule
  if (looksSuspicious(message.url)) {
    chrome.tabs.sendMessage(sender.tab.id, { action: "phishing_detected" });
    sendResponse({ status: "heuristic" });
    return true;
  }

  // 4️⃣ ML API
  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: message.url })
  })
    .then(res => res.json())
    .then(data => {
      console.log("ML result:", data);

      if (data.prediction === 1 && data.confidence >= 0.85) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "phishing_detected"
        });
      }

      sendResponse({ status: "done" });
    })
    .catch(() => sendResponse({ status: "error" }));

  return true;
});
