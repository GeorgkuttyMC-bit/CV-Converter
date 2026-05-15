export interface CVData {
  personal: {
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    date: string;
  }>;
  skills: string[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  font: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}
