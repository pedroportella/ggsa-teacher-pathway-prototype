import type { ReactNode } from 'react';
import './InlineReference.scss';
export function InlineReference({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <aside className="health-reference health-reference--inline">
      <h2>{title}</h2>
      {children}
    </aside>
  );
}
