/**
 * SONORA AI - VIP Studio Chat Engine
 * Exclusive personalized music production assistant for SONORA STUDIO VIP members
 */

class SonoraVipChat {
  constructor(app) {
    this.app = app;
    this.currentProducer = 'alex'; // 'alex' | 'elena' | 'shadow'
    this.messages = [];

    this.producers = {
      alex: {
        name: "Alex Rivera",
        role: "Ingeniero de Mezcla & Mastering Dolby 48kHz",
        avatar: "🎚️",
        welcome: "¡Hola! Soy Alex Rivera, ingeniero jefe de mezcla en SONORA Studio. ¿En qué puedo ayudarte hoy? Podemos afinar el balance de tus stems, limpiar frecuencias de tu bajo 808, o preparar tu pista para distribución profesional a -14 LUFS."
      },
      elena: {
        name: "Elena Vance",
        role: "Compositora Armónica & Diseñadora Vocal",
        avatar: "🎹",
        welcome: "¡Bienvenido al salón de producción VIP! Soy Elena Vance. Si necesitas ayuda con progresiones de acordes emotivas, armonización de voces, métrica de estrofas o arreglos para tu próximo tema, estoy lista."
      },
      shadow: {
        name: "DJ Shadow",
        role: "Beatmaker & Productor Urbano Global",
        avatar: "🎤",
        welcome: "¡Qué pasa creador! DJ Shadow aquí. Si quieres que tu dembow rompa las bocinas, que tus hi-hats de trap tengan el swing perfecto o encontrar ese hook viral para TikTok, cuéntame qué estás cocinando."
      }
    };
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.resetConversation();
  }

  cacheElements() {
    this.dom = {
      modal: document.getElementById('vip-chat-modal'),
      closeBtn: document.getElementById('vip-chat-close-btn'),
      producerPills: document.querySelectorAll('.vip-producer-pill'),
      messagesContainer: document.getElementById('vip-chat-messages'),
      input: document.getElementById('vip-chat-input'),
      sendBtn: document.getElementById('vip-chat-send-btn'),
      quickChips: document.querySelectorAll('.vip-quick-chip'),
      vipLockBanner: document.getElementById('vip-lock-banner'),
      vipChatContainer: document.getElementById('vip-chat-container'),
      btnUnlockVip: document.getElementById('btn-unlock-vip-webpay'),
      headerVipBtn: document.getElementById('btn-header-vip'),
      sidebarVipBtn: document.getElementById('btn-sidebar-vip')
    };
  }

  bindEvents() {
    if (this.dom.headerVipBtn) {
      this.dom.headerVipBtn.addEventListener('click', () => this.open());
    }
    if (this.dom.sidebarVipBtn) {
      this.dom.sidebarVipBtn.addEventListener('click', () => this.open());
    }
    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener('click', () => this.close());
    }

