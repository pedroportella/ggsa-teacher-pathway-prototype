import { ReadinessContainer } from '../../components/ReadinessContainer';
import type { PortalState } from '../portalState';

export function AssessmentReadinessPage(props: Pick<PortalState, 'submission' | 'updateCheck'>) {
  return <ReadinessContainer {...props} />;
}
