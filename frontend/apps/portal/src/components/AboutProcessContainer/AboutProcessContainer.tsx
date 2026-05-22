import { Panel } from '@ggsa/ui-library';

const processStages = [
  {
    title: 'Enrol',
    body: 'A school or teacher selects the Teacher role and receives a personalised learning plan aligned to career stage and goals.',
  },
  {
    title: 'Complete prerequisites',
    body: 'The plan starts with Learn Effective Teaching Essentials and Learn Cycles of School Practice.',
  },
  {
    title: 'Progress core modules',
    body: 'Teachers work through modules covering effective teaching techniques, classroom practice cycles, assessment and data-informed teaching.',
  },
  {
    title: 'Build evidence',
    body: 'Certificates, classroom artefacts and mastery evidence are stored for coach review, certification and RPL pathways.',
  },
];

export function AboutProcessContainer() {
  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="about-heading">
        <div className="row">
          <div className="col-xs-12 col-lg-8">
            <p className="eyebrow">Architecture</p>
            <h2 id="about-heading">Headless WordPress learning architecture</h2>
            <p>
              The GGSA Teacher Pathway is delivered as a decoupled product: WordPress owns pathway content, LearnDash-style modules and editorial administration, while the Next.js frontend renders learning plans, progress and evidence readiness.
            </p>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Process architecture">
        <div className="row">
          <div className="col-xs-12 col-lg-7">
            <Panel id="process-model" title="Teacher pathway model" eyebrow="Information architecture">
              <ol className="portal-process-list">
                {processStages.map((stage) => (
                  <li key={stage.title}>
                    <strong>{stage.title}</strong>
                    <span>{stage.body}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
          <div className="col-xs-12 col-lg-5 portal-aside">
            <Panel id="content-model" title="Content model" eyebrow="WordPress custom post type">
              <ul className="portal-checklist">
                <li>Learning plan: reference, school, teacher, career stage, pathway status and support level.</li>
                <li>Module catalogue: prerequisites, classroom core modules and elective modules.</li>
                <li>Evidence portfolio: certificates, classroom artefacts, mastery evidence and RPL notes.</li>
              </ul>
            </Panel>
            <Panel id="audience-model" title="Audience model" eyebrow="Operating model">
              <ul className="portal-checklist">
                <li>Teachers complete professional learning and upload evidence.</li>
                <li>School leaders monitor progress across cohorts and milestones.</li>
                <li>GGSA coaches review readiness, support needs and certification progression.</li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
