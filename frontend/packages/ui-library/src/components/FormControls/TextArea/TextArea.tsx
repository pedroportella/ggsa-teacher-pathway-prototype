import type { ChangeEventHandler, ReactNode, TextareaHTMLAttributes } from 'react';
import { classNames } from '@ggsa/utils';
import { FormControlField } from '../FormControlField';
import type { FormControlToneProps } from '../FormControlField.utils';
import './TextArea.scss';

export type TextAreaProps = FormControlToneProps & {
  autoComplete?: TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
  className?: string;
  cols?: number;
  disabled?: boolean;
  id: string;
  label: ReactNode;
  name?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  value?: TextareaHTMLAttributes<HTMLTextAreaElement>['value'];
  width?: 'sm' | 'md' | 'lg' | 'full' | string;
};

export function TextArea({
  alert,
  className,
  description,
  error,
  filled,
  hint,
  id,
  label,
  required,
  rows = 3,
  success,
  width = 'full',
  ...props
}: TextAreaProps) {
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
      <textarea
        {...props}
        className={classNames('au-text-input', 'au-text-input--block', `au-field-width--${width}`, error ? 'au-text-input--error' : undefined, success ? 'au-text-input--valid' : undefined, className)}
        id={id}
        name={props.name ?? id}
        required={required}
        rows={rows}
      />
    </FormControlField>
  );
}
