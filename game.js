// ── SPRITES ─────────────────────────────────────────────
// Loaded from sprites.js

// Safety check - ensure SPRITES is defined
if (typeof SPRITES === 'undefined') {
    console.error('[v0] SPRITES not defined - sprites.js may have failed to load');
    window.SPRITES = {};
}

const imgs = {};
let imgsLoaded = 0;
const imgKeys = Object.keys(SPRITES);

function removeBg(originalImg) {
    const c = document.createElement('canvas');
    c.width = originalImg.width;
    c.height = originalImg.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(originalImg, 0, 0);
    const id = ctx.getImageData(0, 0, c.width, c.height);
    const d = id.data;

    // The checkered background is roughly:
    // Color 1: #e9e2d3 (r: 233, g: 226, b: 211)
    // Color 2: #d2bfaf (r: 210, g: 191, b: 175)
    // We filter anything close to these light tan colors based on brightness

    for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const isTan1 = Math.abs(r - 235) < 35 && Math.abs(g - 225) < 35 && Math.abs(b - 205) < 35;
        const isTan2 = Math.abs(r - 210) < 35 && Math.abs(g - 190) < 35 && Math.abs(b - 170) < 35;
        // The little star watermark in the corner (white/gray)
        const isStar = r > 230 && g > 230 && b > 230;

        if (isTan1 || isTan2 || isStar) {
            d[i + 3] = 0; // set alpha to transparent
        }
    }
    ctx.putImageData(id, 0, 0);
    const newImg = new Image();
    newImg.onload = () => { imgsLoaded++; };
    newImg.src = c.toDataURL();
    return newImg;
}

imgKeys.forEach(k => {
    const i = new Image();
    i.onload = () => {
        if (k.startsWith('percy')) {
            imgs[k] = removeBg(i);
        } else {
            imgsLoaded++;
        }
    };
    i.src = SPRITES[k];
    imgs[k] = i;
});

function allLoaded() { return imgKeys.length === 0 || imgsLoaded >= imgKeys.length; }

// Remove white background from image at runtime
function removeWhiteBg(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cx = c.getContext('2d');
    cx.drawImage(img, 0, 0);
    const imageData = cx.getImageData(0, 0, c.width, c.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
            data[i+3] = 0; // Make white transparent
        }
    }
    cx.putImageData(imageData, 0, 0);
    const newImg = new Image();
    newImg.src = c.toDataURL();
    return newImg;
}

// Load punch/kick sprites and remove white background
let punchImg = new Image();
let kickImg = new Image();
const punchRaw = new Image();
punchRaw.crossOrigin = 'anonymous';
punchRaw.src = 'punch.png';
punchRaw.onload = () => { punchImg = removeWhiteBg(punchRaw); };
const kickRaw = new Image();
kickRaw.crossOrigin = 'anonymous';
kickRaw.src = 'kick.png';
kickRaw.onload = () => { kickImg = removeWhiteBg(kickRaw); };

// Track which attack to use (alternates)
let lastAttackWasKick = false;

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
        name: "BOSS: MANY HATS",
        sub: "Defeat the boss to complete Alfred's journey!",
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
let canvas, ctx, W, H;
function initCanvas() {
    canvas = document.getElementById('canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        W = canvas.width;
        H = canvas.height;
    }
}
initCanvas();

let gameState = 'idle';
let lvlIdx = 0, lives = 3, totalFacts = 0;
let player, platforms, qblocks, enemies, coins, percys, flagpole;
let particles = [];
let camera = { x: 0 };
let keys = {}, mkeys = { left: false, right: false };
let animT = 0, animF = 0;
let showFact = false, transitioning = false;
let jumpReq = false;

// Attack state (punch/kick)
let sword = { active: false, timer: 0, cooldown: 0 };
let slashReq = false;

// Boss state
let boss = null;
let bossHats = [];

// Music toggle
let musicEnabled = true;

// Sprite animation map
const ANIM = {
    idle: ['idle2'], // stand still instead of waving
    run: ['run1', 'run2'],
    jump: ['jump'],
    celebrate: ['celebrate', 'jump'],
};

function getFrame(state) {
    const frames = ANIM[state] || ANIM.idle;
    return imgs[frames[animF % frames.length]];
}

