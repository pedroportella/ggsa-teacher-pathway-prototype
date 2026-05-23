import type { ReactNode } from 'react';
import './Filter.scss';
export function Filter({ children }: { children: ReactNode }) {
  return <div className="health-filter">{children}</div>;
}
