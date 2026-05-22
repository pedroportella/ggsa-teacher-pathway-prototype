import type { ControlCheck, EvidenceDocument, RegisterItem, TeacherPathwaySubmission } from './domain';

const API_BASE_URL = '/api';

export async function listSubmissions(): Promise<RegisterItem[]> {
  const response = await fetch(`${API_BASE_URL}/teacher-pathway-submissions`);

  if (!response.ok) {
    throw new Error('Unable to load the teacher pathway register.');
  }

  return response.json() as Promise<RegisterItem[]>;
}

export async function createSubmission(payload: TeacherPathwaySubmission): Promise<TeacherPathwaySubmission> {
  const response = await fetch(`${API_BASE_URL}/teacher-pathway-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to submit the teacher learning plan.');
  }

  return response.json() as Promise<TeacherPathwaySubmission>;
}

export async function uploadEvidence(file: File): Promise<EvidenceDocument> {
  const body = new FormData();
  body.append('file', file);

  const response = await fetch(`${API_BASE_URL}/teacher-pathway-submissions/evidence`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('Unable to upload evidence document.');
  }

  return response.json() as Promise<EvidenceDocument>;
}

export async function updateReadinessControls(payload: {
  controlChecks: ControlCheck[];
  id?: string;
  referenceNumber?: string;
}): Promise<TeacherPathwaySubmission> {
  const response = await fetch(`${API_BASE_URL}/teacher-pathway-submissions/readiness`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to update readiness controls.');
  }

  return response.json() as Promise<TeacherPathwaySubmission>;
}
