'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  blankSubmission,
  createSubmission,
  generateTeacherLearningPlan,
  listSubmissions,
  updateReadinessControls,
  uploadEvidence,
  type ControlCheck,
  type EvidenceCategory,
  type EvidenceDocument,
  type RegisterItem,
  type TeacherPathwaySubmission,
} from '@ggsa/services';
import type { PortalState, StagedEvidenceDocument } from './portalState';
import type { PortalRoute } from './routes';
import { getRouteFromPath, getRouteHref } from './routes';

const PortalContext = createContext<PortalState | null>(null);
const evidenceMaxBytes = 10 * 1024 * 1024;
const allowedEvidenceTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export function PortalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const route = getRouteFromPath(pathname);
  const [submission, setSubmission] = useState<TeacherPathwaySubmission>(blankSubmission);
  const [register, setRegister] = useState<RegisterItem[]>([]);
  const [notice, setNotice] = useState(
    'Loading teacher learning plans from the WordPress REST API.',
  );
  const [stagedEvidenceDocuments, setStagedEvidenceDocuments] = useState<StagedEvidenceDocument[]>(
    [],
  );
  const [isRegisterLoading, setIsRegisterLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasManualSubmissionOverride = useRef(false);

  const summary = useMemo(() => {
    const highRisk = register.filter((item) => item.riskLevel === 'High').length;
    const actionRequired = register.filter(
      (item) => item.workflowStatus === 'Coach action required',
    ).length;
    const ready = register.filter((item) => item.workflowStatus === 'RPL evidence ready').length;

    return { highRisk, actionRequired, ready };
  }, [register]);

  const navigate = (nextRoute: PortalRoute) => {
    router.push(getRouteHref(nextRoute));
  };

  const updateField = (field: keyof TeacherPathwaySubmission, value: string) => {
    hasManualSubmissionOverride.current = true;

    setSubmission((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCheck = async (id: string, status: ControlCheck['status']) => {
    const nextSubmission: TeacherPathwaySubmission = {
      ...submission,
      controlChecks: submission.controlChecks.map((check) =>
        check.id === id ? { ...check, status } : check,
      ),
    };

    setSubmission(nextSubmission);

    if (!nextSubmission.id && !nextSubmission.referenceNumber) {
      setNotice(
        'Readiness controls updated locally; submit the learning plan before WordPress can persist them.',
      );
      return;
    }

    try {
      const updated = await updateReadinessControls({
        id: nextSubmission.id,
        referenceNumber: nextSubmission.referenceNumber,
        controlChecks: nextSubmission.controlChecks,
      });

      setSubmission((current) => ({
        ...current,
        ...updated,
        controlChecks: updated.controlChecks,
      }));
      setNotice('Readiness controls saved to the WordPress pathway register.');
    } catch {
      setNotice('Readiness controls updated locally; WordPress could not save the latest change.');
    }
  };

  const addEvidence = (file: File, category: EvidenceCategory) => {
    const validationError =
      !allowedEvidenceTypes.has(file.type) && !file.name.toLowerCase().endsWith('.docx')
        ? 'Use PDF, PNG, JPG or DOCX evidence files.'
        : file.size > evidenceMaxBytes
          ? 'Evidence files must be 10 MB or smaller.'
          : file.size <= 0
            ? 'Evidence file is empty.'
            : undefined;

    setStagedEvidenceDocuments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        category,
        error: validationError,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        status: validationError ? 'error' : 'ready',
      },
    ]);
  };

  const removeEvidence = (id: string) => {
    setStagedEvidenceDocuments((current) => current.filter((item) => item.id !== id));
  };

  const refreshRegister = useCallback(async () => {
    setIsRegisterLoading(true);

    try {
      const items = await listSubmissions();
      setRegister(items);
      setNotice(
        items.length > 0
          ? 'Loaded teacher learning plans from the WordPress REST API.'
          : 'The WordPress REST API returned no teacher learning plans.',
      );
    } catch {
      setRegister([]);
      setNotice('WordPress API unavailable; teacher learning plans could not be loaded.');
    } finally {
      setIsRegisterLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshRegister();
  }, [refreshRegister]);

  useEffect(() => {
    let isMounted = true;

    async function seedGeneratedLearningPlan() {
      const generated = await generateTeacherLearningPlan();

      if (isMounted && !hasManualSubmissionOverride.current) {
        setSubmission(generated);
      }
    }

    void seedGeneratedLearningPlan();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStagedEvidence = (id: string, patch: Partial<StagedEvidenceDocument>) => {
    setStagedEvidenceDocuments((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const uploadStagedEvidence = async (
    created: TeacherPathwaySubmission,
  ): Promise<EvidenceDocument[]> => {
    const uploadable = stagedEvidenceDocuments.filter((item) => item.status === 'ready');
    const uploaded: EvidenceDocument[] = [];

    for (const item of uploadable) {
      updateStagedEvidence(item.id, { status: 'uploading', error: undefined });

      try {
        const document = await uploadEvidence(item.file, {
          category: item.category,
          learningPlanId: created.id,
          referenceNumber: created.referenceNumber,
        });
        uploaded.push({ ...document, category: document.category ?? item.category });
        updateStagedEvidence(item.id, { status: 'uploaded' });
      } catch {
        updateStagedEvidence(item.id, {
          status: 'error',
          error: 'WordPress could not store this evidence file.',
        });
      }
    }

    if (uploaded.length > 0) {
      setStagedEvidenceDocuments((current) => current.filter((item) => item.status !== 'uploaded'));
    }

    return uploaded;
  };

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

      const uploadedDocuments = await uploadStagedEvidence(created);
      const createdWithEvidence = {
        ...created,
        evidenceDocuments: [...created.evidenceDocuments, ...uploadedDocuments],
      };

      setRegister((current) => [registerItem, ...current]);
      setSubmission(createdWithEvidence);
      setNotice(
        uploadedDocuments.length > 0
          ? 'Teacher learning plan and evidence sent to the WordPress pathway register.'
          : 'Teacher learning plan sent to the WordPress pathway register.',
      );
      navigate('register');
    } catch {
      const fallbackEvidence = stagedEvidenceDocuments
        .filter((item) => item.status === 'ready')
        .map(
          (item): EvidenceDocument => ({
            fileId: item.id,
            fileName: item.fileName,
            fileType: item.fileType,
            fileSize: item.fileSize,
            category: item.category,
            uploadedAt: new Date().toISOString(),
          }),
        );
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
      setSubmission((current) => ({
        ...current,
        evidenceDocuments: [...current.evidenceDocuments, ...fallbackEvidence],
      }));
      setStagedEvidenceDocuments((current) => current.filter((item) => item.status === 'error'));
      setNotice(
        'Teacher learning plan captured locally; WordPress can persist it when the backend is running.',
      );
      navigate('register');
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: PortalState = {
    addEvidence,
    isRegisterLoading,
    isSubmitting,
    navigate,
    notice,
    removeEvidence,
    refreshRegister,
    register,
    route,
    submission,
    submitEvidence,
    stagedEvidenceDocuments,
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
