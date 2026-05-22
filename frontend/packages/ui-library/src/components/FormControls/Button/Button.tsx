import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import './Button.scss';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type CommonButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  onNavigate?: (route: string) => void;
  variant?: ButtonVariant;
  'data-testid'?: string;
};

type AnchorButtonProps = CommonButtonProps & {
  href: string;
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  route?: never;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  type?: never;
};

type RouteButtonProps = CommonButtonProps & {
  href?: never;
  rel?: never;
  route: string;
  target?: never;
  type?: never;
};

type NativeButtonProps = CommonButtonProps & {
  href?: never;
  route?: never;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

export type ButtonProps = AnchorButtonProps | RouteButtonProps | NativeButtonProps;

export function Button({
  children,
  className,
  disabled = false,
  onClick,
  onNavigate,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const buttonClassName = classNames(
    'au-btn',
    variant !== 'primary' && `au-btn--${variant}`,
    disabled && 'au-btn--disabled',
    className,
  );

  const stopIfDisabled = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!disabled) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  if ('route' in props && typeof props.route === 'string') {
    const { route, id, 'data-testid': dataTestId } = props;

    return (
      <a
        aria-disabled={disabled || undefined}
        className={buttonClassName}
        data-testid={dataTestId}
        href={disabled ? undefined : route}
        id={id}
        onClick={(event) => {
          if (stopIfDisabled(event)) return;
          onClick?.(event);
          if (!event.defaultPrevented && onNavigate) {
            event.preventDefault();
            onNavigate(route);
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </a>
    );
  }

  if ('href' in props && typeof props.href === 'string') {
    const { href, id, rel, target, 'data-testid': dataTestId } = props;

    return (
      <a
        aria-disabled={disabled || undefined}
        className={buttonClassName}
        data-testid={dataTestId}
        href={disabled ? undefined : href}
        id={id}
        onClick={(event) => {
          if (stopIfDisabled(event)) return;
          onClick?.(event);
        }}
        rel={rel}
        role="button"
        tabIndex={disabled ? -1 : 0}
        target={target}
      >
        {children}
      </a>
    );
  }

  const { id, type = 'button', 'data-testid': dataTestId } = props;

  return (
    <button
      className={buttonClassName}
      data-testid={dataTestId}
      disabled={disabled}
      id={id}
      onClick={(event) => {
        if (stopIfDisabled(event)) return;
        onClick?.(event);
      }}
      type={type}
    >
      {children}
    </button>
  );
}
