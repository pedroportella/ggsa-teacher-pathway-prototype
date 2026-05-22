import type { TemplateProps } from '../types';
import './CampaignPage.scss';
export function CampaignPage({ title, children }: TemplateProps) { return <section className="container health-campaign-page"><h1>{title}</h1><div>{children}</div></section>; }
