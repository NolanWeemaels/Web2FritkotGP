const API_BASE = import.meta.env.VITE_API_BASE || "https://web2-course-project-back-end-bh78.onrender.com";

const ASSET_BASE = import.meta.env.BASE_URL || "/";
const asset = (p) => `${ASSET_BASE}${String(p).replace(/^\/+/, "")}`;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function formatMs(ms) {
  const total = Math.max(0, Number(ms || 0));
  const s = Math.floor(total / 1000);
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  const msPart = String(total % 1000).padStart(3, "0");
  return `${m}:${sec}.${msPart}`;
}

function getToken() {
  return localStorage.getItem("fgp_token");
}
function setToken(token) {
  localStorage.setItem("fgp_token", token);
}
function clearToken() {
  localStorage.removeItem("fgp_token");
  localStorage.removeItem("fgp_user");
}
function setUser(user) {
  localStorage.setItem("fgp_user", JSON.stringify(user));
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("fgp_user") || "null");
  } catch {
    return null;
  }
}

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const token = getToken();
  if (opts.auth === true && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function applyGlobalHeader() {
  const user = getUser();
  const token = getToken();

  const badge = document.getElementById("authBadge");
  const logoutBtn = document.getElementById("logoutBtn");
  const badgeTextEl = badge ? (badge.querySelector("span") || badge) : null;

  if (badgeTextEl) {
    if (token && user) {
      badgeTextEl.textContent = `Logged in as ${user.username || user.email || "player"}`;
    } else {
      badgeTextEl.textContent = "Not logged in";
    }
  }

  if (logoutBtn) {
    logoutBtn.style.display = token ? "inline-flex" : "none";
    if (!logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = "1";
      logoutBtn.addEventListener("click", () => {
        clearToken();
        window.location.href = "./auth.html";
      });
    }
  }
}
function spriteFallbacks() {
  $$("img[data-sprite]").forEach((img) => {
    img.addEventListener("error", () => {
      // probeer fallback als die bestaat
      const fb = img.dataset.fallback;
      if (fb && img.src !== fb) {
        img.src = fb;
        img.alt = "";
        return;
      }
      img.alt = "";
      img.style.display = "none";
    });
  });
}

function initHomePage() {
  
  const wrap = document.getElementById("roadCars");
  if (!wrap) return;
  const carFiles = [
    "mclaren-car.png",
    "mercedes-car.png",
    "ferrari-car.png",
    "redbull-car.png",
    "williams-car.png",
    "racing-bulls-car.png",
    "aston-martin-car.png",
    "audi-car.png",
    "haas-car.png",
    "alpine-car.png",
    "racefriet-gp-car.png",
    "cadillac-car.png"
  ];

  const cars = [];

  for (const file of carFiles) {
    const img = document.createElement("img");
    img.className = "road-car";
    img.src = `../public/images/teams/${file}`;
    img.alt = "";

    img.addEventListener("error", () => {
      img.style.display = "none";
    });

    wrap.appendChild(img);

    cars.push({
      el: img,
      speed: 140 + Math.random() * 200,      
      amp: 6 + Math.random() * 16,           
      freq: 0.0012 + Math.random() * 0.0018, 
      phase: Math.random() * Math.PI * 2,
      yBase: -35 + Math.random() * 55,       
      x: -300 - Math.random() * 1400
    });
  }

  let last = performance.now();

  function frame(now) {
    const dt = now - last;
    last = now;

    const W = wrap.clientWidth || window.innerWidth;

    for (const c of cars) {
      if (c.el.style.display === "none") continue;

      c.x += (c.speed * dt) / 1000;

      // loop terug
      if (c.x > W + 260) c.x = -320 - Math.random() * 900;

      const y = c.yBase + Math.sin(now * c.freq + c.phase) * c.amp;
      const yClamped = Math.max(-45, Math.min(55, y));
      const rot = Math.sin(now * c.freq * 1.5 + c.phase) * 2.0;

      c.el.style.transform = `translate3d(${c.x}px, ${yClamped}px, 0) rotate(${rot}deg)`;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function initAuthPage() {
  const modeBtn = $("#switchMode");
  const title = $("#authTitle");
  const hint = $("#authHint");
  const submit = $("#authSubmit");

  const usernameField = $("#fieldUsername");
  const form = $("#authForm");
  const msg = $("#authMsg");

  let mode = "login";

  const setMode = (m) => {
    mode = m;
    if (!title || !hint || !submit || !modeBtn || !msg) return;

    if (mode === "login") {
      title.textContent = "Log in";
      hint.textContent = "No account yet? Create one in 10 seconds.";
      submit.textContent = "Log in";
      if (usernameField) usernameField.style.display = "none";
      modeBtn.textContent = "Switch to register";
    } else {
      title.textContent = "Register";
      hint.textContent = "Create your player account (required to save results).";
      submit.textContent = "Create account";
      if (usernameField) usernameField.style.display = "block";
      modeBtn.textContent = "Switch to login";
    }
    msg.textContent = "";
  };

  setMode("login");

  modeBtn?.addEventListener("click", () => setMode(mode === "login" ? "register" : "login"));

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!msg) return;

    msg.textContent = "Working…";

    const email = $("#email")?.value?.trim() || "";
    const password = $("#password")?.value || "";
    const username = $("#username")?.value?.trim() || "";

    try {
      const body = mode === "register" ? { username, email, password } : { email, password };
      const data = await api(`/auth/${mode}`, { method: "POST", body });

      setToken(data.token);
      setUser(data.user);

      msg.textContent = "Success! Redirecting…";
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next ? next : "./index.html";
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

async function initRaceSetupPage() {
  const token = getToken();
  if (!token) {
    window.location.href = `./auth.html?next=${encodeURIComponent("./race.html")}`;
    return;
  }

  const grid = document.getElementById("teamGrid");
  const startBtn = document.getElementById("startRound1");
  const msg = document.getElementById("raceMsg");

  if (!grid || !startBtn || !msg) return;

  msg.textContent = "Loading teams…";
  startBtn.disabled = true;

  let selectedTeamId = null;

  function slugify(name) {
    return String(name)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function renderTeams(teams) {
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#333"/><stop offset="1" stop-color="#111"/></linearGradient></defs>
    <circle cx="32" cy="32" r="30" fill="url(#g)" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
    <text x="32" y="38" text-anchor="middle" font-size="22" fill="rgba(255,255,255,.85)" font-family="system-ui">?</text>
  </svg>`;
  const carSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="90">
    <rect x="6" y="10" rx="14" ry="14" width="348" height="70" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)"/>
    <text x="180" y="56" text-anchor="middle" font-size="18" fill="rgba(255,255,255,.65)" font-family="system-ui">CAR SPRITE</text>
  </svg>`;

  const FALLBACK_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`;
  const FALLBACK_CAR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(carSvg)}`;
  const TEAM_FILE_MAP = {
  };

  grid.innerHTML = teams.map((t) => {
    const slug = slugify(t.name);
    const fileKey = TEAM_FILE_MAP[t.name] || slug;

    const iconSrc = asset(`images/teams/${fileKey}-icon.png`);
    const carSrc  = asset(`images/teams/${fileKey}-car.png`);

    return `
      <article class="team-card" data-teamid="${t._id}" data-teamname="${t.name}">
        <div class="team-top">
          <div class="team-icon">
            <img data-sprite data-fallback="${FALLBACK_ICON}" src="${iconSrc}" alt="" />
          </div>
          <div class="team-name">${t.name}</div>
        </div>

        <div class="team-car">
          <img data-sprite data-fallback="${FALLBACK_CAR}" src="${carSrc}" alt="" />
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".team-card").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".team-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      selectedTeamId = card.dataset.teamid;
      startBtn.disabled = false;
      msg.textContent = `Selected: ${card.dataset.teamname}`;
    });
  });
}

  try {
    const teams = await api("/teams");

    const order = [
      "McLaren",
      "Mercedes",
      "Ferrari",
      "RedBull",
      "Williams",
      "Racing Bulls",
      "Aston Martin",
      "Audi",
      "Cadillac",
      "Haas",
      "Alpine",
      "Racefriet GP"
    ];

    teams.sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    renderTeams(teams);
    msg.textContent = "Pick your team.";

    startBtn.addEventListener("click", () => {
      if (!selectedTeamId) return;

      sessionStorage.setItem("fgp_teamId", selectedTeamId);
      sessionStorage.setItem("fgp_roundResults", JSON.stringify([]));
      window.location.href = "./track-galmaarden.html";
    });
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function initTrackPage() {
  const token = getToken();
  if (!token) {
    window.location.href = `./auth.html?next=${encodeURIComponent(window.location.pathname)}`;
    return;
  }

  const city = document.body.dataset.city;
  const teamId = sessionStorage.getItem("fgp_teamId");

  if (!teamId) {
    window.location.href = "./race.html";
    return;
  }

  const hudCity = $("#hudCity");
  const hudStatus = $("#hudStatus");
  const hudTime = CountingFix($("#hudTime"));
  const hudSpeed = CountingFix($("#hudSpeed"));
  const hudPit = CountingFix($("#hudPit"));
  const fill = $("#progressFill");
  const nextBtn = $("#nextBtn");

  if (hudCity) hudCity.textContent = city || "—";
  if (hudStatus) hudStatus.textContent = "Loading track…";

  try {
    const tracks = await api("/tracks");
    const track = tracks.find((t) => String(t.city).toLowerCase() === String(city).toLowerCase());
    if (!track) throw new Error("Track not found in API.");

    if (hudStatus) hudStatus.textContent = "Simulating…";

    // progress animation
    if (fill) fill.style.width = "0%";
    let fake = 0;
    const timer = setInterval(() => {
      fake = Math.min(95, fake + Math.random() * 6);
      if (fill) fill.style.width = `${fake}%`;
    }, 120);

    const res = await api("/races/simulate", {
      method: "POST",
      auth: true,
      body: { teamId, trackId: track._id, save: true }
    });

    clearInterval(timer);
    if (fill) fill.style.width = "100%";

    // store session summary
    const prev = JSON.parse(sessionStorage.getItem("fgp_roundResults") || "[]");
    prev.push({
      city: track.city,
      lengthKm: track.lengthKm,
      speedKmh: res.result.speedKmh,
      pitStopSec: res.result.pitStopSec,
      lapTimeMs: res.result.lapTimeMs,
      status: res.status
    });
    sessionStorage.setItem("fgp_roundResults", JSON.stringify(prev));

    if (hudStatus) hudStatus.textContent = `Saved: ${res.status}`;
    if (hudTime) hudTime.textContent = formatMs(res.result.lapTimeMs);
    if (hudSpeed) hudSpeed.textContent = `${res.result.speedKmh} km/h`;
    if (hudPit) hudPit.textContent = `${res.result.pitStopSec}s`;

    const nextMap = {
      galmaarden: "./track-knokke.html",
      knokke: "./track-brussel.html",
      brussel: "./results.html"
    };
    const nextUrl = nextMap[String(city).toLowerCase()] || "./results.html";

    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.addEventListener("click", () => (window.location.href = nextUrl));
    }
  } catch (err) {
    if (hudStatus) hudStatus.textContent = err.message;

    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = "Back to race setup";
      nextBtn.addEventListener("click", () => (window.location.href = "./race.html"));
    }
  }

  function CountingFix(el) {
    return el;
  }
}

async function initResultsPage() {
  const token = getToken();
  if (!token) {
    window.location.href = `./auth.html?next=${encodeURIComponent("./results.html")}`;
    return;
  }

  const listWrap =
    document.getElementById("resultsWrap") ||
    document.querySelector("[data-results-wrap]");

  const sessionWrap =
    document.getElementById("sessionWrap") ||
    document.querySelector("[data-session-wrap]");

  const clearAllBtn =
    document.getElementById("clearAll") ||
    document.querySelector("[data-clear-all]");

  if (!listWrap) {
    console.error("Results page: #resultsWrap ontbreekt in results.html");
    return;
  }

  const session = JSON.parse(sessionStorage.getItem("fgp_roundResults") || "[]");
  if (sessionWrap) {
    if (!session.length) {
      sessionWrap.innerHTML = `<div class="notice">No current session data (start a race first).</div>`;
    } else {
      sessionWrap.innerHTML = `
        <div class="notice">
          <div class="h2" style="margin:0 0 8px;">Your last run (this session)</div>
          ${session
            .map(
              (r) => `
              <div style="display:flex; justify-content:space-between; gap:12px; padding:6px 0;">
                <span><b>${r.city}</b> <span class="small">(${r.lengthKm}km)</span></span>
                <span>${formatMs(r.lapTimeMs)} <span class="small">(${r.status})</span></span>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }
  }

  async function load() {
    listWrap.innerHTML = `<div class="notice">Loading results…</div>`;

    const races = await api("/races?sortBy=fastest&limit=50&offset=0", { auth: true });

    if (!Array.isArray(races) || races.length === 0) {
      listWrap.innerHTML = `<div class="notice">No saved results yet. Start a race first.</div>`;
      return;
    }

    listWrap.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Track</th>
            <th>Team</th>
            <th>Lap time</th>
            <th>Speed</th>
            <th>Pit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${races
            .map(
              (r) => `
              <tr>
                <td>${r.trackCity}</td>
                <td>${r.teamName}</td>
                <td><b>${formatMs(r.lapTimeMs)}</b></td>
                <td>${Number(r.speedKmh || 0).toFixed(2)} km/h</td>
                <td>${Number(r.pitStopSec || 0).toFixed(2)} s</td>
                <td style="text-align:right;">
                  <button class="btn btn-outline" data-del="${r._id}"><span>Delete</span></button>
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    $$("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          await api(`/races/${btn.dataset.del}`, { method: "DELETE", auth: true });
          await load();
        } catch (err) {
          btn.disabled = false;
          alert(err.message);
        }
      });
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", async () => {
      clearAllBtn.disabled = true;
      try {
        const races = await api("/races?sortBy=latest&limit=100&offset=0", { auth: true });
        for (const r of races) {
          await api(`/races/${r._id}`, { method: "DELETE", auth: true });
        }
        sessionStorage.removeItem("fgp_roundResults");
        await load();
      } catch (err) {
        alert(err.message);
      } finally {
        clearAllBtn.disabled = false;
      }
    });
  } else {
    console.warn("Results page: #clearAll knop niet gevonden (Delete all werkt niet).");
  }

  try {
    await load();
  } catch (err) {
    console.error(err);
    listWrap.innerHTML = `<div class="notice">${err.message || "Unknown error loading results."}</div>`;
  }
}

applyGlobalHeader();
spriteFallbacks();

const page = document.body.dataset.page;

const has = (id) => document.getElementById(id) !== null;

if (page === "auth" || has("authForm")) initAuthPage();
if (page === "race" || has("teamGrid")) initRaceSetupPage();
if (page === "track" || has("hudStatus")) initTrackPage();
if (page === "results" || has("resultsWrap")) initResultsPage();

