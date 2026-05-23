import { ggsaIconSvg, ggsaLogoSvg } from '@ggsa/ui-assets';
import { Panel } from '@ggsa/ui-library';

type ImageAsset = string | { src: string };

const assetSrc = (asset: ImageAsset) => (typeof asset === 'string' ? asset : asset.src);

const processStages = [
  {
    title: 'Enrol',
    body: 'A school or teacher selects the Teacher role through the Membership Platform and receives a personalised learning plan aligned to career stage and goals.',
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
    body: 'Certificates, classroom artefacts and mastery evidence are stored for coach review and partner RPL assessment pathways.',
  },
];

export function AboutProcessContainer() {
  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="about-heading">
        <div className="row">
          <div className="col-xs-12 col-lg-8">
            <p className="eyebrow">About this Portal</p>
            <h2 id="about-heading">What this portal helps people do</h2>
            <p>
              This portal helps GGSA staff, schools and teachers review enrolment-generated learning plans, evidence and readiness for the Mastery Teaching Pathway. It brings pathway progress and coach review into one place so non-technical users can see what needs attention next.
            </p>
          </div>
          <div className="col-xs-12 col-lg-4">
            <div className="about-brand-lockup" aria-label="Good to Great Schools Australia brand marks">
              <img
                alt="Good to Great Schools Australia"
                className="about-brand-lockup__wordmark"
                src={assetSrc(ggsaLogoSvg)}
              />
              <div className="about-brand-lockup__marks" aria-hidden="true">
                <img className="about-brand-lockup__mark" src={assetSrc(ggsaIconSvg)} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="About this Portal process">
        <div className="row">
          <div className="col-xs-12 col-lg-7">
            <Panel id="process-model" title="Teacher pathway model" eyebrow="How it works">
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
            <Panel id="content-model" title="What the portal records" eyebrow="Learning plan register">
              <ul className="portal-checklist">
                <li>Learning plan: reference, school, teacher, career stage, pathway status and support level.</li>
                <li>Module catalogue: prerequisites, classroom core modules and elective modules sourced through adapter-ready LMS boundaries.</li>
                <li>Evidence portfolio: certificates, classroom artefacts, mastery evidence and RPL notes.</li>
              </ul>
            </Panel>
            <Panel id="audience-model" title="Who uses it" eyebrow="Portal users">
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
