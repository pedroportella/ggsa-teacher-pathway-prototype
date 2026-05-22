import type { TemplateProps } from '../types';
import './ListingPage.scss';
export function ListingPage({ title, children }: TemplateProps) { return <section className="container health-listing-page"><h1>{title}</h1><div>{children}</div></section>; }
