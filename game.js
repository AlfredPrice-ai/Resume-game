// ── SPRITES ─────────────────────────────────────────────
// Loaded from sprites.js

const imgs = {};
let imgsLoaded = 0;
const imgKeys = Object.keys(SPRITES);
imgKeys.forEach(k => {
    const i = new Image();
    i.onload = () => { imgsLoaded++; };
    i.src = SPRITES[k];
    imgs[k] = i;
});

function allLoaded() { return imgKeys.length === 0 || imgsLoaded >= imgKeys.length; }

// ── RESUME DATA ──────────────────────────────────────────
const LEVELS = [
    {
        name: "IMPACT MAKERS",
        sub: "Business Analyst · Aug 2024–Present",
        sky: ['#0d1040', '#0d2a0d'],
        ground: '#2d5a1a', gTop: '#3d7a22', pipe: '#1a8a1a',
        facts: [
            { icon: "💼", title: "Current Role", text: "Business Analyst Consultant at Impact Makers — a mission-driven firm in Richmond, VA." },
            { icon: "🤖", title: "Evaluate.ai", text: "Developed Evaluate.ai, an AI workforce platform generating 54K+ guiding questions and eliminating 50K+ hours of manual review work." },
            { icon: "🏛️", title: "State Impact", text: "Led 100+ stakeholder interviews, redesigning 1,800+ state roles and reducing labor costs by $125K." },
            { icon: "💰", title: "Contract Win", text: "Co-created workforce solutions contributing to a $300K+ contract renewal through cross-level stakeholder trust." },
            { icon: "📋", title: "Documentation", text: "Translated technical findings into compliant documentation that strengthened audit readiness across state government." },
        ]
    },
    {
        name: "SINGLESTONE · KB HEALTH",
        sub: "Product Manager · Feb 2020–Aug 2024",
        sky: ['#1a0d40', '#1a1a50'],
        ground: '#3d3d8e', gTop: '#5050b5', pipe: '#6060cc',
        facts: [
            { icon: "💊", title: "Drug Diversion System", text: "Led launch of a Drug Diversion Monitoring System across 200+ hospitals with EHR platforms and data warehouse integrations." },
            { icon: "📱", title: "Pocket Pill", text: "Co-led Pocket Pill, analyzing structured & unstructured patient data to improve medication comprehension and safety by ~60%." },
            { icon: "📊", title: "GTM Strategy", text: "Delivered Go-To-Market strategies, presenting risk considerations and product findings to executive audiences." },
            { icon: "🗺️", title: "Playbooks", text: "Created consultative sales & delivery playbooks supporting system modernization through repeatable, compliant processes." },
            { icon: "🏥", title: "Healthcare Tech", text: "Deep experience bridging clinical, technical, and operational teams in highly regulated healthcare environments." },
        ]
    },
    {
        name: "SNOW COMPANIES",
        sub: "Senior Account Manager · Feb 2023–Aug 2024",
        sky: ['#2d0d20', '#401520'],
        ground: '#6e2020', gTop: '#8e3030', pipe: '#aa4040',
        facts: [
            { icon: "💵", title: "$472K Renewal", text: "Drove a $472K client renewal (+19%) by leveraging program data insights across Oncology and Neurology portfolios." },
            { icon: "📞", title: "Client Management", text: "Led recurring status calls and kickoff sessions, facilitating requirements gathering with LOB stakeholders and healthcare providers." },
            { icon: "📈", title: "KPI Dashboards", text: "Produced Excel-based reports and KPI dashboards to assess performance and data validity across multiple brands." },
            { icon: "📝", title: "Project Briefs & SOWs", text: "Developed project briefs and SOWs, managing scope, timelines, budgets, and risk mitigation with MLR compliance." },
            { icon: "🔗", title: "Cross-Functional", text: "Coordinated cross-functional teams to deliver data-driven campaigns that connected strategy to measurable outcomes." },
        ]
    },
    {
        name: "EDUCATION & SKILLS",
        sub: "VCU Da Vinci · Randolph-Macon · Certified",
        sky: ['#0a2040', '#1a4060'],
        ground: '#0077b5', gTop: '#0099e0', pipe: '#00aaff',
        facts: [
            { icon: "🎓", title: "Master's Degree", text: "Masters of Product Innovation from VCU Da Vinci Center, Richmond, VA (Jan 2020 – Dec 2022)." },
            { icon: "📜", title: "Certifications", text: "Certified Scrum Master (CSM) + Certified Product Owner (CSPO) — Agile leadership at every level." },
            { icon: "🎤", title: "Keynote Speaker", text: "Selected as Keynote Speaker for Randolph-Macon College Transfer Student Class of 2019." },
            { icon: "🛠️", title: "Tech Stack", text: "AI tools (Claude, ChatGPT, Gemini, Perplexity), No-Code (Zapier, Webflow, Cursor), Figma, Salesforce, Jira, and more." },
            { icon: "⚡", title: "Core Strengths", text: "Product Roadmapping · UX Research · Data Storytelling · Agile Delivery · Stakeholder Alignment · Audit Readiness." },
        ]
    }
];

