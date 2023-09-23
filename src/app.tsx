import './app.scss'
import Sidebar from "components/sidebar/sidebar.tsx";
import { FC, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Courses } from "pages/courses/courses.tsx";
import { CreateTest } from "pages/create-test/create-test.tsx";
import { UpperBar } from "components/upperbar/upperbar.tsx";
import { Groups } from "pages/groups/groups.tsx";
import { RegistrationPage }  from "pages/registration/registration.tsx";
import { LoginPage } from "pages/login/login.tsx";
import { mockedGroups } from "./constants/mockedGroups.ts";
import { Group } from "./types/group.ts";
import { DndProvider } from "react-dnd";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppModes } from "./constants/appTypes.ts";


const routeConfig = [
  {
    title: 'Группы',
    path: '/groups',
    element: <Groups />
  },
  {
    title: '',
    path: '/assignments/create-test',
    element: <CreateTest />,
  },
  {
    title: 'Курсы',
    path: '/assignments',
    element: <Courses />,
  }
];

const App: FC = () => {
  const DEFAULT_CLASSNAME = 'app';
  const location = useLocation();

  const [currentTitle, setCurrentTitle] = useState<string | null>("");

  useEffect(() => {
    setCurrentTitle(routeConfig.find(route => route.path === location.pathname)?.title ?? "");
  }, [location]);

  // state
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [groups, setGroups] = useState<Group[]>(mockedGroups);

  const [userData, setUserData] = useState<null | object>({ userRole: 'tutor' });

  const [appMode] = useState<AppModes.student | AppModes.tutor>(AppModes.tutor);

  const tutorRoutes = (
    <>
      <Route path={'/groups'} element={<Groups setGroups={setGroups} groups={groups }/>} />
      <Route path={'/assignments/create-test'} element={<CreateTest />} />
      <Route path={'/assignments'} element={<Courses />} />
    </>
  );

  const appContent = (
    <div className={DEFAULT_CLASSNAME}>
      <Sidebar />
      <UpperBar />
      <div className={`${DEFAULT_CLASSNAME}_title`}>{currentTitle}</div>
      <Routes>
        {appMode === AppModes.tutor && tutorRoutes}
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
        {userData ? appContent : loginContent}
      </LocalizationProvider>
    </DndProvider>
  )
}

export default App
