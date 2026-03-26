// ==============================================
//  DOM HUNTERS - scalony skrypt (bez ES modules)
//  Dziala bezposrednio z file:// - nie wymaga serwera
// ==============================================

/* ============================================================
   DANE SCENY I POSTACI
   ============================================================ */

function baseSceneTemplate() {
  return `
    <section id="arena" class="arena" data-zone="city">
      <article class="character antihero mutant" id="deadpool" data-faction="x-force" data-threat="7">
        <img class="character-photo" id="deadpool-portrait" src="${createAvatarDataUri("Deadpool", "deadpool")}" alt="Portret Deadpool" data-character="deadpool" />
        <h3>Deadpool</h3>
        <p class="status">Lubi chaos i chimichangi.</p>
      </article>
      <article class="character hunter" id="predator" data-faction="yautja" data-threat="9">
        <img class="character-photo" id="predator-portrait" src="${createAvatarDataUri("Predator", "predator")}" alt="Portret Predator" data-character="predator" />
        <h3>Predator</h3>
        <p class="status">Poluje wedlug rytualu.</p>
      </article>
      <article class="character clown" id="pennywise" data-faction="sewers" data-threat="10">
        <img class="character-photo" id="pennywise-portrait" src="${createAvatarDataUri("Pennywise", "pennywise")}" alt="Portret Pennywise" data-character="pennywise" />
        <h3>Pennywise</h3>
        <p class="status">Kusi czerwonym balonem.</p>
      </article>
      <article class="character xeno" id="alien" data-faction="xenomorph" data-threat="10">
        <img class="character-photo" id="alien-portrait" src="${createAvatarDataUri("Alien", "alien")}" alt="Portret Alien" data-character="alien" />
        <h3>Alien</h3>
        <p class="status">Nie slychac go, gdy nadchodzi.</p>
      </article>
      <article class="character symbiote" id="venom" data-faction="symbiote" data-threat="8">
        <img class="character-photo" id="venom-portrait" src="${createAvatarDataUri("Venom", "venom")}" alt="Portret Venom" data-character="venom" />
        <h3>Venom</h3>
        <p class="status">Mowi: We are Venom.</p>
      </article>
    </section>

    <section class="tools">
      <div class="panel" id="alert-panel">Panel alertu: offline</div>
      <div class="panel">
        <button id="panic-button" type="button">Panika!</button>
        Kliki: <span id="panic-count">0</span>
      </div>
      <div class="panel">
        <label for="codeword">Kod operacyjny</label>
        <input id="codeword" type="text" />
        <p id="codeword-preview">Podglad kodu...</p>
      </div>
      <div class="panel" id="ops-panel">
        <form id="ops-form">
          <label class="inline-option" for="stealth-mode">
            <input id="stealth-mode" type="checkbox" />
            Tryb stealth
          </label>
          <label for="target-priority">Priorytet celu</label>
          <select id="target-priority">
            <option value="low">Niski</option>
            <option value="medium" selected>Sredni</option>
            <option value="high">Wysoki</option>
          </select>
          <button id="deploy-button" type="button" disabled>Wyslij oddzial</button>
        </form>
      </div>
      <div class="panel">
        <ul id="squad-list">
          <li data-name="deadpool">Deadpool</li>
          <li data-name="predator">Predator</li>
          <li data-name="pennywise">Pennywise</li>
        </ul>
      </div>
      <div class="panel" id="archive-panel">
        <p>Archiwum raportów</p>
        <ul id="archive-list">
          <li>raport-alpha</li>
          <li>raport-beta</li>
          <li>raport-gamma</li>
        </ul>
      </div>
      <div class="panel">
        <p id="mission-status">Status: OCZEKIWANIE</p>
        <ul id="intel-feed"></ul>
      </div>
    </section>
  `;
}

const CHARACTER_POOL = [
  { id: "deadpool",  classes: "character antihero mutant",  faction: "x-force",   threat: 7,  name: "Deadpool",  status: "Lubi chaos i chimichangi." },
  { id: "predator",  classes: "character hunter",           faction: "yautja",    threat: 9,  name: "Predator",  status: "Poluje wedlug rytualu." },
  { id: "pennywise", classes: "character clown",            faction: "sewers",    threat: 10, name: "Pennywise", status: "Kusi czerwonym balonem." },
  { id: "alien",     classes: "character xeno",             faction: "xenomorph", threat: 10, name: "Alien",     status: "Nie slychac go, gdy nadchodzi." },
  { id: "venom",     classes: "character symbiote",         faction: "symbiote",  threat: 8,  name: "Venom",     status: "Mowi: We are Venom." },
  { id: "blade",     classes: "character hunter slayer",    faction: "dhampir",   threat: 8,  name: "Blade",     status: "Nocny lowca wampirow." },
  { id: "ghostface", classes: "character slasher",          faction: "unknown",   threat: 7,  name: "Ghostface", status: "Lubi pytac o ulubiony film." },
  { id: "jason",     classes: "character slasher undead",   faction: "camp",      threat: 9,  name: "Jason",     status: "Pojawia się przy jeziorze." },
  { id: "krueger",   classes: "character dreamer slasher",  faction: "dreams",    threat: 9,  name: "Freddy",    status: "Atakuje we snie." },
  { id: "thanos",    classes: "character cosmic titan",     faction: "infinity",  threat: 10, name: "Thanos",    status: "Zna wage rownowagi." },
];

function avatarPaletteById(id) {
  const map = {
    deadpool: ["#e43a30", "#202020"],
    predator: ["#8fd36f", "#2f4130"],
    pennywise: ["#f3b9cf", "#703450"],
    alien: ["#7afcc6", "#1f4741"],
    venom: ["#8cb7ff", "#1d2648"],
    blade: ["#f0c95a", "#41381f"],
    ghostface: ["#f3f4f6", "#2a2d33"],
    jason: ["#f09c54", "#3e2a1d"],
    krueger: ["#d96f54", "#4f2e2a"],
    thanos: ["#b59cff", "#302560"]
  };
  return map[id] || ["#8aa0ff", "#2f395f"];
}

function avatarFaceMarkupById(id) {
  const faces = {
    deadpool: '' +
      '<path d="M92 162 C102 122 114 104 140 100 C166 104 178 122 188 162 Z" fill="#292a31"/>' +
      '<path d="M104 150 C112 122 122 108 140 104 C158 108 168 122 176 150 L160 162 L120 162 Z" fill="#c21f28"/>' +
      '<path d="M120 28 C134 18 146 18 160 28 L170 54 L110 54 Z" fill="#111217"/>' +
      '<path d="M94 50 C106 24 174 24 186 50 L184 108 C170 134 110 134 96 108 Z" fill="#be1e26"/>' +
      '<path d="M136 34 L144 34 L150 112 L130 112 Z" fill="#111217" opacity="0.95"/>' +
      '<path d="M102 64 C114 48 126 48 136 64 C128 76 116 78 102 64 Z" fill="#f6f7fb"/>' +
      '<path d="M144 64 C154 48 166 48 178 64 C164 78 152 76 144 64 Z" fill="#f6f7fb"/>' +
      '<path d="M118 56 L134 70" stroke="#111217" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M162 56 L146 70" stroke="#111217" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M106 90 Q140 102 174 90" stroke="#240d11" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<rect x="176" y="34" width="18" height="88" rx="6" fill="#2b2328"/>' +
      '<rect x="181" y="30" width="8" height="96" rx="4" fill="#101217"/>' +
      '<path d="M178 84 C194 74 206 74 216 90 L216 156 L186 156 Z" fill="#25262d"/>' +
      '<path d="M176 86 C190 80 202 84 212 96" stroke="#ff5c92" stroke-width="3" fill="none" opacity="0.65"/>' +
      '<path d="M98 98 L84 152" stroke="#2f3037" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M182 100 L194 150" stroke="#2f3037" stroke-width="12" stroke-linecap="round"/>',
    predator: '' +
      '<path d="M88 162 C100 124 114 108 140 104 C166 108 180 124 192 162 Z" fill="#4a392a"/>' +
      '<ellipse cx="140" cy="82" rx="54" ry="60" fill="#927b56"/>' +
      '<path d="M88 46 Q140 10 192 46 L182 106 Q140 132 98 106 Z" fill="#7c6948"/>' +
      '<rect x="92" y="54" width="96" height="24" rx="12" fill="#4f4f4f"/>' +
      '<circle cx="116" cy="66" r="6" fill="#ff6d5e"/>' +
      '<circle cx="164" cy="66" r="6" fill="#ff6d5e"/>' +
      '<path d="M110 90 Q140 108 170 90" stroke="#2d2418" stroke-width="5" fill="none"/>' +
      '<path d="M94 112 C88 132 76 146 70 160" stroke="#2b1f16" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M110 116 C106 136 98 148 94 162" stroke="#2b1f16" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M170 116 C174 136 182 148 186 162" stroke="#2b1f16" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M186 112 C192 132 204 146 210 160" stroke="#2b1f16" stroke-width="8" stroke-linecap="round"/>',
    pennywise: '' +
      '<path d="M90 162 C102 126 116 108 140 104 C164 108 178 126 190 162 Z" fill="#6d4756"/>' +
      '<ellipse cx="140" cy="84" rx="50" ry="60" fill="#f6f3ef"/>' +
      '<path d="M90 40 Q104 18 120 34 Q140 8 160 34 Q176 18 190 40" fill="#de5d4e"/>' +
      '<circle cx="122" cy="74" r="7" fill="#f2d23b"/>' +
      '<circle cx="158" cy="74" r="7" fill="#f2d23b"/>' +
      '<circle cx="122" cy="74" r="3" fill="#1f2a50"/>' +
      '<circle cx="158" cy="74" r="3" fill="#1f2a50"/>' +
      '<path d="M120 36 C116 58 114 84 112 112" stroke="#d04d42" stroke-width="4" fill="none"/>' +
      '<path d="M160 36 C164 58 166 84 168 112" stroke="#d04d42" stroke-width="4" fill="none"/>' +
      '<circle cx="140" cy="92" r="6" fill="#d04d42"/>' +
      '<path d="M114 110 Q140 126 166 110" stroke="#a71f29" stroke-width="5" fill="none" stroke-linecap="round"/>',
    alien: '' +
      '<path d="M92 162 C102 128 116 112 140 108 C164 112 178 128 188 162 Z" fill="#152725"/>' +
      '<path d="M96 34 C108 10 172 10 184 34 C194 54 188 104 140 132 C92 104 86 54 96 34 Z" fill="#1e3432"/>' +
      '<path d="M108 42 C116 24 164 24 172 42 C178 58 174 86 140 108 C106 86 102 58 108 42 Z" fill="#2c5c55"/>' +
      '<ellipse cx="124" cy="72" rx="12" ry="8" fill="#d9fff6"/>' +
      '<ellipse cx="156" cy="72" rx="12" ry="8" fill="#d9fff6"/>' +
      '<path d="M118 96 Q140 110 162 96" stroke="#a8fff0" stroke-width="4" fill="none"/>' +
      '<path d="M120 98 L116 126 L128 116 L136 136 L144 116 L152 128 L160 98" fill="#dffef6" opacity="0.9"/>',
    venom: '' +
      '<path d="M88 162 C100 126 114 108 140 104 C166 108 180 126 192 162 Z" fill="#0c1227"/>' +
      '<ellipse cx="140" cy="82" rx="54" ry="62" fill="#0d1329"/>' +
      '<path d="M92 56 C104 34 126 28 140 40 C154 28 176 34 188 56 C174 74 160 78 144 76 C142 68 138 68 136 76 C120 78 106 74 92 56 Z" fill="#f7fbff"/>' +
      '<path d="M102 110 Q140 128 178 110" fill="#ffffff"/>' +
      '<path d="M112 108 L122 120 L132 108 L142 122 L152 108 L162 120 L170 108" fill="#0d1329"/>' +
      '<path d="M126 118 Q140 144 154 118 Q152 148 140 160 Q128 148 126 118 Z" fill="#ff4768"/>',
    blade: '' +
      '<path d="M90 162 C102 128 116 110 140 106 C164 110 178 128 190 162 Z" fill="#1a1615"/>' +
      '<ellipse cx="140" cy="84" rx="50" ry="58" fill="#6b4832"/>' +
      '<path d="M92 52 Q140 18 188 52 L178 110 Q140 134 102 110 Z" fill="#593623"/>' +
      '<rect x="98" y="56" width="84" height="18" rx="9" fill="#0e0f15"/>' +
      '<path d="M112 100 Q140 112 168 100" stroke="#2b1811" stroke-width="5" fill="none"/>' +
      '<rect x="84" y="84" width="112" height="8" rx="4" fill="#111" opacity="0.5"/>',
    ghostface: '' +
      '<path d="M92 162 C102 128 116 112 140 108 C164 112 178 128 188 162 Z" fill="#090909"/>' +
      '<path d="M96 34 Q140 18 184 34 L174 132 Q140 154 106 132 Z" fill="#111317"/>' +
      '<path d="M112 44 Q140 28 168 44 L162 120 Q140 138 118 120 Z" fill="#f4efe7"/>' +
      '<ellipse cx="126" cy="70" rx="8" ry="14" fill="#111317"/>' +
      '<ellipse cx="154" cy="70" rx="8" ry="14" fill="#111317"/>' +
      '<ellipse cx="140" cy="96" rx="8" ry="12" fill="#111317"/>' +
      '<path d="M128 112 Q140 126 152 112" stroke="#111317" stroke-width="6" fill="none" stroke-linecap="round"/>',
    jason: '' +
      '<path d="M88 162 C102 126 116 110 140 106 C164 110 178 126 192 162 Z" fill="#5a4330"/>' +
      '<ellipse cx="140" cy="84" rx="52" ry="60" fill="#e6d7bf"/>' +
      '<path d="M92 52 Q140 26 188 52 L178 112 Q140 138 102 112 Z" fill="#d9c8ad"/>' +
      '<circle cx="120" cy="74" r="6" fill="#2e2c2b"/>' +
      '<circle cx="160" cy="74" r="6" fill="#2e2c2b"/>' +
      '<circle cx="120" cy="74" r="2" fill="#ff4a44"/>' +
      '<circle cx="160" cy="74" r="2" fill="#ff4a44"/>' +
      '<path d="M118 96 Q140 106 162 96" stroke="#4e3a2b" stroke-width="4" fill="none"/>' +
      '<circle cx="108" cy="58" r="3" fill="#7a5a42"/><circle cx="124" cy="56" r="3" fill="#7a5a42"/><circle cx="140" cy="54" r="3" fill="#7a5a42"/><circle cx="156" cy="56" r="3" fill="#7a5a42"/><circle cx="172" cy="58" r="3" fill="#7a5a42"/>',
    krueger: '' +
      '<path d="M90 162 C102 128 116 110 140 106 C164 110 178 128 190 162 Z" fill="#6f3128"/>' +
      '<ellipse cx="140" cy="84" rx="50" ry="58" fill="#b06649"/>' +
      '<path d="M94 50 Q140 18 186 50 L176 112 Q140 136 104 112 Z" fill="#8f4e38"/>' +
      '<path d="M114 64 Q122 58 130 64" stroke="#211613" stroke-width="4" fill="none"/>' +
      '<path d="M150 64 Q158 58 166 64" stroke="#211613" stroke-width="4" fill="none"/>' +
      '<path d="M116 96 Q140 112 164 96" stroke="#2a1713" stroke-width="5" fill="none"/>' +
      '<path d="M102 76 L126 68" stroke="#d49a84" stroke-width="3"/>' +
      '<path d="M148 82 L174 72" stroke="#d49a84" stroke-width="3"/>' +
      '<path d="M110 108 L136 98" stroke="#d49a84" stroke-width="3"/>',
    thanos: '' +
      '<path d="M88 162 C100 126 114 108 140 104 C166 108 180 126 192 162 Z" fill="#4e3890"/>' +
      '<ellipse cx="140" cy="84" rx="52" ry="60" fill="#8660c8"/>' +
      '<path d="M92 50 Q140 14 188 50 L176 114 Q140 138 104 114 Z" fill="#7050b5"/>' +
      '<path d="M112 64 Q124 54 136 64" stroke="#261841" stroke-width="4" fill="none"/>' +
      '<path d="M144 64 Q156 54 168 64" stroke="#261841" stroke-width="4" fill="none"/>' +
      '<path d="M116 98 Q140 112 164 98" stroke="#2d1d4c" stroke-width="5" fill="none"/>' +
      '<path d="M122 106 L158 106 L154 132 L126 132 Z" fill="#9d78db"/>' +
      '<path d="M128 114 L152 114 M128 122 L152 122" stroke="#6b4ea5" stroke-width="3"/>'
  };
  return faces[id] || (
    '<ellipse cx="140" cy="82" rx="52" ry="60" fill="#d7defd"/>' +
    '<circle cx="122" cy="74" r="6" fill="#1f2a50"/>' +
    '<circle cx="158" cy="74" r="6" fill="#1f2a50"/>' +
    '<path d="M118 102 Q140 116 162 102" stroke="#1f2a50" stroke-width="4" fill="none"/>'
  );
}

