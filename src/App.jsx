import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// import Users from './pages/Users';
// import Settings from './pages/Settings';
import Account from './pages/Account';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';
import AppLayoutPdf from './ui/AppLayoutPdf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CurrentSeasonProvider } from './contexts/CurrentSeasonContext';
// import supabase from './services/supabase';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import NewPlayer from './pages/NewPlayer';
import Players from './pages/Players';
import People from './pages/People';
import Communication from './pages/Communication';
import Games from './pages/Games';
import Season from './pages/Season';

import NewSeason from './pages/NewSeason';
import Schedule from './pages/Schedule';
import ScheduleTSSAA from './pages/ScheduleTSSAA';
import RosterTSSAA from './pages/RosterTSSAA';
import Roster from './pages/Roster';
import PublicPage from './pages/PublicPage';
import ProtectedRoute from './ui/ProtectedRoute';
// import { PDFViewer } from '@react-pdf/renderer';

import Uniforms from './pages/Uniforms';
import UniformJerseys from './pages/UniformJerseys';
import UniformSeasons from './pages/UniformSeasons';
import UniformSeasonPlayers from './pages/UniformSeasonPlayers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000, //amount of time before refresh of data ---can set to 0 and therfore it is always fetching
      staleTime: 0,
    },
  },
});

function App() {
  return (
    // <SessionContextProvider supabaseClient={supabase}>
    <CurrentSeasonProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route index element={<Navigate replace to="public" />} />

            <Route path="public" element={<PublicPage />} />
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
              <Route path="newseason" element={<NewSeason />} />
              <Route path="uniforms" element={<Uniforms />} />
              <Route path="uniformJerseys" element={<UniformJerseys />} />
              <Route path="uniformSeasons" element={<UniformSeasons />} />
              <Route
                path="uniformSeasonPlayers"
                element={<UniformSeasonPlayers />}
              />
              {/* <Route path="users" element={<Users />} />*/}
              {/* <Route path="settings" element={<Settings />} />
               */}
            </Route>
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
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="roster" element={<Roster />} />
            <Route path="newplayer" element={<NewPlayer />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
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
      </QueryClientProvider>
    </CurrentSeasonProvider>
    // </SessionContextProvider>
  );
}

export default App;
