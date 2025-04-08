export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string; // URL to the avatar image
  email: string; // will be the username
  password: string;
  role: Role[]; // List of roles (closed)

  academicCredentials?: string; // Optional field for academic credentials
  skills?: string[]; // Optional field for skills
  availability?: Availability[]; // Optional field for availability (list)
};

export const Roles: string[] = ["admin", "lecturer", "tutor"];
export type Role = typeof Roles[number];
export const Availability: string[] = ["Full-Time", "Part-Time", "Not Available"];
export type Availability = typeof Availability[number];

export const DEFAULT_USERS: User[] = [
  // Default users for testing purposes
  { id: "1", 
    username: "admin_user",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com", 
    password: "admin123", 
    role: ["admin"] },
  
  { id: "2", 
    username: "john_doe", 
    firstName: "John", 
    lastName: "Doe", 
    email: "john@example.com", 
    password: "Cart@21-c0ding", 
    avatar: "https://mighty.tools/mockmind-api/content/human/80.jpg",
    role: ["lecturer"],
    academicCredentials: "Bachelor of Computer Science",
    skills: ["Java", "Python", "C++"],
    availability: ["Full-Time"] },

  { id: "3", 
    username: "jane_doe", 
    firstName: "Jane", 
    lastName: "Doe", 
    email: "jane@example.com", 
    password: "password456", 
    role: ["tutor"] },

  { id: "4", 
    username: "bob_smith", 
    firstName: "Bob", 
    lastName: "Smith", 
    email: "bob@example.com", 
    password: "password789", 
    role: ["tutor"] },
];
