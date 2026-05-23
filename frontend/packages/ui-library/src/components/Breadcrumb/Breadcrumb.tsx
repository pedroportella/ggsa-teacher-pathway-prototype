import type { NavLink } from '../types';
import './Breadcrumb.scss';
export function Breadcrumb({ links }: { links: NavLink[] }) {
  return (
    <nav aria-label="Breadcrumb" className="au-breadcrumbs">
      <h2 className="au-sronly">You are here</h2>
      <ol className="au-link-list au-link-list--inline">
        {links.map((link) => (
          <li key={link.href}>
            <a aria-current={link.current ? 'page' : undefined} href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
