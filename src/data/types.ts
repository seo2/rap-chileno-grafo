export type Era = '80s' | '90s' | '2000s' | '2010s' | '2020s';
export type CurationStatus = 'pending' | 'candidate' | 'reviewed' | 'verified' | 'rejected';
export type SourceType = 'api' | 'article' | 'archive' | 'academic' | 'manual' | 'dataset';
export type ResearchCandidateKind = 'candidate_artist' | 'candidate_album' | 'candidate_relationship' | 'candidate_event' | 'candidate_source_quote';

export type EditorialEvidence = {
  sourceIds: string[];
  sourceName: string;
  sourceType: SourceType;
  sourceUrl?: string;
  confidence: number;
  curationStatus: CurationStatus;
  notes?: string;
};

export type Artist = EditorialEvidence & {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  era: Era;
  summary: string;
  tags: string[];
  urbanCrossover?: boolean;
};

export type Album = EditorialEvidence & {
  id: string;
  slug: string;
  title: string;
  artistId: string;
  year: number;
  type: 'album' | 'ep' | 'single' | 'compilation';
};

export type Place = EditorialEvidence & {
  id: string;
  slug: string;
  name: string;
  type: 'city' | 'commune' | 'region';
  lat: number;
  lng: number;
};

export type Relationship = EditorialEvidence & {
  id: string;
  source: string;
  target: string;
  relationshipType: 'collaborated_with' | 'member_of' | 'released' | 'from_place' | 'associated_with_era';
  weight: number;
  year?: number;
  promotedFromCandidateId?: string;
};

export type Source = {
  id: string;
  name: string;
  sourceType: SourceType;
  url?: string;
  description: string;
  curationStatus: CurationStatus;
  notes?: string;
};

export type ResearchCandidate = {
  id: string;
  kind: ResearchCandidateKind;
  label: string;
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  claim: string;
  extractedText?: string;
  relatedEntityIds: string[];
  confidence: number;
  priority: number;
  curationStatus: Extract<CurationStatus, 'pending' | 'candidate'>;
  reviewAction: string;
  notes?: string;
};
