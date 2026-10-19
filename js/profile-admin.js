/**
 * SONORA AI - User Profile & Administrator Master Panel
 * Comprehensive profile management for regular users and full admin controls for Miguel
 */

class SonoraProfileAdmin {
  constructor(app) {
    this.app = app;
    this.user = {
      name: "Miguel",
      email: "miguel@sonora.ai",
      role: "admin", // 'admin' | 'user'
      isAdmin: true,
      isVip: true,
      hasInfiniteTokens: true,
      avatar: "M",
      joinedDate: "Octubre 2026"
    };

    // Load persisted admin state
    this.loadState();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.syncAppState();
  }

  cacheElements() {
    this.dom = {
      profileBtn: document.querySelector('.user-profile-btn'),
      modal: document.getElementById('profile-admin-modal'),
      closeBtn: document.getElementById('profile-modal-close-btn'),

      // Profile details
      userNameDisplay: document.getElementById('profile-user-name'),
      userRoleBadge: document.getElementById('profile-role-badge'),
      tokensDisplay: document.getElementById('profile-tokens-count'),
      songsCountDisplay: document.getElementById('profile-songs-count'),
      favoritesCountDisplay: document.getElementById('profile-favs-count'),
      userSongsContainer: document.getElementById('profile-user-songs-list'),

      // Admin specific controls
      adminSection: document.getElementById('admin-master-section'),
      infiniteTokensToggle: document.getElementById('admin-infinite-tokens-toggle'),
      btnAdd1000Tokens: document.getElementById('btn-admin-add-tokens'),
      btnSwitchRole: document.getElementById('btn-admin-switch-role'),
      btnResetCatalog: document.getElementById('btn-admin-reset-catalog'),

      // Header Elements to reflect Admin/VIP status
      userBadgeHeader: document.querySelector('.user-badge'),
      userNameHeader: document.querySelector('.user-name')
    };
  }

  bindEvents() {
    if (this.dom.profileBtn) {
      this.dom.profileBtn.addEventListener('click', () => this.open());
    }
    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener('click', () => this.close());
    }

    // Infinite tokens toggle
    if (this.dom.infiniteTokensToggle) {
      this.dom.infiniteTokensToggle.checked = this.user.hasInfiniteTokens;
      this.dom.infiniteTokensToggle.addEventListener('change', (e) => {
        this.user.hasInfiniteTokens = e.target.checked;
        this.saveState();
        this.syncAppState();
        this.app.showToast(this.user.hasInfiniteTokens ? '👑 Modo Tokens Infinitos Activado' : 'Tokens estándar activados', 'info');
      });
    }

    // Add 1,000 Tokens button
    if (this.dom.btnAdd1000Tokens) {
      this.dom.btnAdd1000Tokens.addEventListener('click', () => {
        this.app.userCredits += 1000;
        this.app.updateCreditsDisplay();
        this.app.persistState();
        this.updateProfileStats();
        this.app.showToast('⚡ +1.000 Tokens agregados a tu cuenta de Administrador', 'success');
      });
    }

    // Switch Role between Admin and Normal User
    if (this.dom.btnSwitchRole) {
      this.dom.btnSwitchRole.addEventListener('click', () => {
        this.user.isAdmin = !this.user.isAdmin;
        this.user.role = this.user.isAdmin ? 'admin' : 'user';
        this.saveState();
        this.syncAppState();
        this.updateProfileStats();
        this.app.showToast(`Modo cambiado a: ${this.user.isAdmin ? '👑 ADMINISTRADOR' : '👤 USUARIO REGULAR'}`, 'info');
      });
    }

