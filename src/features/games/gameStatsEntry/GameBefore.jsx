import Spinner from '../../../ui/Spinner';
import Row from '../../../ui/Row';
import Empty from '../../../ui/Empty';

import GamePlayerRow from './GamePlayerRow';

import {
  usePlayerSeason,
  usePlayerSeasonWithNumber,
} from '../../players/usePlayerSeasons';
import {
  useCreatePlayerGame,
  useUpdatePlayerGame,
} from '../../players/usePlayerGames';
import { useEffect, useState } from 'react';
import Heading from '../../../ui/Heading';
import styled from 'styled-components';
import Menus from '../../../ui/Menus';
import Select from '../../../ui/Select';
import Button from '../../../ui/Button';
import { NavLink } from 'react-router-dom';

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
`;
const HeaderDiv = styled.div`
  background-color: var(--color-grey-200);
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
`;
const Gap = styled.div`
  width: 4rem;
  height: 4.6rem;
  margin-bottom: 2rem;
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

function GameBefore({ game, playerGames, editGame, isEditingGame }) {
  const { isLoadingPlayerSeasonWithNumber, playerSeasonWithNumber } =
    usePlayerSeasonWithNumber(game.season);
  const { createPlayerGame, isCreatingPlayerGame } = useCreatePlayerGame();
  const { isUpdating, updatePlayerGames } = useUpdatePlayerGame();

  const [beginGame, setBeginGame] = useState(false);
  const [playerGameStatus, setPlayerGameStatus] = useState({
    start: [],
    dressed: [],
    unavailable: [],
    injured: [],
    notDressed: [],
    gkStarter: null,
  });
  //todo fix, on create stats for game, it doesn't refresh when they are created

  const isWorking = isCreatingPlayerGame || isLoadingPlayerSeasonWithNumber;
  useEffect(() => {
    //add playerGame if they are not already added
    if (isLoadingPlayerSeasonWithNumber) return;
    playerSeasonWithNumber.map((player) => {
      if (!playerGames.find((game) => player.playerId === game.player))
        createPlayerGame({
          newData: {
            game: game.id,
            player: player.playerId,
            dressed: player.teamLevel.includes('Varsity'),
          },
        });
    });
  }, [isLoadingPlayerSeasonWithNumber]);
  useEffect(() => {
    //update state of all values
    if (isLoadingPlayerSeasonWithNumber) return;
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
  }, [isLoadingPlayerSeasonWithNumber]);
  useEffect(() => {
    setBeginGame(
      playerGameStatus.start.length === 10 && playerGameStatus.gkStarter
    );
  }, [playerGameStatus.start, playerGameStatus.gkStarter]);

  function updateGK(e) {
    const oldGk = playerGameStatus.gkStarter;
    const newGk = +e.target.value;
    const gkOldG = playerGamesWithNumber.find((play) => play.player === oldGk);
    const gkNewG = playerGamesWithNumber.find((play) => play.player === newGk);
    //remove gk from start and dressed & add old GK to dressed
    const newDressedColumn = playerGameStatus.dressed.filter(
      (player) => player.player !== gkNewG.player
    );
    gkOldG && newDressedColumn.push(gkOldG);
    const newStartColumn = playerGameStatus.start.filter(
      //needed in case gk is already in the starter column
      (player) => player.player !== gkNewG.player
    );
    //set New GK
    setPlayerGameStatus({
      ...playerGameStatus,
      start: [...newStartColumn].sort((a, b) => a.number - b.number),
      dressed: [...newDressedColumn].sort((a, b) => a.number - b.number),
      gkStarter: newGk,
    });
    //update DB
    const newData = {
      start: false,
      injured: false,
      unavailable: false,
      dressed: false,
      gkStarter: false,
    };
    // update oldGK
    if (gkOldG)
      updatePlayerGames({
        newData: { ...newData, dressed: true },
        id: gkOldG?.id,
      });
    //updateNewGK
    updatePlayerGames({
      newData: {
        ...newData,
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
    const newData = {
      start: false,
      injured: false,
      unavailable: false,
      dressed: false,
    };
    if (newStatus !== 'notDressed') newData[newStatus] = true;
    if (newStatus === 'start') newData.dressed = true;
    updatePlayerGames({ newData, id: playerG.id });
  }
  function handleClick(e) {
    const name = e.target.name;
    editGame({ newData: { status: 'started' }, id: game.id });
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
  // const numberOfStarters =
  //   playerGameStatus.start.length === 10 && playerGameStatus.gkStarter;

  return (
    <>
      {beginGame ? (
        <Row type="horizontal" justify="center">
          <NavLink to={`./?gameId=${game.id}&edit=true`}>
            <Button
              name="manualGame"
              disabled={isEditingGame}
              variation="secondary"
            >
              Enter Stats Manually
            </Button>
          </NavLink>
          <Gap />
          <Button
            name="liveGame"
            disabled={isEditingGame}
            onClick={handleClick}
          >
            Start Live Game
          </Button>
        </Row>
      ) : (
        <Row type="horizontal" justify="center">
          <Gap />
          <Heading as="h2">
            You need 11 starters and a GK to enter stats
          </Heading>
          <Gap />
        </Row>
      )}
      <StyledRow>
        <Menus>
          {/* Menus is needed anytime you have menus in the subrows */}
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
                            disabled={isUpdating}
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
                            disabled={isUpdating}
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
        </Menus>
      </StyledRow>
    </>
  );
}

export default GameBefore;
