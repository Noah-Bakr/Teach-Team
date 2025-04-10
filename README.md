# TeachTeam (TT) – Tutor Application Management (Frontend Prototype)

## COSC2758 – Assignment 1

RMIT University – Semester 1, 2025

---

## 📦 How to Run the Project

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

👤 Student 1: s3123456 – John Doe

👤 Student 2: s3654321 – Jane Smith