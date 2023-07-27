import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import TssaaTableRow from './TssaaTableRow';
import { useSeason } from '../seasons/useSeasons';

import { usePlayerSeasons } from './usePlayerSeasons';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';

import { useSearchParams } from 'react-router-dom';
import Heading from '../../ui/Heading';

const Right = styled.div`
  text-align: right;
`;
const Center = styled.div`
  text-align: center;
  width: 100%;
  border: 1px solid;
`;

function TssaaRosterTable() {
  const [searchParams] = useSearchParams();
  const season = searchParams.get('season');
  const { isLoadingSeason, season: seasonApi } = useSeason(season);

  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();

  if (!season) return <div>Sorry You Must Have A Season Selected</div>;
  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  if (!playerSeasons.length) return <Empty resource="Games" />;

  const tssaaRoster = playerSeasons
    .filter(
      (player) => +player.seasonId === +season && player.status === 'Rostered'
    )
    .sort((a, b) => {
      const aa = a.players.people.firstName.toLowerCase();
      const bb = b.players.people.firstName.toLowerCase();
      if (aa < bb) {
        return -1;
      }
      if (aa > bb) {
        return 1;
      }
      return 0;
    })
    .sort((a, b) => {
      const aa = a.players.people.lastName.toLowerCase();
      const bb = b.players.people.lastName.toLowerCase();
      if (aa < bb) {
        return -1;
      }
      if (aa > bb) {
        return 1;
      }
      return 0;
    });

  return (
    <>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>Soccer Season{' '}
        {seasonApi.season}
      </Heading>
      <Heading as="h3">TSSAA Roster</Heading>
      <Table columns=".25fr 4fr 2fr 1fr 1fr 1fr 1fr 1fr 1px">
        <Table.PrintHeaderBorder>
          <div></div>
          <Center>Player Name</Center>
          <Center>Date of Birth</Center>
          <Center>Year Entered 9th</Center>
          <Center>Credits Required Graduation</Center>
          <Center>Credits Earned Prev. Year</Center>
          <Center>No. 5</Center>
          <Center>No. 6</Center>
          <Center>No. 7</Center>
        </Table.PrintHeaderBorder>
        <Table.Body
          data={tssaaRoster.filter(
            (player) => player.players.entryYear == seasonApi.season
          )}
          render={(player) => <TssaaTableRow player={player} key={player.id} />}
        />
      </Table>
      <Table columns=".25fr 4fr 2fr 1fr 1fr 1fr 1fr 1fr 1px">
        <Table.PrintHeaderBorder>
          <div></div>
          <Center>Player Name</Center>
          <Center>Date of Birth</Center>
          <Center>Year Entered 9th</Center>
          <Center>Credits Required Graduation</Center>
          <Center>Credits Earned Prev. Year</Center>
          <Center>No. 5</Center>
          <Center>No. 6</Center>
          <Center>No. 7</Center>
        </Table.PrintHeaderBorder>
        <Table.Body
          data={tssaaRoster.filter(
            (player) => player.players.entryYear !== seasonApi.season
          )}
          render={(player) => <TssaaTableRow player={player} key={player.id} />}
        />
      </Table>
    </>
  );
}

export default TssaaRosterTable;
