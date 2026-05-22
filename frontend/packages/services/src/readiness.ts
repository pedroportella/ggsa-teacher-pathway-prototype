import type { ControlCheck, TeacherPathwaySubmission } from './domain';

export function calculateReadinessScore(submission: TeacherPathwaySubmission): number {
  if (submission.controlChecks.length === 0) {
    return 0;
  }

  const completeChecks = submission.controlChecks.filter((check) => check.status === 'Complete').length;

  return Math.round((completeChecks / submission.controlChecks.length) * 100);
}

export function getOutstandingCategories(checks: ControlCheck[]): string[] {
  return Array.from(new Set(
    checks
      .filter((check) => check.status !== 'Complete')
      .map((check) => check.category),
  ));
}
