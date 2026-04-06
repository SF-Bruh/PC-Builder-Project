/* ============================================
   PC Build Buddy - Application Logic
   ============================================ */

// ---- State ----
let userLevel = null; // 'beginner', 'intermediate', 'advanced'
let quizScore = 0;
let currentPath = null; // 'building', 'maintaining'
let messageDelay = 400;

const chat = document.getElementById('chatContainer');
const progressBar = document.getElementById('progressBar');

// ---- Helpers ----
function setProgress(pct) {
  progressBar.style.width = pct + '%';
}

function scrollToBottom() {
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
}

function addMessage(html, cls, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'message ' + (cls || 'bot');
      div.innerHTML = html;
      chat.appendChild(div);
      scrollToBottom();
      resolve(div);
    }, delay || messageDelay);
  });
}

function addUserReply(text) {
  return addMessage(
    `<div class="message-label">You</div><div class="message-bubble">${text}</div>`,
    'user-response', 0
  );
}

function clearChat() {
  chat.innerHTML = '';
}

function lang(beginner, intermediate, advanced) {
  if (userLevel === 'beginner') return beginner;
  if (userLevel === 'intermediate') return intermediate;
  return advanced;
}

// ---- Screens ----

function goHome() {
  userLevel = null;
  quizScore = 0;
  currentPath = null;
  setProgress(0);
  clearChat();
  showWelcome();
}

async function showWelcome() {
  setProgress(5);
  await addMessage(`
    <div class="message-bubble hero-message-inner" style="text-align:center;padding:40px 32px;">
      <div class="hero-title">Welcome to PC Build Buddy</div>
      <div class="hero-subtitle">Your personal guide for building &amp; maintaining PCs</div>
      <div class="hero-tagline" style="color:var(--text-muted);font-size:13px;margin-top:6px;">
        Whether you're a first-timer or a seasoned builder — we've got you covered.
      </div>
    </div>
  `, 'bot hero-message', 200);

  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      Let's start by figuring out your experience level so I can tailor everything to you.<br><br>
      <strong>Answer 5 quick questions</strong> — no wrong answers, just pick what feels right.
      <div style="margin-top:14px;">
        <button class="continue-btn" onclick="startQuiz()">Let's Go →</button>
      </div>
    </div>
  `, 'bot', 300);
}

// ---- Quiz ----
const quizQuestions = [
  {
    q: "What does 'GPU' stand for?",
    opts: [
      { text: "General Processing Unit", pts: 0 },
      { text: "Graphics Processing Unit", pts: 2 },
      { text: "I'm not sure", pts: 0 }
    ]
  },
  {
    q: "Have you ever opened up a PC case?",
    opts: [
      { text: "Nope, never", pts: 0 },
      { text: "Yes, to look around or clean", pts: 1 },
      { text: "Yes, I've swapped or installed parts", pts: 2 }
    ]
  },
  {
    q: "What is thermal paste used for?",
    opts: [
      { text: "No idea", pts: 0 },
      { text: "It goes between the CPU and cooler", pts: 1 },
      { text: "Transfers heat from CPU to heatsink for better cooling", pts: 2 }
    ]
  },
  {
    q: "Do you know what 'XMP/EXPO' does in BIOS?",
    opts: [
      { text: "What is BIOS?", pts: 0 },
      { text: "I know BIOS but not XMP/EXPO", pts: 1 },
      { text: "Yes — it enables rated RAM speeds", pts: 2 }
    ]
  },
  {
    q: "If your PC randomly shuts down under load, what would you check first?",
    opts: [
      { text: "I'd take it to a shop", pts: 0 },
      { text: "Maybe temperatures or power supply?", pts: 1 },
      { text: "Thermals, PSU wattage, event logs, and stress test stability", pts: 2 }
    ]
  }
];

let currentQuizQ = 0;

async function startQuiz() {
  currentQuizQ = 0;
  quizScore = 0;
  setProgress(10);
  showQuizQuestion();
}

async function showQuizQuestion() {
  const q = quizQuestions[currentQuizQ];
  const pct = 10 + ((currentQuizQ / quizQuestions.length) * 20);
  setProgress(pct);

  let optsHtml = q.opts.map((o, i) =>
    `<button class="quiz-option" onclick="answerQuiz(${i})">${o.text}</button>`
  ).join('');

  await addMessage(`
    <div class="message-label">Question ${currentQuizQ + 1} of ${quizQuestions.length}</div>
    <div class="message-bubble">
      <strong>${q.q}</strong>
      <div class="options-grid" style="margin-top:12px;">${optsHtml}</div>
    </div>
  `, 'bot');
}

async function answerQuiz(idx) {
  const q = quizQuestions[currentQuizQ];
  quizScore += q.opts[idx].pts;
  await addUserReply(q.opts[idx].text);
  currentQuizQ++;

  if (currentQuizQ < quizQuestions.length) {
    showQuizQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  if (quizScore <= 3) userLevel = 'beginner';
  else if (quizScore <= 7) userLevel = 'intermediate';
  else userLevel = 'advanced';

  setProgress(35);

  const labels = { beginner: '🌱 Beginner', intermediate: '🔧 Intermediate', advanced: '⚡ Advanced' };
  const descs = {
    beginner: "No worries — I'll explain everything in plain language with extra detail. You're in good hands!",
    intermediate: "Nice! You know your way around. I'll keep things clear but won't over-explain the basics.",
    advanced: "You clearly know your stuff. I'll keep it concise and technical — just the good details."
  };

  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      <div style="font-size:20px;font-weight:700;margin-bottom:4px;">${labels[userLevel]}</div>
      <div style="color:var(--text-secondary);margin-bottom:14px;">${descs[userLevel]}</div>
      <div class="tip-box success">
        <span class="tip-icon">✓</span>
        <span>Experience level set. All guidance will be tailored to you.</span>
      </div>
    </div>
  `, 'bot', 300);

  showMainMenu();
}

// ---- Main Menu ----
async function showMainMenu() {
  setProgress(40);
  const buildDesc = lang(
    "I want to build a new PC from scratch",
    "Time to put together a new rig",
    "New build — component selection & assembly"
  );
  const maintainDesc = lang(
    "My PC needs fixing or I want to upgrade something",
    "Upgrade parts or troubleshoot issues",
    "Hardware upgrades or diagnostics & troubleshooting"
  );

  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang("What would you like help with today?", "What are we doing today?", "What's on the agenda?")}
      <div class="options-grid horizontal" style="margin-top:14px;">
        <button class="option-card" onclick="choosePath('building')">
          <span class="option-icon">🛠️</span>
          <div class="option-info">
            <span class="option-title">${lang("Build a PC", "New Build", "New Build")}</span>
            <span class="option-desc">${buildDesc}</span>
          </div>
        </button>
        <button class="option-card" onclick="choosePath('maintaining')">
          <span class="option-icon">🔩</span>
          <div class="option-info">
            <span class="option-title">${lang("Fix / Upgrade My PC", "Maintain My Rig", "Maintain / Optimize")}</span>
            <span class="option-desc">${maintainDesc}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 300);
}

