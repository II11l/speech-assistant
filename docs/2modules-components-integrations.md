# Modules, Components, and Integrations


## Modules (User-Journey Based)
- [🔄] Module 1: Homepage and Account Creation Module
- [ ] Module 2: Personal Space and Info Collection Module
- [🔄] Module 3: Speech Generation Module
- [ ] Module 4: Payment Module
- [ ] Module 5: Draft Refinement Module


## Components (Technical Implementation)
- [✅] A: Auth Component - Handles user authentication and session management
- [🔄] B: Chat Interface Component - Part of Module 2, handles the conversation UI
- [🔄] C: AI Assistant Component - Manages conversation logic and response generation
- [ ] D: Speech Processing Component - Handles speech creation and modifications
- [ ] E: Payment Processing Component - Manages transactions and content unlocking
- [✅] F: Storage Component - Handles data persistence across the application
- [✅] G: Audio Transcription Component - Uses Web Speech API for voice input processing


## Integrations

### External Services
- [🔄] Supabase - For database, authentication, and storage
  - [✅] PostgreSQL database integration
  - [✅] Auth API integration
  - [✅] Storage API integration
- [🔄] Netlify - For hosting and serverless functions
  - [✅] Continuous deployment setup
  - [✅] Serverless functions configuration
  - [✅] Environment variables configuration
  - [ ] Staging environment setup
  - [ ] Preview deployments configuration for branches
- [🔄] GitHub - For version control and collaboration
  - [✅] Repository setup
  - [✅] Initial codebase commit
  - [✅] Documentation of workflow
  - [ ] Staging branch creation (immediate next step)
  - [ ] Branch protection rules setup
  - [ ] Pull request templates (if needed)
- [🔄] Claude API - For speech generation and assistant capabilities
  - [✅] API key configuration and secure storage
  - [✅] Basic serverless function for Claude API calls
  - [ ] Conversation history management
  - [ ] Payment tier restrictions
- [ ] Stripe Checkout - For payment processing
  - [🔄] API key configuration and secure storage
  - [ ] Payment intent creation
  - [ ] Checkout session handling
  - [ ] Payment verification
  - [ ] Frontend payment UI components
  
  #### Stripe Integration - Production Deployment Requirements
  - [🔄] Add Stripe publishable and secret keys to Netlify environment variables (prepared locally)
  - [ ] Set up Stripe webhook endpoint in production
  - [ ] Configure webhook signing secret in Netlify environment
  - [ ] Update webhook endpoint URL in Stripe dashboard
  - [ ] Switch from test mode to production mode
  - [ ] Verify production checkout flow before launch

### Browser APIs
- [✅] Web Speech API - For audio transcription
  - [✅] SpeechRecognition interface implementation
  - [✅] Fallback handling for unsupported browsers

### Cross-Component Integrations
- [✅] A: Auth Component ↔ F: Storage Component
- [🔄] B: Chat Interface Component ↔ C: AI Assistant Component
- [ ] C: AI Assistant Component ↔ D: Speech Processing Component
- [ ] C: AI Assistant Component ↔ F: Storage Component
- [ ] D: Speech Processing Component ↔ F: Storage Component
- [ ] E: Payment Processing Component ↔ F: Storage Component
- [ ] E: Payment Processing Component ↔ A: Auth Component
- [✅] G: Audio Transcription Component ↔ B: Chat Interface Component

## Implementation Status Legend
- [ ] Not Started
- [🔄] In Progress
- [✅] Completed
- [🧪] Testing




## Implementation Details

### Completed Components

#### A: Auth Component
- Implemented user registration, login, and logout functionality
- Created password reset flow
- Added session management
- Built UI components for authentication forms
- Integrated with Supabase Auth

#### F: Storage Component
- Created database schema for all required tables
- Implemented CRUD operations for speech projects
- Added requirements and drafts storage
- Implemented Row Level Security policies
- Connected with Auth Component for user-specific data

#### G: Audio Transcription Component
- Implemented Web Speech API integration for voice recognition
- Created UI components for recording speech
- Added browser compatibility detection
- Implemented fallback for unsupported browsers
- Connected with Chat Interface for seamless transcription input
- Created service layer matching API specifications
- Added database integration for saving transcriptions

### In Progress Components

#### B: Chat Interface Component
- Basic UI structure created in dashboard.html
- Authentication-protected access implemented
- Message input and display areas created
- Speech input functionality integrated
- Still needs connection to AI Assistant

