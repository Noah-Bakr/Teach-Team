export type Course = {
    id: string;
    name: string;
    skills?: string[];
  };
  
  export const DEFAULT_COURSES: Course[] = [
    // Default courses for testing purposes
    { id: "1", 
      name: "Blockchain Tech Fundamentals",
      skills: ["Blockchain", "Cryptography", "Distributed Systems"] },

    { id: "2", 
      name: "Introduction to Cyber Security",
      skills: ["Network Security", "Cryptography", "Ethical Hacking"] },

    { id: "3",
      name: "Machine Learning",
      skills: ["Python", "Data Analysis", "Machine Learning"] },

    { id: "4",
      name: "Full Stack",
      skills: ["JavaScript", "React", "CSS"] },

    { id: "5",
      name: "Mobile App Development",
      skills: ["Java", "Android", "iOS"] },

    { id: "6",
      name: "Cloud Computing and DevOps",
      skills: ["AWS", "Docker", "Kubernetes"] },
    
  ];
  