import { SubmissionContainer } from '../../components/SubmissionContainer';
import type { PortalState } from '../portalState';

export function VendorProviderSubmissionPage(
  props: Pick<
    PortalState,
    | 'addEvidence'
    | 'isSubmitting'
    | 'notice'
    | 'removeEvidence'
    | 'stagedEvidenceDocuments'
    | 'submission'
    | 'submitEvidence'
    | 'updateField'
  >,
) {
  return <SubmissionContainer {...props} />;
}
