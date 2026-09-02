(function () {
  const screen = document.getElementById("screen");
  const out = document.getElementById("out");
  const inputline = document.getElementById("inputline");
  const typed = document.getElementById("typed");
  const caret = document.getElementById("caret");
  const input = document.getElementById("cmd");

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
  function bannerSvg(lines) {
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
      'fill="currentColor" role="img" aria-label="Ryan Edquist">' + rects + "</svg>";
  }

  let bannerEl = null;
  let bannerStacked = null;
  function fitBanner() {
    if (!bannerEl) return;
    // One line needs room for 93 columns before the strokes get too thin to read.
    const stacked = screen.clientWidth < 620;
    if (stacked === bannerStacked) return;
    bannerStacked = stacked;
    bannerEl.innerHTML = bannerSvg(stacked ? BANNER_STACKED : BANNER_ONE_LINE);
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
    print("rolling " + n + "d" + sides + " ...", "dim");
    print("  [ " + rolls.join("  ") + " ]   total: " + total, "bright");
    if (n === 1 && rolls[0] === sides) print("  natural " + sides + ". the dice are feeling generous.", "warn");
    if (n === 1 && rolls[0] === 1) print("  a 1. this is why we playtest.", "warn");
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

  function playJingle() {
    if (muted) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      let t = audioCtx.currentTime + 0.03;
      SECRET_JINGLE.forEach(function (note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(note[0], t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note[1]);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + note[1] + 0.02);
        t += note[1];
      });
    } catch (e) { /* no audio device, or autoplay policy said no */ }
  }

  function secretFound() {
    print("♪  secret found" + (muted ? " (muted, type `mute` to hear it)" : ""), "warn");
    playJingle();
  }

  const START = Date.now();
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

  function cat(name) {
    const file = FILES[name] || FILES[name + ".txt"];
    if (!file) return print("cat: " + name + ": no such file (try `ls`)", "err");
    print();
    file.forEach(function (l) { print(l); });
    print();
  }

  const COMMANDS = {
    help: {
      desc: "list every command",
      run: function () {
        print();
        print("available commands", "bright");
        print();
        const names = Object.keys(COMMANDS).filter(function (k) { return !COMMANDS[k].hidden; });
        const width = Math.max.apply(null, names.map(function (k) { return k.length; }));
        names.forEach(function (name) {
          print("  " + name + " ".repeat(width - name.length + 4) + COMMANDS[name].desc);
        });
        print();
        print("tab completes · up/down walks history · ctrl+l clears", "dim");
        print();
      }
    },
    whoami: {
      desc: "the short version",
      run: function () {
        print();
        print("ryan edquist", "bright");
        print("software engineer · loyalty & commerce platforms · board game designer");
        print("aspiring pro disc golfer · gamer");
        print("somewhere with reliable tea and unreliable requirements", "dim");
        print();
      }
    },
    about: { desc: "the longer version", run: function () { cat("about.txt"); } },
    stack: { desc: "what I build with", run: function () { cat("stack.txt"); } },
    now: { desc: "what I am working on", run: function () { cat("now.txt"); } },
    links: {
      desc: "everywhere else I exist",
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
    github: { desc: "-> github.com/redquis", run: function () { openLink("github"); } },
    linkedin: { desc: "-> linkedin.com/in/redquist", run: function () { openLink("linkedin"); } },
    games: { desc: "-> illustriousgamesllc.com", run: function () { openLink("games"); } },
    email: { desc: "-> ryan@edquist.me", run: function () { openLink("email"); } },
    ls: {
      desc: "list files",
      run: function () {
        print();
        Object.keys(FILES).forEach(function (name) {
          print("  " + name + " ".repeat(14 - name.length) + FILES[name].length + " lines");
        });
        print();
        print("read one with: cat about.txt", "dim");
        print();
      }
    },
    cat: {
      desc: "read a file - cat about.txt",
      run: function (args) {
        if (!args[0]) return print("usage: cat <file>   (try `ls`)", "err");
        cat(args[0]);
      }
    },
    videogames: {
      desc: "my top 10 video games",
      run: function () { printList("top 10 video games", VIDEO_GAMES); }
    },
    boardgames: {
      desc: "my top 5 board games",
      run: function () {
        printList("top 5 board games", BOARD_GAMES,
          "and no, none of mine made the list. putting your own games in your own " +
          "top 5 is a bit much, even for me. type `games` and judge for yourself.");
      }
    },
    roll: { desc: "roll dice - roll 2d20", run: function (args) { rollDice(args[0]); } },
    matrix: {
      desc: "cycle the rain: ambient / storm / off",
      run: function () {
        if (!window.rain) return print("rain unavailable.", "err");
        const level = window.rain.cycle();
        print(["rain: off", "rain: ambient", "rain: storm. hold on to something."][level], "warn");
      }
    },
    theme: {
      desc: "phosphor color - theme amber | green",
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
      desc: "system info, obviously",
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
    date: { desc: "what time is it", run: function () { print(new Date().toString()); } },
    echo: { desc: "say it back", run: function (args) { print(args.join(" ")); } },
    history: {
      desc: "commands this session",
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
    clear: { desc: "wipe the screen", run: function () { out.innerHTML = ""; } },
    sudo: {
      desc: "nice try",
      run: function (args) {
        print(args.length ? "ryan is not in the sudoers file." : "usage: sudo <command>", "err");
        if (args.length) print("this incident has been reported.", "dim");
      }
    },
    exit: {
      desc: "leave (you cannot)",
      run: function () {
        print("there is no exit. there is only refresh.", "warn");
        print("but the links at the bottom lead somewhere real.", "dim");
      }
    },
    zelda: {
      hidden: true, desc: "",
      run: function () {
        print("you open the chest.", "bright");
        print("it contains: one (1) personal website.", "dim");
      }
    },
    tea: {
      hidden: true, desc: "",
      run: function () { print("steeping... HTTP 418: this machine IS a teapot.", "warn"); }
    },
    mute: {
      hidden: true, silent: true, desc: "",
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

  /* ---------- input ---------- */

  const history = [];
  let historyIndex = -1;
  let draft = "";
  let busy = true;

  function render() {
    typed.textContent = input.value;
    caret.classList.toggle("off", document.activeElement !== input);
    scroll();
  }

  function echoPrompt(cmd) {
    printHTML('<span class="prompt"><b>ryan@edquist</b>:<em>~</em>$</span> ' + esc(cmd));
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
    try { cmd.run(parts.slice(1)); }
    catch (err) { print("unhandled: " + err.message, "err"); }

    // Every undocumented command is a secret worth announcing.
    if (cmd.hidden && !cmd.silent) secretFound();
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

  input.addEventListener("input", render);
  input.addEventListener("blur", render);
  input.addEventListener("focus", render);

  input.addEventListener("keydown", function (e) {
    if (busy) { e.preventDefault(); return; }

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
  }
  window.addEventListener("resize", relayout, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", relayout, { passive: true });
    window.visualViewport.addEventListener("scroll", fitViewport, { passive: true });
  }

  /* ---------- boot ---------- */

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
      document.fonts.ready.then(function () { fitViewport(); fitBanner(); });
    }
    print();
    print("  software engineer · board game designer · aspiring pro disc golfer · gamer", "dim");
    await wait(400);
    print();
    printHTML('type <span class="k">help</span> to get started, or ' +
      '<span class="k">links</span> if you are in a hurry.', "bright");
    print();

    busy = false;
    inputline.hidden = false;
    input.focus({ preventScroll: true });
    render();
  }

  boot();
})();
