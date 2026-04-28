const TRUSTED_DOMAINS = [
  "google.com",
  "microsoft.com",
  "microsoftonline.com",
  "github.com",
  "wikipedia.org",
  "amazon.com",
  "apple.com",
  "linkedin.com"
];

function isTrustedDomain() {
  const host = window.location.hostname;
  return TRUSTED_DOMAINS.some(domain =>
    host === domain || host.endsWith("." + domain)
  );
}

console.log("Phishnet content.js injected on:", window.location.href);

// ---------- SEND URL ----------
chrome.runtime.sendMessage(
  { action: "scan_url", url: window.location.href },
  () => {}
);

// ---------- RECEIVE DETECTION ----------
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "phishing_detected") {
    showWarningOverlay();
  }
});

// ---------- SOUND ----------
function playAlertSound() {
  const sound = new Audio(chrome.runtime.getURL("assets/alert.mp3"));
  sound.volume = 0.9;
  sound.play().catch(() => {});
}

// ---------- HTML SCAN ----------
function scanPageForPhishing() {

  // Skip trusted domains
  if (isTrustedDomain()) {
    console.log("Trusted domain — skipping HTML scan");
    return;
  }

  const forms = document.querySelectorAll("form");
  const passwords = document.querySelectorAll("input[type='password']");
  const text = document.body.innerText.toLowerCase();

  let hasPassword = passwords.length > 0;
  let hasSuspiciousKeyword = false;
  let externalForm = false;

  const keywords = [
    "verify account",
    "update account",
    "confirm password",
    "bank account",
    "security alert"
  ];

  keywords.forEach(k => {
    if (text.includes(k)) {
      hasSuspiciousKeyword = true;
    }
  });

  forms.forEach(form => {
    const action = form.getAttribute("action");
    if (action && !action.includes(location.hostname)) {
      externalForm = true;
    }
  });

  console.log("Password:", hasPassword);
  console.log("Keyword:", hasSuspiciousKeyword);
  console.log("External form:", externalForm);

  // 🔴 Trigger ONLY if strong phishing signals exist
  if (
      (hasPassword && externalForm) ||
      (hasPassword && hasSuspiciousKeyword && externalForm)
     ) {
    console.log("High confidence phishing detected via HTML");
    showWarningOverlay();
  }
}

// ---------- OVERLAY ----------
function showWarningOverlay() {

  if (document.getElementById("phishnet-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "phishnet-overlay";

  const logo = chrome.runtime.getURL("icons/phishnet_icon.jpg");

  overlay.innerHTML = `
    <div style="
      background:#fff;
      padding:40px;
      border-radius:12px;
      max-width:520px;
      text-align:center;
      font-family:Arial;
      box-shadow:0 10px 40px rgba(0,0,0,0.4);
    ">
      <img src="${logo}" style="width:80px;margin-bottom:15px;">
      <h2 style="color:#d32f2f">⚠️ Phishnet Warning</h2>
      <p>This website may be attempting to steal sensitive information.</p>
      <div style="margin-top:25px;display:flex;justify-content:center;gap:15px;">
        <button id="continue">Continue</button>
        <button id="close">Close Website</button>
      </div>
    </div>
  `;

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.75);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:999999;
  `;

  document.body.appendChild(overlay);

  // 🔊 PLAY SOUND ONLY WHEN BANNER APPEARS
  const sound = new Audio(chrome.runtime.getURL("assets/alert.mp3"));
  sound.volume = 0.9;
  sound.play().catch(() => {});

  document.getElementById("continue").onclick = () => {
    overlay.remove();
  };

  document.getElementById("close").onclick = () => {
    location.href = "https://www.google.com";
  };
}

// ---------- RUN HTML SCAN ----------
window.addEventListener("load", () => {
  setTimeout(scanPageForPhishing, 1200);
});
