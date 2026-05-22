import type { ReactNode } from 'react';
import './Metadata.scss';

export function Metadata({ items }: { items: Array<{ label: ReactNode; value: ReactNode }> }) {
  return (
    <div className="health-metadata">
      {items.map((item, index) => (
        <div className="health-field health-field--inline" key={index}>
          <div className="health-field__label">{item.label}</div>
          <div className="health-field__item">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
