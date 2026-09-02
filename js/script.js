/**
 * script.js - Interactive Scripts for Developer Portfolio
 * Vanilla JS only, modular, clean, and optimized
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Preloader & Scroll Progress
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('load', () => {
        // Fade out preloader once everything is loaded
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
            }, 600);
        }
    });

    // Fallback: remove preloader after 3 seconds in case window load event doesn't fire
    setTimeout(() => {
        if (preloader && preloader.style.opacity !== '0') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
            }, 600);
        }
    }, 3000);

    // Track scroll height and update progress indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    });


    // ==========================================================================
    // 2. Custom Cursor & Hover States
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorGlow = document.getElementById('cursor-glow');

    let mouseX = 0, mouseY = 0; // Current mouse coords
    let outlineX = 0, outlineY = 0; // Smooth ring coords
    let glowX = 0, glowY = 0; // Glow coords

    // Interpolation factor (lag/inertia speed)
    const ringSpeed = 0.15;
    const glowSpeed = 0.08;

    let isMouseMoving = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        // Show cursor elements on first move
        if (cursorDot && cursorDot.style.opacity === '') {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorGlow.style.opacity = '1';
        }
    });

    // Smooth cursor movement loop
    function updateCursor() {
        if (isMouseMoving) {
            // Instant tracking for dot
            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }

            // Lerp (Linear Interpolation) for outer ring
            outlineX += (mouseX - outlineX) * ringSpeed;
            outlineY += (mouseY - outlineY) * ringSpeed;
            if (cursorOutline) {
                cursorOutline.style.left = outlineX + 'px';
                cursorOutline.style.top = outlineY + 'px';
            }

            // Lerp for glow
            glowX += (mouseX - glowX) * glowSpeed;
            glowY += (mouseY - glowY) * glowSpeed;
            if (cursorGlow) {
                cursorGlow.style.left = glowX + 'px';
                cursorGlow.style.top = glowY + 'px';
            }
        }
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Hide custom cursor elements on touch devices
    window.addEventListener('touchstart', () => {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        if (cursorGlow) cursorGlow.style.display = 'none';
    });

    // Add hover states classes to cursor
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .profile-card, .tab-btn, .theme-toggle, .hamburger, .timeline-dot, #back-to-top');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });


    // ==========================================================================
    // 3. High Performance Canvas Particle System
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let connectionDistance = 110;
        let maxParticles = 80;

        // Set canvas boundaries
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Adjust particle count based on screen width
            if (window.innerWidth < 768) {
                maxParticles = 30;
                connectionDistance = 80;
            } else {
                maxParticles = 80;
                connectionDistance = 110;
            }
            initParticles();
        }

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const lineColor = isLight ? 'rgba(139, 92, 246, ' : 'rgba(139, 92, 246, ';

            // Update & Draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Check distance and draw connection lines
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - (dist / connectionDistance)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = lineColor + alpha + ')';
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }


    // ==========================================================================
    // 4. Sticky Navbar, Active Links Highlight & Hamburger
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close hamburger when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Highlighting Active Section in Nav Menu on Scroll
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 140; // compensate for sticky navbar height
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================================================
    // 5. Dark / Light Mode Toggle with Saved Preference
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }


    // ==========================================================================
    // 6. Typing Animation Cycle
    // ==========================================================================
    const roles = [
        "B.Tech CSE Student",
        "Full Stack Developer",
        "Competitive Programmer",
        "Creative Problem Solver"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingTextSpan = document.getElementById('typing-text');

    function executeType() {
        if (!typingTextSpan) return;
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            typingTextSpan.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingTextSpan.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = 100;
        if (isDeleting) {
            typeSpeed = 40;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeSpeed = 600; // Pause before typing next word
        }

        setTimeout(executeType, typeSpeed);
    }

    if (typingTextSpan) {
        setTimeout(executeType, 1200); // Wait for page load animations to settle
    }


    // ==========================================================================
    // 7. Scroll Reveal & Skill Progress Bar Trigger
    // ==========================================================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    const progressFills = document.querySelectorAll('.progress-bar-fill');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Skill Bar Observer
    const skillsSection = document.getElementById('skills');
    if (skillsSection && progressFills.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-width');
                        fill.style.width = targetWidth;
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        skillsObserver.observe(skillsSection);
    }


    // ==========================================================================
    // 8. Stats Counters Count-Up Animation
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const statsSection = document.getElementById('about');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach(stat => {
                            const target = parseInt(stat.getAttribute('data-count'), 10);
                            let count = 0;
                            const speed = target / 60; // 60 frames animation

                            function updateCount() {
                                count += speed;
                                if (count < target) {
                                    stat.textContent = Math.floor(count);
                                    requestAnimationFrame(updateCount);
                                } else {
                                    stat.textContent = target;
                                    // Append plus symbol for specific cards
                                    if (target === 15 || target === 500 || target === 8) {
                                        stat.textContent = target + '+';
                                    }
                                }
                            }
                            updateCount();
                        });
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });
            statsObserver.observe(statsSection);
        }
    }


    // ==========================================================================
    // 9. Skills Category Tabs Switcher
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.skills-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Set active buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set active contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });


    // ==========================================================================
    // 10. 3D Project Card Mouse Tilt Effect
    // ==========================================================================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    // Check if device supports pointer hovering
    if (window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Mouse relative X inside card
                const y = e.clientY - rect.top; // Mouse relative Y inside card
                
                const w = rect.width;
                const h = rect.height;
                
                // Tilt rotation formulas (scale -10 to +10 deg)
                const rotateX = ((y / h) - 0.5) * -12;
                const rotateY = ((x / w) - 0.5) * 12;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }


    // ==========================================================================
    // ==========================================================================
    // 11. Contact Form: Storage & Email Forwarding
    // ==========================================================================
    /**
     * Web3Forms Email Integration:
     * Messages are emailed straight to agarwalsudhanshu772@gmail.com!
     */
    const WEB3FORMS_ACCESS_KEY = "a01c8ad9-1d3c-4587-8511-71d8959dac57";

    const contactForm = document.getElementById('contact-form');
    const statusOverlay = document.getElementById('form-status');
    const statusCloseBtn = document.getElementById('status-close-btn');

    // Validation patterns
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    function validateField(input, groupSelector, customRule = () => true) {
        const group = input.closest('.form-group');
        const isValid = input.checkValidity() && customRule();
        
        if (isValid) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
        }
        return isValid;
    }

    // Storage Helpers
    function getStoredMessages() {
        try {
            return JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        } catch (err) {
            return [];
        }
    }

    function saveMessageToStorage(msgObj) {
        const messages = getStoredMessages();
        messages.unshift(msgObj); // Add newest first
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));
        updateInboxBadge();
    }

    function updateInboxBadge() {
        const messages = getStoredMessages();
        const inboxCountEl = document.getElementById('inbox-count');
        const modalCountEl = document.getElementById('inbox-modal-count');
        if (inboxCountEl) inboxCountEl.textContent = messages.length;
        if (modalCountEl) modalCountEl.textContent = `${messages.length} message${messages.length === 1 ? '' : 's'}`;
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function renderInboxMessages() {
        const messages = getStoredMessages();
        const inboxList = document.getElementById('inbox-list');
        if (!inboxList) return;

        if (messages.length === 0) {
            inboxList.innerHTML = `
                <div class="inbox-empty">
                    <i class="fas fa-inbox"></i>
                    <p>No messages received yet.</p>
                    <small>Submit the contact form to see messages stored here!</small>
                </div>
            `;
            return;
        }

        inboxList.innerHTML = messages.map(msg => `
            <div class="inbox-item" data-id="${msg.id}">
                <div class="inbox-item-header">
                    <div>
                        <span class="inbox-sender-name">${escapeHTML(msg.name)}</span>
                        <a href="mailto:${escapeHTML(msg.email)}" class="inbox-sender-email">&lt;${escapeHTML(msg.email)}&gt;</a>
                    </div>
                    <span class="inbox-time">${escapeHTML(msg.date)}</span>
                </div>
                <div class="inbox-item-body">${escapeHTML(msg.message)}</div>
                <div class="inbox-item-footer">
                    <button class="inbox-del-btn" onclick="window.deleteStoredMessage(${msg.id})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.deleteStoredMessage = function(id) {
        let messages = getStoredMessages();
        messages = messages.filter(m => m.id !== id);
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));
        updateInboxBadge();
        renderInboxMessages();
    };

    // Inbox Modal Controls
    const viewMessagesBtn = document.getElementById('view-messages-btn');
    const inboxModal = document.getElementById('inbox-modal');
    const closeInboxBtn = document.getElementById('close-inbox-btn');
    const inboxBackdrop = document.getElementById('inbox-backdrop');
    const clearMessagesBtn = document.getElementById('clear-messages-btn');

    if (viewMessagesBtn && inboxModal) {
        viewMessagesBtn.addEventListener('click', () => {
            renderInboxMessages();
            inboxModal.classList.add('active');
            inboxModal.setAttribute('aria-hidden', 'false');
        });
    }

    function closeInboxModal() {
        if (inboxModal) {
            inboxModal.classList.remove('active');
            inboxModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (closeInboxBtn) closeInboxBtn.addEventListener('click', closeInboxModal);
    if (inboxBackdrop) inboxBackdrop.addEventListener('click', closeInboxModal);

    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all stored messages?')) {
                localStorage.removeItem('portfolio_messages');
                updateInboxBadge();
                renderInboxMessages();
            }
        });
    }

    // Initialize badge count on load
    updateInboxBadge();

    if (contactForm) {
        // Blur events for real-time validation checks
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, '.form-group', () => nameInput.value.trim().length >= 3);
        });

        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(emailInput, '.form-group', () => emailRegex.test(emailInput.value.trim()));
        });

        messageInput.addEventListener('blur', () => {
            validateField(messageInput, '.form-group', () => messageInput.value.trim().length >= 10);
        });

        // Submit listener
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameInput, '.form-group', () => nameInput.value.trim().length >= 3);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = validateField(emailInput, '.form-group', () => emailRegex.test(emailInput.value.trim()));
            const isMessageValid = validateField(messageInput, '.form-group', () => messageInput.value.trim().length >= 10);

            if (isNameValid && isEmailValid && isMessageValid) {
                const submitBtn = document.getElementById('form-submit-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving message...';

                const messageData = {
                    id: Date.now(),
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim(),
                    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                };

                // 1. Always store to LocalStorage
                saveMessageToStorage(messageData);

                // 2. Forward to email via Web3Forms if key is set
                let emailDelivered = false;
                const activeKey = WEB3FORMS_ACCESS_KEY || document.getElementById('web3forms-key')?.value.trim();

                if (activeKey) {
                    try {
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending email...';
                        const formData = new FormData(contactForm);
                        formData.set('access_key', activeKey);
                        
                        const response = await fetch('https://api.web3forms.com/submit', {
                            method: 'POST',
                            body: formData
                        });
                        const resJson = await response.json();
                        if (resJson.success) {
                            emailDelivered = true;
                        }
                    } catch (err) {
                        console.warn('Email delivery failed, but message is safely stored locally:', err);
                    }
                }

                // Update status message text
                const statusMsg = document.getElementById('status-message');
                if (statusMsg) {
                    if (emailDelivered) {
                        statusMsg.innerHTML = `Your message was delivered to <strong>agarwalsudhanshu772@gmail.com</strong> and saved in your Inbox!`;
                    } else {
                        statusMsg.innerHTML = `Your message was safely saved in your <strong>Stored Messages Inbox</strong>!`;
                    }
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                if (statusOverlay) {
                    statusOverlay.classList.add('active');
                }
                contactForm.reset();
            }
        });
    }

    // Reset status overlay card view
    if (statusCloseBtn && statusOverlay) {
        statusCloseBtn.addEventListener('click', () => {
            statusOverlay.classList.remove('active');
        });
    }


    // ==========================================================================
    // 12. Back To Top Arrow Trigger
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            if (backToTopBtn) backToTopBtn.classList.add('active');
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('active');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 13. Download Resume Handler Alert
    // ==========================================================================
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            // Note: Since this is a template mockup, we handle missing files gracefully.
            // If the user replaces assets/Sudhanshu_Resume.pdf with their actual resume, it will download.
            // Otherwise, we log a warning or prevent failure.
            console.log('Downloading Resume template...');
        });
    }

});
