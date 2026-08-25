const form = document.getElementById("settings-form");
const usernameInput = document.getElementById("username");
const languageSelect = document.getElementById("language");
const statusElement = document.getElementById("status");
const saveButton = document.getElementById("save-button");

let currentMessages;

function setStatus(message, type = "info") {
  statusElement.textContent = message;
  statusElement.dataset.type = type;
}

function renderStaticText(messages) {
  currentMessages = messages;
  document.documentElement.lang = document.documentElement.lang || "en";
  document.title = translate(messages, "appName");
  document.getElementById("app-name").textContent = translate(messages, "appName");
  document.getElementById("subtitle").textContent = translate(messages, "subtitle");
  document.getElementById("username-label").textContent = translate(messages, "usernameLabel");
  document.getElementById("language-label").textContent = translate(messages, "languageLabel");
  document.getElementById("username").placeholder = translate(messages, "usernamePlaceholder");
  document.getElementById("privacy-note").textContent = translate(messages, "privacyNote");
  document.getElementById("report-bug").textContent = translate(messages, "reportBug");
  saveButton.textContent = translate(messages, "save");
}

async function renderLanguageOptions(selectedLocale) {
  const locales = await getSupportedLocales();
  languageSelect.replaceChildren();

  for (const locale of locales) {
    const option = document.createElement("option");
    option.value = locale.code;
    option.textContent = locale.name;
    option.selected = locale.code === selectedLocale;
    languageSelect.appendChild(option);
  }
}

async function initialize() {
  const [{ locale, messages }, { username }] = await Promise.all([
    getMessages(),
    chrome.storage.local.get({ username: "" }),
  ]);

  usernameInput.value = username;
  renderStaticText(messages);
  await renderLanguageOptions(locale);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const usernamePattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

  if (!username) {
    setStatus(translate(currentMessages, "usernameRequired"), "error");
    usernameInput.focus();
    return;
  }

  if (!usernamePattern.test(username)) {
    setStatus(translate(currentMessages, "invalidUsername"), "error");
    usernameInput.focus();
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = translate(currentMessages, "saving");

  try {
    const language = await setSelectedLocale(languageSelect.value);
    const { messages } = await getMessages();

    await chrome.storage.local.set({ username });
    renderStaticText(messages);
    await renderLanguageOptions(language);
    setStatus(`${translate(messages, "saved")} ${translate(messages, "settingsSavedHint")}`, "success");
  } catch (error) {
    console.error("Failed to save settings:", error);
    setStatus(translate(currentMessages, "unknownError"), "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = translate(currentMessages, "save");
  }
});

languageSelect.addEventListener("change", async () => {
  try {
    const language = await setSelectedLocale(languageSelect.value);
    const { messages } = await getMessages();
    renderStaticText(messages);
    await renderLanguageOptions(language);
    setStatus("");
  } catch (error) {
    console.error("Failed to change language:", error);
  }
});

initialize().catch((error) => {
  console.error("Failed to initialize popup:", error);
});
