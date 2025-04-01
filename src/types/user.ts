export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string; // will be the username
  password: string;
  role: "admin" | "lecturer" | "tutor" | "applicant"; // default to "applicant"
};

export const DEFAULT_USERS: User[] = [
  // Default users for testing purposes
  { id: "1", 
    username: "admin_user",
    firstName: "Admin",
    lastName: "User", 
    email: "admin@example.com", 
    password: "admin123", 
    role: "admin" },
  
  { id: "2", 
    username: "john_doe", 
    firstName: "John", 
    lastName: "Doe", 
    email: "john@example.com", 
    password: "password123", 
    role: "lecturer" },

  { id: "3", 
    username: "jane_doe", 
    firstName: "Jane", 
    lastName: "Doe", 
    email: "jane@example.com", 
    password: "password456", 
    role: "tutor" },

  { id: "4", 
    username: "bob_smith", 
    firstName: "Bob", 
    lastName: "Smith", 
    email: "bob@example.com", 
    password: "password789", 
    role: "applicant" },
];