async function choosePath(path) {
  currentPath = path;
  await addUserReply(path === 'building' ? '🛠️ Build a PC' : '🔩 Maintain my PC');
  if (path === 'building') startBuildingGuide();
  else showMaintainMenu();
}

// ============ BUILDING GUIDE ============

const buildSteps = [
  {
    title: "Plan Your Budget & Purpose",
    icon: "💰",
    beginner: [
      "Decide what you'll use the PC for: gaming, schoolwork, video editing, or general use.",
      "Set a realistic budget. A solid gaming PC starts around $700–$1000.",
      "Don't forget to budget for a monitor, keyboard, and mouse if you don't have them!"
    ],
    intermediate: [
      "Define your use case and target resolution/FPS or workload.",
      "Budget allocation: ~35-40% GPU, ~20% CPU, ~15% motherboard+RAM, rest on case/PSU/storage.",
      "Factor in peripherals and any software licenses you may need."
    ],
    advanced: [
      "Define workload profile — gaming (GPU-bound), productivity (CPU/RAM), or hybrid.",
      "Consider price-to-performance ratios at current MSRP; check for generational overlap.",
      "Account for platform longevity (e.g., AM5 vs LGA 1851 upgrade paths)."
    ],
    tip: { type: "info", text: "Use PCPartPicker.com to check compatibility and compare prices across retailers." }
  },
  {
    title: "Choose Your Components",
    icon: "🧩",
    beginner: [
      "<strong>CPU</strong> — The brain of your PC. AMD Ryzen 5 or Intel Core i5 are great starting points.",
      "<strong>GPU</strong> — The graphics card. This matters most for gaming.",
      "<strong>Motherboard</strong> — Make sure it matches your CPU (AMD or Intel).",
      "<strong>RAM</strong> — 16GB DDR5 is the sweet spot right now.",
      "<strong>Storage</strong> — Get an NVMe SSD (1TB) for fast boot and load times.",
      "<strong>Power Supply (PSU)</strong> — Get a reliable 80+ Bronze rated unit, at least 550W.",
      "<strong>Case</strong> — Pick one you like that has good airflow (mesh front panel)."
    ],
    intermediate: [
      "CPU: Match to your workload. Ryzen 7 / i7 for multitasking, Ryzen 5 / i5 for pure gaming.",
      "GPU: Target your resolution — 1080p (RTX 4060 / RX 7600), 1440p (RTX 4070 / RX 7800 XT).",
      "Mobo: Check VRM quality, M.2 slots, USB headers, and rear I/O.",
      "RAM: 2x16GB DDR5 at 6000MT/s CL30 is the current value sweet spot.",
      "Storage: Gen4 NVMe for boot, add a 2TB SATA SSD or HDD for bulk.",
      "PSU: 80+ Gold, fully modular, 650-850W depending on GPU.",
      "Case: Prioritize airflow (mesh), cable management space, and front I/O."
    ],
    advanced: [
      "CPU: Evaluate IPC, boost clocks, cache (e.g., X3D for gaming), and platform thermals.",
      "GPU: Benchmark-match to target res/Hz. Consider VRAM headroom for future titles.",
      "Mobo: VRM thermals, BIOS maturity, PCIe lane allocation, debug LEDs/POST codes.",
      "RAM: Validate QVL, tune sub-timings if Hynix A-die or M-die kits, check FCLK ratio.",
      "Storage: Gen5 NVMe for sequential workloads; Gen4 remains best value for gaming.",
      "PSU: ATX 3.1 w/ native 12V-2x6 connector if running high-end GPU. Check transient response.",
      "Case: Evaluate thermal capacity vs noise profile. Consider custom loop clearance if needed."
    ],
    tip: { type: "warning", text: "Always double-check CPU + Motherboard socket compatibility before buying!" }
  },
  {
    title: "Prepare Your Workspace",
    icon: "🧹",
    beginner: [
      "Find a large, clean, well-lit table or desk.",
      "Keep your motherboard box nearby — you'll build on top of it.",
      "Have a Phillips-head screwdriver ready (that's the + shaped one).",
      "Touch something metal before handling parts to discharge static electricity."
    ],
    intermediate: [
      "Clean, spacious surface. Anti-static mat or motherboard box as work surface.",
      "Phillips #2 screwdriver is all you need for 95% of the build.",
      "Keep zip ties or velcro straps handy for cable management.",
      "Have your manuals open — especially the motherboard manual for front panel headers."
    ],
    advanced: [
      "Prep workspace. Have thermal paste, isopropyl alcohol, lint-free cloth on hand.",
      "Keep motherboard standoffs, M.2 screws, and extra fan splitters accessible.",
      "If doing a custom loop: have paper towels, leak-test setup, and distilled coolant ready."
    ],
    tip: { type: "success", text: "Pro tip: Take photos at each step. If something goes wrong, you can retrace easily." }
  },
  {
    title: "Install the CPU",
    icon: "🔲",
    beginner: [
      "Open the CPU socket on the motherboard (lift the metal lever).",
      "Look for the small triangle on the CPU — match it to the triangle on the socket.",
      "Gently place the CPU in. It should drop in with ZERO force.",
      "Close the lever to lock it in place.",
      "⚠️ NEVER touch the gold pins/pads on the bottom of the CPU!"
    ],
    intermediate: [
      "Lift socket lever, align the alignment triangle/notches, and drop the CPU in — zero insertion force.",
      "For LGA: the plastic cover pops off when you close the retention bracket. Keep it for RMA.",
      "Verify the CPU is seated flush before closing."
    ],
    advanced: [
      "ZIF socket — align, drop, lock. Inspect for bent pins (PGA) or debris (LGA) beforehand.",
      "Retain the socket cover for potential warranty claims.",
      "If delidded or lapped, ensure IHS makes clean contact with retention mechanism."
    ],
    tip: { type: "danger", text: "If the CPU doesn't drop in easily, STOP. Never force it — you'll bend pins and destroy the CPU or motherboard." }
  },
  {
    title: "Install RAM & Storage",
    icon: "💾",
    beginner: [
      "Find the RAM slots on your motherboard (long slots near the CPU).",
      "If you have 2 sticks and 4 slots, use slots 2 and 4 (check your manual).",
      "Open the clips on the slots, line up the notch on the RAM, and push firmly until it clicks.",
      "For your SSD: find the M.2 slot, insert at an angle, then screw it down flat."
    ],
    intermediate: [
      "Populate DIMM slots per manual — typically A2/B2 for dual-channel on 4-slot boards.",
      "Ensure RAM clicks into both retention clips. Partial seating is a top cause of no-POST.",
      "M.2: Remove heatsink, insert at 30° into the slot, press down, screw with standoff."
    ],
    advanced: [
      "Dual-channel config per T-topology or daisy-chain layout (check mobo docs for optimal slots).",
      "For 4-DIMM population at high frequencies, expect to tune VDDQ/VDD and loosen timings.",
      "M.2: Confirm which slots share bandwidth with SATA ports if populating multiple drives."
    ],
    tip: { type: "info", text: "RAM requires more force than you'd expect. A firm, even push until both clips snap is normal." }
  },
  {
    title: "Install CPU Cooler",
    icon: "❄️",
    beginner: [
      "If your cooler came with pre-applied thermal paste (grey pad on bottom), you're good to go!",
      "If not, apply a small pea-sized dot of thermal paste to the center of the CPU.",
      "Mount the cooler on top of the CPU and screw it down in a cross pattern (corner to corner).",
      "Plug the fan cable into the CPU_FAN header on the motherboard."
    ],
    intermediate: [
      "Apply thermal paste (pea/X method) if not pre-applied. Don't over-apply.",
      "Tighten in a cross/star pattern to ensure even mounting pressure.",
      "Route the fan cable to CPU_FAN header. Use CPU_OPT or a splitter for dual-fan towers.",
      "For AIOs: mount radiator as intake (front) or exhaust (top) — tubes down preferred if front-mounted."
    ],
    advanced: [
      "Paste application: contact-pressure method for IHS size. Spreader for large IHS (TR/EPYC).",
      "Mounting pressure: even cross-pattern. Check for IHS bow on large sockets.",
      "AIO orientation: radiator above pump to prevent air accumulation in pump head. Tubes-down if side-mounted.",
      "For custom loops: ensure block mounting doesn't put uneven pressure on the IHS."
    ],
    tip: { type: "warning", text: "Don't forget to remove the plastic cover from the bottom of the cooler before mounting!" }
  },
  {
    title: "Mount Motherboard in Case",
    icon: "📦",
    beginner: [
      "Install the I/O shield (metal plate) into the back of the case — it snaps in from inside.",
      "Place standoffs in the case that match your motherboard size (usually pre-installed).",
      "Lower the motherboard in gently, aligning it with the I/O shield and standoff holes.",
      "Screw in all the motherboard screws — don't over-tighten!"
    ],
    intermediate: [
      "Pre-install I/O shield (unless integrated into the board). Align standoffs to ATX/mATX/ITX pattern.",
      "Seat the board, align rear I/O with shield, and secure with all standoff screws.",
      "Snug-tight, not gorilla-tight — you're screwing into brass standoffs."
    ],
    advanced: [
      "Verify standoff placement matches form factor. Extra standoffs can short the PCB.",
      "For ITX: consider whether to pre-route cables before seating the board.",
      "Ensure no motherboard flex — all standoff points should make contact."
    ],
    tip: { type: "info", text: "Most modern motherboards have a built-in I/O shield — check before trying to install a separate one!" }
  },
  {
    title: "Install GPU & Power Supply",
    icon: "⚡",
    beginner: [
      "Slide the power supply into the bottom of the case and screw it in from the back.",
      "Remove the metal slot covers on the back of the case for your GPU (usually 2 slots).",
      "Push the GPU firmly into the top PCIe slot on the motherboard until it clicks.",
      "Screw the GPU bracket to the case so it doesn't sag.",
      "Connect the power cables: 24-pin to motherboard, 8-pin to CPU, and PCIe cables to GPU."
    ],
    intermediate: [
      "PSU: Fan-down for bottom intake (if case has a vent). Route cables through the back.",
      "GPU: Seat in the top x16 PCIe slot. Ensure the retention clip engages.",
      "Cables: 24-pin ATX, 8-pin EPS (CPU), PCIe power to GPU. Use separate cables — don't daisy-chain for high-end GPUs.",
      "Cable management: route through grommets, tie down excess in the back panel."
    ],
    advanced: [
      "PSU orientation per case ventilation. For SFX in ATX cases, use adapter bracket.",
      "GPU: Primary x16 slot (CPU-direct lanes). Check clearance for triple-slot cards.",
      "12V-2x6 / 12VHPWR: ensure full insertion, no melted connectors. Avoid sharp bends at the terminal.",
      "Cable management: plan routes before connecting. Consider cable combs and custom-length cables."
    ],
    tip: { type: "danger", text: "NEVER mix power supply cables between brands! Each brand has different pin wiring. Using wrong cables can fry your components." }
  },
  {
    title: "Connect Front Panel & Fans",
    icon: "🔌",
    beginner: [
      "This is the fiddly part! Connect the small front panel wires from your case:",
      "• Power button, Reset button, Power LED, HDD LED — check motherboard manual for layout.",
      "Connect the front USB and audio cables to the matching headers on the motherboard.",
      "Make sure all case fans are plugged into fan headers (SYS_FAN or CHA_FAN)."
    ],
    intermediate: [
      "Front panel headers: use the mobo manual diagram. Power SW polarity doesn't matter; LEDs do.",
      "USB 3.0 (20-pin), USB-C (key-A), HD Audio — all keyed connectors.",
      "Fan config: intake front/bottom, exhaust rear/top. Positive pressure reduces dust buildup."
    ],
    advanced: [
      "JFP1 pinout per manual. Use a front-panel header adapter if available for cleaner install.",
      "Verify USB-C header compatibility if case has Type-C front port. Some boards lack the header.",
      "Fan curve setup in BIOS: optimize for PWM control. Set intake > exhaust CFM for positive pressure."
    ],
    tip: { type: "info", text: "The front panel connectors are the trickiest part for everyone. Take your time and use the manual." }
  },
  {
    title: "First Boot & Setup",
    icon: "🚀",
    beginner: [
      "Double-check all cables are connected. Take a deep breath!",
      "Plug in the power cable and flip the PSU switch on the back.",
      "Press the power button. If fans spin and you see the BIOS screen — congratulations! 🎉",
      "If nothing happens: check the power button cable, PSU switch, and make sure RAM is seated.",
      "Install Windows using a USB drive (you can create one with Microsoft's Media Creation Tool).",
      "After Windows is installed, download your GPU drivers from NVIDIA or AMD's website."
    ],
    intermediate: [
      "First POST: enter BIOS, verify all hardware is detected (CPU, RAM, storage).",
      "Enable XMP/EXPO for rated RAM speeds. Set boot priority to USB for OS install.",
      "Install OS, then drivers: GPU > chipset > audio > networking.",
      "Run a stress test (Cinebench, Furmark, or OCCT) to verify stability and thermals."
    ],
    advanced: [
      "POST: verify CPU/RAM/NVMe detection. Check for error codes if no POST (debug LEDs, beep codes, Q-code).",
      "BIOS: enable XMP/EXPO, set fan curves, verify PCIe slot config (Gen4/5), enable Resizable BAR/SAM.",
      "OS: clean install, debloat, chipset + GPU drivers, firmware updates.",
      "Stress test: Prime95 small FFTs (CPU), Furmark/3DMark (GPU), MemTest86 (RAM). Monitor via HWiNFO64.",
      "Tune: PBO2/Curve Optimizer (AMD) or unlock power limits (Intel) if desired."
    ],
    tip: { type: "success", text: "No display on first boot? Don't panic! Reseat your RAM and GPU — that fixes 90% of first-boot issues." }
  }
];

