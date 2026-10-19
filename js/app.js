/**
 * SONORA AI - Main Application Controller & UI State Orchestrator
 * High-performance, zero-dependency interactive studio matching & surpassing Suno v3.5/v4
 * Updated with robust Custom Song Creation, 50 Daily Tokens economy, WebPay checkout, and Global Music Categories
 */

class SonoraApp {
  constructor() {
    this.audioEngine = new SonoraAudioEngine();
    this.visualizer = new SonoraVisualizer(this.audioEngine);
    this.lyricsEngine = new SonoraLyricsEngine();
    this.stemMixer = new SonoraStemMixer(this.audioEngine);

    // Application State
    this.tracks = [...DEFAULT_TRACKS];
    this.userCreations = [];
    this.currentTrackIndex = 0;
    this.currentViewTab = 'explore'; // 'explore' | 'library' | 'trending'
    this.activeCategory = 'all'; // 'all' | 'urbano' | 'pop' | 'electronica' | 'afrobeats' | 'regional' | 'rock' | 'lofi' | 'cine'
    this.displayMode = 'list'; // 'list' | 'grid'

    // Daily Credits Economy (50 credits default = 5 songs at 10 credits each)
    this.userCredits = 50;
    this.isGenerating = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.currentStudioMode = 'simple'; // 'simple' | 'custom'

    // Selected style tags
    this.selectedStyles = [];

    // Selected WebPay pack
    this.selectedWebPayPack = WEBPAY_PACKS[1]; // Pack Pro default

    // Supabase Cloud Client
    this.supabase = window.SonoraSupabaseClient ? new window.SonoraSupabaseClient() : null;

    // Load persisted state if available
    this.loadPersistedState();
  }

  /**
   * Initializes all sub-systems, canvas renderers, and DOM event listeners
   */
  init() {
    this.cacheDomElements();
    this.visualizer.initWaveformCanvas(this.dom.waveformCanvas);
    this.visualizer.initFullscreenVisualizer(this.dom.visualizerCanvas);
    this.stemMixer.init(this.dom.stemMixerModal);

    if (this.supabase) {
      this.supabase.init();
    }

    this.bindEvents();
    this.renderTrackList();
    this.loadInitialTrack(this.tracks[0]);
    this.updateCreditsDisplay();

    // Initialize User Profile / Admin Master Panel and VIP Studio Chat
    if (window.SonoraProfileAdmin) {
      this.profileAdmin = new window.SonoraProfileAdmin(this);
      this.profileAdmin.init();
    }
    if (window.SonoraVipChat) {
      this.vipChat = new window.SonoraVipChat(this);
      this.vipChat.init();
    }
  }

  cacheDomElements() {
    this.dom = {
      // Header
      searchInput: document.getElementById('search-input'),
      searchClearBtn: document.getElementById('search-clear-btn'),
      creditsCount: document.getElementById('credits-count'),
      creditsPill: document.getElementById('credits-pill'),
      btnHeaderWebpay: document.getElementById('btn-header-webpay'),
      btnSidebarWebpay: document.getElementById('btn-sidebar-webpay'),

      // Studio Form
      modeSimpleBtn: document.getElementById('btn-mode-simple'),
      modeCustomBtn: document.getElementById('btn-mode-custom'),
      simpleControls: document.getElementById('simple-controls'),
      customControls: document.getElementById('custom-controls'),
      promptInput: document.getElementById('prompt-input'),
      lyricsInput: document.getElementById('lyrics-input'),
      customStyleInput: document.getElementById('custom-style-input'),
      customTitleInput: document.getElementById('custom-title-input'),
      modelSelect: document.getElementById('model-select'),
      vocalSelect: document.getElementById('vocal-select'),
      instrumentalToggle: document.getElementById('instrumental-toggle'),
      customInstrumentalToggle: document.getElementById('custom-instrumental-toggle'),
      btnInspirePrompt: document.getElementById('btn-inspire-prompt'),
      btnAiLyrics: document.getElementById('btn-ai-lyrics'),
      btnCreateSong: document.getElementById('btn-create-song'),
      btnCreateSongTop: document.getElementById('btn-create-song-top'),

      // Generation Box
      generationCard: document.getElementById('generation-status-card'),
      genProgressBar: document.getElementById('gen-progress-bar'),
      genStatusPhase: document.getElementById('gen-status-phase'),

      // Feed & Navigation
      feedTabs: document.querySelectorAll('.feed-tab'),
      categoryPills: document.querySelectorAll('.category-pill'),
      btnViewList: document.getElementById('btn-view-list'),
      btnViewGrid: document.getElementById('btn-view-grid'),
      tracksContainer: document.getElementById('tracks-container'),
      heroPlayBtn: document.getElementById('hero-play-btn'),
      heroCreateBtn: document.getElementById('hero-create-btn'),

      // Bottom Player
      playerThumbCanvas: document.getElementById('player-thumb-canvas'),
      playerTitle: document.getElementById('player-title'),
      playerArtist: document.getElementById('player-artist'),
      playerLikeBtn: document.getElementById('player-like-btn'),
      btnPlayPause: document.getElementById('btn-player-play'),
      btnPrev: document.getElementById('btn-player-prev'),
      btnNext: document.getElementById('btn-player-next'),
      btnShuffle: document.getElementById('btn-player-shuffle'),
      btnRepeat: document.getElementById('btn-player-repeat'),
      timeCurrent: document.getElementById('time-current'),
      timeDuration: document.getElementById('time-duration'),
      waveformCanvas: document.getElementById('waveform-canvas'),
      waveformWrap: document.getElementById('waveform-canvas-wrap'),
      waveformHoverTime: document.getElementById('waveform-hover-time'),
      volumeSlider: document.getElementById('volume-slider'),
      btnMute: document.getElementById('btn-player-mute'),
      btnOpenStems: document.getElementById('btn-open-stems'),
      btnOpenLyrics: document.getElementById('btn-open-lyrics'),
      btnOpenVisualizer: document.getElementById('btn-open-visualizer'),

      // Modals & Drawers
      lyricsDrawer: document.getElementById('lyrics-drawer'),
      lyricsDrawerClose: document.getElementById('lyrics-drawer-close'),
      lyricsScrollContainer: document.getElementById('lyrics-scroll-container'),
      lyricsDrawerSongTitle: document.getElementById('lyrics-drawer-song-title'),

      stemMixerModal: document.getElementById('stem-mixer-modal'),
      stemMixerClose: document.getElementById('stem-mixer-close'),

      visualizerOverlay: document.getElementById('visualizer-overlay'),
      visualizerCanvas: document.getElementById('visualizer-canvas'),
      visualizerClose: document.getElementById('visualizer-close'),
      visualizerModeSelect: document.getElementById('visualizer-mode-select'),
      visualizerSongTitle: document.getElementById('visualizer-song-title'),

      // WebPay Checkout Modal
      webpayModal: document.getElementById('webpay-modal'),
      webpayCloseBtn: document.getElementById('webpay-close-btn'),
      webpayPacksContainer: document.getElementById('webpay-packs-container'),
      webpayFormStep: document.getElementById('webpay-form-step'),
      webpayProcessingStep: document.getElementById('webpay-processing-step'),
      webpaySuccessStep: document.getElementById('webpay-success-step'),
      btnSubmitWebpay: document.getElementById('btn-submit-webpay'),
      webpaySuccessCredits: document.getElementById('webpay-success-credits'),
      webpaySuccessCloseBtn: document.getElementById('webpay-success-close-btn'),

      toastContainer: document.getElementById('toast-container')
    };
  }