// ── ENGINE ───────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

let gameState = 'idle';
let lvlIdx = 0, lives = 3, totalFacts = 0;
let player, platforms, qblocks, enemies, coins, particles, flagpole;
let camera = { x: 0 };
let keys = {}, mkeys = { left: false, right: false };
let animT = 0, animF = 0;
let showFact = false, transitioning = false;
let jumpReq = false;

// Sprite animation map
const ANIM = {
    idle: ['idle2', 'idle1'],
    run: ['run1', 'run2'],
    jump: ['jump'],
    celebrate: ['celebrate', 'jump'],
};

function getFrame(state) {
    const frames = ANIM[state] || ANIM.idle;
    return imgs[frames[animF % frames.length]];
}

// ── LEVEL INIT ───────────────────────────────────────────
function initLevel(idx) {
    lvlIdx = idx;
    const lvl = LEVELS[idx];
    camera = { x: 0 };
    transitioning = false;
    jumpReq = false;

    player = {
        x: 80, y: 320, vx: 0, vy: 0,
        w: 44, h: 60,
        onGround: false, facing: 1,
        state: 'idle', invincible: 0, blinkTimer: 0
    };

    // World is 3000px wide
    const GY = H - 80; // ground top Y

    platforms = [
        // Ground — with gaps
        { x: 0, y: GY, w: 380, h: 80, t: 'g' },
        { x: 460, y: GY, w: 320, h: 80, t: 'g' },
        { x: 860, y: GY, w: 380, h: 80, t: 'g' },
        { x: 1320, y: GY, w: 360, h: 80, t: 'g' },
        { x: 1760, y: GY, w: 420, h: 80, t: 'g' },
        { x: 2270, y: GY, w: 380, h: 80, t: 'g' },
        { x: 2730, y: GY, w: 400, h: 80, t: 'g' },

        // Step platforms — lots to jump on
        { x: 200, y: GY - 110, w: 110, h: 20, t: 'b' },
        { x: 370, y: GY - 170, w: 90, h: 20, t: 'b' },
        { x: 480, y: GY - 90, w: 130, h: 20, t: 'b' },
        { x: 660, y: GY - 140, w: 100, h: 20, t: 'b' },
        { x: 800, y: GY - 190, w: 80, h: 20, t: 'b' },
        { x: 900, y: GY - 110, w: 120, h: 20, t: 'b' },
        { x: 1060, y: GY - 160, w: 100, h: 20, t: 'b' },
        { x: 1200, y: GY - 220, w: 90, h: 20, t: 'b' },
        { x: 1350, y: GY - 130, w: 120, h: 20, t: 'b' },
        { x: 1520, y: GY - 80, w: 100, h: 20, t: 'b' },
        { x: 1640, y: GY - 160, w: 110, h: 20, t: 'b' },
        { x: 1800, y: GY - 110, w: 130, h: 20, t: 'b' },
        { x: 1980, y: GY - 180, w: 100, h: 20, t: 'b' },
        { x: 2120, y: GY - 130, w: 90, h: 20, t: 'b' },
        { x: 2280, y: GY - 90, w: 120, h: 20, t: 'b' },
        { x: 2460, y: GY - 150, w: 100, h: 20, t: 'b' },
        { x: 2600, y: GY - 200, w: 90, h: 20, t: 'b' },

        // Staircase to flag
        { x: 2760, y: GY - 40, w: 60, h: 20, t: 'b' },
        { x: 2820, y: GY - 80, w: 60, h: 20, t: 'b' },
        { x: 2880, y: GY - 120, w: 60, h: 20, t: 'b' },
        { x: 2940, y: GY - 160, w: 60, h: 20, t: 'b' },
    ];

    // ❓ Question blocks — 5 per level, 1 fact each
    const qpositions = [
        { x: 240, y: GY - 200 },
        { x: 700, y: GY - 240 },
        { x: 1100, y: GY - 260 },
        { x: 1700, y: GY - 210 },
        { x: 2200, y: GY - 180 },
    ];
    qblocks = qpositions.map((p, i) => ({
        x: p.x, y: p.y, w: 38, h: 38,
        factIdx: i, hit: false,
        bounceY: 0, bounceDir: 0
    }));

    // Coins decorative
    coins = [];
    const coinSpots = [
        150, 220, 290, 510, 580, 650, 920, 990, 1060,
        1380, 1450, 1520, 1830, 1900, 1970, 2300, 2370, 2440
    ];
    coinSpots.forEach((cx, i) => {
        coins.push({ x: cx, y: GY - 130 - ((i % 3) * 22), w: 18, h: 18, collected: false, bobT: i * 0.4 });
    });

    // Enemies (goomba-style)
    enemies = [
        { x: 500, y: GY - 30, w: 34, h: 34, vx: -1.2, sx: 400, range: 180, alive: true },
        { x: 900, y: GY - 30, w: 34, h: 34, vx: 1, sx: 870, range: 150, alive: true },
        { x: 1400, y: GY - 30, w: 34, h: 34, vx: -1.4, sx: 1320, range: 200, alive: true },
        { x: 1800, y: GY - 30, w: 34, h: 34, vx: 1.2, sx: 1760, range: 180, alive: true },
        { x: 2300, y: GY - 30, w: 34, h: 34, vx: -1, sx: 2280, range: 170, alive: true },
    ];

    // Flagpole
    flagpole = { x: 2980, y: GY - 260, h: 260 };

    particles = [];
    totalFacts = 0;

    // HUD
    document.getElementById('h-level').textContent = `LV${idx + 1}: ${lvl.name.slice(0, 15)}`;
    document.getElementById('h-score').textContent = totalFacts;
    document.getElementById('h-total').textContent = lvl.facts.length;
    document.getElementById('h-lives').textContent = lives;

    showBanner(lvl.name, lvl.sub);
}

