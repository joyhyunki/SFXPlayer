document.addEventListener('DOMContentLoaded', () => {
  const playingSounds = new Set(); // Track currently playing sounds
  const buttons = document.querySelectorAll('button'); // All sound buttons

  // Button click event listener for playing sounds
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound'); // Get the sound file path
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

      // Play the sound
      newAudio.play().catch(error => {
        console.error(`Error playing sound: ${error}`);
      });

      // Add the new sound to the tracking set
      const audioInfo = { audio: newAudio, button };
      playingSounds.add(audioInfo);
      button.classList.add('active'); // Indicate active button

      // Handle when the sound ends
      newAudio.addEventListener('ended', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active'); // Reset button state
      });

      // Handle manual stopping (if the user pauses or resets)
      newAudio.addEventListener('pause', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active'); // Reset button state
      });
    });
  });
});
