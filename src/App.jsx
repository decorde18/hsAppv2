import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import Users from './pages/Users';
// import Settings from './pages/Settings';
// import Account from './pages/Account';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';
import AppLayoutPdf from './ui/AppLayoutPdf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import NewPlayer from './pages/NewPlayer';
import Players from './pages/Players';
import People from './pages/People';
import Communication from './pages/Communication';
import Games from './pages/Games';
import Season from './pages/Season';
import Schedule from './pages/Schedule';
import ScheduleTSSAA from './pages/ScheduleTSSAA';
import RosterTSSAA from './pages/RosterTSSAA';
import Roster from './pages/Roster';
import PublicPage from './pages/PublicPage';
import ProtectedRoute from './ui/ProtectedRoute';
import { PDFViewer } from '@react-pdf/renderer';
import { createContext, useEffect, useState } from 'react';
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
export const AppContext = createContext();

function App() {
  const [currentSeason, setCurrentSeason] = useState(
    localStorage.getItem('currentSeason') || ''
  );

  return (
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
                <AppContext.Provider
                  value={{ currentSeason, setCurrentSeason }}
                >
                  <AppLayout />
                </AppContext.Provider>
              </ProtectedRoute>
            }
          >
            <Route path="players" element={<Players />} />
            <Route path="people" element={<People />} />
            <Route path="communication" element={<Communication />} />
            <Route path="games" element={<Games />} />
            <Route path="season" element={<Season />} />
            <Route path="uniforms" element={<Uniforms />} />
            <Route path="uniformJerseys" element={<UniformJerseys />} />
            <Route path="uniformSeasons" element={<UniformSeasons />} />
            <Route
              path="uniformSeasonPlayers"
              element={<UniformSeasonPlayers />}
            />

            {/* <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} /> */}
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
  );
}

export default App;
