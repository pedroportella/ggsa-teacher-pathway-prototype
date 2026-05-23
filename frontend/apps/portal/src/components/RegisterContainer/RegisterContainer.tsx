import { MetricCard, Panel, Table, Tags } from '@ggsa/ui-library';
import { formatDate } from '@ggsa/utils';
import type { PortalState } from '../../app/portalState';

type RegisterContainerProps = Pick<PortalState, 'isRegisterLoading' | 'notice' | 'register' | 'summary'>;

export function RegisterContainer({ isRegisterLoading, notice, register, summary }: RegisterContainerProps) {
  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="summary-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Runtime status</p>
            <h2 id="summary-heading">Teacher pathway register</h2>
            <p>{notice}</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <div className="row portal-metrics" aria-label="Teacher pathway summary">
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Learning plans" value={register.length} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="High support" value={summary.highRisk} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Coach action" value={summary.actionRequired} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="RPL evidence ready" value={summary.ready} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Teacher pathway register and coach priorities">
        <div className="row">
          <div className="col-xs-12 col-lg-8">
            <Panel id="register" title="Learning plan register" eyebrow="WordPress admin view" wide className="ggsa-panel">
              {isRegisterLoading ? (
                <div className="portal-register-loading" role="status" aria-live="polite" aria-label="Loading learning plan register">
                  <span className="portal-spinner" aria-hidden="true" />
                  <span>Loading learning plan register</span>
                </div>
              ) : (
                <Table
                  headers={['Reference', 'School', 'Pathway', 'Status', 'Support', 'Updated']}
                  rows={register.map((item) => [
                    item.referenceNumber,
                    item.organisationName,
                    item.productName,
                    <Tags items={[item.workflowStatus]} />,
                    <Tags tone={item.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'} items={[item.riskLevel]} />,
                    formatDate(item.submittedAt),
                  ])}
                />
              )}
            </Panel>
          </div>
          <aside className="col-xs-12 col-lg-4 portal-aside" aria-label="Coach priorities">
            <section className="portal-priority">
              <p className="eyebrow">Priority work</p>
              <h2>Focus pathway support</h2>
              <ul className="au-link-list portal-priority__list">
                <li><a href="/learning-plan">Review enrolment-generated plan</a></li>
                <li><a href="/pathway-readiness">Check module and evidence readiness</a></li>
                <li><a href="#register">Review high-support cohorts first</a></li>
              </ul>
            </section>
            <section className="portal-priority portal-priority--teal">
              <p className="eyebrow">Operating principle</p>
              <h2>One plan, many milestones</h2>
              <p>Learning plan data, module completion, evidence quality and RPL readiness are treated as connected views of the same teacher pathway.</p>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
