import type { ReactNode } from 'react';
import './Field.scss';
export function Field({
  label,
  children,
  inline,
}: {
  label: ReactNode;
  children: ReactNode;
  inline?: boolean;
}) {
  return (
    <div className={`health-field${inline ? ' health-field--inline' : ''}`}>
      <div className="health-field__label">{label}</div>
      <div className="health-field__item">{children}</div>
    </div>
  );
}
