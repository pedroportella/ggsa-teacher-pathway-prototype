import type { ControlCheck } from '@ggsa/services';
import { calculateReadinessScore, getOutstandingCategories } from '@ggsa/services';
import { Field, MetricCard, Panel, SelectInput, Tags } from '@ggsa/ui-library';
import type { PortalState } from '../../app/portalState';

const controlStatuses: ControlCheck['status'][] = ['Not started', 'Needs evidence', 'Complete'];

function countChecks(checks: ControlCheck[], status: ControlCheck['status']): number {
  return checks.filter((check) => check.status === status).length;
}

type ReadinessContainerProps = Pick<PortalState, 'notice' | 'submission' | 'updateCheck'>;

export function ReadinessContainer({ notice, submission, updateCheck }: ReadinessContainerProps) {
  const readinessScore = calculateReadinessScore(submission);
  const outstandingCategories = getOutstandingCategories(submission.controlChecks);

  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="readiness-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Pathway readiness</p>
            <h2 id="readiness-heading">Module, evidence and RPL readiness</h2>
            <p>
              Review the learning plan before it moves into coaching, RPL evidence preparation or
              partner assessment.
            </p>
            <p className="portal-status-note">{notice}</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <div className="row portal-metrics" aria-label="Readiness summary">
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Readiness score" value={`${readinessScore}%`} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard
                  label="Complete checks"
                  value={countChecks(submission.controlChecks, 'Complete')}
                />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard
                  label="Need evidence"
                  value={countChecks(submission.controlChecks, 'Needs evidence')}
                />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Documents" value={submission.evidenceDocuments.length} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Pathway readiness pages">
        <div className="row">
          <div className="col-xs-12 col-lg-7">
            <Panel
              id="readiness-controls"
              title="Readiness controls"
              eyebrow="Pathway readiness page"
              className="ggsa-panel"
            >
              <div className="readiness-summary">
                <Field label="Outstanding categories" inline>
                  {outstandingCategories.length > 0 ? (
                    <Tags items={outstandingCategories} />
                  ) : (
                    'None'
                  )}
                </Field>
              </div>
              {submission.controlChecks.map((check) => (
                <SelectInput
                  key={check.id}
                  id={`control-${check.id}`}
                  label={`${check.category}: ${check.label}`}
                  options={controlStatuses}
                  value={check.status}
                  onChange={(event) =>
                    void updateCheck(check.id, event.target.value as ControlCheck['status'])
                  }
                />
              ))}
            </Panel>
          </div>
          <div className="col-xs-12 col-lg-5 portal-aside">
            <Panel
              id="readiness-evidence"
              title="Evidence portfolio"
              eyebrow="Pathway readiness page"
              className="ggsa-panel"
            >
              <ul className="portal-checklist">
                <li>Learning plan has a school, owner, cohort and selected teacher course.</li>
                <li>Prerequisite, core and elective modules are visible in the plan.</li>
                <li>
                  Certificates, classroom artefacts and mastery evidence can support RPL review.
                </li>
              </ul>
            </Panel>
            <Panel
              id="readiness-decisioning"
              title="RPL evidence readiness"
              eyebrow="Pathway readiness page"
              className="ggsa-panel"
            >
              <ul className="portal-checklist">
                <li>Support level helps coaches prioritise schools and cohorts.</li>
                <li>Outstanding evidence categories can be turned into clear coach actions.</li>
                <li>
                  RPL-ready plans can be prepared for accreditation and postgraduate partner
                  assessment pathways.
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