// ── BANNER / POPUP ───────────────────────────────────────
function showBanner(title, sub) {
    const el = document.getElementById('banner');
    document.getElementById('btitle').textContent = title;
    document.getElementById('bsub').textContent = sub;
    el.classList.add('on');
    setTimeout(() => el.classList.remove('on'), 2200);
}

let popTimer = null;
function revealFact(idx) {
    if (showFact) return;
    const fact = LEVELS[lvlIdx].facts[idx];
    if (!fact) return;
    showFact = true;
    totalFacts++;
    document.getElementById('h-score').textContent = totalFacts;
    const popup = document.getElementById('popup');
    document.getElementById('ptitle').textContent = fact.icon + ' ' + fact.title;
    document.getElementById('ptext').textContent = fact.text;
    popup.classList.add('on');
    clearTimeout(popTimer);
    popTimer = setTimeout(() => {
        popup.classList.remove('on');
        setTimeout(() => { showFact = false; }, 400);
    }, 3500);
}

// ── UPDATE ───────────────────────────────────────────────
const GY = H - 80;

function update() {
    if (gameState !== 'playing') return;

    // Animation tick
    animT++;
    if (animT % 8 === 0) animF++;

    const left = keys['ArrowLeft'] || keys['a'] || mkeys.left;
    const right = keys['ArrowRight'] || keys['d'] || mkeys.right;
    const jump = keys[' '] || keys['ArrowUp'] || keys['w'] || jumpReq;

    // Move
    if (left) { player.vx = -3.8; player.facing = -1; if (player.onGround) player.state = 'run'; }
    else if (right) { player.vx = 3.8; player.facing = 1; if (player.onGround) player.state = 'run'; }
    else { player.vx *= 0.7; if (Math.abs(player.vx) < 0.1 && player.onGround) player.state = 'idle'; }

    if (jump && player.onGround) {
        player.vy = -13;
        player.onGround = false;
        player.state = 'jump';
        spawnParts(player.x + player.w / 2, player.y + player.h, '#f7c948', 6);
    }
    jumpReq = false;

    player.vy += 0.55;
    if (player.vy > 14) player.vy = 14;
    player.x += player.vx;
    player.y += player.vy;
    if (player.x < 0) player.x = 0;

    // Platform collision
    player.onGround = false;
    for (const p of platforms) {
        if (!overlap(player, p)) continue;
        const px = player.x + player.w / 2, py = player.y + player.h / 2;
        const dx = (px - (p.x + p.w / 2)) / (p.w / 2);
        const dy = (py - (p.y + p.h / 2)) / (p.h / 2);
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) player.x = p.x + p.w;
            else player.x = p.x - player.w;
            player.vx = 0;
        } else {
            if (dy > 0) { player.y = p.y + p.h; player.vy = 0; }
            else {
                player.y = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
                if (player.state === 'jump') player.state = player.vx !== 0 ? 'run' : 'idle';
            }
        }
    }

    // Q-blocks (hit from below)
    for (const q of qblocks) {
        if (q.hit) {
            if (q.bounceDir !== 0) {
                q.bounceY += q.bounceDir * 3;
                if (q.bounceY >= 0) { q.bounceY = 0; q.bounceDir = 0; }
            }
            continue;
        }
        if (
            player.vy < 0 &&
            player.x + player.w > q.x + 6 &&
            player.x < q.x + q.w - 6 &&
            player.y <= q.y + q.h &&
            player.y >= q.y
        ) {
            q.hit = true;
            q.bounceDir = -1; q.bounceY = -10;
            player.vy = 2;
            spawnParts(q.x + q.w / 2, q.y, '#f7c948', 10);
            revealFact(q.factIdx);
        }
    }

    // Coins
    for (const c of coins) {
        if (!c.collected && overlap(player, c)) {
            c.collected = true;
            spawnParts(c.x + c.w / 2, c.y, '#ffe066', 8);
        }
        c.bobT += 0.05;
    }

    // Enemies
    if (player.invincible > 0) { player.invincible--; player.blinkTimer = (player.blinkTimer + 1) % 6; }

    for (const e of enemies) {
        if (!e.alive) continue;
        e.x += e.vx;
        if (e.x <= e.sx || e.x >= e.sx + e.range) e.vx *= -1;

        if (player.invincible === 0 && overlap(player, e)) {
            if (player.vy > 0 && player.y + player.h - player.vy * 0.5 <= e.y + 10) {
                e.alive = false;
                player.vy = -9;
                spawnParts(e.x + e.w / 2, e.y + e.h / 2, '#ff6b6b', 14);
            } else {
                loseLife(); return;
            }
        }
    }

    // Flag detection
    if (player.x + player.w > flagpole.x && player.x < flagpole.x + 20) {
        levelWin(); return;
    }

    // Fell
    if (player.y > H + 100) { loseLife(); return; }

    // Camera
    camera.x = player.x - W * 0.3;
    if (camera.x < 0) camera.x = 0;

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function spawnParts(x, y, color, n) {
    for (let i = 0; i < n; i++) {
        particles.push({
            x, y, color,
            vx: (Math.random() - .5) * 6,
            vy: (Math.random() - 1) * 5,
            life: 25 + Math.random() * 20
        });
    }
}

