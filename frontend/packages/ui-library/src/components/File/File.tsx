import type { ReactNode } from 'react';
import './File.scss';
export function File({ href, name, meta }: { href: string; name: ReactNode; meta?: ReactNode }) {
  return (
    <a className="health-file" href={href}>
      {name}
      {meta && <span className="health-file__meta"> {meta}</span>}
    </a>
  );
}
