# Morrow

![Tests](https://github.com/vojvodixdev/morrow/actions/workflows/ci.yml/badge.svg)

A one-page site for **Morrow**, a fictional cold-pressed juice brand from the Morava valley in Serbia.

The cans are real-time 3D, built entirely in code with Three.js. There are no ready-made 3D models and no stock photos.

**Live:** https://vojvodixdev.github.io/morrow/

## Features

- **Cover-flow row of 3D cans.** The can in the middle sits under a spotlight. The cans on the sides are smaller, darker and turned toward the center, and every can has a soft reflection in the floor.
- **Intro.** The cans start in the dark. The lights come on one by one from the ends toward the middle while the camera slowly moves in. While the 3D loads, a still image of that first frame is shown, scaled to the same camera framing, so it lines up exactly with the 3D scene when it takes over.
- **Can details.** Clicking the middle can turns it around to show the nutrition table on its back, and a panel opens with taste, nutrition, ingredients and price.
- **Procedural cans.** The can body is a cylinder, and the top and bottom are a profile spun around an axis (`LatheGeometry`). The labels are drawn on a 2D canvas and used as a texture. The middle can has condensation drops (`InstancedMesh`).
- **Harvest calendar.** Shows when each fruit is picked, with a "now" marker and an "in season now" line based on today's date.
- **Bag.** Add cans and bundles, change quantities and see a subtotal. The bag is saved in `localStorage`. Checkout is turned off because it's a demo.
- **Shareable links.** Every flavor has its own URL, for example `#plum` or `#plum-details`, and the site has a link preview image and a favicon.
- **Accessibility.** Full keyboard control (arrow keys and Enter on the cans, Esc to close), `prefers-reduced-motion` support, a pause button for the idle motion, and real HTML for all text.
- **Performance.** 3D rendering stops while the row is off-screen or the bag is open.

## Tech

Plain HTML, CSS and JavaScript (ES modules), with no build step. Three.js 0.169 loads from a CDN through an import map.

```
index.html              content
css/style.css           styles
js/main.js              3D scene, intro, bag, calendar, form
img/                    favicon, link preview, loading image
tests/site.spec.js      Playwright tests
.github/workflows/      runs the tests on every push
```

## Run locally

```
npm install
npm start
```

Then open http://localhost:4173. ES modules need a server, so opening `index.html` straight from disk won't work.

## Tests

Playwright tests run in desktop Chrome and on an emulated Pixel 7. They cover:

- flavor switching with the buttons and the keyboard
- flavor links that open the details
- bag totals
- the saved bag
- the harvest calendar on fixed dates
- form validation

```
npx playwright install chromium
npm test
```

Use `OFFLINE=1 npm test` to load Three.js from `node_modules` instead of the CDN.

Tests are never retried. A test that only passes on a second try is a flaky test, and it should show up as one.

---

Morrow is a fictional brand. Design and code by [Nikola Vojvodić](https://vojvodixdev.github.io/).
