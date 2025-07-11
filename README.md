# TeachTeam (TT) – Tutor Application Management
<!--COSC2758 – Assignment 2 | RMIT University – Semester 1, 2025-->

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

TeachTeam (TT) is a web application that streamlines the tutor recruitment process at a university. It offers multi-role access (Candidates, Lecturers, Admin).

![Home](Website-Images/Home.png)

## Features

* **Secure Authentication**: JWT-based Sign-Up/Sign-In, password hashing with Argon2.
* **Role-Based Dashboards**: Customized views for tutors, lecturers, and administrators.
* **Data Persistence**: Cloud MySQL database managed via TypeORM.
* **Data Validation**: DTOs with `class-validator` to ensure robust request schema enforcement.
* **Interactive UI**: React TS with Tailwind CSS for responsive layouts.
* **Data Visualization**: Recharts-powered insights for lecturer selections.
<!--* **Admin Controls**: GraphQL-powered admin dashboard for course management and reports.-->
* **Tutors:** Course application, profile management
* **Lecturers:** Applicant review, search, sort, ranking
<!--* **Admin:** Course CRUD, user blocking, reports, GraphQL subscriptions-->

## Testing

* **Frontend Unit Tests:** Jest & React Testing Library for component and hook validation.
* **Backend Tests:** Jest for API endpoints, DTO validation.
* **Validation Coverage:** Ensures DTO schemas guard against invalid requests.

---
### How to Run the Project

<details>

<summary>View Instructions</summary>

### 1. Clone the Repository

```bash
git clone https://github.com/rmit-fsd-2025-s1/s3575564-s4095646-a2.git
cd s3575564-s4095646-a2
```

### 2. Install Dependencies

Open two terminals and navigate one to the `backend` directory, and the other to the `frontend` directory.
Make sure you have **Node.js (v18+)** and npm installed. Then for each directory, run:

```bash
npm install
```

### 3. Configure the Environment (Database and JWT)

#### Step 1: Create a `.env` File

Duplicate the provided `.env.example` file and rename it to `.env`:

```bash
copy .env.example .env
```

#### Step 2: Generate a Secure JWT Secret Key

To securely generate a symmetric key for JWT authentication, open the terminal in Visual Studio (or any PowerShell-enabled terminal) and run the following code:

