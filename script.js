/**
 * Rittika's Romantic Birthday Surprise - Interactive 5-Page Application Script
 * Mobile Touch & Floating Balloon Overhaul
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- AUDIO SYNTHESIZER & SOUND ENGINE ---
  let audioCtx = null;
  let isMuted = false;
  let masterVolume = 0.5;
  let bgMusicInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Reliable mobile/desktop tap helper. One click event prevents duplicate taps.
  function addTapListener(element, callback) {
    if (!element) return;
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      callback(e);
    });
  }

  // Synthesize Romantic Piano Melody using Web Audio API
  function startPianoMelody() {
    if (bgMusicInterval) return;
    initAudioContext();

    const notes = [
      261.63, 329.63, 392.00, 493.88, 523.25, // C4, E4, G4, B4, C5
      349.23, 440.00, 523.25, 659.25,        // F4, A4, C5, E5
      392.00, 493.88, 587.33, 698.46,        // G4, B4, D5, F5
      220.00, 261.63, 329.63, 440.00         // A3, C4, E4, A4
    ];

    let noteIndex = 0;

    bgMusicInterval = setInterval(() => {
      if (isMuted || !audioCtx) return;

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        const freq = notes[noteIndex % notes.length];
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18 * masterVolume, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.3);

        noteIndex++;
      } catch (e) {
        console.log("Audio play error:", e);
      }
    }, 400);
  }

  function stopPianoMelody() {
    if (bgMusicInterval) {
      clearInterval(bgMusicInterval);
      bgMusicInterval = null;
    }
  }

  // Sound Effect: Balloon Pop
  function playPopSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35 * masterVolume, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  // Sound Effect: Candle Blow / Wind
  function playBlowSound() {
    if (isMuted || !audioCtx) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25 * masterVolume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {}
  }

  // Sound Effect: Heartbeat Thump
  function playHeartbeatSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.4 * masterVolume, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}
  }

  // Sound Effect: Fanfare / Celebration Sparkle
  function playFanfareSound() {
    if (isMuted || !audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.3 * masterVolume, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.6);
        } catch (e) {}
      }, idx * 120);
    });
  }

  // Audio Controls Listeners
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const volumeSlider = document.getElementById('volumeSlider');

  addTapListener(musicToggleBtn, () => {
    isMuted = !isMuted;
    if (isMuted) {
      musicIcon.textContent = '🔇';
      stopPianoMelody();
    } else {
      musicIcon.textContent = '🎵';
      startPianoMelody();
    }
  });

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      masterVolume = parseFloat(e.target.value);
    });
  }

  // --- CANVAS SAKURA PETALS ENGINE ---
  const blossomCanvas = document.getElementById('blossomCanvas');
  const bCtx = blossomCanvas.getContext('2d');

  let width = (blossomCanvas.width = window.innerWidth);
  let height = (blossomCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = blossomCanvas.width = window.innerWidth;
    height = blossomCanvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 45;
  let windX = 0;

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.5 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.color = Math.random() > 0.5 ? '#ffb6c1' : '#ffc0cb';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + windX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20) {
        this.reset();
        this.y = -20;
      }
    }

    draw() {
      bCtx.save();
      bCtx.translate(this.x, this.y);
      bCtx.rotate((this.rotation * Math.PI) / 180);
      bCtx.globalAlpha = this.opacity;

      bCtx.beginPath();
      bCtx.moveTo(0, 0);
      bCtx.bezierCurveTo(this.size, -this.size / 2, this.size, this.size, 0, this.size * 1.5);
      bCtx.bezierCurveTo(-this.size, this.size, -this.size, -this.size / 2, 0, 0);
      bCtx.fillStyle = this.color;
      bCtx.fill();

      bCtx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function renderBlossoms() {
    bCtx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderBlossoms);
  }
  renderBlossoms();

  // Breeze effect on touch or mouse move
  window.addEventListener('mousemove', (e) => {
    windX = (e.clientX / width - 0.5) * 1.5;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      windX = (e.touches[0].clientX / width - 0.5) * 1.5;
    }
  }, { passive: true });

  // --- PAGE FLOW & NAVIGATION ENGINE ---
  const pages = document.querySelectorAll('.page-view');
  const navTabs = document.querySelectorAll('.nav-tab');

  function switchPage(pageIndex) {
    initAudioContext();
    startPianoMelody();

    pages.forEach((p) => p.classList.remove('active'));
    const targetPage = document.getElementById(`page${pageIndex}`);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.scrollTop = 0;
    }

    navTabs.forEach(tab => {
      if (parseInt(tab.dataset.target) === parseInt(pageIndex)) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (pageIndex === 2) {
      startQuoteCarousel();
    } else if (pageIndex === 3) {
      initBalloonGame();
    } else if (pageIndex === 4) {
      resetGalleryPage();
    } else if (pageIndex === 5) {
      initLetterPage();
    } else if (pageIndex === 6) {
      initScratchCard();
    }
  }

  navTabs.forEach(tab => {
    addTapListener(tab, () => {
      const pageNum = parseInt(tab.dataset.target);
      switchPage(pageNum);
    });
  });

  // Page 1 -> Start Button
  addTapListener(document.getElementById('startBtn'), () => {
    switchPage(2);
  });

  // --- PAGE 2: HEARTBEAT & CALENDAR LOGIC ---
  const quotes = [
    '"Every heartbeat whispers your name, Cuteee..."',
    '"You bring magic, warmth, and laughter into my life."',
    '"With every pulse, a beautiful story unfolds..."',
    '"20th September 2026 – A date truly written in the stars ✨"'
  ];
  let quoteIdx = 0;
  let quoteTimer = null;

  function startQuoteCarousel() {
    if (quoteTimer) return;
    const quoteEl = document.getElementById('quoteText');
    quoteTimer = setInterval(() => {
      quoteIdx = (quoteIdx + 1) % quotes.length;
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = quotes[quoteIdx];
        quoteEl.style.opacity = '1';
        playHeartbeatSound();
      }, 400);
    }, 3200);
  }

  const glowingHeartBtn = document.getElementById('glowingHeartBtn');
  const calendarWrapper = document.getElementById('calendarWrapper');

  addTapListener(glowingHeartBtn, () => {
    playHeartbeatSound();
    calendarWrapper.classList.remove('hidden');
    calendarWrapper.scrollIntoView({ behavior: 'smooth' });
  });

  const sept20Btn = document.getElementById('sept20Btn');
  addTapListener(sept20Btn, () => {
    playFanfareSound();
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    playHeartTreeTransition(() => switchPage(3));
  });

  // --- PAGE 3: BALLOON GAME & CAKE CEREMONY ---
  let poppedBalloons = 0;
  const totalBalloons = 9;
  const balloonColors = ['#ff758c', '#ff7eb3', '#b0e0e6', '#e6e6fa', '#ffd700', '#ff9aa2', '#b5ead7', '#c7ceea', '#ffc6ff'];
  const balloonEmojis = ['🎈', '💖', '🌸', '⭐', '👑', '✨', '🍓', '🎀', '💌'];

  function initBalloonGame() {
    const balloonField = document.getElementById('balloonField');
    balloonField.innerHTML = '';
    poppedBalloons = 0;
    document.getElementById('poppedCount').textContent = '0';
    document.getElementById('cakeSection').classList.add('hidden');
    document.getElementById('balloonGameContainer').style.display = 'flex';

    for (let i = 0; i < totalBalloons; i++) {
      const balloon = document.createElement('div');
      const pathType = (i % 3) + 1;
      balloon.className = `balloon-item float-path-${pathType}`;
      balloon.style.backgroundColor = balloonColors[i % balloonColors.length];
      balloon.textContent = balloonEmojis[i % balloonEmojis.length];

      // Grid placement inside container
      const col = i % 3;
      const row = Math.floor(i / 3);
      balloon.style.left = `${10 + col * 30 + (Math.random() * 6 - 3)}%`;
      balloon.style.bottom = `${10 + row * 22}%`;
      balloon.style.animationDelay = `${(i * 0.3).toFixed(2)}s`;
      balloon.style.animationDuration = `${5 + (i % 3) * 1.2}s`;

      addTapListener(balloon, (e) => popBalloon(balloon, e));
      balloonField.appendChild(balloon);
    }

  }

  // Register Auto Pop only once.
  const autoPopBtn = document.getElementById('autoPopBtn');
  addTapListener(autoPopBtn, () => {
    const activeBalloons = document.querySelectorAll('.balloon-item:not([data-popped="true"])');
    activeBalloons.forEach((b, idx) => {
      setTimeout(() => popBalloon(b, null), idx * 100);
    });
  });

  function popBalloon(balloonEl, e) {
    if (!balloonEl || balloonEl.dataset.popped === 'true') return;
    balloonEl.dataset.popped = 'true';

    playPopSound();

    const field = document.getElementById('balloonField');
    const fieldRect = field.getBoundingClientRect();
    const balloonRect = balloonEl.getBoundingClientRect();

    let clickX = balloonRect.left + balloonRect.width / 2 - fieldRect.left;
    let clickY = balloonRect.top + balloonRect.height / 2 - fieldRect.top;

    if (e && (e.clientX || e.touches)) {
      const pageX = e.touches ? e.touches[0].clientX : e.clientX;
      const pageY = e.touches ? e.touches[0].clientY : e.clientY;
      if (pageX && pageY) {
        clickX = pageX - fieldRect.left;
        clickY = pageY - fieldRect.top;
      }
    }

    const popEffect = document.createElement('div');
    popEffect.className = 'balloon-pop-effect';
    popEffect.textContent = '💥';
    popEffect.style.left = `${clickX - 25}px`;
    popEffect.style.top = `${clickY - 25}px`;
    field.appendChild(popEffect);

    balloonEl.style.opacity = '0';
    balloonEl.style.transform = 'scale(1.6)';
    balloonEl.style.pointerEvents = 'none';
    setTimeout(() => { balloonEl.remove(); }, 180);

    poppedBalloons++;
    document.getElementById('poppedCount').textContent = Math.min(poppedBalloons, totalBalloons);

    if (poppedBalloons >= totalBalloons) {
      setTimeout(showCakeCeremony, 500);
    }
  }

  function showCakeCeremony() {
    playFanfareSound();
    document.getElementById('balloonGameContainer').style.display = 'none';
    const cakeSection = document.getElementById('cakeSection');
    cakeSection.classList.remove('hidden');

    extinguishedCandles = 0;
    const candles = document.querySelectorAll('.candle');
    candles.forEach(c => {
      const flame = c.querySelector('.flame');
      const smoke = c.querySelector('.smoke');
      flame.classList.remove('off');
      smoke.classList.remove('active');
    });

    document.getElementById('instructionText').textContent = 'Tap the candles to blow them out!';
    document.getElementById('instructionIcon').textContent = '🕯️';
    document.getElementById('cutCakeBtn').classList.add('hidden');
  }

  // Candle blowing logic
  let extinguishedCandles = 0;
  const candles = document.querySelectorAll('.candle');

  candles.forEach(candle => {
    addTapListener(candle, () => {
      const flame = candle.querySelector('.flame');
      const smoke = candle.querySelector('.smoke');

      if (!flame.classList.contains('off')) {
        flame.classList.add('off');
        smoke.classList.add('active');
        playBlowSound();
        extinguishedCandles++;

        if (extinguishedCandles === candles.length) {
          setTimeout(() => {
            document.getElementById('instructionText').textContent = 'Now click to cut the cake! 🍰';
            document.getElementById('instructionIcon').textContent = '✨';
            document.getElementById('cutCakeBtn').classList.remove('hidden');
          }, 500);
        }
      }
    });
  });

  // Cut Cake Action -> Confetti -> Page 4
  const cutCakeBtn = document.getElementById('cutCakeBtn');
  addTapListener(cutCakeBtn, () => {
    playFanfareSound();

    if (window.confetti) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    setTimeout(() => {
      switchPage(4);
    }, 2800);
  });

  // --- PAGE 4: DECORATED 10-PHOTO GALLERY LOGIC ---
  const pngFrames = document.querySelectorAll('.png-decorated-frame');
  const revealedPhotoCountEl = document.getElementById('revealedPhotoCount');
  const goToLetterBtn = document.getElementById('goToLetterBtn');
  let revealedCount = 0;

  function resetGalleryPage() {
    revealedCount = 0;
    revealedPhotoCountEl.textContent = '0';
    pngFrames.forEach(frame => frame.classList.remove('revealed'));
  }

  pngFrames.forEach(frame => {
    addTapListener(frame, () => {
      if (!frame.classList.contains('revealed')) {
        frame.classList.add('revealed');
        playPopSound();
        revealedCount++;
        revealedPhotoCountEl.textContent = revealedCount;

        if (window.confetti) {
          window.confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
        }

        if (revealedCount === pngFrames.length) {
          playFanfareSound();
          setTimeout(() => {
            goToLetterBtn.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        }
      } else {
        const img = frame.querySelector('.photo-img-8');
        const caption = frame.dataset.caption || 'Rittika Moment';
        openModal(img.src, caption);
      }
    });
  });

  // Navigate to Page 5 (Letter Card)
  addTapListener(goToLetterBtn, () => {
    playFanfareSound();
    switchPage(5);
  });

  // --- PAGE 5: SPECIAL BIRTHDAY LETTER (INTERACTIVE ENVELOPE LOGIC) ---
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const interactiveEnvelope = document.getElementById('interactiveEnvelope');
  const unfoldedLetterWrapper = document.getElementById('unfoldedLetterWrapper');

  function initLetterPage() {
    interactiveEnvelope.classList.remove('open');
    envelopeWrapper.style.display = 'flex';
    unfoldedLetterWrapper.classList.add('hidden');
  }

  addTapListener(envelopeWrapper, () => {
    openEnvelope();
  });

  function openEnvelope() {
    if (!interactiveEnvelope.classList.contains('open')) {
      interactiveEnvelope.classList.add('open');
      playFanfareSound();

      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

      setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        unfoldedLetterWrapper.classList.remove('hidden');
        unfoldedLetterWrapper.scrollIntoView({ behavior: 'smooth' });
        startFlowerRain(6500);
      }, 900);
    }
  }

  // Lightbox Modal Functions
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(src, captionText) {
    modalImg.src = src;
    modalCaption.textContent = captionText;
    modal.classList.remove('hidden');
  }

  addTapListener(modalCloseBtn, () => {
    modal.classList.add('hidden');
  });

  addTapListener(modal, (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Replay Full Experience Handler
  addTapListener(document.getElementById('replayFullBtn'), () => {
    switchPage(1);
  });

  // --- HEART TREE TRANSITION AFTER THE CALENDAR ---
  const heartTreeOverlay = document.getElementById('heartTreeOverlay');
  const heartTree = document.getElementById('heartTree');
  function playHeartTreeTransition(next) {
    heartTree.innerHTML = '';
    heartTreeOverlay.classList.add('show');
    for (let i = 0; i < 52; 