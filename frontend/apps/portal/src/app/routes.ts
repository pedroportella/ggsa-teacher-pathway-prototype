import type { NavLink } from '@ggsa/ui-library';

export type PortalRoute = 'register' | 'pathway-readiness' | 'learning-plan' | 'about';

export const PORTAL_ROUTES: Array<NavLink & { route: PortalRoute }> = [
  { href: '/register', label: 'Learning plan register', route: 'register' },
  { href: '/pathway-readiness', label: 'Pathway readiness', route: 'pathway-readiness' },
  { href: '/learning-plan', label: 'Teacher learning plan', route: 'learning-plan' },
  { href: '/about', label: 'About this Portal', route: 'about' },
];

export function getRouteHref(route: PortalRoute): string {
  return PORTAL_ROUTES.find((item) => item.route === route)?.href ?? '/register';
}

export function getRouteFromPath(pathname: string): PortalRoute {
  const normalized = pathname.replace(/^\/+/, '') || 'register';
  const match = PORTAL_ROUTES.find((route) => route.href.replace(/^\/+/, '') === normalized);

  return match?.route ?? 'register';
}

export function getPortalLinks(currentRoute: PortalRoute): NavLink[] {
  return PORTAL_ROUTES.map((route) => ({
    ...route,
    current: route.route === currentRoute,
  }));
}