```bash
$cryptoProvider = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$key = New-Object byte[] 64
$cryptoProvider.GetBytes($key)
$jwtSecret = [Convert]::ToBase64String($key)
"`nJWT_SECRET=$jwtSecret" | Out-File -FilePath .env -Encoding ASCII -Append
```

This will append a strong, base64-encoded symmetric key to your .env file as a new line:

```bash
JWT_SECRET=this1is2an3example4symmetric5key6string7
```

> [!CAUTION]
> Never commit your `.env` file to git.

### 4. Run the Server

For each directory, in the terminal, run:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
</details>

---

## Logging In & Navigating the Website

### Homepage Navigation

Click the avatar in the top-right of the screen and choose `Sign In` to progress in the website.

<details>

<summary>View Sign-In Credentials</summary>

### Dummy Sign-In Credentials

> [!TIP]
> For ease of logging in, all account passwords are the same.

You can use the following test accounts to log in as a tutor:

| Avatar | Email | Password |
| --- | --- | --- |
| <img src="https://mighty.tools/mockmind-api/content/human/97.jpg" alt="avatar" width="50"/> | `jane@example.com` | `Cart@21-c0ding` |
| <img src="https://mighty.tools/mockmind-api/content/human/91.jpg" alt="avatar" width="50"/> | `bob@example.com` | `Cart@21-c0ding` |
| <img src="https://mighty.tools/mockmind-api/content/human/99.jpg" alt="avatar" width="50"/> | `dexter@example.com` | `Cart@21-c0ding` |
| <img src="https://mighty.tools/mockmind-api/content/human/125.jpg" alt="avatar" width="50"/> | `julie@example.com` | `Cart@21-c0ding` |

You can use the following test account to log in as a lecturer:

| Avatar | Email | Password |
| --- | --- | --- |
| <img src="https://mighty.tools/mockmind-api/content/human/80.jpg" alt="avatar" width="50"/> | `john@example.com` | `Cart@21-c0ding` |
| <img src="https://mighty.tools/mockmind-api/content/human/86.jpg" alt="avatar" width="50"/> | `roo@example.com` | `Cart@21-c0ding` |
| <img src="https://mighty.tools/mockmind-api/content/human/90.jpg" alt="avatar" width="50"/> | `barry@example.com` | `Cart@21-c0ding` |

You can use the following test account to log in as an admin:

> [!NOTE]
> Implementations for the admin have not been deployed yet.

| Email | Password |
| --- | --- |
| `admin@example.com` | `Cart@21-c0ding` |

</details>

### Navigation Overview

Once logged in, you'll be redirected to the appropriate dashboard based on your user type.

#### Tutor/Candidate Dashboard

![Home](Website-Images/Tutor.png)

- **Apply** for available courses as a Tutor or Lab Assistant
- Submit your:
  - Availability: Part-Time / Full-Time / Not Available
  - Skills and Academic Credentials
  - Previous Work Experience

<details>

<summary>View Application Form</summary>

![Home](Website-Images/Application.png)

</details>

#### Lecturer Dashboard

![Home](Website-Images/Lecturer.png)

- **View all applicants** filtered by course
- **Search & sort** applicants by:
  - Name
  - Course
  - Availability
  - Skill set
    - (All inclusive of the search bar)
- **Select**, **rank**, and **comment** on tutor candidates
- **View** selection insights
  - Most/least chosen
  - Common skills
- **Visual Diagrams** that display such as:
  - Each application status and their percentage (25% of applications are rejected)
  - Number of applications for each role/position (breakdown)


<details>

<summary>View Application Statistic Visulisations</summary>

![Home](Website-Images/Visuals.png)

</details>

### Profile Page

![Home](Website-Images/Profile.png)

- **View and edit** all acount details
  - Profile Information
    - First name, Last name, Avatar (public link)
  - Account Information
    - Username
    - Email
    - Role
- **Add and remove** skils via the input and tag combo
- **Add and edit** all academic credentials
- **Add and edit** all previous work experience
- **View** all submitted applications

---

## Project Structure

```bash
Teach-Team/
│
├── backend/                        # Backend API and database logic
│   ├── src/
│   │   ├── controller/             # Controller logic for routes
│   │   ├── entity/                 # TypeORM entities (User, Course, Application, Skills, Role)
│   │   ├── routes/                 # Express route handlers
│   │   ├── seeds/                  # Database seeding scripts (test data)
│   │   ├── data-source.ts          # TypeORM data source configuration
│   │   └── index.ts                # Application configuration
│   ├── .env                        # Environment variables (not committed)
│   ├── package.json                # Backend dependencies and scripts
│   └── tsconfig.json               # TypeScript config for backend
│
├── frontend/                       # Frontend React/Next.js app
│   ├── public/                     # Static assets (images, favicon, etc.)
│   ├── src/
│   │   ├── components/             # Header, Footer, Forms, Lists
│   │   │   └── ui/                 # Chakra UI components
│   │   ├── context/                # Global data (e.g., AuthContext)
│   │   ├── pages/                  # Home, TutorPage, LecturerPage, SignIn, SignUp
│   │   ├── services                # API files for backend connection
│   │   ├── styles/                 # CSS files (e.g., globals, Navbar)
│   │   ├── types/                  # TypeScript interfaces (e.g., Applicants, Courses)
│   │   └── utils/                  # Helpers (e.g., userLookup)
│   ├── .env                        # Frontend environment variables (not committed)
│   ├── package.json                # Frontend dependencies and scripts
│   └── tsconfig.json               # TypeScript config for frontend
│
├── .gitignore                      # Files and folders to ignore in git
├── README.md                       # Project documentation and instructions
└── package-lock.json               # Dependency lock file
```

---

## Dependencies

| Package                   | Description                                                        |
|---------------------------|--------------------------------------------------------------------|
| `react`                   | JavaScript library for building UI                                 |
| `react-dom`               | DOM rendering for React                                            |
| `next`                    | React framework for SSR and routing                                |
| `typescript`              | Static typing for JavaScript                                       |
| `jest`                    | Testing framework                                                  |
| `@testing-library/react`  | Unit testing library for React components                          |
| `@chakra-ui/react`        | Component library for styling                                      |
| `@emotion/react`          | Required by Chakra UI                                              |
| `@emotion/styled`         | Required by Chakra UI                                              |
| `framer-motion`           | Animation support (pop ups)                                        |
| `axios`                   | HTTP client for making requests to the backend API                 |
| `jsonwebtoken`            | Library to sign, verify, and decode JSON Web Tokens                |
| `cookie-parser`           | Middleware to parse cookies from incoming HTTP requests            |
| `argon2`                  | Password hashing library                                           |
| `express`                 | Web framework for Node.js backend                                  |
| `typeorm`                 | ORM for TypeScript and JavaScript (backend, MySQL)                 |
| `mysql2`                  | MySQL client for Node.js (used by TypeORM)                         |
| `dotenv`                  | Loads environment variables from `.env` files                      |
| `cors`                    | Middleware for enabling CORS                                       |
| `nodemon`                 | Utility that automatically restarts the server on file changes     |
| `eslint`                  | Linter for JavaScript/TypeScript                                   |
| `recharts`                | Charting library for React                                         |
| `class-validator`         | Decorator-based validation schemas                                 |

---

## Assets

All images, icons, and avatars used in the project are sourced from royalty-free websites:

* Images: [Unsplash](https://unsplash.com)
* Avatars: [UI Faces](https://uifaces.co)
* Icons: [React Lucide](https://react-icons.github.io/react-icons/icons/lu/)

---

## Team Info

Noah Bakr | s4095646<br>Bodene Downie | s3575564
