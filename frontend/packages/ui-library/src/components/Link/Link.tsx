import type { ReactNode } from 'react';
import './Link.scss';
export function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="au-cta-link" href={href}>
      {children}
    </a>
  );
}
