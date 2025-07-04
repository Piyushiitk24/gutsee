# Copilot Instructions for Stoma Tracker

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive colostomy management application built with Next.js, TypeScript, and Tailwind CSS. The app helps users track food intake, monitor stoma output, and identify patterns through data analysis.

## Key Features
- Food logging with ingredient breakdown
- Stoma output and gas tracking
- Irrigation quality monitoring
- Pattern recognition and correlation analysis
- Predictive meal risk scoring
- Progress tracking and visualization
- Mobile-first responsive design
- Offline PWA capabilities

## Technical Stack
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context/Zustand
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI or shadcn/ui
- **PWA**: next-pwa for offline functionality

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Implement proper error handling and loading states
- Follow React hooks best practices
- Use Tailwind classes for styling
- Implement proper form validation
- Add proper TypeScript interfaces for all data structures
- Use server components where appropriate
- Implement proper SEO with Next.js metadata

## Data Models
- User profiles and settings
- Food items with detailed ingredient data
- Meal logs with portions and timing
- Stoma output tracking (timing, volume, consistency)
- Gas production logs
- Irrigation quality records
- Symptom correlations
- Pattern analysis results

## API Design
- RESTful API structure
- Proper HTTP status codes
- Input validation and sanitization
- Error handling middleware
- Authentication and authorization
- Rate limiting for API endpoints

## Testing Strategy
- Unit tests for utilities and components
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Accessibility testing
- Performance testing

## Security Considerations
- Input sanitization for all user data
- Secure authentication implementation
- HTTPS enforcement
- Data encryption for sensitive information
- GDPR compliance for health data
