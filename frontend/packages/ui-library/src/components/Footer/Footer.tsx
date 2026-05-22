import type { ReactNode } from 'react';
import type { NavLink } from '../types';
import { ggsaBrand } from '@ggsa/ui-assets';
import { Button } from '../FormControls';
import './Footer.scss';

export type FooterSection = {
  action?: {
    href: string;
    label: ReactNode;
  };
  ariaLabel?: string;
  content?: ReactNode;
  links?: NavLink[];
  title?: ReactNode;
};

export type FooterProps = {
  brandName?: ReactNode;
  copyright?: ReactNode;
  links?: NavLink[];
  sections?: FooterSection[];
};

const defaultSections: FooterSection[] = [
  {
    links: [
      { href: '#about', label: 'About us' },
      { href: '#contact', label: 'Contact us' },
      { href: '#news', label: 'News' },
      { href: '#media', label: 'Media centre' },
      { href: '#accessibility', label: 'Accessibility' },
    ],
    title: 'About GGSA',
  },
  {
    links: [
      { href: '#privacy', label: 'Privacy' },
      { href: '#copyright', label: 'Copyright' },
      { href: '#disclaimer', label: 'Disclaimer' },
    ],
    title: 'Using this website',
  },
  {
    action: { href: '#feedback', label: 'Provide feedback' },
    content: 'We are always looking for ways to improve our website.',
    title: 'Help us improve',
  },
];

export function Footer({
  brandName = ggsaBrand.productName,
  copyright = 'Copyright Good to Great Schools Australia',
  links,
  sections,
}: FooterProps) {
  const footerSections = sections ?? (links ? [{ links, title: brandName }] : defaultSections);

  return (
    <footer className="au-footer au-footer--dark au-body au-body--dark" role="contentinfo">
      <div className="container">
        <div className="layout layout--threecol-section layout--threecol-section--33-34-33 au-footer__portal-layout">
          {footerSections.map((section, index) => (
            <section className="layout__region au-footer__navigation-section" key={index}>
              {section.title && <h2>{section.title}</h2>}
              {section.content && <p>{section.content}</p>}
              {section.links && (
                <nav aria-label={section.ariaLabel ?? 'footer'}>
                  <ul className="au-link-list">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a aria-current={link.current ? 'page' : undefined} href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              {section.action && (
                <Button className="au-btn--dark standard-gap" href={section.action.href} variant="secondary">
                  {section.action.label}
                </Button>
              )}
            </section>
          ))}
        </div>
        <div className="au-footer__end">
          <div className="row">
            <div className="col-xs-12">
              <p><small>{copyright}</small></p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
