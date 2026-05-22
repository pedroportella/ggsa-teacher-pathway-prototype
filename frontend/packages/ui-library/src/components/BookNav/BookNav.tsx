import type { NavLink } from '../types';
import './BookNav.scss';
export function BookNav({ links }: { links: NavLink[] }) { return <nav className="health-book-nav" aria-label="book"><ul className="au-link-list">{links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>; }
