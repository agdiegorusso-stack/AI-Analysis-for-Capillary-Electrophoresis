
export interface Peak {
  name: string;
  value: number;
  normalRange: string;
  isAbnormal: boolean;
}

export interface AnalysisResult {
  interpretation: string;
  summary: string;
  confidence: number;
  peaks: Peak[];
  recommendations: string;
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}

// Fix: Add the missing 'Sample' interface used by constants.ts and SampleSelector.tsx.
export interface Sample {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}