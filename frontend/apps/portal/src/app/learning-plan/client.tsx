'use client';

import { VendorProviderSubmissionPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function LearningPlanRoute() {
  const {
    addEvidence,
    isSubmitting,
    notice,
    removeEvidence,
    stagedEvidenceDocuments,
    submission,
    submitEvidence,
    updateField,
  } = usePortalState();

  return (
    <VendorProviderSubmissionPage
      addEvidence={addEvidence}
      isSubmitting={isSubmitting}
      notice={notice}
      removeEvidence={removeEvidence}
      stagedEvidenceDocuments={stagedEvidenceDocuments}
      submission={submission}
      submitEvidence={submitEvidence}
      updateField={updateField}
    />
  );
}
