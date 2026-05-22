'use client';

import { AssessmentReadinessPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function PathwayReadinessRoute() {
  const { notice, submission, updateCheck } = usePortalState();

  return <AssessmentReadinessPage notice={notice} submission={submission} updateCheck={updateCheck} />;
}
