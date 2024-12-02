document.addEventListener('DOMContentLoaded', () => {
  const activeAudio = new Map(); // Map to track active audio per button
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const soundFile = button.getAttribute('data-sound');
      
      // Check if the button's sound is already playing
      if (activeAudio.has(button)) {
        const audio = activeAudio.get(button);
        // If playing, stop and remove it
        audio.pause();
        audio.currentTime = 0;
        activeAudio.delete(button);
        return;
      }
      
      // Create and play a new audio object
      const newAudio = new Audio(soundFile); // Removed duplicate Sounds/ prefix
      newAudio.play();
      
      // Store the audio object for the button
      activeAudio.set(button, newAudio);
      
      // Remove audio from the map when it ends
      newAudio.addEventListener('ended', () => {
        activeAudio.delete(button);
      });
    });
  });
});
