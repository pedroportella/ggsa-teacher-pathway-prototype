import type { ReactNode } from 'react';
import './FieldGroups.scss';

export function FieldGroups({ items }: { items: Array<{ label: ReactNode; value: ReactNode }> }) {
  return (
    <div className="health-field-group">
      {items.map((item, index) => (
        <div className="health-field health-field--inline" key={index}>
          <div className="health-field__label">{item.label}</div>
          <div className="health-field__item">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Form({ children, onSubmit }: { children: ReactNode; onSubmit?: () => void }) {
  return (
    <form
      className="au-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      {children}
    </form>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="au-form__item hds-form-actions">{children}</div>;
}
