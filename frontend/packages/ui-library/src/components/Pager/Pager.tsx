import './Pager.scss';
export function Pager({ previousHref, nextHref }: { previousHref?: string; nextHref?: string }) {
  return (
    <nav className="health-pager" aria-label="pagination">
      <ul className="au-link-list au-link-list--inline">
        {previousHref && (
          <li>
            <a href={previousHref}>Example previous</a>
          </li>
        )}
        {nextHref && (
          <li>
            <a href={nextHref}>Example next</a>
          </li>
        )}
      </ul>
    </nav>
  );
}
