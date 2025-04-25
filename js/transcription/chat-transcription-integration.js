/**
 * Chat Transcription Integration
 * 
 * Integrates the speech input component with the chat interface,
 * following the cross-component interfaces defined in the documentation
 */

import { SpeechInputComponent } from '../components/speech-input.js';
import { checkSupport, saveTranscription } from './transcription-service.js';

let speechInput = null;
let currentProject = null;

/**
 * Initializes the speech input integration for the chat interface
 * @param {Object} options Configuration options
 */
export async function initChatTranscription(options = {}) {
  // Check browser support first
  const supportInfo = await checkSupport();
  
  // Set current project ID if provided
  if (options.projectId) {
    currentProject = options.projectId;
  }
  
  // Find the chat input element
  const chatInputElement = options.inputElement || document.querySelector('.chat-input');
  
  if (!chatInputElement) {
    console.error('Chat input element not found');
    return {
      success: false,
      error: 'Chat input element not found'
    };
  }
  
  // Find the container for the speech button
  const container = options.container || document.querySelector('.chat-input-box');
  
  if (!container) {
    console.error('Container element not found');
    return {
      success: false,
      error: 'Container element not found'
    };
  }
  
  // Create the speech input component
  speechInput = new SpeechInputComponent({
    container,
    targetInput: chatInputElement,
    onTranscript: (data) => handleTranscription(data, options.onTranscript),
    onStatusChange: (status) => handleStatusChange(status, options.onStatusChange)
  });
  
  // Add status display to UI
  addTranscriptionStatus(container);
  
  // If not supported, add a warning message
  if (!supportInfo.supported) {
    addBrowserSupportWarning(container);
  }
  
  return {
    success: true,
    supported: supportInfo.supported
  };
}

/**
 * Handles transcription results
 * @param {Object} data The transcription data
 * @param {Function} callback Optional callback function
 */
function handleTranscription(data, callback) {
  // Call the provided callback if available
  if (callback && typeof callback === 'function') {
    callback(data);
  }
  
  // Set the transcript status message
  const statusElement = document.querySelector('.transcription-status');
  if (statusElement && data.transcript) {
    statusElement.textContent = 'Transcribed!';
    statusElement.classList.add('success');
    
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.classList.remove('success');
    }, 2000);
  }
}

/**
 * Handles status changes from the speech input component
 * @param {Object} status The status data
 * @param {Function} callback Optional callback function
 */
function handleStatusChange(status, callback) {
  // Call the provided callback if available
  if (callback && typeof callback === 'function') {
    callback(status);
  }
  
  // Update the status element
  const statusElement = document.querySelector('.transcription-status');
  if (statusElement) {
    if (status.isListening) {
      statusElement.textContent = 'Listening...';
      statusElement.classList.add('active');
    } else if (status.error) {
      statusElement.textContent = status.error;
      statusElement.classList.add('error');
      
      setTimeout(() => {
        statusElement.textContent = '';
        statusElement.classList.remove('error');
      }, 3000);
    } else {
      statusElement.textContent = '';
      statusElement.classList.remove('active');
    }
  }
}

/**
 * Adds a transcription status element to the container
 * @param {HTMLElement} container The container element
 */
function addTranscriptionStatus(container) {
  const statusElement = document.createElement('div');
  statusElement.className = 'transcription-status';
  container.appendChild(statusElement);
}

/**
 * Adds a browser support warning message
 * @param {HTMLElement} container The container element
 */
function addBrowserSupportWarning(container) {
  const warningElement = document.createElement('div');
  warningElement.className = 'browser-support-warning';
  warningElement.textContent = 'Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.';
  container.parentNode.insertBefore(warningElement, container.nextSibling);
}

/**
 * Saves a transcription to a project
 * @param {Object} params Parameters
 * @returns {Promise<Object>} Result of the save operation
 */
export async function saveTranscriptionToProject(params) {
  const projectId = params.projectId || currentProject;
  
  if (!projectId) {
    return {
      success: false,
      error: 'No project ID provided or set'
    };
  }
  
  return await saveTranscription({
    project_id: projectId,
    transcription: params.transcription,
    field: params.field || 'additional_context'
  });
}

/**
 * Sets the current project ID for transcription saving
 * @param {string} projectId The project ID
 */
export function setCurrentProject(projectId) {
  currentProject = projectId;
} 