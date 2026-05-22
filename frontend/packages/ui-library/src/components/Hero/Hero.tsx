import type { ReactNode } from 'react';
import './Hero.scss';

export function Hero({
  actions,
  children,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className="health-hero adha-hero" aria-labelledby="page-title">
      <div className="container">
        {eyebrow && <p className="health-hero__category">{eyebrow}</p>}
        <h1 id="page-title">{title}</h1>
        {description && <p>{description}</p>}
        {actions && <div className="health-hero__actions">{actions}</div>}
        {children}
      </div>
    </section>
  );
}
