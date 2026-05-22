'use client';

import { RegisterPage } from '../pages';
import { usePortalState } from '../PortalContext';

export function RegisterRoute() {
  const { notice, register, summary } = usePortalState();

  return <RegisterPage notice={notice} register={register} summary={summary} />;
}
