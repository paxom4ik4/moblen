export enum TutorRoutes {
  RESULTS = '/results',
  GROUPS = '/groups',
  GROUPS_RESULT = '/groups/result/:id',
  ASSIGNMENTS = '/assignments',
  CREATE_TEST = '/assignments/create-test/:id',
  GENERATE_TEST = '/assignments/generate-test/:id',
}

export enum StudentRoutes {
  ASSIGNMENTS = '/assignments',
  PASS_TEST = '/assignments/:id',
  TEST_RESULT = '/assignments/result/:id',
}

export enum OrgRoutes {
  ORGANIZATION = '/organization',
  ASSIGNMENTS = '/assignments',
}

export enum LoginRoutes {
  LOGIN = '/login-page',
  REGISTRATION = '/registration',
  JOIN_WITH_REF = '/joinGroup/:groupId',
  REGISTER_WITH_REF = '/registerGroup/:groupId',
  REGISTER_ORG_WITH_REF = '/joinOrg/:groupId',
}

export const PLATFORM_ROUTE = '/platform';
