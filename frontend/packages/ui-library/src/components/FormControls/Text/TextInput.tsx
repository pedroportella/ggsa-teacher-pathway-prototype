import type { ChangeEventHandler, FocusEventHandler, InputHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import { FormControlField } from '../FormControlField';
import type { FormControlToneProps } from '../FormControlField.utils';
import './TextInput.scss';

export type TextInputProps = FormControlToneProps & {
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  className?: string;
  disabled?: boolean;
  id: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  label: ReactNode;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  pattern?: string;
  placeholder?: string;
  type?: 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  width?: 'sm' | 'md' | 'lg' | 'full' | string;
};

export function TextInput({
  alert,
  className,
  description,
  error,
  filled,
  hint,
  id,
  label,
  required,
  success,
  type = 'text',
  width = 'full',
  ...props
}: TextInputProps) {
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
      <input
        {...props}
        className={classNames(
          'au-text-input',
          'au-text-input--block',
          `au-field-width--${width}`,
          error ? 'au-text-input--error' : undefined,
          success ? 'au-text-input--valid' : undefined,
          className,
        )}
        id={id}
        name={props.name ?? id}
        required={required}
        type={type}
      />
    </FormControlField>
  );
}
