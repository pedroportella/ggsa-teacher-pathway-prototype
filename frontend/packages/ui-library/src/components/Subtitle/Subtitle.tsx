import type { ReactNode } from 'react';
import './Subtitle.scss';
export function Subtitle({ children }: { children: ReactNode }) { return <p className="health-subtitle">{children}</p>; }
