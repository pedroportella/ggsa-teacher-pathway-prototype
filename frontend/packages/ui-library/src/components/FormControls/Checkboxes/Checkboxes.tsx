import type { ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import { getDescribedBy, type FormControlToneProps } from '../FormControlField.utils';
import { LabelMandatory } from '../LabelMandatory';
import './Checkboxes.scss';

export interface CheckboxOption {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  value: string;
}

export type CheckboxesProps = FormControlToneProps & {
  children?: ReactNode;
  id?: string;
  legend: ReactNode;
  name: string;
  onChange?: (value: string, checked: boolean, values: string[]) => void;
  options?: CheckboxOption[];
  values?: string[];
};

function optionId(name: string, option: CheckboxOption) {
  return option.id ?? `${name}-${option.value}`;
}

export function Checkboxes({
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
  values,
}: CheckboxesProps) {
  const fieldsetId = id ?? name;
  const describedBy = getDescribedBy(fieldsetId, { alert, description, error, hint, success });
  const selectedValues = values ? new Set(values) : undefined;

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={Boolean(error) || undefined}
      className={classNames('au-form__item', filled && 'au-form__item--filled')}
      id={fieldsetId}
      role="group"
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
          const checked = selectedValues ? selectedValues.has(option.value) : option.checked;

          return (
            <div className="au-form__item-type--checkbox" key={option.value}>
              <input
                aria-describedby={describedBy}
                checked={selectedValues ? checked : undefined}
                className={classNames(error ? 'au-input--error' : undefined, success ? 'au-input--valid' : undefined)}
                defaultChecked={selectedValues ? undefined : option.checked}
                disabled={option.disabled}
                id={controlId}
                name={name}
                onChange={(event) => {
                  const nextValues = new Set(selectedValues ?? options.filter((item) => item.checked).map((item) => item.value));
                  if (event.currentTarget.checked) nextValues.add(option.value);
                  else nextValues.delete(option.value);
                  onChange?.(option.value, event.currentTarget.checked, Array.from(nextValues));
                }}
                type="checkbox"
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
