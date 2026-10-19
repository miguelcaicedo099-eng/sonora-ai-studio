/**
 * SONORA AI - Visualizer & Dynamic Waveform Engine
 * High-performance Canvas renderers for interactive waveforms, audio-reactive visualizers, and album art
 */

class SonoraVisualizer {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.waveformCanvas = null;
    this.waveformCtx = null;
    this.fullscreenCanvas = null;
    this.fullscreenCtx = null;
    this.mode = 'spectrum'; // 'spectrum' | 'waveform' | 'orbital'
    this.animationFrameId = null;

    // Waveform cache for current track
    this.currentTrackPeaks = [];
  }

  /**
   * Initializes bottom waveform player canvas
   */
  initWaveformCanvas(canvasElement) {
    this.waveformCanvas = canvasElement;
    this.waveformCtx = canvasElement.getContext('2d');
    this.resizeCanvas(this.waveformCanvas);
    window.addEventListener('resize', () => {
      if (this.waveformCanvas) {
        this.resizeCanvas(this.waveformCanvas);
        this.drawWaveform();
      }
    });
  }

  /**
   * Generates sound peaks for a track
   */
  loadTrackWaveform(track) {
    const barsCount = 120;
    this.currentTrackPeaks = [];
    const seed = track.id ? track.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 42;

    for (let i = 0; i < barsCount; i++) {
      // Create natural envelope (fade in, dynamic chorus sections, fade out)
      const progress = i / barsCount;
      const envelope = Math.sin(progress * Math.PI);
      const pseudoRandom = Math.abs(Math.sin(seed * (i + 1) * 0.13));
      const chorusBoost = (progress > 0.35 && progress < 0.65) ? 1.3 : 1.0;
      const height = Math.max(0.15, Math.min(1.0, (0.3 + pseudoRandom * 0.65) * envelope * chorusBoost));
      this.currentTrackPeaks.push(height);
    }

    this.drawWaveform();
  }

  /**
   * Draws the interactive player waveform
   */
  drawWaveform() {
    if (!this.waveformCanvas || !this.waveformCtx) return;
    const ctx = this.waveformCtx;
    const width = this.waveformCanvas.width;
    const height = this.waveformCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const peaks = this.currentTrackPeaks;
    if (!peaks || peaks.length === 0) return;

    const currentTrack = this.audioEngine.currentTrack;
    const progress = currentTrack && currentTrack.duration > 0
      ? this.audioEngine.currentTime / currentTrack.duration
      : 0;

    const barWidth = width / peaks.length;
    const gap = 1.5;
    const effectiveBarWidth = Math.max(1, barWidth - gap);

    // Get live frequency data if playing for active wobble
    let freqData = null;
    if (this.audioEngine.isPlaying && this.audioEngine.analyser) {
      freqData = new Uint8Array(this.audioEngine.analyser.frequencyBinCount);
      this.audioEngine.analyser.getByteFrequencyData(freqData);
    }

    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth;
      let peakHeight = peaks[i];

      // Add subtle real-time wobble to currently playing bar
      const isCurrentSection = Math.abs((i / peaks.length) - progress) < 0.05;
      if (isCurrentSection && freqData) {
        const freqIndex = Math.floor((i / peaks.length) * (freqData.length / 4));
        peakHeight = Math.min(1.0, peakHeight * (1 + (freqData[freqIndex] / 255) * 0.4));
      }

      const barH = peakHeight * (height * 0.85);
      const y = (height - barH) / 2;
      const isPlayed = (i / peaks.length) <= progress;

      if (isPlayed) {
        // Glowing brand gradient for played section
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#8b5cf6');
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      }

      // Draw rounded bar
      ctx.beginPath();
      const radius = 2;
      ctx.roundRect(x, y, effectiveBarWidth, barH, radius);
      ctx.fill();
    }
  }

  /**
   * Initializes fullscreen visualizer canvas
   */
  initFullscreenVisualizer(canvasElement) {
    this.fullscreenCanvas = canvasElement;
    this.fullscreenCtx = canvasElement.getContext('2d');
    this.resizeCanvas(this.fullscreenCanvas);

    window.addEventListener('resize', () => {
      if (this.fullscreenCanvas) this.resizeCanvas(this.fullscreenCanvas);
    });
  }

  startFullscreenVisualizer() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const render = () => {
      this.renderFullscreenFrame();
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  stopFullscreenVisualizer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  renderFullscreenFrame() {
    if (!this.fullscreenCanvas || !this.fullscreenCtx) return;
    const ctx = this.fullscreenCtx;
    const width = this.fullscreenCanvas.width;
    const height = this.fullscreenCanvas.height;

    // Dark background fade trail
    ctx.fillStyle = 'rgba(7, 7, 11, 0.25)';
    ctx.fillRect(0, 0, width, height);

    if (!this.audioEngine.analyser) return;

    if (this.mode === 'spectrum') {
      this.renderSpectrumMode(ctx, width, height);
    } else if (this.mode === 'waveform') {
      this.renderWaveformMode(ctx, width, height);
    } else {
      this.renderOrbitalMode(ctx, width, height);
    }
  }

  /**
   * Mode 1: 64-Band Equalizer Frequency Spectrum
   */
  renderSpectrumMode(ctx, width, height) {
    const bufferLength = this.audioEngine.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.audioEngine.analyser.getByteFrequencyData(dataArray);

    const bars = 64;
    const barWidth = (width / bars);
    const gap = 3;

    for (let i = 0; i < bars; i++) {
      const dataIndex = Math.floor(Math.pow(i / bars, 1.4) * (bufferLength / 2));
      const val = dataArray[dataIndex] || 0;
      const percent = val / 255;
      const barHeight = percent * (height * 0.7);
      const x = i * barWidth;
      const y = height - barHeight - 40;

      const grad = ctx.createLinearGradient(0, y, 0, height);
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(0.5, '#8b5cf6');
      grad.addColorStop(1, '#06b6d4');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - gap, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Top peak dot
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y - 4, barWidth - gap, 2);
    }
  }

  /**
   * Mode 2: Oscilloscope Waveform Line
   */
  renderWaveformMode(ctx, width, height) {
    const bufferLength = this.audioEngine.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    this.audioEngine.analyser.getByteTimeDomainData(dataArray);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00f2fe';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#8b5cf6';

    ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /**
   * Mode 3: Cosmic Orbital Pulse
   */
  renderOrbitalMode(ctx, width, height) {
    const bufferLength = this.audioEngine.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.audioEngine.analyser.getByteFrequencyData(dataArray);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.22;

    // Sub-bass intensity for center pulse
    const subBass = (dataArray[2] + dataArray[3] + dataArray[4]) / (3 * 255);
    const pulsingRadius = baseRadius + (subBass * 35);

    // Glowing Core
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, pulsingRadius);
    coreGrad.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
    coreGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.4)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulsingRadius, 0, Math.PI * 2);
    ctx.fill();

    // Orbital Frequency Spikes
    const points = 72;
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8';

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const freqIndex = Math.floor((i / points) * (bufferLength / 3));
      const magnitude = (dataArray[freqIndex] / 255) * 80;
      const r = pulsingRadius + magnitude;

      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  resizeCanvas(canvas) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  /**
   * Generates a unique, high-resolution album cover for a track
   */
  renderAlbumCoverToCanvas(canvas, track) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 300;
    const h = canvas.height = 300;

    const palette = track.palette || ['#8b5cf6', '#ec4899', '#06b6d4'];
    const seed = track.id ? track.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 100;

    // Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, palette[0]);
    bgGrad.addColorStop(0.5, palette[1] || '#1e1b4b');
    bgGrad.addColorStop(1, palette[2] || '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Cyber Mesh / Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Abstract Geometric Shapes based on seed
    ctx.save();
    ctx.translate(w / 2, h / 2);
    const rot = (seed % 360) * (Math.PI / 180);
    ctx.rotate(rot);

    // Concentric glowing sound circles
    for (let r = 20; r <= 90; r += 22) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - (r / 200)})`;
      ctx.lineWidth = 2;
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Central Emblem Icon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(30, 20);
    ctx.lineTo(-30, 20);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Glassy Vignette Overlay
    const vignette = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, 160);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(7, 7, 11, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Track Title Badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, h - 56, w, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(track.title || 'SONORA TRACK', 16, h - 32);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillText(track.style || 'AI Generated Music', 16, h - 14);

    // Sonora Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('SONORA v4.2', w - 16, h - 14);
  }
}