    // Reset Catalog
    if (this.dom.btnResetCatalog) {
      this.dom.btnResetCatalog.addEventListener('click', () => {
        this.app.tracks = [...this.app.userCreations, ...DEFAULT_TRACKS];
        this.app.renderTrackList();
        this.app.showToast('Catálogo de música mundial restablecido', 'info');
      });
    }
  }

  open() {
    this.updateProfileStats();
    this.dom.modal.classList.add('active');
  }

  close() {
    this.dom.modal.classList.remove('active');
  }

  updateProfileStats() {
    if (!this.dom.userNameDisplay) return;

    this.dom.userNameDisplay.textContent = this.user.name;
    this.dom.userRoleBadge.textContent = this.user.isAdmin ? '👑 ADMIN MASTER' : (this.user.isVip ? '⭐ VIP STUDIO' : 'ESTÁNDAR');
    this.dom.userRoleBadge.style.background = this.user.isAdmin
      ? 'linear-gradient(135deg, #ef4444, #f59e0b)'
      : 'linear-gradient(135deg, #8b5cf6, #06b6d4)';

    // Tokens
    if (this.user.hasInfiniteTokens && this.user.isAdmin) {
      this.dom.tokensDisplay.textContent = '∞ Ilimitados';
    } else {
      this.dom.tokensDisplay.textContent = `${this.app.userCredits} Tokens`;
    }

    // Counts
    const creations = this.app.userCreations || [];
    this.dom.songsCountDisplay.textContent = creations.length;

    const likedCount = (this.app.tracks || []).filter(t => t.liked).length;
    this.dom.favoritesCountDisplay.textContent = likedCount;

    // Show/Hide Admin Section
    if (this.dom.adminSection) {
      this.dom.adminSection.style.display = this.user.isAdmin ? 'block' : 'none';
    }

    // Render User's Songs List inside Profile
    this.renderUserSongs();
  }

  renderUserSongs() {
    const container = this.dom.userSongsContainer;
    if (!container) return;
    container.innerHTML = '';

    const creations = this.app.userCreations || [];

    if (creations.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
          Aún no has creado canciones en esta sesión. ¡Usa el Estudio de Creación para generar tu primer hit!
        </div>
      `;
      return;
    }

    creations.forEach(song => {
      const row = document.createElement('div');
      row.className = 'profile-song-item';
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
          <div style="width: 38px; height: 38px; border-radius: 6px; background: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 16px;">
            🎵
          </div>
          <div style="overflow: hidden;">
            <div style="font-size: 13.5px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${song.title}
            </div>
            <div style="font-size: 11.5px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${song.style} • ${this.app.formatTime(song.duration)}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="hero-play-btn" style="padding: 6px 12px; font-size: 11px;" onclick="window.sonoraApp.playTrackById('${song.id}'); window.sonoraProfileAdmin.close();">
            ▶ Reproducir
          </button>
          <button class="track-menu-btn" title="Descargar WAV" onclick="window.sonoraApp.downloadTrack('${song.id}')">
            📥
          </button>
        </div>
      `;
      container.appendChild(row);
    });
  }

  syncAppState() {
    this.app.isAdmin = this.user.isAdmin;
    this.app.isVipUser = this.user.isVip;

    if (this.dom.userBadgeHeader) {
      this.dom.userBadgeHeader.textContent = this.user.isAdmin ? 'ADMIN' : (this.user.isVip ? 'VIP' : 'PRO');
      this.dom.userBadgeHeader.style.background = this.user.isAdmin ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)';
    }

    if (this.user.isAdmin && this.user.hasInfiniteTokens) {
      this.app.hasInfiniteTokens = true;
      if (this.app.dom && this.app.dom.creditsCount) {
        this.app.dom.creditsCount.textContent = '∞';
      }
    } else {
      this.app.hasInfiniteTokens = false;
      if (this.app.dom && this.app.dom.creditsCount) {
        this.app.dom.creditsCount.textContent = this.app.userCredits;
      }
    }
  }

  saveState() {
    try {
      localStorage.setItem('sonora_admin_user', JSON.stringify(this.user));
    } catch (e) {}
  }

  loadState() {
    try {
      const saved = localStorage.getItem('sonora_admin_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.user = { ...this.user, ...parsed };
      }
    } catch (e) {}
  }
}

window.SonoraProfileAdmin = SonoraProfileAdmin;
