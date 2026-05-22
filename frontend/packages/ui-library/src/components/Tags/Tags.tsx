import type { ReactNode } from 'react';
import './Tags.scss';
export function Tags({ items, tone }: { items: ReactNode[]; tone?: string }) { return <ul className={`au-tags au-tags--inline${tone ? ` au-tags--${tone}` : ''}`}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>; }
