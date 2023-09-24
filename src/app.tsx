import { createContext, FC, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";

import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import Sidebar from "components/sidebar/sidebar.tsx";
import {UpperBar} from "components/upperbar/upperbar.tsx";

import {Courses} from "pages/tutor/courses/courses.tsx";
import {CreateTest} from "pages/tutor/create-test/create-test.tsx";
import {Groups} from "pages/tutor/groups/groups.tsx";
import {RegistrationPage} from "pages/registration/registration.tsx";
import {LoginPage} from "pages/login/login.tsx";
import {Tests} from "./pages/student/tests/tests.tsx";
import {PassTest} from "./pages/student/pass-test/pass-test.tsx";
import {TestResult} from "./pages/student/test-result/test-result.tsx";

import {mockedGroups} from "./constants/mockedGroups.ts";
import {AppModes} from "./constants/appTypes.ts";

import {Test} from "./types/test.ts";
import {mockedTask} from "./types/task.ts";
import {Group} from "./types/group.ts";

import './app.scss'

const routeConfig = [
  {
    title: 'Группы',
    path: '/groups',
  },
  {
    title: '',
    path: '/assignments/create-test',
  },
  {
    title: 'Курсы',
    path: '/assignments',
  }
];

const studentRouteConfig = [
  {
    title: 'Задания',
    path: '/assignments',
  }
];

const mockedTests: Test[] = [{
  id: 'student-test-1',
  name: 'ДЗ #1',
  subject: 'Англ',
  topic: 'Первая тема',
  status: 'pending',
  tasks: [mockedTask, mockedTask, mockedTask],
},{
  id: 'student-test-2',
  name: 'ДЗ #2',
  subject: 'Англ',
  topic: 'Первая тема',
  status: 'done',
  tasks: [mockedTask, mockedTask, mockedTask, mockedTask, mockedTask],
}];

export const AppContext = createContext({ tests: mockedTests, appMode: null });

const DEFAULT_CLASSNAME = 'app';

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTitle, setCurrentTitle] = useState<string | null>("");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [groups, setGroups] = useState<Group[]>(mockedGroups);

  const [userData, setUserData] = useState<null | { user: AppModes }>(null);
  const [appMode, setAppMode] = useState<null | AppModes>(null);

  useEffect(() => {
    if (!userData && !location.pathname.includes('/registration')) { navigate('/login-page') }

    if (userData) {
      setAppMode(userData.user);
    }
  }, [userData, navigate, location.pathname]);

  useEffect(() => {
    const config = appMode === AppModes.tutor ? routeConfig : studentRouteConfig;

    setCurrentTitle(config.find(route => route.path === location.pathname)?.title ?? "");
  }, [appMode, location]);

  const tutorRoutes = (
    <>
      <Route path={'/groups'} element={<Groups setGroups={setGroups} groups={groups }/>} />
      <Route path={'/assignments/create-test'} element={<CreateTest />} />
      <Route path={'/assignments'} element={<Courses />} />
    </>
  );

  const studentRoutes = (
    <>
      <Route path={'/assignments'} element={<Tests />}/>
      <Route path={'/assignments/:id'} element={<PassTest />}/>
      <Route path={'/assignments/result/:id'} element={<TestResult />}/>
    </>
  )

  const appContent = (
    <div className={DEFAULT_CLASSNAME}>
      <Sidebar />
      <UpperBar />
      <div className={`${DEFAULT_CLASSNAME}_title`}>{currentTitle}</div>
      <Routes>
        {appMode === AppModes.tutor ? tutorRoutes : studentRoutes}
      </Routes>
    </div>
  );

  const loginContent = (
    <Routes>
      <Route path={'/registration'} element={<RegistrationPage />}/>
      <Route path={'/login-page'} element={<LoginPage setUserData={setUserData} />}/>
    </Routes>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppContext.Provider value={{ appMode, tests: mockedTests }}>
          {userData ? appContent : loginContent}
        </AppContext.Provider>
      </LocalizationProvider>
    </DndProvider>
  )
}

export default App