    // Switch Producer
    this.dom.producerPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.dom.producerPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentProducer = pill.getAttribute('data-producer');
        this.resetConversation();
      });
    });

    // Send Message
    this.dom.sendBtn.addEventListener('click', () => this.handleSendMessage());
    this.dom.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Quick Prompt Chips
    this.dom.quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt');
        this.dom.input.value = text;
        this.handleSendMessage();
      });
    });

    if (this.dom.btnUnlockVip) {
      this.dom.btnUnlockVip.addEventListener('click', () => {
        this.close();
        this.app.openWebPayModal();
      });
    }
  }

  open() {
    // Check if user has VIP status (Admin or SONORA STUDIO plan)
    const isVip = this.app.isAdmin || this.app.isVipUser;

    if (isVip) {
      this.dom.vipLockBanner.style.display = 'none';
      this.dom.vipChatContainer.style.display = 'flex';
    } else {
      this.dom.vipLockBanner.style.display = 'flex';
      this.dom.vipChatContainer.style.display = 'none';
    }

    this.dom.modal.classList.add('active');
  }

  close() {
    this.dom.modal.classList.remove('active');
  }

  resetConversation() {
    const prod = this.producers[this.currentProducer];
    this.messages = [
      {
        sender: 'ai',
        producer: prod.name,
        avatar: prod.avatar,
        text: prod.welcome,
        time: this.getCurrentTimeString()
      }
    ];
    this.renderMessages();
  }

  handleSendMessage() {
    const text = this.dom.input.value.trim();
    if (!text) return;

    // Add user message
    this.messages.push({
      sender: 'user',
      text: text,
      time: this.getCurrentTimeString()
    });

    this.dom.input.value = '';
    this.renderMessages();

    // Show typing indicator & generate smart response
    setTimeout(() => {
      const responseText = this.generateProducerResponse(text, this.currentProducer);
      const prod = this.producers[this.currentProducer];

      this.messages.push({
        sender: 'ai',
        producer: prod.name,
        avatar: prod.avatar,
        text: responseText,
        time: this.getCurrentTimeString()
      });

      this.renderMessages();
    }, 650);
  }

  generateProducerResponse(prompt, producerKey) {
    const p = prompt.toLowerCase();
    const currentSong = this.app.audioEngine.currentTrack ? this.app.audioEngine.currentTrack.title : "tu última canción";

    if (producerKey === 'alex') {
      // Audio Engineering & Mastering
      if (p.includes('808') || p.includes('bajo') || p.includes('sub')) {
        return `Excelente pregunta técnica. Para que el sub-808 tenga pegada limpia sin enturbiar la mezcla:\n1. Aplica un filtro High-Pass en 28 Hz con pendiente de 24dB/octava para eliminar frecuencias inaudibles que saturan el headroom.\n2. Haz un 'sidechain' suave con el bombo (kick) para que baje 2.5 dB durante 40ms cuando golpea el kick.\n3. Añade saturación armónica sutil (tubo o cinta) en los 120-250 Hz para que el bajo sea audible en teléfonos móviles.\n¿Te gustaría que apliquemos estos ajustes al stem del bajo en tu sesión?`;
      } else if (p.includes('master') || p.includes('lufs') || p.includes('volumen')) {
        return `Para plataformas de streaming como Spotify, Apple Music y YouTube, el estándar es:\n• -14 LUFS integrados con un True Peak máximo de -1.0 dBTP.\n• Si es música urbana o club, solemos empujar a -9 LUFS con un limitador transparente y recorte suave (soft-clipping) en los picos de batería.\nEn SONORA v4.2 Ultra procesamos a 48kHz / 24-bit con curva Fletcher-Munson optimizada.`;
      } else {
        return `He analizado tu consulta sobre producción profesional. En el motor SONORA Studio v4.2, te recomiendo usar el mezclador de stems para aislar la pista de armonía y aplicar un corte leve en 350 Hz; esto dejará espacio perfecto para que la voz principal brille con presencia natural sin sonar saturada.`;
      }
    } else if (producerKey === 'elena') {
      // Harmony & Songwriting
      if (p.includes('acorde') || p.includes('armon') || p.includes('progresion')) {
        return `¡Me encanta trabajar la armonía! Para un hit moderno con carga emotiva profunda te recomiendo:\n• **i - VI - III - VII** (ejemplo en Re menor: Dm - Bb - F - C). Es la fórmula mágica del pop global y el synthwave porque combina misterio y resolución triunfal.\n• Para un toque más melancólico: añade una novena a los acordes menores (Dm9) y una séptima mayor al subdominante (Bbmaj7). Genera ese sonido nostálgico característico de Billie Eilish y The Weeknd.`;
      } else if (p.includes('letra') || p.includes('verso') || p.includes('coro')) {
        return `El secreto de un coro inolvidable está en el contraste rítmico: si tus estrofas tienen versos largos y descriptivos, tu coro debe tener frases cortas de 3 a 5 palabras con repetición y rimas consonantes claras en los tiempos fuertes (1 y 3 del compás). Recuerda que puedes usar nuestro **Letrista IA** en el Modo Personalizado para estructurar [Chorus] y [Bridge] al instante.`;
      } else {
        return `En términos de composición para "${currentSong}", una técnica infalible es elevar la melodía vocal una octava o agregar una segunda voz en terceras mayores durante el segundo coro. Esto mantiene la atención del oyente y prepara el clímax hacia el drop final.`;
      }
    } else {
      // DJ Shadow - Urban & Beatmaking
      if (p.includes('dembow') || p.includes('reggaeton') || p.includes('flow')) {
        return `¡Eso es candela pura! Para que el dembow tenga ese sonido de Medellín o Santo Domingo:\n• Pon el tempo entre 94 y 98 BPM para perreo romántico, o súbelo a 115-120 BPM para dembow dominicano puro.\n• El snare debe tener un 'pitch' agudo y un pequeño toque de reverb corto (room) de 0.4s.\n• Deja silencios (mute cuts) de medio compás justo antes del coro. ¡Esa pausa hace que el golpe del bajo 808 se sienta diez veces más potente!`;
      } else if (p.includes('trap') || p.includes('drill') || p.includes('hi hat')) {
        return `En el trap actual, la clave son los hi-hat rolls con variaciones de velocidad (velocity) y afinación (pitch drop). No dejes los hi-hats al mismo volumen: haz que suban en crescendo justo antes de la caja (snare). En SONORA, nuestro patrón 'Trap 808' ya viene con esos triplets programados a 138 BPM.`;
      } else {
        return `Bro, esa idea tiene potencial de volverse viral. Métele un gancho (hook) pegadizo en los primeros 10 segundos para que en TikTok nadie pase de largo. Si quieres, dale a **Crear Canción Similar** en el reproductor y el motor te genera otra variación con el mismo flow pero con beats más agresivos.`;
      }
    }
  }

  renderMessages() {
    const container = this.dom.messagesContainer;
    container.innerHTML = '';

    this.messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `vip-msg-row ${msg.sender === 'user' ? 'user' : 'ai'}`;

      if (msg.sender === 'user') {
        row.innerHTML = `
          <div class="vip-msg-bubble user">
            <div class="vip-msg-text">${this.formatMessageText(msg.text)}</div>
            <div class="vip-msg-time">${msg.time} • Tú</div>
          </div>
        `;
      } else {
        row.innerHTML = `
          <div class="vip-msg-avatar">${msg.avatar}</div>
          <div class="vip-msg-bubble ai">
            <div class="vip-msg-author">${msg.producer}</div>
            <div class="vip-msg-text">${this.formatMessageText(msg.text)}</div>
            <div class="vip-msg-time">${msg.time} • SONORA VIP</div>
          </div>
        `;
      }

      container.appendChild(row);
    });

    container.scrollTop = container.scrollHeight;
  }

  formatMessageText(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  getCurrentTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}

window.SonoraVipChat = SonoraVipChat;
