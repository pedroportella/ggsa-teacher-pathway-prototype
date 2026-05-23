'use client';

import { useState } from 'react';
import { evidenceCategories, type EvidenceCategory, type EvidenceDocument } from '@ggsa/services';
import { Field, FileUpload, SelectInput, type FileUploadItem } from '@ggsa/ui-library';
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

  const handleFiles = (files: File[]) => {
    if (category !== '') {
      files.forEach((file) => addEvidence(file, category));
    }
  };

  const totalDocuments = documents.length + stagedDocuments.length;
  const uploadItems: FileUploadItem[] = [
    ...stagedDocuments.map((document) => ({
      id: document.id,
      name: document.fileName,
      meta: `${document.category} · ${formatFileSize(document.fileSize)}`,
      status: document.status,
      error: document.error,
    })),
    ...documents.map((document) => ({
      id: document.fileId,
      name: document.fileName,
      meta: `${document.category ?? 'Evidence'} · ${formatFileSize(document.fileSize)}`,
      status: 'uploaded' as const,
    })),
  ];

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

      <FileUpload
        id="evidence-file"
        label="Evidence file"
        accept=".pdf,.png,.jpg,.jpeg,.docx"
        disabled={category === ''}
        emptyMessage="Evidence is grouped for coaching review, certificate checks and RPL preparation."
        hint="Upload PDF, PNG, JPG or DOCX files. Each file must be 10 MB or smaller."
        items={uploadItems}
        multiple
        onFilesSelected={handleFiles}
        onRemove={removeEvidence}
      />
    </div>
  );
}