let currentBuildStep = 0;

async function startBuildingGuide() {
  currentBuildStep = 0;
  setProgress(45);

  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "Awesome! Let's build your first PC together. I'll walk you through every single step — nice and easy. 🎉",
        "Let's get this build going. Here's your step-by-step guide.",
        "Build guide loaded. Let's get to it."
      )}
      <div class="tip-box info">
        <span class="tip-icon">📋</span>
        <span>${buildSteps.length} steps total. Take your time with each one — no rush.</span>
      </div>
    </div>
  `, 'bot', 200);

  showBuildStep();
}

async function showBuildStep() {
  const step = buildSteps[currentBuildStep];
  const points = step[userLevel];
  const pct = 45 + ((currentBuildStep / buildSteps.length) * 50);
  setProgress(pct);

  const listItems = points.map(p => `<li>${p}</li>`).join('');

  let tipHtml = '';
  if (step.tip) {
    tipHtml = `<div class="tip-box ${step.tip.type}">
      <span class="tip-icon">${step.tip.type === 'danger' ? '⚠️' : step.tip.type === 'warning' ? '💡' : step.tip.type === 'success' ? '✅' : 'ℹ️'}</span>
      <span>${step.tip.text}</span>
    </div>`;
  }

  const isLast = currentBuildStep === buildSteps.length - 1;
  const btnText = isLast
    ? lang("I'm done! 🎉", "Complete Build ✓", "Finalize →")
    : lang("Got it, next step →", "Next step →", "Continue →");
  const btnClass = isLast ? 'continue-btn success-btn' : 'continue-btn';

  await addMessage(`
    <div class="message-label">Step ${currentBuildStep + 1} of ${buildSteps.length}</div>
    <div class="message-bubble">
      <div class="step-card">
        <div class="step-header">
          <div class="step-number">${currentBuildStep + 1}</div>
          <div class="step-title">${step.icon} ${step.title}</div>
        </div>
        <div class="step-body">
          <ul>${listItems}</ul>
        </div>
      </div>
      ${tipHtml}
      <div style="margin-top:14px;">
        <button class="${btnClass}" onclick="nextBuildStep()">${btnText}</button>
      </div>
    </div>
  `, 'bot', 200);
}

async function nextBuildStep() {
  currentBuildStep++;
  if (currentBuildStep < buildSteps.length) {
    showBuildStep();
  } else {
    showCompletion('building');
  }
}

// ============ MAINTENANCE PATH ============

async function showMaintainMenu() {
  setProgress(45);
  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "No problem! Are you looking to upgrade a part, or is something not working right?",
        "Are we upgrading or troubleshooting?",
        "Upgrade or troubleshoot?"
      )}
      <div class="options-grid horizontal" style="margin-top:14px;">
        <button class="option-card" onclick="chooseMaintainType('upgrade')">
          <span class="option-icon">⬆️</span>
          <div class="option-info">
            <span class="option-title">${lang("Upgrade a Part", "Upgrade Hardware", "Component Upgrade")}</span>
            <span class="option-desc">${lang("I want to make my PC faster or add something new", "Swap or add components", "Swap/add components to improve performance")}</span>
          </div>
        </button>
        <button class="option-card" onclick="chooseMaintainType('fix')">
          <span class="option-icon">🔍</span>
          <div class="option-info">
            <span class="option-title">${lang("Fix a Problem", "Troubleshoot Issue", "Diagnose & Fix")}</span>
            <span class="option-desc">${lang("Something is wrong — it's slow, hot, crashing, etc.", "Temps, crashes, performance issues", "Thermal, stability, or performance diagnostics")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

async function chooseMaintainType(type) {
  await addUserReply(type === 'upgrade' ? '⬆️ Upgrade' : '🔍 Fix a Problem');
  if (type === 'upgrade') showUpgradeGuide();
  else showFixMenu();
}

// ---- UPGRADE GUIDE ----

async function showUpgradeGuide() {
  setProgress(50);
  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang("What part are you looking to upgrade?", "What component are we upgrading?", "Select the target component.")}
      <div class="options-grid" style="margin-top:12px;">
        <button class="option-card" onclick="showUpgradeDetail('gpu')">
          <span class="option-icon">🎮</span>
          <div class="option-info">
            <span class="option-title">Graphics Card (GPU)</span>
            <span class="option-desc">${lang("Better gaming and video performance", "Upgrade your graphics power", "GPU swap / upgrade")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('ram')">
          <span class="option-icon">🧠</span>
          <div class="option-info">
            <span class="option-title">RAM (Memory)</span>
            <span class="option-desc">${lang("Help your PC do more at once", "More memory for multitasking", "Increase memory capacity/speed")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('storage')">
          <span class="option-icon">💽</span>
          <div class="option-info">
            <span class="option-title">Storage (SSD/HDD)</span>
            <span class="option-desc">${lang("More space or faster loading", "Faster or bigger storage", "Add/upgrade NVMe or SATA drives")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('cpu')">
          <span class="option-icon">⚙️</span>
          <div class="option-info">
            <span class="option-title">CPU (Processor)</span>
            <span class="option-desc">${lang("A faster brain for your PC", "Faster processor", "CPU upgrade within platform")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('cooling')">
          <span class="option-icon">🌀</span>
          <div class="option-info">
            <span class="option-title">Cooling</span>
            <span class="option-desc">${lang("Keep your PC cooler and quieter", "Better thermals and noise", "Improve thermal headroom")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

const upgradeGuides = {
  gpu: {
    title: "GPU Upgrade Guide",
    icon: "🎮",
    beginner: [
      { title: "Check Compatibility", body: "Open your PC case and look at your current GPU. Check your power supply wattage (it's on the label on your PSU). Most new GPUs need at least 550-650W." },
      { title: "Choose Your New GPU", body: "For 1080p gaming: RTX 4060 or RX 7600. For 1440p: RTX 4070 Super or RX 7800 XT. Make sure it physically fits in your case!" },
      { title: "Remove the Old GPU", body: "Turn off PC, unplug it. Remove the power cables from the GPU. Unscrew it from the case bracket. Press the release tab on the PCIe slot and gently pull the card out." },
      { title: "Install the New GPU", body: "Slide the new GPU into the same slot until it clicks. Screw in the bracket. Connect the power cables. That's it!" },
      { title: "Install Drivers", body: "Boot up, download the latest drivers from NVIDIA.com or AMD.com, install them, and restart. You're gaming! 🎉" }
    ],
    intermediate: [
      { title: "Pre-Upgrade Checks", body: "Verify PSU wattage and available PCIe power connectors. Measure case clearance (length and slot width). Use DDU to clean old GPU drivers before swapping." },
      { title: "Physical Swap", body: "Power off, disconnect PSU. Remove PCIe power cables, unscrew bracket, release PCIe retention clip, extract card. Reverse for new card." },
      { title: "Post-Install", body: "Boot into safe mode, run DDU for clean driver removal. Reboot, install latest GPU drivers. Enable Resizable BAR in BIOS if supported. Run a benchmark to verify." }
    ],
    advanced: [
      { title: "Compatibility & Planning", body: "Check TDP vs PSU transient capability (not just sustained wattage). Verify 12V-2x6 / 8-pin connector availability. Measure case clearance including AIO radiator conflicts." },
      { title: "Swap Procedure", body: "DDU in safe mode before physical swap. Remove old card, seat new card in primary x16 slot. Check for PCIe gen negotiation in GPU-Z post-boot." },
      { title: "Optimization", body: "Enable Resizable BAR/SAM, verify PCIe link speed. Undervolt for efficiency (MSI Afterburner curve editor). Benchmark: 3DMark Timespy, compare to published results." }
    ],
    tip: { type: "warning", text: "Use DDU (Display Driver Uninstaller) to cleanly remove old GPU drivers before installing new ones. This prevents conflicts and crashes." }
  },
  ram: {
    title: "RAM Upgrade Guide",
    icon: "🧠",
    beginner: [
      { title: "Find Out What You Have", body: "Open Task Manager (Ctrl+Shift+Esc) → Performance → Memory. This shows your current RAM amount and speed. Note how many slots are used." },
      { title: "Buy Compatible RAM", body: "Check your motherboard manual or use Crucial's scanner tool online. Match the type (DDR4 or DDR5) — you can't mix them!" },
      { title: "Install It", body: "Turn off and unplug your PC. Open the clips on the RAM slots. Line up the notch on the new stick and push firmly until it clicks. That's it!" }
    ],
    intermediate: [
      { title: "Assessment", body: "Check current config: CPU-Z or HWiNFO for speed, timings, slots populated. Check QVL on motherboard support page for validated kits." },
      { title: "Selection", body: "Match DDR generation. For best compatibility, buy a single matched kit rather than mixing. 2x16GB DDR5-6000 CL30 is the current sweet spot." },
      { title: "Install & Configure", body: "Populate correct slots per manual (usually A2/B2). After boot, enter BIOS and enable XMP/EXPO profile. Verify with CPU-Z." }
    ],
    advanced: [
      { title: "Analysis", body: "Identify current IC (Thaiphoon Burner). Check rank configuration (SR vs DR) and daisy-chain/T-topology layout for optimal population." },
      { title: "Selection", body: "Target specific ICs: Hynix A-die for DDR5 overclocking, M-die for value. Verify QVL compatibility or be prepared to manually tune." },
      { title: "Tuning", body: "Enable XMP/EXPO as baseline. Manual tuning: tRCD, tRP, tRAS, then secondaries. Adjust VDDQ and VDD. Stability test with TM5/ANTA777 or y-cruncher." }
    ],
    tip: { type: "info", text: "Always buy RAM in kits (e.g., 2x16GB) rather than individual sticks. Kits are tested together for compatibility." }
  },
  storage: {
    title: "Storage Upgrade Guide",
    icon: "💽",
    beginner: [
      { title: "Check What You Need", body: "Running out of space? Add another drive. PC feels slow? Upgrading from a hard drive to an SSD will make the biggest difference you've ever felt." },
      { title: "Choose Your Drive", body: "NVMe SSD (the small stick) is fastest and easiest to install. A 1TB NVMe like the Samsung 970 Evo Plus is a great choice." },
      { title: "Install It", body: "Find an empty M.2 slot on your motherboard (check manual). Remove the screw, slide the SSD in at an angle, then press down and screw it flat." },
      { title: "Set It Up", body: "In Windows, right-click Start → Disk Management. Find your new drive, initialize it, and create a new volume. Done!" }
    ],
    intermediate: [
      { title: "Plan", body: "Assess current storage layout. Determine if adding a drive or cloning/migrating the OS to a faster one." },
      { title: "Selection", body: "Gen4 NVMe for boot (Samsung 990 Pro, WD SN850X). SATA SSD or HDD for bulk storage. Check which M.2 slots share SATA bandwidth." },
      { title: "Install & Migrate", body: "Physical install in M.2 or 2.5\" bay. For OS migration, use Macrium Reflect or Samsung Data Migration. Set boot priority in BIOS." }
    ],
    advanced: [
      { title: "Assessment", body: "Map current PCIe/SATA lane allocation. Check for M.2 slots that disable SATA ports when populated. Consider RAID if needed." },
      { title: "Selection", body: "Gen5 NVMe for sequential-heavy workloads (video editing). Gen4 remains best perf/$ for gaming. Evaluate TLC vs QLC endurance for write-heavy use." },
      { title: "Deployment", body: "Sector-by-sector clone for OS migration (Clonezilla, Macrium). Post-clone: verify alignment, enable TRIM, check SMART attributes. Update boot order." }
    ],
    tip: { type: "success", text: "Upgrading from HDD to SSD is the single biggest performance upgrade you can make to an old PC." }
  },
  cpu: {
    title: "CPU Upgrade Guide",
    icon: "⚙️",
    beginner: [
      { title: "Check Compatibility First!", body: "This is the most important step. Your new CPU MUST work with your motherboard. Search your motherboard model + 'CPU support list' online." },
      { title: "Things to Know", body: "You might need to update your BIOS before the new CPU will work. This can usually be done with your current CPU installed." },
      { title: "The Swap", body: "Remove the cooler, clean off thermal paste with rubbing alcohol, lift the CPU lever, swap CPUs (match the triangles!), apply new paste, remount cooler." },
      { title: "After the Swap", body: "Boot up and enter BIOS to make sure the new CPU is detected. Re-enable XMP/EXPO for your RAM. You're good to go!" }
    ],
    intermediate: [
      { title: "Compatibility", body: "Check motherboard QVL/CPU support list. BIOS update may be required — do this BEFORE swapping CPUs. Verify VRM capability for higher-tier CPUs." },
      { title: "Swap Procedure", body: "Remove cooler, clean paste (IPA + lint-free cloth), swap CPUs, apply paste, remount cooler. Update BIOS if not done pre-swap." },
      { title: "Post-Install", body: "Verify detection in BIOS. Re-enable XMP/EXPO. Check thermals under load. Consider whether your cooler is adequate for the new CPU's TDP." }
    ],
    advanced: [
      { title: "Planning", body: "Check VRM thermal capacity for new SKU (especially 12900K+ or 7950X tier). Flash latest BIOS with current CPU. Check if cooler mounting pressure is adequate." },
      { title: "Execution", body: "Clean swap. Inspect socket for debris/bent pins. Apply thermal paste per IHS size. Verify cooler contact/mounting pressure." },
      { title: "Optimization", body: "Post-swap: reset BIOS to defaults, re-enable XMP/EXPO, configure PBO2/Curve Optimizer or Intel power limits. Stress test for stability." }
    ],
    tip: { type: "danger", text: "Always update your motherboard BIOS before installing a newer-generation CPU. Without the update, your PC may not boot at all." }
  },
  cooling: {
    title: "Cooling Upgrade Guide",
    icon: "🌀",
    beginner: [
      { title: "Signs You Need Better Cooling", body: "Is your PC loud? Does it feel very hot? Do games stutter after playing for a while? Better cooling can fix all of these!" },
      { title: "Easy Upgrades", body: "Add case fans if you have empty slots (most cases support 3-6 fans). Replace the stock CPU cooler with an aftermarket one like the Thermalright Peerless Assassin." },
      { title: "Fan Direction", body: "Front and bottom fans should blow IN (intake). Rear and top fans should blow OUT (exhaust). Look for the arrow on the fan frame." },
      { title: "Thermal Paste Refresh", body: "If your PC is a few years old, cleaning off the old thermal paste and applying fresh paste can drop temperatures by 5-10°C!" }
    ],
    intermediate: [
      { title: "Assessment", body: "Monitor temps with HWiNFO64. CPU above 85°C or GPU above 83°C under sustained load indicates cooling improvement needed." },
      { title: "Case Fans", body: "Aim for positive pressure (more intake than exhaust). Quality fans: Arctic P12/P14, Noctua NF-A12x25, Thermalright TL-C12C. Use PWM for speed control." },
      { title: "CPU Cooler Upgrade", body: "Tower coolers: Thermalright PA120, Deepcool AK620. AIOs: Arctic Liquid Freezer II 240/280. Match TDP to your CPU's power draw." },
      { title: "Maintenance", body: "Repaste every 2-3 years. Clean dust filters monthly. Compressed air for heatsink fins quarterly." }
    ],
    advanced: [
      { title: "Thermal Analysis", body: "Use HWiNFO64 for per-core temps, hotspot deltas, and VRM thermals. Identify if CPU, GPU, VRM, or case ambient is the bottleneck." },
      { title: "Optimization", body: "Fan curves in BIOS: target temp-based PWM, not voltage control. Optimal config: slightly positive pressure, front intake, top/rear exhaust." },
      { title: "Advanced Cooling", body: "Direct-die cooling for extreme thermals. Custom loop: EK/HWLabs rads, copper blocks, ZMT or PETG tubing. Factor in maintenance overhead." },
      { title: "Paste & Contact", body: "Premium pastes (Thermal Grizzly Kryonaut, Noctua NT-H2). For extreme: liquid metal (Conductonaut) — insulate surrounding SMDs with nail polish or Kapton tape." }
    ],
    tip: { type: "warning", text: "Liquid metal is electrically conductive. If it drips onto your motherboard, it will short-circuit components. Only use if experienced!" }
  }
};

async function showUpgradeDetail(component) {
  const guide = upgradeGuides[component];
  const steps = guide[userLevel];
  setProgress(55);

  await addUserReply(`${guide.icon} ${guide.title}`);

  let stepsHtml = steps.map((s, i) => `
    <div class="step-card" style="margin-bottom:8px;">
      <div class="step-header">
        <div class="step-number">${i + 1}</div>
        <div class="step-title">${s.title}</div>
      </div>
      <div class="step-body">${s.body}</div>
    </div>
  `).join('');

  let tipHtml = guide.tip ? `<div class="tip-box ${guide.tip.type}">
    <span class="tip-icon">${guide.tip.type === 'danger' ? '⚠️' : guide.tip.type === 'warning' ? '💡' : guide.tip.type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${guide.tip.text}</span>
  </div>` : '';

  await addMessage(`
    <div class="message-label">PC Build Buddy — ${guide.title}</div>
    <div class="message-bubble">
      ${stepsHtml}
      ${tipHtml}
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="continue-btn secondary" onclick="showUpgradeGuide()">← Other Upgrades</button>
        <button class="continue-btn success-btn" onclick="showCompletion('upgrade')">Done ✓</button>
      </div>
    </div>
  `, 'bot', 200);
}

// ---- TROUBLESHOOTING / FIX PATH ----

async function showFixMenu() {
  setProgress(50);
  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "What's going on with your PC? Pick the one that sounds closest:",
        "What's the issue? Select the closest match:",
        "Select the symptom category:"
      )}
      <div class="options-grid" style="margin-top:12px;">
        <button class="option-card" onclick="showFixDetail('hot')">
          <span class="option-icon">🌡️</span>
          <div class="option-info">
            <span class="option-title">${lang("It's running really hot", "High temperatures", "Thermal throttling / high temps")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('slow')">
          <span class="option-icon">🐌</span>
          <div class="option-info">
            <span class="option-title">${lang("It's really slow", "Sluggish performance", "Performance degradation")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('crash')">
          <span class="option-icon">💥</span>
          <div class="option-info">
            <span class="option-title">${lang("It crashes or freezes", "Crashes / BSODs", "System instability / BSODs")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('noboot')">
          <span class="option-icon">🖥️</span>
          <div class="option-info">
            <span class="option-title">${lang("It won't turn on or show anything", "No POST / no display", "No POST / boot failure")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('noise')">
          <span class="option-icon">🔊</span>
          <div class="option-info">
            <span class="option-title">${lang("It's making weird noises", "Unusual noises", "Abnormal acoustic output")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

const fixGuides = {
  hot: {
    title: "High Temperature Fix",
    icon: "🌡️",
    beginner: [
      { title: "Check for Dust", body: "Dust is the #1 cause of overheating. Turn off your PC, open the case, and use a can of compressed air to blow dust off all fans and heatsinks. Do this outside if possible!" },
      { title: "Check Fan Placement", body: "Make sure all fans are spinning. Front fans should blow in (intake), back and top fans should blow out (exhaust). If a fan isn't spinning, it may need to be replaced." },
      { title: "Check Thermal Paste", body: "If your PC is 2+ years old, the thermal paste between the CPU and cooler may have dried out. You can buy thermal paste for ~$8 and reapply it. Clean the old paste with rubbing alcohol first." },
      { title: "Improve Airflow", body: "Don't block the vents! Keep your PC off carpet, away from walls, and make sure cables inside aren't blocking fans. A mesh-front case helps a lot." },
      { title: "Monitor Temps", body: "Download a free tool called HWiNFO64 to see your temperatures. CPU should stay under 85°C, GPU under 83°C during gaming." }
    ],
    intermediate: [
      { title: "Diagnostics", body: "Run HWiNFO64 — check CPU Tctl/Tdie, GPU hotspot, VRM temps under load. Identify which component is throttling. Check if fans are ramping up appropriately." },
      { title: "Maintenance", body: "Full dust-out with compressed air. Repaste CPU (and GPU if over 3 years old). Verify all fans are operational and PWM-controlled." },
      { title: "Airflow Optimization", body: "Ensure positive pressure (more intake CFM than exhaust). Add fans if case supports more. Check that fan curves aren't set too conservative in BIOS." },
      { title: "Software Side", body: "Check for background processes consuming CPU (Task Manager). Verify GPU drivers are current. Disable unnecessary startup programs." }
    ],
    advanced: [
      { title: "Thermal Profiling", body: "HWiNFO64: log CPU per-core temps, hotspot delta, package power, VRM MOS temps under Prime95/OCCT. Identify thermal bottleneck — die, IHS, cooler, or case ambient." },
      { title: "Contact & Paste", body: "Repaste with premium compound (Kryonaut, NT-H2). Check mounting pressure — uneven contact causes hotspots. Consider IHS convexity correction (lapping) for extreme cases." },
      { title: "Airflow Engineering", body: "Map airflow with incense/smoke. Eliminate dead zones and recirculation. Seal unused PCI brackets and cable grommets if negative pressure." },
      { title: "Advanced Mitigation", body: "Undervolt CPU (Curve Optimizer / VF offset) and GPU (Afterburner curve). Reduces heat without significant performance loss. Custom fan curves targeting component temps, not CPU-only." }
    ],
    tip: { type: "success", text: "A simple dust cleaning + thermal paste refresh fixes overheating in 80% of cases." }
  },
  slow: {
    title: "Slow Performance Fix",
    icon: "🐌",
    beginner: [
      { title: "Close Unnecessary Programs", body: "Press Ctrl+Shift+Esc to open Task Manager. Click 'Startup' and disable programs you don't need at startup. This alone can make a huge difference!" },
      { title: "Check Storage Space", body: "If your main drive is almost full (over 90%), your PC will slow down. Delete or move files you don't need. Empty the Recycle Bin too!" },
      { title: "HDD to SSD Upgrade", body: "If your Windows is on a regular hard drive (HDD), upgrading to an SSD is the BEST upgrade. It makes everything 5-10x faster. This is the single biggest improvement you can make." },
      { title: "Check for Malware", body: "Run a full Windows Defender scan. Also try the free version of Malwarebytes for a second opinion. Malware can secretly use your PC's resources." },
      { title: "Windows Updates", body: "Make sure Windows is fully updated. Go to Settings → Update & Security → Windows Update. Sometimes updates fix performance bugs." },
      { title: "Add More RAM", body: "If Task Manager shows memory usage above 80% during normal use, you probably need more RAM. 16GB is the minimum recommended these days." }
    ],
    intermediate: [
      { title: "Diagnostics", body: "Task Manager: identify CPU, RAM, or Disk bottleneck. Resource Monitor for detailed I/O. Check if HDD is the primary drive — if so, SSD migration is priority #1." },
      { title: "Software Cleanup", body: "Disable startup bloat (Task Manager → Startup). Uninstall unused programs. Check for background services consuming resources (svchost, Windows telemetry)." },
      { title: "Hardware Check", body: "Verify RAM is running in dual-channel at rated speed (CPU-Z). Check SSD health (CrystalDiskInfo). Ensure GPU drivers are current and not using basic display adapter." },
      { title: "OS Optimization", body: "Disable unnecessary visual effects, indexed search on secondary drives. Set power plan to High Performance or Balanced. Consider a clean Windows install if it's been years." }
    ],
    advanced: [
      { title: "Profiling", body: "Process Monitor / Process Explorer for granular resource tracking. Windows Performance Recorder for system-wide analysis. Check DPC latency (LatencyMon) for driver issues." },
      { title: "Storage", body: "Check SMART attributes (CrystalDiskInfo). SSD firmware updates. Verify NVMe driver (vendor-specific vs generic MS). Check TRIM status: fsutil behavior query DisableDeleteNotify." },
      { title: "Memory & CPU", body: "Verify XMP/EXPO enabled. Check for single-channel RAM config. Analyze CPU throttling (power or thermal) via HWiNFO64. Inspect Windows power plan advanced settings." },
      { title: "Nuclear Option", body: "If software-side: clean Windows install with debloat. If hardware-side: benchmark individual components to isolate bottleneck (CineBench, CrystalDiskMark, 3DMark)." }
    ],
    tip: { type: "info", text: "90% of 'slow PC' complaints are caused by: full HDD, too many startup programs, or insufficient RAM. Check these first!" }
  },
  crash: {
    title: "Crash / BSOD Fix",
    icon: "💥",
    beginner: [
      { title: "Don't Panic!", body: "Blue screens (BSODs) look scary but are usually fixable. Your PC is protecting itself by shutting down when something goes wrong." },
      { title: "Note the Error", body: "When you see a blue screen, try to note the error message (like 'WHEA_UNCORRECTABLE_ERROR' or 'MEMORY_MANAGEMENT'). Take a photo with your phone!" },
      { title: "Check for Overheating", body: "Overheating is a common crash cause. Follow the temperature troubleshooting steps to rule this out." },
      { title: "Update Drivers", body: "Outdated GPU drivers cause many crashes. Go to NVIDIA.com or AMD.com and download the latest driver for your graphics card." },
      { title: "Check RAM", body: "Faulty RAM is a top crash cause. Windows has a built-in memory test: search 'Windows Memory Diagnostic' in the Start menu and run it." },
      { title: "System Restore", body: "If crashes started recently, try System Restore to go back to a point before they started. Search 'System Restore' in the Start menu." }
    ],
    intermediate: [
      { title: "BSOD Analysis", body: "Check Event Viewer → Windows Logs → System for critical errors. Use BlueScreenView to analyze minidump files (C:\\Windows\\Minidump). The error code indicates the subsystem." },
      { title: "Common Codes", body: "WHEA_UNCORRECTABLE: CPU/hardware fault. MEMORY_MANAGEMENT: RAM issue. IRQL_NOT_LESS_OR_EQUAL: driver conflict. KMODE_EXCEPTION: driver/hardware. VIDEO_TDR: GPU driver timeout." },
      { title: "Testing", body: "RAM: run MemTest86 overnight. GPU: run Furmark/Unigine for stability. CPU: Prime95 small FFTs. Check each component individually." },
      { title: "Software Fixes", body: "DDU and reinstall GPU drivers. sfc /scannow and DISM for Windows file corruption. Check for BIOS updates — they often fix stability." }
    ],
    advanced: [
      { title: "Dump Analysis", body: "WinDbg: !analyze -v on minidumps. Check faulting module, exception code, stack trace. Cross-reference with known driver/firmware bugs." },
      { title: "Hardware Isolation", body: "MemTest86 overnight (multi-pass). Prime95 small FFTs (per-core failure = specific core issue). Furmark for GPU VRAM stability. Monitor VRM temps during stress." },
      { title: "Stability Tuning", body: "If overclocked: revert to stock and test. WHEA errors often indicate unstable CPU curve/OC. Check event 19 (WHEA Logger) for correctable errors that precede hard crashes." },
      { title: "Advanced Fixes", body: "Check PCIe link stability (event 56, IOMMU errors). Test with different PCIe gen settings. Verify PSU rail stability under load with a multimeter or software monitoring." }
    ],
    tip: { type: "warning", text: "If crashes happen ONLY during gaming: GPU drivers or thermals. If they happen randomly: RAM, PSU, or CPU stability." }
  },
  noboot: {
    title: "No Boot / No Display Fix",
    icon: "🖥️",
    beginner: [
      { title: "Check the Basics", body: "Is the power cable plugged in? Is the power strip turned on? Is the PSU switch on the back flipped to 'I' (on)? Sounds silly, but check these first!" },
      { title: "Check Your Monitor", body: "Is the monitor on? Is the cable plugged into the GRAPHICS CARD (not the motherboard)? Try a different cable (HDMI, DisplayPort). Try a different monitor if possible." },
      { title: "Listen & Look", body: "When you press power: Do fans spin? Do any lights turn on? Do you hear any beeps? These clues tell us what's going on." },
      { title: "Reseat Components", body: "Turn off and unplug your PC. Press and firmly reseat (push back in) the RAM sticks and GPU. Loose connections are a very common cause of no-boot." },
      { title: "Try One RAM Stick", body: "Try booting with just one RAM stick at a time, in different slots. A bad stick or slot can prevent booting entirely." },
      { title: "CMOS Reset", body: "Find the small round battery on your motherboard. Remove it for 30 seconds, then put it back. This resets your BIOS settings and can fix boot issues." }
    ],
    intermediate: [
      { title: "Debug Indicators", body: "Check mobo debug LEDs (CPU, DRAM, VGA, BOOT) or Q-code display. Listen for beep codes (if speaker connected). These pinpoint the failing component." },
      { title: "Minimal Boot", body: "Strip to essentials: CPU + 1 RAM stick + onboard video (if available). No storage, no GPU. Add components one by one until failure reproduces." },
      { title: "RAM & GPU", body: "Reseat RAM in the correct slots. Try each stick individually. Reseat GPU and ensure PCIe power is connected. Try GPU in a different slot if available." },
      { title: "CMOS & BIOS", body: "Clear CMOS (remove battery 60s or use jumper). If you have BIOS Flashback, reflash BIOS via USB. Check if a recent BIOS update corrupted settings." }
    ],
    advanced: [
      { title: "POST Diagnostics", body: "Read Q-code or debug LEDs. Cross-reference with motherboard manual POST codes. If board has no POST code display, use a POST card ($10 diagnostic tool)." },
      { title: "Isolation Protocol", body: "Bare-bones bench boot: CPU + 1 DIMM + onboard/debug GPU outside the case on motherboard box. Eliminates case short and peripheral issues." },
      { title: "Component Testing", body: "Swap PSU if available (or paperclip test for PSU power-on). Test RAM sticks individually in each slot. Check for bent CPU pins (AMD PGA) or socket debris (Intel LGA)." },
      { title: "Advanced Recovery", body: "BIOS Flashback / Q-Flash Plus if available (works without CPU). Check for dead short (PSU clicks off immediately = short circuit, inspect standoffs and stray screws)." }
    ],
    tip: { type: "danger", text: "If fans spin briefly then stop, or PSU clicks: this usually means a short circuit. Check for loose screws under the motherboard or a misplaced standoff." }
  },
  noise: {
    title: "Unusual Noise Fix",
    icon: "🔊",
    beginner: [
      { title: "Identify the Source", body: "Open your case (PC off and unplugged) and spin each fan by hand. A grinding or rattling fan needs to be replaced — fans are cheap ($10-15 each)." },
      { title: "Loose Screws", body: "A buzzing or vibrating noise often means a loose screw or panel. Check that all case screws, fan screws, and side panels are tight." },
      { title: "Hard Drive Clicking", body: "If you hear rhythmic clicking from inside the PC, it might be a failing hard drive. Back up your data immediately and consider replacing it with an SSD." },
      { title: "Coil Whine", body: "A high-pitched whining during gaming is called 'coil whine' from the GPU. It's annoying but not dangerous. Using a frame rate limiter (V-Sync) can reduce it." }
    ],
    intermediate: [
      { title: "Diagnosis", body: "Isolate: stop each fan individually (finger test while running — be careful!) to identify the source. GPU fans, CPU fan, case fans, PSU fan." },
      { title: "Fan Bearing Failure", body: "Grinding/clicking from fans = bearing failure. Replace the fan. Quality replacements: Arctic P12, Noctua NF-A12x25. Match size (120mm/140mm)." },
      { title: "Coil Whine", body: "GPU coil whine: frame cap with RTSS or V-Sync. Can change with GPU load. Some units worse than others — not a defect per se, but may be RMA-able if extreme." },
      { title: "HDD & PSU", body: "Clicking HDD: check SMART status (CrystalDiskInfo), back up immediately if reallocated sectors are high. PSU clicking under load: potential capacitor issue, consider replacement." }
    ],
    advanced: [
      { title: "Acoustic Profiling", body: "Isolate source by selectively stopping fans. Check pump noise (AIO) — air bubbles in loop cause gurgling. PSU fan rattle may indicate bearing or loose blade." },
      { title: "Coil Whine Mitigation", body: "GPU: frame cap at monitor Hz, undervolt to reduce current. Can dampen with thermal pads on inductors (advanced mod). PSU coil whine: swap to higher-quality unit." },
      { title: "Mechanical Noise", body: "HDD: check SMART reallocated sectors and pending counts. Click of death = imminent failure. Vibration dampening: rubber HDD mounts, fan gaskets, case feet." },
      { title: "Resonance", body: "Panel vibration at specific fan speeds: add dampening material or adjust fan curves to avoid resonant RPM ranges. Check for loose M.2 heatsink clips or drive bay rattles." }
    ],
    tip: { type: "info", text: "New clicking or grinding noises that weren't there before = something is failing. Don't ignore them — diagnose early before data loss." }
  }
};

async function showFixDetail(issue) {
  const guide = fixGuides[issue];
  const steps = guide[userLevel];
  setProgress(60);

  await addUserReply(`${guide.icon} ${guide.title}`);

  let stepsHtml = steps.map((s, i) => `
    <div class="step-card" style="margin-bottom:8px;">
      <div class="step-header">
        <div class="step-number">${i + 1}</div>
        <div class="step-title">${s.title}</div>
      </div>
      <div class="step-body">${s.body}</div>
    </div>
  `).join('');

  let tipHtml = guide.tip ? `<div class="tip-box ${guide.tip.type}">
    <span class="tip-icon">${guide.tip.type === 'danger' ? '⚠️' : guide.tip.type === 'warning' ? '💡' : guide.tip.type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${guide.tip.text}</span>
  </div>` : '';

  await addMessage(`
    <div class="message-label">PC Build Buddy — ${guide.title}</div>
    <div class="message-bubble">
      ${stepsHtml}
      ${tipHtml}
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="continue-btn secondary" onclick="showFixMenu()">← Other Issues</button>
        <button class="continue-btn success-btn" onclick="showCompletion('fix')">Done ✓</button>
      </div>
    </div>
  `, 'bot', 200);
}

// ============ COMPLETION SCREEN ============

async function showCompletion(type) {
  setProgress(100);

  const msgs = {
    building: {
      beginner: "You just built your first PC! That's a massive achievement. Welcome to the PC building community! 🎉",
      intermediate: "Build guide complete. Enjoy your new rig! Don't forget to run stress tests.",
      advanced: "Build checklist done. Time to tune and benchmark. Happy building."
    },
    upgrade: {
      beginner: "Great job upgrading your PC! That wasn't so hard, right? Enjoy the extra performance! 🎉",
      intermediate: "Upgrade guide complete. Verify everything is detected and run some benchmarks.",
      advanced: "Upgrade done. Verify detection, benchmark, and tune as needed."
    },
    fix: {
      beginner: "I hope that helped you fix the problem! If the issue continues, don't be afraid to ask for help at a local PC shop. 💪",
      intermediate: "Troubleshooting guide complete. If the issue persists, consider cross-testing components in another system.",
      advanced: "Diagnostic steps complete. Escalate to cross-system component testing or vendor RMA if unresolved."
    }
  };

  const msg = msgs[type][userLevel];

  await addMessage(`
    <div class="message-bubble" style="text-align:center;padding:40px 32px;">
      <div class="completion-icon">✅</div>
      <div class="completion-title">${lang("You Did It!", "All Done!", "Complete.")}</div>
      <div class="completion-text">${msg}</div>
      <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="continue-btn" onclick="showMainMenu()">
          ${lang("Help me with something else", "Back to Menu", "Main Menu")}
        </button>
        <button class="continue-btn secondary" onclick="goHome()">
          Start Over
        </button>
      </div>
    </div>
  `, 'bot', 300);
}

// ============ INIT ============
showWelcome();
