# edquist.me

Personal site for Ryan Edquist: a fake-but-functional terminal you can actually type into.

Zero build step. Three static files, no framework, no dependencies beyond a webfont.

| File | What it does |
|---|---|
| `index.html` | Markup and metadata |
| `styles.css` | CRT phosphor theme, scanlines, layout |
| `terminal.js` | Command parser, history, tab completion, boot sequence |
| `rain.js` | Canvas matrix rain (`window.rain`) |

## Commands

`help` lists them all. Highlights: `about`, `stack`, `now`, `ls` / `cat`, `links`,
`github`, `linkedin`, `games`, `neofetch`, `roll 2d20`, `matrix`, `theme amber`.
A couple are hidden.

## Editing the content

All the prose lives in two objects at the top of `terminal.js`: `LINKS` and `FILES`.
Change those; nothing else needs to move.

## Running locally

```sh
npx serve .
```

## Deploying

Pushing to `main` deploys via the Vercel git integration. Manual:

```sh
npx vercel --prod
```
