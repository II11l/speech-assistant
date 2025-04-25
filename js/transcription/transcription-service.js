/**
 * Transcription Service Module
 * 
 * Provides a service layer for the Web Speech API integration,
 * matching the API endpoints described in the specifications
 */

import { 
  checkBrowserSupport, 
  startTranscription, 
  stopTranscription, 
  abortTranscription 
} from '../speech-recognition.js';

import { supabaseClient } from '../supabase-client.js';

// Active sessions storage
const activeSessions = new Map();

/**
 * Checks if the browser supports the Web Speech API
 * @returns {Object} Object with support status and features
 */
export async function checkSupport() {
  const supportInfo = checkBrowserSupport();
  
  // Return in the format specified by the API endpoint
  return {
    supported: supportInfo.supported,
    features: supportInfo.features || {
      continuous: false,
      interim_results: false
    }
  };
}

/**
 * Starts a new transcription session
 * @param {Object} options Configuration options
 * @returns {Promise<Object>} Session information
 */
export async function startSession(options = {}) {
  const supportInfo = checkBrowserSupport();
  
  if (!supportInfo.supported) {
    return {
      success: false,
      error: 'Web Speech API not supported in this browser'
    };
  }
  
  try {
    // Start the transcription
    const result = startTranscription({
      ...options,
      // We'll handle these callbacks differently in the service
      onResult: null,
      onEnd: null,
      onError: null
    });
    
    if (!result.success) {
      return result;
    }
    
    // Store the session
    activeSessions.set(result.sessionId, {
      id: result.sessionId,
      startTime: new Date(),
      status: 'active'
    });
    
    return {
      session_id: result.sessionId,
      status: 'active'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Stops an active transcription session
 * @param {string} sessionId The ID of the session to stop
 * @returns {Promise<Object>} The transcription result
 */
export async function stopSession(sessionId) {
  if (!activeSessions.has(sessionId)) {
    return {
      success: false,
      error: 'Session not found'
    };
  }
  
  try {
    // Stop the transcription
    const result = stopTranscription();
    
    if (!result.success) {
      return result;
    }
    
    // Update session status
    const session = activeSessions.get(sessionId);
    session.status = 'completed';
    session.endTime = new Date();
    
    // Return the result in the format specified by the API endpoint
    return {
      transcription: result.transcript,
      confidence: result.confidence
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Saves a transcription to a project
 * @param {Object} params Parameters for saving the transcription
 * @param {string} params.project_id The project ID
 * @param {string} params.transcription The transcription text
 * @param {string} params.field The field to update ('additional_context' or 'key_anecdotes')
 * @returns {Promise<Object>} Result of the save operation
 */
export async function saveTranscription(params) {
  const { project_id, transcription, field } = params;
  
  if (!project_id || !transcription || !field) {
    return {
      success: false,
      error: 'Missing required parameters'
    };
  }
  
  // Validate field value
  if (field !== 'additional_context' && field !== 'key_anecdotes') {
    return {
      success: false,
      error: 'Invalid field value. Must be "additional_context" or "key_anecdotes".'
    };
  }
  
  try {
    // Get the current project requirements
    const { data: projectData, error: projectError } = await supabaseClient
      .from('speech_projects')
      .select('id')
      .eq('id', project_id)
      .single();
    
    if (projectError || !projectData) {
      return {
        success: false,
        error: projectError?.message || 'Project not found'
      };
    }
    
    // Get existing requirements
    const { data: requirementsData, error: requirementsError } = await supabaseClient
      .from('speech_requirements')
      .select('*')
      .eq('project_id', project_id)
      .single();
    
    let updateData = {};
    
    // Handle different field types
    if (field === 'additional_context') {
      // For additional_context, we just set the text
      updateData = { additional_context: transcription };
    } else if (field === 'key_anecdotes') {
      // For key_anecdotes, we add to the array
      const currentAnecdotes = requirementsData?.key_anecdotes || [];
      updateData = { 
        key_anecdotes: [...currentAnecdotes, transcription] 
      };
    }
    
    // Update or insert requirements
    let result;
    if (requirementsData) {
      // Update existing requirements
      result = await supabaseClient
        .from('speech_requirements')
        .update(updateData)
        .eq('id', requirementsData.id);
    } else {
      // Insert new requirements
      updateData.project_id = project_id;
      result = await supabaseClient
        .from('speech_requirements')
        .insert(updateData);
    }
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }
    
    return {
      success: true,
      project_id,
      updated_field: field
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets all active sessions
 * @returns {Array} Array of active transcription sessions
 */
export function getActiveSessions() {
  return Array.from(activeSessions.values())
    .filter(session => session.status === 'active');
}

/**
 * Cleans up inactive sessions
 */
export function cleanupSessions() {
  const now = new Date();
  
  for (const [sessionId, session] of activeSessions.entries()) {
    // Remove sessions that are completed or older than 1 hour
    if (session.status === 'completed' || 
        (now - session.startTime > 3600000)) {
      activeSessions.delete(sessionId);
    }
  }
} 