const { chromium } = require("playwright");

const TARGET_URL =
  "https://www.hunalondon.net/ar/live-tv?live-channel=23464";

(async () => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage();

  const found = new Set();

  page.on("request", (req) => {
    const url = req.url();

    if (url.includes(".m3u8")) {
      console.log("🎯 FOUND M3U8:", url);
      found.add(url);
    }
  });

  console.log("🚀 Opening page...");

  await page.goto(TARGET_URL, {
    waitUntil: "networkidle"
  });

  console.log("⏳ Waiting for stream to load...");

  await page.waitForTimeout(15000);

  console.log("\n===== FINAL RESULTS =====");

  if (found.size === 0) {
    console.log("❌ No m3u8 found");
  } else {
    console.log([...found]);
  }

  await browser.close();
})();
