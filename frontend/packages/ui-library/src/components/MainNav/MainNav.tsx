import type { NavLink } from '../types';
import './MainNav.scss';

type MainNavProps = {
  dark?: boolean;
  id?: string;
  links: NavLink[];
  mobileLinks?: NavLink[];
  withSearchToggle?: boolean;
};

function Icon({ children }: { children: string }) {
  return (
    <span aria-hidden="true" className="svg-inline--fa fa-fw">
      <svg viewBox="0 0 24 24">
        <path d={children}></path>
      </svg>
    </span>
  );
}

function renderNavItems(links: NavLink[], mobileOnly = false) {
  return links.map((link) => (
    <li
      className={[
        link.current ? 'active' : undefined,
        link.children?.length ? 'au-main-nav__dropdown-control' : undefined,
        mobileOnly ? 'au-main-nav--mobile-only' : undefined,
      ].filter(Boolean).join(' ') || undefined}
      key={link.href}
    >
      <a aria-current={link.current ? 'page' : undefined} href={link.href}>{link.label}</a>
      {link.children && link.children.length > 0 && (
        <div className="au-main-nav__dropdown">
          <ul className="au-link-list">
            {link.children.map((child) => (
              <li key={child.href}>
                <a aria-current={child.current ? 'page' : undefined} href={child.href}>{child.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  ));
}

export function MainNav({ dark = false, id = 'main-nav-default', links, mobileLinks = [], withSearchToggle = true }: MainNavProps) {
  return (
    <nav aria-label="main" className={['au-main-nav', dark ? 'au-main-nav--dark' : undefined].filter(Boolean).join(' ')} id="main-navigation">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="au-main-nav__content" id={id}>
              <button aria-controls={id} aria-expanded="false" className="au-main-nav__toggle au-main-nav__toggle--open" type="button">
                <Icon>M3 6h18M3 12h18M3 18h18</Icon>
                Menu
              </button>
              {withSearchToggle && (
                <button className="au-main-nav__toggle au-main-nav__toggle--search au-main-nav__toggle--open" type="button">
                  <span className="svg-inline--fa fa-fw au-main-nav__toggle--search__closed" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm8.7 16.1-4.2-4.2"></path></svg>
                  </span>
                  <span className="svg-inline--fa fa-fw au-main-nav__toggle--search__open" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"></path></svg>
                  </span>
                  Search
                </button>
              )}
              <div className="au-main-nav__menu">
                <div className="au-main-nav__menu-inner">
                  <div className="au-main-nav__focus-trap-top"></div>
                  <button aria-controls={id} className="au-main-nav__toggle au-main-nav__toggle--close" type="button">
                    <Icon>M6 6l12 12M18 6 6 18</Icon>
                    Close
                  </button>
                  <ul className="au-link-list">
                    {renderNavItems(links)}
                    {renderNavItems(mobileLinks, true)}
                  </ul>
                  <div className="au-main-nav__focus-trap-bottom"></div>
                </div>
              </div>
              <div aria-controls={id} className="au-main-nav__overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
