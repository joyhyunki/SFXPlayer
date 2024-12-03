document.addEventListener('DOMContentLoaded', () => {
  const playingSounds = new Set();
  const buttons = document.querySelectorAll('button');
  const volumeControl = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');
  
  // Update volume display and all playing sounds
  volumeControl.addEventListener('input', () => {
    const volume = volumeControl.value / 100;
    volumeValue.textContent = `${volumeControl.value}%`;
    
    // Update volume for all playing sounds
    playingSounds.forEach(info => {
      info.audio.volume = volume;
    });
  });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound');
      const existingSound = Array.from(playingSounds).find(
        info => info.audio.src.endsWith(soundFile.split('/').pop())
      );

      if (existingSound) {
        existingSound.audio.pause();
        existingSound.audio.currentTime = 0;
        playingSounds.delete(existingSound);
        button.classList.remove('active');
        return;
      }

      const newAudio = new Audio(soundFile);
      newAudio.volume = volumeControl.value / 100; // Set initial volume
      
      newAudio.play().catch(error => {
        console.error(`Error playing sound: ${error}`);
      });

      const audioInfo = { audio: newAudio, button };
      playingSounds.add(audioInfo);
      button.classList.add('active');

      newAudio.addEventListener('ended', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active');
      });

      newAudio.addEventListener('pause', () => {
        playingSounds.delete(audioInfo);
        button.classList.remove('active');
      });
    });
  });
});
