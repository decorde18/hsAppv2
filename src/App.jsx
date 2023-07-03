import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  useNavigation,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';

import './App.css';
// import { AuthProvider } from './contexts/FakeAuthContexts';
import { PlayersProvider } from './contexts/PlayersContexts';

import Players from './components/Players';
import Player from './components/Player';
import ProtectedRoute from './pages/ProtectedRoute';
import Login from './components/Login';
import SpinnerFullPage from './components/SpinnerFullPage';
import { loader as seasonLoader } from './features/seasons/SeasonSelector';
import Error from './ui/Error';

const Homepage = lazy(() => import('./pages/Homepage'));
const AppLayout = lazy(() => import('./pages/AppLayout'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
// Home Page
// 7v7
// Info
const NewPlayer = lazy(() => import('./pages/NewPlayer'));

//TODO CONVERT TO THIS BUT DON'T KNOW HOW SUSPENSE GOES INTO IT
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
      { path: '/app' },
      { path: '/players', element: <Players /> },
      { path: '/players/:id', element: <Player /> },
    ],
    loader: seasonLoader,
  },
  { path: '/', element: <Homepage />, loader: seasonLoader },
  { path: '/login', element: <Login /> },
  { path: '/new-player', element: <NewPlayer /> },
]);
// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
function App() {
  return <RouterProvider router={router} />;
}
// function App() {
//   return (
//     <AuthProvider>
//       <PlayersProvider>
//         <BrowserRouter>
//           <Suspense fallback={<SpinnerFullPage />}>
//             <Routes>
//               <Route index element={<Homepage />} />
//               <Route path='login' element={<Login />} />

//               <Route
//                 path='app'
//                 element={
//                   <ProtectedRoute>
//                     <AppLayout />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route path='players' element={<Players />} />
//                 <Route path='players/:id' element={<Player />} />
//               </Route>
//               <Route path='new-player' element={<NewPlayer />}></Route>
//               <Route path='*' element={<PageNotFound />} />
//             </Routes>
//           </Suspense>
//         </BrowserRouter>
//       </PlayersProvider>
//     </AuthProvider>
//   );
// }

export default App;
