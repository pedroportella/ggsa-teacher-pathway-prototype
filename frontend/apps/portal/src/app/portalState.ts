import type { ControlCheck, RegisterItem, TeacherPathwaySubmission } from '@ggsa/services';
import type { PortalRoute } from './routes';

export type PortalSummary = {
  actionRequired: number;
  highRisk: number;
  ready: number;
};

export type PortalState = {
  addEvidence: () => void;
  isSubmitting: boolean;
  navigate: (route: PortalRoute) => void;
  notice: string;
  refreshRegister: () => Promise<void>;
  register: RegisterItem[];
  route: PortalRoute;
  submission: TeacherPathwaySubmission;
  submitEvidence: () => Promise<void>;
  summary: PortalSummary;
  updateCheck: (id: string, status: ControlCheck['status']) => void;
  updateField: (field: keyof TeacherPathwaySubmission, value: string) => void;
};
