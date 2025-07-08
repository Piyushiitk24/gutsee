# Contributing to Stoma Tracker

Thank you for your interest in contributing to Stoma Tracker! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git for version control
- A Supabase account (free tier available)
- Google AI Studio API key for Gemini integration

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/stoma-tracker.git
   cd stoma-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase and Gemini AI credentials
   ```

4. **Set up the database**
   Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual feature development
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` types - use specific types or `unknown`
- Use meaningful variable and function names

### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Use Next.js App Router patterns

### Styling
- Use Tailwind CSS utility classes
- Follow the established design system
- Ensure responsive design on all components
- Maintain accessibility standards (WCAG 2.1)

### Code Organization
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── intelligent/    # AI-powered components
├── lib/                # Utilities and configurations
├── context/            # React context providers
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for utility functions
- Test component logic and props
- Mock external dependencies

### Integration Tests
- Test API endpoints
- Test database operations
- Test component interactions

### E2E Tests
- Test critical user workflows
- Test authentication flow
- Test data persistence

## 📚 Documentation

### Code Documentation
- Document complex functions with JSDoc
- Add comments for business logic
- Explain any non-obvious implementations

### User Documentation
- Update README.md for new features
- Create guides for complex features
- Update API documentation

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

Use the bug report template:

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 98]
- Node.js: [e.g., 18.0.0]

## Additional Context
Any other context about the problem
```

## ✨ Feature Requests

For feature requests:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** in detail
3. **Explain the use case** and benefits
4. **Consider implementation** complexity
5. **Provide mockups** if applicable

## 🔍 Code Review Process

### For Contributors
- Keep PRs focused and small
- Write clear commit messages
- Update tests and documentation
- Respond to feedback promptly

### For Reviewers
- Be constructive and respectful
- Focus on code quality and standards
- Test functionality when possible
- Approve when ready

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## 📞 Getting Help

- 💬 **GitHub Discussions**: For questions and community chat
- 🐛 **GitHub Issues**: For bug reports and feature requests
- 📧 **Email**: For private concerns or security issues

## 📋 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add meal risk scoring algorithm
fix: resolve authentication redirect issue
docs: update API documentation for meal endpoints
style: format code with prettier
refactor: extract common validation logic
test: add unit tests for food logging
chore: update dependencies to latest versions
```

## 🚫 What Not to Contribute

- Breaking changes without discussion
- Code that doesn't follow our standards
- Features without proper testing
- Changes that reduce accessibility
- Proprietary or copyrighted code

## 📄 License

By contributing to Stoma Tracker, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Stoma Tracker better for everyone! 🙏
