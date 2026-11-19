# Coy Discover

A privacy-first, mobile-first people discovery application developed as an independent prototype for the **Coy SDE Intern Assignment**.

Coy Discover helps users discover people based on shared interests, college, and city. Its core principle is privacy: **one-sided likes are never revealed, and a match is created only when both users like each other.**

## Features

- **People Discovery:** Browse profiles based on shared interests, college, and location.
- **Swipe Interaction:** Like or pass on profiles through an intuitive interface.
- **Mutual Matching:** Matches are created only when two users like each other.
- **Privacy-First Design:** Incoming likes and one-sided interactions are never exposed through the API.
- **Interest-Based Recommendations:** Profiles are ranked using Jaccard similarity.
- **Match Notifications:** A match celebration modal appears when mutual interest is detected.
- **Matches Dashboard:** View all confirmed mutual matches.
- **Responsive UI:** Mobile-first interface with smooth animations and interactive profile cards.

## Architecture Overview

The application follows a client-server architecture with a separate frontend, backend, and database.

```text
             Next.js Frontend
                    |
                    | HTTP Requests
                    |
              Express API
                    |
              Mongoose ODM
                    |
                 MongoDB
```

### Project Structure

```text
Coy-Assignment/
│
├── client/
│   ├── app/
│   │   ├── discover/
│   │   ├── matches/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   ├── lib/
│   └── public/
│       └── avatars/
│
├── server/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── seed/
│       ├── __tests__/
│       ├── app.ts
│       └── server.ts
│
├── package.json
└── README.md
```

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Backend | Node.js, Express 4, TypeScript |
| Database | MongoDB 8, Mongoose 8 |
| Validation | Zod |
| Security | Helmet, CORS, Express Rate Limit |
| Testing | Vitest, Supertest |

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB 8.x
- npm

Ensure MongoDB is running locally on port `27017`.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Coy-Assignment
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create the backend environment file:

```bash
cd server
cp .env.example .env
```

Create the frontend environment file:

```bash
cd ../client
cp .env.local.example .env.local
```

Configure the required environment variables as described below.

### 4. Seed the Database

```bash
cd server
npm run seed
```

The seed script creates the demo user and 35 mock profiles. It also creates incoming-like records for testing mutual matching.

Copy the generated `DEMO_USER_ID` into `server/.env`.

### 5. Start the Backend

```bash
cd server
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 6. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend runs at:

`http://localhost:3000`

## Environment Variables

### Backend – `server/.env`

| Variable | Description |
|---|---|
| PORT | Backend server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| CLIENT_ORIGIN | Allowed frontend origin |
| DEMO_USER_ID | MongoDB ObjectId of the seeded demo user |
| NODE_ENV | Application environment |

### Frontend – `client/.env.local`

| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_BASE_URL | Backend API base URL (default: http://localhost:5000) |

**Note:** Never commit actual environment files or sensitive configuration values to the repository.

## API Documentation

The backend exposes three main REST API endpoints.

### 1. GET `/feed`

Returns eligible discovery profiles sorted by shared-interest similarity.

- Excludes the demo user.
- Excludes profiles already swiped.
- Returns shared interests for each profile.
- Never exposes incoming likes or one-sided interactions.

### 2. POST `/swipe`

Records a user's like or pass action and checks for mutual interest.

**Request:**

```json
{
  "profileId": "<ObjectId>",
  "action": "like"
}
```

Supported actions: `like`, `pass`.

**Response – No Match:**

```json
{
  "success": true,
  "isMatch": false
}
```

**Response – Mutual Match:**

```json
{
  "success": true,
  "isMatch": true,
  "match": {
    "id": "<match-id>"
  }
}
```

### 3. GET `/matches`

Returns confirmed mutual matches for the demo user.

One-sided likes are never included in this response.

### Error Handling

| Status Code | Description |
|---|---|
| 400 | Invalid request data |
| 404 | Target profile not found |
| 409 | Duplicate swipe request |

## Recommendation Algorithm

Coy Discover uses the **Jaccard Similarity Index** to rank profiles based on common interests.

The formula is:

```text
J(A, B) = |A ∩ B| / |A ∪ B|
```

Where:

- A represents the demo user's interests.
- B represents the candidate's interests.
- Intersection represents shared interests.
- Union represents all unique interests.

Profiles with higher similarity scores appear first. Ties are resolved using MongoDB ObjectId for deterministic ordering.

This is a transparent, rule-based recommendation approach rather than an AI/ML model.

## Privacy and Security

Privacy is a core design principle of Coy Discover.

| Security Measure | Implementation |
|---|---|
| Mutual matching | Match created only after both users like each other |
| Private interactions | Incoming likes are never exposed through API responses |
| Server-side identity | Demo user ID is maintained in backend environment variables |
| Input validation | Zod validation for incoming requests |
| Security headers | Helmet |
| CORS protection | Restricted to configured frontend origin |
| Rate limiting | 200 requests per 15 minutes per IP |
| Duplicate prevention | Unique compound indexes on swipe records and match pair keys |
| Data protection | Mock profiles; no real user data collected |

## Testing

The backend includes automated API tests using **Vitest and Supertest**.

Run the tests:

```bash
cd server
npm test
```

**Test Results: 10 Passed | 0 Failed**

The test suite covers:

- Discovery feed filtering.
- Exclusion of already-swiped profiles.
- Protection against incoming-like information exposure.
- Like and pass functionality.
- Mutual match creation.
- Duplicate swipe prevention.
- Invalid request handling.
- Match retrieval.
- Data persistence across server restarts.

Tests use MongoDB with an embedded fallback configuration.

## Demo Data

The seed script generates:

- 1 demo user.
- 35 mock discovery profiles.
- 7 incoming-like records to demonstrate mutual matching.

**Reviewer Tip:** Like profiles that have already liked the demo user to experience the mutual match flow and match celebration modal.

## Known Limitations

The current implementation is an independent prototype with the following limitations:

1. **Demo Authentication:** No real authentication system is implemented. Requests operate using a server-configured demo user ID.
2. **Mock Data:** Profiles and interactions use seeded mock data.
3. **Local Database:** MongoDB must be available locally for normal application usage.
4. **No Real-Time Synchronization:** Feed and match updates require manual refresh.
5. **No Pagination:** The discovery feed currently returns all eligible profiles in one response.
6. **Static Avatars:** Profile images use locally generated SVG placeholders; image uploads are not implemented.

These limitations are intentional for the scope of the assignment and can be addressed in a production-ready implementation.

---

**Coy Discover**  
Built as an independent prototype for the Coy SDE Intern Assignment.
