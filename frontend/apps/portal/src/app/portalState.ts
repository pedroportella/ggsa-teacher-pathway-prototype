import type {
  ControlCheck,
  EvidenceCategory,
  RegisterItem,
  TeacherPathwaySubmission,
} from '@ggsa/services';
import type { PortalRoute } from './routes';

export type StagedEvidenceDocument = {
  id: string;
  category: EvidenceCategory;
  error?: string;
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'ready' | 'uploading' | 'uploaded' | 'error';
};

export type PortalSummary = {
  actionRequired: number;
  highRisk: number;
  ready: number;
};

export type PortalState = {
  addEvidence: (file: File, category: EvidenceCategory) => void;
  isRegisterLoading: boolean;
  isSubmitting: boolean;
  navigate: (route: PortalRoute) => void;
  notice: string;
  removeEvidence: (id: string) => void;
  refreshRegister: () => Promise<void>;
  register: RegisterItem[];
  route: PortalRoute;
  submission: TeacherPathwaySubmission;
  submitEvidence: () => Promise<void>;
  summary: PortalSummary;
  stagedEvidenceDocuments: StagedEvidenceDocument[];
  updateCheck: (id: string, status: ControlCheck['status']) => Promise<void>;
  updateField: (field: keyof TeacherPathwaySubmission, value: string) => void;
};
