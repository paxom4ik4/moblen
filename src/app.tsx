import { FC, useEffect, useState, lazy, Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Sidebar from 'components/sidebar/sidebar.tsx';
import { UpperBar } from 'components/upperbar/upperbar.tsx';
import { RegistrationPage } from 'pages/registration/registration.tsx';
import { LoginPage } from 'pages/login/login.tsx';

import { AppModes } from './constants/appTypes.ts';

import './app.scss';
import { batch, useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store.ts';
import { getStoredAppMode, routeConfig, studentRouteConfig } from './utils/app.utils.ts';
import { setUser } from './store/user-data/user-data.slice.ts';
import { setAppMode } from './store/app-mode/app-mode.slice.ts';
import { LoginRoutes, StudentRoutes, TutorRoutes } from './constants/routes.ts';
import { checkAuthorize } from './services/login/login.ts';
import { Typography } from './common/typography/typography.tsx';

const DEFAULT_CLASSNAME = 'app';

const App: FC = () => {
  // components lazy import
  const Courses = lazy(() => import('pages/tutor/courses/courses.tsx'));
  const CreateTest = lazy(() => import('pages/tutor/create-test/create-test.tsx'));
  const Groups = lazy(() => import('pages/tutor/groups/groups.tsx'));
  const Tests = lazy(() => import('./pages/student/tests/tests.tsx'));
  const PassTest = lazy(() => import('./pages/student/pass-test/pass-test.tsx'));
  const TestResult = lazy(() => import('./pages/student/test-result/test-result.tsx'));
  const Results = lazy(() => import('./pages/tutor/results/results.tsx'));

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTitle, setCurrentTitle] = useState<string | null>('');

  const { userData } = useSelector((state: RootState) => state.userData);
  const { appMode } = useSelector((state: RootState) => state.appMode);

  const dispatch = useDispatch();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      batch(() => {
        dispatch(setUser(userData));
        dispatch(setAppMode(getStoredAppMode()));
      });
    }

    (async () => {
      try {
        await checkAuthorize();

        if (!storedUserData) {
          !location.pathname.includes('registration') && navigate('/login-page');
        }
      } catch (error) {
        !location.pathname.includes('registration') && navigate('/login-page');

        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('appMode');

        batch(() => {
          dispatch(setUser(null));
          dispatch(setAppMode(null));
        });
      }
    })();
  }, []);

  useEffect(() => {
    const config = appMode === AppModes.tutor ? routeConfig : studentRouteConfig;

    setCurrentTitle(config.find((route) => route.path === location.pathname)?.title ?? '');
  }, [appMode, location]);

  const tutorRoutes = (
    <>
      <Route path={TutorRoutes.RESULTS} element={<Results />} />
      <Route path={TutorRoutes.GROUPS} element={<Groups />} />
      <Route path={TutorRoutes.CREATE_TEST} element={<CreateTest />} />
      <Route path={TutorRoutes.ASSIGNMENTS} element={<Courses />} />
    </>
  );

  const studentRoutes = (
    <>
      <Route path={StudentRoutes.ASSIGNMENTS} element={<Tests />} />
      <Route path={StudentRoutes.PASS_TEST} element={<PassTest />} />
      <Route path={StudentRoutes.TEST_RESULT} element={<TestResult />} />
    </>
  );

  const appContent = (
    <div className={DEFAULT_CLASSNAME}>
      <Sidebar />
      <UpperBar />
      <div className={`${DEFAULT_CLASSNAME}_title`}>{currentTitle}</div>
      <Routes>
        <Route path="*" element={<Navigate to="/assignments" replace />} />
        {appMode === AppModes.tutor ? tutorRoutes : studentRoutes}
      </Routes>
    </div>
  );

  const loginContent = (
    <Routes>
      <Route path={LoginRoutes.LOGIN} element={<LoginPage />} />
      <Route path={LoginRoutes.LOGIN_WITH_REF} element={<LoginPage />} />
      <Route path={LoginRoutes.REGISTRATION} element={<RegistrationPage />} />
      <Route path={LoginRoutes.REGISTRATION_WITH_REF} element={<RegistrationPage />} />
    </Routes>
  );

  const fallbackScreen = (
    <div className={'fallback'}>
      <Typography color={'purple'} weight={'bold'}>
        Загрузка...
      </Typography>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Suspense fallback={fallbackScreen}>{userData ? appContent : loginContent}</Suspense>
      </LocalizationProvider>
    </DndProvider>
  );
};

export default App;
