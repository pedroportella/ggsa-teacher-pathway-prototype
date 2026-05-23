import type { ReactNode } from 'react';
export interface NavLink {
  children?: NavLink[];
  current?: boolean;
  href: string;
  label: string;
}
export interface TemplateProps {
  title: string;
  children: ReactNode;
}
