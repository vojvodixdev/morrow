const { test, expect } = require("./fixtures");

test("page loads without errors and shows the first flavor", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page).toHaveTitle(/Morrow/);
  await expect(page.locator("#name")).toHaveText("Sour Cherry");
  await expect(page.locator("#prev")).toBeDisabled();
  await expect(page.locator("#flavors")).toHaveClass(/ready/);   // 3D scena je nacrtana
  expect(errors).toEqual([]);
});

test("arrows and keyboard change the flavor", async ({ page }) => {
  await page.goto("/");
  await page.locator("#next").click();
  await expect(page.locator("#name")).toHaveText("Apricot");
  await expect(page.locator("#count")).toContainText("02 / 05");

  await page.locator("#cans").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#name")).toHaveText("Plum");
  await expect(page).toHaveURL(/#plum$/);
});

test("a flavor link opens its details, and Escape closes them", async ({ page }) => {
  await page.goto("/#quince-details");
  await expect(page.locator("#detail")).toBeVisible();
  await expect(page.locator("#d-name")).toHaveText("Quince");
  await expect(page.locator("#d-price")).toHaveText("€2.80");

  await page.keyboard.press("Escape");
  await expect(page.locator("#detail")).toBeHidden();
  await expect(page).toHaveURL(/#quince$/);
});

test("the bag adds items, changes amounts and adds up the total", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-add="six"]').click();
  await page.locator('[data-add="crate"]').click();
  await expect(page.locator("#bag-count")).toHaveText("2");

  await page.locator("#bag-open").click();
  await expect(page.locator("#bag-total")).toHaveText("€62.50");

  await page.getByRole("button", { name: "Add one Mixed six-pack" }).click();
  await expect(page.locator("#bag-total")).toHaveText("€76.00");

  await page.getByRole("button", { name: "Remove one Harvest crate" }).click();
  await expect(page.locator("#bag-total")).toHaveText("€27.00");
  await expect(page.locator("#bag-count")).toHaveText("2");
});

test("the bag is remembered after a reload", async ({ page }) => {
  await page.goto("/#apricot-details");
  await page.locator("#d-add").click();
  await expect(page.locator("#toast")).toHaveText("Apricot added to your bag");

  await page.reload();
  await expect(page.locator("#bag-count")).toHaveText("1");
});

test("the harvest calendar follows today's date", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-06-15T10:00:00"));
  await page.goto("/");
  await expect(page.locator("#in-season")).toHaveText("In season now: sour cherry.");
});

test("the calendar says what comes next when nothing is in season", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-12-10T10:00:00"));
  await page.goto("/");
  await expect(page.locator("#in-season")).toHaveText("Nothing is in season right now. Next up: sour cherry in June.");
});

test("the newsletter form checks the email address", async ({ page }) => {
  await page.goto("/");
  const email = page.locator("#email");
  await email.fill("not-an-email");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.locator("#form-msg")).toHaveText("Please enter a valid email address.");

  await email.fill("nikola@example.com");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.locator("#form-msg")).toContainText("Thanks!");
  await expect(email).toHaveValue("");
});
