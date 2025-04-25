# Wedding Speech Assistant

A web application that helps users create personalized wedding speeches through a guided conversation with an AI assistant.

## Overview

The Wedding Speech Assistant walks users through the process of creating a personalized wedding speech by gathering information about the wedding, the couple, and the speaker's relationship to them. The application uses Claude AI to generate speech drafts based on this information.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: 
  - Supabase (database, authentication, storage)
  - Netlify Functions (serverless)
- **APIs**:
  - Claude AI API (speech generation)
  - Web Speech API (audio transcription)
- **Deployment**: Netlify

## Local Development Setup

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wedding-speech-assistant.git
   cd wedding-speech-assistant
   ```

2. Create a `.env` file in the project root with the following variables:
   ```
   # Claude API credentials
   CLAUDE_API_KEY=your_claude_api_key_here
   CLAUDE_MODEL=claude-3-sonnet-20240229
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   netlify dev
   ```
   
5. Access the application at `http://localhost:8888`

## GitHub Workflow

We use a simplified branch strategy with three main branches:

- `main` - Production-ready code
- `staging` - Integration and testing branch
- Feature branches - Named as `feature/feature-name`

For complete details on our Git workflow, see [Git Workflow Documentation](docs/git-workflow.md).

## Deployment

The application is automatically deployed to Netlify:
- `main` branch → Production environment
- `staging` branch → Staging environment 
- Feature branches → Preview deployments

Environment variables must be configured in the Netlify dashboard.

### Environment Variables in Netlify

1. Go to Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment variables
3. Add the required environment variables:
   - `CLAUDE_API_KEY`
   - `CLAUDE_MODEL`

## Project Structure

```
wedding-speech-assistant/
├── index.html              # Landing page
├── dashboard.html          # User dashboard
├── login.html              # Login page
├── register.html           # Registration page
├── styles.css              # Main stylesheet
├── js/                     # JavaScript files
├── functions/              # Netlify serverless functions
├── docs/                   # Project documentation
└── images/                 # Static images
```

## Documentation

For more detailed documentation, see the `/docs` directory:

- [Tech Stack](docs/1tech-stack.md)
- [Modules & Components](docs/2modules-components-integrations.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Claude API Integration](docs/claude-api-integration.md)
- [Git Workflow](docs/git-workflow.md)
