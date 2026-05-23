import type { ReactNode } from 'react';
import { Header, type HeaderProps } from '../Header';
import { Footer, type FooterProps } from '../Footer';
import { Sidebar } from '../Sidebar';
import { MainNav } from '../MainNav';
import { SubHeader, type SubHeaderProps } from '../SubHeader';
import type { NavLink } from '../types';
import './Layout.scss';

export type LayoutProps = {
  children: ReactNode;
  footer?: FooterProps;
  footerLinks?: NavLink[];
  header?: HeaderProps;
  links: NavLink[];
  sidebarLinks?: NavLink[];
  sidebarTitle?: string;
  subHeader?: SubHeaderProps;
};

export function Layout({
  children,
  footer,
  footerLinks,
  header,
  links,
  sidebarLinks,
  sidebarTitle,
  subHeader,
}: LayoutProps) {
  const resolvedFooterLinks = footerLinks ?? links;

  return (
    <div className="au-body au-grid app-shell">
      <nav className="au-skip-link" aria-label="skip links navigation">
        <a className="au-skip-link__link" href="#main-content">
          Skip to main content
        </a>
        <a className="au-skip-link__link" href="#main-navigation">
          Skip to main navigation
        </a>
      </nav>
      <Header subNavLinks={header?.subNavLinks ?? resolvedFooterLinks} {...header} />
      <MainNav links={links} mobileLinks={header?.subNavLinks ?? resolvedFooterLinks} />
      {subHeader && <SubHeader {...subHeader} />}
      <div className="container health-content">
        <div className="row">
          <main className={sidebarLinks ? 'col-sm-8' : 'col-xs-12'} id="main-content" role="main">
            {children}
          </main>
          {sidebarLinks && (
            <div className="col-sm-4">
              <Sidebar links={sidebarLinks} title={sidebarTitle} />
            </div>
          )}
        </div>
      </div>
      <Footer links={resolvedFooterLinks} {...footer} />
    </div>
  );
}
