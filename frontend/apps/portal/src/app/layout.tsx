import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@health.gov.au/health-design-system/build/css/hds-all.css';
import '@ggsa/ui-library/theme.css';
import '../styles/main.scss';
import { PortalFrame } from './PortalFrame';
import { PortalProvider } from './PortalContext';

export const metadata: Metadata = {
  title: 'GGSA Teacher Pathway',
  description: 'Headless WordPress and Next.js teacher pathway portal for Good to Great Schools Australia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PortalProvider>
          <PortalFrame>{children}</PortalFrame>
        </PortalProvider>
      </body>
    </html>
  );
}