#### C: AI Assistant Component
- Implemented Claude API integration via Netlify serverless function
- Created secure environment configuration for API keys
- Implemented briefing document as system prompt
- Added basic error handling with retries for network issues
- Implemented token estimation and limiting for large inputs
- Added logging for debugging and monitoring
- Created client-side service for interacting with the function
- Still needs:
  - User authentication verification
  - Conversation history management
  - Integration with Storage Component for saving drafts
  - Payment status verification
  - Speech analysis capabilities

#### Supabase Integration
- Complete for auth and database functionality
- User profiles with payment status tracking
- Project, requirements, and drafts storage
- Now supports speech transcription storage
- Still needs storage for attachments/media (if needed)

### Netlify Integration
- Basic serverless function configuration completed
- Environment variables setup
- Deployment configuration with netlify.toml
- Continuous deployment from GitHub repository configured
- Secure handling of API keys and environment variables implemented
- Clean Git repository setup to prevent secrets exposure
- Still needs:
  - Staging environment configuration
  - Branch-specific deploy contexts
  - Preview deployment testing

### GitHub Integration
- Repository initialized and configured
- Basic documentation created
- README with project overview and setup instructions
- Git workflow documentation created with branching strategy
- Next steps:
  - Create staging branch (immediate priority)
  - Configure branch protection rules
  - Test pull request workflow

## Claude API Integration - Technical Details

### Implementation Architecture
The Claude API integration follows a serverless approach to maintain security and scalability:

1. **Serverless Function (`functions/claude-assistant.js`)**
   - Handles all requests to the Claude API
   - Securely manages API key via environment variables
   - Processes user messages and returns AI responses
   - Implements error handling and basic rate limiting

2. **System Prompt Management**
   - Uses a centralized briefing document (`functions/briefing_ai_assistant.md`)
   - Loads the briefing at runtime to allow easy updates
   - Combines briefing with user-specific context

3. **Client-Side Service (`js/services/claude-service.js`)**
   - Provides a clean interface for frontend components
   - Handles request formatting and error handling
   - Manages specific use cases (chat, speech generation, analysis)

### Security Measures
- API keys stored in environment variables (.env locally, Netlify env in production)
- Keys never exposed to client-side code
- Added to .gitignore to prevent accidental commits
- Git history cleaned of any sensitive data
- Rate limiting and token restrictions to prevent abuse

### Error Handling
- Implemented retries for transient network errors
- Specific error responses based on error type
- Client-friendly error messages
- Logging for debugging

### Future Integration Points
1. **User Authentication**
   - Validate JWT tokens from request headers
   - Verify user identity before processing requests

2. **Storage Integration**
   - Save generated speeches to Supabase
   - Retrieve and update drafts

3. **Payment Verification**
   - Check user's payment status
   - Restrict functionality based on subscription level

4. **Conversation Management**
   - Store conversation history
   - Include previous context in AI requests

### Model Configuration
- Using the latest Claude model: claude-3-7-sonnet-20250219
- Configured for wedding speech generation
- Optimized prompts for conversational guidance 

## Stripe Integration - Planned Implementation

### Implementation Architecture
The Stripe integration will follow a serverless approach similar to the Claude API integration:

1. **Serverless Functions**
   - `functions/stripe-checkout.js` - Creates checkout sessions
   - `functions/stripe-webhook.js` - Handles payment confirmations
   - `functions/payment-options.js` - Provides available payment options

2. **Payment Flow**
   - User completes Module 3 (Speech Generation)
   - Payment prompt displayed in chat interface
   - User initiates checkout process
   - Redirect to Stripe Checkout (hosted by Stripe)
   - Return to application after payment
   - Update user status and unlock speech

3. **Client-Side Components**
   - Payment button/UI in dashboard
   - Success/failure handling
   - Unlocked content display

### Database Integration
- Update user payment_status from 'free' to 'paid'
- Record payment details in payment_records table
- Link payments to user accounts

### Security Considerations
- API keys stored in environment variables
- Webhook signature verification
- Secure redirect handling

### Testing Strategy
- Use Stripe test mode and test cards
- Simulate successful and failed payments
- Verify database updates and UI changes 

## Next Priority Action Items

1. **GitHub Configuration**
   - Create staging branch (immediate priority)
   ```bash
   git checkout -b staging
   git push -u origin staging
   ```
   - Set up branch protection rules after team grows

2. **Netlify Configuration**
   - Configure staging environment deployment
   - Set up branch preview deployments

3. **Code Integration**
   - Complete Chat Interface ↔ AI Assistant integration
   - Implement conversation history management 