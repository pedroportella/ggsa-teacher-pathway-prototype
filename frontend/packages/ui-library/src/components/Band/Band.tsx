import type { ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import { Button, type ButtonProps } from '../FormControls';
import './Band.scss';

export type BandVariant =
  | 'default'
  | 'light'
  | 'dark'
  | 'feature'
  | 'callout'
  | 'image'
  | 'cards'
  | 'compact';

export type BandAction = Omit<ButtonProps, 'children'> & {
  label: ReactNode;
};

export type BandImage = {
  alt?: string;
  position?: 'left' | 'right';
  src: string;
};

export type BandProps = {
  actions?: BandAction[];
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  contained?: boolean;
  description?: ReactNode;
  eyebrow?: ReactNode;
  id?: string;
  image?: BandImage;
  title?: ReactNode;
  titleId?: string;
  variant?: BandVariant;
};

export function Band({
  actions = [],
  ariaLabel,
  children,
  className,
  contained = true,
  description,
  eyebrow,
  id,
  image,
  title,
  titleId,
  variant = 'default',
}: BandProps) {
  const headingId = titleId ?? (id ? `${id}-title` : undefined);
  const hasImage = variant === 'image' && image;

  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={title && headingId ? headingId : undefined}
      className={classNames(
        'health-band',
        `health-band--${variant}`,
        hasImage && `health-band--image-${image.position ?? 'right'}`,
        className,
      )}
      id={id}
    >
      <div className={classNames(contained && 'container', 'health-band__inner')}>
        {hasImage && image.position === 'left' && (
          <div className="health-band__media">
            <img alt={image.alt ?? ''} className="health-image au-responsive-media-img" src={image.src} />
          </div>
        )}
        <div className="health-band__content">
          {eyebrow && <p className="health-band__eyebrow">{eyebrow}</p>}
          {title && <h2 className="health-band__title" id={headingId}>{title}</h2>}
          {description && <p className="health-band__description">{description}</p>}
          {children && <div className={classNames('health-band__body', variant === 'cards' && 'health-band__body--cards')}>{children}</div>}
          {actions.length > 0 && (
            <div className="health-band__actions">
              {actions.map(({ label, ...action }, index) => (
                <Button key={index} {...action as ButtonProps}>
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {hasImage && image.position !== 'left' && (
          <div className="health-band__media">
            <img alt={image.alt ?? ''} className="health-image au-responsive-media-img" src={image.src} />
          </div>
        )}
      </div>
    </section>
  );
}
