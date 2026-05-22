import type { NavLink } from '../types';
import './SideNav.scss';

function renderLinks(links: NavLink[]) {
  return (
    <ul className="au-link-list">
      {links.map((link) => (
        <li className={[link.current ? 'active' : undefined, link.children?.length ? 'expanded active-trail' : undefined].filter(Boolean).join(' ') || undefined} key={link.href}>
          <a aria-current={link.current ? 'page' : undefined} className={link.current ? 'active' : undefined} href={link.href}>{link.label}</a>
          {link.children && renderLinks(link.children)}
        </li>
      ))}
    </ul>
  );
}

export function SideNav({
  links,
  title,
  titleHref = '#',
}: {
  links: NavLink[];
  title?: string;
  titleHref?: string;
}) {
  return (
    <aside aria-label="side navigation" className="au-side-nav">
      <div className="au-side-nav__content">
        {title && <h2 className="au-sidenav__title"><a href={titleHref}>{title}</a></h2>}
        <nav>{renderLinks(links)}</nav>
      </div>
    </aside>
  );
}
