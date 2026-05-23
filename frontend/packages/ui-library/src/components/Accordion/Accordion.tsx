import type { ReactNode } from 'react';
import './Accordion.scss';
export function Accordion({
  id,
  title,
  children,
  open = false,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <section className="au-accordion">
      <button className="au-accordion__title" type="button" aria-expanded={open} aria-controls={id}>
        {title}
      </button>
      <div className="au-accordion__body" id={id}>
        {children}
      </div>
    </section>
  );
}
