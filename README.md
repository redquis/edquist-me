# edquist.me

Personal site for Ryan Edquist: a fake-but-functional terminal you can actually type into.

Zero build step. Three static files, no framework, no dependencies beyond a webfont.

| File | What it does |
|---|---|
| `index.html` | Markup and metadata |
| `styles.css` | CRT phosphor theme, scanlines, layout |
| `terminal.js` | Command parser, history, tab completion, boot sequence |
| `rain.js` | Canvas matrix rain (`window.rain`) |
| `analytics.js` | Vercel Analytics bootstrap, kept out of the HTML so the CSP needs no `unsafe-inline` |
| `og.png` | Social share card, 1200x630 |

## Commands

`help` lists them all. Highlights: `about`, `stack`, `now`, `ls` / `cat`, `links`,
`github`, `linkedin`, `games`, `videogames`, `boardgames`, `neofetch`, `roll 2d20`,
`matrix`, `theme amber`.

Roughly twenty more are hidden and deliberately absent from `help` and tab
completion. Finding one plays a fanfare; `mute` turns that off. The Konami code
works on the keyboard, not as a typed command.

## Editing the content

The prose lives in objects at the top of `terminal.js`: `LINKS`, `FILES`,
`VIDEO_GAMES`, `BOARD_GAMES`, `FORTUNES`, `THROWS`. Change those; nothing else
needs to move.

## Regenerating the share card

`og.png` is built from the same block-grid wordmark the site draws, so it does not
drift. Re-run it after changing the tagline:

```sh
npx playwright install chromium   # once
node tools/make-og.mjs
```

## Running locally

```sh
npx serve .
```

## Deploying

Pushing to `main` deploys via the Vercel git integration. Manual:

```sh
npx vercel --prod
```
