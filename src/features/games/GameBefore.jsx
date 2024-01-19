import Spinner from '../../ui/Spinner';
import Row from '../../ui/Row';
import Empty from '../../ui/Empty';

import GamePlayerRow from './GamePlayerRow';

import {
  usePlayerSeason,
  usePlayerSeasonWithNumber,
} from '../players/usePlayerSeasons';
import {
  usePlayerGames,
  useCreatePlayerGame,
  useUpdatePlayerGame,
} from '../players/usePlayerGames';
import { useEffect, useState } from 'react';
import Heading from '../../ui/Heading';
import styled from 'styled-components';
import Menus from '../../ui/Menus';
import Select from '../../ui/Select';

const StyledRow = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  gap: 3rem;
  max-width: 90rem;
`;
const Div = styled.div`
  flex: 1;
  margin-bottom: 2rem;
  margin-top: -0.75rem;
`;
const HeaderDiv = styled.div`
  background-color: var(--color-grey-200);
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
`;
const columnTypes = [
  {
    label: 'Starters',
    field: 'start',
    emptyLabel: 'Starting Players',
    column: 1,
  },
  {
    label: 'Dressed',
    field: 'dressed',
    emptyLabel: 'Dressed Players',
    column: 2,
  },
  {
    label: 'Not Dressed',
    field: 'notDressed',
    emptyLabel: 'Non-Dressed Players',
    column: 3,
  },
  {
    label: 'Injured',
    field: 'injured',
    emptyLabel: 'Injured Players',
    column: 1,
  },
  {
    label: 'Unavailable',
    field: 'unavailable',
    emptyLabel: 'Unavailable Players',
    column: 1,
  },
];
const numberOfColumns = new Set(columnTypes.map((col) => col.column));

function GameBefore({ game }) {
  const { isLoadingPlayerSeasonWithNumber, playerSeasonWithNumber } =
    usePlayerSeasonWithNumber(game.season);
  const { isLoadingPlayerGames, playerGames } = usePlayerGames();
  const { createPlayerGame, isCreatingPlayerGame } = useCreatePlayerGame();
  const { isUpdating, updatePlayerGames } = useUpdatePlayerGame();

  const [playerGameStatus, setPlayerGameStatus] = useState({
    start: [],
    dressed: [],
    unavailable: [],
    injured: [],
    notDressed: [],
    gkStarter: null,
  });

  const isWorking =
    isCreatingPlayerGame ||
    isLoadingPlayerGames ||
    isLoadingPlayerSeasonWithNumber;
  useEffect(() => {
    //add playerGame if they are not already added
    if (isLoadingPlayerSeasonWithNumber || isLoadingPlayerGames) return;
    const eligiblePlayers = playerSeasonWithNumber.filter(
      (player) => player.status === 'Rostered'
    );
    eligiblePlayers.map((player) => {
      if (!playerGames.find((game) => player.playerId === game.player))
        addPlayerGame({
          game: game.id,
          player: player.playerId,
          dressed: player.teamLevel.includes('Varsity'),
        });
    });
    function addPlayerGame(data) {
      createPlayerGame(data);
    }
  }, [
    createPlayerGame,
    game,
    isLoadingPlayerGames,
    isLoadingPlayerSeasonWithNumber,
    playerGames,
    playerSeasonWithNumber,
  ]);

  useEffect(() => {
    //todo add gkStarter
    //update state of all values
    if (isLoadingPlayerGames || isLoadingPlayerSeasonWithNumber) return;
    const updatedPlayerGames = playerGames.map((player) => ({
      ...playerSeasonWithNumber.find((play) => play.playerId === player.player),
      ...player,
    }));
    setPlayerGameStatus({
      start: updatedPlayerGames
        .filter(
          (playerG) => playerG.start === true && playerG.gkStarter === false
        )
        .sort((a, b) => a.number - b.number),
      dressed: updatedPlayerGames
        .filter(
          (playerG) => playerG.start === false && playerG.dressed === true
        )
        .sort((a, b) => a.number - b.number),
      injured: updatedPlayerGames
        .filter((playerG) => playerG.injured === true)
        .sort((a, b) => a.number - b.number),
      unavailable: updatedPlayerGames
        .filter((playerG) => playerG.available === false)
        .sort((a, b) => a.number - b.number),
      notDressed: updatedPlayerGames
        .filter(
          (playerG) =>
            playerG.start === false &&
            playerG.dressed === false &&
            playerG.injured === false &&
            playerG.unavailable === false
        )
        .sort((a, b) => a.number - b.number),
      gkStarter: updatedPlayerGames.find((player) => player.gkStarter === true)
        ?.player,
    });
    //I only want it to run on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingPlayerGames, isLoadingPlayerSeasonWithNumber]);

  function updateGK(e) {
    const oldGk = playerGameStatus.gkStarter;
    const newGk = +e.target.value;
    const gkOldG = playerGamesWithNumber.find((play) => play.player === oldGk);
    const gkNewG = playerGamesWithNumber.find((play) => play.player === newGk);
    const newDressedColumn = playerGameStatus.dressed.filter(
      (player) => player.player !== gkNewG.player
    );
    let newStartColumn = playerGameStatus.start.filter(
      (player) => player.player !== gkOldG.player
    );
    newStartColumn = newStartColumn.filter(
      //needed in case gk is already in the starter column
      (player) => player.player !== gkNewG.player
    );
    //set New GK
    setPlayerGameStatus({
      ...playerGameStatus,
      start: [...newStartColumn].sort((a, b) => a.number - b.number),
      dressed: [...newDressedColumn, gkOldG].sort(
        (a, b) => a.number - b.number
      ),
      gkStarter: newGk,
    });
    //update DB //TODO 1.here remove from starter
    const playerGameData = {
      start: false,
      injured: false,
      unavailable: false,
      dressed: false,
      gkStarter: false,
    };
    // update oldGK
    if (gkOldG)
      updatePlayerGames({
        playerGameData: { ...playerGameData, dressed: true },
        id: gkOldG?.id,
      });
    //updateNewGK
    updatePlayerGames({
      playerGameData: {
        ...playerGameData,
        start: true,
        dressed: true,
        gkStarter: true,
      },
      id: gkNewG.id,
    });
  }
  function handleOnToggle(status, id) {
    const newStatus = status === 'dressed' ? 'start' : 'dressed';
    updateStatus(status, newStatus, id);
  }
  function updateStatus(status, newStatus, id) {
    const playerG = playerGamesWithNumber.find((play) => play.player === id);
    //remove from current
    const oldColumn = playerGameStatus[status].filter(
      (player) => player.player !== id
    );
    //add to new column
    const newColumn = [...playerGameStatus[newStatus], playerG];
    //update State
    setPlayerGameStatus({
      ...playerGameStatus,
      [status]: oldColumn.sort((a, b) => a.number - b.number),
      [newStatus]: newColumn.sort((a, b) => a.number - b.number),
    });
    //update DB
    const playerGameData = {
      start: false,
      injured: false,
      unavailable: false,
      dressed: false,
    };
    if (newStatus !== 'notDressed') playerGameData[newStatus] = true;
    if (newStatus === 'start') playerGameData.dressed = true;
    updatePlayerGames({ playerGameData, id: playerG.id });
  }

  if (isWorking) return <Spinner />;
  const playerSeasonNumberChanges = playerSeasonWithNumber.map((player) => ({
    seasonPlayerId: player.id,
    ...player,
  })); //must change the id from the PlayerSeaonsNumber

  const playerGamesWithNumber = playerGames
    .map((player) => ({
      ...playerSeasonNumberChanges.find(
        (play) => player.player === play.playerId
      ),
      ...player,
    }))
    .sort((a, b) => a.number - b.number); //compile into game with season

  const gkSelectArray = [
    { label: 'PLEASE SELECT A GK', value: 0 },
    ...playerGamesWithNumber
      .filter((play) => play.dressed)
      .map((play) => ({
        label: `${play.number}   ${play.fullname}`,
        value: play.player,
      })),
  ];

  return (
    <Menus>
      {/* Menus is needed anytime you have menus in the subrows */}
      <StyledRow>
        {[...numberOfColumns].map((column) => (
          <Div key={`column${column}`}>
            {columnTypes.map(
              (col) =>
                col.column === column && (
                  <Div key={col.field}>
                    <HeaderDiv>
                      <Heading as={'h3'} case="upper" location={'center'}>
                        <Row type="horizontal" justify="space-between">
                          {col.label}
                          <div>
                            {(col.field === 'start' &&
                            playerGameStatus.gkStarter
                              ? 1
                              : 0) + playerGameStatus[col.field].length}
                          </div>
                        </Row>
                      </Heading>
                    </HeaderDiv>
                    {col.field === 'start' && (
                      <Heading as={'h3'} location={'center'}>
                        <div>Goalkeeper</div>
                        <Select
                          options={gkSelectArray}
                          type="dark"
                          onChange={updateGK}
                          value={playerGameStatus.gkStarter || 0}
                          id={'gkStarter'}
                        />
                        <div>Field Players</div>
                      </Heading>
                    )}
                    {!playerGameStatus[col.field].length ? (
                      <Empty resource={col.emptyLabel} />
                    ) : (
                      playerGameStatus[col.field].map((player) => (
                        <GamePlayerRow
                          handleOnToggle={handleOnToggle}
                          updateStatus={updateStatus}
                          key={player.player}
                          status={col.field}
                          data={{
                            playerG: player,
                            playerS: playerSeasonWithNumber.find(
                              (playerN) => playerN.playerId === player.player
                            ),
                          }}
                        />
                      ))
                    )}
                  </Div>
                )
            )}
          </Div>
        ))}
      </StyledRow>
    </Menus>
  );
}

export default GameBefore;
