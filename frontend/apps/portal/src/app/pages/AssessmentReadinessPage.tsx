import { ReadinessContainer } from '../../components/ReadinessContainer';
import type { PortalState } from '../portalState';

export function AssessmentReadinessPage(props: Pick<PortalState, 'notice' | 'submission' | 'updateCheck'>) {
  return <ReadinessContainer {...props} />;
}
