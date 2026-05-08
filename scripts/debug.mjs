import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2000));

// Click through to invitation
const btn1 = await page.evaluateHandle(() => {
  const buttons = [...document.querySelectorAll("button")];
  return buttons.find((b) => b.textContent?.includes("להזמנה המלאה"));
});
await btn1.click();
await new Promise((r) => setTimeout(r, 2200));

const seal = await page.$('button[aria-label="פתח את ההזמנה"]');
await seal.click();
await new Promise((r) => setTimeout(r, 3000));

const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return { error: "no h1" };
  const cs = getComputedStyle(h1);
  return {
    text: h1.textContent,
    color: cs.color,
    bgClip: cs.webkitBackgroundClip || cs.backgroundClip,
    background: cs.backgroundImage,
    fillColor: cs.webkitTextFillColor,
    opacity: cs.opacity,
    classes: h1.className,
    parentOpacity: getComputedStyle(h1.parentElement).opacity,
    transform: getComputedStyle(h1.parentElement).transform,
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
