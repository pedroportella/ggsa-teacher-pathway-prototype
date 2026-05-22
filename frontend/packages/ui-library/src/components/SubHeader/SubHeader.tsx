import type { ReactNode } from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { Toolbar, type ToolbarAction } from '../Toolbar';
import type { NavLink } from '../types';
import './SubHeader.scss';

export type SubHeaderProps = {
  breadcrumbs?: NavLink[];
  children?: ReactNode;
  dark?: boolean;
  introduction?: ReactNode;
  sectionLink?: NavLink;
  title: ReactNode;
  toolbarActions?: ToolbarAction[];
};

export function SubHeader({ breadcrumbs = [], children, dark = true, introduction, sectionLink, title, toolbarActions }: SubHeaderProps) {
  return (
    <div className={['health-sub-header', dark ? 'health-sub-header--dark' : undefined].filter(Boolean).join(' ')}>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8">
            {breadcrumbs.length > 0 && <Breadcrumb links={breadcrumbs} />}
            {sectionLink && (
              <div className="health-sub-header__section-title">
                <a className="au-direction-link au-direction-link--left" href={sectionLink.href}>{sectionLink.label}</a>
              </div>
            )}
            <h1>{title}</h1>
            {introduction && <p className="au-introduction">{introduction}</p>}
            {children}
          </div>
          {toolbarActions && toolbarActions.length > 0 && (
            <div className="col-xs-12 col-md-4">
              <Toolbar actions={toolbarActions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
