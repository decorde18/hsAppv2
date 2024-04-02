import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Users from './pages/Users';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './features/layout/AppLayout';
import AppLayoutPdf from './features/layout/AppLayoutPdf';

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

import NewSeason from './pages/NewSeason';
import Schedule from './pages/Schedule';
import ScheduleTSSAA from './pages/ScheduleTSSAA';
import RosterTSSAA from './pages/RosterTSSAA';
import Roster from './pages/Roster';
import HomePage from './pages/HomePage';
import ProtectedRoute from './ui/ProtectedRoute';
import PublicRoute from './ui/PublicRoute';
import AppLayoutPublic from './features/layout/AppLayoutPublic';
// import { PDFViewer } from '@react-pdf/renderer';

import Uniforms from './pages/Uniforms';
import UniformJerseys from './pages/UniformJerseys';
import UniformSeasons from './pages/UniformSeasons';
import UniformSeasonPlayers from './pages/UniformSeasonPlayers';
import ScheduleHelper from './pages/ScheduleHelper';
import Game from './pages/Game';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <SessionContextProvider supabaseClient={supabase}>
          <CurrentSeasonProvider>
            <GlobalStyles />
            <Routes>
              <Route index element={<Navigate replace to="public" />} />
              <Route path="public" element={<HomePage />} />

              <Route
                path="/"
                element={
                  <PublicRoute>
                    <AppLayoutPublic />
                  </PublicRoute>
                }
              >
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
                <Route path="seasonMain" element={<Season />} />
                <Route path="players" element={<Players />} />
                <Route path="people" element={<People />} />
                <Route path="communication" element={<Communication />} />
                <Route path="games" element={<Games />} />
                <Route path="events" element={<Events />} />
                <Route path="newseason" element={<NewSeason />} />
                <Route path="uniforms" element={<Uniforms />} />
                <Route path="uniformJerseys" element={<UniformJerseys />} />
                <Route path="uniformSeasons" element={<UniformSeasons />} />
                <Route path="scheduleHelper" element={<ScheduleHelper />} />
                <Route
                  path="uniformSeasonPlayers"
                  element={<UniformSeasonPlayers />}
                />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* THESE ARE OUR PROTECTED ROUTES THAT DON"T NEED APP LAYOUT */}
              <Route
                path="protected"
                element={
                  <ProtectedRoute>
                    <AppLayoutPdf />
                  </ProtectedRoute>
                }
              >
                <Route path="scheduleTSSAA" element={<ScheduleTSSAA />} />
                <Route path="rosterTSSAA" element={<RosterTSSAA />} />
                <Route path="account" element={<Account />} />
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
  );
}

export default App;
