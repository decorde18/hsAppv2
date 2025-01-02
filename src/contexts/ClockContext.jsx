import { createContext, useContext, useEffect, useState } from 'react';

const ClockContext = createContext();

function ClockProvider({ children, getGameTime, gameProgress, currentPeriod }) {
  const [currentPeriodTime, setCurrentPeriodTime] = useState(0);
  useEffect(() => {
    if (!currentPeriod) return;

    if (gameProgress === 'periodActive') {
      const interval = setInterval(() => {
        const newTime = getGameTime.periodTime();
        setCurrentPeriodTime((prevTime) =>
          prevTime !== newTime ? newTime : prevTime
        );
      }, 1000);

      return () => clearInterval(interval);
    }

    if (gameProgress === 'endGame') {
      setCurrentPeriodTime(getGameTime.fullGameTime());
    }
  }, [currentPeriod, gameProgress, getGameTime]);
  return (
    <ClockContext.Provider value={{ currentPeriodTime }}>
      {children}
    </ClockContext.Provider>
  );
}
function useClockContext() {
  const context = useContext(ClockContext);
  if (context === undefined)
    throw new Error('ClockContext was used outside of ClockProvider');

  return context;
}

export { ClockProvider, useClockContext };
