/**
 * Claude AI Assistant Service
 * Client-side service for interacting with the Claude API via Netlify functions
 */

class ClaudeService {
  constructor() {
    // Function URL will be relative when deployed
    this.functionUrl = '/.netlify/functions/claude-assistant';
  }

  /**
   * Send a message to the Claude AI assistant
   * 
   * @param {string} message - The user's message
   * @param {string} conversationId - Optional conversation ID for tracking
   * @param {Object} projectData - Optional project data for context
   * @returns {Promise<Object>} - The assistant's response
   */
  async sendMessage(message, conversationId = null, projectData = null) {
    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
          project_data: projectData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error communicating with assistant');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in Claude service:', error);
      throw error;
    }
  }

  /**
   * Generate a speech draft based on requirements
   * 
   * @param {Object} requirements - The speech requirements
   * @returns {Promise<Object>} - The generated speech draft
   */
  async generateSpeech(requirements) {
    try {
      // Construct a detailed prompt for speech generation
      const promptMessage = `Generate a wedding speech with the following requirements:
Role: ${requirements.role || 'Speaker'}
Relationship to person: ${requirements.relationship_length || 'Not specified'}
Tone preference: ${requirements.tone_preference || 'Balanced'}
Desired length: ${requirements.desired_length || '5'} minutes
Key anecdotes: ${JSON.stringify(requirements.key_anecdotes || [])}
People to mention: ${JSON.stringify(requirements.who_to_mention || [])}
Additional context: ${requirements.additional_context || ''}

Please format the speech properly with paragraphs and clear structure.`;

      // Call the assistant with this specific prompt
      const response = await this.sendMessage(promptMessage, null, requirements);
      
      return {
        content: response.response,
        suggestions: response.suggestions
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Analyze an existing speech draft
   * 
   * @param {string} speechContent - The speech content to analyze
   * @returns {Promise<Object>} - Analysis of the speech
   */
  async analyzeSpeech(speechContent) {
    try {
      const promptMessage = `Analyze this wedding speech and provide feedback on:
1. Estimated speaking time
2. Tone analysis (formal, humorous, emotional)
3. Improvement suggestions

Speech: ${speechContent}`;

      const response = await this.sendMessage(promptMessage);
      
      return {
        analysis: response.response,
        suggestions: response.suggestions
      };
    } catch (error) {
      console.error('Error analyzing speech:', error);
      throw error;
    }
  }
}

// Export as singleton
const claudeService = new ClaudeService();
export default claudeService; 