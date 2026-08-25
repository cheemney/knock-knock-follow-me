const API_BASE_URL = "https://api.github.com";
const API_VERSION = "2026-03-10";

async function getSettings() {
  return chrome.storage.local.get({ username: "" });
}

async function checkFollowStatus(targetUsername) {
  const { username: currentUsername } = await getSettings();
  const current = currentUsername.trim();
  const target = String(targetUsername || "").trim();

  if (!current) {
    return { status: "not-configured" };
  }

  if (!target) {
    return { status: "api-error" };
  }

  // GitHub usernames are case-insensitive. Avoid an unnecessary API request
  // when the visited profile belongs to the configured account.
  if (target.toLowerCase() === current.toLowerCase()) {
    return { status: "self" };
  }

  const url = `${API_BASE_URL}/users/${encodeURIComponent(target)}/following/${encodeURIComponent(current)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": API_VERSION,
      },
    });

    if (response.status === 204) {
      return { status: "following" };
    }

    if (response.status === 404) {
      return { status: "not-following" };
    }

    if (response.status === 403 || response.status === 429) {
      return { status: "rate-limited" };
    }

    if (response.status === 422) {
      return { status: "profile-not-found" };
    }

    return { status: "api-error", code: response.status };
  } catch (error) {
    console.error("GitHub API request failed:", error);
    return { status: "network-error" };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "CHECK_FOLLOW_STATUS") {
    return undefined;
  }

  checkFollowStatus(message.username).then(sendResponse).catch((error) => {
    console.error("Follow status check failed:", error);
    sendResponse({ status: "api-error" });
  });

  return true;
});
