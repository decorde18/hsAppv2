import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import CommunicationRow from './CommunicationRow';

import { usePlayerSeasons, usePlayers } from '../players/usePlayers';

import { useState } from 'react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import { useGetPlayerParents } from '../parents/useParents';
import { useSearchParams } from 'react-router-dom';

function CommunicationTable() {
  const [searchParams] = useSearchParams();
  const season = +searchParams.get('season');
  const { isLoadingPlayerParents, playerParents } = useGetPlayerParents();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();

  const [allPlayersChecked, setAllPlayersChecked] = useState(false);
  const [allParentsChecked, setAllParentsChecked] = useState(false);

  if (isLoadingPlayerParents || isLoadingPlayerSeasons) return <Spinner />;
  if (!playerParents.length) return <Empty resource="Player Parents" />;

  const filteredBySeason = playerSeasons.filter(
    (seas) => seas.seasonId === season
  );
  function handleAllPlayerChecked(e) {
    setAllPlayersChecked(e.target.checked);
  }
  function handleAllParentsChecked(e) {
    setAllParentsChecked(e.target.checked);
  }
  return (
    <>
      <Menus>
        <Table columns={'0.2fr 2fr .25fr 1fr 1fr .25fr 3fr .2fr;'}>
          <Table.Header>
            <>
              <div></div>
              <div>
                <input type="checkbox" onChange={handleAllPlayerChecked} />
                <span>Player</span>
              </div>
              <div>Grade</div>
              <div>Status</div>
              <div>Team</div>
              <div>Returner</div>
              <div>
                <input type="checkbox" onChange={handleAllParentsChecked} />
                <span>Parents</span>
              </div>
              <div></div>
            </>
          </Table.Header>
          <Table.Body
            data={filteredBySeason}
            render={(player) => (
              <CommunicationRow
                player={{ player, allPlayersChecked }}
                parents={{
                  parent: playerParents.filter(
                    (play) => play.player === player.playerId
                  ),
                  allParentsChecked,
                }}
                key={player.id}
              />
            )}
          />
        </Table>
      </Menus>
    </>
  );
}

export default CommunicationTable;
