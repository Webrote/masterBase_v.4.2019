/* global module */

let config = {
  "notGetBlocks": [],
  "ignoredBlocks": [
    "no-js"
  ],
  "alwaysAddBlocks": [
    "block",
    "table",
    "form-validation",
    // "sprite-svg",
    // "sprite-png",
    // "object-fit-polyfill",
  ],
  "addStyleBefore": [
    "src/scss/fw.scss"
  ],
  "addStyleAfter": [
    // "src/scss/print.scss"
  ],
  "addJsBefore": [
    "./utils/polyfills.js",
  ],
  "addJsAfter": [
    "./script.js"
  ],
  "addAssets": {
    "src/fonts/*.{eot,svg,ttf,woff,woff2}": "fonts/",
    "src/img/*.{png,svg,jpg,jpeg}": "img/",
    // "src/favicon/*.{png,ico,svg,xml,webmanifest}": "img/favicon",
  },
  "dir": {
    "src": "src/",
    "build": "build/",
    "blocks": "src/blocks/"
  }
};

module.exports = config;
