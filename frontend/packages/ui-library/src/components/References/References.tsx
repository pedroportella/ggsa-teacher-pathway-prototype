import type { ReactNode } from 'react';
import './References.scss';
export function References({ items }: { items: ReactNode[] }) {
  return (
    <section className="health-references">
      <h2>References</h2>
      <ol>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
