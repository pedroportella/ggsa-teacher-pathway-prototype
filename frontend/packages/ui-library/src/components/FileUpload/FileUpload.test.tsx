import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('calls onFilesSelected with selected files', () => {
    const onFilesSelected = vi.fn();
    const file = new File(['example'], 'example.pdf', { type: 'application/pdf' });

    render(
      <FileUpload id="evidence-file" label="Evidence file" onFilesSelected={onFilesSelected} />,
    );

    fireEvent.change(screen.getByLabelText('Evidence file'), {
      target: { files: [file] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('renders staged file status and remove action', () => {
    const onRemove = vi.fn();

    render(
      <FileUpload
        id="evidence-file"
        label="Evidence file"
        onFilesSelected={vi.fn()}
        onRemove={onRemove}
        items={[
          {
            id: 'document-1',
            name: 'classroom-observation.pdf',
            meta: 'Classroom artefact · 42 KB',
            status: 'ready',
          },
        ]}
      />,
    );

    expect(screen.getByText('classroom-observation.pdf')).toBeTruthy();
    expect(screen.getByText('Classroom artefact · 42 KB')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledWith('document-1');
  });

  it('shows the disabled empty message', () => {
    render(
      <FileUpload
        id="evidence-file"
        label="Evidence file"
        disabled
        emptyMessage="Select a category first."
        onFilesSelected={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Evidence file')).toHaveProperty('disabled', true);
    expect(screen.getByText('Select a category first.')).toBeTruthy();
  });
});
