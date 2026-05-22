import type { ReactNode } from 'react';
import { SideNav } from '../SideNav';
import type { NavLink } from '../types';
import './Sidebar.scss';

export interface SidebarProps {
  children?: ReactNode;
  links?: NavLink[];
  title?: string;
}

export function Sidebar({ children, links, title }: SidebarProps) {
  return (
    <>
      {links && <SideNav links={links} title={title} />}
      {children}
    </>
  );
}
