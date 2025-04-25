/**
 * Web Speech API implementation for the Wedding Speech Assistant
 * Uses the SpeechRecognition interface available in modern browsers
 */

// Cross-browser support for SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Session management
let recognition = null;
let isRecognizing = false;
let sessionId = null;
let finalTranscript = '';
let interimTranscript = '';
let confidenceScore = 0;

// Callbacks
let onResultCallback = null;
let onEndCallback = null;
let onErrorCallback = null;

/**
 * Checks if the browser supports the Web Speech API
 * @returns {Object} Object containing support status and features
 */
export function checkBrowserSupport() {
  const isSupported = SpeechRecognition !== undefined;
  
  return {
    supported: isSupported,
    features: isSupported ? {
      continuous: true,
      interimResults: true
    } : null
  };
}

/**
 * Initializes the speech recognition with custom settings
 * @param {Object} options Configuration options
 */
function initializeRecognition(options = {}) {
  if (!checkBrowserSupport().supported) {
    throw new Error('Web Speech API is not supported in this browser');
  }
  
  recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = options.continuous !== undefined ? options.continuous : true;
  recognition.interimResults = options.interimResults !== undefined ? options.interimResults : true;
  recognition.lang = options.lang || 'en-US';
  
  // Set up event handlers
  recognition.onresult = handleRecognitionResult;
  recognition.onerror = handleRecognitionError;
  recognition.onend = handleRecognitionEnd;
}

/**
 * Handles the result event from the recognition
 * @param {SpeechRecognitionEvent} event The recognition result event
 */
function handleRecognitionResult(event) {
  interimTranscript = '';
  
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript + ' ';
      confidenceScore = event.results[i][0].confidence;
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }
  
  if (onResultCallback) {
    onResultCallback({
      transcript: finalTranscript.trim(),
      interimTranscript: interimTranscript.trim(),
      isFinal: interimTranscript.length === 0,
      confidence: confidenceScore
    });
  }
}

/**
 * Handles recognition errors
 * @param {SpeechRecognitionError} event The error event
 */
function handleRecognitionError(event) {
  isRecognizing = false;
  
  if (onErrorCallback) {
    onErrorCallback({
      error: event.error,
      message: getErrorMessage(event.error)
    });
  }
}

/**
 * Converts error codes to human-readable messages
 * @param {string} errorCode The error code from the API
 * @returns {string} A human-readable error message
 */
function getErrorMessage(errorCode) {
  const errorMessages = {
    'no-speech': 'No speech was detected.',
    'aborted': 'Speech recognition was aborted.',
    'audio-capture': 'Audio capture failed.',
    'network': 'Network error occurred.',
    'not-allowed': 'Speech recognition not allowed.',
    'service-not-allowed': 'Speech recognition service not allowed.',
    'bad-grammar': 'Grammar error.',
    'language-not-supported': 'Language not supported.'
  };
  
  return errorMessages[errorCode] || `Unknown error: ${errorCode}`;
}

/**
 * Handles the end of recognition
 */
function handleRecognitionEnd() {
  isRecognizing = false;
  
  if (onEndCallback) {
    onEndCallback({
      sessionId,
      transcript: finalTranscript,
      confidence: confidenceScore
    });
  }
}

/**
 * Starts a new transcription session
 * @param {Object} options Configuration options
 * @returns {Object} Session information
 */
export function startTranscription(options = {}) {
  if (!checkBrowserSupport().supported) {
    return {
      success: false,
      error: 'Web Speech API not supported'
    };
  }
  
  try {
    // Reset state
    finalTranscript = '';
    interimTranscript = '';
    confidenceScore = 0;
    
    // Generate a new session ID
    sessionId = generateSessionId();
    
    // Initialize with options
    initializeRecognition(options);
    
    // Set callbacks
    onResultCallback = options.onResult || null;
    onEndCallback = options.onEnd || null;
    onErrorCallback = options.onError || null;
    
    // Start recognition
    recognition.start();
    isRecognizing = true;
    
    return {
      success: true,
      sessionId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Stops the current transcription session
 * @returns {Object} The final transcription result
 */
export function stopTranscription() {
  if (!isRecognizing || !recognition) {
    return {
      success: false,
      error: 'No active transcription session'
    };
  }
  
  try {
    recognition.stop();
    isRecognizing = false;
    
    return {
      success: true,
      transcript: finalTranscript,
      confidence: confidenceScore,
      sessionId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Aborts the current transcription session
 */
export function abortTranscription() {
  if (isRecognizing && recognition) {
    recognition.abort();
    isRecognizing = false;
  }
}

/**
 * Generates a unique session ID
 * @returns {string} A unique session ID
 */
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Checks if a transcription session is currently active
 * @returns {boolean} True if a session is active
 */
export function isTranscriptionActive() {
  return isRecognizing;
}

/**
 * Gets the current transcription state
 * @returns {Object} The current transcription state
 */
export function getTranscriptionState() {
  return {
    isActive: isRecognizing,
    sessionId,
    transcript: finalTranscript,
    interimTranscript,
    confidence: confidenceScore
  };
} 