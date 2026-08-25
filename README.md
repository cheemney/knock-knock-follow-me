# Knock Knock — Follow Me?

![Knock Knock Follow Me](https://github.com/alicangunduz/knock-knock-follow-me/assets/54004830/b0851250-8e03-437e-847f-c948f29a27f4)

> A lightweight Chrome extension that tells you whether a GitHub profile follows you back.

## Overview

**Knock Knock — Follow Me?** is a Chrome extension that shows whether the GitHub profile you are currently viewing follows your GitHub account.

Instead of manually checking follower lists, simply visit a GitHub profile and the extension displays the follow status directly on the page.

### Key points

* No GitHub Personal Access Token required
* Uses GitHub's public REST API
* Works with GitHub profile pages and client-side navigation
* Handles multiple tabs without relying on shared tab state
* Supports runtime language selection
* Automatically detects your browser language on first launch
* Supports English, Turkish, Spanish, French, Simplified Chinese, Japanese, Korean, and Russian
* Stores your username and language preference locally
* No third-party backend or external service
* Lightweight and dependency-free

## How It Works

The extension uses GitHub's public following endpoint to check the relationship between your account and the profile you are viewing.

The flow is intentionally simple:

```text
GitHub Profile
      │
      ▼
Content Script
      │
      ▼
Extension Service Worker
      │
      ▼
GitHub REST API
      │
      ▼
Follow Status
      │
      ▼
Status Badge
```

The extension does **not** require or store a GitHub access token.

## Installation

The extension can currently be installed as an unpacked Chrome extension.

### 1. Clone the repository

```bash
git clone https://github.com/alicangunduz/knock-knock-follow-me.git
cd knock-knock-follow-me
```

### 2. Open Chrome Extensions

Navigate to:

```text
chrome://extensions
```

Enable **Developer mode**.

### 3. Load the extension

Click **Load unpacked** and select the project directory.

### 4. Configure your username

Open the extension and enter your GitHub username.

That's it. No access token or additional GitHub configuration is required.

## Usage

1. Open the extension popup.
2. Enter your GitHub username.
3. Select your preferred language.
4. Save your settings.
5. Visit a GitHub profile.
6. The extension will display the current follow status.

The extension automatically handles GitHub profile navigation, including client-side navigation between profiles.

## Follow Status

The extension distinguishes between several states:

| Status                   | Meaning                                          |
| ------------------------ | ------------------------------------------------ |
| **Following you**        | The profile follows your GitHub account.         |
| **Not following you**    | The profile does not follow your GitHub account. |
| **This is your profile** | You are viewing your own profile.                |
| **Rate limited**         | GitHub has temporarily limited API requests.     |
| **Network error**        | GitHub could not be reached.                     |
| **API error**            | GitHub returned an unexpected response.          |

## Language Support

The extension supports runtime language selection directly from the popup.

### Supported languages

* 🇬🇧 English
* 🇹🇷 Türkçe
* 🇪🇸 Español
* 🇫🇷 Français
* 🇨🇳 简体中文
* 🇯🇵 日本語
* 🇰🇷 한국어
* 🇷🇺 Русский

On first launch, the extension attempts to detect the browser's language. If the language is not supported, English is used as the fallback.

Once selected, the language preference is stored locally and takes precedence over browser language detection.

## Privacy

Privacy is a core part of the extension's design.

The extension:

* Does not require a GitHub Personal Access Token.
* Does not collect or send data to a third-party server.
* Does not use a custom backend.
* Stores the configured GitHub username locally.
* Stores the selected language locally.
* Sends follow-status requests directly to GitHub's public REST API.

No GitHub credentials are required.

## Permissions

The extension intentionally keeps its permissions minimal.

It uses local storage for user preferences and access to GitHub's API for follow-status checks.

The extension does not request broad browser permissions such as access to all tabs or web navigation events.

## API

Follow relationships are checked using GitHub's public REST API:

```http
GET /users/{username}/following/{target_user}
```

The response is interpreted as follows:

| HTTP Status      | Meaning                                      |
| ---------------- | -------------------------------------------- |
| `204 No Content` | The user follows the target profile.         |
| `404 Not Found`  | The user does not follow the target profile. |

The extension also explicitly handles the current user's own profile without making an unnecessary API request.

## Project Structure

```text
.
├── background.js       # Extension service worker
├── main.js             # GitHub page integration
├── manifest.json       # Chrome extension manifest
├── popup.html          # Extension popup
├── popup.css           # Popup styles
├── popup.js            # Popup behavior and settings
├── locales.json        # Translation strings
├── images/             # Extension icons and assets
├── CHANGELOG.md        # Project changelog
└── README.md
```

## Contributing

Contributions, bug reports, and improvements are welcome.

Before opening a pull request:

1. Create a dedicated branch for your change.
2. Keep the scope of the change focused.
3. Test the extension locally using Chrome's **Load unpacked** option.
4. Make sure existing functionality continues to work.
5. Provide a clear pull request description explaining the change and its motivation.

For bugs, please include:

* Steps to reproduce
* Expected behavior
* Actual behavior
* Browser version
* Relevant screenshots or console errors when applicable

## Known Limitations

The extension currently targets GitHub profile pages and depends on GitHub's public REST API.

GitHub API rate limits may affect how frequently follow-status checks can be performed.

## License

This project is licensed under the **GNU General Public License v3.0**.

See [`LICENSE`](LICENSE) for the full license text.

## Acknowledgements

Built to make checking GitHub follow relationships a little less manual.
