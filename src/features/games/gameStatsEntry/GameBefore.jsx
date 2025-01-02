import styled from 'styled-components';

import { useEffect, useState } from 'react';
import { usePlayerContext } from '../../../contexts/PlayerContext';
import { useGameContext } from '../../../contexts/GameContext';

import Menus from '../../../ui/Menus';
import Select from '../../../ui/Select';
import Button from '../../../ui/Button';

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
    iconColor: 'black',
    icon: <HiMiniHandRaised />,
    layout: 'firstColumn',
  },
  {
    label: 'Field Starters',
    field: 'starter',
    emptyLabel: 'Starting Players',
    icon: <IoShirt color="green" />,
    layout: 'firstColumn',
  },
  {
    label: 'Dressed',
    field: 'dressed',
    emptyLabel: 'Dressed Players',
    icon: <IoShirt color="black" />,
  },
  {
    label: 'Not Dressed',
    field: 'notDressed',
    emptyLabel: 'Non-Dressed Players',
    icon: <IoShirt color="red" />,
  },
  {
    label: 'Injured',
    field: 'injured',
    emptyLabel: 'Injured Players',
    icon: <FaBriefcaseMedical color="red" />,
    layout: 'firstColumn',
  },
  {
    label: 'Unavailable',
    field: 'unavailable',
    emptyLabel: 'Unavailable Players',
    icon: <MdDoNotDisturbAlt color="black" />,
    layout: 'firstColumn',
  },
];

const GameStartContainer = styled.div`
  gap: 1rem;
  margin: 1rem;
`;
const MainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal-width columns */
  grid-template-rows: 8rem minmax(20rem, 1fr) minmax(8rem, auto) minmax(
      8rem,
      auto
    ); /* Fixed 10rem row and remaining height */
  gap: 1rem; /* Optional spacing between items */
  grid-auto-flow: dense; /* Automatically place items based on content order */
  max-height: 100%; /*Ensure grid fills its container*/
  overflow: hidden; /* Prevent grid from exceeding the page */
  margin: 1rem;
`;
const Column = styled.div`
  text-align: center;

  /* Conditional placement based on layout */
  ${({ layout, index }) => {
    if (layout === 'firstColumn') return `grid-column: 1;`;
    else
      return `
          grid-column: ${index}; 
          grid-row: 1/-1 ; `;
  }}
  /* Ensure the content within the column is /* Make each column's content scrollable */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-height: 100%; /* Ensure the column does not exceed the height of its container */
`;
const HeaderDiv = styled.div`
  background-color: var(--color-grey-200);
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
`;
const Div = styled.div`
  max-height: 100%;
  overflow-y: auto;
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
  flex-shrink: 0;
  width: 100%; /* Ensure the rows don't extend beyond the column */
`;

function GameBefore() {
  const { periodHandle } = useGameContext();
  const { players } = usePlayerContext();
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
      playerGameStatus.some(
        (player) => player.playergamestatus === 'gkStarter'
      ) &&
        playerGameStatus.filter(
          (player) => player.playergamestatus === 'starter'
        ).length >= 6
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
      (play) => play.playergamestatus === 'gkStarter'
    )?.playerid;
    previousGK && updateGameStatus(previousGK, 'dressed');

    //add new gk
    updateGameStatus(playerId, 'gkStarter');
  }
  function updateGameStatus(playerId, status) {
    const playerGameId = players.find((play) => play.playerid === +playerId);

    setPlayerGameStatus((prev) =>
      prev.map((playG) =>
        playG.playerid === playerGameId.playerid
          ? { ...playG, playergamestatus: status }
          : { ...playG }
      )
    );

    updateData({
      table: 'playerGames',
      newData: { status },
      id: playerGameId.id,
    });
  }

  //TODO
  // fix menus so they close when clicked somewhere else

  const gkSelectArray = [
    { label: 'PLEASE SELECT A GK', value: 0 },
    ...playerGameStatus
      .sort((a, b) => a.number - b.number)
      .sort(
        (a, b) =>
          (a.gknumber === null) - (b.gknumber === null) ||
          +a.gknumber - +b.gknumber
      )
      .map((play) => ({
        label: `${play.gknumber || ''}   ${play.fullname}`,
        value: play.playerid,
      })),
  ];

  return (
    <>
      <GameStartContainer>
        {beginGame ? (
          <Button onClick={() => periodHandle.startGame()}>START GAME</Button>
        ) : (
          <StyledRow style={{ backgroundColor: 'red' }}>
            You must have at least 7 starters and must declare a GK
          </StyledRow>
        )}
      </GameStartContainer>
      <MainSection>
        {columnTypes.map((column, index) => (
          <Column
            key={`col-${column.field}`}
            layout={column.layout}
            index={index}
          >
            <HeaderDiv>
              {column.label}
              <span>
                {
                  playerGameStatus.filter(
                    (play) => play.playergamestatus === column.field
                  ).length
                }
              </span>
            </HeaderDiv>
            {column.field === 'gkStarter' ? (
              <Select
                options={gkSelectArray}
                type="dark"
                onChange={updateGk}
                value={
                  playerGameStatus.find(
                    (play) => play.playergamestatus === 'gkStarter'
                  )?.playerid || 0
                }
                id={'gkStarter'}
                disabled={isUpdating}
                style={{
                  width: '100%',
                }}
              />
            ) : (
              <Div>
                {playerGameStatus
                  .filter((play) => play.playergamestatus === column.field)
                  .sort((a, b) => a.number - b.number)
                  .map((play) => (
                    <StyledRow
                      onClick={handleClick}
                      key={play.playerid}
                      id={`${column.field}-${play.playerid}`}
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
                                    key={`menu-${col.field}-${play.playerid}`}
                                    icon={col.icon}
                                    name={`${col.field}-${play.playerid}`}
                                  >
                                    {col.label}
                                  </Menus.Button>
                                )
                            )}
                        </Menus.List>
                      </Menus>
                    </StyledRow>
                  ))}
              </Div>
            )}
          </Column>
        ))}
      </MainSection>
    </>
  );
}

export default GameBefore;