function avatarBackdropMarkupById(id) {
  const backdrops = {
    deadpool: '<rect width="280" height="180" fill="#d8dde3"/><rect y="126" width="280" height="54" fill="#cbd2da"/><path d="M190 26 L232 70 L232 158 L174 158 Z" fill="rgba(80,88,98,0.32)"/>',
    predator: '<rect width="280" height="180" fill="#a8b29a"/><rect y="122" width="280" height="58" fill="#859275"/><path d="M0 24 C40 18 66 34 88 54" stroke="rgba(255,255,255,0.12)" stroke-width="22" fill="none"/>',
    pennywise: '<rect width="280" height="180" fill="#d7dde5"/><rect y="122" width="280" height="58" fill="#c8cdd6"/><circle cx="214" cy="44" r="16" fill="#d22232"/><path d="M198 44 H150" stroke="#aab2bc" stroke-width="2"/>',
    alien: '<rect width="280" height="180" fill="#314744"/><rect y="124" width="280" height="56" fill="#243734"/><path d="M0 40 C52 16 90 12 150 26" stroke="rgba(198,255,241,0.08)" stroke-width="18" fill="none"/>',
    venom: '<rect width="280" height="180" fill="#39455d"/><rect y="124" width="280" height="56" fill="#283144"/><path d="M24 30 C80 12 126 12 182 30" stroke="rgba(255,255,255,0.08)" stroke-width="18" fill="none"/>',
    blade: '<rect width="280" height="180" fill="#85817b"/><rect y="126" width="280" height="54" fill="#645f59"/><path d="M26 38 H250" stroke="rgba(255,255,255,0.08)" stroke-width="12"/>',
    ghostface: '<rect width="280" height="180" fill="#6d727a"/><rect y="126" width="280" height="54" fill="#4d5258"/>',
    jason: '<rect width="280" height="180" fill="#b0ac9f"/><rect y="126" width="280" height="54" fill="#8f8a7c"/>',
    krueger: '<rect width="280" height="180" fill="#8e7469"/><rect y="126" width="280" height="54" fill="#6f564c"/><path d="M22 136 H258" stroke="rgba(120,10,16,0.28)" stroke-width="8"/>',
    thanos: '<rect width="280" height="180" fill="#8576ad"/><rect y="126" width="280" height="54" fill="#65588d"/><path d="M34 40 H246" stroke="rgba(255,220,110,0.18)" stroke-width="12"/>'
  };
  return backdrops[id] || '<path d="M76 144 C92 116 108 106 140 104 C172 106 188 116 204 144 L204 168 L76 168 Z" fill="rgba(20,24,40,0.6)"/>';
}

