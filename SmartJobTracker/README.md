# CareerTrack — Smart Job Application Tracker

CareerTrack is a full-stack web application that helps students record job opportunities and track each application through Applied, Interview, Selected, and Rejected stages.

## Features
- Add, view, edit, and delete job applications
- Track company, role, location, job type, date, status, and notes
- Dashboard statistics for total applications, interviews, offers, and pending responses
- Search by company, role, or location
- Filter by application status
- Responsive layout for desktop and mobile
- REST API built with Express and MongoDB

## Tech stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose

## Requirements
- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Run locally
1. Clone the repository:
   ```bash
   git clone YOUR_PUBLIC_GITHUB_REPOSITORY_URL
   cd SmartJobTracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root using `.env.example` as a template.
4. Set `MONGODB_URI` to your local MongoDB URL or MongoDB Atlas connection string.
5. Start the application:
   ```bash
   npm start
   ```
6. Open http://localhost:5000

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/jobs` | List applications |
| POST | `/api/jobs` | Create an application |
| PATCH | `/api/jobs/:id` | Update an application |
| DELETE | `/api/jobs/:id` | Delete an application |

## Environment variables
- `PORT`: Server port (defaults to 5000)
- `MONGODB_URI`: MongoDB connection string

## Current limitations
- Authentication and individual user accounts are not implemented.
- Job listings are entered manually; external job-board integrations are not included.
- Automated email reminders are not implemented.
- Production deployment requires a configured MongoDB database and environment variables.

## Testing
Use the UI to create, edit, search, filter, and delete application records. The API can also be tested with Thunder Client or Postman.
