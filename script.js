/* ==========================================================================
   BAVADESH KUMAR PORTFOLIO — 2026 INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- AUDIO SYNTHESIS SFX (Subtle Tactile Feedback) ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'copy') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const label = soundToggleBtn.querySelector('.sound-label');
      const icon = soundToggleBtn.querySelector('.sound-icon');
      if (soundEnabled) {
        label.innerText = 'SFX: ON';
        icon.innerText = '🔊';
        playSound('copy');
      } else {
        label.innerText = 'SFX: OFF';
        icon.innerText = '🔇';
      }
    });
  }

  // Attach subtle click feedback to interactive elements
  document.querySelectorAll('button, a, .app-badge, .glyph').forEach(el => {
    el.addEventListener('click', () => playSound('click'));
  });

  // --- INTERACTIVE 3D PARALLAX / TILT ON CENTRAL PORTRAIT ---
  const blackSection = document.getElementById('blackSection');
  const portraitStage = document.getElementById('portraitStage');
  const cutoutImg = document.getElementById('cutoutImg');

  if (blackSection && portraitStage) {
    blackSection.addEventListener('mousemove', (e) => {
      const rect = blackSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 18;

      portraitStage.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    blackSection.addEventListener('mouseleave', () => {
      portraitStage.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // --- CROP BOUNDING BOX HOVER COORDINATES UPDATE ---
  const cropBox = document.getElementById('cropBox');
  if (cropBox) {
    const cropCoord = cropBox.querySelector('.crop-coord');
    cropBox.addEventListener('mousemove', (e) => {
      const rect = cropBox.getBoundingClientRect();
      const relX = Math.round(e.clientX - rect.left);
      const relY = Math.round(e.clientY - rect.top);
      if (cropCoord) {
        cropCoord.innerText = `X: ${relX.toString().padStart(4, '0')} Y: ${relY.toString().padStart(4, '0')}`;
      }
    });
    cropBox.addEventListener('mouseleave', () => {
      if (cropCoord) cropCoord.innerText = 'X: 2026 Y: 0800';
    });
  }

  // --- TOAST NOTIFICATION & COPY-TO-CLIPBOARD ---
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    playSound('copy');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`✓ Copied "${text}" to clipboard!`);
        }).catch(() => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(`✓ Copied "${text}" to clipboard!`);
        });
      }
    });
  });

  // --- MODAL SYSTEM FOR PROJECTS & RESUME ---
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const modalData = {
    skillPassportModal: `
      <div style="font-family: var(--font-hero); font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">
        SKILL PASSPORT
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-red); font-weight: 700; margin-bottom: 16px;">
        FULL-STACK AI CAREER PLATFORM // SYSTEM ARCHITECTURE
      </div>
      <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
        Skill Passport is an enterprise-grade AI-powered career platform designed to bridge the gap between job seekers and hiring teams through automated resume intelligence, weighted role compatibility scores, and personalized learning trajectories.
      </p>

      <div style="background: #f4f3ef; border: 1.5px solid #121212; padding: 16px; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">KEY ARCHITECTURAL HIGHLIGHTS:</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; line-height: 1.7; color: var(--text-main);">
          <li><strong>Multi-Portal Architecture:</strong> Independent role-based portals for Students, Recruiters, and Platform Admins with secure JWT authentication and password hashing.</li>
          <li><strong>Document Parsing Engine:</strong> Extracts structured skills, work history, projects, and credentials from PDF and DOCX documents using <code>PyMuPDF</code>.</li>
          <li><strong>Google Gemini API NLP Pipeline:</strong> Real-time role-matching, skill-gap analysis, and semantic scoring with robust local NLP fallback.</li>
          <li><strong>Adaptive Learning Roadmaps:</strong> Generates automated step-by-step milestones to help candidates bridge identified skill gaps.</li>
          <li><strong>Production-Ready Backend:</strong> Built with <code>Python</code>, <code>FastAPI</code>, <code>SQLite</code>, and <code>SQLAlchemy</code> ORM, reinforced with 15 automated test suites and Docker containerization.</li>
        </ul>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span class="mini-tag" style="background:#121212; color:#fff;">FastAPI</span>
        <span class="mini-tag" style="background:#121212; color:#fff;">Google Gemini API</span>
        <span class="mini-tag" style="background:#121212; color:#fff;">PyMuPDF</span>
        <span class="mini-tag" style="background:#121212; color:#fff;">Docker</span>
        <span class="mini-tag" style="background:#121212; color:#fff;">SQLAlchemy</span>
      </div>
    `,

    sihModal: `
      <div style="font-family: var(--font-hero); font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">
        SMART INDIA HACKATHON (SIH)
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #f59e0b; font-weight: 700; margin-bottom: 16px;">
        QUALIFIED PARTICIPANT // NATIONWIDE COMPETITION
      </div>
      <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
        Smart India Hackathon is one of the world's biggest open-innovation competitions organized by the Ministry of Education's Innovation Cell, Government of India.
      </p>

      <div style="background: #f4f3ef; border: 1.5px solid #121212; padding: 16px; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">CONTRIBUTION & HIGHLIGHTS:</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; line-height: 1.7; color: var(--text-main);">
          <li>Collaborated with a cross-functional engineering team to conceptualize, design, and architect a software solution addressing complex public-sector challenges.</li>
          <li>Led the technical solution architecture, schema design, and integration strategy.</li>
          <li>Prepared comprehensive architectural pitch decks and technical documentation that successfully qualified through rigorous jury evaluations.</li>
        </ul>
      </div>
    `,

    nlpModal: `
      <div style="font-family: var(--font-hero); font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">
        RESUME PARSING & NLP PIPELINE
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #38bdf8; font-weight: 700; margin-bottom: 16px;">
        DATA EXTRACTION & SEMANTIC ROLE MATCHING
      </div>
      <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
        The resume parser leverages PyMuPDF to extract raw text blocks and formatting cues from user-uploaded PDFs and Word documents, standardizing them into structured JSON schemas.
      </p>
      <div style="background: #18181c; color: #f0f0f0; border-radius: 4px; padding: 14px; font-family: var(--font-mono); font-size: 0.78rem; margin-bottom: 16px;">
        <span style="color: #6b7280;"># 1. PyMuPDF extracts raw document streams</span><br>
        <span style="color: #6b7280;"># 2. Tokenizer and entity identifier matches technical keywords</span><br>
        <span style="color: #6b7280;"># 3. Gemini API analyzes semantic context & soft skill indicators</span><br>
        <span style="color: #6b7280;"># 4. Weighted matrix produces role compatibility index (0-100%)</span>
      </div>
    `,

    resumeModal: `
      <div style="font-family: var(--font-hero); font-size: 1.8rem; font-weight: 900; margin-bottom: 6px;">
        BAYANA REDDY VENKATA BAVADESH KUMAR
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 16px;">
        SOFTWARE DEVELOPER | COMPUTER SCIENCE • AI & ML<br>
        Bengaluru, Karnataka • +91 9515016091 • bhavadeshbayana9@gmail.com
      </div>
      <div style="background: #f4f3ef; border: 1.5px solid #121212; padding: 14px; margin-bottom: 14px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; margin-bottom: 4px;">PROFILE</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
          B.Tech Computer Science and Engineering (AI & ML) student at Jain University, graduating in 2029. Built an AI-powered career platform with resume analysis, role matching, and learning roadmaps. Interested in entry-level software development roles, with project experience in backend APIs, databases, and AI integration.
        </p>
      </div>
      <div style="background: #f4f3ef; border: 1.5px solid #121212; padding: 14px; margin-bottom: 14px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; margin-bottom: 4px;">ACADEMIC METRICS</h4>
        <p style="font-size: 0.85rem; line-height: 1.6;">
          <strong>Jain University:</strong> Semester 1–2 CGPA: <strong>8.0</strong><br>
          <strong>Class 12:</strong> <strong>96.2%</strong> &bull; <strong>Class 10:</strong> <strong>93%</strong>
        </p>
      </div>
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <a href="mailto:bhavadeshbayana9@gmail.com" class="primary-action-btn" style="text-align:center; flex:1;">
          EMAIL CANDIDATE ✉
        </a>
      </div>
    `
  };

  function openModal(key) {
    if (modalData[key] && modalBody && modalBackdrop) {
      modalBody.innerHTML = modalData[key];
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSound('click');
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      playSound('click');
    }
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalKey = btn.getAttribute('data-modal');
      openModal(modalKey);
    });
  });

  const resumeBtn = document.getElementById('resumeViewBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => openModal('resumeModal'));
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

});
