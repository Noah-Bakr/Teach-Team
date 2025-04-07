export type Course = {
    id: string;
    name: string;
    skills?: string[];
  };
  
  export const DEFAULT_COURSES: Course[] = [
    // Default courses for testing purposes
    { id: "COSC2627", 
      name: "Blockchain Tech Fundamentals",
      skills: ["Blockchain", "Cryptography", "Distributed Systems"] },

    { id: "COSC2625", 
      name: "Introduction to Cyber Security",
      skills: ["Network Security", "Cryptography", "Ethical Hacking"] },

    { id: "COSC2960",
      name: "Foundations of AI for STEM",
      skills: ["Python", "Data Analysis", "Machine Learning"] },

    { id: "COSC2758",
      name: "Full Stack Development",
      skills: ["JavaScript", "React", "CSS"] },

    { id: "COSC3413",
      name: "Software Eng Fundamentals IT",
      skills: ["Java", "Android", "iOS"] },

    { id: "COSC2757",
      name: "Cloud Foundations",
      skills: ["AWS", "Docker", "Kubernetes"] },
    
  ];
  