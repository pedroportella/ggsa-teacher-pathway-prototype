import type { ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import './Callout.scss';
export function Callout({
  title,
  children,
  tone,
}: {
  title: ReactNode;
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'error';
}) {
  return (
    <aside className={classNames('au-callout', tone ? 'au-callout--' + tone : undefined)}>
      <h2 className="au-display-md">{title}</h2>
      <div>{children}</div>
    </aside>
  );
}
