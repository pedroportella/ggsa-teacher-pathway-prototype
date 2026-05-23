export type LearnDashModuleKind = 'prerequisite' | 'core' | 'elective';

export type LearnDashModuleProgress = {
  completedAt?: string;
  courseId: string;
  kind: LearnDashModuleKind;
  progressPercent: number;
  title: string;
};

export type LearnDashCertificate = {
  certificateId: string;
  issuedAt: string;
  moduleTitle: string;
  url?: string;
};

export type MembershipTeacherProfile = {
  email: string;
  enrolmentSource: 'membership-role' | 'local-prototype';
  fullName: string;
  role: 'Teacher';
  schoolName: string;
};

export type WooCommerceEntitlement = {
  accessEndsAt?: string;
  accessStartsAt: string;
  productName: string;
  source: 'woocommerce' | 'school-licence' | 'local-prototype';
  status: 'active' | 'pending' | 'expired';
};

export interface LearnDashGateway {
  listAssignedModules(profile: MembershipTeacherProfile): Promise<LearnDashModuleProgress[]>;
  listCertificates(profile: MembershipTeacherProfile): Promise<LearnDashCertificate[]>;
}

export interface MembershipUserGateway {
  resolveTeacherProfile(): Promise<MembershipTeacherProfile>;
}

export interface WooCommerceEntitlementGateway {
  resolveTeacherEntitlement(profile: MembershipTeacherProfile): Promise<WooCommerceEntitlement>;
}

export class LocalMembershipUserGateway implements MembershipUserGateway {
  async resolveTeacherProfile(): Promise<MembershipTeacherProfile> {
    return {
      email: 'ava.martin@example.org.au',
      enrolmentSource: 'local-prototype',
      fullName: 'Ava Martin',
      role: 'Teacher',
      schoolName: 'Good to Great Schools Australia',
    };
  }
}

export class LocalLearnDashGateway implements LearnDashGateway {
  async listAssignedModules(): Promise<LearnDashModuleProgress[]> {
    return [
      {
        courseId: 'ld-effective-teaching-essentials',
        kind: 'prerequisite',
        progressPercent: 0,
        title: 'Learn Effective Teaching Essentials',
      },
      {
        courseId: 'ld-cycles-of-school-practice',
        kind: 'prerequisite',
        progressPercent: 0,
        title: 'Learn Cycles of School Practice',
      },
      {
        courseId: 'ld-classroom-core',
        kind: 'core',
        progressPercent: 0,
        title: 'Classroom Core Modules',
      },
      {
        courseId: 'ld-teacher-electives',
        kind: 'elective',
        progressPercent: 0,
        title: 'Teacher Pathway Electives',
      },
    ];
  }

  async listCertificates(): Promise<LearnDashCertificate[]> {
    return [];
  }
}

export class LocalWooCommerceEntitlementGateway implements WooCommerceEntitlementGateway {
  async resolveTeacherEntitlement(): Promise<WooCommerceEntitlement> {
    return {
      accessStartsAt: '2026-07-01',
      productName: 'Teacher Learning Plan',
      source: 'local-prototype',
      status: 'active',
    };
  }
}

export type TeacherPathwayIntegrationGateways = {
  learnDash: LearnDashGateway;
  membership: MembershipUserGateway;
  wooCommerce: WooCommerceEntitlementGateway;
};

export function createLocalTeacherPathwayIntegrations(): TeacherPathwayIntegrationGateways {
  return {
    learnDash: new LocalLearnDashGateway(),
    membership: new LocalMembershipUserGateway(),
    wooCommerce: new LocalWooCommerceEntitlementGateway(),
  };
}
