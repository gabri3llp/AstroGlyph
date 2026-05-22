# 🌌 AstroGlyph — Constellation Authentication System

My video link: https://drive.google.com/file/d/1X8XxgXpWOKGqrsaZ165A36jjXyze_dQk/view?usp=sharing

> A creative MERN stack authentication system where your password is a constellation you draw across the stars.

---

## What is AstroGlyph?

AstroGlyph replaces the traditional text password with a *constellation drawing*. Instead of typing characters, users click and drag across a field of 18 stars to create a unique glyph pattern. The sequence of star IDs becomes their password — hashed, stored, and verified just like any secure auth system.

No words. No numbers. Just your pattern written in the cosmos.

---

## How the Creative Authentication Works

### Registration
1. User fills in their username and email
2. They draw a constellation on the star canvas — connecting at least 4 stars in sequence
3. They draw it a second time to confirm (both sequences must match exactly)
4. The star sequence (e.g. `3-7-1-11-5`) is sent to the backend, hashed with **bcrypt**, and stored
5. A JWT token is issued and stored in localStorage

### Login
1. User enters their email
2. They redraw their constellation on the same star canvas
3. The sequence is sent to the backend
4. bcrypt compares the drawn sequence against the stored hash
5. If it matches, a new JWT is issued and the user is authenticated

### Why it's secure
- The raw glyph sequence is **never stored** — only the bcrypt hash
- The star field uses **fixed positions** so the canvas is identical on every device
- JWT tokens expire after 7 days
- Protected routes reject requests without a valid token

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcrypt |

---

## Project Structure

```
AstroGlyph/
├── Backend/
│   ├── Models/
│   │   └── user.js          # Mongoose schema + bcrypt pre-save hook
│   ├── Routes/
│   │   └── auth.js          # register, login, /me routes + verifyToken middleware
│   ├── server.js            # Express app entry point
│   └── .env                 # MONGO_URI, JWT_SECRET, PORT
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── StarField.jsx     # Interactive SVG constellation canvas
    │   │   ├── glyphUtils.js     # Star generation + sequence encoding helpers
    │   │   └── NavBar.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx       # Hero page with demo starfield
    │   │   ├── Registration.jsx  # Register with glyph confirmation
    │   │   ├── Login.jsx         # Login with glyph draw
    │   │   └── Checkedin.jsx     # Protected user profile page
    │   ├── AuthContext.jsx       # Global auth state + all API calls
    │   └── App.jsx               # Routes setup
    └── vite.config.js
```

---

## Running the Project Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <https://github.com/gabri3llp/AstroGlyph.git>
cd AstroGlyph
```

### 2. Set up the Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:
```
MONGO_URI=mongodb://localhost:27017/astroglyph
JWT_SECRET=your_secret_key_here
PORT=5000
```

My .env file will not be included in my repo due to security issues.

Start the server:
```bash
npm start
```

The backend runs on `http://localhost:5000`

### 3. Set up the Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

### 4. Open the app
Visit `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login with glyph | No |
| GET | `/api/auth/me` | Get current user | Yes (Bearer JWT) |

---

## Key Implementation Details

**`glyphUtils.js`** — Generates the fixed 18-star layout and provides helper functions:
- `encodeGlyphSequence([3,7,1,11,5])` → `"3-7-1-11-5"` (the string that gets hashed)
- `sequencesMatch()` — validates both draws match during registration
- `getSortedStarIds()` — strips draw order for safe database storage

**`StarField.jsx`** — SVG canvas component that tracks mouse drag events, finds the nearest star, and builds the sequence array in real time.

**`verifyToken` middleware** — reads the `Authorization: Bearer <token>` header, verifies it with `jwt.verify()`, and attaches `req.userId` to the request for protected routes.

---

## Author

Built for the Creative Authentication System assignment. 
By Gabriel Pulella 251298