function loseLife() {
    lives--;
    document.getElementById('h-lives').textContent = lives;
    spawnParts(player.x + player.w / 2, player.y, '#ff4444', 20);
    if (lives <= 0) {
        gameState = 'over';
        setTimeout(() => {
            document.getElementById('game-wrap').style.display = 'none';
            document.getElementById('scr-over').classList.remove('off');
        }, 600);
    } else {
        player.x = 80; player.y = 200; player.vx = 0; player.vy = 0;
        player.invincible = 120;
    }
}

function levelWin() {
    if (transitioning) return;
    transitioning = true;
    player.state = 'celebrate';
    spawnParts(player.x + player.w / 2, player.y, '#f7c948', 30);
    spawnParts(player.x + player.w / 2, player.y, '#4cc9f0', 20);

    setTimeout(() => {
        if (lvlIdx >= LEVELS.length - 1) {
            gameState = 'won';
            document.getElementById('game-wrap').style.display = 'none';
            document.getElementById('win-stats').textContent =
                `${totalFacts} facts collected across ${LEVELS.length} levels!`;
            document.getElementById('scr-win').classList.remove('off');
        } else {
            initLevel(lvlIdx + 1);
        }
    }, 1800);
}

// ── DRAW ─────────────────────────────────────────────────
function drawBrickPattern(x, y, w, h, baseColor, topColor) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = topColor;
    ctx.fillRect(x, y, w, 5);
    // Brick lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    const bw = 32, bh = 16;
    for (let row = 0; row < Math.ceil(h / bh); row++) {
        const off = row % 2 === 0 ? 0 : bw / 2;
        for (let col = -1; col < Math.ceil(w / bw) + 1; col++) {
            const bx = x + col * bw + off, by = y + row * bh;
            ctx.strokeRect(bx, by, bw, bh);
        }
    }
}

