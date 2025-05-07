/**
 * Authentication Module
 * Handles all authentication-related functionality across the application
 */
const Auth = {
    // Common storage keys
    keys: {
        user: 'bejeweled-user',
        username: 'bejeweled-username',
        email: 'bejeweled-email'
    },

    /**
     * Login functionality - Using username for login
     * @param {string} username - User username
     * @param {string} password - User password
     * @returns {Promise} - Promise that resolves with user data
     */
    login: function(username, password) {
        return fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Login failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem(this.keys.user, data.username);
                localStorage.setItem(this.keys.username, data.username);
                localStorage.setItem(this.keys.email, data.email);
                return data;
            });
    },

    /**
     * Registration functionality
     * @param {string} username - Chosen username
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Promise that resolves with user data
     */
    register: function(username, email, password) {
        return fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem(this.keys.user, data.username);
                localStorage.setItem(this.keys.username, data.username);
                localStorage.setItem(this.keys.email, data.email);
                return data;
            });
    },

    /**
     * Logout functionality
     * @returns {Promise} - Promise that resolves when logout is complete
     */
    logout: function() {
        return fetch('/api/auth/logout', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                localStorage.removeItem(this.keys.user);
                localStorage.removeItem(this.keys.username);
                localStorage.removeItem(this.keys.email);
                return data;
            })
            .catch(() => {
                localStorage.removeItem(this.keys.user);
                localStorage.removeItem(this.keys.username);
                localStorage.removeItem(this.keys.email);
            });
    },

    /**
     * Get current user data
     * @returns {Object} - Object containing user email and username
     */
    getCurrentUser: function() {
        return {
            email: localStorage.getItem(this.keys.email),
            username: localStorage.getItem(this.keys.username)
        };
    },

    /**
     * Check if user is logged in
     * @returns {boolean} - True if user is logged in, false otherwise
     */
    isLoggedIn: function() {
        return localStorage.getItem(this.keys.user) !== null;
    },

    /**
     * Verify user session with server
     * @returns {Promise<boolean>} - Promise that resolves with true if session is valid
     */
    verifySession: function() {
        const username = localStorage.getItem(this.keys.username);

        if (!username) {
            return Promise.resolve(false);
        }

        return fetch(`/api/auth/user-profile?username=${encodeURIComponent(username)}`)
            .then(response => {
                if (!response.ok) {
                    // Session is invalid
                    localStorage.removeItem(this.keys.user);
                    localStorage.removeItem(this.keys.username);
                    localStorage.removeItem(this.keys.email);
                    return false;
                }
                return response.json();
            })
            .then(data => {
                if (data === false) return false;

                // Update username and email in case they have changed on the server
                localStorage.setItem(this.keys.username, data.username);
                localStorage.setItem(this.keys.email, data.email);
                return true;
            })
            .catch(error => {
                console.error('Session verification error:', error);
                return false;
            });
    }
};

function showNotification(message, type = 'success') {
    let container = document.querySelector('.notification-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-close">&times;</div>
    `;

    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }

            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    });

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        if (container.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }

                if (container.children.length === 0 && document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 300);
        }
    }, 4000);
}

// Update header based on auth status
function updateHeaderForAuthStatus() {
    const isLoggedIn = Auth.isLoggedIn();
    const username = Auth.getCurrentUser().username || 'User';

    const signInBtn = document.querySelector('.sign-in-btn');
    const signUpBtn = document.querySelector('.sign-up-btn');
    const authButtons = document.querySelector('.auth-buttons');

    const heroButtons = document.querySelector('.hero-buttons');
    const guestText = document.querySelector('.guest-text');

    if (isLoggedIn) {
        if (authButtons) {
            authButtons.innerHTML = '';
            const userProfile = document.createElement('div');
            userProfile.className = 'user-profile';
            userProfile.innerHTML = `
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span class="username">${username}</span>
                </div>
                <button class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="logout-text">Logout</span>
                </button>
            `;

            authButtons.appendChild(userProfile);

            // Add logout functionality
            const logoutBtn = authButtons.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // Logout logic remains the same
                    Auth.logout()
                        .then(() => {
                            showNotification('Successfully logged out', 'success');
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(error => {
                            console.error('Logout error:', error);
                            window.location.reload();
                        });
                });
            }
        }

        if (heroButtons) {
            heroButtons.innerHTML = '';

            const playBtn = document.createElement('a');

            playBtn.href = '/bejeweled';
            playBtn.className = 'play-guest-btn';
            playBtn.textContent = 'Play';
            heroButtons.appendChild(playBtn);

            if (guestText) {
                guestText.style.display = 'none';
            }
        }
    } else {
        // User is not logged in, ensure default buttons are displayed
        if (authButtons && (!signInBtn || !signUpBtn)) {
            authButtons.innerHTML = `
                <button class="sign-in-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    <span class="btn-text">Sign in</span>
                </button>
                <button class="sign-up-btn">
                    <i class="fas fa-user-plus"></i>
                    <span class="btn-text">Sign up</span>
                </button>
            `;

            const newSignInBtn = authButtons.querySelector('.sign-in-btn');
            const newSignUpBtn = authButtons.querySelector('.sign-up-btn');

            if (newSignInBtn) {
                newSignInBtn.addEventListener('click', function() {
                    if (typeof openModal === 'function') {
                        openModal('login-modal');
                    }
                });
            }

            if (newSignUpBtn) {
                newSignUpBtn.addEventListener('click', function() {
                    if (typeof openModal === 'function') {
                        openModal('register-modal');
                    }
                });
            }
        }

        if (heroButtons && heroButtons.children.length !== 2) {
            heroButtons.innerHTML = `
                <a href="#" class="create-account-btn">Create an Account</a>
                <a href="/bejeweled" class="play-guest-btn">Play as Guest</a>
            `;

            const createAccountBtn = heroButtons.querySelector('.create-account-btn');
            if (createAccountBtn) {
                createAccountBtn.addEventListener('click', function() {
                    if (typeof openModal === 'function') {
                        openModal('register-modal');
                    }
                });
            }

            if (guestText) {
                guestText.style.display = '';
            }
        }
    }

    const commentPlayerInput = document.querySelector('form[action="/bejeweled/comment"] input[name="player"]');
    const ratingPlayerInput = document.querySelector('form[action="/bejeweled/rate"] input[name="player"]');

    if (isLoggedIn) {
        if (commentPlayerInput) {
            commentPlayerInput.value = username;
            commentPlayerInput.readOnly = true;
        }

        if (ratingPlayerInput) {
            ratingPlayerInput.value = username;
            ratingPlayerInput.readOnly = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    Auth.verifySession().then(isValid => {
        if (!isValid && Auth.isLoggedIn()) {
            showNotification('Your session has expired. Please log in again.', 'error');
            localStorage.removeItem(Auth.keys.user);
            localStorage.removeItem(Auth.keys.username);
            localStorage.removeItem(Auth.keys.email);
        }

        updateHeaderForAuthStatus();
    });
});

// Export functions for global use
window.Auth = Auth;
window.showNotification = showNotification;
window.updateHeaderForAuthStatus = updateHeaderForAuthStatus;