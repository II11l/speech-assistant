// Claude API integration - Netlify serverless function
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Claude API Configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';

// Read the briefing document
const briefingPath = path.join(__dirname, 'briefing_ai_assistant.md');
const briefingContent = fs.readFileSync(briefingPath, 'utf8');

// Simple retry logic for network errors
const callClaudeWithRetry = async (url, data, headers, retries = 1) => {
  try {
    return await axios.post(url, data, { headers });
  } catch (error) {
    // Only retry on network errors or rate limits, not on other errors
    if ((error.code === 'ECONNRESET' || error.response?.status === 429) && retries > 0) {
      console.log(`Retrying Claude API call, attempts remaining: ${retries}`);
      return await callClaudeWithRetry(url, data, headers, retries - 1);
    }
    throw error;
  }
};

// Simple token estimation (not perfect but sufficient for safety checks)
const estimateTokens = (text) => Math.ceil(text.length / 4);

exports.handler = async (event, context) => {
  console.log('Claude assistant function called');
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { conversation_id, message, project_data } = requestBody;
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }
    
    // Basic token check to prevent extremely large messages
    if (estimateTokens(message) > 100000) {
      console.log('Message too large, rejecting request');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message too large, exceeds token limit' })
      };
    }

    // Use the briefing document as the system prompt
    let systemPrompt = briefingContent;
    
    // Add project-specific context if available
    if (project_data) {
      systemPrompt += "\n\nAdditional context for this speech: " + 
        JSON.stringify(project_data);
    }

    const requestData = {
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      system: systemPrompt
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    };

    console.log(`Calling Claude API with model: ${CLAUDE_MODEL}`);
    
    // Call Claude API with retry capability
    const response = await callClaudeWithRetry(
      CLAUDE_API_URL,
      requestData,
      headers
    );

    // Extract the assistant response
    const assistantResponse = response.data.content[0].text;
    console.log('Successfully received Claude API response');
    
    // Return the assistant response
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: conversation_id || 'new',
        response: assistantResponse,
        suggestions: extractSuggestions(assistantResponse)
      })
    };
  } catch (error) {
    console.error('Error calling Claude API:', error.message);
    
    // Better error classification for client responses
    if (error.response?.status === 429) {
      return { 
        statusCode: 429, 
        body: JSON.stringify({ error: 'Rate limit exceeded, please try again later' }) 
      };
    } else if (error.response?.status === 401) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: 'Authentication error with Claude API' }) 
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Error processing request',
          details: error.message
        })
      };
    }
  }
};

// Helper function to extract suggested follow-up questions
function extractSuggestions(text) {
  // Simple implementation - could be enhanced with NLP
  const suggestions = [];
  
  // Look for questions in the text
  const sentences = text.split(/[.!?]\s+/);
  for (const sentence of sentences) {
    if (sentence.trim().endsWith('?')) {
      suggestions.push(sentence.trim());
    }
  }
  
  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
} 