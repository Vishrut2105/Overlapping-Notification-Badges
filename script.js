/**
 * ============================================================================
 * OVERLAPPING NOTIFICATION BADGES — VIBECODED ENGINE
 * Vanilla JavaScript (ES6+): Audio Chimes, Reactive Canvas, Code Copy
 * ============================================================================
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    count: 5,
    position: 'top-right',
    colorTheme: 'crimson',
    hasCutout: true,
    hasPulse: true,
    hasSecondary: true,
    targetType: 'avatar',
    soundEnabled: true,
    simTimer: null
  };

  // --- NATIVE WEB AUDIO SYNTHESIZER ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playChime(freq = 600, duration = 0.08) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  // --- DOM REFERENCES ---
  const primaryBadge = document.getElementById('primaryBadge');
  const badgeCountText = document.getElementById('badgeCountText');
  const badgePing = document.getElementById('badgePing');
  const secondaryBadge = document.getElementById('secondaryBadge');
  const previewTarget = document.getElementById('previewTarget');
  const targetAvatar = document.getElementById('targetAvatar');
  const targetIcon = document.getElementById('targetIcon');
  const previewHint = document.getElementById('previewHint');

  // Controls
  const incBtn = document.getElementById('incBtn');
  const decBtn = document.getElementById('decBtn');
  const countDisplay = document.getElementById('countDisplay');
  const positionControl = document.getElementById('positionControl');
  const colorPicker = document.getElementById('colorPicker');
  const cutoutToggle = document.getElementById('cutoutToggle');
  const pulseToggle = document.getElementById('pulseToggle');
  const secondaryToggle = document.getElementById('secondaryToggle');
  const targetTypeSwitch = document.getElementById('targetTypeSwitch');

  // Top bar buttons
  const soundBtn = document.getElementById('soundBtn');
  const themeBtn = document.getElementById('themeBtn');
  const simBtn = document.getElementById('simBtn');

  // Code & Toast
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const toastContainer = document.getElementById('toastContainer');

  // --- TOAST HELPER ---
  function showToast(msg) {
    const pill = document.createElement('div');
    pill.className = 'toast-pill';
    pill.innerHTML = `<i class="fa-solid fa-check text-violet"></i> <span>${msg}</span>`;
    toastContainer.appendChild(pill);

    setTimeout(() => {
      pill.style.opacity = '0';
      pill.style.transform = 'translateY(8px)';
      pill.style.transition = 'all 0.2s ease';
      setTimeout(() => pill.remove(), 200);
    }, 2000);
  }

  // --- RENDER PLAYGROUND ---
  function renderPlayground() {
    // 1. Count Text & Visibility
    if (state.count <= 0) {
      primaryBadge.style.display = 'none';
      countDisplay.textContent = '0';
      previewHint.textContent = '0 unread notifications';
    } else {
      primaryBadge.style.display = 'inline-flex';
      const formatted = state.count > 99 ? '99+' : state.count.toString();
      badgeCountText.textContent = formatted;
      countDisplay.textContent = formatted;
      previewHint.textContent = `${formatted} unread notifications ${state.hasSecondary ? '• online' : ''}`;
    }

    // 2. Position Classes
    primaryBadge.className = primaryBadge.className.replace(/badge-(top|bottom)-(left|right)/g, '');
    primaryBadge.classList.add(`badge-${state.position}`);

    // Dynamic translate for position
    const pos = state.position;
    const x = pos.includes('right') ? '35%' : '-35%';
    const y = pos.includes('bottom') ? '35%' : '-35%';
    primaryBadge.style.transform = `translate(${x}, ${y})`;

    // Secondary Presence Dot (Opposite corner)
    if (state.hasSecondary) {
      secondaryBadge.style.display = 'block';
      let secX = pos.includes('right') ? '-25%' : '25%';
      let secY = pos.includes('bottom') ? '-25%' : '25%';
      secondaryBadge.style.top = pos.includes('bottom') ? '2px' : 'auto';
      secondaryBadge.style.bottom = pos.includes('top') ? '2px' : 'auto';
      secondaryBadge.style.left = pos.includes('right') ? '2px' : 'auto';
      secondaryBadge.style.right = pos.includes('left') ? '2px' : 'auto';
      secondaryBadge.style.transform = `translate(${secX}, ${secY})`;
    } else {
      secondaryBadge.style.display = 'none';
    }

    // 3. Color Theme
    primaryBadge.className = primaryBadge.className.replace(/color-\w+/g, '');
    primaryBadge.classList.add(`color-${state.colorTheme}`);

    // 4. Cutout Notch Mask
    if (state.hasCutout) {
      primaryBadge.classList.add('cutout');
      secondaryBadge.classList.add('cutout');
    } else {
      primaryBadge.classList.remove('cutout');
      secondaryBadge.classList.remove('cutout');
    }

    // 5. Radar Ping Ring
    badgePing.style.display = (state.hasPulse && state.count > 0) ? 'block' : 'none';

    // 6. Target Type (Avatar / Bell / Chat)
    if (state.targetType === 'avatar') {
      targetAvatar.style.display = 'block';
      targetIcon.style.display = 'none';
    } else if (state.targetType === 'bell') {
      targetAvatar.style.display = 'none';
      targetIcon.style.display = 'flex';
      targetIcon.innerHTML = '<i class="fa-solid fa-bell"></i>';
    } else if (state.targetType === 'chat') {
      targetAvatar.style.display = 'none';
      targetIcon.style.display = 'flex';
      targetIcon.innerHTML = '<i class="fa-solid fa-message"></i>';
    }

    // Pop Bounce micro-animation
    primaryBadge.classList.remove('badge-pop');
    void primaryBadge.offsetWidth;
    primaryBadge.classList.add('badge-pop');
  }

  // --- EVENT HANDLERS ---
  incBtn.addEventListener('click', () => {
    state.count++;
    playChime(680, 0.08);
    renderPlayground();
  });

  decBtn.addEventListener('click', () => {
    if (state.count > 0) {
      state.count--;
      playChime(480, 0.08);
      renderPlayground();
    }
  });

  // Position Buttons
  positionControl.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      positionControl.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.position = btn.getAttribute('data-pos');
      playChime(550, 0.06);
      renderPlayground();
    });
  });

  // Color Buttons
  colorPicker.querySelectorAll('.color-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      colorPicker.querySelectorAll('.color-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.colorTheme = btn.getAttribute('data-color');
      playChime(700, 0.06);
      renderPlayground();
    });
  });

  // Toggles
  cutoutToggle.addEventListener('change', (e) => {
    state.hasCutout = e.target.checked;
    renderPlayground();
    showToast(state.hasCutout ? 'Cutout notch enabled' : 'Cutout border disabled');
  });

  pulseToggle.addEventListener('change', (e) => {
    state.hasPulse = e.target.checked;
    renderPlayground();
  });

  secondaryToggle.addEventListener('change', (e) => {
    state.hasSecondary = e.target.checked;
    renderPlayground();
  });

  // Target Type Tabs
  targetTypeSwitch.querySelectorAll('.target-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      targetTypeSwitch.querySelectorAll('.target-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.targetType = tab.getAttribute('data-type');
      playChime(620, 0.07);
      renderPlayground();
    });
  });

  // Top Bar Actions
  soundBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    soundBtn.innerHTML = state.soundEnabled
      ? '<i class="fa-solid fa-volume-high"></i>'
      : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(state.soundEnabled ? 'Audio on' : 'Audio muted');
    if (state.soundEnabled) playChime(600, 0.08);
  });

  themeBtn.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      showToast('Dark mode');
    } else {
      document.body.setAttribute('data-theme', 'light');
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      showToast('Light mode');
    }
    playChime(600, 0.08);
  });

  // Live Simulation Button
  simBtn.addEventListener('click', () => {
    if (state.simTimer) {
      clearInterval(state.simTimer);
      state.simTimer = null;
      simBtn.classList.remove('active');
      simBtn.innerHTML = '<span class="pulse-dot"></span><span>Live Sim</span>';
      showToast('Simulation stopped');
    } else {
      simBtn.classList.add('active');
      simBtn.innerHTML = '<span class="pulse-dot" style="background:var(--emerald);"></span><span>Simulating...</span>';
      showToast('Streaming live badge increments');
      state.simTimer = setInterval(() => {
        state.count = (state.count >= 99) ? 1 : state.count + 1;
        playChime(750, 0.08);
        renderPlayground();
      }, 2200);
    }
  });

  // Copy CSS Code Button
  copyCodeBtn.addEventListener('click', () => {
    const cssCode = `.avatar-wrap {
  position: relative;
  display: inline-flex;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(35%, -35%);
  border-radius: 9999px;
  background: #ef4444;
  color: #ffffff;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;

  /* The Cutout Magic: border matches parent bg */
  border: 2px solid var(--bg-card);
  box-sizing: content-box;
}`;

    navigator.clipboard.writeText(cssCode).then(() => {
      showToast('CSS copied to clipboard');
      playChime(800, 0.1);
    });
  });

  // Initialize
  renderPlayground();
})();
