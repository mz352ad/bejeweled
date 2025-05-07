/**
 * Modal functionality for authentication
 * Handles creation and management of authentication modals
 */

window.openModal = function(modalId) {
    const modalOverlay = document.getElementById(modalId + '-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modalOverlay = document.getElementById(modalId + '-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.closeAllModals = function() {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', function() {
    createLoginModal();
    createRegisterModal();

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const overlay = this.closest('.modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('login-modal');
            openModal('register-modal');
        });
    }

    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('register-modal');
            openModal('login-modal');
        });
    }

    const signInBtn = document.querySelector('.sign-in-btn');
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            openModal('login-modal');
        });
    }

    const signUpBtn = document.querySelector('.sign-up-btn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            openModal('register-modal');
        });
    }

    const createAccountBtn = document.querySelector('.create-account-btn');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', function() {
            openModal('register-modal');
        });
    }

    initializeFormHandlers();
});

/**
 * Create login modal
 */
function createLoginModal() {
    const loginModalHTML = `
        <div id="login-modal-overlay" class="modal-overlay">
            <div class="modal auth-modal">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2 class="modal-title">Sign In</h2>
                    <p class="modal-subtitle">Welcome back to Bejeweled!</p>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-username">Username</label>
                            <input type="text" class="form-control" id="login-username" placeholder="Enter your username" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" class="form-control" id="login-password" placeholder="Enter your password" required>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="remember-me">
                            <label class="form-check-label" for="remember-me">Remember me</label>
                        </div>
                        <button type="submit" class="auth-button">Sign In</button>
                        <p class="switch-form-text">
                            Don't have an account? <a href="#" id="register-link" class="form-link">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
}

/**
 * Create register modal
 */
function createRegisterModal() {
    const registerModalHTML = `
        <div id="register-modal-overlay" class="modal-overlay">
            <div class="modal auth-modal">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2 class="modal-title">Create Account</h2>
                    <p class="modal-subtitle">Join the Bejeweled community!</p>
                </div>
                <div class="modal-body">
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-username">Username</label>
                            <input type="text" class="form-control" id="register-username" placeholder="Choose a username" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input type="email" class="form-control" id="register-email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <input type="password" class="form-control" id="register-password" placeholder="Create a password" required>
                        </div>
                        <div class="form-group">
                            <label for="register-confirm-password">Confirm Password</label>
                            <input type="password" class="form-control" id="register-confirm-password" placeholder="Confirm your password" required>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="terms-agree" required>
                            <label class="form-check-label" for="terms-agree">I agree to the Terms of Service</label>
                        </div>
                        <button type="submit" class="auth-button">Create Account</button>
                        <p class="switch-form-text">
                            Already have an account? <a href="#" id="login-link" class="form-link">Sign in</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', registerModalHTML);
}

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (window.Auth) {
                window.Auth.login(username, password)
                    .then(() => {
                        window.showNotification('Login successful!', 'success');
                        window.closeAllModals();
                        window.updateHeaderForAuthStatus();
                        setTimeout(() => window.location.reload(), 1000);
                    })
                    .catch(error => {
                        console.error('Login error:', error);
                        window.showNotification('Login failed: ' + error.message, 'error');
                    });
            } else {
                console.error('Auth module not found');
                window.showNotification('Authentication module not loaded', 'error');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                window.showNotification('Passwords do not match', 'error');
                return;
            }

            if (window.Auth) {
                window.Auth.register(username, email, password)
                    .then(() => {
                        window.showNotification('Registration successful!', 'success');
                        window.closeAllModals();
                        window.updateHeaderForAuthStatus();
                        setTimeout(() => window.location.reload(), 1000);
                    })
                    .catch(error => {
                        console.error('Registration error:', error);
                        window.showNotification('Registration failed: ' + error.message, 'error');
                    });
            } else {
                console.error('Auth module not found');
                window.showNotification('Authentication module not loaded', 'error');
            }
        });
    }
}