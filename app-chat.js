/* ============================================
   PC Build Buddy - AI Chat Panel (Claude API)
   ============================================ */

// ---- Chat State ----
let chatOpen = false;
let chatHistory = [];
let pendingPhoto = null; // { base64, mimeType }
let apiKey = localStorage.getItem('pcbuddy_api_key') || '';
let chatReady = !!apiKey;
let isStreaming = false;

// ---- Get current context for AI ----
function getAIContext() {
  const level = userLevel || 'unknown';
  const path = currentPath || 'none';
  let stepInfo = '';

  if (path === 'building' && typeof currentBuildStep !== 'undefined' && buildSteps) {
    const step = buildSteps[currentBuildStep];
    if (step) {
      stepInfo = `Currently on build step ${currentBuildStep + 1}/${buildSteps.length}: "${step.title}". `;
      const points = step[level] || step.beginner;
      stepInfo += `Key points for this step: ${points.join('; ')}`;
    }
  }

  return `The user is using PC Build Buddy, a PC building and maintenance helper app.
User experience level: ${level}.
Current activity: ${path === 'building' ? 'Building a PC' : path === 'maintaining' ? 'Maintaining/fixing a PC' : 'Browsing the app'}.
${stepInfo}
You are their helpful AI assistant for PC building and maintenance. Be concise, friendly, and match their experience level. If they share a photo, analyze it carefully for PC building correctness, cable management, component placement, thermal paste application, etc. Point out any issues you see.`;
}

// ---- Build Chat Panel DOM ----
function initChatPanel() {
  // FAB button
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.id = 'chatFab';
  fab.innerHTML = '💬';
  fab.title = 'Ask AI for help';
  fab.onclick = () => toggleChat(true);
  document.body.appendChild(fab);

  // Panel
  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chatPanel';
  panel.innerHTML = `
    <div class="chat-panel-header">
      <div class="chat-panel-title">
        <span class="dot"></span>
        AI Build Assistant
      </div>
      <button class="chat-panel-close" onclick="toggleChat(false)">&times;</button>
    </div>
    <div id="chatPanelBody"></div>
  `;
  document.body.appendChild(panel);

  renderChatBody();
}

function renderChatBody() {
  const body = document.getElementById('chatPanelBody');
  if (!body) return;

  if (!chatReady) {
    body.innerHTML = `
      <div class="api-key-setup">
        <div style="font-size:28px;">🤖</div>
        <p><strong>Connect to Claude AI</strong></p>
        <p>To chat with the AI assistant, enter your Anthropic API key. It's stored locally in your browser only.</p>
        <input type="password" id="apiKeyInput" placeholder="sk-ant-..." value="${apiKey}" />
        <button class="continue-btn" onclick="saveApiKey()">Connect</button>
        <p class="api-key-note">Get a key at console.anthropic.com. Your key never leaves your browser — API calls go directly to Anthropic.</p>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-area">
        <div id="photoPreview"></div>
        <div class="chat-input-row">
          <button class="chat-btn" onclick="triggerPhotoUpload()" title="Attach a photo">📷</button>
          <textarea class="chat-text-input" id="chatInput" placeholder="Ask anything about your build..." rows="1" onkeydown="handleChatKey(event)"></textarea>
          <button class="chat-btn send" id="chatSendBtn" onclick="sendChatMessage()" title="Send">➤</button>
        </div>
      </div>
      <input type="file" id="photoFileInput" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoSelect(event)" />
    `;

    renderChatMessages();

    if (chatHistory.length === 0) {
      addAIChatMessage('system', "AI assistant connected! Ask me anything about your build, or snap a photo and I'll check it for you.");
    }
  }
}

function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  if (!input) return;
  const key = input.value.trim();
  if (!key) return;
  apiKey = key;
  localStorage.setItem('pcbuddy_api_key', key);
  chatReady = true;
  renderChatBody();
}

function toggleChat(open) {
  chatOpen = open;
  const panel = document.getElementById('chatPanel');
  const fab = document.getElementById('chatFab');
  if (panel) {
    if (open) {
      panel.classList.add('open');
      fab.classList.add('has-panel');
      const input = document.getElementById('chatInput');
      if (input) setTimeout(() => input.focus(), 350);
    } else {
      panel.classList.remove('open');
      fab.classList.remove('has-panel');
    }
  }
}

