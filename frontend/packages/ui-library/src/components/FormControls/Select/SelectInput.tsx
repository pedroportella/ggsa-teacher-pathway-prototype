import type { ChangeEventHandler, ReactNode, SelectHTMLAttributes } from 'react';
import { classNames } from '@ggsa/utils';
import { FormControlField } from '../FormControlField';
import type { FormControlToneProps } from '../FormControlField.utils';
import './SelectInput.scss';

export type SelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type SelectInputProps = FormControlToneProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'onChange'> & {
  id: string;
  label: ReactNode;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onValueChange?: (value: string | string[]) => void;
  options: readonly (SelectOption | string)[];
  width?: 'sm' | 'md' | 'lg' | 'full' | string;
};

function normaliseOption(option: SelectOption | string): SelectOption {
  return typeof option === 'string' ? { label: option, value: option } : option;
}

export function SelectInput({
  alert,
  className,
  description,
  error,
  filled,
  hint,
  id,
  label,
  multiple,
  onChange,
  onValueChange,
  options,
  required,
  success,
  width = 'full',
  ...props
}: SelectInputProps) {
  return (
    <FormControlField
      alert={alert}
      description={description}
      error={error}
      filled={filled}
      hint={hint}
      id={id}
      label={label}
      required={required}
      success={success}
    >
      <select
        {...props}
        className={classNames('au-select', `au-field-width--${width}`, error ? 'au-select--error' : undefined, success ? 'au-select--valid' : undefined, className)}
        id={id}
        multiple={multiple}
        name={props.name ?? id}
        onChange={(event) => {
          onChange?.(event);
          const selected = Array.from(event.currentTarget.selectedOptions).map((option) => option.value);
          onValueChange?.(multiple ? selected : selected[0]);
        }}
        required={required}
      >
        {options.map((option) => {
          const item = normaliseOption(option);

          return (
            <option disabled={item.disabled} key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </FormControlField>
  );
}
