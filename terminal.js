(function () {
  const screen = document.getElementById("screen");
  const out = document.getElementById("out");
  const inputline = document.getElementById("inputline");
  const typed = document.getElementById("typed");
  const caret = document.getElementById("caret");
  const input = document.getElementById("cmd");
  const promptEl = document.getElementById("prompt");
  const rpromptEl = document.getElementById("rprompt");
  const rmatchEl = document.getElementById("rmatch");

  const LINKS = {
    github: ["https://github.com/redquis", "GitHub - code, mostly in public"],
    linkedin: ["https://www.linkedin.com/in/redquist", "LinkedIn - the professional one"],
    games: ["https://illustriousgamesllc.com", "Illustrious Games - board games I design and publish"],
    email: ["mailto:ryan@edquist.me", "ryan@edquist.me"]
  };

  const FILES = {
    "about.txt": [
      "Ryan Edquist. Software engineer.",
      "",
      "I build loyalty and commerce platforms - the unglamorous plumbing behind",
      "membership programs, rebates, and the checkout flows nobody thinks about",
      "until they break. .NET on the backend, AWS underneath, and a lot of SQL",
      "that has seen things.",
      "",
      "Off the clock I design board games, which is the same job with better",
      "components and worse margins."
    ],
    "stack.txt": [
      "  language    C#  ·  TypeScript  ·  SQL  ·  a defensible amount of PowerShell",
      "  runtime     .NET / ASP.NET Core  ·  EF Core  ·  Node",
      "  data        SQL Server  ·  Redis  ·  whatever the legacy system insists on",
      "  cloud       AWS - ECS, Lambda, SNS/SQS, Parameter Store  ·  Terraform",
      "  frontend    React  ·  Razor  ·  vanilla when vanilla is enough",
      "  process     clean architecture, CQRS, and tests that actually fail"
    ],
    "now.txt": [
      "  ·  Migrating a decade-old membership platform onto a modern stack,",
      "     one endpoint at a time, without dropping a single transaction.",
      "  ·  Playtesting the next Illustrious Games title. It is close. It is never close.",
      "  ·  Reading changelogs the way other people read the news."
    ],
    "contact.txt": [
      "  email      ryan@edquist.me",
      "  github     github.com/redquis",
      "  linkedin   linkedin.com/in/redquist",
      "  games      illustriousgamesllc.com"
    ]
  };

  const VIDEO_GAMES = [
    ["Final Fantasy VII", "the one that ruined every other story for me."],
    ["The Legend of Zelda: Majora's Mask", "three days, one moon, and a permanent distrust of deadlines."],
    ["Clair Obscur: Expedition 33", "proof the genre still has new tricks left in it."],
    ["Destiny 2", "I can explain the hours. I cannot justify them."],
    ["Halo: Reach", "you know exactly how it ends and it gets you anyway."],
    ["The Witcher 3", "went to clear one question mark, lost a weekend."],
    ["Kingdom Hearts II", "the plot is nonsense and the combat is perfect. worth it."],
    ["Mass Effect 2", "best cast in gaming. the suicide mission still holds up."],
    ["Resident Evil 4", "the merchant is the real protagonist."],
    ["Gears of War 3", "peak couch co-op. active reload is muscle memory now."]
  ];

  const BOARD_GAMES = [
    ["Terraforming Mars", "engine building until the engine builds itself."],
    ["Risk: Legacy", "we wrote on the board and never went back. still the best campaign I have played."],
    ["Pandemic", "the gateway co-op, and the fastest way to learn how your friends handle stress."],
    ["Unmatched", "tight, asymmetric, and over before anyone gets bored."],
    ["Scythe", "gorgeous, mean, and shorter than it looks."]
  ];

  // Figlet "ANSI Regular", generated rather than hand-drawn. 93 columns.
  const BANNER_ONE_LINE = [
    "██████  ██    ██  █████  ███    ██     ███████ ██████   ██████  ██    ██ ██ ███████ ████████ ",
    "██   ██  ██  ██  ██   ██ ████   ██     ██      ██   ██ ██    ██ ██    ██ ██ ██         ██    ",
    "██████    ████   ███████ ██ ██  ██     █████   ██   ██ ██    ██ ██    ██ ██ ███████    ██    ",
    "██   ██    ██    ██   ██ ██  ██ ██     ██      ██   ██ ██ ▄▄ ██ ██    ██ ██      ██    ██    ",
    "██   ██    ██    ██   ██ ██   ████     ███████ ██████   ██████   ██████  ██ ███████    ██    ",
    "                                                           ▀▀                               "
  ];

  const WAKE_UP = [
    ["Wake up, Neo...", 1300],
    ["The Matrix has you...", 1500],
    ["Follow the white rabbit.", 1500],
    ["Knock, knock, Neo.", 900]
  ];
  const FORTUNES = [
    "there are two hard problems in computer science, and off by one errors.",
    "it worked on my machine, so I am shipping my machine.",
    "the bug was in the last place I looked, because I stopped looking.",
    "every legacy system was once someone's clever idea.",
    "the test suite is green. the test suite is also lying.",
    "naming things is hard. I have named this fortune `fortune`.",
    "a deadline is just a moon that has not fallen yet.",
    "you cannot refactor your way out of a requirements problem.",
    "the disc always finds the one tree in the fairway.",
    "any board game can be a two hour game if you argue about the rules."
  ];

  const THROWS = [
    "dead centre. nobody saw it.",
    "hits the one tree in the fairway. of course.",
    "rolls forty feet past the basket, downhill, into water.",
    "chains out. the disc considered it and declined.",
    "ace. you will describe this throw for the rest of the year.",
    "shanks hard right. blame the wind, it cannot defend itself.",
    "parked. inside the circle, tap in.",
    "lands in the one patch of poison ivy on the course."
  ];

  /* Lid raised clear of the body, so it reads as already open. Kept shallow and
     wide: a taller arc reads as a roof rather than a chest lid. */
  const CHEST = [
    "....################....",
    "..####################..",
    "########################",
    "########################",
    "........................",
    "########################",
    "##....................##",
    "##.......######.......##",
    "##.......#....#.......##",
    "##.......######.......##",
    "##....................##",
    "##....................##",
    "########################"
  ].map(function (row) { return row.replace(/#/g, "█").replace(/\./g, " "); });


  // Only lines she actually says, and each has a clip in audio/navi.
  const NAVI_LINES = ["Hey!", "Listen!", "Hey! Listen!", "Watch out!", "Hello!", "Look!"];

  // A fairy sparkle, synthesised, used when there is no voice clip to play.
  const NAVI_CHIME = [[1318.51, .07], [1760.00, .07], [2093.00, .07], [2637.02, .24]];

  /* Plays /audio/navi/<slug>.mp3 if that file exists, and falls back to the
     sparkle when it does not, so dropping clips in needs no code change.
     "Hey! Listen!" looks for hey-listen.mp3. Nothing is shipped in the repo. */
  let naviHasVoice = null; // null until the first clip is tried
  function naviSound(line) {
    if (muted) return;
    const slug = line.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, "-");
    let done = false;
    function sparkle() {
      if (done) return;
      done = true;
      playNotes(NAVI_CHIME, "sine", 0.13, 0.008);
    }
    // One failed lookup is enough: without clips installed, stop asking.
    if (naviHasVoice === false) return sparkle();
    try {
      const clip = new Audio("/audio/navi/" + slug + ".mp3");
      clip.volume = 0.85;
      clip.addEventListener("error", function () { naviHasVoice = false; sparkle(); });
      clip.addEventListener("playing", function () { naviHasVoice = true; done = true; });
      const started = clip.play();
      if (started && started.catch) started.catch(sparkle);
    } catch (e) {
      naviHasVoice = false;
      sparkle();
    }
  }


  /* Drawn rather than tiled. At this size a block grid could only manage
     "blob"; curves are what make these read as a car and a fairy. */
  const DELOREAN_SVG = [
    '<svg viewBox="0 0 264 132" fill="none" stroke="currentColor" stroke-width="3"',
    ' stroke-linejoin="round" stroke-linecap="round" role="img"',
    ' aria-label="a DeLorean with its gullwing door up">',
    '<path d="M150 55 L112 12 L136 2 L172 42 Z"/>',
    '<path d="M146 48 L122 21 L132 17 L157 44 Z" stroke-width="2" opacity=".55"/>',
    '<path d="M14 100 L18 84 L58 76 L96 74 L118 56 L176 54 L202 70 L238 78 L249 88',
    ' L247 100 L217 100 A17 17 0 0 1 183 100 L89 100 A17 17 0 0 1 55 100 Z"/>',
    '<path d="M120 58 L101 72 L133 71 Z" stroke-width="2"/>',
    '<path d="M140 71 L142 58 L172 57 L175 70 Z" stroke-width="2"/>',
    '<path d="M122 88 L180 86" stroke-width="2" opacity=".45"/>',
    '<circle cx="72" cy="100" r="16"/><circle cx="72" cy="100" r="6" stroke-width="2"/>',
    '<circle cx="200" cy="100" r="16"/><circle cx="200" cy="100" r="6" stroke-width="2"/>',
    "</svg>"
  ].join("");

  const NAVI_SVG = [
    '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.5"',
    ' role="img" aria-label="Navi, a fairy">',
    '<g opacity=".9">',
    '<ellipse cx="28" cy="40" rx="23" ry="11" transform="rotate(-34 28 40)"',
    ' fill="currentColor" fill-opacity=".14"/>',
    '<ellipse cx="92" cy="40" rx="23" ry="11" transform="rotate(34 92 40)"',
    ' fill="currentColor" fill-opacity=".14"/>',
    '</g><g opacity=".6">',
    '<ellipse cx="33" cy="72" rx="15" ry="8" transform="rotate(-16 33 72)"',
    ' fill="currentColor" fill-opacity=".1"/>',
    '<ellipse cx="87" cy="72" rx="15" ry="8" transform="rotate(16 87 72)"',
    ' fill="currentColor" fill-opacity=".1"/>',
    "</g>",
    '<circle cx="60" cy="58" r="21" opacity=".5"/>',
    '<circle cx="60" cy="58" r="13" fill="currentColor" stroke="none"/>',
    '<path d="M60 96 l4 7 -4 7 -4 -7 Z" fill="currentColor" stroke="none" opacity=".7"/>',
    '<path d="M18 96 l3 5 -3 5 -3 -5 Z" fill="currentColor" stroke="none" opacity=".45"/>',
    '<path d="M102 92 l3 5 -3 5 -3 -5 Z" fill="currentColor" stroke="none" opacity=".45"/>',
    "</svg>"
  ].join("");

  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  function circuitDate(d) {
    const hh = d.getHours() % 12 || 12;
    const mm = String(d.getMinutes()).padStart(2, "0");
    return MONTHS[d.getMonth()] + " " + String(d.getDate()).padStart(2, "0") +
      " " + d.getFullYear() + "   " + String(hh).padStart(2, " ") + ":" + mm +
      " " + (d.getHours() < 12 ? "AM" : "PM");
  }

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

  /* Stacked layout for phones. RYAN is centred over EDQUIST on a shared grid so
     both words keep the same cell size: scaling each to full width instead would
     leave RYAN with visibly heavier strokes. */
  const BANNER_STACKED = (function () {
    const width = Math.max.apply(null, EDQUIST.map(function (l) { return l.length; }));
    const pad = " ".repeat(Math.floor((width - RYAN[0].length) / 2));
    return RYAN.map(function (l) { return pad + l; }).concat(["", ""], EDQUIST);
  })();

  /* Drawn as SVG rather than set as text. Block characters do not tile: at small
     sizes the fractional glyph advance and line height leave a lattice of seams
     through every letter, and two words of different column counts render at
     different sizes. One rect per filled cell sidesteps both, and stays crisp at
     any width or pixel ratio. */
  function bannerSvg(lines, label) {
    const cols = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    let rects = "";
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        const ch = line.charAt(x);
        if (ch === "█") rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
        else if (ch === "▄") rects += '<rect x="' + x + '" y="' + (y + 0.5) + '" width="1" height="0.5"/>';
        else if (ch === "▀") rects += '<rect x="' + x + '" y="' + y + '" width="1" height="0.5"/>';
      }
    }
    return '<svg viewBox="0 0 ' + cols + " " + lines.length + '" width="100%" ' +
      'preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges" ' +
      'fill="currentColor" role="img" aria-label="' + esc(label || "") + '">' + rects + "</svg>";
  }

  const ROLES = ["software engineer", "board game designer", "aspiring pro disc golfer", "gamer"];

  /* Packed to fit rather than left to the browser, which broke the list after a
     separator and dropped the indent on the continuation line. */
  let taglineEl = null;
  function fitTagline() {
    if (!taglineEl) return;
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
    probe.textContent = "0".repeat(50);
    out.appendChild(probe);
    const charWidth = probe.getBoundingClientRect().width / 50;
    probe.remove();
    if (!charWidth) return;

    const cols = Math.max(18, Math.floor(screen.clientWidth / charWidth) - 3);
    const lines = [];
    let line = "";
    ROLES.forEach(function (role) {
      const merged = line ? line + " · " + role : role;
      if (!line || merged.length <= cols) line = merged;
      else { lines.push(line); line = role; }
    });
    if (line) lines.push(line);
    taglineEl.textContent = lines.map(function (l) { return "  " + l; }).join("\n");
  }

  let bannerEl = null;
  let bannerStacked = null;
  function fitBanner() {
    if (!bannerEl) return;
    // One line needs room for 93 columns before the strokes get too thin to read.
    const stacked = screen.clientWidth < 620;
    if (stacked === bannerStacked) return;
    bannerStacked = stacked;
    bannerEl.innerHTML = bannerSvg(stacked ? BANNER_STACKED : BANNER_ONE_LINE, "Ryan Edquist");
  }

  /* 100dvh does not shrink when a mobile keyboard opens, so track the visual
     viewport and let the shell size to what is actually on screen. */
  function fitViewport() {
    const vv = window.visualViewport;
    const h = vv ? vv.height : window.innerHeight;
    if (h) document.documentElement.style.setProperty("--app-h", Math.round(h) + "px");
  }

  /* ---------- output ---------- */

  const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);

  function print(text, cls) {
    const el = document.createElement("div");
    el.className = "line" + (cls ? " " + cls : "");
    el.textContent = text === undefined ? "" : text;
    out.appendChild(el);
    scroll();
    return el;
  }

  /* Only ever called with markup this file authors. */
  function printHTML(html, cls) {
    const el = document.createElement("div");
    el.className = "line" + (cls ? " " + cls : "");
    el.innerHTML = html;
    out.appendChild(el);
    scroll();
    return el;
  }

  function scroll() { screen.scrollTop = screen.scrollHeight; }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeLine(text, cls, speed) {
    const el = print("", cls);
    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      el.textContent += chars[i];
      if (i % 2 === 0) await sleep(speed || 8);
    }
    scroll();
    return el;
  }

  function anchor(href, label) {
    const ext = href.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"';
    return '<a href="' + esc(href) + '"' + ext + ">" + esc(label) + "</a>";
  }

  /* ---------- commands ---------- */

  function openLink(key) {
    const href = LINKS[key][0];
    const label = LINKS[key][1];
    const shown = href.replace(/^mailto:/, "");
    printHTML("opening " + anchor(href, shown) + " ...", "dim");
    print(label, "bright");
    if (href.indexOf("mailto:") === 0) {
      window.location.href = href;
      return;
    }
    // Popup blockers allow this: every command runs inside a keypress or a click.
    const win = window.open(href, "_blank", "noopener");
    if (!win) print("your browser blocked that - use the link above.", "warn");
  }

  function rollDice(arg) {
    const m = /^(\d*)d(\d+)$/i.exec((arg || "1d6").trim());
    if (!m) return print("usage: roll [NdM]   e.g. roll 2d20", "err");
    const n = Math.min(parseInt(m[1] || "1", 10) || 1, 20);
    const sides = Math.min(parseInt(m[2], 10), 1000);
    if (sides < 2) return print("a die needs at least two sides.", "err");
    const rolls = [];
    for (let i = 0; i < n; i++) rolls.push(1 + Math.floor(Math.random() * sides));
    const total = rolls.reduce((a, b) => a + b, 0);
    for (let k = 0; k < 9; k++) {
      playNoise(0.06, { type: "bandpass", from: 2800, to: 1400, q: 1.3,
        peak: 0.3, delay: k * 0.075 + Math.random() * 0.025 });
    }
    playNoise(0.26, { type: "lowpass", from: 1200, to: 170, q: 1, peak: 0.32, delay: 0.72 });
    print("rolling " + n + "d" + sides + " ...", "dim");

    const reveal = function () {
      print("  [ " + rolls.join("  ") + " ]   total: " + total, "bright");
      if (n === 1 && rolls[0] === sides) print("  natural " + sides + ". the dice are feeling generous.", "warn");
      if (n === 1 && rolls[0] === 1) print("  a 1. this is why we playtest.", "warn");
      busy = false;
      input.focus({ preventScroll: true });
      render();
    };

    // Land the result as the rattle settles. Muted, there is nothing to wait for.
    if (muted) return reveal();
    busy = true;
    setTimeout(reveal, ROLL_SETTLE);
  }

  /* The secret-found fanfare, synthesised rather than shipped as an audio file:
     eight square-wave notes, no asset and no network request. AudioContext is
     created lazily because browsers only allow it inside a user gesture, and
     every command runs inside a keypress or a click. */
  const SECRET_JINGLE = [
    [783.99, 0.13], [739.99, 0.13], [622.25, 0.13], [440.00, 0.13],
    [415.30, 0.13], [659.25, 0.13], [830.61, 0.13], [1046.50, 0.62]
  ];
  let audioCtx = null;
  let muted = false;
  try { muted = localStorage.getItem("muted") === "1"; } catch (e) { /* private mode */ }

  // Scheduled oscillators, so a new song can cut off one still playing.
  const USAGE = {
    cat: "cat <file>",
    roll: "roll [NdM]",
    theme: "theme <amber|green>",
    echo: "echo <text>",
    ocarina: "ocarina <song>",
    cowsay: "cowsay [text]",
    man: "man <command>",
    git: "git [status|blame|push|log]",
    sudo: "sudo <command>"
  };

  const MANUAL = {
    neo: ["The wake-up call, typed out at the pace it was meant to be read."],
    redpill: ["Takes the red pill. The rain turns to a storm."],
    bluepill: ["Takes the blue pill. The rain stops."],
    spoon: ["There is no spoon."],
    agent: ["Agent Smith, saying your name the way only he does."],
    glitch: ["A cat goes past twice. The screen agrees with you."],
    cat: ["Prints one of the files listed by `ls`."],
    ls: ["Lists the readable files. Pair with `cat`."],
    roll: ["Rolls N dice of M sides. Defaults to 1d6.", "N is capped at 20, M at 1000."],
    theme: ["Switches the phosphor colour. The choice is remembered."],
    matrix: ["Cycles the background rain: ambient, storm, off."],
    ocarina: [
      "Plays the button phrase of a song, then answers with the tune.",
      "Run it bare to list the twelve songs."
    ],
    share: ["Copies a link that opens straight to the last command you ran."],
    reboot: ["Clears the screen and replays the boot sequence."],
    mute: ["Toggles sound. The setting is remembered."],
    history: ["Lists this session's commands. Ctrl+R searches them."],
    help: ["Lists the documented commands. Roughly twenty more are not."],
    "42": ["The answer. The question is still compiling."],
    "88": ["Gets a speedometer to 88 mph, with the appropriate consequences."],
    whoami: ["The one-line version: who I am and what I do."],
    about: ["The longer version. Same text as `cat about.txt`."],
    stack: ["The tools I reach for. Same text as `cat stack.txt`."],
    now: ["What I am working on at the moment, roughly."],
    links: ["Every profile worth having, with the URLs spelled out.", "Each also works as its own command."],
    github: ["Opens my GitHub in a new tab."],
    linkedin: ["Opens my LinkedIn in a new tab."],
    games: ["Opens Illustrious Games, the board game studio."],
    email: ["Starts a mail draft to ryan@edquist.me."],
    videogames: ["Ten favourites in order, each with a line about why."],
    boardgames: ["Five favourites in order. Mine are deliberately absent."],
    neofetch: ["The usual system readout, for a system that is a web page."],
    date: ["The current date and time, as the browser reports it."],
    echo: ["Prints its arguments back. Useful for very little."],
    snake: ["Arrows or WASD to steer, q or Escape to quit, swipe on a phone.", "Your best is remembered. The score to beat is on the board."],
    clear: ["Empties the screen. Ctrl+L does the same."],
    man: ["Prints the manual for a command, hidden ones included."],
    sudo: ["Refuses, in the traditional manner."],
    exit: ["Declines to close the tab for you."],
    zelda: ["Opens a chest, grants the item, and counts down to the", "Ocarina of Time remake on Switch 2."],
    xyzzy: ["The magic word from Colossal Cave. It does about as much here."],
    fortune: ["One aphorism, drawn at random from ten."],
    throw: ["Throws a random disc and reports where it ended up.", "Rarely where it was aimed."],
    discgolf: ["My disc golf standing, honestly reported."],
    top: ["A process table for a machine that is not real."],
    git: ["Accepts status, blame, push and log. Answers are not reassuring."],
    npm: ["Pretends to install a great many packages, then admits it."],
    navi: ["She cycles through her lines, one per invocation, and says them", "aloud. `navisays` is the same command."],
    navisays: ["Alias of `navi`."],
    timecircuits: ["The DeLorean dashboard. Destination and last departed are the", "film's dates. Present time is your own clock."],
    delorean: ["Draws the car with its doors up."],
    gigawatts: ["Doc Brown's reaction to the power requirement."],
    mcfly: ["Biff's greeting, such as it is."],
    outatime: ["The licence plate."],
    roads: ["The last line of the first film."],
    cowsay: ["A cow says whatever you pass it, or `ship it` by default."],
    hack: ["Bypasses nothing at all, loudly."],
    vim: ["Points out that you cannot exit a terminal you are already inside."],
    ":q": ["Same idea as `vim`, fewer keystrokes."],
    pwd: ["Prints a working directory that does not exist."],
    cd: ["There is nowhere to go."],
    ping: ["Replies instantly, having travelled no distance."],
    hello: ["Says hi back."],
    tea: ["HTTP 418. The machine is a teapot."],
    coffee: ["Declines, and recommends tea."],
    rm: ["Refuses to delete anything, on principle."]
  };

  let lastCommand = "";
  let naviIndex = 0;

  /* Deep links: edquist.me/#boardgames opens straight to that command. Only
     known command names are honoured, so a stray fragment does nothing. */
  function runHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, "")).trim();
    if (!raw) return false;
    const name = raw.split(/\s+/)[0].toLowerCase();
    if (!COMMANDS[name]) return false;
    run(raw);
    render();
    return true;
  }
  let scheduled = [];
  function stopAudio() {
    scheduled.forEach(function (osc) { try { osc.stop(); } catch (e) { /* already done */ } });
    scheduled = [];
  }

  /* Creating and resuming an AudioContext takes real time, and browsers only
     allow it inside a gesture. Left until the first sound, that cost lands on
     the first command you run and it arrives late. Warmed on the first key or
     click instead, with a silent tick, which also satisfies iOS. */
  let audioPrimed = false;
  function primeAudio() {
    if (audioPrimed) return;
    audioPrimed = true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.0001;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.02);
    } catch (e) { /* no audio device */ }
  }

  function playNotes(notes, wave, peak, attack, delay) {
    if (muted) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      let t = audioCtx.currentTime + 0.03 + (delay || 0);
      notes.forEach(function (note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = wave || "square";
        osc.frequency.setValueAtTime(note[0], t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(peak || 0.16, t + (attack || 0.012));
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note[1]);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + note[1] + 0.02);
        scheduled.push(osc);
        t += note[1];
      });
    } catch (e) { /* no audio device, or autoplay policy said no */ }
  }

  function playJingle() { playNotes(SECRET_JINGLE, "square", 0.16, 0.012); }

  /* White noise through a sweeping filter: whooshes, rattles and static are
     shaped noise rather than pitch, so oscillators cannot make them. The
     buffer is built once and reused. */
  let noiseBuffer = null;
  function noiseSource(ctx) {
    if (!noiseBuffer) {
      const len = Math.floor(ctx.sampleRate * 1.2);
      noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    return src;
  }

  function playNoise(dur, opts) {
    if (muted) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const o = opts || {};
      const t = audioCtx.currentTime + 0.02 + (o.delay || 0);
      const src = noiseSource(audioCtx);
      const filter = audioCtx.createBiquadFilter();
      filter.type = o.type || "bandpass";
      filter.Q.value = o.q || 1;
      filter.frequency.setValueAtTime(o.from || 1200, t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, o.to || 300), t + dur);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(o.peak || 0.12, t + (o.attack || 0.012));
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter).connect(gain).connect(audioCtx.destination);
      src.start(t);
      src.stop(t + dur + 0.03);
      scheduled.push(src);
    } catch (e) { /* no audio device */ }
  }

  /* The five ocarina buttons and the pitches they map to, so the printed button
     sequence and the audio cannot drift apart. */
  const OCARINA = { "A": 293.66, "C↓": 349.23, "C→": 440.00, "C←": 493.88, "C↑": 587.33 };
  /* One drawn triangle, rotated per direction. The Unicode arrows are not usable
     here: JetBrains Mono lacks them, and the fallback renders the left and right
     glyphs half again as wide as the up and down ones. */
  const BUTTON_FACE = {
    "A": ["a", null], "C↓": ["c", "down"], "C↑": ["c", "up"],
    "C←": ["c", "left"], "C→": ["c", "right"]
  };
  const TRIANGLE = '<svg class="tri" viewBox="0 0 10 10" aria-hidden="true">' +
    '<polygon points="5,1.4 9.3,8.6 0.7,8.6"/></svg>';
  const NOTE = {
    C4: 261.63,
    D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 784.00, A5: 880.00,
    D6: 1174.66
  };

  /* Roughly five seconds of each tune, played back after the prompt the way the
     game answers you. Transcribed by ear, so close rather than exact.

     Invariant: every melody opens with the three notes its buttons play, so the
     reply continues the phrase you just played instead of starting elsewhere. */
  const MELODIES = {
    /* Ocarina melody tab, frets 14 11 9 on the G string, which is our D B A a
       fourth down: main phrase twice, then the variation that drops the D.
       d b a  d b a  d b a b a */
    epona: [["D5", .4], ["B4", .4], ["A4", .85],
      ["D5", .4], ["B4", .4], ["A4", .85],
      ["D5", .4], ["B4", .4], ["A4", .4], ["B4", .4], ["A4", 1.2]],

    /* Decoded from a text guitar tab, so the octaves are unambiguous rather than
       inferred. The letters are b d a  g a b d a  b d a g d c b a, but the third
       phrase is played on the high e string at frets 5 and 3: that a and g are
       an octave above everything before them. Every earlier attempt let the
       phrase descend instead, which flattened the tune's peak. */
    lullaby: [["B4", .6], ["D5", .3], ["A4", .6],
      ["G4", .3], ["A4", .3], ["B4", .6], ["D5", .3], ["A4", .6],
      ["B4", .6], ["D5", .3], ["A5", .6], ["G5", .3],
      ["D5", .6], ["C5", .3], ["B4", .3], ["A4", 1.5]],
    // f a b  f a b  f a b e d  b c b g e  d e g e
    saria: [["F4", .28], ["A4", .28], ["B4", .56], ["F4", .28], ["A4", .28], ["B4", .56],
      ["F4", .28], ["A4", .28], ["B4", .28], ["E5", .28], ["D5", .56],
      ["B4", .28], ["C5", .28], ["B4", .28], ["G4", .28], ["E4", .56],
      ["D4", .28], ["E4", .28], ["G4", .28], ["E4", .9]],

    /* From the text tab: a d f  a d f  a c b g f g a d  c e d. The tail is
       fretted low, D3 C3 E3 D3, so it settles rather than climbing. */
    time: [["A4", .34], ["D4", .34], ["F4", .62], ["A4", .34], ["D4", .34], ["F4", .62],
      ["A4", .34], ["C5", .34], ["B4", .34], ["G4", .34], ["F4", .34], ["G4", .34],
      ["A4", .34], ["D4", .62], ["C4", .34], ["E4", .34], ["D4", 1.1]],

    /* From the text tab. The e f alternation is high, fretted 12 and 13 on the
       top string, but the run after it is low, a d f g on the G and B strings.
       Raising that run to match the alternation was an over-correction. */
    storms: [["D4", .24], ["F4", .24], ["D5", .52], ["D4", .24], ["F4", .24], ["D5", .52],
      ["E5", .24], ["F5", .24], ["E5", .24], ["F5", .24], ["E5", .24],
      ["C5", .28], ["A4", .5],
      ["A4", .24], ["D4", .24], ["F4", .24], ["G4", .24], ["A4", .5],
      ["A4", .24], ["D4", .24], ["F4", .24], ["G4", .24], ["E4", .4], ["D4", 1.1]],

    /* From the text tab: a f d twice, then a slide up the B string from fret 10
       to 20. Two statements and a rising flourish, not the three statements I
       had guessed. */
    sun: [["A4", .42], ["F4", .42], ["D5", .8],
      ["A4", .42], ["F4", .42], ["D5", .8],
      ["A5", .45], ["D6", 1.3]]
  };

  // name, button phrase, and what the song does when it lands.
  const SONGS = {
    lullaby: ["Zelda's Lullaby", ["C←", "C↑", "C→", "C←", "C↑", "C→"], "the royal crest recognizes you."],
    epona: ["Epona's Song", ["C↑", "C←", "C→", "C↑", "C←", "C→"], "Epona comes running."],
    saria: ["Saria's Song", ["C↓", "C→", "C←", "C↓", "C→", "C←"], "the Lost Woods answer back."],
    sun: ["Sun's Song", ["C→", "C↓", "C↑", "C→", "C↓", "C↑"], "night turns to day."],
    time: ["Song of Time", ["C→", "A", "C↓", "C→", "A", "C↓"], "the Door of Time opens."],
    storms: ["Song of Storms", ["A", "C↓", "C↑", "A", "C↓", "C↑"], "the sky opens. rain, everywhere."],
    minuet: ["Minuet of Forest", ["A", "C↑", "C←", "C→", "C←", "C→"], "warping to the Sacred Forest Meadow ..."],
    bolero: ["Bolero of Fire", ["C↓", "A", "C↓", "A", "C→", "C↓", "C→", "C↓"], "warping to Death Mountain Crater ..."],
    serenade: ["Serenade of Water", ["A", "C↓", "C→", "C→", "C←"], "warping to Lake Hylia ..."],
    requiem: ["Requiem of Spirit", ["A", "C↓", "A", "C→", "C↓", "A"], "warping to the Desert Colossus ..."],
    nocturne: ["Nocturne of Shadow", ["C←", "C→", "C→", "A", "C←", "C→", "C↓"], "warping to Kakariko Graveyard ..."],
    prelude: ["Prelude of Light", ["C↑", "C→", "C↑", "C→", "C←", "C↑"], "warping to the Temple of Time ..."]
  };

  const PAUSE_BEFORE_MELODY = 1.1;

  function playSong(key) {
    stopAudio();
    const buttons = SONGS[key][1];
    const notes = buttons.map(function (b, i) {
      return [OCARINA[b], i === buttons.length - 1 ? 0.75 : 0.36];
    });
    // Triangle with a slow attack reads as a wind instrument, not a game bleep.
    playNotes(notes, "triangle", 0.2, 0.06);

    const prompt = notes.reduce(function (sum, n) { return sum + n[1]; }, 0);

    /* Songs with an ocarina transcription get the tune. The rest restate their
       own phrase once, phrased rather than metronomic: these phrases are already
       a motif played twice, so replaying the whole thing meant hearing the same
       three notes four times over. */
    const melody = MELODIES[key]
      ? MELODIES[key].map(function (n) { return [NOTE[n[0]], n[1]]; })
      : buttons.map(function (b, i, all) {
        const last = i === all.length - 1;
        const endOfFirstHalf = all.length % 2 === 0 && i === all.length / 2 - 1;
        return [OCARINA[b], last ? 1.2 : endOfFirstHalf ? 0.8 : 0.34];
      });

    // Scheduled on the audio clock, not a timer, so the gap is exact.
    playNotes(melody, "triangle", 0.17, 0.05, prompt + PAUSE_BEFORE_MELODY);
    return prompt + PAUSE_BEFORE_MELODY;
  }

  const OOT_RELEASE = new Date(2026, 10, 5);
  function ootCountdown() {
    const days = Math.ceil((OOT_RELEASE - Date.now()) / 86400000);
    if (days > 1) return "Ocarina of Time on Switch 2 in " + days + " days. November 5, 2026.";
    if (days === 1) return "Ocarina of Time on Switch 2 lands tomorrow.";
    if (days === 0) return "Ocarina of Time on Switch 2 lands today. go play it.";
    return "Ocarina of Time is out on Switch 2. why are you still in a terminal.";
  }

  /* Watched on raw keydown rather than as a command, so it still works while the
     arrow keys are busy walking command history. */
  const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown",
    "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let konamiPos = 0;

  function watchKonami(key) {
    const k = key.toLowerCase();
    if (k === KONAMI[konamiPos]) konamiPos++;
    else konamiPos = (k === KONAMI[0]) ? 1 : 0;
    if (konamiPos < KONAMI.length) return false;
    konamiPos = 0;
    return true;
  }

  function secretFound() {
    print("♪  secret found" + (muted ? " (muted, type `mute` to hear it)" : ""), "warn");
    playJingle();
  }

  let START = Date.now();
  function uptime() {
    const s = Math.floor((Date.now() - START) / 1000);
    if (s < 60) return s + " seconds on this page";
    const m = Math.floor(s / 60);
    return m + " minute" + (m === 1 ? "" : "s") + ", " + (s % 60) + " seconds";
  }

  /* Ranked lists print title and comment on separate lines so a phone never has
     to wrap a title mid-word. */
  function printList(heading, items, footer) {
    print();
    print(heading, "bright");
    print();
    items.forEach(function (item, i) {
      const n = String(i + 1);
      print("  " + " ".repeat(2 - n.length) + n + ". " + item[0]);
      print(item[1], "dim sub");
    });
    if (footer) {
      print();
      print(footer, "warn");
    }
    print();
  }

  /* Two column rows: the wrapped remainder has to hang under the second column.
     Left to itself it returns to column zero, where it reads as another name. */
  function printRow(label, value, width, cls) {
    const indent = width + 2;
    const el = print("  " + label + " ".repeat(Math.max(1, width - label.length)) + value, cls);
    el.classList.add("row");
    el.style.setProperty("--indent", indent + "ch");
    return el;
  }

  function cat(name) {
    const file = FILES[name] || FILES[name + ".txt"];
    if (!file) return print("cat: " + name + ": no such file (try `ls`)", "err");
    print();
    file.forEach(function (l) { print(l); });
    print();
  }

  const COMMANDS = {
    help: {
      g: "shell", desc: "list the commands",
      run: function () {
        const names = Object.keys(COMMANDS).filter(function (k) { return !COMMANDS[k].hidden; });
        const width = Math.max.apply(null, names.map(function (k) { return k.length; }));
        const SECTIONS = [["me", "about me"], ["fun", "for fun"], ["shell", "the shell"]];
        // Keeps the Zelda set and the Back to the Future set each together.
        const SECTION_ORDER = {
          fun: ["roll", "snake", "cowsay", "fortune", "throw",
            "zelda", "ocarina", "navi", "88", "timecircuits", "delorean",
            "matrix", "neo", "redpill", "bluepill", "glitch"]
        };
        SECTIONS.forEach(function (section) {
          const inSection = names.filter(function (k) { return (COMMANDS[k].g || "shell") === section[0]; });
          if (!inSection.length) return;
          // exit reads as the end of the list wherever it is defined.
          const declared = SECTION_ORDER[section[0]] || [];
          const rank = function (k) {
            const at = declared.indexOf(k);
            return at === -1 ? declared.length : at;
          };
          const ordered = inSection.filter(function (k) { return k !== "exit"; })
            .sort(function (a, b) { return rank(a) - rank(b); })
            .concat(inSection.indexOf("exit") === -1 ? [] : ["exit"]);
          print();
          print(section[1], "bright");
          ordered.forEach(function (name) {
            printRow(name, COMMANDS[name].desc, width + 4);
          });
        });
        print();
        print("tab completes · up/down walks history · ctrl+r searches it · ctrl+l clears", "dim");
        print();
      }
    },
    whoami: {
      g: "me", desc: "the short version",
      run: function () {
        print();
        print("ryan edquist", "bright");
        print("software engineer · loyalty & commerce platforms · board game designer");
        print("aspiring pro disc golfer · gamer");
        print("somewhere with reliable tea and unreliable requirements", "dim");
        print();
      }
    },
    about: { g: "me", desc: "the longer version", run: function () { cat("about.txt"); } },
    stack: { g: "me", desc: "what I build with", run: function () { cat("stack.txt"); } },
    now: { g: "me", desc: "what I am working on", run: function () { cat("now.txt"); } },
    links: {
      g: "me", desc: "everywhere else I exist",
      run: function () {
        print();
        Object.keys(LINKS).forEach(function (key) {
          const href = LINKS[key][0];
          const label = LINKS[key][1];
          const pad = key + " ".repeat(10 - key.length);
          printHTML("  " + esc(pad) + anchor(href, href.replace(/^mailto:/, "")) +
            '  <span class="k">' + esc(label) + "</span>");
        });
        print();
        print("or just type: github · linkedin · games · email", "dim");
        print();
      }
    },
    github: { g: "me", desc: "→ github.com/redquis", run: function () { openLink("github"); } },
    linkedin: { g: "me", desc: "→ linkedin.com/in/redquist", run: function () { openLink("linkedin"); } },
    games: { g: "me", desc: "→ illustriousgamesllc.com", run: function () { openLink("games"); } },
    email: { g: "me", desc: "→ ryan@edquist.me", run: function () { openLink("email"); } },
    ls: {
      g: "shell", desc: "list files",
      run: function () {
        print();
        Object.keys(FILES).forEach(function (name) {
          printRow(name, FILES[name].length + " lines", 14);
        });
        print();
        print("read one with: cat about.txt", "dim");
        print();
      }
    },
    cat: {
      g: "shell", desc: "read a file. try: cat about.txt",
      run: function (args) {
        if (!args[0]) return print("usage: cat <file>   (try `ls`)", "err");
        cat(args[0]);
      }
    },
    videogames: {
      g: "me", desc: "my top 10 video games",
      run: function () { printList("top 10 video games", VIDEO_GAMES); }
    },
    boardgames: {
      g: "me", desc: "my top 5 board games",
      run: function () {
        printList("top 5 board games", BOARD_GAMES,
          "and no, none of mine made the list. putting your own games in your own " +
          "top 5 is a bit much, even for me. type `games` and judge for yourself.");
      }
    },
    roll: { g: "fun", desc: "roll dice, 1d6 by default. try: roll 2d20", run: function (args) { rollDice(args[0]); } },
    matrix: {
      g: "fun", desc: "cycle the rain: ambient / storm / off",
      run: function () {
        if (!window.rain) return print("rain unavailable.", "err");
        const level = window.rain.cycle();
        print(["rain: off", "rain: ambient", "rain: storm. hold on to something."][level], "warn");
      }
    },
    theme: {
      g: "shell", desc: "phosphor color. try: theme amber",
      run: function (args) {
        const want = (args[0] || "").toLowerCase();
        if (want === "amber" || want === "green") {
          document.documentElement.setAttribute("data-theme", want === "amber" ? "amber" : "");
          try { localStorage.setItem("theme", want); } catch (e) { /* private mode */ }
          return print("phosphor: " + want, "warn");
        }
        print("usage: theme amber | green", "err");
      }
    },
    neofetch: {
      g: "shell", desc: "system info, obviously",
      run: function () {
        const art = [
          "   ▄▄▄▄▄▄▄▄▄▄▄▄▄   ",
          "  █             █  ",
          "  █   ███████   █  ",
          "  █   ██        █  ",
          "  █   █████     █  ",
          "  █   ██        █  ",
          "  █   ███████   █  ",
          "  █             █  ",
          "   ▀▀▀▀▀▀▀▀▀▀▀▀▀   "
        ];
        const info = [
          ["", "ryan@edquist.me"],
          ["", "---------------"],
          ["os", "human, 64-bit"],
          ["host", "edquist.me (static, Vercel)"],
          ["shell", "hand-rolled, ~400 lines of JS"],
          ["uptime", uptime()],
          ["editor", "whichever one already has the file open"],
          ["cpu", "tea-limited"],
          ["memory", "leaks, but slowly"],
          ["theme", (document.documentElement.getAttribute("data-theme") || "green") + " phosphor"]
        ];
        print();
        // The two-column layout needs ~52 characters; below that the art and the
        // values wrap into each other, so drop the logo and keep the data.
        const narrow = screen.clientWidth < 460;
        const rows = narrow ? info.length : Math.max(art.length, info.length);
        for (let i = 0; i < rows; i++) {
          const pair = info[i];
          const left = narrow ? "" : (art[i] || " ".repeat(19)) + "  ";
          if (!pair) { print(left); continue; }
          const label = pair[0] ? pair[0] + " ".repeat(9 - pair[0].length) + " " : "";
          print(left + label + pair[1]);
        }
        print();
      }
    },
    date: { g: "shell", desc: "what time is it", run: function () { print(new Date().toString()); } },
    echo: { g: "shell", desc: "say it back", run: function (args) { print(args.join(" ")); } },
    history: {
      g: "shell", desc: "commands this session",
      run: function () {
        if (!history.length) return print("nothing yet.", "dim");
        print();
        history.forEach(function (h, i) {
          const n = String(i + 1);
          print("  " + " ".repeat(Math.max(0, 3 - n.length)) + n + "  " + h);
        });
        print();
      }
    },
    snake: {
      g: "fun", desc: "play snake. arrows or wasd, q quits",
      run: function () {
        print("arrows or wasd to steer, q to quit. swipe works too.", "dim");
        startSnake();
      }
    },
    share: {
      g: "shell", desc: "copy a link to what you just ran",
      run: function () {
        const target = lastCommand || "help";
        const url = location.origin + "/#" + encodeURIComponent(target);
        printHTML("  " + anchor(url, url), "bright");
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          return print("  copy it from above.", "dim");
        }
        navigator.clipboard.writeText(url).then(
          function () { print("  copied. opens straight to `" + target + "`.", "dim"); },
          function () { print("  copy it from above.", "dim"); }
        );
      }
    },
    clear: { g: "shell", desc: "wipe the screen", run: function () { out.innerHTML = ""; } },
    reboot: {
      g: "shell", desc: "restart the terminal",
      run: function () {
        print("shutting down...", "warn");
        // Let the line render before the screen is wiped out from under it.
        setTimeout(reboot, 500);
      }
    },
    man: {
 g: "shell", desc: "read the manual. try: man ocarina",
      run: function (args) {
        const name = (args[0] || "").toLowerCase();
        if (!name) return print("what manual page do you want?", "err");
        const cmd = COMMANDS[name];
        if (!cmd) return print("no manual entry for " + name, "err");
        print();
        print("NAME", "bright");
        print("  " + name + (cmd.desc ? "  -  " + cmd.desc : ""));
        print();
        print("SYNOPSIS", "bright");
        print("  " + (USAGE[name] || name));
        if (MANUAL[name]) {
          print();
          print("DESCRIPTION", "bright");
          MANUAL[name].forEach(function (l) { print("  " + l); });
        }
        if (cmd.hidden) {
          print();
          print("  undocumented. you found it anyway.", "dim");
        }
        print();
      }
    },
    sudo: {
      g: "shell", desc: "nice try",
      run: function (args) {
        print(args.length ? "ryan is not in the sudoers file." : "usage: sudo <command>", "err");
        if (args.length) print("this incident has been reported.", "dim");
      }
    },
    exit: {
      g: "shell", desc: "leave (you cannot)",
      run: function () {
        print("there is no exit. there is only refresh.", "warn");
        print("but the links at the bottom lead somewhere real.", "dim");
      }
    },
    zelda: {
      // Silent so the fanfare lands on the item, not before the chest opens.
 g: "fun", desc: "open the chest",
      run: function () {
        print("you open the chest...", "dim");
        // Drawn, not typed: box characters cannot join across a 1.65 line height,
        // so the verticals rendered as a column of disconnected dashes.
        print("", "chest").innerHTML = bannerSvg(CHEST, "an open treasure chest");
        setTimeout(function () {
          print("it contains: one (1) personal website.", "bright");
          secretFound();
        }, 700);
        setTimeout(function () {
          print();
          print(ootCountdown(), "bright");
          print("try `ocarina` while you wait.", "dim");
        }, 1600);
      }
    },
    ocarina: {
 g: "fun", desc: "play a Zelda song. try: ocarina storms",
      run: function (args) {
        const key = (args[0] || "").toLowerCase();
        if (!SONGS[key]) {
          print();
          print("ocarina <song>", "bright");
          print();
          Object.keys(SONGS).forEach(function (k) {
            printRow(k, SONGS[k][0], 10);
          });
          print();
          if (!key) return print("pick one. try: ocarina storms", "dim");
          return print("never heard that one. " + (muted ? "" : "your ocarina is fine."), "err");
        }
        const song = SONGS[key];
        print();
        print("  " + song[0], "bright");
        printHTML(song[1].map(function (b) {
          const face = BUTTON_FACE[b];
          const inner = face[1] ? TRIANGLE.replace('class="tri"', 'class="tri ' + face[1] + '"') : "A";
          return '<span class="btn ' + face[0] + '" aria-hidden="true">' + inner + "</span>";
        }).join("") + '<span class="sr-only">' + esc(song[1].join(" ")) + "</span>", "notes");
        print();
        const startsAt = playSong(key);
        if (muted) print("(muted, type `mute` to hear it)", "dim");
        // Lands with the reply, so the pause reads as deliberate rather than broken.
        setTimeout(function () { print("  " + song[2], "bright"); }, startsAt * 1000);
      }
    },
    xyzzy: {
      hidden: true, desc: "",
      run: function () { print("nothing happens.", "dim"); }
    },
    fortune: {
      g: "fun", desc: "a hard-won truth, at random",
      run: function () {
        print();
        print("  " + FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
        print();
      }
    },
    throw: {
      g: "fun", desc: "throw a disc, see what happens",
      run: function () {
        const discs = ["a Destroyer", "a Buzzz", "a Leopard3", "a Zone", "a beat-in Roc"];
        playNoise(0.55, { type: "bandpass", from: 2300, to: 230, q: 0.9, peak: 0.34 });
        print("you throw " + discs[Math.floor(Math.random() * discs.length)] + "...", "dim");
        print("  " + THROWS[Math.floor(Math.random() * THROWS.length)], "bright");
      }
    },
    discgolf: {
      g: "me", desc: "my disc golf career, such as it is",
      run: function () {
        print();
        print("  status     aspiring pro. emphasis on aspiring.", "dim");
        print("  putting    a work in progress, permanently", "dim");
        print("  excuse     the wind, the lie, the disc, the trees, never the thrower", "dim");
        print();
        print("try `throw`.", "dim");
      }
    },
    top: {
      hidden: true, desc: "",
      run: function () {
        print();
        print("  PID  COMMAND        CPU    MEM    NOTE", "bright");
        print("    1  dotnet         92%   3.1G   rebuilding. always rebuilding.");
        print("    2  chrome         76%   8.4G   214 tabs, all essential");
        print("    3  side-project    4%   120M   started strong");
        print("    4  sleep           0%     0B   not scheduled");
        print("    5  disc-golf      18%    64M   runs weekends only");
        print();
      }
    },
    git: {
      hidden: true, desc: "",
      run: function (args) {
        const sub = (args[0] || "status").toLowerCase();
        if (sub === "blame") return print("git blame says it was me. it is always me.", "warn");
        if (sub === "push") return print("everything up-to-date. suspiciously up-to-date.", "warn");
        if (sub === "log") return print("one commit: \"fix stuff\". we do not talk about it.", "warn");
        print("nothing to commit, working tree suspiciously clean.", "warn");
      }
    },
    npm: {
      hidden: true, desc: "",
      run: function () {
        print("installing 1,482 packages for a static site...", "dim");
        setTimeout(function () { print("kidding. this page has zero dependencies.", "bright"); }, 600);
      }
    },
    navi: {
 g: "fun", desc: "hey! listen!",
      run: function () {
        const line = NAVI_LINES[naviIndex % NAVI_LINES.length];
        naviIndex++;
        print(" " + "_".repeat(line.length + 2));
        print("< " + line + " >", "bright");
        print(" " + "-".repeat(line.length + 2));
        print("     \\");
        print("", "navi").innerHTML = NAVI_SVG;
        stopAudio();
        naviSound(line);
        if (muted) print("(muted, type `mute` to hear her)", "dim");
      }
    },
    navisays: {
      hidden: true, desc: "",
      run: function () { COMMANDS.navi.run(); }
    },
    timecircuits: {
      g: "fun", desc: "the DeLorean dashboard",
      run: function () {
        print();
        playNotes([[660, 0.09]], "square", 0.07, 0.004);
        playNotes([[784, 0.09]], "square", 0.07, 0.004, 0.18);
        playNotes([[880, 0.13]], "square", 0.07, 0.004, 0.36);
        printHTML('<span class="tc-label tc-dest">DESTINATION TIME</span>');
        printHTML('<span class="tc-dest">  ' + esc(circuitDate(new Date(1985, 9, 26, 1, 21))) + "</span>");
        printHTML('<span class="tc-label tc-now">PRESENT TIME</span>');
        printHTML('<span class="tc-now">  ' + esc(circuitDate(new Date())) + "</span>");
        printHTML('<span class="tc-label tc-last">LAST TIME DEPARTED</span>');
        printHTML('<span class="tc-last">  ' + esc(circuitDate(new Date(1955, 10, 12, 22, 4))) + "</span>");
        print();
      }
    },
    88: {
      g: "fun", desc: "get up to 88 mph",
      run: function () {
        const line = print("", "warn");
        const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const steps = 40;
        let i = 0;

        if (!muted) {
          // A rising whine up to the jump.
          const notes = [];
          for (let n = 0; n < 14; n++) notes.push([180 + n * 62, 0.16]);
          stopAudio();
          playNotes(notes, "sawtooth", 0.07, 0.02);
        }

        const draw = function (mph) {
          const filled = Math.round((mph / 88) * 24);
          line.textContent = "  [" + "=".repeat(filled) + " ".repeat(24 - filled) + "]  " +
            String(Math.round(mph)).padStart(2, " ") + " mph";
        };
        draw(0);

        const timer = setInterval(function () {
          i++;
          draw((i / steps) * 88);
          if (i < steps) return;
          clearInterval(timer);
          line.classList.add("bright");

          // The jump itself. Sound is not motion, so it plays even when the flash
          // is suppressed for reduced motion.
          playNoise(0.55, { type: "lowpass", from: 7000, to: 110, q: 0.8, peak: 0.24 });
          playNotes([[430, 0.07], [110, 0.62]], "sawtooth", 0.14, 0.003);

          if (!skip) {
            const flash = document.createElement("div");
            flash.className = "flash";
            document.body.appendChild(flash);
            setTimeout(function () { flash.remove(); }, 700);
          }
          setTimeout(function () {
            print("roads? where we're going, we don't need roads.", "bright");
            print();
          }, 420);
        }, 58);
      }
    },
    delorean: {
      g: "fun", desc: "doors up",
      run: function () {
        print("", "delorean").innerHTML = DELOREAN_SVG;
        print("  OUTATIME", "dim");
      }
    },
    gigawatts: {
      hidden: true, desc: "",
      run: function () {
        playNoise(0.18, { type: "highpass", from: 3200, to: 600, q: 0.8, peak: 0.13 });
        playNotes([[1200, 0.06], [300, 0.5]], "sawtooth", 0.08, 0.004, 0.05);
        print("1.21 gigawatts?! Great Scott!", "warn");
        print("the only power source capable of generating that is a bolt of lightning.", "dim");
      }
    },
    mcfly: {
      hidden: true, desc: "",
      run: function () { print("Hello? Hello? Anybody home? Think, McFly, think!", "warn"); }
    },
    outatime: {
      hidden: true, desc: "",
      run: function () { print("the plate reads OUTATIME. try `delorean`.", "dim"); }
    },
    roads: {
      hidden: true, desc: "",
      run: function () { print("where we're going, we don't need roads.", "bright"); }
    },
    neo: {
      g: "fun", desc: "wake up",
      run: function () {
        const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        busy = true;
        let i = 0;
        const next = function () {
          if (i >= WAKE_UP.length) {
            busy = false;
            print();
            input.focus({ preventScroll: true });
            render();
            return;
          }
          const line = WAKE_UP[i++];
          if (skip) { print(line[0], "bright"); return next(); }
          typeLine(line[0], "bright", 45).then(function () {
            setTimeout(next, line[1]);
          });
        };
        next();
      }
    },
    redpill: {
      g: "fun", desc: "stay in wonderland",
      run: function () {
        print("you stay in Wonderland, and I show you how deep the rabbit hole goes.", "bright");
        if (window.rain) window.rain.set(2);
        print("  the rain is heavier now. `matrix` cycles it.", "dim");
      }
    },
    bluepill: {
      g: "fun", desc: "wake up in your bed",
      run: function () {
        print("the story ends. you wake up in your bed and believe whatever you want to believe.", "bright");
        if (window.rain) window.rain.set(0);
        print("  the rain has stopped. `matrix` brings it back.", "dim");
      }
    },
    spoon: {
      hidden: true, desc: "",
      run: function () {
        print("do not try and bend the spoon, that is impossible.", "dim");
        print("instead, only try to realise the truth: there is no spoon.", "bright");
      }
    },
    agent: {
      hidden: true, desc: "",
      run: function () {
        print("Mr. Anderson.", "warn");
        print("that is the sound of inevitability.", "dim");
      }
    },
    glitch: {
      g: "fun", desc: "deja vu",
      run: function () {
        print("a black cat went past us, and then another that looked just like it.", "dim");
        print("déjà vu.", "bright");
        const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (skip) return;
        const shell = document.getElementById("shell");
        if (!shell) return;
        playNoise(0.14, { type: "highpass", from: 900, to: 3200, q: 0.7, peak: 0.09 });
        playNoise(0.1, { type: "highpass", from: 2400, to: 700, q: 0.7, peak: 0.07, delay: 0.22 });
        shell.classList.add("glitching");
        setTimeout(function () { shell.classList.remove("glitching"); }, 700);
      }
    },
    cowsay: {
      g: "fun", desc: "a cow says what you tell it",
      run: function (args) {
        const msg = args.length ? args.join(" ") : "ship it";
        print(" " + "_".repeat(msg.length + 2));
        print("< " + msg + " >");
        print(" " + "-".repeat(msg.length + 2));
        print("        \\   ^__^");
        print("         \\  (oo)\\_______");
        print("            (__)\\       )\\/\\");
        print("                ||----w |");
        print("                ||     ||");
      }
    },
    hack: {
      // Silent so the fanfare lands after the sequence rather than before it.
      hidden: true, desc: "",
      run: function () {
        const beats = [
          [0, "searching for the Gibson...", "dim"],
          [500, "RISC architecture is gonna change everything.", "dim"],
          [1050, "ACCESS GRANTED", "bright"],
          [1400, "HACK THE PLANET!", "warn"],
          [1900, "you now have full control of a static HTML page. use it wisely.", "dim"],
          [2200, "mess with the best, die like the rest.", "dim"]
        ];
        // Timed to the ACCESS GRANTED beat.
        playNotes([[180, 0.12], [420, 0.24]], "square", 0.1, 0.008, 1.05);
        beats.forEach(function (beat) {
          setTimeout(function () { print(beat[1], beat[2]); }, beat[0]);
        });
        // A burst, not a new resting state: storm is hard to read through.
        if (window.rain) {
          const before = window.rain.level;
          setTimeout(function () { window.rain.set(2); }, 1050);
          setTimeout(function () { window.rain.set(before); }, 7050);
        }
      }
    },
    "42": {
      hidden: true, desc: "",
      run: function () { print("42. the question is still compiling.", "warn"); }
    },
    vim: {
      hidden: true, desc: "",
      run: function () { print("you are already in a terminal you cannot exit. see `exit`.", "err"); }
    },
    ":q": {
      hidden: true, desc: "",
      run: function () { print("this is a browser. the tab close button is over there.", "err"); }
    },
    pwd: { hidden: true, desc: "", run: function () { print("/home/ryan"); } },
    cd: { hidden: true, desc: "", run: function () { print("there is nowhere else to go.", "dim"); } },
    ping: { hidden: true, desc: "", run: function () { print("pong. 0.0ms. it is all running in your browser."); } },
    hello: { hidden: true, desc: "", run: function () { print("hi."); } },
    tea: {
      hidden: true, desc: "",
      run: function () { print("steeping... HTTP 418: this machine IS a teapot.", "warn"); }
    },
    mute: {
 g: "shell", desc: "toggle sound",
      run: function () {
        muted = !muted;
        try { localStorage.setItem("muted", muted ? "1" : "0"); } catch (e) { /* private mode */ }
        print(muted ? "sound off." : "sound on.", "warn");
        if (!muted) playJingle();
      }
    },
    coffee: {
      hidden: true, desc: "",
      run: function () { print("we don't do that here. try `tea`.", "err"); }
    },
    rm: {
      hidden: true, desc: "",
      run: function (args) {
        if (args.join(" ").indexOf("-rf") !== -1) {
          print("deleting everything...", "err");
          setTimeout(function () { print("kidding. it is a static site. try `clear`.", "dim"); }, 700);
        } else {
          print("rm: refusing to remove anything, on principle.", "err");
        }
      }
    }
  };

  /* ---------- snake ---------- */

  /* Drawn as SVG on a square grid. Text cells cannot be square, a glyph being
     about 0.6 as wide as the line is tall, so on a character board a step up
     covered nearly twice the ground of a step across. Timing could match the
     speed but not the stride: a 17px hop still read as faster than a 9px one. */
  const ROLL_SETTLE = 980;
  const SNAKE_TICK = 115;
  const SNAKE_TOP = { who: "Ryan", score: 103 };
  const SNAKE_COLS = 26;
  const SNAKE_ROWS = 17;
  let snake = null;

  function snakeHighScore(next) {
    try {
      if (next === undefined) return parseInt(localStorage.getItem("snakeHigh") || "0", 10);
      localStorage.setItem("snakeHigh", String(next));
    } catch (e) { /* private mode */ }
    return next || 0;
  }

  function snakeDraw() {
    const g = snake;
    let cells = "";
    g.body.forEach(function (c, i) {
      const inset = i === 0 ? 0.04 : 0.16;
      const size = 1 - inset * 2;
      cells += '<rect x="' + (c.x + inset).toFixed(2) + '" y="' + (c.y + inset).toFixed(2) +
        '" width="' + size.toFixed(2) + '" height="' + size.toFixed(2) + '" rx="0.18"' +
        (i === 0 ? "" : ' opacity=".72"') + "/>";
    });
    cells += '<rect x="' + (g.food.x + 0.26) + '" y="' + (g.food.y + 0.26) +
      '" width="0.48" height="0.48" rx="0.24" class="food"/>';

    g.el.innerHTML = '<svg viewBox="-0.2 -0.2 ' + (g.cols + 0.4) + " " + (g.rows + 0.4) +
      '" role="img" aria-label="snake board">' +
      '<rect x="-0.1" y="-0.1" width="' + (g.cols + 0.2) + '" height="' + (g.rows + 0.2) +
      '" fill="none" stroke="currentColor" stroke-width="0.12" opacity=".55"/>' +
      '<g fill="currentColor">' + cells + "</g></svg>";

    g.statusEl.textContent = "  score " + g.score + "  best " + g.best +
      "  top " + SNAKE_TOP.who + " " + SNAKE_TOP.score + "  q quits";
  }

  function snakeFood() {
    const g = snake;
    let spot;
    do {
      spot = { x: Math.floor(Math.random() * g.cols), y: Math.floor(Math.random() * g.rows) };
    } while (g.body.some(function (c) { return c.x === spot.x && c.y === spot.y; }));
    g.food = spot;
  }

  function snakeStep() {
    const g = snake;
    if (!g) return;
    g.dir = g.next;
    const head = { x: g.body[0].x + g.dir.x, y: g.body[0].y + g.dir.y };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= g.cols || head.y >= g.rows;
    const hitSelf = g.body.some(function (c) { return c.x === head.x && c.y === head.y; });
    if (hitWall || hitSelf) return snakeEnd();

    g.body.unshift(head);
    if (head.x === g.food.x && head.y === g.food.y) {
      g.score++;
      // Rises as the snake grows, so a long run sounds like one.
      playNotes([[520 + Math.min(g.score, 24) * 16, 0.07]], "square", 0.09, 0.004);
      if (g.score > g.best) { g.best = g.score; snakeHighScore(g.best); }
      snakeFood();
    } else {
      g.body.pop();
    }
    snakeDraw();
  }

  function snakeEnd() {
    const g = snake;
    clearInterval(g.timer);
    playNotes([[392, 0.12], [330, 0.12], [262, 0.34]], "triangle", 0.12, 0.01);
    snake = null;
    busy = false;
    print("game over. score " + g.score + ", best " + g.best + ".", g.score >= g.best ? "bright" : "warn");
    if (g.score > SNAKE_TOP.score) {
      print("you beat " + SNAKE_TOP.who + "'s " + SNAKE_TOP.score + ". that is going to bother him.", "bright");
    } else {
      print(SNAKE_TOP.who + " still holds it at " + SNAKE_TOP.score + ".", "dim");
    }
    print();
    input.focus({ preventScroll: true });
    render();
  }

  const SNAKE_DIRS = {
    ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
  };

  function snakeTurn(dir) {
    if (!snake || !dir) return;
    // No reversing straight into your own neck.
    if (dir.x === -snake.dir.x && dir.y === -snake.dir.y) return;
    snake.next = dir;
  }

  function startSnake() {
    const el = print("", "snake");
    const statusEl = print("", "dim row");
    // Any wrap hangs under the first column rather than back at the margin.
    statusEl.style.setProperty("--indent", "2ch");
    snake = {
      cols: SNAKE_COLS, rows: SNAKE_ROWS, el: el, statusEl: statusEl,
      score: 0, best: snakeHighScore(),
      dir: { x: 1, y: 0 }, next: { x: 1, y: 0 },
      body: [{ x: Math.floor(SNAKE_COLS / 2), y: Math.floor(SNAKE_ROWS / 2) }]
    };
    snakeFood();
    snakeDraw();
    busy = true;
    snake.timer = setInterval(snakeStep, SNAKE_TICK);

    // Swipes, so it is playable without a keyboard.
    let sx = 0, sy = 0;
    el.addEventListener("touchstart", function (ev) {
      sx = ev.touches[0].clientX; sy = ev.touches[0].clientY;
    }, { passive: true });
    el.addEventListener("touchend", function (ev) {
      const dx = ev.changedTouches[0].clientX - sx;
      const dy = ev.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      snakeTurn(Math.abs(dx) > Math.abs(dy)
        ? { x: dx > 0 ? 1 : -1, y: 0 }
        : { x: 0, y: dy > 0 ? 1 : -1 });
    }, { passive: true });
  }


  /* ---------- input ---------- */

  const history = [];
  let historyIndex = -1;
  let searching = false;
  let searchFrom = 0;
  let draft = "";
  let busy = true;

  function searchMatch() {
    const q = input.value.toLowerCase();
    if (!q) return "";
    for (let i = history.length - 1 - searchFrom; i >= 0; i--) {
      if (history[i].toLowerCase().indexOf(q) !== -1) return history[i];
    }
    return "";
  }

  function render() {
    typed.textContent = input.value;
    caret.classList.toggle("off", document.activeElement !== input);
    promptEl.hidden = searching;
    rpromptEl.hidden = !searching;
    if (searching) {
      rpromptEl.textContent = "(reverse-i-search)`";
      const hit = searchMatch();
      rmatchEl.textContent = "`: " + hit;
      rmatchEl.classList.toggle("miss", !hit && input.value !== "");
    } else {
      rmatchEl.textContent = "";
      rmatchEl.classList.remove("miss");
    }
    scroll();
  }

  function endSearch(accept) {
    if (!searching) return;
    const hit = accept ? searchMatch() : "";
    searching = false;
    searchFrom = 0;
    input.value = hit || (accept ? input.value : draft);
    render();
  }

  function echoPrompt(cmd) {
    printHTML('<span class="prompt"><b>ryan@edquist</b>:<em>~</em>$</span> ' +
      '<span class="cmd">' + esc(cmd) + "</span>");
  }

  function run(raw) {
    const line = raw.trim();
    echoPrompt(line);
    if (!line) return;
    history.push(line);
    historyIndex = -1;

    const parts = line.split(/\s+/);
    const name = parts[0].toLowerCase();
    const cmd = COMMANDS[name];
    if (!cmd) {
      print(name + ": command not found. type `help`.", "err");
      const near = Object.keys(COMMANDS).filter(function (k) {
        return !COMMANDS[k].hidden && k.charAt(0) === name.charAt(0);
      })[0];
      if (near) print("did you mean `" + near + "`?", "dim");
      return;
    }
    // `share` links to what you were looking at, so it must not record itself.
    if (name !== "share") lastCommand = line;
    try { cmd.run(parts.slice(1)); }
    catch (err) { print("unhandled: " + err.message, "err"); }
  }

  function complete() {
    const value = input.value;
    const parts = value.split(/\s+/);
    const pool = parts.length > 1 && parts[0].toLowerCase() === "cat"
      ? Object.keys(FILES)
      : Object.keys(COMMANDS).filter(function (k) { return !COMMANDS[k].hidden; });
    const frag = parts[parts.length - 1].toLowerCase();
    const hits = pool.filter(function (k) { return k.indexOf(frag) === 0; });
    if (!hits.length) return;
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      input.value = parts.join(" ") + " ";
      return render();
    }
    echoPrompt(value);
    print("  " + hits.join("   "), "dim");
    render();
  }

  /* The whole terminal is lowercase, so the prompt is too. Folded on the way
     in rather than with text-transform, so what is shown is what runs. The
     caret is put back because assigning value sends it to the end, which
     loses your place when editing mid-line. */
  input.addEventListener("input", function () {
    const folded = input.value.toLowerCase();
    if (folded !== input.value) {
      const from = input.selectionStart;
      const to = input.selectionEnd;
      input.value = folded;
      try { input.setSelectionRange(from, to); } catch (e) { /* not selectable */ }
    }
    render();
  });
  input.addEventListener("blur", render);
  input.addEventListener("focus", render);

  input.addEventListener("keydown", function (e) {
    primeAudio();
    if (snake) {
      e.preventDefault();
      if (e.key === "q" || e.key === "Escape") return snakeEnd();
      return snakeTurn(SNAKE_DIRS[e.key] || SNAKE_DIRS[e.key.toLowerCase()]);
    }
    if (busy) { e.preventDefault(); return; }

    if (watchKonami(e.key)) {
      e.preventDefault();
      input.value = "";
      print("↑ ↑ ↓ ↓ ← → ← → B A", "bright");
      print("30 lives granted. you still only get the one tab.", "dim");
      render();
      return;
    }

    if ((e.key === "r" || e.key === "R") && e.ctrlKey) {
      e.preventDefault();
      if (!searching) {
        draft = input.value;
        searching = true;
        searchFrom = 0;
        input.value = "";
      } else {
        // Already searching: step past the current hit to the next older one.
        const at = history.lastIndexOf(searchMatch());
        if (at > 0) searchFrom = history.length - at;
      }
      return render();
    }

    if (searching && (e.key === "Escape" || (e.key === "g" && e.ctrlKey))) {
      e.preventDefault();
      return endSearch(false);
    }

    if (searching && e.key === "Enter") {
      e.preventDefault();
      return endSearch(true);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.value;
      input.value = "";
      run(value);
      render();
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      if (historyIndex === -1) { draft = input.value; historyIndex = history.length; }
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
      render();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      historyIndex++;
      if (historyIndex >= history.length) { historyIndex = -1; input.value = draft; }
      else input.value = history[historyIndex];
      render();
    } else if ((e.key === "l" || e.key === "L") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      out.innerHTML = "";
    } else if ((e.key === "c" || e.key === "C") && e.ctrlKey) {
      e.preventDefault();
      echoPrompt(input.value + "^C");
      input.value = "";
      render();
    }
  });

  // Tapping the screen focuses the invisible input so mobile keyboards open.
  document.addEventListener("click", function (e) {
    primeAudio();
    if (e.target.closest("a, button")) return;
    if (window.getSelection && String(window.getSelection())) return;
    input.focus({ preventScroll: true });
  });

  const chipButtons = document.querySelectorAll(".chips [data-cmd]");
  for (let i = 0; i < chipButtons.length; i++) {
    chipButtons[i].addEventListener("click", function (e) {
      if (busy) return;
      input.focus({ preventScroll: true });
      run(e.currentTarget.getAttribute("data-cmd"));
      input.value = "";
      render();
    });
  }

  function relayout() {
    fitViewport();
    fitBanner();
    fitTagline();
  }
  window.addEventListener("resize", relayout, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", relayout, { passive: true });
    window.visualViewport.addEventListener("scroll", fitViewport, { passive: true });
  }

  /* ---------- boot ---------- */

  /* Everything boot() touches has to be reset here, or a reboot comes back with
     an empty banner (fitBanner short-circuits on an unchanged layout) and an
     uptime counted from the original page load. */
  function reboot() {
    out.innerHTML = "";
    input.value = "";
    inputline.hidden = true;
    busy = true;
    bannerEl = null;
    bannerStacked = null;
    taglineEl = null;
    START = Date.now();
    boot();
  }

  async function boot() {
    try {
      if (localStorage.getItem("theme") === "amber") {
        document.documentElement.setAttribute("data-theme", "amber");
      }
    } catch (e) { /* private mode */ }

    fitViewport();

    const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = function (ms) { return skip ? Promise.resolve() : sleep(ms); };

    const bootLines = [
      ["edquist.me boot sequence - rev 1.0", "dim"],
      ["checking memory ................ ok", "dim"],
      ["mounting /home/ryan ............ ok", "dim"],
      ["loading personality module ..... ok", "dim"],
      ["locating car keys .............. FAILED", "warn"]
    ];
    for (const pair of bootLines) {
      if (skip) print(pair[0], pair[1]); else await typeLine(pair[0], pair[1], 4);
      await wait(90);
    }
    await wait(320);
    print();

    bannerEl = print("", "banner");
    fitBanner();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fitViewport(); fitBanner(); fitTagline(); });
    }
    print();
    taglineEl = print("", "dim");
    fitTagline();
    await wait(400);
    print();
    printHTML('type <span class="k">help</span> to get started, or ' +
      '<span class="k">links</span> if you are in a hurry.', "bright");
    print();

    busy = false;
    inputline.hidden = false;
    input.focus({ preventScroll: true });
    render();
    runHash();
  }

  window.addEventListener("hashchange", function () { if (!busy) runHash(); });

  boot();
})();
