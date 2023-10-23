export enum TutorRoutes {
  RESULTS = '/results',
  GROUPS = '/groups',
  ASSIGNMENTS = '/assignments',
  CREATE_TEST = '/assignments/create-test/:id',
}

export enum StudentRoutes {
  ASSIGNMENTS = '/assignments',
  PASS_TEST = '/assignments/:id',
  TEST_RESULT = '/assignments/result/:id',
}

export enum LoginRoutes {
  LOGIN = '/login-page',
  REGISTRATION = '/registration',
  REGISTRATION_WITH_REF = '/registration/ref/:groupId',
}
