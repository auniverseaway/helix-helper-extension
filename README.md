# Helix Helper

A set of helpers for working with Helix content.

[![build](https://github.com/auniverseaway/helix-helper-extension/workflows/Build/badge.svg)](https://github.com/auniverseaway/helix-helper-extension/actions) [![codecov](https://codecov.io/gh/auniverseaway/helix-helper-extension/branch/main/graph/badge.svg?token=FSB0AKTX59)](https://codecov.io/gh/auniverseaway/helix-helper-extension)


## Parts

* **src** - Contains the JS & LESS source files.
* **ui** - Contains the UI and UX source files.
* **web-ext** - Contains:
  * The manifest.json
  * Extension images
  * HTML files (options, popup)
  * The built JS & CSS
* **web-ext-safari** - The Xcode project.
  * Important: this file references `web-ext` for all the actual web-extension files.

## Development
This extension can be developed & run in Chrome, Firefox, and Safari. It is recommended that either Chrome or Firefox is used for active development. Safari requires an Xcode build for every change.

### First build
1. `npm install`
2. `npm run build`

### Watching files
For active development, you can watch options or popup for changes:
* `npm run watch:options`
* `npm run watch:popup`

### Running tests
* `npm run test`

## Running as a developer
### Running in Chrome
1. Open the extension preferences screen - `chrome://extensions`
2. Turn on Developer mode (top right of screen)
3. Select the `Load unpacked` button (top left of screen)
4. Select the `web-ext` folder in this project.

### Running in Firefox
1. `npm run start:firefox`

### Running in Safari
1. Open Safari > Develop menu > "Allow Unsigned Extensions" (you need to do this every restart of Safari)
2. Open the `web-ext-safari` folder in Xcode.
3. Press the play button on the project.
