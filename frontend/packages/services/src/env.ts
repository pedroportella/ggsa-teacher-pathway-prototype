const DEFAULT_WORDPRESS_API_BASE_URL = 'http://localhost:8080/wp-json/ggsa/v1';
const DEFAULT_TEACHER_PATHWAY_API_TOKEN = 'local-teacher-pathway-portal-token';

export function getWordPressApiBaseUrl() {
  return process.env.WORDPRESS_API_BASE_URL ?? DEFAULT_WORDPRESS_API_BASE_URL;
}

export function getTeacherPathwayApiToken() {
  return process.env.GGSA_TEACHER_PATHWAY_API_TOKEN ?? DEFAULT_TEACHER_PATHWAY_API_TOKEN;
}

export function teacherPathwayApiEndpoint(path: string) {
  return `${getWordPressApiBaseUrl().replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
