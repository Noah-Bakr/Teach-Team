export interface SeedUser {
    username: string;
    email:    string;
    password: string;
    role_id:  1|2|3;                // 1=admin, 2=lecturer, 3=tutor
    first_name: string;
    last_name:  string;
    avatar?:     string;

    skill_ids?: number[];           // link into Skills table
    academic_credentials?: {
        degree_name: string;
        institution: string;
        start_date:  string;          // "YYYY-MM-DD"
        end_date?:   string;
        description?: string;
    }[];

    previous_roles?: {
        previous_role: string;
        company:       string;
        start_date:    string;
        end_date?:     string;
        description?:  string;
    }[];
}

export interface SeedLecturerCourse {
    lecturerUsername: string
    courseCode:       string
}

export const SEED_USERS: SeedUser[] = [
    {
        username:   "admin_user",
        email:      "admin@example.com",
        password:   "Cart@21-c0ding",
        role_id:    1,
        first_name: "Admin",
        last_name:  "User"
    },
    {
        username:   "john_doe",
        email:      "john@example.com",
        password:   "Cart@21-c0ding",
        role_id:    2,
        first_name: "John",
        last_name:  "Doe",
        avatar:     "https://mighty.tools/mockmind-api/content/human/80.jpg",
        academic_credentials: [
            {
                degree_name: "Bachelor of Computer Science",
                institution: "RMIT University",
                start_date:  "2018-02-01",
                end_date:    "2021-11-30"
            }
        ]
    },
    {
        username:   "jane_doe",
        email:      "jane@example.com",
        password:   "Cart@21-c0ding",
        role_id:    3,
        first_name: "Jane",
        last_name:  "Doe",
        avatar:     "https://mighty.tools/mockmind-api/content/human/97.jpg",
        skill_ids:  [1, 2, 3],            // Java, Python, C++
        academic_credentials: [
            {
                degree_name: "Bachelor of Computer Science",
                institution: "RMIT University",
                start_date:  "2018-02-01",
                end_date:    "2021-11-30",
                description:"Graduated with Distinction"
            }
        ],
        previous_roles: [
            {
                previous_role: "Data Engineer",
                company:       "CyberNova Labs",
                start_date:    "2023-06-01",
                end_date:      "2024-12-31",
                description:   "Built ETL pipelines"
            },
            {
                previous_role: "Data Analyst",
                company:       "LuminaForge Technologies",
                start_date:    "2023-02-04",
                end_date:      "2024-09-05",
                description:   "Analysed large datasets"
            }
        ]
    },
    {
        username:   "bob_smith",
        email:      "bob@example.com",
        password:   "Cart@21-c0ding",
        role_id:    3,
        first_name: "Bob",
        last_name:  "Smith",
        avatar:     "https://mighty.tools/mockmind-api/content/human/91.jpg",
        skill_ids:  [1, 4, 3],            // Java, React (id=4), C++
        academic_credentials: [
            {
                degree_name: "Bachelor of Data Science",
                institution: "RMIT University",
                start_date:  "2019-03-01",
                end_date:    "2022-12-15"
            }
        ],
        previous_roles: [
            {
                previous_role: "Computer Programmer",
                company:       "VortexWave Innovations",
                start_date:    "2023-04-18",
                end_date:      "2025-01-31",
                description:   "Developed and maintained web applications"
            },
            {
                previous_role: "Java Developer",
                company:       "ByteShift Industries",
                start_date:    "2023-07-28",
                end_date:      "2024-02-24",
                description:   "Built backend services in Java"
            }
        ]
    },
    {
        username:   "dexter_charles",
        email:      "dexter@example.com",
        password:   "Cart@21-c0ding",
        role_id:    3,
        first_name: "Dexter",
        last_name:  "Charles",
        avatar:     "https://mighty.tools/mockmind-api/content/human/99.jpg",
        skill_ids:  [1, 2, 7, 8],         // Java, Python, HTML (7), CSS (8)
        academic_credentials: [
            {
                degree_name: "Bachelor of Cyber Security",
                institution: "RMIT University",
                start_date:  "2020-04-01",
                end_date:    "2023-11-30"
            }
        ],
        previous_roles: [
            {
                previous_role: "Data Scientist",
                company:       "QuantumFuze",
                start_date:    "2023-06-01",
                // endDate blank = still employed
                description:   "Built predictive models"
            },
            {
                previous_role: "Data Developer",
                company:       "ArcadiaNet Solutions",
                start_date:    "2021-05-11",
                end_date:      "2024-03-21",
                description:   "ETL pipelines and data warehousing"
            }
        ]
    },
    {
        username:   "julie_robbins",
        email:      "julie@example.com",
        password:   "Cart@21-c0ding",
        role_id:    3,
        first_name: "Julie",
        last_name:  "Robbins",
        avatar:     "https://mighty.tools/mockmind-api/content/human/125.jpg",
        skill_ids:  [1, 9,10,8],          // Java, Linux(9), BASH(10), Ethical Hacking(8)
        academic_credentials: [
            {
                degree_name: "Bachelor of Information Technology",
                institution: "RMIT University",
                start_date:  "2019-07-01",
                end_date:    "2022-12-15"
            }
        ],
        previous_roles: [
            {
                previous_role: "Cyber Security Analyst",
                company:       "NexaTech Solutions",
                start_date:    "2025-01-01",
                description:   "Threat analysis and remediation"
            },
            {
                previous_role: "Cyber Security Architect",
                company:       "StratosCore Systems",
                start_date:    "2022-09-08",
                end_date:      "2024-12-14",
                description:   "Designed secure network architectures"
            }
        ]
    }
];


