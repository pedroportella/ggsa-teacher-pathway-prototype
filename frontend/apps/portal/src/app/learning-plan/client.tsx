'use client';

import { VendorProviderSubmissionPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function LearningPlanRoute() {
  const { addEvidence, isSubmitting, notice, submission, submitEvidence, updateField } =
    usePortalState();

  return (
    <VendorProviderSubmissionPage
      addEvidence={addEvidence}
      isSubmitting={isSubmitting}
      notice={notice}
      submission={submission}
      submitEvidence={submitEvidence}
      updateField={updateField}
    />
  );
}
