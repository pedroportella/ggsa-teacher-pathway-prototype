import type { TemplateProps } from '../types';
import { Search } from '../Search';
import './SearchPage.scss';
export function SearchPage({ title, children }: TemplateProps) {
  return (
    <section className="container health-search-page">
      <h1>{title}</h1>
      <Search />
      <div>{children}</div>
    </section>
  );
}
