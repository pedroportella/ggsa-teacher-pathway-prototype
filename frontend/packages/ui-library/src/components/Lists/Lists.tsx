import type { ReactNode } from 'react';
import './Lists.scss';
export function Lists({ items }: { items: ReactNode[] }) { return <ul className="health-list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>; }
