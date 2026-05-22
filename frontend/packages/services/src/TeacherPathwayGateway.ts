import { teacherPathwayApiEndpoint } from './env';

const TEACHER_PATHWAY_SUBMISSIONS_PATH = 'teacher-pathway-submissions';
const TEACHER_PATHWAY_READINESS_PATH = `${TEACHER_PATHWAY_SUBMISSIONS_PATH}/readiness`;

export function proxyHeaders(response: Response): HeadersInit {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
  };
}

export async function requestTeacherPathwaySubmissions() {
  return fetch(teacherPathwayApiEndpoint(TEACHER_PATHWAY_SUBMISSIONS_PATH), {
    cache: 'no-store',
  });
}

export async function submitTeacherPathwayRecord(payload: string, contentType = 'application/json') {
  return fetch(teacherPathwayApiEndpoint(TEACHER_PATHWAY_SUBMISSIONS_PATH), {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: payload,
  });
}

export async function submitTeacherPathwayEvidence(formData: FormData) {
  return fetch(teacherPathwayApiEndpoint(`${TEACHER_PATHWAY_SUBMISSIONS_PATH}/evidence`), {
    method: 'POST',
    body: formData,
  });
}

export async function submitTeacherPathwayReadiness(payload: string, contentType = 'application/json') {
  return fetch(teacherPathwayApiEndpoint(TEACHER_PATHWAY_READINESS_PATH), {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: payload,
  });
}
