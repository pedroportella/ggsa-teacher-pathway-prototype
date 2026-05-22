import type { ReactNode } from 'react';
import { classNames } from '@ggsa/utils';
import './Card.scss';
export function Card({ title, children, href, meta, tag, shadow = true }: { title: ReactNode; children?: ReactNode; href?: string; meta?: ReactNode; tag?: ReactNode; shadow?: boolean }) {
  return <article className={classNames('health-card', shadow && 'health-card--shadow', href && 'health-card--clickable')}><div className="health-card__body"><h2 className="health-card__title">{href ? <a className="health-card__link" href={href}>{title}</a> : title}</h2>{children && <div className="health-card__text">{children}</div>}{meta && <div className="health-card__date">{meta}</div>}{tag && <div className="health-card__tag">{tag}</div>}</div></article>;
}
export function Panel({ id, title, eyebrow, children, wide = false }: { id?: string; title: ReactNode; eyebrow?: ReactNode; children: ReactNode; wide?: boolean }) {
  return <section id={id} className={classNames('health-card health-card--shadow panel', wide && 'panel--wide')}><div className="health-card__body">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="health-card__title">{title}</h2>{children}</div></section>;
}
export function MetricCard({ label, value, icon }: { label: ReactNode; value: ReactNode; icon?: ReactNode }) {
  return <Card title={value}><div className="metric-card">{icon}<p className="metric-card__label">{label}</p></div></Card>;
}
