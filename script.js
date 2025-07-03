// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('nav a, .mobile-nav-links a, .footer-nav a, .footer-buttons a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Handle disabled links gracefully (do nothing or show message)
            if (this.classList.contains('nav-link-disabled')) {
                e.preventDefault(); // Prevent default hash behavior
                console.log(`Navigation to ${targetId} is temporarily disabled.`);
                // Optionally: Add a small, temporary visual cue or toast message
                return;
            }

            // If it's an active link to a section
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault(); // Prevent default hash behavior

                    // Get header height for offset
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerHeight - 30; // Add extra padding below header

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (mobileMenuOverlay.classList.contains('active')) {
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = ''; // Re-enable scrolling
                    }
                }
            } else {
                // For external links or other non-section links, allow default behavior
                console.log(`Navigation to ${targetId} is not a section ID.`);
            }
        });
    });

    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const body = document.body; // Reference to the body for overflow control

    hamburgerMenu.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    closeMenu.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = ''; // Re-enable scrolling
    });

    // Close menu if clicking outside the content (good UX)
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // --- Formspree Submission (Anonymous Query) ---
    const anonymousQueryForm = document.getElementById('anonymousQueryForm');
    const queryText = document.getElementById('queryText');
    const queryStatus = document.getElementById('queryStatus');
    const emailOptional = document.getElementById('emailOptional');

    if (anonymousQueryForm) {
        anonymousQueryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const query = queryText.value.trim();
            const email = emailOptional.value.trim();

            if (query) {
                queryStatus.textContent = 'Sending your story...';
                queryStatus.style.color = 'var(--light-secondary-text)';

                try {
                    const formData = new FormData(anonymousQueryForm);
                    // Add a custom subject for easier identification in Formspree inbox
                    formData.append('_subject', 'Phelao Anonymous Story/Query');

                    const response = await fetch(anonymousQueryForm.action, {
                        method: anonymousQueryForm.method,
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        queryStatus.textContent = 'Thank you! Your anonymous story has been sent. We appreciate your trust.';
                        queryStatus.style.color = 'var(--primary-brand)';
                        queryText.value = ''; // Clear textarea
                        emailOptional.value = ''; // Clear email field
                    } else {
                        const data = await response.json();
                        queryStatus.textContent = 'An error occurred. Please try again. ' + (data.errors ? data.errors.map(err => err.message).join(', ') : '');
                        queryStatus.style.color = 'var(--tertiary-accent)'; // Use tertiary accent for error
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    queryStatus.textContent = 'Network error. Please check your connection and try again.';
                    queryStatus.style.color = 'var(--tertiary-accent)';
                }

                // Clear status message after a few seconds
                setTimeout(() => {
                    queryStatus.textContent = '';
                }, 7000);

            } else {
                queryStatus.textContent = 'Please type your story or query before submitting.';
                queryStatus.style.color = 'var(--tertiary-accent)';
                setTimeout(() => {
                    queryStatus.textContent = '';
                }, 3000);
            }
        });
    }

    // --- Formspree Submission (Topic Suggestion) ---
    const topicSuggestionForm = document.getElementById('topicSuggestionForm');
    const topicSuggestion = document.getElementById('topicSuggestion');
    const suggestionStatus = document.getElementById('suggestionStatus');
    const suggestionEmailOptional = document.getElementById('suggestionEmailOptional');

    if (topicSuggestionForm) {
        topicSuggestionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const suggestion = topicSuggestion.value.trim();
            const email = suggestionEmailOptional.value.trim();

            if (suggestion) {
                suggestionStatus.textContent = 'Submitting your suggestion...';
                suggestionStatus.style.color = 'var(--light-secondary-text)';

                try {
                    const formData = new FormData(topicSuggestionForm);
                    formData.append('_subject', 'Phelao Topic Suggestion'); // Custom subject

                    const response = await fetch(topicSuggestionForm.action, {
                        method: topicSuggestionForm.method,
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        suggestionStatus.textContent = 'Thank you for your suggestion! We value your input.';
                        suggestionStatus.style.color = 'var(--primary-brand)';
                        topicSuggestion.value = ''; // Clear textarea
                        suggestionEmailOptional.value = ''; // Clear email field
                    } else {
                        const data = await response.json();
                        suggestionStatus.textContent = 'An error occurred. Please try again. ' + (data.errors ? data.errors.map(err => err.message).join(', ') : '');
                        suggestionStatus.style.color = 'var(--tertiary-accent)';
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    suggestionStatus.textContent = 'Network error. Please check your connection and try again.';
                    suggestionStatus.style.color = 'var(--tertiary-accent)';
                }

                setTimeout(() => {
                    suggestionStatus.textContent = '';
                }, 7000);

            } else {
                suggestionStatus.textContent = 'Please enter your topic suggestion.';
                suggestionStatus.style.color = 'var(--tertiary-accent)';
                setTimeout(() => {
                    queryStatus.textContent = '';
                }, 3000);
            }
        });
    }


    // --- Dynamic Current Year in Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Social Sharing Functionality (Web Share API with Fallback) ---
    document.querySelectorAll('.share-icon').forEach(shareLink => {
        shareLink.addEventListener('click', (e) => {
            e.preventDefault();
            const shareUrl = window.location.href; // URL of the current page
            const shareTitle = "Phelao: Breaking Silences, Building Futures in Pakistan.";
            const shareText = "I found Phelao, an amazing initiative tackling overlooked realities in Pakistan like menstrual health and cultural taboos. They're creating a truly safe space for education and shared stories. Check it out and join the movement!";
            const platform = shareLink.dataset.sharePlatform; // Get platform from data attribute

            if (navigator.share) {
                // Use Web Share API if available
                navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
            } else {
                // Fallback for browsers that don't support Web Share API
                let url = '';

                switch (platform) {
                    case 'facebook':
                        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                        break;
                    case 'twitter':
                        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                        break;
                    case 'whatsapp':
                        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                        break;
                    case 'email':
                        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
                        break;
                    case 'instagram':
                        // Instagram doesn't have a direct web share API for posts, usually done through app.
                        // Can direct to Instagram profile or offer a copy link.
                        alert('To share on Instagram, please copy the link and paste it into your story or post: ' + shareUrl);
                        break;
                    case 'linkedin':
                        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`;
                        break;
                    default:
                        alert('Sharing not supported for this platform or your browser.');
                        return;
                }
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer'); // Open in new tab securely
                }
            }
        });
    });

});
