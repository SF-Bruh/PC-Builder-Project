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
