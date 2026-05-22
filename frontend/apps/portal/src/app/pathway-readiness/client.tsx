'use client';

import { AssessmentReadinessPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function PathwayReadinessRoute() {
  const { submission, updateCheck } = usePortalState();

  return <AssessmentReadinessPage submission={submission} updateCheck={updateCheck} />;
}