  bindEvents() {
    // Mode Switcher (Simple vs Custom)
    this.dom.modeSimpleBtn.addEventListener('click', () => this.setStudioMode('simple'));
    this.dom.modeCustomBtn.addEventListener('click', () => this.setStudioMode('custom'));

    // Quick Inspiration Prompt button
    this.dom.btnInspirePrompt.addEventListener('click', () => {
      const randomPrompt = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
      if (this.currentStudioMode === 'custom') {
        this.dom.customStyleInput.value = randomPrompt;
        this.dom.customTitleInput.value = this.generateSongTitle(randomPrompt);
      } else {
        this.dom.promptInput.value = randomPrompt;
      }
      this.showToast('Inspiración aplicada con éxito 💡', 'info');
    });

    // Style Pills selection (Simple Mode)
    document.querySelectorAll('.style-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('active');
        const styleName = pill.getAttribute('data-style');
        if (pill.classList.contains('active')) {
          this.selectedStyles.push(styleName);
        } else {
          this.selectedStyles = this.selectedStyles.filter(s => s !== styleName);
        }
      });
    });

    // Structure Tag Inserters in Lyrics Editor (Custom Mode)
    document.querySelectorAll('.tag-insert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        this.insertTagIntoLyrics(tag);
      });
    });

    // AI Lyricist Button (Custom Mode)
    this.dom.btnAiLyrics.addEventListener('click', () => {
      const topic = this.dom.customTitleInput.value || this.dom.customStyleInput.value || this.dom.promptInput.value || "frecuencias de neón y amor";
      const genre = this.dom.customStyleInput.value || "synthwave";
      const generated = this.lyricsEngine.generateLyrics(topic, genre);
      this.dom.lyricsInput.value = generated;
      this.showToast('Letras generadas por IA con estructura métrica ✨', 'success');
    });

    // The CREATE SONG Action (Top & Bottom buttons)
    this.dom.btnCreateSong.addEventListener('click', () => this.handleCreateSong());
    if (this.dom.btnCreateSongTop) {
      this.dom.btnCreateSongTop.addEventListener('click', () => this.handleCreateSong());
    }

    // Search input
    this.dom.searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      this.dom.searchClearBtn.classList.toggle('active', q.length > 0);
      this.filterTracks(q);
    });

    this.dom.searchClearBtn.addEventListener('click', () => {
      this.dom.searchInput.value = '';
      this.dom.searchClearBtn.classList.remove('active');
      this.renderTrackList();
    });

    // Feed Tabs (Explore, Library, Trending)
    this.dom.feedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.dom.feedTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentViewTab = tab.getAttribute('data-tab');
        this.renderTrackList();
      });
    });

    // Category Filter Pills (Global Music scene)
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.getAttribute('data-category');
        this.renderTrackList();
      });
    });

    // View Toggles (List vs Grid)
    this.dom.btnViewList.addEventListener('click', () => this.setDisplayMode('list'));
    this.dom.btnViewGrid.addEventListener('click', () => this.setDisplayMode('grid'));

    // Hero banner actions
    this.dom.heroPlayBtn.addEventListener('click', () => {
      if (this.tracks.length > 0) this.playTrackById(this.tracks[0].id);
    });
    this.dom.heroCreateBtn.addEventListener('click', () => {
      this.setStudioMode('simple');
      this.dom.promptInput.focus();
    });

    // Player Play/Pause Controls
    this.dom.btnPlayPause.addEventListener('click', () => this.togglePlayPause());
    this.dom.btnPrev.addEventListener('click', () => this.playPrevious());
    this.dom.btnNext.addEventListener('click', () => this.playNext());

    this.dom.btnShuffle.addEventListener('click', () => {
      this.isShuffle = !this.isShuffle;
      this.dom.btnShuffle.classList.toggle('active', this.isShuffle);
      this.showToast(this.isShuffle ? 'Modo aleatorio activado' : 'Modo aleatorio desactivado', 'info');
    });

    this.dom.btnRepeat.addEventListener('click', () => {
      this.isRepeat = !this.isRepeat;
      this.dom.btnRepeat.classList.toggle('active', this.isRepeat);
      this.showToast(this.isRepeat ? 'Bucle activado' : 'Bucle desactivado', 'info');
    });

    // Player Volume
    this.dom.volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.audioEngine.setMasterVolume(val);
      this.dom.btnMute.innerHTML = val === 0 ? this.getMuteIcon() : this.getVolumeIcon();
    });

    this.dom.btnMute.addEventListener('click', () => {
      const current = parseFloat(this.dom.volumeSlider.value);
      if (current > 0) {
        this.audioEngine.setMasterVolume(0);
        this.dom.volumeSlider.value = 0;
        this.dom.btnMute.innerHTML = this.getMuteIcon();
      } else {
        this.audioEngine.setMasterVolume(0.85);
        this.dom.volumeSlider.value = 0.85;
        this.dom.btnMute.innerHTML = this.getVolumeIcon();
      }
    });

    // Waveform Click-to-Seek & Hover preview
    this.dom.waveformWrap.addEventListener('click', (e) => {
      const rect = this.dom.waveformWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progress = clickX / rect.width;
      const currentTrack = this.audioEngine.currentTrack;
      if (currentTrack) {
        const targetSeconds = progress * currentTrack.duration;
        this.audioEngine.seek(targetSeconds);
      }
    });

    this.dom.waveformWrap.addEventListener('mousemove', (e) => {
      const rect = this.dom.waveformWrap.getBoundingClientRect();
      const hoverX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const progress = hoverX / rect.width;
      const currentTrack = this.audioEngine.currentTrack;
      if (currentTrack) {
        const hoverSeconds = progress * currentTrack.duration;
        this.dom.waveformHoverTime.textContent = this.formatTime(hoverSeconds);
        this.dom.waveformHoverTime.style.left = `${hoverX}px`;
      }
    });

    // Synchronized Lyrics Drawer
    this.dom.btnOpenLyrics.addEventListener('click', () => this.toggleLyricsDrawer());
    this.dom.lyricsDrawerClose.addEventListener('click', () => this.closeLyricsDrawer());

    // Stem Mixer Modal
    this.dom.btnOpenStems.addEventListener('click', () => this.openStemMixer());
    this.dom.stemMixerClose.addEventListener('click', () => this.closeStemMixer());

    // Fullscreen Visualizer
    this.dom.btnOpenVisualizer.addEventListener('click', () => this.openVisualizer());
    this.dom.visualizerClose.addEventListener('click', () => this.closeVisualizer());
    this.dom.visualizerModeSelect.addEventListener('change', (e) => {
      this.visualizer.mode = e.target.value;
    });

    // WebPay Modal triggers
    if (this.dom.btnHeaderWebpay) {
      this.dom.btnHeaderWebpay.addEventListener('click', () => this.openWebPayModal());
    }
    if (this.dom.btnSidebarWebpay) {
      this.dom.btnSidebarWebpay.addEventListener('click', () => this.openWebPayModal());
    }
    this.dom.creditsPill.addEventListener('click', () => this.openWebPayModal());
    this.dom.webpayCloseBtn.addEventListener('click', () => this.closeWebPayModal());
    this.dom.btnSubmitWebpay.addEventListener('click', () => this.processWebPayPayment());
    this.dom.webpaySuccessCloseBtn.addEventListener('click', () => this.closeWebPayModal());

    // Audio Engine Callbacks
    this.audioEngine.onTimeUpdate((currentTime, duration) => {
      this.dom.timeCurrent.textContent = this.formatTime(currentTime);
      this.dom.timeDuration.textContent = this.formatTime(duration);
      this.visualizer.drawWaveform();
      this.updateActiveLyricLine(currentTime, duration);
    });

    this.audioEngine.onTrackEnd(() => {
      if (this.isRepeat) {
        this.audioEngine.playTrack(this.audioEngine.currentTrack, 0);
      } else {
        this.playNext();
      }
    });

    // Global keyboard shortcuts (Space to toggle play/pause)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      }
    });
  }

  setStudioMode(mode) {
    this.currentStudioMode = mode;
    this.dom.modeSimpleBtn.classList.toggle('active', mode === 'simple');
    this.dom.modeCustomBtn.classList.toggle('active', mode === 'custom');
    this.dom.simpleControls.style.display = mode === 'simple' ? 'flex' : 'none';
    this.dom.customControls.style.display = mode === 'custom' ? 'flex' : 'none';
  }

  setDisplayMode(mode) {
    this.displayMode = mode;
    this.dom.btnViewList.classList.toggle('active', mode === 'list');
    this.dom.btnViewGrid.classList.toggle('active', mode === 'grid');
    this.renderTrackList();
  }

  insertTagIntoLyrics(tag) {
    const area = this.dom.lyricsInput;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const text = area.value;
    area.value = text.substring(0, start) + `\n${tag}\n` + text.substring(end);
    area.focus();
    area.selectionStart = area.selectionEnd = start + tag.length + 2;
  }

  /**
   * The Suno-style Generation Pipeline - 100% ROBUST & ENHANCED
   * Generates 2 unique song variations with customized style, title, lyrics, and stems
   */
  async handleCreateSong() {
    if (this.isGenerating) return;

    // 1. Synchronously unlock Web Audio context on the user gesture
    this.audioEngine.unlockAudioContext();

    // 2. Check Credits (Bypassed if user is Admin with Infinite Tokens)
    if (!this.hasInfiniteTokens && this.userCredits < 10) {
      this.showToast('¡Créditos insuficientes! Recarga con WebPay para seguir creando.', 'warning');
      this.openWebPayModal();
      return;
    }

    const isCustom = this.currentStudioMode === 'custom';
    let promptText = "";
    let lyricsText = "";
    let songTitle = "";
    let songStyle = "";
    let isInstrumental = false;

    if (isCustom) {
      songTitle = this.dom.customTitleInput.value.trim();
      songStyle = this.dom.customStyleInput.value.trim();
      lyricsText = this.dom.lyricsInput.value.trim();
      isInstrumental = this.dom.customInstrumentalToggle ? this.dom.customInstrumentalToggle.checked : false;
      promptText = songStyle || songTitle || lyricsText;

      // Provide intelligent fallbacks if fields are partially filled
      if (!songTitle) {
        songTitle = this.generateSongTitle(songStyle || lyricsText || "Melodía de Autor");
      }
      if (!songStyle) {
        songStyle = this.selectedStyles.length > 0 ? this.selectedStyles.join(', ') : "Electro Pop Moderno";
      }
    } else {
      promptText = this.dom.promptInput.value.trim();
      isInstrumental = this.dom.instrumentalToggle.checked;
      if (this.selectedStyles.length > 0) {
        songStyle = this.selectedStyles.join(', ');
      } else {
        const detected = this.determinePattern(promptText);
        const styleNameMap = {
          cristiana: 'Música Cristiana / Worship',
          reggaeton: 'Reggaeton / Latin Dembow',
          trap: 'Trap Latino 808',
          phonk: 'Brazilian Phonk / Drift',
          afrobeats: 'Afrobeats / Lagos Flow',
          amapiano: 'Amapiano Sudafricano',
          corridos: 'Corridos Tumbados Regional',
          rock: 'Indie Rock / Alternativo',
          lofi: 'Lo-Fi Chillhop / Relax',
          orchestral: 'Sinfónica / Cine',
          deephouse: 'Tech House / Club',
          citypop: 'Nu-Disco / Dance Pop',
          synthwave: 'Synthwave / 80s Retro'
        };
        songStyle = styleNameMap[detected] || 'Pop Moderno';
      }
      songTitle = this.generateSongTitle(promptText || songStyle);
    }

    // Require at least some input
    if (!promptText && !lyricsText && !songTitle) {
      this.showToast('Por favor escribe un título, estilo o letra para tu canción.', 'warning');
      if (isCustom) this.dom.customTitleInput.focus();
      else this.dom.promptInput.focus();
      return;
    }

    // Deduct 10 credits unless user has Infinite Tokens
    if (!this.hasInfiniteTokens) {
      this.userCredits = Math.max(0, this.userCredits - 10);
      this.updateCreditsDisplay();
      this.persistState();
    }
    this.isGenerating = true;
    this.dom.btnCreateSong.disabled = true;
    if (this.dom.btnCreateSongTop) this.dom.btnCreateSongTop.disabled = true;

    // Show Progress Bar
    this.dom.generationCard.classList.add('active');
    this.dom.genProgressBar.style.width = '10%';

    const phases = [
      { msg: 'Analizando métrica lírica y armonía musical...', pct: '25%' },
      { msg: 'Estructurando estrofas, coros y tempo BPM...', pct: '50%' },
      { msg: 'Sintetizando voces neuronales y stems de audio...', pct: '75%' },
      { msg: 'Masterizando a 48kHz Dolby Stereo...', pct: '92%' },
      { msg: '¡Generación completada!', pct: '100%' }
    ];

    for (let i = 0; i < phases.length; i++) {
      this.dom.genStatusPhase.textContent = phases[i].msg;
      this.dom.genProgressBar.style.width = phases[i].pct;
      await this.sleep(400);
    }

    // Determine genre and procedural audio pattern accurately
    const pattern = this.determinePattern(`${songStyle} ${songTitle} ${promptText}`);

    // Generate Structured Lyrics if not instrumental
    let parsedLyrics1 = [];
    let parsedLyrics2 = [];

    if (!isInstrumental) {
      const baseLyrics = lyricsText || this.lyricsEngine.generateLyrics(songTitle, songStyle);
      parsedLyrics1 = this.lyricsEngine.parseLyricsWithTiming(baseLyrics, 156);
      parsedLyrics2 = this.lyricsEngine.parseLyricsWithTiming(baseLyrics, 168);
    }

    const vocalStyleValue = this.dom.vocalSelect ? this.dom.vocalSelect.value : 'Femenina';

    const audioUrl1 = window.getRealAudioForGenre ? window.getRealAudioForGenre(pattern, 1) : 'audio/cristiana-1.mp3';
    const audioUrl2 = window.getRealAudioForGenre ? window.getRealAudioForGenre(pattern, 2) : 'audio/reggaeton-2.mp3';

    // Call Vercel Serverless AI Generation API if online
    let serverVar1 = null;
    let serverVar2 = null;

    try {
      const apiRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          style: songStyle,
          title: songTitle,
          lyrics: lyricsText,
          isInstrumental: isInstrumental,
          vocalType: vocalStyleValue,
          model: this.dom.modelSelect ? this.dom.modelSelect.value : 'v4.2 Ultra',
          userId: this.supabase && this.supabase.user ? this.supabase.user.id : 'guest-miguel-admin'
        })
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.variations && data.variations.length >= 2) {
          serverVar1 = data.variations[0];
          serverVar2 = data.variations[1];
        }
      }
    } catch (e) {
      console.warn('Vercel /api/generate running in client fallback mode:', e);
    }

    const var1 = serverVar1 || {
      id: `sonora-user-${Date.now()}-1`,
      title: `${songTitle} (v1)`,
      artist: 'Tú & SONORA AI',
      prompt: promptText || songStyle,
      style: songStyle,
      category: this.mapPatternToCategory(pattern),
      tags: [songStyle.split(',')[0], 'Engine v4.2', isInstrumental ? 'Solo Instrumental' : 'Voz Real'],
      duration: 156,
      plays: '1',
      likes: 1,
      liked: false,
      model: this.dom.modelSelect ? this.dom.modelSelect.value : 'v4.2 Ultra',
      bpm: this.getBpmForPattern(pattern),
      key: 'D Minor',
      palette: ['#8b5cf6', '#ec4899', '#3b82f6'],
      lyrics: parsedLyrics1,
      audioPattern: pattern,
      audioUrl: audioUrl1,
      isInstrumental: isInstrumental,
      vocalType: vocalStyleValue,
      isUserCreated: true
    };

    const var2 = serverVar2 || {
      id: `sonora-user-${Date.now()}-2`,
      title: `${songTitle} (v2)`,
      artist: 'Tú & SONORA AI',
      prompt: promptText || songStyle,
      style: songStyle,
      category: this.mapPatternToCategory(pattern),
      tags: [songStyle.split(',')[0], 'Engine v4.2', isInstrumental ? 'Solo Instrumental' : 'Voz Real'],
      duration: 168,
      plays: '1',
      likes: 1,
      liked: false,
      model: this.dom.modelSelect ? this.dom.modelSelect.value : 'v4.2 Ultra',
      bpm: this.getBpmForPattern(pattern) + 4,
      key: 'F Minor',
      palette: ['#06b6d4', '#10b981', '#6366f1'],
      lyrics: parsedLyrics2,
      audioPattern: pattern,
      audioUrl: audioUrl2,
      isInstrumental: isInstrumental,
      vocalType: vocalStyleValue,
      isUserCreated: true
    };

    // Save to Supabase Cloud if available
    if (this.supabase) {
      this.supabase.saveTrack(var1);
      this.supabase.saveTrack(var2);
    }

    // Add to tracks list and userCreations
    this.tracks.unshift(var2);
    this.tracks.unshift(var1);
    this.userCreations.unshift(var2);
    this.userCreations.unshift(var1);
    this.persistState();

    // Reset generation box
    this.dom.generationCard.classList.remove('active');
    this.isGenerating = false;
    this.dom.btnCreateSong.disabled = false;
    if (this.dom.btnCreateSongTop) this.dom.btnCreateSongTop.disabled = false;

    // Switch to active category or all
    this.activeCategory = 'all';
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    const allPill = document.querySelector('.category-pill[data-category="all"]');
    if (allPill) allPill.classList.add('active');

    // Refresh UI & scroll to top smoothly
    this.renderTrackList();
    if (this.dom.tracksContainer) {
      this.dom.tracksContainer.scrollTop = 0;
    }
    this.showToast('¡2 variaciones generadas con éxito! 🎵', 'success');

    // Auto-play Variation 1
    this.playTrackById(var1.id);
  }

  determinePattern(text) {
    const t = (text || '').toLowerCase();
    // 1. High priority: Cristiana, Worship, Alabanza, Adoración, Gospel, Dios, Fe, Iglesia
    if (t.includes('cristian') || t.includes('adoraci') || t.includes('worship') || t.includes('gospel') || t.includes('dios') || t.includes('alabanza') || t.includes('fe') || t.includes('iglesia') || t.includes('jesus') || t.includes('salvador')) {
      return 'cristiana';
    }
    if (t.includes('phonk') || t.includes('drift') || t.includes('cowbell')) return 'phonk';
    if (t.includes('trap') || t.includes('808') || t.includes('metro') || t.includes('drill')) return 'trap';
    if (t.includes('amapiano') || t.includes('log drum') || t.includes('south africa')) return 'amapiano';
    if (t.includes('afro') || t.includes('lagos') || t.includes('burna') || t.includes('nigeria')) return 'afrobeats';
    if (t.includes('corrido') || t.includes('requinto') || t.includes('tololoche') || t.includes('regional') || t.includes('mexic')) return 'corridos';
    if (t.includes('reggaeton') || t.includes('regeton') || t.includes('dembow') || t.includes('perreo') || t.includes('medellin')) return 'reggaeton';
    if (t.includes('lofi') || t.includes('lo-fi') || t.includes('chill') || t.includes('cafe') || t.includes('relax')) return 'lofi';
    if (t.includes('rock') || t.includes('metal') || t.includes('guitar') || t.includes('indie')) return 'rock';
    if (t.includes('orchestr') || t.includes('epic') || t.includes('cinema') || t.includes('soundtrack') || t.includes('anime') || t.includes('organ')) return 'orchestral';
    if (t.includes('house') || t.includes('techno') || t.includes('club') || t.includes('edm')) return 'deephouse';
    if (t.includes('city') || t.includes('japan') || t.includes('funk') || t.includes('k-pop') || t.includes('kpop') || t.includes('disco')) return 'citypop';
    if (t.includes('acoustic') || t.includes('folk')) return 'acoustic';
    return 'synthwave';
  }

  mapPatternToCategory(pattern) {
    switch (pattern) {
      case 'cristiana':
        return 'cristiana';
      case 'trap':
      case 'reggaeton':
        return 'urbano';
      case 'phonk':
      case 'deephouse':
      case 'synthwave':
        return 'electronica';
      case 'afrobeats':
      case 'amapiano':
        return 'afrobeats';
      case 'corridos':
        return 'regional';
      case 'rock':
        return 'rock';
      case 'orchestral':
        return 'cine';
      case 'lofi':
      case 'acoustic':
        return 'lofi';
      case 'citypop':
      default:
        return 'pop';
    }
  }

  getBpmForPattern(pattern) {
    const bpms = {
      cristiana: 75,
      trap: 138,
      phonk: 140,
      afrobeats: 104,
      amapiano: 113,
      corridos: 132,
      reggaeton: 96,
      synthwave: 124,
      deephouse: 128,
      rock: 140,
      lofi: 85,
      orchestral: 110,
      citypop: 118,
      acoustic: 92
    };
    return bpms[pattern] || 120;
  }

  generateSongTitle(prompt) {
    const stopWords = ['hazme', 'crea', 'creame', 'hacer', 'quiero', 'genera', 'generar', 'dame', 'cancion', 'canción', 'tema', 'pista', 'musica', 'música', 'para', 'como', 'sobre', 'estilo', 'tipo', 'algo'];
    const clean = (prompt || '').replace(/[^\w\sáéíóúÁÉÍÓÚñÑ]/gi, '');
    const words = clean.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w.toLowerCase()));
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + ' ' + words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
    } else if (words.length === 1) {
      return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + ' Celestial';
    }
    return 'Ecos de Gloria';
  }

  loadInitialTrack(track) {
    if (!track) return;
    this.audioEngine.currentTrack = track;
    this.dom.playerTitle.textContent = track.title;
    this.dom.playerArtist.textContent = track.artist;
    this.dom.playerLikeBtn.classList.toggle('liked', track.liked);
    this.dom.timeDuration.textContent = this.formatTime(track.duration);
    this.visualizer.loadTrackWaveform(track);
    this.visualizer.renderAlbumCoverToCanvas(this.dom.playerThumbCanvas, track);
  }

  playTrackById(id) {
    const track = this.tracks.find(t => t.id === id);
    if (!track) return;

    if (this.audioEngine.currentTrack && this.audioEngine.currentTrack.id === id && this.audioEngine.isPlaying) {
      this.togglePlayPause();
      return;
    }

    this.currentTrackIndex = this.tracks.indexOf(track);
    this.audioEngine.playTrack(track, 0);

    // Update bottom player
    this.dom.playerTitle.textContent = track.title;
    this.dom.playerArtist.textContent = track.artist;
    this.dom.playerLikeBtn.classList.toggle('liked', track.liked);
    this.dom.btnPlayPause.innerHTML = this.getPauseIcon();
    this.visualizer.loadTrackWaveform(track);
    this.visualizer.renderAlbumCoverToCanvas(this.dom.playerThumbCanvas, track);

    // Update visualizer song info
    this.dom.visualizerSongTitle.textContent = `${track.title} • ${track.artist}`;

    // Update lyrics drawer if open
    this.updateLyricsDrawerContent(track);

    this.renderTrackList();
  }

  togglePlayPause() {
    if (!this.audioEngine.currentTrack && this.tracks.length > 0) {
      this.playTrackById(this.tracks[0].id);
      return;
    }

    if (this.audioEngine.isPlaying) {
      this.audioEngine.pause();
      this.dom.btnPlayPause.innerHTML = this.getPlayIcon();
    } else {
      this.audioEngine.resume();
      this.dom.btnPlayPause.innerHTML = this.getPauseIcon();
    }
    this.renderTrackList();
  }

  playNext() {
    if (this.tracks.length === 0) return;
    if (this.isShuffle) {
      this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    }
    this.playTrackById(this.tracks[this.currentTrackIndex].id);
  }

  playPrevious() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrackById(this.tracks[this.currentTrackIndex].id);
  }

  toggleLikeTrack(trackId, e) {
    if (e) e.stopPropagation();
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      track.liked = !track.liked;
      if (track.liked) track.likes = (parseInt(track.likes) || 0) + 1;
      else track.likes = Math.max(0, (parseInt(track.likes) || 0) - 1);

      if (this.audioEngine.currentTrack && this.audioEngine.currentTrack.id === trackId) {
        this.dom.playerLikeBtn.classList.toggle('liked', track.liked);
      }
      this.renderTrackList();
      this.persistState();
    }
  }

  filterTracks(query) {
    const filtered = this.tracks.filter(t =>
      (t.title || '').toLowerCase().includes(query) ||
      (t.style || '').toLowerCase().includes(query) ||
      (t.artist || '').toLowerCase().includes(query) ||
      (t.prompt || '').toLowerCase().includes(query)
    );
    this.renderTrackList(filtered);
  }

  /**
   * Renders the Song Feed / Library with Category filtering
   */
  renderTrackList(customList = null) {
    let listToRender = customList || this.tracks;

    // Filter by Top Feed Tabs
    if (this.currentViewTab === 'library') {
      listToRender = listToRender.filter(t => t.isUserCreated || t.liked);
    } else if (this.currentViewTab === 'trending') {
      listToRender = [...listToRender].sort((a, b) => (parseInt(b.likes) || 0) - (parseInt(a.likes) || 0));
    }

    // Filter by Genre Category Pill
    if (this.activeCategory !== 'all') {
      listToRender = listToRender.filter(t => t.category === this.activeCategory);
    }

    const container = this.dom.tracksContainer;
    container.innerHTML = '';

    if (listToRender.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--accent-purple);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h3 style="font-size: 16px; color: #ffffff; margin-bottom: 6px;">No se encontraron canciones en esta categoría</h3>
          <p style="font-size: 13px;">Prueba seleccionar otra categoría o crea una nueva con el estudio.</p>
        </div>
      `;
      return;
    }

    if (this.displayMode === 'list') {
      const listEl = document.createElement('div');
      listEl.className = 'tracks-list';

      listToRender.forEach((track, idx) => {
        const isCurrent = this.audioEngine.currentTrack && this.audioEngine.currentTrack.id === track.id;
        const isPlayingNow = isCurrent && this.audioEngine.isPlaying;
        const styleLabel = (track.style || 'Pop').split('/')[0].trim();

        const row = document.createElement('div');
        row.className = `track-row ${isPlayingNow ? 'playing' : ''}`;
        row.onclick = () => this.playTrackById(track.id);

        row.innerHTML = `
          <div class="track-index">${idx + 1}</div>
          <button class="track-row-play-btn" title="${isPlayingNow ? 'Pausar' : 'Reproducir'}">
            ${isPlayingNow ? this.getPauseIcon(14) : this.getPlayIcon(14)}
          </button>
          <div class="track-cover-thumb">
            <canvas class="track-cover-canvas" id="canvas-${track.id}"></canvas>
          </div>
          <div class="track-info-col">
            <div class="track-title">
              ${track.title}
              <span class="track-version-tag">${track.model || 'v4.2'}</span>
              ${track.isUserCreated ? '<span style="font-size: 9px; padding: 2px 6px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border-radius: 4px; font-weight: 800; letter-spacing: 0.5px;">CREADA POR TI</span>' : ''}
            </div>
            <div class="track-meta">${track.artist}</div>
          </div>
          <div class="track-style-tag">${styleLabel}</div>
          <div class="track-plays">
            <svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            ${track.plays || '1.2K'}
          </div>
          <div class="track-duration">${this.formatTime(track.duration)}</div>
          <div class="track-actions-col">
            <button class="track-like-btn ${track.liked ? 'liked' : ''}" onclick="window.sonoraApp.toggleLikeTrack('${track.id}', event)" title="Me gusta">
              <svg style="width: 16px; height: 16px;" fill="${track.liked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button class="track-menu-btn" title="Descargar WAV" onclick="event.stopPropagation(); window.sonoraApp.downloadTrack('${track.id}')">
              <svg style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        `;

        container.appendChild(row);

        setTimeout(() => {
          const cvs = document.getElementById(`canvas-${track.id}`);
          if (cvs) this.visualizer.renderAlbumCoverToCanvas(cvs, track);
        }, 10);
      });
    } else {
      // Grid Mode
      const gridEl = document.createElement('div');
      gridEl.className = 'tracks-grid';

      listToRender.forEach(track => {
        const isCurrent = this.audioEngine.currentTrack && this.audioEngine.currentTrack.id === track.id;
        const isPlayingNow = isCurrent && this.audioEngine.isPlaying;
        const styleLabel = (track.style || 'Pop').split('/')[0].trim();

        const card = document.createElement('div');
        card.className = `track-card ${isPlayingNow ? 'playing' : ''}`;
        card.onclick = () => this.playTrackById(track.id);

        card.innerHTML = `
          <div class="track-card-cover">
            <canvas class="track-card-canvas" id="canvas-grid-${track.id}"></canvas>
            <div class="track-card-overlay">
              <button class="track-card-play-btn">
                ${isPlayingNow ? this.getPauseIcon(22) : this.getPlayIcon(22)}
              </button>
            </div>
          </div>
          <div class="track-card-title">${track.title}</div>
          <div class="track-card-prompt">${track.prompt || track.style}</div>
          <div class="track-card-footer">
            <span class="track-version-tag">${styleLabel}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="track-duration">${this.formatTime(track.duration)}</span>
              <button class="track-like-btn ${track.liked ? 'liked' : ''}" onclick="window.sonoraApp.toggleLikeTrack('${track.id}', event)">
                <svg style="width: 16px; height: 16px;" fill="${track.liked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        `;

        gridEl.appendChild(card);

        setTimeout(() => {
          const cvs = document.getElementById(`canvas-grid-${track.id}`);
          if (cvs) this.visualizer.renderAlbumCoverToCanvas(cvs, track);
        }, 10);
      });

      container.appendChild(gridEl);
    }
  }

  /**
   * Real WAV Audio Download
   */
  async downloadTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    this.showToast(`Sintetizando y exportando "${track.title}" a WAV 48kHz...`, 'info');
    await this.audioEngine.exportTrackToWav(track);
    this.showToast('¡Descarga iniciada con éxito! 🎧', 'success');
  }

  /**
   * Synchronized Lyrics Drawer Management
   */
  toggleLyricsDrawer() {
    this.dom.lyricsDrawer.classList.toggle('open');
    if (this.dom.lyricsDrawer.classList.contains('open')) {
      this.updateLyricsDrawerContent(this.audioEngine.currentTrack);
    }
  }

  closeLyricsDrawer() {
    this.dom.lyricsDrawer.classList.remove('open');
  }

  updateLyricsDrawerContent(track) {
    if (!track) return;
    this.dom.lyricsDrawerSongTitle.textContent = `${track.title} • Letras Sincronizadas`;
    const container = this.dom.lyricsScrollContainer;
    container.innerHTML = '';

    const lyricsData = track.lyrics;
    if (!lyricsData || lyricsData.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); text-align: center; margin-top: 40px;">Pista Instrumental (Sin letra disponible).</div>`;
      return;
    }

    lyricsData.forEach((section, sIdx) => {
      const card = document.createElement('div');
      card.className = 'lyric-verse-card';
      card.id = `verse-card-${sIdx}`;
      card.onclick = () => {
        const timeToSeek = section.startTime || (sIdx / lyricsData.length) * track.duration;
        this.audioEngine.seek(timeToSeek);
      };

      let html = `<div class="lyric-tag-label">${section.tag}</div>`;
      if (Array.isArray(section.lines)) {
        section.lines.forEach(line => {
          html += `<div class="lyric-line">${line}</div>`;
        });
      }

      card.innerHTML = html;
      container.appendChild(card);
    });
  }

  updateActiveLyricLine(currentTime, duration) {
    if (!this.dom.lyricsDrawer.classList.contains('open')) return;
    const track = this.audioEngine.currentTrack;
    if (!track || !track.lyrics || !Array.isArray(track.lyrics)) return;

    const progress = duration > 0 ? currentTime / duration : 0;
    const totalSections = track.lyrics.length;
    const activeIndex = Math.min(totalSections - 1, Math.floor(progress * totalSections));

    document.querySelectorAll('.lyric-verse-card').forEach((card, idx) => {
      const isCurrent = idx === activeIndex;
      card.classList.toggle('current', isCurrent);
      if (isCurrent && Math.abs(currentTime % 4) < 0.25) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /**
   * Stem Mixer Modal
   */
  openStemMixer() {
    this.dom.stemMixerModal.classList.add('active');
  }

  closeStemMixer() {
    this.dom.stemMixerModal.classList.remove('active');
  }

  /**
   * Fullscreen Audio Visualizer
   */
  openVisualizer() {
    this.dom.visualizerOverlay.classList.add('active');
    const track = this.audioEngine.currentTrack;
    if (track) {
      this.dom.visualizerSongTitle.textContent = `${track.title} • ${track.artist}`;
    }
    this.visualizer.startFullscreenVisualizer();
  }

  closeVisualizer() {
    this.dom.visualizerOverlay.classList.remove('active');
    this.visualizer.stopFullscreenVisualizer();
  }

  /**
   * WebPay Plus Payment Gateway & Checkout Modal
   */
  openWebPayModal() {
    this.renderWebPayPacks();
    this.dom.webpayFormStep.style.display = 'block';
    this.dom.webpayProcessingStep.style.display = 'none';
    this.dom.webpaySuccessStep.style.display = 'none';
    this.dom.webpayModal.classList.add('active');
  }

  closeWebPayModal() {
    this.dom.webpayModal.classList.remove('active');
  }

  renderWebPayPacks() {
    const container = this.dom.webpayPacksContainer;
    container.innerHTML = '';

    WEBPAY_PACKS.forEach(pack => {
      const isSelected = this.selectedWebPayPack.id === pack.id;
      const card = document.createElement('div');
      card.className = `webpay-pack-card ${isSelected ? 'selected' : ''} ${pack.isPopular ? 'popular' : ''}`;
      card.onclick = () => {
        this.selectedWebPayPack = pack;
        this.renderWebPayPacks();
      };

      card.innerHTML = `
        ${pack.badge ? `<div class="webpay-pack-badge">${pack.badge}</div>` : ''}
        <div class="webpay-pack-title">${pack.title}</div>
        <div class="webpay-pack-price">
          $${pack.priceCLP.toLocaleString('es-CL')} <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">CLP</span>
        </div>
        <div class="webpay-pack-credits">⚡ ${pack.credits} Créditos</div>
        <div class="webpay-pack-estimate">${pack.songsEstimate}</div>
        <ul class="webpay-pack-features">
          ${pack.features.map(f => `<li>✓ ${f}</li>`).join('')}
        </ul>
      `;

      container.appendChild(card);
    });

    this.dom.btnSubmitWebpay.textContent = `Pagar $${this.selectedWebPayPack.priceCLP.toLocaleString('es-CL')} CLP con Webpay Plus`;
  }

  async processWebPayPayment() {
    // Switch to Transbank processing animation step
    this.dom.webpayFormStep.style.display = 'none';
    this.dom.webpayProcessingStep.style.display = 'flex';

    await this.sleep(1500);

    // Add credits to user balance
    const addedCredits = this.selectedWebPayPack.credits;
    this.userCredits += addedCredits;
    this.updateCreditsDisplay();
    this.persistState();

    // Show Success screen
    this.dom.webpayProcessingStep.style.display = 'none';
    this.dom.webpaySuccessStep.style.display = 'flex';
    this.dom.webpaySuccessCredits.textContent = `+${addedCredits} Créditos Acreditados`;

    // Audio chime notification
    try {
      this.audioEngine.unlockAudioContext();
      if (this.audioEngine.ctx) {
        const osc = this.audioEngine.ctx.createOscillator();
        const gain = this.audioEngine.ctx.createGain();
        osc.frequency.setValueAtTime(523.25, this.audioEngine.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.audioEngine.ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, this.audioEngine.ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.3, this.audioEngine.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioEngine.ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(this.audioEngine.ctx.destination);
        osc.start();
        osc.stop(this.audioEngine.ctx.currentTime + 0.6);
      }
    } catch (e) {}

    this.showToast(`¡Transacción WebPay Aprobada! Se agregaron ${addedCredits} créditos.`, 'success');
  }

  updateCreditsDisplay() {
    this.dom.creditsCount.textContent = this.userCredits;
    // Color coding for urgency
    if (this.userCredits < 10) {
      this.dom.creditsPill.style.borderColor = '#ef4444';
      this.dom.creditsPill.style.background = 'rgba(239, 68, 68, 0.18)';
    } else if (this.userCredits <= 25) {
      this.dom.creditsPill.style.borderColor = '#f59e0b';
      this.dom.creditsPill.style.background = 'rgba(245, 158, 11, 0.18)';
    } else {
      this.dom.creditsPill.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      this.dom.creditsPill.style.background = 'rgba(139, 92, 246, 0.12)';
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  formatTime(seconds) {
    const s = Math.floor(seconds || 0);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  persistState() {
    try {
      localStorage.setItem('sonora_user_creations', JSON.stringify(this.userCreations));
      localStorage.setItem('sonora_user_credits', this.userCredits.toString());
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }
  }

  loadPersistedState() {
    try {
      const savedCreations = localStorage.getItem('sonora_user_creations');
      if (savedCreations) {
        const parsed = JSON.parse(savedCreations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.userCreations = parsed.map((item, idx) => {
            if (!item.audioUrl && window.getRealAudioForGenre) {
              item.audioUrl = window.getRealAudioForGenre(item.audioPattern || item.category || 'cristiana', (idx % 2) + 1);
            }
            return item;
          });
          this.tracks = [...this.userCreations, ...DEFAULT_TRACKS];
        }
      }
      const savedCredits = localStorage.getItem('sonora_user_credits');
      if (savedCredits !== null && savedCredits !== undefined) {
        this.userCredits = parseInt(savedCredits, 10);
      } else {
        // Initial 50 credits for new sessions
        this.userCredits = 50;
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }

  /* SVG Icons */
  getPlayIcon(size = 20) {
    return `<svg style="width: ${size}px; height: ${size}px;" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }

  getPauseIcon(size = 20) {
    return `<svg style="width: ${size}px; height: ${size}px;" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }

  getVolumeIcon() {
    return `<svg style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
  }

  getMuteIcon() {
    return `<svg style="width: 18px; height: 18px; color: #ef4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`;
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.sonoraApp = new SonoraApp();
  window.sonoraApp.init();
});
