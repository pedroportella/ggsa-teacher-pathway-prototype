import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '../FormControls';
import { PageAlerts } from '../PageAlerts';
import './FileUpload.scss';

export type FileUploadItemStatus = 'ready' | 'uploading' | 'uploaded' | 'error';

export type FileUploadItem = {
  error?: string;
  id: string;
  meta?: ReactNode;
  name: ReactNode;
  status: FileUploadItemStatus;
};

function statusLabel(status: FileUploadItemStatus) {
  return status === 'uploaded' ? 'uploaded' : status;
}

export type FileUploadProps = {
  accept?: string;
  disabled?: boolean;
  emptyMessage?: ReactNode;
  hint?: ReactNode;
  id: string;
  items?: FileUploadItem[];
  label: ReactNode;
  multiple?: boolean;
  name?: string;
  onFilesSelected: (files: File[]) => void;
  onRemove?: (id: string) => void;
};

export function FileUpload({
  accept,
  disabled = false,
  emptyMessage,
  hint,
  id,
  items = [],
  label,
  multiple = false,
  name,
  onFilesSelected,
  onRemove,
}: FileUploadProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length > 0) {
      onFilesSelected(files);
    }

    event.currentTarget.value = '';
  };

  return (
    <div className="file-upload">
      <div className="au-form__item file-upload__picker">
        <label htmlFor={id}>{label}</label>
        {hint && (
          <div className="au-form__item-description" id={hintId}>
            {hint}
          </div>
        )}
        <input
          id={id}
          aria-describedby={hintId}
          className="au-text-input au-text-input--block"
          disabled={disabled}
          multiple={multiple}
          name={name ?? id}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
      </div>

      {disabled && emptyMessage && (
        <PageAlerts title="Choose an option before adding files" type="info">
          {emptyMessage}
        </PageAlerts>
      )}

      {items.length > 0 && (
        <div className="file-upload__list" aria-live="polite">
          {items.map((item) => (
            <div className="file-upload__item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                {item.meta && <span>{item.meta}</span>}
                {item.error && <em>{item.error}</em>}
              </div>
              <div className={`file-upload__status file-upload__status--${item.status}`}>
                {statusLabel(item.status)}
              </div>
              {onRemove && (
                <Button
                  variant="tertiary"
                  type="button"
                  onClick={() => onRemove(item.id)}
                  disabled={item.status === 'uploading'}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
