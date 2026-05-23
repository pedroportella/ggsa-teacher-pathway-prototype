import type { ReactNode } from 'react';
import './Footnotes.scss';
export function Footnotes({ items }: { items: ReactNode[] }) {
  return (
    <ol className="health-footnotes">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}
