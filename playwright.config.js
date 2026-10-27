// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,   // bez ponovnog pokretanja: nestabilan test treba da se vidi, ne da se sakrije
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    // WebGL u headless Chromiumu ide preko softverskog renderera
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] }
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "npx serve -l 4173 .",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI
  }
});
