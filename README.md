# Women’s Safety, Empowerment, and Entrepreneurship Hub

A beginner-friendly Node.js project featuring a responsive website, safety guidance, empowerment resources, entrepreneurship starter roadmap, external official links, and a working contact form.

## Features
- Responsive landing page for desktop and mobile
- Safety and digital privacy starter guidance
- Empowerment and skill-building cards
- Beginner entrepreneurship roadmap
- Resource links to official Indian websites
- Contact form with Node.js API
- Messages saved locally in `data/messages.json`
- No external npm packages required

## Requirements
- Node.js 18 or newer

## How to run
1. Extract the ZIP file.
2. Open the extracted project folder in VS Code or a terminal.
3. Run `npm start` (or `node server.js`).
4. Open `http://localhost:3000` in your browser.

## API endpoints
- `GET /api/health` — server status
- `GET /api/messages` — list message metadata (does not return message body or email)
- `POST /api/messages` — save a contact form submission

## Project structure
```
Womens_Safety_Empowerment_Entrepreneurship_Hub/
├── server.js
├── package.json
├── README.md
├── data/
│   └── messages.json
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

## Important notes
This is an educational demo, not a confidential support service or a production safety platform. Do not submit sensitive personal information. Messages are stored in plain text on the local server; for real deployment, add authentication, access controls, HTTPS, validation, retention/deletion policies, and secure database storage. The contact form is not monitored for emergencies. In India, call 112 for immediate emergency assistance.
