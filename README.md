
# Lonely Planet Memories

**Lonely Planet Memories** is an application I designed to help travelers collect, organize, and reminisce about their journeys. Built with the MERN stack, it provides a fully responsive interface for creating, browsing, searching and commenting on personal travel “memories.”

---

## Features

- **Email & Google Authentication**  
  Secure sign‑up / sign‑in with JWT and OAuth.  
- **Create & Edit Memories**  
  Title, body text, images, tags, location and timestamp for each memory.  
- **Pagination & Infinite Scroll**  
  Efficiently browse long lists of posts.  
- **Search & Filtering**  
  Full‑text search by title/body; filter by tags or location.  
- **Recommended Posts**  
  Algorithmic suggestions based on shared tags and interactions.  
- **Comments & Replies**  
  Threaded comments to discuss and share feedback on memories.  
- **Responsive Design**  
  Mobile‑first layout with React and CSS (e.g. Tailwind).  
- **Redux State Management**  
  Central store for auth, posts, pagination, search and UI state.  
- **Ready for Deployment**  
  Configuration and scripts for Heroku, Vercel, Netlify or Docker.

---

## Tech Stack

- **Frontend**: React, Redux, React Router  
- **Backend**: Node.js, Express  
- **Database**: MongoDB, Mongoose  
- **Authentication**: JWT, Google OAuth  
- **Styling**: Tailwind CSS (or your preferred CSS framework)  
- **Tooling**: ESLint, Prettier, concurrently  

---

## Project Structure

```md
.
├── .github/                # GitHub Actions workflows, issue templates
├── client/                 # React front‑end
│   ├── public/             # Static assets
│   ├── src/                # Components, pages, hooks, services
│   ├── .eslintrc.js        # Linting rules
│   ├── package.json
│   └── package-lock.json
├── server/                 # Express + MongoDB back‑end
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── .Procfile           # For Heroku deployment
│   ├── index.js            # Entry point
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v14+  
- **npm** or **yarn**  
- **MongoDB** (local or Atlas)

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/lonely-planet-memories.git
   cd lonely-planet-memories
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**  
   Copy `.env.example` to `.env` in the project root and set your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lonely-planet-memories
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running in Development

```bash
npm run dev
```

- **Server** runs on `http://localhost:5000`  
- **Client** runs on `http://localhost:3000`

### Building for Production

```bash
npm run build      # builds client into /client/build
npm start          # serves built client and runs server
```

---

## Scripts

| Command           | Description                                 |
|-------------------|---------------------------------------------|
| `npm run dev`     | Start client & server with hot reload       |
| `npm run build`   | Build React app for production              |
| `npm start`       | Run the production server                   |
| `npm run lint`    | Run ESLint on both client and server        |

---

## Contributing

1. Fork this repository  
2. Create your feature branch (`git checkout -b feature/XYZ`)  
3. Commit your changes (`git commit -m "Add XYZ feature"`)  
4. Push to your branch (`git push origin feature/XYZ`)  
5. Open a Pull Request  

Please follow the existing code style and include tests where applicable.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.  
