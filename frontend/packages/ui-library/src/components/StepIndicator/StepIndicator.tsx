import type { ReactNode } from 'react';
import './StepIndicator.scss';
export function StepIndicator({ steps, current }: { steps: ReactNode[]; current: number }) { return <ol className="health-steps">{steps.map((step, index) => <li key={index} aria-current={index === current ? 'step' : undefined}>{step}</li>)}</ol>; }