// ── LEVEL LAYOUTS ────────────────────────────────────────
const LEVEL_LAYOUTS = [
    // Level 1 — rolling hills style, wide open, gentle intro
    {
        platforms: (GY) => [
            { x: 0,    y: GY,       w: 3200, h: 80, t: 'g' },
            { x: 180,  y: GY - 90,  w: 120,  h: 20, t: 'b' },
            { x: 340,  y: GY - 150, w: 90,   h: 20, t: 'b' },
            { x: 500,  y: GY - 80,  w: 150,  h: 20, t: 'b' },
            { x: 700,  y: GY - 130, w: 100,  h: 20, t: 'b' },
            { x: 850,  y: GY - 190, w: 80,   h: 20, t: 'b' },
            { x: 980,  y: GY - 110, w: 130,  h: 20, t: 'b' },
            { x: 1150, y: GY - 170, w: 100,  h: 20, t: 'b' },
            { x: 1320, y: GY - 100, w: 120,  h: 20, t: 'b' },
            { x: 1500, y: GY - 160, w: 100,  h: 20, t: 'b' },
            { x: 1680, y: GY - 80,  w: 130,  h: 20, t: 'b' },
            { x: 1860, y: GY - 140, w: 100,  h: 20, t: 'b' },
            { x: 2050, y: GY - 190, w: 90,   h: 20, t: 'b' },
            { x: 2200, y: GY - 110, w: 120,  h: 20, t: 'b' },
            { x: 2380, y: GY - 150, w: 100,  h: 20, t: 'b' },
            { x: 2560, y: GY - 80,  w: 110,  h: 20, t: 'b' },
            { x: 2740, y: GY - 40,  w: 60,   h: 20, t: 'b' },
            { x: 2800, y: GY - 80,  w: 60,   h: 20, t: 'b' },
            { x: 2860, y: GY - 120, w: 60,   h: 20, t: 'b' },
            { x: 2920, y: GY - 160, w: 80,   h: 20, t: 'b' },
        ],
        enemies: (GY) => [
            { x: 460,  y: GY - 38, w: 34, h: 34, vx: -1.2, sx: 380,  range: 180, type: 'crab',   alive: true },
            { x: 850,  y: GY - 38, w: 34, h: 34, vx:  1.3, sx: 780,  range: 200, type: 'crab',   alive: true },
            { x: 1100, y: GY - 110, sy: GY - 110, w: 36, h: 28, vx: 1.4, sx: 1050, range: 220, type: 'flyer', alive: true },
            { x: 1500, y: GY - 38, w: 34, h: 34, vx: -1.5, sx: 1420, range: 200, type: 'crab',   alive: true },
            { x: 1900, y: GY - 38, w: 40, h: 40, vx: -1.0, sx: 1820, range: 160, type: 'ogre',   alive: true, hp: 2 },
            { x: 2200, y: GY - 120, sy: GY - 120, w: 36, h: 28, vx: 1.8, sx: 2160, range: 200, type: 'flyer', alive: true },
            { x: 2500, y: GY - 38, w: 34, h: 34, vx: -1.2, sx: 2440, range: 160, type: 'crab',   alive: true },
        ],
        qpositions: (GY) => [
            { x: 240,  y: GY - 240 }, { x: 720,  y: GY - 260 },
            { x: 1200, y: GY - 280 }, { x: 1800, y: GY - 250 },
            { x: 2300, y: GY - 220 },
        ],
    },
    // Level 2 — sky islands, big gaps, flyer-heavy
    {
        platforms: (GY) => [
            { x: 0,    y: GY,       w: 400,  h: 80, t: 'g' },
            { x: 500,  y: GY - 50,  w: 160,  h: 20, t: 'b' },
            { x: 720,  y: GY - 120, w: 100,  h: 20, t: 'b' },
            { x: 880,  y: GY - 200, w: 80,   h: 20, t: 'b' },
            { x: 1020, y: GY - 130, w: 120,  h: 20, t: 'b' },
            { x: 1200, y: GY,       w: 300,  h: 80, t: 'g' },
            { x: 1560, y: GY - 80,  w: 100,  h: 20, t: 'b' },
            { x: 1710, y: GY - 160, w: 90,   h: 20, t: 'b' },
            { x: 1860, y: GY - 80,  w: 110,  h: 20, t: 'b' },
            { x: 2020, y: GY - 200, w: 80,   h: 20, t: 'b' },
            { x: 2160, y: GY,       w: 280,  h: 80, t: 'g' },
            { x: 2500, y: GY - 100, w: 90,   h: 20, t: 'b' },
            { x: 2650, y: GY - 180, w: 80,   h: 20, t: 'b' },
            { x: 2800, y: GY - 100, w: 80,   h: 20, t: 'b' },
            { x: 2940, y: GY - 40,  w: 80,   h: 20, t: 'b' },
            { x: 2990, y: GY,       w: 300,  h: 80, t: 'g' },
        ],
        enemies: (GY) => [
            { x: 540,  y: GY - 100, sy: GY - 100, w: 36, h: 28, vx: 1.5, sx: 500, range: 220, type: 'flyer', alive: true },
            { x: 750,  y: GY - 160, sy: GY - 160, w: 36, h: 28, vx:-1.6, sx: 700, range: 180, type: 'flyer', alive: true },
            { x: 1050, y: GY - 38,  w: 34, h: 34, vx: 1.3, sx: 990, range: 160, type: 'crab', alive: true },
            { x: 1250, y: GY - 38,  w: 40, h: 40, vx:-1.0, sx: 1200, range: 180, type: 'ogre', alive: true, hp: 2 },
            { x: 1600, y: GY - 120, sy: GY - 120, w: 36, h: 28, vx: 1.8, sx: 1560, range: 200, type: 'flyer', alive: true },
            { x: 1900, y: GY - 120, sy: GY - 120, w: 36, h: 28, vx:-1.5, sx: 1860, range: 180, type: 'flyer', alive: true },
            { x: 2220, y: GY - 38,  w: 34, h: 34, vx: 1.2, sx: 2160, range: 200, type: 'crab', alive: true },
            { x: 2550, y: GY - 130, sy: GY - 130, w: 36, h: 28, vx: 2.0, sx: 2500, range: 200, type: 'flyer', alive: true },
            { x: 2820, y: GY - 38,  w: 40, h: 40, vx:-1.2, sx: 2760, range: 160, type: 'ogre', alive: true, hp: 2 },
        ],
        qpositions: (GY) => [
            { x: 160,  y: GY - 220 }, { x: 760,  y: GY - 300 },
            { x: 1260, y: GY - 260 }, { x: 1900, y: GY - 290 },
            { x: 2520, y: GY - 260 },
        ],
    },
    // Level 3 — tight maze-like corridors with ceiling platforms
    {
        platforms: (GY) => [
            { x: 0,    y: GY,        w: 3200, h: 80, t: 'g' },
            { x: 0,    y: GY - 220,  w: 200,  h: 20, t: 'b' }, // ceiling shelf
            { x: 260,  y: GY - 100,  w: 80,   h: 20, t: 'b' },
            { x: 400,  y: GY - 180,  w: 80,   h: 20, t: 'b' },
            { x: 540,  y: GY - 100,  w: 80,   h: 20, t: 'b' },
            { x: 660,  y: GY - 220,  w: 200,  h: 20, t: 'b' },
            { x: 920,  y: GY - 120,  w: 80,   h: 20, t: 'b' },
            { x: 1060, y: GY - 200,  w: 120,  h: 20, t: 'b' },
            { x: 1240, y: GY - 130,  w: 80,   h: 20, t: 'b' },
            { x: 1380, y: GY - 220,  w: 200,  h: 20, t: 'b' },
            { x: 1640, y: GY - 100,  w: 80,   h: 20, t: 'b' },
            { x: 1780, y: GY - 180,  w: 80,   h: 20, t: 'b' },
            { x: 1920, y: GY - 100,  w: 80,   h: 20, t: 'b' },
            { x: 2060, y: GY - 220,  w: 160,  h: 20, t: 'b' },
            { x: 2280, y: GY - 140,  w: 80,   h: 20, t: 'b' },
            { x: 2420, y: GY - 200,  w: 80,   h: 20, t: 'b' },
            { x: 2560, y: GY - 120,  w: 100,  h: 20, t: 'b' },
            { x: 2720, y: GY - 40,   w: 60,   h: 20, t: 'b' },
            { x: 2780, y: GY - 80,   w: 60,   h: 20, t: 'b' },
            { x: 2840, y: GY - 120,  w: 60,   h: 20, t: 'b' },
            { x: 2900, y: GY - 160,  w: 80,   h: 20, t: 'b' },
        ],
        enemies: (GY) => [
            { x: 300,  y: GY - 38,  w: 34, h: 34, vx:-1.5, sx: 260,  range: 150, type: 'crab',  alive: true },
            { x: 600,  y: GY - 38,  w: 40, h: 40, vx: 1.0, sx: 540,  range: 170, type: 'ogre',  alive: true, hp: 2 },
            { x: 950,  y: GY - 160, sy: GY - 160, w: 36, h: 28, vx: 1.6, sx: 900, range: 200, type: 'flyer', alive: true },
            { x: 1100, y: GY - 38,  w: 34, h: 34, vx:-1.3, sx: 1060, range: 140, type: 'crab',  alive: true },
            { x: 1420, y: GY - 38,  w: 40, h: 40, vx:-1.1, sx: 1380, range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 1700, y: GY - 38,  w: 34, h: 34, vx: 1.4, sx: 1640, range: 140, type: 'crab',  alive: true },
            { x: 1950, y: GY - 160, sy: GY - 160, w: 36, h: 28, vx:-1.8, sx: 1900, range: 180, type: 'flyer', alive: true },
            { x: 2300, y: GY - 38,  w: 40, h: 40, vx: 1.2, sx: 2260, range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 2600, y: GY - 38,  w: 34, h: 34, vx:-1.5, sx: 2540, range: 160, type: 'crab',  alive: true },
        ],
        qpositions: (GY) => [
            { x: 50,   y: GY - 310 }, { x: 690,  y: GY - 310 },
            { x: 1100, y: GY - 300 }, { x: 1860, y: GY - 280 },
            { x: 2320, y: GY - 310 },
        ],
    },
    // Level 4 — wide tech world, lots of ogres as final boss rush
    {
        platforms: (GY) => [
            { x: 0,    y: GY,       w: 3200, h: 80, t: 'g' },
            { x: 150,  y: GY - 120, w: 100,  h: 20, t: 'b' },
            { x: 320,  y: GY - 200, w: 80,   h: 20, t: 'b' },
            { x: 460,  y: GY - 140, w: 120,  h: 20, t: 'b' },
            { x: 640,  y: GY - 80,  w: 140,  h: 20, t: 'b' },
            { x: 840,  y: GY - 180, w: 90,   h: 20, t: 'b' },
            { x: 990,  y: GY - 240, w: 80,   h: 20, t: 'b' },
            { x: 1140, y: GY - 160, w: 100,  h: 20, t: 'b' },
            { x: 1300, y: GY - 100, w: 130,  h: 20, t: 'b' },
            { x: 1500, y: GY - 200, w: 80,   h: 20, t: 'b' },
            { x: 1650, y: GY - 140, w: 100,  h: 20, t: 'b' },
            { x: 1820, y: GY - 80,  w: 120,  h: 20, t: 'b' },
            { x: 2000, y: GY - 180, w: 90,   h: 20, t: 'b' },
            { x: 2160, y: GY - 240, w: 80,   h: 20, t: 'b' },
            { x: 2300, y: GY - 160, w: 100,  h: 20, t: 'b' },
            { x: 2460, y: GY - 100, w: 120,  h: 20, t: 'b' },
            { x: 2640, y: GY - 170, w: 90,   h: 20, t: 'b' },
            { x: 2780, y: GY - 40,  w: 60,   h: 20, t: 'b' },
            { x: 2840, y: GY - 90,  w: 60,   h: 20, t: 'b' },
            { x: 2900, y: GY - 140, w: 60,   h: 20, t: 'b' },
            { x: 2960, y: GY - 190, w: 80,   h: 20, t: 'b' },
        ],
        enemies: (GY) => [
            { x: 400,  y: GY - 38,  w: 34, h: 34, vx:-1.2, sx: 320,  range: 160, type: 'crab',  alive: true },
            { x: 700,  y: GY - 38,  w: 40, h: 40, vx: 1.1, sx: 640,  range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 1000, y: GY - 170, sy: GY - 170, w: 36, h: 28, vx: 1.5, sx: 960, range: 200, type: 'flyer', alive: true },
            { x: 1160, y: GY - 38,  w: 40, h: 40, vx:-1.3, sx: 1100, range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 1350, y: GY - 38,  w: 34, h: 34, vx: 1.4, sx: 1300, range: 150, type: 'crab',  alive: true },
            { x: 1680, y: GY - 38,  w: 40, h: 40, vx:-1.0, sx: 1620, range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 1900, y: GY - 160, sy: GY - 160, w: 36, h: 28, vx: 2.0, sx: 1860, range: 180, type: 'flyer', alive: true },
            { x: 2160, y: GY - 38,  w: 34, h: 34, vx:-1.5, sx: 2100, range: 160, type: 'crab',  alive: true },
            { x: 2360, y: GY - 38,  w: 40, h: 40, vx: 1.2, sx: 2300, range: 160, type: 'ogre',  alive: true, hp: 2 },
            { x: 2600, y: GY - 38,  w: 40, h: 40, vx:-1.4, sx: 2540, range: 160, type: 'ogre',  alive: true, hp: 3 },
        ],
        qpositions: (GY) => [
            { x: 200,  y: GY - 280 }, { x: 860,  y: GY - 320 },
            { x: 1380, y: GY - 270 }, { x: 1900, y: GY - 290 },
            { x: 2400, y: GY - 290 },
        ],
    },
];

