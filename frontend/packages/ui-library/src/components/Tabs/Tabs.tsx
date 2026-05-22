import type { ReactNode } from 'react';
import './Tabs.scss';

export function Tabs({
  tabs,
}: {
  tabs: Array<{ id: string; label: ReactNode; content: ReactNode; active?: boolean }>;
}) {
  return (
    <div className="health-tabs">
      <ul className="health-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a href={`#${tab.id}`} role="tab" aria-selected={tab.active}>
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
      {tabs.map((tab) => (
        <section key={tab.id} id={tab.id} className="health-tabs__panel" role="tabpanel">
          {tab.content}
        </section>
      ))}
    </div>
  );
}
