import {
  createLocalTeacherPathwayIntegrations,
  type TeacherPathwayIntegrationGateways,
} from './integrations';
import { initialControlChecks, type TeacherPathwaySubmission } from './domain';

export async function generateTeacherLearningPlan(
  gateways: TeacherPathwayIntegrationGateways = createLocalTeacherPathwayIntegrations(),
): Promise<TeacherPathwaySubmission> {
  const teacherProfile = await gateways.membership.resolveTeacherProfile();
  const entitlement = await gateways.wooCommerce.resolveTeacherEntitlement(teacherProfile);
  const modules = await gateways.learnDash.listAssignedModules(teacherProfile);
  const certificates = await gateways.learnDash.listCertificates(teacherProfile);
  const hasCertificates = certificates.length > 0;

  return {
    organisationName: teacherProfile.schoolName,
    contactName: teacherProfile.fullName,
    contactEmail: teacherProfile.email,
    productName: entitlement.productName,
    productVersion: '2026 cohort',
    pathwayProfile:
      modules.find((module) => module.kind === 'core')?.title ?? entitlement.productName,
    integrationType: 'Generated from Membership, WooCommerce and LearnDash adapter context',
    workflowStatus: 'Learning plan draft',
    riskLevel: modules.length === 0 ? 'High' : hasCertificates ? 'Low' : 'Medium',
    targetReleaseDate: entitlement.accessStartsAt,
    standards: [
      'Australian Professional Standards for Teachers',
      'Recognition of Prior Learning',
      'LearnDash course progress',
    ],
    controlChecks: initialControlChecks.map((check) => {
      if (check.id === 'prerequisites') {
        return {
          ...check,
          label: 'Prerequisite LearnDash courses are assigned from enrolment',
          status: modules.some((module) => module.kind === 'prerequisite')
            ? 'Needs evidence'
            : 'Not started',
        };
      }

      if (check.id === 'core-modules') {
        return {
          ...check,
          label: 'Core pathway modules are assigned for the teacher career stage',
          status: modules.some((module) => module.kind === 'core')
            ? 'Needs evidence'
            : 'Not started',
        };
      }

      if (check.id === 'evidence-portfolio') {
        return {
          ...check,
          label: 'Certificates, classroom artefacts and mastery evidence are available for review',
          status: hasCertificates ? 'Complete' : 'Not started',
        };
      }

      return {
        ...check,
        status: hasCertificates ? 'Needs evidence' : 'Not started',
      };
    }),
    evidenceDocuments: certificates.map((certificate) => ({
      fileId: certificate.certificateId,
      fileName: `${certificate.moduleTitle} certificate`,
      fileType: 'application/pdf',
      fileSize: 0,
      uploadedAt: certificate.issuedAt,
      url: certificate.url,
    })),
  };
}
