import styled from 'styled-components';
import { useEffect, useState } from 'react';

import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal';
import ModalError from '../../../ui/ModalError';

import GameSettings from './GameSettings';

import Row from '../../../ui/Row';
import Heading from '../../../ui/Heading';

import GameStatsEditRow from './GameStatsEditRow';
import PlayerGameTimes from './inGameSubs/PlayerGameTimes';
import CurrentGK from './inGameSubs/CurrentGK';

import {
  convertMinutesSecondsToSeconds,
  convertSBtimeToLocalTime,
  convertSecondsToMinutesSeconds,
  subtractTimes,
} from '../../../utils/helpers';

import {
  useCreatePeriod,
  useUpdatePeriod,
  useDeletePeriod,
} from './usePeriods';
import {
  useCreateMinorEvent,
  useUpdateMinorEvent,
  useDeleteMinorEvent,
} from './useMinorEvents';
import {
  useCreateStoppage,
  useUpdateStoppage,
  useDeleteStoppage,
} from './useStoppages';
import { useCreateSub, useUpdateSub, useDeleteSub } from './useSubs';
import { usePlayerSeasonWithNumber } from '../../players/usePlayerSeasons';

const Container = styled.div`
  padding: 1rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 80dvh;
`;
const MainGrid = styled.div`
  flex: 0 0 84%;
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(2, 50%);
  align-items: stretch;
  border-radius: 0.5rem;
  /* padding: 1rem; */
`;
const Column = styled.div`
  overflow-y: auto;
  width: 100%;
  border: 1px solid var(--color-grey-200);
  /* padding: 0 1rem 0.5rem 1rem; */
  border-radius: 0.5rem;
`;
const StyledTable = styled.table`
  overflow-y: auto;
  border-collapse: separate;
  /* border-spacing: 1rem 0; */
  margin: auto;
  thead th {
    position: sticky;
    background-color: var(--color-grey-0);
    border-bottom: 1px solid var(--color-grey-200);
    text-align: center;
  }
  td {
    text-align: center;
  }
`;
const SidePanel = styled.div`
  flex: 0 0 16%;
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  padding-left: 1rem;
`;

const sortTablesArray = {
  periods: 'period',
  subs: 'gameMinute',
  stoppages: 'begin',
  minorEvents: 'gameMinute',
};

