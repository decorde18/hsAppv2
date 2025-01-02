import { createContext, useContext, useState } from 'react';

const menuButtons = [
  { name: 'Main', link: 'seasonMain' },
  { name: 'Season', link: 'seasonMain' },
  { name: 'Players', link: 'players' },
  { name: 'Games', link: 'games' },
  { name: 'Statistics', link: 'stats' },
  { name: 'Other', link: 'Test' },
];

const AppNavContext = createContext();

function AppNavContextProvider({ children }) {
  const result = /[^/]*$/.exec(window.location.href)[0].split('?')[0];

  const [active, setActive] = useState(
    menuButtons.find((url) => result === url.link)?.name || 'Other'
  );
  function handleToggle(e) {
    e.target.name === 'Other' ? setActive('Main') : setActive(e.target.name);
  }
  return (
    <AppNavContext.Provider value={{ active, handleToggle, menuButtons }}>
      {children}
    </AppNavContext.Provider>
  );
}
function useAppNavContext() {
  const context = useContext(AppNavContext);

  if (context === undefined)
    throw new Error('AppNavContext was used outside of AppNavProvider');

  return context;
}

export { AppNavContextProvider, useAppNavContext };
