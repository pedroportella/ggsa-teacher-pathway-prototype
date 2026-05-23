export type WorkflowStatus =
  | 'Learning plan draft'
  | 'Enrolled'
  | 'In progress'
  | 'Coach action required'
  | 'RPL evidence ready';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface EvidenceDocument {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  url?: string;
}

export interface ControlCheck {
  id: string;
  label: string;
  category: 'Prerequisites' | 'Core modules' | 'Evidence portfolio' | 'Certification';
  status: 'Complete' | 'Needs evidence' | 'Not started';
}

export interface TeacherPathwaySubmission {
  id?: string;
  referenceNumber?: string;
  organisationName: string;
  contactName: string;
  contactEmail: string;
  productName: string;
  productVersion: string;
  pathwayProfile: string;
  integrationType: string;
  workflowStatus: WorkflowStatus;
  riskLevel: RiskLevel;
  targetReleaseDate: string;
  standards: string[];
  controlChecks: ControlCheck[];
  evidenceDocuments: EvidenceDocument[];
  submittedAt?: string;
}

export interface RegisterItem {
  id: string;
  referenceNumber: string;
  organisationName: string;
  productName: string;
  workflowStatus: WorkflowStatus;
  riskLevel: RiskLevel;
  submittedAt: string | null;
}

export const initialControlChecks: ControlCheck[] = [
  {
    id: 'prerequisites',
    label: 'Learn Effective Teaching Essentials and Learn Cycles of School Practice are assigned',
    category: 'Prerequisites',
    status: 'Needs evidence',
  },
  {
    id: 'core-modules',
    label: 'Classroom core modules map to effective teaching, data-informed practice and feedback',
    category: 'Core modules',
    status: 'Needs evidence',
  },
  {
    id: 'evidence-portfolio',
    label: 'Certificates, classroom evidence and mastery artefacts are captured',
    category: 'Evidence portfolio',
    status: 'Not started',
  },
  {
    id: 'certification',
    label: 'RPL evidence can be prepared for partner assessment',
    category: 'Certification',
    status: 'Not started',
  },
];

export const seedSubmissions: RegisterItem[] = [
  {
    id: 'ggsa-tp-2026-001',
    referenceNumber: 'GGSA-TP-2026-001',
    organisationName: 'Cairns West State School',
    productName: 'Mastery Teaching Foundations',
    workflowStatus: 'In progress',
    riskLevel: 'Medium',
    submittedAt: '2026-05-17T23:45:00+10:00',
  },
  {
    id: 'ggsa-tp-2026-002',
    referenceNumber: 'GGSA-TP-2026-002',
    organisationName: 'Cape York Academy',
    productName: 'Mastery Teaching Towards Excellence',
    workflowStatus: 'Coach action required',
    riskLevel: 'High',
    submittedAt: '2026-05-16T13:10:00+10:00',
  },
  {
    id: 'ggsa-tp-2026-003',
    referenceNumber: 'GGSA-TP-2026-003',
    organisationName: 'St Marys Catholic School',
    productName: 'Mastery Teaching Fellow',
    workflowStatus: 'RPL evidence ready',
    riskLevel: 'Low',
    submittedAt: '2026-05-15T09:20:00+10:00',
  },
];

export const blankSubmission: TeacherPathwaySubmission = {
  organisationName: 'Good to Great Schools Australia',
  contactName: 'Ava Martin',
  contactEmail: 'ava.martin@example.org.au',
  productName: 'Teacher Learning Plan',
  productVersion: '2026 cohort',
  pathwayProfile: 'Mastery Teaching Foundations',
  integrationType: 'Local prototype adapters for Membership, WooCommerce and LearnDash',
  workflowStatus: 'Learning plan draft',
  riskLevel: 'Medium',
  targetReleaseDate: '2026-07-01',
  standards: ['Australian Professional Standards for Teachers', 'Recognition of Prior Learning', 'WCAG 2.1 AA'],
  controlChecks: initialControlChecks,
  evidenceDocuments: [],
};
