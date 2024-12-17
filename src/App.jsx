import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import GlobalStyles from './styles/GlobalStyles';

import { StyleSheetManager } from 'styled-components'; //needed for the props in styledComponents to not return errors
import isPropValid from '@emotion/is-prop-valid'; //needed for the props in styledComponents to not return errors

import Users from './pages/Users';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/layout/AppLayout';
import AppLayoutProtected from './pages/layout/AppLayoutProtected';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CurrentSeasonProvider } from './contexts/CurrentSeasonContext';

import supabase from './services/supabase';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import NewPlayer from './pages/NewPlayer';
import SummerCampRegistrations from './features/Spreadsheets/SummerCampRegistrations';
import Players from './pages/Players';
import People from './pages/People';
import Communication from './pages/Communication';
import Games from './pages/Games';
import Events from './pages/Events';
import Season from './pages/Season';
import Test from './pages/Test';

import NewSeason from './pages/NewSeason';
import Schedule from './pages/Schedule';
import ScheduleTSSAA from './pages/ScheduleTSSAA';
import RosterTSSAA from './pages/RosterTSSAA';
import Roster from './pages/Roster';
import HomePage from './pages/HomePage';
import ProtectedRoute from './ui/ProtectedRoute';
import PublicRoute from './ui/PublicRoute';
import AppLayoutPublic from './pages/layout/AppLayoutPublic';
// import { PDFViewer } from '@react-pdf/renderer';

import Uniforms from './pages/Uniforms';
import ScheduleHelper from './pages/ScheduleHelper';
import Game from './pages/Game';
import Stats from './pages/Stats';
import PlayerStats from './features/statsViewPages/PlayerStats';
import PublicStats from './features/statsViewPages/PublicStats';
import SeasonMain from './features/seasons/SeasonMain';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0 },
  },
});

function App() {
  // This implements the default behavior from styled-components v5
  function shouldForwardProp(propName, target) {
    //needed for the props in styledComponents to not return errors
    if (typeof target === 'string') {
      // For HTML elements, forward the prop if it is a valid HTML attribute
      return isPropValid(propName);
    }
    // For other elements, forward all props
    return true;
  }

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      {/* needed for the props in styledComponents to not return errors  */}
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router>
          <SessionContextProvider supabaseClient={supabase}>
            <CurrentSeasonProvider>
              <GlobalStyles />
              <Routes>
                {/* <Route index element={<Navigate replace to="/" />} /> */}
                <Route path="/" element={<HomePage />} />

                <Route
                  path="public"
                  element={
                    <PublicRoute>
                      <AppLayoutPublic />
                    </PublicRoute>
                  }
                >
                  <Route index element={<HomePage />} />

                  {/* THESE ARE OUR PUBLIC PAGES */}
                  <Route path="login" element={<Login />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="roster" element={<Roster />} />
                  <Route path="newplayer" element={<NewPlayer />} />
                  <Route path="camps" element={<SummerCampRegistrations />} />
                  <Route path="*" element={<PageNotFound />} />
                </Route>

                {/* THESE ARE OUR MAIN APP PAGES  - NEED APP LAYOUT*/}
                <Route
                  path="app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<SeasonMain />} />
                  <Route path="test" element={<Test />} />
                  <Route path="seasonMain" element={<Season />} />
                  <Route path="players" element={<Players />} />
                  <Route path="people" element={<People />} />
                  <Route path="communication" element={<Communication />} />
                  <Route path="games" element={<Games />} />
                  <Route path="stats" element={<Stats />} />
                  <Route path="events" element={<Events />} />
                  <Route path="newseason" element={<NewSeason />} />
                  <Route path="uniforms" element={<Uniforms />} />
                  <Route path="scheduleHelper" element={<ScheduleHelper />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* THESE ARE OUR PROTECTED ROUTES THAT DON"T NEED APP LAYOUT */}
                <Route
                  path="protected"
                  element={
                    <ProtectedRoute>
                      <AppLayoutProtected />
                    </ProtectedRoute>
                  }
                >
                  <Route path="scheduleTSSAA" element={<ScheduleTSSAA />} />
                  <Route path="rosterTSSAA" element={<RosterTSSAA />} />
                  <Route path="account" element={<Account />} />
                  <Route path="playerStats" element={<PlayerStats />} />
                  <Route path="publicStats" element={<PublicStats />} />
                  <Route path="game" element={<Game />} />
                </Route>
              </Routes>

              <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                toastOptions={{
                  success: { duration: 3000 },
                  error: { duration: 5000 },
                  style: {
                    fontSize: '16px',
                    maxWidth: '500px',
                    padding: '16px 24px',
                    backgroundColor: 'var(--color-grey-0)',
                    color: 'var(--color-grey-700',
                  },
                }}
              />
            </CurrentSeasonProvider>
          </SessionContextProvider>
        </Router>
      </QueryClientProvider>
    </StyleSheetManager>
  );
}

export default App;
