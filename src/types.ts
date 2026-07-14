export interface DigitalProfile {
  fullName: string;
  jobTitle: string;
  company: string;
  industry: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  github: string;
  youtube: string;
  customLabel: string;
  customUrl: string;
  tags: string[];
  theme: string; // 'slate' | 'emerald' | 'terracotta' | 'ocean' | 'amber' | 'purple'
  avatarUrl?: string;
  avatarPrompt?: string;
}

export type ProfileVibe = "professional" | "creative" | "technical" | "warm" | "minimal";
