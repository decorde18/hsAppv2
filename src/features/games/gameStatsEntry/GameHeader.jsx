import styled from 'styled-components';

import { useEffect, useState } from 'react';

import { useGameContext } from '../../../contexts/GameContext';

import {
  convertSecondsToMinutesSeconds,
  formatDate,
  formatTime,
  getCurrentTime,
  subtractTimes,
} from '../../../utils/helpers';

import Heading from '../../../ui/Heading';
import Row from '../../../ui/Row';

import GameSettings from './GameSettings';

import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const StyledDiv = styled.div`
  padding: 1rem;
`;
const Clock = styled.div`
  font-size: 90px;
  font-family: 'VT323', 'Orbitron', 'Digital-7';
  margin: -4rem;
  letter-spacing: 1.25rem;
`;
/* GAME HEADER - use on (Game Break?, game stoppage? are these modals?),
 before game , after game */
function GameHeader() {
  const { gameDetails, currentPeriod } = useGameContext();
  const { game, gameStatus } = gameDetails;
  const [currentPeriodTime, setCurrentPeriodTime] = useState(0);
  const [countDown, setCountDown] = useState(true);
  useEffect(() => {
    //start scoreboard clock
    if (!currentPeriod) return;

    if (gameStatus === 'periodActive') {
      const interval = setInterval(() => {
        setCurrentPeriodTime(
          subtractTimes(currentPeriod.start, getCurrentTime())
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentPeriod, gameStatus]);

  return (
    <>
      <StyledDiv>
        <Row type="horizontal" justify="space-around">
          <Heading as="h4" case="upper" location="center">
            <div>IHS</div>
            <div>{game.gf}</div>
          </Heading>
          {gameStatus !== 'periodActive' ? (
            <div>
              <Heading as="h4" case="upper" location="center">
                <div>{game.short_name}</div>
              </Heading>
              <Heading as="h2" case="upper" location="center">
                <div>@ {game.locationName}</div>
                <Row type="horizontal" justify="space-evenly">
                  <div />
                  <div>{formatDate(new Date(game.date))}</div>
                  <div>{formatTime(game?.time, true)}</div>
                  <div />
                </Row>
              </Heading>
            </div>
          ) : (
            currentPeriod && (
              <div>
                <Clock>
                  {countDown === true
                    ? convertSecondsToMinutesSeconds(
                        currentPeriod?.default_time - currentPeriodTime
                      )
                    : convertSecondsToMinutesSeconds(currentPeriodTime)}
                </Clock>
                <div>
                  <button onClick={() => setCountDown(() => !countDown)}>
                    {countDown ? <FaArrowDown /> : <FaArrowUp />}
                  </button>
                </div>
                <div>Period {currentPeriod?.period}</div>
              </div>
            )
          )}
          <Heading as="h4" case="upper" location="center">
            <div>{game.abbreviation}</div>
            <div>{game.ga}</div>
          </Heading>
        </Row>
      </StyledDiv>
      {gameStatus !== 'periodActive' && <GameSettings expand={false} />}
    </>
  );
}

export default GameHeader;
