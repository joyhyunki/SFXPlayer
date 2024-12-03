document.addEventListener('DOMContentLoaded', () => {
  const playingSounds = new Set(); // Track currently playing sounds
  const buttons = document.querySelectorAll('button'); // All sound buttons
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');

  // Initialize volume value display
  volumeValue.textContent = `${volumeSlider.value}%`;

  // Volume change event listener
  volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value / 100;
    volumeValue.textContent = `${volumeSlider.value}%`;
    
    // Update volume for all playing sounds
    playingSounds.forEach(info => {
      info.audio.volume = volume;
    });
  });

  // Button click event listener for playing sounds
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound');
      const existingSound = Array.from(playingSounds).find(
        info => info.audio.src.endsWith(soundFile.split('/').pop())
      );

      if (existingSound) {
        // If the sound is already playing, stop it
        existingSound.audio.pause();
        existingSound.audio.currentTime = 0;
        playingSounds.delete(existingSound);
        button.classList.remove('active');
        return;
      }

      // Create a new audio element for the sound
      const newAudio = new Audio(soundFile);
      newAudio.volume = volumeSlider.value / 100; // Set initial volume

      // Play the sound
      newAudio.play().catch(error => {
        console.error(`Error playing sound: ${error}`);
      });

      // Add the new sound to the tracking set
      const audioInfo = { audio: newAudio, button };
      playingSounds.add(audioInfo);
      button.classList.add('active');

      // Handle when the sound ends
      newAudio.addEventListener('ended', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active');
      });

      // Handle manual stopping
      newAudio.addEventListener('pause', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active');
      });
    });
  });
});
