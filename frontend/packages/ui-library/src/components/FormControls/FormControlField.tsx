import type { ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { classNames } from '@ggsa/utils';
import { LabelMandatory } from './LabelMandatory';
import { getDescribedBy, type FormControlToneProps } from './FormControlField.utils';

type FormControlFieldProps = FormControlToneProps & {
  children: ReactNode;
  id: string;
  label: ReactNode;
};

export function FormControlField({
  alert,
  children,
  description,
  error,
  filled,
  hint,
  id,
  label,
  required,
  success,
}: FormControlFieldProps) {
  const describedBy = getDescribedBy(id, { alert, description, error, hint, success });

  return (
    <div
      className={classNames('au-form__item', filled && 'au-form__item--filled')}
      data-testid={`${id}-wrapper`}
    >
      <label htmlFor={id}>
        {label}
        {required && <LabelMandatory />}
      </label>
      {(description || hint) && (
        <div className="au-form__item-description" id={`${id}-hint`}>
          {description || hint}
        </div>
      )}
      {alert && (
        <div className="au-page-alerts au-page-alerts--warning" id={`${id}-alert`}>
          {alert}
        </div>
      )}
      {error && (
        <div className="au-page-alerts au-page-alerts--error" id={`${id}-error`}>
          {error}
        </div>
      )}
      {success && (
        <div className="au-page-alerts au-page-alerts--success" id={`${id}-success`}>
          {success}
        </div>
      )}
      {isValidElement(children)
        ? cloneElement(
            children as ReactElement<{ 'aria-describedby'?: string; 'aria-invalid'?: boolean }>,
            {
              'aria-describedby': describedBy,
              'aria-invalid': Boolean(error) || undefined,
            },
          )
        : children}
    </div>
  );
}
