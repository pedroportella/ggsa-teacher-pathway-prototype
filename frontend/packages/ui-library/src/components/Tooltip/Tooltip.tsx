import type { ReactNode } from 'react';
import './Tooltip.scss';
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="health-tooltip" data-tooltip={label}>
      {children}
    </span>
  );
}
