import './QuickExit.scss';
export function QuickExit({ href }: { href?: string }) {
  return (
    <a className="health-quick-exit" href={href}>
      Example quick exit
    </a>
  );
}
