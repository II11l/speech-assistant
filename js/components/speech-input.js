/**
 * Speech Input Component
 * Creates a speech input button that integrates with the Web Speech API
 * for voice-to-text transcription in the chat interface
 */

import { 
  checkBrowserSupport, 
  startTranscription, 
  stopTranscription, 
  isTranscriptionActive 
} from '../speech-recognition.js';

export class SpeechInputComponent {
  /**
   * Creates a new speech input component
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.onTranscript = options.onTranscript || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.targetInput = options.targetInput || null;
    
    this.isSupported = checkBrowserSupport().supported;
    this.isListening = false;
    this.button = null;
    this.statusIndicator = null;
    
    // Initialize the component
    this.initialize();
  }
  
  /**
   * Initializes the component by creating the UI elements
   */
  initialize() {
    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'speech-input-container';
    
    // Create the microphone button
    this.button = document.createElement('button');
    this.button.className = 'speech-input-button';
    this.button.innerHTML = '<i class="fas fa-microphone"></i>';
    this.button.title = this.isSupported ? 'Click to speak' : 'Speech recognition not supported in this browser';
    this.button.disabled = !this.isSupported;
    
    // Create the status indicator
    this.statusIndicator = document.createElement('span');
    this.statusIndicator.className = 'speech-status-indicator';
    
    // Add event listeners
    this.button.addEventListener('click', () => this.toggleRecording());
    
    // Append elements to the container
    buttonContainer.appendChild(this.button);
    buttonContainer.appendChild(this.statusIndicator);
    
    // Add to the DOM
    this.container.appendChild(buttonContainer);
    
    // Show unsupported message if needed
    if (!this.isSupported) {
      this.showUnsupportedMessage();
    }
  }
  
  /**
   * Toggles recording state
   */
  toggleRecording() {
    if (!this.isSupported) {
      return;
    }
    
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }
  
  /**
   * Starts the speech recognition
   */
  startListening() {
    if (this.isListening || !this.isSupported) {
      return;
    }
    
    const result = startTranscription({
      onResult: (resultData) => this.handleTranscriptionResult(resultData),
      onEnd: () => this.handleTranscriptionEnd(),
      onError: (error) => this.handleTranscriptionError(error)
    });
    
    if (result.success) {
      this.isListening = true;
      this.updateUI(true);
      this.onStatusChange({
        isListening: true,
        sessionId: result.sessionId
      });
    } else {
      this.showError(result.error);
    }
  }
  
  /**
   * Stops the speech recognition
   */
  stopListening() {
    if (!this.isListening) {
      return;
    }
    
    const result = stopTranscription();
    
    if (result.success) {
      this.handleFinalTranscription(result.transcript, result.confidence);
    }
    
    this.isListening = false;
    this.updateUI(false);
    
    this.onStatusChange({
      isListening: false
    });
  }
  
  /**
   * Handles transcription results during recognition
   * @param {Object} resultData The result data from the recognition
   */
  handleTranscriptionResult(resultData) {
    // Update the input field with interim results if available
    if (this.targetInput && resultData.interimTranscript) {
      this.targetInput.value = resultData.interimTranscript;
    }
    
    // If we have a final result, handle it
    if (resultData.isFinal) {
      this.handleFinalTranscription(resultData.transcript, resultData.confidence);
    }
  }
  
  /**
   * Handles the final transcription result
   * @param {string} transcript The final transcript text
   * @param {number} confidence The confidence score
   */
  handleFinalTranscription(transcript, confidence) {
    // If we have a target input, set its value
    if (this.targetInput && transcript) {
      this.targetInput.value = transcript;
      this.targetInput.focus();
      
      // Dispatch input event to trigger any listeners
      const event = new Event('input', { bubbles: true });
      this.targetInput.dispatchEvent(event);
    }
    
    // Call the onTranscript callback
    this.onTranscript({
      transcript,
      confidence
    });
  }
  
  /**
   * Handles the end of transcription
   */
  handleTranscriptionEnd() {
    this.isListening = false;
    this.updateUI(false);
    
    this.onStatusChange({
      isListening: false
    });
  }
  
  /**
   * Handles transcription errors
   * @param {Object} error The error object
   */
  handleTranscriptionError(error) {
    this.isListening = false;
    this.updateUI(false);
    this.showError(error.message);
    
    this.onStatusChange({
      isListening: false,
      error: error.message
    });
  }
  
  /**
   * Updates the UI to reflect the current state
   * @param {boolean} isListening Whether the component is currently listening
   */
  updateUI(isListening) {
    if (isListening) {
      this.button.classList.add('listening');
      this.button.innerHTML = '<i class="fas fa-microphone-slash"></i>';
      this.button.title = 'Click to stop recording';
      this.statusIndicator.classList.add('active');
      this.statusIndicator.textContent = 'Listening...';
    } else {
      this.button.classList.remove('listening');
      this.button.innerHTML = '<i class="fas fa-microphone"></i>';
      this.button.title = 'Click to speak';
      this.statusIndicator.classList.remove('active');
      this.statusIndicator.textContent = '';
    }
  }
  
  /**
   * Shows an error message
   * @param {string} message The error message to display
   */
  showError(message) {
    this.statusIndicator.classList.add('error');
    this.statusIndicator.textContent = message;
    
    setTimeout(() => {
      this.statusIndicator.classList.remove('error');
      this.statusIndicator.textContent = '';
    }, 3000);
  }
  
  /**
   * Shows a message indicating that speech recognition is not supported
   */
  showUnsupportedMessage() {
    this.statusIndicator.classList.add('error');
    this.statusIndicator.textContent = 'Speech recognition not supported in this browser';
  }
} 