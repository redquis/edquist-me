# Navi voice clips

`navi` plays the clip matching the line it prints, and falls back to a
synthesised sparkle if a file is missing, so the command still works when one
is absent.

Naming: lowercase the line, drop punctuation, hyphenate spaces.

| Line | File |
|---|---|
| Hey! | `hey.mp3` |
| Listen! | `listen.mp3` |
| Hey! Listen! | `hey-listen.mp3` |
| Watch out! | `watch-out.mp3` |
| Hello! | `hello.mp3` |
| Look! | `look.mp3` |

Adding a line means adding it to `NAVI_LINES` in `terminal.js` and dropping the
matching file here.

These are served publicly from edquist.me, so they want to be audio you have
the right to distribute.