function draw() {
    const lvl = LEVELS[lvlIdx];
    // Sky gradient
    const sg = ctx.createLinearGradient(0, 0, 0, H);
    sg.addColorStop(0, lvl.sky[0]);
    sg.addColorStop(1, lvl.sky[1]);
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 25; i++) {
        const sx = ((i * 193 + 100 - camera.x * 0.04) % W + W) % W;
        const sy = ((i * 97) % (H * 0.55));
        ctx.fillRect(sx, sy, 2, 2);
    }

    // Clouds (parallax)
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (let i = 0; i < 5; i++) {
        const cx = ((i * 280 - camera.x * 0.15) % 1200 + 1200) % 1200;
        const cy = 40 + i * 30;
        ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 40, cy - 10, 24, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 70, cy, 28, 0, Math.PI * 2); ctx.fill();
    }

    ctx.save();
    ctx.translate(-camera.x, 0);

    // Platforms
    for (const p of platforms) {
        if (p.x + p.w < camera.x - 10 || p.x > camera.x + W + 10) continue;
        if (p.t === 'g') {
            drawBrickPattern(p.x, p.y, p.w, p.h, lvl.ground, lvl.gTop);
        } else {
            // Floating brick platform
            drawBrickPattern(p.x, p.y, p.w, p.h, lvl.ground, lvl.gTop);
        }
    }

    // Pipes (decorative, at gaps)
    const pipeXs = [420, 1260, 1700, 2250];
    for (const px of pipeXs) {
        if (px + 40 < camera.x || px > camera.x + W) continue;
        const ph = 70;
        ctx.fillStyle = lvl.pipe;
        ctx.fillRect(px, GY - ph, 40, ph);
        ctx.fillStyle = shiftColor(lvl.pipe, 30);
        ctx.fillRect(px - 5, GY - ph, 50, 14); // pipe cap
        ctx.fillStyle = shiftColor(lvl.pipe, -20);
        ctx.fillRect(px + 28, GY - ph + 14, 8, ph - 14); // shade
    }

    // Coins
    for (const c of coins) {
        if (c.collected) continue;
        const cy = c.y + Math.sin(c.bobT) * 4;
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.ellipse(c.x + c.w / 2, cy + c.h / 2, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff8';
        ctx.beginPath();
        ctx.ellipse(c.x + c.w / 2 - 3, cy + c.h / 2 - 3, c.w / 6, c.h / 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Q-blocks
    for (const q of qblocks) {
        const qy = q.y + q.bounceY;
        if (q.hit) {
            ctx.fillStyle = '#333355';
            ctx.fillRect(q.x, qy, q.w, q.h);
            ctx.fillStyle = '#222244';
            ctx.fillRect(q.x, qy, q.w, 4);
            ctx.fillStyle = '#444466';
            ctx.font = '14px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('↑', q.x + q.w / 2, qy + q.h - 8);
        } else {
            // UP arrow block — electric blue gradient style
            ctx.fillStyle = '#0044cc';
            ctx.fillRect(q.x, qy, q.w, q.h);
            // Gradient highlight top
            ctx.fillStyle = '#3399ff';
            ctx.fillRect(q.x, qy, q.w, 5);
            // Darker bottom
            ctx.fillStyle = '#002288';
            ctx.fillRect(q.x, qy + q.h - 5, q.w, 5);
            ctx.fillRect(q.x + q.w - 5, qy, 5, q.h);
            // Inner border shimmer
            ctx.fillStyle = '#66bbff';
            ctx.fillRect(q.x + 2, qy + 2, q.w - 4, 2);
            // Up arrow
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('↑', q.x + q.w / 2, qy + q.h - 6);
        }
        ctx.textAlign = 'left';
    }

    // Enemies
    for (const e of enemies) {
        if (!e.alive) continue;
        // CRAB enemy — pixel art style
        const cw = e.w, ch = e.h;
        const cx2 = e.x, cy2 = e.y;
        // Body (oval-ish rectangle)
        ctx.fillStyle = '#dd3300';
        ctx.fillRect(cx2 + 4, cy2 + ch * 0.3, cw - 8, ch * 0.55);
        // Shell highlight
        ctx.fillStyle = '#ff5522';
        ctx.fillRect(cx2 + 6, cy2 + ch * 0.32, cw - 12, ch * 0.15);
        // Left claw
        ctx.fillStyle = '#cc2200';
        ctx.fillRect(cx2 - 8, cy2 + ch * 0.3, 10, 8); // arm
        ctx.fillRect(cx2 - 12, cy2 + ch * 0.2, 10, 12); // claw
        ctx.fillRect(cx2 - 12, cy2 + ch * 0.35, 10, 8); // lower claw
        // Right claw
        ctx.fillRect(cx2 + cw - 2, cy2 + ch * 0.3, 10, 8); // arm
        ctx.fillRect(cx2 + cw + 2, cy2 + ch * 0.2, 10, 12); // claw
        ctx.fillRect(cx2 + cw + 2, cy2 + ch * 0.35, 10, 8); // lower claw
        // Legs (3 per side)
        ctx.fillStyle = '#bb2200';
        for (let l = 0; l < 3; l++) {
            ctx.fillRect(cx2 + 4 + l * 7, cy2 + ch * 0.8, 4, 10); // left legs
            ctx.fillRect(cx2 + cw - 10 + l * 2, cy2 + ch * 0.8, 4, 10); // right legs
        }
        // Eyes on stalks
        ctx.fillStyle = '#cc2200';
        ctx.fillRect(cx2 + 6, cy2 + ch * 0.1, 5, 14); // left stalk
        ctx.fillRect(cx2 + cw - 11, cy2 + ch * 0.1, 5, 14); // right stalk
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx2 + 8, cy2 + ch * 0.12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + cw - 8, cy2 + ch * 0.12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(cx2 + 9, cy2 + ch * 0.12, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + cw - 9, cy2 + ch * 0.12, 2.5, 0, Math.PI * 2); ctx.fill();
        // Angry brow slant
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx2 + 4, cy2 + ch * 0.05); ctx.lineTo(cx2 + 14, cy2 + ch * 0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx2 + cw - 4, cy2 + ch * 0.05); ctx.lineTo(cx2 + cw - 14, cy2 + ch * 0.1); ctx.stroke();
    }

    // Flagpole
    {
        const fp = flagpole;
        ctx.fillStyle = '#888';
        ctx.fillRect(fp.x + 6, fp.y, 8, fp.h);
        ctx.fillStyle = totalFacts >= LEVELS[lvlIdx].facts.length ? '#f7c948' : '#555';
        ctx.fillRect(fp.x + 14, fp.y, 32, 22);
        ctx.fillStyle = '#aaa';
        ctx.beginPath(); ctx.arc(fp.x + 10, fp.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = totalFacts >= LEVELS[lvlIdx].facts.length ? '#f7c948' : '#444';
        ctx.textAlign = 'center';
        ctx.fillText(totalFacts >= LEVELS[lvlIdx].facts.length ? 'GO!' : `${totalFacts}/${LEVELS[lvlIdx].facts.length}`, fp.x + 10, fp.y - 14);
        ctx.textAlign = 'left';
    }

    // Particles
    for (const p of particles) {
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        ctx.globalAlpha = 1;
    }

    // Player
    if (player.invincible === 0 || player.blinkTimer < 3) {
        drawPlayer();
    }

    ctx.restore();
}

function drawPlayer() {
    const frame = getFrame(player.state);
    const dw = 72, dh = 88;

    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    if (player.facing === -1) ctx.scale(-1, 1);

    if (frame && frame.complete && frame.naturalWidth > 0) {
        ctx.drawImage(frame, -dw / 2, -dh / 2, dw, dh);
    } else {
        // Pixel fallback
        ctx.fillStyle = '#c8763a'; ctx.fillRect(-14, -28, 28, 26);
        ctx.fillStyle = '#1a0d00'; ctx.fillRect(-16, -46, 32, 20);
        ctx.fillStyle = '#d4a56a'; ctx.fillRect(-14, -4, 28, 22);
        ctx.fillStyle = '#1a1a4e'; ctx.fillRect(-14, 18, 28, 22);
    }
    ctx.restore();
}

function shiftColor(hex, amt) {
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt));
    return `rgb(${r},${g},${b})`;
}