// ---- Chat Messages ----
function addAIChatMessage(role, text, imageUrl) {
  chatHistory.push({ role, text, imageUrl });
  renderChatMessages();
}

function renderChatMessages() {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  container.innerHTML = chatHistory.map(msg => {
    let cls = msg.role === 'user' ? 'user' : msg.role === 'system' ? 'system' : 'ai';
    let imgHtml = msg.imageUrl ? `<img src="${msg.imageUrl}" alt="Uploaded photo" />` : '';
    let textHtml = formatAIText(msg.text || '');
    return `<div class="chat-msg ${cls}">${textHtml}${imgHtml}</div>`;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function formatAIText(text) {
  // Basic markdown-ish formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'chatTyping';
  typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('chatTyping');
  if (el) el.remove();
}

// ---- Photo Handling ----
function triggerPhotoUpload() {
  const input = document.getElementById('photoFileInput');
  if (input) input.click();
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Full = e.target.result;
    const mimeType = file.type || 'image/jpeg';
    const base64Data = base64Full.split(',')[1];

    pendingPhoto = { base64: base64Data, mimeType, previewUrl: base64Full };
    renderPhotoPreview();
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function renderPhotoPreview() {
  const container = document.getElementById('photoPreview');
  if (!container) return;

  if (pendingPhoto) {
    container.innerHTML = `
      <div class="chat-photo-preview">
        <img src="${pendingPhoto.previewUrl}" alt="Photo to send" />
        <button class="remove-photo" onclick="removePhoto()">×</button>
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}

function removePhoto() {
  pendingPhoto = null;
  renderPhotoPreview();
}

// ---- Send Message ----
function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

async function sendChatMessage() {
  if (isStreaming) return;

  const input = document.getElementById('chatInput');
  const text = input ? input.value.trim() : '';

  if (!text && !pendingPhoto) return;

  // Add user message to chat
  const displayText = text || '(Photo attached)';
  const imageUrl = pendingPhoto ? pendingPhoto.previewUrl : null;
  addAIChatMessage('user', displayText, imageUrl);

  // Build the API message content
  const contentParts = [];

  if (pendingPhoto) {
    contentParts.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: pendingPhoto.mimeType,
        data: pendingPhoto.base64
      }
    });
  }

  if (text) {
    contentParts.push({ type: 'text', text: text });
  } else if (pendingPhoto) {
    contentParts.push({ type: 'text', text: 'Please analyze this photo of my PC build. Is everything looking correct? Any issues you can spot?' });
  }

  // Clear input
  if (input) input.value = '';
  pendingPhoto = null;
  renderPhotoPreview();

  // Build messages array for API (last 20 messages for context)
  const apiMessages = [];
  const recent = chatHistory.filter(m => m.role === 'user' || m.role === 'assistant').slice(-20);
  for (const msg of recent) {
    if (msg === chatHistory[chatHistory.length - 1] && msg.role === 'user') continue; // skip, we add it below
    apiMessages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }
  apiMessages.push({ role: 'user', content: contentParts });

  // Call Claude API
  isStreaming = true;
  const sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) sendBtn.disabled = true;
  showTypingIndicator();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: getAIContext(),
        messages: apiMessages
      })
    });

    removeTypingIndicator();

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) {
        addAIChatMessage('system', 'Invalid API key. Click the key below to update it.');
        chatReady = false;
        apiKey = '';
        localStorage.removeItem('pcbuddy_api_key');
        renderChatBody();
      } else {
        addAIChatMessage('system', `API error: ${err.error?.message || response.statusText}. Try again.`);
      }
    } else {
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'No response received.';
      addAIChatMessage('assistant', reply);
    }
  } catch (err) {
    removeTypingIndicator();
    addAIChatMessage('system', `Connection error: ${err.message}. Check your network and try again.`);
  } finally {
    isStreaming = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', initChatPanel);
if (document.readyState !== 'loading') initChatPanel();
