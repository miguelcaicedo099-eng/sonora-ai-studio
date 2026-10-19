/**
 * SONORA AI - Stem Splitter & Multi-Track Studio Mixer
 * Allows real-time live manipulation of isolated audio stems: Vocals, Drums, Bass, Instruments
 */

class SonoraStemMixer {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Initializes the Stem Mixer UI bindings
   */
  init(modalElement) {
    if (!modalElement) return;

    const channels = ['vocals', 'drums', 'bass', 'instruments'];

    channels.forEach(ch => {
      const slider = modalElement.querySelector(`#stem-slider-${ch}`);
      const muteBtn = modalElement.querySelector(`#stem-mute-${ch}`);
      const soloBtn = modalElement.querySelector(`#stem-solo-${ch}`);
      const valLabel = modalElement.querySelector(`#stem-val-${ch}`);

      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          this.audioEngine.setStemVolume(ch, val);
          if (valLabel) valLabel.textContent = `${Math.round(val * 100)}%`;
        });
      }

      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          const isMuted = this.audioEngine.toggleStemMute(ch);
          muteBtn.classList.toggle('active-mute', isMuted);
        });
      }

      if (soloBtn) {
        soloBtn.addEventListener('click', () => {
          const isSolo = this.audioEngine.toggleStemSolo(ch);
          soloBtn.classList.toggle('active-solo', isSolo);
        });
      }
    });

    const resetBtn = modalElement.querySelector('#btn-reset-mix');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAllStems(modalElement));
    }
  }

  /**
   * Resets all sliders, mute, and solo states to default 100%
   */
  resetAllStems(modalElement) {
    const channels = ['vocals', 'drums', 'bass', 'instruments'];
    channels.forEach(ch => {
      this.audioEngine.setStemVolume(ch, 1.0);
      if (this.audioEngine.stems[ch].isMuted) this.audioEngine.toggleStemMute(ch);
      if (this.audioEngine.stems[ch].isSolo) this.audioEngine.toggleStemSolo(ch);

      const slider = modalElement.querySelector(`#stem-slider-${ch}`);
      const muteBtn = modalElement.querySelector(`#stem-mute-${ch}`);
      const soloBtn = modalElement.querySelector(`#stem-solo-${ch}`);
      const valLabel = modalElement.querySelector(`#stem-val-${ch}`);

      if (slider) slider.value = 1.0;
      if (valLabel) valLabel.textContent = '100%';
      if (muteBtn) muteBtn.classList.remove('active-mute');
      if (soloBtn) soloBtn.classList.remove('active-solo');
    });
  }
}
