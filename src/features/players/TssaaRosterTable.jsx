import styled from 'styled-components';

import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Heading from '../../ui/Heading';

import TssaaTableRow from './TssaaTableRow';

import { useSeason } from '../seasons/useSeasons';
import { usePlayerSeasons } from './usePlayerSeasons';

const Center = styled.div`
  text-align: center;
  width: 100%;
  border: 1px solid;
  font-size: 1rem;
  height: 100%;
`;
const Container = styled.div`
  @media screen {
    margin: 0;
    padding: 1rem;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);
    max-height: 95dvh;
    overflow: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
`;

function TssaaRosterTable() {
  const { isLoadingSeason, season } = useSeason();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();

  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  if (!season)
    return (
      <Container>
        <Empty resource="Season" />
      </Container>
    );
  if (!playerSeasons.length)
    return (
      <Container>
        <Empty resource="Players" />
      </Container>
    );

  const tssaaRoster = playerSeasons
    .filter((player) => player.status === 'Rostered')
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
    <Container>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>Soccer Season{' '}
        {season.season}
      </Heading>
      <Heading as="h3" location="center">
        TSSAA Roster
      </Heading>
      <Table columns="4fr 1.9fr 1.05fr 1.05fr 1.05fr 1fr 1fr 1fr ">
        <Table.PrintHeaderBorder>
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
            (player) => player.players.entryYear !== season.season
          )}
          render={(player) => <TssaaTableRow player={player} key={player.id} />}
        />
      </Table>
      <Table columns=" 4fr 1.9fr 1.05fr 1.05fr 1.05fr 1fr 1fr 1fr ">
        <Table.PrintHeaderBorder>
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
            (player) => player.players.entryYear === season.season
          )}
          render={(player) => <TssaaTableRow player={player} key={player.id} />}
        />
      </Table>
    </Container>
  );
}

export default TssaaRosterTable;
