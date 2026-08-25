# Changelog

## [2.1.1] - 2026-08-25

### Fixed
- Fixed follow-status badges not rendering reliably on GitHub profile pages when profile DOM elements are rendered asynchronously.
- Added robust profile username selectors and a fallback profile heading anchor.
- Added a delayed initial check and DOM retry handling for GitHub client-side rendering.
- Exposed `locales.json` to GitHub content scripts so runtime localization loading works reliably.


## 2.1.0

### Added
- Added runtime language selection in the extension popup.
- Added browser-language detection with English fallback.
- Added localized popup text, status messages, follow badges, and API errors.
- Preserved and expanded the existing localization catalog to eight languages.

### Fixed
- Prevented follow checks against the configured user's own profile.
- Made the self-profile check case-insensitive.
- Ignored stale API responses after profile navigation.
- Improved navigation debouncing to avoid unnecessary checks.

## 2.0.0

### Changed
- Removed Personal Access Token configuration.
- Switched follow checks to GitHub's public user-following endpoint.
- Reduced extension permissions.
- Simplified background/content-script communication.
- Added explicit API version headers and structured error states.
- Improved SPA navigation handling.
- Removed remote popup assets and fixed the bug-report link.

### Fixed
- Undefined `reportBugButton` reference in the popup.
- Stale/duplicate badge rendering during navigation.
- Fragile username parsing based on URL segment indexes.
- Duplicate page-load handling caused by two background listeners.
