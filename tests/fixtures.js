// Zajednički "test" za sve testove.
// Sa OFFLINE=1 Three.js se učitava iz node_modules umesto sa CDN-a, a Google fontovi se preskaču,
// pa testovi rade i bez interneta.
const fs = require("fs");
const path = require("path");
const base = require("@playwright/test");

const THREE_DIR = path.join(__dirname, "..", "node_modules", "three");

const test = base.test.extend({
  page: async ({ page }, use) => {
    if (process.env.OFFLINE) {
      await page.route("https://cdn.jsdelivr.net/npm/three@0.169.0/**", route => {
        const file = new URL(route.request().url()).pathname.replace("/npm/three@0.169.0/", "");
        route.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(THREE_DIR, file)) });
      });
      await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.fulfill({ contentType: "text/css", body: "" }));
    }
    await use(page);
  }
});

module.exports = { test, expect: base.expect };
