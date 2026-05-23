'use client';

import { useState, type ChangeEvent } from 'react';
import { Button, Field, PageAlerts, SelectInput } from '@ggsa/ui-library';
import { evidenceCategories, type EvidenceCategory, type EvidenceDocument } from '@ggsa/services';
import type { StagedEvidenceDocument } from '../../app/portalState';

const categoryOptions = [
  { disabled: true, label: 'Select evidence category', value: '' },
  ...evidenceCategories.map((category) => ({ label: category, value: category })),
];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type EvidenceUploadProps = {
  addEvidence: (file: File, category: EvidenceCategory) => void;
  documents: EvidenceDocument[];
  removeEvidence: (id: string) => void;
  stagedDocuments: StagedEvidenceDocument[];
};

export function EvidenceUpload({
  addEvidence,
  documents,
  removeEvidence,
  stagedDocuments,
}: EvidenceUploadProps) {
  const [category, setCategory] = useState<EvidenceCategory | ''>('');

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (category !== '') {
      files.forEach((file) => addEvidence(file, category));
    }

    event.target.value = '';
  };

  const totalDocuments = documents.length + stagedDocuments.length;

  return (
    <div className="evidence-upload">
      <Field label="Evidence portfolio" inline>
        {totalDocuments} documents attached or staged
      </Field>

      <SelectInput
        id="evidence-category"
        label="Evidence category"
        options={categoryOptions}
        value={category}
        onChange={(event) => setCategory(event.currentTarget.value as EvidenceCategory | '')}
      />

      <div className="au-form__item evidence-upload__picker">
        <label htmlFor="evidence-file">Evidence file</label>
        <div className="au-form__item-description" id="evidence-file-hint">
          Upload PDF, PNG, JPG or DOCX files. Each file must be 10 MB or smaller.
        </div>
        <input
          id="evidence-file"
          aria-describedby="evidence-file-hint"
          className="au-text-input au-text-input--block"
          disabled={category === ''}
          multiple
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          onChange={handleFiles}
        />
      </div>

      {category === '' && (
        <PageAlerts title="Choose a category before adding files" type="info">
          Evidence is grouped for coaching review, certificate checks and RPL preparation.
        </PageAlerts>
      )}

      {(stagedDocuments.length > 0 || documents.length > 0) && (
        <div className="evidence-upload__list" aria-live="polite">
          {stagedDocuments.map((document) => (
            <div className="evidence-upload__item" key={document.id}>
              <div>
                <strong>{document.fileName}</strong>
                <span>
                  {document.category} · {formatFileSize(document.fileSize)}
                </span>
                {document.error && <em>{document.error}</em>}
              </div>
              <div
                className={`evidence-upload__status evidence-upload__status--${document.status}`}
              >
                {document.status}
              </div>
              <Button
                variant="tertiary"
                type="button"
                onClick={() => removeEvidence(document.id)}
                disabled={document.status === 'uploading'}
              >
                Remove
              </Button>
            </div>
          ))}

          {documents.map((document) => (
            <div className="evidence-upload__item" key={document.fileId}>
              <div>
                <strong>{document.fileName}</strong>
                <span>
                  {document.category ?? 'Evidence'} · {formatFileSize(document.fileSize)}
                </span>
              </div>
              <div className="evidence-upload__status evidence-upload__status--uploaded">
                uploaded
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