// ── GAME LOOP ────────────────────────────────────────────
let raf, lastT = 0;
function loop(ts) {
    const dt = Math.min(ts - lastT, 32); lastT = ts;
    update();
    draw();
    raf = requestAnimationFrame(loop);
}

// ── CONTROLS ─────────────────────────────────────────────
document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

function doJump() { jumpReq = true; }

// Touch swipe
let touchX0 = 0;
document.addEventListener('touchstart', e => { touchX0 = e.touches[0].clientX; }, { passive: false });
document.addEventListener('touchmove', e => {
    if (e.touches[0].clientY > H - 100) return;
    e.preventDefault();
    let dx = e.touches[0].clientX - touchX0;
    if (dx > 30) { mkeys.right = true; mkeys.left = false; }
    else if (dx < -30) { mkeys.left = true; mkeys.right = false; }
}, { passive: false });
document.addEventListener('touchend', () => { mkeys.left = false; mkeys.right = false; });

function startGame() {
    if (!allLoaded()) {
        document.getElementById('btitle').textContent = "Loading...";
        return;
    }
    document.getElementById('scr-start').classList.add('off');
    document.getElementById('game-wrap').style.display = 'block';
    gameState = 'playing';
    initLevel(0);
    raf = requestAnimationFrame(loop);
}

function restartGame() {
    document.getElementById('scr-over').classList.add('off');
    document.getElementById('scr-win').classList.add('off');
    lives = 3; totalFacts = 0;
    startGame();
}
