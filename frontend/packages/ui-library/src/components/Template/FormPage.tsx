import type { TemplateProps } from '../types';
import './FormPage.scss';
export function FormPage({ title, children }: TemplateProps) {
  return (
    <section className="container health-form-page">
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  );
}
