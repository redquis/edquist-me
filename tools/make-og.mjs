/* Regenerates og.png, the social share card.
 *
 *   npx playwright install chromium   # once
 *   node tools/make-og.mjs
 *
 * The card is rendered from the same block-grid wordmark the site draws, so it
 * stays in sync with the terminal rather than drifting as a hand-made asset.
 */
import { chromium } from "playwright";
import { writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const RYAN = [
  "██████  ██    ██  █████  ███    ██ ",
  "██   ██  ██  ██  ██   ██ ████   ██ ",
  "██████    ████   ███████ ██ ██  ██ ",
  "██   ██    ██    ██   ██ ██  ██ ██ ",
  "██   ██    ██    ██   ██ ██   ████ "
];
const EDQUIST = [
  "███████ ██████   ██████  ██    ██ ██ ███████ ████████ ",
  "██      ██   ██ ██    ██ ██    ██ ██ ██         ██    ",
  "█████   ██   ██ ██    ██ ██    ██ ██ ███████    ██    ",
  "██      ██   ██ ██ ▄▄ ██ ██    ██ ██      ██    ██    ",
  "███████ ██████   ██████   ██████  ██ ███████    ██    ",
  "                    ▀▀                                "
];

const width = Math.max(...EDQUIST.map((l) => l.length));
const pad = " ".repeat(Math.floor((width - RYAN[0].length) / 2));
const GRID = [...RYAN.map((l) => pad + l), "", ...EDQUIST];

function bannerSvg(lines) {
  const cols = Math.max(...lines.map((l) => l.length));
  let rects = "";
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const ch = line.charAt(x);
      if (ch === "█") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      else if (ch === "▄") rects += `<rect x="${x}" y="${y + 0.5}" width="1" height="0.5"/>`;
      else if (ch === "▀") rects += `<rect x="${x}" y="${y}" width="1" height="0.5"/>`;
    }
  });
  return `<svg viewBox="0 0 ${cols} ${lines.length}" width="100%" shape-rendering="crispEdges" fill="currentColor">${rects}</svg>`;
}

const html = `<!doctype html>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: radial-gradient(120% 90% at 50% 0%, #0d130c 0%, #080b08 45%, #050705 100%);
    color: #4af626; font: 400 22px/1.6 "JetBrains Mono", monospace;
    font-variant-ligatures: none;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 78px;
  }
  .scan {
    position: absolute; inset: 0; opacity: .3; mix-blend-mode: multiply;
    background: repeating-linear-gradient(to bottom, rgba(0,0,0,.4) 0 1px, transparent 1px 3px);
  }
  .vig { position: absolute; inset: 0;
    background: radial-gradient(110% 80% at 50% 45%, transparent 40%, rgba(0,0,0,.7) 100%); }
  .dots { position: absolute; top: 34px; left: 78px; display: flex; gap: 10px; }
  .dots i { width: 13px; height: 13px; border-radius: 50%; display: block; }
    .host { position: absolute; top: 30px; left: 158px; color: #6f8a68; font-size: 19px; }
  .mark { color: #b9ffa8; filter: drop-shadow(0 0 14px rgba(74,246,38,.45)); }
  .mark svg { display: block; width: 100%; height: auto; }
  .tag { color: #8fb787; font-size: 21px; margin-top: 34px; letter-spacing: .01em; }
  .prompt { margin-top: 40px; font-size: 25px; color: #2f7d20; }
  .prompt b { color: #4af626; }
  .prompt em { color: #7fe7ff; font-style: normal; }
  .prompt span { color: #b9ffa8; }
  .caret { display: inline-block; width: .6em; height: 1.05em; background: #4af626;
           transform: translateY(.2em); box-shadow: 0 0 8px rgba(74,246,38,.6); }
  .url { position: absolute; bottom: 38px; right: 78px; color: #6f8a68; font-size: 21px; }
  .rel { position: relative; z-index: 2; }
</style>
<div class="dots" style="z-index:3">
  <i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i>
</div>
<div class="host" style="z-index:3">ryan@edquist.me &mdash; /bin/sh</div>

<div class="rel">
  <div class="mark">${bannerSvg(GRID)}</div>
  <div class="tag">software engineer &middot; board game designer &middot; aspiring pro disc golfer &middot; gamer</div>
  <div class="prompt"><b>ryan@edquist</b>:<em>~</em>$ <span>links</span><span class="caret"></span></div>
</div>

<div class="url" style="z-index:3">edquist.me</div>
<div class="vig"></div>
<div class="scan"></div>
`;

const tmp = path.join(ROOT, "tools", "_og.html");
writeFileSync(tmp, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto("file://" + tmp.replace(/\\/g, "/"), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(ROOT, "og.png") });
await browser.close();
unlinkSync(tmp);

console.log("wrote og.png (1200x630)");
