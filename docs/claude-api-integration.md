# Claude API Integration

This document explains how the Wedding Speech Assistant application integrates with the Claude API for speech generation and AI assistance.

## Architecture Overview

The Claude API integration follows a secure pattern:

1. Client-side JavaScript makes requests to Netlify serverless functions
2. Serverless functions securely call the Claude API with API keys
3. Responses are processed and returned to the client

This pattern ensures that:
- API keys are never exposed to client-side code
- Requests are properly authenticated
- Rate limiting and error handling are managed server-side

## Components

### Serverless Function

The `functions/claude-assistant.js` serverless function:
- Receives requests from the client application
- Authenticates with the Claude API using environment variables
- Transforms requests into the format required by Claude
- Handles errors and retries
- Processes and formats responses for the client

### Client-side Service

The `js/services/claude-service.js` file:
- Provides a JavaScript interface for interacting with the serverless function
- Handles client-side errors
- Formats requests for specific use cases (chat, speech generation, analysis)
- Manages conversation context

## Usage

### Chat Interface

```javascript
import claudeService from '../services/claude-service.js';

// Send a user message to Claude
async function sendMessage(userMessage) {
  try {
    const response = await claudeService.sendMessage(userMessage);
    // Handle the response
    displayMessage(response.response);
    
    // Show suggested follow-ups
    if (response.suggestions.length > 0) {
      displaySuggestions(response.suggestions);
    }
  } catch (error) {
    handleError(error);
  }
}
```

### Speech Generation

```javascript
import claudeService from '../services/claude-service.js';

// Generate a speech based on requirements
async function generateSpeech(requirements) {
  try {
    const response = await claudeService.generateSpeech(requirements);
    // Handle the generated speech
    displaySpeech(response.content);
  } catch (error) {
    handleError(error);
  }
}
```

## Security Considerations

1. **API Key Protection**:
   - API keys are stored in environment variables
   - Never exposed to client-side code
   - Not included in version control

2. **Request Validation**:
   - All input is validated before sending to Claude
   - Rate limiting is implemented to prevent abuse
   - Authentication is required for all requests

3. **Error Handling**:
   - Graceful handling of API errors
   - User-friendly error messages
   - Detailed logging for debugging

## Prompt Engineering

The integration includes carefully designed prompts for different use cases:

1. **Chat Assistance**:
   - System prompt establishes the AI as a wedding speech assistant
   - Context from the user's project is included when available
   
2. **Speech Generation**:
   - Structured prompts that include all speech requirements
   - Clear instructions for speech formatting and style
   
3. **Speech Analysis**:
   - Focused prompts for specific analysis tasks
   - Clear structure for response processing

## Future Improvements

- Implement conversation history for more context-aware responses
- Add support for more complex speech requirements
- Enhance error handling and retry mechanisms
- Optimize prompts for better response quality 