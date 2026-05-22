import type { ReactNode } from 'react';
import './AccordionGroup.scss';
export function AccordionGroup({ items }: { items: Array<{ id: string; title: ReactNode; content: ReactNode; open?: boolean }> }) {
  return <div className="hds-accordion-group">{items.map((item) => <section className="au-accordion" key={item.id}><button className="au-accordion__title" type="button" aria-expanded={item.open ?? false} aria-controls={item.id}>{item.title}</button><div className="au-accordion__body" id={item.id}>{item.content}</div></section>)}</div>;
}
