document.addEventListener('DOMContentLoaded', () => {
  const activeAudio = new Set();
  const buttons = document.querySelectorAll('button');
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');
  
  // Update volume display and all active audio elements
  volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;
    
    // Update volume for all playing audio
    activeAudio.forEach(audio => {
      audio.volume = volume;
    });
  });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound');
      
      // Check if this specific audio is already playing
      const existingAudio = Array.from(activeAudio).find(audio => audio.src.endsWith(soundFile.split('/').pop()));
      
      if (existingAudio) {
        existingAudio.pause();
        existingAudio.currentTime = 0;
        activeAudio.delete(existingAudio);
        button.classList.remove('active');
        return;
      }
      
      const newAudio = new Audio(soundFile);
      newAudio.volume = volumeSlider.value;
      newAudio.play();
      
      activeAudio.add(newAudio);
      button.classList.add('active');
      
      newAudio.addEventListener('ended', () => {
        activeAudio.delete(newAudio);
        button.classList.remove('active');
      });
    });
  });
});
