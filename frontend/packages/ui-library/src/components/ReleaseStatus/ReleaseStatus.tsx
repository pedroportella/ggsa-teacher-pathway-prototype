import type { ReactNode } from 'react';
import './ReleaseStatus.scss';
export function ReleaseStatus({ children }: { children: ReactNode }) {
  return <div className="health-release-status">{children}</div>;
}
