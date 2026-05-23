import type { ReactNode } from 'react';
import { ggsaBrand, ggsaLogoSvg } from '@ggsa/ui-assets';
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

type ImageAsset = string | { src: string };

const assetSrc = (asset: ImageAsset) => (typeof asset === 'string' ? asset : asset.src);
const defaultLogo = assetSrc(ggsaLogoSvg);

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
              <img
                alt={logoAlt}
                className="au-header__logo-image au-responsive-media-img"
                src={logoSrc}
              />
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
                <li>
                  <a href="/about">About this Portal</a>
                </li>
              </ul>
            </div>
            <div className="health-search health-search--global">
              <div className="health-search__form__input-wrapper">
                <form
                  action={searchAction}
                  className="au-form health-search__form health-search__form--global"
                  role="search"
                >
                  <div className="au-form__item health-search__query-field health-search__query-field--global">
                    <label className="au-sronly" htmlFor={searchId}>
                      Search
                    </label>
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
                  <input
                    className="au-btn au-btn button health-search__form__submit health-search__form__submit--global"
                    name="submit"
                    type="submit"
                    value="Search"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
