import type { ReactNode } from 'react';
import { ggsaBrand } from '@ggsa/ui-assets';
import type { NavLink } from '../types';
import './Header.scss';

export type HeaderProps = {
  brandName?: ReactNode;
  homeHref?: string;
  logoAlt?: string;
  logoSrc?: string;
  searchAction?: string;
  searchId?: string;
  searchName?: string;
  searchPlaceholder?: string;
  screenReaderBrand?: ReactNode;
  subline?: ReactNode;
  subNavLinks?: NavLink[];
};

const defaultLogo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 620 96'%3E%3Crect width='620' height='96' fill='%23fff'/%3E%3Ctext x='24' y='58' font-family='Arial, sans-serif' font-size='34' font-weight='700' fill='%2300558c'%3EGGSA%3C/text%3E%3Ctext x='132' y='58' font-family='Arial, sans-serif' font-size='23' fill='%23222'%3EGood to Great Schools Australia%3C/text%3E%3C/svg%3E`;

export function Header({
  brandName,
  homeHref = '/',
  logoAlt = ggsaBrand.markLabel,
  logoSrc = defaultLogo,
  searchAction = '/search',
  searchId = 'search-field',
  searchName = 'search',
  searchPlaceholder = 'Search this website',
  screenReaderBrand = ggsaBrand.markLabel,
  subline,
  subNavLinks: _subNavLinks = [],
}: HeaderProps) {
  return (
    <header className="au-header pillars-container" role="banner">
      <div className="container">
        <div id="pillars"></div>
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <a className="au-header__logo" href={homeHref} rel="home" title="Home">
              <img alt={logoAlt} className="au-header__logo-image au-responsive-media-img" src={logoSrc} />
            </a>
            <div className="au-sronly">
              <p>{screenReaderBrand}</p>
            </div>
            {(brandName || subline) && (
              <div className="au-header__lockup">
                {brandName && <div className="au-header__title">{brandName}</div>}
                {subline && <div className="au-header__subline">{subline}</div>}
              </div>
            )}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="health-sub-nav text--align-right">
              <h3 className="au-sronly">Sub menu</h3>
              <ul className="au-link-list au-link-list--inline">
                <a href="#about-us">About us</a>
              </ul>
            </div>
            <div className="health-search health-search--global">
              <form action={searchAction} className="au-form">
                <div className="health-search__form__input-wrapper">
                  <div className="au-form__item">
                    <label className="au-sronly" htmlFor={searchId}>Search</label>
                    <input
                      autoComplete="off"
                      className="health-search__form__input au-text-input au-text-input--block"
                      id={searchId}
                      maxLength={128}
                      name={searchName}
                      placeholder={searchPlaceholder}
                      size={30}
                      type="text"
                    />
                  </div>
                  <div className="health-loading"></div>
                </div>
                <input
                  className="au-btn button health-search__form__submit health-search__form__submit--global"
                  name="submit"
                  type="submit"
                  value="Search"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
