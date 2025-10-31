export interface Chord {
  symbol: string;
  fullName?: string;
  description?: string;
  notes: string[];
  intervals: string[];
  alternateSymbols?: string[];
  inversions?: Array<{
    name: string;
    notes?: string[];
  }>;
  relatedChords?: Array<{
    name: string;
    url?: string | null;
  }>;
  imageUrl?: string | null;
  imageLocal?: string | null;
  url: string;
}

