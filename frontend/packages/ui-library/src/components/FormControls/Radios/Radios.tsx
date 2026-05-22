import type { ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import { getDescribedBy, type FormControlToneProps } from '../FormControlField.utils';
import { LabelMandatory } from '../LabelMandatory';
import './Radios.scss';

export interface RadioOption {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  value: string;
}

export type RadiosProps = FormControlToneProps & {
  children?: ReactNode;
  id?: string;
  legend: ReactNode;
  name: string;
  onChange?: (value: string) => void;
  options?: RadioOption[];
  value?: string;
};

function optionId(name: string, option: RadioOption) {
  return option.id ?? `${name}-${option.value}`;
}

export function Radios({
  alert,
  children,
  description,
  error,
  filled,
  hint,
  id,
  legend,
  name,
  onChange,
  options,
  required,
  success,
  value,
}: RadiosProps) {
  const fieldsetId = id ?? name;
  const describedBy = getDescribedBy(fieldsetId, { alert, description, error, hint, success });

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={Boolean(error) || undefined}
      className={classNames('au-form__item', filled && 'au-form__item--filled')}
      id={fieldsetId}
      role="radiogroup"
    >
      <legend>
        {legend}
        {required && <LabelMandatory />}
      </legend>
      {(description || hint) && <div className="au-form__item-description" id={`${fieldsetId}-hint`}>{description || hint}</div>}
      {alert && <div className="au-page-alerts au-page-alerts--warning" id={`${fieldsetId}-alert`}>{alert}</div>}
      {error && <div className="au-page-alerts au-page-alerts--error" id={`${fieldsetId}-error`}>{error}</div>}
      {success && <div className="au-page-alerts au-page-alerts--success" id={`${fieldsetId}-success`}>{success}</div>}
      {options
        ? options.map((option) => {
          const controlId = optionId(name, option);
          const checked = value !== undefined ? value === option.value : option.checked;

          return (
            <div className="au-form__item-type--radio" key={option.value}>
              <input
                aria-describedby={describedBy}
                checked={value !== undefined ? checked : undefined}
                className={classNames(error ? 'au-input--error' : undefined, success ? 'au-input--valid' : undefined)}
                defaultChecked={value !== undefined ? undefined : option.checked}
                disabled={option.disabled}
                id={controlId}
                name={name}
                onChange={() => onChange?.(option.value)}
                type="radio"
                value={option.value}
              />
              <label htmlFor={controlId}>{option.label}</label>
            </div>
          );
        })
        : children}
    </fieldset>
  );
}
