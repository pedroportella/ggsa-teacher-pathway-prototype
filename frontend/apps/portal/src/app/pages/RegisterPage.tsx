import { RegisterContainer } from '../../components/RegisterContainer';
import type { PortalState } from '../portalState';

export function RegisterPage(props: Pick<PortalState, 'isRegisterLoading' | 'notice' | 'register' | 'summary'>) {
  return <RegisterContainer {...props} />;
}
