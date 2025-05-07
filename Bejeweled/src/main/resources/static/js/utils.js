/**
 * Common utilities for Bejeweled web game
 * Contains shared functionality used across the application
 */

const BejeweledUtils = {
    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Time to wait in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },

    /**
     * Format score with commas for thousands
     * @param {number} score - Score to format
     * @returns {string} - Formatted score
     */
    formatScore: function(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * Detect if device is mobile
     * @returns {boolean} - True if device is mobile
     */
    isMobile: function() {
        return window.matchMedia('(max-width: 768px)').matches;
    },

    /**
     * Get a random gem type
     * @returns {string} - Random gem type name
     */
    getRandomGemType: function() {
        const gemTypes = ['purple', 'yellow', 'red', 'blue', 'green', 'rainbow'];
        const randomIndex = Math.floor(Math.random() * gemTypes.length);
        return gemTypes[randomIndex];
    },

    /**
     * Create and show a message notification
     * @param {string} message - Message text
     * @param {string} type - Message type (info, success, error)
     * @param {number} duration - Duration in milliseconds
     */
    showMessage: function(message, type = 'info', duration = 3000) {
        let messageContainer = document.querySelector('.message-container');

        if (!messageContainer) {
            // Create a new message container if it doesn't exist
            messageContainer = document.createElement('div');
            messageContainer.className = 'message-container';
            messageContainer.style.position = 'fixed';
            messageContainer.style.top = '20px';
            messageContainer.style.left = '50%';
            messageContainer.style.transform = 'translateX(-50%)';
            messageContainer.style.zIndex = '1000';
            document.body.appendChild(messageContainer);
        }

        // Create the message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        messageElement.style.animation = 'fadeIn 0.3s forwards';

        messageContainer.appendChild(messageElement);

        setTimeout(() => {
            messageElement.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                if (messageContainer.contains(messageElement)) {
                    messageContainer.removeChild(messageElement);
                }

                if (messageContainer.children.length === 0 && document.body.contains(messageContainer)) {
                    document.body.removeChild(messageContainer);
                }
            }, 300);
        }, duration);
    },

    /**
     * Add smooth scrolling to all internal links
     */
    initSmoothScroll: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Setup logo click redirection
     */
    setupLogoRedirect: function() {
        const logoElements = document.querySelectorAll('.logo, .logo *');

        logoElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.location.href = '/main-page';  // Redirect to main page
            });
        });
    },

    /**
     * Initialize the page with common functionality
     */
    initPage: function() {
        const yearElement = document.getElementById('year');

        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        this.setupLogoRedirect();

        this.initSmoothScroll();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    BejeweledUtils.initPage();

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.onclick = function(event) {
            event.preventDefault();
            window.location.href = '/';
            return false;
        };
    }
});

window.BejeweledUtils = BejeweledUtils;