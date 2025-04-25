// auth.js
// Authentication module for Wedding Speech Assistant

import supabase from '../supabase-client.js';

/**
 * User Registration
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @returns {Promise} - Registration result
 */
export async function signUp(email, password, firstName) {
  try {
    // Step 1: Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Step 2: Create a profile record with firstName and default payment_status
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email,
            first_name: firstName,
            payment_status: 'free',
            created_at: new Date(),
            last_login: new Date()
          }
        ]);

      if (profileError) throw profileError;
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * User Login
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Login result
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Update last login timestamp
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date() })
        .eq('id', data.user.id);
    }

    return { success: true, session: data.session, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * User Logout
 * @returns {Promise} - Logout result
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get Current User
 * @returns {Promise} - User data
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (user) {
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      return { 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          first_name: profileData.first_name,
          payment_status: profileData.payment_status
        }
      };
    }
    
    return { success: false, user: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Setup Auth State Change Listener
 * @param {Function} callback - Function to call when auth state changes
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Reset Password
 * @param {string} email - User's email
 * @returns {Promise} - Password reset result
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset.html`,
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update User Password
 * @param {string} newPassword - New password
 * @returns {Promise} - Password update result
 */
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
} 