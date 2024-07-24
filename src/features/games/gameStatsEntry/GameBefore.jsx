import styled from 'styled-components';

import { useEffect, useState } from 'react';
import { usePlayerContext } from '../../../contexts/PlayerContext';

import Menus from '../../../ui/Menus';
import Select from '../../../ui/Select';
import Button from '../../../ui/Button';
import Spinner from '../../../ui/Spinner';

import { useUpdateData } from '../../../services/useUniversal';

import { HiMiniHandRaised } from 'react-icons/hi2';
import { IoShirt } from 'react-icons/io5';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { FaBriefcaseMedical } from 'react-icons/fa6';

const columnTypes = [
  {
    label: 'GK Starter',
    field: 'gkStarter',
    emptyLabel: 'We Need A GK',
    rowStart: 1,
    rowEnd: 2,
    iconColor: 'black',
    icon: <HiMiniHandRaised />,
  },
  {
    label: 'Starters',
    field: 'starter',
    emptyLabel: 'Starting Players',
    rowStart: 2,
    rowEnd: 3,
    icon: <IoShirt color="green" />,
  },
  {
    label: 'Dressed',
    field: 'dressed',
    emptyLabel: 'Dressed Players',
    rowStart: 1,
    rowEnd: -1,
    icon: <IoShirt color="black" />,
  },
  {
    label: 'Not Dressed',
    field: 'notDressed',
    emptyLabel: 'Non-Dressed Players',
    rowStart: 1,
    rowEnd: -1,
    icon: <IoShirt color="red" />,
  },
  {
    label: 'Injured',
    field: 'injured',
    emptyLabel: 'Injured Players',
    rowStart: 3,
    rowEnd: 4,
    icon: <FaBriefcaseMedical color="red" />,
  },
  {
    label: 'Unavailable',
    field: 'unavailable',
    emptyLabel: 'Unavailable Players',
    rowStart: 4,
    rowEnd: 5,
    icon: <MdDoNotDisturbAlt color="black" />,
  },
];

//TODO we need to be able to scroll columns
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(4, auto);
  gap: 1rem;
  margin: 1rem;
`;
const GameStartContainer = styled.div`
  margin: 1rem;
`;
const Column = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 30rem;
`;
const StyledRow = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 3rem;
  border: 1px solid var(--color-grey-100);
  border-radius: 5px;
  padding: 0.5rem 1rem;
`;
const Div = styled.div`
  /* flex: 1; */
  margin-bottom: 2rem;
  overflow-y: auto;
`;
const HeaderDiv = styled.div`
  background-color: var(--color-grey-200);
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

function GameBefore({ handleStartGame }) {
  const players = usePlayerContext();
  const { isUpdating, updateData } = useUpdateData();
  const [beginGame, setBeginGame] = useState(false);
  const [playerGameStatus, setPlayerGameStatus] = useState([]);

  useEffect(() => {
    setPlayerGameStatus(players);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //create state for playerGameStatus
  useEffect(() => {
    //on no GK, can not start game
    if (!playerGameStatus.length) return;
    setBeginGame(
      playerGameStatus.some((player) => player.gameStatus === 'gkStarter') &&
        playerGameStatus.filter((player) => player.gameStatus === 'starter')
          .length >= 6
    );
  }, [playerGameStatus]); //update beginGame status when playerGameStatus changes

  function handleClick(e) {
    const id = e.target.closest('div')?.id;
    if (id) {
      //if regular click
      const [status, playerId] = id.split('-');

      switch (status) {
        case 'dressed':
          updateGameStatus(playerId, 'starter');
          break;
        case 'starter':
          updateGameStatus(playerId, 'dressed');
          break;
        default:
          updateGameStatus(playerId, 'dressed');
      }
    } else {
      //if menu item selected
      const name = e.target.closest('button').name;
      const [status, playerId] = name.split('-');
      updateGameStatus(playerId, status);
    }
  }
  function updateGk(e) {
    const playerId = e.target.value;

    //remove current gk
    const previousGK = playerGameStatus.find(
      (play) => play.gameStatus === 'gkStarter'
    )?.playerId;
    previousGK && updateGameStatus(previousGK, 'dressed');

    //add new gk
    updateGameStatus(playerId, 'gkStarter');
  }
  function updateGameStatus(playerId, status) {
    const playerGameId = players.find((play) => play.playerId === +playerId);
    setPlayerGameStatus((prev) =>
      prev.map((playG) =>
        playG.id === playerGameId.id
          ? { ...playG, gameStatus: status }
          : { ...playG }
      )
    );

    updateData({
      table: 'playerGames',
      newData: { status },
      id: playerGameId.playergameid,
    });
  }

  //TODO
  // and change game status
  // fix menus so they close when clicked somewhere else

  if (!playerGameStatus) return <Spinner />;

  const gkSelectArray = [
    { label: 'PLEASE SELECT A GK', value: 0 },
    ...playerGameStatus
      .sort((a, b) => a.number - b.number)
      .sort(
        (a, b) =>
          (a.gkRoster === null) - (b.gkRoster === null) ||
          +a.gkRoster - +b.gkRoster
      )
      .map((play) => ({
        label: `${play.number}   ${play.fullname}`,
        value: play.playerId,
      })),
  ];
  return (
    <>
      <GameStartContainer>
        {beginGame ? (
          <Button onClick={handleStartGame}>START GAME</Button>
        ) : (
          <StyledRow style={{ backgroundColor: 'red' }}>
            You must have at least 7 starters and must declare a GK
          </StyledRow>
        )}
      </GameStartContainer>
      <Container>
        {columnTypes.map((column) => (
          <Column
            key={`col-${column.field}`}
            style={{ gridRowStart: column.rowStart, gridRowEnd: column.rowEnd }}
          >
            <HeaderDiv>
              {column.label}
              <span>
                {
                  playerGameStatus.filter(
                    (play) => play.gameStatus === column.field
                  ).length
                }
              </span>
            </HeaderDiv>
            <Div>
              {column.field === 'gkStarter' ? (
                <Select
                  options={gkSelectArray}
                  type="dark"
                  onChange={updateGk}
                  value={
                    playerGameStatus.find(
                      (play) => play.gameStatus === 'gkStarter'
                    )?.playerId || 0
                  }
                  id={'gkStarter'}
                  disabled={isUpdating}
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                playerGameStatus
                  .filter((play) => play.gameStatus === column.field)
                  .sort((a, b) => a.number - b.number)
                  .map((play) => (
                    <StyledRow
                      onClick={handleClick}
                      key={play.playerId}
                      id={`${column.field}-${play.playerId}`}
                    >
                      <span> {play.number}</span>
                      <span>{play.fullname}</span>
                      <Menus>
                        <Menus.Toggle id={play.id} />
                        <Menus.List id={play.id}>
                          {columnTypes
                            .filter((col) => col.field !== 'gkStarter')
                            .map(
                              (col) =>
                                col.field !== column.field && (
                                  <Menus.Button
                                    key={`menu-${col.field}-${play.playerId}`}
                                    icon={col.icon}
                                    name={`${col.field}-${play.playerId}`}
                                  >
                                    {col.label}
                                  </Menus.Button>
                                )
                            )}
                        </Menus.List>
                      </Menus>
                    </StyledRow>
                  ))
              )}
            </Div>
          </Column>
        ))}
      </Container>
    </>
  );
}

export default GameBefore;