// ── LEVEL INIT ───────────────────────────────────────────
function initLevel(idx) {
    lvlIdx = idx;
    const lvl = LEVELS[idx];
    const layout = LEVEL_LAYOUTS[idx] || LEVEL_LAYOUTS[0];
    camera = { x: 0 };
    transitioning = false;
    jumpReq = false;
    slashReq = false;
    sword = { active: false, timer: 0, cooldown: 0 };

    player = {
        x: 80, y: 320, vx: 0, vy: 0,
        w: 44, h: 60,
        onGround: false, facing: 1,
        state: 'idle', invincible: 0, blinkTimer: 0
    };

    const GY = H - 80;

    platforms = layout.platforms(GY);

    // Q-blocks
    const qpositions = layout.qpositions(GY);
    qblocks = qpositions.map((p, i) => ({
        x: p.x, y: p.y, w: 38, h: 38,
        factIdx: i, hit: false,
        bounceY: 0, bounceDir: 0
    }));

    // Coins
    coins = [];
    const coinSpots = [150, 260, 400, 560, 700, 900, 1060, 1200, 1420, 1600, 1800, 2000, 2200, 2400, 2600];
    coinSpots.forEach((cx, i) => {
        coins.push({ x: cx, y: GY - 130 - ((i % 3) * 22), w: 18, h: 18, collected: false, bobT: i * 0.4 });
    });

    enemies = layout.enemies(GY);

    // End of Level Goal
    flagpole = { x: 2980, y: GY - 34, w: 52, h: 52 };

    // Boss "Many Hats" on level 4 (index 3)
    if (idx === 3) {
        boss = {
            x: 2700, y: GY - 100,
            w: 80, h: 100,
            hp: 10, maxHp: 10,
            vx: 0,
            phase: 0,
            hatTimer: 0,
            hurtTimer: 0,
            alive: true
        };
        bossHats = [];
        flagpole.x = 3100; // Move goal past boss arena
    } else {
        boss = null;
        bossHats = [];
    }

    particles = [];
    totalFacts = 0;

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
    const slash = keys['x'] || keys['f'] || keys['z'] || slashReq;

    // Move
    if (left) { player.vx = -3.8; player.facing = -1; if (player.onGround) player.state = 'run'; }
    else if (right) { player.vx = 3.8; player.facing = 1; if (player.onGround) player.state = 'run'; }
    else { player.vx *= 0.7; if (Math.abs(player.vx) < 0.1 && player.onGround) player.state = 'idle'; }

    if (jump && player.onGround) {
        player.vy = -13;
        player.onGround = false;
        player.state = 'jump';
        spawnParts(player.x + player.w / 2, player.y + player.h, '#f7c948', 6);
        createJumpSound(); // Play jump sound
    }
    jumpReq = false;
    slashReq = false;

    // Punch/Kick attack
    if (sword.cooldown > 0) sword.cooldown--;
    if (slash && !sword.active && sword.cooldown === 0) {
        sword.active = true;
        sword.timer = 14;
        sword.cooldown = 22;
        lastAttackWasKick = !lastAttackWasKick; // Alternate between punch and kick
        createSlashSound();
    }
    if (sword.active) {
        sword.timer--;
        if (sword.timer <= 0) sword.active = false;

        // Sword hitbox extends in facing direction
        const sw = 52, sh = 28;
        const sx = player.facing === 1
            ? player.x + player.w
            : player.x - sw;
        const sy = player.y + 16;
        const swordBox = { x: sx, y: sy, w: sw, h: sh };

        for (const e of enemies) {
            if (!e.alive) continue;
            if (overlap(swordBox, e)) {
                if (e.type === 'ogre') {
                    e.hp = (e.hp || 1) - 1;
                    spawnParts(e.x + e.w / 2, e.y + e.h / 2, '#ff9900', 10);
                    createHitSound();
                    if (e.hp <= 0) {
                        e.alive = false;
                        spawnParts(e.x + e.w / 2, e.y + e.h / 2, '#ff6b6b', 20);
                    }
                } else {
                    e.alive = false;
                    spawnParts(e.x + e.w / 2, e.y + e.h / 2, '#ff6b6b', 14);
                    createHitSound();
                }
            }
        }
    }

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
        
        // Ground enemies (crabs, ogres) must stay on solid ground
        if (e.type !== 'flyer') {
            // Check if there's ground ahead before moving
            const nextX = e.x + e.vx * 2;
            const footY = e.y + e.h + 5;
            let hasGround = false;
            for (const p of platforms) {
                if (nextX + e.w > p.x && nextX < p.x + p.w && footY > p.y && footY < p.y + 20) {
                    hasGround = true;
                    break;
                }
            }
            // If no ground ahead, turn around
            if (!hasGround) {
                e.vx *= -1;
            }
        }
        
        e.x += e.vx;
        if (e.x <= e.sx || e.x >= e.sx + e.range) e.vx *= -1;

        // Flyer specific motion (bobbing up and down)
        if (e.type === 'flyer') {
            e.y = e.sy + Math.sin(animT * 0.1) * 20;
        }

        if (player.invincible === 0 && overlap(player, e)) {
            const stomped = player.vy > 0 && player.y + player.h - player.vy * 0.5 <= e.y + 10;
            if (stomped && e.type !== 'ogre') {
                // Can stomp crabs and flyers
                e.alive = false;
                player.vy = -9;
                spawnParts(e.x + e.w / 2, e.y + e.h / 2, '#ff6b6b', 14);
                createHitSound();
            } else if (stomped && e.type === 'ogre') {
                // Ogres bounce you off — use the sword!
                player.vy = -9;
                loseLife(); return;
            } else {
                loseLife(); return;
            }
        }
    }

    // ── BOSS "MANY HATS" ──
    if (boss && boss.alive) {
        // Boss AI - move toward player slowly
        const bossSpeed = 0.8 + boss.phase * 0.3;
        if (player.x < boss.x) boss.vx = -bossSpeed;
        else boss.vx = bossSpeed;
        boss.x += boss.vx;

        // Keep boss in arena
        if (boss.x < 2500) boss.x = 2500;
        if (boss.x > 3000) boss.x = 3000;

        // Shoot hats
        boss.hatTimer--;
        if (boss.hatTimer <= 0) {
            const hatSpeed = 4 + boss.phase;
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            bossHats.push({
                x: boss.x + boss.w / 2 - 15,
                y: boss.y,
                w: 30, h: 20,
                vx: (dx / dist) * hatSpeed,
                vy: (dy / dist) * hatSpeed,
                spin: 0
            });
            boss.hatTimer = 80 - boss.phase * 15;
        }

        // Update hats
        for (let i = bossHats.length - 1; i >= 0; i--) {
            const h = bossHats[i];
            h.x += h.vx;
            h.y += h.vy;
            h.spin += 0.3;
            // Hat hits player
            if (player.invincible === 0 && overlap(player, h)) {
                loseLife();
                bossHats.splice(i, 1);
                continue;
            }
            // Hat out of bounds
            if (h.x < camera.x - 50 || h.x > camera.x + W + 50 || h.y > H + 50) {
                bossHats.splice(i, 1);
            }
        }

        // Player attacks boss
        if (sword.active && sword.timer > 8) {
            const atkBox = {
                x: player.facing === 1 ? player.x + player.w : player.x - 40,
                y: player.y,
                w: 50, h: player.h
            };
            if (overlap(atkBox, boss) && boss.hurtTimer <= 0) {
                boss.hp--;
                boss.hurtTimer = 30;
                boss.phase = Math.floor((boss.maxHp - boss.hp) / 3);
                spawnParts(boss.x + boss.w / 2, boss.y + 20, '#f7c948', 15);
                createHitSound();
                if (boss.hp <= 0) {
                    boss.alive = false;
                    spawnParts(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff6b6b', 40);
                    spawnParts(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f7c948', 30);
                    bossHats = [];
                }
            }
        }
        if (boss.hurtTimer > 0) boss.hurtTimer--;

        // Boss touches player
        if (player.invincible === 0 && overlap(player, boss)) {
            loseLife(); return;
        }
    }

    // Reach Percy to win the level!
    const canWin = !boss || !boss.alive;
    if (canWin && player.x + player.w > flagpole.x && player.x < flagpole.x + flagpole.w) {
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
        stopBackgroundMusic();
        setTimeout(() => {
            document.getElementById('game-wrap').style.display = 'none';
            document.getElementById('scr-over').classList.remove('off');
        }, 600);
    } else {
        player.x = 80; player.y = 200; player.vx = 0; player.vy = 0;
        player.invincible = 120;
    }
}

// Percy's personal facts for each level
const PERCY_FACTS = [
    "Alfred loves sushi!",
    "Alfred loves comic books!",
    "Alfred loves his wife MC!",
    "Alfred loves strength training!"
];

let percyAnimTimer = 0;
let showingPercyFact = false;

function levelWin() {
    if (transitioning) return;
    transitioning = true;
    showingPercyFact = true;
    player.state = 'celebrate';
    
    // Spawn hearts and stars around Percy
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            spawnParts(flagpole.x + flagpole.w / 2 + (Math.random() - 0.5) * 60, 
                       flagpole.y + (Math.random() - 0.5) * 40, '#ff6b9d', 3);
            spawnParts(flagpole.x + flagpole.w / 2 + (Math.random() - 0.5) * 60, 
                       flagpole.y + (Math.random() - 0.5) * 40, '#f7c948', 3);
        }, i * 100);
    }
    spawnParts(player.x + player.w / 2, player.y, '#f7c948', 30);
    spawnParts(player.x + player.w / 2, player.y, '#4cc9f0', 20);

    // Show Percy's fact
    const popup = document.getElementById('popup');
    if (popup) {
        const ptitle = popup.querySelector('.ptitle');
        const pbody = popup.querySelector('.pbody');
        if (ptitle) ptitle.textContent = "PERCY SAYS:";
        if (pbody) pbody.textContent = PERCY_FACTS[lvlIdx] || "Alfred is awesome!";
        popup.classList.add('on');
    }

    // Wait 10 seconds then advance
    setTimeout(() => {
        if (popup) popup.classList.remove('on');
        showingPercyFact = false;
        
        if (lvlIdx >= LEVELS.length - 1) {
            gameState = 'won';
            stopBackgroundMusic();
            document.getElementById('game-wrap').style.display = 'none';
            document.getElementById('win-stats').textContent =
                `${totalFacts} facts collected across ${LEVELS.length} levels!`;
            document.getElementById('scr-win').classList.remove('off');
        } else {
            initLevel(lvlIdx + 1);
        }
    }, 10000);
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

    // Pipes (decorative, at gaps) - REMOVED

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
        const cw = e.w, ch = e.h;
        const cx2 = e.x, cy2 = e.y;

        ctx.save();
        if (e.type === 'flyer') {
            // Flying Monster (Purple Bat)
            ctx.translate(cx2 + cw / 2, cy2 + ch / 2);
            if (e.vx > 0) ctx.scale(-1, 1);

            // Flapping motion logic
            const flap = Math.sin(animT * 0.3) > 0 ? 1 : -1;

            // Body
            ctx.fillStyle = '#6633aa';
            ctx.fillRect(-10, -8, 20, 16);

            // Wings
            ctx.fillStyle = '#441188';
            if (flap > 0) {
                ctx.fillRect(-22, -14, 12, 10); // left wing up
                ctx.fillRect(10, -14, 12, 10); // right wing up
            } else {
                ctx.fillRect(-22, -2, 12, 10); // left wing down
                ctx.fillRect(10, -2, 12, 10); // right wing down
            }

            // Eye
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(-4, -2, 4, 4);
        } else if (e.type === 'ogre') {
            // BIG OGRE — pixel art chunky green monster
            const hp = e.hp || 1;
            // Body
            ctx.fillStyle = '#2e7d32';
            ctx.fillRect(cx2, cy2 + 10, cw, ch * 0.7);
            // Highlight
            ctx.fillStyle = '#43a047';
            ctx.fillRect(cx2 + 2, cy2 + 12, cw - 4, 6);
            // Head (big, square)
            ctx.fillStyle = '#388e3c';
            ctx.fillRect(cx2 - 4, cy2 - 10, cw + 8, 24);
            // Eyes
            ctx.fillStyle = '#ff3d00';
            ctx.fillRect(cx2 + 4, cy2 - 6, 8, 8);
            ctx.fillRect(cx2 + cw - 12, cy2 - 6, 8, 8);
            ctx.fillStyle = '#fff';
            ctx.fillRect(cx2 + 6, cy2 - 4, 4, 4);
            ctx.fillRect(cx2 + cw - 10, cy2 - 4, 4, 4);
            // Mouth / teeth
            ctx.fillStyle = '#1b5e20';
            ctx.fillRect(cx2 + 6, cy2 + 8, cw - 12, 6);
            ctx.fillStyle = '#fff';
            ctx.fillRect(cx2 + 8, cy2 + 8, 5, 5);
            ctx.fillRect(cx2 + cw - 13, cy2 + 8, 5, 5);
            // Arms
            ctx.fillStyle = '#2e7d32';
            ctx.fillRect(cx2 - 10, cy2 + 14, 12, 20);
            ctx.fillRect(cx2 + cw - 2, cy2 + 14, 12, 20);
            // Feet
            ctx.fillStyle = '#1b5e20';
            ctx.fillRect(cx2 + 2, cy2 + ch * 0.7, 12, 10);
            ctx.fillRect(cx2 + cw - 14, cy2 + ch * 0.7, 12, 10);
            // HP pips
            for (let pip = 0; pip < (e.hp || 1); pip++) {
                ctx.fillStyle = pip === 0 ? '#ff3d00' : '#ffb300';
                ctx.fillRect(cx2 + 4 + pip * 12, cy2 - 20, 9, 6);
            }
        } else {
            // CRAB enemy — pixel art style
            // Body (oval-ish rectangle)
            ctx.fillStyle = '#dd3300';
            ctx.fillRect(cx2 + 4, cy2 + ch * 0.3, cw - 8, ch * 0.55);
            // Shell highlight
            ctx.fillStyle = '#ff5522';
            ctx.fillRect(cx2 + 6, cy2 + ch * 0.32, cw - 12, ch * 0.15);
            // Left claw
            ctx.fillStyle = '#cc2200';
            ctx.fillRect(cx2 - 8, cy2 + ch * 0.3, 10, 8);
            ctx.fillRect(cx2 - 12, cy2 + ch * 0.2, 10, 12);
            ctx.fillRect(cx2 - 12, cy2 + ch * 0.35, 10, 8);
            // Right claw
            ctx.fillRect(cx2 + cw - 2, cy2 + ch * 0.3, 10, 8);
            ctx.fillRect(cx2 + cw + 2, cy2 + ch * 0.2, 10, 12);
            ctx.fillRect(cx2 + cw + 2, cy2 + ch * 0.35, 10, 8);
            // Legs (3 per side)
            ctx.fillStyle = '#bb2200';
            for (let l = 0; l < 3; l++) {
                ctx.fillRect(cx2 + 4 + l * 7, cy2 + ch * 0.8, 4, 10);
                ctx.fillRect(cx2 + cw - 10 + l * 2, cy2 + ch * 0.8, 4, 10);
            }
            // Eyes on stalks
            ctx.fillStyle = '#cc2200';
            ctx.fillRect(cx2 + 6, cy2 + ch * 0.1, 5, 14);
            ctx.fillRect(cx2 + cw - 11, cy2 + ch * 0.1, 5, 14);
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
        ctx.restore();
    }

    // ── BOSS "MANY HATS" ──
    if (boss && boss.alive) {
        const bx = boss.x, by = boss.y, bw = boss.w, bh = boss.h;
        const hurt = boss.hurtTimer > 0 && boss.hurtTimer % 4 < 2;
        
        ctx.save();
        if (hurt) ctx.globalAlpha = 0.6;
        
        // Body - tall figure in suit
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(bx + 10, by + 30, bw - 20, bh - 30);
        
        // Suit highlights
        ctx.fillStyle = '#2d2d44';
        ctx.fillRect(bx + 15, by + 35, 10, bh - 40);
        ctx.fillRect(bx + bw - 25, by + 35, 10, bh - 40);
        
        // Head
        ctx.fillStyle = '#d4a56a';
        ctx.fillRect(bx + 20, by + 5, bw - 40, 30);
        
        // Eyes - menacing
        ctx.fillStyle = '#ff3d00';
        ctx.fillRect(bx + 28, by + 14, 8, 8);
        ctx.fillRect(bx + bw - 36, by + 14, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(bx + 30, by + 16, 4, 4);
        ctx.fillRect(bx + bw - 34, by + 16, 4, 4);
        
        // Mouth - evil grin
        ctx.fillStyle = '#000';
        ctx.fillRect(bx + 30, by + 26, bw - 60, 4);
        
        // Stack of hats on head!
        const hatColors = ['#1a0d00', '#333', '#4a3728', '#222', '#5c4033'];
        for (let i = 0; i < 3 + boss.phase; i++) {
            const hatY = by - 10 - i * 12;
            const hatColor = hatColors[i % hatColors.length];
            ctx.fillStyle = hatColor;
            ctx.fillRect(bx + 10, hatY, bw - 20, 10);
            ctx.fillRect(bx + 15, hatY - 8, bw - 30, 10);
        }
        
        // Arms
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(bx - 10, by + 40, 20, 40);
        ctx.fillRect(bx + bw - 10, by + 40, 20, 40);
        
        // Hands
        ctx.fillStyle = '#d4a56a';
        ctx.fillRect(bx - 8, by + 75, 16, 12);
        ctx.fillRect(bx + bw - 8, by + 75, 16, 12);
        
        ctx.restore();
        
        // Health bar
        const hbW = 100, hbH = 10;
        const hbX = bx + bw / 2 - hbW / 2;
        const hbY = by - 40 - boss.phase * 12;
        ctx.fillStyle = '#333';
        ctx.fillRect(hbX - 2, hbY - 2, hbW + 4, hbH + 4);
        ctx.fillStyle = '#ff3d00';
        ctx.fillRect(hbX, hbY, hbW * (boss.hp / boss.maxHp), hbH);
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MANY HATS', bx + bw / 2, hbY - 6);
    }

    // Draw boss hats (projectiles)
    for (const h of bossHats) {
        ctx.save();
        ctx.translate(h.x + h.w / 2, h.y + h.h / 2);
        ctx.rotate(h.spin);
        ctx.fillStyle = '#1a0d00';
        ctx.fillRect(-h.w / 2, -h.h / 2, h.w, h.h * 0.6);
        ctx.fillRect(-h.w / 2 + 4, -h.h / 2 - 6, h.w - 8, h.h * 0.5);
        ctx.restore();
    }

    // Flagpole / Percy to rescue
    {
        const fp = flagpole;
        const frameKey = (Math.floor(animT / 6) % 2 === 0) ? 'percy1' : 'percy2';
        const pImg = imgs[frameKey];
        if (pImg && pImg.complete && pImg.naturalWidth > 0) {
            ctx.save();
            ctx.translate(fp.x + fp.w / 2, fp.y + fp.h / 2);
            // Flip if facing left (looking back at the player)
            ctx.scale(-1, 1);

            // Draw slightly larger than the hitbox for better visibility
            const dw = 52, dh = 52;
            ctx.drawImage(pImg, -dw / 2, -dh / 2 - 8, dw, dh);
            ctx.restore();

            // Draw "RESCUE ME!" indicator
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = totalFacts >= LEVELS[lvlIdx].facts.length ? '#f7c948' : '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(totalFacts >= LEVELS[lvlIdx].facts.length ? 'SAVE PERCY!' : `GET ${LEVELS[lvlIdx].facts.length} FACTS!`, fp.x + fp.w / 2, fp.y - 14);
            ctx.textAlign = 'left';
        } else {
            // Flagpole fallback
            ctx.fillStyle = '#888';
            ctx.fillRect(fp.x + 6, fp.y, 8, 80);
        }
    }

    // Particles
    for (const p of particles) {
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        
        // Draw hearts for pink particles during Percy celebration
        if (p.color === '#ff6b9d' && showingPercyFact) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.beginPath();
            ctx.moveTo(0, 2);
            ctx.bezierCurveTo(-4, -2, -8, 2, 0, 8);
            ctx.bezierCurveTo(8, 2, 4, -2, 0, 2);
            ctx.fill();
            ctx.restore();
        }
        // Draw stars for gold particles during Percy celebration
        else if (p.color === '#f7c948' && showingPercyFact) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                const r = i === 0 ? 6 : 6;
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                const innerAngle = angle + Math.PI / 5;
                ctx.lineTo(Math.cos(innerAngle) * 3, Math.sin(innerAngle) * 3);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        else {
            ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        }
        ctx.globalAlpha = 1;
    }

    // Player
    if (player.invincible === 0 || player.blinkTimer < 3) {
        drawPlayer();
    }

    // Punch/Kick impact effect
    if (sword.active && sword.timer > 8) {
        const alpha = (sword.timer - 8) / 6;
        ctx.globalAlpha = alpha;
        const impactX = player.facing === 1 ? player.x + player.w + 20 : player.x - 30;
        const impactY = player.y + 20;
        
        // Impact burst
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const r1 = 8, r2 = 18;
            ctx.lineTo(impactX + Math.cos(angle) * r1, impactY + Math.sin(angle) * r1);
            ctx.lineTo(impactX + Math.cos(angle + Math.PI / 6) * r2, impactY + Math.sin(angle + Math.PI / 6) * r2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    ctx.restore();
}

function drawPlayer() {
    const dw = 52, dh = 80; // Same size for all sprites

    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    if (player.facing === -1) ctx.scale(-1, 1);

    // Draw punch/kick sprite if attacking, otherwise normal frame
    if (sword.active) {
        // Use the alternating attack sprite
        const atkSprite = lastAttackWasKick ? kickImg : punchImg;
        if (atkSprite && atkSprite.complete && atkSprite.naturalWidth > 0) {
            ctx.drawImage(atkSprite, -dw / 2, -dh / 2, dw, dh);
        } else {
            // Fallback pixel art
            ctx.fillStyle = '#c8763a'; ctx.fillRect(-10, -26, 20, 22);
            ctx.fillStyle = '#1a0d00'; ctx.fillRect(-12, -42, 24, 18);
            ctx.fillStyle = '#d4a56a'; ctx.fillRect(-10, -4, 20, 18);
            ctx.fillStyle = '#1a1a4e'; ctx.fillRect(-10, 14, 20, 18);
        }
    } else {
        const frame = getFrame(player.state);
        if (frame && frame.complete && frame.naturalWidth > 0) {
            ctx.drawImage(frame, -dw / 2, -dh / 2, dw, dh);
        } else {
            // Pixel fallback
            ctx.fillStyle = '#c8763a'; ctx.fillRect(-10, -26, 20, 22);
            ctx.fillStyle = '#1a0d00'; ctx.fillRect(-12, -42, 24, 18);
            ctx.fillStyle = '#d4a56a'; ctx.fillRect(-10, -4, 20, 18);
            ctx.fillStyle = '#1a1a4e'; ctx.fillRect(-10, 14, 20, 18);
        }
    }

    ctx.restore();
}

function shiftColor(hex, amt) {
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt));
    return `rgb(${r},${g},${b})`;
}

