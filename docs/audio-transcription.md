# Audio Transcription Component Documentation

The Audio Transcription Component provides voice-to-text functionality using the Web Speech API. It allows users to input content by speaking rather than typing, making the interface more accessible and user-friendly.

## Implementation Details

### Core Technologies
- **Web Speech API (SpeechRecognition interface)** - Browser-native speech recognition
- **JavaScript ES6 Modules** - For clean code organization
- **Component-based architecture** - For reusability across the application

### Modules

1. **speech-recognition.js**
   - Core implementation of the Web Speech API
   - Handles cross-browser compatibility
   - Manages transcription sessions
   - Provides utility functions for checking browser support

2. **components/speech-input.js**
   - UI component for speech input
   - Creates a microphone button in the interface
   - Handles user interaction with the speech recognition
   - Provides visual feedback during recording

3. **transcription/transcription-service.js**
   - Service layer that matches the API specifications
   - Handles session management
   - Connects to storage for saving transcriptions
   - Implements the endpoint contracts defined in the API specs

4. **transcription/chat-transcription-integration.js**
   - Integration layer for the chat interface
   - Connects the speech input component to the chat UI
   - Handles the flow of data between components

### Features

- **Browser Support Detection**: Automatically detects if the user's browser supports the Web Speech API
- **Session Management**: Handles the lifecycle of transcription sessions
- **Visual Feedback**: Provides clear status indications during the transcription process
- **Graceful Degradation**: Falls back to manual input when speech recognition is not supported
- **Integration with Project Context**: Allows saving transcriptions to specific project fields

### Cross-Component Integration

The Audio Transcription Component integrates with:

1. **Chat Interface Component**:
   - Receives voice input and converts to text for the chat
   - Displays transcription status within the chat interface

2. **Storage Component**:
   - Saves transcriptions to the database
   - Updates project requirements with transcribed content

## Usage

### Basic Usage in Chat

The component is automatically initialized in the dashboard when a user is logged in:

```javascript
// Initialize speech recognition in the chat interface
const result = await initChatTranscription({
  container: inputBox,
  inputElement: chatInput
});
```

### Saving Transcriptions to a Project

```javascript
// Save a transcription to a project
const result = await saveTranscriptionToProject({
  projectId: "project-uuid",
  transcription: "Transcribed text content",
  field: "additional_context" // or "key_anecdotes"
});
```

## Technical Considerations

### Privacy and Security
- All speech processing happens client-side in the browser
- No audio data is sent to servers
- Requires user permission to access the microphone

### Performance
- Minimal impact on application performance
- No additional network requests for transcription
- Small code footprint (~5KB minified)

### Accessibility
- Provides an alternative input method for users who have difficulty typing
- Clear visual indicators for recording state
- Keyboard accessible controls

### Browser Compatibility
- Chrome/Edge: Full support
- Safari: Partial support (requires user permission)
- Firefox: Limited support
- Internet Explorer: Not supported

## Future Enhancements

1. **Language Selection**: Allow users to select their preferred language for more accurate transcription
2. **Custom Vocabulary**: Add support for wedding-specific terminology to improve accuracy
3. **Offline Support**: Add a fallback for when the Web Speech API is temporarily unavailable
4. **Transcription Editing**: Allow users to edit transcriptions before saving 