function createAvatarDataUri(name, id) {
  const colors = avatarPaletteById(id);
  const svg = '' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 180" role="img" aria-label="' + name + '">' +
      '<defs>' +
        '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="' + colors[0] + '"/>' +
          '<stop offset="100%" stop-color="' + colors[1] + '"/>' +
        '</linearGradient>' +
        '<radialGradient id="glow" cx="50%" cy="38%" r="62%">' +
          '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>' +
          '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="vignette" cx="50%" cy="50%" r="72%">' +
          '<stop offset="62%" stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="0.34"/>' +
        '</radialGradient>' +
        '<linearGradient id="faceLight" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>' +
        '</linearGradient>' +
        '<filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feGaussianBlur stdDeviation="8"/>' +
        '</filter>' +
      '</defs>' +
      '<rect width="280" height="180" fill="url(#bg)"/>' +
      '<ellipse cx="140" cy="28" rx="84" ry="24" fill="#ffffff" opacity="0.12" filter="url(#softBlur)"/>' +
      '<ellipse cx="140" cy="154" rx="74" ry="18" fill="#000000" opacity="0.22" filter="url(#softBlur)"/>' +
      avatarBackdropMarkupById(id) +
      '<rect width="280" height="180" fill="url(#glow)"/>' +
      '<ellipse cx="140" cy="154" rx="62" ry="14" fill="rgba(0,0,0,0.24)"/>' +
      avatarFaceMarkupById(id) +
      '<ellipse cx="140" cy="82" rx="56" ry="64" fill="url(#faceLight)" opacity="0.24"/>' +
      '<path d="M84 166 H196" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>' +
      '<rect x="56" y="136" width="168" height="28" rx="14" fill="rgba(0,0,0,0.26)"/>' +
      '<rect width="280" height="180" fill="url(#vignette)"/>' +
      '<text x="140" y="154" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">' + name + '</text>' +
    '</svg>';
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function liCount(selector, root) {
  return root.querySelectorAll(selector).length;
}

function renderBaseScene(sceneRoot) {
  sceneRoot.innerHTML = baseSceneTemplate();
}

function renderRandomScene(sceneRoot) {
  const picked = shuffle(CHARACTER_POOL).slice(0, 4 + Math.floor(Math.random() * 3));
  const cards = picked.map(function(c) {
    return '<article class="' + c.classes + '" id="' + c.id + '" data-faction="' + c.faction + '" data-threat="' + c.threat + '"><img class="character-photo" id="' + c.id + '-portrait" src="' + createAvatarDataUri(c.name, c.id) + '" alt="Portret ' + c.name + '" data-character="' + c.id + '" /><h3>' + c.name + '</h3><p class="status">' + c.status + '</p></article>';
  }).join("");
  const listItems = picked.map(function(c) { return '<li data-name="' + c.id + '">' + c.name + '</li>'; }).join("");
  sceneRoot.innerHTML = '<p style="color:#94ffc6;font-size:0.88rem;margin-bottom:8px;">Tryb eksploracji &#8212; losowa scena. Eksperymentuj swobodnie.</p><section id="arena" class="arena" data-zone="city">' + cards + '</section><section class="tools"><div class="panel" id="alert-panel">Panel alertu: offline</div><div class="panel"><button id="panic-button" type="button">Panika!</button> Kliki: <span id="panic-count">0</span></div><div class="panel"><label for="codeword">Kod operacyjny</label><input id="codeword" type="text" /><p id="codeword-preview">Podglad kodu...</p></div><div class="panel" id="ops-panel"><form id="ops-form"><label class="inline-option" for="stealth-mode"><input id="stealth-mode" type="checkbox" />Tryb stealth</label><label for="target-priority">Priorytet celu</label><select id="target-priority"><option value="low">Niski</option><option value="medium" selected>Sredni</option><option value="high">Wysoki</option></select><button id="deploy-button" type="button" disabled>Wyslij oddzial</button></form></div><div class="panel"><ul id="squad-list">' + listItems + '</ul></div><div class="panel" id="archive-panel"><p>Archiwum raportów</p><ul id="archive-list"><li>raport-alpha</li><li>raport-beta</li><li>raport-gamma</li></ul></div><div class="panel"><p id="mission-status">Status: OCZEKIWANIE</p><ul id="intel-feed"></ul></div></section>';
}

/* ============================================================
   DEFINICJE MISJI
   ============================================================ */

const missions = [
  {
    id: 1,
    topic: "getElementById",
    title: "Misja 1: Wskaż Deadpoola",
    objective: "\nKrok 1: pobierz element o id 'deadpool' przez document.getElementById('deadpool').\n Krok 2: dodaj temu elementowi klasę 'selected'.",
    tips: ["W getElementById podajesz samo id bez znaku #.", "Po pobraniu elementu uzyj classList.add('selected')."],
    starter: 'const deadpool = document.getElementById("deadpool");\n// deadpool.classList.add("selected");',
    solution: 'const deadpool = document.getElementById("deadpool");\ndeadpool.classList.add("selected");',
    validate: function(scene) {
      const deadpool = scene.querySelector("#deadpool");
      return deadpool && deadpool.classList.contains("selected");
    }
  },
  {
    id: 2,
    topic: "getElementById",
    title: "Misja 2: Aktywuj panel alertu",
    objective: "Krok 1: pobierz element o id 'alert-panel' przez getElementById(). Krok 2: ustaw jego textContent na 'Panel alertu: ONLINE'.",
    tips: ["textContent podmienia tekst widoczny wewnątrz elementu.", "Nie tworzysz nowego panelu - zmieniasz tekst już istniejacego elementu."],
    starter: 'const panel = document.getElementById("alert-panel");',
    solution: 'const panel = document.getElementById("alert-panel");\npanel.textContent = "Panel alertu: ONLINE";',
    validate: function(scene) {
      const panel = scene.querySelector("#alert-panel");
      return panel && panel.textContent.trim() === "Panel alertu: ONLINE";
    }
  },
  {
    id: 3,
    topic: "getElementById",
    title: "Misja 3: Ustaw licznik",
    objective: "Krok 1: pobierz element o id 'panic-count'. Krok 2: ustaw tekst tego elementu na '5'.",
    tips: ["#panic-count to licznik obok przycisku 'Panika!'.", "Wystarczy przypisac count.textContent = '5'."],
    starter: 'const count = document.getElementById("panic-count");',
    solution: 'const count = document.getElementById("panic-count");\ncount.textContent = "5";',
    validate: function(scene) {
      const count = scene.querySelector("#panic-count");
      return count && count.textContent.trim() === "5";
    }
  },
  {
    id: 4,
    topic: "getElementById",
    title: "Misja 4: Kod operacyjny",
    objective: "Krok 1: pobierz pole tekstowe o id 'codeword'. Krok 2: wpisz do niego wartość 'xforce' przez właściwość value.",
    tips: ["Dla inputa tekstowego zmieniasz value, a nie textContent.", "Wartość ma być dokladnie 'xforce', małymi literami."],
    starter: 'const codeword = document.getElementById("codeword");',
    solution: 'const codeword = document.getElementById("codeword");\ncodeword.value = "xforce";',
    validate: function(scene) {
      const codeword = scene.querySelector("#codeword");
      return codeword && codeword.value === "xforce";
    }
  },
  {
    id: 5,
    topic: "querySelector",
    title: "Misja 5: Namierz Predatora",
    objective: "Krok 1: pobierz przez querySelector element o id 'predator' (selektor: '#predator'). Krok 2: dodaj temu elementowi klasę 'targeted'.",
    tips: ["querySelector zwraca tylko pierwszy pasujacy element (albo null).", "W selektorze CSS: #(hash) oznacza id, .(kropka) oznacza klasę, a np. 'p' oznacza znacznik HTML.", "Tutaj '#predator' wskazuje jeden konkretny element o id='predator'."],
    starter: 'const predator = document.querySelector("#predator");',
    solution: 'const predator = document.querySelector("#predator");\npredator.classList.add("targeted");',
    validate: function(scene) {
      const predator = scene.querySelector("#predator");
      return predator && predator.classList.contains("targeted");
    }
  },
  {
    id: 6,
    topic: "querySelector",
    title: "Misja 6: Komunikat Venoma",
    objective: "Krok 1: w karcie #venom znajdź paragraf z klasą '.status' (selektor: '#venom .status'). Krok 2: ustaw jego textContent na 'Gotowy do ataku.'.",
    tips: ["W scenie DOM #venom zawiera <p class='status'>..., dlatego selektor '#venom .status' jest poprawny.", "Spacja w selektorze '#venom .status' oznacza: element '.status' znajdujacy się wewnątrz '#venom'.", "querySelector zwroci tylko pierwszy pasujacy element - tutaj jest to status Venoma."],
    starter: 'const status = document.querySelector("#venom .status");',
    solution: 'const status = document.querySelector("#venom .status");\nstatus.textContent = "Gotowy do ataku.";',
    validate: function(scene) {
      const status = scene.querySelector("#venom .status");
      return status && status.textContent.trim() === "Gotowy do ataku.";
    }
  },
  {
    id: 7,
    topic: "querySelector",
    title: "Misja 7: Pierwszy panel",
    objective: "Uzyj querySelector('.panel'), pobierz pierwszy panel z DOM i ustaw mu atrybut data-open='yes'.",
    tips: ["querySelector zwraca tylko 1 element: pierwszy pasujacy do selektora.", "'.panel' oznacza element z klasa 'panel'.", "Mozesz użyć setAttribute('data-open', 'yes') albo firstPanel.dataset.open = 'yes'."],
    starter: 'const firstPanel = document.querySelector(".panel");',
    solution: 'const firstPanel = document.querySelector(".panel");\nfirstPanel.setAttribute("data-open", "yes");',
    validate: function(scene) {
      const firstPanel = scene.querySelector(".panel");
      return firstPanel && firstPanel.getAttribute("data-open") === "yes";
    }
  },
  {
    id: 8,
    topic: "querySelector",
    title: "Misja 8: Oznacz pierwszy cel",
    objective: "Uzyj querySelector('#squad-list li'), pobierz pierwszy element li z listy #squad-list i dodaj mu klasę 'tagged'.",
    tips: ["Selektor '#squad-list li' oznacza: pierwszy <li> znajdujacy się wewnątrz elementu o id='squad-list'.", "querySelector zwraca tylko pierwszy pasujacy <li>.", "Klasę dodasz przez classList.add('tagged')."],
    starter: 'const firstTarget = document.querySelector("#squad-list li");',
    solution: 'const firstTarget = document.querySelector("#squad-list li");\nfirstTarget.classList.add("tagged");',
    validate: function(scene) {
      const firstTarget = scene.querySelector("#squad-list li");
      return firstTarget && firstTarget.classList.contains("tagged");
    }
  },
  {
    id: 9,
    topic: "querySelectorAll",
    title: "Misja 9: Oznacz wszystkie postacie",
    objective: "Krok 1: pobierz wszystkie karty postaci selektorem '.character' przez querySelectorAll(). Krok 2: ustaw na kazdej karcie atrybut data-seen='1'.",
    tips: ["querySelectorAll zwraca wiele elementów, więc trzeba przejsc po nich petla.", "Na kazdym elemencie ustaw setAttribute('data-seen', '1')."],
    starter: 'const characters = document.querySelectorAll(".character");',
    solution: 'const characters = document.querySelectorAll(".character");\ncharacters.forEach((el) => {\n  el.setAttribute("data-seen", "1");\n});',
    validate: function(scene) {
      const characters = scene.querySelectorAll(".character");
      return characters.length >= 5 && Array.from(characters).every(function(el) { return el.getAttribute("data-seen") === "1"; });
    }
  },
  {
    id: 10,
    topic: "querySelectorAll",
    title: "Misja 10: Podswietl zagrożenia",
    objective: "Krok 1: pobierz przez querySelectorAll() dwie karty: .xeno oraz .symbiote. Krok 2: ustaw im style.borderColor na 'rgb(255, 77, 45)'.",
    tips: ["Przecinek w selektorze oznacza: znajdź elementy pasujące do pierwszej albo drugiej klasy.", "Poniewaz dostajesz kilka elementów, zmien kolor obramowania w pętli."],
    starter: 'const danger = document.querySelectorAll(".xeno, .symbiote");',
    solution: 'const danger = document.querySelectorAll(".xeno, .symbiote");\ndanger.forEach((el) => {\n  el.style.borderColor = "rgb(255, 77, 45)";\n});',
    validate: function(scene) {
      const danger = scene.querySelectorAll(".xeno, .symbiote");
      return danger.length === 2 && Array.from(danger).every(function(el) { return el.style.borderColor === "rgb(255, 77, 45)"; });
    }
  },
  {
    id: 11,
    topic: "querySelectorAll",
    title: "Misja 11: Nazwy wielkimi literami",
    objective: "Krok 1: pobierz wszystkie nagłówki h3 z kart postaci .character wewnątrz #arena. Krok 2: zamień tekst kazdego naglowka na DUŻE litery.",
    tips: ["Selektor '#arena .character h3' oznacza nagłówki h3 wewnątrz kart postaci.", "Dla kazdego elementu uzyj textContent = textContent.toUpperCase()."],
    starter: 'const names = document.querySelectorAll("#arena .character h3");',
    solution: 'const names = document.querySelectorAll("#arena .character h3");\nnames.forEach((el) => {\n  el.textContent = el.textContent.toUpperCase();\n});',
    validate: function(scene) {
      const names = scene.querySelectorAll("#arena .character h3");
      return names.length >= 5 && Array.from(names).every(function(el) { return el.textContent === el.textContent.toUpperCase(); });
    }
  },
  {
    id: 12,
    topic: "querySelectorAll",
    title: "Misja 12: Oznacz panele",
    objective: "Krok 1: pobierz wszystkie panele przez querySelectorAll('.panel'). Krok 2: dodaj każdemu panelowi klasę 'active'.",
    tips: ["'.panel' oznacza wszystkie elementy z klasa panel.", "Na kazdym panelu wykonaj classList.add('active')."],
    starter: 'const panels = document.querySelectorAll(".panel");',
    solution: 'const panels = document.querySelectorAll(".panel");\npanels.forEach((el) => {\n  el.classList.add("active");\n});',
    validate: function(scene) {
      const panels = scene.querySelectorAll(".panel");
      return panels.length >= 4 && Array.from(panels).every(function(el) { return el.classList.contains("active"); });
    }
  },
  {
    id: 13,
    topic: "getElementsByClassName",
    title: "Misja 13: Kolekcja postaci",
    objective: "Krok 1: pobierz wszystkie elementy klasy 'character' przez getElementsByClassName(). Krok 2: ustaw atrybut title='tracked' tylko na pierwszej karcie z tej kolekcji.",
    tips: ["getElementsByClassName zwraca kolekcje wielu elementów.", "Pierwszy element pobierzesz przez cards[0]."],
    starter: 'const cards = document.getElementsByClassName("character");',
    solution: 'const cards = document.getElementsByClassName("character");\ncards[0].setAttribute("title", "tracked");',
    validate: function(scene) {
      const first = scene.querySelector(".character");
      return first && first.getAttribute("title") === "tracked";
    }
  },
  {
    id: 14,
    topic: "getElementsByClassName",
    title: "Misja 14: Oznacz łowców",
    objective: "Krok 1: pobierz wszystkie elementy klasy 'hunter'. Krok 2: ustaw na kazdym z nich atrybut data-targeted='yes'.",
    tips: ["Klasa hunter oznacza lowce, np. Predatora.", "Po kolekcji przejdz petla i na kazdym elemencie wywolaj setAttribute()."],
    starter: 'const hunters = document.getElementsByClassName("hunter");',
    solution: 'const hunters = document.getElementsByClassName("hunter");\nfor (const hunter of hunters) {\n  hunter.setAttribute("data-targeted", "yes");\n}',
    validate: function(scene) {
      const hunters = scene.querySelectorAll(".hunter");
      return hunters.length > 0 && Array.from(hunters).every(function(el) { return el.getAttribute("data-targeted") === "yes"; });
    }
  },
  {
    id: 15,
    topic: "getElementsByClassName",
    title: "Misja 15: Wzmocnij statusy",
    objective: "Krok 1: pobierz wszystkie elementy klasy 'status'. Krok 2: dodaj każdemu z nich klasę 'tagged'.",
    tips: ["Statusy to paragrafy <p class='status'> wewnątrz kart postaci.", "Na kazdym statusie wywolaj classList.add('tagged')."],
    starter: 'const statuses = document.getElementsByClassName("status");',
    solution: 'const statuses = document.getElementsByClassName("status");\nfor (const status of statuses) {\n  status.classList.add("tagged");\n}',
    validate: function(scene) {
      const statuses = scene.querySelectorAll(".status");
      return statuses.length >= 5 && Array.from(statuses).every(function(el) { return el.classList.contains("tagged"); });
    }
  },
  {
    id: 16,
    topic: "getElementsByClassName",
    title: "Misja 16: Panele pod kontrola",
    objective: "Krok 1: pobierz wszystkie panele przez getElementsByClassName('panel'). Krok 2: ustaw style.borderStyle = 'solid' tylko na pierwszym i drugim panelu.",
    tips: ["Pracujesz tylko na dwoch pierwszych elementach z kolekcji: panels[0] i panels[1].", "borderStyle zmieniasz przez obiekt style."],
    starter: 'const panels = document.getElementsByClassName("panel");',
    solution: 'const panels = document.getElementsByClassName("panel");\npanels[0].style.borderStyle = "solid";\npanels[1].style.borderStyle = "solid";',
    validate: function(scene) {
      const panels = scene.querySelectorAll(".panel");
      if (panels.length < 2) return false;
      return panels[0].style.borderStyle === "solid" && panels[1].style.borderStyle === "solid";
    }
  },
  {
    id: 17,
    topic: "classList.add",
    title: "Misja 17: Alarm online",
    objective: "Pobierz #alert-panel i dodaj mu klasę 'active'.",
    tips: ["Nie zmieniasz tekstu panelu - tylko dopisujesz nową klasę CSS.", "Uzyj panel.classList.add('active')."],
    starter: 'const panel = document.getElementById("alert-panel");',
    solution: 'const panel = document.getElementById("alert-panel");\npanel.classList.add("active");',
    validate: function(scene) {
      const panel = scene.querySelector("#alert-panel");
      return panel && panel.classList.contains("active");
    }
  },
  {
    id: 18,
    topic: "classList.remove",
    title: "Misja 18: Uspokój Deadpoola",
    objective: "Pobierz #deadpool i usuń z niego klasę 'mutant'.",
    tips: ["Usuwasz tylko jedna klasę, a pozostale klasy elementu zostaja bez zmian.", "Uzyj deadpool.classList.remove('mutant')."],
    starter: 'const deadpool = document.getElementById("deadpool");',
    solution: 'const deadpool = document.getElementById("deadpool");\ndeadpool.classList.remove("mutant");',
    validate: function(scene) {
      const deadpool = scene.querySelector("#deadpool");
      return deadpool && !deadpool.classList.contains("mutant");
    }
  },
  {
    id: 19,
    topic: "classList.toggle",
    title: "Misja 19: Oznacz drugi cel",
    objective: "Krok 1: pobierz drugi element li z listy #squad-list. Krok 2: przełącz na nim klasę 'tagged' przez classList.toggle().",
    tips: ["Drugi element listy pobierzesz np. selektorem '#squad-list li:nth-child(2)'.", "toggle doda klasę, jeśli jej nie ma, albo usunie, jeśli już istnieje."],
    starter: 'const second = document.querySelector("#squad-list li:nth-child(2)");',
    solution: 'const second = document.querySelector("#squad-list li:nth-child(2)");\nsecond.classList.toggle("tagged");',
    validate: function(scene) {
      const second = scene.querySelector("#squad-list li:nth-child(2)");
      return second && second.classList.contains("tagged");
    }
  },
  {
    id: 20,
    topic: "classList.contains",
    title: "Misja 20: Potwierdź antybohatera",
    objective: "Krok 1: sprawdź, czy #deadpool ma klasę 'antihero' przez classList.contains(). Krok 2: jezeli wynik to true, dodaj klasę 'verified' do #mission-status.",
    tips: ["contains() zwraca true albo false i samo niczego nie zmienia w HTML.", "Dopiero w instrukcji if dodajesz klasę do drugiego elementu."],
    starter: 'const deadpool = document.getElementById("deadpool");\nconst status = document.getElementById("mission-status");',
    solution: 'const deadpool = document.getElementById("deadpool");\nconst status = document.getElementById("mission-status");\nif (deadpool.classList.contains("antihero")) {\n  status.classList.add("verified");\n}',
    validate: function(scene) {
      const status = scene.querySelector("#mission-status");
      return status && status.classList.contains("verified");
    }
  },
  {
    id: 21,
    topic: "setAttribute",
    title: "Misja 21: Flaga gotowości",
    objective: "Krok 1: pobierz element #mission-status. Krok 2: ustaw na nim atrybut data-ready o wartości 'yes' przy pomocy setAttribute().",
    tips: ["Atrybut data-ready zapisujesz jako tekst: 'data-ready'.", "Po wykonaniu zadania element powinien miec w HTML atrybut data-ready='yes'."],
    starter: 'const status = document.getElementById("mission-status");',
    solution: 'const status = document.getElementById("mission-status");\nstatus.setAttribute("data-ready", "yes");',
    validate: function(scene) {
      const status = scene.querySelector("#mission-status");
      return status && status.getAttribute("data-ready") === "yes";
    }
  },
  {
    id: 22,
    topic: "getAttribute",
    title: "Misja 22: Odczytaj poziom zagrożenia",
    objective: "Krok 1: pobierz #alien i odczytaj z niego atrybut data-threat przez getAttribute(). Krok 2: wpisz odczytaną wartość do #mission-status w formie tekstu 'Threat: 10'.",
    tips: ["getAttribute('data-threat') zwroci tekst, np. '10'.", "Potem polacz ten tekst z napisem 'Threat: '."],
    starter: 'const alien = document.getElementById("alien");\nconst status = document.getElementById("mission-status");',
    solution: 'const alien = document.getElementById("alien");\nconst status = document.getElementById("mission-status");\nconst threat = alien.getAttribute("data-threat");\nstatus.textContent = "Threat: " + threat;',
    validate: function(scene) {
      const status = scene.querySelector("#mission-status");
      return status && status.textContent.trim() === "Threat: 10";
    }
  },
  {
    id: 23,
    topic: "dataset write",
    title: "Misja 23: Zaznacz Venoma",
    objective: "Pobierz element #venom i zapisz w nim dane pomocnicze przez dataset: ustaw venom.dataset.ready = 'true'.",
    tips: ["dataset.ready odpowiada atrybutowi data-ready.", "Po tej operacji w HTML element Venoma ma miec data-ready='true'."],
    starter: 'const venom = document.getElementById("venom");',
    solution: 'const venom = document.getElementById("venom");\nvenom.dataset.ready = "true";',
    validate: function(scene) {
      const venom = scene.querySelector("#venom");
      return venom && venom.dataset.ready === "true";
    }
  },
  {
    id: 24,
    topic: "dataset read",
    title: "Misja 24: Odczytaj frakcje",
    objective: "Krok 1: odczytaj wartość #deadpool.dataset.faction. Krok 2: wpisz ten tekst do elementu #codeword-preview.",
    tips: ["dataset.faction odczytuje wartość z atrybutu data-faction.", "W tej scenie oczekiwana wartość to 'x-force'."],
    starter: 'const deadpool = document.getElementById("deadpool");\nconst preview = document.getElementById("codeword-preview");',
    solution: 'const deadpool = document.getElementById("deadpool");\nconst preview = document.getElementById("codeword-preview");\npreview.textContent = deadpool.dataset.faction;',
    validate: function(scene) {
      const preview = scene.querySelector("#codeword-preview");
      return preview && preview.textContent.trim() === "x-force";
    }
  },
  {
    id: 25,
    topic: "createElement + append",
    title: "Misja 25: Dodaj wpis do listy",
    objective: "Krok 1: utwórz nowy element li. Krok 2: wpisz do niego tekst 'Blade' i ustaw atrybut data-name='blade'. Krok 3: dodaj ten element na koniec listy #squad-list przez append().",
    tips: ["Najpierw tworzysz pusty element createElement('li').", "Dopiero potem ustawiasz mu tekst, atrybut i dopinasz go do DOM."],
    starter: 'const list = document.getElementById("squad-list");',
    solution: 'const list = document.getElementById("squad-list");\nconst li = document.createElement("li");\nli.textContent = "Blade";\nli.setAttribute("data-name", "blade");\nlist.append(li);',
    validate: function(scene) {
      const added = scene.querySelector('#squad-list li[data-name="blade"]');
      return !!added && added.textContent.trim() === "Blade";
    }
  },
  {
    id: 26,
    topic: "createElement + append",
    title: "Misja 26: Dodaj nową kartę",
    objective: "Krok 1: utwórz element article i ustaw mu id 'blade' oraz klasę 'character'. Krok 2: utwórz w nim nagłówek h3 z tekstem 'Blade'. Krok 3: dołącz całą kartę do #arena.",
    tips: ["article i h3 tworzysz osobno przez createElement().", "Najpierw włóż h3 do article, a dopiero potem article do #arena."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\nconst blade = document.createElement("article");\nblade.id = "blade";\nblade.className = "character";\nconst h3 = document.createElement("h3");\nh3.textContent = "Blade";\nblade.append(h3);\narena.append(blade);',
    validate: function(scene) {
      const blade = scene.querySelector("#blade");
      return blade && blade.classList.contains("character") && blade.querySelector("h3") && blade.querySelector("h3").textContent.trim() === "Blade";
    }
  },
  {
    id: 27,
    topic: "insertBefore",
    title: "Misja 27: Notatka przed arena",
    objective: "Krok 1: utwórz paragraf p o id 'warning-note' i tekscie 'UWAGA: Strefa zagrożenia'. Krok 2: wstaw go przed #arena przy pomocy insertBefore().",
    tips: ["insertBefore wywołujesz na rodzicu, czyli tutaj na #scene-root.", "Kolejność jest taka: root.insertBefore(nowyElement, arena)."],
    starter: 'const root = document.getElementById("scene-root");\nconst arena = document.getElementById("arena");',
    solution: 'const root = document.getElementById("scene-root");\nconst arena = document.getElementById("arena");\nconst note = document.createElement("p");\nnote.id = "warning-note";\nnote.textContent = "UWAGA: Strefa zagrożenia";\nroot.insertBefore(note, arena);',
    validate: function(scene) {
      const note = scene.querySelector("#warning-note");
      const arena = scene.querySelector("#arena");
      return note && arena && note.nextElementSibling === arena;
    }
  },
  {
    id: 28,
    topic: "remove",
    title: "Misja 28: Usuń Predatora",
    objective: "Krok 1: pobierz kartę #predator. Krok 2: usuń ten element z drzewa DOM.",
    tips: ["Po usunięciu element nie powinien już istnieć w scenie.", "Najprostsze rozwiązanie to predator.remove()."],
    starter: 'const predator = document.getElementById("predator");',
    solution: 'const predator = document.getElementById("predator");\npredator.remove();',
    validate: function(scene) {
      return scene.querySelector("#predator") === null;
    }
  },
  {
    id: 29,
    topic: "addEventListener click",
    title: "Misja 29: Licznik kliknięć",
    objective: "Krok 1: podepnij addEventListener('click', ...) do przycisku #panic-button. Krok 2: po kazdym kliknięciu zwieksz tekst w #panic-count o 1.",
    tips: ["Listener to funkcja, która uruchomi się po kliknięciu przycisku.", "Zawartość #panic-count jest tekstem, więc najpierw zamień ja na liczbę."],
    starter: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");',
    solution: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");\npanicBtn.addEventListener("click", () => {\n  panicCount.textContent = String(Number(panicCount.textContent) + 1);\n});',
    validate: function(scene) {
      const button = scene.querySelector("#panic-button");
      const counter = scene.querySelector("#panic-count");
      if (!button || !counter) return false;
      button.click();
      button.click();
      button.click();
      return counter.textContent.trim() === "3";
    }
  },
  {
    id: 30,
    topic: "addEventListener input",
    title: "Misja 30: Żywy podgląd",
    objective: "Krok 1: podepnij zdarzenie input do pola #codeword. Krok 2: przy wpisywaniu pokazuj w #codeword-preview ten sam tekst, ale zamieniony na DUŻE litery.",
    tips: ["W zdarzeniu input aktualną wartość pola znajdziesz w event.target.value.", "Do zamiany na duże litery uzyj toUpperCase()."],
    starter: 'const codeword = document.getElementById("codeword");\nconst preview = document.getElementById("codeword-preview");',
    solution: 'const codeword = document.getElementById("codeword");\nconst preview = document.getElementById("codeword-preview");\ncodeword.addEventListener("input", (event) => {\n  preview.textContent = event.target.value.toUpperCase();\n});',
    validate: function(scene) {
      const input = scene.querySelector("#codeword");
      const preview = scene.querySelector("#codeword-preview");
      if (!input || !preview) return false;
      input.value = "venom";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return preview.textContent.trim() === "VENOM";
    }
  },
  {
    id: 31,
    topic: "event delegation",
    title: "Misja 31: Delegacja na liście",
    objective: "Nie dodawaj listenera do kazdego <li> osobno. Zamiast tego ustaw jeden listener na #squad-list i spraw, aby kliknięty element <li> przełączał klasę 'tagged'.",
    tips: ["To jest delegacja zdarzeń: listener jest na rodzicu, ale reaguje na kliknięte dziecko.", "Sprawdź, czy event.target jest elementem li, np. przez matches('li')."],
    starter: 'const squadList = document.getElementById("squad-list");',
    solution: 'const squadList = document.getElementById("squad-list");\nsquadList.addEventListener("click", (event) => {\n  if (event.target.matches("li")) {\n    event.target.classList.toggle("tagged");\n  }\n});',
    validate: function(scene) {
      const second = scene.querySelector("#squad-list li:nth-child(2)");
      if (!second) return false;
      second.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return second.classList.contains("tagged");
    }
  },
  {
    id: 32,
    topic: "addEventListener once",
    title: "Misja 32: Jednorazowy listener",
    objective: "Dodaj do #panic-button listener click z opcją { once: true }. Po kliknięciu ma zwiększyć #panic-count, ale tylko przy pierwszym kliknięciu.",
    tips: ["Opcja { once: true } sama odczepi listener po pierwszym wywołaniu.", "Jeśli klikniesz kilka razy, licznik ma wzrosnac tylko do 1."],
    starter: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");',
    solution: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");\npanicBtn.addEventListener("click", () => {\n  panicCount.textContent = String(Number(panicCount.textContent) + 1);\n}, { once: true });',
    validate: function(scene) {
      const panicBtn = scene.querySelector("#panic-button");
      const panicCount = scene.querySelector("#panic-count");
      if (!panicBtn || !panicCount) return false;
      panicBtn.click();
      panicBtn.click();
      panicBtn.click();
      return panicCount.textContent.trim() === "1";
    }
  },
  {
    id: 33,
    topic: "removeEventListener",
    title: "Misja 33: Odłącz handler",
    objective: "Krok 1: utwórz funkcję panicHandler. Krok 2: dodaj ją jako listener click do #panic-button. Krok 3: od razu usuń ten sam listener przez removeEventListener().",
    tips: ["removeEventListener zadziała tylko wtedy, gdy przekażesz tą samą funkcję co przy addEventListener.", "Dlatego tutaj potrzebna jest funkcja nazwana, a nie anonimowa."],
    starter: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");\n\nfunction panicHandler() {\n  panicCount.textContent = String(Number(panicCount.textContent) + 1);\n}',
    solution: 'const panicBtn = document.getElementById("panic-button");\nconst panicCount = document.getElementById("panic-count");\n\nfunction panicHandler() {\n  panicCount.textContent = String(Number(panicCount.textContent) + 1);\n}\n\npanicBtn.addEventListener("click", panicHandler);\npanicBtn.removeEventListener("click", panicHandler);',
    validate: function(scene) {
      const panicBtn = scene.querySelector("#panic-button");
      const panicCount = scene.querySelector("#panic-count");
      if (!panicBtn || !panicCount) return false;
      panicBtn.click();
      panicBtn.click();
      return panicCount.textContent.trim() === "0";
    }
  },
  {
    id: 34,
    topic: "stopPropagation",
    title: "Misja 34: Zatrzymaj bubbling",
    objective: "Dodaj listener click do #deadpool i wewnątrz funkcji wywołaj event.stopPropagation(), aby kliknięcie nie dotarło wyżej do #arena.",
    tips: ["Bez stopPropagation zdarzenie przechodzi z dziecka do rodzica.", "Tutaj chodzi o zablokowanie tej drogi po kliknięciu karty Deadpoola."],
    starter: 'const deadpool = document.getElementById("deadpool");',
    solution: 'const deadpool = document.getElementById("deadpool");\ndeadpool.addEventListener("click", (event) => {\n  event.stopPropagation();\n});',
    validate: function(scene) {
      const bubbled = false;
      const arena = scene.querySelector("#arena");
      const deadpool = scene.querySelector("#deadpool");
      if (!arena || !deadpool) return false;
      arena.addEventListener("click", function() { bubbled = true; });
      deadpool.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return !bubbled;
    }
  },
  {
    id: 35,
    topic: "capture phase",
    title: "Misja 35: Faza przechwytywania",
    objective: "Ustaw listener click na #arena z opcją { capture: true }. Gdy kliknięcie ruszy przez DOM, listener ma zapisać arena.dataset.phase = 'capture-hit'.",
    tips: ["Listener w capture odpala się zanim zdarzenie dojdzie do klikniętego elementu.", "To pokazuje roóżznice między capture i bubbling."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\narena.addEventListener("click", () => {\n  arena.dataset.phase = "capture-hit";\n}, { capture: true });',
    validate: function(scene) {
      const arena = scene.querySelector("#arena");
      const deadpool = scene.querySelector("#deadpool");
      if (!arena || !deadpool) return false;
      deadpool.addEventListener("click", function(e) { e.stopPropagation(); }, { once: true });
      deadpool.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return arena.dataset.phase === "capture-hit";
    }
  },
  {
    id: 36,
    topic: "CustomEvent",
    title: "Misja 36: Finalny sygnał",
    objective: "Nasłuchuj na #scene-root własnego zdarzenia 'hunt:complete'. Gdy to zdarzenie się pojawi, ustaw tekst elementu #mission-status na 'Status: MISJA UKOŃCZONA'.",
    tips: ["'hunt:complete' to nazwa własnego zdarzenia aplikacji, a nie wbudowanego click czy input.", "Obsłużysz je tak samo jak inne zdarzenia: przez addEventListener()."],
    starter: 'const root = document.getElementById("scene-root");\nconst status = document.getElementById("mission-status");',
    solution: 'const root = document.getElementById("scene-root");\nconst status = document.getElementById("mission-status");\nroot.addEventListener("hunt:complete", () => {\n  status.textContent = "Status: MISJA UKOŃCZONA";\n});',
    validate: function(scene) {
      const status = scene.querySelector("#mission-status");
      scene.dispatchEvent(new CustomEvent("hunt:complete", { bubbles: true }));
      return status && status.textContent.trim() === "Status: MISJA UKOŃCZONA";
    }
  },
  {
    id: 37,
    topic: "closest",
    title: "Misja 37: Znajdź kartę po nagłówku",
    objective: "Krok 1: pobierz nagłówek #venom h3. Krok 2: przez closest('.character') znajdź kartę Venoma. Krok 3: ustaw na tej karcie atrybut data-found='yes'.",
    tips: ["closest() idzie od elementu w górę po drzewie DOM i szuka najbliższego pasującego przodka.", "Tutaj startujesz z h3, a chcesz dojść do całej karty article.character."],
    starter: 'const venomHeading = document.querySelector("#venom h3");',
    solution: 'const venomHeading = document.querySelector("#venom h3");\nconst venomCard = venomHeading.closest(".character");\nvenomCard.setAttribute("data-found", "yes");',
    validate: function(scene) {
      const venom = scene.querySelector("#venom");
      return venom && venom.getAttribute("data-found") === "yes";
    }
  },
  {
    id: 38,
    topic: "parentElement",
    title: "Misja 38: Wróć do rodzica",
    objective: "Krok 1: pobierz paragraf #alien .status. Krok 2: przejdź do jego parentElement. Krok 3: dodaj temu rodzicowi klasę 'inspected'.",
    tips: ["parentElement zwraca bezpośredniego rodzica elementu.", "Rodzicem paragrafu .status jest karta postaci Alien."],
    starter: 'const alienStatus = document.querySelector("#alien .status");',
    solution: 'const alienStatus = document.querySelector("#alien .status");\nconst alienCard = alienStatus.parentElement;\nalienCard.classList.add("inspected");',
    validate: function(scene) {
      const alien = scene.querySelector("#alien");
      return alien && alien.classList.contains("inspected");
    }
  },
  {
    id: 39,
    topic: "children",
    title: "Misja 39: Pracuj na dzieciach listy",
    objective: "Krok 1: pobierz #squad-list. Krok 2: przez właściwość children znajdź trzeci element listy. Krok 3: dodaj mu klasę 'tagged'.",
    tips: ["children zwraca dzieci-elementy bez tekstow i komentarzy.", "Trzeci element listy ma indeks 2."],
    starter: 'const squadList = document.getElementById("squad-list");',
    solution: 'const squadList = document.getElementById("squad-list");\nsquadList.children[2].classList.add("tagged");',
    validate: function(scene) {
      const third = scene.querySelector("#squad-list li:nth-child(3)");
      return third && third.classList.contains("tagged");
    }
  },
  {
    id: 40,
    topic: "disabled",
    title: "Misja 40: Odblokuj przycisk",
    objective: "Krok 1: pobierz przycisk #deploy-button. Krok 2: ustaw jego właściwość disabled na false, aby przycisk przestał być zablokowany.",
    tips: ["disabled to właściwość logiczna elementu formularza.", "Nie ustawiasz tekstu - zmieniasz stan przycisku."],
    starter: 'const deployButton = document.getElementById("deploy-button");',
    solution: 'const deployButton = document.getElementById("deploy-button");\ndeployButton.disabled = false;',
    validate: function(scene) {
      const button = scene.querySelector("#deploy-button");
      return button && button.disabled === false;
    }
  },
  {
    id: 41,
    topic: "checked",
    title: "Misja 41: Włącz tryb stealth",
    objective: "Krok 1: pobierz checkbox #stealth-mode. Krok 2: zaznacz go, ustawiajac checked = true.",
    tips: ["checked to właściwość typu true/false dla checkboxa.", "Po zadaniu checkbox ma być zaznaczony."],
    starter: 'const stealthMode = document.getElementById("stealth-mode");',
    solution: 'const stealthMode = document.getElementById("stealth-mode");\nstealthMode.checked = true;',
    validate: function(scene) {
      const checkbox = scene.querySelector("#stealth-mode");
      return checkbox && checkbox.checked === true;
    }
  },
  {
    id: 42,
    topic: "selected",
    title: "Misja 42: Zmień priorytet celu",
    objective: "Krok 1: pobierz select #target-priority. Krok 2: ustaw w nim wybraną opcję 'high'.",
    tips: ["Najprosciej ustawić select.value = 'high'.", "Po zmianie zaznaczona ma być opcja 'Wysoki'."],
    starter: 'const priority = document.getElementById("target-priority");',
    solution: 'const priority = document.getElementById("target-priority");\npriority.value = "high";',
    validate: function(scene) {
      const select = scene.querySelector("#target-priority");
      return select && select.value === "high";
    }
  },
  {
    id: 43,
    topic: "prepend",
    title: "Misja 43: Dodaj lidera na początek",
    objective: "Krok 1: utwórz nowy element li z tekstem 'Blade' i atrybutem data-name='blade'. Krok 2: dodaj go na początek listy #squad-list przy pomocy prepend().",
    tips: ["prepend() dodaje element na początku, a nie na końcu.", "Po wykonaniu zadania Blade ma być pierwszym elementem listy."],
    starter: 'const squadList = document.getElementById("squad-list");',
    solution: 'const squadList = document.getElementById("squad-list");\nconst li = document.createElement("li");\nli.textContent = "Blade";\nli.setAttribute("data-name", "blade");\nsquadList.prepend(li);',
    validate: function(scene) {
      const first = scene.querySelector("#squad-list li:first-child");
      return first && first.getAttribute("data-name") === "blade" && first.textContent.trim() === "Blade";
    }
  },
  {
    id: 44,
    topic: "before",
    title: "Misja 44: Briefing przed arena",
    objective: "Krok 1: utwórz paragraf o id 'briefing-note' z tekstem 'Briefing przed arena'. Krok 2: wstaw go bezpośrednio przed #arena przy pomocy metody before().",
    tips: ["Metodę before() wywołujesz na elemencie, przed ktorym chcesz cos wstawic.", "Tutaj arena.before(nowyParagraf)."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\nconst note = document.createElement("p");\nnote.id = "briefing-note";\nnote.textContent = "Briefing przed arena";\narena.before(note);',
    validate: function(scene) {
      const arena = scene.querySelector("#arena");
      const note = scene.querySelector("#briefing-note");
      return arena && note && note.nextElementSibling === arena;
    }
  },
  {
    id: 45,
    topic: "after",
    title: "Misja 45: Raport po walce",
    objective: "Krok 1: utwórz paragraf o id 'after-action'. Krok 2: ustaw jego tekst na 'Raport po walce'. Krok 3: wstaw go bezpośrednio za #arena przy pomocy after().",
    tips: ["after() wstawia element zaraz po wskazanym elemencie.", "Tutaj nowy paragraf ma być tuż za areną, a przed sekcją paneli."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\nconst note = document.createElement("p");\nnote.id = "after-action";\nnote.textContent = "Raport po walce";\narena.after(note);',
    validate: function(scene) {
      const arena = scene.querySelector("#arena");
      return arena && arena.nextElementSibling && arena.nextElementSibling.id === "after-action";
    }
  },
  {
    id: 46,
    topic: "removeChild",
    title: "Misja 46: Usuń pierwszy raport",
    objective: "Krok 1: pobierz listę #archive-list. Krok 2: przez removeChild() usuń z niej pierwszy element li.",
    tips: ["removeChild() wywołujesz na rodzicu i przekazujesz dziecko do usunięcia.", "Najpierw pobierz archiveList.firstElementChild, a potem usuń go z listy."],
    starter: 'const archiveList = document.getElementById("archive-list");',
    solution: 'const archiveList = document.getElementById("archive-list");\narchiveList.removeChild(archiveList.firstElementChild);',
    validate: function(scene) {
      const archiveList = scene.querySelector("#archive-list");
      if (!archiveList) return false;
      return archiveList.children.length === 2 && archiveList.children[0].textContent.trim() === "raport-beta";
    }
  },
  {
    id: 47,
    topic: "getElementsByTagName",
    title: "Misja 47: Ostatni raport",
    objective: "Krok 1: pobierz wszystkie elementy li z #archive-list przez getElementsByTagName(). Krok 2: dodaj klasę 'tagged' ostatniemu raportowi.",
    tips: ["getElementsByTagName() zwraca kolekcję wielu elementów, więc ostatni element pobierzesz przez reports[reports.length - 1].", "Metodę możesz wywołać na konkretnym elemencie, np. na liście #archive-list."],
    starter: 'const reports = document.getElementById("archive-list").getElementsByTagName("li");',
    solution: 'const reports = document.getElementById("archive-list").getElementsByTagName("li");\nreports[reports.length - 1].classList.add("tagged");',
    validate: function(scene) {
      const lastReport = scene.querySelector("#archive-list li:last-child");
      return lastReport && lastReport.classList.contains("tagged");
    }
  },
  {
    id: 48,
    topic: "getElementsByTagName",
    title: "Misja 48: Zmień drugi wpis",
    objective: "Krok 1: pobierz wszystkie elementy li z #squad-list przez getElementsByTagName(). Krok 2: ustaw textContent drugiego elementu na 'Predator Elite'.",
    tips: ["Po pobraniu kolekcji drugi element ma indeks 1.", "textContent podmienia cały tekst wewnątrz wskazanego elementu."],
    starter: 'const squadItems = document.getElementById("squad-list").getElementsByTagName("li");',
    solution: 'const squadItems = document.getElementById("squad-list").getElementsByTagName("li");\nsquadItems[1].textContent = "Predator Elite";',
    validate: function(scene) {
      const second = scene.querySelector("#squad-list li:nth-child(2)");
      return second && second.textContent.trim() === "Predator Elite";
    }
  },
  {
    id: 49,
    topic: "style",
    title: "Misja 49: Podświetl alert",
    objective: "Pobierz #alert-panel i ustaw mu style.backgroundColor na 'rgb(132, 255, 181)' oraz style.color na 'rgb(19, 32, 24)'.",
    tips: ["W JavaScript właściwości stylu zapisujesz camelCase, np. backgroundColor.", "Obie wartości ustawiasz bezpośrednio przez panel.style.nazwaWłaściwości."],
    starter: 'const panel = document.getElementById("alert-panel");',
    solution: 'const panel = document.getElementById("alert-panel");\npanel.style.backgroundColor = "rgb(132, 255, 181)";\npanel.style.color = "rgb(19, 32, 24)";',
    validate: function(scene) {
      const panel = scene.querySelector("#alert-panel");
      return panel && panel.style.backgroundColor === "rgb(132, 255, 181)" && panel.style.color === "rgb(19, 32, 24)";
    }
  },
  {
    id: 50,
    topic: "textContent",
    title: "Misja 50: Status gotowości",
    objective: "Pobierz #mission-status i ustaw jego textContent na 'Status: GOTOWE'.",
    tips: ["textContent podmienia cały tekst elementu.", "Najpierw pobierz element, potem ustaw nową wartość przez znak =."],
    starter: 'const status = document.getElementById("mission-status");',
    solution: 'const status = document.getElementById("mission-status");\nstatus.textContent = "Status: GOTOWE";',
    validate: function(scene) {
      const status = scene.querySelector("#mission-status");
      return status && status.textContent.trim() === "Status: GOTOWE";
    }
  },
  {
    id: 51,
    topic: "innerHTML",
    title: "Misja 51: Wstaw szybki briefing",
    objective: "Pobierz #intel-feed i ustaw jego innerHTML na '<li>sygnal-1</li><li>sygnal-2</li>'.",
    tips: ["innerHTML pozwala wstawić gotowy HTML jako tekst.", "Po ustawieniu innerHTML stare dzieci elementu zostaną zastąpione nową zawartością."],
    starter: 'const feed = document.getElementById("intel-feed");',
    solution: 'const feed = document.getElementById("intel-feed");\nfeed.innerHTML = "<li>sygnal-1</li><li>sygnal-2</li>";',
    validate: function(scene) {
      const items = scene.querySelectorAll("#intel-feed li");
      return items.length === 2 && items[0].textContent.trim() === "sygnal-1" && items[1].textContent.trim() === "sygnal-2";
    }
  },
  {
    id: 52,
    topic: "children",
    title: "Misja 52: Oznacz co drugi cel",
    objective: "Krok 1: pobierz #arena. Krok 2: używając children ustaw style.outline = '2px solid gold' dla 2. i 4. dziecka.",
    tips: ["Kolekcja children zawiera tylko elementy-dzieci i jest indeksowana od zera.", "Drugie dziecko to children[1], a czwarte to children[3]."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\narena.children[1].style.outline = "2px solid gold";\narena.children[3].style.outline = "2px solid gold";',
    validate: function(scene) {
      const arena = scene.querySelector("#arena");
      return arena && arena.children[1].style.outline === "2px solid gold" && arena.children[3].style.outline === "2px solid gold" && !arena.children[0].style.outline && !arena.children[2].style.outline && !arena.children[4].style.outline;
    }
  },
  {
    id: 53,
    topic: "style",
    title: "Misja 53: Zaznacz statusy",
    objective: "Pobierz wszystkie elementy .status i ustaw im style.fontWeight na '700'.",
    tips: ["querySelectorAll() zwróci NodeList, po której możesz przejść przez forEach().", "fontWeight ustawiasz jako tekst, np. '700'."],
    starter: 'const statuses = document.querySelectorAll(".status");',
    solution: 'const statuses = document.querySelectorAll(".status");\nstatuses.forEach(function(status) {\n  status.style.fontWeight = "700";\n});',
    validate: function(scene) {
      const statuses = scene.querySelectorAll(".status");
      return statuses.length > 0 && Array.from(statuses).every(function(status) { return status.style.fontWeight === "700"; });
    }
  },
  {
    id: 54,
    topic: "createElement + append",
    title: "Misja 54: Dopisz nowy raport",
    objective: "Krok 1: utwórz element li. Krok 2: ustaw jego textContent na 'raport-delta'. Krok 3: dodaj go na koniec #archive-list.",
    tips: ["append() dodaje nowy element na koniec rodzica.", "Najpierw utwórz li, potem ustaw tekst, a dopiero na końcu dopnij go do listy."],
    starter: 'const archiveList = document.getElementById("archive-list");',
    solution: 'const archiveList = document.getElementById("archive-list");\nconst li = document.createElement("li");\nli.textContent = "raport-delta";\narchiveList.append(li);',
    validate: function(scene) {
      const last = scene.querySelector("#archive-list li:last-child");
      return last && last.textContent.trim() === "raport-delta";
    }
  },
  {
    id: 55,
    topic: "remove",
    title: "Misja 55: Usuń opis archiwum",
    objective: "Pobierz paragraf znajdujący się w #archive-panel i usuń go ze strony.",
    tips: ["Możesz pobrać paragraf selektorem '#archive-panel p'.", "remove() całkowicie usuwa wskazany element z DOM."],
    starter: 'const archiveLabel = document.querySelector("#archive-panel p");',
    solution: 'const archiveLabel = document.querySelector("#archive-panel p");\narchiveLabel.remove();',
    validate: function(scene) {
      return !scene.querySelector("#archive-panel p");
    }
  },
  {
    id: 56,
    topic: "createElement + append",
    title: "Misja 56: Dodaj notatkę do panelu",
    objective: "Krok 1: utwórz element p o id 'ops-note'. Krok 2: ustaw jego textContent na 'Tryb nocny aktywny'. Krok 3: dodaj go na koniec #ops-panel.",
    tips: ["Nowy element możesz od razu oznaczyć przez note.id = 'ops-note'.", "Po append() paragraf ma znaleźć się wewnątrz panelu #ops-panel."],
    starter: 'const opsPanel = document.getElementById("ops-panel");',
    solution: 'const opsPanel = document.getElementById("ops-panel");\nconst note = document.createElement("p");\nnote.id = "ops-note";\nnote.textContent = "Tryb nocny aktywny";\nopsPanel.append(note);',
    validate: function(scene) {
      const note = scene.querySelector("#ops-note");
      const panel = scene.querySelector("#ops-panel");
      return note && panel && note.parentElement === panel && note.textContent.trim() === "Tryb nocny aktywny";
    }
  },
  {
    id: 57,
    topic: "querySelectorAll",
    title: "Misja 57: Oznacz wszystkie cele",
    objective: "Pobierz wszystkie .character i przez forEach dodaj każdemu klasę 'tagged'.",
    tips: ["querySelectorAll() zwraca NodeList, więc możesz od razu użyć forEach().", "W ciele pętli wywołaj card.classList.add('tagged')."],
    starter: 'const cards = document.querySelectorAll(".character");',
    solution: 'const cards = document.querySelectorAll(".character");\ncards.forEach(function(card) {\n  card.classList.add("tagged");\n});',
    validate: function(scene) {
      const cards = scene.querySelectorAll(".character");
      return cards.length > 0 && Array.from(cards).every(function(card) { return card.classList.contains("tagged"); });
    }
  },
  {
    id: 58,
    topic: "children",
    title: "Misja 58: Pokoloruj co drugi",
    objective: "Krok 1: pobierz #arena. Krok 2: używając pętli for ustaw style.outline = '2px solid gold' dla elementów o indeksach 1, 3, 5... w arena.children.",
    tips: ["W pętli for możesz zacząć od i = 1 i zwiększać i o 2.", "children to kolekcja elementów-dzieci rodzica."],
    starter: 'const arena = document.getElementById("arena");',
    solution: 'const arena = document.getElementById("arena");\nfor (let i = 1; i < arena.children.length; i += 2) {\n  arena.children[i].style.outline = "2px solid gold";\n}',
    validate: function(scene) {
      const arena = scene.querySelector("#arena");
      if (!arena) return false;
      for (let i = 0; i < arena.children.length; i++) {
        const outlined = arena.children[i].style.outlineWidth === "2px" && arena.children[i].style.outlineStyle === "solid";
        if (i % 2 === 1 && !outlined) return false;
        if (i % 2 === 0 && outlined) return false;
      }
      return true;
    }
  },
  {
    id: 59,
    topic: "querySelectorAll",
    title: "Misja 59: Numeracja drużyny",
    objective: "Pobierz wszystkie elementy '#squad-list li' i przez forEach ustaw każdemu textContent w formacie 'Cel X', gdzie X to numer od 1.",
    tips: ["forEach przekazuje drugi argument index.", "Wzór: item.textContent = 'Cel ' + (index + 1)."],
    starter: 'const squadItems = document.querySelectorAll("#squad-list li");',
    solution: 'const squadItems = document.querySelectorAll("#squad-list li");\nsquadItems.forEach(function(item, index) {\n  item.textContent = "Cel " + (index + 1);\n});',
    validate: function(scene) {
      const items = scene.querySelectorAll("#squad-list li");
      return items.length === 3 && items[0].textContent.trim() === "Cel 1" && items[1].textContent.trim() === "Cel 2" && items[2].textContent.trim() === "Cel 3";
    }
  },
  {
    id: 60,
    topic: "style",
    title: "Misja 60: Styl statusów pętlą",
    objective: "Pobierz wszystkie .status i w pętli forEach ustaw style.textTransform na 'uppercase' oraz style.letterSpacing na '1px'.",
    tips: ["Na każdym elemencie status ustaw obie właściwości stylu.", "textTransform i letterSpacing zapisujemy camelCase."],
    starter: 'const statuses = document.querySelectorAll(".status");',
    solution: 'const statuses = document.querySelectorAll(".status");\nstatuses.forEach(function(status) {\n  status.style.textTransform = "uppercase";\n  status.style.letterSpacing = "1px";\n});',
    validate: function(scene) {
      const statuses = scene.querySelectorAll(".status");
      return statuses.length > 0 && Array.from(statuses).every(function(status) {
        return status.style.textTransform === "uppercase" && status.style.letterSpacing === "1px";
      });
    }
  },
  {
    id: 61,
    topic: "createElement + append",
    title: "Misja 61: Dodaj trzy komunikaty",
    objective: "Krok 1: pobierz #intel-feed. Krok 2: przez pętlę dodaj trzy elementy li z tekstami: 'ping-1', 'ping-2', 'ping-3'.",
    tips: ["W każdej iteracji utwórz nowe li i dopnij je przez append().", "Uważaj, aby dodać dokładnie trzy wpisy."],
    starter: 'const feed = document.getElementById("intel-feed");',
    solution: 'const feed = document.getElementById("intel-feed");\n["ping-1", "ping-2", "ping-3"].forEach(function(text) {\n  const li = document.createElement("li");\n  li.textContent = text;\n  feed.append(li);\n});',
    validate: function(scene) {
      const items = scene.querySelectorAll("#intel-feed li");
      return items.length === 3 && items[0].textContent.trim() === "ping-1" && items[1].textContent.trim() === "ping-2" && items[2].textContent.trim() === "ping-3";
    }
  },
  {
    id: 62,
    topic: "remove",
    title: "Misja 62: Wyczyść wszystkie statusy",
    objective: "Pobierz wszystkie elementy .status i usuń je ze strony (masowe usuwanie).",
    tips: ["Najpierw pobierz listę elementów, potem przejdź po niej pętlą i wywołaj remove().", "Po wykonaniu zadania nie powinno zostać ani jedno .status."],
    starter: 'const statuses = document.querySelectorAll(".status");',
    solution: 'const statuses = document.querySelectorAll(".status");\nstatuses.forEach(function(status) {\n  status.remove();\n});',
    validate: function(scene) {
      return scene.querySelectorAll(".status").length === 0;
    }
  },
  {
    id: 63,
    topic: "createElement + append",
    title: "Misja 63: Rozbuduj archiwum",
    objective: "Pobierz #archive-list i dodaj do niego pięć nowych li: 'raport-d1' do 'raport-d5'.",
    tips: ["W pętli for łatwo wygenerujesz kolejne nazwy wpisów.", "Nowe raporty dodawaj append() na końcu listy."],
    starter: 'const archiveList = document.getElementById("archive-list");',
    solution: 'const archiveList = document.getElementById("archive-list");\nfor (let i = 1; i <= 5; i++) {\n  const li = document.createElement("li");\n  li.textContent = "raport-d" + i;\n  archiveList.append(li);\n}',
    validate: function(scene) {
      const items = scene.querySelectorAll("#archive-list li");
      return items.length === 8 && items[3].textContent.trim() === "raport-d1" && items[7].textContent.trim() === "raport-d5";
    }
  },
  {
    id: 64,
    topic: "removeChild",
    title: "Misja 64: Zostaw tylko pierwszy raport",
    objective: "Pobierz #archive-list i przez pętlę usuwaj dzieci tak długo, aż zostanie tylko pierwszy element li.",
    tips: ["Możesz użyć while (archiveList.children.length > 1).", "W removeChild usuń np. archiveList.lastElementChild."],
    starter: 'const archiveList = document.getElementById("archive-list");',
    solution: 'const archiveList = document.getElementById("archive-list");\nwhile (archiveList.children.length > 1) {\n  archiveList.removeChild(archiveList.lastElementChild);\n}',
    validate: function(scene) {
      const list = scene.querySelector("#archive-list");
      return list && list.children.length === 1 && list.children[0].textContent.trim() === "raport-alpha";
    }
  },
  {
    id: 65,
    topic: "style",
    title: "Misja 65: Styl kart - promień i tło",
    objective: "Pobierz wszystkie .character i ustaw każdej karcie style.borderRadius na '18px' oraz style.backgroundColor na 'rgba(22, 31, 56, 0.85)'.",
    tips: ["To pierwszy poziom bloku stylowania kart postaci.", "Najwygodniej zrobić to pętlą forEach po .character."],
    starter: 'const cards = document.querySelectorAll(".character");',
    solution: 'const cards = document.querySelectorAll(".character");\ncards.forEach(function(card) {\n  card.style.borderRadius = "18px";\n  card.style.backgroundColor = "rgba(22, 31, 56, 0.85)";\n});',
    validate: function(scene) {
      const cards = scene.querySelectorAll(".character");
      return cards.length > 0 && Array.from(cards).every(function(card) {
        return card.style.borderRadius === "18px" && card.style.backgroundColor !== "";
      });
    }
  },
  {
    id: 66,
    topic: "style",
    title: "Misja 66: Styl listy - zebra",
    objective: "Pobierz elementy '#squad-list li' i ustaw style.backgroundColor tylko dla parzystych pozycji (2, 4, ...) na 'rgba(120, 170, 255, 0.2)'.",
    tips: ["Parzyste pozycje mają indeks nieparzysty (1, 3, ...).", "Nie ustawiaj tła dla pozycji nieparzystych."],
    starter: 'const squadItems = document.querySelectorAll("#squad-list li");',
    solution: 'const squadItems = document.querySelectorAll("#squad-list li");\nfor (let i = 1; i < squadItems.length; i += 2) {\n  squadItems[i].style.backgroundColor = "rgba(120, 170, 255, 0.2)";\n}',
    validate: function(scene) {
      const items = scene.querySelectorAll("#squad-list li");
      if (items.length === 0) return false;
      for (let i = 0; i < items.length; i++) {
        const hasColor = items[i].style.backgroundColor !== "";
        if (i % 2 === 1 && !hasColor) return false;
        if (i % 2 === 0 && hasColor) return false;
      }
      return true;
    }
  },
  {
    id: 67,
    topic: "style",
    title: "Misja 67: Styl kart wg zagrożenia",
    objective: "Pobierz wszystkie .character i dla kart z data-threat >= 9 ustaw style.outline na '2px solid crimson', a dla pozostałych style.outline na '2px solid limegreen'.",
    tips: ["Odczytaj zagrożenie przez Number(card.dataset.threat).", "Użyj warunku if/else wewnątrz pętli."],
    starter: 'const cards = document.querySelectorAll(".character");',
    solution: 'const cards = document.querySelectorAll(".character");\ncards.forEach(function(card) {\n  const threat = Number(card.dataset.threat);\n  if (threat >= 9) {\n    card.style.outline = "2px solid crimson";\n  } else {\n    card.style.outline = "2px solid limegreen";\n  }\n});',
    validate: function(scene) {
      const cards = scene.querySelectorAll(".character");
      if (cards.length === 0) return false;
      return Array.from(cards).every(function(card) {
        const threat = Number(card.dataset.threat);
        const outlineColor = card.style.outlineColor;
        if (threat >= 9) return outlineColor.indexOf("crimson") !== -1 || outlineColor.indexOf("220") !== -1;
        return outlineColor.indexOf("limegreen") !== -1 || outlineColor.indexOf("50") !== -1;
      });
    }
  },
  {
    id: 68,
    topic: "style",
    title: "Misja 68: Finalny polish kart i listy",
    objective: "Krok 1: ustaw wszystkim .character style.boxShadow na '0 0 0 2px rgba(255,255,255,0.15)'. Krok 2: ustaw wszystkim '#archive-list li' style.fontStyle na 'italic'.",
    tips: ["To finałowy poziom bloku stylowania: jednocześnie karty i lista.", "Zrób dwie osobne pętle: jedną po kartach, drugą po wpisach archiwum."],
    starter: 'const cards = document.querySelectorAll(".character");',
    solution: 'const cards = document.querySelectorAll(".character");\ncards.forEach(function(card) {\n  card.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.15)";\n});\nconst archiveItems = document.querySelectorAll("#archive-list li");\narchiveItems.forEach(function(item) {\n  item.style.fontStyle = "italic";\n});',
    validate: function(scene) {
      const cards = scene.querySelectorAll(".character");
      const archiveItems = scene.querySelectorAll("#archive-list li");
      if (!cards.length || !archiveItems.length) return false;
      const cardsOk = Array.from(cards).every(function(card) { return card.style.boxShadow !== ""; });
      const listOk = Array.from(archiveItems).every(function(item) { return item.style.fontStyle === "italic"; });
      return cardsOk && listOk;
    }
  }
];

const METHOD_GUIDES = {
  "getElementById": {
    summary: "Pobiera jeden element po jego id. To dobra metoda, gdy znasz dokładne id elementu.",
    example: 'const el = document.getElementById("deadpool");'
  },
  "querySelector": {
    summary: "Zwraca tylko pierwszy element pasujacy do selektora CSS (albo null, jeśli nic nie znaleziono).",
    example: 'const el = document.querySelector("#venom .status");'
  },
  "querySelectorAll": {
    summary: "Zwraca wszystkie pasujące elementy jako NodeList (lista statyczna), a nie pojedynczy element. NodeList obsługuje forEach() bezpośrednio.",
    example: 'const list = document.querySelectorAll(".character");\nlist.forEach(el => console.log(el));'
  },
  "getElementsByClassName": {
    summary: "Pobiera elementy po klasie jako HTMLCollection. To kolekcja wielu elementów, nie pojedynczy element. HTMLCollection nie obsługuje forEach() — żeby użyć forEach, trzeba najpierw przekształcić kolekcję na tablicę: Array.from(collection).",
    example: 'const items = document.getElementsByClassName("hunter");\nArray.from(items).forEach(el => console.log(el));'
  },
  "closest": {
    summary: "Szuka najblizszego przodka pasujacego do selektora, zaczynajac od aktualnego elementu i idac w gore drzewa DOM.",
    example: 'const card = heading.closest(".character");'
  },
  "parentElement": {
    summary: "Zwraca bezposredniego rodzica danego elementu.",
    example: 'const parent = status.parentElement;'
  },
  "children": {
    summary: "Zwraca kolekcje dzieci-elementów znajdujacych się bezposrednio wewnątrz rodzica.",
    example: 'const third = list.children[2];'
  },
  "getElementsByTagName": {
    summary: "Pobiera elementy po nazwie tagu, np. wszystkie li, article albo p. Zwraca zywa kolekcje HTMLCollection.",
    example: 'const items = document.getElementsByTagName("li");'
  },
  "textContent": {
    summary: "Odczytuje albo podmienia sam tekst elementu, bez interpretowania HTML.",
    example: 'status.textContent = "Status: GOTOWE";'
  },
  "innerHTML": {
    summary: "Pozwala wstawic lub odczytac zawartosc HTML wewnątrz elementu. Uzywaj go wtedy, gdy chcesz podmienic cale wnętrze elementu na markup.",
    example: 'feed.innerHTML = "<li>sygnal-1</li><li>sygnal-2</li>";'
  },
  "style": {
    summary: "Ustawia style inline bezposrednio na elemencie przez obiekt style i nazwy właściwosci zapisane camelCase.",
    example: 'panel.style.backgroundColor = "rgb(132, 255, 181)";'
  },
  "classList.add": {
    summary: "Dodaje klasę CSS do elementu.",
    example: 'panel.classList.add("active");'
  },
  "classList.remove": {
    summary: "Usuwa klasę CSS z elementu.",
    example: 'deadpool.classList.remove("mutant");'
  },
  "classList.toggle": {
    summary: "Przełącza klasę: dodaje albo usuwa.",
    example: 'item.classList.toggle("tagged");'
  },
  "classList.contains": {
    summary: "Sprawdza, czy element ma daną klasę.",
    example: 'deadpool.classList.contains("antihero");'
  },
  "setAttribute": {
    summary: "Ustawia atrybut na elemencie.",
    example: 'status.setAttribute("data-ready", "yes");'
  },
  "getAttribute": {
    summary: "Odczytuje wartość atrybutu.",
    example: 'alien.getAttribute("data-threat");'
  },
  "dataset write": {
    summary: "Ustawia atrybut data-* przez obiekt dataset.",
    example: 'venom.dataset.ready = "true";'
  },
  "dataset read": {
    summary: "Czyta atrybut data-* przez obiekt dataset.",
    example: 'deadpool.dataset.faction;'
  },
  "disabled": {
    summary: "Steruje tym, czy element formularza jest aktywny czy zablokowany.",
    example: 'button.disabled = false;'
  },
  "checked": {
    summary: "Steruje stanem zaznaczenia checkboxa albo radio buttona.",
    example: 'checkbox.checked = true;'
  },
  "selected": {
    summary: "Pozwala wybrac opcje w elemencie select, najczesciej przez ustawienie select.value.",
    example: 'select.value = "high";'
  },
  "createElement + append": {
    summary: "Tworzy nowy element i dopina go do DOM.",
    example: 'const li = document.createElement("li");\nlist.append(li);'
  },
  "prepend": {
    summary: "Dodaje nowy element na poczatku zawartośći wskazanego rodzica.",
    example: 'list.prepend(li);'
  },
  "before": {
    summary: "Wstawia nowy element bezposrednio przed wskazanym elementem.",
    example: 'arena.before(note);'
  },
  "after": {
    summary: "Wstawia nowy element bezposrednio za wskazanym elementem.",
    example: 'arena.after(note);'
  },
  "insertBefore": {
    summary: "Wstawia element przed innym elementem.",
    example: 'root.insertBefore(note, arena);'
  },
  "remove": {
    summary: "Usuwa element z DOM.",
    example: 'predator.remove();'
  },
  "removeChild": {
    summary: "Usuwa wskazane dziecko z rodzica. Metode wywołujesz na rodzicu, a nie na samym dziecku.",
    example: 'list.removeChild(list.firstElementChild);'
  },
  "addEventListener click": {
    summary: "Dodaje reakcje na kliknięcie.",
    example: 'button.addEventListener("click", handler);'
  },
  "addEventListener input": {
    summary: "Dodaje reakcje na wpisywanie do inputa.",
    example: 'input.addEventListener("input", handler);'
  },
  "event delegation": {
    summary: "Ustawia jeden listener na rodzicu i obsługuje dzieci przez event.target.",
    example: 'list.addEventListener("click", (event) => {\n  if (event.target.matches("li")) { }\n});'
  },
  "addEventListener once": {
    summary: "Listener wykona się tylko raz.",
    example: 'button.addEventListener("click", handler, { once: true });'
  },
  "removeEventListener": {
    summary: "Usuwa wczesniej podpiety listener.",
    example: 'button.removeEventListener("click", panicHandler);'
  },
  "stopPropagation": {
    summary: "Zatrzymuje propagacje zdarzenia do rodzicow.",
    example: 'event.stopPropagation();'
  },
  "capture phase": {
    summary: "Ustawia listener w fazie przechwytywania, zanim event dotrze do targetu.",
    example: 'arena.addEventListener("click", handler, { capture: true });'
  },
  "CustomEvent": {
    summary: "Obsługuje lub tworzy wlasne zdarzenia aplikacji.",
    example: 'root.addEventListener("hunt:complete", handler);'
  }
};

const TOPIC_BEGINNER_TIPS = {
  "getElementById": [
    "W getElementById podajesz samo id bez znaku #, np. 'deadpool'.",
    "Ta metoda zwraca jeden element albo null, gdy nic nie znajdzie."
  ],
  "querySelector": [
    "querySelector przyjmuje selektor CSS zapisany jako tekst.",
    "#(hash) oznacza id, .(kropka) oznacza klasę, a spacja oznacza element wewnątrz innego elementu.",
    "Jeśli selektor pasuje do kilku elementów, dostaniesz tylko pierwszy z nich."
  ],
  "querySelectorAll": [
    "querySelectorAll zwraca NodeList — możesz od razu użyć na niej forEach().",
    "Przecinek w selektorze oznacza: znajdź elementy pasujące do pierwszego albo drugiego fragmentu.",
    "NodeList NIE jest tablicą, ale ma wbudowane forEach(), co ułatwia pracę."
  ],
  "getElementsByClassName": [
    "getElementsByClassName zwraca HTMLCollection, a nie NodeList — HTMLCollection nie ma forEach().",
    "Aby użyć forEach na HTMLCollection, przekształć ją najpierw: Array.from(collection).forEach(...).",
    "Do pojedynczego elementu z tej kolekcji dostajesz się np. przez [0] albo [1]."
  ],
  "closest": [
    "closest() jest przydatne, gdy startujesz od dziecka i chcesz dojsc do najblizszego pasujacego rodzica."
  ],
  "parentElement": [
    "parentElement zwraca tylko bezposredniego rodzica, jeden poziom wyzej."
  ],
  "children": [
    "children zwraca same elementy-dzieci bez tekstow i komentarzy.",
    "Elementy w children pobierasz po indeksie: 0, 1, 2..."
  ],
  "getElementsByTagName": [
    "getElementsByTagName() zwraca HTMLCollection, czyli kolekcję wielu elementów o danym tagu.",
    "Metodę możesz wywołać na document albo na konkretnym elemencie-rodzicu, żeby zawęzić obszar wyszukiwania.",
    "HTMLCollection nie ma forEach(), więc pojedyncze elementy pobierasz po indeksie albo zamieniasz kolekcję przez Array.from(...)."
  ],
  "textContent": [
    "textContent traktuje wszystko jako zwykły tekst, więc nie tworzy nowych tagów HTML.",
    "Gdy ustawiasz textContent, stara treść tekstowa elementu zostaje zastąpiona nową wartością."
  ],
  "innerHTML": [
    "innerHTML interpretuje przekazany tekst jako HTML i wstawia nowe elementy do środka.",
    "Po ustawieniu innerHTML dotychczasowa zawartość elementu zostaje podmieniona."
  ],
  "style": [
    "W JavaScript właściwości CSS zapisujesz camelCase, np. backgroundColor zamiast background-color.",
    "style dotyczy stylów inline tylko dla konkretnego elementu."
  ],
  "classList.add": [
    "classList.add() dodaje klasę, ale nie usuwa innych klas elementu."
  ],
  "classList.remove": [
    "classList.remove() usuwa tylko wskazana klasę, reszta klas zostaje bez zmian."
  ],
  "classList.toggle": [
    "toggle() dziala jak przełącznik: jeśli klasy nie ma, doda ja; jeśli jest, usunie ja."
  ],
  "classList.contains": [
    "contains() nic nie zmienia w DOM. Ona tylko sprawdza i zwraca true albo false."
  ],
  "setAttribute": [
    "setAttribute() ustawia atrybut jako tekst, np. data-ready='yes'."
  ],
  "getAttribute": [
    "getAttribute() odczytuje wartość atrybutu jako tekst."
  ],
  "dataset write": [
    "dataset.ready = 'true' odpowiada atrybutowi data-ready='true'."
  ],
  "dataset read": [
    "dataset.faction odczytuje wartość z atrybutu data-faction."
  ],
  "disabled": [
    "disabled = true blokuje element formularza, a disabled = false go odblokowuje."
  ],
  "checked": [
    "checked przyjmuje wartość logiczna true albo false."
  ],
  "selected": [
    "Najwygodniej zmienic wybrana opcje przez ustawienie value na select."
  ],
  "createElement + append": [
    "Najpierw tworzysz element, potem ustawiasz mu tekst, klasy albo atrybuty, a na końcu dodajesz go do DOM."
  ],
  "prepend": [
    "prepend() dodaje nowy element na poczatek zawartośći rodzica."
  ],
  "before": [
    "before() wywołujesz na elemencie, przed ktorym chcesz cos wstawic."
  ],
  "after": [
    "after() wywołujesz na elemencie, za ktorym chcesz cos wstawic."
  ],
  "insertBefore": [
    "insertBefore() wywołujesz na rodzicu: parent.insertBefore(nowyElement, elementOdniesienia)."
  ],
  "remove": [
    "remove() calkowicie usuwa element z drzewa DOM."
  ],
  "removeChild": [
    "removeChild() wywołujesz na rodzicu i przekazujesz mu dziecko do usuniecia."
  ],
  "addEventListener click": [
    "Listener click odpala funkcje po kliknięciu elementu."
  ],
  "addEventListener input": [
    "Zdarzenie input odpala się podczas wpisywania do pola tekstowego."
  ],
  "event delegation": [
    "Delegacja oznacza, że listener wieszasz na rodzicu, a kliknięte dziecko rozpoznajesz przez event.target."
  ],
  "addEventListener once": [
    "Opcja { once: true } sprawia, że listener sam usunie się po pierwszym wywołaniu."
  ],
  "removeEventListener": [
    "Aby removeEventListener zadziałało, musisz przekazać tą samą funkcję, która była dodana."
  ],
  "stopPropagation": [
    "stopPropagation() zatrzymuje przechodzenie zdarzenia do rodziców w fazie bubbling."
  ],
  "capture phase": [
    "Capture to faza, w ktorej zdarzenie schodzi od rodzica do dziecka, zanim dotrze do klikniętego elementu."
  ],
  "CustomEvent": [
    "CustomEvent pozwala tworzyć własne zdarzenia, np. 'hunt:complete'."
  ]
};

const SCENE_SELECTOR_GUIDES = {
  "#scene-root": "glowny kontener calej sceny. To w nim renderowane sa arena i panele.",
  "#arena": "sekcja z kartami postaci. To glowny obszar sceny DOM.",
  "#deadpool": "karta postaci Deadpoola. To element <article> w sekcji #arena.",
  "#predator": "karta postaci Predatora. To element <article> w sekcji #arena.",
  "#pennywise": "karta postaci Pennywise'a. To element <article> w sekcji #arena.",
  "#alien": "karta postaci Aliena. To element <article> w sekcji #arena.",
  "#venom": "karta postaci Venoma. To element <article> w sekcji #arena.",
  "#venom .status": "paragraf <p class=\"status\"> znajdujacy się wewnątrz karty Venoma.",
  "#alert-panel": "panel alarmu. To element <div> w sekcji narzedzi.",
  "#panic-button": "przycisk 'Panika!'. To element <button>.",
  "#panic-count": "licznik kliknięć obok przycisku 'Panika!'. To element <span>.",
  "#codeword": "pole tekstowe do wpisywania kodu operacyjnego. To element <input>.",
  "#codeword-preview": "paragraf pokazujacy podglad wpisanego kodu.",
  "#ops-form": "formularz z kontrolkami do cwiczen disabled, checked i selected.",
  "#stealth-mode": "checkbox formularza. Mozna go zaznaczyc przez checked = true.",
  "#target-priority": "pole select z opcjami priorytetu celu.",
  "#deploy-button": "przycisk formularza startowo zablokowany przez disabled.",
  "#squad-list": "lista druzyny. To element <ul> z elementami <li> w srodku.",
  "#squad-list li": "elementy listy <li> znajdujace się wewnątrz #squad-list.",
  "#archive-list": "lista raportów przygotowana do cwiczenia removeChild().",
  "#mission-status": "paragraf statusu misji w ostatnim panelu.",
  "#intel-feed": "lista raportów wywiadu. To element <ul> na wpisy <li>.",
  ".character": "wszystkie karty postaci. Kazda z nich jest elementem <article>.",
  ".panel": "kazdy panel w sekcji narzedzi. To element <div class=\"panel\">.",
  ".status": "paragraf z opisem stanu postaci wewnątrz karty.",
  ".hunter": "elementy oznaczone klasa hunter. W bazowej scenie to np. Predator.",
  ".xeno, .symbiote": "dwie karty postaci: Alien (.xeno) oraz Venom (.symbiote)."
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatObjectiveText(text) {
  const normalized = String(text)
    .replace(/^\s+|\s+$/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*/g, "\n")
    .replace(/\s*(Krok\s+\d+:)/g, function(match, label, offset) {
      return offset === 0 ? label : "\n" + label;
    });

  return escapeHtml(normalized).replace(/\n/g, "<br>");
}

function getMethodGuide(topic) {
  if (METHOD_GUIDES[topic]) return METHOD_GUIDES[topic];
  return {
    summary: "Uzyj metody lub techniki wskazanej w temacie misji i zastosuj ja bezposrednio na elementach sceny DOM.",
    example: "// Przyklad dopasuj samodzielnie do tej misji"
  };
}

function uniqueList(items) {
  const seen = Object.create(null);
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const key = items[i];
    if (!seen[key]) {
      seen[key] = true;
      out.push(key);
    }
  }
  return out;
}

function extractTargetsFromObjective(objective) {
  const selectors = [];
  const quotedSelectors = objective.matchAll(/["'`](#[^"'`]*|\.[^"'`]*)(?=["'`])/g);
  const disallowedTokens = {
    ".getElementById": true,
    ".querySelector": true,
    ".querySelectorAll": true,
    ".getElementsByClassName": true,
    ".classList": true,
    ".addEventListener": true,
    ".removeEventListener": true,
    ".setAttribute": true,
    ".getAttribute": true,
    ".textContent": true,
    ".dataset": true,
    ".style": true
  };

  for (const quotedMatch of quotedSelectors) {
    const selectorExpression = quotedMatch[1].trim();
    if (selectorExpression && !disallowedTokens[selectorExpression]) {
      selectors.push(selectorExpression);
    }
  }

  const matches = objective.matchAll(/[#.][a-zA-Z0-9_-]+/g);

  for (const match of matches) {
    const token = match[0];
    const idx = match.index || 0;
    const prevChar = idx > 0 ? objective.charAt(idx - 1) : "";

    // Token jest selektorem tylko wtedy, gdy nie jest doklejony do nazwy metody, np. document.getElementById.
    if (/[a-zA-Z0-9_-]/.test(prevChar)) {
      continue;
    }

    if (disallowedTokens[token]) {
      continue;
    }

    selectors.push(token);
  }

  return uniqueList(selectors);
}

function matchObjectivePattern(objective, patterns) {
  for (let i = 0; i < patterns.length; i++) {
    const match = objective.match(patterns[i]);
    if (match) return match;
  }
  return null;
}

function detectSecondaryOperations(objective) {
  const ops = [];
  const valueMatch = matchObjectivePattern(objective, [
    /ustaw\s+(?:jego\s+)?value\s+na\s+['"]([^'"]+)['"]/i,
    /wpisz(?:\s+do\s+niego)?\s+wartość\s+['"]([^'"]+)['"].*?value/i,
    /value\s*=\s*['"]([^'"]+)['"]/i
  ]);
  if (valueMatch) {
    ops.push({
      label: "value",
      summary: "Ustawia wartość pola formularza (np. input).",
      example: 'element.value = "' + valueMatch[1] + '";'
    });
  }

  let textContentMatch = matchObjectivePattern(objective, [
    /textContent\s+na\s+['"]([^'"]+)['"]/i,
    /ustaw\s+(?:jego\s+)?textContent\s+na\s+['"]([^'"]+)['"]/i,
    /ustaw\s+tekst[^'"]*?na\s+['"]([^'"]+)['"]/i,
    /wpisz[^'"]*?do[^'"]*?w\s+formie\s+tekstu\s+['"]([^'"]+)['"]/i
  ]);
  if (!textContentMatch) {
    textContentMatch = objective.match(/ustaw jego textContent na ['"]([^'"]+)['"]/i);
  }
  if (textContentMatch) {
    ops.push({
      label: "textContent",
      summary: "Podmienia tekst wewnątrz elementu.",
      example: 'element.textContent = "' + textContentMatch[1] + '";'
    });
  }

  const innerHtmlMatch = matchObjectivePattern(objective, [
    /innerHTML\s+na\s+['"]([^'"]+)['"]/i,
    /ustaw\s+(?:jego\s+)?innerHTML\s+na\s+['"]([^'"]+)['"]/i
  ]);
  if (innerHtmlMatch) {
    ops.push({
      label: "innerHTML",
      summary: "Podmienia całe wnętrze elementu na nowy HTML.",
      example: 'element.innerHTML = "' + innerHtmlMatch[1] + '";'
    });
  }

  const addClassMatch = matchObjectivePattern(objective, [
    /dodaj(?:\s+[^\s'.]+){0,4}\s+klasę\s+['"]?([a-zA-Z0-9_-]+)['"]?/i,
    /classList\.add\(\s*['"]([a-zA-Z0-9_-]+)['"]\s*\)/i
  ]);
  if (addClassMatch) {
    ops.push({
      label: "classList.add",
      summary: "Dodaje nową klasę CSS do elementu.",
      example: 'element.classList.add("' + addClassMatch[1] + '");'
    });
  }

  const removeClassMatch = matchObjectivePattern(objective, [
    /usuń(?:\s+[^\s'.]+){0,4}\s+klasę\s+['"]?([a-zA-Z0-9_-]+)['"]?/i,
    /classList\.remove\(\s*['"]([a-zA-Z0-9_-]+)['"]\s*\)/i
  ]);
  if (removeClassMatch) {
    ops.push({
      label: "classList.remove",
      summary: "Usuwa klasę CSS z elementu.",
      example: 'element.classList.remove("' + removeClassMatch[1] + '");'
    });
  }

  const toggleClassMatch = matchObjectivePattern(objective, [
    /przełącz(?:\s+[^\s'.]+){0,4}\s+klasę\s+['"]?([a-zA-Z0-9_-]+)['"]?/i,
    /classList\.toggle\(\s*['"]([a-zA-Z0-9_-]+)['"]\s*\)/i
  ]);
  if (toggleClassMatch) {
    ops.push({
      label: "classList.toggle",
      summary: "Przełącza klasę: dodaje lub usuwa ja przy kolejnym wywołaniu.",
      example: 'element.classList.toggle("' + toggleClassMatch[1] + '");'
    });
  }

  const attrMatch = matchObjectivePattern(objective, [
    /atrybut\s+([a-zA-Z0-9_-]+)=['"]([^'"]+)['"]/i,
    /atrybut\s+([a-zA-Z0-9_-]+)\s+o\s+wartości\s+['"]([^'"]+)['"]/i
  ]);
  if (attrMatch) {
    ops.push({
      label: "setAttribute",
      summary: "Ustawia wskazany atrybut i jego wartość.",
      example: 'element.setAttribute("' + attrMatch[1] + '", "' + attrMatch[2] + '");'
    });
  }

  const styleMatch = matchObjectivePattern(objective, [
    /style\.([a-zA-Z]+)\s*=\s*['"]([^'"]+)['"]/i,
    /style\.([a-zA-Z]+)\s+na\s+['"]([^'"]+)['"]/i
  ]);
  if (styleMatch) {
    ops.push({
      label: "style",
      summary: "Ustawia styl inline bezposrednio na elemencie.",
      example: 'element.style.' + styleMatch[1] + ' = "' + styleMatch[2] + '";'
    });
  }

  if (/usuń go ze sceny|\busun\b/i.test(objective) && /#/.test(objective)) {
    ops.push({
      label: "remove",
      summary: "Usuwa element z drzewa DOM.",
      example: "element.remove();"
    });
  }

  if (/listener|nasluchuj|addEventListener/i.test(objective)) {
    ops.push({
      label: "addEventListener",
      summary: "Podpina funkcje, która wykona się po zdarzeniu.",
      example: 'element.addEventListener("click", handler);'
    });
  }

  if (/\bonce\b/i.test(objective)) {
    ops.push({
      label: "Listener",
      summary: "Opcja listenera: zdarzenie obsłuży się tylko raz.",
      example: 'element.addEventListener("click", handler, { once: true });'
    });
  }

  if (/capture/i.test(objective)) {
    ops.push({
      label: "capture",
      summary: "Listener dziala w fazie przechwytywania.",
      example: 'element.addEventListener("click", handler, { capture: true });'
    });
  }

  return ops;
}

function getTopicBeginnerTips(topic) {
  return TOPIC_BEGINNER_TIPS[topic] ? TOPIC_BEGINNER_TIPS[topic].slice() : [];
}

function getSelectorGuideText(selector) {
  if (SCENE_SELECTOR_GUIDES[selector]) return SCENE_SELECTOR_GUIDES[selector];
  if (selector.indexOf(",") !== -1) {
    return "To kilka selektorow oddzielonych przecinkiem. Element pasuje, jezeli spelnia przynajmniej jeden z nich.";
  }
  if (selector.indexOf(" ") !== -1) {
    return "To selektor zagniezdzony. Fragment po prawej musi znajdowac się wewnątrz fragmentu po lewej.";
  }
  if (selector.indexOf(":nth-child(") !== -1) {
    return "To selektor pozycyjny. Pozwala wskazac element na konkretnej pozycji w liście rodzenstwa.";
  }
  return "To selektor CSS uzywany do znalezienia elementu w drzewie DOM.";
}

function renderOperationsHtml(operations) {
  if (!operations.length) return "";
  let html = '<div class="method-ops"><p><strong>Co jeszcze trzeba użyć:</strong></p>';
  for (let i = 0; i < operations.length; i++) {
    html += '<div class="method-op-item"><p><strong>' + escapeHtml(operations[i].label) + ':</strong> ' + escapeHtml(operations[i].summary) + '</p><pre class="method-example">' + escapeHtml(operations[i].example) + '</pre></div>';
  }
  html += '</div>';
  return html;
}

const SELECTOR_TOPICS = ["getElementById", "querySelector", "querySelectorAll", "getElementsByClassName", "getElementsByTagName", "closest", "parentElement", "children"];

function detectRetrievalOpFromStarter(starter) {
  if (!starter) return null;
  if (/getElementsByTagName/.test(starter)) {
    const m = starter.match(/getElementsByTagName\(["']([^"']+)["']\)/);
    const ex = m ? 'const items = document.getElementsByTagName("' + m[1] + '");' : METHOD_GUIDES["getElementsByTagName"].example;
    return { label: "getElementsByTagName", summary: METHOD_GUIDES["getElementsByTagName"].summary, example: ex };
  }
  if (/getElementsByClassName/.test(starter)) {
    const m = starter.match(/getElementsByClassName\(["']([^"']+)["']\)/);
    const ex = m ? 'const items = document.getElementsByClassName("' + m[1] + '");' : METHOD_GUIDES["getElementsByClassName"].example;
    return { label: "getElementsByClassName", summary: METHOD_GUIDES["getElementsByClassName"].summary, example: ex };
  }
  if (/querySelectorAll/.test(starter)) {
    const m = starter.match(/querySelectorAll\(["']([^"']+)["']\)/);
    const ex = m ? 'const list = document.querySelectorAll("' + m[1] + '");' : METHOD_GUIDES["querySelectorAll"].example;
    return { label: "querySelectorAll", summary: METHOD_GUIDES["querySelectorAll"].summary, example: ex };
  }
  if (/getElementById/.test(starter)) {
    const m = starter.match(/getElementById\(["']([^"']+)["']\)/);
    const ex = m ? 'const el = document.getElementById("' + m[1] + '");' : METHOD_GUIDES["getElementById"].example;
    return { label: "getElementById", summary: METHOD_GUIDES["getElementById"].summary, example: ex };
  }
  if (/querySelector/.test(starter)) {
    const m = starter.match(/querySelector\(["']([^"']+)["']\)/);
    const ex = m ? 'const el = document.querySelector("' + m[1] + '");' : METHOD_GUIDES["querySelector"].example;
    return { label: "querySelector", summary: METHOD_GUIDES["querySelector"].summary, example: ex };
  }
  return null;
}

function buildMissionObjectiveHtml(current) {
  const guide = getMethodGuide(current.topic);
  let operations = detectSecondaryOperations(current.objective);
  // Usun zduplikowane operacje, ktore sa tym samym co glowny temat misji
  operations = operations.filter(function(op) { return op.label !== current.topic; });
  // Dla misji manipulacyjnych (nie-selektor) dodaj podpowiedz jak pobrac element
  if (SELECTOR_TOPICS.indexOf(current.topic) === -1 && current.starter) {
    const retrievalOp = detectRetrievalOpFromStarter(current.starter);
    if (retrievalOp) operations.unshift(retrievalOp);
  }
  let html = '<strong>Polecenie:</strong><br>' + formatObjectiveText(current.objective);
  html += '<div class="method-guide"><p><strong>Co użyć w tej misji:</strong></p>';
  html += '<p><strong>' + escapeHtml(current.topic) + ':</strong> ' + escapeHtml(guide.summary) + '</p><pre class="method-example">' + escapeHtml(guide.example) + '</pre>';
  html += renderOperationsHtml(operations);
  html += '</div>';
  return html;
}

/* ============================================================
   SILNIK GRY
   ============================================================ */

const STORAGE_KEY = "dom-hunters-progress-v1";

const missionTitle     = document.getElementById("mission-title");
const missionTopic     = document.getElementById("mission-topic");
const missionDifficulty = document.getElementById("mission-difficulty");
const missionObjective = document.getElementById("mission-objective");
const missionTips      = document.getElementById("mission-tips");
const missionIndex     = document.getElementById("mission-index");
const missionTotal     = document.getElementById("mission-total");
const completedCount   = document.getElementById("completed-count");
const progressBarFill  = document.getElementById("progress-bar-fill");
const progressPercent  = document.getElementById("progress-percent");
const finishStatus     = document.getElementById("finish-status");
const codeInput        = document.getElementById("code-input");
const runBtn           = document.getElementById("run-btn");
const nextBtn          = document.getElementById("next-btn");
const solutionBtn      = document.getElementById("solution-btn");
const resetBtn         = document.getElementById("reset-progress");
const exportBtn        = document.getElementById("export-progress");
const importBtn        = document.getElementById("import-progress");
const importFileInput  = document.getElementById("import-progress-file");
const examToggleBtn    = document.getElementById("exam-toggle");
const randomSceneBtn   = document.getElementById("random-scene-btn");
const finishGameBtn    = document.getElementById("finish-game");
const consoleOutput    = document.getElementById("console-output");
const sceneRoot        = document.getElementById("scene-root");
const missionFilterList = document.getElementById("mission-filter-list");
const missionNavList   = document.getElementById("mission-nav-list");
const domInspectorTip  = createDomInspectorTip();
let codeEditor = null;

const DEFAULT_STATE = { currentMission: 0, completed: [], examMode: false, missionFilter: "all" };
const ALLOWED_FILTERS = { all: true, selectors: true, attributes: true, "dom-build": true, events: true };

function createDefaultState() {
  return {
    currentMission: 0,
    completed: [],
    examMode: false,
    missionFilter: "all"
  };
}

let state = loadState();
missionTotal.textContent = String(missions.length);

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultState();
  try {
    return sanitizeImportedState(JSON.parse(raw));
  } catch(e) {
    return createDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeImportedState(input) {
  const safe = createDefaultState();
  const source = input && typeof input === "object" ? input : {};

  const currentMission = Number(source.currentMission);
  if (Number.isFinite(currentMission)) {
    safe.currentMission = Math.min(Math.max(Math.floor(currentMission), 0), missions.length - 1);
  }

  if (Array.isArray(source.completed)) {
    const validIds = [];
    for (let i = 0; i < source.completed.length; i++) {
      const value = Number(source.completed[i]);
      if (!Number.isFinite(value)) continue;
      const missionId = Math.floor(value);
      if (missionId >= 1 && missionId <= missions.length && validIds.indexOf(missionId) === -1) {
        validIds.push(missionId);
      }
    }
    safe.completed = validIds;
  }

  safe.examMode = Boolean(source.examMode);

  if (typeof source.missionFilter === "string" && ALLOWED_FILTERS[source.missionFilter]) {
    safe.missionFilter = source.missionFilter;
  }

  return safe;
}

function buildExportPayload() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    state: {
      currentMission: state.currentMission,
      completed: state.completed.slice(),
      examMode: state.examMode,
      missionFilter: state.missionFilter
    }
  };
}

function downloadProgressFile() {
  const payload = buildExportPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const datePart = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = "dom-hunters-progress-" + datePart + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyImportedProgress(rawText) {
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    setConsole("err", "Niepoprawny plik JSON. Sprawdz format eksportu.");
    return;
  }

  const candidate = parsed && parsed.state ? parsed.state : parsed;
  state = sanitizeImportedState(candidate);
  saveState();
  renderMission();
  setConsole("ok", "Postep zostal zaimportowany.");
}

function uniqueCompletedCount() {
  return new Set(state.completed).size;
}

function progressPercentValue() {
  return Math.round((uniqueCompletedCount() / missions.length) * 100);
}

function isGameComplete() {
  return uniqueCompletedCount() === missions.length;
}

function getHighestUnlockedIndex() {
  let highestCompletedIndex = -1;
  for (let i = 0; i < state.completed.length; i++) {
    const missionId = state.completed[i];
    highestCompletedIndex = Math.max(highestCompletedIndex, missionId - 1);
  }
  return Math.min(Math.max(highestCompletedIndex + 1, 0), missions.length - 1);
}

function isMissionUnlocked(index) {
  return index >= 0 && index < missions.length;
}

function getMissionCategory(topic) {
  if (/getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll|closest|parentElement|children/i.test(topic)) return "selectors";
  if (/classList|setAttribute|getAttribute|dataset|disabled|checked|selected|textContent|innerHTML|style/i.test(topic)) return "attributes";
  if (/createElement|append|prepend|before|after|insertBefore|remove$|removeChild/i.test(topic)) return "dom-build";
  return "events";
}

function getMissionDifficulty(mission) {
  if (mission.id <= 16) return { label: "Latwe", key: "easy" };
  if (mission.id <= 32) return { label: "Srednie", key: "medium" };
  return { label: "Trudne", key: "hard" };
}

function getFilterLabel(filter) {
  const labels = {
    all: "Wszystkie",
    selectors: "Selektory",
    attributes: "Atrybuty, treść i style",
    "dom-build": "Tworzenie DOM",
    events: "Zdarzenia"
  };
  return labels[filter] || filter;
}

function getFilterCount(filter) {
  if (filter === "all") return missions.length;
  let count = 0;
  for (let i = 0; i < missions.length; i++) {
    if (getMissionCategory(missions[i].topic) === filter) count += 1;
  }
  return count;
}

function matchesMissionFilter(mission) {
  if (state.missionFilter === "all") return true;
  return getMissionCategory(mission.topic) === state.missionFilter;
}

function renderMissionFilterButtons() {
  const buttons = missionFilterList.querySelectorAll(".mission-filter");
  buttons.forEach(function(button) {
    button.classList.toggle("active", button.dataset.filter === state.missionFilter);
    button.textContent = getFilterLabel(button.dataset.filter) + " (" + getFilterCount(button.dataset.filter) + ")";
  });
}

function setConsole(kind, text) {
  consoleOutput.classList.remove("ok", "err");
  if (kind === "ok") consoleOutput.classList.add("ok");
  if (kind === "err") consoleOutput.classList.add("err");
  consoleOutput.textContent = text;
}

function renderMissionNavigator() {
  missionNavList.innerHTML = "";
  for (let i = 0; i < missions.length; i++) {
    const mission = missions[i];
    if (!matchesMissionFilter(mission)) continue;
    const difficulty = getMissionDifficulty(mission);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mission-chip";
    if (i === state.currentMission) btn.classList.add("active");
    if (state.completed.indexOf(mission.id) !== -1) btn.classList.add("completed");
    btn.dataset.index = String(i);
    btn.innerHTML = '<span class="mission-chip-number">' + mission.id + '</span><span class="mission-chip-label">' + escapeHtml(mission.topic) + '</span><span class="mission-chip-difficulty ' + difficulty.key + '">' + difficulty.label + '</span>';
    missionNavList.appendChild(btn);
  }
}

function updateProgressUi() {
  const completed = uniqueCompletedCount();
  completedCount.textContent = String(completed);
  progressBarFill.style.width = progressPercentValue() + "%";
  progressPercent.textContent = progressPercentValue() + "%";
  finishGameBtn.disabled = !isGameComplete();
  finishStatus.textContent = isGameComplete()
    ? "Masz 100%. Mozesz zakonczyc gre."
    : "Do zakonczenia gry potrzebujesz 100%.";
  renderMissionFilterButtons();
  renderMissionNavigator();
}

function createDomInspectorTip() {
  const el = document.createElement("div");
  el.className = "dom-inspector-tip";
  el.setAttribute("aria-hidden", "true");
  document.body.appendChild(el);
  return el;
}

function formatAttributesLine(el) {
  if (!el || !el.attributes || !el.attributes.length) return '<span class="insp-empty">(brak atrybutow)</span>';
  const pairs = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    let value = attr.value;
    if (attr.name === "src" && value.indexOf("data:image/svg+xml") === 0) {
      value = "data:image/svg+xml,...";
    }
    pairs.push('<span class="insp-attr">' + attr.name + '</span>=<span class="insp-value">"' + escapeHtml(value) + '"</span>');
  }
  return pairs.join(" ");
}

function buildChildrenPreview(container, limit) {
  if (!container) return "";
  const max = typeof limit === "number" ? limit : 4;
  const children = Array.from(container.children).slice(0, max);
  if (!children.length) return "";

  let html = '<div class="insp-children" style="margin-left: 16px; margin-top: 4px; border-left: 1px solid rgba(230, 239, 255, 0.2); padding-left: 8px;">';
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const tagName = child.tagName.toLowerCase();
    const text = child.textContent ? child.textContent.trim().substring(0, 40) : "";
    const textDisplay = text ? '<span class="insp-text"> ' + escapeHtml(text) + (text.length >= 40 ? '...' : '') + '</span>' : '';

    html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">' + tagName + '</span>';
    if (child.id) {
      html += ' <span class="insp-attr">id</span>=<span class="insp-value">"' + escapeHtml(child.id) + '"</span>';
    }
    if (child.className) {
      html += ' <span class="insp-attr">class</span>=<span class="insp-value">"' + escapeHtml(child.className) + '"</span>';
    }
    html += '<span class="insp-bracket">&gt;</span>' + textDisplay + '</div>';
  }
  html += '</div>';

  return html;
}

function buildInspectorText(target) {
  const panel = target.closest(".panel");
  const character = target.closest(".character");
  if (!character && !panel) return "";

  if (!character && panel) {
    let html = '';
    html += '<div class="insp-section"><div class="insp-label">AKTYWNY:</div>';
    html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">' + target.tagName.toLowerCase() + '</span> ';
    html += formatAttributesLine(target);
    html += '<span class="insp-bracket">&gt;</span>';
    if (target.textContent && target.textContent.trim().length < 50) {
      html += '<span class="insp-text"> ' + escapeHtml(target.textContent.trim()) + '</span>';
    }
    html += '</div></div>';

    if (panel !== target) {
      html += '<div class="insp-section" style="margin-top: 8px;"><div class="insp-label">PANEL:</div>';
      html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">div</span> ';
      html += formatAttributesLine(panel);
      html += '<span class="insp-bracket">&gt;</span></div>';
      html += buildChildrenPreview(panel, 5);
      html += '</div>';
    }

    return html;
  }

  const image = character.querySelector("img");
  let html = '';
  
  // AKTYWNY ELEMENT
  html += '<div class="insp-section"><div class="insp-label">AKTYWNY:</div>';
  html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">' + target.tagName.toLowerCase() + '</span> ';
  html += formatAttributesLine(target);
  html += '<span class="insp-bracket">&gt;</span>';
  if (target.textContent && target.textContent.trim().length < 50) {
    html += '<span class="insp-text"> ' + escapeHtml(target.textContent.trim()) + '</span>';
  }
  html += '</div></div>';
  
  // OBRAZEK
  if (image && image !== target) {
    html += '<div class="insp-section" style="margin-top: 8px;"><div class="insp-label">OBRAZEK:</div>';
    html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">img</span> ';
    html += formatAttributesLine(image);
    html += '<span class="insp-bracket"> /&gt;</span></div></div>';
  }
  
  // KARTA
  if (character !== target) {
    html += '<div class="insp-section" style="margin-top: 8px;"><div class="insp-label">KARTA:</div>';
    html += '<div class="insp-tag"><span class="insp-bracket">&lt;</span><span class="insp-name">article</span> ';
    html += formatAttributesLine(character);
    html += '<span class="insp-bracket">&gt;</span></div>';
    
    // Dzieci karty
    html += buildChildrenPreview(character, 4);
    html += '</div>';
  }
  
  return html;
}

function moveInspectorTip(event) {
  domInspectorTip.style.left = (event.clientX + 16) + "px";
  domInspectorTip.style.top = (event.clientY + 16) + "px";
}

function attachDomInspector() {
  sceneRoot.addEventListener("mousemove", function(event) {
    const inspectTarget = event.target.closest(".character, .character img, .panel, .panel *");
    if (!inspectTarget || !sceneRoot.contains(inspectTarget)) {
      domInspectorTip.classList.remove("visible");
      return;
    }
    domInspectorTip.innerHTML = buildInspectorText(inspectTarget);
    moveInspectorTip(event);
    domInspectorTip.classList.add("visible");
  });

  sceneRoot.addEventListener("mouseleave", function() {
    domInspectorTip.classList.remove("visible");
  });
}

function applyExamMode() {
  const active = state.examMode;
  examToggleBtn.textContent = active ? "Wylacz tryb egzaminu" : "Tryb egzaminu";
  examToggleBtn.dataset.active = String(active);
  missionTips.style.display = active ? "none" : "";
  updateSolutionButtonVisibility();
}

function updateSolutionButtonVisibility() {
  const current = missions[state.currentMission];
  const missionId = current ? current.id : 0;
  const canShowSolution = !state.examMode && missionId >= 33 && missionId <= 36;
  solutionBtn.style.display = canShowSolution ? "" : "none";
}

function renderMissionListTips(tips, current) {
  let combinedTips = [];
  if (Array.isArray(tips)) {
    combinedTips = combinedTips.concat(tips);
  }
  if (current && current.topic) {
    combinedTips = combinedTips.concat(getTopicBeginnerTips(current.topic));
  }
  combinedTips = uniqueList(combinedTips);

  missionTips.innerHTML = "";
  for (let i = 0; i < combinedTips.length; i++) {
    const li = document.createElement("li");
    li.textContent = combinedTips[i];
    missionTips.appendChild(li);
  }
}

function createDomMutationTracker(root) {
  const changed = new Map();

  function ensureEntry(el) {
    if (!el || el.nodeType !== 1) return null;
    if (!changed.has(el)) {
      changed.set(el, { attrs: new Set(), text: false, children: false });
    }
    return changed.get(el);
  }

  const observer = new MutationObserver(function(mutations) {
    console.log("🔔 MutationObserver fired with", mutations.length, "mutations");
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];

      if (mutation.type === "attributes") {
        const entry = ensureEntry(mutation.target);
        if (entry && mutation.attributeName) {
          entry.attrs.add(mutation.attributeName);
          console.log("  → Attribute mutation:", mutation.target.tagName, mutation.attributeName);
        }
      }

      if (mutation.type === "characterData") {
        const parent = mutation.target.parentElement;
        const entry = ensureEntry(parent);
        if (entry) entry.text = true;
        console.log("  → Text mutation on", parent?.tagName);
      }

      if (mutation.type === "childList") {
        const entry = ensureEntry(mutation.target);
        if (entry) entry.children = true;
        console.log("  → Child mutation on", mutation.target.tagName);
      }
    }
  });

  observer.observe(root, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });

  return { observer: observer, changed: changed };
}

function clearMissionMarker(scene) {
  if (!scene) return;
  const marked = scene.querySelectorAll(".mission-target");
  for (let i = 0; i < marked.length; i++) {
    marked[i].classList.remove("mission-target");
  }
  const arrows = scene.querySelectorAll(".mutation-arrow");
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].remove();
  }
}

function getMissionTargetId(mission) {
  const source = [mission.solution, mission.starter, mission.objective].filter(Boolean).join(" ");
  const bySelector = source.match(/#([a-zA-Z0-9_-]+)/);
  if (bySelector) return bySelector[1];
  const byIdApi = source.match(/getElementById\(\s*["']([a-zA-Z0-9_-]+)["']\s*\)/);
  if (byIdApi) return byIdApi[1];
  return "";
}

function getArrowAnchor(el) {
  if (!el) return null;
  return el.closest(".character, .panel, li, article") || el;
}

function isMultiTargetMission(mission) {
  if (!mission) return false;
  const source = [mission.solution, mission.starter, mission.objective].filter(Boolean).join(" ").toLowerCase();
  return /queryselectorall|getelementsbyclassname|getelementsbytagname|\bwszystkie\b|\bkazdemu\b|\bkazdym\b/.test(source);
}

function showChangeArrow(el) {
  if (!el || !el.classList) return;

  const oldArrow = el.querySelector(".mutation-arrow");
  if (oldArrow) oldArrow.remove();

  const arrow = document.createElement("div");
  arrow.className = "mutation-arrow";
  arrow.textContent = "↑";
  arrow.style.color = "#17f1a3";

  if (window.getComputedStyle(el).position === "static") {
    el.style.position = "relative";
  }

  el.insertBefore(arrow, el.firstChild);
  arrow.addEventListener("click", function() {
    arrow.style.animation = "arrowBounceOut 0.3s ease-in forwards";
    window.setTimeout(function() {
      if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
    }, 300);
  });
}

function applyMutationVisualHints(changedMap) {
  console.log("🔍 applyMutationVisualHints: Found", changedMap.size, "changed elements");
  
  if (changedMap.size === 0) {
    console.warn("⚠️  changedMap is EMPTY - no mutations detected!");
    return;
  }
  
  changedMap.forEach(function(entry, el) {
    if (!el || !el.classList) {
      console.log("  ❌ Invalid element, skipping");
      return;
    }

    console.log("  ✅ Processing element:", el.tagName, el.className || "(no class)");
    const notes = [];
    if (entry.attrs.size) {
      const attrs = Array.from(entry.attrs).slice(0, 3).join(", ");
      notes.push("attr: " + attrs);
    }
    if (entry.text) notes.push("tekst");
    if (entry.children) notes.push("dzieci");

    const noteText = notes.join(" | ");
    el.classList.add("dom-changed");
    if (noteText) {
      el.setAttribute("data-change-note", noteText);
    }

    // Dodaj wyskakującą strzałkę wskazującą zmianę
    const arrow = document.createElement("div");
    arrow.className = "mutation-arrow";
    arrow.textContent = "↑";
    arrow.style.color = "#17f1a3";
    
    // Upewnij się że parent ma position relative
    if (window.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }
    
    console.log("  ✓ Arrow created, inserting into element");
    el.insertBefore(arrow, el.firstChild);

    // Usuń strzałkę po kliknięciu
    function removeArrow() {
      arrow.style.animation = "arrowBounceOut 0.3s ease-in forwards";
      window.setTimeout(function() {
        if (arrow.parentNode) {
          arrow.parentNode.removeChild(arrow);
        }
      }, 300);
    }
    arrow.addEventListener("click", removeArrow);

    // Automatycznie usuń strzałkę i animacje po 4 sekundach
    window.setTimeout(function() {
      el.classList.remove("dom-changed");
      if (el.getAttribute("data-change-note") === noteText) {
        el.removeAttribute("data-change-note");
      }
      if (arrow.parentNode) {
        const wasVisible = arrow.offsetParent !== null;
        if (wasVisible) {
          arrow.style.animation = "arrowBounceOut 0.3s ease-in forwards";
          window.setTimeout(function() {
            if (arrow.parentNode) {
              arrow.parentNode.removeChild(arrow);
            }
          }, 300);
        } else {
          arrow.parentNode.removeChild(arrow);
        }
      }
    }, 4000);
  });
}

function initCodeEditor() {
  if (!window.CodeMirror || !codeInput) return;
  codeEditor = window.CodeMirror.fromTextArea(codeInput, {
    mode: "javascript",
    theme: "material-darker",
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2
  });

  codeEditor.on("keydown", function(cm, event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runCurrentMission();
    }
  });
}

function getCurrentCode() {
  if (codeEditor) return codeEditor.getValue();
  return codeInput.value;
}

function setCurrentCode(value) {
  const text = String(value || "");
  if (codeEditor) {
    codeEditor.setValue(text);
    codeEditor.focus();
    return;
  }
  codeInput.value = text;
}

function renderMission() {
  const current = missions[state.currentMission];
  const difficulty = getMissionDifficulty(current);
  missionIndex.textContent = String(state.currentMission + 1);
  missionTitle.textContent = current.title;
  missionTopic.textContent = "Temat: " + current.topic;
  missionDifficulty.textContent = difficulty.label;
  missionDifficulty.className = "mission-difficulty " + difficulty.key;
  missionObjective.innerHTML = buildMissionObjectiveHtml(current);
  renderMissionListTips(current.tips, current);
  setCurrentCode("");
  renderBaseScene(sceneRoot);
  setConsole("", "Czekam na Twoj kod...");
  applyExamMode();
  updateProgressUi();
  saveState();
}

function runCurrentMission() {
  const current = missions[state.currentMission];
  
  renderBaseScene(sceneRoot);
  clearMissionMarker(sceneRoot);
  
  // Zapamiętaj stan ZANIM kod się uruchomi
  const beforeState = new Map();
  function captureState(root) {
    const state = new Map();
    const allElements = root.querySelectorAll("*");
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      state.set(el, {
        className: el.className,
        attrs: Array.from(el.attributes).map(a => ({ name: a.name, value: a.value })),
        innerHTML: el.innerHTML,
        textContent: el.textContent,
        value: typeof el.value === "string" ? el.value : ""
      });
    }
    return state;
  }
  
  beforeState.clear();
  const stateSnapshot = captureState(sceneRoot);
  stateSnapshot.forEach((val, el) => beforeState.set(el, JSON.parse(JSON.stringify(val))));
  
  const logs = [];
  const helpers = {
    log: function(value) {
      logs.push(typeof value === "string" ? value : JSON.stringify(value, null, 2));
    }
  };

  let returned;
  try {
    const userFn = new Function(
      "scene", "helpers",
      '"use strict";\nconst document = scene.ownerDocument;\nconst window = document.defaultView;\n' + getCurrentCode()
    );
    returned = userFn(sceneRoot, helpers);
  } catch (error) {
    setConsole("err", "Blad wykonania: " + error.message);
    return;
  }

  // Sprawdź zmiany TERAZ
  const changedCandidates = [];
  const allElements = sceneRoot.querySelectorAll("*");
  
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const before = beforeState.get(el);
    
    if (!before) continue;
    
    const after = {
      className: el.className,
      attrs: Array.from(el.attributes).map(a => ({ name: a.name, value: a.value })),
      innerHTML: el.innerHTML,
      textContent: el.textContent,
      value: el.value || ""
    };
    
    let changed = false;
    let directChange = false;  // czy zmiana dotyczy samego elementu (nie tylko jego dzieci)
    
    // Porównaj klasę - BEZPOŚREDNIA ZMIANA
    if (before.className !== after.className) {
      changed = true;
      directChange = true;
    }
    
    // Porównaj atrybuty - BEZPOŚREDNIA ZMIANA
    if (JSON.stringify(before.attrs) !== JSON.stringify(after.attrs)) {
      changed = true;
      directChange = true;
    }
    
    // Porównaj .value dla inputów - BEZPOŚREDNIA ZMIANA
    if (before.value !== after.value) {
      changed = true;
      directChange = true;
    }
    
    // Porównaj innerHTML - ale to nie jest "bezpośrednia" zmiana (mogą się zmienić dzieci)
    if (before.innerHTML !== after.innerHTML) {
      changed = true;
      // directChange = false // to nie liczy się jako bezpośrednia
    }
    
    // Porównaj textContent - bezpośrednia tylko dla elementów bez dzieci elementowych
    if (before.textContent !== after.textContent) {
      changed = true;
      if (el.children.length === 0) {
        directChange = true;
      }
    }
    
    // Zbieraj kandydatów do dalszej filtracji
    if (changed && directChange) {
      changedCandidates.push(el);
    }
  }

  // Usuń rodziców, jeśli ta sama zmiana jest już wskazana precyzyjniej na potomku.
  const changedElements = changedCandidates.filter(function(candidate) {
    for (let i = 0; i < changedCandidates.length; i++) {
      const other = changedCandidates[i];
      if (other !== candidate && candidate.contains(other)) {
        return false;
      }
    }
    return true;
  });
  
  let passed = false;
  try {
    passed = Boolean(current.validate(sceneRoot, returned));
  } catch (error) {
    setConsole("err", "Kod się uruchomil, ale walidacja misji nie przeszla: " + error.message);
    return;
  }

  const logsBlock   = logs.length ? "\nLogi helpers.log:\n- " + logs.join("\n- ") : "";
  const returnBlock = returned !== undefined ? "\nReturn: " + String(returned) : "";

  if (passed) {
    const targets = [];
    const missionTargetId = getMissionTargetId(current);

    if (isMultiTargetMission(current) && changedElements.length > 0) {
      for (let i = 0; i < changedElements.length; i++) {
        targets.push(changedElements[i]);
      }
    } else if (missionTargetId) {
      const single = sceneRoot.querySelector("#" + missionTargetId);
      if (single) targets.push(single);
    } else if (changedElements.length > 0) {
      targets.push(changedElements[0]);
    }

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target || !target.classList) continue;
      target.classList.add("mission-target");
      const arrowAnchor = getArrowAnchor(target);
      if (arrowAnchor) showChangeArrow(arrowAnchor);
    }

    if (state.completed.indexOf(current.id) === -1) state.completed.push(current.id);
    saveState();
    updateProgressUi();
    const finishHint = isGameComplete() ? "\nMasz już 100%. Mozesz kliknac 'Zakoncz gre'." : "";
    setConsole("ok", "Sukces! Misja " + current.id + " zaliczona." + finishHint + returnBlock + logsBlock);
  } else {
    setConsole("err", "Jeszcze nie. Sprawdź warunek misji i sprobuj ponownie." + returnBlock + logsBlock);
  }
}

function goToMission(index) {
  if (index < 0 || index >= missions.length) return;
  state.currentMission = index;
  renderMission();
}

function goToNextMission() {
  if (state.currentMission < missions.length - 1) {
    state.currentMission += 1;
    renderMission();
  } else {
    if (isGameComplete()) {
      setConsole("ok", "To byla ostatnia misja. Masz 100% i mozesz zakonczyc gre.");
    } else {
      setConsole("err", "To ostatnia misja na liście, ale gra konczy się dopiero po zaliczeniu 100% misji.");
    }
  }
}

function finishGame() {
  if (!isGameComplete()) {
    setConsole("err", "Nie mozesz jeszcze zakonczyc gry. Najpierw zalicz wszystkie misje.");
    return;
  }
  setConsole("ok", "Gra zakonczona. Ukonczyles 100% misji DOM Hunters.");
}

runBtn.addEventListener("click", runCurrentMission);
nextBtn.addEventListener("click", goToNextMission);
finishGameBtn.addEventListener("click", finishGame);

missionNavList.addEventListener("click", function(event) {
  const button = event.target.closest(".mission-chip");
  if (!button) return;
  goToMission(Number(button.dataset.index));
});

missionFilterList.addEventListener("click", function(event) {
  const button = event.target.closest(".mission-filter");
  if (!button) return;
  state.missionFilter = button.dataset.filter;
  updateProgressUi();
  saveState();
});

solutionBtn.addEventListener("click", function() {
  setCurrentCode(missions[state.currentMission].solution);
  setConsole("", "Wstawilem przykladowe rozwiązanie. Uruchom, aby je sprawdzic.");
});

examToggleBtn.addEventListener("click", function() {
  state.examMode = !state.examMode;
  applyExamMode();
  saveState();
});

randomSceneBtn.addEventListener("click", function() {
  renderRandomScene(sceneRoot);
  setConsole("", "Losowa scena zaladowana. Uzyj pola kodu aby ja eksplorowac.");
});

resetBtn.addEventListener("click", function() {
  state = createDefaultState();
  saveState();
  renderMission();
});

exportBtn.addEventListener("click", function() {
  downloadProgressFile();
  setConsole("ok", "Progres wyeksportowany do pliku JSON.");
});

importBtn.addEventListener("click", function() {
  importFileInput.value = "";
  importFileInput.click();
});

importFileInput.addEventListener("change", function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(loadEvent) {
    applyImportedProgress(String(loadEvent.target.result || ""));
  };
  reader.onerror = function() {
    setConsole("err", "Nie udalo sie odczytac pliku z postepem.");
  };
  reader.readAsText(file, "utf-8");
});

attachDomInspector();
initCodeEditor();
renderMission();
