import type { RiskLevel, TeacherPathwaySubmission, WorkflowStatus } from '@ggsa/services';

const words = ['River', 'Harbour', 'Summit', 'Wattle', 'Aurora', 'Pioneer'];

function choice<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function safeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateRandomLearningPlan(): TeacherPathwaySubmission {
  const id = safeId();
  const workflowStatus: WorkflowStatus = choice([
    'Enrolled',
    'In progress',
    'Coach action required',
  ]);
  const riskLevel: RiskLevel = choice(['Low', 'Medium', 'High']);
  const schoolName = `${choice(words)} Test School ${id}`;

  return {
    organisationName: schoolName,
    contactName: `Test Coordinator ${id}`,
    contactEmail: `ggsa-test+${id.replace(/[^a-z0-9]/gi, '')}@example.org.au`,
    productName: `Teacher Learning Plan ${id}`,
    productVersion: '2026 randomised cohort',
    pathwayProfile: choice([
      'Mastery Teaching Foundations',
      'Mastery Teaching Towards Excellence',
      'Mastery Teaching Fellow',
    ]),
    integrationType: `Playwright persistent record ${id}`,
    workflowStatus,
    riskLevel,
    targetReleaseDate: '2026-08-31',
    standards: ['Australian Professional Standards for Teachers'],
    controlChecks: [],
    evidenceDocuments: [],
  };
}
