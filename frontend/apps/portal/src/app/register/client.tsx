'use client';

import { RegisterPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function RegisterRoute() {
  const { isRegisterLoading, notice, register, summary } = usePortalState();

  return <RegisterPage isRegisterLoading={isRegisterLoading} notice={notice} register={register} summary={summary} />;
}
