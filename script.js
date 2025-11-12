document.addEventListener('DOMContentLoaded', () => {
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const nameInput = document.getElementById('name-input');
    const canonAudio = document.getElementById('canon-audio');
    const hbdAudio = document.getElementById('hbd-audio');

    // 1. Entry Screen Logic
    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (nameInput.value.trim() === '杜小军') {
                entryScreen.style.opacity = '0';
                entryScreen.style.pointerEvents = 'none';

                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';

                // Start background music and manually trigger first section's animation after fade-in
                setTimeout(() => {
                    canonAudio.play().catch(error => console.error("Audio play failed:", error));
                    // Manually trigger animation for the first section's elements
                    document.querySelectorAll('#section-1 .animate-on-scroll').forEach(el => {
                        el.classList.add('visible');
                    });
                }, 1000); // Delay should match the main content's transition duration
            } else {
                nameInput.style.animation = 'shake 0.5s';
                setTimeout(() => nameInput.style.animation = '', 500);
            }
        }
    });

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `, styleSheet.cssRules.length);

    // 2. Scroll Animation & Background Image Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if the section is intersecting and NOT section-1 (which is handled manually)
            if (entry.isIntersecting && entry.target.id !== 'section-1') {
                // Animate text elements
                entry.target.querySelectorAll('.animate-on-scroll').forEach(el => {
                    el.classList.add('visible');
                });

                // Handle background image fade-in for sections 3, 4, 5
                if (entry.target.dataset.bgImg) {
                    // Set the CSS variable for the ::before pseudo-element
                    entry.target.style.setProperty('--bg-image', `url(${entry.target.dataset.bgImg})`);
                    entry.target.classList.add('bg-visible');
                }
            }
        });
    }, { threshold: 0.4 }); // Trigger when 40% of the element is visible

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });


    // 3. Complex Animation Observers
    // Section 6: Value & Resonance - New sequence
    const section6 = document.getElementById('section-6');
    const observer6 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const valueText = document.getElementById('value-text');
            const andText = document.getElementById('and-text');
            const resonanceText = document.getElementById('resonance-text');
            const valueImg = document.getElementById('value-img');
            const resonanceImg = document.getElementById('resonance-img');

            // Sequence
            // 1. Move "价值指引" to the left
            setTimeout(() => {
                valueText.style.left = '15%';
                valueText.style.transform = 'translateX(-50%)';
            }, 500);

            // 2. Show "and" and "共鸣"
            setTimeout(() => {
                andText.classList.remove('hidden');
            }, 1200);
            setTimeout(() => {
                resonanceText.classList.remove('hidden');
                resonanceText.style.right = '15%';
                resonanceText.style.transform = 'translateX(50%)';
            }, 1500);

            // 3. Show background images
            setTimeout(() => {
                if (window.innerWidth > 768) { // Only show on desktop
                    valueImg.classList.remove('hidden');
                    resonanceImg.classList.remove('hidden');
                    valueImg.style.opacity = '0.4';
                    resonanceImg.style.opacity = '0.4';
                }
            }, 2000);

            observer6.unobserve(section6); // Animate only once
        }
    }, { threshold: 0.5 });
    observer6.observe(section6);

    // Section 8: Final Birthday Section - New sequence
    const section8 = document.getElementById('section-8');
    const observer8 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            canonAudio.pause();
            canonAudio.currentTime = 0;

            const whateverText = document.getElementById('whatever-text');
            const birthdayTitle = document.getElementById('birthday-title');
            const cakeContainer = document.getElementById('cake-container');
            const cakeImg = document.getElementById('cake-img');

            // Sequence
            setTimeout(() => {
                whateverText.style.opacity = '0';
            }, 2000);

            setTimeout(() => {
                // Reveal container first, but children are still hidden
                cakeContainer.classList.remove('hidden');
                
                // Animate title
                birthdayTitle.classList.remove('hidden');
                void birthdayTitle.offsetWidth; // Force reflow
                birthdayTitle.style.opacity = '1';
                birthdayTitle.style.transform = 'translateY(0)';
            }, 3000);

            setTimeout(() => {
                // Animate cake image
                cakeImg.classList.remove('hidden');
                void cakeImg.offsetWidth; // Force reflow
                cakeImg.style.opacity = '1';
                cakeImg.style.transform = 'translateY(0)';

                triggerConfetti();
                hbdAudio.play().catch(error => console.error("HBD audio play failed:", error));
            }, 4000);

            observer8.unobserve(section8);
        }
    }, { threshold: 0.5 });
    observer8.observe(section8);

    // 4. Confetti Generation
    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        const colors = ['#ff4e4e', '#4e9aff', '#ffc74e', '#4eff8d', '#a94eff'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            
            const animName = `confetti-fall-${i}`;
            const xMovement = `${Math.random() * 20 - 10}vw`;

            // Check if rule already exists
            let ruleExists = false;
            for(let j = 0; j < styleSheet.cssRules.length; j++) {
                if(styleSheet.cssRules[j].name === animName) {
                    ruleExists = true;
                    break;
                }
            }

            if (!ruleExists) {
                styleSheet.insertRule(`
                    @keyframes ${animName} {
                        0% {
                            transform: translateY(-10vh) translateX(0) rotate(0deg);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(110vh) translateX(${xMovement}) rotate(720deg);
                            opacity: 0;
                        }
                    }
                `, styleSheet.cssRules.length);
            }
            confetti.style.animationName = animName;
            container.appendChild(confetti);
        }
    }
});
