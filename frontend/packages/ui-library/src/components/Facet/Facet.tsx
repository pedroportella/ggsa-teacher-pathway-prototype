import type { ReactNode } from 'react';
import './Facet.scss';
export function Facet({ title, children }: { title: ReactNode; children?: ReactNode }) { return <section className="health-facet"><h2>{title}</h2>{children}</section>; }
