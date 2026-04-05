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