// ── AUDIO ───────────────────────────────────────────────
let audioCtx = null;
try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.warn("[v0] AudioContext not available:", e);
}

function createJumpSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
}

function createSlashSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Swoosh — descending noise burst
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    filter.Q.value = 0.8;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    src.start(now);
}

function createHitSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

function createBackgroundMusic() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [330, 330, 330, 262, 330, 392, 196]; // Simple 8-bit melody
    let time = now;
    
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        osc.start(time);
        osc.stop(time + 0.3);
        time += 0.3;
    });
}

let musicPlaying = false;
function startBackgroundMusic() {
    if (musicPlaying || !musicEnabled) return;
    musicPlaying = true;
    
    const playMusicLoop = () => {
        if (gameState === 'playing' && musicEnabled) {
            createBackgroundMusic();
            setTimeout(playMusicLoop, 2100);
        } else {
            musicPlaying = false;
        }
    };
    playMusicLoop();
}

function stopBackgroundMusic() {
    musicPlaying = false;
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const btn = document.getElementById('music-toggle');
    if (btn) btn.textContent = musicEnabled ? 'MUSIC: ON' : 'MUSIC: OFF';
    if (musicEnabled && gameState === 'playing') {
        startBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
}
window.toggleMusic = toggleMusic;

// ── GAME LOOP ────────────────────────────────────────────
let raf, lastT = 0;
function loop(ts) {
    const dt = Math.min(ts - lastT, 32); lastT = ts;
    update();
    draw();
    raf = requestAnimationFrame(loop);
}

// ── CONTROLS ─────────────────────────────────────────────
window.addEventListener('keydown', e => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'x', 'f', 'z'].includes(e.key)) {
        e.preventDefault();
    }
    // Space / Enter advance menu screens
    if (e.key === ' ' || e.key === 'Enter') {
        if (gameState === 'idle') { startGame(); return; }
        if (gameState === 'over' || gameState === 'won') { restartGame(); return; }
    }
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') jumpReq = true;
    if (e.key === 'x' || e.key === 'f' || e.key === 'z') slashReq = true;
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

function doJump() { jumpReq = true; }
function doSlash() { slashReq = true; }

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
    // Cancel any existing animation frame to prevent speed-up on restart
    if (raf) cancelAnimationFrame(raf);
    
    // Resume AudioContext if suspended (browser autoplay policy)
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('scr-start').classList.add('off');
    document.getElementById('game-wrap').style.display = 'block';
    gameState = 'playing';
    lastT = 0; // Reset timing
    initLevel(0);
    startBackgroundMusic();
    raf = requestAnimationFrame(loop);
}

function restartGame() {
    document.getElementById('scr-over').classList.add('off');
    document.getElementById('scr-win').classList.add('off');
    lives = 3; totalFacts = 0;
    startGame();
}

// Export to window for onclick handlers
window.startGame = startGame;
window.restartGame = restartGame;
window.doJump = doJump;
window.doSlash = doSlash;
window.mkeys = mkeys;
