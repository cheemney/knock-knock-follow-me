const BADGE_ID = "knock-knock-follow-badge";

const style = document.createElement("style");
style.textContent = `
  .knock-knock-badge {
    display: inline-block;
    padding: 3px 7px;
    border-radius: 999px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    vertical-align: middle;
    white-space: nowrap;
  }
  .knock-knock-following { background: #238636; }
  .knock-knock-not-following { background: #da3633; }
  .knock-knock-not-configured,
  .knock-knock-rate-limited,
  .knock-knock-network-error,
  .knock-knock-profile-not-found,
  .knock-knock-api-error { background: #9e6a03; }
`;
document.documentElement.appendChild(style);

function getProfileUsername() {
  const match = window.location.pathname.match(/^\/([^/]+)\/?$/);
  if (!match) return null;

  const username = match[1];
  const reservedPaths = new Set([
    "about", "account", "collections", "contact", "dashboard", "explore",
    "features", "gist", "login", "marketplace", "new", "notifications",
    "organizations", "pricing", "search", "settings", "sponsors", "topics",
  ]);

  return reservedPaths.has(username.toLowerCase()) ? null : username;
}

function getUsernameElement() {
  return document.querySelector(
    '[itemprop="additionalName"], .p-nickname, .vcard-username',
  );
}

function getBadgeAnchor() {
  return getUsernameElement() ?? document.querySelector("h1.vcard-names");
}

function removeBadge() {
  document.getElementById(BADGE_ID)?.remove();
}

function renderBadge(result, messages) {
  removeBadge();

  if (!result || result.status === "self") return;

  const usernameElement = getBadgeAnchor();
  if (!usernameElement) return false;

  const messageKey = {
    following: "following",
    "not-following": "notFollowing",
    "not-configured": "notConfigured",
    "rate-limited": "rateLimited",
    "network-error": "networkError",
    "profile-not-found": "profileNotFound",
    "api-error": "apiError",
  }[result.status] ?? "unknownError";

  const badge = document.createElement("small");
  badge.id = BADGE_ID;
  badge.textContent = translate(messages, messageKey);
  badge.className = `knock-knock-badge knock-knock-${result.status}`;
  usernameElement.insertAdjacentElement("afterend", badge);
  return true;
}

let requestSequence = 0;
let lastResult;


async function checkCurrentProfile() {
  const sequence = ++requestSequence;
  const pathname = window.location.pathname;
  const username = getProfileUsername();

  if (!username) {
    removeBadge();
    return;
  }

  try {
    const [{ messages }, result] = await Promise.all([
      getMessages(),
      chrome.runtime.sendMessage({
        type: "CHECK_FOLLOW_STATUS",
        username,
      }),
    ]);

    // Ignore a response for a profile that is no longer visible.
    if (sequence !== requestSequence || pathname !== window.location.pathname) {
      return;
    }

    lastResult = result;
    renderBadge(result, messages);
  } catch (error) {
    console.error("Failed to check follow status:", error);
    if (sequence !== requestSequence || pathname !== window.location.pathname) {
      return;
    }

    const { messages } = await getMessages();
    renderBadge({ status: "api-error" }, messages);
  }
}

let lastPathname = window.location.pathname;
let navigationTimer;
let badgeRetryTimer;

function observeNavigation() {
  const pathname = window.location.pathname;

  if (pathname !== lastPathname) {
    lastPathname = pathname;
    requestSequence++;
    removeBadge();
    clearTimeout(navigationTimer);
    navigationTimer = setTimeout(checkCurrentProfile, 100);
    return;
  }

  // GitHub can render parts of the profile asynchronously. If the API result
  // is already available but the username element is not in the DOM yet,
  // retry the badge insertion after the DOM changes.
  if (lastResult && lastResult.status !== "self" && !document.getElementById(BADGE_ID)) {
    clearTimeout(badgeRetryTimer);
    badgeRetryTimer = setTimeout(async () => {
      try {
        const { messages } = await getMessages();
        renderBadge(lastResult, messages);
      } catch (error) {
        console.error("Failed to render follow badge:", error);
      }
    }, 50);
  }
}

const observer = new MutationObserver(observeNavigation);
observer.observe(document.documentElement, { childList: true, subtree: true });

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local" || !changes.language || !lastResult) return;

  const { messages } = await getMessages();
  renderBadge(lastResult, messages);
});

checkCurrentProfile();
setTimeout(checkCurrentProfile, 500);
