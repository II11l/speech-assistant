# Git Workflow

This document outlines our Git branching strategy and workflow for the Wedding Speech Assistant project.

## Branch Strategy

We use a simplified branching strategy with three types of branches:

1. **Main Branch (`main`)**
   - Contains production-ready code
   - Automatically deployed to production Netlify site
   - Protected from direct pushes
   - Changes only come from the staging branch

2. **Staging Branch (`staging`)**
   - Integration branch for testing features together
   - Automatically deployed to a staging Netlify environment
   - Used for end-to-end testing before production
   - Merges to main only after thorough testing

3. **Feature Branches (`feature/feature-name`)**
   - Created from the staging branch
   - Used for developing individual features or fixes
   - Named descriptively (e.g., `feature/speech-generation`, `fix/login-error`)
   - Each gets its own Netlify preview deployment
   - Merged back to staging when complete

## Workflow

### Starting a New Feature

1. Ensure your local repo is up to date:
   ```bash
   git checkout staging
   git pull origin staging
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Develop and commit your changes:
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. Push your branch to GitHub:
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. Create a pull request to the staging branch
   - Each PR gets a Netlify preview deployment for initial testing

### Testing in Staging

1. After features are merged to staging, they are automatically deployed to the staging environment

2. Perform end-to-end testing in the staging environment:
   - Test all affected functionality
   - Verify integrations between components
   - Check for regressions
   - Test across different devices and browsers if relevant

3. Fix any issues by creating new feature branches from staging

### Deploying to Production

1. Once staging is thoroughly tested and ready:
   - Create a pull request from staging to main
   - Review the changes one last time
   - Merge the PR

2. The main branch will automatically deploy to production

3. Verify the production deployment works correctly

## Commit Conventions

We use conventional commits for clear change history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

Example: `feat: add speech generation form`

## Setting Up Branch Protection

To enforce this workflow, set up branch protection in GitHub:

1. Go to the repository on GitHub
2. Go to Settings > Branches
3. Add branch protection rule for `main`:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators
4. Add similar protection for `staging` if desired

## Netlify Preview Deployments

Netlify automatically creates preview deployments for pull requests:

1. Each feature branch PR gets its own preview URL
2. The staging branch gets a dedicated preview environment
3. The main branch deploys to the production URL

This allows testing in isolation before integrating with other features. 