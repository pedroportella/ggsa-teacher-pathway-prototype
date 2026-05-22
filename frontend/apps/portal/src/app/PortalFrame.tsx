'use client';

import { Button, Layout } from '@ggsa/ui-library';
import type { ReactNode } from 'react';
import { usePortalState } from './PortalContext';
import { getPortalLinks } from './routes';

export function PortalFrame({ children }: { children: ReactNode }) {
  const { isRegisterLoading, navigate, refreshRegister, route } = usePortalState();
  const links = getPortalLinks(route);

  return (
    <Layout
      links={links}
      footer={{
        copyright: 'Copyright 2026 Good to Great Schools Australia. Teacher Pathway portal.',
        sections: [
          {
            content: 'This portal supports professional learning for teachers through structured plans, evidence portfolios and pathway readiness views aligned to the Mastery Teaching Pathway.',
          },
          {
            ariaLabel: 'Portal footer links',
            links,
            title: 'Using this portal',
          },
          {
            action: { href: '/about', label: 'About this Portal' },
            content: 'A plain-language guide to what the portal does for teachers, schools and GGSA coaches.',
            title: 'About this Portal',
          },
        ],
      }}
      subHeader={{
        introduction: 'A working GGSA Teacher Pathway portal for personalised learning plans, prerequisite and core modules, evidence portfolios, certification readiness and RPL support.',
        title: 'Teacher Learning Pathways powered by headless WordPress.',
        children: (
          <div className="portal-sub-header__actions">
            <Button route="/learning-plan" onNavigate={() => navigate('learning-plan')}>Create learning plan</Button>
            <Button className="au-btn--dark" variant="secondary" type="button" disabled={isRegisterLoading} onClick={refreshRegister}>
              {isRegisterLoading ? 'Loading register' : 'Refresh register'}
            </Button>
          </div>
        ),
      }}
    >
      {children}
    </Layout>
  );
}