export interface SeedCourse {
    course_name: string;
    course_code: string;
    semester:    "1" | "2";
    skill_ids?:  number[];           // SKILLS_COURSE
}

export const SEED_COURSES: SeedCourse[] = [
    { course_name: "Blockchain Tech Fundamentals",
        course_code: "COSC2627",
        semester:    "1",
        skill_ids:   [4, 5, 6]           // Blockchain(4), Crypto(5), Distributed Systems(6)
    },
    { course_name: "Introduction to Cyber Security",
        course_code: "COSC2625",
        semester:    "1",
        skill_ids:   [7, 2, 8]           // Network Security(7), Python(2), Ethical Hacking(8)
    },
    { course_name: "Foundations of AI for STEM",
        course_code: "COSC2960",
        semester:    "2",
        skill_ids:   [2, 9, 10]          // Python(2), Data Analysis(9), Machine Learning(10)
    },
    { course_name: "Full Stack Development",
        course_code: "COSC2758",
        semester:    "1",
        skill_ids:   [11, 12, 13]        // JavaScript(11), React(12), CSS(13)
    },
    { course_name: "Software Eng Fundamentals IT",
        course_code: "COSC3413",
        semester:    "2",
        skill_ids:   [1, 14, 15]         // Java(1), Android(14), iOS(15)
    },
    { course_name: "Cloud Foundations",
        course_code: "COSC2757",
        semester:    "1",
        skill_ids:   [16, 17, 18]        // AWS(16), Docker(17), Kubernetes(18)
    },
];


export interface SeedApplication {
    position_type: "tutor" | "lab_assistant";
    status:        "pending" | "accepted" | "rejected";
    applied_at:    string;            // ISO date (YYYY-MM-DD)
    selected:      boolean;
    availability:  "Full-Time" | "Part-Time" | "Not Available";
    rank?:         number;
    user_username: string;            // link by username
    course_code:   string;            // link by course_code
}

export const SEED_APPLICATIONS: SeedApplication[] = [
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-02",
        selected:      false,
        availability:  "Full-Time",
        user_username: "julie_robbins",
        course_code:   "COSC2625"
    },
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-04",
        selected:      false,
        availability:  "Part-Time",
        user_username: "dexter_charles",
        course_code:   "COSC2625"
    },
    {
        position_type: "lab_assistant",
        status:        "pending",
        applied_at:    "2025-04-05",
        selected:      false,
        availability:  "Part-Time",
        user_username: "jane_doe",
        course_code:   "COSC2625"
    },
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-01",
        selected:      false,
        availability:  "Full-Time",
        user_username: "bob_smith",
        course_code:   "COSC2625"
    },
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-03",
        selected:      false,
        availability:  "Full-Time",
        user_username: "jane_doe",
        course_code:   "COSC2758"
    },
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-06",
        selected:      false,
        availability:  "Part-Time",
        user_username: "bob_smith",
        course_code:   "COSC2758"
    },
    {
        position_type: "tutor",
        status:        "pending",
        applied_at:    "2025-04-07",
        selected:      false,
        availability:  "Part-Time",
        user_username: "jane_doe",
        course_code:   "COSC3413"
    },
    {
        position_type: "lab_assistant",
        status:        "pending",
        applied_at:    "2025-04-09",
        selected:      false,
        availability:  "Full-Time",
        user_username: "jane_doe",
        course_code:   "COSC2757"
    },
];
export const SEED_LECTURER_COURSES: SeedLecturerCourse[] = [
    { lecturerUsername: "john_doe", courseCode: "COSC2625" },
    { lecturerUsername: "john_doe", courseCode: "COSC2758" },

]