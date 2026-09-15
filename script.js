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