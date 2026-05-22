import type { NavLink } from '../types';
import './InpageNav.scss';
export function InpageNav({ links }: { links: NavLink[] }) { return <nav className="au-inpage-nav-links" aria-label="on this page"><ul className="au-link-list">{links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>; }
