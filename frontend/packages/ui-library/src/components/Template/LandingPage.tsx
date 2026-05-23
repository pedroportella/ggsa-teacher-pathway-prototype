import type { TemplateProps } from '../types';
import './LandingPage.scss';
export function LandingPage({ title, children }: TemplateProps) {
  return (
    <section className="container health-landing-page">
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  );
}
