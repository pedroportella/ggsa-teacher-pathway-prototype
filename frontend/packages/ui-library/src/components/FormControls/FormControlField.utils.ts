import type { ReactNode } from 'react';

export type FormControlToneProps = {
  alert?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  filled?: boolean;
  hint?: ReactNode;
  required?: boolean;
  success?: ReactNode;
};

export function getDescribedBy(id: string, props: FormControlToneProps) {
  return (
    [
      props.error ? `${id}-error` : undefined,
      props.success ? `${id}-success` : undefined,
      props.alert ? `${id}-alert` : undefined,
      props.description || props.hint ? `${id}-hint` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined
  );
}
