export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
  sharedInterests: string[];
}

export type SwipeAction = 'like' | 'pass';

export interface SwipeResponse {
  success: boolean;
  isMatch: boolean;
  match?: {
    id: string;
  };
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio?: string;
  city: string;
  college?: string;
  interests: string[];
  matchedAt: string;
}

