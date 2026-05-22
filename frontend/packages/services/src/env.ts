const DEFAULT_WORDPRESS_API_BASE_URL = 'http://localhost:8080/wp-json/ggsa/v1';

export function getWordPressApiBaseUrl() {
  return process.env.WORDPRESS_API_BASE_URL ?? DEFAULT_WORDPRESS_API_BASE_URL;
}

export function teacherPathwayApiEndpoint(path: string) {
  return `${getWordPressApiBaseUrl().replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
