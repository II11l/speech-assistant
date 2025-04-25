# Wedding Speech Assistant - Tech Stack

## Frontend
- **HTML/CSS/JavaScript** - Core web technologies with minimal frameworks
- **Vanilla JavaScript** with some React components for interactive elements
- **Simple CSS** with minimal utility classes for responsive design

## Backend & Data
- **Supabase** - For database, authentication, and storage
  - PostgreSQL database for all user data and speech content
  - Standard authentication (email+password for login, with first name collected during signup)
  - Text-only storage approach (transcribed audio rather than raw recordings)
- **Netlify Functions** - Serverless functions for any custom API needs

## Audio Transcription
- **Web Speech API** (SpeechRecognition interface)
  - Built into modern browsers - no additional cost
  - Client-side processing - no server dependency
  - Good accuracy for clear speech in common languages
  - Fallback to manual entry if browser doesn't support or accuracy is low

## Third-Party APIs
- **Stripe Checkout** - Simple payment processing (credit cards, Apple Pay, Google Pay)
- **Claude API** - Only for speech generation, not transcription

## Deployment
- **Netlify** - Hosting and deployment pipeline
  - Continuous deployment from Git repository
  - Form handling for contact forms
  - Serverless functions support

## Development Tools
- **Git** - Version control
- **npm** - Package management (minimal dependencies)
- **ESLint** - Code quality
- **Prettier** - Code formatting

## Project Structure
```
wedding-speech-assistant/
├── index.html              # Landing page
├── dashboard/              # User personal space
├── css/                    # Stylesheets
├── js/                     # JavaScript files
│   └── speech-recognition.js  # Web Speech API implementation
├── components/             # Reusable UI components
├── functions/              # Netlify serverless functions
├── supabase/               # Database schema & queries
└── public/                 # Static assets
```

This lean stack prioritizes simplicity and maintainability while meeting all functional requirements specified in the project specification.