function GameStatsEdit({
  props: {
    game,
    playerGames,
    editGame,
    isEditingGame,
    periods,
    minorEvents,
    stoppages,
    subs,
  },
}) {
  const { isLoadingPlayerSeasonWithNumber, playerSeasonWithNumber } =
    usePlayerSeasonWithNumber(game.season);
  const { createStoppage, isCreatingStoppage } = useCreateStoppage();
  const { isUpdatingStoppage, updateStoppages } = useUpdateStoppage();
  const { isDeleting: isDeletingStoppage, deleteStoppage } =
    useDeleteStoppage();
  const { createSub, isCreatingSub } = useCreateSub();
  const { isUpdatingSub, updateSubs } = useUpdateSub();
  const { isDeletingSub, deleteSub } = useDeleteSub();
  const { createPeriod, isCreatingPeriod } = useCreatePeriod();
  const { isUpdatingPeriod, updatePeriods } = useUpdatePeriod();
  const { isDeletingPeriod, deletePeriod } = useDeletePeriod();
  const { createMinorEvent, isCreatingMinorEvent } = useCreateMinorEvent();
  const { isUpdatingMinorEvent, updateMinorEvents } = useUpdateMinorEvent();
  const { isDeletingMinorEvent, deleteMinorEvent } = useDeleteMinorEvent();

  const isWorking =
    isUpdatingMinorEvent ||
    isDeletingMinorEvent ||
    isCreatingMinorEvent ||
    isUpdatingStoppage ||
    isDeletingStoppage ||
    isCreatingStoppage ||
    isUpdatingSub ||
    isDeletingSub ||
    isCreatingSub ||
    isUpdatingPeriod ||
    isDeletingPeriod ||
    isCreatingPeriod;

  const [gameStats, setGameStats] = useState({
    periods,
    subs,
    stoppages,
    minorEvents,
  });
  const [errorModal, setErrorModal] = useState(false);

  function changeHandler(e) {
    //todo these will return the game time as a period time, will need to make it a game minute
    const [table, name, type] = e.target.name.split('-');
    let value = e.target.value;
    const id = +e.target.closest('tr').id;
    // if type is seconds, must be in proper format 00:00
    if (type === 'seconds') {
      const seconds = +value === 0 ? '0:00' : value;
      if (seconds.split(':').length !== 2) setErrorModal(true);

      //TODO !!! FIX time for periods needs to be a different format not the seconds thing

      //if proper format, convert to seconds
      value = convertMinutesSecondsToSeconds(value);
    }
    if (type === 'boolean') value = e.target.checked;

    const record = gameStats[table].find((fields) => fields.id === id);
    const sort = sortTablesArray[table];
    setGameStats({
      ...gameStats,
      [table]: [
        ...gameStats[table].filter((fields) => fields.id !== id),
        { ...record, [name]: value },
      ].sort((a, b) => a[sort] - b[sort]),
    });
    if (table === 'stoppages')
      updateStoppages({ newData: { [name]: value }, id });
    if (table === 'subs') updateSubs({ newData: { [name]: value }, id });
    if (table === 'periods') updatePeriods({ newData: { [name]: value }, id });
    if (table === 'minorEvents')
      updateMinorEvents({ newData: { [name]: value }, id });
  }

  if (isLoadingPlayerSeasonWithNumber) return <Spinner />;

  const columnArray = [
    {
      name: 'Periods',
      headers: ['Period', 'Start', 'End'],
      rows: gameStats.periods.map((field) => ({
        period: field.id,
        id: field.id,
        fields: [
          {
            type: 'input',
            size: 4,
            value: field.period,
            name: `periods-period-number-`,
          },
          {
            type: 'input',
            size: 8.75,
            value: convertSBtimeToLocalTime(field.start, true),
            name: `periods-start-time-`,
          },
          {
            type: 'input',
            size: 8.75,
            value: convertSBtimeToLocalTime(field.end, true),
            name: `periods-end-time-`,
          },
        ],
      })),
    },
    {
      name: 'Stoppages',
      headers: ['Event', 'Time', 'Time End', 'Stopped?'],
      rows: gameStats.stoppages.map((field) => ({
        id: field.id,
        period: field.periodId,
        fields: [
          {
            type: 'select',
            options: [
              { label: 'GA', value: 'Goal Against' },
              { label: 'GF', value: 'Goal Scored' },
              { label: 'Injury', value: 'Injury' },
              { label: 'PK', value: 'Penalty Kick' },
              { label: 'YC', value: 'Yellow Card' },
              { label: 'RC', value: 'Red Card' },
              { label: 'Weather', value: 'Weather' },
              { label: 'Other', value: 'Other' },
            ],
            size: 0,
            value: field.event,
            name: `stoppages-event-string-`,
          },
          // { type: 'input', size: 7, value: field.event },
          // {
          //   type: 'select',
          //   options: [
          //     { label: 'IHS', value: 'for' },
          //     { label: game.schools.abbreviation, value: 'against' },
          //   ],
          //   size: 0,
          //   value: field.team,
          //   id: field.id,
          // }, //TODO this needs to be added to DB
          {
            type: 'input',
            size: 7,
            value: convertSecondsToMinutesSeconds(field.begin),
            name: `stoppages-begin-seconds-`,
          },
          {
            type: 'input',
            size: 7,
            value: convertSecondsToMinutesSeconds(field.end),
            name: `stoppages-end-seconds-`,
          },
          {
            type: 'checkbox',
            size: 'medium',
            value: field.clockStopped,
            name: `stoppages-clockStopped-boolean-`,
          },
        ],
      })),
    },
    {
      name: 'Minor Events',
      headers: ['Type', 'Team', ' Game Time'],
      rows: gameStats.minorEvents.map((field) => ({
        period: field.periodId,
        id: field.id,
        fields: [
          {
            type: 'select',
            options: [
              { label: 'CK', value: 'corner' },
              { label: 'Off', value: 'offside' },
              { label: 'Foul', value: 'foul' },
              { label: 'Shot', value: 'shots' }, //TODO I need to add another field for player number when shot or save
              { label: 'Save', value: 'save' },
            ],
            size: 0,
            value: field.eventType,
            name: `minorEvents-eventType-string-`,
          },
          {
            type: 'select',
            options: [
              { label: 'IHS', value: 'for' },
              { label: game.schools.abbreviation, value: 'against' },
            ],
            size: 0,
            value: field.team,
            id: field.id,
            name: `minorEvents-team-string-`,
          },
          {
            type: 'input',
            size: 7,
            value: convertSecondsToMinutesSeconds(field.gameMinute),
            name: `minorEvents-gameMinute-seconds-`,
          },
        ],
      })),
    },
    {
      name: 'Subs',
      headers: ['Time', 'In', 'Out', 'GK?'],
      rows: gameStats.subs.map((field) => ({
        period: field.periodId,
        id: field.id,
        fields: [
          {
            type: 'input',
            size: 7,
            value: convertSecondsToMinutesSeconds(field.gameMinute),
            name: `subs-gameMinute-seconds-`,
          },
          {
            type: 'input',
            size: 4,
            value:
              field.gkSub &&
              playerSeasonWithNumber.find(
                (player) => player.playerId === field.subOut
              ).gkNumber
                ? playerSeasonWithNumber.find(
                    (player) => player.playerId === field.subOut
                  ).gkNumber
                : playerSeasonWithNumber.find(
                    (player) => player.playerId === field.subIn
                  ).number,
            name: `subs-subIn-number-`,
          },
          {
            type: 'input',
            size: 4,
            value:
              field.gkSub &&
              playerSeasonWithNumber.find(
                (player) => player.playerId === field.subOut
              ).gkNumber
                ? playerSeasonWithNumber.find(
                    (player) => player.playerId === field.subOut
                  ).gkNumber
                : playerSeasonWithNumber.find(
                    (player) => player.playerId === field.subOut
                  ).number,
            name: `subs-subOut-number-`,
          },
          {
            type: 'checkbox',
            size: 'medium',
            value: field.gkSub,
            name: `subs-gkSub-boolean-`,
          },
        ],
      })),
    },
  ];
  const gameTime =
    periods.reduce((acc, cur) => {
      acc = acc + subtractTimes(cur.start, cur.end);
      return acc;
    }, 0) -
    stoppages.reduce(
      (acc, cur) => (acc += cur.clockStopped ? cur.end - cur.begin : 0),
      0
    );
  const inGamePlayers = playerGames
    .filter((player) => player.dressed)
    .map((player) => ({
      ...playerSeasonWithNumber.find((play) => play.playerId === player.player),
      id: player.player,
      // gkStarter: player.gkStarter ? 1 : 0,
      // gkIns: subs.filter((sub) => sub.subIn === player.player && sub.gkSub)
      //   .length,
      // gkOuts: subs.filter((sub) => sub.subOut === player.player && sub.gkSub)
      //   .length,
      subDetails: playerGameTime(
        player.player,
        player.start,
        player.gkStarter,
        gameTime
      ),
    }))
    .sort((a, b) => a.number - b.number);
  //     gkStatus: player.gkStarter + player.gkIns - player.gkOuts,
  function playerGameTime(playerId, start, gkStarter, minute) {
    const ins = subs.filter((sub) => sub.subIn === playerId);
    const outs = subs.filter((sub) => sub.subOut === playerId);
    const countIns = ins.length;
    const countOuts = outs.length;
    const sumIns = ins.reduce((acc, cur) => (acc += cur.gameMinute), 0);
    const sumOuts = outs.reduce((acc, cur) => (acc += cur.gameMinute), 0);
    start = start ? 1 : 0;
    const time = convertSecondsToMinutesSeconds(
      minute * (start + countIns - countOuts) + sumOuts - sumIns
    );
    const status = start + countIns - countOuts;
    gkStarter = gkStarter ? 1 : 0;
    const gkIns = ins.filter((sub) => sub.gkSub);
    const gkOuts = outs.filter((sub) => sub.gkSub);
    const gkCountIns = gkIns.length;
    const gkCountOuts = gkOuts.length;
    const gkSumIns = ins.reduce((acc, cur) => (acc += cur.gameMinute), 0);
    const gkSumOuts = outs.reduce((acc, cur) => (acc += cur.gameMinute), 0);
    const gkTime = convertSecondsToMinutesSeconds(
      minute * (gkStarter + gkCountIns - gkCountOuts) + gkSumOuts - gkSumIns
    );
    const gkStatus = gkStarter + gkCountIns - gkCountOuts;

    return { start, status, time, gkStarter, gkStatus, gkTime };
  }
  return (
    <>
      <Heading as="h5" case="upper" location="center">
        {errorModal && <ModalError onConfirm={() => setErrorModal(false)} />}
        <Modal>
          <Modal.Open opens="gameSettings">
            <Button type="selected" variation="primary">
              GAME SETTINGS
            </Button>
          </Modal.Open>

          <Modal.Window name="gameSettings">
            <GameSettings
              game={game}
              editGame={editGame}
              isEditingGame={isEditingGame}
              playerGames={playerGames}
              expand={true}
            />
          </Modal.Window>
        </Modal>
      </Heading>
      <Container>
        <MainGrid>
          {periods
            .sort((a, b) => a.period - b.period)
            .map((period) =>
              columnArray.map((column) => (
                <Column key={`${column.name}`}>
                  {period.period === 1 && (
                    <Heading
                      as="h5"
                      location="center"
                      style={{
                        position: 'sticky',
                        backgroundColor: 'var(--color-grey-0)',
                        top: 0,
                      }}
                    >
                      {column.name}
                    </Heading>
                  )}
                  <StyledTable tabIndex="0">
                    <thead>
                      <tr>
                        {column.headers.map((head) => (
                          <th
                            key={`${column.name}-${head}`}
                            style={{ top: period.period === 1 ? '2.65rem' : 0 }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {column.rows
                        .filter((row) => row.period === period.id)
                        .map((row, index) => (
                          <tr key={`${column.name}-row-${row.id}`} id={row.id}>
                            {row.fields.map((field, i) => (
                              <GameStatsEditRow
                                field={field}
                                key={`${column.name}-row-${row.id}-${i}`}
                                onChange={changeHandler}
                              />
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </StyledTable>
                </Column>
              ))
            )}
        </MainGrid>
        <SidePanel>
          <Column>
            <CurrentGK inGamePlayers={inGamePlayers} />
          </Column>
          <Column>
            <PlayerGameTimes
              inGamePlayers={inGamePlayers.filter(
                (player) =>
                  player.subDetails.status === 1 &&
                  player.subDetails.gkStatus !== 1
              )}
            />
          </Column>
          <Column>
            <PlayerGameTimes
              inGamePlayers={inGamePlayers.filter(
                (player) => player.subDetails.status === 0
              )}
              heading="Reserve Players "
            />
          </Column>
        </SidePanel>
      </Container>
    </>
  );
}

export default GameStatsEdit;
