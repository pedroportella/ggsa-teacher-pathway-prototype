import type { TemplateProps } from '../types';
import './ContentPage.scss';
export function ContentPage({ title, children }: TemplateProps) {
  return (
    <section className="container health-content-page">
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  );
}
