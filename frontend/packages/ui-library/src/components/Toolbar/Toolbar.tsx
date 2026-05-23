import type { ReactNode } from 'react';
import { Button } from '../FormControls';
import './Toolbar.scss';

export type ToolbarAction = {
  id?: string;
  label: ReactNode;
  onClick?: () => void;
};

export function Toolbar({
  actions,
  children,
}: {
  actions?: ToolbarAction[];
  children?: ReactNode;
}) {
  return (
    <div className="health-toolbar">
      {actions ? (
        <ul className="health-toolbar__items au-link-list au-link-list--inline">
          {actions.map((action) => (
            <li key={action.id ?? String(action.label)}>
              <Button id={action.id} onClick={action.onClick} type="button" variant="tertiary">
                {action.label}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
