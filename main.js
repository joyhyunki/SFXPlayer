document.addEventListener('DOMContentLoaded', () => {
  const activeAudio = new Map();
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
      
      if (activeAudio.has(button)) {
        const audio = activeAudio.get(button);
        audio.pause();
        audio.currentTime = 0;
        activeAudio.delete(button);
        return;
      }
      
      const newAudio = new Audio(soundFile);
      newAudio.volume = volumeSlider.value;
      newAudio.play();
      
      activeAudio.set(button, newAudio);
      
      newAudio.addEventListener('ended', () => {
        activeAudio.delete(button);
      });
    });
  });
});
