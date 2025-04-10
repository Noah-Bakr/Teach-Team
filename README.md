# TeachTeam (TT) – Tutor Application Management (Frontend Prototype)

COSC2758 – Assignment 1 | RMIT University – Semester 1, 2025

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/rmit-fsd-2025-s1/s3575564-s4095646-a1.git
cd s3575564-s4095646-a1
```

### 2. Install Dependencies

Make sure you have **Node.js (v18+)** and npm installed. Then run:

```bash
npm install
```

### 3. Run the Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Project Structure

```bash
src/
│
├── components/       # Header, Footer, Forms, Lists
        └── ui/       # Chakra UI components
├── context/          # Global data (e.g., AuthContext)
├── pages/            # Home, TutorPage, LecturerPage, SignIn, SignUp
├── styles/           # CSS files (e.g., globals, Navbar)
├── types/            # TypeScript interfaces (e.g., Applicants, Courses)
└── utils/            # Helpers
```

---

## Dependencies

| Package | Description |
| --- | --- |
| `react` | JavaScript library for building UI |
| `react-dom` | DOM rendering for React |
| `typescript` | Static typing |
| `jest` | Testing framework |
| `@chakra-ui/react` | Component library for styling |
| `@emotion/react` | Required by Chakra UI |
| `@emotion/styled` | Required by Chakra UI |
| `framer-motion` | Animation support (pop ups) |

---

## Assets

All images, icons, and avatars used in the project are sourced from royalty-free websites:

* Images: [Unsplash](https://unsplash.com)
* Avatars: [UI Faces](https://uifaces.co)
* Icons: [React Lucide](https://react-icons.github.io/react-icons/icons/lu/)

---

## Team Info

Student 1: s3575564 – Bodene Downie

Student 2: s4095646 – Noah Bakr
