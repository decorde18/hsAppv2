import styled from 'styled-components';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useSeason } from '../seasons/useSeasons';
import { useData } from '../../services/useUniversal';

import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import Heading from '../../ui/Heading';

import PublicPlayerRow from './PublicPlayerRow';

const Right = styled.div`
  text-align: right;
`;
const Center = styled.div`
  text-align: center;
  width: 100%;
`;
const Section = styled.div`
  display: flex;
  padding-bottom: 2.5rem;
  justify-content: center;
  gap: 0.25rem;
  flex-basis: auto;
`;
const Sec = styled.div`
  padding: 1rem 1rem 1rem 5rem;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 2rem;
`;
const Vertical = styled.div`
  display: flex;
  flex-direction: column;
`;
const People = styled.div`
  font-size: 1.3rem;
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

function PublicPlayerTable() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeason, season } = useSeason();

  const playerSeasons = useData({
    table: 'playerSeasons',
    filter: [
      { field: 'seasonId', value: currentSeason, table: 'playerSeasons' },
      { field: 'status', value: 'Rostered', table: 'playerSeasons' },
    ],
    // sort: sort.playerSeasons,
  });
  const playerUniforms = useData({
    table: 'uniformSeasonPlayers',
    filter: [{ field: 'season', value: currentSeason }],
    // sort: sort.playerSeasons,
  });

  if (!currentSeason) return <div>Sorry You Must Have A Season Selected</div>;
  if (isLoadingSeason || playerSeasons.isLoading || playerUniforms.isLoading)
    return <Spinner />;
  if (!playerSeasons.data.length)
    return (
      <Container>
        <Empty resource="Players" />
      </Container>
    );

  const orderedRoster = playerSeasons.data.sort((a, b) => a.number - b.number);
  const positions = ['field', 'GK'];
  const teams = ['Varsity', 'JV'];
  const fieldJerseys = playerUniforms.data.filter(
    (uniform) => uniform.type === 'Jersey'
  );
  const gkJerseys = playerUniforms.data.filter(
    (uniform) => uniform.type === 'GK Jersey'
  );
  console.log(fieldJerseys);
  return (
    <Container>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>
        {`Soccer Season ${season.season}`}
      </Heading>
      <Section>
        {teams.map((team) => (
          <Vertical key={team}>
            {positions.map((position) => (
              <div key={`${team}-${position}`}>
                {position === 'GK' ? (
                  <Heading as="h3" location="center">{`GK`}</Heading>
                ) : (
                  <Heading
                    as="h3"
                    location="center"
                  >{`${team} Roster`}</Heading>
                )}
                <Table columns=".25fr .5fr 2fr .5fr .75fr">
                  <Table.PrintHeader>
                    <div></div>
                    <Right>#</Right>
                    <Center>Player Name</Center>
                    <Center>Grade</Center>
                    {position !== 'GK' && <Center>Pos</Center>}
                  </Table.PrintHeader>
                  <Table.Body
                    data={orderedRoster
                      .filter((player) => player.teamLevel?.includes(team))
                      .filter((player) =>
                        position === 'GK' ? player.gknumber : player
                      )}
                    render={(player) => (
                      <PublicPlayerRow
                        player={player}
                        position={position}
                        key={`${team}-${position}-${player.id}`}
                      />
                    )}
                  />
                </Table>
              </div>
            ))}
          </Vertical>
        ))}
      </Section>
      <Sec>
        <Vertical>
          <Heading as="h3">Team Personnel</Heading>
          <People>
            <strong>Head Coach:</strong>
            <span>
              {' '}
              {`${season.people?.firstName} ${season.people?.lastName}`}
            </span>
          </People>
          <People>
            <strong>Assistant Coaches:</strong>
            <span> {season?.assistant_coaches}</span>
          </People>
          {season?.manager ? (
            <People>
              <strong>Managers:</strong>
              <span> {season?.manager}</span>
            </People>
          ) : (
            <div></div>
          )}
          <People>
            <strong>Trainer:</strong>
            <span> {season?.trainer}</span>
          </People>
        </Vertical>
        <Vertical>
          <Heading as="h3">Administration</Heading>
          <People>
            <strong>Principal:</strong>
            <span> {season?.principal}</span>
          </People>
          <People>
            <strong>Assistant Principals:</strong>
            <span> {season?.assistantPrincipals}</span>
          </People>
          <People>
            <strong>Athletic Director:</strong>
            <span> {season?.athleticDirector}</span>
          </People>
        </Vertical>
      </Sec>
    </Container>
  );
}

export default PublicPlayerTable;
