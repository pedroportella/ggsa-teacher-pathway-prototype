import type { ReactNode } from 'react';
import './Listing.scss';
export function Listing({ title, href, children }: { title: ReactNode; href: string; children?: ReactNode }) { return <article className="health-listing"><h2><a href={href}>{title}</a></h2>{children}</article>; }
