import type { ReactNode } from 'react';
import './SearchResult.scss';
export function SearchResult({
  title,
  href,
  summary,
}: {
  title: ReactNode;
  href: string;
  summary?: ReactNode;
}) {
  return (
    <article className="health-search-result">
      <h2>
        <a href={href}>{title}</a>
      </h2>
      {summary}
    </article>
  );
}
