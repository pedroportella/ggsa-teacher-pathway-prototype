import './BackToTop.scss';
export function BackToTop({ href = '#main-content' }: { href?: string }) {
  return (
    <a className="health-back-to-top" href={href}>
      Example back to top
    </a>
  );
}
