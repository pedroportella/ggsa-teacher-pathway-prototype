'use client';

import { Button, Layout } from '@ggsa/ui-library';
import type { ReactNode } from 'react';
import { usePortalState } from './PortalContext';
import { getPortalLinks } from './routes';

export function PortalFrame({ children }: { children: ReactNode }) {
  const { navigate, refreshRegister, route } = usePortalState();
  const links = getPortalLinks(route);

  return (
    <Layout
      links={links}
      footer={{
        copyright: 'Copyright 2026 Good to Great Schools Australia. Teacher Pathway prototype.',
        sections: [
          {
            content: 'This prototype supports professional learning for teachers through structured plans, evidence portfolios and pathway readiness views aligned to the Mastery Teaching Pathway.',
          },
          {
            ariaLabel: 'Portal footer links',
            links,
            title: 'Using this portal',
          },
          {
            action: { href: '/about', label: 'View architecture' },
            content: 'The implementation keeps the design system intact and uses a headless WordPress and LearnDash-style service layer.',
            title: 'Headless WordPress delivery',
          },
        ],
      }}
      subHeader={{
        introduction: 'A working GGSA Teacher Pathway portal for personalised learning plans, prerequisite and core modules, evidence portfolios, certification readiness and RPL support.',
        title: 'Teacher Learning Pathways powered by headless WordPress.',
        children: (
          <div className="portal-sub-header__actions">
            <Button route="/learning-plan" onNavigate={() => navigate('learning-plan')}>Create learning plan</Button>
            <Button className="au-btn--dark" variant="secondary" type="button" onClick={refreshRegister}>Refresh register</Button>
          </div>
        ),
      }}
    >
      {children}
    </Layout>
  );
}
