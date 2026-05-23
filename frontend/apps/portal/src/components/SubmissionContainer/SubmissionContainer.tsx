import type { WorkflowStatus } from '@ggsa/services';
import { Button, Form, FormActions, Panel, SelectInput, TextInput } from '@ggsa/ui-library';
import type { PortalState } from '../../app/portalState';
import { EvidenceUpload } from './EvidenceUpload';

const workflowStatuses: WorkflowStatus[] = [
  'Learning plan draft',
  'Enrolled',
  'In progress',
  'Coach action required',
  'RPL evidence ready',
];

const pathwayProfiles = [
  'Mastery Teaching Foundations',
  'Mastery Teaching Towards Excellence',
  'Mastery Teaching Fellow',
];

type SubmissionContainerProps = Pick<
  PortalState,
  | 'addEvidence'
  | 'isSubmitting'
  | 'notice'
  | 'removeEvidence'
  | 'stagedEvidenceDocuments'
  | 'submission'
  | 'submitEvidence'
  | 'updateField'
>;

export function SubmissionContainer({
  addEvidence,
  isSubmitting,
  notice,
  removeEvidence,
  stagedEvidenceDocuments,
  submission,
  submitEvidence,
  updateField,
}: SubmissionContainerProps) {
  return (
    <>
      <section className="portal-band portal-band--intake" aria-labelledby="submission-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Teacher learning plan</p>
            <h2 id="submission-heading">Enrolment-generated learning plan</h2>
            <p>
              Review the teacher role, career stage and pathway details that would be generated from
              Membership Platform enrolment.
            </p>
            <p className="portal-status-note">{notice}</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <Panel
              id="submission"
              title="Review generated learning plan"
              eyebrow="Teacher pathway page"
            >
              <Form onSubmit={submitEvidence}>
                <TextInput
                  id="organisation"
                  label="School or organisation"
                  value={submission.organisationName}
                  onChange={(event) => updateField('organisationName', event.target.value)}
                />
                <TextInput
                  id="contact-name"
                  label="Teacher or coordinator name"
                  value={submission.contactName}
                  onChange={(event) => updateField('contactName', event.target.value)}
                />
                <TextInput
                  id="contact-email"
                  label="Contact email"
                  type="email"
                  value={submission.contactEmail}
                  onChange={(event) => updateField('contactEmail', event.target.value)}
                />
                <TextInput
                  id="product"
                  label="Learning plan"
                  value={submission.productName}
                  onChange={(event) => updateField('productName', event.target.value)}
                />
                <TextInput
                  id="product-version"
                  label="Cohort or intake"
                  value={submission.productVersion}
                  onChange={(event) => updateField('productVersion', event.target.value)}
                />
                <SelectInput
                  id="pathway-profile"
                  label="Teacher course by career stage"
                  options={pathwayProfiles}
                  value={submission.pathwayProfile}
                  onChange={(event) => updateField('pathwayProfile', event.target.value)}
                />
                <TextInput
                  id="integration-type"
                  label="Prototype integration source"
                  value={submission.integrationType}
                  onChange={(event) => updateField('integrationType', event.target.value)}
                />
                <SelectInput
                  id="workflow-status"
                  label="Pathway status"
                  options={workflowStatuses}
                  value={submission.workflowStatus}
                  onChange={(event) => updateField('workflowStatus', event.target.value)}
                />
                <TextInput
                  id="target-release"
                  label="Target commencement"
                  type="date"
                  value={submission.targetReleaseDate}
                  onChange={(event) => updateField('targetReleaseDate', event.target.value)}
                />
                <EvidenceUpload
                  addEvidence={addEvidence}
                  documents={submission.evidenceDocuments}
                  removeEvidence={removeEvidence}
                  stagedDocuments={stagedEvidenceDocuments}
                />
                <FormActions>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Sync to pathway register'}
                  </Button>
                </FormActions>
              </Form>
            </Panel>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Teacher pathway capabilities">
        <div className="row portal-page-grid">
          <div className="col-xs-12 col-md-4">
            <Panel
              id="submission-profile"
              title="Personalised learning plan"
              eyebrow="Adapter-ready model"
            >
              <p>
                Represents the plan generated from teacher role, career stage and school goals,
                ready to be backed by Membership Platform and LearnDash data.
              </p>
            </Panel>
          </div>
          <div className="col-xs-12 col-md-4">
            <Panel
              id="submission-evidence"
              title="Evidence portfolio"
              eyebrow="Certification support"
            >
              <p>
                Groups certificates of completion, classroom practice artefacts and mastery evidence
                for coach review.
              </p>
            </Panel>
          </div>
          <div className="col-xs-12 col-md-4">
            <Panel
              id="submission-register"
              title="WordPress handover"
              eyebrow="Headless CMS"
              className="ggsa-panel"
            >
              <p>
                Creates the register item consumed by the Next.js frontend and administered in
                WordPress.
              </p>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
