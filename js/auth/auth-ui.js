// auth-ui.js
// User interface handler for authentication

import { signUp, signIn, signOut, resetPassword, updatePassword, getCurrentUser, onAuthStateChange } from './auth.js';

/**
 * Initialize authentication UI
 * @param {Object} options - Configuration options
 */
export function initAuth(options = {}) {
  // Default UI elements
  const defaults = {
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    resetForm: document.getElementById('reset-form'),
    updatePasswordForm: document.getElementById('update-password-form'),
    logoutBtn: document.getElementById('logout-btn'),
    authStateContainer: document.getElementById('auth-state-container'),
    userProfileContainer: document.getElementById('user-profile-container')
  };

  const config = { ...defaults, ...options };

  // Setup login form
  if (config.loginForm) {
    config.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = config.loginForm.querySelector('[name="email"]').value;
      const password = config.loginForm.querySelector('[name="password"]').value;
      
      // Show loading state
      const submitBtn = config.loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
      
      const result = await signIn(email, password);
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      
      if (result.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
      } else {
        // Show error message
        const errorElement = config.loginForm.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = result.error || 'Login failed';
        
        if (!config.loginForm.querySelector('.error-message')) {
          config.loginForm.appendChild(errorElement);
        }
      }
    });
  }

  // Setup register form
  if (config.registerForm) {
    config.registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = config.registerForm.querySelector('[name="email"]').value;
      const password = config.registerForm.querySelector('[name="password"]').value;
      const firstName = config.registerForm.querySelector('[name="first_name"]').value;
      
      // Show loading state
      const submitBtn = config.registerForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
      
      const result = await signUp(email, password, firstName);
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      
      if (result.success) {
        // Show success message and prompt to check email
        config.registerForm.innerHTML = `
          <div class="success-message">
            <h3>Registration successful!</h3>
            <p>Please check your email to confirm your account, then you can log in.</p>
            <a href="/login.html" class="btn btn-primary">Go to Login</a>
          </div>
        `;
      } else {
        // Show error message
        const errorElement = config.registerForm.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = result.error || 'Registration failed';
        
        if (!config.registerForm.querySelector('.error-message')) {
          config.registerForm.appendChild(errorElement);
        }
      }
    });
  }

  // Setup reset password form
  if (config.resetForm) {
    config.resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = config.resetForm.querySelector('[name="email"]').value;
      
      // Show loading state
      const submitBtn = config.resetForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending reset link...';
      
      const result = await resetPassword(email);
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      
      if (result.success) {
        // Show success message
        config.resetForm.innerHTML = `
          <div class="success-message">
            <h3>Reset link sent!</h3>
            <p>Please check your email for instructions to reset your password.</p>
            <a href="/login.html" class="btn btn-link">Back to Login</a>
          </div>
        `;
      } else {
        // Show error message
        const errorElement = config.resetForm.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = result.error || 'Failed to send reset link';
        
        if (!config.resetForm.querySelector('.error-message')) {
          config.resetForm.appendChild(errorElement);
        }
      }
    });
  }

  // Setup update password form
  if (config.updatePasswordForm) {
    config.updatePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = config.updatePasswordForm.querySelector('[name="password"]').value;
      const confirmPassword = config.updatePasswordForm.querySelector('[name="confirm_password"]').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        const errorElement = config.updatePasswordForm.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'Passwords do not match';
        
        if (!config.updatePasswordForm.querySelector('.error-message')) {
          config.updatePasswordForm.appendChild(errorElement);
        }
        return;
      }
      
      // Show loading state
      const submitBtn = config.updatePasswordForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating password...';
      
      const result = await updatePassword(password);
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      
      if (result.success) {
        // Show success message
        config.updatePasswordForm.innerHTML = `
          <div class="success-message">
            <h3>Password updated!</h3>
            <p>Your password has been successfully updated.</p>
            <a href="/login.html" class="btn btn-primary">Go to Login</a>
          </div>
        `;
      } else {
        // Show error message
        const errorElement = config.updatePasswordForm.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = result.error || 'Failed to update password';
        
        if (!config.updatePasswordForm.querySelector('.error-message')) {
          config.updatePasswordForm.appendChild(errorElement);
        }
      }
    });
  }

  // Setup logout button
  if (config.logoutBtn) {
    config.logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const result = await signOut();
      if (result.success) {
        // Redirect to home page
        window.location.href = '/';
      }
    });
  }

  // Setup auth state container
  if (config.authStateContainer) {
    updateAuthState(config.authStateContainer);
  }

  // Setup user profile container
  if (config.userProfileContainer) {
    updateUserProfile(config.userProfileContainer);
  }

  // Listen for auth state changes
  onAuthStateChange((event, session) => {
    if (config.authStateContainer) {
      updateAuthState(config.authStateContainer);
    }
    if (config.userProfileContainer) {
      updateUserProfile(config.userProfileContainer);
    }
  });
}

/**
 * Update auth state UI
 * @param {HTMLElement} container - Container element
 */
async function updateAuthState(container) {
  const result = await getCurrentUser();
  
  if (result.success && result.user) {
    container.innerHTML = `
      <div class="auth-state auth-state-logged-in">
        <span>Logged in as ${result.user.email}</span>
        <button id="logout-btn" class="btn btn-sm btn-outline">Logout</button>
      </div>
    `;
    
    // Add event listener to new logout button
    const logoutBtn = container.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.href = '/';
    });
  } else {
    container.innerHTML = `
      <div class="auth-state auth-state-logged-out">
        <a href="/login.html" class="btn btn-sm btn-primary">Login</a>
        <a href="/register.html" class="btn btn-sm btn-outline">Register</a>
      </div>
    `;
  }
}

/**
 * Update user profile UI
 * @param {HTMLElement} container - Container element
 */
async function updateUserProfile(container) {
  const result = await getCurrentUser();
  
  if (result.success && result.user) {
    container.innerHTML = `
      <div class="user-profile">
        <h2>Welcome, ${result.user.first_name}!</h2>
        <div class="user-info">
          <p><strong>Email:</strong> ${result.user.email}</p>
          <p><strong>Account type:</strong> ${result.user.payment_status === 'paid' ? 'Premium' : 'Free'}</p>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="user-profile-not-logged-in">
        <p>Please log in to view your profile</p>
      </div>
    `;
  }
} 