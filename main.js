document.addEventListener('DOMContentLoaded', () => {
    const playingSounds = new Set();
    const buttons = document.querySelectorAll('[data-sound]');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    let globalVolume = volumeSlider.value / 100;

    function updateVolume(value) {
        globalVolume = value / 100;
        volumeValue.textContent = `${value}%`;

        // Update volume for all currently playing sounds
        playingSounds.forEach(sound => {
            sound.audio.volume = globalVolume;
        });
    }

    // Initialize volume and add volume control listeners
    updateVolume(volumeSlider.value);
    volumeSlider.addEventListener('input', (e) => updateVolume(e.target.value));

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const soundFile = button.dataset.sound;
            const existingSound = Array.from(playingSounds).find(
                info => info.audio.src === soundFile // Use full path for comparison
            );

            if (existingSound) {
                existingSound.audio.pause();
                existingSound.audio.currentTime = 0;
                playingSounds.delete(existingSound);
                button.classList.remove('active');
                return;
            }

            const audio = new Audio(soundFile);
            audio.volume = globalVolume; // Set initial volume

            const audioInfo = { audio, button };
            playingSounds.add(audioInfo);
            button.classList.add('active');

            audio.play().catch(error => {
                console.error('Error playing sound:', error);
                button.classList.remove('active');
            });

            audio.addEventListener('ended', () => {
                playingSounds.delete(audioInfo);
                button.classList.remove('active');
            });

            audio.addEventListener('pause', () => {
                playingSounds.delete(audioInfo);
                button.classList.remove('active');
            });
        });
    });

    // Clean up playing sounds on page unload
    window.addEventListener('beforeunload', () => {
        playingSounds.forEach(({ audio }) => {
            audio.pause();
            audio.src = ""; // Release the audio resource
        });
        playingSounds.clear();
    });
});
