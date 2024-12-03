document.addEventListener('DOMContentLoaded', () => {
  const playingSounds = new Set();
  const buttons = document.querySelectorAll('button');
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');
  
  // Comprehensive volume control
  function updateVolume() {
    const volume = volumeSlider.value;
    volumeValue.textContent = ${Math.round(volume * 100)}%;
    
    // Update volume for ALL currently playing sounds
    playingSounds.forEach(audioInfo => {
      audioInfo.audio.volume = volume;
    });
  }
  
  // Add volume change listener
  volumeSlider.addEventListener('input', updateVolume);

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound');
      
      // Check if this sound is already playing
      const existingSound = Array.from(playingSounds).find(
        info => info.audio.src.endsWith(soundFile.split('/').pop())
      );
      
      if (existingSound) {
        // If sound is playing, stop it
        existingSound.audio.pause();
        existingSound.audio.currentTime = 0;
        playingSounds.delete(existingSound);
        button.classList.remove('active');
        return;
      }
      
      // Create new audio element
      const newAudio = new Audio(soundFile);
      
      // Set initial volume from slider
      newAudio.volume = volumeSlider.value;
      
      // Play the sound
      newAudio.play();
      
      // Track the sound
      const audioInfo = { audio: newAudio, button: button };
      playingSounds.add(audioInfo);
      button.classList.add('active');
      
      // Handle sound ending
      newAudio.addEventListener('ended', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active');
      });
    });
  });
});
