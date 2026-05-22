import type { ReactNode } from 'react';
import './PageAlerts.scss';
export function PageAlerts({ title, children, type = 'info' }: { title: ReactNode; children: ReactNode; type?: string }) { return <div className={`au-page-alerts au-page-alerts--${type}`}><h2 className="au-display-md">{title}</h2><div>{children}</div></div>; }
