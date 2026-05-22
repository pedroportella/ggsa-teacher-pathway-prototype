'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  blankSubmission,
  createSubmission,
  listSubmissions,
  seedSubmissions,
  type ControlCheck,
  type EvidenceDocument,
  type RegisterItem,
  type TeacherPathwaySubmission,
} from '@ggsa/services';
import type { PortalState } from './portalState';
import type { PortalRoute } from './routes';
import { getRouteFromPath, getRouteHref } from './routes';

const PortalContext = createContext<PortalState | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const route = getRouteFromPath(pathname);
  const [submission, setSubmission] = useState<TeacherPathwaySubmission>(blankSubmission);
  const [register, setRegister] = useState<RegisterItem[]>([]);
  const [notice, setNotice] = useState('Loading teacher learning plans from the WordPress REST API.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    const highRisk = register.filter((item) => item.riskLevel === 'High').length;
    const actionRequired = register.filter((item) => item.workflowStatus === 'Coach action required').length;
    const ready = register.filter((item) => item.workflowStatus === 'Certification ready').length;

    return { highRisk, actionRequired, ready };
  }, [register]);

  const navigate = (nextRoute: PortalRoute) => {
    router.push(getRouteHref(nextRoute));
  };

  const updateField = (field: keyof TeacherPathwaySubmission, value: string) => {
    setSubmission((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCheck = (id: string, status: ControlCheck['status']) => {
    setSubmission((current) => ({
      ...current,
      controlChecks: current.controlChecks.map((check) => (
        check.id === id ? { ...check, status } : check
      )),
    }));
  };

  const addEvidence = () => {
    const document: EvidenceDocument = {
      fileId: `local-${Date.now()}`,
      fileName: `teacher-pathway-evidence-${submission.evidenceDocuments.length + 1}.pdf`,
      fileType: 'application/pdf',
      fileSize: 428000,
      uploadedAt: new Date().toISOString(),
    };

    setSubmission((current) => ({
      ...current,
      evidenceDocuments: [...current.evidenceDocuments, document],
    }));
  };

  const refreshRegister = useCallback(async () => {
    try {
      const items = await listSubmissions();
      setRegister(items.length > 0 ? items : seedSubmissions);
      setNotice('Loaded teacher learning plans from the WordPress REST API.');
    }
    catch {
      setRegister(seedSubmissions);
      setNotice('WordPress API unavailable; showing seeded teacher pathway records for local review.');
    }
  }, []);

  useEffect(() => {
    void refreshRegister();
  }, [refreshRegister]);

  const submitEvidence = async () => {
    setIsSubmitting(true);

    try {
      const created = await createSubmission({
        ...submission,
        workflowStatus: 'Enrolled',
      });
      const registerItem: RegisterItem = {
        id: created.id ?? `local-${Date.now()}`,
        referenceNumber: created.referenceNumber ?? 'GGSA-TP-DRAFT',
        organisationName: created.organisationName,
        productName: created.productName,
        workflowStatus: created.workflowStatus,
        riskLevel: created.riskLevel,
        submittedAt: created.submittedAt ?? new Date().toISOString(),
      };

      setRegister((current) => [registerItem, ...current]);
      setNotice('Teacher learning plan sent to the WordPress pathway register.');
      navigate('register');
    }
    catch {
      const fallbackItem: RegisterItem = {
        id: `local-${Date.now()}`,
        referenceNumber: `GGSA-TP-${new Date().getFullYear()}-DRAFT`,
        organisationName: submission.organisationName,
        productName: submission.productName,
        workflowStatus: 'Enrolled',
        riskLevel: submission.riskLevel,
        submittedAt: new Date().toISOString(),
      };

      setRegister((current) => [fallbackItem, ...current]);
      setNotice('Teacher learning plan captured locally; WordPress can persist it when the backend is running.');
      navigate('register');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const value: PortalState = {
    addEvidence,
    isSubmitting,
    navigate,
    notice,
    refreshRegister,
    register,
    route,
    submission,
    submitEvidence,
    summary,
    updateCheck,
    updateField,
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortalState(): PortalState {
  const context = useContext(PortalContext);

  if (!context) {
    throw new Error('usePortalState must be used within PortalProvider');
  }

  return context;
}
