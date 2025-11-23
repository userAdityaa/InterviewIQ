# InterviewIQ

InterviewIQ is an AI-powered interview preparation platform designed to help students and professionals practice job interviews with intelligent voice agents. The platform provides personalized interview simulations, instant feedback, and analytics to boost confidence and readiness for real-world interviews.

## System Design & Architecture

### Overview

InterviewIQ is built as a full-stack web application using modern technologies and best practices. The system is modular, scalable, and optimized for real-time interaction and feedback.

### Architecture Components

**Frontend:**

- Built with Next.js (React framework) for server-side rendering and fast client-side navigation.
- UI components are styled using Tailwind CSS and shadcn/ui for a modern, responsive experience.
- Authentication flows and interview management are handled via React components and context.

**Backend:**

- Uses Firebase for authentication, real-time database, and cloud storage.
- API routes in Next.js handle interview creation, feedback generation, and user management.

**AI Integration:**

- Vapi AI Voice Agents provide voice-based interview simulation.
- Google Gemini is used for advanced AI feedback and transcript analysis.

**Data Flow:**

1. User signs up/signs in via Firebase Authentication.
2. User creates a mock interview session; questions are generated or selected.
3. The interview is conducted via a voice agent (Vapi AI), with real-time transcript and feedback.
4. Feedback and analytics are stored in Firebase and displayed in the user dashboard.

### Key Features

- Secure authentication and user management
- Voice-based AI interview simulation
- Real-time feedback and transcript analysis
- Dashboard for tracking interview history and progress
- Responsive design for desktop and mobile

### Folder Structure

- `/app`: Next.js app directory (routing, pages, API)
- `/components`: Reusable React components (UI, forms, interview cards)
- `/lib`: Utility functions, API integrations, and business logic
- `/firebase`: Firebase client and admin setup
- `/public`: Static assets (images, icons)
- `/types`: TypeScript type definitions

### Deployment

- InterviewIQ can be deployed on Vercel or any platform supporting Next.js and Firebase.

### Extensibility

- Easily add new interview types, feedback models, or analytics modules
- Modular component and API design for future enhancements

## Getting Started

1. Clone the repository
2. Install dependencies (`npm install`)
3. Set up Firebase and environment variables
4. Run locally (`npm run dev`)

## License

MIT
