import { FC, useEffect, useState, lazy, Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru.js';

import Sidebar from 'components/sidebar/sidebar.tsx';
import { UpperBar } from 'components/upperbar/upperbar.tsx';
import { RegistrationPage } from 'pages/registration/registration.tsx';
import { LoginPage } from 'pages/login/login.tsx';

import { AppModes } from './constants/appTypes.ts';

import './app.scss';
import { batch, useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store.ts';
import {
  clearLocalStorage,
  getStoredAppMode,
  routeConfig,
  studentRouteConfig,
} from './utils/app.utils.ts';
import { setUser } from './store/user-data/user-data.slice.ts';
import { setAppMode } from './store/app-mode/app-mode.slice.ts';
import { LoginRoutes, PLATFORM_ROUTE, StudentRoutes, TutorRoutes } from './constants/routes.ts';

import MenuIcon from 'assets/icons/menu-item.svg';
import { axiosAddAuthToken } from './services/tokenHelper.ts';
import { refreshToken } from './services/login/login.ts';
import { CircularProgress } from '@mui/material';
import { Feedback } from './components/feedback/feedback.tsx';
import { Platform } from './pages/platform/platform.tsx';

const DEFAULT_CLASSNAME = 'app';

const MOBILE_VIEW_WIDTH = 768;

const App: FC = () => {
  // components lazy import
  const Courses = lazy(() => import('pages/tutor/courses/courses.tsx'));
  const CreateTest = lazy(() => import('pages/tutor/create-test/create-test.tsx'));
  const Groups = lazy(() => import('pages/tutor/groups/groups.tsx'));
  const Tests = lazy(() => import('./pages/student/tests/tests.tsx'));
  const PassTest = lazy(() => import('./pages/student/pass-test/pass-test.tsx'));
  const TestResult = lazy(() => import('./pages/student/test-result/test-result.tsx'));
  const Results = lazy(() => import('./pages/tutor/results/results.tsx'));

  const location = useLocation();
  const dispatch = useDispatch();

  const [currentTitle, setCurrentTitle] = useState<string | null>('');

  const { userData } = useSelector((state: RootState) => state.userData);
  const { appMode } = useSelector((state: RootState) => state.appMode);

  const clearAppStateHandler = () => {
    clearLocalStorage();

    batch(() => {
      dispatch(setUser(null));
      dispatch(setAppMode(null));
    });
  };

  const refreshTokenHandler = (res: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }) => {
    localStorage.setItem('accessToken', res.access_token);
    localStorage.setItem('refreshToken', res.refresh_token);
    localStorage.setItem('expiresIn', String(Date.now() + Number(`${res.expires_in}000`)));

    axiosAddAuthToken();
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const expiresIn = localStorage.getItem('expiresIn');

    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      batch(() => {
        dispatch(setUser(userData));
        dispatch(setAppMode(getStoredAppMode()));
      });
    }

    if (storedUserData) {
      (async () => {
        if (accessToken && expiresIn && storedRefreshToken && Date.now() >= +expiresIn) {
          try {
            const res = await refreshToken(storedRefreshToken);
            res.access_token ? refreshTokenHandler(res) : clearAppStateHandler();
          } catch (error) {
            clearAppStateHandler();
          }
        }
      })();
    }
  }, []);

  useEffect(() => {
    const config = appMode === AppModes.tutor ? routeConfig : studentRouteConfig;

    setCurrentTitle(config.find((route) => route.path === location.pathname)?.title ?? '');
  }, [appMode, location]);

  // handle sidebar
  const [isSidebarOpened, setIsSidebarOpened] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= MOBILE_VIEW_WIDTH) setIsSidebarOpened(false);
  }, []);

  const handleMenuClose = () => setIsSidebarOpened(false);

  useEffect(() => {
    if (isSidebarOpened) {
      document.addEventListener('onmousedown', handleMenuClose);
      return () => document.removeEventListener('onmousedown', handleMenuClose);
    }
  }, [isSidebarOpened]);

  useEffect(() => {
    if (userData) axiosAddAuthToken();
  }, [userData]);

  const tutorRoutes = (
    <>
      <Route path="*" element={<Navigate to={TutorRoutes.ASSIGNMENTS} replace />} />
      <Route path={TutorRoutes.RESULTS} element={<Results />} />
      <Route path={TutorRoutes.GROUPS} element={<Groups />} />
      <Route path={TutorRoutes.GROUPS_RESULT} element={<TestResult />} />
      <Route path={TutorRoutes.CREATE_TEST} element={<CreateTest />} />
      <Route path={TutorRoutes.GENERATE_TEST} element={<CreateTest isGenerateMode />} />
      <Route path={TutorRoutes.ASSIGNMENTS} element={<Courses />} />
    </>
  );

  const studentRoutes = (
    <>
      <Route path="*" element={<Navigate to={StudentRoutes.ASSIGNMENTS} replace />} />
      <Route path={StudentRoutes.ASSIGNMENTS} element={<Tests />} />
      <Route path={StudentRoutes.PASS_TEST} element={<PassTest />} />
      <Route path={StudentRoutes.TEST_RESULT} element={<TestResult />} />
    </>
  );

  const isPlatformRoute = location.pathname.includes(PLATFORM_ROUTE);

  const appContent = isPlatformRoute ? (
    <Routes>
      <Route path={PLATFORM_ROUTE} element={<Platform />} />
    </Routes>
  ) : (
    <div className={DEFAULT_CLASSNAME}>
      <Sidebar isSidebarOpened={isSidebarOpened} setIsSidebarOpened={setIsSidebarOpened} />
      <Feedback />
      <UpperBar />
      <div className={`${DEFAULT_CLASSNAME}_title`}>
        <button
          onClick={() => setIsSidebarOpened(true)}
          className={`${DEFAULT_CLASSNAME}_title-menu`}>
          <MenuIcon />
        </button>
        {currentTitle}
      </div>
      <Routes>
        <Route path={PLATFORM_ROUTE} element={<Platform />} />
        <Route path="*" element={<Navigate to="/assignments" replace />} />
        {appMode === AppModes.tutor ? tutorRoutes : studentRoutes}
      </Routes>
    </div>
  );

  const loginContent = (
    <Routes>
      <Route path="*" element={<Navigate to={LoginRoutes.LOGIN} replace />} />
      <Route path={LoginRoutes.LOGIN} element={<LoginPage />} />
      <Route path={LoginRoutes.LOGIN_WITH_REF} element={<LoginPage />} />
      <Route path={LoginRoutes.REGISTRATION} element={<RegistrationPage />} />
      <Route path={LoginRoutes.REGISTRATION_WITH_REF} element={<RegistrationPage />} />
      <Route path={PLATFORM_ROUTE} element={<Platform />} />
    </Routes>
  );

  const fallbackScreen = (
    <div className={'fallback'}>
      <CircularProgress sx={{ color: '#c8caff' }} />
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider adapterLocale={'ru'} dateAdapter={AdapterDayjs}>
        <Suspense fallback={fallbackScreen}>
          {userData && appContent}
          {!userData && loginContent}
        </Suspense>
      </LocalizationProvider>
    </DndProvider>
  );
};

export default App;
