import { SubmissionContainer } from '../../components/SubmissionContainer';
import type { PortalState } from '../portalState';

export function VendorProviderSubmissionPage(
  props: Pick<
    PortalState,
    'addEvidence' | 'isSubmitting' | 'notice' | 'submission' | 'submitEvidence' | 'updateField'
  >,
) {
  return <SubmissionContainer {...props} />;
}
