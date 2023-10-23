import { createContext, FC, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Sidebar from 'components/sidebar/sidebar.tsx';
import { UpperBar } from 'components/upperbar/upperbar.tsx';

import { Courses } from 'pages/tutor/courses/courses.tsx';
import { CreateTest } from 'pages/tutor/create-test/create-test.tsx';
import { Groups } from 'pages/tutor/groups/groups.tsx';
import { RegistrationPage } from 'pages/registration/registration.tsx';
import { LoginPage } from 'pages/login/login.tsx';
import { Tests } from './pages/student/tests/tests.tsx';
import { PassTest } from './pages/student/pass-test/pass-test.tsx';
import { TestResult } from './pages/student/test-result/test-result.tsx';

import { AppModes } from './constants/appTypes.ts';

import { Test } from './types/test.ts';

import './app.scss';
import { batch, useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store.ts';
import { Results } from './pages/tutor/results/results.tsx';
import {
  getStoredAppMode,
  mockedTests,
  routeConfig,
  studentRouteConfig,
} from './utils/app.utils.ts';
import { setUser } from './store/user-data/user-data.slice.ts';
import { setAppMode } from './store/app-mode/app-mode.slice.ts';
import { LoginRoutes, StudentRoutes, TutorRoutes } from './constants/routes.ts';
import { checkAuthorize } from './services/login/login.ts';

// MOCKED WHILE BE READY
interface IAppContent {
  tests: Test[];
}
export const AppContext = createContext<IAppContent>({
  tests: [],
});

const DEFAULT_CLASSNAME = 'app';

const App: FC = () => {
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
      } catch (error) {
        navigate('/login-page');

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
      <Route path={LoginRoutes.REGISTRATION} element={<RegistrationPage />} />
      <Route path={LoginRoutes.REGISTRATION_WITH_REF} element={<RegistrationPage />} />
    </Routes>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppContext.Provider value={{ tests: mockedTests }}>
          {userData ? appContent : loginContent}
        </AppContext.Provider>
      </LocalizationProvider>
    </DndProvider>
  );
};

export default App;
