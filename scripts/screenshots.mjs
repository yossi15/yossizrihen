import puppeteer from "puppeteer";
import { promises as fs } from "fs";

const OUT = "/tmp/shots";
await fs.mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

console.log("Loading page...");
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
// Let entrance animations settle
await new Promise((r) => setTimeout(r, 2500));

console.log("Stage 1: Save the Date");
await page.screenshot({ path: `${OUT}/01-save-the-date.png`, fullPage: false });

// Click "להזמנה המלאה" button
const btn1 = await page.evaluateHandle(() => {
  const buttons = [...document.querySelectorAll("button")];
  return buttons.find((b) => b.textContent?.includes("להזמנה המלאה"));
});
await btn1.click();
await new Promise((r) => setTimeout(r, 2200));

console.log("Stage 2: Envelope with wax seal");
await page.screenshot({ path: `${OUT}/02-envelope.png`, fullPage: false });

// Click the wax seal (button with aria-label פתח את ההזמנה)
const seal = await page.$('button[aria-label="פתח את ההזמנה"]');
await seal.click();
await new Promise((r) => setTimeout(r, 6000));

console.log("Stage 3: Invitation top");
await page.screenshot({ path: `${OUT}/03-invitation-top.png`, fullPage: false });

// Scroll down a bit to capture countdown + buttons
await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/04-invitation-mid.png`, fullPage: false });

// Scroll to RSVP
await page.evaluate(() => window.scrollTo({ top: 1300, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/05-invitation-rsvp.png`, fullPage: false });

await browser.close();
console.log("Done. Saved to", OUT);
